import type { ReactNode } from 'react'
import { MarkdownView } from '@/components/shared/MarkdownView'
import { openExternalLink } from '@/utils/openExternalLink'
import type { AppFile, WwwFile } from '@/fs/types'
import {
  DetailActions,
  DetailBody,
  DetailMessage,
  DetailPane,
  DetailPre,
  LocationBar,
  ToolbarBtn,
} from '@/apps/computer/computer.style'
import {
  parseApp,
  parseWww,
  useFsDetailPane,
  type FsDetailPaneProps,
} from './FsDetailPane.logic'

function DetailActionBar({ onOpen, label = 'Open' }: { onOpen: () => void; label?: string }) {
  return (
    <DetailActions>
      <ToolbarBtn type="button" onClick={onOpen}>
        {label}
      </ToolbarBtn>
    </DetailActions>
  )
}

function WwwDetail({ www }: { www: WwwFile }) {
  return (
    <>
      <DetailPre>
        <strong>{www.name ?? 'Link'}</strong>
        {'\n'}
        {www.url}
      </DetailPre>
      <DetailActionBar onOpen={() => openExternalLink(www.url)} label="Open in new tab" />
    </>
  )
}

function AppDetail({ app, onOpen }: { app: AppFile; onOpen: () => void }) {
  return (
    <>
      <DetailPre>
        App: {app.appId}
        {app.title ? `\nTitle: ${app.title}` : ''}
      </DetailPre>
      <DetailActionBar onOpen={onOpen} />
    </>
  )
}

export default function FsDetailPane(props: FsDetailPaneProps) {
  const vm = useFsDetailPane(props)

  let body: ReactNode = <DetailMessage>Select a file in the tree.</DetailMessage>

  if (vm.error) {
    body = <DetailMessage>{vm.error}</DetailMessage>
  } else if (vm.selectedPath && vm.content !== null) {
    switch (vm.ext) {
      case '.md':
        body = <MarkdownView source={vm.content} />
        break
      case '.www': {
        const www = parseWww(vm.content)
        body = www ? (
          <WwwDetail www={www} />
        ) : (
          <DetailMessage>Invalid .www JSON.</DetailMessage>
        )
        break
      }
      case '.app': {
        const app = parseApp(vm.content)
        body = app ? (
          <AppDetail app={app} onOpen={() => void vm.openPath(vm.selectedPath!)} />
        ) : (
          <DetailMessage>Invalid .app JSON.</DetailMessage>
        )
        break
      }
      case '.desktop':
        body = <DetailPre>{vm.content}</DetailPre>
        break
      case '.txt':
        body = (
          <>
            <DetailMessage>Plain text file — opens in Notepad.</DetailMessage>
            <DetailActionBar onOpen={vm.openInNotepad} label="Open in Notepad" />
          </>
        )
        break
      default:
        body = <DetailMessage>Unsupported file type: {vm.ext || '(none)'}</DetailMessage>
    }
  }

  return (
    <DetailPane>
      <LocationBar>{vm.selectedPath ?? '/'}</LocationBar>
      <DetailBody>{body}</DetailBody>
    </DetailPane>
  )
}
