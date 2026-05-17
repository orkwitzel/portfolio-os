import {
  Divider,
  Item,
  ItemLabel,
  List,
  Panel,
  SubmenuArrow,
  SubmenuPanel,
  SubmenuWrap,
} from '@/components/shell/ShellMenu'
import { useContextMenuApi } from './contextMenuContext'
import { ContextMenuProvider } from './ContextMenuProvider'
import type { ContextMenuEntryDef } from './ContextMenu.types'

function MenuEntry({ entry, onClose }: { entry: ContextMenuEntryDef; onClose: () => void }) {
  if (entry.type === 'separator') {
    return <Divider role="separator" />
  }

  if (entry.type === 'submenu') {
    return (
      <SubmenuWrap>
        <Item type="button" tabIndex={-1}>
          <ItemLabel>{entry.label}</ItemLabel>
          <SubmenuArrow aria-hidden>▶</SubmenuArrow>
        </Item>
        <SubmenuPanel $zIndex={26001} role="menu">
          <List>
            {entry.items.map((child, i) => (
              <li key={child.type === 'separator' ? `sep-${i}` : child.id}>
                <MenuEntry entry={child} onClose={onClose} />
              </li>
            ))}
          </List>
        </SubmenuPanel>
      </SubmenuWrap>
    )
  }

  return (
    <Item
      type="button"
      role="menuitem"
      $disabled={entry.disabled}
      disabled={entry.disabled}
      onClick={() => {
        if (entry.disabled) return
        entry.onSelect()
        onClose()
      }}
    >
      <ItemLabel>{entry.label}</ItemLabel>
    </Item>
  )
}

function ContextMenuPanel() {
  const { state, menuRef, closeMenu } = useContextMenuApi()
  if (!state.open) return null

  return (
    <Panel
      ref={menuRef}
      $zIndex={26000}
      role="menu"
      style={{ left: state.clientX, top: state.clientY }}
    >
      <List>
        {state.items.map((entry, i) => (
          <li key={entry.type === 'separator' ? `sep-${i}` : entry.id}>
            <MenuEntry entry={entry} onClose={closeMenu} />
          </li>
        ))}
      </List>
    </Panel>
  )
}

export function ContextMenuRoot({ children }: { children: React.ReactNode }) {
  return (
    <ContextMenuProvider>
      {children}
      <ContextMenuPanel />
    </ContextMenuProvider>
  )
}
