import { useCallback, useEffect, useLayoutEffect, useReducer, useRef, type RefObject } from 'react'
import { useFsStore } from '../fs/fsStore'
import { ShellIcon } from './icons/ShellIcon'
import type { ShellLaunchItem } from './shellCatalog'
import { buildDesktopItems } from './shellCatalog'
import { WindowLayer } from '../wm/WindowLayer'
import {
  gridToPx,
  snapPosition,
  clampToWorkspace,
  getWorkspaceBounds,
  resolveDropCollisions,
  type PixelRect,
} from './desktopLayout'
import {
  clearSelection,
  selectOne,
  toggleWithCtrl,
  selectRange,
  selectFromMarquee,
  selectAll,
  sortedItemIds,
  type DesktopItem,
  type DesktopSelectionState,
} from './desktopSelection'
import styles from './Desktop.module.css'

// ─── Types ───────────────────────────────────────────────────────────────────

type DesktopShortcut = Extract<ShellLaunchItem, { kind: 'desktop' }>

type MarqueeState = {
  startClient: { x: number; y: number }
  currentClient: { x: number; y: number }
  /**
   * Cached workspace-element origin at marquee start.
   * Stored here so rendering can compute CSS coords without touching workspaceRef.
   */
  workspaceOrigin: { left: number; top: number }
  addMode: boolean
}

type DragState = {
  /** Client coords where drag started */
  startClient: { x: number; y: number }
  /** Original grid positions of ALL selected icons at drag start */
  origins: Map<string, { gridX: number; gridY: number }>
  /** The icon whose cell is used as the drag reference (the one the user grabbed) */
  pivotId: string
  /** Current ghost grid position of the pivot icon */
  ghostGrid: { gridX: number; gridY: number }
  /** Whether we've crossed the movement threshold */
  active: boolean
}

type DesktopState = {
  items: DesktopShortcut[]
  selection: DesktopSelectionState
  drag: DragState | null
  marquee: MarqueeState | null
}

type DesktopAction =
  | { type: 'SET_ITEMS'; items: DesktopShortcut[] }
  | { type: 'SELECT_ONE'; id: string }
  | { type: 'SELECT_CTRL'; id: string }
  | { type: 'SELECT_SHIFT'; id: string }
  | { type: 'SELECT_ALL' }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'SELECT_MARQUEE'; marquee: PixelRect }
  | { type: 'SELECT_MARQUEE_ADD'; marquee: PixelRect }
  | { type: 'MARQUEE_START'; client: { x: number; y: number }; workspaceOrigin: { left: number; top: number }; addMode: boolean }
  | { type: 'MARQUEE_UPDATE'; client: { x: number; y: number } }
  | { type: 'MARQUEE_END' }
  | { type: 'DRAG_START'; pivotId: string; startClient: { x: number; y: number } }
  | { type: 'DRAG_MOVE'; ghostGrid: { gridX: number; gridY: number } }
  | { type: 'DRAG_END' }
  | { type: 'APPLY_DROP'; updates: Map<string, { gridX: number; gridY: number }> }

function toDesktopItems(items: DesktopShortcut[]): DesktopItem[] {
  return items.map((i) => ({ id: i.id, gridX: i.gridX, gridY: i.gridY, label: i.label }))
}

