import { describe, expect, it } from 'vitest'

import { NO_FILTERS } from '../../../../shared/plan'
import { planQuest, planRealm, planView } from '../test_fixtures'
import { backlogOf, dropBefore, foldKey, pointsOf, stepBefore } from './plan_tree'

const realm = planView().realms[0]!
const rows = (folded = new Set<string>(), filters = NO_FILTERS, search = '') =>
  backlogOf([realm], filters, search, folded).groups.flatMap(g => g.rows.map(r => `${'  '.repeat(r.depth)}${r.quest.id}${r.isContext ? ' (context)' : ''}`))

describe('the backlog tree', () => {
  it('nests sagas, their quests and child quests, three deep', () => {
    expect(rows()).toEqual(['saga', '  invoice', '    pdf', 'remind', 'login'])
  })

  it('leaves victories out unless Done is picked', () => {
    expect(rows(new Set(), { ...NO_FILTERS, statuses: ['done'] })).toEqual(['docs'])
  })

  it('folds a quest, hiding what is under it', () => {
    expect(rows(new Set([foldKey(realm.key, 'invoice')]))).toEqual(['saga', '  invoice', 'remind', 'login'])
    const folded = backlogOf([realm], NO_FILTERS, '', new Set([foldKey(realm.key, 'saga')])).groups[0]!.rows[0]!
    expect(folded).toMatchObject({ isFolded: true, hasChildren: true })
  })

  it('keeps what a match stands under, marked as context', () => {
    expect(rows(new Set(), NO_FILTERS, 'pdf')).toEqual(['saga (context)', '  invoice (context)', '    pdf'])
  })

  it('combines filters: every kind must match, any value within one', () => {
    expect(rows(new Set(), { ...NO_FILTERS, priorities: ['high', 'urgent'] })).toEqual(['remind', 'login'])
    expect(rows(new Set(), { ...NO_FILTERS, priorities: ['high', 'urgent'], statuses: ['active'] })).toEqual(['login'])
    expect(rows(new Set(), { ...NO_FILTERS, tags: ['billing'] })).toEqual(['saga (context)', '  invoice'])
  })

  it('searches titles and tags, every word', () => {
    expect(rows(new Set(), NO_FILTERS, 'billing send')).toEqual(['saga (context)', '  invoice'])
    expect(rows(new Set(), NO_FILTERS, 'nothing like it')).toEqual([])
  })

  it('counts effort points of the matches, sagas aside', () => {
    const { matches } = backlogOf([realm], NO_FILTERS, '', new Set())
    expect(pointsOf(matches)).toEqual({ quests: 5, points: 7, unestimated: 2 })
  })
})

describe('ranking among the quests beside it', () => {
  const quests = [planQuest({ id: 'a', order: 0 }), planQuest({ id: 'b', order: 1 }), planQuest({ id: 'c', order: 2 })]

  it('steps up and down with the keyboard, and stops at the ends', () => {
    const [a, b, c] = quests
    expect(stepBefore(quests, b!, null, -1)).toBe('a')
    expect(stepBefore(quests, a!, null, 1)).toBe('c')
    expect(stepBefore(quests, b!, null, 1)).toBeNull()
    expect(stepBefore(quests, a!, null, -1)).toBeUndefined()
    expect(stepBefore(quests, c!, null, 1)).toBeUndefined()
  })

  it('drops before the target coming from below, after it from above', () => {
    const [a, b, c] = quests
    expect(dropBefore(quests, c!, a!, null)).toBe('a')
    expect(dropBefore(quests, a!, b!, null)).toBe('c')
    expect(dropBefore(quests, a!, c!, null)).toBeNull()
  })

  it('shows several realms each in their own group', () => {
    const other = planRealm('b-000002', [planQuest({ id: 'x' })])
    const { groups } = backlogOf([realm, other], NO_FILTERS, '', new Set())
    expect(groups.map(g => g.realm.key)).toEqual(['a-000001', 'b-000002'])
  })
})
