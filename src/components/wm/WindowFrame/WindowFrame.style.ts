import styled from 'styled-components'

export const Window = styled.div`
  position: absolute;
  box-sizing: border-box;
  background: #c0c0c0;
  border-top: 2px solid #fff;
  border-left: 2px solid #fff;
  border-right: 2px solid #404040;
  border-bottom: 2px solid #404040;
  box-shadow: 1px 1px 0 #000;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
`

export const TitleBar = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  height: 22px;
  padding: 2px 3px;
  flex-shrink: 0;
  cursor: grab;
  user-select: none;
  background: ${(p) =>
    p.$active
      ? 'linear-gradient(90deg, #000080, #1084d0)'
      : 'linear-gradient(90deg, #808080, #b5b5b5)'};
  color: ${(p) => (p.$active ? '#fff' : '#c0c0c0')};

  &:active {
    cursor: grabbing;
  }
`

export const TitleIcon = styled.span`
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  background: #fff;
  border: 1px solid #000;
`

export const TitleText = styled.span`
  flex: 1;
  font: bold var(--font-size-ui) / 1 var(--font-ui);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const Controls = styled.div`
  display: flex;
  gap: 2px;
  flex-shrink: 0;
`

export const ControlBtn = styled.button`
  width: 16px;
  height: 14px;
  padding: 0;
  box-sizing: border-box;
  border-top: 2px solid #fff;
  border-left: 2px solid #fff;
  border-right: 2px solid #404040;
  border-bottom: 2px solid #404040;
  background: #c0c0c0;
  font: var(--font-size-ui) / 1 var(--font-ui);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;

  &:active {
    border-top: 2px solid #404040;
    border-left: 2px solid #404040;
    border-right: 2px solid #fff;
    border-bottom: 2px solid #fff;
  }
`

export const Client = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  border: 2px inset #c0c0c0;
  margin: 3px;
  margin-top: 0;
  background: #c0c0c0;
`

export const ResizeCorner = styled.div`
  position: absolute;
  width: 14px;
  height: 14px;
  right: 2px;
  bottom: 2px;
  cursor: nwse-resize;
  background: transparent;
`

export const LoadFallback = styled.div`
  padding: 10px;
  font: var(--font-size-ui) var(--font-ui);
`
