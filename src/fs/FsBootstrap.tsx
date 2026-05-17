import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react'
import { useWindowManager } from '@/hooks/useWindowManager'
import type { AppDefinition } from '@/store/session/sessionTypes'
import { useFsStore } from '@/store/fsStore'

export type FsBootstrapProps = {
  registry: Map<string, AppDefinition>
  children: ReactNode
}

export function FsBootstrap({ registry, children }: FsBootstrapProps) {
  const wm = useWindowManager()
  const bindShell = useFsStore((s) => s.bindShell)
  const init = useFsStore((s) => s.init)
  const ready = useFsStore((s) => s.ready)
  const booted = useRef(false)

  useEffect(() => {
    bindShell({ wm, registry })
  }, [bindShell, wm, registry])

  useEffect(() => {
    void init()
  }, [init])

  useLayoutEffect(() => {
    if (!ready || booted.current) return
    booted.current = true
    wm.openApp('portfolio', { center: true })
  }, [ready, wm])

  return children
}
