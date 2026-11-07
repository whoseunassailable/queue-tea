import type { ProjectRow, ProjectView, QuestRow } from '../../../../shared/engine_api'
import type { Note, NotesView } from '../../../../shared/notes'
import { ROUTES } from '../../../config/routing/routes'
import type { Route } from '../../../config/routing/routes'
import { PALETTE_NOTE_ROWS, PALETTE_SNIPPET } from '../../../core/constants/constants'
import { t } from '../../../l10n/en'
import { matches } from '../../notes/domain/notes_view'
import { rowsOf } from '../../quests/domain/board'
import type { Load } from '../../workspace/state_management/workspace_store'

export type PaletteSection = 'suggested' | 'quests' | 'actions' | 'goto' | 'realms' | 'notes' | 'create'

export type PaletteEntry = {
  id: string
  section: PaletteSection
  label: string
  // What it searches on beside the label, such as a branch.
  also: string
  keys: string | null
  // Why it can't run now; it shows dim and Return does nothing.
  reason: string | null
  run: () => void
  // ⌘↩ starts a quest or opens a note. Null when unavailable.
  start: (() => void) | null
  // Create only: its label and what ↩ and ⌘↩ do with the words typed.
  fill: { label: (words: string) => string; run: (words: string) => void; start: ((words: string) => void) | null } | null
  // Notes only: the note it's matched on. Null on the reading and failed rows.
  note: Note | null
  // The note's line that holds the words, shown under its title.
  detail: string | null
  // Still reading: it shows a spinner and can't run.
  isBusy: boolean
}

type Readable = Extract<ProjectView, { kind: 'readable' }>

export type PaletteInput = {
  view: Readable | null
  // The selected realm's notes, read when the palette opens.
  notes: Load<NotesView>
  isRefreshingNotes?: boolean
  notesProblem?: boolean
  realms: ProjectRow[]
  selected: string | null
  onStart: (quest: QuestRow) => void
  onOpenQuest: (id: string) => void
  onFinish: () => void
  onBack: () => void
  onOpenClaude: () => void
  onNewQuest: (title: string) => void
  onNewNote: () => void
  onOpenNote: (id: string) => void
  onJot: (words: string, isOpening: boolean) => void
  onGo: (route: Route) => void
  onPickRealm: (key: string) => void
  onOpenFolder: () => void
}

const entry = (over: Pick<PaletteEntry, 'id' | 'section' | 'label' | 'run'> & Partial<PaletteEntry>): PaletteEntry => ({ also: '', keys: null, reason: null, start: null, fill: null, note: null, detail: null, isBusy: false, ...over })

const GO_TO: readonly { route: Route; label: string; keys: string | null }[] = [
  { route: ROUTES.home, label: t.nav.home, keys: '⌘1' },
  { route: ROUTES.quests, label: t.nav.quests, keys: '⌘2' },
  { route: ROUTES.designs, label: t.nav.designs, keys: '⌘3' },
  { route: ROUTES.branches, label: t.nav.branches, keys: '⌘4' },
  { route: ROUTES.chronicle, label: t.nav.chronicle, keys: '⌘5' },
  { route: ROUTES.mana, label: t.nav.mana, keys: '⌘6' },
  { route: ROUTES.notes, label: t.nav.notes, keys: '⌘7' },
  { route: ROUTES.guild, label: t.nav.guild, keys: null },
  { route: ROUTES.hoard, label: t.nav.hoard, keys: null },
  { route: ROUTES.library, label: t.nav.library, keys: null },
  { route: ROUTES.settings, label: t.nav.settings, keys: '⌘,' },
]

const allQuests = (view: Readable): QuestRow[] => [...rowsOf(view.ready), ...rowsOf(view.sealed)].map(row => row.quest)

const questEntries = (view: Readable, input: PaletteInput): PaletteEntry[] => {
  const waiting = null

  return allQuests(view).map(quest =>
    entry({
      id: `quest:${quest.id}`,
      section: 'quests',
      label: quest.title,
      also: quest.branch ?? '',
      reason: quest.sealedBecause === null ? waiting : t.palette.sealed,
      run: () => input.onOpenQuest(quest.id),
      start: quest.sealedBecause === null && waiting === null ? () => input.onStart(quest) : null,
    }),
  )
}

