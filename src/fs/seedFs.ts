import readme from '../content/seed/README.md?raw'
import keyboardShortcuts from '../content/seed/docs/keyboard-shortcuts.md?raw'
import notes from '../content/seed/docs/notes.txt?raw'
import type { FsNode } from './types'
import { appIcons } from '@/utils/appIcons'
import { buildSiteSeedNodes } from '@/site/seed/siteSeed'
import { basename, join, parentPath } from '@/utils/paths'

export const SEED_VERSION = 7

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

/** Generic OS seed — desktop-os upstream owns this. */
export function buildBaseSeedNodes(now: number): FsNode[] {
  const nodes: FsNode[] = [dir('/', now)]

  const directories = ['/apps', '/docs', '/www', '/desktop']

  for (const d of directories) {
    nodes.push(dir(d, now))
  }

  nodes.push(file('/README.md', readme, now))
  nodes.push(file('/docs/keyboard-shortcuts.md', keyboardShortcuts, now))
  nodes.push(file('/docs/notes.txt', notes, now))

  nodes.push(
    jsonFile('/apps/playful.app', { appId: 'playful', title: 'Minesweeper' }, now),
  )
  nodes.push(
    jsonFile('/apps/tetris.app', { appId: 'tetris', title: 'Tetris' }, now),
  )
  nodes.push(
    jsonFile('/apps/computer.app', { appId: 'computer', title: 'My Computer' }, now),
  )
  nodes.push(
    jsonFile('/apps/notepad.app', { appId: 'notepad', title: 'Notepad' }, now),
  )
  nodes.push(
    jsonFile('/apps/settings.app', { appId: 'settings', title: 'Settings' }, now),
  )

  nodes.push(
    jsonFile(
      join('/desktop', 'my-computer.desktop'),
      { name: 'My Computer', path: '/apps/computer.app', icon: appIcons.computer },
      now,
    ),
  )
  nodes.push(
    jsonFile(
      join('/desktop', 'notepad.desktop'),
      { name: 'Notepad', path: '/apps/notepad.app', icon: appIcons.notepad },
      now,
    ),
  )
  nodes.push(
    jsonFile(
      join('/desktop', 'settings.desktop'),
      { name: 'Settings', path: '/apps/settings.app', icon: appIcons.settings },
      now,
    ),
  )

  return nodes
}

export function buildSeedNodes(): FsNode[] {
  const now = Date.now()
  return [...buildBaseSeedNodes(now), ...buildSiteSeedNodes(now)]
}
