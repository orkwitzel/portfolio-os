# Forking desktop-os

This repository is the **upstream** OS. Personal portfolio sites should fork it and add a `src/site/` layer.

## Reference fork

- **Portfolio:** [github.com/orkwitzel/portfolio](https://github.com/orkwitzel/portfolio)

## Add a portfolio layer

1. Fork this repo on GitHub.
2. Add `src/site/` (apps, content, seed, `registry.site.ts`, `icons.ts`).
3. Compose `registry.tsx` from `siteAppDefinitions` + `baseAppDefinitions`.
4. Merge `buildSiteSeedNodes()` in `seedFs.ts`.

See the portfolio repo for a working example.

## Sync from upstream (in your fork)

```bash
git remote add upstream https://github.com/orkwitzel/desktop-os.git
git fetch upstream
git merge upstream/main
```
