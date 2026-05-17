# Start Menu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship Phase 1.1 Start menu — registry-driven program list, Win95 styling, dismiss on outside click / Escape / item select / Start toggle.

**Architecture:** Local `menuOpen` state in `Taskbar`; presentational `StartMenu` child with fixed positioning anchored to Start button ref; program list from `wm.registry`; no session reducer changes.

**Tech Stack:** React 19, TypeScript, CSS modules, existing `WindowManagerProvider` / `useWindowManager`.

**Spec:** `docs/superpowers/specs/2026-05-17-start-menu-design.md`

---

## File map

| Action | Path |
|--------|------|
| Create | `src/desktop/StartMenu.tsx` |
| Create | `src/desktop/StartMenu.module.css` |
| Modify | `src/desktop/Taskbar.tsx` |
| Modify | `src/desktop/Taskbar.module.css` |
| Modify | `docs/ROADMAP.md` (P1.1-1 … P1.1-4 → Done) |

---

### Task 1: Start menu styles

**Files:**
- Create: `src/desktop/StartMenu.module.css`

- [ ] **Step 1: Add CSS module** (contents in spec; copy from design doc section or use full file below)

```css
.panel {
  position: fixed;
  z-index: 25000;
  min-width: 180px;
  padding: 2px;
  box-sizing: border-box;
  background: #c0c0c0;
  border-top: 2px solid #fff;
  border-left: 2px solid #fff;
  border-right: 2px solid #404040;
  border-bottom: 2px solid #404040;
  box-shadow: 1px 1px 0 #000;
}

.list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.item {
  display: block;
  width: 100%;
  margin: 0;
  padding: 4px 24px 4px 8px;
  border: none;
  background: transparent;
  font: var(--font-size-ui) var(--font-ui);
  text-align: left;
  cursor: default;
  color: #000;
}

.item:hover,
.item:focus-visible {
  background: #000080;
  color: #fff;
  outline: none;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/desktop/StartMenu.module.css
git commit -m "style: add Start menu panel chrome"
```

---

### Task 2: StartMenu component

**Files:**
- Create: `src/desktop/StartMenu.tsx`

- [ ] **Step 1: Create full component file**

See complete source in `docs/superpowers/specs/2026-05-17-start-menu-design.md` appendix below, or implement from this checklist:

- Export `START_MENU_ID = 'start-menu'`
- Props: `open`, `onClose`, `anchorRef`, `startButtonId`
- `Array.from(wm.registry.values())` for items
- `useLayoutEffect` sets `{ left, bottom }` from anchor `getBoundingClientRect()`
- `useEffect`: capture-phase `pointerdown` (ignore clicks inside menu or anchor), `keydown` Escape
- `useEffect`: focus first menuitem button when opened
- Return `null` when `!open || !position`
- Panel: `role="menu"`, `id={START_MENU_ID}`, `aria-labelledby={startButtonId}`
- Items: `role="menuitem"`, `onClick` → `openApp` + `onClose`

**Complete `StartMenu.tsx`:**

```tsx
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from 'react'
import { useWindowManager } from './windowManagerContext'
import styles from './StartMenu.module.css'

export const START_MENU_ID = 'start-menu'

type StartMenuProps = {
  open: boolean
  onClose: () => void
  anchorRef: RefObject<HTMLButtonElement | null>
  startButtonId: string
}

export function StartMenu({ open, onClose, anchorRef, startButtonId }: StartMenuProps) {
  const wm = useWindowManager()
  const menuRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<{ left: number; bottom: number } | null>(null)

  const apps = Array.from(wm.registry.values())

  useLayoutEffect(() => {
    if (!open) {
      setPosition(null)
      return
    }
    const el = anchorRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setPosition({
      left: rect.left,
      bottom: window.innerHeight - rect.top + 2,
    })
  }, [open, anchorRef])

  useEffect(() => {
    if (!open) return

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (menuRef.current?.contains(target)) return
      if (anchorRef.current?.contains(target)) return
      onClose()
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose, anchorRef])

  useEffect(() => {
    if (!open) return
    menuRef.current?.querySelector<HTMLButtonElement>('button')?.focus()
  }, [open])

  if (!open || !position) return null

  return (
    <div
      ref={menuRef}
      id={START_MENU_ID}
      role="menu"
      aria-labelledby={startButtonId}
      className={styles.panel}
      style={{ left: position.left, bottom: position.bottom }}
    >
      <ul className={styles.list}>
        {apps.map((def) => (
          <li key={def.id}>
            <button
              type="button"
              role="menuitem"
              className={styles.item}
              onClick={() => {
                wm.openApp(def.id)
                onClose()
              }}
            >
              {def.defaultTitle}
            </button>
          </li>
        ))}
      </ul>
    </motionless>
  )
}
```

- [ ] **Step 2: Run build**

Run: `npm run build`  
Expected: PASS (after Task 3 wires Taskbar).

- [ ] **Step 3: Commit**

```bash
git add src/desktop/StartMenu.tsx
git commit -m "feat: add StartMenu component with dismiss and positioning"
```

---

### Task 3: Wire Taskbar

**Files:**
- Modify: `src/desktop/Taskbar.tsx`
- Modify: `src/desktop/Taskbar.module.css`

- [ ] **Step 1: Add to `Taskbar.tsx`**

```tsx
import { useId, useRef, useState } from 'react'
import { StartMenu, START_MENU_ID } from './StartMenu'
```

State + ref inside component:

```tsx
  const [menuOpen, setMenuOpen] = useState(false)
  const startRef = useRef<HTMLButtonElement>(null)
  const startButtonId = useId()
```

Update Start button + insert menu (preserve existing `tasks` / `tray`):

```tsx
      <button
        ref={startRef}
        id={startButtonId}
        type="button"
        className={`${styles.startBtn} ${menuOpen ? styles.startBtnPressed : ''}`}
        aria-label="Start"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-controls={menuOpen ? START_MENU_ID : undefined}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span className={styles.startIcon} aria-hidden>
          {nerd.windowsClassic}
        </span>
        <span className={styles.startLabel}>Start</span>
      </button>
      <StartMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        anchorRef={startRef}
        startButtonId={startButtonId}
      />
```

- [ ] **Step 2: Add `Taskbar.module.css`**

```css
.startBtnPressed {
  border-top: 2px solid #404040;
  border-left: 2px solid #404040;
  border-right: 2px solid #fff;
  border-bottom: 2px solid #fff;
}
```

- [ ] **Step 3: Verify**

Run: `npm run build && npm run lint`

- [ ] **Step 4: Manual smoke** (`npm run dev`) — toggle, launch apps, dismiss.

- [ ] **Step 5: Commit**

```bash
git add src/desktop/Taskbar.tsx src/desktop/Taskbar.module.css
git commit -m "feat: wire Start button to toggle Start menu"
```

---

### Task 4: Roadmap

- [ ] Mark P1.1-1 … P1.1-4 **Done** in `docs/ROADMAP.md`; leave P1.1-5 **Todo**.
- [ ] Commit: `docs: mark Start menu P1.1 steps done`

---

## Execution handoff

**1. Subagent-Driven (recommended)**  
**2. Inline Execution**

Which approach?
