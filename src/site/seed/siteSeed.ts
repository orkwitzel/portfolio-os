import type { FsNode } from '@/fs/types'
import { siteIcons, siteWwwIcons } from '@/site/icons'
import { basename, join, parentPath } from '@/utils/paths'

function jsonFile(path: string, value: unknown, now: number): FsNode {
  return {
    path,
    name: basename(path),
    kind: 'file',
    parentPath: parentPath(path),
    content: JSON.stringify(value, null, 2) + '\n',
    updatedAt: now,
  }
}

/** Personal FS nodes — portfolio fork only. */
export function buildSiteSeedNodes(now: number): FsNode[] {
  const nodes: FsNode[] = []

  nodes.push(
    jsonFile('/apps/portfolio.app', { appId: 'portfolio', title: 'Or Kwitzel' }, now),
  )
  nodes.push(
    jsonFile('/apps/about.app', { appId: 'about', title: 'About portfolio-os' }, now),
  )
  nodes.push(
    jsonFile('/apps/resume.app', { appId: 'resume', title: 'Resume' }, now),
  )

  nodes.push(
    jsonFile(
      '/www/github.www',
      { name: 'GitHub', url: 'https://github.com/orkwitzel' },
      now,
    ),
  )
  nodes.push(
    jsonFile(
      '/www/linkedin.www',
      {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/in/or-kwitzel-83294b2b4/',
      },
      now,
    ),
  )

  nodes.push(
    jsonFile(
      join('/desktop', 'portfolio.desktop'),
      { name: 'Or Kwitzel', path: '/apps/portfolio.app', icon: siteIcons.portfolio },
      now,
    ),
  )
  nodes.push(
    jsonFile(
      join('/desktop', 'github.desktop'),
      { name: 'GitHub', path: '/www/github.www', icon: siteWwwIcons.github },
      now,
    ),
  )
  nodes.push(
    jsonFile(
      join('/desktop', 'linkedin.desktop'),
      { name: 'LinkedIn', path: '/www/linkedin.www', icon: siteWwwIcons.linkedin },
      now,
    ),
  )

  return nodes
}
