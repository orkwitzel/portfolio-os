# About OrkOS

**OrkOS** is a retro Windows 95–style desktop shell built as a portfolio site. Shortcuts on the wallpaper open lazily loaded React “apps” inside draggable, resizable, minimizable windows—just like a tiny operating system in the browser.

## What you can try

- Open **Resume** to view or download a PDF CV.
- Play **Minesweeper** from the desktop (9×9, classic rules).
- Use the **Start** menu for programs and external links (GitHub, LinkedIn, etc.).
- Open multiple windows of the same app where supported.

## Tech stack

- **React 19** + **TypeScript**
- **Vite** for dev and production builds
- CSS modules for Win95-style chrome and app UIs
- Central session reducer for window geometry, focus, and z-order

## Keyboard shortcuts

See the project docs for shell chords:

- **Escape** — close the focused window (skipped when typing in a text field)
- **Ctrl+`** — cycle focus between visible windows

Full reference: `docs/keyboard-shortcuts.md` in the repository.

## License

MIT — see `LICENSE` in the repo root.
