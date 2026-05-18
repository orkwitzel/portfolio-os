import { create } from 'zustand'
import { applyAppearance } from '@/theme/applyAppearance'
import {
  DEFAULT_SETTINGS,
  type ColorSchemeId,
  type CursorMode,
  type FontSizeId,
  type SettingsV1,
} from '@/theme/tokens'

const STORAGE_KEY = 'portfolio-os-settings'

function loadSettings(): SettingsV1 {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_SETTINGS
    const parsed = JSON.parse(raw) as SettingsV1
    if (parsed.version !== 1) return DEFAULT_SETTINGS
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      wallpaper:
        parsed.wallpaper?.kind === 'color' || parsed.wallpaper?.kind === 'image'
          ? parsed.wallpaper
          : DEFAULT_SETTINGS.wallpaper,
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

function persistSettings(settings: SettingsV1): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    /* quota / private mode */
  }
}

function commit(settings: SettingsV1): void {
  persistSettings(settings)
  applyAppearance(settings)
}

export type SettingsState = {
  settings: SettingsV1
  setColorScheme: (id: ColorSchemeId) => void
  setCursorMode: (mode: CursorMode) => void
  setWallpaperColor: (value: string) => void
  setFontSize: (size: FontSizeId) => void
}

export const useSettingsStore = create<SettingsState>((set, get) => {
  const initial = loadSettings()
  applyAppearance(initial)

  return {
    settings: initial,

    setColorScheme: (colorScheme) => {
      const settings = { ...get().settings, colorScheme }
      set({ settings })
      commit(settings)
    },

    setCursorMode: (cursorMode) => {
      const settings = { ...get().settings, cursorMode }
      set({ settings })
      commit(settings)
    },

    setWallpaperColor: (value) => {
      const settings = {
        ...get().settings,
        wallpaper: { kind: 'color' as const, value },
      }
      set({ settings })
      commit(settings)
    },

    setFontSize: (fontSize) => {
      const settings = { ...get().settings, fontSize }
      set({ settings })
      commit(settings)
    },
  }
})
