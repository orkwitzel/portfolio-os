import type { NormalGeometry } from '@/store/session/sessionTypes'

export const WINDOW_ANIM_MS = 200
export const WINDOW_ANIM_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

export type WindowChromeTransition =
  | 'minimize'
  | 'maximize'
  | 'fullscreen'
  | 'restore'
  | 'close'

export type WindowTransition = {
  kind: WindowChromeTransition
  from: NormalGeometry
  to: NormalGeometry
}

/** Taskbar height must match `Taskbar.style.ts` (`Bar`). */
const TASKBAR_HEIGHT = 32

export function minimizeTarget(
  workspace: HTMLElement | null,
  from: NormalGeometry,
): NormalGeometry {
  const height = workspace?.clientHeight ?? from.y + from.height
  const width = workspace?.clientWidth ?? from.x + from.width
  const w = Math.max(48, Math.round(from.width * 0.12))
  const h = Math.max(6, Math.round(from.height * 0.04))
  return {
    x: Math.round(Math.min(width - w, Math.max(0, from.x + from.width / 2 - w / 2))),
    y: Math.max(0, height - TASKBAR_HEIGHT + 4),
    width: w,
    height: h,
  }
}

export function closeTarget(from: NormalGeometry): NormalGeometry {
  const cx = from.x + from.width / 2
  const cy = from.y + from.height / 2
  const scale = 0.88
  return {
    x: Math.round(cx - (from.width * scale) / 2),
    y: Math.round(cy - (from.height * scale) / 2),
    width: Math.round(from.width * scale),
    height: Math.round(from.height * scale),
  }
}
