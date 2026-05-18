import styled from 'styled-components'

export const Screen = styled.div`
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;
  background: #000;
`

export const Panel = styled.div`
  max-width: 320px;
  padding: 16px;
  box-sizing: border-box;
  background: var(--shell-surface);
  border-top: 2px solid var(--shell-border-light);
  border-left: 2px solid var(--shell-border-light);
  border-right: 2px solid var(--shell-border-dark);
  border-bottom: 2px solid var(--shell-border-dark);
  box-shadow: 1px 1px 0 #000;
`

export const TitleBar = styled.div`
  margin: -16px -16px 12px;
  padding: 4px 6px;
  background: linear-gradient(
    90deg,
    var(--titlebar-active-from),
    var(--titlebar-active-to)
  );
  color: var(--titlebar-active-text);
  font: bold 12px / 1 var(--font-ui);
`

export const Message = styled.p`
  margin: 0;
  font: var(--font-size-ui) / 1.45 var(--font-ui);
  color: var(--text-primary);
`
