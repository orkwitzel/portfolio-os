# portfolio

Personal portfolio site built on **[desktop-os](https://github.com/orkwitzel/desktop-os)** — a Win95-style browser desktop with lazy-loaded apps in draggable windows.

Built with **React 19**, **TypeScript**, and **Vite**.

Personal apps and content live under `src/site/`. See **[docs/FORK.md](./docs/FORK.md)** for upstream sync (`git merge upstream/main`).

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
| [docs/FORK.md](./docs/FORK.md) | desktop-os upstream vs portfolio fork; merge workflow. |
| [docs/ROADMAP.md](./docs/ROADMAP.md) | Phased implementation plan with tasks, IDs, and status tracking. |
| [docs/keyboard-shortcuts.md](./docs/keyboard-shortcuts.md) | Shell keyboard chords and edge cases. |

## Architecture (overview)

- **Session state** — Centralized in `src/store/session/sessionReducer.ts`, driven by actions from `WindowManagerProvider`.
- **Public API** — Imperative verbs (`openApp`, `focusWindow`, …) via `useWindowManager()` / `useOs()`.
- **Apps** — Base demos in `src/apps/`; personal apps in `src/site/apps/`. Registration in `registry.base.ts` + `src/site/registry.site.ts`.
- **Presentation** — `Desktop` + `Taskbar` + `WindowLayer` / `WindowFrame`.

Details and contribution rules live in **[docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md)**.

## License

This project is released under the [MIT License](./LICENSE). Copyright © 2026 Or Kwitzel.
