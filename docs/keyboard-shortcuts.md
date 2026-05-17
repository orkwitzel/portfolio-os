# Keyboard shortcuts

Shell-level chords for the portfolio-os desktop. Implementation lives in `src/components/shell/ShellKeyboard/` with pure helpers in `src/utils/shellKeyboard.ts`.

## Shortcuts

| Chord | Action |
|-------|--------|
| **Escape** | Close the focused window, or clear desktop selection if no window is focused |
| **Enter** | Open the primary selected desktop item (desktop focus only) |
| **Ctrl+C** | Copy selected desktop item(s) to the shell clipboard |
| **Ctrl+X** | Cut selected desktop item(s) |
| **Ctrl+V** | Paste from the shell clipboard onto the desktop |
| **F2** | Rename the selected desktop item (single selection) |
| **Delete** | Delete selected desktop item(s) |
| **Ctrl+A** | Select all desktop items |
| **Ctrl+`** | Cycle focus through visible (non-minimized) windows, back → front by z-order |
| **Escape** (Start menu open) | Close the Start menu only (`StartMenu.tsx`) |
| **Escape** (context menu open) | Close the context menu only (`ContextMenu`) |

## Behavior notes

### Escape — close window / clear selection

- Runs only when the Start menu and context menu are **closed**. When either menu is open, `ShellKeyboard` ignores Escape so the menu can close first.
- Does **not** run when focus is in an editable control: `textarea`, `input`, or `contentEditable` (`isEditableTarget`).
- With a focused window: closes that window. With no focused window but desktop selection: clears selection.

### Desktop clipboard chords

- Active when no window has focus and focus is not in an editable field.
- Cut/copy operate on desktop item paths (`.desktop` shortcuts and direct files on `/desktop`).
- Paste moves, copies, or duplicates files onto the desktop per shell clipboard rules; `.desktop` shortcuts are duplicated as shortcuts.

### Ctrl+` — cycle focus

- Chord is **Control + backtick** (`event.key === 'Backquote'` or `` ` ``).
- **Not Alt+Tab:** the OS reserves Alt+Tab for the native window switcher.
- Cycles among windows where `geometry.mode !== 'minimized'`.
- Does not restore minimized windows.

### Start menu / context menu Escape

- Each menu registers its own Escape handler while open.
- `ShellKeyboard` skips global shortcuts while a menu is open.

## Not implemented (deferred)

- Start menu arrow-key roving / typeahead
- **Shift+Ctrl+`** reverse window cycle
- Win95-style Alt+Tab overlay UI

Add new global shortcuts in `ShellKeyboard` and document them here.