function desktopReducer(state: DesktopState, action: DesktopAction): DesktopState {
  switch (action.type) {
    case 'SET_ITEMS':
      return { ...state, items: action.items }

    case 'SELECT_ONE':
      return { ...state, selection: selectOne(action.id) }

    case 'SELECT_CTRL':
      return { ...state, selection: toggleWithCtrl(action.id, state.selection) }

    case 'SELECT_SHIFT': {
      const ordered = sortedItemIds(toDesktopItems(state.items))
      return { ...state, selection: selectRange(state.selection.anchorId, action.id, ordered) }
    }

    case 'SELECT_ALL':
      return { ...state, selection: selectAll(toDesktopItems(state.items)) }

    case 'CLEAR_SELECTION':
      return { ...state, selection: clearSelection() }

    case 'SELECT_MARQUEE':
      return {
        ...state,
        selection: selectFromMarquee(action.marquee, toDesktopItems(state.items), state.selection, 'replace'),
        marquee: null,
      }

    case 'SELECT_MARQUEE_ADD':
      return {
        ...state,
        selection: selectFromMarquee(action.marquee, toDesktopItems(state.items), state.selection, 'add'),
        marquee: null,
      }

    case 'MARQUEE_START':
      return {
        ...state,
        marquee: {
          startClient: action.client,
          currentClient: action.client,
          workspaceOrigin: action.workspaceOrigin,
          addMode: action.addMode,
        },
      }

    case 'MARQUEE_UPDATE':
      if (!state.marquee) return state
      return { ...state, marquee: { ...state.marquee, currentClient: action.client } }

    case 'MARQUEE_END':
      return { ...state, marquee: null }

    case 'DRAG_START': {
      const origins = new Map<string, { gridX: number; gridY: number }>()
      const sel = state.selection.selectedIds
      for (const item of state.items) {
        if (sel.has(item.id)) {
          origins.set(item.id, { gridX: item.gridX, gridY: item.gridY })
        }
      }
      const pivot = state.items.find((i) => i.id === action.pivotId)
      const ghostGrid = pivot ? { gridX: pivot.gridX, gridY: pivot.gridY } : { gridX: 0, gridY: 0 }
      return {
        ...state,
        drag: {
          startClient: action.startClient,
          origins,
          pivotId: action.pivotId,
          ghostGrid,
          active: false,
        },
      }
    }

    case 'DRAG_MOVE':
      if (!state.drag) return state
      return { ...state, drag: { ...state.drag, ghostGrid: action.ghostGrid, active: true } }

    case 'DRAG_END':
      return { ...state, drag: null }

    case 'APPLY_DROP': {
      const updated = state.items.map((item) => {
        const pos = action.updates.get(item.id)
        return pos ? { ...item, gridX: pos.gridX, gridY: pos.gridY } : item
      })
      return { ...state, items: updated, drag: null }
    }

    default:
      return state
  }
}

const DRAG_THRESHOLD = 4

// ─── DragGhosts ──────────────────────────────────────────────────────────────

function DragGhosts({ drag, items }: { drag: DragState; items: DesktopShortcut[] }) {
  const pivotOrigin = drag.origins.get(drag.pivotId)
  if (!pivotOrigin) return null

  const dCol = drag.ghostGrid.gridX - pivotOrigin.gridX
  const dRow = drag.ghostGrid.gridY - pivotOrigin.gridY

  return Array.from(drag.origins.entries()).map(([itemId, origin]) => {
    const item = items.find((i) => i.id === itemId)
    if (!item) return null
    const { left, top } = gridToPx(origin.gridX + dCol, origin.gridY + dRow)
    return (
      <div key={`ghost-${itemId}`} className={styles.shortcutGhost} style={{ left, top }}>
        <ShellIcon source={item.icon} size="desktop" />
        <span className={styles.shortcutLabel}>{item.label}</span>
      </div>
    )
  })
}

// ─── DesktopShortcutView ─────────────────────────────────────────────────────

function DesktopShortcutView({
  item,
  selected,
  dragging,
  onPointerDown,
  onDoubleClick,
}: {
  item: DesktopShortcut
  selected: boolean
  dragging: boolean
  onPointerDown: (e: React.PointerEvent, id: string) => void
  onDoubleClick: (id: string) => void
}) {
  const { left, top } = gridToPx(item.gridX, item.gridY)

  return (
    <button
      type="button"
      className={[
        styles.shortcut,
        selected ? styles.shortcutSelected : '',
        dragging ? styles.shortcutDragging : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ left, top, zIndex: dragging ? 10 : undefined }}
      aria-selected={selected}
      onPointerDown={(e) => onPointerDown(e, item.id)}
      onDoubleClick={() => onDoubleClick(item.id)}
    >
      <ShellIcon source={item.icon} size="desktop" />
      <span className={styles.shortcutLabel}>{item.label}</span>
    </button>
  )
}

