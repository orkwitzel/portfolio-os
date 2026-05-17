import type { IconSource } from './icons/types'

export type ExternalLinkDefinition = {
  id: string
  label: string
  url: string
  icon?: IconSource
}

/** Social / portfolio URLs — edit labels and URLs here. */
export const externalLinks: ExternalLinkDefinition[] = [
  {
    id: 'github',
    label: 'GitHub',
    url: 'https://github.com/orkwitzel',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/or-kwitzel-83294b2b4/',
  },
]
