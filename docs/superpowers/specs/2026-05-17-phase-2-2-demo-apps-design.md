# Phase 2.2 — Richer demo apps — design spec

**Date:** 2026-05-17  
**Roadmap:** P2.2-1, P2.2-2, P2.2-3  
**Status:** Implemented 2026-05-17

## Goal

Replace stub apps with three lazy-loaded portfolio demos—**About** (markdown), **Resume** (embedded PDF), **Playful** (Minesweeper)—plus a bundle audit. Shell wiring unchanged: `registry.tsx` → `shellCatalog.ts` → desktop/Start.

## Demo lineup

| App id | Title | Purpose | Content source |
|--------|-------|---------|----------------|
| `about` | About portfolio-os | Explains the project, stack, and how to explore the desktop | `src/content/about.md` via Vite `?raw` |
| `resume` | Resume | View/download CV for recruiters | `public/resume.pdf` → `/resume.pdf` (static asset) |
| `playful` | Minesweeper | Retro toy showing craft without heavy narrative | Self-contained React state in `src/apps/playful/` |

## Notepad decision

**Removed** from `appDefinitions` after the three apps shipped. It only proved multi-instance; Resume + Playful cover “real” UX. The `src/apps/notepad/` folder remains in the tree for reference but is not registered.

## Registry contract (unchanged)

Each app root accepts [`AppProps`](../../../src/desktop/sessionTypes.ts) (`windowId` only), registered with `React.lazy` in [`registry.tsx`](../../../src/desktop/registry.tsx). Optional `icon?: IconSource` per app (placeholder OK until assets exist).

### Default bounds

| App | Width × height |
|-----|----------------|
| `about` | 480 × 360 |
| `resume` | 560 × 720 |
| `playful` | 320 × 360 |

## Implementations

### Shared: markdown pipeline (About only)

- **Deps:** `react-markdown`, `remark-gfm` — loaded only inside the About lazy chunk.
- **Component:** `src/apps/_shared/MarkdownView.tsx` + `markdownView.module.css` (scrollable client, Win95-friendly typography using `--font-ui` / `--font-size-ui`).
- **About root:** `import aboutMd from '../../content/about.md?raw'` → `<MarkdownView source={aboutMd} />`.
- **Styling:** `.appBody` with `overflow: auto; min-height: 0`.

### Resume app — PDF viewer (v1)

- **Source:** `public/resume.pdf` served at `/resume.pdf`.
- **UI:** `<iframe title="Resume" src="/resume.pdf" />` in a flex column; toolbar with **Open in new tab** (`openExternalLink`) and **Download** (`<a href="/resume.pdf" download>`).
- **No** `pdf.js` or `react-markdown` in the Resume chunk.
- **Fallback (deferred):** `pdfjs-dist` in Resume lazy chunk only if embed fails on deploy targets.

### Playful app — Minesweeper (v1)

- **Board:** 9×9, 10 mines.
- **Features:** left-click reveal (flood fill), right-click flag, win/lose/restart, classic gray/bevel cells via CSS modules.
- **Shell:** no `useWindowManager`; local state only.

## Shell wiring

- `appDefinitions`: `about`, `resume`, `playful`; **no** `notepad`.
- Desktop/Start: no `Desktop.tsx` changes — `buildProgramItems` lists all registry apps.

## Verification

```bash
npm run build && npm run lint
```

Manual: open each app from desktop + Start; About renders MD; Resume shows PDF; Minesweeper playable; Escape skips editable targets in About/Resume (no inputs); Playful clicks are fine.

## Bundle audit (P2.2-3)

Recorded after `npm run build` — see **Lazy chunk map** below. Confirm:

1. Initial `index-*.js` does not include `react-markdown`, `remark-gfm`, or playful game code.
2. `resume.pdf` is emitted as a static asset in `dist/`, not inlined into JS.
3. Each app is its own lazy chunk via `React.lazy` in `registry.tsx`.

### Lazy chunk map

Build 2026-05-17 (`npm run build`):

| Chunk / asset | Raw size | gzip | Contents |
|---------------|----------|------|----------|
| `index-BpR8u6Wl.js` | 208 KB | 66 KB | Shell, React runtime, window manager — **no** `react-markdown` |
| `AboutRoot-BXo3Sx9b.js` | 155 KB | 47 KB | About + `MarkdownView` + `react-markdown` + `remark-gfm` |
| `ResumeRoot-DhNS3Nrw.js` | 0.6 KB | 0.3 KB | iframe + toolbar only |
| `PlayfulRoot-Dfy82JEA.js` | 4 KB | 1.7 KB | Minesweeper logic + UI |
| `resume.pdf` | 125 KB | — | Static asset at `dist/resume.pdf`; not in JS bundles |

**Budget:** No hard gzip cap in v1. If About chunk grows uncomfortably, defer prebuild MD→HTML unless audit blocks ship.

## Non-goals (this phase)

- P2.3 hub app
- P2.1-3 iframe browser
- P1.2-3 desktop selection
- pdf.js-based Resume viewer (v1)
