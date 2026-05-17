# Shell icons + Start menu links — design spec

**Date:** 2026-05-17  
**Roadmap:** P1.1-5, P1.2 (initial), P2.1 (partial — config + Start; desktop wiring in same pass if low cost)  
**Status:** Implemented 2026-05-17 — external launch for v1

## Launch semantics (decided)

| Entry kind | Action | Rationale |
|------------|--------|-----------|
| **App** | `openApp(id)` — in-OS window | Portfolio demos live inside the shell. |
| **Link** | `window.open(url, '_blank', 'noopener,noreferrer')` | GitHub/LinkedIn block iframes; recruiters expect a real tab. |
| **In-OS browser (iframe)** | Deferred (P2.1-3) | Optional later; not v1. |
| **Link launcher dialog** | Optional later | In-OS ritual without embed; not v1. |

## Goal

1. Finish **P1.1-5**: Start menu **Links** section (divider + external URLs).
2. Introduce a **shared icon system** used by Start menu items and desktop shortcuts.
3. **External links** show the site favicon, rendered **blocky / Win95-like** via CSS (no image pipeline for MVP).
4. **Own apps** use explicit assets now (optional per app); structure supports bitmap/SVG later without refactoring consumers.

## Non-goals (this iteration)

- Canvas/server-side pixelation or palette reduction to true 256-color art.
- In-app browser / iframe windows (P2.1-3 stays deferred).
- Desktop single-selection highlight (P1.2-3).
- Menu keyboard roving tabindex (P1.4 / P4.2 follow-up).

---

## Can CSS pixelate a favicon?

**Yes, for MVP — with the right display pipeline.** Pure CSS cannot “re-palette” a photo into indexed color, but it **can** produce a convincing retro look:

| Technique | Role |
|-----------|------|
| Load favicon at **small intrinsic size** (16×16) | Gives chunky source pixels |
| Display in a **larger frame** (32×32 desktop, 16×16 menu) with **`image-rendering: pixelated`** (and `crisp-edges` fallback) | Nearest-neighbor upscale = blocky edges |
| Optional **`transform: scale(2)`** on a 16×16 `<img>` inside a 32×32 box | Reliable upscale when the CDN returns 32×32 |

**What CSS does not do:** dithering, 16-color quantization, or custom palettes. If we need “authentic” Win95 .ico look later, add optional **static assets** per link or a one-time build step — not required for v1.

**Recommended favicon source (v1):**

```ts
// 16px — better for pixel upscale than 32px displayed 1:1
`https://www.google.com/s2/favicons?domain=${hostname}&sz=16`
```

Alternative: `new URL('/favicon.ico', url).origin + '/favicon.ico'` — fewer third parties, more 404s. Configurable per link via `icon` override.

**Failure handling:** `<img onError>` → generic link/globe placeholder (CSS gray tile or nerd glyph).

---

## Data model

### `IconSource` (discriminated union)

Single type consumed by `ShellIcon`; extensible without changing Start/Desktop.

```ts
type IconSource =
  | { kind: 'asset'; src: string; alt?: string }           // /icons/notepad.png, import, etc.
  | { kind: 'favicon'; url: string }                        // page URL → resolve favicon + pixelate
  | { kind: 'placeholder' }                                 // gray Win95 tile (current shortcut square)
```

Future (not v1): `{ kind: 'sprite', sheet, x, y }`, `{ kind: 'nerd', char }`.

### `ExternalLinkDefinition`

```ts
type ExternalLinkDefinition = {
  id: string
  label: string
  url: string
  icon?: IconSource  // default: { kind: 'favicon', url }
}
```

### Extend `AppDefinition`

```ts
type AppDefinition = {
  id: string
  defaultTitle: string
  defaultBounds: { width: number; height: number }
  Root: LazyExoticComponent<ComponentType<AppProps>>
  icon?: IconSource   // default: { kind: 'placeholder' } until P1.2 assets land
}
```

### `ShellLaunchItem` (render-facing)

Normalized row for menus/shortcuts — avoids UI caring about app vs link:

```ts
type ShellLaunchItem =
  | { kind: 'app'; id: string; label: string; icon: IconSource; launch: () => void }
  | { kind: 'link'; id: string; label: string; icon: IconSource; launch: () => void }
