import { getComputerNavigator } from '@/apps/computer/computerNavigation'
import type { FsNode } from '@/fs/types'
import { normalizePath } from '@/utils/paths'
import type { OsDeps, OsExplorerApi } from './types'

/**
 * Parent directory for a generic new item from a context-menu target.
 * @see OsExplorerApi.newItemParentDir
 */
export function newItemParentDir(node: FsNode): string {
  if (node.kind === 'directory') return node.path
  return node.parentPath ?? '/'
}

/**
 * Parent directory for a new text document from a context-menu target.
 * @see OsExplorerApi.newTextDocumentParentDir
 */
export function newTextDocumentParentDir(node: FsNode): string {
  if (node.kind === 'directory') return node.path
  if (node.parentPath === '/desktop') return '/desktop'
  return node.parentPath ?? '/docs'
}

/**
 * Resolve where My Computer should create a new file or folder.
 * @see OsExplorerApi.resolveCreateParentDir
 */
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

/** @internal Creates the {@link OsExplorerApi} namespace. @see OsExplorerApi */
export function createExplorerApi(deps: OsDeps): OsExplorerApi {
  const { wm } = deps

  return {
    reveal: (parentDir, finalPath) => {
      const focusedId = wm.session.focusedWindowId
      if (!focusedId) return
      const win = wm.session.windows[focusedId]
      if (win?.appId !== 'computer') return
      getComputerNavigator(focusedId)?.navigate(
        normalizePath(parentDir),
        finalPath,
      )
    },

    resolveCreateParentDir,
    newItemParentDir,
    newTextDocumentParentDir,

    navigateFocused: (dir, selected) => {
      const focusedId = wm.session.focusedWindowId
      if (!focusedId) return
      getComputerNavigator(focusedId)?.navigate(dir, selected)
    },

    getCreateParentDir: (windowId) =>
      getComputerNavigator(windowId)?.getCreateParentDir(),
  }
}
