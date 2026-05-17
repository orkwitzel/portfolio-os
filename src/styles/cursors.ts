/**
 * Win98 cursor values with Vite-resolved asset URLs.
 * Do not use CSS custom properties for cursor — browsers ignore url() cursors via var().
 */
import arrow from '@/content/cursors/win98/arrow.png'
import pointer from '@/content/cursors/win98/pointer.png'
import text from '@/content/cursors/win98/text.png'
import move from '@/content/cursors/win98/move.png'
import ewResize from '@/content/cursors/win98/ew-resize.png'
import nsResize from '@/content/cursors/win98/ns-resize.png'
import nwseResize from '@/content/cursors/win98/nwse-resize.png'
import neswResize from '@/content/cursors/win98/nesw-resize.png'
import notAllowed from '@/content/cursors/win98/not-allowed.png'

export const cursors = {
  default: `url("${arrow}") 0 0, default`,
  pointer: `url("${pointer}") 3 0, pointer`,
  text: `url("${text}") 4 9, text`,
  move: `url("${move}") 16 16, move`,
  ewResize: `url("${ewResize}") 16 16, ew-resize`,
  nsResize: `url("${nsResize}") 16 16, ns-resize`,
  nwseResize: `url("${nwseResize}") 16 16, nwse-resize`,
  neswResize: `url("${neswResize}") 16 16, nesw-resize`,
  notAllowed: `url("${notAllowed}") 16 16, not-allowed`,
} as const
