import readme from '../content/seed/README.md?raw'
import keyboardShortcuts from '../content/seed/docs/keyboard-shortcuts.md?raw'
import notes from '../content/seed/docs/notes.txt?raw'
import type { FsNode } from './types'
import { basename, join, parentPath } from '@/utils/paths'

export const SEED_VERSION = 2

function dir(path: string, now: number): FsNode {
  return {
    path,
    name: basename(path),
    kind: 'directory',
    parentPath: parentPath(path),
    updatedAt: now,
  }
}

function file(path: string, content: string, now: number): FsNode {
  return {
    path,
    name: basename(path),
    kind: 'file',
    parentPath: parentPath(path),
    content,
    updatedAt: now,
  }
}

function jsonFile(path: string, value: unknown, now: number): FsNode {
  return file(path, JSON.stringify(value, null, 2) + '\n', now)
}

export function buildSeedNodes(): FsNode[] {
  const now = Date.now()
  const nodes: FsNode[] = [dir('/', now)]

  const directories = [
    '/apps',
    '/docs',
    '/www',
    '/desktop',
  ]

  for (const d of directories) {
    nodes.push(dir(d, now))
  }

  nodes.push(file('/README.md', readme, now))
  nodes.push(file('/docs/keyboard-shortcuts.md', keyboardShortcuts, now))
  nodes.push(file('/docs/notes.txt', notes, now))

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
    jsonFile('/apps/playful.app', { appId: 'playful', title: 'Minesweeper' }, now),
  )
  nodes.push(
    jsonFile('/apps/computer.app', { appId: 'computer', title: 'My Computer' }, now),
  )
  nodes.push(
    jsonFile('/apps/notepad.app', { appId: 'notepad', title: 'Notepad' }, now),
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
      { name: 'Or Kwitzel', path: '/apps/portfolio.app' },
      now,
    ),
  )
  nodes.push(
    jsonFile(
      join('/desktop', 'my-computer.desktop'),
      { name: 'My Computer', path: '/apps/computer.app' },
      now,
    ),
  )
  nodes.push(
    jsonFile(
      join('/desktop', 'notepad.desktop'),
      { name: 'Notepad', path: '/apps/notepad.app' },
      now,
    ),
  )
  nodes.push(
    jsonFile(
      join('/desktop', 'github.desktop'),
      { name: 'GitHub', path: '/www/github.www', icon: null },
      now,
    ),
  )
  nodes.push(
    jsonFile(
      join('/desktop', 'linkedin.desktop'),
      { name: 'LinkedIn', path: '/www/linkedin.www', icon: null },
      now,
    ),
  )

  return nodes
}
