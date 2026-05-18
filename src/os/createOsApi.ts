import { createClipboardApi } from './clipboard'
import { createExplorerApi } from './explorer'
import { createFsApi } from './fs'
import { createSettingsApi } from './settings'
import type { OsApi, OsDeps } from './types'
import { createUiApi } from './ui'
import { createWinApi } from './win'

/**
 * Build a namespaced OS API from store/context dependencies.
 * Prefer {@link useOs} in React; use this in tests or non-React tooling.
 *
 * @param deps - Wired filesystem, window manager, modal, and clipboard.
 * @returns Stable {@link OsApi} facade (new object each call; methods close over `deps`).
 */
export function createOsApi(deps: OsDeps): OsApi {
  return {
    fs: createFsApi(deps),
    win: createWinApi(deps),
    ui: createUiApi(deps),
    clipboard: createClipboardApi(deps),
    explorer: createExplorerApi(deps),
    settings: createSettingsApi(deps),
  }
}
