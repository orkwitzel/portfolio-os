import type { AppDefinition } from '@/store/session/sessionTypes'
import { placeholderIcon, type IconSource } from '@/components/shell/ShellIcon'
import type { AppFile, FsNode, WwwFile } from '@/fs/types'
import { appIcons } from '@/utils/appIcons'
import { nerd } from '@/utils/nerdIcons'
import { extension } from '@/utils/paths'
import type { FsApi } from './fsDb'

function parseWww(content: string): WwwFile | null {
  try {
    const data = JSON.parse(content) as WwwFile
    if (typeof data.url !== 'string') return null
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

export async function resolveNodeIcon(
  node: FsNode,
  fs: FsApi,
  registry: Map<string, AppDefinition>,
): Promise<IconSource> {
  if (node.kind === 'directory') {
    return { kind: 'nerd', glyph: nerd.folder }
  }

  const ext = extension(node.path)

  if (ext === '.txt') return appIcons.notepad
  if (ext === '.md') return { kind: 'nerd', glyph: nerd.document }

  if (!node.content) return placeholderIcon

  if (ext === '.www') {
    const www = parseWww(node.content)
    if (www) return { kind: 'favicon', url: www.url }
  }

  if (ext === '.app') {
    const app = parseApp(node.content)
    if (app) {
      const def = registry.get(app.appId)
      if (def?.icon) return def.icon
    }
  }

  if (ext === '.desktop') {
    try {
      const desktop = JSON.parse(node.content) as { icon?: IconSource }
      if (desktop.icon) return desktop.icon
      const target = (desktop as { path?: string }).path
      if (target) {
        const targetNode = await fs.getNode(target)
        if (targetNode) return resolveNodeIcon(targetNode, fs, registry)
      }
    } catch {
      /* fall through */
    }
  }

  return placeholderIcon
}
