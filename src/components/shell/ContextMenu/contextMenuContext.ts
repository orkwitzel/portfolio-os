import { createContext, useContext } from 'react'
import type { RefObject } from 'react'
import type { ContextMenuEntryDef, ContextMenuState } from './ContextMenu.types'

export type ContextMenuApi = {
  state: ContextMenuState
  menuRef: RefObject<HTMLDivElement | null>
  openMenu: (clientX: number, clientY: number, items: ContextMenuEntryDef[]) => void
  closeMenu: () => void
  isOpen: () => boolean
}

export const ContextMenuContext = createContext<ContextMenuApi | null>(null)

export function useContextMenuApi(): ContextMenuApi {
  const ctx = useContext(ContextMenuContext)
  if (!ctx) throw new Error('useContextMenuApi must be used within ContextMenuProvider')
  return ctx
}

export function useContextMenuOptional(): ContextMenuApi | null {
  return useContext(ContextMenuContext)
}
