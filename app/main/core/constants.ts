// Under the home folder, with forward slashes as the engine writes them.
export const projectsFolder = (home: string): string => `${home}/.queue-tea/projects`

export const SETTINGS_FILE = 'settings.json'
export const LOG_FILE = 'queue-tea.log'

// Events arrive in bursts around an atomic replace; this gathers one burst.
export const WATCH_SETTLE_MS = 120

export const WINDOW = { width: 1280, height: 800, minWidth: 720, minHeight: 560 } as const

// The app never runs these. Git commands appear only as text to copy.
export const FORBIDDEN_GIT = ['commit', 'push', 'merge', 'pull'] as const
