import type { AppDefinition } from '@/store/session/sessionTypes'
import { defineApp } from '@/components/shell/registry.base'
import { siteIcons } from '@/site/icons'

/** Personal apps — portfolio fork only; omit this file in desktop-os upstream. */
export const siteAppDefinitions: AppDefinition[] = [
  defineApp(() => import('@/site/apps/portfolio/PortfolioRoot'), {
    id: 'portfolio',
    defaultTitle: 'Or Kwitzel',
    defaultBounds: { width: 1080, height: 800 },
    icon: siteIcons.portfolio,
  }),
  defineApp(() => import('@/site/apps/about/AboutRoot'), {
    id: 'about',
    defaultTitle: 'About OrkOS',
    defaultBounds: { width: 480, height: 360 },
    icon: siteIcons.about,
  }),
  defineApp(() => import('@/site/apps/resume/ResumeRoot'), {
    id: 'resume',
    defaultTitle: 'Resume',
    defaultBounds: { width: 560, height: 720 },
    icon: siteIcons.resume,
  }),
]
