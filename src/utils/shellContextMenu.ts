import { isEditableTarget } from '@/utils/shellKeyboard'

const MINESWEEPER_BOARD = '[data-minesweeper-board]'

export function shouldAllowNativeContextMenu(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  if (isEditableTarget(target)) return true
  if (target.closest(MINESWEEPER_BOARD)) return true
  return false
}

export function isDesktopShortcutButton(target: EventTarget | null): string | null {
  if (!(target instanceof HTMLElement)) return null
  const btn = target.closest<HTMLButtonElement>('button[data-desktop-id]')
  return btn?.dataset.desktopId ?? null
}

export function isInsideShell(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return Boolean(target.closest('[data-shell-root]'))
}

export function isWindowTitleBar(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof HTMLElement)) return null
  const bar = target.closest<HTMLElement>('[data-window-titlebar]')
  return bar
}

export function isTaskbarArea(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return Boolean(target.closest('[data-taskbar]'))
}

export function isTaskbarWindowButton(target: EventTarget | null): string | null {
  if (!(target instanceof HTMLElement)) return null
  const btn = target.closest<HTMLButtonElement>('button[data-taskbar-window-id]')
  return btn?.dataset.taskbarWindowId ?? null
}

export function isFsTreeNode(target: EventTarget | null): string | null {
  if (!(target instanceof HTMLElement)) return null
  const btn = target.closest<HTMLButtonElement>('button[data-fs-path]')
  return btn?.dataset.fsPath ?? null
}

export function getFsFolderPaneDir(target: EventTarget | null): string | null {
  if (!(target instanceof HTMLElement)) return null
  const pane = target.closest('[data-fs-folder-pane]')
  if (!pane) return null
  if (target.closest('button[data-fs-path]')) return null
  return pane.getAttribute('data-current-dir') ?? '/'
}

export function getComputerExplorerWindowId(target: EventTarget | null): string | null {
  if (!(target instanceof HTMLElement)) return null
  if (!target.closest('[data-computer-explorer]')) return null
  if (target.closest('[data-window-titlebar]')) return null
  const frame = target.closest<HTMLElement>('[data-window-id]')
  return frame?.dataset.windowId ?? null
}
