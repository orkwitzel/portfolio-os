import { useState } from 'react'
import { faviconUrl } from './favicon'
import type { IconSource, ShellIconSize } from './types'
import { Frame, Img, NerdGlyph, Placeholder } from './ShellIcon.style'

type ShellIconProps = {
  source: IconSource
  size: ShellIconSize
}

function isCompact(size: ShellIconSize): boolean {
  return size === 'menu' || size === 'taskbar'
}

export function ShellIcon({ source, size }: ShellIconProps) {
  const [faviconFailed, setFaviconFailed] = useState(false)
  const compact = isCompact(size)

  if (source.kind === 'asset') {
    return (
      <Frame $compact={compact} aria-hidden>
        <Img $desktop={!compact} src={source.src} alt="" draggable={false} />
      </Frame>
    )
  }

  if (source.kind === 'favicon' && !faviconFailed) {
    return (
      <Frame $compact={compact} aria-hidden>
        <Img
          $desktop={!compact}
          src={faviconUrl(source.url)}
          alt=""
          draggable={false}
          onError={() => setFaviconFailed(true)}
        />
      </Frame>
    )
  }

  if (source.kind === 'nerd') {
    return (
      <Frame $compact={compact} aria-hidden>
        <NerdGlyph>{source.glyph}</NerdGlyph>
      </Frame>
    )
  }

  return (
    <Frame $compact={compact} aria-hidden>
      <Placeholder $compact={compact} />
    </Frame>
  )
}
