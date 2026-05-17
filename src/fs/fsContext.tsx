import { createContext, useContext, type ReactNode } from 'react'
import type { AppDefinition } from '../desktop/sessionTypes'
import type { IconSource } from '../desktop/icons/types'
import type { DesktopEntry, FsNode } from './types'
import type { FsApi } from './fsDb'

export type FsContextValue = {
  ready: boolean
  fs: FsApi | null
  nodes: FsNode[]
  listDesktopEntries: () => Promise<DesktopEntry[]>
  listAllNodes: () => Promise<FsNode[]>
  readFile: (path: string) => Promise<string>
  writeFile: (path: string, content: string) => Promise<void>
  mkdir: (path: string) => Promise<void>
  listChildren: (dirPath: string) => Promise<FsNode[]>
  openPath: (path: string) => Promise<void>
  resolveDesktopIcon: (entry: DesktopEntry) => Promise<IconSource>
  refreshNodes: () => Promise<void>
}

export const FsContext = createContext<FsContextValue | null>(null)

export function useFs(): FsContextValue {
  const ctx = useContext(FsContext)
  if (!ctx) {
    throw new Error('useFs must be used within FsProvider')
  }
  return ctx
}

export type FsProviderProps = {
  registry: Map<string, AppDefinition>
  children: ReactNode
}
