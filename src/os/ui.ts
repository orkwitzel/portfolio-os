import type { OsDeps, OsUiApi } from './types'

/** @internal Creates the {@link OsUiApi} namespace. @see OsUiApi */
export function createUiApi(deps: OsDeps): OsUiApi {
  const { modal } = deps

  return {
    confirm: (options) => modal.confirm(options),
    prompt: (options) => modal.prompt(options),
    saveChanges: (options) => modal.saveChanges(options),
    showProperties: (options) => modal.showProperties(options),
  }
}
