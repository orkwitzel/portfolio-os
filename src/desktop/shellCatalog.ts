import type { ExternalLinkDefinition } from './links'
import { placeholderIcon, type IconSource } from './icons/types'
import { openExternalLink } from './openExternalLink'
import type { WindowManagerApi } from './windowManagerContext'

export type ShellLaunchItem = {
  kind: 'app' | 'link'
  id: string
  label: string
  icon: IconSource
  launch: () => void
}

export function buildProgramItems(wm: WindowManagerApi): ShellLaunchItem[] {
  return Array.from(wm.registry.values()).map((def) => ({
    kind: 'app',
    id: def.id,
    label: def.defaultTitle,
    icon: def.icon ?? placeholderIcon,
    launch: () => wm.openApp(def.id),
  }))
}

export function buildLinkItems(links: ExternalLinkDefinition[]): ShellLaunchItem[] {
  return links.map((link) => ({
    kind: 'link',
    id: link.id,
    label: link.label,
    icon: link.icon ?? { kind: 'favicon', url: link.url },
    launch: () => openExternalLink(link.url),
  }))
}
