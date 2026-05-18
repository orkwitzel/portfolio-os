import {
  AddressBar,
  ExplorerToolbar,
  NavBtnGroup,
  ToolbarBtn,
} from '@/apps/computer/computer.style'

export type FsExplorerToolbarProps = {
  currentDir: string
  canGoBack: boolean
  canGoForward: boolean
  canGoUp: boolean
  onBack: () => void
  onForward: () => void
  onUp: () => void
  onHome: () => void
}

export default function FsExplorerToolbar({
  currentDir,
  canGoBack,
  canGoForward,
  canGoUp,
  onBack,
  onForward,
  onUp,
  onHome,
}: FsExplorerToolbarProps) {
  return (
    <ExplorerToolbar>
      <NavBtnGroup>
        <ToolbarBtn type="button" disabled={!canGoBack} onClick={onBack} aria-label="Back">
          ←
        </ToolbarBtn>
        <ToolbarBtn
          type="button"
          disabled={!canGoForward}
          onClick={onForward}
          aria-label="Forward"
        >
          →
        </ToolbarBtn>
        <ToolbarBtn type="button" disabled={!canGoUp} onClick={onUp} aria-label="Up">
          ↑
        </ToolbarBtn>
        <ToolbarBtn type="button" onClick={onHome} aria-label="Home">
          ⌂
        </ToolbarBtn>
      </NavBtnGroup>
      <AddressBar title={currentDir}>{currentDir}</AddressBar>
    </ExplorerToolbar>
  )
}
