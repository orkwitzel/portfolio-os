import { Suspense } from 'react'
import type { WindowRecord } from '@/store/session/sessionTypes'
import { useWindowFrame } from './WindowFrame.logic'
import {
  Client,
  ControlBtn,
  Controls,
  LoadFallback,
  ResizeEast,
  ResizeGrip,
  ResizeSouth,
  TitleBar,
  TitleIcon,
  TitleText,
  Window,
} from './WindowFrame.style'

export function WindowFrame({ window: win }: { window: WindowRecord }) {
  const vm = useWindowFrame(win)
  const Root = vm.Root

  return (
    <Window
      data-window-frame
      data-window-id={win.id}
      $animating={vm.animating}
      style={{
        zIndex: win.zIndex,
        left: vm.rect.x,
        top: vm.rect.y,
        width: vm.rect.width,
        height: vm.rect.height,
        opacity: vm.hidden ? 0 : vm.visualOpacity,
        visibility: vm.hidden ? 'hidden' : 'visible',
        pointerEvents: vm.hidden ? 'none' : 'auto',
      }}
      onPointerDown={vm.onWindowPointerDown}
      onMouseDown={() => vm.wm.focusWindow(win.id)}
      onTransitionEnd={vm.onTransitionEnd}
    >
      <TitleBar
        data-window-titlebar
        $active={vm.focused}
        onPointerDown={vm.onTitlePointerDown}
        onDoubleClick={vm.onTitleDoubleClick}
      >
        <TitleIcon aria-hidden />
        <TitleText>{win.title}</TitleText>
        <Controls>
          <ControlBtn
            type="button"
            $glyph="minimize"
            aria-label="Minimize"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={vm.requestMinimize}
          />
          <ControlBtn
            type="button"
            $glyph={vm.maximized ? 'restore' : 'maximize'}
            aria-label={vm.maximized ? 'Restore' : 'Maximize'}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={vm.toggleMaximize}
          />
          <ControlBtn
            type="button"
            $glyph="close"
            aria-label="Close"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={vm.requestClose}
          />
        </Controls>
      </TitleBar>

      <Client>
        {Root ? (
          <Suspense fallback={null}>
            <Root windowId={win.id} launch={win.launch} />
          </Suspense>
        ) : (
          <LoadFallback>Missing app: {win.appId}</LoadFallback>
        )}
      </Client>

      {!vm.maximized ? (
        <>
          <ResizeEast onPointerDown={vm.onResizePointerDown('e')} aria-hidden />
          <ResizeSouth onPointerDown={vm.onResizePointerDown('s')} aria-hidden />
          <ResizeGrip onPointerDown={vm.onResizePointerDown('se')} aria-hidden />
        </>
      ) : null}
    </Window>
  )
}
