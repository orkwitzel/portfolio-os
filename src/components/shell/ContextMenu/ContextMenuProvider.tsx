import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { ContextMenuContext, type ContextMenuApi } from './contextMenuContext'
import type { ContextMenuEntryDef, ContextMenuState } from './ContextMenu.types'

const CLOSED: ContextMenuState = {
  open: false,
  clientX: 0,
  clientY: 0,
  items: [],
}

export function ContextMenuProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ContextMenuState>(CLOSED)
  const menuRef = useRef<HTMLDivElement>(null)

  const closeMenu = useCallback(() => setState(CLOSED), [])

  const openMenu = useCallback((clientX: number, clientY: number, items: ContextMenuEntryDef[]) => {
    if (items.length === 0) {
      closeMenu()
      return
    }
    setState({ open: true, clientX, clientY, items })
  }, [closeMenu])

  const isOpen = useCallback(() => state.open, [state.open])

  useEffect(() => {
    if (!state.open) return

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (menuRef.current?.contains(target)) return
      closeMenu()
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu()
    }

    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [state.open, closeMenu])

  useLayoutEffect(() => {
    if (!state.open || !menuRef.current) return
    const rect = menuRef.current.getBoundingClientRect()
    let left = state.clientX
    let top = state.clientY
    if (left + rect.width > window.innerWidth) {
      left = Math.max(0, window.innerWidth - rect.width - 4)
    }
    if (top + rect.height > window.innerHeight) {
      top = Math.max(0, window.innerHeight - rect.height - 4)
    }
    menuRef.current.style.left = `${left}px`
    menuRef.current.style.top = `${top}px`
  }, [state.open, state.clientX, state.clientY, state.items])

  const api: ContextMenuApi = {
    state,
    menuRef,
    openMenu,
    closeMenu,
    isOpen,
  }

  return (
    <ContextMenuContext.Provider value={api}>{children}</ContextMenuContext.Provider>
  )
}
