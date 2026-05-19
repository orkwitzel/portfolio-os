import { getHandAngles } from './AnalogClock.logic'
import { Face } from './AnalogClock.style'

type AnalogClockProps = {
  now: Date
}

const CX = 64
const CY = 64

function Hand({
  angle,
  length,
  width,
  color,
}: {
  angle: number
  length: number
  width: number
  color: string
}) {
  return (
    <line
      x1={CX}
      y1={CY}
      x2={CX}
      y2={CY - length}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      transform={`rotate(${angle} ${CX} ${CY})`}
    />
  )
}

export function AnalogClock({ now }: AnalogClockProps) {
  const { hour, minute, second } = getHandAngles(now)

  return (
    <Face viewBox="0 0 128 128" aria-hidden>
      <circle cx={CX} cy={CY} r={60} fill="var(--shell-surface)" stroke="var(--shell-border-dark)" strokeWidth={2} />
      {[0, 90, 180, 270].map((deg) => (
        <line
          key={deg}
          x1={CX}
          y1={CY - 52}
          x2={CX}
          y2={CY - 44}
          stroke="var(--text-secondary)"
          strokeWidth={2}
          transform={`rotate(${deg} ${CX} ${CY})`}
        />
      ))}
      <Hand angle={hour} length={32} width={3} color="var(--text-primary)" />
      <Hand angle={minute} length={44} width={2} color="var(--text-primary)" />
      <Hand angle={second} length={48} width={1} color="#c00" />
      <circle cx={CX} cy={CY} r={3} fill="var(--text-primary)" />
    </Face>
  )
}
