import {
  COLOR_SCHEME_LABELS,
  COLOR_SCHEME_PRESETS,
} from '@/theme/presets'
import type {
  ColorSchemeId,
  CursorMode,
  FontSizeId,
  SettingsV1,
} from '@/theme/tokens'
import { FONT_SIZE_PX } from '@/theme/tokens'
import type { OsDeps, OsSettingsApi } from './types'

/** @internal Creates the {@link OsSettingsApi} namespace. @see OsSettingsApi */
export function createSettingsApi(deps: OsDeps): OsSettingsApi {
  const { settingsStore } = deps

  return {
    get: () => settingsStore.getState().settings,

    subscribe: (listener) => settingsStore.subscribe(listener),

    setColorScheme: (id) => settingsStore.getState().setColorScheme(id),

    setCursorMode: (mode) => settingsStore.getState().setCursorMode(mode),

    setWallpaperColor: (value) => settingsStore.getState().setWallpaperColor(value),

    setFontSize: (size) => settingsStore.getState().setFontSize(size),

    listColorSchemes: () =>
      (Object.keys(COLOR_SCHEME_PRESETS) as ColorSchemeId[]).map((id) => ({
        id,
        label: COLOR_SCHEME_LABELS[id],
      })),

    listFontSizes: () =>
      (Object.keys(FONT_SIZE_PX) as FontSizeId[]).map((id) => ({
        id,
        label: id.charAt(0).toUpperCase() + id.slice(1),
        px: FONT_SIZE_PX[id],
      })),
  }
}

export type { SettingsV1, ColorSchemeId, CursorMode, FontSizeId }
