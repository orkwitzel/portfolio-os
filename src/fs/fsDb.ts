import { openDB, type IDBPDatabase } from 'idb'
import { buildSeedNodes, SEED_VERSION } from './seedFs'
import type { FsNode } from './types'
import { basename, dirname, extension, join, normalizePath, parentPath } from '@/utils/paths'

function collectDescendantPaths(all: FsNode[], rootPath: string): string[] {
  const root = normalizePath(rootPath)
  return all
    .filter((n) => n.path === root || n.path.startsWith(root + '/'))
    .map((n) => n.path)
    .sort((a, b) => b.length - a.length)
}

const DB_NAME = 'portfolio-os-fs'
const DB_VERSION = 1

type PortfolioFsDB = {
  nodes: { key: string; value: FsNode }
  meta: { key: string; value: number }
}

let dbPromise: Promise<IDBPDatabase<PortfolioFsDB>> | null = null

function getDb(): Promise<IDBPDatabase<PortfolioFsDB>> {
  if (!dbPromise) {
    dbPromise = openDB<PortfolioFsDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('nodes')) {
          db.createObjectStore('nodes')
        }
        if (!db.objectStoreNames.contains('meta')) {
          db.createObjectStore('meta')
        }
      },
    })
  }
  return dbPromise
}

async function ensureSeeded(db: IDBPDatabase<PortfolioFsDB>): Promise<void> {
  const stored = await db.get('meta', 'schemaVersion')
  if (stored === SEED_VERSION) return

  const tx = db.transaction(['nodes', 'meta'], 'readwrite')
  await tx.objectStore('nodes').clear()
  const nodes = buildSeedNodes()
  for (const node of nodes) {
    await tx.objectStore('nodes').put(node, node.path)
  }
  await tx.objectStore('meta').put(SEED_VERSION, 'schemaVersion')
  await tx.done
}

export type FsApi = {
  getNode: (path: string) => Promise<FsNode | undefined>
  getAllNodes: () => Promise<FsNode[]>
  listChildren: (dirPath: string) => Promise<FsNode[]>
  readFile: (path: string) => Promise<string>
  writeFile: (path: string, content: string) => Promise<void>
  patchNode: (path: string, patch: Partial<Pick<FsNode, 'gridX' | 'gridY'>>) => Promise<void>
  mkdir: (path: string) => Promise<void>
  pathExists: (path: string) => Promise<boolean>
  deleteNode: (path: string) => Promise<void>
  renameNode: (oldPath: string, newPath: string) => Promise<void>
  duplicateNode: (srcPath: string, destDir: string) => Promise<string>
}

