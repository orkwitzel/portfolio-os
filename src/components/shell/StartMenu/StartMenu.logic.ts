import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from 'react'
import { useFsStore } from '@/store/fsStore'
import type { IconSource } from '@/components/shell/ShellIcon'
import { buildProgramItems, buildStartLinkItems } from '@/utils/shellCatalog'
import type { ShellLaunchItem } from '@/utils/shellCatalog'
import { useWindowManager } from '@/hooks/useWindowManager'

export const START_MENU_ID = 'start-menu'

export type StartMenuProps = {
  open: boolean
  onClose: () => void
  anchorRef: RefObject<HTMLButtonElement | null>
  startButtonId: string
}

export function useStartMenu({ open, onClose, anchorRef, startButtonId }: StartMenuProps) {
  const wm = useWindowManager()
  const ready = useFsStore((s) => s.ready)
  const listDesktopEntries = useFsStore((s) => s.listDesktopEntries)
  const openPath = useFsStore((s) => s.openPath)
  const resolveDesktopIcon = useFsStore((s) => s.resolveDesktopIcon)
  const menuRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<{ left: number; bottom: number } | null>(null)
  const [links, setLinks] = useState<ShellLaunchItem[]>([])

  useEffect(() => {
    if (!ready) return
    let cancelled = false
    ;(async () => {
      const entries = await listDesktopEntries()
      const built = await buildStartLinkItems(entries, openPath, resolveDesktopIcon)
      if (!cancelled) setLinks(built)
    })()
    return () => {
      cancelled = true
    }
  }, [ready, listDesktopEntries, openPath, resolveDesktopIcon])

  const programs = buildProgramItems(wm)

  useLayoutEffect(() => {
    if (!open) return
    const el = anchorRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setPosition({
      left: rect.left,
      bottom: window.innerHeight - rect.top + 2,
    })
  }, [open, anchorRef])

  useEffect(() => {
    if (!open) return

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (menuRef.current?.contains(target)) return
      if (anchorRef.current?.contains(target)) return
      onClose()
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose, anchorRef])

  useEffect(() => {
    if (!open) return
    menuRef.current?.querySelector<HTMLButtonElement>('button')?.focus()
  }, [open])

  const activate = (launch: () => void) => {
    launch()
    onClose()
  }

  return {
    open,
    startButtonId,
    menuRef,
    position,
    programs,
    links,
    activate,
  }
}

export type StartMenuItemProps = {
  label: string
  icon: IconSource
  onActivate: () => void
}
