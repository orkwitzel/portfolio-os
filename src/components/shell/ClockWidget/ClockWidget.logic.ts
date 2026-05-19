import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from 'react'
import {
  formatWidgetDate,
  formatWidgetTime,
  formatWidgetTimezone,
  useLiveClock,
} from '@/utils/liveClock'

export const CLOCK_WIDGET_ID = 'clock-widget'

export type ClockWidgetProps = {
  open: boolean
  onClose: () => void
  anchorRef: RefObject<HTMLButtonElement | null>
  trayButtonId: string
}

export function useClockWidget({ open, onClose, anchorRef, trayButtonId }: ClockWidgetProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<{ right: number; bottom: number } | null>(null)
  const now = useLiveClock('second')

  useLayoutEffect(() => {
    if (!open) return
    const el = anchorRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setPosition({
      right: window.innerWidth - rect.right,
      bottom: window.innerHeight - rect.top + 2,
    })
  }, [open, anchorRef])

  useEffect(() => {
    if (!open) return

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (panelRef.current?.contains(target)) return
      if (anchorRef.current?.contains(target)) return
      onClose()
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose, anchorRef])

  const timezone = formatWidgetTimezone(now)

  return {
    open,
    trayButtonId,
    panelRef,
    position,
    now,
    time: formatWidgetTime(now),
    date: formatWidgetDate(now),
    timezone,
  }
}
