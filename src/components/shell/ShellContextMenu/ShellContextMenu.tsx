import { useEffect } from 'react'
import { useContextMenuApi } from '@/components/shell/ContextMenu'
import { useShellModal } from '@/components/shell/ShellModal'
import { useFsStore } from '@/store/fsStore'
import { useShellClipboard } from '@/store/shellClipboard'
import { useWindowManager } from '@/hooks/useWindowManager'
import {
  buildFsTreeMenu,
  buildTaskbarMenu,
  buildWindowTitleMenu,
} from '@/utils/contextMenuBuilders'
import {
  isFsTreeNode,
  isInsideShell,
  isTaskbarArea,
  isWindowTitleBar,
  shouldAllowNativeContextMenu,
} from '@/utils/shellContextMenu'
import { nextUntitledPath } from '@/fs/fsOperations'
import { readWorkspaceFrame } from '@/utils/workspaceFrame'

export function ShellContextMenu() {
  const { openMenu } = useContextMenuApi()
  const shellModal = useShellModal()
  const wm = useWindowManager()
  const fs = useFsStore((s) => s.fs)
  const nodes = useFsStore((s) => s.nodes)
  const fsStore = useFsStore()
  const clipboard = useShellClipboard()

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
        const win = wm.session.windows[windowId]
        if (!win) return
        openMenu(
          e.clientX,
          e.clientY,
          buildWindowTitleMenu({
            geometry: win.geometry,
            onRestore: () => {
              if (win.geometry.mode === 'minimized') wm.restoreWindow(windowId)
              else if (win.geometry.mode === 'maximized') wm.unmaximizeWindow(windowId)
            },
            onMove: () => {},
            onSize: () => {},
            onMinimize: () => wm.minimizeWindow(windowId),
            onMaximize: () => {
              if (win.geometry.mode === 'maximized') return
              const frame = readWorkspaceFrame(wm.workspaceRef.current)
              if (frame) wm.maximizeWindow(windowId, frame)
            },
            onClose: () => wm.closeWindow(windowId),
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
        const hasClipboard = clipboard.hasContent()
        const paths = [fsPath]

        openMenu(
          e.clientX,
          e.clientY,
          buildFsTreeMenu({
            node,
            hasClipboard,
            onOpen: () => {
              if (node.kind === 'file') void fsStore.openPath(fsPath)
            },
            onCut: () => clipboard.cut(paths),
            onCopy: () => clipboard.copy(paths),
            onDelete: async () => {
              if (node.kind === 'directory') {
                const children = nodes.filter((n) => n.parentPath === fsPath || n.path.startsWith(fsPath + '/'))
                if (children.length > 1) {
                  const ok = await shellModal.confirm({
                    title: 'Confirm Delete',
                    message: `Are you sure you want to delete "${node.name}" and its contents?`,
                  })
                  if (!ok) return
                }
              }
              await fsStore.deletePath(fsPath)
            },
            onRename: async () => {
              const next = await shellModal.prompt({
                title: 'Rename',
                message: 'Rename to:',
                defaultValue: node.name,
              })
              if (!next || next === node.name) return
              const parent = node.parentPath ?? '/'
              const dest = parent === '/' ? `/${next}` : `${parent}/${next}`
              void fsStore.renamePath(fsPath, dest)
            },
            onPaste: () => {
              const dest = node.kind === 'directory' ? fsPath : node.parentPath ?? '/'
              void clipboard.pasteToDirectory(dest, fs, fsStore)
            },
            onNewTextDocument: async () => {
              const parent =
                node.kind === 'directory'
                  ? fsPath
                  : node.parentPath === '/desktop'
                    ? '/desktop'
                    : '/docs'
              const filePath = await nextUntitledPath(fs, parent)
              await fs.writeFile(filePath, '')
              await fsStore.refreshNodes()
              fsStore.bumpDesktopRevision()
            },
            onNewFolder: () => {
              const parent = node.kind === 'directory' ? fsPath : node.parentPath ?? '/docs'
              void fsStore.createFolderIn(parent)
            },
            onNewShortcut: async () => {
              const target = await nextUntitledPath(fs, '/docs')
              await fs.writeFile(target, '')
              await fsStore.createShortcutOnDesktop(target)
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
  }, [openMenu, shellModal, wm, fs, nodes, fsStore, clipboard])

  return null
}
