import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { MarkdownViewProps } from './MarkdownView.logic'
import { Root } from './MarkdownView.style'

export function MarkdownView({ source }: MarkdownViewProps) {
  return (
    <Root>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{source}</ReactMarkdown>
    </Root>
  )
}
