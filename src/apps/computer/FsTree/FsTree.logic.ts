import { useMemo, useState } from 'react'
import type { FsNode } from '@/fs/types'
import { sortNodesForTree } from '@/fs/desktop'

export type FsTreeProps = {
  nodes: FsNode[]
  selectedPath: string | null
  onSelectFile: (path: string) => void
}

export function childrenOf(nodes: FsNode[], parentPath: string): FsNode[] {
  return sortNodesForTree(nodes.filter((n) => n.parentPath === parentPath))
}

export function useFsTree({ nodes }: FsTreeProps) {
  const rootKids = useMemo(() => childrenOf(nodes, '/'), [nodes])
  return { rootKids, nodes }
}

export function useTreeNodeExpansion(depth: number) {
  return useState(depth < 2)
}
