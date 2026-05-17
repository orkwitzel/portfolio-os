import { useEffect, useLayoutEffect, useRef } from 'react'
import { getNextFocusWindowId, isEditableTarget } from './shellKeyboard'
import { useWindowManager } from './windowManagerContext'
import type { WindowManagerApi } from './windowManagerContext'

export type DesktopKeyboardContext = {
  /** Open the primary selected desktop icon. No-op if nothing is selected. */
  openPrimary: () => void
  /** Clear the desktop selection. */
  clearSelection: () => void
  /** Whether any desktop icons are selected. */
  hasSelection: boolean
}

type ShellKeyboardProps = {
  startMenuOpen: boolean
  desktopCtx?: DesktopKeyboardContext
}

type ShortcutContext = {
  event: KeyboardEvent
  startMenuOpen: boolean
  wm: WindowManagerApi
  desktopCtx: DesktopKeyboardContext | undefined
}

type Shortcut = {
  match: (ctx: ShortcutContext) => boolean
  run: (ctx: ShortcutContext) => void
}

const shortcuts: Shortcut[] = [
  {
    // Escape: close focused window first; if no window, clear desktop selection.
    match: ({ event, startMenuOpen }) =>
      !startMenuOpen &&
      event.key === 'Escape' &&
      !isEditableTarget(document.activeElement),
    run: ({ event, wm, desktopCtx }) => {
      const id = wm.session.focusedWindowId
      if (id) {
        wm.closeWindow(id)
        event.preventDefault()
      } else if (desktopCtx?.hasSelection) {
        desktopCtx.clearSelection()
        event.preventDefault()
      }
    },
  },
  {
    // Enter: open primary selected desktop icon (when no window focused).
    match: ({ event, startMenuOpen }) =>
      !startMenuOpen &&
      event.key === 'Enter' &&
      !isEditableTarget(document.activeElement),
    run: ({ event, wm, desktopCtx }) => {
      if (wm.session.focusedWindowId) return
      if (!desktopCtx?.hasSelection) return
      desktopCtx.openPrimary()
      event.preventDefault()
    },
  },
  {
    match: ({ event, startMenuOpen }) =>
      !startMenuOpen &&
      event.ctrlKey &&
      !event.shiftKey &&
      (event.key === 'Backquote' || event.key === '`'),
    run: ({ event, wm }) => {
      const nextId = getNextFocusWindowId(wm.session)
      if (!nextId) return
      wm.focusWindow(nextId)
      event.preventDefault()
    },
  },
]

export function ShellKeyboard({ startMenuOpen, desktopCtx }: ShellKeyboardProps) {
  const wm = useWindowManager()
  // Keep a ref so the keydown handler is never stale on desktopCtx changes.
  const desktopCtxRef = useRef(desktopCtx)
  useLayoutEffect(() => {
    desktopCtxRef.current = desktopCtx
  })

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const ctx: ShortcutContext = {
        event,
        startMenuOpen,
        wm,
        desktopCtx: desktopCtxRef.current,
      }
      for (const shortcut of shortcuts) {
        if (shortcut.match(ctx)) {
          shortcut.run(ctx)
          return
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [startMenuOpen, wm])

  return null
}
