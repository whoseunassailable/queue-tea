import type { Difficulty, Priority } from '../../../../../types'
import { BREW_LIMITS, isDraftKey } from '../../../../shared/brew_draft'
import type { BrewDraft, DraftParent, DraftQuest, EffortPoints } from '../../../../shared/brew_draft'
import { NOTE_LIMITS } from '../../../../shared/notes'
import type { DraftChange, DraftOutcome, NoteQuest, ProposalGroup, ProposedQuest, QuestProposal } from '../../../../shared/notes'
import { t } from '../../../l10n/en'

// A drafted quest as Rohan reviews it: what he may change, whether he keeps
// it, and the quest he merged it into. criteria are the lines as typed. draft
// is what BrewQuest drafted, so the outcome can say what changed.
export type ReviewRow = {
  key: string
  title: string
  priority: Priority
  difficulty: Difficulty
  points: EffortPoints
  summary: string
  criteria: string[]
  isIn: boolean
  mergedInto: string | null
  draft: DraftQuest
}
// isParentIn: whether a new parent is filed with its quests; without it they stand alone.
export type ReviewGroup = { key: string; parent: DraftParent; parentTitle: string; isParentIn: boolean; rows: ReviewRow[] }
export type Review = { draft: BrewDraft; groups: ReviewGroup[] }

// What the note already lists: a quest with its key or, for a checklist draft, its line.
export type Filed = { row: (row: ReviewRow) => boolean; parent: (group: ReviewGroup) => boolean }

// A quest BrewQuest found already in the realm starts left out, so filing it
// takes a choice; everything else starts in.
export const reviewOf = (draft: BrewDraft): Review => ({
  draft,
  groups: draft.groups.map(group => ({
    key: group.key,
    parent: group.parent,
    parentTitle: group.parent.kind === 'new' ? group.parent.title : '',
    isParentIn: true,
    rows: group.quests.map(quest => ({
      key: quest.key,
      title: quest.title,
      priority: quest.priority,
      difficulty: quest.difficulty,
      points: quest.points,
      summary: quest.summary,
      criteria: quest.criteria,
      isIn: quest.match?.kind !== 'same',
      mergedInto: null,
      draft: quest,
    })),
  })),
})

export const rowsOf = (review: Pick<Review, 'groups'>): ReviewRow[] => review.groups.flatMap(group => group.rows)

export const withRow = (review: Review, key: string, patch: Partial<ReviewRow>): Review => ({
  ...review,
  groups: review.groups.map(group => ({ ...group, rows: group.rows.map(row => (row.key === key ? { ...row, ...patch } : row)) })),
})

export const withGroup = (review: Review, key: string, patch: Partial<Pick<ReviewGroup, 'parentTitle' | 'isParentIn'>>): Review => ({
  ...review,
  groups: review.groups.map(group => (group.key === key ? { ...group, ...patch } : group)),
})

// Folds a quest into another: it's filed as part of that one, never on its own.
// A quest others are merged into can't be merged itself, so a merge is one step.
export const mergedInto = (review: Review, from: string, into: string | null): Review => {
  if (into !== null && (from === into || rowsOf(review).some(row => row.mergedInto === from))) return review

  return withRow(review, from, { mergedInto: into })
}

// The quests a row may be merged into: the others that are in and not merged themselves.
export const mergeTargetsOf = (review: Review, key: string): ReviewRow[] => rowsOf(review).filter(row => row.key !== key && row.isIn && row.mergedInto === null)

const isSent = (row: ReviewRow, filed: Filed) => row.isIn && row.mergedInto === null && !filed.row(row)

// What Rohan sees under the File button: the quests it files, and the parents filed with them.
export const countOf = (review: Review, filed: Filed): { quests: number; parents: number } => {
  const sent = review.groups.map(group => group.rows.filter(row => isSent(row, filed)).length)
  const parents = review.groups.filter((group, i) => group.parent.kind === 'new' && group.isParentIn && !filed.parent(group) && sent[i]! > 0).length

  return { quests: sent.reduce((sum, n) => sum + n, 0), parents }
}

