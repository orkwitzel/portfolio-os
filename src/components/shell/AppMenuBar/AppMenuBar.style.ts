import styled from 'styled-components'
import { cursorPointer } from '@/styles/cursors'
import { Divider, Item, ItemLabel, List, Panel } from '@/components/shell/ShellMenu'

export const MenuBar = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: stretch;
  gap: 0;
  padding: 0 2px;
  border-bottom: 1px solid var(--shell-border-mid);
  background: var(--shell-surface);
  user-select: none;
`

export const MenuTopBtn = styled.button<{ $open?: boolean }>`
  margin: 0;
  padding: 2px 8px;
  border: none;
  background: ${(p) => (p.$open ? 'var(--menu-highlight)' : 'transparent')};
  color: ${(p) => (p.$open ? 'var(--menu-highlight-text)' : 'var(--text-primary)')};
  font: var(--font-size-ui) var(--font-ui);
  ${cursorPointer}

  &:hover {
    background: var(--menu-highlight);
    color: var(--menu-highlight-text);
  }
`

export const DropdownPanel = styled(Panel)`
  position: fixed;
  min-width: 200px;
`

export { List, Item, ItemLabel, Divider }

export const ShortcutHint = styled.span`
  margin-left: auto;
  padding-left: 24px;
  opacity: 0.85;
`
