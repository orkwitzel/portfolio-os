# Fork model: desktop-os + portfolio

This repository is structured as a **portfolio fork**: personal work lives under `src/site/`. The generic Win95-style shell and demo apps are merge-friendly from a future **desktop-os** upstream.

## Repositories

| Repo | Contents |
|------|----------|
| **desktop-os** (upstream) | Everything except `src/site/`. Uses `registry.base.ts` + `buildBaseSeedNodes()` only. |
| **portfolio** (this fork) | Full tree including `src/site/` (apps, content, seed, deploy). |

## Layout

```
src/site/                    # Portfolio only — upstream never edits
  apps/portfolio|about|resume/
  content/
  config/assets.ts
  seed/siteSeed.ts
  registry.site.ts
  icons.ts

src/components/shell/
  registry.base.ts           # Base demo apps (upstream)
  registry.tsx               # site + base (fork)

src/fs/seedFs.ts             # buildBaseSeedNodes + buildSiteSeedNodes
```

## Create desktop-os from this repo

1. Clone or duplicate the repo as `desktop-os`.
2. Delete the entire `src/site/` directory.
3. Replace `src/components/shell/registry.tsx` with:

   ```ts
   export {
     appDefinitions,
     createAppRegistry,
     defineApp,
   } from './registry.base'
   ```

   And in `registry.base.ts`, export `appDefinitions = baseAppDefinitions` (or alias).

4. In `src/fs/seedFs.ts`, set `buildSeedNodes` to `buildBaseSeedNodes` only (remove `buildSiteSeedNodes` import).
5. Run `npm run build` and `npm run lint`.

## Portfolio fork workflow

1. Fork **desktop-os** on GitHub (or keep this repo as portfolio and add upstream later).
2. Ensure `src/site/` exists with personal apps and seed.
3. Add upstream remote:

   ```bash
   git remote add upstream git@github.com:YOUR_ORG/desktop-os.git
   ```

4. Sync OS improvements:

   ```bash
   git fetch upstream
   git merge upstream/main
   npm install
   npm run build
   npm run lint
   ```

## Merge conflict hotspots

- `package.json` / `package-lock.json`
- `src/components/shell/registry.base.ts`
- `src/fs/seedFs.ts` (especially `SEED_VERSION`)
- `src/utils/appIcons.ts`

Avoid editing `src/components/shell/*` (except `registry.tsx`) in the portfolio fork; propose OS fixes upstream first.

## Personal changes

Keep name, links, CV, deploy, and copy changes under `src/site/` or `wrangler.jsonc` only.
