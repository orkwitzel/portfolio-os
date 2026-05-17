import styled from 'styled-components'

export const Frame = styled.span<{ $menu: boolean }>`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: ${(p) => (p.$menu ? '16px' : '38px')};
  height: ${(p) => (p.$menu ? '16px' : '38px')};
  background: ${(p) => (p.$menu ? 'transparent' : '#c0c0c0')};
  border: ${(p) => (p.$menu ? 'none' : '2px solid #fff')};
  box-shadow: ${(p) =>
    p.$menu ? 'none' : 'inset -2px -2px #404040, inset 2px 2px #fff'};
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

export const Placeholder = styled.span<{ $menu: boolean }>`
  width: 100%;
  height: 100%;
  background: #c0c0c0;
  box-shadow: ${(p) =>
    p.$menu ? 'inset -1px -1px #404040, inset 1px 1px #fff' : 'none'};
`
