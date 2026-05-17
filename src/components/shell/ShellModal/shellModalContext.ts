import { createContext, useContext } from 'react'
import type {
  ShellConfirmOptions,
  ShellPromptOptions,
  ShellPropertiesOptions,
} from './ShellModal.types'

export type ShellModalApi = {
  confirm: (options: ShellConfirmOptions) => Promise<boolean>
  prompt: (options: ShellPromptOptions) => Promise<string | null>
  showProperties: (options: ShellPropertiesOptions) => void
  close: () => void
}

export const ShellModalContext = createContext<ShellModalApi | null>(null)

export function useShellModal(): ShellModalApi {
  const ctx = useContext(ShellModalContext)
  if (!ctx) throw new Error('useShellModal must be used within ShellModalProvider')
  return ctx
}

export function useShellModalOptional(): ShellModalApi | null {
  return useContext(ShellModalContext)
}
