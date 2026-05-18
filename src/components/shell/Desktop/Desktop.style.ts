import styled from 'styled-components'
import { cursorPointer } from '@/styles/cursors'

export const Workspace = styled.div`
  position: relative;
  flex: 1;
  min-height: 0;
  background-color: var(--desktop-bg);
  background-image: var(--desktop-bg-image);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
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
  background: ${(p) => (p.$selected ? 'var(--selection-bg)' : 'transparent')};
  ${cursorPointer}
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: var(--selection-text);
  text-shadow:
    1px 0 #000,
    -1px 0 #000,
    0 1px #000,
    0 -1px #000;
  font: var(--font-size-ui) var(--font-ui);
  -webkit-user-drag: none;
  opacity: ${(p) => (p.$dragging ? 0.3 : 1)};
  outline: ${(p) =>
    p.$selected ? '1px dotted var(--selection-text)' : 'none'};
  outline-offset: ${(p) => (p.$selected ? '1px' : '0')};

  &:focus-visible {
    outline: 2px dotted var(--selection-text);
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
  color: var(--selection-text);
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
  border: 1px solid var(--shell-border-dark);
  font: var(--font-size-ui) var(--font-ui);
  text-align: center;
  color: var(--text-primary);
  background: var(--content-bg-alt);
  box-sizing: border-box;
`

export const MarqueeRect = styled.div`
  position: absolute;
  border: 1px dotted var(--selection-text);
  background: var(--selection-bg);
  pointer-events: none;
  z-index: 30;
`
