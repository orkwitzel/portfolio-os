import { cssVars } from './tokens'

/** Read computed theme colors from `:root` (for canvas renderers). */
export function getThemeColors(): Record<string, string> {
  if (typeof document === 'undefined') {
    return {}
  }
  const style = getComputedStyle(document.documentElement)
  const out: Record<string, string> = {}
  for (const value of Object.values(cssVars)) {
    out[value] = style.getPropertyValue(value).trim()
  }
  return out
}

export function getCssVar(name: string, fallback: string): string {
  if (typeof document === 'undefined') return fallback
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return v || fallback
}
