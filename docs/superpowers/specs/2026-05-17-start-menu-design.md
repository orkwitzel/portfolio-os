# Start menu — design spec

**Date:** 2026-05-17  
**Roadmap:** Phase 1.1 (P1.1-1 … P1.1-4)  
**Status:** Draft — review before implementation

## Goal

Clicking **Start** on the taskbar opens a Win95-style program menu anchored to the Start button. Choosing a program launches it via the existing window manager (`openApp`). The menu dismisses on outside click, **Escape**, and when a program is chosen. Clicking **Start** again toggles the menu closed.

## Non-goals (this iteration)

- **P1.1-5** external “Links” section → defer to Phase 2.1 (social shortcuts config).
- Menu item bitmap icons (optional polish; use text labels from `defaultTitle` only).
- Start menu keyboard navigation (arrow keys) → follow-up with P1.4 a11y pass.
- Automated tests → Phase 3.3; manual verification for now.

## Context

| Area | Current state |
|------|----------------|
| `Taskbar.tsx` | Start button is inert (`aria-label` only). |
| `registry.tsx` | `appDefinitions` + `createAppRegistry`; apps: `notepad`, `about`. |
| `WindowManagerApi` | Exposes `registry: Map<string, AppDefinition>` and `openApp(appId)`. |
| `Desktop.tsx` | Hardcoded shortcuts duplicate app labels; Start menu becomes second launch surface. |
| Styling | `#c0c0c0` chrome, 2px outset/inset borders in `Taskbar.module.css` / `WindowFrame.module.css`. |

## Approaches considered

### A. Local state in `Taskbar` + `StartMenu` child (recommended)

- `useState(false)` for `menuOpen` in `Taskbar`.
- `StartMenu` receives `open`, `onClose`, `anchorRef` (Start button).
- **Pros:** Minimal surface area; matches roadmap “scoped to Taskbar”; no new global store.
- **Cons:** `Taskbar` grows slightly; dismiss logic lives in `StartMenu` or a tiny hook.

### B. `useStartMenu()` hook file

- Same as A but extracts toggle + dismiss into `useStartMenu.ts`.
- **Pros:** Keeps `Taskbar` thin if dismiss grows.
- **Cons:** Extra file for ~30 lines; YAGNI until keyboard nav lands.

### C. Shell context / reducer action

- **Pros:** Shared if multiple components need menu state later.
- **Cons:** Overkill for single-owner UI; violates YAGNI.

**Decision:** **A**, with dismiss logic colocated in `StartMenu.tsx` (single `useEffect`).

## Architecture

```
Taskbar
├── startBtn (ref, toggle menuOpen, aria-expanded)
├── StartMenu (portal-less, position: fixed)
│   ├── reads wm.registry → menu items
│   └── item click → openApp(id) + onClose()
└── tasks / tray (unchanged)
```

**Data flow:** `appDefinitions` → registry `Map` (already in provider) → `Array.from(wm.registry.values())` for stable menu order → `wm.openApp(def.id)` on item click.

**Stacking:** Menu uses a fixed CSS `z-index` (e.g. `25000`) above window `zIndex` values (session `nextZ` increments from small integers).

**Positioning:** `position: fixed`; `left` = Start button `getBoundingClientRect().left`; `bottom` = `window.innerHeight - rect.top + 2px` so the menu sits flush above the taskbar Start button. Recompute on open via `useLayoutEffect`.

## Components & files

| File | Responsibility |
|------|----------------|
| `src/desktop/StartMenu.tsx` | Panel, program list, dismiss listeners, positioning. |
| `src/desktop/StartMenu.module.css` | Win95 menu panel + item hover/active styles. |
| `src/desktop/Taskbar.tsx` | `menuOpen` state, `startRef`, wire Start button + render `StartMenu`. |
| `src/desktop/Taskbar.module.css` | Optional `.startBtnPressed` when menu open (inset border like active task button). |

No changes to `sessionReducer`, `registry` shape, or `AppDefinition` type for MVP.

## Behavior spec

| Event | Behavior |
|-------|----------|
| Click Start (closed) | Open menu; `aria-expanded="true"`. |
| Click Start (open) | Close menu (toggle). |
| Click menu item | `openApp(id)`, close menu. |
| Pointer down outside menu + outside Start | Close menu (capture phase on `document`). |
| Escape | Close menu (do not stop propagation to window close in P1.4 — menu closes first; global Escape handler comes later). |
| Open menu while window focused | Menu opens; no change to `focusedWindowId`. |

**Unknown app id:** Not applicable from menu (list built from registry only).

## Accessibility (minimal, Phase 1)

- Start: `aria-haspopup="menu"`, `aria-expanded`, `aria-controls` → menu `id`.
- Menu: `role="menu"`; items: `role="menuitem"` as `<button type="button">`.
- Focus: on open, optional `focus()` first item (recommended for keyboard users).

## Visual

- Panel: `#c0c0c0`, outset border (match `startBtn`), `box-shadow: 1px 1px 0 #000` like windows.
- Items: full-width rows, ~22px height, left-aligned `defaultTitle`.
- Hover: Win95 blue `#000080` background, white text.
- No layout shift on taskbar when menu opens (menu is `fixed`, outside taskbar flex flow).

## Verification (manual)

1. `npm run dev` — Start opens menu above button; lists Notepad + About.
2. Each item opens a new window instance (same as desktop shortcuts).
3. Outside click and Escape close menu; Start toggles.
4. `npm run build` && `npm run lint` pass.
5. Update `docs/ROADMAP.md` P1.1-* rows to **Done** with date note.

## Roadmap mapping

| Step | Covered by |
|------|------------|
| P1.1-1 | `menuOpen` in `Taskbar` |
| P1.1-2 | `StartMenu` panel + CSS + fixed positioning |
| P1.1-3 | Registry-driven list + `openApp` |
| P1.1-4 | Outside pointer + Escape + Start toggle |
| P1.1-5 | Deferred |
