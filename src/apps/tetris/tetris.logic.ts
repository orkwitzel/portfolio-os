export const COLS = 10
export const ROWS = 22
export const VISIBLE_ROWS = 20
/** Hidden buffer rows above the visible playfield (spawn lane). */
export const HIDDEN_ROWS = ROWS - VISIBLE_ROWS

export type PieceKind = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L'
export type Cell = PieceKind | null
export type GamePhase = 'playing' | 'paused' | 'gameOver'

export type ActivePiece = {
  kind: PieceKind
  rotation: number
  row: number
  col: number
}

export type TetrisState = {
  board: Cell[][]
  active: ActivePiece | null
  nextPiece: PieceKind
  holdPiece: PieceKind | null
  canHold: boolean
  bag: PieceKind[]
  score: number
  level: number
  lines: number
  phase: GamePhase
  /** Rows flashing before removal (line-clear animation). */
  clearingRows: number[] | null
  /** Brief pulse when a piece locks without a line clear. */
  lockPulse: boolean
}

const ALL_PIECES: PieceKind[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L']

/** NES NTSC gravity: frames per cell at 60 fps (level 1 = index 0). */
const NES_GRAVITY_FRAMES: number[] = [
  48, 43, 38, 33, 28, 23, 18, 13, 8, 6,
  5, 5, 5,
  4, 4, 4,
  3, 3, 3,
  2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
]

const FRAME_MS = 1000 / 60

/** Relative [row, col] offsets per rotation (0–3). */
const SHAPES: Record<PieceKind, readonly (readonly [number, number])[][]> = {
  I: [
    [[0, 0], [0, 1], [0, 2], [0, 3]],
    [[-1, 2], [0, 2], [1, 2], [2, 2]],
    [[2, 0], [2, 1], [2, 2], [2, 3]],
    [[-1, 1], [0, 1], [1, 1], [2, 1]],
  ],
  O: [
    [[0, 0], [0, 1], [1, 0], [1, 1]],
    [[0, 0], [0, 1], [1, 0], [1, 1]],
    [[0, 0], [0, 1], [1, 0], [1, 1]],
    [[0, 0], [0, 1], [1, 0], [1, 1]],
  ],
  T: [
    [[0, 0], [0, 1], [0, 2], [1, 1]], // up
    [[0, 1], [1, 0], [1, 1], [2, 1]], // right
    [[1, 0], [1, 1], [1, 2], [0, 1]], // down
    [[0, 0], [1, 0], [1, 1], [2, 0]], // left
  ],
  S: [
    [[0, 1], [0, 2], [1, 0], [1, 1]],
    [[0, 1], [1, 1], [1, 2], [2, 2]],
    [[1, 1], [1, 2], [2, 0], [2, 1]],
    [[0, 0], [1, 0], [1, 1], [2, 1]],
  ],
  Z: [
    [[0, 0], [0, 1], [1, 1], [1, 2]],
    [[0, 2], [1, 1], [1, 2], [2, 1]],
    [[1, 0], [1, 1], [2, 1], [2, 2]],
    [[0, 1], [1, 0], [1, 1], [2, 0]],
  ],
  J: [
    [[1, 0], [1, 1], [1, 2], [0, 2]],
    [[0, 1], [1, 1], [2, 1], [2, 2]],
    [[1, 0], [1, 1], [1, 2], [2, 0]],
    [[0, 0], [0, 1], [1, 1], [2, 1]],
  ],
  L: [
    [[1, 0], [1, 1], [1, 2], [0, 0]],
    [[0, 1], [1, 1], [2, 1], [2, 0]],
    [[1, 0], [1, 1], [1, 2], [2, 2]],
    [[0, 2], [0, 1], [1, 1], [2, 1]],
  ],
}

const SPAWN_COL: Record<PieceKind, number> = {
  I: 3,
  O: 4,
  T: 3,
  S: 3,
  Z: 3,
  J: 3,
  L: 3,
}

const LINE_SCORES = [0, 40, 100, 300, 1200] as const

export const PIECE_COLORS: Record<PieceKind, string> = {
  I: '#00f0f0',
  O: '#f0f000',
  T: '#a000f0',
  S: '#00f000',
  Z: '#f00000',
  J: '#0000f0',
  L: '#f0a000',
}

export const LINE_CLEAR_MS = 420
export const LOCK_PULSE_MS = 140

function emptyBoard(): Cell[][] {
  return Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => null))
}

