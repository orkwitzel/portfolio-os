export type AppMenuSeparator = { type: 'separator' }

export type AppMenuItemDef = {
  id: string
  label: string
  shortcut?: string
  disabled?: boolean
  checked?: boolean
  onSelect: () => void
}

export type AppMenuEntryDef = AppMenuItemDef | AppMenuSeparator

export type AppMenuDef = {
  id: string
  label: string
  items: AppMenuEntryDef[]
}

export function isMenuSeparator(entry: AppMenuEntryDef): entry is AppMenuSeparator {
  return 'type' in entry && entry.type === 'separator'
}
