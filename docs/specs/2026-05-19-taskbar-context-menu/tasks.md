# Tasks — Taskbar context menu

> Status: Done
> Pairs with: `./requirements.md`, `./design.md`
> Created: 2026-05-19

## Task checklist

### T1 — Spec docs

- **Goal:** Document requirements, design, and task checklist.
- **Files:** `docs/specs/2026-05-19-taskbar-context-menu/*`
- **Depends on:** none
- **Validation:** Re-read docs; link from `requirements.md` to ROADMAP P1.5.

- [x] T1 implemented and validated. Notes: spec trio created from templates.

### T2 — Hit-test + data attribute

- **Goal:** Detect right-click on task buttons vs generic taskbar chrome.
- **Files:** `src/utils/shellContextMenu.ts`, `src/components/shell/Taskbar/Taskbar.tsx`
- **Depends on:** T1
- **Validation:**
  - `npm run lint`
  - `npm run build`

- [x] T2 implemented and validated. Notes: `isTaskbarWindowButton` + `data-taskbar-window-id` when not exiting.

### T3 — Menu builders

- **Goal:** Settings on taskbar menu; per-window Focus/Maximize/Minimize/Close menu.
- **Files:** `src/utils/contextMenuBuilders.ts`
- **Depends on:** T2
- **Validation:**
  - `npm run lint`
  - `npm run build`

- [x] T3 implemented and validated. Notes: `buildTaskbarMenu({ onOpenSettings })`, `buildTaskbarWindowMenu`.

### T4 — ShellContextMenu wiring

- **Goal:** Branch before `isTaskbarArea`; hook `os.win` + `readWorkspaceFrame`.
- **Files:** `src/components/shell/ShellContextMenu/ShellContextMenu.tsx`
- **Depends on:** T3
- **Validation:**
  - `npm run lint`
  - `npm run build`
  - Manual: taskbar + task button right-click flows

- [x] T4 implemented and validated. Notes: window button branch before taskbar area; Settings via `openApp('settings')`.

### T5 — Roadmap sync

- **Goal:** Add Phase 1.5 taskbar context menu step as Done.
- **Files:** `docs/ROADMAP.md`
- **Depends on:** T4
- **Validation:** Re-read ROADMAP row; no dangling references.

- [x] T5 implemented and validated. Notes: P1.5 section added.
