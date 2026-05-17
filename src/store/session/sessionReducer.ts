import type {
  DesktopSession,
  WindowGeometryState,
  WindowId,
  WindowRecord,
  WMAction,
} from '@/store/session/sessionTypes'

export const MIN_WINDOW_WIDTH = 200
export const MIN_WINDOW_HEIGHT = 120

export function createInitialSession(): DesktopSession {
  return {
    windows: {},
    order: [],
    focusedWindowId: null,
    nextZ: 0,
  }
}

function pickTopVisibleWindow(windows: Record<WindowId, WindowRecord>): WindowId | null {
  let best: WindowId | null = null
  let bestZ = -1
  for (const id of Object.keys(windows)) {
    const w = windows[id]
    if (w.geometry.mode === 'minimized') continue
    if (w.zIndex > bestZ) {
      bestZ = w.zIndex
      best = id
    }
  }
  return best
}

export function reduceSession(state: DesktopSession, action: WMAction): DesktopSession {
  switch (action.type) {
    case 'OPEN_WINDOW': {
      const { window } = action
      return {
        ...state,
        windows: { ...state.windows, [window.id]: window },
        order: [...state.order, window.id],
        focusedWindowId: window.id,
        nextZ: Math.max(state.nextZ, window.zIndex),
      }
    }

    case 'CLOSE_WINDOW': {
      const { windowId } = action
      if (!(windowId in state.windows)) return state
      const restWindows = { ...state.windows }
      delete restWindows[windowId]
      const order = state.order.filter((id) => id !== windowId)
      const focusedWindowId =
        state.focusedWindowId === windowId
          ? pickTopVisibleWindow(restWindows)
          : state.focusedWindowId
      return { ...state, windows: restWindows, order, focusedWindowId }
    }

    case 'FOCUS_WINDOW': {
      const w = state.windows[action.windowId]
      if (!w || w.geometry.mode === 'minimized') return state
      const nextZ = state.nextZ + 1
      return {
        ...state,
        focusedWindowId: action.windowId,
        nextZ,
        windows: {
          ...state.windows,
          [action.windowId]: { ...w, zIndex: nextZ },
        },
      }
    }

    case 'MOVE_WINDOW': {
      const w = state.windows[action.windowId]
      if (!w || w.geometry.mode !== 'normal') return state
      const g = w.geometry.geometry
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.windowId]: {
            ...w,
            geometry: {
              mode: 'normal',
              geometry: { ...g, x: action.x, y: action.y },
            },
          },
        },
      }
    }

    case 'RESIZE_WINDOW': {
      const w = state.windows[action.windowId]
      if (!w || w.geometry.mode !== 'normal') return state
      const g = w.geometry.geometry
      const width = Math.max(MIN_WINDOW_WIDTH, action.width)
      const height = Math.max(MIN_WINDOW_HEIGHT, action.height)
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.windowId]: {
            ...w,
            geometry: {
              mode: 'normal',
              geometry: { ...g, width, height },
            },
          },
        },
      }
    }

    case 'MINIMIZE_WINDOW': {
      const w = state.windows[action.windowId]
      if (!w || w.geometry.mode === 'minimized') return state

      const minimizedGeometry: WindowGeometryState =
        w.geometry.mode === 'normal'
          ? { mode: 'minimized', restored: { ...w.geometry.geometry } }
          : { mode: 'minimized', restored: { ...w.geometry.restored } }

      const nextWindows = {
        ...state.windows,
        [action.windowId]: {
          ...w,
          geometry: minimizedGeometry,
        },
      }

      const focusedWindowId =
        state.focusedWindowId === action.windowId
          ? pickTopVisibleWindow(nextWindows)
          : state.focusedWindowId

      return {
        ...state,
        windows: nextWindows,
        focusedWindowId,
      }
    }

    case 'RESTORE_WINDOW': {
      const w = state.windows[action.windowId]
      if (!w || w.geometry.mode !== 'minimized') return state
      const restored = w.geometry.restored
      const nextZ = state.nextZ + 1
      return {
        ...state,
        focusedWindowId: action.windowId,
        nextZ,
        windows: {
          ...state.windows,
          [action.windowId]: {
            ...w,
            zIndex: nextZ,
            geometry: { mode: 'normal', geometry: { ...restored } },
          },
        },
      }
    }

    case 'TOGGLE_MINIMIZE': {
      const w = state.windows[action.windowId]
      if (!w) return state
      return w.geometry.mode === 'minimized'
        ? reduceSession(state, { type: 'RESTORE_WINDOW', windowId: action.windowId })
        : reduceSession(state, { type: 'MINIMIZE_WINDOW', windowId: action.windowId })
    }

    case 'MAXIMIZE_WINDOW': {
      const w = state.windows[action.windowId]
      if (!w || w.geometry.mode === 'minimized') return state
      if (w.geometry.mode === 'maximized') return state
      if (w.geometry.mode !== 'normal') return state

      const restored = w.geometry.geometry

      const nextZ = state.nextZ + 1

      return {
        ...state,
        focusedWindowId: action.windowId,
        nextZ,
        windows: {
          ...state.windows,
          [action.windowId]: {
            ...w,
            zIndex: nextZ,
            geometry: {
              mode: 'maximized',
              restored: { ...restored },
              frame: { ...action.frame },
            },
          },
        },
      }
    }

    case 'UNMAXIMIZE_WINDOW': {
      const w = state.windows[action.windowId]
      if (!w || w.geometry.mode !== 'maximized') return state
      const restored = w.geometry.restored
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.windowId]: {
            ...w,
            geometry: { mode: 'normal', geometry: { ...restored } },
          },
        },
      }
    }

    default:
      return state
  }
}
