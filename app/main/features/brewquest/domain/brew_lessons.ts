import { DRAFT_ID } from '../../../../shared/brew_draft'
import { NOTE_LIMITS } from '../../../../shared/notes'
import type { DraftChange, DraftOutcome } from '../../../../shared/notes'

// What BrewQuest keeps of Rohan's reviews in a realm, and what it reads back
// from them before its next draft: only what he did, never a guess at why.
export const OUTCOME_LIMITS = { kept: 20, rejected: 50, changed: 50, shown: 3 } as const

// An outcome as it's kept: when, and how many quests were filed from it.
export type KeptOutcome = DraftOutcome & { at: string; filed: number }

const FIELDS: readonly DraftChange['field'][] = ['priority', 'difficulty', 'points']
const isCount = (value: unknown): value is number => typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 1_000
const word = (value: unknown, limit: number): string | null => (typeof value === 'string' && value.trim() !== '' ? value.trim().slice(0, limit) : null)

// The outcome the window sent with a filing, or null when it isn't one; a
// review that can't be read is left out of learning rather than refusing the filing.
export const outcomeOf = (value: unknown): DraftOutcome | null => {
  if (typeof value !== 'object' || value === null) return null
  const v = value as Record<string, unknown>
  if (typeof v.id !== 'string' || !DRAFT_ID.test(v.id) || (v.by !== 'claude' && v.by !== 'checklist')) return null
  if (!isCount(v.proposed) || !isCount(v.merged) || !isCount(v.reused) || !Array.isArray(v.rejected) || !Array.isArray(v.changed)) return null
  const rejected = v.rejected.map(title => word(title, NOTE_LIMITS.title)).filter((title): title is string => title !== null)
  const changed = v.changed.flatMap((one: unknown): DraftChange[] => {
    if (typeof one !== 'object' || one === null) return []
    const c = one as Record<string, unknown>
    const field = FIELDS.find(f => f === c.field)
    const title = word(c.title, NOTE_LIMITS.title)
    const from = word(c.from, 20)
    const to = word(c.to, 20)

    return field === undefined || title === null || from === null || to === null || from === to ? [] : [{ title, field, from, to }]
  })

  return { id: v.id, by: v.by, proposed: v.proposed, rejected: rejected.slice(0, OUTCOME_LIMITS.rejected), merged: v.merged, reused: v.reused, changed: changed.slice(0, OUTCOME_LIMITS.changed) }
}

// The kept outcomes read back from the file: the ones that still read, newest last.
export const keptOf = (value: unknown): KeptOutcome[] => {
  if (!Array.isArray(value)) return []

  return value
    .flatMap((one: unknown): KeptOutcome[] => {
      const outcome = outcomeOf(one)
      const v = (one ?? {}) as Record<string, unknown>
      if (outcome === null || typeof v.at !== 'string' || !isCount(v.filed)) return []

      return [{ ...outcome, at: v.at, filed: v.filed }]
    })
    .slice(-OUTCOME_LIMITS.kept)
}

const RANK: Record<string, number> = { urgent: 5, high: 4, mid: 3, okay: 2, low: 1, light: 1, medium: 2, hard: 3 }
const rankOf = (field: DraftChange['field'], value: string) => (field === 'points' ? Number(value) : (RANK[value] ?? 0))
const quoted = (titles: string[]) =>
  titles
    .slice(0, OUTCOME_LIMITS.shown)
    .map(title => `"${title}"`)
    .join(', ')
const times = (n: number) => (n === 1 ? 'once' : `${n} times`)
const quests = (n: number) => (n === 1 ? '1 quest' : `${n} quests`)

// What the last reviews showed, one line each, for the brief. Only Claude's
// drafts count, since a checklist draft says nothing about BrewQuest's judgment.
export const lessonsOf = (outcomes: readonly KeptOutcome[]): string[] => {
  const drafts = outcomes.filter(outcome => outcome.by === 'claude')
  if (drafts.length === 0) return []
  const proposed = drafts.reduce((sum, one) => sum + one.proposed, 0)
  const rejected = drafts.flatMap(one => one.rejected)
  const merged = drafts.reduce((sum, one) => sum + one.merged, 0)
  const reused = drafts.reduce((sum, one) => sum + one.reused, 0)
  const lessons = [`Rohan reviewed ${drafts.length === 1 ? '1 draft' : `${drafts.length} drafts`} with ${quests(proposed)} in this realm.`]
  if (rejected.length > 0) lessons.push(`He turned down ${quests(rejected.length)}, such as ${quoted([...rejected].reverse())}.`)
  if (merged > 0) lessons.push(`He merged ${quests(merged)} into another drafted quest before filing.`)
  if (reused > 0) lessons.push(`He left ${quests(reused)} to a quest already in the realm instead of filing a new one.`)
  for (const field of FIELDS) {
    const changes = drafts.flatMap(one => one.changed).filter(change => change.field === field)
    if (changes.length === 0) continue
    const up = changes.filter(change => rankOf(field, change.to) > rankOf(field, change.from)).length
    const down = changes.length - up
    const name = field === 'points' ? 'the effort points' : `the ${field}`
    const ways = [up > 0 ? `raised ${name} ${times(up)}` : null, down > 0 ? `lowered ${name} ${times(down)}` : null].filter(way => way !== null)
    lessons.push(`He ${ways.join(' and ')}, as on "${changes.at(-1)!.title}" (${changes.at(-1)!.from} to ${changes.at(-1)!.to}).`)
  }

  return lessons
}
