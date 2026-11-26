import type { Difficulty, Priority } from '../../../../../types'
import { cleanTag, DAILY_TEMPLATE, freeTitle, INBOX, isTitleTaken, linksOf, NOTE_FOLDER_BAD, NOTE_LIMITS, NOTE_TITLE_BAD, noteTitled, openItemsOf, questIdOf } from '../../../../shared/notes'
import type { Note, NoteChange, NoteInput, NoteType, QuestProposal } from '../../../../shared/notes'
import { dayOf } from '../../../core/domain/format'
import { NOTE_LIST_PAGE_SIZE } from '../../../core/constants/constants'
import { t } from '../../../l10n/en'
import type { ReadableView } from '../../workspace/state_management/workspace_store'

// folder is null for the Pinned group.
export type FolderGroup = { folder: string | null; notes: Note[] }
// A folder can't start with a space, so this never meets a folder name.
export const folderKeyOf = (group: FolderGroup): string => group.folder ?? ' pinned'

// A folded folder takes one place too, bounding a realm with many folders.
// Keep the full group for its count and only render this page's visible notes.
export const folderPageOf = (groups: readonly FolderGroup[], folded: ReadonlySet<string>, requested: number) => {
  const sizeOf = (group: FolderGroup) => folded.has(folderKeyOf(group)) ? 1 : Math.max(1, group.notes.length)
  const pages = Math.max(1, Math.ceil(groups.reduce((sum, group) => sum + sizeOf(group), 0) / NOTE_LIST_PAGE_SIZE))
  const page = Math.max(0, Math.min(pages - 1, requested))
  const start = page * NOTE_LIST_PAGE_SIZE
  const end = start + NOTE_LIST_PAGE_SIZE
  const shown: (FolderGroup & { visible: Note[] })[] = []
  let at = 0
  for (const group of groups) {
    const size = sizeOf(group)
    if (at < end && at + size > start) shown.push({ ...group, visible: folded.has(folderKeyOf(group)) ? [] : group.notes.slice(Math.max(0, start - at), end - at) })
    at += size
    if (at >= end) break
  }

  return { groups: shown, page, pages }
}

const words = (query: string) => query.toLowerCase().split(/\s+/).filter(word => word !== '')
const searchText = new WeakMap<Note, { text: string; tags: string[] }>()

