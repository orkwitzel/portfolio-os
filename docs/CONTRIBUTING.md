# Contributing

Rules here apply to **human contributors** and to **coding agents**. Humans own final judgment on product direction; agents follow repo conventions and ask when requirements conflict.

## Project layout

```
src/
  App.tsx                    # Shell wiring + workspace ref + provider
  desktop/
    windowManagerContext.tsx # Context type + useWindowManager hook
    WindowManagerProvider.tsx# Session reducer + imperative API
    sessionTypes.ts          # Shared domain types + WMAction union
    sessionReducer.ts        # Pure session transitions
    registry.tsx             # App definitions + lazy imports + registry helper
    Desktop.tsx              # Wallpaper/workspace + shortcuts
    Taskbar.tsx              # Task buttons bound to windows
    *.module.css
  wm/
    WindowLayer.tsx          # Stacks WindowFrame instances
    WindowFrame.tsx          # Title bar, resize, min/max/close, app Suspense
    *.module.css
  apps/
    <app-name>/              # One folder per program (lazy-loaded roots + CSS)
```

**Naming**

- Components: `PascalCase.tsx`.
- Domain/session modules: `camelCase.ts` where logic-heavy (`sessionReducer.ts`).
- Colocated styles: `*.module.css` next to the component.

## Code rules

1. **TypeScript everywhere** in `src/` — explicit props for exported React components; avoid `any`.
2. **Keep session transitions pure** — Side effects (analytics, `localStorage`) belong outside the reducer unless we consciously redesign persistence (see roadmap).
3. **Prefer CSS modules** for component styling to avoid global clashes; global resets stay in `index.css`.
4. **Lazy-load apps** — Use `React.lazy` in `registry.tsx` so demos do not inflate the initial bundle.
5. **Hooks & ESLint** — Respect `react-hooks` rules (including ref mutation constraints); fix properly rather than disabling rules broadly.
6. **Imports** — Use package-relative paths from `src` (`./desktop/...`, `../wm/...`); keep cycles absent unless justified.

### Adding an application

1. Create `src/apps/<slug>/<Slug>Root.tsx` accepting `AppProps` from `sessionTypes.ts`.
2. Add styles beside it (`*.module.css`).
3. Append an entry to `appDefinitions` in `registry.tsx` with unique `id`, titles, default bounds, and `lazy(() => import(...))`.
4. Optionally add a desktop shortcut in `Desktop.tsx`.

Use `useWindowManager()` only when the app must talk to the shell (close self, spawn sibling windows). Prefer local React state for app internals.

## Git & commits

- Do **not** commit secrets (tokens, `.env` with real keys, personal URLs unless intentional).
- **Commit messages** (recommended convention):

  - Imperative mood, ~72-char subject line, optional body explaining *why*.
  - Examples:

    - `Add Minesweeper stub registered on desktop`
    - `Fix taskbar restore ordering when minimizing focused window`
    - `Document roadmap mobile milestones`

  - Scope prefixes optional but helpful:

    - `desktop:` shell/workspace/taskbar
    - `wm:` window chrome/layer
    - `apps/<name>:` specific program
    - `docs:` documentation-only

- Prefer **one coherent change per commit** (feature / fix / docs split).

Pull requests should summarize behavior changes and include verification (`npm run build`, `npm run lint`) unless trivial docs-only edits.

## Roadmap ([ROADMAP.md](./ROADMAP.md))

**Always update the roadmap in the same change series** (commit or PR) when you ship or materially advance work — do not leave status for a follow-up.

Treat an update as **significant** when it affects any of:

- Phase or step completion (foundation, shell fidelity, apps, hardening, mobile, deployment).
- New or changed apps registered in the shell.
- Architecture or session/window-manager behavior that shifts what is Done vs still Todo.
- Blockers, deferrals, or reprioritization agreed in discussion.

When updating [ROADMAP.md](./ROADMAP.md):

1. Set **Status** on the relevant phase/step rows (see the legend at the top of that file).
2. Add or refresh **Notes** (e.g. initials + date for **In progress**; a short line for **Done** or **Blocked**).
3. Update the **Plan status (summary)** table when a whole phase moves (e.g. Phase 1 from Todo → In progress).

Small fixes (typos, copy, CSS-only tweaks with no milestone impact) do not require roadmap edits.

## Review checklist

- [ ] Build passes (`npm run build`).
- [ ] Lint passes (`npm run lint`).
- [ ] New apps registered + reachable from desktop or another sanctioned entry point.
- [ ] Session updates flow through reducer verbs — no parallel sources of truth for geometry/z-order.
- [ ] **[ROADMAP.md](./ROADMAP.md) updated** for every significant change (status, notes, summary table) — same PR/commit as the implementation.
- [ ] Other docs updated when behavior or architecture materially changes (`../agents.md`, this file, [README.md](../README.md)).

## Communication with agents

When assigning agent work, point to:

- Files listed above,
- Acceptance criteria (“opening three Notepad instances still cascades”, etc.),
- Whether UX decisions may evolve ([ROADMAP.md](./ROADMAP.md)) vs must match mock/spec exactly.

Agents: defer purely subjective branding choices (palette, pixel asset packs) to humans unless given freedom to proceed.
