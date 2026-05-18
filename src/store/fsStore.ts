import { create } from 'zustand'
import type { AppDefinition } from '@/store/session/sessionTypes'
import type { IconSource } from '@/components/shell/ShellIcon'
import type { WindowManagerApi } from '@/store/session/windowManagerContext'
import { listDesktopEntries, resolveDesktopIcon, updateDesktopPositions } from '@/fs/desktop'
import {
  createDesktopShortcut,
  createFolder,
  createTextDocument,
  isProtectedPath,
  moveNode,
  renameDesktopDirectory,
  renameDesktopFile,
  renameDesktopLabel,
} from '@/fs/fsOperations'
import { openPath as routeOpenPath } from '@/fs/extensionRouter'
import { openFs, type FsApi } from '@/fs/fsDb'
import type { DesktopEntry, FsNode } from '@/fs/types'
import { extension, normalizePath } from '@/utils/paths'

type FsStoreState = {
  ready: boolean
  fs: FsApi | null
  nodes: FsNode[]
  wm: WindowManagerApi | null
  registry: Map<string, AppDefinition> | null
  desktopRevision: number
}

type FsStoreActions = {
  bindShell: (ctx: {
    wm: WindowManagerApi
    registry: Map<string, AppDefinition>
  }) => void
  init: () => Promise<void>
  refreshNodes: () => Promise<void>
  bumpDesktopRevision: () => void
  listDesktopEntries: () => Promise<DesktopEntry[]>
  listAllNodes: () => Promise<FsNode[]>
  readFile: (path: string) => Promise<string>
  writeFile: (path: string, content: string) => Promise<void>
  mkdir: (path: string) => Promise<void>
  listChildren: (dirPath: string) => Promise<FsNode[]>
  openPath: (path: string) => Promise<void>
  resolveDesktopIcon: (entry: DesktopEntry) => Promise<IconSource>
  saveDesktopPositions: (
    updates: ReadonlyArray<{ desktopPath: string; gridX: number; gridY: number }>,
  ) => Promise<void>
  deletePath: (path: string) => Promise<void>
  renamePath: (oldPath: string, newPath: string) => Promise<void>
  duplicatePath: (srcPath: string, destDir: string) => Promise<string>
  movePath: (srcPath: string, destDir: string) => Promise<string>
  renameDesktopShortcutLabel: (desktopPath: string, label: string) => Promise<void>
  renameDesktopItem: (desktopPath: string, label: string) => Promise<string>
  createTextDocumentOnDesktop: () => Promise<string>
  createFolderIn: (parentDir: string) => Promise<string>
  createShortcutOnDesktop: (targetPath: string, label?: string) => Promise<string>
}

export type FsStore = FsStoreState & FsStoreActions

function requireFs(fs: FsApi | null): FsApi {
  if (!fs) throw new Error('Filesystem not ready')
  return fs
}

function requireShell(
  wm: WindowManagerApi | null,
  registry: Map<string, AppDefinition> | null,
): { wm: WindowManagerApi; registry: Map<string, AppDefinition> } {
  if (!wm || !registry) throw new Error('Shell not bound')
  return { wm, registry }
}

async function afterFsMutation(get: () => FsStore): Promise<void> {
  await get().refreshNodes()
  get().bumpDesktopRevision()
}

