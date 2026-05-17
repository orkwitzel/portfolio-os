import { useCallback, useMemo, useRef, useState } from 'react'
import { Desktop } from './desktop/Desktop'
import { ShellKeyboard, type DesktopKeyboardContext } from './desktop/ShellKeyboard'
import { Taskbar } from './desktop/Taskbar'
import { WindowManagerProvider } from './desktop/WindowManagerProvider'
import { useWindowManager } from './desktop/windowManagerContext'
import { appDefinitions, createAppRegistry } from './desktop/registry'
import { FsProvider } from './fs/FsProvider'
import type { DesktopSelectionState } from './desktop/desktopSelection'
import shell from './App.module.css'

function ShellInner({
  startMenuOpen,
  onStartMenuOpenChange,
  workspaceRef,
}: {
  startMenuOpen: boolean
  onStartMenuOpenChange: (open: boolean) => void
  workspaceRef: React.RefObject<HTMLDivElement | null>
}) {
  const wm = useWindowManager()
  const registry = wm.registry

  // Desktop selection state — lifted so ShellKeyboard can act on it.
  const [desktopSelection, setDesktopSelection] = useState<DesktopSelectionState>({
    selectedIds: new Set(),
    anchorId: null,
    primaryId: null,
  })
  const openPrimaryRef = useRef<(() => void) | null>(null)
  const clearSelectionRef = useRef<(() => void) | null>(null)

  const handleSelectionChange = useCallback(
    (sel: DesktopSelectionState) => {
      setDesktopSelection(sel)
    },
    [],
  )

  // Desktop exposes its open/clear handlers via callbacks.
  const handleRegisterOpenPrimary = useCallback((fn: () => void) => {
    openPrimaryRef.current = fn
  }, [])

  const desktopCtx: DesktopKeyboardContext = useMemo(
    () => ({
      openPrimary: () => openPrimaryRef.current?.(),
      clearSelection: () => clearSelectionRef.current?.(),
      hasSelection: desktopSelection.selectedIds.size > 0,
    }),
    [desktopSelection.selectedIds.size],
  )

  return (
    <FsProvider registry={registry}>
      <ShellKeyboard startMenuOpen={startMenuOpen} desktopCtx={desktopCtx} />
      <div className={shell.shell}>
        <Desktop
          workspaceRef={workspaceRef}
          onSelectionChange={handleSelectionChange}
          onOpenPrimary={handleRegisterOpenPrimary}
          onRegisterClearSelection={(fn) => { clearSelectionRef.current = fn }}
        />
        <Taskbar
          startMenuOpen={startMenuOpen}
          onStartMenuOpenChange={onStartMenuOpenChange}
        />
      </div>
    </FsProvider>
  )
}

export default function App() {
  const workspaceRef = useRef<HTMLDivElement>(null)
  const registry = useMemo(() => createAppRegistry(appDefinitions), [])
  const [startMenuOpen, setStartMenuOpen] = useState(false)

  return (
    <WindowManagerProvider registry={registry} workspaceRef={workspaceRef}>
      <ShellInner
        startMenuOpen={startMenuOpen}
        onStartMenuOpenChange={setStartMenuOpen}
        workspaceRef={workspaceRef}
      />
    </WindowManagerProvider>
  )
}
