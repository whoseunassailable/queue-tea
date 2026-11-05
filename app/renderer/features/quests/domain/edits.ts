import type { Priority } from '../../../../../types'
import type { BoardEntry, QuestRow } from '../../../../shared/engine_api'
import type { ReadableView } from '../../workspace/state_management/workspace_store'

// What an edit looks like before main answers. Main's reply replaces it, with
// the board in its real order.

type Change = (quest: QuestRow) => QuestRow

const changeEntry = (entry: BoardEntry, change: Change): BoardEntry =>
  entry.kind === 'quest' ? { ...entry, quest: change(entry.quest) } : { ...entry, quest: change(entry.quest), chapters: entry.chapters.map(change) }

const changeQuests = (view: ReadableView, change: Change): ReadableView => ({
  ...view,
  ready: view.ready.map(entry => changeEntry(entry, change)),
  sealed: view.sealed.map(entry => changeEntry(entry, change)),
})

export const withPriority = (id: string, priority: Priority) => (view: ReadableView): ReadableView =>
  changeQuests(view, quest => (quest.id === id ? { ...quest, priority } : quest))

export const withPlayNext = (id: string) => (view: ReadableView): ReadableView =>
  changeQuests(view, quest => (quest.id === id ? { ...quest, isPlayNext: !quest.isPlayNext } : { ...quest, isPlayNext: false }))

const dropQuest = (entries: BoardEntry[], id: string): BoardEntry[] =>
  entries
    .filter(entry => entry.quest.id !== id)
    .map(entry => (entry.kind === 'saga' ? { ...entry, chapters: entry.chapters.filter(c => c.id !== id) } : entry))

export const withoutQuest = (id: string) => (view: ReadableView): ReadableView => ({
  ...view,
  ready: dropQuest(view.ready, id),
  sealed: dropQuest(view.sealed, id),
})

export const withoutReview = (view: ReadableView, id = view.active?.id): ReadableView => ({ ...view, active: view.active !== null && view.active.id === id ? { ...view.active, review: null } : view.active, activeQuests: view.activeQuests.map(q => q.id === id ? { ...q, review: null } : q) })