export type ReviewErrors = { rows: Record<string, string>; parents: Record<string, string>; none?: string }

export const questTitleError = (title: string): string | undefined => {
  if (title.trim() === '') return t.notebook.brew.questTitleRequired
  if (title.trim().length > NOTE_LIMITS.title) return t.notebook.brew.titleLong

  return undefined
}

export const parentTitleError = (title: string): string | undefined => {
  if (title.trim() === '') return t.notebook.brew.parentRequired
  if (title.trim().length > NOTE_LIMITS.title) return t.notebook.brew.titleLong

  return undefined
}

export const summaryError = (summary: string): string | undefined => (summary.trim().length > BREW_LIMITS.summary ? t.notebook.brew.summaryLong(BREW_LIMITS.summary) : undefined)

// The criteria as typed, one a line; the empty lines are left out.
export const criteriaOf = (lines: readonly string[]): string[] => lines.map(line => line.trim()).filter(line => line !== '')

export const criteriaError = (lines: readonly string[]): string | undefined => {
  const criteria = criteriaOf(lines)
  if (criteria.length > BREW_LIMITS.criteria) return t.notebook.brew.criteriaMany(BREW_LIMITS.criteria)

  return criteria.some(line => line.length > BREW_LIMITS.criterion) ? t.notebook.brew.criterionLong(BREW_LIMITS.criterion) : undefined
}

// The first problem with a row that's being filed, or none.
export const rowError = (review: Review, row: ReviewRow, filed: Filed): string | undefined => {
  if (row.mergedInto !== null) {
    const into = rowsOf(review).find(other => other.key === row.mergedInto)

    return into !== undefined && into.isIn && !filed.row(into) ? undefined : t.notebook.brew.mergeTargetOut
  }
  if (!isSent(row, filed)) return undefined

  return questTitleError(row.title) ?? summaryError(row.summary) ?? criteriaError(row.criteria)
}

export const errorsOf = (review: Review, filed: Filed): ReviewErrors => {
  const rows = Object.fromEntries(rowsOf(review).flatMap(row => (row.isIn || row.mergedInto !== null ? [[row.key, rowError(review, row, filed)]] : [])).filter(([, error]) => error !== undefined)) as Record<string, string>
  const count = countOf(review, filed)
  const parents = Object.fromEntries(
    review.groups.flatMap(group => {
      const isSentWith = group.parent.kind === 'new' && group.isParentIn && !filed.parent(group) && group.rows.some(row => isSent(row, filed))
      const error = isSentWith ? parentTitleError(group.parentTitle) : undefined

      return error === undefined ? [] : [[group.key, error]]
    }),
  ) as Record<string, string>

  return { rows, parents, ...(count.quests === 0 ? { none: t.notebook.brew.pickOne } : {}) }
}

export const hasErrors = (errors: ReviewErrors): boolean => Object.keys(errors.rows).length > 0 || Object.keys(errors.parents).length > 0 || errors.none !== undefined

const once = <T>(items: T[], by: (item: T) => string): T[] => items.filter((item, i) => items.findIndex(other => by(other) === by(item)) === i)

