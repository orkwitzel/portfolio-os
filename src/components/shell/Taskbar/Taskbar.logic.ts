import { useId, useRef } from 'react'
import { useWindowManager } from '@/hooks/useWindowManager'

export type TaskbarProps = {
  startMenuOpen: boolean
  onStartMenuOpenChange: (open: boolean) => void
}

export function useTaskbar({ startMenuOpen, onStartMenuOpenChange }: TaskbarProps) {
  const wm = useWindowManager()
  const startRef = useRef<HTMLButtonElement>(null)
  const startButtonId = useId()

  return {
    wm,
    session: wm.session,
    startRef,
    startButtonId,
    startMenuOpen,
    onStartMenuOpenChange,
    toggleStart: () => onStartMenuOpenChange(!startMenuOpen),
    closeStart: () => onStartMenuOpenChange(false),
  }
}
