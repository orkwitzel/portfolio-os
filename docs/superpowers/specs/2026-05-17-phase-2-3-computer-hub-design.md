# Phase 2.3 — “My Computer” / virtual filesystem hub — design spec

**Date:** 2026-05-17  
**Roadmap:** P2.3-1, P2.3-2, P2.3-3  
**Status:** Implemented 2026-05-17

## Goal

Ship a **My Computer** window that browses a **persistent Unix-style filesystem** in **IndexedDB**. Folders and files form a **tree** (expand/collapse). File behavior is determined by **extension**. External links are **`.www`** JSON files. **Desktop shortcuts** come **only** from **`.desktop`** files under `/desktop/` — no auto-generated registry or link pins. **Notepad** re-registers and **saves back to IDB**. **`links.ts` is removed.**

Win95 chrome on the shell; hub paths are POSIX (`/docs/notes.txt`).

---

## IndexedDB virtual FS

### Schema

| Field | Value |
|-------|--------|
| DB name | `portfolio-os-fs` |
| Store `nodes` | key = `path` (normalized POSIX) |
| Store `meta` | key = `schemaVersion` (integer) |

```ts
type FsNode = {
  path: string              // e.g. /www/github.www
  name: string              // basename
  kind: 'directory' | 'file'
  parentPath: string | null // null only for "/"
  content?: string          // UTF-8; omitted for directories
  updatedAt: number
}
```

**Rules:** explicit directory rows; files need recognized extensions; paths normalized (leading `/`, no trailing `/`, no `..`).

### First-startup bootstrap

**Build time:** `src/fs/seedFs.ts` exports `SEED_VERSION` and `buildSeedNodes()`. Bodies from Vite `?raw` imports under `src/content/seed/` plus inline JSON for `.www`, `.app`, `.desktop`.

**Runtime:** `FsProvider` calls `openFs()` → `ensureSeeded()`:

| Case | Behavior |
|------|----------|
| First visit | No meta or `schemaVersion < SEED_VERSION` → clear `nodes`, insert seed, set meta |
| Return visit | `schemaVersion === SEED_VERSION` → keep user edits |
| App update (bumped version) | Destructive reseed — user-local edits lost (document in CONTRIBUTING) |

### API modules

| Module | Responsibility |
|--------|----------------|
| `paths.ts` | `normalizePath`, `basename`, `dirname`, `join`, `parentPath` |
| `fsDb.ts` | `openFs`, `getNode`, `listChildren`, `listAllNodes`, `readFile`, `writeFile`, `mkdir` |
| `seedFs.ts` | `SEED_VERSION`, `buildSeedNodes()` |
| `extensionRouter.ts` | `openPath(path, ctx)` |
| `desktop.ts` | `listDesktopEntries`, `parseDesktopFile`, `resolveDesktopIcon` |
| `FsProvider.tsx` | React context: `ready`, FS verbs, `openPath` |

---

## Seed layout (v1)

```
/
├── README.md
├── apps/
│   ├── about.app, resume.app, playful.app
│   ├── computer.app, notepad.app
├── docs/
│   ├── keyboard-shortcuts.md, notes.txt
├── www/
│   ├── github.www, linkedin.www
└── desktop/
    ├── my-computer.desktop, notepad.desktop
    ├── github.desktop, linkedin.desktop
```

**`.www`:** `{ "name", "url" }`  
**`.app`:** `{ "appId", "title?" }`  
**`.desktop`:** `{ "name", "path", "icon?" }` — `path` is the **target file** opened via `openPath`, not the `.desktop` file itself.

---

## Extension → behavior

| Ext | Hub (select) | `openPath` |
|-----|--------------|------------|
| `.md` | Markdown preview in detail pane | Open **My Computer** with `launch.path` |
| `.txt` | — | `openApp('notepad', { launch: { path } })` |
| `.www` | Detail + Open in new tab | `openExternalLink(url)` |
| `.app` | Detail + Open | `openApp(appId)` |
| `.desktop` | JSON preview (v1) | N/A on wallpaper |

Unknown extensions: error message in detail pane / console.

---

## Desktop shortcuts

- **Desktop:** only `listDesktopEntries()` from `/desktop/*.desktop` in IDB.
- **Click:** `openPath(targetPath)` after `resolveDesktopIcon`.
- **Icon resolution:** explicit `desktop.icon` → else infer from target (`.www` → favicon, `.app` → registry icon, `.txt`/`.md` → placeholder).

### Start menu (v1)

- **Programs:** `buildProgramItems(wm)` from registry.
- **Links:** `.desktop` entries whose target is a `.www` file (optional divider if any).
- Does **not** use `links.ts`.

---

## My Computer UI

- **Left (~180px):** `FsTree` — recursive folders, `aria-expanded`, monospace names.
- **Right:** `FsDetailPane` — path bar + body per extension.
- **Default selection:** `/README.md` after hydrate; `launch.path` overrides on open.

Folder click: expand/collapse only (detail unchanged in v1). File click: selection + handler (`.txt` opens Notepad immediately).

Registry: `computer` first in `appDefinitions`; `notepad` re-added.

---

## Notepad persistence

- `WindowRecord.launch?: { path: string }` passed as `AppProps.launch`.
- Load via `readFile(path)`; **Save** + **Ctrl+S** → `writeFile`.
- No path: blank doc; first save → `/docs/untitled-{n}.txt` (scan existing).

---

## FsProvider + App

`FsProvider` wraps shell inside `WindowManagerProvider`. `ready === false` → desktop shortcut column empty until IDB hydrates.

---

## Removed

- `src/desktop/links.ts` — URLs live in `/www/*.www`; pins via `/desktop/*.desktop`.

---

## Non-goals (v1)

Drag/drop rename, binary files, server sync, window session persistence (P3.2), auto-open hub on load, merge migrations beyond destructive reseed.
