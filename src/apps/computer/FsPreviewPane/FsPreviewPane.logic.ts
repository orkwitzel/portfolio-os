import { useEffect, useState } from 'react'
import type { AppFile, WwwFile } from '@/fs/types'
import { useOs } from '@/hooks/useOs'
import { useFsStore } from '@/store/fsStore'
import { basename, extension } from '@/utils/paths'

export type FsPreviewPaneProps = {
  selectedPath: string | null
}

export function parseWww(content: string): WwwFile | null {
  try {
    const www = JSON.parse(content) as WwwFile
    if (typeof www.url !== 'string') return null
    return www
  } catch {
    return null
  }
}

export function parseApp(content: string): AppFile | null {
  try {
    const app = JSON.parse(content) as AppFile
    if (typeof app.appId !== 'string') return null
    return app
  } catch {
    return null
  }
}

export function useFsPreviewPane({ selectedPath }: FsPreviewPaneProps) {
  const os = useOs()
  const ready = useFsStore((s) => s.ready)
  const [content, setContent] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedPath || !ready) {
      setContent(null)
      setError(null)
      return
    }

    let cancelled = false
    os.fs
      .read(selectedPath)
      .then((text) => {
        if (!cancelled) {
          setContent(text)
          setError(null)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setContent(null)
          setError('Could not read file.')
        }
      })

    return () => {
      cancelled = true
    }
  }, [ready, os, selectedPath])

  const ext = selectedPath ? extension(selectedPath) : ''

  const openInNotepad = () => {
    if (!selectedPath) return
    os.win.openApp('notepad', {
      title: basename(selectedPath),
      launch: { path: selectedPath },
    })
  }

  return {
    selectedPath,
    content,
    error,
    ext,
    openPath: (path: string) => os.fs.open(path),
    openInNotepad,
  }
}
