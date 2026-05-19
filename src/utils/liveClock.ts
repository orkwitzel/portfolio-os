import { useEffect, useState } from 'react'

export type LiveClockResolution = 'minute' | 'second'

function msUntilNextMinute(from: Date): number {
  return (60 - from.getSeconds()) * 1000 - from.getMilliseconds()
}

export function useLiveClock(resolution: LiveClockResolution): Date {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const tick = () => setNow(new Date())

    let intervalId: ReturnType<typeof setInterval> | undefined
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    if (resolution === 'second') {
      tick()
      intervalId = setInterval(tick, 1_000)
    } else {
      timeoutId = setTimeout(() => {
        tick()
        intervalId = setInterval(tick, 60_000)
      }, msUntilNextMinute(new Date()))
    }

    const onVisibility = () => {
      if (document.visibilityState === 'visible') tick()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      if (timeoutId !== undefined) clearTimeout(timeoutId)
      if (intervalId !== undefined) clearInterval(intervalId)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [resolution])

  return now
}

export function formatTrayTime(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function formatWidgetTime(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function formatWidgetDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatWidgetTimezone(date: Date): { iana: string; short: string } {
  const iana = Intl.DateTimeFormat().resolvedOptions().timeZone
  const parts = new Intl.DateTimeFormat(undefined, { timeZoneName: 'short' }).formatToParts(
    date,
  )
  const short = parts.find((p) => p.type === 'timeZoneName')?.value ?? ''
  return { iana, short }
}
