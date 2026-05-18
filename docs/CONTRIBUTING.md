# Contributing

Rules here apply to **human contributors** and to **coding agents**. Humans own final judgment on product direction; agents follow repo conventions and ask when requirements conflict.

## Project layout

```
src/
  App.tsx, App.style.ts       # Shell wiring (providers, lifted desktop selection)
  main.tsx, index.css, fonts.css   # Entry + global CSS only

  components/                  # All non-app UI
    shell/                     # OS chrome (desktop, taskbar, start menu, icons, …)
      Desktop/
      Taskbar/
      StartMenu/
      ShellIcon/
      WindowManagerProvider/
      registry.tsx             # App definitions + lazy imports
    wm/                        # Window chrome (frame + layer)
      WindowFrame/
      WindowLayer/
    shared/                    # UI shared across apps (not tied to one program)
      MarkdownView/

  apps/                        # Windowed programs (lazy-loaded)
    <app-name>/
      <Component>/             # One folder per component (see below)
      minesweeper.logic.ts     # App-local pure logic (when not a component)

  store/                       # Global client state
    fsStore.ts                 # Zustand (filesystem + shell binding)
    session/
      sessionTypes.ts
      sessionReducer.ts
      windowManagerContext.tsx

  hooks/                       # Shared React hooks
    useOs.ts                   # Unified OS API (fs, win, ui, clipboard, explorer)
    useWindowManager.ts        # Re-export from store/session

  os/                          # OS facade over stores/contexts (createOsApi, useOs)

  utils/                       # Pure helpers (no React, no UI)
    paths.ts
    desktopLayout.ts
    desktopSelection.ts
    shellCatalog.ts
    shellKeyboard.ts
    openExternalLink.ts
    nerdIcons.ts

  fs/                          # Virtual FS domain (IndexedDB, seed, routing)
    fsDb.ts, seedFs.ts, desktop.ts, extensionRouter.ts
    FsProvider.tsx, FsBootstrap.tsx
    types.ts

  content/                     # Static assets (markdown, seed files)
    about.md
    seed/
```

**What does not live in `components/`**

| Path | Role |
|------|------|
| `apps/` | Feature windows; same folder-per-component rules as shell |
| `fs/` | Data layer (DB, seed, open-by-extension) — not presentational |
| `content/` | Bundled text/markdown for seeding or `?raw` imports |
| `index.css`, `fonts.css` | Site-wide reset, fonts, CSS variables |

## Folder-per-component

Every React component gets its own directory:

```
components/shell/Desktop/
  Desktop.tsx           # Dumb view: JSX only
  Desktop.logic.ts      # Behavior: hooks, reducers, handlers, effects
  Desktop.style.ts      # styled-components primitives
  index.ts              # export { Desktop } from './Desktop'

apps/computer/FsTree/
  FsTree.tsx
  FsTree.logic.ts
  FsTree.style.ts       # Or import shared styles (see computer.style.ts)
  index.ts
```

**Child components** nest under their parent folder only when used exclusively by that parent. Otherwise place them as siblings (e.g. `components/shell/ShellIcon/`, not under `Desktop/`).

Thin apps (About, Resume) still use the full trio (`*.tsx`, `*.logic.ts`, `*.style.ts`) for a uniform tree—even when logic is minimal.

Optional `index.ts` barrels: add when import ergonomics matter (`@/components/shell/Desktop`); not required everywhere.

## The three-file split

| File | Responsibility | Must not contain |
|------|----------------|------------------|
| `Component.tsx` | Markup, composition, wiring props from logic into styled elements | Reducers, `useEffect` for data, styled definitions, pure algorithms |
| `Component.logic.ts` | `useComponent(...)` hook, local types, reducers, event handlers, effects | JSX (except rare type-only helpers), styled-components |
| `Component.style.ts` | `styled.*` exports, component-local visual tokens | Business logic, hooks, FS/session calls |

### `Component.tsx` (dumb view)

- Shell/wm components: **named** export matching the folder (`export function Desktop`).
- App roots: **`export default function`** (`export default function NotepadRoot`); `index.ts` re-exports with `export { default } from './NotepadRoot'`.
- Call `useX(props)` from `./Component.logic` once at the top.
- Destructure hook return values directly—**do not** bundle refs into a single `vm` object if that triggers `react-hooks/refs` (pass `ref` from props or destructure `ref` separately from the hook).
- Small presentational subcomponents (e.g. `DragGhosts`) may live in the same file if they are view-only.

