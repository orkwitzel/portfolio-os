import type { ShellModalApi } from '@/components/shell/ShellModal/shellModalContext'
import { nextUntitledPath, resolveDesktopFileName } from '@/fs/fsOperations'
import type { FsNode } from '@/fs/types'
import type { FsStore } from '@/store/fsStore'
import { isDesktopPath } from '@/store/fsStore'
import type { FsApi } from '@/fs/fsDb'
import { basename, dirname, join, normalizePath } from '@/utils/paths'
import type { OsFsRenameOptions } from './types'

/** Wait for context menus / pointer handlers to finish before opening a modal. */
function deferShellModal(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve())
    })
  })
}

function sanitizeFilename(name: string): string {
  return name.replace(/[/\\]/g, '').trim()
}

/**
 * Compute the destination path for a rename, preserving extensions on desktop files.
 * @returns `null` if the name is unchanged or invalid.
 */
function buildRenameDestPath(
  node: FsNode | undefined,
  currentPath: string,
  userInput: string,
): string | null {
  const trimmed = sanitizeFilename(userInput)
  if (!trimmed) return null

  const path = normalizePath(currentPath)
  const name = basename(path)
  if (trimmed === name) return null

  const parent = dirname(path)
  let destName = trimmed
  if (node?.kind === 'file') {
    destName = resolveDesktopFileName(name, trimmed)
  }
  return parent === '/' ? `/${destName}` : join(parent, destName)
}

/**
 * @internal Implementation of {@link OsFsApi.rename.interactive}.
 */
async function renameItemAtPath(
  fsStore: FsStore,
  shellModal: ShellModalApi,
  currentPath: string,
  options?: OsFsRenameOptions,
): Promise<string> {
  const path = normalizePath(currentPath)
  const fs = fsStore.fs
  if (!fs) return path

  let userInput = options?.userInput
  if (userInput === undefined) {
    if (options?.deferPrompt !== false) {
      await deferShellModal()
    }
    const node = await fs.getNode(path)
    const prompted = await shellModal.prompt({
      title: 'Rename',
      message: 'Rename to:',
      defaultValue: node?.name ?? basename(path),
    })
    if (prompted === null) return path
    userInput = prompted
  }

  const trimmed = sanitizeFilename(userInput)
  if (!trimmed) return path

  const node = await fs.getNode(path)
  if (!isDesktopPath(path) && trimmed === (node?.name ?? basename(path))) {
    return path
  }

  try {
    if (isDesktopPath(path)) {
      const final = await fsStore.renameDesktopItem(path, userInput)
      fsStore.bumpDesktopRevision()
      return final
    }

    const dest = buildRenameDestPath(node, path, userInput)
    if (!dest || dest === path) return path
    await fsStore.renamePath(path, dest)
    return dest
  } catch (err) {
    await shellModal.confirm({
      title: 'Rename failed',
      message: err instanceof Error ? err.message : 'Could not rename this item.',
    })
    return path
  }
}

/**
 * @internal Implementation of {@link OsFsApi.create.folderWithRename}.
 */
export async function createFolderWithRename(
  fsStore: FsStore,
  shellModal: ShellModalApi,
  parentDir: string,
): Promise<string> {
  const created = await fsStore.createFolderIn(parentDir)
  return renameItemAtPath(fsStore, shellModal, created)
}

/**
 * @internal Implementation of {@link OsFsApi.create.textDocument}.
 */
export async function createTextDocumentWithRename(
  fs: FsApi,
  fsStore: FsStore,
  shellModal: ShellModalApi,
  parentDir: string,
): Promise<string> {
  const filePath = await nextUntitledPath(fs, parentDir)
  await fs.writeFile(filePath, '')
  await fsStore.refreshNodes()
  fsStore.bumpDesktopRevision()
  await deferShellModal()
  return renameItemAtPath(fsStore, shellModal, filePath, { deferPrompt: false })
}

export { renameItemAtPath }
