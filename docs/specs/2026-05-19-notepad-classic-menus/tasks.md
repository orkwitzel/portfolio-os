# Tasks — Notepad classic menus

> Status: Done
> Pairs with: `./requirements.md`, `./design.md`
> Created: 2026-05-19

## Task checklist

### T1 — Spec trio

- [x] T1 implemented. Notes: spec trio created.

### T2 — Window title updates

- [x] T2 implemented. Notes: `SET_WINDOW_TITLE`, `os.win.setTitle`.

### T3 — Save changes dialog

- [x] T3 implemented. Notes: `saveChanges` modal kind + `os.ui.saveChanges`.

### T4 — Window close guard

- [x] T4 implemented. Notes: `requestCloseWindow`, wired Frame/context menu/Escape/Alt+F4.

### T5 — AppMenuBar

- [x] T5 implemented. Notes: `src/components/shell/AppMenuBar/`.

### T6 — ShellFilePicker

- [x] T6 implemented. Notes: `src/components/shell/ShellFilePicker/`.

### T7 — Notepad document API

- [x] T7 implemented. Notes: uncontrolled textarea, title sync, shared `nextUntitledPath`.

### T8 — File menu

- [x] T8 implemented. Notes: New/Open/Save/Save As/Exit + dirty prompts.

### T9 — Edit + View menus

- [x] T9 implemented. Notes: Edit commands, Word Wrap.

### T10 — Search menu

- [x] T10 implemented. Notes: Find, Find Next, Replace dialogs.

### T11 — Help + close guard

- [x] T11 implemented. Notes: About dialog, `useWindowCloseGuard`.

### T12 — Docs sync

- [x] T12 implemented. Notes: `docs/keyboard-shortcuts.md`, seed doc, ROADMAP P2.2-4.