const suggestions = (view: Readable, input: PaletteInput): PaletteEntry[] => {
  const main = allQuests(view).find(quest => quest.isStar)
  const newQuest = entry({ id: 'suggest:new', section: 'suggested', label: t.actions.newQuest, keys: '⌘N', run: () => input.onNewQuest('') })
  if (view.active !== null) {
    return [
      entry({ id: 'suggest:open', section: 'suggested', label: t.actions.openClaude, keys: '⌘↩', run: input.onOpenClaude }),
      entry({ id: 'suggest:finish', section: 'suggested', label: `${t.actions.finish} ${view.active.title}`, keys: 'd', run: input.onFinish }),
      newQuest,
    ]
  }
  if (main === undefined) return [newQuest]

  return [entry({ id: 'suggest:start', section: 'suggested', label: t.actions.startNamed(main.title), keys: 's', run: () => input.onStart(main) }), newQuest]
}

// The actions by name, found by typing, including those that can't run now.
const actions = (view: Readable, input: PaletteInput): PaletteEntry[] => {
  const noActive = view.active === null ? t.palette.noActive : null
  const main = allQuests(view).find(quest => quest.isStar)

  return [
    entry({
      id: 'action:start',
      section: 'actions',
      label: main === undefined ? t.actions.start : t.actions.startNamed(main.title),
      keys: 's',
      reason: main === undefined ? t.palette.nothingToStart : null,
      run: () => main !== undefined && input.onStart(main),
    }),
    entry({ id: 'action:open', section: 'actions', label: t.actions.openClaude, keys: '⌘↩', reason: noActive, run: input.onOpenClaude }),
    entry({ id: 'action:finish', section: 'actions', label: t.actions.finish, keys: 'd', reason: noActive, run: input.onFinish }),
    entry({ id: 'action:back', section: 'actions', label: t.actions.back, keys: 'b', reason: noActive, run: input.onBack }),
    entry({ id: 'action:new-note', section: 'actions', label: t.notebook.newNote, keys: t.notebook.newNoteKeys, run: input.onNewNote }),
  ]
}

// The live notes, newest first, so equal matches keep that order; or one row
// saying they're still being read or couldn't be.
const noteEntries = (input: PaletteInput): PaletteEntry[] => {
  const { notes } = input
  if (notes.status === 'loading') return [entry({ id: 'notes:reading', section: 'notes', label: t.palette.readingNotes, isBusy: true, run: () => {} })]
  if (notes.status === 'failed') return [entry({ id: 'notes:failed', section: 'notes', label: t.palette.notesFailed, run: () => input.onGo(ROUTES.notes) })]

  const found = notes.data.notes
    .filter(note => !note.isArchived)
    .sort((a, b) => b.updated.localeCompare(a.updated))
    .map(note => entry({ id: `note:${note.id}`, section: 'notes', label: note.title, note, run: () => input.onOpenNote(note.id), start: () => input.onOpenNote(note.id) }))

  if (input.isRefreshingNotes) found.push(entry({ id: 'notes:refreshing', section: 'notes', label: t.palette.readingNotes, isBusy: true, run: () => {} }))
  if (input.notesProblem) found.push(entry({ id: 'notes:refresh-failed', section: 'notes', label: t.palette.notesRefreshFailed, run: () => input.onGo(ROUTES.notes) }))
  if (notes.data.unreadable.length > 0) found.push(entry({ id: 'notes:unreadable', section: 'notes', label: t.palette.notesUnreadable, run: () => input.onGo(ROUTES.notes) }))

  return found
}

const creates = (input: PaletteInput): PaletteEntry[] => [
  entry({ id: 'create', section: 'create', label: '', run: () => {}, keys: '⌘N', fill: { label: t.palette.create, run: input.onNewQuest, start: null } }),
  entry({ id: 'create:jot', section: 'create', label: '', run: () => {}, fill: { label: t.palette.jot, run: words => input.onJot(words, false), start: words => input.onJot(words, true) } }),
]

export const paletteEntries = (input: PaletteInput): PaletteEntry[] => {
  const { view, realms, selected } = input
  const others = realms.filter(row => row.key !== selected)

  return [
    ...(view === null ? [] : [...suggestions(view, input), ...questEntries(view, input), ...actions(view, input), ...noteEntries(input), ...creates(input)]),
    ...GO_TO.map(place => entry({ id: `go:${place.route}`, section: 'goto', label: place.label, keys: place.keys, run: () => input.onGo(place.route) })),
    ...others.map(row => entry({ id: `realm:${row.key}`, section: 'realms', label: row.name, run: () => input.onPickRealm(row.key) })),
    entry({ id: 'file:open', section: 'actions', label: t.firstRun.open, keys: '⌘O', run: input.onOpenFolder }),
  ]
}

