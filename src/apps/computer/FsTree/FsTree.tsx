import {
  childrenOf,
  useFsTree,
  useTreeExpansion,
  type FsTreeProps,
} from './FsTree.logic'
import {
  TreeItem,
  TreeLabel,
  TreeList,
  TreeRow,
  TreeScroll,
  TreeToggle,
} from '@/apps/computer/computer.style'
import type { FsNode } from '@/fs/types'
import { normalizePath } from '@/utils/paths'

function TreeNode({
  node,
  nodes,
  depth,
  currentDir,
  selectedPath,
  isExpanded,
  toggle,
  onNavigate,
  onSelectFile,
}: {
  node: FsNode
  nodes: FsNode[]
  depth: number
  currentDir: string
  selectedPath: string | null
  isExpanded: (path: string) => boolean
  toggle: (path: string) => void
  onNavigate: (path: string) => void
  onSelectFile: (path: string) => void
}) {
  const kids = childrenOf(nodes, node.path)
  const isDir = node.kind === 'directory'
  const dir = normalizePath(currentDir)
  const selected =
    isDir ? dir === node.path : selectedPath === node.path
  const expanded = isExpanded(node.path)

  if (isDir) {
    const hasKids = kids.length > 0
    return (
      <TreeItem>
        <TreeRow $selected={selected} style={{ paddingLeft: 4 + depth * 12 }}>
          {hasKids ? (
            <TreeToggle
              type="button"
              aria-expanded={expanded}
              aria-label={expanded ? 'Collapse' : 'Expand'}
              onClick={(e) => {
                e.stopPropagation()
                toggle(node.path)
              }}
            >
              {expanded ? '▼' : '▶'}
            </TreeToggle>
          ) : (
            <span style={{ flex: '0 0 14px' }} />
          )}
          <TreeLabel
            type="button"
            data-fs-path={node.path}
            onClick={() => onNavigate(node.path)}
          >
            {node.name === '/' ? '/' : node.name}
          </TreeLabel>
        </TreeRow>
        {expanded && hasKids ? (
          <TreeList>
            {kids.map((child) => (
              <TreeNode
                key={child.path}
                node={child}
                nodes={nodes}
                depth={depth + 1}
                currentDir={currentDir}
                selectedPath={selectedPath}
                isExpanded={isExpanded}
                toggle={toggle}
                onNavigate={onNavigate}
                onSelectFile={onSelectFile}
              />
            ))}
          </TreeList>
        ) : null}
      </TreeItem>
    )
  }

  return (
    <TreeItem>
      <TreeRow $selected={selected} style={{ paddingLeft: 4 + depth * 12 }}>
        <span style={{ flex: '0 0 14px' }} />
        <TreeLabel
          type="button"
          data-fs-path={node.path}
          onClick={() => onSelectFile(node.path)}
        >
          {node.name}
        </TreeLabel>
      </TreeRow>
    </TreeItem>
  )
}

export default function FsTree(props: FsTreeProps) {
  const { rootKids, nodes } = useFsTree(props)
  const { isExpanded, toggle } = useTreeExpansion(props.currentDir)

  return (
    <TreeScroll>
      <TreeList>
        {rootKids.map((node) => (
          <TreeNode
            key={node.path}
            node={node}
            nodes={nodes}
            depth={0}
            currentDir={props.currentDir}
            selectedPath={props.selectedPath}
            isExpanded={isExpanded}
            toggle={toggle}
            onNavigate={props.onNavigate}
            onSelectFile={props.onSelectFile}
          />
        ))}
      </TreeList>
    </TreeScroll>
  )
}
