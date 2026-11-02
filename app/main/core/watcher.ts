import { watch } from 'node:fs'
import type { FSWatcher } from 'node:fs'
import { mkdir, readdir, stat } from 'node:fs/promises'

import type { Logger } from './logger'

export type Stamps = Record<string, number>

// Whether anything was added, removed or rewritten between two looks.
export const hasChanged = (before: Stamps, after: Stamps): boolean => {
  const names = Object.keys(after)

  return names.length !== Object.keys(before).length || names.some(name => before[name] !== after[name])
}

// When each file in a folder last changed. A file can go between the listing
// and the stat, in which case it is simply not there.
const stampsOf = async (folder: string): Promise<Stamps> => {
  const stamps: Stamps = {}
  const entries = await readdir(folder, { withFileTypes: true })
  await Promise.all(
    entries
      .filter(e => e.isFile())
      .map(async e => {
        try {
          stamps[`${folder}/${e.name}`] = (await stat(`${folder}/${e.name}`)).mtimeMs
        } catch {
          // Gone since the listing: see above.
        }
      }),
  )

  return stamps
}

export type WatchOptions = { settleMs: number; sweepMs: number; log: Logger }

// Watches folders and not files: the atomic replace swaps the file, so a watch
// on it goes stale. fs.watch can drop or repeat events, so every event is
// checked against the files' times, and a slow sweep catches a dropped one.
export const watchFolders = async (folders: string[], onChange: () => void, { settleMs, sweepMs, log }: WatchOptions): Promise<() => void> => {
  const look = async (): Promise<Stamps> => Object.assign({}, ...(await Promise.all(folders.map(stampsOf))))
  await Promise.all(folders.map(folder => mkdir(folder, { recursive: true })))
  let seen = await look()
  let settling: ReturnType<typeof setTimeout> | null = null

  const check = async () => {
    try {
      const now = await look()
      if (!hasChanged(seen, now)) return
      seen = now
      log.debug('records or sessions changed')
      onChange()
    } catch (err) {
      log.error('checking the watched folders failed', err)
    }
  }
  const settle = () => {
    if (settling !== null) clearTimeout(settling)
    settling = setTimeout(() => void check(), settleMs)
  }

  const watchers: FSWatcher[] = folders.map(folder => watch(folder, settle))
  for (const watcher of watchers) watcher.on('error', err => log.error('a folder watch failed', err))
  const sweep = setInterval(() => void check(), sweepMs)

  return () => {
    clearInterval(sweep)
    if (settling !== null) clearTimeout(settling)
    for (const watcher of watchers) watcher.close()
  }
}
