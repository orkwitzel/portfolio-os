# Tasks — <feature name>

> Status: Not started | In progress | Done
> Pairs with: `./requirements.md`, `./design.md`
> Created: YYYY-MM-DD

Implement tasks **one at a time** in the order below. After each one,
tick the box, add a short note, run the listed validation, and stop for
review unless told otherwise.

## Status legend

Reuses `docs/ROADMAP.md` conventions:

- `[ ]` Todo
- `[~]` In progress (initials + date)
- `[x]` Done (PR/commit ref or short note)
- `[!]` Blocked (one line why)

## Task checklist

### T1 — <short title>

- **Goal:** what changes after this task.
- **Files:** `src/...`, `docs/...`
- **Depends on:** *none* | T0 in this spec | external spec `docs/specs/<other>/`
- **Validation:**
  - `npm run lint`
  - `npm run build`
  - Manual: <click / keyboard flow>
- **Rollback:** `git revert <commit>` is enough | requires DB reseed
  (clear IndexedDB or bump `SEED_VERSION`) | other notes.

- [ ] T1 implemented and validated. Notes: …

### T2 — <short title>

- **Goal:** …
- **Files:** …
- **Depends on:** T1
- **Validation:**
  - `npm run lint`
  - `npm run build`
  - Manual: …
- **Rollback:** …

- [ ] T2 implemented and validated. Notes: …

### T3 — Roadmap & docs sync

- **Goal:** keep `docs/ROADMAP.md`, `docs/CONTRIBUTING.md`, `AGENTS.md`,
  `README.md`, and `docs/keyboard-shortcuts.md` consistent with what shipped.
- **Files:** `docs/ROADMAP.md` (Status + Notes + summary table), other docs
  as needed.
- **Depends on:** all prior tasks merged.
- **Validation:**
  - Re-read the touched docs end-to-end.
  - No dangling references to the old behavior.
- **Rollback:** docs-only revert is safe.

- [ ] T3 implemented and validated. Notes: …

## Dependencies (cross-task)

Use this section when tasks form a non-linear graph. For a simple linear
list, leave it empty.

```
T1 -> T2 -> T3
        \-> T2a (optional polish)
```

## Global rollback notes

- Most changes can be rolled back with `git revert`.
- If the change bumped `SEED_VERSION` in `src/fs/seedFs.ts`, reverting it
  is enough: existing browsers will reseed on next load.
- If a new app was registered in `src/components/shell/registry.tsx` and
  pinned via `/desktop/<name>.desktop` in `seedFs.ts`, removing the entry
  and bumping `SEED_VERSION` cleans up wallpaper shortcuts.
- For session/reducer changes, double-check no consumer reads removed
  action types before reverting.
