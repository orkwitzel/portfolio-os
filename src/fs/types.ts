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
}

export type DesktopEntry = {
  desktopPath: string
  name: string
  targetPath: string
  /** Explicit icon from `.desktop` JSON; omit to auto-resolve from target. */
  explicitIcon?: IconSource | null
}

export type WwwFile = {
  name: string
  url: string
}

export type AppFile = {
  appId: string
  title?: string
}
