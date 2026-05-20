import styled from 'styled-components'
import { cursorPointer } from '@/styles/cursors'

export const AppBody = styled.div`
  box-sizing: border-box;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 2px;
  gap: 2px;
  background: var(--content-bg);
`

export const Toolbar = styled.div`
  display: flex;
  flex-shrink: 0;
  gap: 4px;
  padding: 4px;
  border: 2px inset var(--inset-border);
  background: var(--shell-surface);
`

export const ToolbarBtn = styled.button`
  box-sizing: border-box;
  padding: 2px 10px;
  border: 2px outset var(--shell-surface);
  background: var(--shell-surface);
  font: var(--font-size-ui) var(--font-ui);
  color: var(--text-primary);
  ${cursorPointer}

  &:active {
    border-style: inset;
  }
`

export const ToolbarLink = styled.a`
  box-sizing: border-box;
  padding: 2px 10px;
  border: 2px outset var(--shell-surface);
  background: var(--shell-surface);
  font: var(--font-size-ui) var(--font-ui);
  color: var(--text-primary);
  ${cursorPointer}
  text-decoration: none;

  &:active {
    border-style: inset;
  }
`

export const PdfFrame = styled.iframe`
  flex: 1;
  min-height: 0;
  width: 100%;
  border: 2px inset var(--inset-border);
  background: var(--shell-border-mid);
`
