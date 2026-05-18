import { useSyncExternalStore } from 'react'
import { useOs } from '@/hooks/useOs'
import type { SettingsV1 } from '@/theme/tokens'

/**
 * Reactive snapshot of user settings via {@link OsSettingsApi}.
 * Apps should use this (and `os.settings.set*`) instead of importing `settingsStore`.
 */
export function useOsSettings(): SettingsV1 {
  const os = useOs()
  return useSyncExternalStore(os.settings.subscribe, os.settings.get, os.settings.get)
}
