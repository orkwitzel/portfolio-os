import type { IconSource } from '@/components/shell/ShellIcon'
import { nerd } from '@/utils/nerdIcons'
import portraitUrl from '@/site/content/portfolio/portrait.png?url'

/** Portfolio-site icons — not part of desktop-os upstream. */
export const siteIcons = {
  portfolio: { kind: 'asset', src: portraitUrl, alt: 'Portfolio' },
  about: { kind: 'nerd', glyph: nerd.star },
  resume: { kind: 'nerd', glyph: nerd.pdf },
} as const satisfies Record<string, IconSource>

export const siteWwwIcons = {
  github: { kind: 'favicon', url: 'https://github.com/orkwitzel' },
  linkedin: {
    kind: 'favicon',
    url: 'https://www.linkedin.com/in/or-kwitzel-83294b2b4/',
  },
} as const satisfies Record<string, IconSource>
