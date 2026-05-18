/**
 * Portfolio OS syscall API — unified facade over filesystem, windows, UI, clipboard, and explorer.
 *
 * @packageDocumentation
 * @module os
 */

export { createOsApi } from './createOsApi'
export { useOs } from './useOs'
export type {
  OsApi,
  OsDeps,
  OsFsApi,
  OsWinApi,
  OsUiApi,
  OsClipboardApi,
  OsExplorerApi,
  OsFsRenameOptions,
  WindowLaunch,
} from './types'
export {
  newItemParentDir,
  newTextDocumentParentDir,
  resolveCreateParentDir,
} from './explorer'
