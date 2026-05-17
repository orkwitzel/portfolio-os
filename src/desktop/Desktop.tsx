import { useEffect, useState, type RefObject } from 'react'
import { useFs } from '../fs/fsContext'
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
  const fs = useFs()
  const [items, setItems] = useState<ShellLaunchItem[]>([])

  useEffect(() => {
    if (!fs.ready) return
    let cancelled = false
    ;(async () => {
      const entries = await fs.listDesktopEntries()
      const built = await buildDesktopItems(
        entries,
        fs.openPath,
        fs.resolveDesktopIcon,
      )
      if (!cancelled) setItems(built)
    })()
    return () => {
      cancelled = true
    }
  }, [fs, fs.ready, fs.listDesktopEntries, fs.openPath, fs.resolveDesktopIcon])

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
