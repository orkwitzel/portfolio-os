import { useWindowManager } from './windowManagerContext'
import styles from './Taskbar.module.css'

export function Taskbar() {
  const wm = useWindowManager()
  const { session } = wm

  return (
    <div className={styles.bar}>
      <div className={styles.startBtn}>Start</div>
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
      <div className={styles.tray} aria-hidden />
    </div>
  )
}
