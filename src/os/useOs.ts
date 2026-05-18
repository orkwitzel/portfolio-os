import { useMemo } from 'react'
import { useShellModal } from '@/components/shell/ShellModal'
import { useWindowManager } from '@/hooks/useWindowManager'
import { useFsStore } from '@/store/fsStore'
import { useSettingsStore } from '@/store/settingsStore'
import { useShellClipboard } from '@/store/shellClipboard'
import { createOsApi } from './createOsApi'
import type { OsApi } from './types'

/**
 * React hook returning the portfolio OS syscall API (`fs`, `win`, `ui`, `clipboard`, `explorer`, `settings`).
 *
 * Must run inside `WindowManagerProvider`, `ShellModalProvider`, and after `FsBootstrap`
 * has bound the shell. The returned object is memoized per render when dependencies are stable.
 *
 * For reactive state (`nodes`, `ready`, `session`), use store selectors — e.g.
 * `useFsStore((s) => s.nodes)` — rather than caching values from this hook.
 *
 * @returns {@link OsApi} bound to the current shell session.
 */
export function useOs(): OsApi {
  const wm = useWindowManager()
  const modal = useShellModal()
  const fsStore = useFsStore()
  const clipboard = useShellClipboard()
  return useMemo(
    () => createOsApi({ wm, modal, fsStore, clipboard, settingsStore: useSettingsStore }),
    [wm, modal, fsStore, clipboard],
  )
}
