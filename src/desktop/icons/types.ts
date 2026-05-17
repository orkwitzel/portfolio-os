export type IconSource =
  | { kind: 'asset'; src: string; alt?: string }
  | { kind: 'favicon'; url: string }
  | { kind: 'placeholder' }

export type ShellIconSize = 'menu' | 'desktop'

export const placeholderIcon: IconSource = { kind: 'placeholder' }
