import styled from 'styled-components'
import { cursorPointer } from '@/styles/cursors'

export const TrayButton = styled.button<{ $pressed: boolean }>`
  margin: 0;
  padding: 0 4px;
  min-width: 100%;
  height: 100%;
  border: none;
  border-top: 1px solid
    ${(p) => (p.$pressed ? 'var(--shell-border-dark)' : 'transparent')};
  border-left: 1px solid
    ${(p) => (p.$pressed ? 'var(--shell-border-dark)' : 'transparent')};
  border-right: 1px solid
    ${(p) => (p.$pressed ? 'var(--shell-border-light)' : 'transparent')};
  border-bottom: 1px solid
    ${(p) => (p.$pressed ? 'var(--shell-border-light)' : 'transparent')};
  background: ${(p) => (p.$pressed ? 'var(--shell-surface)' : 'transparent')};
  font: inherit;
  color: inherit;
  ${cursorPointer}
  display: flex;
  align-items: center;
  justify-content: center;
`

export const TrayTime = styled.time`
  font: var(--font-size-ui) var(--font-ui);
  color: var(--text-primary);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
`
