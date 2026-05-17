# portfolio-os

A **retro desktop-style portfolio shell**: a fake Windows 95–inspired workspace where desktop shortcuts launch lazily loaded React “applications” inside draggable, resizable, minimizable windows—multiple instances per app are supported.

Built with **React 19**, **TypeScript**, and **Vite**.

## Quick start

```bash
npm install
npm run dev
```

Other scripts:

```bash
npm run build   # production bundle
npm run lint    # ESLint
npm run preview # serve dist locally
```

## Documentation

| File | Purpose |
|------|---------|
| [agents.md](./agents.md) | Short guidance for coding agents (architecture boundaries, verification commands). |
| [docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md) | Rules for humans and agents: repo layout, code style, commits, review checklist. |
| [docs/ROADMAP.md](./docs/ROADMAP.md) | Phased implementation plan with tasks, IDs, and status tracking. |

## Architecture (overview)

- **Session state** — Centralized in `src/desktop/sessionReducer.ts`, driven by actions dispatched from `WindowManagerProvider`.
- **Public API** — Imperative verbs (`openApp`, `focusWindow`, `moveWindow`, …) exposed via `useWindowManager()` from `windowManagerContext.tsx`.
- **Apps** — Registered in `src/desktop/registry.tsx` with `React.lazy` for code splitting; implementations live under `src/apps/<name>/`.
- **Presentation** — `Desktop` + `Taskbar` + `WindowLayer` / `WindowFrame` render the shell and chrome.

Details and contribution rules live in **[docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md)**.

## License

This project is released under the [MIT License](./LICENSE). Copyright © 2026 Or Kwitzel.
