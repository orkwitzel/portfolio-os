import { useCallback, useState } from 'react'
import type { AppProps } from '../../desktop/sessionTypes'
import {
  countFlags,
  MINE_COUNT,
  newGame,
  reveal,
  toggleFlag,
  type Board,
  type GameStatus,
} from './minesweeper'
import styles from './playful.module.css'

const NUMBER_CLASS: Record<number, string> = {
  1: styles.n1,
  2: styles.n2,
  3: styles.n3,
  4: styles.n4,
  5: styles.n5,
  6: styles.n6,
  7: styles.n7,
  8: styles.n8,
}

function faceForStatus(status: GameStatus): string {
  if (status === 'won') return '😎'
  if (status === 'lost') return '😵'
  return '🙂'
}

function statusMessage(status: GameStatus): string | null {
  if (status === 'won') return 'You win!'
  if (status === 'lost') return 'Boom — try again.'
  return null
}

export function PlayfulRoot(props: AppProps) {
  void props.windowId

  const [board, setBoard] = useState<Board>(() => newGame().board)
  const [status, setStatus] = useState<GameStatus>('playing')
  const [firstClick, setFirstClick] = useState(true)

  const restart = useCallback(() => {
    const g = newGame()
    setBoard(g.board)
    setStatus(g.status)
    setFirstClick(g.firstClick)
  }, [])

  const onReveal = (row: number, col: number) => {
    if (status !== 'playing') return
    const result = reveal(board, row, col, firstClick)
    setBoard(result.board)
    setStatus(result.status)
    setFirstClick(result.firstClick)
  }

  const onFlag = (row: number, col: number) => {
    if (status !== 'playing') return
    setBoard(toggleFlag(board, row, col))
  }

  const minesLeft = Math.max(0, MINE_COUNT - countFlags(board))
  const message = statusMessage(status)

  return (
    <div className={styles.appBody}>
      <header className={styles.header}>
        <span className={styles.counter} aria-label="Mines remaining">
          {String(minesLeft).padStart(2, '0')}
        </span>
        <button
          type="button"
          className={styles.faceBtn}
          onClick={restart}
          aria-label="New game"
        >
          {faceForStatus(status)}
        </button>
        <span className={styles.counter} aria-hidden>
          00
        </span>
      </header>

      {message ? <p className={styles.statusText}>{message}</p> : null}

      <div
        className={styles.board}
        role="grid"
        aria-label="Minesweeper board"
        onContextMenu={(e) => e.preventDefault()}
      >
        {board.map((row, r) =>
          row.map((cell, c) => {
            const key = `${r}-${c}`
            const revealed = cell.revealed
            const classes = [styles.cell]

            if (revealed) {
              classes.push(styles.cellRevealed)
              if (cell.mine) {
                classes.push(styles.cellMine)
                if (status === 'lost') classes.push(styles.cellMineHit)
              } else if (cell.adjacent > 0) {
                classes.push(NUMBER_CLASS[cell.adjacent] ?? '')
              }
            } else if (cell.flagged) {
              classes.push(styles.cellFlagged)
            }

            let label = ''
            if (revealed) {
              if (cell.mine) label = '💣'
              else if (cell.adjacent > 0) label = String(cell.adjacent)
            } else if (cell.flagged) {
              label = '🚩'
            }

            return (
              <button
                key={key}
                type="button"
                className={classes.filter(Boolean).join(' ')}
                disabled={revealed || status !== 'playing'}
                aria-label={`Row ${r + 1} column ${c + 1}`}
                onClick={() => onReveal(r, c)}
                onContextMenu={(e) => {
                  e.preventDefault()
                  onFlag(r, c)
                }}
              >
                {label}
              </button>
            )
          }),
        )}
      </div>
    </div>
  )
}
