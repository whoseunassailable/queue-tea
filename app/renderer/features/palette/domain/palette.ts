import type { ProjectRow, ProjectView, QuestRow } from '../../../../shared/engine_api'
import { ROUTES } from '../../../config/routing/routes'
import type { Route } from '../../../config/routing/routes'
import { t } from '../../../l10n/en'
import { rowsOf } from '../../quests/domain/board'

export type PaletteSection = 'suggested' | 'quests' | 'actions' | 'goto' | 'realms' | 'create'

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
  // ⌘↩ on a quest. Null when it can't start.
  start: (() => void) | null
  // Create only: what to do with the words typed.
  fill: ((words: string) => void) | null
}

type Readable = Extract<ProjectView, { kind: 'readable' }>

export type PaletteInput = {
  view: Readable | null
  realms: ProjectRow[]
  selected: string | null
  onStart: (quest: QuestRow) => void
  onOpenQuest: (id: string) => void
  onFinish: () => void
  onBack: () => void
  onOpenClaude: () => void
  onNewQuest: (title: string) => void
  onGo: (route: Route) => void
  onPickRealm: (key: string) => void
  onOpenFolder: () => void
}

const entry = (over: Pick<PaletteEntry, 'id' | 'section' | 'label' | 'run'> & Partial<PaletteEntry>): PaletteEntry => ({ also: '', keys: null, reason: null, start: null, fill: null, ...over })

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
  ]
}

export const paletteEntries = (input: PaletteInput): PaletteEntry[] => {
  const { view, realms, selected } = input
  const others = realms.filter(row => row.key !== selected)

  return [
    ...(view === null ? [] : [...suggestions(view, input), ...questEntries(view, input), ...actions(view, input), entry({ id: 'create', section: 'create', label: '', run: () => {}, fill: input.onNewQuest, keys: '⌘N' })]),
    ...GO_TO.map(place => entry({ id: `go:${place.route}`, section: 'goto', label: place.label, keys: place.keys, run: () => input.onGo(place.route) })),
    ...others.map(row => entry({ id: `realm:${row.key}`, section: 'realms', label: row.name, run: () => input.onPickRealm(row.key) })),
    entry({ id: 'file:open', section: 'actions', label: t.firstRun.open, keys: '⌘O', run: input.onOpenFolder }),
  ]
}

// A quest's reason is about starting it, and opening it is always fine.
export const canRun = (item: PaletteEntry): boolean => item.reason === null || item.section === 'quests'

const SECTION_ORDER: readonly PaletteSection[] = ['quests', 'actions', 'goto', 'realms']

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

const scoreOf = (item: PaletteEntry, words: string): number => Math.max(matchScore(item.label, words), item.also === '' ? 0 : matchScore(item.also, words))

// With nothing typed, the shortcuts; with words, what fits them, then Create.
export const filterPalette = (entries: PaletteEntry[], query: string): PaletteEntry[] => {
  const words = query.trim()
  if (words === '') return entries.filter(item => item.section === 'suggested' || item.section === 'goto' || item.section === 'realms')

  const ranked = entries
    .filter(item => item.section !== 'suggested' && item.section !== 'create')
    .map(item => ({ item, score: scoreOf(item, words) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
  // Sections go by their best match, so Return lands on the strongest entry
  // wherever it is, and ties keep the order sections are listed in.
  const bestIn = (section: PaletteSection) => ranked.find(({ item }) => item.section === section)?.score ?? 0
  const order = [...SECTION_ORDER].sort((a, b) => bestIn(b) - bestIn(a))
  const found = order.flatMap(section => ranked.filter(({ item }) => item.section === section).map(({ item }) => item))
  const create = entries.find(item => item.section === 'create')

  return create === undefined ? found : [...found, { ...create, label: t.palette.create(words), run: () => create.fill?.(words) }]
}