export const useFsStore = create<FsStore>((set, get) => ({
  ready: false,
  fs: null,
  nodes: [],
  wm: null,
  registry: null,
  desktopRevision: 0,

  bindShell: ({ wm, registry }) => set({ wm, registry }),

  init: async () => {
    if (get().ready) return
    const api = await openFs()
    const all = await api.getAllNodes()
    set({ fs: api, nodes: all, ready: true })
  },

  refreshNodes: async () => {
    const { fs } = get()
    if (!fs) return
    set({ nodes: await fs.getAllNodes() })
  },

  bumpDesktopRevision: () => set((s) => ({ desktopRevision: s.desktopRevision + 1 })),

  listDesktopEntries: async () => listDesktopEntries(requireFs(get().fs)),

  listAllNodes: async () => requireFs(get().fs).getAllNodes(),

  readFile: async (path) => requireFs(get().fs).readFile(path),

  writeFile: async (path, content) => {
    await requireFs(get().fs).writeFile(path, content)
    await afterFsMutation(get)
  },

  mkdir: async (path) => {
    await requireFs(get().fs).mkdir(path)
    await afterFsMutation(get)
  },

  listChildren: async (dirPath) => requireFs(get().fs).listChildren(dirPath),

  openPath: async (path) => {
    const { wm } = requireShell(get().wm, get().registry)
    await routeOpenPath(path, { wm, fs: requireFs(get().fs) })
  },

  resolveDesktopIcon: async (entry) => {
    const { registry } = requireShell(get().wm, get().registry)
    return resolveDesktopIcon(entry, requireFs(get().fs), registry)
  },

  saveDesktopPositions: async (updates) => {
    await updateDesktopPositions(requireFs(get().fs), updates)
    await get().refreshNodes()
  },

  deletePath: async (path) => {
    const normalized = normalizePath(path)
    if (isProtectedPath(normalized)) {
      console.warn(`Cannot delete protected path: ${normalized}`)
      return
    }
    await requireFs(get().fs).deleteNode(normalized)
    await afterFsMutation(get)
  },

  renamePath: async (oldPath, newPath) => {
    const from = normalizePath(oldPath)
    if (isProtectedPath(from)) {
      console.warn(`Cannot rename protected path: ${from}`)
      return
    }
    await requireFs(get().fs).renameNode(from, normalizePath(newPath))
    await afterFsMutation(get)
  },

  duplicatePath: async (srcPath, destDir) => {
    const dest = await requireFs(get().fs).duplicateNode(normalizePath(srcPath), normalizePath(destDir))
    await afterFsMutation(get)
    return dest
  },

  movePath: async (srcPath, destDir) => {
    const dest = await moveNode(requireFs(get().fs), srcPath, destDir)
    await afterFsMutation(get)
    return dest
  },

  renameDesktopShortcutLabel: async (desktopPath, label) => {
    await renameDesktopLabel(requireFs(get().fs), desktopPath, label)
    await afterFsMutation(get)
  },

  renameDesktopItem: async (desktopPath, label) => {
    const fs = requireFs(get().fs)
    const normalized = normalizePath(desktopPath)
    const node = await fs.getNode(normalized)
    let finalPath = normalized
    if (isDesktopShortcutPath(desktopPath)) {
      await renameDesktopLabel(fs, desktopPath, label)
    } else if (node?.kind === 'directory') {
      finalPath = await renameDesktopDirectory(fs, desktopPath, label)
    } else {
      finalPath = await renameDesktopFile(fs, desktopPath, label)
    }
    await afterFsMutation(get)
    return finalPath
  },

  createTextDocumentOnDesktop: async () => {
    const filePath = await createTextDocument(requireFs(get().fs))
    await afterFsMutation(get)
    return filePath
  },

  createFolderIn: async (parentDir) => {
    const path = await createFolder(requireFs(get().fs), parentDir)
    await afterFsMutation(get)
    return path
  },

  createShortcutOnDesktop: async (targetPath, label) => {
    const path = await createDesktopShortcut(requireFs(get().fs), targetPath, label)
    await afterFsMutation(get)
    return path
  },
}))

export function isDesktopPath(path: string): boolean {
  const n = normalizePath(path)
  return n === '/desktop' || n.startsWith('/desktop/')
}

export function isDesktopShortcutPath(path: string): boolean {
  return extension(normalizePath(path)) === '.desktop' && isDesktopPath(path)
}

export function isDirectDesktopFile(path: string): boolean {
  return isDesktopPath(path) && !isDesktopShortcutPath(path)
}
