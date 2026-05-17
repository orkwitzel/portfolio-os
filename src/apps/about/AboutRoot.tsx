import type { AppProps } from '../../desktop/sessionTypes'
import aboutMd from '../../content/about.md?raw'
import { MarkdownView } from '../_shared/MarkdownView'
import styles from './about.module.css'

export function AboutRoot(props: AppProps) {
  void props.windowId
  return (
    <div className={styles.appBody}>
      <MarkdownView source={aboutMd} />
    </div>
  )
}
