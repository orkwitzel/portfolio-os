import { useCallback, useMemo, useState } from 'react'
import { useOs } from '@/hooks/useOs'
import { useOsSettings } from '@/hooks/useOsSettings'
import { COLOR_SCHEME_PRESETS } from '@/theme/presets'
import type { ColorSchemeId } from '@/theme/tokens'
import type { AppProps } from '@/store/session/sessionTypes'

export type SettingsSection = 'appearance' | 'display'

export function useSettingsRoot(props: AppProps) {
  void props.windowId
  const os = useOs()
  const settings = useOsSettings()
  const [section, setSection] = useState<SettingsSection>('appearance')

  const colorSchemes = useMemo(() => os.settings.listColorSchemes(), [os])
  const fontSizes = useMemo(() => os.settings.listFontSizes(), [os])

  const schemePreviews = useMemo(
    () =>
      colorSchemes.map(({ id }) => {
        const tokens = COLOR_SCHEME_PRESETS[id as ColorSchemeId]
        return {
          id,
          from: tokens.titlebarActiveFrom,
          to: tokens.titlebarActiveTo,
        }
      }),
    [colorSchemes],
  )

  const wallpaperHex =
    settings.wallpaper.kind === 'color' ? settings.wallpaper.value : '#018281'

  const onColorScheme = useCallback(
    (id: ColorSchemeId) => os.settings.setColorScheme(id),
    [os],
  )

  const onCursorMode = useCallback(
    (mode: 'winxp' | 'system') => os.settings.setCursorMode(mode),
    [os],
  )

  const onWallpaperColor = useCallback(
    (value: string) => os.settings.setWallpaperColor(value),
    [os],
  )

  const onFontSize = useCallback(
    (size: 'small' | 'medium' | 'large') => os.settings.setFontSize(size),
    [os],
  )

  return {
    section,
    setSection,
    settings,
    colorSchemes,
    schemePreviews,
    fontSizes,
    wallpaperHex,
    onColorScheme,
    onCursorMode,
    onWallpaperColor,
    onFontSize,
  }
}
