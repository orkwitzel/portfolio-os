import {
  createFolderWithRename,
  createTextDocumentWithRename,
  renameItemAtPath,
} from './fsRename'
import type { OsDeps, OsFsApi } from './types'

/** @internal Creates the {@link OsFsApi} namespace. @see OsFsApi */
export function createFsApi(deps: OsDeps): OsFsApi {
  const { fsStore, modal } = deps

  return {
    read: (path) => fsStore.readFile(path),
    write: (path, content) => fsStore.writeFile(path, content),
    delete: (path) => fsStore.deletePath(path),
    renameTo: (oldPath, newPath) => fsStore.renamePath(oldPath, newPath),
    move: (srcPath, destDir) => fsStore.movePath(srcPath, destDir),
    duplicate: (srcPath, destDir) => fsStore.duplicatePath(srcPath, destDir),
    mkdir: (path) => fsStore.mkdir(path),
    listChildren: (dirPath) => fsStore.listChildren(dirPath),
    listDesktopEntries: () => fsStore.listDesktopEntries(),
    resolveDesktopIcon: (entry) => fsStore.resolveDesktopIcon(entry),
    saveDesktopPositions: (updates) => fsStore.saveDesktopPositions(updates),
    refreshNodes: () => fsStore.refreshNodes(),
    open: (path) => fsStore.openPath(path),
    renameDesktopItem: (desktopPath, label) => fsStore.renameDesktopItem(desktopPath, label),

    create: {
      folder: (parentDir) => fsStore.createFolderIn(parentDir),
      folderWithRename: (parentDir) => createFolderWithRename(fsStore, modal, parentDir),
      textDocument: (parentDir) => {
        const fs = fsStore.fs
        if (!fs) throw new Error('Filesystem not ready')
        return createTextDocumentWithRename(fs, fsStore, modal, parentDir)
      },
      shortcutOnDesktop: (targetPath, label) =>
        fsStore.createShortcutOnDesktop(targetPath, label),
    },

    rename: {
      interactive: (path, options) => renameItemAtPath(fsStore, modal, path, options),
    },
  }
}
