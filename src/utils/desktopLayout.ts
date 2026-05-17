/** Inset from workspace edges matching `.shortcuts { inset: 12px }` */
export const DESKTOP_PADDING = 12

/** Width of one grid cell (shortcut button is 92px, +4px breathing room) */
export const CELL_W = 96

/** Height of one grid cell (38px icon frame + ~6px gap + ~20px label + 16px margin) */
export const CELL_H = 80

export type GridPos = { gridX: number; gridY: number }

export type PixelRect = { left: number; top: number; right: number; bottom: number }

/** Convert grid indices to pixel offsets within the `.shortcuts` container. */
export function gridToPx(gridX: number, gridY: number): { left: number; top: number } {
  return {
    left: gridX * CELL_W,
    top: gridY * CELL_H,
  }
}

/** Convert pointer client coords to grid indices given the workspace element. */
export function pxToGrid(
  clientX: number,
  clientY: number,
  workspaceEl: HTMLElement,
): GridPos {
  const rect = workspaceEl.getBoundingClientRect()
  const localX = clientX - rect.left - DESKTOP_PADDING
  const localY = clientY - rect.top - DESKTOP_PADDING
  return {
    gridX: Math.max(0, Math.floor(localX / CELL_W)),
    gridY: Math.max(0, Math.floor(localY / CELL_H)),
  }
}

/** Clamp grid position so the icon stays within the visible workspace. */
export function clampToWorkspace(
  gridX: number,
  gridY: number,
  workspaceEl: HTMLElement,
): GridPos {
  const rect = workspaceEl.getBoundingClientRect()
  const availW = rect.width - DESKTOP_PADDING * 2
  const availH = rect.height - DESKTOP_PADDING * 2
  const maxCol = Math.max(0, Math.floor(availW / CELL_W) - 1)
  const maxRow = Math.max(0, Math.floor(availH / CELL_H) - 1)
  return {
    gridX: Math.min(Math.max(0, gridX), maxCol),
    gridY: Math.min(Math.max(0, gridY), maxRow),
  }
}

/** Snap a drag pointer position to the nearest grid cell, clamped to workspace. */
export function snapPosition(
  clientX: number,
  clientY: number,
  workspaceEl: HTMLElement,
): GridPos {
  const raw = pxToGrid(clientX, clientY, workspaceEl)
  return clampToWorkspace(raw.gridX, raw.gridY, workspaceEl)
}

/**
 * Pixel bounds of a desktop icon inside the workspace coordinate space
 * (i.e. relative to the workspace element's top-left corner, including padding).
 */
export function iconPixelBounds(gridX: number, gridY: number): PixelRect {
  const left = DESKTOP_PADDING + gridX * CELL_W
  const top = DESKTOP_PADDING + gridY * CELL_H
  return { left, top, right: left + CELL_W, bottom: top + CELL_H }
}

/** Axis-aligned bounding box intersection test. */
export function rectsIntersect(a: PixelRect, b: PixelRect): boolean {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
}

// ─── Collision resolution ─────────────────────────────────────────────────────

export type WorkspaceBounds = { maxCol: number; maxRow: number }

/** Read the current workspace column/row limits from the DOM. */
export function getWorkspaceBounds(workspaceEl: HTMLElement): WorkspaceBounds {
  const rect = workspaceEl.getBoundingClientRect()
  const availW = rect.width - DESKTOP_PADDING * 2
  const availH = rect.height - DESKTOP_PADDING * 2
  return {
    maxCol: Math.max(0, Math.floor(availW / CELL_W) - 1),
    maxRow: Math.max(0, Math.floor(availH / CELL_H) - 1),
  }
}

export function cellKey(gridX: number, gridY: number): string {
  return `${gridX},${gridY}`
}

/**
 * BFS outward from (startX, startY) — returns the nearest grid cell
 * (by Manhattan distance) that is not in `occupied`.
 */
export function findNearestFreeCell(
  startX: number,
  startY: number,
  occupied: ReadonlySet<string>,
  bounds: WorkspaceBounds,
): GridPos {
  const visited = new Set<string>()
  const queue: GridPos[] = [{ gridX: startX, gridY: startY }]

  while (queue.length > 0) {
    const curr = queue.shift()!
    const key = cellKey(curr.gridX, curr.gridY)
    if (visited.has(key)) continue
    visited.add(key)

    if (!occupied.has(key)) return curr

    // 4-directional BFS preserves true Manhattan distance ordering.
    const dirs: [number, number][] = [[0, -1], [-1, 0], [1, 0], [0, 1]]
    for (const [dx, dy] of dirs) {
      const nx = curr.gridX + dx
      const ny = curr.gridY + dy
      if (nx >= 0 && nx <= bounds.maxCol && ny >= 0 && ny <= bounds.maxRow) {
        const nKey = cellKey(nx, ny)
        if (!visited.has(nKey)) queue.push({ gridX: nx, gridY: ny })
      }
    }
  }

  return { gridX: startX, gridY: startY } // workspace full — keep in place
}

/**
 * Resolve collisions after a drag:
 *
 * Phase 1 — place each dragged icon at its desired target cell, using BFS
 *   to avoid mutual drag-group conflicts (edge-clamping edge case).
 *   Dragged icons "win" over stationary ones.
 *
 * Phase 2 — any stationary icon whose cell is now taken by a dragged icon
 *   is pushed to the nearest free cell.
 *
 * Returns a Map of every icon that needs to move (dragged + displaced).
 * Items not in the Map stay where they are.
 */
export function resolveDropCollisions(
  dragTargets: ReadonlyMap<string, GridPos>,
  allItems: ReadonlyArray<{ id: string; gridX: number; gridY: number }>,
  bounds: WorkspaceBounds,
): Map<string, GridPos> {
  const result = new Map<string, GridPos>()

  // Phase 1: place dragged icons, resolving only mutual drag-group conflicts.
  const dragOccupied = new Set<string>()
  dragTargets.forEach((target, id) => {
    const pos = findNearestFreeCell(target.gridX, target.gridY, dragOccupied, bounds)
    result.set(id, pos)
    dragOccupied.add(cellKey(pos.gridX, pos.gridY))
  })

  // Phase 2: push stationary icons displaced by dragged ones.
  // Build the full occupied set: final drag positions + undisplaced stationary positions.
  const allOccupied = new Set(dragOccupied)
  const displaced: Array<{ id: string; gridX: number; gridY: number }> = []

  for (const item of allItems) {
    if (dragTargets.has(item.id)) continue
    const key = cellKey(item.gridX, item.gridY)
    if (dragOccupied.has(key)) {
      displaced.push(item)
    } else {
      allOccupied.add(key)
    }
  }

  for (const item of displaced) {
    const pos = findNearestFreeCell(item.gridX, item.gridY, allOccupied, bounds)
    result.set(item.id, pos)
    allOccupied.add(cellKey(pos.gridX, pos.gridY))
  }

  return result
}

/**
 * Convert two client-space pointer positions into a workspace-relative marquee rect.
 */
export function marqueeRect(
  startClient: { x: number; y: number },
  currentClient: { x: number; y: number },
  workspaceEl: HTMLElement,
): PixelRect {
  const wRect = workspaceEl.getBoundingClientRect()
  const x1 = startClient.x - wRect.left
  const y1 = startClient.y - wRect.top
  const x2 = currentClient.x - wRect.left
  const y2 = currentClient.y - wRect.top
  return {
    left: Math.min(x1, x2),
    top: Math.min(y1, y2),
    right: Math.max(x1, x2),
    bottom: Math.max(y1, y2),
  }
}
