# Agent instructions

This file is for **automated coding agents** (and humans acting like them). Read it before making changes.

## Project in one sentence

**portfolio** is a personal site built on [desktop-os](https://github.com/orkwitzel/desktop-os): a React + Vite Win95-style desktop where shortcuts open lazily loaded apps in draggable windows.

## Two repos

| Repo | Role |
|------|------|
| [desktop-os](https://github.com/orkwitzel/desktop-os) | Upstream shell + demo apps — merge via `upstream` remote |
| **this repo** | Fork: `src/site/` (portfolio, about, resume), deploy, personal content |

See `docs/FORK.md` before changing shared shell code. **Deploy only from this repo** (`npm run deploy`).

## Read first

- `docs/CONTRIBUTING.md` — layout, code style, commits
- `docs/FORK.md` — upstream sync (pushes to desktop-os do not update this site automatically)
- `docs/ROADMAP.md` — phased plan
- `docs/keyboard-shortcuts.md` — shell chords

## Architectural boundaries

1. **Session truth** — `src/store/session/sessionReducer.ts`; UI uses `WindowManagerApi` / `useWindowManager()`.
2. **Apps stay in the window client area** — no escaping the window metaphor without a design change.
3. **Registration** — Base apps in `registry.base.ts` (from upstream); personal apps in `src/site/registry.site.ts`; composed in `registry.tsx`.
4. **Personal edits** — Prefer `src/site/`, `wrangler.jsonc`, `.env` over forking shell internals.

## Commands to verify work

```bash
npm run build
npm run lint
```

## Common tasks

| Goal | Where to change |
|------|------------------|
| New OS demo app (upstream-first) | `src/apps/<name>/` + `registry.base.ts` in desktop-os, then merge |
| New personal app | `src/site/apps/<name>/` + `src/site/registry.site.ts` |
| Desktop shortcuts (personal) | `src/site/seed/siteSeed.ts` |
| Desktop shortcuts (OS demos) | `src/fs/seedFs.ts` `buildBaseSeedNodes` (often upstream) |
| Shell / WM / FS behavior | Prefer PR to desktop-os, then `git merge upstream/main` |
| Deploy (orkwitzel.com) | `npm run deploy` — Wrangler config in `wrangler.jsonc` |

## Defaults

- **Desktop-first** — mobile is roadmap scope unless requested.
- **Multiple instances per app id** — `openApp` always opens a new window.
- **Small diffs** — match surrounding style.

When unsure, ask the user or note ambiguity in `docs/ROADMAP.md`.
