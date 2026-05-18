import type { ComponentType, LazyExoticComponent } from 'react'
import type { IconSource } from '@/components/shell/ShellIcon'

export type WindowId = string

export type NormalGeometry = {
  x: number
  y: number
  width: number
  height: number
}

export type WindowGeometryState =
  | { mode: 'normal'; geometry: NormalGeometry }
  | { mode: 'maximized'; restored: NormalGeometry; frame: NormalGeometry }
  | { mode: 'minimized'; restored: NormalGeometry }

export type WindowLaunch = {
  path: string
}

export type WindowRecord = {
  id: WindowId
  appId: string
  title: string
  geometry: WindowGeometryState
  zIndex: number
  launch?: WindowLaunch
}

export type DesktopSession = {
  windows: Record<WindowId, WindowRecord>
  /** Opening order; taskbar uses this for stable ordering */
  order: WindowId[]
  focusedWindowId: WindowId | null
  nextZ: number
}

export type AppProps = {
  windowId: WindowId
  launch?: WindowLaunch
}

export type AppModule = { default: ComponentType<AppProps> }

export type AppDefinition = {
  id: string
  defaultTitle: string
  defaultBounds: { width: number; height: number }
  loader: () => Promise<AppModule>
  Root: LazyExoticComponent<ComponentType<AppProps>>
  icon?: IconSource
}

export type WMAction =
  | { type: 'OPEN_WINDOW'; window: WindowRecord }
  | { type: 'CLOSE_WINDOW'; windowId: WindowId }
  | { type: 'FOCUS_WINDOW'; windowId: WindowId }
  | { type: 'MINIMIZE_WINDOW'; windowId: WindowId }
  | { type: 'RESTORE_WINDOW'; windowId: WindowId }
  | { type: 'TOGGLE_MINIMIZE'; windowId: WindowId }
  | { type: 'MOVE_WINDOW'; windowId: WindowId; x: number; y: number }
  | { type: 'RESIZE_WINDOW'; windowId: WindowId; width: number; height: number }
  | {
      type: 'MAXIMIZE_WINDOW'
      windowId: WindowId
      frame: NormalGeometry
    }
  | { type: 'UNMAXIMIZE_WINDOW'; windowId: WindowId }
