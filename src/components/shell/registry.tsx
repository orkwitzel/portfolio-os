import { lazy } from 'react'
import type { AppDefinition } from '@/store/session/sessionTypes'
import { appIcons } from '@/utils/appIcons'

export function createAppRegistry(defs: AppDefinition[]): Map<string, AppDefinition> {
  const map = new Map<string, AppDefinition>()
  for (const d of defs) {
    map.set(d.id, d)
  }
  return map
}

export const appDefinitions: AppDefinition[] = [
  {
    id: 'portfolio',
    defaultTitle: 'Or Kwitzel',
    defaultBounds: { width: 1080, height: 800 },
    icon: appIcons.portfolio,
    Root: lazy(() => import('@/apps/portfolio/PortfolioRoot')),
  },
  {
    id: 'computer',
    defaultTitle: 'My Computer',
    defaultBounds: { width: 600, height: 440 },
    icon: appIcons.computer,
    Root: lazy(() => import('@/apps/computer/ComputerRoot')),
  },
  {
    id: 'notepad',
    defaultTitle: 'Notepad',
    defaultBounds: { width: 400, height: 300 },
    icon: appIcons.notepad,
    Root: lazy(() => import('@/apps/notepad/NotepadRoot')),
  },
  {
    id: 'about',
    defaultTitle: 'About portfolio-os',
    defaultBounds: { width: 480, height: 360 },
    icon: appIcons.about,
    Root: lazy(() => import('@/apps/about/AboutRoot')),
  },
  {
    id: 'resume',
    defaultTitle: 'Resume',
    defaultBounds: { width: 560, height: 720 },
    icon: appIcons.resume,
    Root: lazy(() => import('@/apps/resume/ResumeRoot')),
  },
  {
    id: 'playful',
    defaultTitle: 'Minesweeper',
    defaultBounds: { width: 320, height: 360 },
    icon: appIcons.playful,
    Root: lazy(() => import('@/apps/playful/PlayfulRoot')),
  },
  {
    id: 'tetris',
    defaultTitle: 'Tetris',
    defaultBounds: { width: 490, height: 580 },
    icon: appIcons.tetris,
    Root: lazy(() => import('@/apps/tetris/TetrisRoot')),
  },
]
