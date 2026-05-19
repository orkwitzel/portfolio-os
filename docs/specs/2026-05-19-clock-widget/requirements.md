# Requirements — Clock widget (tray popup)

> Status: Implemented
> Owner: agent
> Created: 2026-05-19
> Related: `docs/ROADMAP.md` step P1.3-4

## Problem

The taskbar tray shows the current time but offers no detail on click. Users expect a Win95-style clock popup with an analog face and locale-aware date/time/timezone when clicking the tray clock.

## Goals

- Clicking the tray clock toggles a popup anchored above the taskbar tray.
- Popup shows an analog clock with second hand, digital time with seconds, full date, and local timezone.
- Dismiss via outside click, Escape, or second tray click.
- Opening the clock closes the Start menu and vice versa.

## Non-goals

- Month calendar grid.
- Timezone picker or world clocks.
- Changing system time.

## User stories

- As a desktop user, I want to click the tray clock to see the current time and date in detail, so that I can check the time without opening an app.
- As a maintainer, I want clock popup state lifted like the Start menu, so shell keyboard shortcuts do not conflict with Escape.

## Acceptance criteria

- [x] Clicking the tray clock toggles a Win95-styled panel above the taskbar.
- [x] Panel shows analog face (hour/minute/second hands), digital time with seconds, weekday date, IANA timezone, and short offset name.
- [x] Outside pointer click, Escape, or second tray click dismisses the panel.
- [x] Opening clock closes Start menu; opening Start closes clock.
- [x] Tray label remains minute-resolution without seconds.
- [x] `npm run build` and `npm run lint` pass.

## Edge cases

- Tab hidden: clock refreshes on `visibilitychange` (shared `useLiveClock` hook).
- Locale formats follow browser `Intl` defaults.
- Start menu and clock widget are mutually exclusive overlays.

## Open questions

None — resolved in design.
