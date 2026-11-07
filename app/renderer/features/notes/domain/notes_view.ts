import type { Difficulty, Priority } from '../../../../../types'
import { cleanTag, freeTitle, INBOX, isTitleTaken, linksOf, NOTE_FOLDER_BAD, NOTE_LIMITS, NOTE_TITLE_BAD, openItemsOf } from '../../../../shared/notes'
import type { Note, NoteChange, NoteInput, NoteType, QuestProposal } from '../../../../shared/notes'
import { dayOf } from '../../../core/domain/format'
import { t } from '../../../l10n/en'
import type { ReadableView } from '../../workspace/state_management/workspace_store'

// folder is null for the Pinned group.
export type FolderGroup = { folder: string | null; notes: Note[] }

const words = (query: string) => query.toLowerCase().split(/\s+/).filter(word => word !== '')

// A note matches when every word is in its title, body or tags; a #word
// matches tags only.
export const matches = (note: Note, query: string): boolean => {
  const text = `${note.title}\n${note.body}\n${note.tags.map(tag => `#${tag}`).join(' ')}`.toLowerCase()
  const tags = note.tags.map(tag => tag.toLowerCase())

  return words(query).every(word => (word.startsWith('#') ? tags.some(tag => tag.startsWith(word.slice(1))) : text.includes(word)))
}

// Pinned notes first, in their own group and not in their folder too; then
// Inbox, then the rest A to Z; newest note first in each. Archived notes
// show in their folders.
export const foldersOf = (notes: readonly Note[], query: string, isArchived: boolean): FolderGroup[] => {
  const shown = notes.filter(note => note.isArchived === isArchived && matches(note, query)).sort((a, b) => b.updated.localeCompare(a.updated))
  const pinned = isArchived ? [] : shown.filter(note => note.isPinned)
  const filed = shown.filter(note => !pinned.includes(note))
  const names = [...new Set(filed.map(note => note.folder))].sort((a, b) => (a === INBOX ? -1 : b === INBOX ? 1 : a.localeCompare(b)))

  return [...(pinned.length > 0 ? [{ folder: null, notes: pinned }] : []), ...names.map(folder => ({ folder, notes: filed.filter(note => note.folder === folder) }))]
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
export const templateChange = (type: NoteType, title: string, notes: readonly Note[], id: string, today: string): Partial<NoteChange> => ({
  type,
  body: t.notebook.templates[type],
  ...(type === 'daily' && isUntitled(title) ? { title: freeTitle(notes, today, id) } : {}),
})

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

// The notes the [[ picker offers: titles starting with what's typed first,
// then a word starting with it, then holding it anywhere; newest first in each.
export const linkOptionsOf = (notes: readonly Note[], query: string, exceptId: string, most: number): Note[] => {
  const q = query.trim().toLowerCase()
  const rank = (title: string) => {
    const low = title.toLowerCase()
    if (low.startsWith(q)) return 0
    if (low.split(/\s+/).some(word => word.startsWith(q))) return 1

    return low.includes(q) ? 2 : 3
  }

  return notes
    .filter(note => !note.isArchived && note.id !== exceptId && rank(note.title) < 3)
    .sort((a, b) => rank(a.title) - rank(b.title) || b.updated.localeCompare(a.updated))
    .slice(0, most)
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

const IN_PLAY: readonly QuestState[] = ['waiting', 'sealed', 'active']

// Whether a quest can still take more under it.
export const isInPlay = (lines: Map<string, QuestLine>, id: string): boolean => IN_PLAY.includes(questLineOf(lines, id).state)
