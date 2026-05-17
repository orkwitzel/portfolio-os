import { useWindowManager } from './windowManagerContext'
import { nerd } from './nerdIcons'
import { TrayClock } from './TrayClock'
import styles from './Taskbar.module.css'

export function Taskbar() {
  const wm = useWindowManager()
  const { session } = wm

  return (
    <div className={styles.bar}>
      <button type="button" className={styles.startBtn} aria-label="Start">
        <span className={styles.startIcon} aria-hidden>
          {nerd.windowsClassic}
        </span>
        <span className={styles.startLabel}>Start</span>
      </button>
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
