import { useMemo, useRef, useState } from 'react'
import { Desktop } from './desktop/Desktop'
import { ShellKeyboard } from './desktop/ShellKeyboard'
import { Taskbar } from './desktop/Taskbar'
import { WindowManagerProvider } from './desktop/WindowManagerProvider'
import { useWindowManager } from './desktop/windowManagerContext'
import { appDefinitions, createAppRegistry } from './desktop/registry'
import { FsProvider } from './fs/FsProvider'
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

  return (
    <FsProvider registry={registry}>
      <ShellKeyboard startMenuOpen={startMenuOpen} />
      <div className={shell.shell}>
        <Desktop workspaceRef={workspaceRef} />
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
