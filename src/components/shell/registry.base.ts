import { lazy } from 'react'
import type { AppDefinition, AppModule } from '@/store/session/sessionTypes'
import { appIcons } from '@/utils/appIcons'

export function createAppRegistry(defs: AppDefinition[]): Map<string, AppDefinition> {
  const map = new Map<string, AppDefinition>()
  for (const d of defs) {
    map.set(d.id, d)
  }
  return map
}

export function defineApp(
  loader: () => Promise<AppModule>,
  meta: Omit<AppDefinition, 'Root' | 'loader'>,
): AppDefinition {
  return { ...meta, loader, Root: lazy(loader) }
}

/** Built-in demo apps — safe to merge from desktop-os upstream. */
export const baseAppDefinitions: AppDefinition[] = [
  defineApp(() => import('@/apps/computer/ComputerRoot'), {
    id: 'computer',
    defaultTitle: 'My Computer',
    defaultBounds: { width: 720, height: 480 },
    icon: appIcons.computer,
  }),
  defineApp(() => import('@/apps/notepad/NotepadRoot'), {
    id: 'notepad',
    defaultTitle: 'Notepad',
    defaultBounds: { width: 480, height: 360 },
    icon: appIcons.notepad,
  }),
  defineApp(() => import('@/apps/playful/PlayfulRoot'), {
    id: 'playful',
    defaultTitle: 'Minesweeper',
    defaultBounds: { width: 320, height: 360 },
    icon: appIcons.playful,
  }),
  defineApp(() => import('@/apps/tetris/TetrisRoot'), {
    id: 'tetris',
    defaultTitle: 'Tetris',
    defaultBounds: { width: 490, height: 580 },
    icon: appIcons.tetris,
  }),
  defineApp(() => import('@/apps/settings/SettingsRoot'), {
    id: 'settings',
    defaultTitle: 'Settings',
    defaultBounds: { width: 480, height: 420 },
    icon: appIcons.settings,
  }),
]

export const appDefinitions = baseAppDefinitions
