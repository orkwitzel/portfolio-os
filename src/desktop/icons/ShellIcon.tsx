import { useState } from 'react'
import { faviconUrl } from './favicon'
import type { IconSource, ShellIconSize } from './types'
import styles from './ShellIcon.module.css'

type ShellIconProps = {
  source: IconSource
  size: ShellIconSize
}

export function ShellIcon({ source, size }: ShellIconProps) {
  const [faviconFailed, setFaviconFailed] = useState(false)

  const frameClass = `${styles.frame} ${size === 'menu' ? styles.menu : styles.desktop}`

  if (source.kind === 'asset') {
    return (
      <span className={frameClass} aria-hidden>
        <img className={styles.img} src={source.src} alt="" draggable={false} />
      </span>
    )
  }

  if (source.kind === 'favicon' && !faviconFailed) {
    return (
      <span className={frameClass} aria-hidden>
        <img
          className={styles.img}
          src={faviconUrl(source.url)}
          alt=""
          draggable={false}
          onError={() => setFaviconFailed(true)}
        />
      </span>
    )
  }

  return (
    <span className={frameClass} aria-hidden>
      <span className={styles.placeholder} />
    </span>
  )
}