function shuffle<T>(arr: T[]): T[] {
  const next = [...arr]
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}

function refillBag(bag: PieceKind[]): PieceKind[] {
  if (bag.length > 0) return bag
  return shuffle([...ALL_PIECES])
}

function drawFromBag(bag: PieceKind[]): { piece: PieceKind; bag: PieceKind[] } {
  let nextBag = refillBag(bag)
  const piece = nextBag[0]
  nextBag = nextBag.slice(1)
  return { piece, bag: nextBag }
}

export function pieceCells(
  kind: PieceKind,
  rotation: number,
  row: number,
  col: number,
): [number, number][] {
  const shape = SHAPES[kind][rotation % SHAPES[kind].length]
  return shape.map(([r, c]) => [row + r, col + c])
}

export function collides(
  board: Cell[][],
  kind: PieceKind,
  rotation: number,
  row: number,
  col: number,
): boolean {
  for (const [r, c] of pieceCells(kind, rotation, row, col)) {
    if (r < 0 || c < 0 || c >= COLS || r >= ROWS) return true
    if (board[r][c] !== null) return true
  }
  return false
}

function minShapeRow(kind: PieceKind, rotation: number): number {
  return Math.min(...SHAPES[kind][rotation % SHAPES[kind].length].map(([r]) => r))
}

function spawnPiece(kind: PieceKind): ActivePiece {
  const rotation = 0
  return {
    kind,
    rotation,
    row: HIDDEN_ROWS - minShapeRow(kind, rotation),
    col: SPAWN_COL[kind],
  }
}

function canPlay(state: TetrisState): boolean {
  return (
    state.phase === 'playing' &&
    state.active !== null &&
    state.clearingRows === null
  )
}

function levelFromLines(lines: number): number {
  return Math.floor(lines / 10) + 1
}

function scoreForLines(count: number, level: number): number {
  if (count < 1 || count > 4) return 0
  return LINE_SCORES[count] * level
}

function findFullRows(board: Cell[][]): number[] {
  const rows: number[] = []
  for (let r = 0; r < ROWS; r++) {
    if (board[r].every((cell) => cell !== null)) rows.push(r)
  }
  return rows
}

function clearLines(board: Cell[][]): { board: Cell[][]; cleared: number } {
  const remaining: Cell[][] = []
  let cleared = 0

  for (let r = 0; r < ROWS; r++) {
    if (board[r].every((cell) => cell !== null)) {
      cleared++
    } else {
      remaining.push(board[r])
    }
  }

  while (remaining.length < ROWS) {
    remaining.unshift(Array.from({ length: COLS }, () => null))
  }

  return { board: remaining, cleared }
}

function mergeActive(board: Cell[][], active: ActivePiece): Cell[][] {
  const next = board.map((row) => [...row])
  for (const [r, c] of pieceCells(active.kind, active.rotation, active.row, active.col)) {
    if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
      next[r][c] = active.kind
    }
  }
  return next
}

function spawnNext(state: TetrisState, board: Cell[][]): TetrisState {
  const { piece: nextFromBag, bag } = drawFromBag(state.bag)
  const activeNext = spawnPiece(state.nextPiece)

  if (collides(board, activeNext.kind, activeNext.rotation, activeNext.row, activeNext.col)) {
    return {
      ...state,
      board,
      active: null,
      nextPiece: nextFromBag,
      bag,
      phase: 'gameOver',
      clearingRows: null,
      lockPulse: false,
      canHold: false,
    }
  }

  return {
    ...state,
    board,
    active: activeNext,
    nextPiece: nextFromBag,
    bag,
    canHold: true,
    clearingRows: null,
    lockPulse: false,
  }
}

