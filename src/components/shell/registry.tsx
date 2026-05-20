import type { AppDefinition } from '@/store/session/sessionTypes'
import { siteAppDefinitions } from '@/site/registry.site'
import { baseAppDefinitions } from './registry.base'

export { createAppRegistry, defineApp } from './registry.base'

export const appDefinitions: AppDefinition[] = [
  ...siteAppDefinitions,
  ...baseAppDefinitions,
]
