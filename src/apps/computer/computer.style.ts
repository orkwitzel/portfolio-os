import styled from 'styled-components'
import { cursors } from '@/styles/cursors'

export const AppBody = styled.div`
  box-sizing: border-box;
  flex: 1;
  display: flex;
  flex-direction: row;
  min-height: 0;
  overflow: hidden;
`

export const TreePane = styled.div`
  flex: 0 0 180px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #404040;
  background: #c0c0c0;
`

export const TreeScroll = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 4px;
`

export const DetailPane = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  min-height: 0;
`

export const LocationBar = styled.div`
  flex: 0 0 auto;
  padding: 4px 8px;
  font-family: var(--font-mono, monospace);
  font-size: var(--font-size-ui, 12px);
  border-bottom: 1px solid #404040;
  background: #c0c0c0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const DetailBody = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 8px;
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

export const TreeButton = styled.button<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  padding: 2px 4px;
  border: none;
  background: ${(p) => (p.$selected ? '#000080' : 'transparent')};
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  text-align: left;
  cursor: ${cursors.pointer};
  color: ${(p) => (p.$selected ? '#fff' : 'inherit')};

  &:hover {
    background: ${(p) => (p.$selected ? '#000080' : 'rgba(0, 0, 128, 0.15)')};
  }
`

export const TreeToggle = styled.span`
  flex: 0 0 12px;
  font-size: 10px;
  line-height: 1;
`

export const TreeSpacer = styled.span`
  flex: 0 0 12px;
`

export const DetailActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`

export const ToolbarBtn = styled.button`
  padding: 4px 12px;
  border: 2px outset #dfdfdf;
  background: #c0c0c0;
  font-family: var(--font-ui, 'MS Sans Serif', sans-serif);
  font-size: var(--font-size-ui, 12px);
  cursor: ${cursors.pointer};

  &:active {
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
