import { useState } from 'react'
import type { ToolbarIconSource } from './PortfolioRoot.logic'
import { nerd } from '@/utils/nerdIcons'
import {
  NerdGlyph,
  PixelIcon,
  ProjectGithubIcon,
  ProjectImage,
  ProjectThumb,
  ProjectThumbFallback,
  SkillIcon,
  SkillIconFallback,
  ToolbarIconFrame,
} from './PortfolioRoot.style'

const toolbarFallbacks: Record<string, string> = {
  email: nerd.mail,
  linkedin: nerd.linkedin,
  github: nerd.github,
  resume: nerd.pdf,
}

type PixelFaviconProps = {
  id: string
  iconUrl: string
}

function PixelFavicon({ id, iconUrl }: PixelFaviconProps) {
  const [failed, setFailed] = useState(false)
  const fallback = toolbarFallbacks[id] ?? nerd.document

  return (
    <ToolbarIconFrame>
      {failed ? (
        <NerdGlyph aria-hidden>{fallback}</NerdGlyph>
      ) : (
        <PixelIcon
          src={iconUrl}
          alt=""
          draggable={false}
          onError={() => setFailed(true)}
        />
      )}
    </ToolbarIconFrame>
  )
}

type ToolbarIconProps = {
  id: string
  icon: ToolbarIconSource
}

export function ToolbarIcon({ id, icon }: ToolbarIconProps) {
  if (icon.kind === 'nerd') {
    return (
      <ToolbarIconFrame>
        <NerdGlyph aria-hidden>{icon.glyph}</NerdGlyph>
      </ToolbarIconFrame>
    )
  }

  return <PixelFavicon id={id} iconUrl={icon.url} />
}

export function GithubNerdIcon() {
  return <ProjectGithubIcon aria-hidden>{nerd.github}</ProjectGithubIcon>
}

type NerdDecorProps = {
  glyph: string
  size?: number
}

export function NerdDecor({ glyph, size = 14 }: NerdDecorProps) {
  return (
    <span aria-hidden style={{ font: `${size}px/1 var(--font-ui)`, flexShrink: 0 }}>
      {glyph}
    </span>
  )
}

type ProjectThumbnailProps = {
  imageUrl: string
}

export function ProjectThumbnail({ imageUrl }: ProjectThumbnailProps) {
  const [failed, setFailed] = useState(false)

  return (
    <ProjectThumb>
      {failed ? (
        <ProjectThumbFallback aria-hidden>repo</ProjectThumbFallback>
      ) : (
        <ProjectImage
          src={imageUrl}
          alt=""
          draggable={false}
          onError={() => setFailed(true)}
        />
      )}
    </ProjectThumb>
  )
}

type SkillIconImgProps = {
  name: string
  iconUrl: string
}

export function SkillIconImg({ name, iconUrl }: SkillIconImgProps) {
  const [failed, setFailed] = useState(false)
  const initials = name.slice(0, 2).toUpperCase()

  if (failed) {
    return <SkillIconFallback aria-hidden>{initials}</SkillIconFallback>
  }

  return (
    <SkillIcon
      src={iconUrl}
      alt=""
      draggable={false}
      onError={() => setFailed(true)}
    />
  )
}
