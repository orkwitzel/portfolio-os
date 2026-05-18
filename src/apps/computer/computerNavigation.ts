export type ComputerNavigator = {
  navigate: (dir: string, selected?: string | null) => void
  openItem: (path: string) => void
  getCreateParentDir: () => string
}

const navigators = new Map<string, ComputerNavigator>()

export function registerComputerNavigator(
  windowId: string,
  nav: ComputerNavigator,
): void {
  navigators.set(windowId, nav)
}

export function unregisterComputerNavigator(windowId: string): void {
  navigators.delete(windowId)
}

export function getComputerNavigator(
  windowId: string | null,
): ComputerNavigator | null {
  if (!windowId) return null
  return navigators.get(windowId) ?? null
}
