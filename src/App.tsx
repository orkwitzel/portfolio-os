import { useMemo, useRef } from 'react'
import { Desktop } from './desktop/Desktop'
import { Taskbar } from './desktop/Taskbar'
import { WindowManagerProvider } from './desktop/WindowManagerProvider'
import { appDefinitions, createAppRegistry } from './desktop/registry'
import shell from './App.module.css'

export default function App() {
  const workspaceRef = useRef<HTMLDivElement>(null)
  const registry = useMemo(() => createAppRegistry(appDefinitions), [])

  return (
    <WindowManagerProvider registry={registry} workspaceRef={workspaceRef}>
      <div className={shell.shell}>
        <Desktop workspaceRef={workspaceRef} />
        <Taskbar />
      </div>
    </WindowManagerProvider>
  )
}
