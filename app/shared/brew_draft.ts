// What BrewQuest drafts from a note before anything is filed: groups of quests,
// each with what it's for, how big it looks, how to tell it's done, where in the
// note it came from, what BrewQuest isn't sure of, and any quest already in the
// realm that covers it. docs/brewquest.md has the whole flow.
import type { Difficulty, Priority, TaskState } from '../../types'
import { linksOf, NOTE_LIMITS, proposalOf } from './notes'
import type { Note } from './notes'

// Relative effort, never minutes: the planning-poker steps.
export const EFFORT_POINTS = [1, 2, 3, 5, 8, 13] as const
export type EffortPoints = (typeof EFFORT_POINTS)[number]
export const isEffortPoints = (value: unknown): value is EffortPoints => EFFORT_POINTS.includes(value as EffortPoints)
// The step nearest a number, the larger one on a tie; 3 for anything that isn't one.
export const pointsNear = (value: unknown): EffortPoints => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 3

  return EFFORT_POINTS.reduce((best, step) => (Math.abs(step - value) <= Math.abs(best - value) ? step : best), EFFORT_POINTS[0])
}

// The points a difficulty stands for when nothing better is known.
export const POINTS_BY_DIFFICULTY: Readonly<Record<Difficulty, EffortPoints>> = { light: 1, medium: 3, hard: 8 }

export const BREW_LIMITS = {
  quests: NOTE_LIMITS.quests,
  groups: 12,
  criteria: 10,
  criterion: 300,
  summary: 2000,
  understood: 1000,
  doubts: 6,
  doubt: 300,
  sources: 4,
  quote: 500,
  questions: 8,
  question: 300,
  missing: 8,
  why: 300,
  // The notes beside the one being brewed that a draft may read: linked from it or to it.
  linked: 5,
} as const

// A draft's id, and the keys of its groups and quests inside it: d-lq9x2a1b.g1,
// d-lq9x2a1b.q3. A quest filed from a draft keeps its key on the note, so a
// try again never files it twice.
export const DRAFT_ID = /^d-[a-z0-9]{4,24}$/
export const DRAFT_KEY = /^d-[a-z0-9]{4,24}\.[gq][0-9]{1,3}$/
export const isDraftKey = (value: unknown): value is string => typeof value === 'string' && DRAFT_KEY.test(value)
export const draftKeyOf = (draftId: string, kind: 'g' | 'q', n: number): string => `${draftId}.${kind}${n}`

// Where a draft quest came from: a note, and its words. isFound says whether
// those words really are in the note, so a quote BrewQuest made up shows as one.
export type DraftSource = { noteId: string; title: string; quote: string; isFound: boolean }
// A quest already in the realm that covers a draft quest: the same idea, or part of it.
// by says who saw it: BrewQuest, reading the realm, or the titles being alike;
// why is BrewQuest's reason, and empty for a match by title.
export type DraftMatch = { id: string; title: string; state: TaskState; kind: 'same' | 'overlaps'; why: string; by: 'brewquest' | 'title' }
export type DraftQuest = {
  key: string
  title: string
  // What it's for, in a sentence or two; it opens the quest's description.
  summary: string
  priority: Priority
  difficulty: Difficulty
  points: EffortPoints
  criteria: string[]
  // Quests it can't start before: keys in this draft, or ids of quests in the realm.
  waitsFor: string[]
  sources: DraftSource[]
  doubts: string[]
  match: DraftMatch | null
  // The unticked checklist line it came from, if it came from one.
  item: string | null
}
// What a group's quests go under: a quest already in the realm, a new one filed
// with them, or nothing, when they stand on their own.
export type DraftParent = { kind: 'existing'; id: string; title: string; why: string } | { kind: 'new'; title: string; why: string } | { kind: 'none' }
export type DraftGroup = { key: string; parent: DraftParent; quests: DraftQuest[] }
export type BrewDraft = {
  id: string
  // claude: BrewQuest read the note and the realm with Claude Code. checklist:
  // one quest per unticked line, as BrewQuest did before it could read.
  by: 'claude' | 'checklist'
  // What BrewQuest took the note to be about; empty for a checklist draft.
  understood: string
  groups: DraftGroup[]
  // Decisions it needs from Rohan before the plan holds.
  questions: string[]
  // Context it looked for and couldn't find, so it didn't guess.
  missing: string[]
  // What it read: the notes, and the realm's files it opened.
  read: { notes: { id: string; title: string }[]; files: string[] }
  // Why this is a checklist draft when Claude was asked for; null otherwise.
  trouble: string | null
  // What past reviews in this realm taught it, as it was told them.
  learned: string[]
}
// claude reads with Claude Code; checklist drafts at once from the unticked lines.
// withLinked lets the notes linked from it, and to it, inform the draft.
export type DraftAsk = { mode: 'claude' | 'checklist'; withLinked: boolean }

// A quest in the realm, as the matcher and BrewQuest's brief see it.
export type RealmQuest = { id: string; title: string; state: TaskState; parentIds: string[]; priority: Priority; description: string | null }

