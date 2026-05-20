import type { IconSource } from '@/components/shell/ShellIcon'
import { nerd } from '@/utils/nerdIcons'
import computerIconUrl from '@/content/icons/win98/computer.png?url'
import notepadIconUrl from '@/content/icons/win98/notepad.png?url'

/** Icons for built-in OS apps — shared by registry.base, taskbar, and `.desktop` seed files. */
export const appIcons = {
  computer: { kind: 'asset', src: computerIconUrl, alt: 'My Computer' },
  notepad: { kind: 'asset', src: notepadIconUrl, alt: 'Notepad' },
  playful: { kind: 'nerd', glyph: nerd.terminal },
  tetris: { kind: 'nerd', glyph: nerd.trophy },
  settings: { kind: 'nerd', glyph: nerd.gear },
} as const satisfies Record<string, IconSource>
