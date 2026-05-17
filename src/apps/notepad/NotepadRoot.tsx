import { useCallback, useEffect, useRef, useState } from 'react'
import type { AppProps } from '../../desktop/sessionTypes'
import { useFsStore } from '../../fs/fsStore'
import { basename, join } from '../../fs/paths'
import styles from './notepad.module.css'

async function nextUntitledPath(
  listChildren: (dir: string) => Promise<{ path: string }[]>,
): Promise<string> {
  const children = await listChildren('/docs')
  const used = new Set(children.map((n) => n.path))
  let n = 1
  while (used.has(join('/docs', `untitled-${n}.txt`))) {
    n += 1
  }
  return join('/docs', `untitled-${n}.txt`)
}

export function NotepadRoot({ launch }: AppProps) {
  const ready = useFsStore((s) => s.ready)
  const readFile = useFsStore((s) => s.readFile)
  const writeFile = useFsStore((s) => s.writeFile)
  const listChildren = useFsStore((s) => s.listChildren)
  const [value, setValue] = useState('')
  const [path, setPath] = useState<string | null>(launch?.path ?? null)
  const [dirty, setDirty] = useState(false)
  const pathRef = useRef(path)

  useEffect(() => {
    pathRef.current = path
  }, [path])

  useEffect(() => {
    if (!launch?.path || !ready) return

    let cancelled = false
    readFile(launch.path)
      .then((text) => {
        if (!cancelled) {
          setValue(text)
          setDirty(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setValue('')
          setDirty(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [ready, readFile, launch?.path])

  const save = useCallback(async () => {
    let target = pathRef.current
    if (!target) {
      target = await nextUntitledPath(listChildren)
      setPath(target)
      pathRef.current = target
    }
    await writeFile(target, value)
    setDirty(false)
  }, [listChildren, writeFile, value])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!e.ctrlKey || e.shiftKey || e.key.toLowerCase() !== 's') return
      const active = document.activeElement
      if (!active || !(active instanceof HTMLTextAreaElement)) return
      if (!active.classList.contains(styles.notepadField)) return
      e.preventDefault()
      void save()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [save])

  const label = path ? basename(path) : 'Untitled'

  return (
    <div className={styles.appBody}>
      <div className={styles.toolbar}>
        <button type="button" className={styles.toolBtn} onClick={() => void save()}>
          Save
        </button>
        <span className={styles.pathLabel}>
          {label}
          {dirty ? ' *' : ''}
        </span>
      </div>
      <textarea
        className={styles.notepadField}
        spellCheck={false}
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          setDirty(true)
        }}
      />
    </div>
  )
}
