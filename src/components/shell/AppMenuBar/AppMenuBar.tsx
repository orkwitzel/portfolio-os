import { useRef } from 'react'
import {
  Divider,
  DropdownPanel,
  Item,
  ItemLabel,
  List,
  MenuBar,
  MenuTopBtn,
  ShortcutHint,
} from './AppMenuBar.style'
import { useAppMenuBar } from './AppMenuBar.logic'
import type { AppMenuDef } from './AppMenuBar.types'
import type { AppMenuItemDef } from './AppMenuBar.types'

export type AppMenuBarProps = {
  menus: AppMenuDef[]
}

function MenuDropdownItem({
  item,
  onSelect,
}: {
  item: AppMenuItemDef
  onSelect: (item: AppMenuItemDef) => void
}) {
  const label = item.checked ? `✓ ${item.label}` : item.label
  return (
    <Item
      type="button"
      role="menuitem"
      $disabled={item.disabled}
      disabled={item.disabled}
      onClick={() => onSelect(item)}
    >
      <ItemLabel>{label}</ItemLabel>
      {item.shortcut ? <ShortcutHint>{item.shortcut}</ShortcutHint> : null}
    </Item>
  )
}

export default function AppMenuBar({ menus }: AppMenuBarProps) {
  const barRef = useRef<HTMLDivElement>(null)
  const vm = useAppMenuBar({ menus, barRef })

  return (
    <>
      <MenuBar ref={barRef}>
        {vm.menus.map((menu) => (
          <MenuTopBtn
            key={menu.id}
            type="button"
            data-menu-id={menu.id}
            $open={vm.openMenu?.id === menu.id}
            onClick={(e) => vm.toggleMenu(menu.id, e.currentTarget)}
            onMouseEnter={(e) => {
              if (vm.openMenu) vm.openMenuAt(menu.id, e.currentTarget)
            }}
          >
            {menu.label}
          </MenuTopBtn>
        ))}
      </MenuBar>
      {vm.openMenu && vm.anchorRect ? (
        <DropdownPanel
          data-app-menu-dropdown
          $zIndex={25500}
          role="menu"
          style={{ left: vm.anchorRect.left, top: vm.anchorRect.bottom }}
        >
          <List>
            {vm.openMenu.items.map((entry, i) => (
              <li key={vm.isMenuSeparator(entry) ? `sep-${i}` : entry.id}>
                {vm.isMenuSeparator(entry) ? (
                  <Divider role="separator" />
                ) : (
                  <MenuDropdownItem item={entry} onSelect={vm.selectItem} />
                )}
              </li>
            ))}
          </List>
        </DropdownPanel>
      ) : null}
    </>
  )
}
