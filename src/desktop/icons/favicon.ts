export function faviconUrl(pageUrl: string, size = 16): string {
  const hostname = new URL(pageUrl).hostname
  return `https://www.google.com/s2/favicons?domain=${hostname}&sz=${size}`
}
