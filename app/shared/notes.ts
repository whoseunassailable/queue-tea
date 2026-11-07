// A realm's notes, as main reads them from ~/.queue-tea/notes/<realm key>/ and
// the window shows and edits them. docs/notes.md has the file format.
import type { Difficulty, ParentPick, Priority } from '../../types'
import type { ProjectView } from './engine_api'

export const NOTES_FOLDER = '.queue-tea/notes'
export const NOTE_HISTORY_FOLDER = '.history'
export const NOTE_HISTORY_LIMITS = { recent: 50, hourly: 24, daily: 26 } as const
export const NOTE_VERSION_ID = /^v-(\d{13})-([a-f0-9]{40})$/
export const INBOX = 'Inbox'
export const NOTE_LIMITS = { title: 200, folder: 60, tag: 40, tags: 20, item: 500, body: 1_000_000, notes: 5000, quests: 50 } as const
// What a note is, apart from where it's kept: each has a template.
export const NOTE_TYPES = ['idea', 'feature', 'bug', 'meeting', 'research', 'decision', 'daily'] as const
export type NoteType = (typeof NOTE_TYPES)[number]
export const noteTypeOf = (value: unknown): NoteType | null => NOTE_TYPES.find(type => typeof value === 'string' && type === value.trim().toLowerCase()) ?? null

// item is the checklist line a quest was filed from; null for the note's own
// quest, which is the parent of the rest or the only one.
export type NoteQuest = { id: string; item: string | null }
// id is the file's name without .md. stamp is the file as it was read.
export type Note = { id: string; title: string; folder: string; type: NoteType | null; isPinned: boolean; tags: string[]; created: string; updated: string; isArchived: boolean; quests: NoteQuest[]; body: string; stamp: string }
// unreadable: the files in the folder that couldn't be read, by name.
export type NotesView = { notes: Note[]; unreadable: string[]; folder: string }
export type NoteInput = { title: string; folder: string; body: string; type?: NoteType | null }
export type NoteChange = { title: string; folder: string; type: NoteType | null; isPinned: boolean; tags: string[]; body: string }
// changed: the file isn't the one the editor read; note is the file now, or null when it's gone.
// relinked: how many other notes had their links to it rewritten by a rename.
export type NoteSave = { kind: 'saved'; view: NotesView; note: Note; relinked: number } | { kind: 'changed'; note: Note | null }
// History lists only times; the full snapshot is read when selected.
export type NoteVersion = { id: string; savedAt: string }
export type ProposedQuest = { title: string; priority: Priority; difficulty: Difficulty; item: string | null }
export type QuestProposal = { parent: ParentPick; quests: ProposedQuest[] }
// project: the realm's quests once the new ones are in.
export type NoteFiled = { view: NotesView; project: ProjectView }

