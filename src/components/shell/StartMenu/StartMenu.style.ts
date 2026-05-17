import styled from 'styled-components'

export const Panel = styled.div`
  position: fixed;
  z-index: 25000;
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

export const Item = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  margin: 0;
  padding: 4px 8px;
  border: none;
  background: transparent;
  font: var(--font-size-ui) var(--font-ui);
  text-align: left;
  cursor: default;
  color: #000;

  &:hover,
  &:focus-visible {
    background: #000080;
    color: #fff;
    outline: none;
  }
`

export const ItemLabel = styled.span`
  flex: 1;
  min-width: 0;
`

export const Divider = styled.li`
  height: 0;
  margin: 3px 2px;
  padding: 0;
  list-style: none;
  border-top: 1px solid #808080;
  border-bottom: 1px solid #fff;
`
