import type { RefObject } from 'react'
import { useWindowManager } from './windowManagerContext'
import { WindowLayer } from '../wm/WindowLayer'
import styles from './Desktop.module.css'

function DesktopShortcut({
  label,
  onOpen,
}: {
  label: string
  onOpen: () => void
}) {
  return (
    <button type="button" className={styles.shortcut} onClick={onOpen}>
      <span className={styles.shortcutIcon} aria-hidden />
      <span className={styles.shortcutLabel}>{label}</span>
    </button>
  )
}

export function Desktop({ workspaceRef }: { workspaceRef: RefObject<HTMLDivElement | null> }) {
  const wm = useWindowManager()

  return (
    <div ref={workspaceRef} className={styles.workspace}>
      <div className={styles.shortcuts}>
        <DesktopShortcut label="Notepad" onOpen={() => wm.openApp('notepad')} />
        <DesktopShortcut label="About" onOpen={() => wm.openApp('about')} />
      </div>
      <WindowLayer />
    </div>
  )
}
