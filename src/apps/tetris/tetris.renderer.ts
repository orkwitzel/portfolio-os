import {
  COLS,
  getDisplayGrid,
  getPreviewCells,
  HIDDEN_ROWS,
  LINE_CLEAR_MS,
  LOCK_PULSE_MS,
  PIECE_COLORS,
  VISIBLE_ROWS,
  type CellVariant,
  type PieceKind,
  type TetrisState,
} from '@/apps/tetris/tetris.logic'
import { getCssVar } from '@/theme/getThemeColors'

export const CELL = 22
export const PREVIEW_CELL = 18
const BEVEL = 3
const GAP = 12
const SIDEBAR_W = 88

export const BOARD_PX_W = COLS * CELL
export const BOARD_PX_H = VISIBLE_ROWS * CELL
export const CANVAS_W = BEVEL * 2 + BOARD_PX_W + GAP + SIDEBAR_W
export const CANVAS_H = BEVEL * 2 + BOARD_PX_H

/** HTML sidebar width (controls + restart) beside the canvas. */
export const SIDE_RAIL_W = 124
export const LAYOUT_W = CANVAS_W + 12 + SIDE_RAIL_W

const PREVIEW_PX = PREVIEW_CELL * 4

export type DrawContext = {
  state: TetrisState
  now: number
  clearAnimStart: number | null
  lockAnimStart: number | null
}

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

function drawPlayfieldBorder(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  ctx.fillStyle = '#000'
  ctx.fillRect(x, y, w, h)
  ctx.strokeStyle = getCssVar('--shell-border-mid', '#808080')
  ctx.lineWidth = BEVEL
  ctx.strokeRect(x + BEVEL / 2, y + BEVEL / 2, w - BEVEL, h - BEVEL)
  ctx.strokeStyle = getCssVar('--shell-border-light', '#ffffff')
  ctx.beginPath()
  ctx.moveTo(x, y + h)
  ctx.lineTo(x, y)
  ctx.lineTo(x + w, y)
  ctx.stroke()
}

function drawBlock(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  kind: PieceKind,
  variant: CellVariant,
  opts?: { collapse?: number; flash?: boolean },
) {
  const pad = 1
  const w = size - pad * 2
  const h = size - pad * 2
  let by = y + pad
  let bh = h

  if (opts?.collapse && opts.collapse > 0) {
    const scale = 1 - opts.collapse * 0.85
    bh = h * scale
    by = y + pad + (h - bh)
  }

  if (variant === 'ghost') {
    ctx.fillStyle = hexToRgba(PIECE_COLORS[kind], 0.72)
    ctx.fillRect(x + pad, by, w, bh)
    ctx.strokeStyle = PIECE_COLORS[kind]
    ctx.lineWidth = 2
    ctx.setLineDash([3, 2])
    ctx.strokeRect(x + pad + 1, by + 1, w - 2, bh - 2)
    ctx.setLineDash([])
    ctx.fillStyle = 'rgba(255,255,255,0.35)'
    ctx.fillRect(x + pad + 2, by + 2, w - 4, Math.max(2, bh * 0.25))
    return
  }

  let fill = PIECE_COLORS[kind]
  if (opts?.flash) {
    fill = '#fff'
  } else if (variant === 'active') {
    ctx.globalAlpha = 0.92
  }

  ctx.fillStyle = fill
  ctx.fillRect(x + pad, by, w, bh)
  ctx.strokeStyle = 'rgba(0,0,0,0.35)'
  ctx.lineWidth = 1
  ctx.strokeRect(x + pad + 0.5, by + 0.5, w - 1, bh - 1)

  if (variant === 'active' || variant === 'board') {
    ctx.fillStyle = 'rgba(255,255,255,0.28)'
    ctx.fillRect(x + pad + 1, by + 1, w - 2, Math.max(2, bh * 0.22))
  }

  ctx.globalAlpha = 1
}

function lineClearAnim(now: number, clearAnimStart: number | null) {
  if (!clearAnimStart) return { flash: false, collapse: 0 }
  const elapsed = now - clearAnimStart
  const flash = elapsed < 360 && Math.floor(elapsed / 90) % 2 === 0
  const collapse =
    elapsed > 360 ? Math.min(1, (elapsed - 360) / (LINE_CLEAR_MS - 360)) : 0
  return { flash, collapse }
}

function lockAnimBrightness(now: number, lockAnimStart: number | null): number {
  if (!lockAnimStart) return 1
  const elapsed = now - lockAnimStart
  if (elapsed >= LOCK_PULSE_MS) return 1
  const t = 1 - elapsed / LOCK_PULSE_MS
  return 1 + 0.35 * Math.sin(t * Math.PI)
}

