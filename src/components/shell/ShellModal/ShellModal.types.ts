import type { IconSource } from '@/components/shell/ShellIcon'

export type ShellConfirmOptions = {
  title?: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
}

export type ShellPromptOptions = {
  title?: string
  message?: string
  defaultValue?: string
  confirmLabel?: string
  cancelLabel?: string
}

export type ShellPropertiesOptions = {
  title: string
  name: string
  icon: IconSource
  kind: 'shortcut' | 'file' | 'folder'
  path: string
  targetPath?: string
  gridX?: number
  gridY?: number
}

type Resolver<T> = (value: T) => void

export type ShellModalRequest =
  | {
      kind: 'confirm'
      title: string
      message: string
      confirmLabel: string
      cancelLabel: string
      resolve: Resolver<boolean>
    }
  | {
      kind: 'prompt'
      title: string
      message: string | undefined
      defaultValue: string
      confirmLabel: string
      cancelLabel: string
      resolve: Resolver<string | null>
    }
  | {
      kind: 'properties'
      props: ShellPropertiesOptions
    }
