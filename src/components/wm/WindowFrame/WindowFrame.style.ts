import styled from 'styled-components'

export const Window = styled.div`
  position: absolute;
  box-sizing: border-box;
  background: #c0c0c0;
  border-top: 2px solid #fff;
  border-left: 2px solid #fff;
  border-right: 2px solid #404040;
  border-bottom: 2px solid #404040;
  box-shadow:
    1px 1px 0 #000,
    0 10px 28px rgba(0, 0, 0, 0.2);
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

export const ResizeEast = styled.div`
  position: absolute;
  top: 22px;
  right: 0;
  bottom: 0;
  width: 6px;
  cursor: ew-resize;
  z-index: 2;
`

export const ResizeSouth = styled.div`
  position: absolute;
  left: 0;
  right: 18px;
  bottom: 0;
  height: 6px;
  cursor: ns-resize;
  z-index: 2;
`

export const ResizeGrip = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 18px;
  height: 18px;
  cursor: nwse-resize;
  z-index: 3;
  box-sizing: border-box;
  background-color: #c0c0c0;
  background-image:
    linear-gradient(
      135deg,
      transparent 0 35%,
      #808080 35% 40%,
      transparent 40% 50%,
      #808080 50% 55%,
      transparent 55% 65%,
      #808080 65% 70%,
      transparent 70% 100%
    );
  border-top: 1px solid #fff;
  border-left: 1px solid #fff;
`

export const LoadFallback = styled.div`
  padding: 10px;
  font: var(--font-size-ui) var(--font-ui);
`
