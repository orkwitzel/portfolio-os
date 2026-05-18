import type { ShellModalApi } from '@/components/shell/ShellModal/shellModalContext'
import type {
  ShellConfirmOptions,
  ShellPromptOptions,
} from '@/components/shell/ShellModal/ShellModal.types'
import type { IconSource } from '@/components/shell/ShellIcon'
import type { DesktopEntry, FsNode } from '@/fs/types'
import type { FsStore } from '@/store/fsStore'
import type { useSettingsStore } from '@/store/settingsStore'
import type { ShellClipboardStore } from '@/store/shellClipboard'
import type {
  ColorSchemeId,
  CursorMode,
  FontSizeId,
  SettingsV1,
} from '@/theme/tokens'
import type {
  NormalGeometry,
  WindowId,
  WindowLaunch,
} from '@/store/session/sessionTypes'
import type { WindowManagerApi } from '@/store/session/windowManagerContext'

/**
 * Dependencies wired into {@link createOsApi}. Used internally; apps should call
 * {@link useOs} instead of constructing this manually.
 */
export type OsDeps = {
  /** Zustand filesystem store (IndexedDB + shell binding). */
  fsStore: FsStore
  /** Window manager context (focus, geometry, app launch). */
  wm: WindowManagerApi
  /** Shell modal provider (confirm, prompt, properties). */
  modal: ShellModalApi
  /** Shell clipboard store (copy/cut/paste). */
  clipboard: ShellClipboardStore
  /** User appearance / display preferences store (internal). */
  settingsStore: typeof useSettingsStore
}

/**
 * Options for {@link OsFsApi.rename.interactive}.
 */
export type OsFsRenameOptions = {
  /**
   * Pre-filled name; skips the rename prompt when set.
   * Slashes and backslashes are stripped from the final segment.
   */
  userInput?: string
  /**
   * When `true` (default), waits two animation frames before opening the prompt
   * so context menus can close cleanly. Set to `false` when the UI is already idle.
   */
  deferPrompt?: boolean
}

/**
 * Virtual filesystem syscalls. Paths are Unix-style (`/`, `/docs/foo.txt`).
 * Mutations refresh the global node list and bump desktop revision when needed.
 */
export type OsFsApi = {
  /**
   * Read a file's UTF-8 text content.
   * @param path - Absolute normalized path.
   * @returns File body (empty string if the file exists but has no content).
   * @throws If the filesystem is not initialized or the path does not exist.
   */
  read: (path: string) => Promise<string>

  /**
   * Write UTF-8 text to a file, creating or overwriting it.
   * @param path - Absolute normalized path.
   * @param content - Full new file body.
   */
  write: (path: string, content: string) => Promise<void>

  /**
   * Delete a file or directory tree.
   * Protected paths (e.g. seed roots) are ignored with a console warning.
   * @param path - Absolute normalized path.
   */
  delete: (path: string) => Promise<void>

  /**
   * Rename or move by changing the path segment (programmatic rename).
   * For user-driven rename with a dialog, use {@link OsFsApi.rename.interactive}.
   * @param oldPath - Current absolute path.
   * @param newPath - Destination absolute path (same parent = rename only).
   */
  renameTo: (oldPath: string, newPath: string) => Promise<void>

  /**
   * Move a node into a directory.
   * @param srcPath - Source absolute path.
   * @param destDir - Destination directory path.
   * @returns Final path after the move.
   */
  move: (srcPath: string, destDir: string) => Promise<string>

  /**
   * Duplicate a file or directory into a directory.
   * @param srcPath - Source absolute path.
   * @param destDir - Destination directory path.
   * @returns Path of the new copy (may be uniquified).
   */
  duplicate: (srcPath: string, destDir: string) => Promise<string>

  /**
   * Create an empty directory.
   * @param path - Absolute path of the new directory.
   */
  mkdir: (path: string) => Promise<void>

  /**
   * List immediate children of a directory.
   * @param dirPath - Directory absolute path.
   */
  listChildren: (dirPath: string) => Promise<FsNode[]>

  /**
   * List wallpaper/desktop shortcut entries under `/desktop`.
   * Used to build the desktop icon grid and Start menu links.
   */
  listDesktopEntries: () => Promise<DesktopEntry[]>

  /**
   * Resolve the shell icon for a desktop entry (shortcut target, extension, or app stub).
   * @param entry - Row from {@link listDesktopEntries}.
   */
  resolveDesktopIcon: (entry: DesktopEntry) => Promise<IconSource>

  /**
   * Persist icon grid positions for desktop items.
   * @param updates - Desktop paths with new `gridX` / `gridY` in workspace cells.
   */
  saveDesktopPositions: (
    updates: ReadonlyArray<{ desktopPath: string; gridX: number; gridY: number }>,
  ) => Promise<void>

  /**
   * Reload all nodes from IndexedDB into `useFsStore((s) => s.nodes)`.
   * Call after external mutations if you bypass other `os.fs` methods.
   */
  refreshNodes: () => Promise<void>

  /**
   * Open a path using the extension router: directories → My Computer,
   * `.txt` → Notepad, `.app` / `.www` / `.md` per {@link extensionRouter}.
   * @param path - File or directory absolute path.
   */
  open: (path: string) => Promise<void>

  /**
   * Rename a desktop item (file, folder, or `.desktop` shortcut label).
   * Handles desktop-specific naming rules and returns the final path.
   * @param desktopPath - Path under `/desktop`.
   * @param label - New display name (not a full path).
   * @returns Final absolute path after rename.
   */
  renameDesktopItem: (desktopPath: string, label: string) => Promise<string>

  /** Create operations (folders, documents, shortcuts). */
  create: {
    /**
     * Create a folder with a generated default name (no rename prompt).
     * @param parentDir - Parent directory path.
     * @returns Path of the new folder.
     */
    folder: (parentDir: string) => Promise<string>

    /**
     * Create a folder, then prompt the user to rename it (Windows-style "New Folder").
     * @param parentDir - Parent directory path.
     * @returns Final path after rename (or original if the user cancels).
     */
    folderWithRename: (parentDir: string) => Promise<string>

    /**
     * Create an empty `.txt` at the next `untitled-N` path, then prompt to rename.
     * @param parentDir - Parent directory path (e.g. `/docs`, `/desktop`).
     * @returns Final path after rename.
     * @throws If the filesystem is not ready.
     */
    textDocument: (parentDir: string) => Promise<string>

    /**
     * Create a `.desktop` shortcut on the wallpaper pointing at `targetPath`.
     * @param targetPath - File or directory the shortcut opens.
     * @param label - Optional shortcut label (defaults from target basename).
     * @returns Path of the new `.desktop` file.
     */
    shortcutOnDesktop: (targetPath: string, label?: string) => Promise<string>
  }

  /** Rename operations. */
  rename: {
    /**
     * Rename a file, folder, or desktop item with an optional modal prompt.
     * Desktop paths use label rename; other paths compute a new path from user input.
     * On failure, shows an error dialog and returns the original path.
     * @param path - Item to rename.
     * @param options - Prompt behavior; see {@link OsFsRenameOptions}.
     * @returns Final absolute path after rename.
     */
    interactive: (path: string, options?: OsFsRenameOptions) => Promise<string>
  }
}

