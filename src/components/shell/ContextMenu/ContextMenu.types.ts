export type ContextMenuItemDef = {
  type: 'item'
  id: string
  label: string
  disabled?: boolean
  onSelect: () => void
}

export type ContextMenuSeparatorDef = {
  type: 'separator'
}

export type ContextMenuSubmenuDef = {
  type: 'submenu'
  id: string
  label: string
  items: ContextMenuEntryDef[]
}

export type ContextMenuEntryDef =
  | ContextMenuItemDef
  | ContextMenuSeparatorDef
  | ContextMenuSubmenuDef

export type ContextMenuState = {
  open: boolean
  clientX: number
  clientY: number
  items: ContextMenuEntryDef[]
}
