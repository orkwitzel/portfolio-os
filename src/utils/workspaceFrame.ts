import type { NormalGeometry } from '@/store/session/sessionTypes'
import { MIN_WINDOW_HEIGHT, MIN_WINDOW_WIDTH } from '@/store/session/sessionReducer'

export function readWorkspaceFrame(workspace: HTMLElement | null): NormalGeometry | null {
  if (!workspace) return null
  return { x: 0, y: 0, width: workspace.clientWidth, height: workspace.clientHeight }
}

export function centerGeometry(
  workspace: HTMLElement | null,
  width: number,
  height: number,
): NormalGeometry | null {
  const frame = readWorkspaceFrame(workspace)
  if (!frame) return null
  const w = Math.min(width, frame.width)
  const h = Math.min(height, frame.height)
  return {
    x: Math.max(0, Math.round((frame.width - w) / 2)),
    y: Math.max(0, Math.round((frame.height - h) / 2)),
    width: w,
    height: h,
  }
}

export function clampWindowPosition(
  workspace: HTMLElement | null,
  geometry: NormalGeometry,
): NormalGeometry {
  const frame = readWorkspaceFrame(workspace)
  if (!frame) return geometry
  const maxX = Math.max(0, frame.width - geometry.width)
  const maxY = Math.max(0, frame.height - geometry.height)
  return {
    ...geometry,
    x: Math.min(Math.max(0, geometry.x), maxX),
    y: Math.min(Math.max(0, geometry.y), maxY),
  }
}

export function clampWindowSize(
  workspace: HTMLElement | null,
  geometry: NormalGeometry,
  minWidth = MIN_WINDOW_WIDTH,
  minHeight = MIN_WINDOW_HEIGHT,
): NormalGeometry {
  const frame = readWorkspaceFrame(workspace)
  const width = Math.max(minWidth, geometry.width)
  const height = Math.max(minHeight, geometry.height)
  if (!frame) return { ...geometry, width, height }
  const maxWidth = Math.max(minWidth, frame.width - geometry.x)
  const maxHeight = Math.max(minHeight, frame.height - geometry.y)
  return {
    ...geometry,
    width: Math.min(width, maxWidth),
    height: Math.min(height, maxHeight),
  }
}
