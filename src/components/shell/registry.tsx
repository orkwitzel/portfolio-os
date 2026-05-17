import { lazy } from 'react'
import type { AppDefinition } from '@/store/session/sessionTypes'

export function createAppRegistry(defs: AppDefinition[]): Map<string, AppDefinition> {
  const map = new Map<string, AppDefinition>()
  for (const d of defs) {
    map.set(d.id, d)
  }
  return map
}

export const appDefinitions: AppDefinition[] = [
  {
    id: 'computer',
    defaultTitle: 'My Computer',
    defaultBounds: { width: 600, height: 440 },
    Root: lazy(() => import('@/apps/computer/ComputerRoot')),
  },
  {
    id: 'notepad',
    defaultTitle: 'Notepad',
    defaultBounds: { width: 400, height: 300 },
    Root: lazy(() => import('@/apps/notepad/NotepadRoot')),
  },
  {
    id: 'about',
    defaultTitle: 'About portfolio-os',
    defaultBounds: { width: 480, height: 360 },
    Root: lazy(() => import('@/apps/about/AboutRoot')),
  },
  {
    id: 'resume',
    defaultTitle: 'Resume',
    defaultBounds: { width: 560, height: 720 },
    Root: lazy(() => import('@/apps/resume/ResumeRoot')),
  },
  {
    id: 'playful',
    defaultTitle: 'Minesweeper',
    defaultBounds: { width: 320, height: 360 },
    Root: lazy(() => import('@/apps/playful/PlayfulRoot')),
  },
]
