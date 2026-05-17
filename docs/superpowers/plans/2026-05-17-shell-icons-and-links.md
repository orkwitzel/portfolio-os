# Shell Icons + Links Implementation Plan

> **Status:** Implemented 2026-05-17

**Goal:** P1.1-5 Start menu links section, shared `ShellIcon`, external tab launch, Google favicons (CSS pixelated).

**Spec:** `docs/superpowers/specs/2026-05-17-shell-icons-and-links-design.md`

## Shipped files

| File | Role |
|------|------|
| `src/desktop/icons/types.ts` | `IconSource`, sizes |
| `src/desktop/icons/favicon.ts` | Google s2 URL helper |
| `src/desktop/icons/ShellIcon.tsx` | Renders asset / favicon / placeholder |
| `src/desktop/icons/ShellIcon.module.css` | Pixelated upscale, sizes |
| `src/desktop/links.ts` | `externalLinks` config |
| `src/desktop/openExternalLink.ts` | `window.open` wrapper |
| `src/desktop/shellCatalog.ts` | `buildProgramItems`, `buildLinkItems` |
| `src/desktop/StartMenu.tsx` | Programs + divider + links |
| `src/desktop/Desktop.tsx` | Shortcuts from catalog |

## Edit links

Update URLs in `src/desktop/links.ts` (LinkedIn placeholder may need your real profile).

## Verification

- `npm run build` && `npm run lint` — pass
- Manual: Start menu links section, desktop shortcuts, new tab on link click
