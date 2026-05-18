/**
 * Windows XP cursor values with Vite-resolved asset URLs.
 * Do not use CSS custom properties for cursor — browsers ignore url() cursors via var().
 */
import { css } from 'styled-components'
import arrow from '@/content/cursors/winxp/arrow.png'
import pointer from '@/content/cursors/winxp/pointer.png'
import text from '@/content/cursors/winxp/text.png'
import move from '@/content/cursors/winxp/move.png'
import ewResize from '@/content/cursors/winxp/ew-resize.png'
import nsResize from '@/content/cursors/winxp/ns-resize.png'
import nwseResize from '@/content/cursors/winxp/nwse-resize.png'
import neswResize from '@/content/cursors/winxp/nesw-resize.png'
import notAllowed from '@/content/cursors/winxp/not-allowed.png'
import wait from '@/content/cursors/winxp/wait.png'

const winxp = {
  default: `url("${arrow}") 1 1, default`,
  pointer: `url("${pointer}") 9 1, pointer`,
  text: `url("${text}") 5 11, text`,
  move: `url("${move}") 11 11, move`,
  ewResize: `url("${ewResize}") 12 7, ew-resize`,
  nsResize: `url("${nsResize}") 6 11, ns-resize`,
  nwseResize: `url("${nwseResize}") 9 9, nw-resize`,
  neswResize: `url("${neswResize}") 9 9, ne-resize`,
  notAllowed: `url("${notAllowed}") 12 11, not-allowed`,
  wait: `url("${wait}") 8 11, wait`,
} as const

const system = {
  default: 'default',
  pointer: 'pointer',
  text: 'text',
  move: 'move',
  ewResize: 'ew-resize',
  nsResize: 'ns-resize',
  nwseResize: 'nwse-resize',
  neswResize: 'nesw-resize',
  notAllowed: 'not-allowed',
  wait: 'wait',
} as const

export type CursorSet = {
  readonly default: string
  readonly pointer: string
  readonly text: string
  readonly move: string
  readonly ewResize: string
  readonly nsResize: string
  readonly nwseResize: string
  readonly neswResize: string
  readonly notAllowed: string
  readonly wait: string
}

/** WinXP asset cursors (default styled-component export). */
export const cursors: CursorSet = winxp

/** Cursor strings for the active mode (reads `data-cursor-mode` on `<html>`). */
export function getCursors(): CursorSet {
  if (
    typeof document !== 'undefined' &&
    document.documentElement.dataset.cursorMode === 'system'
  ) {
    return system
  }
  return winxp
}

function cursorRule(winxpValue: string, systemValue: string) {
  return css`
    html:not([data-cursor-mode='system']) & {
      cursor: ${winxpValue};
    }
    html[data-cursor-mode='system'] & {
      cursor: ${systemValue};
    }
  `
}

export const cursorMove = cursorRule(winxp.move, system.move)
export const cursorPointer = cursorRule(winxp.pointer, system.pointer)
export const cursorEwResize = cursorRule(winxp.ewResize, system.ewResize)
export const cursorNsResize = cursorRule(winxp.nsResize, system.nsResize)
export const cursorNwseResize = cursorRule(winxp.nwseResize, system.nwseResize)
