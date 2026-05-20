import type { AppProps } from '@/store/session/sessionTypes'
import { openExternalLink } from '@/utils/openExternalLink'
import { resumeUrl } from '@/config/assets'

export function useResumeRoot(props: AppProps) {
  void props.windowId
  return {
    resumeUrl,
    openInNewTab: () => openExternalLink(resumeUrl),
  }
}
