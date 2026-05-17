export type IconSource =
  | { kind: 'asset'; src: string; alt?: string }
  | { kind: 'favicon'; url: string }
  | { kind: 'nerd'; glyph: string }
  | { kind: 'placeholder' }

export type ShellIconSize = 'menu' | 'taskbar' | 'desktop'

export const placeholderIcon: IconSource = { kind: 'placeholder' }
