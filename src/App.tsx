import { useCallback, useMemo, useRef, useState } from 'react'
import { MobileUnsupported } from '@/components/MobileUnsupported'
import { Desktop } from '@/components/shell/Desktop'
import { useIsMobileViewport } from '@/hooks/useIsMobileViewport'
import type { DesktopActions } from '@/components/shell/Desktop/Desktop.logic'
import { ContextMenuRoot } from '@/components/shell/ContextMenu'
import { ShellModalProvider } from '@/components/shell/ShellModal'
import { ShellContextMenu } from '@/components/shell/ShellContextMenu/ShellContextMenu'
import { ShellKeyboard, type DesktopKeyboardContext } from '@/components/shell/ShellKeyboard'
import { Taskbar } from '@/components/shell/Taskbar'
import { WindowManagerProvider } from '@/components/shell/WindowManagerProvider'
import { useWindowManager } from '@/hooks/useWindowManager'
import { appDefinitions, createAppRegistry } from '@/components/shell/registry'
import { FsProvider } from '@/fs/FsProvider'
import type { DesktopSelectionState } from '@/utils/desktopSelection'
import { Shell } from './App.style'

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

  const [desktopSelection, setDesktopSelection] = useState<DesktopSelectionState>({
    selectedIds: new Set(),
    anchorId: null,
    primaryId: null,
  })
  const openPrimaryRef = useRef<(() => void) | null>(null)
  const clearSelectionRef = useRef<(() => void) | null>(null)
  const desktopActionsRef = useRef<DesktopActions | null>(null)

  const handleSelectionChange = useCallback(
    (sel: DesktopSelectionState) => {
      setDesktopSelection(sel)
    },
    [],
  )

  const handleRegisterOpenPrimary = useCallback((fn: () => void) => {
    openPrimaryRef.current = fn
  }, [])

  const desktopCtx: DesktopKeyboardContext = useMemo(
    () => ({
      openPrimary: () => openPrimaryRef.current?.(),
      clearSelection: () => clearSelectionRef.current?.(),
      hasSelection: desktopSelection.selectedIds.size > 0,
      copy: () => desktopActionsRef.current?.copy(),
      cut: () => desktopActionsRef.current?.cut(),
      paste: () => desktopActionsRef.current?.paste(),
      deleteSelection: () => desktopActionsRef.current?.deleteSelection(),
      startRename: () => desktopActionsRef.current?.startRename(),
    }),
    [desktopSelection.selectedIds.size],
  )

  return (
    <FsProvider registry={registry}>
      <ShellKeyboard startMenuOpen={startMenuOpen} desktopCtx={desktopCtx} />
      <Shell data-shell-root>
        <Desktop
          workspaceRef={workspaceRef}
          onSelectionChange={handleSelectionChange}
          onOpenPrimary={handleRegisterOpenPrimary}
          onRegisterClearSelection={(fn) => {
            clearSelectionRef.current = fn
          }}
          onRegisterDesktopActions={(actions) => {
            desktopActionsRef.current = actions
          }}
        />
        <Taskbar
          startMenuOpen={startMenuOpen}
          onStartMenuOpenChange={onStartMenuOpenChange}
        />
      </Shell>
      <ShellContextMenu />
    </FsProvider>
  )
}

export default function App() {
  const isMobile = useIsMobileViewport()
  const workspaceRef = useRef<HTMLDivElement>(null)
  const registry = useMemo(() => createAppRegistry(appDefinitions), [])
  const [startMenuOpen, setStartMenuOpen] = useState(false)

  if (isMobile) {
    return <MobileUnsupported />
  }

  return (
    <ContextMenuRoot>
      <ShellModalProvider>
        <WindowManagerProvider registry={registry} workspaceRef={workspaceRef}>
          <ShellInner
            startMenuOpen={startMenuOpen}
            onStartMenuOpenChange={setStartMenuOpen}
            workspaceRef={workspaceRef}
          />
        </WindowManagerProvider>
      </ShellModalProvider>
    </ContextMenuRoot>
  )
}
