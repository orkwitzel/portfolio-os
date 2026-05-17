import { useCallback, useEffect, useMemo, useState } from 'react'
import { useWindowManager } from '../desktop/windowManagerContext'
import { listDesktopEntries, resolveDesktopIcon } from './desktop'
import { openPath } from './extensionRouter'
import { openFs, type FsApi } from './fsDb'
import { FsContext, type FsProviderProps } from './fsContext'
import type { DesktopEntry, FsNode } from './types'
import type { IconSource } from '../desktop/icons/types'

export function FsProvider({ registry, children }: FsProviderProps) {
  const wm = useWindowManager()
  const [ready, setReady] = useState(false)
  const [fs, setFs] = useState<FsApi | null>(null)
  const [nodes, setNodes] = useState<FsNode[]>([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const api = await openFs()
      if (cancelled) return
      const all = await api.getAllNodes()
      setFs(api)
      setNodes(all)
      setReady(true)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const refreshNodes = useCallback(async () => {
    if (!fs) return
    setNodes(await fs.getAllNodes())
  }, [fs])

  const requireFs = useCallback((): FsApi => {
    if (!fs) throw new Error('Filesystem not ready')
    return fs
  }, [fs])

  const listDesktop = useCallback(async (): Promise<DesktopEntry[]> => {
    return listDesktopEntries(requireFs())
  }, [requireFs])

  const listAllNodes = useCallback(async (): Promise<FsNode[]> => {
    return requireFs().getAllNodes()
  }, [requireFs])

  const readFile = useCallback(
    async (path: string) => requireFs().readFile(path),
    [requireFs],
  )

  const writeFile = useCallback(
    async (path: string, content: string) => {
      await requireFs().writeFile(path, content)
      await refreshNodes()
    },
    [requireFs, refreshNodes],
  )

  const mkdir = useCallback(
    async (path: string) => {
      await requireFs().mkdir(path)
      await refreshNodes()
    },
    [requireFs, refreshNodes],
  )

  const listChildren = useCallback(
    async (dirPath: string) => requireFs().listChildren(dirPath),
    [requireFs],
  )

  const handleOpenPath = useCallback(
    async (path: string) => {
      await openPath(path, { wm, fs: requireFs() })
    },
    [requireFs, wm],
  )

  const handleResolveIcon = useCallback(
    async (entry: DesktopEntry): Promise<IconSource> => {
      return resolveDesktopIcon(entry, requireFs(), registry)
    },
    [requireFs, registry],
  )

  const value = useMemo(
    () => ({
      ready,
      fs,
      nodes,
      listDesktopEntries: listDesktop,
      listAllNodes,
      readFile,
      writeFile,
      mkdir,
      listChildren,
      openPath: handleOpenPath,
      resolveDesktopIcon: handleResolveIcon,
      refreshNodes,
    }),
    [
      ready,
      fs,
      nodes,
      listDesktop,
      listAllNodes,
      readFile,
      writeFile,
      mkdir,
      listChildren,
      handleOpenPath,
      handleResolveIcon,
      refreshNodes,
    ],
  )

  return <FsContext.Provider value={value}>{children}</FsContext.Provider>
}
