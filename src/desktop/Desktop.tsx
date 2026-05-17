import type { RefObject } from 'react'
import { externalLinks } from './links'
import { ShellIcon } from './icons/ShellIcon'
import type { ShellLaunchItem } from './shellCatalog'
import { buildLinkItems, buildProgramItems } from './shellCatalog'
import { useWindowManager } from './windowManagerContext'
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
  const wm = useWindowManager()
  const items = [...buildProgramItems(wm), ...buildLinkItems(externalLinks)]

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
