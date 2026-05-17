import { create } from 'zustand'
import type { AppDefinition } from '../desktop/sessionTypes'
import type { IconSource } from '../desktop/icons/types'
import type { WindowManagerApi } from '../desktop/windowManagerContext'
import { listDesktopEntries, resolveDesktopIcon, updateDesktopPositions } from './desktop'
import { openPath as routeOpenPath } from './extensionRouter'
import { openFs, type FsApi } from './fsDb'
import type { DesktopEntry, FsNode } from './types'

type FsStoreState = {
  ready: boolean
  fs: FsApi | null
  nodes: FsNode[]
  wm: WindowManagerApi | null
  registry: Map<string, AppDefinition> | null
}

type FsStoreActions = {
  bindShell: (ctx: {
    wm: WindowManagerApi
    registry: Map<string, AppDefinition>
  }) => void
  init: () => Promise<void>
  refreshNodes: () => Promise<void>
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

export const useFsStore = create<FsStore>((set, get) => ({
  ready: false,
  fs: null,
  nodes: [],
  wm: null,
  registry: null,

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

  listDesktopEntries: async () => listDesktopEntries(requireFs(get().fs)),

  listAllNodes: async () => requireFs(get().fs).getAllNodes(),

  readFile: async (path) => requireFs(get().fs).readFile(path),

  writeFile: async (path, content) => {
    await requireFs(get().fs).writeFile(path, content)
    await get().refreshNodes()
  },

  mkdir: async (path) => {
    await requireFs(get().fs).mkdir(path)
    await get().refreshNodes()
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
}))
