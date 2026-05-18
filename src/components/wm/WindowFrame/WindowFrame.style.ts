import styled, { css } from 'styled-components'
import {
  cursorEwResize,
  cursorMove,
  cursorNsResize,
  cursorNwseResize,
  cursorPointer,
} from '@/styles/cursors'
import { WINDOW_ANIM_EASE, WINDOW_ANIM_MS } from '@/utils/windowFrameAnimation'

/** Shared with resize hit-targets so they align under the title bar. */
export const TITLE_BAR_HEIGHT = 28

export const Window = styled.div<{ $animating?: boolean }>`
  position: absolute;
  box-sizing: border-box;
  background: var(--shell-surface);
  border-top: 2px solid var(--shell-border-light);
  border-left: 2px solid var(--shell-border-light);
  border-right: 2px solid var(--shell-border-dark);
  border-bottom: 2px solid var(--shell-border-dark);
  box-shadow: var(--window-shadow);
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
  ${cursorMove}
  user-select: none;
  background: ${(p) =>
    p.$active
      ? 'linear-gradient(90deg, var(--titlebar-active-from), var(--titlebar-active-to))'
      : 'linear-gradient(90deg, var(--titlebar-inactive-from), var(--titlebar-inactive-to))'};
  color: ${(p) =>
    p.$active ? 'var(--titlebar-active-text)' : 'var(--titlebar-inactive-text)'};

  &:active {
    ${cursorMove}
  }
`

export const TitleIcon = styled.span`
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  background: var(--content-bg-alt);
  border: 1px solid var(--shell-border-dark);
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

export type ControlGlyph = 'minimize' | 'maximize' | 'restore' | 'close'

const controlGlyphStyles: Record<ControlGlyph, ReturnType<typeof css>> = {
  minimize: css`
    &::after {
      content: '';
      position: absolute;
      left: 50%;
      bottom: 3px;
      transform: translateX(-50%);
      width: 9px;
      height: 3px;
      background: currentColor;
    }
  `,
  maximize: css`
    &::after {
      content: '';
      display: block;
      width: 9px;
      height: 9px;
      box-sizing: border-box;
      border: 2px solid currentColor;
    }
  `,
  restore: css`
    &::before,
    &::after {
      content: '';
      position: absolute;
      width: 7px;
      height: 7px;
      box-sizing: border-box;
      border: 2px solid currentColor;
      background: var(--shell-surface);
    }

    &::before {
      top: 2px;
      left: 2px;
    }

    &::after {
      bottom: 2px;
      right: 2px;
    }
  `,
  close: css`
    &::before,
    &::after {
      content: '';
      position: absolute;
      width: 11px;
      height: 3px;
      background: currentColor;
    }

    &::before {
      transform: rotate(45deg);
    }

    &::after {
      transform: rotate(-45deg);
    }
  `,
}

export const ControlBtn = styled.button<{ $glyph: ControlGlyph }>`
  position: relative;
  width: 20px;
  height: 18px;
  padding: 0;
  box-sizing: border-box;
  border-top: 2px solid var(--shell-border-light);
  border-left: 2px solid var(--shell-border-light);
  border-right: 2px solid var(--shell-border-dark);
  border-bottom: 2px solid var(--shell-border-dark);
  background: var(--shell-surface);
  ${cursorPointer}
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  font-size: 0;

  ${(p) => controlGlyphStyles[p.$glyph]}

  &:active {
    border-top: 2px solid var(--shell-border-dark);
    border-left: 2px solid var(--shell-border-dark);
    border-right: 2px solid var(--shell-border-light);
    border-bottom: 2px solid var(--shell-border-light);
  }
`

export const Client = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  border: 2px inset var(--inset-border);
  margin: 3px;
  margin-top: 0;
  background: var(--content-bg);
`

export const ResizeEast = styled.div`
  position: absolute;
  top: ${TITLE_BAR_HEIGHT}px;
  right: 0;
  bottom: 0;
  width: 6px;
  ${cursorEwResize}
  z-index: 2;
`

export const ResizeSouth = styled.div`
  position: absolute;
  left: 0;
  right: 18px;
  bottom: 0;
  height: 6px;
  ${cursorNsResize}
  z-index: 2;
`

export const ResizeGrip = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 18px;
  height: 18px;
  ${cursorNwseResize}
  z-index: 3;
  box-sizing: border-box;
  background-color: var(--shell-surface);
  background-image:
    linear-gradient(
      135deg,
      transparent 0 35%,
      var(--shell-border-mid) 35% 40%,
      transparent 40% 50%,
      var(--shell-border-mid) 50% 55%,
      transparent 55% 65%,
      var(--shell-border-mid) 65% 70%,
      transparent 70% 100%
    );
  border-top: 1px solid var(--shell-border-light);
  border-left: 1px solid var(--shell-border-light);
`

export const LoadFallback = styled.div`
  padding: 10px;
  font: var(--font-size-ui) var(--font-ui);
  color: var(--text-primary);
`
