import styled from 'styled-components'
import { cursors } from '@/styles/cursors'

export const AppBody = styled.div`
  box-sizing: border-box;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`

export const Toolbar = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 2px 4px;
  border-bottom: 1px solid #808080;
  background: #c0c0c0;
`

export const ToolBtn = styled.button`
  padding: 2px 12px;
  border: 2px outset #dfdfdf;
  background: #c0c0c0;
  font: inherit;
  cursor: ${cursors.default};

  &:active {
    border-style: inset;
  }
`

export const PathLabel = styled.span`
  font: var(--font-size-ui) / 1.35 var(--font-ui);
  color: #000;
`

export const NotepadField = styled.textarea`
  flex: 1;
  box-sizing: border-box;
  margin: 2px;
  border: 2px inset #c0c0c0;
  padding: 6px;
  font: var(--font-size-ui) / 1.35 var(--font-ui);
  resize: none;
  outline: none;
  background: #fff;
  color: #000;
  min-height: 0;
`