```

Built in `src/desktop/shellCatalog.ts`:

- **Programs:** `appDefinitions` → `openApp(id)`
- **Links:** `externalLinks` → `window.open(url, '_blank', 'noopener,noreferrer')`

---

## File layout

```
src/desktop/
  icons/
    types.ts              # IconSource, ShellIconSize
    favicon.ts            # hostname + favicon URL helper
    ShellIcon.tsx         # <ShellIcon source size />
    ShellIcon.module.css  # pixelated img, sizes, placeholder tile
  links.ts                # externalLinks: ExternalLinkDefinition[]
  shellCatalog.ts         # buildProgramItems(registry, wm), buildLinkItems(links)
  registry.tsx            # apps + optional icon per app
  StartMenu.tsx           # two sections + divider
  Desktop.tsx             # shortcuts from shellCatalog (not hardcoded)
```

**Why not one mega registry Map?** Apps need `Root` + window manager; links do not. Shared **icon + label + launch** surface only; keep registries separate, unify at catalog layer.

---

## UI components

### `ShellIcon`

```tsx
<ShellIcon source={icon} size="menu" | "desktop" />
```

| `size` | Box | Notes |
|--------|-----|--------|
| `menu` | 16×16 | Inline before label in Start menu row |
| `desktop` | 32×32 (inside 38×38 chrome) | Matches `.shortcutIcon` frame |

**`asset`:** `<img src={src} alt="" draggable={false} />` + pixelated class optional off for crisp SVG.

**`favicon`:** `<img src={resolveFaviconUrl(url)} />` + **`.pixelated`** class (16→32 scale).

**`placeholder`:** empty `<span>` with existing inset border styles (extract from `Desktop.module.css`).

### Start menu (P1.1-5)

```
┌─────────────────────┐
│ [■] Notepad         │
│ [■] About           │
├─────────────────────┤  ← hr / border-top section
│ [G] GitHub          │  ← 16px favicon + label
│ [in] LinkedIn       │
└─────────────────────┘
```

- Section headers optional (YAGNI: divider only).
- `.item` → flex row: `gap: 6px`, icon + label.
- Links call `launch()` then `onClose()`.

### Desktop shortcuts

- Replace hardcoded `DesktopShortcut` list with `buildProgramItems` + `buildLinkItems` (or single `buildDesktopItems()` merging columns).
- Pass `icon` into shortcut button; reuse `ShellIcon size="desktop"`.
- Partial **P1.2-1**: icon box dimensions stay 38×38; gap/label width unchanged.

---

## Approaches considered

| # | Approach | Pros | Cons |
|---|----------|------|------|
| **A** | `IconSource` + `ShellIcon` + separate `links.ts` + `shellCatalog` | Clear extension point; apps/links stay typed | +3 small files |
| **B** | Add `icon` only; links inline in `StartMenu` | Faster | Desktop/Start duplicate; no shared pixelation |
| **C** | Canvas post-process favicon | True pixel art | Complexity, CORS canvas taint, overkill |

**Recommendation: A.**

---

## Favicon / privacy / CSP

- **Third-party requests:** Google s2 (or DuckDuckGo icons) sees hostnames when icons load. Acceptable for portfolio; document in README.
- **`<img>` display:** No CORS issues (unlike canvas).
- **CSP:** Ensure `img-src` allows chosen favicon host(s) if CSP is added later.
- **Offline / blocked:** `onError` → placeholder.

---

## Roadmap mapping

| Step | This work |
|------|-----------|
| P1.1-5 | Links section + divider in `StartMenu` |
| P1.2-1 | Icon box sizes codified in `ShellIcon.module.css` |
| P1.2-2 | `icon: { kind: 'asset', src }` on apps when assets exist; favicon for links |
| P2.1-1 | `ExternalLinkDefinition` + `links.ts` |
| P2.1-2 | Start + Desktop from catalog; `window.open` for links |

---

## Verification

- [ ] Start menu: programs, divider, links with pixelated favicons.
- [ ] Desktop: same entries show icons (placeholder for apps without assets).
- [ ] Link click opens new tab; menu closes.
- [ ] Broken favicon → placeholder, no layout jump.
- [ ] `npm run build` && `npm run lint`.

---

## Open decision (defaults chosen above)

| Question | Default |
|----------|---------|
| Favicon provider | Google `s2/favicons` sz=16 |
| Desktop links in v1? | Yes — same `links.ts` as Start (cheap once catalog exists) |
| App icons in v1? | Placeholder tile; optional `asset` for one demo app if time |