const STOP = new Set(['a', 'an', 'the', 'and', 'or', 'of', 'to', 'for', 'in', 'on', 'at', 'by', 'with', 'from', 'into', 'is', 'it', 'its', 'be', 'so', 'that', 'this', 'as', 'up', 'out', 'new', 'add', 'added', 'fix', 'fixed', 'make', 'update', 'improve', 'support', 'allow', 'let', 'can', 'should', 'need', 'needs'])
const stem = (word: string) => word.replace(/(ings|ing|ies|ied|es|ed|s)$/, '').replace(/y$/, 'i')
// A stop word stays one in its other forms too, so "fixes" says no more than "fix".
const STOP_STEMS = new Set([...STOP].filter(word => word.length > 2).map(stem))
export const wordsOf = (title: string): Set<string> => new Set(title.toLowerCase().normalize('NFKD').replace(/[^\p{L}\p{N}\s]+/gu, ' ').split(/\s+/).filter(word => word.length > 1 && !STOP.has(word)).map(stem).filter(word => word !== '' && !STOP_STEMS.has(word)))

// How alike two titles are, from 0 to 1: the share of their words they have in common.
export const likeness = (a: string, b: string): number => {
  const left = wordsOf(a)
  const right = wordsOf(b)
  if (left.size === 0 || right.size === 0) return 0
  const shared = [...left].filter(word => right.has(word)).length

  return shared / (left.size + right.size - shared)
}

export const SAME_AT = 0.75
export const OVERLAPS_AT = 0.4

// The quest in the realm whose title is most like this one, when it's alike
// enough to mention. Removed quests are gone, so they never match.
export const titleMatchOf = (title: string, realm: readonly RealmQuest[]): DraftMatch | null => {
  let best: { quest: RealmQuest; score: number } | null = null
  for (const quest of realm) {
    if (quest.state === 'removed') continue
    const score = likeness(title, quest.title)
    const shared = [...wordsOf(title)].filter(word => wordsOf(quest.title).has(word)).length
    if (score < OVERLAPS_AT || (score < SAME_AT && shared < 2)) continue
    if (best === null || score > best.score) best = { quest, score }
  }
  if (best === null) return null
  const kind = best.score >= SAME_AT ? 'same' : 'overlaps'

  return { id: best.quest.id, title: best.quest.title, state: best.quest.state, kind, why: '', by: 'title' }
}

// Each quest that BrewQuest didn't match is checked by its title too.
export const withTitleMatches = (draft: BrewDraft, realm: readonly RealmQuest[]): BrewDraft => ({
  ...draft,
  groups: draft.groups.map(group => ({ ...group, quests: group.quests.map(quest => (quest.match === null ? { ...quest, match: titleMatchOf(quest.title, realm.filter(other => !(group.parent.kind === 'existing' && other.id === group.parent.id))) } : quest)) })),
})

// BrewQuest's first way: one quest per unticked - [ ] line not filed yet, under
// the note's own quest while it's open, or a new one named after the note.
export const checklistDraftOf = (id: string, note: Pick<Note, 'id' | 'title' | 'body' | 'quests'>, realm: readonly RealmQuest[], trouble: string | null = null): BrewDraft => {
  const isOpen = (questId: string) => realm.some(quest => quest.id === questId && (quest.state === 'queued' || quest.state === 'current'))
  const proposal = proposalOf(note, isOpen)
  const parent: DraftParent =
    proposal.parent.kind === 'task'
      ? { kind: 'existing', id: proposal.parent.id, title: realm.find(quest => quest.id === (proposal.parent as { id: string }).id)?.title ?? note.title, why: '' }
      : proposal.parent.kind === 'new'
        ? { kind: 'new', title: proposal.parent.title, why: '' }
        : { kind: 'none' }
  const quests = proposal.quests.map((quest, i): DraftQuest => ({
    key: draftKeyOf(id, 'q', i + 1),
    title: quest.title,
    summary: '',
    priority: quest.priority,
    difficulty: quest.difficulty,
    points: POINTS_BY_DIFFICULTY[quest.difficulty],
    criteria: [],
    waitsFor: [],
    sources: quest.item === null ? [] : [{ noteId: note.id, title: note.title, quote: quest.item, isFound: true }],
    doubts: [],
    match: null,
    item: quest.item,
  }))
  const draft: BrewDraft = {
    id,
    by: 'checklist',
    understood: '',
    groups: quests.length === 0 ? [] : [{ key: draftKeyOf(id, 'g', 1), parent, quests }],
    questions: [],
    missing: [],
    read: { notes: [{ id: note.id, title: note.title }], files: [] },
    trouble,
    learned: [],
  }

  return withTitleMatches(draft, realm)
}

export const draftQuestsOf = (draft: Pick<BrewDraft, 'groups'>): DraftQuest[] => draft.groups.flatMap(group => group.quests)

// The notes a draft may read beside this one: those it links to, then those
// that link to it, archived ones left out, each once, at most BREW_LIMITS.linked.
export const linkedNotesOf = <T extends Pick<Note, 'id' | 'title' | 'body' | 'isArchived'>>(note: Pick<Note, 'id' | 'title' | 'body'>, notes: readonly T[]): T[] => {
  const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase()
  const others = notes.filter(other => other.id !== note.id && !other.isArchived)
  const to = linksOf(note.body).flatMap(title => others.filter(other => same(other.title, title)))
  const from = others.filter(other => linksOf(other.body).some(title => same(title, note.title)))

  return [...to, ...from].filter((other, i, all) => all.findIndex(one => one.id === other.id) === i).slice(0, BREW_LIMITS.linked)
}
