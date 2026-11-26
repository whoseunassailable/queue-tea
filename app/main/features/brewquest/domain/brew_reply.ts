import type { Difficulty, Priority } from '../../../../../types'
import { BREW_LIMITS, draftKeyOf, isEffortPoints, pointsNear, POINTS_BY_DIFFICULTY, withTitleMatches } from '../../../../shared/brew_draft'
import type { BrewDraft, DraftGroup, DraftMatch, DraftParent, DraftQuest, DraftSource, RealmQuest } from '../../../../shared/brew_draft'
import { NOTE_LIMITS, openItemsOf } from '../../../../shared/notes'
import type { Note } from '../../../../shared/notes'
import { DRAFT_BLOCK } from './brew_brief'

const PRIORITIES: readonly Priority[] = ['urgent', 'high', 'mid', 'okay', 'low']
const DIFFICULTIES: readonly Difficulty[] = ['light', 'medium', 'hard']
const LOCAL_KEY = /^q[0-9]{1,3}$/

export type ReplyContext = {
  id: string
  // The note being brewed first, then the notes beside it that BrewQuest read.
  notes: readonly Pick<Note, 'id' | 'title' | 'body'>[]
  realm: readonly RealmQuest[]
  // Words for what main corrected, written for Rohan.
  said: { unknownParent: string; parentNotOpen: string; tooMany: (left: number) => string; loopLeftOut: (title: string) => string }
}

export type ReplyRead = { kind: 'draft'; draft: BrewDraft } | { kind: 'unreadable'; why: 'no-block' | 'bad-json' | 'not-a-draft' }

type Raw = Record<string, unknown>
const isRaw = (value: unknown): value is Raw => typeof value === 'object' && value !== null && !Array.isArray(value)
const text = (value: unknown, limit: number): string => (typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, limit) : '')
// Each line once, the empty ones left out, at most count of them.
const texts = (value: unknown, count: number, limit: number): string[] => {
  if (!Array.isArray(value)) return []
  const kept: string[] = []
  for (const one of value.map(line => text(line, limit))) {
    if (one !== '' && !kept.some(other => other.toLowerCase() === one.toLowerCase())) kept.push(one)
  }

  return kept.slice(0, count)
}
const squash = (words: string) => words.replace(/\s+/g, ' ').trim().toLowerCase()

// The last block tagged for BrewQuest in Claude's reply, as JSON.
export const blockOf = (reply: string): { kind: 'found'; value: unknown } | { kind: 'unreadable'; why: 'no-block' | 'bad-json' } => {
  const blocks = [...reply.matchAll(new RegExp(`\`\`\`${DRAFT_BLOCK}[^\\n]*\\n([\\s\\S]*?)\\n\`\`\``, 'g'))]
  const last = blocks.at(-1)?.[1]
  if (last === undefined) return { kind: 'unreadable', why: 'no-block' }
  try {
    return { kind: 'found', value: JSON.parse(last) }
  } catch {
    // Claude wrote the block but not as JSON: the caller says the draft didn't read.
    return { kind: 'unreadable', why: 'bad-json' }
  }
}

// Open, and under no quest that's still there: only such a quest takes others.
const isOpenTopLevel = (quest: RealmQuest, realm: readonly RealmQuest[]) =>
  (quest.state === 'queued' || quest.state === 'current') && !quest.parentIds.some(id => realm.some(other => other.id === id && other.state !== 'removed'))

// A parent BrewQuest named, checked against the realm: one that's gone, done or
// under another quest can't take quests, so they stand on their own instead.
const parentOf = (raw: unknown, why: string, ctx: ReplyContext): { parent: DraftParent; doubt: string | null } => {
  if (!isRaw(raw)) return { parent: { kind: 'none' }, doubt: null }
  if (typeof raw.existing === 'string') {
    const quest = ctx.realm.find(one => one.id === raw.existing && one.state !== 'removed')
    if (quest === undefined) return { parent: { kind: 'none' }, doubt: ctx.said.unknownParent }
    if (!isOpenTopLevel(quest, ctx.realm)) return { parent: { kind: 'none' }, doubt: ctx.said.parentNotOpen }

    return { parent: { kind: 'existing', id: quest.id, title: quest.title, why }, doubt: null }
  }
  const title = text(raw.new, NOTE_LIMITS.title)

  return title === '' ? { parent: { kind: 'none' }, doubt: null } : { parent: { kind: 'new', title, why }, doubt: null }
}

const sourcesOf = (raw: unknown, ctx: ReplyContext): DraftSource[] => {
  if (!Array.isArray(raw)) return []
  const [primary] = ctx.notes

  return raw
    .filter(isRaw)
    .map((one): DraftSource | null => {
      const quote = text(one.quote, BREW_LIMITS.quote)
      if (quote === '' || primary === undefined) return null
      const named = typeof one.note === 'string' ? ctx.notes.find(note => squash(note.title) === squash(one.note as string)) : undefined
      const note = named ?? primary

      return { noteId: note.id, title: note.title, quote, isFound: squash(`${note.title}\n${note.body}`).includes(squash(quote)) }
    })
    .filter((one): one is DraftSource => one !== null)
    .slice(0, BREW_LIMITS.sources)
}