function lockActive(state: TetrisState): TetrisState {
  const active = state.active
  if (!active) return state

  const lockedBoard = mergeActive(state.board, active)
  const fullRows = findFullRows(lockedBoard)

  if (fullRows.length > 0) {
    return {
      ...state,
      board: lockedBoard,
      active: null,
      clearingRows: fullRows,
      lockPulse: false,
      canHold: true,
    }
  }

  return {
    ...spawnNext(
      { ...state, active: null },
      lockedBoard,
    ),
    lockPulse: true,
  }
}

function tryMove(state: TetrisState, dRow: number, dCol: number): TetrisState {
  if (!canPlay(state) || !state.active) return state
  const { kind, rotation, row, col } = state.active
  const nextRow = row + dRow
  const nextCol = col + dCol
  if (collides(state.board, kind, rotation, nextRow, nextCol)) {
    if (dRow > 0) return lockActive(state)
    return state
  }
  return {
    ...state,
    active: { ...state.active, row: nextRow, col: nextCol },
    lockPulse: false,
  }
}

/** NES-style drop interval from level (1-based). */
export function getDropIntervalMs(level: number): number {
  const idx = Math.max(0, Math.min(level - 1, NES_GRAVITY_FRAMES.length - 1))
  const frames = level >= 30 ? 1 : (NES_GRAVITY_FRAMES[idx] ?? 1)
  return frames * FRAME_MS
}

export function newGame(): TetrisState {
  const bag = shuffle([...ALL_PIECES])
  const first = bag[0]
  const rest = bag.slice(1)
  const { piece: nextPiece, bag: nextBag } = drawFromBag(rest)
  const active = spawnPiece(first)

  return {
    board: emptyBoard(),
    active,
    nextPiece,
    holdPiece: null,
    canHold: true,
    bag: nextBag,
    score: 0,
    level: 1,
    lines: 0,
    phase: 'playing',
    clearingRows: null,
    lockPulse: false,
  }
}

export function tick(state: TetrisState): TetrisState {
  if (!canPlay(state)) return state
  return tryMove(state, 1, 0)
}

export function move(state: TetrisState, dx: number): TetrisState {
  if (!canPlay(state)) return state
  return tryMove(state, 0, dx)
}

const ROTATION_KICKS: [number, number][] = [
  [0, 0],
  [0, -1],
  [-1, 0],
  [0, 1],
  [0, -2],
  [-1, -1],
  [0, 2],
  [-1, 1],
  [-2, 0],
]

export function rotate(state: TetrisState): TetrisState {
  if (!canPlay(state) || !state.active) return state
  const { kind, rotation, row, col } = state.active
  const nextRotation = (rotation + 1) % SHAPES[kind].length

  for (const [dRow, dCol] of ROTATION_KICKS) {
    if (!collides(state.board, kind, nextRotation, row + dRow, col + dCol)) {
      return {
        ...state,
        active: {
          ...state.active,
          rotation: nextRotation,
          row: row + dRow,
          col: col + dCol,
        },
        lockPulse: false,
      }
    }
  }
  return state
}

export function softDrop(state: TetrisState): TetrisState {
  if (!canPlay(state) || !state.active) return state
  const { kind, rotation, row, col } = state.active
  if (collides(state.board, kind, rotation, row + 1, col)) {
    return lockActive(state)
  }
  return {
    ...state,
    active: { ...state.active, row: row + 1 },
    score: state.score + 1,
    lockPulse: false,
  }
}

export function hardDrop(state: TetrisState): TetrisState {
  if (!canPlay(state) || !state.active) return state
  let row = state.active.row
  let distance = 0
  while (
    !collides(
      state.board,
      state.active.kind,
      state.active.rotation,
      row + 1,
      state.active.col,
    )
  ) {
    row++
    distance++
  }
  const dropped: TetrisState = {
    ...state,
    active: { ...state.active, row },
  }
  const locked = lockActive(dropped)
  return { ...locked, score: locked.score + distance * 2 }
}

