import { create } from 'zustand'
import type { FsStore } from '@/store/fsStore'
import { isDesktopShortcutPath, isDesktopPath } from '@/store/fsStore'
import { normalizePath } from '@/utils/paths'
import type { FsApi } from '@/fs/fsDb'

export type ShellClipboardEntry = {
  mode: 'copy' | 'cut'
  paths: string[]
}

type ShellClipboardState = {
  clipboard: ShellClipboardEntry | null
}

type ShellClipboardActions = {
  copy: (paths: string[]) => void
  cut: (paths: string[]) => void
  clear: () => void
  hasContent: () => boolean
  pasteToDesktop: (fs: FsApi, fsStore: FsStore) => Promise<void>
  pasteToDirectory: (destDir: string, fs: FsApi, fsStore: FsStore) => Promise<void>
}

export type ShellClipboardStore = ShellClipboardState & ShellClipboardActions

export const useShellClipboard = create<ShellClipboardStore>((set, get) => ({
  clipboard: null,

  copy: (paths) => {
    const normalized = paths.map(normalizePath).filter(Boolean)
    if (normalized.length === 0) return
    set({ clipboard: { mode: 'copy', paths: normalized } })
  },

  cut: (paths) => {
    const normalized = paths.map(normalizePath).filter(Boolean)
    if (normalized.length === 0) return
    set({ clipboard: { mode: 'cut', paths: normalized } })
  },

  clear: () => set({ clipboard: null }),

  hasContent: () => get().clipboard !== null && get().clipboard!.paths.length > 0,

  pasteToDesktop: async (fs, fsStore) => {
    const clip = get().clipboard
    if (!clip) return

    const created: string[] = []
    for (const src of clip.paths) {
      if (isDesktopShortcutPath(src)) {
        const dest = await fs.duplicateNode(src, '/desktop')
        created.push(dest)
      } else {
        const node = await fs.getNode(src)
        if (!node) continue
        if (clip.mode === 'cut' && !isDesktopPath(src)) {
          const moved = await fsStore.movePath(src, '/desktop')
          created.push(moved)
        } else if (clip.mode === 'cut' && isDesktopPath(src)) {
          created.push(src)
        } else {
          const dup = await fs.duplicateNode(src, '/desktop')
          created.push(dup)
        }
      }
    }

    if (clip.mode === 'cut') {
      for (const src of clip.paths) {
        if (!created.includes(src)) {
          try {
            await fsStore.deletePath(src)
          } catch {
            /* source may have been moved */
          }
        }
      }
      set({ clipboard: null })
    }
    await fsStore.refreshNodes()
    fsStore.bumpDesktopRevision()
  },

  pasteToDirectory: async (destDir, fs, fsStore) => {
    const clip = get().clipboard
    if (!clip) return
    const dest = normalizePath(destDir)
    const node = await fs.getNode(dest)
    if (!node || node.kind !== 'directory') return

    for (const src of clip.paths) {
      if (isDesktopShortcutPath(src)) {
        const content = await fs.readFile(src)
        const parsed = JSON.parse(content) as { path?: string }
        if (parsed.path) {
          const target = await fs.getNode(parsed.path)
          if (target) {
            await fs.duplicateNode(parsed.path, dest)
          }
        }
        continue
      }
      if (clip.mode === 'cut') {
        await fsStore.movePath(src, dest)
      } else {
        await fsStore.duplicatePath(src, dest)
      }
    }

    if (clip.mode === 'cut') {
      set({ clipboard: null })
    }
    await fsStore.refreshNodes()
    fsStore.bumpDesktopRevision()
  },
}))
