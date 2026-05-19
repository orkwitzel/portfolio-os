# Requirements — Taskbar context menu

> Status: Implemented
> Owner: portfolio-os
> Created: 2026-05-19
> Related: `docs/ROADMAP.md` step P1.5

## Problem

Right-click on the taskbar today opens a placeholder menu with only a disabled **Tile Windows** item. Users cannot open Settings from the taskbar chrome or manage windows (focus, maximize, minimize, close) from task buttons without using the title bar or window chrome.

## Goals

- Right-click on taskbar chrome (Start, empty task strip, tray) shows **Settings** and keeps **Tile Windows** as a disabled placeholder.
- Right-click on a task button shows **Focus**, **Maximize**, **Minimize**, and **Close** with correct disabled states.
- Window verbs reuse existing `os.win` handlers (same semantics as title-bar context menu where applicable).
- `npm run lint` and `npm run build` pass.

## Non-goals

- Implementing **Tile Windows** or any window tiling layout.
- Keyboard shortcuts specific to the taskbar menu (Escape already closes any context menu).
- Mobile / long-press context menus.
- Reducer or session shape changes.

## User stories

- As a desktop user, I want to right-click the taskbar and open Settings, so that I can adjust preferences without hunting for a desktop shortcut.
- As a desktop user, I want to right-click a task button and focus, maximize, minimize, or close that window, so that I can manage windows from the taskbar like classic Windows.

## Acceptance criteria

- [x] Right-click empty taskbar / Start / tray → **Settings** opens a new Settings window (`openApp('settings')`); menu dismisses on select.
- [x] Right-click a task button → **Focus** restores if minimized, else focuses; **Maximize** / **Minimize** / **Close** behave like title-bar menu; **Maximize** disabled when maximized or minimized.
- [x] Close label is **Close** (not Exit).
- [x] Left-click task button behavior unchanged.
- [x] Exiting task buttons remain non-interactive (`pointer-events: none`, no `data-taskbar-window-id`).
- [x] `npm run build` and `npm run lint` pass.

## Edge cases

- Multiple instances of the same app: each task button has a unique `data-taskbar-window-id`.
- Minimized window: **Focus** calls `restore`; **Maximize** disabled.
- Maximized window: **Maximize** disabled.
- Task button during exit animation: disabled, no data attribute — right-click falls through to generic taskbar menu or is non-interactive.

## Open questions

All resolved:

- Close label: **Close** (not Exit).
- **Maximize** disabled when maximized or minimized (matches title-bar menu).