function drawPreview(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  kind: PieceKind | null,
  dimmed: boolean,
) {
  ctx.fillStyle = '#000'
  ctx.fillRect(x, y, PREVIEW_PX, PREVIEW_PX)
  ctx.strokeStyle = '#808080'
  ctx.lineWidth = 1
  ctx.strokeRect(x + 0.5, y + 0.5, PREVIEW_PX - 1, PREVIEW_PX - 1)

  if (!kind) return

  const cells = getPreviewCells(kind)
  for (const [r, c] of cells) {
    if (dimmed) ctx.globalAlpha = 0.55
    drawBlock(ctx, x + c * PREVIEW_CELL, y + r * PREVIEW_CELL, PREVIEW_CELL, kind, 'board')
    ctx.globalAlpha = 1
  }
}

export function drawTetris(canvas: HTMLCanvasElement, frame: DrawContext): void {
  const dpr = window.devicePixelRatio || 1
  const cssW = CANVAS_W
  const cssH = CANVAS_H

  if (canvas.width !== cssW * dpr || canvas.height !== cssH * dpr) {
    canvas.width = cssW * dpr
    canvas.height = cssH * dpr
    canvas.style.width = `${cssW}px`
    canvas.style.height = `${cssH}px`
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, cssW, cssH)

  const { state, now, clearAnimStart, lockAnimStart } = frame
  const boardX = BEVEL
  const boardY = BEVEL
  const grid = getDisplayGrid(state)
  const { flash, collapse } = lineClearAnim(now, clearAnimStart)
  const brightness = lockAnimBrightness(now, lockAnimStart)

  if (brightness > 1) {
    ctx.save()
    ctx.filter = `brightness(${brightness})`
  }

  drawPlayfieldBorder(ctx, 0, 0, BEVEL * 2 + BOARD_PX_W, BEVEL * 2 + BOARD_PX_H)

  for (let vr = 0; vr < VISIBLE_ROWS; vr++) {
    const boardRow = HIDDEN_ROWS + vr
    for (let col = 0; col < COLS; col++) {
      const cell = grid[boardRow]?.[col]
      if (!cell?.kind) continue

      const px = boardX + col * CELL
      const py = boardY + vr * CELL
      const isClearing = cell.variant === 'clearing'

      drawBlock(ctx, px, py, CELL, cell.kind, cell.variant, {
        flash: isClearing && flash,
        collapse: isClearing ? collapse : 0,
      })
    }
  }

  if (brightness > 1) {
    ctx.restore()
  }

  const sideX = BEVEL * 2 + BOARD_PX_W + GAP
  let sideY = BEVEL

  ctx.fillStyle = '#000'
  ctx.font = '700 13px var(--font-ui), sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('HOLD', sideX + SIDEBAR_W / 2, sideY + 12)
  sideY += 18

  const holdBoxY = sideY
  drawPreview(
    ctx,
    sideX + (SIDEBAR_W - PREVIEW_PX) / 2,
    holdBoxY,
    state.holdPiece,
    !state.canHold,
  )
  sideY += PREVIEW_PX + 14

  ctx.fillStyle = '#000'
  ctx.fillText('NEXT', sideX + SIDEBAR_W / 2, sideY + 12)
  sideY += 18
  drawPreview(
    ctx,
    sideX + (SIDEBAR_W - PREVIEW_PX) / 2,
    sideY,
    state.nextPiece,
    false,
  )

  if (state.phase === 'paused') {
    ctx.fillStyle = 'rgba(0,0,0,0.55)'
    ctx.fillRect(boardX, boardY, BOARD_PX_W, BOARD_PX_H)
    ctx.fillStyle = '#fff'
    ctx.font = '700 16px var(--font-ui), sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('PAUSED', boardX + BOARD_PX_W / 2, boardY + BOARD_PX_H / 2)
  }

  if (state.phase === 'gameOver') {
    ctx.fillStyle = 'rgba(0,0,0,0.65)'
    ctx.fillRect(boardX, boardY, BOARD_PX_W, BOARD_PX_H)
    ctx.fillStyle = '#f00'
    ctx.font = '700 14px var(--font-ui), sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('GAME OVER', boardX + BOARD_PX_W / 2, boardY + BOARD_PX_H / 2 - 8)
    ctx.fillStyle = '#fff'
    ctx.font = '12px var(--font-ui), sans-serif'
    ctx.fillText('Enter / R — restart', boardX + BOARD_PX_W / 2, boardY + BOARD_PX_H / 2 + 12)
  }
}
