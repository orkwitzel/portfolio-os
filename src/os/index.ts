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
  OsSettingsApi,
  WindowLaunch,
} from './types'
export type {
  SettingsV1,
  ColorSchemeId,
  CursorMode,
  FontSizeId,
} from '@/theme/tokens'
export {
  newItemParentDir,
  newTextDocumentParentDir,
  resolveCreateParentDir,
} from './explorer'
