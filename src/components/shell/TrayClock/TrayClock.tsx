import { useId, useRef } from 'react'
import { ClockWidget, CLOCK_WIDGET_ID } from '@/components/shell/ClockWidget'
import { useTrayClock } from './TrayClock.logic'
import { TrayButton, TrayTime } from './TrayClock.style'

export type TrayClockProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TrayClock({ open, onOpenChange }: TrayClockProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const trayButtonId = useId()
  const { now, formatted } = useTrayClock()

  return (
    <>
      <TrayButton
        ref={buttonRef}
        id={trayButtonId}
        type="button"
        $pressed={open}
        aria-label="Clock"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? CLOCK_WIDGET_ID : undefined}
        onClick={() => onOpenChange(!open)}
      >
        <TrayTime dateTime={now.toISOString()}>{formatted}</TrayTime>
      </TrayButton>
      {open ? (
        <ClockWidget
          open={open}
          onClose={() => onOpenChange(false)}
          anchorRef={buttonRef}
          trayButtonId={trayButtonId}
        />
      ) : null}
    </>
  )
}
