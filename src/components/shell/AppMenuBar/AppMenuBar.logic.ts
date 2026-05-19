import { useCallback, useEffect, useState, type RefObject } from 'react'
import type { AppMenuDef, AppMenuItemDef } from './AppMenuBar.types'
import { isMenuSeparator } from './AppMenuBar.types'

export type AppMenuBarProps = {
  menus: AppMenuDef[]
  barRef: RefObject<HTMLDivElement | null>
}

export function useAppMenuBar({ menus, barRef }: AppMenuBarProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null)

  const closeMenu = useCallback(() => {
    setOpenMenuId(null)
    setAnchorRect(null)
  }, [])

  const openMenuAt = useCallback((menuId: string, el: HTMLElement) => {
    const rect = el.getBoundingClientRect()
    setOpenMenuId(menuId)
    setAnchorRect(rect)
  }, [])

  const toggleMenu = useCallback(
    (menuId: string, el: HTMLElement) => {
      if (openMenuId === menuId) {
        closeMenu()
        return
      }
      openMenuAt(menuId, el)
    },
    [openMenuId, closeMenu, openMenuAt],
  )

  useEffect(() => {
    if (!openMenuId) return

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (barRef.current?.contains(target)) return
      const panel = document.querySelector('[data-app-menu-dropdown]')
      if (panel?.contains(target)) return
      closeMenu()
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu()
    }

    window.addEventListener('pointerdown', onPointerDown, true)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown, true)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [openMenuId, closeMenu])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!e.altKey || e.ctrlKey || e.metaKey) return
      const key = e.key.toLowerCase()
      if (key.length !== 1) return
      const menu = menus.find((m) => m.label.toLowerCase().startsWith(key))
      if (!menu) return
      const btn = barRef.current?.querySelector<HTMLButtonElement>(
        `[data-menu-id="${menu.id}"]`,
      )
      if (!btn) return
      e.preventDefault()
      openMenuAt(menu.id, btn)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menus, openMenuAt])

  const openMenu = menus.find((m) => m.id === openMenuId)

  const selectItem = useCallback(
    (item: AppMenuItemDef) => {
      if (item.disabled) return
      closeMenu()
      item.onSelect()
    },
    [closeMenu],
  )

  return {
    menus,
    openMenu,
    anchorRect,
    toggleMenu,
    openMenuAt,
    closeMenu,
    selectItem,
    isMenuSeparator,
  }
}
