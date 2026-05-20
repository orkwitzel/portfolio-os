import type { AppProps } from '@/store/session/sessionTypes'
import { MarkdownView } from '@/components/shared/MarkdownView'
import { useAboutRoot } from './AboutRoot.logic'
import { AppBody } from './AboutRoot.style'

export default function AboutRoot(props: AppProps) {
  const { source } = useAboutRoot(props)

  return (
    <AppBody>
      <MarkdownView source={source} />
    </AppBody>
  )
}
