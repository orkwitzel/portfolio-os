import { useWindowManager } from '@/hooks/useWindowManager'
import type { WindowRecord } from '@/store/session/sessionTypes'

export function useWindowLayer() {
  const { session } = useWindowManager()

  const ordered: WindowRecord[] = session.order
    .map((id) => session.windows[id])
    .filter(Boolean)
    .sort((a, b) => a.zIndex - b.zIndex)

  return { ordered }
}
