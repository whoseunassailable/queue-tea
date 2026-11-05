import type { Rectangle } from 'electron'

// What the window was showing before an update restart, or null when no window
// was open, so the new copy opens as you left it.
export type Restored = { hash: string; bounds: Rectangle; isInFront: boolean } | null

const PLIST_VERSION = /<key>CFBundleShortVersionString<\/key>\s*<string>([^<]+)<\/string>/

export const versionOfPlist = (plist: string): string | null => PLIST_VERSION.exec(plist)?.[1] ?? null

// Waits for this app to end, then opens the bundle again. -g keeps it behind
// whatever you're using. Backgrounded, so the run returns at once.
export const relaunchArgv = (pid: number, bundle: string, isInFront: boolean): string[] => [
  '/bin/sh',
  '-c',
  `(while kill -0 "$1" 2>/dev/null; do sleep 0.2; done; open ${isInFront ? '' : '-g '}"$2") >/dev/null 2>&1 &`,
  'sh',
  String(pid),
  bundle,
]

const isNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value)

// The file is ours, but it's still read from disk: anything off is ignored and
// the app opens as it always does.
export const restoredOf = (text: string): Restored | undefined => {
  const value: unknown = JSON.parse(text)
  if (value === null) return null
  if (typeof value !== 'object') return undefined
  const { hash, bounds, isInFront } = value as Record<string, unknown>
  const box = (bounds ?? {}) as Record<string, unknown>
  if (typeof hash !== 'string' || typeof isInFront !== 'boolean' || ![box.x, box.y, box.width, box.height].every(isNumber)) return undefined

  return { hash, bounds: { x: box.x as number, y: box.y as number, width: box.width as number, height: box.height as number }, isInFront }
}
