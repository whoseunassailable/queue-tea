import type { ActiveQuest, HomeGroup, HomeNav, QuestRow } from '../../../../shared/engine_api'
import { HOME_GROUP_PAGE } from '../../../core/constants/constants'
import { rowsOf, withWholeSagas } from '../../quests/domain/board'
import type { Row } from '../../quests/domain/board'
import { filterEntries, isFiltering, showsSection } from '../../quests/domain/search'
import type { BoardView } from '../../quests/domain/search'
import type { ReadableView } from '../../workspace/state_management/workspace_store'

export const HOME_GROUPS: readonly HomeGroup[] = ['active', 'ready', 'sealed']

// Home opens with the quests in hand and the board open, and the sealed folded.
export const FIRST_NAV: HomeNav = { open: null, folded: ['sealed'] }

// One card on Home: a quest in hand, or a row of the board.
export type HomeItem = { kind: 'active'; id: string; quest: ActiveQuest } | { kind: 'row'; id: string; row: Row; group: 'ready' | 'sealed' }

export type Dashboard = {
  active: ActiveQuest[]
  ready: Row[]
  sealed: Row[]
  isNarrowed: boolean
}

const matchesWords = (quest: Pick<ActiveQuest, 'title' | 'branch'>, words: string): boolean =>
  words === '' || quest.title.toLowerCase().includes(words) || (quest.branch ?? '').toLowerCase().includes(words)

// The search and filters as they read a quest in hand: its state is Active, or
// Judgement while it asks whether it's done. Time I have is about starting, so
// it leaves the quests in hand alone.
export const matchesActive = (quest: ActiveQuest, board: BoardView, activeSagaId: string | null): boolean => {
  const { filters } = board
  const section = quest.review === null ? 'active' : 'judgement'

  return (
    showsSection(filters, section) &&
    matchesWords(quest, board.search.trim().toLowerCase()) &&
    (filters.priorities.length === 0 || filters.priorities.includes(quest.priority)) &&
    (filters.difficulties.length === 0 || filters.difficulties.includes(quest.difficulty)) &&
    (!filters.onlySaga || (activeSagaId !== null && quest.parentIds.includes(activeSagaId)))
  )
}

// What Home lists, narrowed as the board is. While it's narrowed a saga's fold
// can't hide a match, as on Quests.
export const dashboardOf = (view: ReadableView, board: BoardView, sagaFolds: readonly string[]): Dashboard => {
  const isNarrowed = isFiltering(board)
  const folds = isNarrowed ? [] : sagaFolds
  const narrow = (entries: ReadableView['ready']) => withWholeSagas(rowsOf(filterEntries(entries, board, view.activeSaga, view.budget), folds), view)

  return {
    active: view.activeQuests.filter(quest => matchesActive(quest, board, view.activeSagaId)),
    ready: showsSection(board.filters, 'ready') ? narrow(view.ready) : [],
    sealed: showsSection(board.filters, 'sealed') ? narrow(view.sealed) : [],
    isNarrowed,
  }
}

const isStartable = (quest: QuestRow): boolean => quest.sealedBecause === null

// The quest to start next: the board's ★, else the first quest on it that can
// start. A saga isn't a quest to start, and nothing sealed is offered.
export const nextUpOf = (view: ReadableView): QuestRow | null => {
  const rows = rowsOf(view.ready)
  const star = rows.find(row => row.quest.isStar && row.sagaOf === null && isStartable(row.quest))

  return star?.quest ?? rows.find(row => row.sagaOf === null && isStartable(row.quest))?.quest ?? null
}

// Whether a card offers Start: a quest, not a saga, that isn't sealed.
export const canStartRow = (row: Row): boolean => row.sagaOf === null && isStartable(row.quest)

const itemsOfRows = (rows: Row[], group: 'ready' | 'sealed'): HomeItem[] => rows.map(row => ({ kind: 'row', id: row.quest.id, row, group }))

// Each group's cards, in the order they stand.
export const groupsOf = (dashboard: Dashboard): Record<HomeGroup, HomeItem[]> => ({
  active: dashboard.active.map((quest): HomeItem => ({ kind: 'active', id: quest.id, quest })),
  ready: itemsOfRows(dashboard.ready, 'ready'),
  sealed: itemsOfRows(dashboard.sealed, 'sealed'),
})

// Every card in the list, folded groups too.
export const allItemsOf = (groups: Record<HomeGroup, HomeItem[]>): HomeItem[] => HOME_GROUPS.flatMap(group => groups[group])

export const groupOf = (item: HomeItem): HomeGroup => (item.kind === 'active' ? 'active' : item.group)

// The cards a group shows: a page at a time, and always far enough to hold
// the picked card.
export const shownOf = (items: HomeItem[], pages: number, picked: string | null): HomeItem[] => {
  const at = picked === null ? -1 : items.findIndex(item => item.id === picked)

  return items.slice(0, Math.max(pages * HOME_GROUP_PAGE, at + 1))
}

// The cards the arrow keys move through: the open groups, as far as they show.
export const visibleItemsOf = (groups: Record<HomeGroup, HomeItem[]>, folded: readonly HomeGroup[], pages: Record<HomeGroup, number>, picked: string | null): HomeItem[] =>
  HOME_GROUPS.flatMap(group => (folded.includes(group) ? [] : shownOf(groups[group], pages[group], picked)))

// The card the details show: the one picked while it's still listed, else the
// first quest in hand, else Next up, else the first card.
export const pickedOf = (items: HomeItem[], saved: string | null, nextUp: QuestRow | null): HomeItem | null =>
  items.find(item => item.id === saved) ??
  items.find(item => item.kind === 'active') ??
  items.find(item => item.id === nextUp?.id) ??
  items[0] ??
  null

// The card above or below, staying on the first or last.
export const stepItem = (items: HomeItem[], id: string | null, step: 1 | -1): HomeItem | null => {
  const at = items.findIndex(item => item.id === id)
  if (at === -1) return items[0] ?? null

  return items[Math.max(0, Math.min(items.length - 1, at + step))] ?? null
}

// A group folded or opened, keeping the others as they were.
export const toggleGroup = (folded: readonly HomeGroup[], group: HomeGroup): HomeGroup[] =>
  folded.includes(group) ? folded.filter(g => g !== group) : HOME_GROUPS.filter(g => g === group || folded.includes(g))
