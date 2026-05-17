import type { AppProps } from '@/store/session/sessionTypes'
import { usePlayfulRoot } from './PlayfulRoot.logic'
import {
  AppBody,
  Board,
  Cell,
  Counter,
  FaceBtn,
  Header,
  StatusText,
} from './PlayfulRoot.style'

export default function PlayfulRoot(props: AppProps) {
  const vm = usePlayfulRoot(props)

  return (
    <AppBody>
      <Header>
        <Counter aria-label="Mines remaining">
          {String(vm.minesLeft).padStart(2, '0')}
        </Counter>
        <FaceBtn type="button" onClick={vm.restart} aria-label="New game">
          {vm.face}
        </FaceBtn>
        <Counter aria-hidden>00</Counter>
      </Header>

      {vm.message ? <StatusText>{vm.message}</StatusText> : null}

      <Board
        role="grid"
        aria-label="Minesweeper board"
        data-minesweeper-board
        onContextMenu={(e) => e.preventDefault()}
      >
        {vm.board.map((row, r) =>
          row.map((cell, c) => {
            const revealed = cell.revealed
            let label = ''
            if (revealed) {
              if (cell.mine) label = '💣'
              else if (cell.adjacent > 0) label = String(cell.adjacent)
            } else if (cell.flagged) {
              label = '🚩'
            }

            return (
              <Cell
                key={`${r}-${c}`}
                type="button"
                $revealed={revealed}
                $flagged={cell.flagged}
                $mine={cell.mine}
                $mineHit={revealed && cell.mine && vm.status === 'lost'}
                $adjacent={cell.adjacent}
                disabled={revealed || vm.status !== 'playing'}
                aria-label={`Row ${r + 1} column ${c + 1}`}
                onClick={() => vm.onReveal(r, c)}
                onContextMenu={(e) => {
                  e.preventDefault()
                  vm.onFlag(r, c)
                }}
              >
                {label}
              </Cell>
            )
          }),
        )}
      </Board>
    </AppBody>
  )
}
