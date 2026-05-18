import { useEffect, useMemo, useState } from 'react'
import type { FsNode } from '@/fs/types'
import { sortNodesForTree } from '@/fs/desktop'
import { normalizePath } from '@/utils/paths'

export type FsTreeProps = {
  nodes: FsNode[]
  currentDir: string
  selectedPath: string | null
  onNavigate: (path: string) => void
  onSelectFile: (path: string) => void
}

export function childrenOf(nodes: FsNode[], parentPath: string): FsNode[] {
  return sortNodesForTree(nodes.filter((n) => n.parentPath === parentPath))
}

export function useFsTree({ nodes }: FsTreeProps) {
  const rootKids = useMemo(() => childrenOf(nodes, '/'), [nodes])
  return { rootKids, nodes }
}

/** Paths that must be expanded to reveal `targetDir`. */
export function ancestorDirs(targetDir: string): string[] {
  const normalized = normalizePath(targetDir)
  if (normalized === '/') return ['/']

  const parts = normalized.split('/').filter(Boolean)
  const dirs: string[] = ['/']
  let acc = ''
  for (const part of parts) {
    acc += `/${part}`
    dirs.push(acc)
  }
  return dirs
}

export function useTreeExpansion(currentDir: string) {
  const required = useMemo(() => new Set(ancestorDirs(currentDir)), [currentDir])
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(['/', ...ancestorDirs(currentDir)]))

  useEffect(() => {
    setExpanded((prev) => {
      const next = new Set(prev)
      for (const dir of required) next.add(dir)
      return next
    })
  }, [required])

  const toggle = (path: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return next
    })
  }

  const isExpanded = (path: string) => expanded.has(path)

  return { isExpanded, toggle }
}
