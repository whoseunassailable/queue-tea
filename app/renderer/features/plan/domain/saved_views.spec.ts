import { describe, expect, it } from 'vitest'

import { NO_FILTERS, PLAN_LIMITS } from '../../../../shared/plan'
import type { SavedPlanView } from '../../../../shared/plan'
import { filterCount, isChanged, removeView, saveView, updateView } from './saved_views'
import type { ViewState } from './saved_views'

const state: ViewState = { filters: { ...NO_FILTERS, priorities: ['urgent'], tags: ['billing'] }, search: 'invoice', lanes: 'saga' }

describe('saved views', () => {
  it('saves a view that reopens exactly as it was', () => {
    const saved = saveView([], '  Urgent billing ', state, 'v1')
    if ('error' in saved) throw new Error(saved.error)
    expect(saved.view).toEqual({ id: 'v1', name: 'Urgent billing', ...state })
    expect(isChanged(saved.view, state)).toBe(false)
  })

  it('refuses an empty name, a name taken, and a 21st view', () => {
    expect(saveView([], '   ', state, 'v1')).toEqual({ error: 'nameRequired' })
    const one = [{ id: 'v1', name: 'Mine', ...state }]
    expect(saveView(one, 'mine', state, 'v2')).toEqual({ error: 'nameTaken' })
    const full: SavedPlanView[] = Array.from({ length: PLAN_LIMITS.views }, (_, i) => ({ id: `v${i}`, name: `View ${i}`, ...state }))
    expect(saveView(full, 'One more', state, 'vx')).toEqual({ error: 'full' })
  })

  it('notices a change, whatever order the filters were picked in, and updates the view', () => {
    const view: SavedPlanView = { id: 'v1', name: 'Mine', ...state }
    expect(isChanged(view, { ...state, filters: { ...state.filters, priorities: ['urgent'] } })).toBe(false)
    const next = { ...state, lanes: 'priority' as const }
    expect(isChanged(view, next)).toBe(true)
    const [updated] = updateView([view], 'v1', next)
    expect(updated).toEqual({ id: 'v1', name: 'Mine', ...next })
    expect(removeView([view], 'v1')).toEqual([])
  })

  it('counts the filters picked', () => {
    expect(filterCount(state.filters)).toBe(2)
    expect(filterCount(NO_FILTERS)).toBe(0)
  })
})
