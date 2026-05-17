import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from 'react'
import { useFs } from '../fs/fsContext'
import { ShellIcon } from './icons/ShellIcon'
import type { IconSource } from './icons/types'
import { buildProgramItems, buildStartLinkItems } from './shellCatalog'
import type { ShellLaunchItem } from './shellCatalog'
import { useWindowManager } from './windowManagerContext'
import styles from './StartMenu.module.css'

export const START_MENU_ID = 'start-menu'

type StartMenuProps = {
  open: boolean
  onClose: () => void
  anchorRef: RefObject<HTMLButtonElement | null>
  startButtonId: string
}

function StartMenuItem({
  label,
  icon,
  onActivate,
}: {
  label: string
  icon: IconSource
  onActivate: () => void
}) {
  return (
    <button type="button" role="menuitem" className={styles.item} onClick={onActivate}>
      <ShellIcon source={icon} size="menu" />
      <span className={styles.itemLabel}>{label}</span>
    </button>
  )
}

export function StartMenu({ open, onClose, anchorRef, startButtonId }: StartMenuProps) {
  const wm = useWindowManager()
  const fs = useFs()
  const menuRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<{ left: number; bottom: number } | null>(null)
  const [links, setLinks] = useState<ShellLaunchItem[]>([])

  useEffect(() => {
    if (!fs.ready) return
    let cancelled = false
    ;(async () => {
      const entries = await fs.listDesktopEntries()
      const built = await buildStartLinkItems(
        entries,
        fs.openPath,
        fs.resolveDesktopIcon,
      )
      if (!cancelled) setLinks(built)
    })()
    return () => {
      cancelled = true
    }
  }, [fs, fs.ready, fs.listDesktopEntries, fs.openPath, fs.resolveDesktopIcon])

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

  if (!open || !position) return null

  const activate = (launch: () => void) => {
    launch()
    onClose()
  }

  return (
    <div
      ref={menuRef}
      id={START_MENU_ID}
      role="menu"
      aria-labelledby={startButtonId}
      className={styles.panel}
      style={{ left: position.left, bottom: position.bottom }}
    >
      <ul className={styles.list}>
        {programs.map((item) => (
          <li key={item.id}>
            <StartMenuItem
              label={item.label}
              icon={item.icon}
              onActivate={() => activate(item.launch)}
            />
          </li>
        ))}
        {links.length > 0 ? <li className={styles.divider} role="separator" /> : null}
        {links.map((item) => (
          <li key={item.id}>
            <StartMenuItem
              label={item.label}
              icon={item.icon}
              onActivate={() => activate(item.launch)}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
