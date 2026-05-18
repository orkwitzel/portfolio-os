/** CSS custom property names applied to `:root` by {@link applyAppearance}. */
export const cssVars = {
  shellSurface: '--shell-surface',
  shellBorderLight: '--shell-border-light',
  shellBorderDark: '--shell-border-dark',
  shellBorderMid: '--shell-border-mid',
  titlebarActiveFrom: '--titlebar-active-from',
  titlebarActiveTo: '--titlebar-active-to',
  titlebarInactiveFrom: '--titlebar-inactive-from',
  titlebarInactiveTo: '--titlebar-inactive-to',
  titlebarActiveText: '--titlebar-active-text',
  titlebarInactiveText: '--titlebar-inactive-text',
  taskbarBg: '--taskbar-bg',
  taskbarBorderTop: '--taskbar-border-top',
  desktopBg: '--desktop-bg',
  desktopBgImage: '--desktop-bg-image',
  textPrimary: '--text-primary',
  textSecondary: '--text-secondary',
  textInverse: '--text-inverse',
  contentBg: '--content-bg',
  contentBgAlt: '--content-bg-alt',
  selectionBg: '--selection-bg',
  selectionText: '--selection-text',
  linkColor: '--link-color',
  accentFrom: '--accent-from',
  accentTo: '--accent-to',
  accentSurface: '--accent-surface',
  windowShadow: '--window-shadow',
  insetBorder: '--inset-border',
  menuHighlight: '--menu-highlight',
  menuHighlightText: '--menu-highlight-text',
  appGradientFrom: '--app-gradient-from',
  appGradientMid: '--app-gradient-mid',
  appGradientTo: '--app-gradient-to',
  bannerFrom: '--banner-from',
  bannerMid: '--banner-mid',
  bannerTo: '--banner-to',
  heroBg: '--hero-bg',
  panelBorder: '--panel-border',
} as const

export type ThemeTokens = Record<keyof typeof cssVars, string>

export type ColorSchemeId = 'classic' | 'ocean' | 'slate' | 'warm'

export type CursorMode = 'winxp' | 'system'

export type FontSizeId = 'small' | 'medium' | 'large'

export type Wallpaper =
  | { kind: 'color'; value: string }
  | { kind: 'image'; url: string }

export type SettingsV1 = {
  version: 1
  colorScheme: ColorSchemeId
  cursorMode: CursorMode
  wallpaper: Wallpaper
  fontSize: FontSizeId
}

export const FONT_SIZE_PX: Record<FontSizeId, number> = {
  small: 10,
  medium: 11,
  large: 13,
}

export const DEFAULT_SETTINGS: SettingsV1 = {
  version: 1,
  colorScheme: 'classic',
  cursorMode: 'winxp',
  wallpaper: { kind: 'color', value: '#018281' },
  fontSize: 'medium',
}
