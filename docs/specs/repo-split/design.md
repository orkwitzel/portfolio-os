# Design — repo split (fork model)

> Status: Implemented
> Pairs with: `./requirements.md`
> Created: 2026-05-20

## Current codebase findings

- Single registry in [`src/components/shell/registry.tsx`](../../src/components/shell/registry.tsx) mixes site and base apps.
- Personal seed (names, social URLs) embedded in [`src/fs/seedFs.ts`](../../src/fs/seedFs.ts).
- Personal apps under `src/apps/{portfolio,about,resume}/`.
- [`src/utils/appIcons.ts`](../../src/utils/appIcons.ts) mixes base and site icons.

## Proposed solution

**Fork model:** `desktop-os` is upstream (no `src/site/`). `portfolio` is a fork that keeps `src/site/` and merges upstream periodically.

In this repo (portfolio fork-ready):

```
src/site/           # never edited by upstream
  apps/
  content/
  config/
  seed/siteSeed.ts
  registry.site.ts
  icons.ts

src/components/shell/
  registry.base.ts  # base apps + defineApp helper
  registry.tsx      # spreads base + site

src/fs/seedFs.ts     # buildBaseSeedNodes + merge site seed
```

Extracting **desktop-os**: clone repo, delete `src/site/`, replace `registry.tsx` with `registry.base` exports only, trim `seedFs` to base-only (or keep merge with empty site array).

## Files / components affected

| Path | Change |
|------|--------|
| `src/site/**` | add (moved from apps/content/config) |
| `src/components/shell/registry.base.ts` | add |
| `src/components/shell/registry.tsx` | modify |
| `src/fs/seedFs.ts` | split base/site merge |
| `src/utils/appIcons.ts` | base icons only |
| `docs/FORK.md` | add |
| `README.md` | fork pointers |

## Data model changes

- `SEED_VERSION` 6 → 7 (reseed on load).

## API changes

None.

## Testing strategy

- `npm run lint`, `npm run build`
- Manual: desktop shortcuts, portfolio/about/resume apps, merge simulation (no site file conflicts with base-only diff)

## Risks / tradeoffs

- Fork drift if upstream not merged regularly — mitigated by `docs/FORK.md`.
- Moving paths breaks deep imports — update all `@/` paths in moved files.
