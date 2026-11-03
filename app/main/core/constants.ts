// Under the home folder, with forward slashes as the engine writes them.
export const projectsFolder = (home: string): string => `${home}/.queue-tea/projects`

export const SETTINGS_FILE = 'settings.json'
export const LOG_FILE = 'queue-tea.log'

// Events arrive in bursts around an atomic replace; this gathers one burst.
export const WATCH_SETTLE_MS = 120

export const WINDOW = { width: 1280, height: 800, minWidth: 720, minHeight: 560 } as const

// The app never runs these. Git commands appear only as text to copy.
export const FORBIDDEN_GIT = ['commit', 'push', 'merge', 'pull'] as const

// Longer than any command or path the window has reason to copy.
export const COPY_LIMIT = 4_096

// Where gh may be. An app opened from the Finder has no shell PATH to find it on.
export const GH_PATHS = ['/opt/homebrew/bin/gh', '/usr/local/bin/gh', '/usr/bin/gh']
export const GH_CODE_WAIT_MS = 20_000
// As long as GitHub's own one-time code lasts.
export const GH_LOGIN_WAIT_MS = 15 * 60_000

// How often the app looks for a newer copy of itself on disk.
export const UPDATE_CHECK_MS = 30_000
// Left in the settings folder by an update restart, for the new copy to read once.
export const RESTART_FILE = 'restart.json'
// Run in the window: true while a restart would lose something, which is a
// dialog open or a text field holding the keyboard.
export const BUSY_PROBE = "document.querySelector('[role=dialog]') !== null || ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName ?? '') || document.activeElement?.isContentEditable === true"
