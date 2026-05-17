import { useCallback, useState } from 'react'
import type { AppProps } from '@/store/session/sessionTypes'
import {
  countFlags,
  MINE_COUNT,
  newGame,
  reveal,
  toggleFlag,
  type Board,
  type GameStatus,
} from '@/apps/playful/minesweeper.logic'

export function faceForStatus(status: GameStatus): string {
  if (status === 'won') return '😎'
  if (status === 'lost') return '😵'
  return '🙂'
}

export function statusMessage(status: GameStatus): string | null {
  if (status === 'won') return 'You win!'
  if (status === 'lost') return 'Boom — try again.'
  return null
}

export function usePlayfulRoot(props: AppProps) {
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

  return {
    board,
    status,
    restart,
    onReveal,
    onFlag,
    minesLeft,
    message,
    face: faceForStatus(status),
  }
}
