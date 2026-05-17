import styled from 'styled-components'
import { cursors } from '@/styles/cursors'

export const Panel = styled.div<{ $zIndex?: number }>`
  position: fixed;
  z-index: ${(p) => p.$zIndex ?? 25000};
  min-width: 180px;
  padding: 2px;
  box-sizing: border-box;
  background: #c0c0c0;
  border-top: 2px solid #fff;
  border-left: 2px solid #fff;
  border-right: 2px solid #404040;
  border-bottom: 2px solid #404040;
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
  cursor: ${cursors.default};
  color: ${(p) => (p.$disabled ? '#808080' : '#000')};
  pointer-events: ${(p) => (p.$disabled ? 'none' : 'auto')};

  &:hover:not(:disabled),
  &:focus-visible:not(:disabled) {
    background: #000080;
    color: #fff;
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
  border-top: 1px solid #808080;
  border-bottom: 1px solid #fff;
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
