import { useTrayClock } from './TrayClock.logic'
import { Clock } from './TrayClock.style'

export function TrayClock() {
  const { now, formatted } = useTrayClock()

  return (
    <Clock dateTime={now.toISOString()}>
      {formatted}
    </Clock>
  )
}
