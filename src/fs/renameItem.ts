import type { ShellModalApi } from '@/components/shell/ShellModal/shellModalContext'
import type { FsStore } from '@/store/fsStore'
import { isDesktopPath } from '@/store/fsStore'
import type { FsNode } from '@/fs/types'
import { resolveDesktopFileName } from './fsOperations'
import { basename, dirname, join, normalizePath } from '@/utils/paths'

/** Wait for context menus / pointer events to settle before opening a modal. */
export function deferShellModal(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve())
    })
  })
}

function sanitizeFilename(name: string): string {
  return name.replace(/[/\\]/g, '').trim()
}

export function buildRenameDestPath(
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

export async function renameItemAtPath(
  fsStore: FsStore,
  shellModal: ShellModalApi,
  currentPath: string,
  options?: { userInput?: string; deferPrompt?: boolean },
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