// A quest's reason is about starting it, and opening it is always fine.
export const canRun = (item: PaletteEntry): boolean => !item.isBusy && (item.reason === null || item.section === 'quests')

const SECTION_ORDER: readonly PaletteSection[] = ['quests', 'actions', 'goto', 'realms', 'notes']

// How well the words fit: from the start, then whole inside it, then letters in
// order. 0 is no match.
export const matchScore = (text: string, query: string): number => {
  const hay = text.toLowerCase()
  const needle = query.toLowerCase()
  if (hay.startsWith(needle)) return 3
  if (hay.includes(needle)) return 2
  let at = 0
  for (const letter of needle) {
    at = hay.indexOf(letter, at)
    if (at === -1) return 0
    at += 1
  }

  return 1
}

// A note matches as Notes search does, every word in it, never by letters in
// order; its title fitting the words ranks it higher.
// shortcut: lower-cases every note on each key; keep a lower-cased copy per read if typing lags on a large vault.
const noteScore = (note: Note, words: string): number => {
  if (!matches(note, words)) return 0
  const title = note.title.toLowerCase()
  const needle = words.toLowerCase()

  return title.startsWith(needle) ? 3 : title.includes(needle) ? 2 : 1
}

const scoreOf = (item: PaletteEntry, words: string): number =>
  item.note !== null ? noteScore(item.note, words) : Math.max(matchScore(item.label, words), item.also === '' ? 0 : matchScore(item.also, words))

// The line of a note's text holding the first word its title lacks, cut to
// PALETTE_SNIPPET letters around that word. Null when the title holds them all.
export const snippetOf = (note: Note, query: string): string | null => {
  const title = note.title.toLowerCase()
  const word = query
    .toLowerCase()
    .split(/\s+/)
    .find(word => word !== '' && !word.startsWith('#') && !title.includes(word))
  if (word === undefined) return null
  const line = note.body
    .split('\n')
    .map(line => line.trim())
    .find(line => line.toLowerCase().includes(word))
  if (line === undefined || line.length <= PALETTE_SNIPPET) return line ?? null
  const from = Math.max(0, Math.min(line.toLowerCase().indexOf(word) - 20, line.length - PALETTE_SNIPPET))

  return `${from > 0 ? '…' : ''}${line.slice(from, from + PALETTE_SNIPPET)}${from + PALETTE_SNIPPET < line.length ? '…' : ''}`
}

const isStatus = (item: PaletteEntry) => item.section === 'notes' && item.note === null

// With nothing typed, the shortcuts; with words, what fits them, then whether
// the notes are still being read, then Create.
export const filterPalette = (entries: PaletteEntry[], query: string): PaletteEntry[] => {
  const words = query.trim()
  if (words === '') return entries.filter(item => item.section === 'suggested' || item.section === 'goto' || item.section === 'realms')

  const ranked = entries
    .filter(item => item.section !== 'suggested' && item.section !== 'create' && !isStatus(item))
    .map(item => ({ item, score: scoreOf(item, words) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
  // Sections go by their best match, so Return lands on the strongest entry
  // wherever it is, and ties keep the order sections are listed in.
  const bestIn = (section: PaletteSection) => ranked.find(({ item }) => item.section === section)?.score ?? 0
  const order = [...SECTION_ORDER].sort((a, b) => bestIn(b) - bestIn(a))
  const found = order.flatMap(section => {
    const inSection = ranked.filter(({ item }) => item.section === section).map(({ item }) => item)

    return section === 'notes' ? inSection.slice(0, PALETTE_NOTE_ROWS).map(item => ({ ...item, detail: item.note === null ? null : snippetOf(item.note, words) })) : inSection
  })
  const made = entries.flatMap(item => {
    const fill = item.fill
    if (item.section !== 'create' || fill === null) return []
    const { start } = fill

    return [{ ...item, label: fill.label(words), run: () => fill.run(words), start: start === null ? null : () => start(words) }]
  })

  return [...found, ...entries.filter(isStatus), ...made]
}
