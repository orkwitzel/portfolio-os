import styled from 'styled-components'
import { cursorPointer } from '@/styles/cursors'
import {
  Body,
  ButtonRow,
  Dialog,
  DialogBtn,
  Overlay,
  TitleBar,
  TitleClose,
  TitleText,
} from '@/components/shell/ShellModal/ShellModal.style'

export { Overlay, Dialog, TitleBar, TitleText, TitleClose, Body, ButtonRow, DialogBtn }

export const PathRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  font: var(--font-size-ui) var(--font-ui);
  color: var(--text-primary);
  border-bottom: 1px solid var(--shell-border-mid);
`

export const NavBtn = styled.button`
  padding: 2px 8px;
  border: 2px outset var(--taskbar-border-top);
  background: var(--shell-surface);
  font: inherit;
  ${cursorPointer}

  &:disabled {
    opacity: 0.5;
  }

  &:active:not(:disabled) {
    border-style: inset;
  }
`

export const FileList = styled.ul`
  margin: 0;
  padding: 4px;
  list-style: none;
  min-height: 160px;
  max-height: 220px;
  overflow: auto;
  border: 2px inset var(--inset-border);
  background: var(--content-bg-alt);
`

export const FileRow = styled.li`
  margin: 0;
  padding: 0;
`

export const FileBtn = styled.button<{ $selected?: boolean }>`
  display: block;
  width: 100%;
  margin: 0;
  padding: 2px 6px;
  border: none;
  text-align: left;
  font: var(--font-size-ui) var(--font-ui);
  background: ${(p) => (p.$selected ? 'var(--menu-highlight)' : 'transparent')};
  color: ${(p) => (p.$selected ? 'var(--menu-highlight-text)' : 'var(--text-primary)')};
  ${cursorPointer}
`

export const NameField = styled.input`
  flex: 1;
  box-sizing: border-box;
  padding: 4px 6px;
  border: 2px inset var(--inset-border);
  font: var(--font-size-ui) var(--font-ui);
  background: var(--content-bg-alt);
  color: var(--text-primary);
`

export const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  font: var(--font-size-ui) var(--font-ui);
`
