import styled from 'styled-components'

export const Frame = styled.span<{ $compact: boolean }>`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: ${(p) => (p.$compact ? '16px' : '38px')};
  height: ${(p) => (p.$compact ? '16px' : '38px')};
  background: ${(p) => (p.$compact ? 'transparent' : '#c0c0c0')};
  border: ${(p) => (p.$compact ? 'none' : '2px solid #fff')};
  box-shadow: ${(p) =>
    p.$compact ? 'none' : 'inset -2px -2px #404040, inset 2px 2px #fff'};
`

export const NerdGlyph = styled.span`
  font: 14px/1 var(--font-ui);
  color: #000;
`

export const Img = styled.img<{ $desktop: boolean }>`
  display: block;
  width: 16px;
  height: 16px;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
  transform: ${(p) => (p.$desktop ? 'scale(2)' : 'none')};
  transform-origin: center;
`

export const Placeholder = styled.span<{ $compact: boolean }>`
  width: 100%;
  height: 100%;
  background: #c0c0c0;
  box-shadow: ${(p) =>
    p.$compact ? 'inset -1px -1px #404040, inset 1px 1px #fff' : 'none'};
`
