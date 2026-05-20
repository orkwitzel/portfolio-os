# Requirements — repo split (fork model)

> Status: Implemented
> Owner: Or Kwitzel
> Created: 2026-05-20
> Related: fork-friendly layout in this repo; future `desktop-os` upstream + `portfolio` fork

## Problem

`portfolio-os` combines a reusable Win95-style desktop shell with personal portfolio apps, content, and deploy config. That coupling makes it hard to evolve the OS independently or reuse it without copying the whole tree.

## Goals

- Personal code lives under `src/site/` so an upstream merge touches few files.
- Base OS registry and FS seed are separable (`registry.base.ts`, `buildBaseSeedNodes`).
- Document how to create **desktop-os** (upstream) and **portfolio** (fork) from this layout.
- `npm run build` and `npm run lint` pass after the restructure.

## Non-goals

- Publishing an npm package (deferred).
- Automating GitHub fork creation in CI.
- Changing window-manager or FS semantics.

## User stories

- As a maintainer, I want personal apps isolated under `src/site/`, so merging `desktop-os` main causes fewer conflicts.
- As a maintainer, I want a documented `git merge upstream/main` flow for the portfolio fork.

## Acceptance criteria

- [x] `src/site/` contains portfolio, about, resume apps, personal content, seed extension, and site icons.
- [x] `registry.base.ts` registers only base demo apps; `registry.tsx` composes base + site.
- [x] `buildSeedNodes()` merges base seed + site seed; `SEED_VERSION` bumped.
- [x] `docs/FORK.md` explains upstream/portfolio repos and sync steps.
- [x] `npm run build` and `npm run lint` pass.

## Edge cases

- IndexedDB reseeds when `SEED_VERSION` bumps (users lose local FS edits until persistence spec).
- Site apps must remain lazy-loaded from portfolio chunk paths.

## Open questions

- [x] GitHub repos: [orkwitzel/desktop-os](https://github.com/orkwitzel/desktop-os), [orkwitzel/portfolio](https://github.com/orkwitzel/portfolio) (renamed from portfolio-os).
