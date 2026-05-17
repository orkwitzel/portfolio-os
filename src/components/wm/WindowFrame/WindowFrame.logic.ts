import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import type { NormalGeometry, WindowRecord } from '@/store/session/sessionTypes'
import { useWindowManager, type WindowManagerApi } from '@/hooks/useWindowManager'
import {
  beginWindowPointerInteraction,
  endWindowPointerInteraction,
} from '@/utils/windowInteraction'
import {
  WINDOW_ANIM_MS,
  closeTarget,
  minimizeTarget,
  type WindowChromeTransition,
  type WindowTransition,
} from '@/utils/windowFrameAnimation'
import {
  clampWindowPosition,
  clampWindowSize,
  readWorkspaceFrame,
} from '@/utils/workspaceFrame'

export type ResizeEdge = 'se' | 'e' | 's'

type ResizeSession = {
  sx: number
  sy: number
  ow: number
  oh: number
  edge: ResizeEdge
}

function geometryForRecord(win: WindowRecord): NormalGeometry {
  if (win.geometry.mode === 'normal') return win.geometry.geometry
  if (win.geometry.mode === 'maximized') return win.geometry.frame
  return win.geometry.restored
}

export function useWindowFrame(win: WindowRecord) {
  const wm = useWindowManager()
  const wmRef = useRef<WindowManagerApi>(wm)

  useLayoutEffect(() => {
    wmRef.current = wm
  }, [wm])

  const focused = wm.session.focusedWindowId === win.id
  const dragRef = useRef<null | { sx: number; sy: number; ox: number; oy: number }>(null)
  const resizeRef = useRef<null | ResizeSession>(null)
  const prevModeRef = useRef(win.geometry.mode)
  const transitionRef = useRef<WindowTransition | null>(null)

  const minimized = win.geometry.mode === 'minimized'
  const maximized = win.geometry.mode === 'maximized'
  const sessionRect = geometryForRecord(win)

  const [transition, setTransition] = useState<WindowTransition | null>(null)
  const [visualRect, setVisualRect] = useState<NormalGeometry>(sessionRect)
  const [visualOpacity, setVisualOpacity] = useState(1)
  const [animating, setAnimating] = useState(false)

  const runTransition = useCallback(
    (kind: WindowChromeTransition, from: NormalGeometry, to: NormalGeometry) => {
      if (transitionRef.current) return false
      const next: WindowTransition = { kind, from, to }
      transitionRef.current = next
      setTransition(next)
      setVisualRect(from)
      setVisualOpacity(kind === 'close' ? 1 : 1)
      setAnimating(false)
      return true
    },
    [],
  )

  // Two-frame FLIP: paint `from`, then transition to `to`.
  useLayoutEffect(() => {
    if (!transition) return
    const id = requestAnimationFrame(() => {
      setVisualRect(transition.to)
      setVisualOpacity(transition.kind === 'close' ? 0 : 1)
      setAnimating(true)
    })
    return () => cancelAnimationFrame(id)
  }, [transition])

  // Sync visual rect when session geometry changes without an active transition.
  useLayoutEffect(() => {
    if (transitionRef.current) return
    setVisualRect(sessionRect)
    setVisualOpacity(1)
    setAnimating(false)
  }, [sessionRect])

  const finishTransition = useCallback(() => {
    const t = transitionRef.current
    if (!t) return

    transitionRef.current = null
    setTransition(null)
    setAnimating(false)

    const api = wmRef.current
    switch (t.kind) {
      case 'minimize':
        api.minimizeWindow(win.id)
        break
      case 'maximize':
      case 'fullscreen':
        api.maximizeWindow(win.id, t.to)
        break
      case 'restore':
        if (win.geometry.mode === 'maximized') {
          api.unmaximizeWindow(win.id)
        }
        break
      case 'close':
        api.closeWindow(win.id)
        break
      default:
        break
    }
  }, [win.id, win.geometry.mode])

  // Restore-from-taskbar enter animation.
  useLayoutEffect(() => {
    const prev = prevModeRef.current
    prevModeRef.current = win.geometry.mode
    if (transitionRef.current) return
    if (prev !== 'minimized' || win.geometry.mode !== 'normal') return

    const to = win.geometry.geometry
    const from = minimizeTarget(wm.workspaceRef.current, to)
    runTransition('restore', from, to)
  }, [win.geometry.mode, win.geometry, wm.workspaceRef, runTransition])

  useLayoutEffect(() => {
    if (!transition) return
    const timer = window.setTimeout(() => finishTransition(), WINDOW_ANIM_MS + 80)
    return () => window.clearTimeout(timer)
  }, [transition, finishTransition])

  const onTransitionEnd = useCallback(
    (e: React.TransitionEvent) => {
      if (e.target !== e.currentTarget) return
      if (!transitionRef.current) return
      finishTransition()
    },
    [finishTransition],
  )

  const toggleMaximize = useCallback(() => {
    const frame = readWorkspaceFrame(wm.workspaceRef.current)
    if (!frame) return

    if (maximized) {
      const from = sessionRect
      const to = win.geometry.mode === 'maximized' ? win.geometry.restored : from
      if (!runTransition('restore', from, to)) return
      return
    }

    const from = sessionRect
    if (!runTransition('fullscreen', from, frame)) return
  }, [maximized, runTransition, sessionRect, win.geometry, wm.workspaceRef])

  const requestMinimize = useCallback(() => {
    if (minimized) return
    const from = sessionRect
    const to = minimizeTarget(wm.workspaceRef.current, from)
    if (!runTransition('minimize', from, to)) return
  }, [minimized, runTransition, sessionRect, wm.workspaceRef])

  const requestClose = useCallback(() => {
    const from = sessionRect
    const to = closeTarget(from)
    if (!runTransition('close', from, to)) return
  }, [runTransition, sessionRect])

  const attachPointerListeners = (target: HTMLElement, pointerId: number) => {
    const windowId = win.id
    beginWindowPointerInteraction()

    const onMove = (e: PointerEvent) => {
      const drag = dragRef.current
      const resize = resizeRef.current
      const workspace = wmRef.current.workspaceRef.current

      const live = wmRef.current.session.windows[windowId]
      if (!live || live.geometry.mode !== 'normal') return

      const g = live.geometry.geometry

      if (drag) {
        const dx = e.clientX - drag.sx
        const dy = e.clientY - drag.sy
        const next = clampWindowPosition(workspace, {
          ...g,
          x: drag.ox + dx,
          y: drag.oy + dy,
        })
        wmRef.current.moveWindow(windowId, next.x, next.y)
      }

      if (resize) {
        const dx = e.clientX - resize.sx
        const dy = e.clientY - resize.sy
        const nextWidth =
          resize.edge === 'e' || resize.edge === 'se' ? resize.ow + dx : g.width
        const nextHeight =
          resize.edge === 's' || resize.edge === 'se' ? resize.oh + dy : g.height
        const next = clampWindowSize(workspace, {
          ...g,
          width: nextWidth,
          height: nextHeight,
        })
        wmRef.current.resizeWindow(windowId, next.width, next.height)
      }
    }

    const onUp = () => {
      dragRef.current = null
      resizeRef.current = null
      endWindowPointerInteraction()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      if (target.hasPointerCapture(pointerId)) {
        target.releasePointerCapture(pointerId)
      }
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  const onTitlePointerDown = (e: React.PointerEvent) => {
    if (transitionRef.current) return
    if (maximized) return
    if ((e.target as HTMLElement).closest('button')) return

    e.stopPropagation()
    wm.focusWindow(win.id)

    if (win.geometry.mode !== 'normal') return

    const g = win.geometry.geometry
    dragRef.current = { sx: e.clientX, sy: e.clientY, ox: g.x, oy: g.y }
    const target = e.currentTarget as HTMLElement
    target.setPointerCapture(e.pointerId)
    attachPointerListeners(target, e.pointerId)
    e.preventDefault()
  }

  const onResizePointerDown = (edge: ResizeEdge) => (e: React.PointerEvent) => {
    if (transitionRef.current) return
    if (win.geometry.mode !== 'normal') return
    e.stopPropagation()
    wm.focusWindow(win.id)
    const g = win.geometry.geometry
    resizeRef.current = { sx: e.clientX, sy: e.clientY, ow: g.width, oh: g.height, edge }
    const target = e.currentTarget as HTMLElement
    target.setPointerCapture(e.pointerId)
    attachPointerListeners(target, e.pointerId)
    e.preventDefault()
  }

  const onTitleDoubleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return
    toggleMaximize()
  }

  const onWindowPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation()
  }

  const def = wm.registry.get(win.appId)
  const Root = def?.Root

  const hidden = minimized && !transition
  const displayRect = transition ? visualRect : sessionRect

  return {
    wm,
    focused,
    minimized,
    hidden,
    rect: displayRect,
    visualOpacity,
    animating,
    maximized,
    Root,
    onTitlePointerDown,
    onResizePointerDown,
    onTitleDoubleClick,
    onWindowPointerDown,
    onTransitionEnd,
    toggleMaximize,
    requestMinimize,
    requestClose,
  }
}
