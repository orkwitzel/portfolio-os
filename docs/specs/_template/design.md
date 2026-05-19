# Design — <feature name>

> Status: Draft | In review | Approved | Implemented
> Pairs with: `./requirements.md`
> Created: YYYY-MM-DD

## Current codebase findings

What exists today that this spec interacts with. Cite paths so reviewers can
jump straight in. Examples of areas to survey:

- Shell chrome: `src/components/shell/{Desktop,Taskbar,StartMenu,ShellIcon}/`
- Window chrome: `src/components/wm/{WindowFrame,WindowLayer}/`
- Session: `src/store/session/{sessionTypes,sessionReducer,windowManagerContext}.ts`
- App registry & lazy loading: `src/components/shell/registry.tsx`
- OS facade: `src/os/`, `src/hooks/useOs.ts`
- Virtual FS: `src/fs/{fsDb,seedFs,extensionRouter}.ts`
- Existing app folders under `src/apps/<name>/`

Call out anything already partially built, any TODO comments, and any
constraints the existing code imposes.

## Proposed solution

The shortest description of the chosen approach that lets a reviewer
disagree. Include a small diagram or numbered flow when state moves between
modules (e.g. desktop -> reducer -> window frame -> app).

If alternatives were considered, list them with one-line pros/cons and say
why this one wins.

## Files / components affected

| Path | Change kind | Notes |
|------|-------------|-------|
| `src/components/.../Foo/Foo.tsx` | modify | dumb view only |
| `src/components/.../Foo/Foo.logic.ts` | modify | new handler `onBar` |
| `src/components/.../Foo/Foo.style.ts` | modify | new styled element |
| `src/apps/<name>/...` | add | new app root |
| `src/components/shell/registry.tsx` | modify | register new app |
| `src/store/session/sessionReducer.ts` | modify | new action type |
| `docs/ROADMAP.md` | modify | flip P?-? Status/Notes |

Every new React component must follow the folder-per-component split
(`*.tsx`, `*.logic.ts`, `*.style.ts`, optional `index.ts`).

## Data model changes

- Session shape (`sessionTypes.ts`): new fields, new action union members.
- Filesystem nodes (`src/fs/types.ts`, seed in `src/fs/seedFs.ts`): bump
  `SEED_VERSION` if the default tree changes.
- Persisted state (IndexedDB): describe migration or reseed strategy.

If nothing changes here, write *None*.

## API changes

- `useOs()` surface (`src/os/`, `src/hooks/useOs.ts`): new verbs or options.
- `useWindowManager()` verbs: any new imperative actions.
- App `AppProps` contract: new fields or launch payloads.
- External APIs / network calls: usually *None* for this SPA.

If nothing changes here, write *None*.

## UI / UX behavior

- Entry points (desktop shortcut, Start menu, file double-click, keyboard).
- Window default size, position, min size, modality.
- Focus, z-order, and taskbar behavior — confirm it flows through the
  reducer, not local component state.
- Keyboard shortcuts — if added, update `docs/keyboard-shortcuts.md` and
  `ShellKeyboard.tsx`.
- Empty / loading / error states.

## Security / privacy considerations

This is a client-only SPA, but still call out:

- New external links or embedded URLs (CSP, `target="_blank"` + `rel`).
- Anything that reads or writes IndexedDB beyond the current scope.
- Anything that touches the clipboard, downloads files, or opens windows
  outside the desktop metaphor.

If none apply, write *None*.

## Testing strategy

Tests are not yet established in this repo (Phase 3 in the roadmap). For
now, document the manual verification path and the automated checks:

- Manual: <click flow / keyboard flow / multi-instance check>.
- `npm run lint` — must pass.
- `npm run build` — must pass (runs `tsc -b` + `vite build`).
- Optional: `npm run preview` to smoke the production bundle.

When the testing harness lands, update this section to point at the
relevant `*.test.ts(x)` files.

## Risks / tradeoffs

- What could regress? (e.g. cascading window placement, focus stealing,
  IndexedDB migration loss.)
- Where does this spec deviate from `docs/CONTRIBUTING.md` conventions, and
  why is the deviation justified?
- What is deferred to a follow-up spec?
