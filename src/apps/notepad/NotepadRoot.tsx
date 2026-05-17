import type { AppProps } from '../../desktop/sessionTypes'
import styles from './notepad.module.css'

export function NotepadRoot(props: AppProps) {
  void props.windowId
  return (
    <div className={styles.appBody}>
      <textarea
        className={styles.notepadField}
        spellCheck={false}
        defaultValue={
          'Multiple instances are supported — open another Notepad from the desktop.\r\n\r\n' +
          'This window runs inside the Win95-style shell.\r\n'
        }
      />
    </div>
  )
}
