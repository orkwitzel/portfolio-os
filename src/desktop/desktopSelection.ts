import { iconPixelBounds, rectsIntersect, type PixelRect } from './desktopLayout'

export type DesktopSelectionState = {
  /** Set of selected `.desktop` file paths. */
  selectedIds: ReadonlySet<string>
  /** The anchor for Shift+range selection (last plain-click target). */
  anchorId: string | null
  /** The most recently explicitly activated icon — used for Enter / double-click. */
  primaryId: string | null
}

export type DesktopItem = {
  id: string
  gridX: number
  gridY: number
  label: string
}

export const EMPTY_SELECTION: DesktopSelectionState = {
  selectedIds: new Set(),
  anchorId: null,
  primaryId: null,
}

export function clearSelection(): DesktopSelectionState {
  return EMPTY_SELECTION
}

export function selectOne(id: string): DesktopSelectionState {
  return { selectedIds: new Set([id]), anchorId: id, primaryId: id }
}

export function toggleWithCtrl(
  id: string,
  prev: DesktopSelectionState,
): DesktopSelectionState {
  const next = new Set(prev.selectedIds)
  if (next.has(id)) {
    next.delete(id)
    // Move primaryId to another selected item if possible.
    const remaining = [...next]
    return {
      selectedIds: next,
      anchorId: id,
      primaryId: remaining.length > 0 ? remaining[remaining.length - 1] : null,
    }
  }
  next.add(id)
  return { selectedIds: next, anchorId: id, primaryId: id }
}

/**
 * Stable sort order for Shift+range: top-to-bottom, left-to-right, then label.
 */
export function sortedItemIds(items: readonly DesktopItem[]): string[] {
  return [...items]
    .sort((a, b) => {
      if (a.gridY !== b.gridY) return a.gridY - b.gridY
      if (a.gridX !== b.gridX) return a.gridX - b.gridX
      return a.label.localeCompare(b.label)
    })
    .map((i) => i.id)
}

export function selectRange(
  anchorId: string | null,
  targetId: string,
  orderedIds: readonly string[],
): DesktopSelectionState {
  if (!anchorId || anchorId === targetId) {
    return selectOne(targetId)
  }
  const aIdx = orderedIds.indexOf(anchorId)
  const bIdx = orderedIds.indexOf(targetId)
  if (aIdx === -1 || bIdx === -1) return selectOne(targetId)

  const lo = Math.min(aIdx, bIdx)
  const hi = Math.max(aIdx, bIdx)
  const range = orderedIds.slice(lo, hi + 1)
  return {
    selectedIds: new Set(range),
    anchorId,          // anchor stays fixed across multi-shift-clicks
    primaryId: targetId,
  }
}

export function selectFromMarquee(
  marquee: PixelRect,
  items: readonly DesktopItem[],
  prev: DesktopSelectionState,
  mode: 'replace' | 'add',
): DesktopSelectionState {
  const hit = items
    .filter((item) => rectsIntersect(marquee, iconPixelBounds(item.gridX, item.gridY)))
    .map((item) => item.id)

  const base = mode === 'add' ? new Set(prev.selectedIds) : new Set<string>()
  for (const id of hit) base.add(id)

  const allSelected = [...base]
  return {
    selectedIds: base,
    anchorId: allSelected.length > 0 ? allSelected[allSelected.length - 1] : null,
    primaryId: allSelected.length > 0 ? allSelected[allSelected.length - 1] : null,
  }
}

export function selectAll(items: readonly DesktopItem[]): DesktopSelectionState {
  const ids = items.map((i) => i.id)
  return {
    selectedIds: new Set(ids),
    anchorId: ids[0] ?? null,
    primaryId: ids[ids.length - 1] ?? null,
  }
}
