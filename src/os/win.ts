import type { OsDeps, OsWinApi } from './types'

/** @internal Creates the {@link OsWinApi} namespace. @see OsWinApi */
export function createWinApi(deps: OsDeps): OsWinApi {
  const { wm } = deps

  return {
    openApp: (...args) => wm.openApp(...args),
    close: (windowId) => wm.closeWindow(windowId),
    focus: (windowId) => wm.focusWindow(windowId),
    minimize: (windowId) => wm.minimizeWindow(windowId),
    restore: (windowId) => wm.restoreWindow(windowId),
    toggleMinimize: (windowId) => wm.toggleMinimize(windowId),
    maximize: (windowId, frame) => wm.maximizeWindow(windowId, frame),
    unmaximize: (windowId) => wm.unmaximizeWindow(windowId),
    session: wm.session,
    registry: wm.registry,
    workspaceRef: wm.workspaceRef,
  }
}
