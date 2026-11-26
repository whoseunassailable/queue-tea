import { isFiltered, PLAN_LIMITS, viewNameOf } from '../../../../shared/plan'
import type { PlanFilters, PlanLanes, SavedPlanView } from '../../../../shared/plan'

// Saved views: named filters, kept in the app's settings. Pure.

export type ViewState = { filters: PlanFilters; search: string; lanes: PlanLanes }
export type ViewError = 'nameRequired' | 'nameTaken' | 'full'

const sameName = (a: string, b: string) => a.toLowerCase() === b.toLowerCase()

export const saveView = (views: readonly SavedPlanView[], name: string, state: ViewState, id: string): { views: SavedPlanView[]; view: SavedPlanView } | { error: ViewError } => {
  const clean = viewNameOf(name)
  if (clean === null) return { error: 'nameRequired' }
  if (views.some(v => sameName(v.name, clean))) return { error: 'nameTaken' }
  if (views.length >= PLAN_LIMITS.views) return { error: 'full' }
  const view = { id, name: clean, ...state }

  return { views: [...views, view], view }
}

// The view opened, set to what is on screen now.
export const updateView = (views: readonly SavedPlanView[], id: string, state: ViewState): SavedPlanView[] => views.map(v => (v.id === id ? { ...v, ...state } : v))

export const removeView = (views: readonly SavedPlanView[], id: string): SavedPlanView[] => views.filter(v => v.id !== id)

const sorted = (list: readonly string[]) => [...list].sort()
const sameFilters = (a: PlanFilters, b: PlanFilters) =>
  (['statuses', 'priorities', 'difficulties', 'realms', 'tags'] as const).every(kind => JSON.stringify(sorted(a[kind])) === JSON.stringify(sorted(b[kind])))

// Whether what is on screen still matches the view as saved.
export const isChanged = (view: SavedPlanView, state: ViewState): boolean => !sameFilters(view.filters, state.filters) || view.search !== state.search || view.lanes !== state.lanes

export const filterCount = (filters: PlanFilters): number => filters.statuses.length + filters.priorities.length + filters.difficulties.length + filters.realms.length + filters.tags.length

export { isFiltered }
