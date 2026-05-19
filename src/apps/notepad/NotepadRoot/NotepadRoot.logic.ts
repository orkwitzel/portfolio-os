import { useCallback, useEffect, useRef, useState } from 'react'
import type { AppProps } from '@/store/session/sessionTypes'
import type { AppMenuDef } from '@/components/shell/AppMenuBar'
import type { ShellFilePickerMode } from '@/components/shell/ShellFilePicker'
import { useOs } from '@/hooks/useOs'
import { useFsStore } from '@/store/fsStore'
import { useWindowCloseGuard } from '@/hooks/useWindowCloseGuard'
import { nextUntitledPath } from '@/fs/fsOperations'
import { basename, dirname } from '@/utils/paths'
import {
  NOTEPAD_FIELD_CLASS,
  notepadWindowTitle,
  saveChangesMessage,
} from './notepadDocument'

export type NotepadFieldAccess = {
  get: () => HTMLTextAreaElement | null
}

export type NotepadRootLogicProps = AppProps & {
  fieldAccess: NotepadFieldAccess
}

export function useNotepadRoot({ windowId, launch, fieldAccess }: NotepadRootLogicProps) {
  const os = useOs()
  const ready = useFsStore((s) => s.ready)
  const fs = useFsStore((s) => s.fs)

  const pathRef = useRef<string | null>(launch?.path ?? null)
  const dirtyRef = useRef(false)

  const [documentKey, setDocumentKey] = useState(0)
  const [initialText, setInitialText] = useState('')
  const [path, setPath] = useState<string | null>(launch?.path ?? null)
  const [wordWrap, setWordWrap] = useState(false)
  const [findText, setFindText] = useState('')
  const [pickerMode, setPickerMode] = useState<ShellFilePickerMode | null>(null)
  const [findOpen, setFindOpen] = useState(false)
  const [findInput, setFindInput] = useState('')
  const [replaceOpen, setReplaceOpen] = useState(false)
  const [replaceFind, setReplaceFind] = useState('')
  const [replaceWith, setReplaceWith] = useState('')
  const [aboutOpen, setAboutOpen] = useState(false)

  const syncDirty = useCallback(
    (next: boolean) => {
      dirtyRef.current = next
      os.win.setTitle(windowId, notepadWindowTitle(pathRef.current, next))
    },
    [os, windowId],
  )

  const syncTitle = useCallback(
    (nextPath: string | null, nextDirty: boolean) => {
      os.win.setTitle(windowId, notepadWindowTitle(nextPath, nextDirty))
    },
    [os, windowId],
  )

  const getContent = useCallback(() => fieldAccess.get()?.value ?? '', [fieldAccess])

  const loadDocument = useCallback(
    (text: string, nextPath: string | null) => {
      pathRef.current = nextPath
      setPath(nextPath)
      setInitialText(text)
      setDocumentKey((k) => k + 1)
      dirtyRef.current = false
      syncTitle(nextPath, false)
    },
    [syncTitle],
  )

  useEffect(() => {
    syncTitle(pathRef.current, false)
  }, [syncTitle])

  useEffect(() => {
    if (!launch?.path || !ready) return
    let cancelled = false
    void os.fs
      .read(launch.path)
      .then((text) => {
        if (!cancelled) loadDocument(text, launch.path)
      })
      .catch(() => {
        if (!cancelled) loadDocument('', launch.path)
      })
    return () => {
      cancelled = true
    }
  }, [ready, os, launch?.path, loadDocument])

  const markDirty = useCallback(() => {
    if (dirtyRef.current) return
    syncDirty(true)
  }, [syncDirty])

  const writeToPath = useCallback(
    async (target: string) => {
      await os.fs.write(target, getContent())
      pathRef.current = target
      setPath(target)
      dirtyRef.current = false
      syncTitle(target, false)
    },
    [os, getContent, syncTitle],
  )

  const save = useCallback(async (): Promise<boolean> => {
    let target = pathRef.current
    if (!target) {
      if (!fs) return false
      target = await nextUntitledPath(fs)
    }
    try {
      await writeToPath(target)
      return true
    } catch {
      await os.ui.confirm({
        title: 'Notepad',
        message: 'Could not save this file.',
        confirmLabel: 'OK',
        cancelLabel: 'OK',
      })
      return false
    }
  }, [fs, writeToPath, os])

  const promptSaveChanges = useCallback(async () => {
    if (!dirtyRef.current) return 'discard' as const
    const result = await os.ui.saveChanges({
      title: 'Notepad',
      message: saveChangesMessage(pathRef.current),
    })
    if (result === 'cancel') return 'cancel' as const
    if (result === 'save') {
      if (!(await save())) return 'cancel' as const
    }
    return 'discard' as const
  }, [os, save])

  const saveAs = useCallback(() => {
    setPickerMode('saveAs')
  }, [])

  const openPicker = useCallback(() => {
    setPickerMode('open')
  }, [])

  const newDocument = useCallback(async () => {
    const choice = await promptSaveChanges()
    if (choice === 'cancel') return
    loadDocument('', null)
  }, [promptSaveChanges, loadDocument])

  const openPath = useCallback(
    async (target: string) => {
      const choice = await promptSaveChanges()
      if (choice === 'cancel') return
      try {
        const text = await os.fs.read(target)
        loadDocument(text, target)
      } catch {
        await os.ui.confirm({
          title: 'Notepad',
          message: 'Could not open this file.',
          confirmLabel: 'OK',
          cancelLabel: 'OK',
        })
      }
    },
    [os, promptSaveChanges, loadDocument],
  )

  const exit = useCallback(() => {
    void os.win.requestClose(windowId).then((allowed) => {
      if (allowed) os.win.close(windowId)
    })
  }, [os, windowId])

  const onPickerSelect = useCallback(
    (selected: string) => {
      setPickerMode(null)
      if (pickerMode === 'open') {
        void openPath(selected)
      } else if (pickerMode === 'saveAs') {
        void writeToPath(selected)
      }
    },
    [pickerMode, openPath, writeToPath],
  )

  const insertTimeDate = useCallback(() => {
    const el = fieldAccess.get()
    if (!el) return
    const stamp = new Date().toLocaleString()
    const start = el.selectionStart ?? 0
    const end = el.selectionEnd ?? 0
    const before = el.value.slice(0, start)
    const after = el.value.slice(end)
    el.value = before + stamp + after
    const pos = start + stamp.length
    el.selectionStart = pos
    el.selectionEnd = pos
    el.focus()
    markDirty()
  }, [markDirty])

  const runEditCommand = useCallback((cmd: string) => {
    fieldAccess.get()?.focus()
    document.execCommand(cmd)
    markDirty()
  }, [markDirty])

  const selectAll = useCallback(() => {
    const el = fieldAccess.get()
    if (!el) return
    el.focus()
    el.select()
  }, [])

  const toggleWordWrap = useCallback(() => {
    setWordWrap((w) => !w)
  }, [])

  const runFind = useCallback(
    (query: string, fromStart = false) => {
      if (!query) return
      setFindText(query)
      const el = fieldAccess.get()
      if (!el) return
      const haystack = el.value
      const start = fromStart ? 0 : (el.selectionEnd ?? 0)
      let idx = haystack.indexOf(query, start)
      if (idx === -1 && start > 0) {
        idx = haystack.indexOf(query, 0)
      }
      if (idx === -1) return
      el.focus()
      el.selectionStart = idx
      el.selectionEnd = idx + query.length
    },
    [],
  )

  const findNext = useCallback(() => {
    if (!findText) {
      setFindOpen(true)
      return
    }
    runFind(findText)
  }, [findText, runFind])

  const runReplace = useCallback(() => {
    const el = fieldAccess.get()
    if (!el || !replaceFind) return
    const selected = el.value.slice(el.selectionStart ?? 0, el.selectionEnd ?? 0)
    if (selected === replaceFind) {
      const start = el.selectionStart ?? 0
      const before = el.value.slice(0, start)
      const after = el.value.slice(el.selectionEnd ?? 0)
      el.value = before + replaceWith + after
      const pos = start + replaceWith.length
      el.selectionStart = pos
      el.selectionEnd = pos
      markDirty()
    }
    runFind(replaceFind)
  }, [replaceFind, replaceWith, runFind, markDirty])

  const closeGuard = useCallback(async () => {
    const choice = await promptSaveChanges()
    return choice !== 'cancel'
  }, [promptSaveChanges])

  useWindowCloseGuard(windowId, closeGuard)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const el = fieldAccess.get()
      const focused = document.activeElement === el
      if (!focused && !e.altKey) return

      if (e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === 's') {
        if (!focused) return
        e.preventDefault()
        void save()
        return
      }
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 's') {
        if (!focused) return
        e.preventDefault()
        saveAs()
        return
      }
      if (e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === 'n') {
        if (!focused) return
        e.preventDefault()
        void newDocument()
        return
      }
      if (e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === 'o') {
        if (!focused) return
        e.preventDefault()
        openPicker()
        return
      }
      if (e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === 'f') {
        if (!focused) return
        e.preventDefault()
        setFindInput(findText)
        setFindOpen(true)
        return
      }
      if (e.key === 'F3') {
        if (!focused) return
        e.preventDefault()
        findNext()
        return
      }
      if (e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === 'h') {
        if (!focused) return
        e.preventDefault()
        setReplaceFind(findText)
        setReplaceOpen(true)
        return
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [save, saveAs, newDocument, openPicker, findText, findNext])

  const menus: AppMenuDef[] = [
    {
      id: 'file',
      label: 'File',
      items: [
        { id: 'new', label: 'New', shortcut: 'Ctrl+N', onSelect: () => void newDocument() },
        { id: 'open', label: 'Open…', shortcut: 'Ctrl+O', onSelect: openPicker },
        { id: 'save', label: 'Save', shortcut: 'Ctrl+S', onSelect: () => void save() },
        { id: 'save-as', label: 'Save As…', shortcut: 'Ctrl+Shift+S', onSelect: saveAs },
        { type: 'separator' },
        { id: 'exit', label: 'Exit', onSelect: exit },
      ],
    },
    {
      id: 'edit',
      label: 'Edit',
      items: [
        { id: 'undo', label: 'Undo', shortcut: 'Ctrl+Z', onSelect: () => runEditCommand('undo') },
        { id: 'cut', label: 'Cut', shortcut: 'Ctrl+X', onSelect: () => runEditCommand('cut') },
        { id: 'copy', label: 'Copy', shortcut: 'Ctrl+C', onSelect: () => runEditCommand('copy') },
        {
          id: 'paste',
          label: 'Paste',
          shortcut: 'Ctrl+V',
          onSelect: () => runEditCommand('paste'),
        },
        { id: 'delete', label: 'Delete', onSelect: () => runEditCommand('delete') },
        { type: 'separator' },
        { id: 'select-all', label: 'Select All', shortcut: 'Ctrl+A', onSelect: selectAll },
        { id: 'time-date', label: 'Time/Date', onSelect: insertTimeDate },
      ],
    },
    {
      id: 'search',
      label: 'Search',
      items: [
        {
          id: 'find',
          label: 'Find…',
          shortcut: 'Ctrl+F',
          onSelect: () => {
            setFindInput(findText)
            setFindOpen(true)
          },
        },
        { id: 'find-next', label: 'Find Next', shortcut: 'F3', onSelect: findNext },
        {
          id: 'replace',
          label: 'Replace…',
          shortcut: 'Ctrl+H',
          onSelect: () => {
            setReplaceFind(findText)
            setReplaceOpen(true)
          },
        },
      ],
    },
    {
      id: 'view',
      label: 'View',
      items: [
        {
          id: 'word-wrap',
          label: 'Word Wrap',
          checked: wordWrap,
          onSelect: toggleWordWrap,
        },
      ],
    },
    {
      id: 'help',
      label: 'Help',
      items: [{ id: 'about', label: 'About Notepad', onSelect: () => setAboutOpen(true) }],
    },
  ]

  const pickerInitialDir = path ? dirname(path) : '/docs'

  return {
    menus,
    documentKey,
    initialText,
    fieldClassName: NOTEPAD_FIELD_CLASS,
    wordWrap,
    markDirty,
    pickerMode,
    pickerInitialDir,
    pickerDefaultName: path ? basename(path) : '',
    onPickerSelect,
    onPickerCancel: () => setPickerMode(null),
    findOpen,
    findInput,
    setFindInput,
    closeFind: () => setFindOpen(false),
    submitFind: () => {
      setFindOpen(false)
      runFind(findInput, true)
    },
    replaceOpen,
    replaceFind,
    replaceWith,
    setReplaceFind,
    setReplaceWith,
    closeReplace: () => setReplaceOpen(false),
    submitReplace: () => {
      setReplaceOpen(false)
      setFindText(replaceFind)
      runReplace()
    },
    aboutOpen,
    closeAbout: () => setAboutOpen(false),
  }
}
