/** Active window title-bar / resize pointer sessions (document-level drag). */
let windowPointerSessions = 0

export function beginWindowPointerInteraction(): void {
  windowPointerSessions += 1
}

export function endWindowPointerInteraction(): void {
  windowPointerSessions = Math.max(0, windowPointerSessions - 1)
}

export function isWindowPointerInteractionActive(): boolean {
  return windowPointerSessions > 0
}
