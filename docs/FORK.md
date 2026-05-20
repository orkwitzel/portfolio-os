# Portfolio fork of desktop-os

This repo is a **fork** of [desktop-os](https://github.com/orkwitzel/desktop-os). Personal apps and content live under `src/site/`; the rest merges from upstream.

## Remotes

| Remote | URL |
|--------|-----|
| `origin` | This portfolio site (deploy target) |
| `upstream` | [orkwitzel/desktop-os](https://github.com/orkwitzel/desktop-os) |

```bash
git remote -v
```

## Sync OS updates from upstream

```bash
git fetch upstream
git merge upstream/main
npm install
npm run build
npm run lint
```

Resolve conflicts in shared files (`registry.base.ts`, `seedFs.ts`, `package.json`) — not in `src/site/` unless upstream bumped seed layout.

## Layout

```
src/site/          # Portfolio only — do not upstream
  apps/            # portfolio, about, resume
  content/
  config/
  seed/
  registry.site.ts
  icons.ts

src/components/shell/
  registry.base.ts # From upstream
  registry.tsx     # site + base
```

## Personal changes

Edit only `src/site/`, `wrangler.jsonc`, `.env`, and deploy config. Propose shell/WM/FS fixes in **desktop-os** first.
