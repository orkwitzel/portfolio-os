import styled from 'styled-components'

export const RESUME_URL = '/resume.pdf'

export const AppBody = styled.div`
  box-sizing: border-box;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 2px;
  gap: 2px;
`

export const Toolbar = styled.div`
  display: flex;
  flex-shrink: 0;
  gap: 4px;
  padding: 4px;
  border: 2px inset #c0c0c0;
  background: #c0c0c0;
`

export const ToolbarBtn = styled.button`
  box-sizing: border-box;
  padding: 2px 10px;
  border: 2px outset #c0c0c0;
  background: #c0c0c0;
  font: var(--font-size-ui) var(--font-ui);
  color: #000;
  cursor: default;

  &:active {
    border-style: inset;
  }
`

export const ToolbarLink = styled.a`
  box-sizing: border-box;
  padding: 2px 10px;
  border: 2px outset #c0c0c0;
  background: #c0c0c0;
  font: var(--font-size-ui) var(--font-ui);
  color: #000;
  cursor: default;
  text-decoration: none;

  &:active {
    border-style: inset;
  }
`

export const PdfFrame = styled.iframe`
  flex: 1;
  min-height: 0;
  width: 100%;
  border: 2px inset #c0c0c0;
  background: #808080;
`
