# Specs

Plan-before-code workflow for `portfolio-os`. Inspired by Kiro/spec-driven
development: every non-trivial change starts as three short docs
(`requirements.md` → `design.md` → `tasks.md`) before any source code moves.

The Cursor agent rule at `.cursor/rules/spec-driven-planning.mdc` enforces
this flow from the agent side. This README is for **you, the human**.

## When to use this workflow

Use a spec when the change matches any of:

- More than ~2 files, or crosses a module boundary
  (`src/components/shell/`, `src/components/wm/`, `src/apps/<name>/`,
  `src/store/session/`, `src/fs/`, `src/os/`).
- Adds or changes a windowed app, session/reducer semantics, OS facade,
  or virtual filesystem behavior.
- Introduces a new dependency, build step, or public-ish surface.
- Product/UX direction is ambiguous.

Skip it for typos, copy tweaks, single-file refactors, and doc-only edits.

## Directory layout

```
docs/specs/
  README.md                  # this file
  _template/                 # copy this when starting a new spec
    requirements.md
    design.md
    tasks.md
  <feature-name>/            # one folder per spec
    requirements.md
    design.md
    tasks.md
    notes/                   # optional scratch
```

Name spec folders in kebab-case. A date prefix is encouraged when the spec
is timely or tied to a roadmap step:
`docs/specs/2026-05-19-window-snap-zones/`.

The legacy looser planning area at `docs/superpowers/{plans,specs}/` is
preserved for history; new work goes under `docs/specs/`.

## Lifecycle

1. **Draft** — copy `_template/`, fill in `requirements.md`, list open
   questions.
2. **In review** — design and tasks are written, you and the agent agree
   on scope.
3. **Approved** — you give the agent the green light; implementation begins.
4. **Implemented** — tasks are ticked, docs synced (`docs/ROADMAP.md`,
   `AGENTS.md`, `docs/CONTRIBUTING.md`, `README.md`,
   `docs/keyboard-shortcuts.md` if relevant), build + lint clean.

Update the *Status* line at the top of each file as it advances. The agent
will not start coding on an unapproved spec.

## Verification commands

Default checks for any source change:

```bash
npm run lint     # eslint .
npm run build    # tsc -b && vite build (also typechecks)
```

Optional:

```bash
npm run dev      # vite dev server
npm run preview  # serve dist locally after build
```

A formal test runner is not yet wired up (it's Phase 3 in `docs/ROADMAP.md`).
Until then, document manual verification in each task and lean on
`lint` + `build` as the automated floor.

## Monorepo note

`portfolio-os` is a **single SPA**, not a monorepo. If that ever changes
(e.g. a future `packages/` or `apps/<service>/` split), update the
templates and this README to scope tasks per package and to call out
package-local commands (`npm -w <pkg> run …`).

## Triggering the workflow

You can drive the workflow in two ways:

- **Slash command:** type `/plan-feature` in Agent chat. This invokes the
  Skill at `.cursor/skills/plan-feature/SKILL.md`, which walks the agent
  through requirements → design → tasks and stops for your approval.
  The skill is configured with `disable-model-invocation: true`, so it
  only fires when you explicitly invoke it.
- **Always-on rule:** the rule at `.cursor/rules/spec-driven-planning.mdc`
  is Always Apply, so even without the slash command the agent will
  refuse to start coding on a non-trivial change until a spec exists.

For finer-grained actions (review an existing spec, implement the next
task, etc.) use the prompts below.

## Example prompts for Cursor

Copy these into the chat to drive the workflow.

### Start a new spec

> Start a new spec at `docs/specs/2026-05-19-window-snap-zones/`.
> Read `AGENTS.md`, `docs/CONTRIBUTING.md`, and any related code under
> `src/components/wm/` and `src/store/session/` before writing.
> Goal: snap dragged windows to screen edges (left/right halves, fullscreen
> on top). Fill out `requirements.md` first and ask me any clarifying
> questions before drafting `design.md` and `tasks.md`. Do not edit `src/`.

### Review a spec

> Review the spec at `docs/specs/<feature-name>/`. Check that
> `requirements.md` has clear acceptance criteria and resolved open
> questions, that `design.md` respects the conventions in
> `docs/CONTRIBUTING.md` (folder-per-component, reducer ownership, `@/`
> imports, styled-components), and that `tasks.md` is ordered with explicit
> validation per task. Suggest edits inline — do not change source code.

### Implement one task

> Implement task **T1** from `docs/specs/<feature-name>/tasks.md`.
> Follow the design in `design.md`. After the change, run `npm run lint`
> and `npm run build`, tick the T1 checkbox with a one-line note, and stop
> for review. Do not start T2.

### Continue from the next unchecked task

> Continue the spec at `docs/specs/<feature-name>/`. Pick up the next
> unchecked task in `tasks.md`, implement it, run the validation listed
> for that task, update the checkbox + note, and stop.

### Update the spec after requirements change

> Requirements changed for `docs/specs/<feature-name>/`: <describe the
> change>. Update `requirements.md` (acceptance criteria, non-goals, open
> questions) first, then reconcile `design.md` and `tasks.md`. Flag any
> already-completed tasks that are now invalid. Do not touch `src/` yet.

### Promote a quick plan to a full spec

> The notes in `.cursor/plans/<file>.md` are getting real. Promote them to
> a full spec at `docs/specs/<feature-name>/` using `_template/`, then
> delete the plan file. Ask before any source edits.

## Related docs

- `AGENTS.md` — agent-facing guardrails and quick command reference.
- `docs/CONTRIBUTING.md` — repo layout, code rules, review checklist.
- `docs/ROADMAP.md` — phased plan; specs should link to and update it.
- `docs/keyboard-shortcuts.md` — required update target for any new
  global shortcut.
- `.cursor/rules/spec-driven-planning.mdc` — the rule the agent reads.
