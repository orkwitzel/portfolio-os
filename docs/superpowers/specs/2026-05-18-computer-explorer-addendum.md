# My Computer — Unix explorer addendum

**Date:** 2026-05-18  
**Extends:** `2026-05-17-phase-2-3-computer-hub-design.md`

## Summary

My Computer is now a KDE-inspired file manager over the same IndexedDB POSIX tree. Paths stay Unix-style (`/`, `/docs`, …); there is no drive-letter layer.

## UI

- **Toolbar:** Back, Forward, Up, Home + read-only address bar (`currentDir`).
- **Left pane:** Places shortcuts (`/`, `desktop`, `docs`, `apps`, `www`) + folder tree synced to `currentDir`.
- **Main pane:** Icon grid of the current directory; double-click opens (folders navigate, files use `openPath`).
- **Preview strip:** Bottom panel when a **file** is selected (markdown, `.www`, `.app`, `.txt`, etc.).

## Navigation

- Default location: `/` (not `/README.md`).
- `launch.path` → directory sets `currentDir`; file sets `dirname` + selection.
- Per-window navigator registry enables context-menu **Open** on folders in the focused Computer window.

## Behavior changes from v1 hub

- Tree folder click navigates; chevron toggles expand.
- `.txt` no longer auto-opens on single tree click; double-click or Open launches Notepad.
- Icon resolution: `src/fs/nodeIcons.ts` (`resolveNodeIcon`).
