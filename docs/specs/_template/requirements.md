# Requirements — <feature name>

> Status: Draft | In review | Approved | Implemented
> Owner: <name>
> Created: YYYY-MM-DD
> Related: `docs/ROADMAP.md` step <P?-?> (if applicable), prior spec(s)

## Problem

What is broken, missing, or confusing today? One or two short paragraphs.
Include concrete signals (user feedback, broken flow, roadmap item) when
possible.

## Goals

- Outcome 1 (observable from outside the code).
- Outcome 2.
- …

## Non-goals

Things this spec deliberately does **not** address. Be specific — non-goals
prevent scope creep and let reviewers skip whole branches of design.

- …

## User stories

Frame as `As <role>, I want <capability>, so that <outcome>.` Roles in this
repo are usually *desktop user*, *agent contributor*, or *maintainer*.

- As a desktop user, I want …
- As a maintainer, I want …

## Acceptance criteria

Concrete, testable conditions. Prefer behaviors over implementation.

- [ ] Opening <X> from the desktop produces <Y>.
- [ ] Reducer transition `<ACTION>` leaves session state in `<shape>`.
- [ ] `npm run build` and `npm run lint` pass on the resulting branch.

## Edge cases

- Multiple instances of the same app open simultaneously.
- Closing the last window of a maximized app.
- Refresh while the relevant IndexedDB key is missing or stale
  (`SEED_VERSION` bump).
- Keyboard-only navigation (see `docs/keyboard-shortcuts.md`).
- Small viewport / mobile (Phase 4 scope — usually a non-goal here).
- Persistence/recovery after a hard reload.

## Open questions

Track ambiguity here so it doesn't get lost. Move resolved items into
*Acceptance criteria* or *Non-goals*.

- [ ] …
- [ ] …
