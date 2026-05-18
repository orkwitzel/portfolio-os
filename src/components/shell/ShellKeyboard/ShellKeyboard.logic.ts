import { useEffect, useLayoutEffect, useRef } from 'react'
import { useContextMenuOptional } from '@/components/shell/ContextMenu'
import { useShellModalOptional } from '@/components/shell/ShellModal'
import { getNextFocusWindowId, isEditableTarget } from '@/utils/shellKeyboard'
import { useWindowManager } from '@/hooks/useWindowManager'
import type { WindowManagerApi } from '@/store/session/windowManagerContext'

export type DesktopKeyboardContext = {
  openPrimary: () => void
  clearSelection: () => void
  hasSelection: boolean
  copy: () => void
  cut: () => void
  paste: () => void
  deleteSelection: () => void
  startRename: () => void
}

export type ShellKeyboardProps = {
  startMenuOpen: boolean
  desktopCtx?: DesktopKeyboardContext
}

type ShortcutContext = {
  event: KeyboardEvent
  startMenuOpen: boolean
  contextMenuOpen: boolean
  shellModalOpen: boolean
  wm: WindowManagerApi
  desktopCtx: DesktopKeyboardContext | undefined
}

type Shortcut = {
  match: (ctx: ShortcutContext) => boolean
  run: (ctx: ShortcutContext) => void
}

function shellShortcutsEnabled(ctx: ShortcutContext): boolean {
  return (
    !ctx.startMenuOpen &&
    !ctx.contextMenuOpen &&
    !ctx.shellModalOpen &&
    !isEditableTarget(document.activeElement)
  )
}

function desktopFocused(ctx: ShortcutContext): boolean {
  return !ctx.wm.session.focusedWindowId
}

const shortcuts: Shortcut[] = [
  {
    match: ({ event, startMenuOpen, contextMenuOpen, shellModalOpen }) =>
      !startMenuOpen &&
      !contextMenuOpen &&
      !shellModalOpen &&
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
    match: (ctx) =>
      shellShortcutsEnabled(ctx) &&
      desktopFocused(ctx) &&
      ctx.event.key === 'Enter' &&
      Boolean(ctx.desktopCtx?.hasSelection),
    run: ({ event, desktopCtx }) => {
      desktopCtx?.openPrimary()
      event.preventDefault()
    },
  },
  {
    match: (ctx) =>
      shellShortcutsEnabled(ctx) &&
      desktopFocused(ctx) &&
      (ctx.event.ctrlKey || ctx.event.metaKey) &&
      ctx.event.key.toLowerCase() === 'c' &&
      Boolean(ctx.desktopCtx?.hasSelection),
    run: ({ event, desktopCtx }) => {
      desktopCtx?.copy()
      event.preventDefault()
    },
  },
  {
    match: (ctx) =>
      shellShortcutsEnabled(ctx) &&
      desktopFocused(ctx) &&
      (ctx.event.ctrlKey || ctx.event.metaKey) &&
      ctx.event.key.toLowerCase() === 'x' &&
      Boolean(ctx.desktopCtx?.hasSelection),
    run: ({ event, desktopCtx }) => {
      desktopCtx?.cut()
      event.preventDefault()
    },
  },
  {
    match: (ctx) =>
      shellShortcutsEnabled(ctx) &&
      desktopFocused(ctx) &&
      (ctx.event.ctrlKey || ctx.event.metaKey) &&
      ctx.event.key.toLowerCase() === 'v',
    run: ({ event, desktopCtx }) => {
      desktopCtx?.paste()
      event.preventDefault()
    },
  },
  {
    match: (ctx) =>
      shellShortcutsEnabled(ctx) &&
      desktopFocused(ctx) &&
      ctx.event.key === 'F2' &&
      Boolean(ctx.desktopCtx?.hasSelection),
    run: ({ event, desktopCtx }) => {
      desktopCtx?.startRename()
      event.preventDefault()
    },
  },
  {
    match: (ctx) =>
      shellShortcutsEnabled(ctx) &&
      desktopFocused(ctx) &&
      ctx.event.key === 'Delete' &&
      Boolean(ctx.desktopCtx?.hasSelection),
    run: ({ event, desktopCtx }) => {
      desktopCtx?.deleteSelection()
      event.preventDefault()
    },
  },
  {
    match: ({ event, startMenuOpen, contextMenuOpen }) =>
      !startMenuOpen &&
      !contextMenuOpen &&
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
  const contextMenu = useContextMenuOptional()
  const shellModal = useShellModalOptional()
  const desktopCtxRef = useRef(desktopCtx)

  useLayoutEffect(() => {
    desktopCtxRef.current = desktopCtx
  })

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const ctx: ShortcutContext = {
        event,
        startMenuOpen,
        contextMenuOpen: contextMenu?.isOpen() ?? false,
        shellModalOpen: shellModal?.isOpen() ?? false,
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
  }, [startMenuOpen, wm, contextMenu, shellModal])
}
