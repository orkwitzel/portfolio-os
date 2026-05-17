import { ShellIcon } from '@/components/shell/ShellIcon'
import {
  START_MENU_ID,
  useStartMenu,
  type StartMenuItemProps,
  type StartMenuProps,
} from './StartMenu.logic'
import { Divider, Item, ItemLabel, List, Panel } from './StartMenu.style'

export { START_MENU_ID } from './StartMenu.logic'

function StartMenuItem({ label, icon, onActivate }: StartMenuItemProps) {
  return (
    <Item type="button" role="menuitem" onClick={onActivate}>
      <ShellIcon source={icon} size="menu" />
      <ItemLabel>{label}</ItemLabel>
    </Item>
  )
}

export function StartMenu(props: StartMenuProps) {
  const { open, menuRef, position, programs, links, activate } = useStartMenu(props)

  if (!open || !position) return null

  return (
    <Panel
      ref={menuRef}
      id={START_MENU_ID}
      role="menu"
      aria-labelledby={props.startButtonId}
      style={{ left: position.left, bottom: position.bottom }}
    >
      <List>
        {programs.map((item) => (
          <li key={item.id}>
            <StartMenuItem
              label={item.label}
              icon={item.icon}
              onActivate={() => activate(item.launch)}
            />
          </li>
        ))}
        {links.length > 0 ? <Divider role="separator" /> : null}
        {links.map((item) => (
          <li key={item.id}>
            <StartMenuItem
              label={item.label}
              icon={item.icon}
              onActivate={() => activate(item.launch)}
            />
          </li>
        ))}
      </List>
    </Panel>
  )
}
