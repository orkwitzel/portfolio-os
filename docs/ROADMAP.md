# Roadmap & implementation plan

Living document: update **Status** and **Notes** when you start or finish work so humans and agents share the same picture.

## Status legend

| Status | Meaning |
|--------|---------|
| **Done** | Shipped in `main` (or default branch) and verified (`npm run build` / `npm run lint` as applicable). |
| **In progress** | Someone is actively implementing; add initials + date in **Notes**. |
| **Todo** | Not started; priority order follows phases below unless agreed otherwise. |
| **Blocked** | Waiting on a decision or dependency; say why in **Notes**. |
| **Deferred** | Explicitly parked; revisit later. |

---

## Plan status (summary)

| Phase | Focus | Status | Notes |
|-------|--------|--------|--------|
| **0** | Foundation (desktop shell MVP) | **Done** | Window manager, taskbar, lazy apps, stubs. |
| **1** | Shell fidelity | **Done** | Start menu, tray clock, keyboard shortcuts shipped. P1.2-2 app icon assets optional; P1.2-3 desktop selection deferred. |
| **2** | Apps & content | **Done** | P2.1–P2.3 shipped 2026-05-17 — social links, demo apps, My Computer / IDB hub. |
| **3** | Technical hardening | **Todo** | Clamp, persistence, tests, CI. |
| **4** | Mobile & accessibility | **Todo** | Responsive shell, a11y pass. |
| **5** | Deployment & polish | **Todo** | Hosting, SEO/meta. |

---

## Phase 0 — Foundation

**Outcome:** Single-route React SPA with a credible Win95-style workspace: shortcuts launch independent window instances; drag, resize, minimize, maximize, close; taskbar reflects open/minimized windows.

| Step | Task | Status | Notes |
|------|------|--------|--------|
| P0-1 | Vite + React + TypeScript scaffold, baseline scripts (`dev`, `build`, `lint`). | Done | |
| P0-2 | Session types + pure `sessionReducer` for windows, focus, z-order, geometry modes. | Done | |
| P0-3 | `WindowManagerProvider` + `useWindowManager` verbs (`openApp`, `moveWindow`, …). | Done | |
| P0-4 | `registry.tsx` with `React.lazy` app entries and cascade `openApp` placement. | Done | |
| P0-5 | `Desktop` workspace + shortcuts; `WindowLayer` + `WindowFrame` chrome & Suspense. | Done | |
| P0-6 | Taskbar buttons: restore minimized / focus normal windows. | Done | |
| P0-7 | Stub apps (`notepad`, `about`) proving multi-instance + lazy bundles. | Done | |

---

## Phase 1 — Shell fidelity

### 1.1 Start menu

**Outcome:** “Start” opens a menu anchored to the taskbar; lists apps (from registry or config); optional “Links” section; closes on outside click / Escape.

| Step | Task | Status | Notes |
|------|------|--------|--------|
| P1.1-1 | Add menu open/close state (React state or tiny shell store scoped to `Taskbar`). | Done | 2026-05-17 — `menuOpen` in `Taskbar`. |
| P1.1-2 | Render menu panel with Win95-style borders; position above taskbar Start button. | Done | `StartMenu.tsx` + module CSS. |
| P1.1-3 | Populate program list from `appDefinitions` (or derived config); call `openApp(id)` on click. | Done | `wm.registry` list. |
| P1.1-4 | Dismiss: pointer outside, Escape; optionally click Start toggles. | Done | Capture-phase pointer + Escape + Start toggle. |
| P1.1-5 | (Optional) Divider + external links section (see Phase 2.1 if reused). | Done | 2026-05-17 — Links + `ShellIcon` favicons; opens in new tab. |

### 1.2 Desktop icon polish

**Outcome:** Shortcuts look like era-appropriate pixel icons; consistent alignment grid.

| Step | Task | Status | Notes |
|------|------|--------|--------|
| P1.2-1 | Freeze icon grid layout spec (spacing, label width) in CSS modules. | Done | `ShellIcon` menu/desktop sizes + desktop shortcut grid unchanged. |
| P1.2-2 | Add bitmap/SVG assets per shortcut; swap placeholder squares. | In progress | Infra done; per-app `icon: asset` still optional. |
| P1.2-3 | Single-selection highlight state on desktop (optional second pass). | Todo | |

### 1.3 Clock / tray

**Outcome:** Tray reads useful ambient info (clock); no fake OS APIs.