// Links are [[Title]], so a title can't hold what a link is made of.
export const NOTE_TITLE_BAD = /[[\]|#\r\n]/
// A folder is one level.
export const NOTE_FOLDER_BAD = /[\\/]/

// A tag as Obsidian reads one: no #, and no spaces inside.
export const cleanTag = (tag: string): string => tag.trim().replace(/^#+/, '').replace(/\s+/g, '-')

// A note's id is its file name, which a note made in Obsidian picks itself:
// no folders, nothing hidden, no .. in it.
export const isNoteId = (value: unknown): value is string => typeof value === 'string' && /^[^./\\\0][^/\\\0]{0,119}$/.test(value) && !value.includes('..')

const same = (a: string, b: string) => a.toLowerCase() === b.toLowerCase()

const LINK = /\[\[([^[\]|#\n]+)((?:[#|][^\]\n]*)?)\]\]/g

// [[quest:t-e84dd5ab|Write the parser]] links a quest by its id, so renaming
// the quest can't break it, and Obsidian still shows the title.
const QUEST_TARGET = /^quest:(t-[0-9a-f-]+)$/i
export const questIdOf = (target: string): string | null => QUEST_TARGET.exec(target.trim())?.[1]?.toLowerCase() ?? null

// What goes between [[ and ]] for a quest. A title can hold what a link is made of, so that turns into spaces.
export const questLinkOf = (id: string, title: string): string => {
  const shown = title.replace(/[[\]|\r\n]+/g, ' ').replace(/\s+/g, ' ').trim()

  return shown === '' ? `quest:${id}` : `quest:${id}|${shown}`
}

const targetsOf = (body: string): string[] => [...body.matchAll(LINK)].map(m => m[1]!.trim()).filter(target => target !== '')
const once = (values: string[]): string[] => values.filter((value, i) => values.findIndex(other => same(other, value)) === i)

// The notes a body links to, as written in [[Title]], [[Title|shown]] or [[Title#heading]].
export const linksOf = (body: string): string[] => once(targetsOf(body).filter(target => questIdOf(target) === null))

// The quests a body links to, by id.
export const questLinksOf = (body: string): string[] => once(targetsOf(body).flatMap(target => questIdOf(target) ?? []))

// A run of text cut into plain text and [[links]], for the Read view.
export type LinkPart = { kind: 'text'; text: string } | { kind: 'link'; title: string; shown: string } | { kind: 'quest'; id: string; shown: string }
export const linkPartsOf = (text: string): LinkPart[] => {
  const parts: LinkPart[] = []
  let at = 0
  for (const m of text.matchAll(LINK)) {
    if (m.index > at) parts.push({ kind: 'text', text: text.slice(at, m.index) })
    const title = m[1]!.trim()
    const rest = m[2] ?? ''
    const shown = rest.startsWith('|') && rest.length > 1 ? rest.slice(1) : null
    const quest = questIdOf(title)
    parts.push(title === '' ? { kind: 'text', text: m[0] } : quest !== null ? { kind: 'quest', id: quest, shown: shown ?? quest } : { kind: 'link', title, shown: shown ?? title })
    at = m.index + m[0].length
  }
  if (at < text.length) parts.push({ kind: 'text', text: text.slice(at) })

  return parts
}

export const renameLinks = (body: string, from: string, to: string): string => body.replace(LINK, (link, title: string, rest: string) => (same(title.trim(), from) && questIdOf(title) === null ? `[[${to}${rest}]]` : link))

export const backlinksOf = (notes: readonly Note[], note: Note): Note[] => notes.filter(other => other.id !== note.id && !other.isArchived && linksOf(other.body).some(title => same(title, note.title)))

export const noteTitled = (notes: readonly Note[], title: string): Note | undefined => notes.find(note => !note.isArchived && same(note.title, title))

// Titles are unique among the notes that aren't archived, so a link means one note.
export const isTitleTaken = (notes: readonly Pick<Note, 'id' | 'title' | 'isArchived'>[], title: string, exceptId: string | null): boolean => notes.some(note => note.id !== exceptId && !note.isArchived && same(note.title, title.trim()))

// The title, or the title with the next free number: "Plan 2".
export const freeTitle = (notes: readonly Pick<Note, 'id' | 'title' | 'isArchived'>[], title: string, exceptId: string | null = null): string => {
  const base = title.trim()
  if (!isTitleTaken(notes, base, exceptId)) return base
  let n = 2
  const numbered = () => `${base.slice(0, NOTE_LIMITS.title - String(n).length - 1)} ${n}`
  while (isTitleTaken(notes, numbered(), exceptId)) n += 1

  return numbered()
}

// The unticked checklist lines: "- [ ] Write the parser".
export const openItemsOf = (body: string): string[] =>
  body
    .split('\n')
    .map(line => /^\s*[-*+] \[ \] (.+)$/.exec(line)?.[1]?.trim() ?? '')
    .filter(item => item !== '')
    .map(item => item.slice(0, NOTE_LIMITS.item))

// What Turn into quests offers: one quest per unticked line not filed yet,
// under the note's own quest while it's still open, or under a new one named
// after the note when there are two or more. With no lines, the note itself
// is the quest, but only while nothing has been filed from it. isOpen says
// whether a quest is still in play.
export const proposalOf = (note: Pick<Note, 'title' | 'body' | 'quests'>, isOpen: (id: string) => boolean = () => true): QuestProposal => {
  const filed = new Set(note.quests.map(q => q.item))
  const own = note.quests.find(q => q.item === null && isOpen(q.id))
  const items = openItemsOf(note.body).filter((item, i, all) => !filed.has(item) && all.indexOf(item) === i)
  const quest = (title: string, item: string | null): ProposedQuest => ({ title: title.slice(0, NOTE_LIMITS.title), priority: 'mid', difficulty: 'medium', item })
  if (items.length === 0) return { parent: { kind: 'none' }, quests: note.quests.length > 0 ? [] : [quest(note.title, null)] }
  if (own !== undefined) return { parent: { kind: 'task', id: own.id }, quests: items.map(item => quest(item, item)) }
  if (items.length === 1) return { parent: { kind: 'none' }, quests: [quest(items[0]!, items[0]!)] }

  return { parent: { kind: 'new', title: note.title.slice(0, NOTE_LIMITS.title) }, quests: items.map(item => quest(item, item)) }
}

// The first paragraph that isn't a heading or a checklist, for a quest's description.
export const firstParagraphOf = (body: string): string | null => {
  const para = body
    .split(/\n\s*\n/)
    .map(block => block.trim())
    .find(block => block !== '' && !block.startsWith('#') && !/^[-*+] \[[ x]\]/i.test(block))

  return para === undefined ? null : para.slice(0, 2000)
}
