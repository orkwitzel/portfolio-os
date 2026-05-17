export function normalizePath(raw: string): string {
  const parts = raw.replace(/\\/g, '/').split('/').filter((p) => p && p !== '.')
  const resolved: string[] = []
  for (const part of parts) {
    if (part === '..') {
      resolved.pop()
      continue
    }
    resolved.push(part)
  }
  if (resolved.length === 0) return '/'
  return '/' + resolved.join('/')
}

export function basename(path: string): string {
  const n = normalizePath(path)
  if (n === '/') return '/'
  const idx = n.lastIndexOf('/')
  return n.slice(idx + 1)
}

export function dirname(path: string): string {
  const n = normalizePath(path)
  if (n === '/') return '/'
  const idx = n.lastIndexOf('/')
  if (idx <= 0) return '/'
  return n.slice(0, idx)
}

export function parentPath(path: string): string | null {
  const n = normalizePath(path)
  if (n === '/') return null
  const d = dirname(n)
  return d === '/' ? '/' : d
}

export function join(...segments: string[]): string {
  const combined = segments
    .filter(Boolean)
    .map((s) => s.replace(/^\/+|\/+$/g, ''))
    .join('/')
  return normalizePath('/' + combined)
}

export function extension(path: string): string {
  const name = basename(path)
  const dot = name.lastIndexOf('.')
  if (dot <= 0) return ''
  return name.slice(dot).toLowerCase()
}
