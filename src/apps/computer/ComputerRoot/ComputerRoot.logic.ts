import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react'
import { useShellModal } from '@/components/shell/ShellModal'
import type { AppProps } from '@/store/session/sessionTypes'
import type { FsNode } from '@/fs/types'
import {
  createFolderWithRename,
  createTextDocumentWithRename,
} from '@/fs/createAndRename'
import { nextUntitledPath } from '@/fs/fsOperations'
import { useFsStore } from '@/store/fsStore'
import { dirname, extension, normalizePath, parentPath } from '@/utils/paths'
import { resolveCreateParentDir } from '@/apps/computer/computerFsActions'
import {
  registerComputerNavigator,
  unregisterComputerNavigator,
} from '@/apps/computer/computerNavigation'
import { childrenOf } from '@/apps/computer/FsTree/FsTree.logic'

type HistoryEntry = { dir: string; selected: string | null }

type ExplorerState = {
  currentDir: string
  selectedPath: string | null
  history: HistoryEntry[]
  historyIndex: number
}

type ExplorerAction =
  | { type: 'GO_TO'; dir: string; selected?: string | null }
  | { type: 'BACK' }
  | { type: 'FORWARD' }
  | { type: 'SELECT'; path: string | null }
  | { type: 'RESET'; entry: HistoryEntry }

function resolveLaunch(
  launch: { path: string } | undefined,
  nodes: FsNode[],
): HistoryEntry {
  const raw = launch?.path
  if (!raw || raw === '/') return { dir: '/', selected: null }

  const path = normalizePath(raw)
  const node = nodes.find((n) => n.path === path)
  if (node?.kind === 'directory') return { dir: path, selected: null }
  if (node?.kind === 'file') return { dir: dirname(path), selected: path }

  if (extension(path)) return { dir: dirname(path), selected: path }
  return { dir: path, selected: null }
}

function explorerReducer(state: ExplorerState, action: ExplorerAction): ExplorerState {
  switch (action.type) {
    case 'RESET':
      return {
        currentDir: action.entry.dir,
        selectedPath: action.entry.selected,
        history: [action.entry],
        historyIndex: 0,
      }
    case 'GO_TO': {
      const dir = normalizePath(action.dir)
      const selected = action.selected ?? null
      const trimmed = state.history.slice(0, state.historyIndex + 1)
      trimmed.push({ dir, selected })
      return {
        currentDir: dir,
        selectedPath: selected,
        history: trimmed,
        historyIndex: trimmed.length - 1,
      }
    }
    case 'BACK': {
      if (state.historyIndex <= 0) return state
      const next = state.historyIndex - 1
      const entry = state.history[next]!
      return {
        ...state,
        historyIndex: next,
        currentDir: entry.dir,
        selectedPath: entry.selected,
      }
    }
    case 'FORWARD': {
      if (state.historyIndex >= state.history.length - 1) return state
      const next = state.historyIndex + 1
      const entry = state.history[next]!
      return {
        ...state,
        historyIndex: next,
        currentDir: entry.dir,
        selectedPath: entry.selected,
      }
    }
    case 'SELECT':
      return { ...state, selectedPath: action.path }
    default:
      return state
  }
}

