import type { AppDefinition } from '@/store/session/sessionTypes'
import { placeholderIcon, type IconSource } from '@/components/shell/ShellIcon'
import type { AppFile, DesktopEntry, DesktopFile, FsNode, WwwFile } from '@/fs/types'
import { extension } from '@/utils/paths'
import type { FsApi } from './fsDb'

export function parseDesktopFile(content: string): DesktopFile | null {
  try {
    const data = JSON.parse(content) as DesktopFile
    if (typeof data.name !== 'string' || typeof data.path !== 'string') return null
    return data
  } catch {
    return null
  }
}

/**
 * Assign stable default grid positions to entries that lack saved coordinates.
 * Places icons in a single column (col 0), one per row, in the order given.
 * Mutates in place and returns the same array.
 */
export function applyDefaultDesktopPositions(entries: DesktopEntry[]): DesktopEntry[] {
  let nextRow = 0
  for (const entry of entries) {
    if (entry.gridX === -1 && entry.gridY === -1) {
      entry.gridX = 0
      entry.gridY = nextRow++
    } else {
      nextRow = Math.max(nextRow, entry.gridY + 1)
    }
  }
  return entries
}

export async function listDesktopEntries(fs: FsApi): Promise<DesktopEntry[]> {
  const children = await fs.listChildren('/desktop')
  const entries: DesktopEntry[] = []

  for (const node of children) {
    if (node.kind !== 'file' || !node.name.endsWith('.desktop')) continue
    if (!node.content) continue
    const parsed = parseDesktopFile(node.content)
    if (!parsed) {
      console.warn(`Invalid .desktop file: ${node.path}`)
      continue
    }
    entries.push({
      desktopPath: node.path,
      name: parsed.name,
      targetPath: parsed.path,
      explicitIcon: parsed.icon,
      // Sentinel -1 means "not saved"; applyDefaultDesktopPositions will assign.
      gridX: typeof parsed.x === 'number' ? parsed.x : -1,
      gridY: typeof parsed.y === 'number' ? parsed.y : -1,
    })
  }

  const sorted = entries.sort((a, b) => a.name.localeCompare(b.name))
  return applyDefaultDesktopPositions(sorted)
}

/**
 * Persist new grid coordinates for a single .desktop file.
 */
export async function updateDesktopPosition(
  fs: FsApi,
  desktopPath: string,
  gridX: number,
  gridY: number,
): Promise<void> {
  const content = await fs.readFile(desktopPath)
  const parsed = parseDesktopFile(content)
  if (!parsed) return
  await fs.writeFile(desktopPath, JSON.stringify({ ...parsed, x: gridX, y: gridY }))
}

/**
 * Persist new grid coordinates for multiple .desktop files in parallel.
 */
export async function updateDesktopPositions(
  fs: FsApi,
  updates: ReadonlyArray<{ desktopPath: string; gridX: number; gridY: number }>,
): Promise<void> {
  await Promise.all(updates.map(({ desktopPath, gridX, gridY }) =>
    updateDesktopPosition(fs, desktopPath, gridX, gridY),
  ))
}

function parseWww(content: string): WwwFile | null {
  try {
    const data = JSON.parse(content) as WwwFile
    if (typeof data.name !== 'string' || typeof data.url !== 'string') return null
    return data
  } catch {
    return null
  }
}

function parseApp(content: string): AppFile | null {
  try {
    const data = JSON.parse(content) as AppFile
    if (typeof data.appId !== 'string') return null
    return data
  } catch {
    return null
  }
}

export async function resolveDesktopIcon(
  entry: DesktopEntry,
  fs: FsApi,
  registry: Map<string, AppDefinition>,
): Promise<IconSource> {
  if (entry.explicitIcon) return entry.explicitIcon

  const ext = extension(entry.targetPath)
  const target = await fs.getNode(entry.targetPath)
  if (!target?.content) return placeholderIcon

  if (ext === '.www') {
    const www = parseWww(target.content)
    if (www) return { kind: 'favicon', url: www.url }
  }

  if (ext === '.app') {
    const app = parseApp(target.content)
    if (app) {
      const def = registry.get(app.appId)
      if (def?.icon) return def.icon
    }
  }

  return placeholderIcon
}

export function isWwwTarget(targetPath: string): boolean {
  return extension(targetPath) === '.www'
}

export function sortNodesForTree(nodes: FsNode[]): FsNode[] {
  return [...nodes].sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === 'directory' ? -1 : 1
    return a.name.localeCompare(b.name)
  })
}