/**
 * Window manager syscalls: launch apps and control window chrome.
 * Low-level `dispatch` / drag geometry are not exposed here; use
 * {@link useWindowManager} inside window frame code if needed.
 */
export type OsWinApi = {
  /**
   * Open or focus an application window.
   * @param appId - Registry id (e.g. `computer`, `notepad`).
   * @param options - Title override, launch payload, maximize/center flags.
   */
  openApp: WindowManagerApi['openApp']

  /** Close and remove a window from the session. */
  close: (windowId: WindowId) => void

  /** Bring a window to the front and mark it focused. */
  focus: (windowId: WindowId) => void

  /** Minimize a window to the taskbar. */
  minimize: (windowId: WindowId) => void

  /** Restore a minimized window to its previous geometry. */
  restore: (windowId: WindowId) => void

  /** Minimize if normal; restore if minimized. */
  toggleMinimize: (windowId: WindowId) => void

  /**
   * Maximize a window within the workspace.
   * @param windowId - Target window.
   * @param frame - Workspace bounds used to compute maximized size.
   */
  maximize: (windowId: WindowId, frame: NormalGeometry) => void

  /** Restore a maximized window to normal mode. */
  unmaximize: (windowId: WindowId) => void

  /**
   * Read-only session snapshot: windows, focus, z-order.
   * Subscribe via `useWindowManager()` if you need reactive updates.
   */
  session: WindowManagerApi['session']

  /**
   * App definition map (`appId` → lazy root, icon, default title).
   * Used for icons and programmatic launches.
   */
  registry: WindowManagerApi['registry']

  /**
   * Ref to the desktop workspace element (taskbar area excluded).
   * Used for maximize bounds and hit-testing.
   */
  workspaceRef: WindowManagerApi['workspaceRef']
}

/**
 * Shell UI syscalls: blocking dialogs backed by {@link ShellModalProvider}.
 */
export type OsUiApi = {
  /**
   * Show a Yes/No (or custom labels) confirmation dialog.
   * @returns `true` if the user confirmed, `false` if cancelled.
   */
  confirm: (options: ShellConfirmOptions) => Promise<boolean>

  /**
   * Show a single-line text prompt.
   * @returns Trimmed user input, or `null` if cancelled.
   */
  prompt: (options: ShellPromptOptions) => Promise<string | null>

  /**
   * Open the read-only Properties dialog for a desktop item.
   * Non-blocking; does not return a promise.
   */
  showProperties: ShellModalApi['showProperties']
}

