import { useLayoutEffect, useRef } from 'react'
import type { NormalGeometry, WindowRecord } from '@/store/session/sessionTypes'
import { useWindowManager, type WindowManagerApi } from '@/hooks/useWindowManager'
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

export function useWindowFrame(win: WindowRecord) {
  const wm = useWindowManager()
  const wmRef = useRef<WindowManagerApi>(wm)

  useLayoutEffect(() => {
    wmRef.current = wm
  }, [wm])

  const focused = wm.session.focusedWindowId === win.id
  const dragRef = useRef<null | { sx: number; sy: number; ox: number; oy: number }>(null)
  const resizeRef = useRef<null | ResizeSession>(null)

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

  const attachPointerListeners = (target: HTMLElement, pointerId: number) => {
    const windowId = win.id

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
    if (maximized) return
    if ((e.target as HTMLElement).closest('button')) return

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
    if (win.geometry.mode !== 'normal') return
    wm.focusWindow(win.id)
    const g = win.geometry.geometry
    resizeRef.current = { sx: e.clientX, sy: e.clientY, ow: g.width, oh: g.height, edge }
    const target = e.currentTarget as HTMLElement
    target.setPointerCapture(e.pointerId)
    attachPointerListeners(target, e.pointerId)
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
