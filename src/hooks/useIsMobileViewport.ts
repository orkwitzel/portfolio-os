import { useEffect, useState } from 'react'

const MOBILE_QUERY = '(max-width: 768px)'

function readIsMobile(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia(MOBILE_QUERY).matches
}

/** True when the viewport is phone-sized (≤768px). */
export function useIsMobileViewport(): boolean {
  const [isMobile, setIsMobile] = useState(readIsMobile)

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY)
    const onChange = () => setIsMobile(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return isMobile
}
