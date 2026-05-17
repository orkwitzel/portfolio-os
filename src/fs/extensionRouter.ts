import { openExternalLink } from '../desktop/openExternalLink'
import type { WindowManagerApi } from '../desktop/windowManagerContext'
import { basename } from './paths'
import type { FsApi } from './fsDb'

export type OpenPathContext = {
  wm: WindowManagerApi
  fs: FsApi
}

export async function openPath(path: string, ctx: OpenPathContext): Promise<void> {
  const node = await ctx.fs.getNode(path)
  if (!node || node.kind !== 'file') {
    console.warn(`Cannot open: ${path}`)
    return
  }

  const ext = path.slice(path.lastIndexOf('.')).toLowerCase()

  switch (ext) {
    case '.txt':
      ctx.wm.openApp('notepad', { title: basename(path), launch: { path } })
      break
    case '.www': {
      try {
        const { url } = JSON.parse(node.content ?? '') as { url: string }
        if (url) openExternalLink(url)
      } catch {
        console.warn(`Invalid .www file: ${path}`)
      }
      break
    }
    case '.app': {
      try {
        const { appId, title } = JSON.parse(node.content ?? '') as {
          appId: string
          title?: string
        }
        if (appId === 'computer') {
          ctx.wm.openApp('computer', { launch: { path: '/' } })
        } else if (appId) {
          ctx.wm.openApp(appId, title ? { title } : undefined)
        }
      } catch {
        console.warn(`Invalid .app file: ${path}`)
      }
      break
    }
    case '.md':
      ctx.wm.openApp('computer', { launch: { path } })
      break
    default:
      console.warn(`Unsupported file type: ${path}`)
  }
}
