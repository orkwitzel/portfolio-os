import { useEffect, useState, type ReactNode } from 'react'
import { MarkdownView } from '../_shared/MarkdownView'
import { openExternalLink } from '../../desktop/openExternalLink'
import { useFsStore } from '../../fs/fsStore'
import { basename, extension } from '../../fs/paths'
import type { AppFile, WwwFile } from '../../fs/types'
import { useWindowManager } from '../../desktop/windowManagerContext'
import styles from './computer.module.css'

type FsDetailPaneProps = {
  selectedPath: string | null
}

function DetailActions({ onOpen, label = 'Open' }: { onOpen: () => void; label?: string }) {
  return (
    <div className={styles.detailActions}>
      <button type="button" className={styles.toolbarBtn} onClick={onOpen}>
        {label}
      </button>
    </div>
  )
}

function parseWww(content: string): WwwFile | null {
  try {
    const www = JSON.parse(content) as WwwFile
    if (typeof www.url !== 'string') return null
    return www
  } catch {
    return null
  }
}

function parseApp(content: string): AppFile | null {
  try {
    const app = JSON.parse(content) as AppFile
    if (typeof app.appId !== 'string') return null
    return app
  } catch {
    return null
  }
}

function WwwDetail({ www }: { www: WwwFile }) {
  return (
    <>
      <p className={styles.detailPre}>
        <strong>{www.name ?? 'Link'}</strong>
        {'\n'}
        {www.url}
      </p>
      <DetailActions onOpen={() => openExternalLink(www.url)} label="Open in new tab" />
    </>
  )
}

function AppDetail({
  app,
  onOpen,
}: {
  app: AppFile
  onOpen: () => void
}) {
  return (
    <>
      <p className={styles.detailPre}>
        App: {app.appId}
        {app.title ? `\nTitle: ${app.title}` : ''}
      </p>
      <DetailActions onOpen={onOpen} />
    </>
  )
}

export function FsDetailPane({ selectedPath }: FsDetailPaneProps) {
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

  let body: ReactNode = <p className={styles.detailMessage}>Select a file in the tree.</p>

  if (error) {
    body = <p className={styles.detailMessage}>{error}</p>
  } else if (selectedPath && content !== null) {
    switch (ext) {
      case '.md':
        body = <MarkdownView source={content} />
        break
      case '.www': {
        const www = parseWww(content)
        body = www ? (
          <WwwDetail www={www} />
        ) : (
          <p className={styles.detailMessage}>Invalid .www JSON.</p>
        )
        break
      }
      case '.app': {
        const app = parseApp(content)
        body = app ? (
          <AppDetail app={app} onOpen={() => void openPath(selectedPath)} />
        ) : (
          <p className={styles.detailMessage}>Invalid .app JSON.</p>
        )
        break
      }
      case '.desktop':
        body = <pre className={styles.detailPre}>{content}</pre>
        break
      case '.txt':
        body = (
          <>
            <p className={styles.detailMessage}>Plain text file — opens in Notepad.</p>
            <DetailActions onOpen={openInNotepad} label="Open in Notepad" />
          </>
        )
        break
      default:
        body = <p className={styles.detailMessage}>Unsupported file type: {ext || '(none)'}</p>
    }
  }

  return (
    <div className={styles.detailPane}>
      <div className={styles.locationBar}>{selectedPath ?? '/'}</div>
      <div className={styles.detailBody}>{body}</div>
    </div>
  )
}
