import styled from 'styled-components'
import { cursors } from '@/styles/cursors'

export const MODAL_Z = 27000

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${MODAL_Z};
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
`

export const Dialog = styled.div`
  box-sizing: border-box;
  min-width: 280px;
  max-width: min(420px, calc(100vw - 24px));
  background: #c0c0c0;
  border-top: 2px solid #fff;
  border-left: 2px solid #fff;
  border-right: 2px solid #404040;
  border-bottom: 2px solid #404040;
  box-shadow:
    1px 1px 0 #000,
    0 8px 24px rgba(0, 0, 0, 0.25);
`

export const TitleBar = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  height: 24px;
  padding: 2px 3px;
  background: linear-gradient(90deg, #000080, #1084d0);
  color: #fff;
  user-select: none;
`

export const TitleText = styled.span`
  flex: 1;
  font: bold 12px / 1 var(--font-ui);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const TitleClose = styled.button`
  width: 18px;
  height: 16px;
  padding: 0;
  box-sizing: border-box;
  border-top: 2px solid #fff;
  border-left: 2px solid #fff;
  border-right: 2px solid #404040;
  border-bottom: 2px solid #404040;
  background: #c0c0c0;
  font: 12px / 1 var(--font-ui);
  color: #000;
  cursor: ${cursors.pointer};

  &:active {
    border-top: 2px solid #404040;
    border-left: 2px solid #404040;
    border-right: 2px solid #fff;
    border-bottom: 2px solid #fff;
  }
`

export const Body = styled.div`
  padding: 12px;
`

export const MessageRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
`

export const MessageIcon = styled.div`
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font: bold 22px / 1 var(--font-ui);
  color: #000;
`

export const MessageText = styled.p`
  margin: 0;
  flex: 1;
  font: var(--font-size-ui) / 1.35 var(--font-ui);
  color: #000;
`

export const PromptField = styled.input`
  display: block;
  width: 100%;
  margin-top: 8px;
  box-sizing: border-box;
  padding: 3px 4px;
  border: 2px inset #c0c0c0;
  background: #fff;
  font: var(--font-size-ui) var(--font-ui);
  color: #000;
`

export const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 0 12px 12px;
`

export const DialogBtn = styled.button<{ $default?: boolean }>`
  min-width: 75px;
  padding: 4px 12px;
  box-sizing: border-box;
  border-top: 2px solid #fff;
  border-left: 2px solid #fff;
  border-right: 2px solid #404040;
  border-bottom: 2px solid #404040;
  background: #c0c0c0;
  font: var(--font-size-ui) var(--font-ui);
  cursor: ${cursors.pointer};
  outline: ${(p) => (p.$default ? '1px dotted #000' : 'none')};
  outline-offset: -4px;

  &:active {
    border-top: 2px solid #404040;
    border-left: 2px solid #404040;
    border-right: 2px solid #fff;
    border-bottom: 2px solid #fff;
  }
`

export const TabRow = styled.div`
  display: flex;
  gap: 2px;
  padding: 8px 8px 0;
`

export const Tab = styled.button<{ $active?: boolean }>`
  padding: 4px 10px;
  border: 2px solid #808080;
  border-bottom: ${(p) => (p.$active ? '2px solid #c0c0c0' : '2px solid #808080')};
  margin-bottom: ${(p) => (p.$active ? '-2px' : '0')};
  background: ${(p) => (p.$active ? '#c0c0c0' : '#b5b5b5')};
  font: var(--font-size-ui) var(--font-ui);
  cursor: ${cursors.default};
  position: relative;
  z-index: ${(p) => (p.$active ? 1 : 0)};
`

export const TabPanel = styled.div`
  margin: 0 8px;
  padding: 12px;
  border: 2px inset #c0c0c0;
  background: #c0c0c0;
`

export const PropertiesHeader = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
`

export const PropertiesIcon = styled.div`
  width: 32px;
  height: 32px;
  flex-shrink: 0;
`

export const PropertiesName = styled.input`
  flex: 1;
  min-width: 0;
  box-sizing: border-box;
  padding: 3px 4px;
  border: 2px inset #c0c0c0;
  background: #fff;
  font: var(--font-size-ui) var(--font-ui);
  color: #000;
`

export const FieldGrid = styled.dl`
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 6px 8px;
  margin: 0;
  font: var(--font-size-ui) / 1.3 var(--font-ui);
`

export const FieldLabel = styled.dt`
  margin: 0;
  color: #000;
`

export const FieldValue = styled.dd`
  margin: 0;
  color: #000;
  word-break: break-word;
`
