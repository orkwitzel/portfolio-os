import styled from 'styled-components'
import { cursorPointer } from '@/styles/cursors'

export const MODAL_Z = 27000

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${MODAL_Z};
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.15);
`

export const Dialog = styled.div`
  box-sizing: border-box;
  min-width: 280px;
  max-width: min(420px, calc(100vw - 24px));
  background: var(--shell-surface);
  border-top: 2px solid var(--shell-border-light);
  border-left: 2px solid var(--shell-border-light);
  border-right: 2px solid var(--shell-border-dark);
  border-bottom: 2px solid var(--shell-border-dark);
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
  background: linear-gradient(
    90deg,
    var(--titlebar-active-from),
    var(--titlebar-active-to)
  );
  color: var(--titlebar-active-text);
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
  border-top: 2px solid var(--shell-border-light);
  border-left: 2px solid var(--shell-border-light);
  border-right: 2px solid var(--shell-border-dark);
  border-bottom: 2px solid var(--shell-border-dark);
  background: var(--shell-surface);
  font: 12px / 1 var(--font-ui);
  color: var(--text-primary);
  ${cursorPointer}

  &:active {
    border-top: 2px solid var(--shell-border-dark);
    border-left: 2px solid var(--shell-border-dark);
    border-right: 2px solid var(--shell-border-light);
    border-bottom: 2px solid var(--shell-border-light);
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
  color: var(--text-primary);
`

export const MessageText = styled.p`
  margin: 0;
  flex: 1;
  font: var(--font-size-ui) / 1.35 var(--font-ui);
  color: var(--text-primary);
`

export const PromptField = styled.input`
  display: block;
  width: 100%;
  margin-top: 8px;
  box-sizing: border-box;
  padding: 3px 4px;
  border: 2px inset var(--inset-border);
  background: var(--content-bg-alt);
  font: var(--font-size-ui) var(--font-ui);
  color: var(--text-primary);
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
  border-top: 2px solid var(--shell-border-light);
  border-left: 2px solid var(--shell-border-light);
  border-right: 2px solid var(--shell-border-dark);
  border-bottom: 2px solid var(--shell-border-dark);
  background: var(--shell-surface);
  font: var(--font-size-ui) var(--font-ui);
  color: var(--text-primary);
  ${cursorPointer}
  outline: ${(p) => (p.$default ? '1px dotted var(--text-primary)' : 'none')};
  outline-offset: -4px;

  &:active {
    border-top: 2px solid var(--shell-border-dark);
    border-left: 2px solid var(--shell-border-dark);
    border-right: 2px solid var(--shell-border-light);
    border-bottom: 2px solid var(--shell-border-light);
  }
`

export const TabRow = styled.div`
  display: flex;
  gap: 2px;
  padding: 8px 8px 0;
`

export const Tab = styled.button<{ $active?: boolean }>`
  padding: 4px 10px;
  border: 2px solid var(--shell-border-mid);
  border-bottom: ${(p) =>
    p.$active ? '2px solid var(--shell-surface)' : '2px solid var(--shell-border-mid)'};
  margin-bottom: ${(p) => (p.$active ? '-2px' : '0')};
  background: ${(p) => (p.$active ? 'var(--shell-surface)' : 'var(--titlebar-inactive-to)')};
  font: var(--font-size-ui) var(--font-ui);
  color: var(--text-primary);
  ${cursorPointer}
  position: relative;
  z-index: ${(p) => (p.$active ? 1 : 0)};
`

export const TabPanel = styled.div`
  margin: 0 8px;
  padding: 12px;
  border: 2px inset var(--inset-border);
  background: var(--content-bg);
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
  border: 2px inset var(--inset-border);
  background: var(--content-bg-alt);
  font: var(--font-size-ui) var(--font-ui);
  color: var(--text-primary);
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
  color: var(--text-primary);
`

export const FieldValue = styled.dd`
  margin: 0;
  color: var(--text-primary);
  word-break: break-word;
`
