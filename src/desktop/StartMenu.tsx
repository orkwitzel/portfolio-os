import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from 'react'
import { useWindowManager } from './windowManagerContext'
import styles from './StartMenu.module.css'

export const START_MENU_ID = 'start-menu'

type StartMenuProps = {
  open: boolean
  onClose: () => void
  anchorRef: RefObject<HTMLButtonElement | null>
  startButtonId: string
}

export function StartMenu({ open, onClose, anchorRef, startButtonId }: StartMenuProps) {
  const wm = useWindowManager()
  const menuRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<{ left: number; bottom: number } | null>(null)

  const apps = Array.from(wm.registry.values())

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
        {apps.map((def) => (
          <li key={def.id}>
            <button
              type="button"
              role="menuitem"
              className={styles.item}
              onClick={() => {
                wm.openApp(def.id)
                onClose()
              }}
            >
              {def.defaultTitle}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