```tsx
// Desktop.tsx
import { useDesktop, type DesktopProps } from './Desktop.logic'
import { Workspace, Shortcuts } from './Desktop.style'

export function Desktop(props: DesktopProps) {
  const { state, handleWorkspacePointerDown, ... } = useDesktop(props)
  const { workspaceRef } = props

  return (
    <Workspace ref={workspaceRef} onPointerDown={handleWorkspacePointerDown}>
      …
    </Workspace>
  )
}
```

### `Component.logic.ts` (behavior)

- Export a **`use<Component>`** hook as the primary API (e.g. `useDesktop`, `useWindowFrame`).
- Export **`Props`** types used by the view (`DesktopProps`).
- Export types the view needs for rendering (`DesktopShortcut`, `DragState`) when they are component-specific.
- Keep **reducers and action unions** here when they are private to the component; keep **pure geometry/selection math** in `utils/`.
- Side effects: `useOs`, `useFsStore` (state selectors), `fetch`, listeners, `document.addEventListener`.
- Return a **plain object** of state + stable callbacks (`useCallback`); do not return JSX.

```ts
// Desktop.logic.ts
export type DesktopProps = { workspaceRef: RefObject<HTMLDivElement | null>; … }

export function useDesktop({ workspaceRef, onSelectionChange, … }: DesktopProps) {
  const [state, dispatch] = useReducer(desktopReducer, …)
  // effects, handlers…
  return { state, handleWorkspacePointerDown, marqueeStyle, … }
}
```

For components with almost no behavior, logic may be a thin hook or static data:

```ts
// AboutRoot.logic.ts
export function useAboutRoot(props: AppProps) {
  void props.windowId
  return { source: aboutMd }
}
```

### `Component.style.ts` (presentation)

- Use **styled-components**; import `styled` from `'styled-components'`.
- Export named styled elements (`Workspace`, `TitleBar`, `Cell`).
- Use **`$`-prefixed transient props** for style variants (`$active`, `$selected`) to avoid leaking to the DOM.
- No imports from `store/`, `fs/`, or hooks.

```ts
// WindowFrame.style.ts
export const TitleBar = styled.div<{ $active: boolean }>`
  background: ${(p) => (p.$active ? '…' : '…')};
`
```

**Global CSS** stays in `index.css` / `fonts.css` only (reset, font faces, CSS variables). Do not add new `*.module.css` files.

## Where to put logic

| Kind of logic | Location | Example |
|---------------|----------|---------|
| Component state, effects, handlers | `Component.logic.ts` | Marquee drag, Start menu open/close |
| Pure functions (no React) | `utils/` | `snapPosition`, `selectFromMarquee`, `basename` |
| Global Zustand store | `store/` | `fsStore.ts` |
| Session (windows, focus, z-order) | `store/session/` + context | `sessionReducer`, `useWindowManager` |
| OS API facade | `os/` | `useOs`, `createOsApi` |
| Shared hook re-exports | `hooks/` | `useOs.ts`, `useWindowManager.ts` |
| FS DB, seed, routing | `fs/` | `fsDb.ts`, `extensionRouter.ts` |
| App-only pure algorithms | `apps/<app>/*.logic.ts` | `minesweeper.logic.ts` |
| Shared non-app UI | `components/shared/` | `MarkdownView` |
| App registration + lazy load | `components/shell/registry.tsx` | `appDefinitions` |

**Rules of thumb**

1. If it renders and is not an app window → `components/`.
2. If two or more components need the same pure function → `utils/`.
3. If it must survive outside one component tree → `store/` or `hooks/`.
4. If it touches IndexedDB or path routing → `fs/`.
5. If only one app uses it and it is not UI → `apps/<app>/` (`.logic.ts` at app or component level).

## Imports

- Use the **`@/`** alias for all `src/` imports: `@/store/fsStore`, `@/components/shell/Desktop`, `@/utils/paths`.
- Do not use deep relative paths (`../../fs/...`) in new code.
- Colocated imports within a component folder use `./` (`./Desktop.logic`, `./Desktop.style`).
- Configure in `vite.config.ts` (`resolve.alias`) and `tsconfig.app.json` (`paths`).

