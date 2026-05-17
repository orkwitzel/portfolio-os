import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import styles from './markdownView.module.css'

type MarkdownViewProps = {
  source: string
}

export function MarkdownView({ source }: MarkdownViewProps) {
  return (
    <div className={styles.root}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{source}</ReactMarkdown>
    </div>
  )
}
