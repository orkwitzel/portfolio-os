---
name: plan-feature
description: Run the portfolio-os spec-driven planning workflow (requirements -> design -> tasks) for the user's current request. Use when the user types /plan-feature, asks to "plan", "scope", "design", or "spec" a feature, or proposes a non-trivial change that should go through docs/specs/ before any code is edited.
disable-model-invocation: true
---

# Plan a feature

Drive the spec-driven planning workflow for `portfolio-os`. Do **not** edit
files under `src/` while this skill is running.

## 0. Ground yourself

Before drafting anything, read the canonical sources of truth:

- `.cursor/rules/spec-driven-planning.mdc` — the rule this skill implements.
- `docs/specs/README.md` — human-facing lifecycle + example prompts.
- `docs/specs/_template/{requirements,design,tasks}.md` — the templates.
- `AGENTS.md` and `docs/CONTRIBUTING.md` — non-negotiable repo conventions
  (folder-per-component, session reducer ownership, `@/` alias, styled-
  components, lazy app registration).
- `docs/ROADMAP.md` — to link the spec to a phase/step when applicable.

Also scan the parts of `src/` that the request touches (e.g.
`src/components/shell/`, `src/components/wm/`, `src/store/session/`,
`src/apps/<name>/`, `src/fs/`, `src/os/`) so the *Current codebase findings*
section of `design.md` is grounded in real paths.

## 1. Confirm scope with the user

Restate the request in one or two sentences. Identify:

- A short kebab-case feature slug (e.g. `window-snap-zones`).
- Whether to prefix the spec folder with today's date
  (`YYYY-MM-DD-<slug>/`) — default to **yes** unless the user says
  otherwise.
- The likely roadmap step in `docs/ROADMAP.md`, if any.

Ask any clarifying questions **now**, before writing files. Prefer 2–4
focused questions over a long list. If the request is already crisp, skip
straight to step 2.

## 2. Create the spec directory

Copy the three templates into `docs/specs/<slug>/`:

```
docs/specs/<slug>/
  requirements.md
  design.md
  tasks.md
```

Fill in the *Status* line at the top of each file (`Draft` initially) and
today's date. Do not create empty section bodies — either fill them or
mark them `*None*` / `*TBD*` with a one-line reason.

## 3. Draft requirements.md first

Fill in Problem, Goals, Non-goals, User stories, Acceptance criteria, Edge
cases, and Open questions. Acceptance criteria must be testable
behaviors, not implementation details. Open questions go in the *Open
questions* section verbatim — do not guess product decisions.

**Stop here and ask the user the open questions.** Do not move on to
`design.md` until they're answered or explicitly deferred.

## 4. Draft design.md

Only after requirements are agreed:

- Cite real paths under `src/` in *Current codebase findings*.
- In *Files / components affected*, every new React component must follow
  the folder-per-component split (`*.tsx` + `*.logic.ts` + `*.style.ts`).
- Flag any deviation from `docs/CONTRIBUTING.md` under *Risks/tradeoffs*
  and ask the user before treating it as approved.
- Default validation is `npm run lint` + `npm run build` (the build also
  typechecks via `tsc -b`).

## 5. Draft tasks.md

Order tasks so each one is independently shippable and reviewable. For
every task list:

- **Goal**, **Files**, **Depends on**, **Validation**, **Rollback** notes.
- Use the `[ ]` / `[~]` / `[x]` / `[!]` status markers from
  `docs/ROADMAP.md`.

Always include a final `T<n>` task that syncs `docs/ROADMAP.md` and any
other docs (`AGENTS.md`, `README.md`, `docs/keyboard-shortcuts.md`) that
the change affects.

## 6. Hand off for approval

Post a summary in chat:

1. Path to the spec directory.
2. One-line description of the chosen approach.
3. Any remaining open questions.
4. The exact prompt the user can send next to start implementation
   (e.g. *"Implement T1 from docs/specs/<slug>/tasks.md"*).

Do **not** start implementation in the same turn. Wait for an explicit
"approved" / "go ahead" / "implement T<n>" message.

## 7. While implementing (only after approval)

When the user later asks to implement, follow the rule in
`.cursor/rules/spec-driven-planning.mdc`:

- One task at a time.
- Tick the checkbox + add a one-line note in `tasks.md`.
- Run `npm run lint` and `npm run build` for any change under `src/`.
- Summarize: files changed, checks run, what's left.
- Stop after each task unless told to continue.

## Out of scope for this skill

- Editing `src/` before approval.
- Installing new dependencies (call it out in `design.md` instead and ask
  the user to add them).
- Touching the legacy `docs/superpowers/` directory — new specs go under
  `docs/specs/`.
