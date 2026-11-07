import { NOTE_HISTORY_LIMITS } from '../../../../shared/notes'
import type { NoteVersion } from '../../../../shared/notes'

// Frequent autosaves retain detail near the present without displacing every
// older recovery point. Buckets use UTC, so daylight saving cannot merge them.
export const versionsToKeep = (versions: readonly NoteVersion[]): NoteVersion[] => {
  const sorted = [...versions].sort((a, b) => b.id.localeCompare(a.id))
  const recent = sorted.slice(0, NOTE_HISTORY_LIMITS.recent)
  const hourly: NoteVersion[] = []
  const daily: NoteVersion[] = []
  const hours = new Set<string>()
  const days = new Set<string>()
  for (const version of sorted.slice(NOTE_HISTORY_LIMITS.recent)) {
    const hour = version.savedAt.slice(0, 13)
    if (hourly.length < NOTE_HISTORY_LIMITS.hourly) {
      if (!hours.has(hour)) hourly.push(version)
      hours.add(hour)
    } else {
      const day = version.savedAt.slice(0, 10)
      if (!days.has(day) && daily.length < NOTE_HISTORY_LIMITS.daily) daily.push(version)
      days.add(day)
    }
  }

  return [...recent, ...hourly, ...daily]
}
