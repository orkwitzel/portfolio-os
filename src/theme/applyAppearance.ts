import { COLOR_SCHEME_PRESETS } from './presets'
import { tokensToCssVars } from './presets'
import type { SettingsV1 } from './tokens'
import { FONT_SIZE_PX } from './tokens'

export function applyAppearance(settings: SettingsV1): void {
  const root = document.documentElement
  const preset = COLOR_SCHEME_PRESETS[settings.colorScheme]
  const vars = tokensToCssVars(preset)

  for (const [name, value] of Object.entries(vars)) {
    root.style.setProperty(name, value)
  }

  if (settings.wallpaper.kind === 'color') {
    root.style.setProperty('--desktop-bg', settings.wallpaper.value)
    root.style.setProperty('--desktop-bg-image', 'none')
  } else {
    root.style.setProperty('--desktop-bg-image', `url("${settings.wallpaper.url}")`)
  }

  root.style.setProperty('--font-size-ui', `${FONT_SIZE_PX[settings.fontSize]}px`)
  root.dataset.colorScheme = settings.colorScheme
  root.dataset.cursorMode = settings.cursorMode
}
