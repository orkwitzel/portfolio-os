import type { AppProps } from '../../desktop/sessionTypes'
import { openExternalLink } from '../../desktop/openExternalLink'
import styles from './resume.module.css'

const RESUME_URL = '/resume.pdf'

export function ResumeRoot(props: AppProps) {
  void props.windowId

  return (
    <div className={styles.appBody}>
      <div className={styles.toolbar}>
        <button
          type="button"
          className={styles.toolbarBtn}
          onClick={() => openExternalLink(RESUME_URL)}
        >
          Open in new tab
        </button>
        <a className={styles.toolbarBtn} href={RESUME_URL} download>
          Download
        </a>
      </div>
      <iframe className={styles.pdfFrame} title="Resume" src={RESUME_URL} />
    </div>
  )
}