// What the review files. A checklist draft sends what the checklist always
// sent; a Claude draft sends each quest with its key and what BrewQuest wrote,
// the quests merged into it folded in, and waits only on quests that are
// filed, now or before.
export const proposalFrom = (review: Review, filed: Filed, filedKeys: ReadonlySet<string>): QuestProposal => {
  const isClaude = review.draft.by === 'claude'
  const rows = rowsOf(review)
  const finalKey = (key: string) => rows.find(row => row.key === key)?.mergedInto ?? key
  const sentKeys = new Set(rows.filter(row => isSent(row, filed)).map(row => row.key))
  const questOf = (row: ReviewRow): ProposedQuest => {
    const base = { title: row.title.trim(), priority: row.priority, difficulty: row.difficulty, item: row.draft.item }
    if (!isClaude) return base
    const merged = rows.filter(other => other.mergedInto === row.key)
    const all = [row, ...merged]
    const waits = all.flatMap(one => one.draft.waitsFor).map(wait => (isDraftKey(wait) ? finalKey(wait) : wait))
    const summary = merged.length === 0 ? row.summary.trim() : [row.summary.trim(), t.notebook.brew.alsoCovers(merged.map(one => one.title.trim()))].filter(part => part !== '').join('\n\n')

    return {
      ...base,
      key: row.key,
      summary: summary.slice(0, BREW_LIMITS.summary),
      criteria: once(all.flatMap(one => criteriaOf(one.criteria)), line => line.toLowerCase()).slice(0, BREW_LIMITS.criteria),
      points: row.points,
      waitsFor: once(
        waits.filter(wait => wait !== row.key && (!isDraftKey(wait) || sentKeys.has(wait) || filedKeys.has(wait))),
        wait => wait,
      ),
      sources: once(
        all.flatMap(one => one.draft.sources),
        source => `${source.title}\n${source.quote}`,
      )
        .slice(0, BREW_LIMITS.sources)
        .map(source => ({ title: source.title, quote: source.quote })),
      doubts: once(
        all.flatMap(one => one.draft.doubts),
        doubt => doubt,
      ).slice(0, BREW_LIMITS.doubts + 1),
    }
  }
  const groups = review.groups
    .map((group): ProposalGroup => {
      const parent = group.parent.kind === 'existing' ? { kind: 'task' as const, id: group.parent.id } : group.parent.kind === 'new' && group.isParentIn ? { kind: 'new' as const, title: group.parentTitle.trim() } : { kind: 'none' as const }

      return { ...(isClaude ? { key: group.key } : {}), parent, quests: group.rows.filter(row => isSent(row, filed)).map(questOf) }
    })
    .filter(group => group.quests.length > 0)

  return isClaude ? { groups, draft: outcomeFrom(review) } : { groups }
}

// What Rohan did with BrewQuest's draft, kept so its next drafts in the realm learn from it.
export const outcomeFrom = (review: Review): DraftOutcome => {
  const rows = rowsOf(review)
  const kept = rows.filter(row => row.isIn && row.mergedInto === null)
  const changed = kept.flatMap((row): DraftChange[] =>
    (
      [
        ['priority', row.draft.priority, row.priority],
        ['difficulty', row.draft.difficulty, row.difficulty],
        ['points', String(row.draft.points), String(row.points)],
      ] as const
    ).flatMap(([field, from, to]) => (from === to ? [] : [{ title: row.title.trim(), field, from, to }])),
  )

  return {
    id: review.draft.id,
    by: review.draft.by,
    proposed: rows.length,
    rejected: rows.filter(row => !row.isIn && row.mergedInto === null && row.draft.match?.kind !== 'same').map(row => row.draft.title),
    merged: rows.filter(row => row.mergedInto !== null).length,
    reused: rows.filter(row => !row.isIn && row.mergedInto === null && row.draft.match?.kind === 'same').length,
    changed,
  }
}

// Whether the note lists a row's quest already: by its key for a Claude
// draft, by its checklist line for a checklist one. A checklist parent counts
// as filed once the note has more parents than when the sheet opened.
export const filedIn = (quests: readonly NoteQuest[], draft: Pick<BrewDraft, 'by'>, parentsAtStart: number): Filed =>
  draft.by === 'claude'
    ? { row: row => quests.some(q => q.key === row.key), parent: group => quests.some(q => q.key === group.key) }
    : { row: row => quests.some(q => q.item === row.draft.item), parent: group => group.parent.kind === 'new' && quests.filter(q => q.item === null).length > parentsAtStart }

export const filedKeysOf = (quests: readonly NoteQuest[]): Set<string> => new Set(quests.flatMap(q => (q.key === undefined ? [] : [q.key])))
