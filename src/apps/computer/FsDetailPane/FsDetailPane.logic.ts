import { useEffect, useState } from 'react'
import type { AppFile, WwwFile } from '@/fs/types'
import { useFsStore } from '@/store/fsStore'
import { basename, extension } from '@/utils/paths'
import { useWindowManager } from '@/hooks/useWindowManager'

export type FsDetailPaneProps = {
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

export function useFsDetailPane({ selectedPath }: FsDetailPaneProps) {
  const ready = useFsStore((s) => s.ready)
  const readFile = useFsStore((s) => s.readFile)
  const openPath = useFsStore((s) => s.openPath)
  const wm = useWindowManager()
  const [content, setContent] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedPath || !ready) return

    let cancelled = false
    readFile(selectedPath)
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
  }, [ready, readFile, selectedPath])

  const ext = selectedPath ? extension(selectedPath) : ''

  const openInNotepad = () => {
    if (!selectedPath) return
    wm.openApp('notepad', {
      title: basename(selectedPath),
      launch: { path: selectedPath },
    })
  }

  return { selectedPath, content, error, ext, openPath, openInNotepad }
}
