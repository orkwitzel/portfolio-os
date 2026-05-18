import styled from 'styled-components'
import { cursorPointer } from '@/styles/cursors'

export const AppBody = styled.div`
  box-sizing: border-box;
  flex: 1;
  display: flex;
  flex-direction: row;
  min-height: 0;
  overflow: hidden;
  background: var(--content-bg);
  color: var(--text-primary);
`

export const NavPane = styled.nav`
  flex: 0 0 140px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--shell-border-mid);
  background: var(--shell-surface);
  padding: 4px;
`

export const NavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`

export const NavItem = styled.li`
  margin: 0;
  padding: 0;
`

export const NavButton = styled.button<{ $active?: boolean }>`
  display: block;
  width: 100%;
  padding: 4px 8px;
  border: none;
  background: ${(p) => (p.$active ? 'var(--menu-highlight)' : 'transparent')};
  font: var(--font-size-ui) var(--font-ui);
  text-align: left;
  color: ${(p) => (p.$active ? 'var(--menu-highlight-text)' : 'inherit')};
  ${cursorPointer}

  &:hover {
    background: ${(p) =>
      p.$active ? 'var(--menu-highlight)' : 'rgba(0, 0, 128, 0.12)'};
  }
`

export const ContentPane = styled.div`
  flex: 1;
  min-width: 0;
  overflow: auto;
  padding: 12px 16px;
  font: var(--font-size-ui) var(--font-ui);
`

export const SectionTitle = styled.h2`
  margin: 0 0 12px;
  font: bold calc(var(--font-size-ui) + 2px) var(--font-ui);
`

export const FieldGroup = styled.fieldset`
  border: none;
  margin: 0 0 16px;
  padding: 0;
`

export const Legend = styled.legend`
  font-weight: bold;
  margin-bottom: 8px;
  padding: 0;
`

export const OptionRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  ${cursorPointer}
`

export const SchemePreview = styled.span<{ $from: string; $to: string }>`
  display: inline-block;
  width: 48px;
  height: 14px;
  flex-shrink: 0;
  border: 1px solid var(--shell-border-dark);
  background: linear-gradient(90deg, ${(p) => p.$from}, ${(p) => p.$to});
`

export const ColorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`

export const HexInput = styled.input`
  width: 88px;
  padding: 2px 4px;
  border: 1px solid var(--shell-border-dark);
  font: var(--font-size-ui) var(--font-ui);
  background: var(--content-bg-alt);
  color: var(--text-primary);
`

export const BrowseBtn = styled.button`
  padding: 2px 10px;
  border-top: 2px solid var(--shell-border-light);
  border-left: 2px solid var(--shell-border-light);
  border-right: 2px solid var(--shell-border-dark);
  border-bottom: 2px solid var(--shell-border-dark);
  background: var(--shell-surface);
  font: var(--font-size-ui) var(--font-ui);
  ${cursorPointer}

  &:disabled {
    opacity: 0.6;
    ${cursorPointer}
  }
`

export const Hint = styled.p`
  margin: 4px 0 0;
  font-size: calc(var(--font-size-ui) - 1px);
  color: var(--text-secondary);
`
