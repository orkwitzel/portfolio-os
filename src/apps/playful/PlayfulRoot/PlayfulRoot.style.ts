import styled, { css } from 'styled-components'

const numberColor = (n: number) => {
  const colors = ['', '#0000ff', '#008000', '#ff0000', '#000080', '#800000', '#008080', '#000', '#808080']
  return colors[n] ?? '#000'
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
  color: #000;
  user-select: none;
`

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 100%;
  padding: 4px 6px;
  border: 2px inset #c0c0c0;
  background: #c0c0c0;
`

export const Counter = styled.span`
  box-sizing: border-box;
  min-width: 36px;
  padding: 2px 4px;
  border: 2px inset #c0c0c0;
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
  border: 2px outset #c0c0c0;
  background: #c0c0c0;
  font: 14px/1 var(--font-ui);
  cursor: default;

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
  border-color: #808080 #fff #fff #808080;
  background: #c0c0c0;
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
  cursor: default;

  ${(p) =>
    p.$revealed
      ? css`
          border: 1px solid #808080;
          background: ${p.$mineHit ? '#f00' : '#c0c0c0'};
          color: ${p.$mine ? '#000' : p.$adjacent > 0 ? numberColor(p.$adjacent) : '#000'};
        `
      : css`
          border: 2px outset #c0c0c0;
          background: #c0c0c0;
          color: ${p.$flagged ? '#f00' : '#000'};
          font-weight: ${p.$flagged ? 700 : 'bold'};

          &:active:not(:disabled) {
            border-style: inset;
          }
        `}
`
