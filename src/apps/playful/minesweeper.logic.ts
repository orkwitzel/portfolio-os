export const BOARD_SIZE = 9
export const MINE_COUNT = 10

export type Cell = {
  mine: boolean
  revealed: boolean
  flagged: boolean
  adjacent: number
}

export type GameStatus = 'playing' | 'won' | 'lost'

export type Board = Cell[][]

function emptyCell(): Cell {
  return { mine: false, revealed: false, flagged: false, adjacent: 0 }
}

export function createEmptyBoard(size = BOARD_SIZE): Board {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, emptyCell),
  )
}

const NEIGHBORS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
] as const

function inBounds(size: number, row: number, col: number): boolean {
  return row >= 0 && row < size && col >= 0 && col < size
}

function forEachNeighbor(
  size: number,
  row: number,
  col: number,
  fn: (r: number, c: number) => void,
): void {
  for (const [dr, dc] of NEIGHBORS) {
    const r = row + dr
    const c = col + dc
    if (inBounds(size, r, c)) fn(r, c)
  }
}

function cloneBoard(board: Board): Board {
  return board.map((row) => row.map((cell) => ({ ...cell })))
}

export function placeMines(
  board: Board,
  mineCount: number,
  safeRow: number,
  safeCol: number,
): Board {
  const size = board.length
  const next = cloneBoard(board)
  const candidates: [number, number][] = []

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (r === safeRow && c === safeCol) continue
      candidates.push([r, c])
    }
  }

  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[candidates[i], candidates[j]] = [candidates[j], candidates[i]]
  }

  for (let i = 0; i < mineCount && i < candidates.length; i++) {
    const [r, c] = candidates[i]
    next[r][c].mine = true
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (next[r][c].mine) continue
      let count = 0
      forEachNeighbor(size, r, c, (nr, nc) => {
        if (next[nr][nc].mine) count++
      })
      next[r][c].adjacent = count
    }
  }

  return next
}

function countHiddenNonMines(board: Board): number {
  let n = 0
  for (const row of board) {
    for (const cell of row) {
      if (!cell.mine && !cell.revealed) n++
    }
  }
  return n
}

function revealCell(board: Board, row: number, col: number): Board {
  const size = board.length
  const next = cloneBoard(board)
  const stack: [number, number][] = [[row, col]]

  while (stack.length > 0) {
    const [r, c] = stack.pop()!
    const cell = next[r][c]
    if (cell.revealed || cell.flagged) continue
    cell.revealed = true
    if (cell.mine) continue
    if (cell.adjacent === 0) {
      forEachNeighbor(size, r, c, (nr, nc) => {
        if (!next[nr][nc].revealed) stack.push([nr, nc])
      })
    }
  }

  return next
}

export function reveal(
  board: Board,
  row: number,
  col: number,
  firstClick: boolean,
): { board: Board; status: GameStatus; firstClick: boolean } {
  const size = board.length
  let next = board
  let seeded = firstClick

  if (firstClick) {
    next = placeMines(createEmptyBoard(size), MINE_COUNT, row, col)
    seeded = false
  }

  const cell = next[row][col]
  if (cell.revealed || cell.flagged) {
    return { board: next, status: 'playing', firstClick: seeded }
  }

  next = revealCell(next, row, col)

  if (next[row][col].mine) {
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (next[r][c].mine) next[r][c].revealed = true
      }
    }
    return { board: next, status: 'lost', firstClick: seeded }
  }

  if (countHiddenNonMines(next) === 0) {
    return { board: next, status: 'won', firstClick: seeded }
  }

  return { board: next, status: 'playing', firstClick: seeded }
}

export function toggleFlag(board: Board, row: number, col: number): Board {
  const next = cloneBoard(board)
  const cell = next[row][col]
  if (cell.revealed) return next
  cell.flagged = !cell.flagged
  return next
}

export function countFlags(board: Board): number {
  let n = 0
  for (const row of board) {
    for (const cell of row) {
      if (cell.flagged) n++
    }
  }
  return n
}

export function newGame(): { board: Board; status: GameStatus; firstClick: boolean } {
  return {
    board: createEmptyBoard(),
    status: 'playing',
    firstClick: true,
  }
}
