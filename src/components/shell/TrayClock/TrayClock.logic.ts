import { formatTrayTime, useLiveClock } from '@/utils/liveClock'

export function useTrayClock() {
  const now = useLiveClock('minute')
  return { now, formatted: formatTrayTime(now) }
}
