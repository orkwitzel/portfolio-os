import {
  childrenOf,
  useFsTree,
  useTreeNodeExpansion,
  type FsTreeProps,
} from './FsTree.logic'
import {
  TreeButton,
  TreeItem,
  TreeList,
  TreeScroll,
  TreeSpacer,
  TreeToggle,
} from '@/apps/computer/computer.style'
import type { FsNode } from '@/fs/types'

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
  const [expanded, setExpanded] = useTreeNodeExpansion(depth)
  const kids = childrenOf(nodes, node.path)
  const isDir = node.kind === 'directory'

  if (isDir) {
    return (
      <TreeItem>
        <TreeButton
          type="button"
          data-fs-path={node.path}
          style={{ paddingLeft: 4 + depth * 12 }}
          aria-expanded={expanded}
          onClick={() => setExpanded((e) => !e)}
        >
          <TreeToggle>{expanded ? '▼' : '▶'}</TreeToggle>
          <span>{node.name === '/' ? '/' : node.name}</span>
        </TreeButton>
        {expanded && kids.length > 0 ? (
          <TreeList>
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
          </TreeList>
        ) : null}
      </TreeItem>
    )
  }

  const selected = selectedPath === node.path
  return (
    <TreeItem>
      <TreeButton
        type="button"
        data-fs-path={node.path}
        $selected={selected}
        style={{ paddingLeft: 4 + depth * 12 }}
        aria-current={selected ? 'true' : undefined}
        onClick={() => onSelectFile(node.path)}
      >
        <TreeSpacer />
        <span>{node.name}</span>
      </TreeButton>
    </TreeItem>
  )
}

export default function FsTree(props: FsTreeProps) {
  const { rootKids, nodes } = useFsTree(props)

  return (
    <TreeScroll>
      <TreeList>
        {rootKids.map((node) => (
          <TreeNode
            key={node.path}
            node={node}
            nodes={nodes}
            depth={0}
            selectedPath={props.selectedPath}
            onSelectFile={props.onSelectFile}
          />
        ))}
      </TreeList>
    </TreeScroll>
  )
}