const matchOf = (raw: unknown, ctx: ReplyContext): DraftMatch | null => {
  if (!isRaw(raw) || typeof raw.id !== 'string') return null
  const quest = ctx.realm.find(one => one.id === raw.id && one.state !== 'removed')
  if (quest === undefined) return null

  return { id: quest.id, title: quest.title, state: quest.state, kind: raw.kind === 'same' ? 'same' : 'overlaps', why: text(raw.why, BREW_LIMITS.why), by: 'brewquest' }
}

// True when a waiting for b would close a loop through the waits kept so far.
const wouldLoop = (waits: Map<string, string[]>, a: string, b: string): boolean => {
  const seen = new Set<string>()
  const stack = [b]
  while (stack.length > 0) {
    const at = stack.pop()!
    if (at === a) return true
    if (seen.has(at)) continue
    seen.add(at)
    stack.push(...(waits.get(at) ?? []))
  }

  return false
}

// Claude's draft, made safe to show and to file: every field checked and cut to
// its limit, its keys made the draft's own, parents and matches checked against
// the realm, quotes checked against the notes, and waits that would loop or name
// nothing dropped. Quests it didn't match are matched by title.
export const draftOfReply = (reply: string, ctx: ReplyContext): ReplyRead => {
  const block = blockOf(reply)
  if (block.kind === 'unreadable') return block
  const value = block.value
  if (!isRaw(value) || !Array.isArray(value.groups)) return { kind: 'unreadable', why: 'not-a-draft' }

  const open = new Set(openItemsOf(ctx.notes[0]?.body ?? ''))
  const keys = new Map<string, string>()
  const titles = new Map<string, string>()
  const raws: { group: number; raw: Raw }[] = []
  const groups: DraftGroup[] = []
  const questions = texts(value.questions, BREW_LIMITS.questions, BREW_LIMITS.question)
  let n = 0
  let left = 0
  for (const rawGroup of value.groups.filter(isRaw).slice(0, BREW_LIMITS.groups)) {
    const why = text(rawGroup.why, BREW_LIMITS.why)
    const { parent, doubt } = parentOf(rawGroup.parent, why, ctx)
    const quests: DraftQuest[] = []
    for (const raw of (Array.isArray(rawGroup.quests) ? rawGroup.quests : []).filter(isRaw)) {
      const title = text(raw.title, NOTE_LIMITS.title)
      if (title === '') continue
      if (n >= BREW_LIMITS.quests) {
        left += 1
        continue
      }
      n += 1
      const key = draftKeyOf(ctx.id, 'q', n)
      if (typeof raw.key === 'string' && LOCAL_KEY.test(raw.key) && !keys.has(raw.key)) keys.set(raw.key, key)
      titles.set(key, title)
      const difficulty = DIFFICULTIES.find(one => one === raw.difficulty) ?? 'medium'
      const item = typeof raw.item === 'string' && open.has(raw.item.trim()) ? raw.item.trim() : null
      quests.push({
        key,
        title,
        summary: text(raw.summary, BREW_LIMITS.summary),
        priority: PRIORITIES.find(one => one === raw.priority) ?? 'mid',
        difficulty,
        points: isEffortPoints(raw.points) ? raw.points : typeof raw.points === 'number' ? pointsNear(raw.points) : POINTS_BY_DIFFICULTY[difficulty],
        criteria: texts(raw.criteria, BREW_LIMITS.criteria, BREW_LIMITS.criterion),
        waitsFor: [],
        sources: sourcesOf(raw.sources, ctx),
        doubts: [...(doubt === null ? [] : [doubt]), ...texts(raw.doubts, BREW_LIMITS.doubts, BREW_LIMITS.doubt)].slice(0, BREW_LIMITS.doubts),
        match: matchOf(raw.match, ctx),
        item,
      })
      raws.push({ group: groups.length, raw })
    }
    if (quests.length > 0) groups.push({ key: draftKeyOf(ctx.id, 'g', groups.length + 1), parent, quests })
  }

  // Waits once every key is known, so a quest can wait for one drafted after it.
  const waits = new Map<string, string[]>()
  const all = groups.flatMap(group => group.quests)
  raws.forEach(({ raw }, i) => {
    const quest = all[i]!
    const kept: string[] = []
    for (const name of Array.isArray(raw.waitsFor) ? raw.waitsFor : []) {
      if (typeof name !== 'string') continue
      const target = keys.get(name) ?? (ctx.realm.some(one => one.id === name && one.state !== 'removed' && one.state !== 'done') ? name : null)
      if (target === null || target === quest.key || kept.includes(target)) continue
      if (wouldLoop(waits, quest.key, target)) {
        quest.doubts = [...quest.doubts, ctx.said.loopLeftOut(titles.get(target) ?? target)].slice(0, BREW_LIMITS.doubts + 1)
        continue
      }
      kept.push(target)
      waits.set(quest.key, kept)
    }
    quest.waitsFor = kept
  })

  const draft: BrewDraft = {
    id: ctx.id,
    by: 'claude',
    understood: text(value.understood, BREW_LIMITS.understood),
    groups,
    questions: left > 0 ? [...questions, ctx.said.tooMany(left)] : questions,
    missing: texts(value.missing, BREW_LIMITS.missing, BREW_LIMITS.question),
    read: { notes: ctx.notes.map(note => ({ id: note.id, title: note.title })), files: texts(value.files, 20, 200) },
    trouble: null,
    learned: [],
  }

  return { kind: 'draft', draft: withTitleMatches(draft, ctx.realm) }
}
