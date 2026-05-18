import type { ColorSchemeId, ThemeTokens } from './tokens'
import { cssVars } from './tokens'

const classic: ThemeTokens = {
  shellSurface: '#c0c0c0',
  shellBorderLight: '#ffffff',
  shellBorderDark: '#404040',
  shellBorderMid: '#808080',
  titlebarActiveFrom: '#000080',
  titlebarActiveTo: '#1084d0',
  titlebarInactiveFrom: '#808080',
  titlebarInactiveTo: '#b5b5b5',
  titlebarActiveText: '#ffffff',
  titlebarInactiveText: '#c0c0c0',
  taskbarBg: '#c0c0c0',
  taskbarBorderTop: '#dfdfdf',
  desktopBg: '#018281',
  desktopBgImage: 'none',
  textPrimary: '#000000',
  textSecondary: '#404040',
  textInverse: '#ffffff',
  contentBg: '#c0c0c0',
  contentBgAlt: '#ffffff',
  selectionBg: 'rgba(0, 0, 128, 0.55)',
  selectionText: '#ffffff',
  linkColor: '#000080',
  accentFrom: '#000080',
  accentTo: '#1084d0',
  accentSurface: '#f0f4ff',
  windowShadow: '1px 1px 0 #000, 0 10px 28px rgba(0, 0, 0, 0.2)',
  insetBorder: '#c0c0c0',
  menuHighlight: '#000080',
  menuHighlightText: '#ffffff',
  appGradientFrom: '#b8d4e8',
  appGradientMid: '#c0c0c0',
  appGradientTo: '#d8c8e8',
  bannerFrom: '#000080',
  bannerMid: '#1084d0',
  bannerTo: '#008080',
  heroBg: 'linear-gradient(135deg, #fff8e8 0%, #f0f8ff 50%, #f5f0ff 100%)',
  panelBorder: '#c0c0c0',
}

const ocean: ThemeTokens = {
  ...classic,
  titlebarActiveFrom: '#004080',
  titlebarActiveTo: '#0080c0',
  desktopBg: '#018281',
  accentFrom: '#006060',
  accentTo: '#40c0c0',
  accentSurface: '#f0fffe',
  selectionBg: 'rgba(0, 96, 96, 0.55)',
  linkColor: '#006060',
  menuHighlight: '#006060',
  appGradientFrom: '#a8d8d8',
  appGradientMid: '#b8d0d0',
  appGradientTo: '#c8e0e8',
  bannerFrom: '#004060',
  bannerMid: '#0080a0',
  bannerTo: '#008080',
  heroBg: 'linear-gradient(135deg, #e8fff8 0%, #f0f8ff 50%, #e8f8f8 100%)',
}

const slate: ThemeTokens = {
  ...classic,
  shellSurface: '#b8b8b8',
  contentBg: '#b8b8b8',
  titlebarActiveFrom: '#2a4a6a',
  titlebarActiveTo: '#5a8ab0',
  titlebarInactiveFrom: '#707070',
  titlebarInactiveTo: '#a0a0a0',
  desktopBg: '#3a5a6a',
  accentFrom: '#2a4a6a',
  accentTo: '#6a9ac0',
  accentSurface: '#eef4f8',
  selectionBg: 'rgba(42, 74, 106, 0.55)',
  linkColor: '#2a4a6a',
  menuHighlight: '#2a4a6a',
  appGradientFrom: '#a8b8c8',
  appGradientMid: '#b0b0b0',
  appGradientTo: '#c0c0d0',
  bannerFrom: '#2a4a6a',
  bannerMid: '#5a8ab0',
  bannerTo: '#4a6a7a',
  heroBg: 'linear-gradient(135deg, #f0f4f8 0%, #e8ecf0 50%, #e0e8f0 100%)',
}

const warm: ThemeTokens = {
  ...classic,
  shellSurface: '#c8c0b0',
  contentBg: '#c8c0b0',
  titlebarActiveFrom: '#804000',
  titlebarActiveTo: '#c08040',
  titlebarInactiveFrom: '#908070',
  titlebarInactiveTo: '#b8a898',
  desktopBg: '#6a5040',
  accentFrom: '#804000',
  accentTo: '#c08040',
  accentSurface: '#fff8f0',
  selectionBg: 'rgba(128, 64, 0, 0.55)',
  linkColor: '#804000',
  menuHighlight: '#804000',
  appGradientFrom: '#e8d8c0',
  appGradientMid: '#d0c8b8',
  appGradientTo: '#e8d0c8',
  bannerFrom: '#604020',
  bannerMid: '#a06030',
  bannerTo: '#806040',
  heroBg: 'linear-gradient(135deg, #fff8e8 0%, #fff0e8 50%, #f8f0e8 100%)',
}

export const COLOR_SCHEME_PRESETS: Record<ColorSchemeId, ThemeTokens> = {
  classic,
  ocean,
  slate,
  warm,
}

export const COLOR_SCHEME_LABELS: Record<ColorSchemeId, string> = {
  classic: 'Classic',
  ocean: 'Ocean',
  slate: 'Slate',
  warm: 'Warm',
}

export function tokensToCssVars(tokens: ThemeTokens): Record<string, string> {
  const out: Record<string, string> = {}
  for (const key of Object.keys(cssVars) as (keyof typeof cssVars)[]) {
    out[cssVars[key]] = tokens[key]
  }
  return out
}
