import { useId, useRef } from 'react'
import { useWindowManager } from './windowManagerContext'
import { nerd } from './nerdIcons'
import { StartMenu, START_MENU_ID } from './StartMenu'
import { TrayClock } from './TrayClock'
import styles from './Taskbar.module.css'

type TaskbarProps = {
  startMenuOpen: boolean
  onStartMenuOpenChange: (open: boolean) => void
}

export function Taskbar({ startMenuOpen, onStartMenuOpenChange }: TaskbarProps) {
  const wm = useWindowManager()
  const { session } = wm
  const startRef = useRef<HTMLButtonElement>(null)
  const startButtonId = useId()

  return (
    <div className={styles.bar}>
      <button
        ref={startRef}
        id={startButtonId}
        type="button"
        className={`${styles.startBtn} ${startMenuOpen ? styles.startBtnPressed : ''}`}
        aria-label="Start"
        aria-haspopup="menu"
        aria-expanded={startMenuOpen}
        aria-controls={startMenuOpen ? START_MENU_ID : undefined}
        onClick={() => onStartMenuOpenChange(!startMenuOpen)}
      >
        <span className={styles.startIcon} aria-hidden>
          {nerd.windowsClassic}
        </span>
        <span className={styles.startLabel}>Start</span>
      </button>
      <StartMenu
        open={startMenuOpen}
        onClose={() => onStartMenuOpenChange(false)}
        anchorRef={startRef}
        startButtonId={startButtonId}
      />
      <div className={styles.tasks}>
        {session.order.map((id) => {
          const w = session.windows[id]
          if (!w) return null

          const minimized = w.geometry.mode === 'minimized'
          const active = session.focusedWindowId === w.id && !minimized

          return (
            <button
              key={id}
              type="button"
              className={`${styles.taskBtn} ${active ? styles.taskBtnActive : ''} ${minimized ? styles.taskBtnMinimized : ''}`}
              onClick={() => {
                if (minimized) wm.restoreWindow(id)
                else wm.focusWindow(id)
              }}
            >
              {w.title}
            </button>
          )
        })}
      </div>
      <div className={styles.tray}>
        <TrayClock />
      </div>
    </div>
  )
}
