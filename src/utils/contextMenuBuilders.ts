import type { ContextMenuEntryDef } from '@/components/shell/ContextMenu'
import type { FsNode } from '@/fs/types'
import type { WindowGeometryState } from '@/store/session/sessionTypes'

export type FsNewMenuHandlers = {
  onNewTextDocument: () => void
  onNewFolder: () => void
  onNewShortcut: () => void
}

export function buildFsNewSubmenu(handlers: FsNewMenuHandlers): ContextMenuEntryDef {
  return {
    type: 'submenu',
    id: 'new',
    label: 'New',
    items: [
      {
        type: 'item',
        id: 'new-text',
        label: 'Text Document',
        onSelect: handlers.onNewTextDocument,
      },
      {
        type: 'item',
        id: 'new-folder',
        label: 'Folder',
        onSelect: handlers.onNewFolder,
      },
      {
        type: 'item',
        id: 'new-shortcut',
        label: 'Shortcut',
        onSelect: handlers.onNewShortcut,
      },
    ],
  }
}

export type DesktopMenuContext = {
  selectedPaths: string[]
  hasClipboard: boolean
  onOpen: () => void
  onCut: () => void
  onCopy: () => void
  onDelete: () => void
  onRename: () => void
  onPaste: () => void
  onRefresh: () => void
  onNewTextDocument: () => void
  onNewFolder: () => void
  onNewShortcut: () => void
  onProperties: () => void
}

export function buildDesktopBackgroundMenu(ctx: DesktopMenuContext): ContextMenuEntryDef[] {
  return [
    buildFsNewSubmenu(ctx),
    { type: 'separator' },
    {
      type: 'item',
      id: 'paste',
      label: 'Paste',
      disabled: !ctx.hasClipboard,
      onSelect: ctx.onPaste,
    },
    { type: 'separator' },
    {
      type: 'item',
      id: 'refresh',
      label: 'Refresh',
      onSelect: ctx.onRefresh,
    },
  ]
}

export function buildDesktopIconMenu(ctx: DesktopMenuContext): ContextMenuEntryDef[] {
  const multi = ctx.selectedPaths.length > 1
  return [
    {
      type: 'item',
      id: 'open',
      label: 'Open',
      onSelect: ctx.onOpen,
    },
    { type: 'separator' },
    {
      type: 'item',
      id: 'cut',
      label: 'Cut',
      onSelect: ctx.onCut,
    },
    {
      type: 'item',
      id: 'copy',
      label: 'Copy',
      onSelect: ctx.onCopy,
    },
    {
      type: 'item',
      id: 'delete',
      label: 'Delete',
      onSelect: ctx.onDelete,
    },
    {
      type: 'item',
      id: 'rename',
      label: 'Rename',
      disabled: multi,
      onSelect: ctx.onRename,
    },
    { type: 'separator' },
    {
      type: 'item',
      id: 'properties',
      label: 'Properties',
      disabled: multi,
      onSelect: ctx.onProperties,
    },
  ]
}

export type FsTreeMenuContext = {
  node: FsNode
  hasClipboard: boolean
  onOpen: () => void
  onCut: () => void
  onCopy: () => void
  onDelete: () => void
  onRename: () => void
  onPaste: () => void
  onNewTextDocument: () => void
  onNewFolder: () => void
  onNewShortcut: () => void
}

export function buildFsTreeMenu(ctx: FsTreeMenuContext): ContextMenuEntryDef[] {
  const isDir = ctx.node.kind === 'directory'
  const items: ContextMenuEntryDef[] = [
    {
      type: 'item',
      id: 'open',
      label: 'Open',
      onSelect: ctx.onOpen,
    },
    { type: 'separator' },
    {
      type: 'item',
      id: 'cut',
      label: 'Cut',
      onSelect: ctx.onCut,
    },
    {
      type: 'item',
      id: 'copy',
      label: 'Copy',
      onSelect: ctx.onCopy,
    },
    {
      type: 'item',
      id: 'delete',
      label: 'Delete',
      onSelect: ctx.onDelete,
    },
    {
      type: 'item',
      id: 'rename',
      label: 'Rename',
      onSelect: ctx.onRename,
    },
    { type: 'separator' },
    buildFsNewSubmenu(ctx),
  ]

  if (isDir) {
    items.push({
      type: 'item',
      id: 'paste',
      label: 'Paste',
      disabled: !ctx.hasClipboard,
      onSelect: ctx.onPaste,
    })
  }

  return items
}

export type FsExplorerPaneMenuContext = FsNewMenuHandlers & {
  hasClipboard: boolean
  onPaste: () => void
  onRefresh: () => void
}

export function buildFsExplorerPaneMenu(ctx: FsExplorerPaneMenuContext): ContextMenuEntryDef[] {
  return [
    buildFsNewSubmenu(ctx),
    { type: 'separator' },
    {
      type: 'item',
      id: 'paste',
      label: 'Paste',
      disabled: !ctx.hasClipboard,
      onSelect: ctx.onPaste,
    },
    { type: 'separator' },
    {
      type: 'item',
      id: 'refresh',
      label: 'Refresh',
      onSelect: ctx.onRefresh,
    },
  ]
}

export type WindowMenuContext = {
  geometry: WindowGeometryState
  onRestore: () => void
  onMove: () => void
  onSize: () => void
  onMinimize: () => void
  onMaximize: () => void
  onClose: () => void
}

export function buildWindowTitleMenu(ctx: WindowMenuContext): ContextMenuEntryDef[] {
  const maximized = ctx.geometry.mode === 'maximized'
  const minimized = ctx.geometry.mode === 'minimized'
  return [
    {
      type: 'item',
      id: 'restore',
      label: 'Restore',
      disabled: !maximized && !minimized,
      onSelect: ctx.onRestore,
    },
    {
      type: 'item',
      id: 'move',
      label: 'Move',
      disabled: maximized || minimized,
      onSelect: ctx.onMove,
    },
    {
      type: 'item',
      id: 'size',
      label: 'Size',
      disabled: maximized || minimized,
      onSelect: ctx.onSize,
    },
    { type: 'separator' },
    {
      type: 'item',
      id: 'minimize',
      label: 'Minimize',
      disabled: minimized,
      onSelect: ctx.onMinimize,
    },
    {
      type: 'item',
      id: 'maximize',
      label: 'Maximize',
      disabled: maximized || minimized,
      onSelect: ctx.onMaximize,
    },
    { type: 'separator' },
    {
      type: 'item',
      id: 'close',
      label: 'Close',
      onSelect: ctx.onClose,
    },
  ]
}

export function buildTaskbarMenu(): ContextMenuEntryDef[] {
  return [
    {
      type: 'item',
      id: 'tile',
      label: 'Tile Windows',
      disabled: true,
      onSelect: () => {},
    },
  ]
}
