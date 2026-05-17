import { useState } from 'react'
import { faviconUrl } from './favicon'
import type { IconSource, ShellIconSize } from './types'
import { Frame, Img, Placeholder } from './ShellIcon.style'

type ShellIconProps = {
  source: IconSource
  size: ShellIconSize
}

export function ShellIcon({ source, size }: ShellIconProps) {
  const [faviconFailed, setFaviconFailed] = useState(false)
  const menu = size === 'menu'

  if (source.kind === 'asset') {
    return (
      <Frame $menu={menu} aria-hidden>
        <Img $desktop={!menu} src={source.src} alt="" draggable={false} />
      </Frame>
    )
  }

  if (source.kind === 'favicon' && !faviconFailed) {
    return (
      <Frame $menu={menu} aria-hidden>
        <Img
          $desktop={!menu}
          src={faviconUrl(source.url)}
          alt=""
          draggable={false}
          onError={() => setFaviconFailed(true)}
        />
      </Frame>
    )
  }

  return (
    <Frame $menu={menu} aria-hidden>
      <Placeholder $menu={menu} />
    </Frame>
  )
}