/**
 * Shell clipboard syscalls. Paths are normalized on copy/cut.
 * Paste resolves conflicts and respects cut vs copy semantics.
 */
export type OsClipboardApi = {
  /**
   * Copy one or more paths to the clipboard (snapshot at copy time).
   * @param paths - Absolute paths to copy.
   */
  copy: (paths: string[]) => void

  /**
   * Cut one or more paths; items are removed from the source on paste.
   * @param paths - Absolute paths to cut.
   */
  cut: (paths: string[]) => void

  /** Whether the clipboard holds at least one path. */
  hasContent: () => boolean

  /**
   * Paste clipboard contents onto the desktop (`/desktop`).
   * No-op if the clipboard is empty or the filesystem is not ready.
   */
  pasteToDesktop: () => Promise<void>

  /**
   * Paste clipboard contents into a directory.
   * @param destDir - Destination directory absolute path.
   */
  pasteToDirectory: (destDir: string) => Promise<void>
}

/**
 * My Computer / explorer integration syscalls.
 * Requires the Computer app to register a per-window navigator.
 */
export type OsExplorerApi = {
  /**
   * After creating or renaming in the focused Computer window, navigate to
   * `parentDir` and select `finalPath`. No-op if focus is not a Computer window.
   * @param parentDir - Directory to show.
   * @param finalPath - Item to select in the folder view.
   */
  reveal: (parentDir: string, finalPath: string) => void

  /**
   * Resolve the parent directory for a "New …" action in My Computer.
   * Prefers context target, then selected directory, then `currentDir`.
   */
  resolveCreateParentDir: (
    currentDir: string,
    selectedPath: string | null,
    nodes: FsNode[],
    targetNode?: FsNode | null,
  ) => string

  /**
   * Parent directory for a generic new item (folder/shortcut) from a context target.
   * Directories use their own path; files use `parentPath`.
   */
  newItemParentDir: (node: FsNode) => string

  /**
   * Parent directory for a new text document from a context target.
   * Files on `/desktop` stay on desktop; others default to `/docs`.
   */
  newTextDocumentParentDir: (node: FsNode) => string

  /**
   * Navigate the focused Computer window, if any.
   * @param dir - Directory to open.
   * @param selected - Optional file path to select in the folder pane.
   */
  navigateFocused: (dir: string, selected?: string | null) => void

  /**
   * Read the "new item" parent dir registered by a specific Computer window.
   * @param windowId - Window id from `data-window-id`, or `null`.
   * @returns Parent dir, or `undefined` if the window has no navigator.
   */
  getCreateParentDir: (windowId: string | null) => string | undefined
}

/**
 * Appearance and display preference syscalls.
 * Mutations persist to `localStorage` and apply CSS variables on `:root`.
 */
export type OsSettingsApi = {
  /** Current settings snapshot. */
  get: () => SettingsV1

  /**
   * Subscribe to any settings change (for {@link useOsSettings} / {@link AppearanceSync}).
   * @returns Unsubscribe function.
   */
  subscribe: (listener: () => void) => () => void

  /** Apply a color scheme preset to the whole shell and apps. */
  setColorScheme: (id: ColorSchemeId) => void

  /** Switch between WinXP asset cursors and system default cursors. */
  setCursorMode: (mode: CursorMode) => void

  /** Set solid-color desktop wallpaper. */
  setWallpaperColor: (hex: string) => void

  /** Set UI font size tier. */
  setFontSize: (size: FontSizeId) => void

  /** Presets for the Settings color-scheme radio list. */
  listColorSchemes: () => ReadonlyArray<{ id: ColorSchemeId; label: string }>

  /** Font size options for the Settings Display panel. */
  listFontSizes: () => ReadonlyArray<{ id: FontSizeId; label: string; px: number }>
}

/**
 * Unified portfolio OS API. Obtain via {@link useOs} in React components.
 *
 * @example
 * ```ts
 * const os = useOs()
 * await os.fs.read('/docs/readme.md')
 * os.win.openApp('notepad', { launch: { path: '/docs/readme.md' } })
 * ```
 */
export type OsApi = {
  /** Virtual filesystem (IndexedDB). */
  fs: OsFsApi
  /** Window manager. */
  win: OsWinApi
  /** Shell dialogs. */
  ui: OsUiApi
  /** Shell clipboard. */
  clipboard: OsClipboardApi
  /** My Computer navigation helpers. */
  explorer: OsExplorerApi
  /** User appearance / display preferences. */
  settings: OsSettingsApi
}

/** Launch payload passed to {@link OsWinApi.openApp} (`launch.path`, etc.). */
export type { WindowLaunch }
