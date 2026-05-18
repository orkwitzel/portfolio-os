import { useEffect } from 'react'
import { useOs } from '@/hooks/useOs'
import { applyAppearance } from '@/theme/applyAppearance'

/** Keeps `:root` CSS variables in sync with persisted settings. */
export function AppearanceSync() {
  const os = useOs()

  useEffect(() => {
    applyAppearance(os.settings.get())
    return os.settings.subscribe(() => {
      applyAppearance(os.settings.get())
    })
  }, [os])

  return null
}
