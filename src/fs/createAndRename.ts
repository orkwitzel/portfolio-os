import type { FsApi } from './fsDb'
import { nextUntitledPath } from './fsOperations'
import type { ShellModalApi } from '@/components/shell/ShellModal/shellModalContext'
import type { FsStore } from '@/store/fsStore'
import { deferShellModal, renameItemAtPath } from './renameItem'

export async function createFolderWithRename(
  fsStore: FsStore,
  shellModal: ShellModalApi,
  parentDir: string,
): Promise<string> {
  const created = await fsStore.createFolderIn(parentDir)
  return renameItemAtPath(fsStore, shellModal, created)
}

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
