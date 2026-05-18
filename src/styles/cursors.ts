/**
 * Windows XP cursor values with Vite-resolved asset URLs.
 * Cursors from bartekl1/windows-ui-assets (extracted from Windows XP).
 * Do not use CSS custom properties for cursor — browsers ignore url() cursors via var().
 */
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

export const cursors = {
  default: `url("${arrow}") 1 1, default`,
  pointer: `url("${pointer}") 9 1, pointer`,
  text: `url("${text}") 5 11, text`,
  move: `url("${move}") 11 11, move`,
  ewResize: `url("${ewResize}") 12 7, ew-resize`,
  nsResize: `url("${nsResize}") 6 11, ns-resize`,
  nwseResize: `url("${nwseResize}") 9 9, nwse-resize`,
  neswResize: `url("${neswResize}") 9 9, nesw-resize`,
  notAllowed: `url("${notAllowed}") 12 11, not-allowed`,
  wait: `url("${wait}") 8 11, wait`,
} as const
