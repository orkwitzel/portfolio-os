import { useCallback, useState, type ReactNode } from 'react'
import { ShellModalContext, type ShellModalApi } from './shellModalContext'
import {
  ShellConfirmPanel,
  ShellPromptPanel,
  ShellPropertiesPanel,
  ShellSaveChangesPanel,
} from './ShellMessageBoxPanel'
import type {
  ShellConfirmOptions,
  ShellModalRequest,
  ShellPromptOptions,
  ShellPropertiesOptions,
  ShellSaveChangesOptions,
  ShellSaveChangesResult,
} from './ShellModal.types'

function ShellModalLayer({
  request,
  onClose,
}: {
  request: ShellModalRequest
  onClose: () => void
}) {
  if (request.kind === 'confirm') {
    return <ShellConfirmPanel request={request} onClose={onClose} />
  }
  if (request.kind === 'saveChanges') {
    return <ShellSaveChangesPanel request={request} onClose={onClose} />
  }
  if (request.kind === 'prompt') {
    return <ShellPromptPanel request={request} onClose={onClose} />
  }
  return <ShellPropertiesPanel request={request} onClose={onClose} />
}

export function ShellModalProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<ShellModalRequest | null>(null)

  const close = useCallback(() => setRequest(null), [])

  const confirm = useCallback(
    (options: ShellConfirmOptions) =>
      new Promise<boolean>((resolve) => {
        setRequest({
          kind: 'confirm',
          title: options.title ?? 'Confirm',
          message: options.message,
          confirmLabel: options.confirmLabel ?? 'Yes',
          cancelLabel: options.cancelLabel ?? 'No',
          resolve,
        })
      }),
    [],
  )

  const prompt = useCallback(
    (options: ShellPromptOptions) =>
      new Promise<string | null>((resolve) => {
        setRequest({
          kind: 'prompt',
          title: options.title ?? 'Rename',
          message: options.message,
          defaultValue: options.defaultValue ?? '',
          confirmLabel: options.confirmLabel ?? 'OK',
          cancelLabel: options.cancelLabel ?? 'Cancel',
          resolve,
        })
      }),
    [],
  )

  const showProperties = useCallback((options: ShellPropertiesOptions) => {
    setRequest({ kind: 'properties', props: options })
  }, [])

  const saveChanges = useCallback(
    (options: ShellSaveChangesOptions) =>
      new Promise<ShellSaveChangesResult>((resolve) => {
        setRequest({
          kind: 'saveChanges',
          title: options.title ?? 'Notepad',
          message: options.message,
          saveLabel: options.saveLabel ?? 'Save',
          discardLabel: options.discardLabel ?? "Don't Save",
          cancelLabel: options.cancelLabel ?? 'Cancel',
          resolve,
        })
      }),
    [],
  )

  const isOpen = useCallback(() => request !== null, [request])

  const api: ShellModalApi = { confirm, prompt, saveChanges, showProperties, close, isOpen }

  return (
    <ShellModalContext.Provider value={api}>
      {children}
      {request ? <ShellModalLayer request={request} onClose={close} /> : null}
    </ShellModalContext.Provider>
  )
}
