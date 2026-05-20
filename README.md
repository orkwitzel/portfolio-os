# desktop-os

A **Win95-style desktop shell** for the browser: draggable, resizable, minimizable windows; virtual filesystem; lazy-loaded React apps.

Built with **React 19**, **TypeScript**, and **Vite**.

## Quick start

```bash
npm install
npm run dev
```

```bash
npm run build   # production bundle
npm run lint    # ESLint
```

## Built-in apps

- **My Computer** — virtual FS explorer
- **Notepad** — text editor with IDB persistence
- **Settings** — theme and shell preferences
- **Minesweeper**, **Tetris** — demo games

Register more apps in [`src/components/shell/registry.base.ts`](src/components/shell/registry.base.ts).

## Fork for your own site

See **[docs/FORK.md](docs/FORK.md)**. The reference portfolio implementation is a fork at [github.com/orkwitzel/portfolio](https://github.com/orkwitzel/portfolio).

## Documentation

| File | Purpose |
|------|---------|
| [AGENTS.md](./AGENTS.md) | Agent/human architecture boundaries |
| [docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md) | Layout and code conventions |
| [docs/ROADMAP.md](./docs/ROADMAP.md) | Implementation plan |

## License

MIT — see [LICENSE](./LICENSE).
