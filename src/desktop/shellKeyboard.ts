import type { DesktopSession, WindowId } from './sessionTypes'

export function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  if (target.isContentEditable) return true
  const tag = target.tagName
  return tag === 'TEXTAREA' || tag === 'INPUT'
}

export function getVisibleWindowIds(session: DesktopSession): WindowId[] {
  return Object.values(session.windows)
    .filter((w) => w.geometry.mode !== 'minimized')
    .sort((a, b) => a.zIndex - b.zIndex)
    .map((w) => w.id)
}

export function getNextFocusWindowId(session: DesktopSession): WindowId | null {
  const visible = getVisibleWindowIds(session)
  if (visible.length < 2) return null

  const focused = session.focusedWindowId
  const idx = focused ? visible.indexOf(focused) : -1
  const nextIdx = idx === -1 ? 0 : (idx + 1) % visible.length
  return visible[nextIdx] ?? null
}
