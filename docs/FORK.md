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
```

If `src/site/` was removed by the merge, restore it:

```bash
git checkout HEAD -- src/site/
git add src/site/
```

Then confirm `registry.tsx` composes site + base apps and `seedFs.ts` calls `buildSiteSeedNodes()`.

```bash
npm install
npm run build
npm run lint
```

## Layout

```
src/site/          # Portfolio only — do not upstream
src/components/shell/registry.base.ts  # From upstream
src/components/shell/registry.tsx      # site + base
```

## Personal changes

Edit only `src/site/`, `wrangler.jsonc`, `.env`, and deploy config.
