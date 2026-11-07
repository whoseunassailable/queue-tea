import { describe, expect, it } from 'vitest'

import type { NoteVersion } from '../../../../shared/notes'
import { versionsToKeep } from './note_history'

const NOW = Date.parse('2026-11-07T12:00:00Z')
const HOUR = 3_600_000
const version = (at: number): NoteVersion => ({ id: String(at), savedAt: new Date(at).toISOString() })

describe('bounded note history', () => {
  it('keeps every version while there are fewer than 50', () => {
    const versions = Array.from({ length: 49 }, (_, n) => version(NOW - n))
    expect(versionsToKeep(versions)).toEqual(versions)
  })

  it('keeps 50 recent saves, 24 older hourly versions and 26 daily versions, newest first', () => {
    const burst = Array.from({ length: 50 }, (_, n) => version(NOW - n))
    const older = Array.from({ length: 24 * 40 }, (_, n) => version(NOW - (n + 1) * HOUR))
    const kept = versionsToKeep([...older].reverse().concat(burst))
    expect(kept).toHaveLength(100)
    expect(kept.slice(0, 50)).toEqual(burst)
    expect(kept.slice(50, 74)).toEqual(older.slice(0, 24))
    expect(new Set(kept.slice(74).map(v => v.savedAt.slice(0, 10))).size).toBe(26)
    expect(kept.some(v => Date.parse(v.savedAt) < NOW - 20 * 24 * HOUR)).toBe(true)
  })

  it('a burst of autosaves cannot evict the hourly and daily recovery points', () => {
    let versions = Array.from({ length: 40 }, (_, n) => version(NOW - (n + 1) * 24 * HOUR))
    for (let n = 0; n < 300; n += 1) versions = versionsToKeep([...versions, version(NOW + n * 800)])
    expect(versions.length).toBeLessThanOrEqual(100)
    expect(versions.slice(0, 50).map(v => v.id)).toEqual(Array.from({ length: 50 }, (_, n) => String(NOW + (299 - n) * 800)))
    expect(versions.some(v => Date.parse(v.savedAt) < NOW - 20 * 24 * HOUR)).toBe(true)
  })
})