## Styling

- **styled-components** for component UI (`*.style.ts`).
- **Global** rules only in `index.css` / `fonts.css`.
- Shared design tokens across many components: add `src/theme.ts` when needed; until then duplicate or re-export from one `.style.ts`.
- Win95-style borders and colors: follow existing shell/wm patterns.

## Code rules

1. **TypeScript everywhere** in `src/` — explicit props for exported components; avoid `any`.
2. **Keep session transitions pure** — `sessionReducer` has no side effects; persistence/analytics stay outside unless redesigned.
3. **Lazy-load apps** — `React.lazy` in `registry.tsx`; dynamic import paths use `@/apps/<app>/<Component>`.
4. **Hooks & ESLint** — Respect `react-hooks` rules; fix ref/access issues by destructuring, not blanket disables.
5. **Dumb views** — When touching a component, keep new behavior in `.logic.ts`, not in `.tsx`.

### Adding an application

1. Create `src/apps/<slug>/<Slug>Root/` with `SlugRoot.tsx`, `SlugRoot.logic.ts`, `SlugRoot.style.ts`, `index.ts`.
2. `SlugRoot` must accept `AppProps` from `@/store/session/sessionTypes`.
3. Append to `appDefinitions` in `components/shell/registry.tsx`:

   ```ts
   Root: lazy(() => import('@/apps/my-app/MyRoot')),
   ```

4. Add launcher stub at `/apps/<slug>.app` in `seedFs.ts`.
5. Optionally pin to wallpaper via `/desktop/<name>.desktop`.

Use `useOs()` for OS actions (filesystem, windows, dialogs, clipboard, explorer integration). Subscribe to reactive state with `useFsStore((s) => …)` or `useWindowManager()` when you need `nodes`, `ready`, or `session` without pulling the full API. Prefer local state in `.logic.ts` for app internals.

```ts
const os = useOs()
const nodes = useFsStore((s) => s.nodes)

await os.fs.read(path)
os.win.openApp('notepad', { launch: { path } })
await os.ui.confirm({ title: 'Delete', message: '…' })
```

### Virtual filesystem (IndexedDB)

- Default tree: `src/fs/seedFs.ts` (`SEED_VERSION`, `buildSeedNodes()`). Bodies in `src/content/seed/` via Vite `?raw`.
- Bump `SEED_VERSION` when the default tree changes (clears and reseeds the DB).
- External URLs: `/www/<name>.www` JSON + optional `/desktop/*.desktop` shortcut.
- Wallpaper shows only `/desktop/*.desktop` entries.

## Git & commits

- Do **not** commit secrets (tokens, `.env` with real keys, personal URLs unless intentional).
- **Commit messages** (recommended convention):

  - Imperative mood, ~72-char subject line, optional body explaining *why*.
  - Examples:

    - `Add Minesweeper stub registered on desktop`
    - `Fix taskbar restore ordering when minimizing focused window`
    - `Document roadmap mobile milestones`

  - Scope prefixes optional but helpful:

    - `components/shell:` desktop, taskbar, start menu
    - `components/wm:` window chrome
    - `apps/<name>:` specific program
    - `store:`, `utils:`, `hooks:` shared modules
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
- [ ] New components follow `Component.tsx` + `Component.logic.ts` + `Component.style.ts`.
- [ ] New apps registered + reachable from desktop or another sanctioned entry point.
- [ ] Session updates flow through reducer verbs — no parallel sources of truth for geometry/z-order.
- [ ] Imports use `@/` (no new deep `../../` chains).
- [ ] No new `*.module.css` (use `*.style.ts` instead).
- [ ] **[ROADMAP.md](./ROADMAP.md) updated** for every significant change (status, notes, summary table) — same PR/commit as the implementation.
- [ ] Other docs updated when behavior or architecture materially changes (`../agents.md`, this file, [README.md](../README.md)).

## Communication with agents

When assigning agent work, point to:

- Files and folders listed above,
- Acceptance criteria (“opening three Notepad instances still cascades”, etc.),
- Whether UX decisions may evolve ([ROADMAP.md](./ROADMAP.md)) vs must match mock/spec exactly.

Agents: defer purely subjective branding choices (palette, pixel asset packs) to humans unless given freedom to proceed.
