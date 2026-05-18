import styled from 'styled-components'
import { cursorPointer } from '@/styles/cursors'

export const Panel = styled.div<{ $zIndex?: number }>`
  position: fixed;
  z-index: ${(p) => p.$zIndex ?? 25000};
  min-width: 180px;
  padding: 2px;
  box-sizing: border-box;
  background: var(--shell-surface);
  border-top: 2px solid var(--shell-border-light);
  border-left: 2px solid var(--shell-border-light);
  border-right: 2px solid var(--shell-border-dark);
  border-bottom: 2px solid var(--shell-border-dark);
  box-shadow: 1px 1px 0 #000;
`

export const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`

export const Item = styled.button<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  margin: 0;
  padding: 4px 24px 4px 8px;
  border: none;
  background: transparent;
  font: var(--font-size-ui) var(--font-ui);
  text-align: left;
  ${cursorPointer}
  color: ${(p) => (p.$disabled ? 'var(--shell-border-mid)' : 'var(--text-primary)')};
  pointer-events: ${(p) => (p.$disabled ? 'none' : 'auto')};

  &:hover:not(:disabled),
  &:focus-visible:not(:disabled) {
    background: var(--menu-highlight);
    color: var(--menu-highlight-text);
    outline: none;
  }
`

export const ItemLabel = styled.span`
  flex: 1;
  min-width: 0;
`

export const SubmenuArrow = styled.span`
  margin-left: auto;
  font-size: 10px;
`

export const Divider = styled.li`
  height: 0;
  margin: 3px 2px;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--shell-border-mid);
  border-bottom: 1px solid var(--shell-border-light);
`

export const SubmenuPanel = styled(Panel)`
  display: none;
  position: absolute;
  left: 100%;
  top: -2px;
  margin-left: -2px;
  min-width: 160px;
`

export const SubmenuWrap = styled.li`
  position: relative;
  list-style: none;

  &:hover > ${SubmenuPanel}, &:focus-within > ${SubmenuPanel} {
    display: block;
  }
`
