import { useLayoutEffect, useRef } from 'react'
import type { NormalGeometry, WindowRecord } from '@/store/session/sessionTypes'
import { useWindowManager, type WindowManagerApi } from '@/hooks/useWindowManager'

function readWorkspaceFrame(workspace: HTMLElement | null): NormalGeometry | null {
  if (!workspace) return null
  return { x: 0, y: 0, width: workspace.clientWidth, height: workspace.clientHeight }
}

export function useWindowFrame(win: WindowRecord) {
  const wm = useWindowManager()
  const wmRef = useRef<WindowManagerApi>(wm)

  useLayoutEffect(() => {
    wmRef.current = wm
  }, [wm])

  const focused = wm.session.focusedWindowId === win.id
  const dragRef = useRef<null | { sx: number; sy: number; ox: number; oy: number }>(null)
  const resizeRef = useRef<null | { sx: number; sy: number; ow: number; oh: number }>(null)

  const minimized = win.geometry.mode === 'minimized'
  const maximized = win.geometry.mode === 'maximized'
  const rect: NormalGeometry =
    win.geometry.mode === 'normal'
      ? win.geometry.geometry
      : win.geometry.mode === 'maximized'
        ? win.geometry.frame
        : win.geometry.restored

  const toggleMaximize = () => {
    const frame = readWorkspaceFrame(wm.workspaceRef.current)
    if (!frame) return
    if (maximized) wm.unmaximizeWindow(win.id)
    else wm.maximizeWindow(win.id, frame)
  }

  const attachPointerListeners = () => {
    const windowId = win.id

    const onMove = (e: PointerEvent) => {
      const drag = dragRef.current
      const resize = resizeRef.current

      const live = wmRef.current.session.windows[windowId]
      if (!live || live.geometry.mode !== 'normal') return

      if (drag) {
        const dx = e.clientX - drag.sx
        const dy = e.clientY - drag.sy
        wmRef.current.moveWindow(windowId, drag.ox + dx, drag.oy + dy)
      }

      if (resize) {
        const dx = e.clientX - resize.sx
        const dy = e.clientY - resize.sy
        wmRef.current.resizeWindow(windowId, resize.ow + dx, resize.oh + dy)
      }
    }

    const onUp = () => {
      dragRef.current = null
      resizeRef.current = null
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  const onTitlePointerDown = (e: React.PointerEvent) => {
    if (maximized) return
    if ((e.target as HTMLElement).closest('button')) return

    wm.focusWindow(win.id)

    if (win.geometry.mode !== 'normal') return

    const g = win.geometry.geometry
    dragRef.current = { sx: e.clientX, sy: e.clientY, ox: g.x, oy: g.y }
    attachPointerListeners()
    e.preventDefault()
  }

  const onResizePointerDown = (e: React.PointerEvent) => {
    if (win.geometry.mode !== 'normal') return
    wm.focusWindow(win.id)
    const g = win.geometry.geometry
    resizeRef.current = { sx: e.clientX, sy: e.clientY, ow: g.width, oh: g.height }
    attachPointerListeners()
    e.preventDefault()
    e.stopPropagation()
  }

  const onTitleDoubleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return
    toggleMaximize()
  }

  const def = wm.registry.get(win.appId)
  const Root = def?.Root

  return {
    wm,
    focused,
    minimized,
    rect,
    maximized,
    Root,
    onTitlePointerDown,
    onResizePointerDown,
    onTitleDoubleClick,
    toggleMaximize,
  }
}