export function hold(state: TetrisState): TetrisState {
  if (!canPlay(state) || !state.canHold || !state.active) return state

  const current = state.active.kind

  if (state.holdPiece === null) {
    const { piece, bag } = drawFromBag(state.bag)
    const active = spawnPiece(state.nextPiece)
    if (collides(state.board, active.kind, active.rotation, active.row, active.col)) {
      return { ...state, phase: 'gameOver', active: null }
    }
    return {
      ...state,
      holdPiece: current,
      active,
      nextPiece: piece,
      bag,
      canHold: false,
      lockPulse: false,
    }
  }

  const swapped = state.holdPiece
  const active = spawnPiece(swapped)
  if (collides(state.board, active.kind, active.rotation, active.row, active.col)) {
    return { ...state, phase: 'gameOver', active: null }
  }
  return {
    ...state,
    holdPiece: current,
    active,
    canHold: false,
    lockPulse: false,
  }
}

/** Complete line-clear animation: remove rows, score, spawn next piece. */
export function finishLineClear(state: TetrisState): TetrisState {
  if (!state.clearingRows?.length) return state

  const { board, cleared } = clearLines(state.board)
  const lines = state.lines + cleared
  const level = levelFromLines(lines)
  const score = state.score + scoreForLines(cleared, state.level)

  return spawnNext(
    {
      ...state,
      score,
      lines,
      level,
    },
    board,
  )
}

export function clearLockPulse(state: TetrisState): TetrisState {
  if (!state.lockPulse) return state
  return { ...state, lockPulse: false }
}

export function togglePause(state: TetrisState): TetrisState {
  if (state.phase === 'gameOver') return state
  if (state.clearingRows) return state
  if (state.phase === 'playing') return { ...state, phase: 'paused' }
  return { ...state, phase: 'playing' }
}

export function getGhostPiece(state: TetrisState): ActivePiece | null {
  if (!state.active || state.phase !== 'playing') return null
  let row = state.active.row
  while (
    !collides(
      state.board,
      state.active.kind,
      state.active.rotation,
      row + 1,
      state.active.col,
    )
  ) {
    row++
  }
  if (row === state.active.row) return null
  return { ...state.active, row }
}

export type CellVariant = 'empty' | 'board' | 'ghost' | 'active' | 'clearing'

export type DisplayCell = {
  kind: PieceKind | null
  variant: CellVariant
}

export function getDisplayGrid(state: TetrisState): DisplayCell[][] {
  const grid: DisplayCell[][] = state.board.map((row) =>
    row.map((kind) => ({ kind, variant: 'board' as const })),
  )

  for (const r of state.clearingRows ?? []) {
    for (let c = 0; c < COLS; c++) {
      if (grid[r][c].kind) {
        grid[r][c] = { ...grid[r][c], variant: 'clearing' }
      }
    }
  }

  const ghost = getGhostPiece(state)
  if (ghost) {
    for (const [r, c] of pieceCells(ghost.kind, ghost.rotation, ghost.row, ghost.col)) {
      if (r >= 0 && r < ROWS && c >= 0 && c < COLS && grid[r][c].kind === null) {
        grid[r][c] = { kind: ghost.kind, variant: 'ghost' }
      }
    }
  }

  if (state.active && state.phase !== 'gameOver') {
    for (const [r, c] of pieceCells(
      state.active.kind,
      state.active.rotation,
      state.active.row,
      state.active.col,
    )) {
      if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
        grid[r][c] = { kind: state.active.kind, variant: 'active' }
      }
    }
  }

  return grid
}

/** Filled cells for piece preview in a 4×4 grid (row, col). */
export function getPreviewCells(kind: PieceKind): [number, number][] {
  const cells = SHAPES[kind][0]
  const minR = Math.min(...cells.map(([r]) => r))
  const minC = Math.min(...cells.map(([, c]) => c))
  const maxR = Math.max(...cells.map(([r]) => r))
  const maxC = Math.max(...cells.map(([, c]) => c))
  const offsetR = Math.floor((4 - (maxR - minR + 1)) / 2) - minR
  const offsetC = Math.floor((4 - (maxC - minC + 1)) / 2) - minC
  return cells.map(([r, c]) => [r + offsetR, c + offsetC])
}
