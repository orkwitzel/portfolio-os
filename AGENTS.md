# Agent instructions

This file is for **automated coding agents** (and humans acting like them). Read it before making changes.

## Project in one sentence

`portfolio-os` is a **React + Vite** single-page app that mimics a **Windows 95–style desktop**: shortcuts open lazily loaded “apps” inside draggable, resizable, minimizable windows, coordinated by a central window manager.

## Read first

- `docs/CONTRIBUTING.md` — commit style, code rules, repo layout, and review expectations (applies to agents and humans).
- `docs/ROADMAP.md` — phased plan with step IDs and **Status** columns; pick tasks there when scope is open-ended.
- `docs/keyboard-shortcuts.md` — shell keyboard chords; new global shortcuts must be documented there and implemented in `ShellKeyboard.tsx`.

## Architectural boundaries (do not break casually)

1. **Session truth lives in the reducer** — `src/desktop/sessionReducer.ts` owns transitions for open/focus/move/resize/min/max/close. UI shells call verbs on `WindowManagerApi`; avoid sprinkling duplicate geometry or z-order logic in random components.

2. **Apps stay inside the client area** — Window chrome (`WindowFrame`) renders controls and sizing; app roots (`src/apps/*`) must not manage stacking or escape the window metaphor without an explicit design change.

3. **Registration is explicit** — Base apps in `src/components/shell/registry.base.ts`; portfolio apps in `src/site/registry.site.ts`. Composed in `registry.tsx` with `React.lazy` so bundles stay split. See `docs/FORK.md`.

4. **Refs during render** — Follow existing patterns: sync refs with `useLayoutEffect` where ESLint requires it; do not silence hooks lint rules without a strong reason.

## Commands to verify work

```bash
npm run build
npm run lint
```

Run both before claiming a task is done.

## Common tasks

| Goal | Where to change |
|------|------------------|
| New desktop program (OS demo) | Add `src/apps/<name>/`, register in `registry.base.ts`. |
| New portfolio-only app | Add `src/site/apps/<name>/`, register in `src/site/registry.site.ts`. |
| Desktop shortcuts | `Desktop.tsx` + `Desktop.module.css`. |
| Taskbar behavior | `Taskbar.tsx` + reducer actions if semantics change. |
| Window chrome / drag-resize | `WindowFrame.tsx` + CSS modules under `src/wm/`. |
| Session semantics | `sessionTypes.ts`, then `sessionReducer.ts`, then `WindowManagerProvider` surface if verbs change. |
| Shell keyboard shortcuts | `ShellKeyboard.tsx`, `shellKeyboard.ts`; update `docs/keyboard-shortcuts.md`. |

## Defaults unless the user overrides

- **Desktop-first** — Mobile adaptations are roadmap scope unless explicitly requested now.
- **Multiple instances per app id** — `openApp` always opens a new window with a fresh id.
- **Small diffs** — Match surrounding style; avoid unrelated refactors and gratuitous new dependencies.

When unsure, ask the user or record the ambiguity in `docs/ROADMAP.md` rather than guessing product decisions.