export async function openFs(): Promise<FsApi> {
  const db = await getDb()
  await ensureSeeded(db)

  return {
    async getNode(path: string) {
      return db.get('nodes', normalizePath(path))
    },

    async getAllNodes() {
      return db.getAll('nodes')
    },

    async listChildren(dirPath: string) {
      const parent = normalizePath(dirPath)
      const all = await db.getAll('nodes')
      return all
        .filter((n) => n.parentPath === parent)
        .sort((a, b) => {
          if (a.kind !== b.kind) return a.kind === 'directory' ? -1 : 1
          return a.name.localeCompare(b.name)
        })
    },

    async readFile(path: string) {
      const node = await db.get('nodes', normalizePath(path))
      if (!node || node.kind !== 'file') {
        throw new Error(`Not a file: ${path}`)
      }
      return node.content ?? ''
    },

    async patchNode(path: string, patch: Partial<Pick<FsNode, 'gridX' | 'gridY'>>) {
      const normalized = normalizePath(path)
      const existing = await db.get('nodes', normalized)
      if (!existing) throw new Error(`Not found: ${normalized}`)
      await db.put('nodes', { ...existing, ...patch, updatedAt: Date.now() }, normalized)
    },

    async writeFile(path: string, content: string) {
      const normalized = normalizePath(path)
      const existing = await db.get('nodes', normalized)
      const now = Date.now()
      if (existing?.kind === 'file') {
        await db.put('nodes', { ...existing, content, updatedAt: now }, normalized)
        return
      }
      const parent = parentPath(normalized)
      if (!parent) {
        throw new Error(`Cannot create file at root without parent: ${normalized}`)
      }
      const parentNode = await db.get('nodes', parent)
      if (!parentNode) {
        throw new Error(`Parent not found: ${parent}`)
      }
      await db.put(
        'nodes',
        {
          path: normalized,
          name: basename(normalized),
          kind: 'file',
          parentPath: parent,
          content,
          updatedAt: now,
        },
        normalized,
      )
    },

    async mkdir(path: string) {
      const normalized = normalizePath(path)
      const existing = await db.get('nodes', normalized)
      if (existing) return

      const parent = dirname(normalized)
      if (normalized !== '/') {
        const parentNode = await db.get('nodes', parent)
        if (!parentNode) {
          throw new Error(`Parent not found: ${parent}`)
        }
      }

      await db.put(
        'nodes',
        {
          path: normalized,
          name: basename(normalized),
          kind: 'directory',
          parentPath: normalized === '/' ? null : parent,
          updatedAt: Date.now(),
        },
        normalized,
      )
    },

    async pathExists(path: string) {
      return (await db.get('nodes', normalizePath(path))) !== undefined
    },

    async deleteNode(path: string) {
      const normalized = normalizePath(path)
      if (normalized === '/') {
        throw new Error('Cannot delete root')
      }
      const all = await db.getAll('nodes')
      const toDelete = collectDescendantPaths(all, normalized)
      if (toDelete.length === 0) {
        throw new Error(`Not found: ${normalized}`)
      }
      const tx = db.transaction('nodes', 'readwrite')
      for (const p of toDelete) {
        await tx.store.delete(p)
      }
      await tx.done
    },

    async renameNode(oldPath: string, newPath: string) {
      const from = normalizePath(oldPath)
      const to = normalizePath(newPath)
      if (from === '/') throw new Error('Cannot rename root')
      if (await db.get('nodes', to)) {
        throw new Error(`Path already exists: ${to}`)
      }
      const node = await db.get('nodes', from)
      if (!node) throw new Error(`Not found: ${from}`)

      const all = await db.getAll('nodes')
      const affected = collectDescendantPaths(all, from).sort((a, b) => a.length - b.length)
      const tx = db.transaction('nodes', 'readwrite')
      const now = Date.now()

      for (const oldP of affected) {
        const suffix = oldP === from ? '' : oldP.slice(from.length)
        const newP = to + suffix
        const existing = await db.get('nodes', oldP)
        if (!existing) continue
        const parent = parentPath(newP)
        const updated: FsNode = {
          ...existing,
          path: newP,
          name: basename(newP),
          parentPath: parent,
          updatedAt: now,
        }
        await tx.store.delete(oldP)
        await tx.store.put(updated, newP)
      }
      await tx.done
    },

    async duplicateNode(srcPath: string, destDir: string) {
      const src = normalizePath(srcPath)
      const dest = normalizePath(destDir)
      const node = await db.get('nodes', src)
      if (!node) throw new Error(`Not found: ${src}`)

      const destParent = await db.get('nodes', dest)
      if (!destParent || destParent.kind !== 'directory') {
        throw new Error(`Destination is not a directory: ${dest}`)
      }

      const allNodes = await db.getAll('nodes')
      const children = allNodes.filter((n) => n.parentPath === dest)
      const used = new Set(children.map((n) => n.name))
      const ext = extension(node.name)
      const stem = ext ? node.name.slice(0, -ext.length) : node.name
      let name = node.name
      if (used.has(name)) {
        name = ext ? `${stem} - Copy${ext}` : `${stem} - Copy`
        let n = 2
        while (used.has(name)) {
          name = ext ? `${stem} - Copy (${n})${ext}` : `${stem} - Copy (${n})`
          n += 1
        }
      }

      const destPath = join(dest, name)
      const now = Date.now()

      const putFile = async (path: string, content: string) => {
        const normalized = normalizePath(path)
        const parent = parentPath(normalized)
        if (!parent) throw new Error(`Invalid path: ${normalized}`)
        await db.put(
          'nodes',
          {
            path: normalized,
            name: basename(normalized),
            kind: 'file',
            parentPath: parent,
            content,
            updatedAt: now,
          },
          normalized,
        )
      }

      const putDir = async (path: string) => {
        const normalized = normalizePath(path)
        if (await db.get('nodes', normalized)) return
        const parent = dirname(normalized)
        await db.put(
          'nodes',
          {
            path: normalized,
            name: basename(normalized),
            kind: 'directory',
            parentPath: normalized === '/' ? null : parent,
            updatedAt: now,
          },
          normalized,
        )
      }

      if (node.kind === 'file') {
        await putFile(destPath, node.content ?? '')
        return destPath
      }

      await putDir(destPath)
      const subtree = allNodes.filter(
        (n) => n.path.startsWith(src + '/') && n.path !== src,
      )
      subtree.sort((a, b) => a.path.length - b.path.length)
      for (const child of subtree) {
        const rel = child.path.slice(src.length)
        const childDest = destPath + rel
        if (child.kind === 'directory') {
          await putDir(childDest)
        } else {
          await putFile(childDest, child.content ?? '')
        }
      }
      return destPath
    },
  }
}
