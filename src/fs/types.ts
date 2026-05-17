import type { IconSource } from '../desktop/icons/types'

export type FsNode = {
  path: string
  name: string
  kind: 'directory' | 'file'
  parentPath: string | null
  content?: string
  updatedAt: number
}

export type DesktopFile = {
  name: string
  path: string
  icon?: IconSource | null
  /** Grid column index (0-based). Absent = auto-assigned default layout. */
  x?: number
  /** Grid row index (0-based). Absent = auto-assigned default layout. */
  y?: number
}

export type DesktopEntry = {
  desktopPath: string
  name: string
  targetPath: string
  /** Explicit icon from `.desktop` JSON; omit to auto-resolve from target. */
  explicitIcon?: IconSource | null
  /** Grid column index after default layout is applied. */
  gridX: number
  /** Grid row index after default layout is applied. */
  gridY: number
}

export type WwwFile = {
  name: string
  url: string
}

export type AppFile = {
  appId: string
  title?: string
}