// IPC replies and saved edits replace notes. A weak key releases old bodies
// and ensures an edited note never inherits the previous search text.
const searchable = (note: Note) => {
  const kept = searchText.get(note)
  if (kept !== undefined) return kept
  const tags = note.tags.map(tag => tag.toLowerCase())
  const made = { text: `${note.title}\n${note.body}\n${tags.map(tag => `#${tag}`).join(' ')}`.toLowerCase(), tags }
  searchText.set(note, made)

  return made
}

// A note matches when every word is in its title, body or tags; a #word
// matches tags only.
const matching = (query: string) => {
  const terms = words(query)

  return (note: Note): boolean => {
    if (terms.length === 0) return true
    const { text, tags } = searchable(note)

    return terms.every(word => (word.startsWith('#') ? tags.some(tag => tag.startsWith(word.slice(1))) : text.includes(word)))
  }
}
export const matches = (note: Note, query: string): boolean => matching(query)(note)

// Pinned notes first, in their own group and not in their folder too; then
// Inbox, then the rest A to Z; newest note first in each. Archived notes
// show in their folders.
export const foldersOf = (notes: readonly Note[], query: string, isArchived: boolean): FolderGroup[] => {
  const match = matching(query)
  const shown = notes.filter(note => note.isArchived === isArchived && match(note)).sort((a, b) => b.updated.localeCompare(a.updated))
  const pinned: Note[] = []
  const folders = new Map<string, Note[]>()
  for (const note of shown) {
    if (!isArchived && note.isPinned) pinned.push(note)
    else {
      if (!folders.has(note.folder)) folders.set(note.folder, [])
      folders.get(note.folder)!.push(note)
    }
  }
  const names = [...folders.keys()].sort((a, b) => (a === INBOX ? -1 : b === INBOX ? 1 : a.localeCompare(b)))

  return [...(pinned.length > 0 ? [{ folder: null, notes: pinned }] : []), ...names.map(folder => ({ folder, notes: folders.get(folder)! }))]
}

// notes and id, when given, check the title is free among the live notes.
export const titleError = (title: string, notes: readonly Note[] = [], id: string | null = null): string | undefined => {
  const trimmed = title.trim()
  if (trimmed === '') return t.notebook.titleRequired
  if (trimmed.length > NOTE_LIMITS.title) return t.notebook.titleLong
  if (NOTE_TITLE_BAD.test(trimmed)) return t.notebook.titleBad
  if (isTitleTaken(notes, trimmed, id)) return t.notebook.titleTaken(trimmed)

  return undefined
}

export const folderError = (folder: string): string | undefined => {
  if (folder.trim().length > NOTE_LIMITS.folder) return t.notebook.folderLong
  if (NOTE_FOLDER_BAD.test(folder)) return t.notebook.folderSlash

  return undefined
}

// A folder's new name, which can't be empty.
export const folderNameError = (folder: string): string | undefined => (folder.trim() === '' ? t.notebook.folderRequired : folderError(folder))

// "Untitled", or "Untitled 2" when that was taken.
export const isUntitled = (title: string): boolean => {
  const name = t.notebook.untitled

  return title === name || (title.startsWith(`${name} `) && /^\d+$/.test(title.slice(name.length + 1)))
}

// Picking a template gives a note its type and starting text. A Daily note
// still called Untitled takes today's date as its title.
export const templateChange = (type: NoteType, title: string, notes: readonly Note[], id: string, today: string): Partial<NoteChange> => {
  const named = type === 'daily' && isUntitled(title) ? freeTitle(notes, today, id) : title

  return { type, body: type === 'daily' ? dailyBodyOf(notes, today, named) : t.notebook.templates[type], ...(named === title ? {} : { title: named }) }
}

// A day's note is the live note titled with its date, as Obsidian names
// daily notes. A date that doesn't exist, such as 2026-02-30, isn't a day.
export const isDay = (title: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(title) && localDay(new Date(`${title}T12:00`)) === title

export const dayError = (day: string): string | undefined => (day.trim() === '' ? t.notebook.dayRequired : isDay(day.trim()) ? undefined : t.notebook.dayBad)

// What a new day starts with: the realm's "Daily template" note when it has
// text, else the built-in one. {{date}} and {{title}} become the day and title.
export const dailyBodyOf = (notes: readonly Note[], day: string, title = day): string => {
  const own = noteTitled(notes, DAILY_TEMPLATE)?.body ?? ''

  return (own.trim() === '' ? t.notebook.templates.daily : own).replace(/\{\{\s*date\s*\}\}/g, () => day).replace(/\{\{\s*title\s*\}\}/g, () => title)
}

// The journal: the live days that match, newest first, a group per month.
export const journalOf = (notes: readonly Note[], query: string): FolderGroup[] => {
  const match = matching(query)
  const days = notes.filter(note => !note.isArchived && isDay(note.title) && match(note)).sort((a, b) => b.title.localeCompare(a.title))
  const months = new Map<string, Note[]>()
  for (const day of days) {
    const month = day.title.slice(0, 7)
    if (!months.has(month)) months.set(month, [])
    months.get(month)!.push(day)
  }

  return [...months].map(([month, days]) => ({
    folder: `${t.months[Number(month.slice(5)) - 1]} ${month.slice(0, 4)}`,
    notes: days,
  }))
}

export const tagsOf = (text: string): string[] => [...new Set(text.split(',').map(cleanTag).filter(tag => tag !== ''))]

export const tagsError = (text: string): string | undefined => {
  const tags = tagsOf(text)
  if (tags.some(tag => tag.length > NOTE_LIMITS.tag)) return t.notebook.tagLong
  if (tags.length > NOTE_LIMITS.tags) return t.notebook.tooManyTags

  return undefined
}

const CAPTURE_TITLE = 80

// A jotted line becomes a note: its first line, cleaned, is the title, and the
// whole text is the body when the title couldn't hold it.
export const captureOf = (text: string): NoteInput | null => {
  const trimmed = text.trim()
  if (trimmed === '') return null
  const first = trimmed.split('\n')[0]!.replace(new RegExp(NOTE_TITLE_BAD.source, 'g'), ' ').replace(/\s+/g, ' ').trim()
  const cut = first.length <= CAPTURE_TITLE ? first : `${first.slice(0, first.lastIndexOf(' ', CAPTURE_TITLE) > 20 ? first.lastIndexOf(' ', CAPTURE_TITLE) : CAPTURE_TITLE)}…`
  const title = cut === '' ? t.notebook.untitled : cut

  return { title, folder: INBOX, body: title === trimmed ? '' : trimmed }
}

// When a note was edited, as the list says it: "Today 14:02", "Yesterday" or
// "5 Nov". today and yesterday are local days, YYYY-MM-DD.
export const whenOf = (iso: string, today: string, yesterday: string): string => {
  const day = iso.slice(0, 10)
  if (day === today) return t.notebook.today(iso.slice(11, 16))
  if (day === yesterday) return t.notebook.yesterday

  return dayOf(iso)
}

export const localDay = (at: Date): string => `${at.getFullYear()}-${String(at.getMonth() + 1).padStart(2, '0')}-${String(at.getDate()).padStart(2, '0')}`

// The line of a note that links to a title, for its backlink.
export const linkLineOf = (body: string, title: string): string | null =>
  body
    .split('\n')
    .map(line => line.trim())
    .find(line => linksOf(line).some(linked => linked.toLowerCase() === title.toLowerCase())) ?? null

// The 1-based line a checklist item sits on.
export const lineOf = (body: string, item: string): number | null => {
  const at = body.split('\n').findIndex(line => /^\s*[-*+] \[ \] /.test(line) && line.replace(/^\s*[-*+] \[ \] /, '').trim().slice(0, NOTE_LIMITS.item) === item)

  return at === -1 ? null : at + 1
}

export const tickedItemsOf = (body: string): string[] =>
  body
    .split('\n')
    .map(line => /^\s*[-*+] \[[xX]\] (.+)$/.exec(line)?.[1]?.trim() ?? '')
    .filter(item => item !== '')

const TASK_LINE = /^(\s*(?:>\s*)*(?:[-*+]|\d+[.)])\s+\[)([ xX])(\]\s+\S)/
const FENCE = /^\s*(?:>\s*)*(```|~~~)/

// Ticks or unticks the index-th checklist line, counted as the Read view
// shows the boxes: in order, leaving out lines inside fenced code.
// shortcut: counts lines by pattern, so a task-like line in indented (4-space) code shifts the count; upgrade to the lexer's positions if that bites.
export const toggleTaskAt = (body: string, index: number): string => {
  const lines = body.split('\n')
  let fence: string | null = null
  let n = -1
  for (const [i, line] of lines.entries()) {
    const opened = FENCE.exec(line)
    if (opened !== null) {
      fence = fence === null ? opened[1]! : fence === opened[1] ? null : fence
      continue
    }
    if (fence !== null || !TASK_LINE.test(line)) continue
    n += 1
    if (n !== index) continue
    lines[i] = line.replace(TASK_LINE, (_, before: string, mark: string, after: string) => `${before}${mark === ' ' ? 'x' : ' '}${after}`)

    return lines.join('\n')
  }

  return body
}

// What BrewQuest's card says about the note.
export const brewLineOf = (note: Pick<Note, 'body' | 'quests'>, proposal: QuestProposal): string => {
  const waiting = proposal.quests.length
  if (note.quests.length === 0) return openItemsOf(note.body).length === 0 ? t.notebook.brew.asOne : t.notebook.brew.canBe(waiting)

  return waiting === 0 ? t.notebook.brew.allFiled(note.quests.length) : t.notebook.brew.someLeft(note.quests.length, waiting)
}

// BrewQuest's robot shows what it's doing in one of seven moods.
export const BREW_MOODS = ['idle', 'hover', 'thinking', 'working', 'success', 'confused', 'error'] as const
export type BrewMood = (typeof BREW_MOODS)[number]
// Something BrewQuest is busy with, for as long as it lasts.
export type BrewActivity = 'thinking' | 'working'
// How BrewQuest takes what just happened, shown for a moment.
export type BrewReaction = 'success' | 'confused' | 'error'

// An error is never hidden, being busy comes before a reaction, and a reaction
// before the pointer, so filing that ends under the pointer still shows success.
export const brewMoodOf = ({ activity, reaction, isNear }: { activity: BrewActivity | null; reaction: BrewReaction | null; isNear: boolean }): BrewMood => {
  if (reaction === 'error') return 'error'
  if (activity !== null) return activity
  if (reaction !== null) return reaction
  if (isNear) return 'hover'

  return 'idle'
}

// The robot in the review sheet: busy while filing, upset when filing failed,
// puzzled when the note has nothing left to file.
export const sheetMoodOf = ({ isFiling, hasFailed, isEmpty }: { isFiling: boolean; hasFailed: boolean; isEmpty: boolean }): BrewMood => {
  if (isFiling) return 'working'
  if (hasFailed) return 'error'
  if (isEmpty) return 'confused'

  return 'idle'
}

// How well a title fits what's typed: starting with it, then a word starting
// with it, then holding it anywhere; 3 is no match.
const rankOf = (query: string) => {
  const q = query.trim().toLowerCase()

  return (title: string): number => {
    const low = title.toLowerCase()
    if (low.startsWith(q)) return 0
    if (low.split(/\s+/).some(word => word.startsWith(q))) return 1

    return low.includes(q) ? 2 : 3
  }
}

// The notes the [[ picker offers, best fit first, newest first in each. A note
// titled like a quest link isn't one, since linking it would link the quest.
export const linkOptionsOf = (notes: readonly Note[], query: string, exceptId: string, most: number): Note[] => {
  const rank = rankOf(query)

  return notes
    .filter(note => !note.isArchived && note.id !== exceptId && questIdOf(note.title) === null && rank(note.title) < 3)
    .sort((a, b) => rank(a.title) - rank(b.title) || b.updated.localeCompare(a.updated))
    .slice(0, most)
}

export type QuestPick = { id: string; title: string; state: QuestState }

// What the [[ picker offers: notes, then the quests in play, which are the ones
// Quests can open. Up to questRows rows are kept for quests, and each side
// fills what the other leaves. Quests in progress come first in each fit.
export const linkPicksOf = (notes: readonly Note[], quests: Map<string, QuestLine>, query: string, exceptId: string, rows: number, questRows: number): { notes: Note[]; quests: QuestPick[] } => {
  const rank = rankOf(query)
  const found = [...quests]
    .flatMap(([id, line]) => (line.title !== null && IN_PLAY.includes(line.state) && rank(line.title) < 3 ? [{ id, title: line.title, state: line.state }] : []))
    .sort((a, b) => rank(a.title) - rank(b.title) || IN_PLAY.indexOf(a.state) - IN_PLAY.indexOf(b.state))
  const picked = linkOptionsOf(notes, query, exceptId, rows - Math.min(found.length, questRows))

  return { notes: picked, quests: found.slice(0, rows - picked.length) }
}

// The [[ being typed at the caret, and what follows it so far, on one line.
export const linkQueryAt = (body: string, caret: number): { start: number; query: string } | null => {
  const line = body.slice(body.lastIndexOf('\n', caret - 1) + 1, caret)
  const open = line.lastIndexOf('[[')
  if (open === -1) return null
  const query = line.slice(open + 2)
  if (query.includes(']') || query.includes('[') || query.length > NOTE_LIMITS.title) return null

  return { start: caret - query.length, query }
}

export const withLink = (body: string, start: number, caret: number, title: string): { body: string; caret: number } => {
  const after = body.slice(caret).startsWith(']]') ? body.slice(caret + 2) : body.slice(caret)
  const inserted = `${title}]]`

  return { body: body.slice(0, start) + inserted + after, caret: start + inserted.length }
}

export type QuestState = 'waiting' | 'sealed' | 'active' | 'done' | 'gone'
// priority and difficulty are null where the queue no longer says them.
export type QuestLine = { title: string | null; state: QuestState; priority: Priority | null; difficulty: Difficulty | null }

// Where a quest filed from a note is now, read from the queue itself, so a
// note never keeps its own copy to go stale.
export const questLinesOf = (view: ReadableView): Map<string, QuestLine> => {
  const lines = new Map<string, QuestLine>()
  const add = (entries: ReadableView['ready'], state: QuestState) => {
    for (const entry of entries) {
      lines.set(entry.quest.id, { title: entry.quest.title, state, priority: entry.quest.priority, difficulty: entry.quest.difficulty })
      if (entry.kind === 'saga') for (const chapter of entry.chapters) lines.set(chapter.id, { title: chapter.title, state, priority: chapter.priority, difficulty: chapter.difficulty })
    }
  }
  add(view.ready, 'waiting')
  add(view.sealed, 'sealed')
  for (const victory of view.victories) lines.set(victory.id, { title: victory.title, state: 'done', priority: null, difficulty: null })
  for (const quest of view.activeQuests) lines.set(quest.id, { title: quest.title, state: 'active', priority: quest.priority, difficulty: quest.difficulty })

  return lines
}

export const questLineOf = (lines: Map<string, QuestLine>, id: string): QuestLine => lines.get(id) ?? { title: null, state: 'gone', priority: null, difficulty: null }

// In the order the [[ picker offers them.
const IN_PLAY: readonly QuestState[] = ['active', 'waiting', 'sealed']

// Whether a quest can still take more under it.
export const isInPlay = (lines: Map<string, QuestLine>, id: string): boolean => IN_PLAY.includes(questLineOf(lines, id).state)
