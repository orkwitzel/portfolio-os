import { useShellKeyboard, type ShellKeyboardProps } from './ShellKeyboard.logic'

export type { DesktopKeyboardContext } from './ShellKeyboard.logic'

export function ShellKeyboard(props: ShellKeyboardProps) {
  useShellKeyboard(props)
  return null
}
