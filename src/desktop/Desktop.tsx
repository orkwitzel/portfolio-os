import { useEffect, useState, type RefObject } from 'react'
import { useFsStore } from '../fs/fsStore'
import { ShellIcon } from './icons/ShellIcon'
import type { ShellLaunchItem } from './shellCatalog'
import { buildDesktopItems } from './shellCatalog'
import { WindowLayer } from '../wm/WindowLayer'
import styles from './Desktop.module.css'

function DesktopShortcut({ item }: { item: ShellLaunchItem }) {
  return (
    <button type="button" className={styles.shortcut} onClick={item.launch}>
      <ShellIcon source={item.icon} size="desktop" />
      <span className={styles.shortcutLabel}>{item.label}</span>
    </button>
  )
}

export function Desktop({ workspaceRef }: { workspaceRef: RefObject<HTMLDivElement | null> }) {
  const ready = useFsStore((s) => s.ready)
  const listDesktopEntries = useFsStore((s) => s.listDesktopEntries)
  const openPath = useFsStore((s) => s.openPath)
  const resolveDesktopIcon = useFsStore((s) => s.resolveDesktopIcon)
  const [items, setItems] = useState<ShellLaunchItem[]>([])

  useEffect(() => {
    if (!ready) return
    let cancelled = false
    ;(async () => {
      const entries = await listDesktopEntries()
      const built = await buildDesktopItems(entries, openPath, resolveDesktopIcon)
      if (!cancelled) setItems(built)
    })()
    return () => {
      cancelled = true
    }
  }, [ready, listDesktopEntries, openPath, resolveDesktopIcon])

  return (
    <div ref={workspaceRef} className={styles.workspace}>
      <div className={styles.shortcuts}>
        {items.map((item) => (
          <DesktopShortcut key={item.id} item={item} />
        ))}
      </div>
      <WindowLayer />
    </div>
  )
}
