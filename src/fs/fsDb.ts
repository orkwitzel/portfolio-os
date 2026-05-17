import { openDB, type IDBPDatabase } from 'idb'
import { buildSeedNodes, SEED_VERSION } from './seedFs'
import type { FsNode } from './types'
import { basename, dirname, normalizePath, parentPath } from './paths'

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
  mkdir: (path: string) => Promise<void>
  pathExists: (path: string) => Promise<boolean>
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
  }
}
