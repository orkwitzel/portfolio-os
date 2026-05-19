# Design — Notepad classic menus

> Status: Implemented
> Pairs with: `./requirements.md`
> Created: 2026-05-19

## Current codebase findings

- Notepad: `src/apps/notepad/NotepadRoot/` — toolbar Save, controlled textarea, local dirty/path state.
- Session: `src/store/session/sessionReducer.ts` — no `SET_WINDOW_TITLE`; close is immediate.
- Window chrome: `src/components/wm/WindowFrame/` — `requestClose` animates then `closeWindow`.
- Shell modals: `ShellModalProvider` — 2-button confirm only.
- FS: `os.fs.read/write/listChildren`; `nextUntitledPath` in `src/fs/fsOperations.ts`.
- Menus elsewhere: Computer uses `useContextMenuApi` dropdowns, not a menu bar.

## Proposed solution

See plan architecture: `WindowCloseGuard` + `requestCloseWindow`, `saveChanges` modal, `SET_WINDOW_TITLE`, shared `AppMenuBar` and `ShellFilePicker`, Notepad document API with uncontrolled textarea.

## Files / components affected

| Path | Change kind | Notes |
|------|-------------|-------|
| `src/store/session/sessionTypes.ts` | modify | `SET_WINDOW_TITLE` |
| `src/store/session/sessionReducer.ts` | modify | title reducer case |
| `src/components/shell/WindowManagerProvider/` | modify | `setWindowTitle`, `requestCloseWindow` |
| `src/components/shell/WindowCloseGuard/` | add | guard registry |
| `src/components/shell/ShellModal/` | modify | saveChanges kind |
| `src/components/shell/AppMenuBar/` | add | menu bar |
| `src/components/shell/ShellFilePicker/` | add | FS picker modal |
| `src/components/wm/WindowFrame/` | modify | use requestClose |
| `src/components/shell/ShellContextMenu/` | modify | requestClose |
| `src/components/shell/ShellKeyboard/` | modify | requestClose, Alt+F4 |
| `src/os/win.ts`, `src/os/ui.ts`, `src/os/types.ts` | modify | new APIs |
| `src/apps/notepad/NotepadRoot/` | modify | full rewrite |
| `src/App.tsx` | modify | WindowCloseGuard provider |
| `docs/keyboard-shortcuts.md` | modify | chords |
| `docs/ROADMAP.md` | modify | P2.2-4 |

## Data model changes

- `WMAction`: `{ type: 'SET_WINDOW_TITLE'; windowId; title: string }`.

## API changes

- `os.win.setTitle(windowId, title)`
- `os.win.requestClose(windowId)` — async, runs guard
- `os.ui.saveChanges(options)` → `'save' | 'discard' | 'cancel'`

## UI / UX behavior

- Menu bar under window client area; title bar shows dirty + filename.
- File picker modal for Open/Save As starting at `/docs`.

## Security / privacy considerations

None — client-only virtual FS.

## Testing strategy

- Manual QA per tasks.md checklist.
- `npm run lint` && `npm run build`.

## Risks / tradeoffs

- Uncontrolled textarea: remount key on new/open.
- `document.execCommand` for Edit menu — acceptable for demo.
