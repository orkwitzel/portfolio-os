import type { AppDefinition } from '../desktop/sessionTypes'
import { placeholderIcon, type IconSource } from '../desktop/icons/types'
import type { AppFile, DesktopEntry, DesktopFile, FsNode, WwwFile } from './types'
import { extension } from './paths'
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
    })
  }

  return entries.sort((a, b) => a.name.localeCompare(b.name))
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
