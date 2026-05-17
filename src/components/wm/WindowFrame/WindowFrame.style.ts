import styled from 'styled-components'
import { cursors } from '@/styles/cursors'
import { WINDOW_ANIM_EASE, WINDOW_ANIM_MS } from '@/utils/windowFrameAnimation'

/** Shared with resize hit-targets so they align under the title bar. */
export const TITLE_BAR_HEIGHT = 28

export const Window = styled.div<{ $animating?: boolean }>`
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
  transition: ${(p) =>
    p.$animating
      ? `left ${WINDOW_ANIM_MS}ms ${WINDOW_ANIM_EASE}, top ${WINDOW_ANIM_MS}ms ${WINDOW_ANIM_EASE}, width ${WINDOW_ANIM_MS}ms ${WINDOW_ANIM_EASE}, height ${WINDOW_ANIM_MS}ms ${WINDOW_ANIM_EASE}, opacity ${WINDOW_ANIM_MS}ms ${WINDOW_ANIM_EASE}`
      : 'none'};
  will-change: ${(p) => (p.$animating ? 'left, top, width, height, opacity' : 'auto')};
`

export const TitleBar = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 5px;
  height: ${TITLE_BAR_HEIGHT}px;
  padding: 3px 4px;
  flex-shrink: 0;
  cursor: ${cursors.move};
  user-select: none;
  background: ${(p) =>
    p.$active
      ? 'linear-gradient(90deg, #000080, #1084d0)'
      : 'linear-gradient(90deg, #808080, #b5b5b5)'};
  color: ${(p) => (p.$active ? '#fff' : '#c0c0c0')};

  &:active {
    cursor: ${cursors.move};
  }
`

export const TitleIcon = styled.span`
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  background: #fff;
  border: 1px solid #000;
`

export const TitleText = styled.span`
  flex: 1;
  font: bold 13px / 1 var(--font-ui);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const Controls = styled.div`
  display: flex;
  gap: 3px;
  flex-shrink: 0;
`

export const ControlBtn = styled.button`
  width: 20px;
  height: 18px;
  padding: 0;
  box-sizing: border-box;
  border-top: 2px solid #fff;
  border-left: 2px solid #fff;
  border-right: 2px solid #404040;
  border-bottom: 2px solid #404040;
  background: #c0c0c0;
  font: 13px / 1 var(--font-ui);
  cursor: ${cursors.pointer};
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
  top: ${TITLE_BAR_HEIGHT}px;
  right: 0;
  bottom: 0;
  width: 6px;
  cursor: ${cursors.ewResize};
  z-index: 2;
`

export const ResizeSouth = styled.div`
  position: absolute;
  left: 0;
  right: 18px;
  bottom: 0;
  height: 6px;
  cursor: ${cursors.nsResize};
  z-index: 2;
`

export const ResizeGrip = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 18px;
  height: 18px;
  cursor: ${cursors.nwseResize};
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
