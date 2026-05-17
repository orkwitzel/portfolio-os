import { createContext, useContext } from 'react'
import type { RefObject } from 'react'
import type {
  AppDefinition,
  DesktopSession,
  NormalGeometry,
  WindowId,
  WindowLaunch,
  WMAction,
} from '@/store/session/sessionTypes'

export type WindowManagerApi = {
  session: DesktopSession
  registry: Map<string, AppDefinition>
  workspaceRef: RefObject<HTMLElement | null>
  dispatch: (action: WMAction) => void
  openApp: (
    appId: string,
    options?: {
      title?: string
      launch?: WindowLaunch
      maximize?: boolean
      center?: boolean
    },
  ) => void
  closeWindow: (windowId: WindowId) => void
  focusWindow: (windowId: WindowId) => void
  minimizeWindow: (windowId: WindowId) => void
  restoreWindow: (windowId: WindowId) => void
  toggleMinimize: (windowId: WindowId) => void
  moveWindow: (windowId: WindowId, x: number, y: number) => void
  resizeWindow: (windowId: WindowId, width: number, height: number) => void
  maximizeWindow: (windowId: WindowId, frame: NormalGeometry) => void
  unmaximizeWindow: (windowId: WindowId) => void
}

export const WindowManagerContext = createContext<WindowManagerApi | null>(null)

export function useWindowManager(): WindowManagerApi {
  const ctx = useContext(WindowManagerContext)
  if (!ctx) {
    throw new Error('useWindowManager must be used within WindowManagerProvider')
  }
  return ctx
}
