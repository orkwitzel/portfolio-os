import styled, { css } from 'styled-components'
import { cursorPointer } from '@/styles/cursors'

const numberColor = (n: number) => {
  const colors = [
    '',
    '#0000ff',
    '#008000',
    '#ff0000',
    'var(--link-color)',
    '#800000',
    '#008080',
    'var(--text-primary)',
    'var(--text-secondary)',
  ]
  return colors[n] ?? 'var(--text-primary)'
}

export const AppBody = styled.div`
  box-sizing: border-box;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 6px;
  min-height: 0;
  font: var(--font-size-ui) var(--font-ui);
  color: var(--text-primary);
  background: var(--content-bg);
  user-select: none;
`

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 100%;
  padding: 4px 6px;
  border: 2px inset var(--inset-border);
  background: var(--shell-surface);
`

export const Counter = styled.span`
  box-sizing: border-box;
  min-width: 36px;
  padding: 2px 4px;
  border: 2px inset var(--inset-border);
  background: #000;
  color: #f00;
  font-weight: 700;
  text-align: center;
  letter-spacing: 1px;
`

export const FaceBtn = styled.button`
  box-sizing: border-box;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 2px outset var(--shell-surface);
  background: var(--shell-surface);
  font: 14px/1 var(--font-ui);
  ${cursorPointer}

  &:active {
    border-style: inset;
  }
`

export const StatusText = styled.p`
  margin: 0;
  font-weight: 700;
  text-align: center;
`

export const Board = styled.div`
  display: grid;
  grid-template-columns: repeat(9, 22px);
  gap: 0;
  border: 3px solid;
  border-color: var(--shell-border-mid) var(--shell-border-light) var(--shell-border-light)
    var(--shell-border-mid);
  background: var(--shell-surface);
`

export const Cell = styled.button<{
  $revealed: boolean
  $flagged: boolean
  $mine: boolean
  $mineHit: boolean
  $adjacent: number
}>`
  box-sizing: border-box;
  width: 22px;
  height: 22px;
  padding: 0;
  margin: 0;
  font: bold 12px/22px var(--font-ui);
  text-align: center;
  ${cursorPointer}

  ${(p) =>
    p.$revealed
      ? css`
          border: 1px solid var(--shell-border-mid);
          background: ${p.$mineHit ? '#f00' : 'var(--shell-surface)'};
          color: ${p.$mine ? 'var(--text-primary)' : p.$adjacent > 0 ? numberColor(p.$adjacent) : 'var(--text-primary)'};
        `
      : css`
          border: 2px outset var(--shell-surface);
          background: var(--shell-surface);
          color: ${p.$flagged ? '#f00' : 'var(--text-primary)'};
          font-weight: ${p.$flagged ? 700 : 'bold'};

          &:active:not(:disabled) {
            border-style: inset;
          }
        `}
`
