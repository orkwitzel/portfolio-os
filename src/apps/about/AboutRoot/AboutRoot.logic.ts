import type { AppProps } from '@/store/session/sessionTypes'
import aboutMd from '@/content/about.md?raw'

export function useAboutRoot(props: AppProps) {
  void props.windowId
  return { source: aboutMd }
}
