import { StartMenu, START_MENU_ID } from '@/components/shell/StartMenu'
import { ShellIcon } from '@/components/shell/ShellIcon'
import { TrayClock } from '@/components/shell/TrayClock'
import { nerd } from '@/utils/nerdIcons'
import { useTaskbar, type TaskbarProps } from './Taskbar.logic'
import {
  Bar,
  StartBtn,
  StartIcon,
  StartLabel,
  TaskBtn,
  TaskBtnLabel,
  Tasks,
  Tray,
} from './Taskbar.style'

export function Taskbar(props: TaskbarProps) {
  const {
    wm,
    tasks,
    startRef,
    startButtonId,
    startMenuOpen,
    toggleStart,
    closeStart,
  } = useTaskbar(props)

  return (
    <Bar data-taskbar>
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
        {tasks.map((task) => (
          <TaskBtn
            key={task.id}
            type="button"
            {...(!task.exiting ? { 'data-taskbar-window-id': task.id } : {})}
            $active={task.active}
            $minimized={task.minimized}
            $entering={task.entering}
            $exiting={task.exiting}
            aria-label={task.title}
            disabled={task.exiting}
            onClick={() => {
              if (task.exiting) return
              if (task.minimized) wm.restoreWindow(task.id)
              else wm.focusWindow(task.id)
            }}
          >
            <ShellIcon source={task.icon} size="taskbar" />
            <TaskBtnLabel>{task.title}</TaskBtnLabel>
          </TaskBtn>
        ))}
      </Tasks>
      <Tray>
        <TrayClock />
      </Tray>
    </Bar>
  )
}
