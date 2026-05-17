import styled from 'styled-components'

export const Bar = styled.div`
  height: 32px;
  flex-shrink: 0;
  background: #c0c0c0;
  border-top: 2px solid #dfdfdf;
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
  border-top: 2px solid ${(p) => (p.$pressed ? '#404040' : '#fff')};
  border-left: 2px solid ${(p) => (p.$pressed ? '#404040' : '#fff')};
  border-right: 2px solid ${(p) => (p.$pressed ? '#fff' : '#404040')};
  border-bottom: 2px solid ${(p) => (p.$pressed ? '#fff' : '#404040')};
  background: #c0c0c0;
  font: var(--font-size-ui) var(--font-ui);
  cursor: default;
  display: inline-flex;
  align-items: center;
  gap: 5px;
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
`

export const TaskBtn = styled.button<{ $active: boolean; $minimized: boolean }>`
  height: 22px;
  min-width: 120px;
  max-width: 200px;
  padding: 0 8px;
  border-top: 2px solid ${(p) => (p.$active ? '#404040' : '#fff')};
  border-left: 2px solid ${(p) => (p.$active ? '#404040' : '#fff')};
  border-right: 2px solid ${(p) => (p.$active ? '#fff' : '#404040')};
  border-bottom: 2px solid ${(p) => (p.$active ? '#fff' : '#404040')};
  background: #c0c0c0;
  font: var(--font-size-ui) var(--font-ui);
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  color: ${(p) => (p.$minimized ? '#404040' : '#000')};
`

export const Tray = styled.div`
  min-width: 72px;
  height: 22px;
  padding: 0 4px;
  box-sizing: border-box;
  border: 2px inset #c0c0c0;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`
