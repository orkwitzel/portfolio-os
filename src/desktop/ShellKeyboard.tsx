import { useEffect } from 'react'
import { getNextFocusWindowId, isEditableTarget } from './shellKeyboard'
import { useWindowManager } from './windowManagerContext'
import type { WindowManagerApi } from './windowManagerContext'

type ShellKeyboardProps = {
  startMenuOpen: boolean
}

type ShortcutContext = {
  event: KeyboardEvent
  startMenuOpen: boolean
  wm: WindowManagerApi
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
    run: ({ event, wm }) => {
      const id = wm.session.focusedWindowId
      if (!id) return
      wm.closeWindow(id)
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

export function ShellKeyboard({ startMenuOpen }: ShellKeyboardProps) {
  const wm = useWindowManager()

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const ctx: ShortcutContext = { event, startMenuOpen, wm }
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
