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
    id: 'about',
    defaultTitle: 'About portfolio-os',
    defaultBounds: { width: 480, height: 360 },
    Root: lazy(() =>
      import('../apps/about/AboutRoot').then((m) => ({ default: m.AboutRoot })),
    ),
  },
  {
    id: 'resume',
    defaultTitle: 'Resume',
    defaultBounds: { width: 560, height: 720 },
    Root: lazy(() =>
      import('../apps/resume/ResumeRoot').then((m) => ({ default: m.ResumeRoot })),
    ),
  },
  {
    id: 'playful',
    defaultTitle: 'Minesweeper',
    defaultBounds: { width: 320, height: 360 },
    Root: lazy(() =>
      import('../apps/playful/PlayfulRoot').then((m) => ({ default: m.PlayfulRoot })),
    ),
  },
]
