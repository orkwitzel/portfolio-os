import { useRef } from 'react'
import { useContextMenuApi } from '@/components/shell/ContextMenu'
import {
  AddressBar,
  ExplorerToolbar,
  NavBtnGroup,
  ToolbarBtn,
} from '@/apps/computer/computer.style'
import { buildFsNewSubmenu } from '@/utils/contextMenuBuilders'

export type FsExplorerToolbarProps = {
  currentDir: string
  canGoBack: boolean
  canGoForward: boolean
  canGoUp: boolean
  onBack: () => void
  onForward: () => void
  onUp: () => void
  onHome: () => void
  onNewFolder: () => void
  onNewTextDocument: () => void
  onNewShortcut: () => void
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
  onNewFolder,
  onNewTextDocument,
  onNewShortcut,
}: FsExplorerToolbarProps) {
  const { openMenu } = useContextMenuApi()
  const newBtnRef = useRef<HTMLButtonElement>(null)

  const openNewMenu = () => {
    const el = newBtnRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    openMenu(rect.left, rect.bottom, [
      buildFsNewSubmenu({ onNewFolder, onNewTextDocument, onNewShortcut }),
    ])
  }

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
      <ToolbarBtn
        ref={newBtnRef}
        type="button"
        onClick={openNewMenu}
        aria-label="New"
        aria-haspopup="menu"
      >
        New ▾
      </ToolbarBtn>
    </ExplorerToolbar>
  )
}
