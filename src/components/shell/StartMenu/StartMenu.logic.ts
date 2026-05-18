import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from 'react'
import type { IconSource } from '@/components/shell/ShellIcon'
import { useOs } from '@/hooks/useOs'
import { useFsStore } from '@/store/fsStore'
import { buildProgramItems, buildStartLinkItems } from '@/utils/shellCatalog'
import type { ShellLaunchItem } from '@/utils/shellCatalog'

export const START_MENU_ID = 'start-menu'

export type StartMenuProps = {
  open: boolean
  onClose: () => void
  anchorRef: RefObject<HTMLButtonElement | null>
  startButtonId: string
}

export function useStartMenu({ open, onClose, anchorRef, startButtonId }: StartMenuProps) {
  const os = useOs()
  const ready = useFsStore((s) => s.ready)
  const menuRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<{ left: number; bottom: number } | null>(null)
  const [links, setLinks] = useState<ShellLaunchItem[]>([])

  useEffect(() => {
    if (!ready) return
    let cancelled = false
    ;(async () => {
      const entries = await os.fs.listDesktopEntries()
      const built = await buildStartLinkItems(
        entries,
        (path) => os.fs.open(path),
        (entry) => os.fs.resolveDesktopIcon(entry),
      )
      if (!cancelled) setLinks(built)
    })()
    return () => {
      cancelled = true
    }
  }, [ready, os])

  const programs = buildProgramItems(os.win)

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
