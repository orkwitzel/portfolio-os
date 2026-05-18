import { ShellIcon } from '@/components/shell/ShellIcon'
import type { FsNode } from '@/fs/types'
import {
  FolderGrid,
  FolderItem,
  FolderItemLabel,
  FolderView,
} from '@/apps/computer/computer.style'
import { useNodeIcon } from './useNodeIcon'

function FolderItemView({
  node,
  selected,
  onSelect,
  onOpen,
}: {
  node: FsNode
  selected: boolean
  onSelect: (path: string) => void
  onOpen: (path: string) => void
}) {
  const icon = useNodeIcon(node)

  return (
    <FolderItem
      type="button"
      data-fs-path={node.path}
      $selected={selected}
      onClick={() => onSelect(node.path)}
      onDoubleClick={() => onOpen(node.path)}
    >
      <ShellIcon source={icon} size="desktop" />
      <FolderItemLabel>{node.name}</FolderItemLabel>
    </FolderItem>
  )
}

export type FsFolderViewProps = {
  currentDir: string
  children: FsNode[]
  selectedPath: string | null
  onSelect: (path: string) => void
  onOpen: (path: string) => void
}

export default function FsFolderView({
  currentDir,
  children,
  selectedPath,
  onSelect,
  onOpen,
}: FsFolderViewProps) {
  return (
    <FolderView data-fs-folder-pane data-current-dir={currentDir}>
      <FolderGrid>
        {children.map((node) => (
          <FolderItemView
            key={node.path}
            node={node}
            selected={selectedPath === node.path}
            onSelect={onSelect}
            onOpen={onOpen}
          />
        ))}
      </FolderGrid>
    </FolderView>
  )
}
