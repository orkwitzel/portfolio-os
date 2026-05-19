import styled from 'styled-components'

export const AppBody = styled.div`
  box-sizing: border-box;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: var(--content-bg);
`

export const NotepadField = styled.textarea<{ $wordWrap?: boolean }>`
  flex: 1;
  box-sizing: border-box;
  margin: 2px;
  border: 2px inset var(--inset-border);
  padding: 6px;
  font: var(--font-size-ui) / 1.35 var(--font-ui);
  resize: none;
  outline: none;
  background: var(--content-bg-alt);
  color: var(--text-primary);
  min-height: 0;
  white-space: ${(p) => (p.$wordWrap ? 'pre-wrap' : 'pre')};
  overflow: ${(p) => (p.$wordWrap ? 'auto' : 'auto')};
  overflow-x: ${(p) => (p.$wordWrap ? 'hidden' : 'auto')};
`
