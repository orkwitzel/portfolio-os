import styled from 'styled-components'
import { cursors } from '@/styles/cursors'

export const Workspace = styled.div`
  position: relative;
  flex: 1;
  min-height: 0;
  background: #018281;
  user-select: none;
`

export const Shortcuts = styled.div`
  position: absolute;
  inset: 12px;
`

export const Shortcut = styled.button<{ $selected: boolean; $dragging: boolean }>`
  position: absolute;
  width: 92px;
  border: none;
  padding: 4px 6px;
  background: ${(p) => (p.$selected ? 'rgba(0, 0, 128, 0.55)' : 'transparent')};
  cursor: ${cursors.pointer};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: #fff;
  text-shadow:
    1px 0 #000,
    -1px 0 #000,
    0 1px #000,
    0 -1px #000;
  font: var(--font-size-ui) var(--font-ui);
  -webkit-user-drag: none;
  opacity: ${(p) => (p.$dragging ? 0.3 : 1)};
  outline: ${(p) =>
    p.$selected ? '1px dotted #fff' : 'none'};
  outline-offset: ${(p) => (p.$selected ? '1px' : '0')};

  &:focus-visible {
    outline: 2px dotted #fff;
    outline-offset: 2px;
  }
`

export const ShortcutGhost = styled.div`
  position: absolute;
  width: 92px;
  padding: 4px 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: #fff;
  text-shadow:
    1px 0 #000,
    -1px 0 #000,
    0 1px #000,
    0 -1px #000;
  font: var(--font-size-ui) var(--font-ui);
  opacity: 0.8;
  pointer-events: none;
  z-index: 20;
`

export const ShortcutLabel = styled.span`
  text-align: center;
  word-break: break-word;
`

export const RenameInput = styled.input`
  width: 100%;
  max-width: 88px;
  padding: 1px 2px;
  border: 1px solid #000;
  font: var(--font-size-ui) var(--font-ui);
  text-align: center;
  color: #000;
  background: #fff;
  box-sizing: border-box;
`

export const MarqueeRect = styled.div`
  position: absolute;
  border: 1px dotted #fff;
  background: rgba(0, 0, 128, 0.25);
  pointer-events: none;
  z-index: 30;
`
