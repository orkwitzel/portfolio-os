import { useEffect, useState } from 'react'
import { placeholderIcon, type IconSource } from '@/components/shell/ShellIcon'
import type { FsNode } from '@/fs/types'
import { resolveNodeIcon } from '@/fs/nodeIcons'
import { useOs } from '@/hooks/useOs'
import { useFsStore } from '@/store/fsStore'

export function useNodeIcon(node: FsNode): IconSource {
  const os = useOs()
  const fs = useFsStore((s) => s.fs)
  const ready = useFsStore((s) => s.ready)
  const registry = os.win.registry
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
