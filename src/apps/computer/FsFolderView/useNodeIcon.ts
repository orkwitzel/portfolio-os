import { useEffect, useState } from 'react'
import { placeholderIcon, type IconSource } from '@/components/shell/ShellIcon'
import type { FsNode } from '@/fs/types'
import { resolveNodeIcon } from '@/fs/nodeIcons'
import { useFsStore } from '@/store/fsStore'
import { useWindowManager } from '@/hooks/useWindowManager'

export function useNodeIcon(node: FsNode): IconSource {
  const fs = useFsStore((s) => s.fs)
  const ready = useFsStore((s) => s.ready)
  const wm = useWindowManager()
  const registry = wm.registry
  const [icon, setIcon] = useState<IconSource>(placeholderIcon)

  useEffect(() => {
    if (!ready || !fs) return

    let cancelled = false
    void resolveNodeIcon(node, fs, registry).then((resolved) => {
      if (!cancelled) setIcon(resolved)
    })

    return () => {
      cancelled = true
    }
  }, [node, fs, ready, registry])

  return icon
}
