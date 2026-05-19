import { useEffect } from 'react'
import type { WindowId } from '@/store/session/sessionTypes'
import { useWindowManager } from '@/hooks/useWindowManager'

/**
 * Register a close guard for a window. Return `true` from the handler to allow close.
 */
export function useWindowCloseGuard(
  windowId: WindowId,
  handler: () => Promise<boolean>,
) {
  const wm = useWindowManager()

  useEffect(() => {
    wm.registerCloseGuard(windowId, handler)
    return () => wm.unregisterCloseGuard(windowId)
  }, [wm, windowId, handler])
}
