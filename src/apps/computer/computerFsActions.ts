import { getComputerNavigator } from './computerNavigation'
import type { FsNode } from '@/fs/types'
import type { WindowManagerApi } from '@/store/session/windowManagerContext'
import { normalizePath } from '@/utils/paths'

/** Where a "New …" action should create items in My Computer. */
export function resolveCreateParentDir(
  currentDir: string,
  selectedPath: string | null,
  nodes: FsNode[],
  targetNode?: FsNode | null,
): string {
  if (targetNode) {
    return newItemParentDir(targetNode)
  }
  if (selectedPath) {
    const selected = nodes.find((n) => n.path === selectedPath)
    if (selected?.kind === 'directory') return normalizePath(selectedPath)
  }
  return normalizePath(currentDir)
}

export function revealInFocusedComputer(
  wm: WindowManagerApi,
  parentDir: string,
  finalPath: string,
): void {
  const focusedId = wm.session.focusedWindowId
  if (!focusedId) return
  const win = wm.session.windows[focusedId]
  if (win?.appId !== 'computer') return
  getComputerNavigator(focusedId)?.navigate(normalizePath(parentDir), finalPath)
}

export function newItemParentDir(node: FsNode): string {
  if (node.kind === 'directory') return node.path
  return node.parentPath ?? '/'
}

export function newTextDocumentParentDir(node: FsNode): string {
  if (node.kind === 'directory') return node.path
  if (node.parentPath === '/desktop') return '/desktop'
  return node.parentPath ?? '/docs'
}
