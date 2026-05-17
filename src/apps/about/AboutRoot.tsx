import type { AppProps } from '../../desktop/sessionTypes'
import styles from './about.module.css'

export function AboutRoot(props: AppProps) {
  void props.windowId
  return (
    <div className={styles.appBody}>
      <p className={styles.aboutLead}>Retro desktop shell</p>
      <p className={styles.aboutText}>
        Stub “About” app — add bio, links, or README-style content here.
      </p>
    </div>
  )
}
