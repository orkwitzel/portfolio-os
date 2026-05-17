import { lazy } from 'react'
import type { AppDefinition } from './sessionTypes'

export function createAppRegistry(defs: AppDefinition[]): Map<string, AppDefinition> {
  const map = new Map<string, AppDefinition>()
  for (const d of defs) {
    map.set(d.id, d)
  }
  return map
}

export const appDefinitions: AppDefinition[] = [
  {
    id: 'notepad',
    defaultTitle: 'Notepad',
    defaultBounds: { width: 420, height: 320 },
    Root: lazy(() =>
      import('../apps/notepad/NotepadRoot').then((m) => ({ default: m.NotepadRoot })),
    ),
  },
  {
    id: 'about',
    defaultTitle: 'About',
    defaultBounds: { width: 360, height: 260 },
    Root: lazy(() =>
      import('../apps/about/AboutRoot').then((m) => ({ default: m.AboutRoot })),
    ),
  },
]
