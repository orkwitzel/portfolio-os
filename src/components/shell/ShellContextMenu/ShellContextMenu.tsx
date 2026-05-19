import { useEffect } from 'react'
import { useContextMenuApi } from '@/components/shell/ContextMenu'
import { nextUntitledPath } from '@/fs/fsOperations'
import { useOs } from '@/hooks/useOs'
import { useFsStore } from '@/store/fsStore'
import {
  buildFsExplorerPaneMenu,
  buildFsTreeMenu,
  buildTaskbarMenu,
  buildWindowTitleMenu,
} from '@/utils/contextMenuBuilders'
import {
  getComputerExplorerWindowId,
  getFsFolderPaneDir,
  isFsTreeNode,
  isInsideShell,
  isTaskbarArea,
  isWindowTitleBar,
  shouldAllowNativeContextMenu,
} from '@/utils/shellContextMenu'
import { readWorkspaceFrame } from '@/utils/workspaceFrame'

export function ShellContextMenu() {
  const { openMenu } = useContextMenuApi()
  const os = useOs()
  const fs = useFsStore((s) => s.fs)
  const nodes = useFsStore((s) => s.nodes)

  useEffect(() => {
    const onContextMenu = (e: MouseEvent) => {
      if (shouldAllowNativeContextMenu(e.target)) return
      if (!isInsideShell(e.target)) return

      const titleBar = isWindowTitleBar(e.target)
      if (titleBar) {
        e.preventDefault()
        const frame = titleBar.closest<HTMLElement>('[data-window-id]')
        const windowId = frame?.dataset.windowId
        if (!windowId) return
        const win = os.win.session.windows[windowId]
        if (!win) return
        openMenu(
          e.clientX,
          e.clientY,
          buildWindowTitleMenu({
            geometry: win.geometry,
            onRestore: () => {
              if (win.geometry.mode === 'minimized') os.win.restore(windowId)
              else if (win.geometry.mode === 'maximized') os.win.unmaximize(windowId)
            },
            onMove: () => {},
            onSize: () => {},
            onMinimize: () => os.win.minimize(windowId),
            onMaximize: () => {
              if (win.geometry.mode === 'maximized') return
              const frame = readWorkspaceFrame(os.win.workspaceRef.current)
              if (frame) os.win.maximize(windowId, frame)
            },
            onClose: () => {
              void (async () => {
                const allowed = await os.win.requestClose(windowId)
                if (allowed) os.win.close(windowId)
              })()
            },
          }),
        )
        return
      }

      if (isTaskbarArea(e.target)) {
        e.preventDefault()
        openMenu(e.clientX, e.clientY, buildTaskbarMenu())
        return
      }

      const fsPath = isFsTreeNode(e.target)
      if (fsPath && fs) {
        e.preventDefault()
        const node = nodes.find((n) => n.path === fsPath)
        if (!node) return
        const hasClipboard = os.clipboard.hasContent()
        const paths = [fsPath]
        const parentDir = os.explorer.newItemParentDir(node)
        const textParentDir = os.explorer.newTextDocumentParentDir(node)

        const onNewFolder = () => {
          void (async () => {
            const final = await os.fs.create.folderWithRename(parentDir)
            os.explorer.reveal(parentDir, final)
          })()
        }

        const onNewTextDocument = () => {
          void (async () => {
            const final = await os.fs.create.textDocument(textParentDir)
            os.explorer.reveal(textParentDir, final)
          })()
        }

        openMenu(
          e.clientX,
          e.clientY,
          buildFsTreeMenu({
            node,
            hasClipboard,
            onOpen: () => {
              if (node.kind === 'file') {
                void os.fs.open(fsPath)
                return
              }
              os.explorer.navigateFocused(fsPath)
            },
            onCut: () => os.clipboard.cut(paths),
            onCopy: () => os.clipboard.copy(paths),
            onDelete: async () => {
              if (node.kind === 'directory') {
                const children = nodes.filter(
                  (n) => n.parentPath === fsPath || n.path.startsWith(fsPath + '/'),
                )
                if (children.length > 1) {
                  const ok = await os.ui.confirm({
                    title: 'Confirm Delete',
                    message: `Are you sure you want to delete "${node.name}" and its contents?`,
                  })
                  if (!ok) return
                }
              }
              await os.fs.delete(fsPath)
            },
            onRename: () => {
              void (async () => {
                const renameParentDir =
                  node.kind === 'directory' ? fsPath : node.parentPath ?? '/'
                const final = await os.fs.rename.interactive(fsPath)
                os.explorer.reveal(renameParentDir, final)
              })()
            },
            onPaste: () => {
              const dest = node.kind === 'directory' ? fsPath : node.parentPath ?? '/'
              void os.clipboard.pasteToDirectory(dest)
            },
            onNewTextDocument,
            onNewFolder,
            onNewShortcut: async () => {
              const target = await nextUntitledPath(fs, '/docs')
              await fs.writeFile(target, '')
              await os.fs.create.shortcutOnDesktop(target)
            },
          }),
        )
        return
      }

      const computerWindowId = getComputerExplorerWindowId(e.target)
      const paneDir = getFsFolderPaneDir(e.target)
      if ((paneDir || computerWindowId) && fs) {
        e.preventDefault()
        const hasClipboard = os.clipboard.hasContent()
        const parentDir =
          os.explorer.getCreateParentDir(computerWindowId) ?? paneDir ?? '/'

        const onNewFolder = () => {
          void (async () => {
            const final = await os.fs.create.folderWithRename(parentDir)
            os.explorer.reveal(parentDir, final)
          })()
        }

        const onNewTextDocument = () => {
          void (async () => {
            const final = await os.fs.create.textDocument(parentDir)
            os.explorer.reveal(parentDir, final)
          })()
        }

        openMenu(
          e.clientX,
          e.clientY,
          buildFsExplorerPaneMenu({
            hasClipboard,
            onPaste: () => void os.clipboard.pasteToDirectory(parentDir),
            onRefresh: () => void os.fs.refreshNodes(),
            onNewTextDocument,
            onNewFolder,
            onNewShortcut: async () => {
              const target = await nextUntitledPath(fs, '/docs')
              await fs.writeFile(target, '')
              await os.fs.create.shortcutOnDesktop(target)
            },
          }),
        )
        return
      }

      if (e.target instanceof HTMLElement) {
        if (e.target.closest('[data-desktop-workspace]')) return
        if (e.target.closest('button[data-desktop-id]')) return
      }

      e.preventDefault()
    }

    document.addEventListener('contextmenu', onContextMenu, true)
    return () => document.removeEventListener('contextmenu', onContextMenu, true)
  }, [openMenu, os, fs, nodes])

  return null
}
