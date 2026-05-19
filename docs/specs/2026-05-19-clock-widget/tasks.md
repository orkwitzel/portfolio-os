# Tasks — Clock widget (tray popup)

> Status: Done
> Pairs with: `./requirements.md`, `./design.md`
> Created: 2026-05-19

## Task checklist

### T1 — Spec + ROADMAP

- **Goal:** Spec trio and ROADMAP P1.3-4 row.
- **Files:** `docs/specs/2026-05-19-clock-widget/*`, `docs/ROADMAP.md`
- **Depends on:** none
- **Validation:** Re-read spec files.

- [x] T1 implemented and validated. Notes: spec trio + P1.3-4 row added.

### T2 — useLiveClock + TrayClock refactor

- **Goal:** Shared minute/second clock hook; tray uses minute resolution.
- **Files:** `src/utils/liveClock.ts`, `src/components/shell/TrayClock/TrayClock.logic.ts`
- **Depends on:** T1
- **Validation:** `npm run lint`, `npm run build`

- [x] T2 implemented and validated. Notes: `useLiveClock` + `formatTrayTime`; tray uses minute resolution.

### T3 — ClockWidget + AnalogClock

- **Goal:** Popup panel, formats, SVG analog face, popup lifecycle.
- **Files:** `src/components/shell/ClockWidget/**`
- **Depends on:** T2
- **Validation:** `npm run lint`, `npm run build`, manual toggle/dismiss

- [x] T3 implemented and validated. Notes: nested `AnalogClock/`; ShellMenu `Panel`; second tick only while mounted.

### T4 — Shell wiring + docs

- **Goal:** App/Taskbar/TrayClock button; mutual exclusion; ShellKeyboard; keyboard-shortcuts.md.
- **Files:** `src/App.tsx`, `Taskbar.tsx`, `TrayClock.tsx`, `ShellKeyboard.logic.ts`, `docs/keyboard-shortcuts.md`
- **Depends on:** T3
- **Validation:** `npm run lint`, `npm run build`, manual Start/clock interaction

- [x] T4 implemented and validated. Notes: `clockWidgetOpen` in App with mutual exclusion; Escape documented.
