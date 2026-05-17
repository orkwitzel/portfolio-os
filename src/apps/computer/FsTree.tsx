import { useMemo, useState } from 'react'
import type { FsNode } from '../../fs/types'
import { sortNodesForTree } from '../../fs/desktop'
import styles from './computer.module.css'

type TreeProps = {
  nodes: FsNode[]
  selectedPath: string | null
  onSelectFile: (path: string) => void
}

function childrenOf(nodes: FsNode[], parentPath: string): FsNode[] {
  return sortNodesForTree(nodes.filter((n) => n.parentPath === parentPath))
}

function TreeNode({
  node,
  nodes,
  depth,
  selectedPath,
  onSelectFile,
}: {
  node: FsNode
  nodes: FsNode[]
  depth: number
  selectedPath: string | null
  onSelectFile: (path: string) => void
}) {
  const [expanded, setExpanded] = useState(depth < 2)
  const kids = childrenOf(nodes, node.path)
  const isDir = node.kind === 'directory'

  if (isDir) {
    return (
      <li className={styles.treeItem}>
        <button
          type="button"
          className={styles.treeButton}
          style={{ paddingLeft: 4 + depth * 12 }}
          aria-expanded={expanded}
          onClick={() => setExpanded((e) => !e)}
        >
          <span className={styles.treeToggle}>{expanded ? '▼' : '▶'}</span>
          <span>{node.name === '/' ? '/' : node.name}</span>
        </button>
        {expanded && kids.length > 0 ? (
          <ul className={styles.treeList}>
            {kids.map((child) => (
              <TreeNode
                key={child.path}
                node={child}
                nodes={nodes}
                depth={depth + 1}
                selectedPath={selectedPath}
                onSelectFile={onSelectFile}
              />
            ))}
          </ul>
        ) : null}
      </li>
    )
  }

  const selected = selectedPath === node.path
  return (
    <li className={styles.treeItem}>
      <button
        type="button"
        className={`${styles.treeButton} ${selected ? styles.treeButtonSelected : ''}`}
        style={{ paddingLeft: 4 + depth * 12 }}
        aria-current={selected ? 'true' : undefined}
        onClick={() => onSelectFile(node.path)}
      >
        <span className={styles.treeSpacer} />
        <span>{node.name}</span>
      </button>
    </li>
  )
}

export function FsTree({ nodes, selectedPath, onSelectFile }: TreeProps) {
  const rootKids = useMemo(() => childrenOf(nodes, '/'), [nodes])

  return (
    <div className={styles.treeScroll}>
      <ul className={styles.treeList}>
        {rootKids.map((node) => (
          <TreeNode
            key={node.path}
            node={node}
            nodes={nodes}
            depth={0}
            selectedPath={selectedPath}
            onSelectFile={onSelectFile}
          />
        ))}
      </ul>
    </div>
  )
}
