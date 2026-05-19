# Design — Clock widget (tray popup)

> Status: Implemented
> Pairs with: `./requirements.md`
> Created: 2026-05-19

## Current codebase findings

- `TrayClock` shows locale time, minute ticks via `useTrayClock` in `TrayClock.logic.ts`.
- `StartMenu` provides the popup pattern: fixed positioning, capture-phase outside click, Escape dismiss.
- `ShellMenu.Panel` supplies Win95 chrome borders.

## Proposed solution

Lift `clockWidgetOpen` in `App.tsx` with mutual exclusion against `startMenuOpen`. `TrayClock` becomes a button that toggles the widget and anchors `ClockWidget`. `AnalogClock` is a nested subcomponent under `ClockWidget/` (not exported at shell level). Shared `useLiveClock` in `src/utils/liveClock.ts` supports minute (tray) and second (widget) resolution.

## Files / components affected

| Path | Change kind | Notes |
|------|-------------|-------|
| `src/utils/liveClock.ts` | add | `useLiveClock` hook |
| `src/components/shell/ClockWidget/*` | add | Popup + nested `AnalogClock/` |
| `src/components/shell/TrayClock/*` | modify | Button + widget integration |
| `src/components/shell/Taskbar/*` | modify | Pass clock open props |
| `src/App.tsx` | modify | Lifted state + mutual exclusion |
| `src/components/shell/ShellKeyboard/*` | modify | `clockWidgetOpen` gate |
| `docs/keyboard-shortcuts.md` | modify | Escape closes clock |
| `docs/ROADMAP.md` | modify | P1.3-4 |

## Data model changes

None.

## API changes

None.

## UI / UX behavior

- Entry: click tray clock in taskbar.
- Panel: ~200px min-width, right-aligned above tray; analog ~128px centered.
- `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls` on tray button.
- Escape handled in `ClockWidget.logic.ts`; `ShellKeyboard` skips global Escape while clock open.

## Security / privacy considerations

None — uses browser `Date` / `Intl` only.

## Testing strategy

- Manual: toggle clock, outside click, Escape, Start menu interaction.
- `npm run lint`, `npm run build`.

## Risks / tradeoffs

- Second-hand interval only while popup mounted (1s).
- Local timezone only (browser default).
