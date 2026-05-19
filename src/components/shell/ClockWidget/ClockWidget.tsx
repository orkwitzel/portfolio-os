import { AnalogClock } from './AnalogClock'
import { CLOCK_WIDGET_ID, useClockWidget, type ClockWidgetProps } from './ClockWidget.logic'
import {
  DateLine,
  DigitalTime,
  TimezoneId,
  TimezoneShort,
  WidgetPanel,
} from './ClockWidget.style'

export { CLOCK_WIDGET_ID } from './ClockWidget.logic'

export function ClockWidget(props: ClockWidgetProps) {
  const { open, trayButtonId, panelRef, position, now, time, date, timezone } =
    useClockWidget(props)

  if (!open || !position) return null

  return (
    <WidgetPanel
      ref={panelRef}
      id={CLOCK_WIDGET_ID}
      role="dialog"
      aria-label="Clock"
      aria-labelledby={trayButtonId}
      style={{ right: position.right, bottom: position.bottom }}
    >
      <AnalogClock now={now} />
      <DigitalTime>{time}</DigitalTime>
      <DateLine>{date}</DateLine>
      <TimezoneId>{timezone.iana}</TimezoneId>
      {timezone.short ? (
        <TimezoneShort>({timezone.short})</TimezoneShort>
      ) : null}
    </WidgetPanel>
  )
}
