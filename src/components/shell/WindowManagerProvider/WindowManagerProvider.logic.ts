import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
  type RefObject,
} from 'react'
import { createInitialSession, reduceSession } from '@/store/session/sessionReducer'
import type {
  AppDefinition,
  NormalGeometry,
  WindowId,
  WindowLaunch,
  WindowRecord,
} from '@/store/session/sessionTypes'
import type { WindowManagerApi } from '@/store/session/windowManagerContext'

export type WindowManagerProviderProps = {
  registry: Map<string, AppDefinition>
  workspaceRef: RefObject<HTMLElement | null>
  children: ReactNode
}

export function useWindowManagerProvider({
  registry,
  workspaceRef,
  children,
}: WindowManagerProviderProps) {
  const [session, dispatch] = useReducer(reduceSession, undefined, createInitialSession)
  const sessionRef = useRef(session)

  useLayoutEffect(() => {
    sessionRef.current = session
  }, [session])

  const openApp = useCallback(
    (appId: string, options?: { title?: string; launch?: WindowLaunch }) => {
      const def = registry.get(appId)
      if (!def) {
        console.warn(`Unknown app id: ${appId}`)
        return
      }

      const prev = sessionRef.current
      const offset = (Object.keys(prev.windows).length % 10) * 26
      const id = crypto.randomUUID()
      const nextZ = prev.nextZ + 1
      const geometry: NormalGeometry = {
        x: 52 + offset,
        y: 44 + offset,
        width: def.defaultBounds.width,
        height: def.defaultBounds.height,
      }

      const window: WindowRecord = {
        id,
        appId,
        title: options?.title ?? def.defaultTitle,
        geometry: { mode: 'normal', geometry },
        zIndex: nextZ,
        launch: options?.launch,
      }

      dispatch({ type: 'OPEN_WINDOW', window })
    },
    [registry],
  )

  const closeWindow = useCallback((windowId: WindowId) => {
    dispatch({ type: 'CLOSE_WINDOW', windowId })
  }, [])

  const focusWindow = useCallback((windowId: WindowId) => {
    dispatch({ type: 'FOCUS_WINDOW', windowId })
  }, [])

  const minimizeWindow = useCallback((windowId: WindowId) => {
    dispatch({ type: 'MINIMIZE_WINDOW', windowId })
  }, [])

  const restoreWindow = useCallback((windowId: WindowId) => {
    dispatch({ type: 'RESTORE_WINDOW', windowId })
  }, [])

  const toggleMinimize = useCallback((windowId: WindowId) => {
    dispatch({ type: 'TOGGLE_MINIMIZE', windowId })
  }, [])

  const moveWindow = useCallback((windowId: WindowId, x: number, y: number) => {
    dispatch({ type: 'MOVE_WINDOW', windowId, x, y })
  }, [])

  const resizeWindow = useCallback((windowId: WindowId, width: number, height: number) => {
    dispatch({ type: 'RESIZE_WINDOW', windowId, width, height })
  }, [])

  const maximizeWindow = useCallback((windowId: WindowId, frame: NormalGeometry) => {
    dispatch({ type: 'MAXIMIZE_WINDOW', windowId, frame })
  }, [])

  const unmaximizeWindow = useCallback((windowId: WindowId) => {
    dispatch({ type: 'UNMAXIMIZE_WINDOW', windowId })
  }, [])

  const value = useMemo(
    (): WindowManagerApi => ({
      session,
      registry,
      workspaceRef,
      dispatch,
      openApp,
      closeWindow,
      focusWindow,
      minimizeWindow,
      restoreWindow,
      toggleMinimize,
      moveWindow,
      resizeWindow,
      maximizeWindow,
      unmaximizeWindow,
    }),
    [
      session,
      registry,
      workspaceRef,
      openApp,
      closeWindow,
      focusWindow,
      minimizeWindow,
      restoreWindow,
      toggleMinimize,
      moveWindow,
      resizeWindow,
      maximizeWindow,
      unmaximizeWindow,
    ],
  )

  return { value, children }
}
