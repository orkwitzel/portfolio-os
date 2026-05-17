import { useWindowManager } from '../desktop/windowManagerContext'
import { WindowFrame } from './WindowFrame'
import styles from './WindowLayer.module.css'

export function WindowLayer() {
  const { session } = useWindowManager()

  const ordered = session.order
    .map((id) => session.windows[id])
    .filter(Boolean)
    .sort((a, b) => a.zIndex - b.zIndex)

  return (
    <div className={styles.layer}>
      {ordered.map((w) => (
        <WindowFrame key={w.id} window={w} />
      ))}
    </div>
  )
}
