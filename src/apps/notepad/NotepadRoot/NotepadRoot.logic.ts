import { useCallback, useEffect, useRef, useState } from 'react'
import type { AppProps } from '@/store/session/sessionTypes'
import { useFsStore } from '@/store/fsStore'
import { basename, join } from '@/utils/paths'

const NOTEPAD_FIELD_CLASS = 'notepad-field'

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

export function useNotepadRoot({ launch }: AppProps) {
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
      if (!active.classList.contains(NOTEPAD_FIELD_CLASS)) return
      e.preventDefault()
      void save()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [save])

  const label = path ? basename(path) : 'Untitled'

  return {
    value,
    setValue,
    dirty,
    setDirty,
    save,
    label,
    fieldClassName: NOTEPAD_FIELD_CLASS,
  }
}
