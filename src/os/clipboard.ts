import type { OsDeps, OsClipboardApi } from './types'

/** @internal Creates the {@link OsClipboardApi} namespace. @see OsClipboardApi */
export function createClipboardApi(deps: OsDeps): OsClipboardApi {
  const { fsStore, clipboard } = deps

  return {
    copy: (paths) => clipboard.copy(paths),
    cut: (paths) => clipboard.cut(paths),
    hasContent: () => clipboard.hasContent(),
    pasteToDesktop: async () => {
      const fs = fsStore.fs
      if (!fs) return
      await clipboard.pasteToDesktop(fs, fsStore)
    },
    pasteToDirectory: async (destDir) => {
      const fs = fsStore.fs
      if (!fs) return
      await clipboard.pasteToDirectory(destDir, fs, fsStore)
    },
  }
}