export function useComputerRoot({ windowId, launch }: AppProps) {
  const nodes = useFsStore((s) => s.nodes)
  const fs = useFsStore((s) => s.fs)
  const fsStore = useFsStore()
  const openPath = useFsStore((s) => s.openPath)
  const ready = useFsStore((s) => s.ready)
  const shellModal = useShellModal()

  const [explorer, dispatch] = useReducer(explorerReducer, undefined, () => {
    const entry = resolveLaunch(launch, [])
    return {
      currentDir: entry.dir,
      selectedPath: entry.selected,
      history: [entry],
      historyIndex: 0,
    }
  })

  const hydrated = useRef(false)
  const explorerRef = useRef({ currentDir: '/', selectedPath: null as string | null, nodes })
  useEffect(() => {
    if (!ready || hydrated.current) return
    hydrated.current = true
    dispatch({ type: 'RESET', entry: resolveLaunch(launch, nodes) })
  }, [ready, launch, nodes])

  const { currentDir, selectedPath, history, historyIndex } = explorer

  explorerRef.current = { currentDir, selectedPath, nodes }

  const getCreateParentDir = useCallback(
    () =>
      resolveCreateParentDir(
        explorerRef.current.currentDir,
        explorerRef.current.selectedPath,
        explorerRef.current.nodes,
      ),
    [],
  )

  const canGoBack = historyIndex > 0
  const canGoForward = historyIndex < history.length - 1
  const canGoUp = parentPath(currentDir) !== null

  const folderChildren = useMemo(
    () => childrenOf(nodes, currentDir),
    [nodes, currentDir],
  )

  const goTo = useCallback((dir: string, selected: string | null = null) => {
    dispatch({ type: 'GO_TO', dir, selected })
  }, [])

  const goBack = useCallback(() => dispatch({ type: 'BACK' }), [])
  const goForward = useCallback(() => dispatch({ type: 'FORWARD' }), [])

  const goUp = useCallback(() => {
    const parent = parentPath(currentDir)
    if (parent) goTo(parent)
  }, [currentDir, goTo])

  const goHome = useCallback(() => goTo('/'), [goTo])

  const selectFile = useCallback((path: string | null) => {
    dispatch({ type: 'SELECT', path })
  }, [])

  const openItem = useCallback(
    (path: string) => {
      const node = nodes.find((n) => n.path === path)
      if (node?.kind === 'directory') {
        goTo(path)
        return
      }
      void openPath(path)
    },
    [nodes, goTo, openPath],
  )

  const onSelectFolder = useCallback(
    (path: string) => {
      goTo(path)
    },
    [goTo],
  )

  const onSelectFile = useCallback(
    (path: string) => {
      selectFile(path)
    },
    [selectFile],
  )

  const onTreeSelectFile = useCallback(
    (path: string) => {
      goTo(dirname(path), path)
    },
    [goTo],
  )

  const onOpenItem = useCallback(
    (path: string) => {
      openItem(path)
    },
    [openItem],
  )

  const revealCreated = useCallback(
    (finalPath: string) => {
      goTo(dirname(finalPath), finalPath)
    },
    [goTo],
  )

  const onNewFolder = useCallback(() => {
    const parentDir = getCreateParentDir()
    void (async () => {
      const final = await createFolderWithRename(fsStore, shellModal, parentDir)
      revealCreated(final)
    })()
  }, [fsStore, shellModal, getCreateParentDir, revealCreated])

  const onNewTextDocument = useCallback(() => {
    if (!fs) return
    const parentDir = getCreateParentDir()
    void (async () => {
      const final = await createTextDocumentWithRename(fs, fsStore, shellModal, parentDir)
      revealCreated(final)
    })()
  }, [fs, fsStore, shellModal, getCreateParentDir, revealCreated])

  const onNewShortcut = useCallback(() => {
    if (!fs) return
    void (async () => {
      const target = await nextUntitledPath(fs, '/docs')
      await fs.writeFile(target, '')
      await fsStore.createShortcutOnDesktop(target)
    })()
  }, [fs, fsStore])

  useEffect(() => {
    registerComputerNavigator(windowId, {
      navigate: goTo,
      openItem,
      getCreateParentDir,
    })
    return () => unregisterComputerNavigator(windowId)
  }, [windowId, goTo, openItem, getCreateParentDir])

  return {
    nodes,
    currentDir,
    selectedPath,
    folderChildren,
    canGoBack,
    canGoForward,
    canGoUp,
    goBack,
    goForward,
    goUp,
    goHome,
    goTo,
    onSelectFolder,
    onSelectFile,
    onTreeSelectFile,
    onOpenItem,
    selectFile,
    openItem,
    onNewFolder,
    onNewTextDocument,
    onNewShortcut,
  }
}
