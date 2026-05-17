import { WindowManagerContext } from '@/store/session/windowManagerContext'
import {
  useWindowManagerProvider,
  type WindowManagerProviderProps,
} from './WindowManagerProvider.logic'

export function WindowManagerProvider(props: WindowManagerProviderProps) {
  const { value, children } = useWindowManagerProvider(props)
  return <WindowManagerContext.Provider value={value}>{children}</WindowManagerContext.Provider>
}
