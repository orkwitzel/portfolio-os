import type { RefObject } from 'react'
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
  onPointerDown,
  onDoubleClick,
}: {
  item: DesktopShortcut
  selected: boolean
  dragging: boolean
  onPointerDown: (e: React.PointerEvent, id: string) => void
  onDoubleClick: (id: string) => void
}) {
  const { left, top } = gridToPx(item.gridX, item.gridY)

  return (
    <Shortcut
      type="button"
      $selected={selected}
      $dragging={dragging}
      style={{ left, top, zIndex: dragging ? 10 : undefined }}
      aria-selected={selected}
      onPointerDown={(e) => onPointerDown(e, item.id)}
      onDoubleClick={() => onDoubleClick(item.id)}
    >
      <ShellIcon source={item.icon} size="desktop" />
      <ShortcutLabel>{item.label}</ShortcutLabel>
    </Shortcut>
  )
}

export function Desktop(props: DesktopProps) {
  const vm = useDesktop(props)
  const { workspaceRef } = props

  return (
    <Workspace
      ref={workspaceRef as RefObject<HTMLDivElement>}
      onPointerDown={vm.handleWorkspacePointerDown}
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
            onPointerDown={vm.handleIconPointerDown}
            onDoubleClick={vm.handleIconDoubleClick}
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
