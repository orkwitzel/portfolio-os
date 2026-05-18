import styled, { css, keyframes } from 'styled-components'
import { cursorPointer } from '@/styles/cursors'
import { TASKBAR_ANIM_EASE, TASKBAR_ANIM_MS } from '@/utils/taskbarAnimation'

const taskEnter = keyframes`
  from {
    opacity: 0;
    transform: translateY(6px) scale(0.94);
    max-width: 0;
    min-width: 0;
    padding-left: 0;
    padding-right: 0;
    margin-right: -4px;
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    max-width: 200px;
    min-width: 120px;
    padding-left: 6px;
    padding-right: 8px;
    margin-right: 0;
  }
`

const taskExit = keyframes`
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
    max-width: 200px;
    min-width: 120px;
  }
  to {
    opacity: 0;
    transform: translateY(5px) scale(0.9);
    max-width: 0;
    min-width: 0;
    padding-left: 0;
    padding-right: 0;
    margin-right: -4px;
  }
`

export const Bar = styled.div`
  height: 32px;
  flex-shrink: 0;
  background: var(--taskbar-bg);
  border-top: 2px solid var(--taskbar-border-top);
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 6px;
  box-sizing: border-box;
`

export const StartBtn = styled.button<{ $pressed: boolean }>`
  margin: 0;
  height: 22px;
  padding: 0 8px 0 6px;
  border-top: 2px solid ${(p) => (p.$pressed ? 'var(--shell-border-dark)' : 'var(--shell-border-light)')};
  border-left: 2px solid ${(p) => (p.$pressed ? 'var(--shell-border-dark)' : 'var(--shell-border-light)')};
  border-right: 2px solid ${(p) => (p.$pressed ? 'var(--shell-border-light)' : 'var(--shell-border-dark)')};
  border-bottom: 2px solid ${(p) => (p.$pressed ? 'var(--shell-border-light)' : 'var(--shell-border-dark)')};
  background: var(--shell-surface);
  font: var(--font-size-ui) var(--font-ui);
  ${cursorPointer}
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--text-primary);
`

export const StartIcon = styled.span`
  font-size: var(--font-size-ui);
  line-height: 1;
`

export const StartLabel = styled.span`
  font-weight: bold;
  line-height: 1;
`

export const Tasks = styled.div`
  flex: 1;
  display: flex;
  gap: 4px;
  min-width: 0;
  overflow-x: auto;
  align-items: center;
`

export const TaskBtn = styled.button<{
  $active: boolean
  $minimized: boolean
  $entering: boolean
  $exiting: boolean
}>`
  height: 22px;
  min-width: 120px;
  max-width: 200px;
  padding: 0 8px 0 6px;
  box-sizing: border-box;
  border-top: 2px solid ${(p) => (p.$active ? 'var(--shell-border-dark)' : 'var(--shell-border-light)')};
  border-left: 2px solid ${(p) => (p.$active ? 'var(--shell-border-dark)' : 'var(--shell-border-light)')};
  border-right: 2px solid ${(p) => (p.$active ? 'var(--shell-border-light)' : 'var(--shell-border-dark)')};
  border-bottom: 2px solid ${(p) => (p.$active ? 'var(--shell-border-light)' : 'var(--shell-border-dark)')};
  background: var(--shell-surface);
  font: var(--font-size-ui) var(--font-ui);
  text-align: left;
  ${cursorPointer}
  color: ${(p) => (p.$minimized ? 'var(--text-secondary)' : 'var(--text-primary)')};
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  overflow: hidden;
  transition:
    border-color 80ms ${TASKBAR_ANIM_EASE},
    background-color 80ms ${TASKBAR_ANIM_EASE},
    transform 120ms ${TASKBAR_ANIM_EASE},
    filter 120ms ${TASKBAR_ANIM_EASE};

  ${(p) =>
    p.$entering &&
    css`
      animation: ${taskEnter} ${TASKBAR_ANIM_MS}ms ${TASKBAR_ANIM_EASE} both;
    `}

  ${(p) =>
    p.$exiting &&
    css`
      animation: ${taskExit} ${TASKBAR_ANIM_MS}ms ${TASKBAR_ANIM_EASE} forwards;
      pointer-events: none;
    `}

  ${(p) =>
    !p.$active &&
    !p.$exiting &&
    css`
      &:hover {
        filter: brightness(1.06);
        transform: translateY(-1px);
      }

      &:active {
        transform: translateY(0);
        filter: none;
        border-top: 2px solid var(--shell-border-dark);
        border-left: 2px solid var(--shell-border-dark);
        border-right: 2px solid var(--shell-border-light);
        border-bottom: 2px solid var(--shell-border-light);
      }
    `}

  ${(p) =>
    p.$active &&
    !p.$exiting &&
    css`
      &:hover {
        filter: brightness(1.04);
      }
    `}
`

export const TaskBtnLabel = styled.span`
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const Tray = styled.div`
  min-width: 72px;
  height: 22px;
  padding: 0 4px;
  box-sizing: border-box;
  border: 2px inset var(--inset-border);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`
