import { useMemo, useRef, useState } from 'react'
import { Desktop } from './desktop/Desktop'
import { ShellKeyboard } from './desktop/ShellKeyboard'
import { Taskbar } from './desktop/Taskbar'
import { WindowManagerProvider } from './desktop/WindowManagerProvider'
import { appDefinitions, createAppRegistry } from './desktop/registry'
import shell from './App.module.css'

export default function App() {
  const workspaceRef = useRef<HTMLDivElement>(null)
  const registry = useMemo(() => createAppRegistry(appDefinitions), [])
  const [startMenuOpen, setStartMenuOpen] = useState(false)

  return (
    <WindowManagerProvider registry={registry} workspaceRef={workspaceRef}>
      <ShellKeyboard startMenuOpen={startMenuOpen} />
      <div className={shell.shell}>
        <Desktop workspaceRef={workspaceRef} />
        <Taskbar
          startMenuOpen={startMenuOpen}
          onStartMenuOpenChange={setStartMenuOpen}
        />
      </div>
    </WindowManagerProvider>
  )
}