| Step | Task | Status | Notes |
|------|------|--------|--------|
| P1.3-1 | Decide format (`HH:mm`, locale, timezone display yes/no). | Done | Locale 12h `hour` + `minute`, no seconds or timezone label. |
| P1.3-2 | Implement ticking clock component in tray region (`Taskbar`). | Done | `TrayClock.tsx`; aligns to minute boundary + visibility refresh. |
| P1.3-3 | Style tray inset to match chrome; avoid layout shift on tick. | Done | Tabular nums, `min-width` tray, flex centering. |

### 1.4 Keyboard shortcuts

**Outcome:** Power users can manage windows without mouse-only flows.

| Step | Task | Status | Notes |
|------|------|--------|--------|
| P1.4-1 | Global key listener registry (shell-level) with cleanup on unmount. | Done | `ShellKeyboard.tsx` shortcut table + bubble-phase listener. |
| P1.4-2 | **Escape:** close focused window unless focus inside editable (`textarea`, `input`, `contentEditable`). | Done | Skips when Start menu open; see `docs/keyboard-shortcuts.md`. |
| P1.4-3 | Cycle focus/z-order through visible windows (**Ctrl+`** chord). | Done | `getNextFocusWindowId` in `shellKeyboard.ts`; Alt+Tab reserved by OS. |
| P1.4-4 | Document shortcuts in README or `docs/`. | Done | Canonical: `docs/keyboard-shortcuts.md`; linked from README + `agents.md`. |

### 1.5 Taskbar context menu

**Outcome:** Right-click on the taskbar opens Settings on chrome; right-click on a task button opens per-window actions (Focus, Maximize, Minimize, Close).

| Step | Task | Status | Notes |
|------|------|--------|--------|
| P1.5-1 | Hit-test task buttons (`data-taskbar-window-id`, `isTaskbarWindowButton`). | Done | Spec: `docs/specs/2026-05-19-taskbar-context-menu/`. |
| P1.5-2 | `buildTaskbarMenu` (Settings + disabled Tile Windows) and `buildTaskbarWindowMenu`. | Done | Reuses `os.win` verbs; Close label not Exit. |
| P1.5-3 | Wire `ShellContextMenu` branches before generic taskbar fallback. | Done | Window menu before `isTaskbarArea`; Settings via `openApp('settings')`. |

---

## Phase 2 — Apps & content

### 2.1 Social / external shortcuts

**Outcome:** One-click paths to GitHub, LinkedIn, etc., without breaking the desktop metaphor.

| Step | Task | Status | Notes |
|------|------|--------|--------|
| P2.1-1 | Define config shape (`label`, `url`, `icon?`) for external links. | Done | `.www` files in IDB + `IconSource`. |
| P2.1-2 | Desktop and/or Start entries rendering from config; `window.open(url, '_blank', 'noopener,noreferrer')`. | Done | `/desktop/*.desktop` → `.www` targets; Start Links section. |
| P2.1-3 | Optional “browser” window shell that iframe/embeds—only if framed UX is desired. | Todo | Deferred by default (third-party framing limits). |

### 2.2 Richer demo apps

**Outcome:** Stubs replaced by real portfolio demos; each remains lazy-loaded.

| Step | Task | Status | Notes |
|------|------|--------|--------|
| P2.2-1 | List target demos (skills to showcase); one app folder each under `src/apps/`. | Done | Spec: `docs/superpowers/specs/2026-05-17-phase-2-2-demo-apps-design.md` — `about`, `resume`, `playful`. |
| P2.2-2 | Replace or slim `Notepad` / `About` per content strategy; keep `AppProps` contract. | Done | About (MD), Resume (PDF), Minesweeper; Notepad re-added with IDB save (P2.3). |
| P2.2-3 | Audit bundle: heavy deps only inside their lazy chunks. | Done | `react-markdown` in About chunk only; `resume.pdf` static; see spec lazy chunk map. |
| P2.2-4 | Notepad classic menus + document lifecycle (File/Edit/Search/View/Help, close guard, Open/Save As). | Done | Spec: `docs/specs/2026-05-19-notepad-classic-menus/` |

### 2.3 “My Computer” / readme hub

**Outcome:** Persistent virtual FS in IndexedDB; tree browser + extension handlers; desktop shortcuts from `/desktop/*.desktop` only.

| Step | Task | Status | Notes |
|------|------|--------|--------|
| P2.3-1 | Spec: IDB schema, extensions, `.desktop`, bootstrap, tree UI. | Done | `docs/superpowers/specs/2026-05-17-phase-2-3-computer-hub-design.md` |
| P2.3-2 | Implement hub app + `src/fs/` layer; re-register `computer` + `notepad`. | Done | `FsProvider`, `ComputerRoot`, Notepad save to IDB; `links.ts` removed. |
| P2.3-3 | Seed content from `src/content/seed/` via `seedFs.ts`; bump `SEED_VERSION` on layout changes. | Done | Destructive reseed on version bump (documented in CONTRIBUTING). |

---

## Phase 3 — Technical hardening

### 3.1 Clamp window geometry

**Outcome:** Windows cannot be dragged or resized fully off-screen; minimum sizes respected consistently.

| Step | Task | Status | Notes |
|------|------|--------|--------|
| P3.1-1 | Define clamp rules vs workspace rect (not viewport if taskbar eats height). | Todo | |
| P3.1-2 | Apply clamps on `MOVE_WINDOW` / `RESIZE_WINDOW` (reducer or boundary helper). | Todo | |
| P3.1-3 | On workspace resize (future `ResizeObserver`), adjust maximized `frame` + optionally nudge normals. | Todo | |

### 3.2 Persistence

**Outcome:** Optional resume of layout across reloads.

| Step | Task | Status | Notes |
|------|------|--------|--------|
| P3.2-1 | Serialize subset of session (`windows`, order, focused?) + schema version key. | Todo | |
| P3.2-2 | Hydrate on boot behind feature flag or env; gate dev spam. | Todo | |
| P3.2-3 | Migration note in README when schema changes. | Todo | |

### 3.3 Automated tests

**Outcome:** Reducer + one integration smoke path stay trustworthy.

| Step | Task | Status | Notes |
|------|------|--------|--------|
| P3.3-1 | Add Vitest + RTL deps; `npm run test` script. | Todo | |
| P3.3-2 | Table-driven tests for `sessionReducer` (open, focus, minimize, close). | Todo | |
| P3.3-3 | Smoke: render provider + `openApp` + assert DOM/window record. | Todo | |

### 3.4 CI

**Outcome:** PRs run build + lint (+ tests once P3.3 exists).

| Step | Task | Status | Notes |
|------|------|--------|--------|
| P3.4-1 | Add workflow (GitHub Actions or equivalent): checkout, `npm ci`, `npm run build`, `npm run lint`. | Todo | |
| P3.4-2 | Wire `npm run test` when tests land; fail PR on red. | Todo | |

---

## Phase 4 — Mobile & accessibility

### 4.1 Responsive shell

**Outcome:** Usable on phones/tablets without abandoning Win95 styling.

| Step | Task | Status | Notes |
|------|------|--------|--------|
| P4.1-1 | Breakpoint strategy document (what collapses when). | Todo | |
| P4.1-2 | Single foreground window + taskbar-driven switching; optional stacked preview. | Todo | |
| P4.1-3 | Touch targets ≥ recommended minimum on chrome; no reliance on hover-only affordances. | Todo | |

### 4.2 Accessibility pass

**Outcome:** WCAG-minded basics without killing retro aesthetics.

| Step | Task | Status | Notes |
|------|------|--------|--------|
| P4.2-1 | Focus order audit: taskbar ↔ windows ↔ Start menu. | Todo | |
| P4.2-2 | Visible focus rings where keyboard navigation applies. | Todo | |
| P4.2-3 | `prefers-reduced-motion` respected for transitions (if any). | Todo | |
| P4.2-4 | Decide alt text / aria labels for decorative chrome vs actionable controls. | Todo | |

---

## Phase 5 — Deployment & polish

### 5.1 Hosting

**Outcome:** Static deploy documented and repeatable.

| Step | Task | Status | Notes |
|------|------|--------|--------|
| P5.1-1 | Pick host (Pages, Cloudflare, Netlify, etc.) + document env/build command. | Todo | |
| P5.1-2 | Verify asset paths / `base` for non-root deploy if needed. | Todo | |

### 5.2 SEO / sharing

**Outcome:** Sensible previews when links are dropped in chat/social.

| Step | Task | Status | Notes |
|------|------|--------|--------|
| P5.2-1 | Title, description, canonical meta in `index.html` or head injection. | Todo | |
| P5.2-2 | OG/Twitter card tags + share image asset. | Todo | |
| P5.2-3 | Decide if `/` stays full-screen desktop only or gains minimal exterior landing. | Todo | |

---

## How to update this plan

1. When **starting** a task: set **Status** to **In progress** and add **Notes** (`2026-05-18 — AB: implementing P1.1-2`).
2. When **done**: set **Done** and optionally link PR/commit.
3. When scope changes: edit steps (append rows rather than renumbering historic IDs when possible).

---

_Add dated bullets under a phase when broader direction shifts (e.g. “2026-06-01 — Dropped iframe browser per CSP”)._
