# Requirements — Notepad classic menus

> Status: Implemented
> Owner: agent
> Created: 2026-05-19
> Related: `docs/ROADMAP.md` step P2.2-4

## Problem

Notepad is a minimal stub: one Save toolbar button, no menu bar, no Open/Save As,
no Find/Replace, and windows close immediately even when the document is dirty.
It does not feel like a real Windows Notepad app inside the desktop metaphor.

## Goals

- Win95-style menu bar: File, Edit, Search, View, Help with classic items.
- Full document lifecycle: New, Open, Save, Save As, Exit with dirty prompts.
- Unsaved-change guard on all window close paths (X, Exit, system menu Close, Escape).
- Window title reflects filename and dirty state (`*name - Notepad`).
- Find, Find Next, Replace; Word Wrap; About Notepad.
- Reusable shell pieces: close guard, save-changes dialog, app menu bar, file picker.

## Non-goals

- Print, Page Setup, Go To, status bar, font dialog, encoding picker.
- Shell session persistence across reload.
- Automated test suite (manual QA + lint/build only).

## User stories

- As a desktop user, I want a familiar Notepad menu bar so I can create and edit text files without leaving the OS metaphor.
- As a desktop user, I want to be warned before losing unsaved edits when closing a window or starting a new document.
- As a maintainer, I want close guards and title updates implemented once in the shell so future apps can reuse them.

## Acceptance criteria

- [ ] Notepad shows File | Edit | Search | View | Help menus with classic items.
- [ ] File → New/Open/Save/Save As/Exit work against the virtual FS.
- [ ] Dirty documents prompt Save / Don't Save / Cancel on close and on New/Open when dirty.
- [ ] Title bar shows `*basename - Notepad` when dirty; updates after save and Save As.
- [ ] Find, Find Next, Replace, Word Wrap, About work as described in design.
- [ ] Close via title X, File Exit, title menu Close, and Escape (field blurred) all respect the guard.
- [ ] `npm run lint` and `npm run build` pass.

## Edge cases

- Multiple Notepad instances: independent dirty state and close guards.
- First save without path: untitled path under `/docs` or file picker for Save As.
- Open non-existent path: graceful empty document or error message.
- Find with no match: no crash; optional beep or silent no-op.
- Focus in textarea: Escape does not close window (existing shell rule).

## Open questions

- *None — resolved at planning: classic menus, all close paths.*
