# Keyboard shortcuts

Shell-level chords for the portfolio-os desktop. Implementation lives in `src/desktop/ShellKeyboard.tsx` with pure helpers in `src/desktop/shellKeyboard.ts`.

## Shortcuts

| Chord | Action |
|-------|--------|
| **Escape** | Close the focused window |
| **Ctrl+`** | Cycle focus through visible (non-minimized) windows, back → front by z-order |
| **Escape** (Start menu open) | Close the Start menu only (`StartMenu.tsx`) |

## Behavior notes

### Escape — close window

- Runs only when the Start menu is **closed**. When the menu is open, `ShellKeyboard` ignores Escape so `StartMenu` can close the menu first.
- Does **not** run when focus is in an editable control: `textarea`, `input`, or `contentEditable` (`isEditableTarget`).
- Requires a focused window (`session.focusedWindowId`). No-op if none.
- Uses the bubble-phase `document` listener (not capture) so the Start menu handler keeps working.

### Ctrl+` — cycle focus

- Chord is **Control + backtick** (`event.key === 'Backquote'` or `` ` ``). VS Code–style; works reliably in the browser when the page has focus.
- **Not Alt+Tab:** the OS and browser reserve Alt+Tab for the native window switcher, so the page never receives that chord.
- Cycles among windows where `geometry.mode !== 'minimized'`.
- Order: sort visible windows by `zIndex` ascending (back → front), advance from the current focus, wrap to the first after the frontmost.
- No-op when fewer than two visible windows.
- Does not restore minimized windows.
- `preventDefault()` when handled.

### Start menu Escape

- Registered in `StartMenu` while the menu is open; closes the menu via `onClose`.
- A second Escape (menu closed) can close the focused window if focus is not in an editable field.

## Not implemented (deferred)

Tracked under roadmap **P4.2** (accessibility pass):

- Start menu arrow-key roving / typeahead
- **Shift+Ctrl+`** reverse cycle
- Win95-style Alt+Tab overlay UI

Add new global shortcuts in `ShellKeyboard` and document them here.
