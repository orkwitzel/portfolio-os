import { useCallback, useEffect, useState } from 'react'
import { useOs } from '@/hooks/useOs'
import { useFsStore } from '@/store/fsStore'
import type { FsNode } from '@/fs/types'
import { basename, dirname, extension, join, normalizePath } from '@/utils/paths'

export type ShellFilePickerMode = 'open' | 'saveAs'

export type ShellFilePickerProps = {
  open: boolean
  mode: ShellFilePickerMode
  initialDir?: string
  defaultFileName?: string
  onSelect: (path: string) => void
  onCancel: () => void
}

function sortNodes(nodes: FsNode[]): FsNode[] {
  return [...nodes].sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === 'directory' ? -1 : 1
    return a.name.localeCompare(b.name)
  })
}

export function useShellFilePicker({
  mode,
  initialDir = '/docs',
  defaultFileName = '',
  onSelect,
  onCancel,
}: Omit<ShellFilePickerProps, 'open'>) {
  const os = useOs()
  const ready = useFsStore((s) => s.ready)
  const [currentDir, setCurrentDir] = useState(() => normalizePath(initialDir))
  const [listing, setListing] = useState<{ dir: string; entries: FsNode[] } | null>(null)
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [fileName, setFileName] = useState(defaultFileName)

  useEffect(() => {
    if (!ready) return
    let cancelled = false
    const dir = currentDir
    void os.fs
      .listChildren(dir)
      .then((children) => {
        if (cancelled) return
        const filtered =
          mode === 'open'
            ? children.filter(
                (n) => n.kind === 'directory' || extension(n.name).toLowerCase() === '.txt',
              )
            : children.filter((n) => n.kind === 'directory')
        setListing({ dir, entries: sortNodes(filtered) })
      })
      .catch(() => {
        if (!cancelled) setListing({ dir, entries: [] })
      })
    return () => {
      cancelled = true
    }
  }, [ready, os, currentDir, mode])

  const loading = !listing || listing.dir !== currentDir
  const entries = loading ? [] : listing.entries

  const goUp = useCallback(() => {
    const parent = dirname(currentDir)
    setCurrentDir(parent)
    setSelectedPath(null)
  }, [currentDir])

  const openEntry = useCallback(
    (node: FsNode) => {
      if (node.kind === 'directory') {
        setCurrentDir(normalizePath(node.path))
        setSelectedPath(null)
        return
      }
      setSelectedPath(node.path)
      setFileName(basename(node.path))
    },
    [],
  )

  const confirm = useCallback(() => {
    if (mode === 'open') {
      if (selectedPath) {
        onSelect(selectedPath)
        return
      }
      return
    }
    const trimmed = fileName.trim().replace(/[/\\]/g, '')
    if (!trimmed) return
    let name = trimmed
    if (extension(name).toLowerCase() !== '.txt') {
      name = `${name}.txt`
    }
    const dest = join(currentDir, name)
    onSelect(normalizePath(dest))
  }, [mode, selectedPath, fileName, currentDir, onSelect])

  const canConfirm =
    mode === 'open' ? selectedPath !== null : fileName.trim().length > 0

  const title = mode === 'open' ? 'Open' : 'Save As'

  return {
    title,
    currentDir,
    entries,
    selectedPath,
    fileName,
    setFileName,
    loading,
    canConfirm,
    goUp,
    openEntry,
    confirm,
    onCancel,
    canGoUp: currentDir !== '/',
  }
}
