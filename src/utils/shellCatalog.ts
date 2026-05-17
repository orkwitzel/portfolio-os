import type { DesktopEntry } from '@/fs/types'
import { isWwwTarget } from '@/fs/desktop'
import { placeholderIcon, type IconSource } from '@/components/shell/ShellIcon'
import type { WindowManagerApi } from '@/store/session/windowManagerContext'

export type ShellLaunchItem = {
  kind: 'app' | 'link'
  id: string
  label: string
  icon: IconSource
  launch: () => void
} | {
  kind: 'desktop'
  id: string
  /** Desktop item path — `.desktop` shortcut or direct file; used as the unique id. */
  desktopPath: string
  targetPath: string
  label: string
  icon: IconSource
  launch: () => void
  gridX: number
  gridY: number
}

export function buildProgramItems(wm: WindowManagerApi): ShellLaunchItem[] {
  return Array.from(wm.registry.values()).map((def) => ({
    kind: 'app',
    id: def.id,
    label: def.defaultTitle,
    icon: def.icon ?? placeholderIcon,
    launch: () => wm.openApp(def.id),
  }))
}

export async function buildDesktopItems(
  entries: DesktopEntry[],
  openPath: (path: string) => void | Promise<void>,
  resolveIcon: (entry: DesktopEntry) => Promise<IconSource>,
): Promise<ShellLaunchItem[]> {
  const items: ShellLaunchItem[] = []
  for (const entry of entries) {
    items.push({
      kind: 'desktop',
      id: entry.desktopPath,
      desktopPath: entry.desktopPath,
      targetPath: entry.targetPath,
      label: entry.name,
      icon: await resolveIcon(entry),
      launch: () => void openPath(entry.targetPath),
      gridX: entry.gridX,
      gridY: entry.gridY,
    })
  }
  return items
}

export async function buildStartLinkItems(
  entries: DesktopEntry[],
  openPath: (path: string) => void | Promise<void>,
  resolveIcon: (entry: DesktopEntry) => Promise<IconSource>,
): Promise<ShellLaunchItem[]> {
  const wwwEntries = entries.filter((e) => isWwwTarget(e.targetPath))
  const items: ShellLaunchItem[] = []
  for (const entry of wwwEntries) {
    items.push({
      kind: 'link',
      id: entry.desktopPath,
      label: entry.name,
      icon: await resolveIcon(entry),
      launch: () => void openPath(entry.targetPath),
    })
  }
  return items
}
