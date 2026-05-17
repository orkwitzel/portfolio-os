import { Suspense } from 'react'
import type { WindowRecord } from '@/store/session/sessionTypes'
import { useWindowFrame } from './WindowFrame.logic'
import {
  Client,
  ControlBtn,
  Controls,
  LoadFallback,
  ResizeCorner,
  TitleBar,
  TitleIcon,
  TitleText,
  Window,
} from './WindowFrame.style'

export function WindowFrame({ window: win }: { window: WindowRecord }) {
  const vm = useWindowFrame(win)
  const Root = vm.Root

  if (vm.minimized) return null

  return (
    <Window
      style={{
        zIndex: win.zIndex,
        left: vm.rect.x,
        top: vm.rect.y,
        width: vm.rect.width,
        height: vm.rect.height,
      }}
      onMouseDown={() => vm.wm.focusWindow(win.id)}
    >
      <TitleBar
        $active={vm.focused}
        onPointerDown={vm.onTitlePointerDown}
        onDoubleClick={vm.onTitleDoubleClick}
      >
        <TitleIcon aria-hidden />
        <TitleText>{win.title}</TitleText>
        <Controls>
          <ControlBtn
            type="button"
            aria-label="Minimize"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => vm.wm.minimizeWindow(win.id)}
          >
            _
          </ControlBtn>
          <ControlBtn
            type="button"
            aria-label={vm.maximized ? 'Restore' : 'Maximize'}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={vm.toggleMaximize}
          >
            {vm.maximized ? '❐' : '□'}
          </ControlBtn>
          <ControlBtn
            type="button"
            aria-label="Close"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => vm.wm.closeWindow(win.id)}
          >
            ×
          </ControlBtn>
        </Controls>
      </TitleBar>

      <Client>
        {Root ? (
          <Suspense fallback={<LoadFallback>Loading…</LoadFallback>}>
            <Root windowId={win.id} launch={win.launch} />
          </Suspense>
        ) : (
          <LoadFallback>Missing app: {win.appId}</LoadFallback>
        )}
      </Client>

      {!vm.maximized ? (
        <ResizeCorner onPointerDown={vm.onResizePointerDown} aria-hidden />
      ) : null}
    </Window>
  )
}
