import { useEffect, useState } from 'react'
import styles from './TrayClock.module.css'

function formatTime(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })
}

function msUntilNextMinute(from: Date): number {
  return (60 - from.getSeconds()) * 1000 - from.getMilliseconds()
}

export function TrayClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const tick = () => setNow(new Date())

    let intervalId: ReturnType<typeof setInterval> | undefined
    const timeoutId = setTimeout(() => {
      tick()
      intervalId = setInterval(tick, 60_000)
    }, msUntilNextMinute(new Date()))

    const onVisibility = () => {
      if (document.visibilityState === 'visible') tick()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      clearTimeout(timeoutId)
      if (intervalId !== undefined) clearInterval(intervalId)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <time className={styles.clock} dateTime={now.toISOString()}>
      {formatTime(now)}
    </time>
  )
}
