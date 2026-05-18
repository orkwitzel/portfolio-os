import styled from 'styled-components'
import { cursorPointer } from '@/styles/cursors'
import { CANVAS_H, CANVAS_W, LAYOUT_W, SIDE_RAIL_W } from '@/apps/tetris/tetris.renderer'

export const AppBody = styled.div`
  box-sizing: border-box;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 10px;
  min-height: 0;
  font: 13px var(--font-ui);
  color: var(--text-primary);
  background: var(--content-bg);
  user-select: none;
  outline: none;
`

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: ${LAYOUT_W}px;
  gap: 6px;
  padding: 6px 8px;
  border: 2px inset var(--inset-border);
  background: var(--shell-surface);
`

export const Counter = styled.span`
  box-sizing: border-box;
  flex: 1;
  min-width: 0;
  padding: 4px 6px;
  border: 2px inset var(--inset-border);
  background: #000;
  color: #f00;
  font-weight: 700;
  text-align: center;
  letter-spacing: 2px;
  font-size: 16px;
`

export const StatusText = styled.p`
  margin: 0;
  font-weight: 700;
  font-size: 13px;
  text-align: center;
  max-width: ${LAYOUT_W}px;
`

export const PlayRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;
  max-width: ${LAYOUT_W}px;
`

export const GameCanvas = styled.canvas`
  display: block;
  flex-shrink: 0;
  width: ${CANVAS_W}px;
  height: ${CANVAS_H}px;
  image-rendering: pixelated;
  cursor: default;
`

export const SideRail = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: ${SIDE_RAIL_W}px;
  flex-shrink: 0;
  min-height: ${CANVAS_H}px;
`

export const ControlsPanel = styled.div`
  flex: 1;
  padding: 8px;
  border: 2px inset var(--inset-border);
  background: var(--shell-surface);
`

export const ControlsTitle = styled.div`
  margin-bottom: 6px;
  font-weight: 700;
  font-size: 13px;
  text-align: center;
`

export const Controls = styled.div`
  font-size: 12px;
  line-height: 1.5;
  color: var(--text-primary);

  kbd {
    font-family: var(--font-ui);
    font-size: 12px;
  }
`

export const RestartBtn = styled.button`
  box-sizing: border-box;
  width: 100%;
  padding: 6px 8px;
  border: 2px outset var(--shell-surface);
  background: var(--shell-surface);
  font: 13px var(--font-ui);
  color: var(--text-primary);
  ${cursorPointer}
  flex-shrink: 0;

  &:active {
    border-style: inset;
  }
`
