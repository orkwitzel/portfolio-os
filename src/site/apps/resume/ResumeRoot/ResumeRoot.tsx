import type { AppProps } from '@/store/session/sessionTypes'
import { useResumeRoot } from './ResumeRoot.logic'
import { AppBody, PdfFrame, Toolbar, ToolbarBtn, ToolbarLink } from './ResumeRoot.style'

export default function ResumeRoot(props: AppProps) {
  const vm = useResumeRoot(props)

  return (
    <AppBody>
      <Toolbar>
        <ToolbarBtn type="button" onClick={vm.openInNewTab}>
          Open in new tab
        </ToolbarBtn>
        <ToolbarLink href={vm.resumeUrl} download>
          Download
        </ToolbarLink>
      </Toolbar>
      <PdfFrame title="Resume" src={vm.resumeUrl} />
    </AppBody>
  )
}
