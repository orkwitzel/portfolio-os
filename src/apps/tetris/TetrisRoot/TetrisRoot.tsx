import type { AppProps } from '@/store/session/sessionTypes'
import { useTetrisRoot } from './TetrisRoot.logic'
import {
  AppBody,
  Controls,
  ControlsPanel,
  ControlsTitle,
  Counter,
  GameCanvas,
  Header,
  PlayRow,
  RestartBtn,
  SideRail,
  StatusText,
} from './TetrisRoot.style'

export default function TetrisRoot(props: AppProps) {
  const { bodyRef, canvasRef, focusBody, ...vm } = useTetrisRoot(props)

  return (
    <AppBody
      ref={bodyRef}
      tabIndex={0}
      onPointerDown={focusBody}
      aria-label="Tetris"
    >
      <Header>
        <Counter aria-label="Score">{String(vm.state.score).padStart(6, '0')}</Counter>
        <Counter aria-label="Level">{String(vm.state.level).padStart(2, '0')}</Counter>
        <Counter aria-label="Lines">{String(vm.state.lines).padStart(3, '0')}</Counter>
      </Header>

      {vm.message ? <StatusText>{vm.message}</StatusText> : null}

      <PlayRow>
        <GameCanvas
          ref={canvasRef}
          role="img"
          aria-label="Tetris playfield with hold and next previews"
        />

        <SideRail>
          <ControlsPanel>
            <ControlsTitle>Controls</ControlsTitle>
            <Controls>
              <div>
                <kbd>←</kbd> <kbd>→</kbd> move
              </div>
              <div>
                <kbd>↑</kbd> <kbd>X</kbd> rotate
              </div>
              <div>
                <kbd>↓</kbd> soft drop
              </div>
              <div>
                <kbd>Space</kbd> hard drop
              </div>
              <div>
                <kbd>C</kbd> <kbd>Shift</kbd> hold
              </div>
              <div>
                <kbd>P</kbd> pause
              </div>
            </Controls>
          </ControlsPanel>

          <RestartBtn type="button" onClick={vm.restart}>
            New game
          </RestartBtn>
        </SideRail>
      </PlayRow>
    </AppBody>
  )
}
