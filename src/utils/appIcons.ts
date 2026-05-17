import type { IconSource } from '@/components/shell/ShellIcon'
import { nerd } from '@/utils/nerdIcons'
import portraitUrl from '@/content/portfolio/portrait.png?url'
// Win98-style icons from nestoris/Win98SE (SE98 icon theme)
import computerIconUrl from '@/content/icons/win98/computer.png?url'
import notepadIconUrl from '@/content/icons/win98/notepad.png?url'

/** Icons for built-in apps — shared by registry, taskbar, and `.desktop` seed files. */
export const appIcons = {
  portfolio: { kind: 'asset', src: portraitUrl, alt: 'Portfolio' },
  computer: { kind: 'asset', src: computerIconUrl, alt: 'My Computer' },
  notepad: { kind: 'asset', src: notepadIconUrl, alt: 'Notepad' },
  about: { kind: 'nerd', glyph: nerd.star },
  resume: { kind: 'nerd', glyph: nerd.pdf },
  playful: { kind: 'nerd', glyph: nerd.terminal },
} as const satisfies Record<string, IconSource>

export const wwwIcons = {
  github: { kind: 'favicon', url: 'https://github.com/orkwitzel' },
  linkedin: {
    kind: 'favicon',
    url: 'https://www.linkedin.com/in/or-kwitzel-83294b2b4/',
  },
} as const satisfies Record<string, IconSource>
