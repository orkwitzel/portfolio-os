import type { FsApi } from './fsDb'
import { basename, dirname, extension, join, normalizePath } from '@/utils/paths'
import { parseDesktopFile } from './desktop'
import type { DesktopFile } from './types'

const PROTECTED_PATHS = new Set(['/'])

export function isProtectedPath(path: string): boolean {
  return PROTECTED_PATHS.has(normalizePath(path))
}

export async function uniqueNameInDir(
  fs: FsApi,
  dirPath: string,
  baseName: string,
): Promise<string> {
  const dir = normalizePath(dirPath)
  const ext = extension(baseName)
  const stem = ext ? baseName.slice(0, -ext.length) : baseName
  let candidate = baseName
  let n = 2
  while (await fs.pathExists(join(dir, candidate))) {
    candidate = ext ? `${stem} (${n})${ext}` : `${stem} (${n})`
    n += 1
  }
  return candidate
}

export async function nextUntitledPath(fs: FsApi, dir = '/docs'): Promise<string> {
  const children = await fs.listChildren(dir)
  const used = new Set(children.map((n) => n.path))
  let n = 1
  while (used.has(join(dir, `untitled-${n}.txt`))) {
    n += 1
  }
  return join(dir, `untitled-${n}.txt`)
}

export async function nextDesktopShortcutPath(fs: FsApi, baseName: string): Promise<string> {
  const children = await fs.listChildren('/desktop')
  const used = new Set(children.map((n) => n.path))
  const stem = baseName.replace(/\.desktop$/i, '') || 'shortcut'
  let candidate = `${stem}.desktop`
  let n = 2
  while (used.has(join('/desktop', candidate))) {
    candidate = `${stem} (${n}).desktop`
    n += 1
  }
  return join('/desktop', candidate)
}

export async function renameDesktopLabel(
  fs: FsApi,
  desktopPath: string,
  newLabel: string,
): Promise<void> {
  const content = await fs.readFile(desktopPath)
  const parsed = parseDesktopFile(content)
  if (!parsed) throw new Error(`Invalid desktop file: ${desktopPath}`)
  const next: DesktopFile = { ...parsed, name: newLabel.trim() || parsed.name }
  await fs.writeFile(desktopPath, JSON.stringify(next))
}

export function resolveDesktopFileName(currentName: string, label: string): string {
  const trimmed = label.trim()
  if (!trimmed) return currentName
  if (extension(trimmed)) return trimmed
  const ext = extension(currentName)
  return ext ? `${trimmed}${ext}` : trimmed
}

export async function renameDesktopFile(
  fs: FsApi,
  desktopPath: string,
  label: string,
): Promise<string> {
  const from = normalizePath(desktopPath)
  const parent = dirname(from)
  const currentName = basename(from)
  const nextName = await uniqueNameInDir(
    fs,
    parent,
    resolveDesktopFileName(currentName, label),
  )
  const to = join(parent, nextName)
  if (to !== from) await fs.renameNode(from, to)
  return to
}

export async function renameDesktopDirectory(
  fs: FsApi,
  desktopPath: string,
  label: string,
): Promise<string> {
  const from = normalizePath(desktopPath)
  const parent = dirname(from)
  const trimmed = label.trim().replace(/[/\\]/g, '')
  if (!trimmed || trimmed === basename(from)) return from
  const nextName = await uniqueNameInDir(fs, parent, trimmed)
  const to = join(parent, nextName)
  if (to !== from) await fs.renameNode(from, to)
  return to
}

export async function createTextDocument(fs: FsApi): Promise<string> {
  const filePath = await nextUntitledPath(fs, '/desktop')
  await fs.writeFile(filePath, '')
  return filePath
}

export async function createFolder(fs: FsApi, parentDir: string): Promise<string> {
  const dir = normalizePath(parentDir)
  const name = await uniqueNameInDir(fs, dir, 'New Folder')
  const path = join(dir, name)
  await fs.mkdir(path)
  return path
}

export async function createDesktopShortcut(
  fs: FsApi,
  targetPath: string,
  label?: string,
): Promise<string> {
  const target = normalizePath(targetPath)
  const name = label ?? basename(target)
  const desktopPath = await nextDesktopShortcutPath(fs, `${name}.desktop`)
  const desktop: DesktopFile = { name, path: target }
  await fs.writeFile(desktopPath, JSON.stringify(desktop))
  return desktopPath
}

export async function moveNode(fs: FsApi, srcPath: string, destDir: string): Promise<string> {
  const src = normalizePath(srcPath)
  const dest = normalizePath(destDir)
  const name = await uniqueNameInDir(fs, dest, basename(src))
  const destPath = join(dest, name)
  await fs.renameNode(src, destPath)
  return destPath
}
