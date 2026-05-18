import styled from 'styled-components'
import { cursorPointer } from '@/styles/cursors'

export const ExplorerColumn = styled.div`
  box-sizing: border-box;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
`

export const AppBody = styled.div`
  box-sizing: border-box;
  flex: 1;
  display: flex;
  flex-direction: row;
  min-height: 0;
  overflow: hidden;
`

export const MainColumn = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  min-height: 0;
`

export const TreePane = styled.div`
  flex: 0 0 180px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--shell-border-dark);
  background: var(--shell-surface);
`

export const PlacesList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 4px;
  border-bottom: 1px solid var(--shell-border-mid);
  flex: 0 0 auto;
`

export const PlacesItem = styled.li`
  margin: 0;
  padding: 0;
`

export const PlacesButton = styled.button<{ $active?: boolean }>`
  display: block;
  width: 100%;
  padding: 2px 6px;
  border: none;
  background: ${(p) => (p.$active ? 'var(--menu-highlight)' : 'transparent')};
  font-family: var(--font-ui, 'MS Sans Serif', sans-serif);
  font-size: 11px;
  text-align: left;
  ${cursorPointer}
  color: ${(p) => (p.$active ? 'var(--menu-highlight-text)' : 'inherit')};

  &:hover {
    background: ${(p) => (p.$active ? 'var(--menu-highlight)' : 'rgba(0, 0, 128, 0.12)')};
  }
`

export const TreeScroll = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 4px;
`

export const ExplorerToolbar = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 4px;
  border-bottom: 1px solid var(--shell-border-mid);
  background: var(--shell-surface);
`

export const NavBtnGroup = styled.div`
  display: flex;
  gap: 2px;
  flex: 0 0 auto;
`

export const AddressBar = styled.div`
  flex: 1;
  min-width: 0;
  padding: 2px 6px;
  font-family: var(--font-mono, monospace);
  font-size: var(--font-size-ui, 12px);
  border: 1px inset var(--shell-border-mid);
  background: var(--shell-border-light);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const FolderView = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  background: var(--shell-border-light);
  padding: 8px;
`

export const FolderGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 4px;
`

export const FolderItem = styled.button<{ $selected?: boolean }>`
  width: 92px;
  border: none;
  padding: 4px 6px;
  background: ${(p) => (p.$selected ? 'rgba(0, 0, 128, 0.2)' : 'transparent')};
  ${cursorPointer}
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: var(--text-primary);
  font: var(--font-size-ui) var(--font-ui);
  outline: ${(p) => (p.$selected ? '1px dotted var(--menu-highlight)' : 'none')};
  outline-offset: 1px;

  &:focus-visible {
    outline: 2px dotted var(--menu-highlight);
    outline-offset: 2px;
  }
`

export const FolderItemLabel = styled.span`
  text-align: center;
  word-break: break-word;
  line-height: 1.2;
  max-width: 100%;
`

export const PreviewPane = styled.div`
  flex: 0 0 auto;
  max-height: 140px;
  min-height: 0;
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--shell-border-mid);
  background: var(--shell-surface);
`

export const PreviewBody = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 6px 8px;
  background: var(--shell-border-light);
`

export const TreeList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`

export const TreeItem = styled.li`
  margin: 0;
  padding: 0;
`

export const TreeRow = styled.div<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  background: ${(p) => (p.$selected ? 'var(--menu-highlight)' : 'transparent')};
  color: ${(p) => (p.$selected ? 'var(--shell-border-light)' : 'inherit')};

  &:hover {
    background: ${(p) => (p.$selected ? 'var(--menu-highlight)' : 'rgba(0, 0, 128, 0.12)')};
  }
`

export const TreeToggle = styled.button`
  flex: 0 0 14px;
  padding: 0;
  border: none;
  background: transparent;
  font-size: 10px;
  line-height: 1;
  ${cursorPointer}
  color: inherit;
`

export const TreeLabel = styled.button`
  flex: 1;
  min-width: 0;
  padding: 2px 4px 2px 0;
  border: none;
  background: transparent;
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  text-align: left;
  ${cursorPointer}
  color: inherit;
`

export const DetailActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`

export const ToolbarBtn = styled.button`
  padding: 2px 10px;
  border: 2px outset #dfdfdf;
  background: var(--shell-surface);
  font-family: var(--font-ui, 'MS Sans Serif', sans-serif);
  font-size: var(--font-size-ui, 12px);
  ${cursorPointer}

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }

  &:active:not(:disabled) {
    border-style: inset;
  }
`

export const DetailMessage = styled.p`
  font-size: var(--font-size-ui, 12px);
  margin: 0 0 8px;
`

export const DetailPre = styled.pre`
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  white-space: pre-wrap;
  margin: 0 0 8px;
`
