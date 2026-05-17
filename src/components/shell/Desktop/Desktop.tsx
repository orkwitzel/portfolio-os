import { useEffect, useRef, type RefObject } from 'react'
import { ShellIcon } from '@/components/shell/ShellIcon'
import { WindowLayer } from '@/components/wm/WindowLayer'
import { gridToPx } from '@/utils/desktopLayout'
import {
  useDesktop,
  type DesktopProps,
  type DesktopShortcut,
  type DragState,
} from './Desktop.logic'
import {
  MarqueeRect,
  RenameInput,
  Shortcut,
  ShortcutGhost,
  ShortcutLabel,
  Shortcuts,
  Workspace,
} from './Desktop.style'

function DragGhosts({
  drag,
  items,
}: {
  drag: DragState
  items: DesktopShortcut[]
}) {
  const pivotOrigin = drag.origins.get(drag.pivotId)
  if (!pivotOrigin) return null

  const dCol = drag.ghostGrid.gridX - pivotOrigin.gridX
  const dRow = drag.ghostGrid.gridY - pivotOrigin.gridY

  return Array.from(drag.origins.entries()).map(([itemId, origin]) => {
    const item = items.find((i) => i.id === itemId)
    if (!item) return null
    const { left, top } = gridToPx(origin.gridX + dCol, origin.gridY + dRow)
    return (
      <ShortcutGhost key={`ghost-${itemId}`} style={{ left, top }}>
        <ShellIcon source={item.icon} size="desktop" />
        <ShortcutLabel>{item.label}</ShortcutLabel>
      </ShortcutGhost>
    )
  })
}

function DesktopShortcutView({
  item,
  selected,
  dragging,
  renaming,
  onPointerDown,
  onDoubleClick,
  onContextMenu,
  onCommitRename,
  onCancelRename,
}: {
  item: DesktopShortcut
  selected: boolean
  dragging: boolean
  renaming: boolean
  onPointerDown: (e: React.PointerEvent, id: string) => void
  onDoubleClick: (id: string) => void
  onContextMenu: (e: React.MouseEvent, id: string) => void
  onCommitRename: (id: string, label: string) => void
  onCancelRename: () => void
}) {
  const { left, top } = gridToPx(item.gridX, item.gridY)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (renaming) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [renaming])

  return (
    <Shortcut
      type="button"
      data-desktop-id={item.id}
      $selected={selected}
      $dragging={dragging}
      style={{ left, top, zIndex: dragging ? 10 : undefined }}
      aria-selected={selected}
      onPointerDown={(e) => onPointerDown(e, item.id)}
      onDoubleClick={() => onDoubleClick(item.id)}
      onContextMenu={(e) => onContextMenu(e, item.id)}
    >
      <ShellIcon source={item.icon} size="desktop" />
      {renaming ? (
        <RenameInput
          ref={inputRef}
          defaultValue={item.label}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            e.stopPropagation()
            if (e.key === 'Enter') {
              onCommitRename(item.id, (e.target as HTMLInputElement).value)
            }
            if (e.key === 'Escape') onCancelRename()
          }}
          onBlur={(e) => onCommitRename(item.id, e.target.value)}
        />
      ) : (
        <ShortcutLabel>{item.label}</ShortcutLabel>
      )}
    </Shortcut>
  )
}

export function Desktop(props: DesktopProps) {
  const vm = useDesktop(props)
  const { workspaceRef } = props

  return (
    <Workspace
      ref={workspaceRef as RefObject<HTMLDivElement>}
      data-desktop-workspace
      onPointerDown={vm.handleWorkspacePointerDown}
      onContextMenu={vm.handleWorkspaceContextMenu}
    >
      <Shortcuts>
        {vm.state.items.map((item) => (
          <DesktopShortcutView
            key={item.id}
            item={item}
            selected={vm.state.selection.selectedIds.has(item.id)}
            dragging={
              vm.state.drag?.active === true &&
              vm.state.selection.selectedIds.has(item.id)
            }
            renaming={vm.renamingId === item.id}
            onPointerDown={vm.handleIconPointerDown}
            onDoubleClick={vm.handleIconDoubleClick}
            onContextMenu={vm.handleIconContextMenu}
            onCommitRename={vm.commitRename}
            onCancelRename={vm.cancelRename}
          />
        ))}
        {vm.state.drag?.active && (
          <DragGhosts drag={vm.state.drag} items={vm.state.items} />
        )}
      </Shortcuts>
      {vm.marqueeStyle && <MarqueeRect style={vm.marqueeStyle} />}
      <WindowLayer />
    </Workspace>
  )
}
