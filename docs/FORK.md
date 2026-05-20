# Portfolio fork of desktop-os

This repo is a **fork** of [desktop-os](https://github.com/orkwitzel/desktop-os). Personal apps and content live under `src/site/`; the rest merges from upstream.

## Remotes

| Remote | URL |
|--------|-----|
| `origin` | [orkwitzel/portfolio](https://github.com/orkwitzel/portfolio) |
| `upstream` | [orkwitzel/desktop-os](https://github.com/orkwitzel/desktop-os) |

```bash
git remote -v
```

If `upstream` is missing:

```bash
git remote add upstream https://github.com/orkwitzel/desktop-os.git
```

## Sync OS updates from upstream

```bash
git fetch upstream
git merge upstream/main
npm install
npm run build
npm run lint
```

`.gitattributes` keeps `src/site/**` on our side during merges. After merging, confirm:

- `src/components/shell/registry.tsx` still composes `siteAppDefinitions` + `baseAppDefinitions`
- `src/fs/seedFs.ts` still calls `buildSiteSeedNodes()`
- `wrangler.jsonc` still has your deploy routes (not upstream’s generic config)

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
