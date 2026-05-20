# portfolio

Personal portfolio site built on **[desktop-os](https://github.com/orkwitzel/desktop-os)** — a Win95-style browser desktop with lazy-loaded apps in draggable windows.

Built with **React 19**, **TypeScript**, and **Vite**.

Personal apps and content live under `src/site/`. See **[docs/FORK.md](./docs/FORK.md)** for upstream sync (`git merge upstream/main`).

## Quick start

```bash
npm install
npm run dev
```

```bash
npm run build   # production bundle
npm run lint    # ESLint
npm run preview # build + wrangler dev (local)
npm run deploy  # build + deploy to Cloudflare (orkwitzel.com)
```

**Upstream OS:** [github.com/orkwitzel/desktop-os](https://github.com/orkwitzel/desktop-os) — not deployed from that repo; merge changes here first, then deploy.

## Documentation

| File | Purpose |
|------|---------|
| [AGENTS.md](./AGENTS.md) | Agent guidance |
| [docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md) | Code conventions |
| [docs/FORK.md](./docs/FORK.md) | Upstream sync |
| [docs/ROADMAP.md](./docs/ROADMAP.md) | Implementation plan |
| [docs/keyboard-shortcuts.md](./docs/keyboard-shortcuts.md) | Shell shortcuts |

## License

MIT — see [LICENSE](./LICENSE). Copyright © 2026 Or Kwitzel.
