import type { Difficulty, Priority } from '../../../../../types'
import type { BoardEntry, QuestRow } from '../../../../shared/engine_api'

// The sections the board can keep to: the design's five states.
export type BoardSection = 'ready' | 'active' | 'judgement' | 'sealed' | 'victories'

export type Filters = { priorities: Priority[]; difficulties: Difficulty[]; sections: BoardSection[]; onlySaga: boolean; fitsTime: boolean }

// View state per realm, never saved.
export type BoardView = { search: string; filters: Filters }

export const EMPTY_BOARD: BoardView = { search: '', filters: { priorities: [], difficulties: [], sections: [], onlySaga: false, fitsTime: false } }

export const hasFilters = (f: Filters): boolean => f.priorities.length > 0 || f.difficulties.length > 0 || f.sections.length > 0 || f.onlySaga || f.fitsTime

export const isFiltering = (view: BoardView): boolean => view.search.trim() !== '' || hasFilters(view.filters)

export const showsSection = (f: Filters, section: BoardSection): boolean => f.sections.length === 0 || f.sections.includes(section)

const matchesText = (quest: QuestRow, words: string): boolean => words === '' || quest.title.toLowerCase().includes(words) || (quest.branch ?? '').toLowerCase().includes(words)

const passes = (quest: QuestRow, f: Filters, budget: number | null): boolean =>
  (f.priorities.length === 0 || f.priorities.includes(quest.priority)) &&
  (f.difficulties.length === 0 || f.difficulties.includes(quest.difficulty)) &&
  (!f.fitsTime || budget === null || quest.estimateMinutes <= budget)

// What's left of the board. A saga stays for a chapter that matches, with only
// the chapters that do; when the saga itself matches it keeps them all.
export const filterEntries = (entries: BoardEntry[], view: BoardView, activeSaga: string | null, budget: number | null): BoardEntry[] => {
  const words = view.search.trim().toLowerCase()
  const { filters } = view
  const fits = (quest: QuestRow) => matchesText(quest, words) && passes(quest, filters, budget)
  const inSaga = (entry: BoardEntry) => !filters.onlySaga || entry.quest.title === activeSaga

  return entries.flatMap((entry): BoardEntry[] => {
    if (!inSaga(entry)) return []
    if (entry.kind === 'quest') return fits(entry.quest) ? [entry] : []
    if (fits(entry.quest)) return [entry]
    const chapters = entry.chapters.filter(fits)

    return chapters.length === 0 ? [] : [{ ...entry, chapters }]
  })
}

export type TitlePart = { text: string; isMatch: boolean }

// A title split around the first match, for marking it.
export const partsOf = (title: string, search: string): TitlePart[] => {
  const words = search.trim().toLowerCase()
  const at = words === '' ? -1 : title.toLowerCase().indexOf(words)
  if (at === -1) return [{ text: title, isMatch: false }]
  const end = at + words.length
  const parts = [
    { text: title.slice(0, at), isMatch: false },
    { text: title.slice(at, end), isMatch: true },
    { text: title.slice(end), isMatch: false },
  ]

  return parts.filter(part => part.text !== '')
}