// ─── Desktop ─────────────────────────────────────────────────────────────────

type DesktopProps = {
  workspaceRef: RefObject<HTMLDivElement | null>
  /** Register a callback that the parent can call to open the primary selection. */
  onOpenPrimary?: (fn: () => void) => void
  /** Register a callback that the parent can call to clear selection. */
  onRegisterClearSelection?: (fn: () => void) => void
  onSelectionChange?: (state: DesktopSelectionState) => void
}

export function Desktop({ workspaceRef, onOpenPrimary, onRegisterClearSelection, onSelectionChange }: DesktopProps) {
  const ready = useFsStore((s) => s.ready)
  const listDesktopEntries = useFsStore((s) => s.listDesktopEntries)
  const openPath = useFsStore((s) => s.openPath)
  const resolveDesktopIcon = useFsStore((s) => s.resolveDesktopIcon)
  const saveDesktopPositions = useFsStore((s) => s.saveDesktopPositions)

  const [state, dispatch] = useReducer(desktopReducer, {
    items: [],
    selection: clearSelection(),
    drag: null,
    marquee: null,
  })

  // Keep a ref so pointer handlers always see latest state without stale closure.
  const stateRef = useRef(state)
  useLayoutEffect(() => {
    stateRef.current = state
  })

  // Expose selection to parent (for keyboard integration).
  useEffect(() => {
    onSelectionChange?.(state.selection)
  }, [state.selection, onSelectionChange])

  // Load desktop entries from FS.
  useEffect(() => {
    if (!ready) return
    let cancelled = false
    ;(async () => {
      const entries = await listDesktopEntries()
      const built = await buildDesktopItems(entries, openPath, resolveDesktopIcon)
      if (!cancelled) {
        dispatch({
          type: 'SET_ITEMS',
          items: built.filter((i): i is DesktopShortcut => i.kind === 'desktop'),
        })
      }
    })()
    return () => { cancelled = true }
  }, [ready, listDesktopEntries, openPath, resolveDesktopIcon])

  // ─── Marquee pointer listeners (attached to document while marquee active) ──

  const pointerMoveHandlerRef = useRef<((e: PointerEvent) => void) | null>(null)
  const pointerUpHandlerRef = useRef<((e: PointerEvent) => void) | null>(null)

  const detachListeners = useCallback(() => {
    if (pointerMoveHandlerRef.current) {
      window.removeEventListener('pointermove', pointerMoveHandlerRef.current)
      pointerMoveHandlerRef.current = null
    }
    if (pointerUpHandlerRef.current) {
      window.removeEventListener('pointerup', pointerUpHandlerRef.current)
      pointerUpHandlerRef.current = null
    }
  }, [])

  // ─── Icon drag ───────────────────────────────────────────────────────────────

  const handleIconPointerDown = useCallback(
    (e: React.PointerEvent, id: string) => {
      e.stopPropagation() // don't bubble to workspace (which starts marquee)

      const current = stateRef.current
      const item = current.items.find((i) => i.id === id)
      if (!item) return

      // Selection on pointerdown.
      if (e.ctrlKey || e.metaKey) {
        dispatch({ type: 'SELECT_CTRL', id })
      } else if (e.shiftKey) {
        dispatch({ type: 'SELECT_SHIFT', id })
      } else if (!current.selection.selectedIds.has(id)) {
        // Plain click on unselected icon: select it alone immediately.
        dispatch({ type: 'SELECT_ONE', id })
      }
      // If the icon was already selected (plain, no modifier), leave selection
      // intact so group drag works; single-click deselect others happens on pointerup
      // only if no drag occurred.

      const startClient = { x: e.clientX, y: e.clientY }

      // Only start drag tracking for plain or already-selected icon clicks.
      if (!e.shiftKey) {
        dispatch({ type: 'DRAG_START', pivotId: id, startClient })
      }

      const onMove = (ev: PointerEvent) => {
        const s = stateRef.current
        if (!s.drag) return
        const dx = ev.clientX - s.drag.startClient.x
        const dy = ev.clientY - s.drag.startClient.y
        if (!s.drag.active && Math.hypot(dx, dy) < DRAG_THRESHOLD) return
        const workspace = workspaceRef.current
        if (!workspace) return
        const newGrid = snapPosition(ev.clientX, ev.clientY, workspace)
        dispatch({ type: 'DRAG_MOVE', ghostGrid: newGrid })
      }

      const onUp = async (ev: PointerEvent) => {
        detachListeners()
        const s = stateRef.current
        if (!s.drag) return

        if (!s.drag.active) {
          // Plain click — deselect others if no modifier was held at start.
          if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
            dispatch({ type: 'SELECT_ONE', id })
          }
          dispatch({ type: 'DRAG_END' })
          return
        }

        // Drag completed — compute drop positions with collision resolution.
        const workspace = workspaceRef.current
        if (!workspace) { dispatch({ type: 'DRAG_END' }); return }

        const finalPivotGrid = snapPosition(ev.clientX, ev.clientY, workspace)
        const pivotOrigin = s.drag.origins.get(s.drag.pivotId)
        if (!pivotOrigin) { dispatch({ type: 'DRAG_END' }); return }

        const dCol = finalPivotGrid.gridX - pivotOrigin.gridX
        const dRow = finalPivotGrid.gridY - pivotOrigin.gridY
        const bounds = getWorkspaceBounds(workspace)

        // Desired target positions for every dragged icon (clamped to workspace).
        const dragTargets = new Map<string, { gridX: number; gridY: number }>()
        s.drag.origins.forEach((origin, itemId) => {
          dragTargets.set(itemId, clampToWorkspace(origin.gridX + dCol, origin.gridY + dRow, workspace))
        })

        // Resolve: dragged icons win; stationary ones in their way get pushed out.
        const updates = resolveDropCollisions(dragTargets, s.items, bounds)

        const persistUpdates = Array.from(updates.entries()).map(([desktopPath, pos]) => ({
          desktopPath,
          gridX: pos.gridX,
          gridY: pos.gridY,
        }))

        dispatch({ type: 'APPLY_DROP', updates })
        await saveDesktopPositions(persistUpdates)
      }

      pointerMoveHandlerRef.current = onMove
      pointerUpHandlerRef.current = onUp
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)

      e.preventDefault()
    },
    [workspaceRef, detachListeners, saveDesktopPositions],
  )

  const handleIconDoubleClick = useCallback(
    (id: string) => {
      const item = stateRef.current.items.find((i) => i.id === id)
      item?.launch()
    },
    [],
  )

  // ─── Workspace pointerdown (marquee) ─────────────────────────────────────────

  const handleWorkspacePointerDown = useCallback(
    (e: React.PointerEvent) => {
      // Only handle clicks directly on the workspace or shortcuts container.
      const target = e.target as HTMLElement
      if (target.closest('button')) return

      const addMode = e.ctrlKey || e.metaKey
      const startClient = { x: e.clientX, y: e.clientY }
      let marqueeStarted = false

      const onMove = (ev: PointerEvent) => {
        const dx = ev.clientX - startClient.x
        const dy = ev.clientY - startClient.y
        if (!marqueeStarted && Math.hypot(dx, dy) >= DRAG_THRESHOLD) {
          marqueeStarted = true
          const workspace = workspaceRef.current
          const wRect = workspace?.getBoundingClientRect()
          const workspaceOrigin = wRect
            ? { left: wRect.left, top: wRect.top }
            : { left: 0, top: 0 }
          dispatch({ type: 'MARQUEE_START', client: startClient, workspaceOrigin, addMode })
        }
        if (marqueeStarted) {
          dispatch({ type: 'MARQUEE_UPDATE', client: { x: ev.clientX, y: ev.clientY } })
        }
      }

      const onUp = () => {
        detachListeners()
        if (marqueeStarted) {
          const s = stateRef.current
          if (s.marquee) {
            const { startClient: sc, currentClient: cc, workspaceOrigin: wo } = s.marquee
            const mRect: PixelRect = {
              left: Math.min(sc.x, cc.x) - wo.left,
              top: Math.min(sc.y, cc.y) - wo.top,
              right: Math.max(sc.x, cc.x) - wo.left,
              bottom: Math.max(sc.y, cc.y) - wo.top,
            }
            dispatch({ type: addMode ? 'SELECT_MARQUEE_ADD' : 'SELECT_MARQUEE', marquee: mRect })
          } else {
            dispatch({ type: 'MARQUEE_END' })
          }
        } else {
          // Plain click on empty space — clear selection.
          dispatch({ type: 'CLEAR_SELECTION' })
        }
      }

      pointerMoveHandlerRef.current = onMove
      pointerUpHandlerRef.current = onUp
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)

      e.preventDefault()
    },
    [workspaceRef, detachListeners],
  )

  // ─── Keyboard (Ctrl+A) — handled locally; Enter/Escape wired via parent ─────

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        const active = document.activeElement
        if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || (active as HTMLElement).isContentEditable)) return
        // Only intercept if no window is focused above.
        dispatch({ type: 'SELECT_ALL' })
        e.preventDefault()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // ─── Expose open-primary for ShellKeyboard ────────────────────────────────

  const handleOpenPrimary = useCallback(() => {
    const s = stateRef.current
    const primaryId = s.selection.primaryId
    if (!primaryId) return
    const item = s.items.find((i) => i.id === primaryId)
    item?.launch()
  }, [])

  useEffect(() => {
    onOpenPrimary?.(handleOpenPrimary)
  }, [onOpenPrimary, handleOpenPrimary])

  const handleClearSelection = useCallback(() => {
    dispatch({ type: 'CLEAR_SELECTION' })
  }, [])

  useEffect(() => {
    onRegisterClearSelection?.(handleClearSelection)
  }, [onRegisterClearSelection, handleClearSelection])

  // ─── Compute marquee overlay rect ────────────────────────────────────────────
  // Uses the cached workspaceOrigin from MarqueeState — avoids reading workspaceRef during render.

  const marqueeStyle = state.marquee
    ? (() => {
        const { startClient: sc, currentClient: cc, workspaceOrigin: wo } = state.marquee
        const left = Math.min(sc.x, cc.x) - wo.left
        const top = Math.min(sc.y, cc.y) - wo.top
        const right = Math.max(sc.x, cc.x) - wo.left
        const bottom = Math.max(sc.y, cc.y) - wo.top
        return { left, top, width: right - left, height: bottom - top }
      })()
    : null

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div
      ref={workspaceRef}
      className={styles.workspace}
      onPointerDown={handleWorkspacePointerDown}
    >
      <div className={styles.shortcuts}>
        {state.items.map((item) => (
          <DesktopShortcutView
            key={item.id}
            item={item}
            selected={state.selection.selectedIds.has(item.id)}
            dragging={state.drag?.active === true && state.selection.selectedIds.has(item.id)}
            onPointerDown={handleIconPointerDown}
            onDoubleClick={handleIconDoubleClick}
          />
        ))}
        {state.drag?.active && <DragGhosts drag={state.drag} items={state.items} />}
      </div>
      {/* Marquee is a sibling of .shortcuts so its position is relative to .workspace. */}
      {marqueeStyle && <div className={styles.marqueeRect} style={marqueeStyle} />}
      <WindowLayer />
    </div>
  )
}
