import { useEffect, useLayoutEffect, useRef } from 'react'
import { getNextFocusWindowId, isEditableTarget } from '@/utils/shellKeyboard'
import { useWindowManager } from '@/hooks/useWindowManager'
import type { WindowManagerApi } from '@/store/session/windowManagerContext'

export type DesktopKeyboardContext = {
  openPrimary: () => void
  clearSelection: () => void
  hasSelection: boolean
}

export type ShellKeyboardProps = {
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

export function useShellKeyboard({ startMenuOpen, desktopCtx }: ShellKeyboardProps) {
  const wm = useWindowManager()
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
}
