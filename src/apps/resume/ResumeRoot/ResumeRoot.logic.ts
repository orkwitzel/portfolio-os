import type { AppProps } from '@/store/session/sessionTypes'
import { openExternalLink } from '@/utils/openExternalLink'
import { RESUME_URL } from './ResumeRoot.style'

export function useResumeRoot(props: AppProps) {
  void props.windowId
  return {
    resumeUrl: RESUME_URL,
    openInNewTab: () => openExternalLink(RESUME_URL),
  }
}
