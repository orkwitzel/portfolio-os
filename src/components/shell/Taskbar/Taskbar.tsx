import { StartMenu, START_MENU_ID } from '@/components/shell/StartMenu'
import { TrayClock } from '@/components/shell/TrayClock'
import { nerd } from '@/utils/nerdIcons'
import { useTaskbar, type TaskbarProps } from './Taskbar.logic'
import { Bar, StartBtn, StartIcon, StartLabel, TaskBtn, Tasks, Tray } from './Taskbar.style'

export function Taskbar(props: TaskbarProps) {
  const {
    wm,
    session,
    startRef,
    startButtonId,
    startMenuOpen,
    toggleStart,
    closeStart,
  } = useTaskbar(props)

  return (
    <Bar>
      <StartBtn
        ref={startRef}
        id={startButtonId}
        type="button"
        $pressed={startMenuOpen}
        aria-label="Start"
        aria-haspopup="menu"
        aria-expanded={startMenuOpen}
        aria-controls={startMenuOpen ? START_MENU_ID : undefined}
        onClick={toggleStart}
      >
        <StartIcon aria-hidden>{nerd.windowsClassic}</StartIcon>
        <StartLabel>Start</StartLabel>
      </StartBtn>
      <StartMenu
        open={startMenuOpen}
        onClose={closeStart}
        anchorRef={startRef}
        startButtonId={startButtonId}
      />
      <Tasks>
        {session.order.map((id) => {
          const w = session.windows[id]
          if (!w) return null

          const minimized = w.geometry.mode === 'minimized'
          const active = session.focusedWindowId === w.id && !minimized

          return (
            <TaskBtn
              key={id}
              type="button"
              $active={active}
              $minimized={minimized}
              onClick={() => {
                if (minimized) wm.restoreWindow(id)
                else wm.focusWindow(id)
              }}
            >
              {w.title}
            </TaskBtn>
          )
        })}
      </Tasks>
      <Tray>
        <TrayClock />
      </Tray>
    </Bar>
  )
}
