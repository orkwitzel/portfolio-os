import styled from 'styled-components'
import { cursorPointer } from '@/styles/cursors'

export const AppBody = styled.div`
  box-sizing: border-box;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: var(--content-bg);
`

export const Toolbar = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 2px 4px;
  border-bottom: 1px solid var(--shell-border-mid);
  background: var(--shell-surface);
`

export const ToolBtn = styled.button`
  padding: 2px 12px;
  border: 2px outset var(--taskbar-border-top);
  background: var(--shell-surface);
  font: inherit;
  color: var(--text-primary);
  ${cursorPointer}

  &:active {
    border-style: inset;
  }
`

export const PathLabel = styled.span`
  font: var(--font-size-ui) / 1.35 var(--font-ui);
  color: var(--text-primary);
`

export const NotepadField = styled.textarea`
  flex: 1;
  box-sizing: border-box;
  margin: 2px;
  border: 2px inset var(--inset-border);
  padding: 6px;
  font: var(--font-size-ui) / 1.35 var(--font-ui);
  resize: none;
  outline: none;
  background: var(--content-bg-alt);
  color: var(--text-primary);
  min-height: 0;
`
