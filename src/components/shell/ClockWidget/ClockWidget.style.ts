import styled from 'styled-components'
import { Panel } from '@/components/shell/ShellMenu'

export const WidgetPanel = styled(Panel)`
  min-width: 200px;
  padding: 8px 12px 10px;
  box-sizing: border-box;
  text-align: center;
`

export const DigitalTime = styled.p`
  margin: 8px 0 4px;
  font: bold var(--font-size-ui) var(--font-ui);
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
`

export const DateLine = styled.p`
  margin: 0 0 6px;
  font: var(--font-size-ui) var(--font-ui);
  color: var(--text-primary);
  line-height: 1.25;
`

export const TimezoneId = styled.p`
  margin: 0;
  font: var(--font-size-ui) var(--font-ui);
  color: var(--text-secondary);
`

export const TimezoneShort = styled.p`
  margin: 2px 0 0;
  font: var(--font-size-ui) var(--font-ui);
  color: var(--text-secondary);
`
