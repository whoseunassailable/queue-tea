import { describe, expect, it } from 'vitest'

import {
  childQuestRefusal,
  childrenIn,
  containerOf,
  byIdOf,
  filtersOf,
  linkRefusal,
  linksOf,
  NO_FILTERS,
  planChangeOf,
  questMatches,
  rankMove,
  rankToEdge,
  realmsShown,
  savedViewsOf,
  siblingsOf,
  storedLinks,
  storedPoints,
  storedTags,
  tagOf,
  waitLoops,
  wipLimitsOf,
} from '../../../../shared/plan'
import { planQuest, planView } from '../../../../renderer/features/plan/test_fixtures'

// The rules the window and main share, in app/shared/plan.ts.
const quests = () => planView().realms[0]!.quests
const ids = (list: { id: string }[]) => list.map(q => q.id)

describe('reading stored planning fields', () => {
  it('keeps tags that read, once each, lower case and dashed', () => {
    expect(tagOf('  Big Win ')).toBe('big-win')
    expect(tagOf('')).toBeNull()
    expect(tagOf('#nope')).toBeNull()
    expect(tagOf('x'.repeat(25))).toBeNull()
    expect(storedTags(['UI', 'ui', 3, 'two words'])).toEqual(['ui', 'two-words'])
    expect(storedTags('ui')).toEqual([])
  })

  it('takes only effort points on the scale, never minutes', () => {
    expect(storedPoints(5)).toBe(5)
    expect(storedPoints(4)).toBeNull()
    expect(storedPoints(90)).toBeNull()
    expect(storedPoints('5')).toBeNull()
  })

  it('drops links that do not read', () => {
    expect(storedLinks([{ kind: 'relates', id: 'a' }, { kind: 'blocks', id: 'b' }, { kind: 'duplicates' }, null])).toEqual([{ kind: 'relates', id: 'a' }])
  })
})

describe('settings for the Plan tab', () => {
  it('keeps saved views that read, each name once', () => {
    const view = { id: 'v1', name: ' Urgent  work ', filters: { ...NO_FILTERS, priorities: ['urgent'] }, search: '', lanes: 'saga' }
    expect(savedViewsOf([view, { ...view, id: 'v2', name: 'urgent work' }, { id: 'v3' }])).toEqual([{ ...view, name: 'Urgent work' }])
    expect(savedViewsOf('views')).toBeNull()
  })

  it('refuses filters with a value that is not one', () => {
    expect(filtersOf({ ...NO_FILTERS, statuses: ['ready', 'someday'] })).toBeNull()
    expect(filtersOf({ ...NO_FILTERS, tags: ['UI'] })).toEqual({ ...NO_FILTERS, tags: ['ui'] })
  })

  it('takes WIP limits from 1 to 20 only', () => {
    expect(wipLimitsOf({ 'a-000001': 3 })).toEqual({ 'a-000001': 3 })
    expect(wipLimitsOf({ 'a-000001': 0 })).toBeNull()
    expect(wipLimitsOf({ 'a-000001': 2.5 })).toBeNull()
  })
})

describe('changes from the window', () => {
  it('reads each kind of change', () => {
    expect(planChangeOf({ kind: 'rank', id: 'a', before: null })).toEqual({ kind: 'rank', id: 'a', before: null })
    expect(planChangeOf({ kind: 'bulk', ids: ['a', 'a', 'b'], op: { kind: 'addTag', tag: 'UI' } })).toEqual({ kind: 'bulk', ids: ['a', 'b'], op: { kind: 'addTag', tag: 'ui' } })
    expect(planChangeOf({ kind: 'link', id: 'a', link: 'blocks', to: 'b', isOn: true })).toMatchObject({ link: 'blocks' })
    expect(planChangeOf({ kind: 'childQuest', parentId: 'a', title: '  Draft it ' })).toEqual({ kind: 'childQuest', parentId: 'a', title: 'Draft it' })
  })

  it('refuses one that does not read', () => {
    expect(planChangeOf({ kind: 'bulk', ids: [], op: { kind: 'archive' } })).toBeNull()
    expect(planChangeOf({ kind: 'bulk', ids: ['a'], op: { kind: 'points', points: 4 } })).toBeNull()
    expect(planChangeOf({ kind: 'childQuest', parentId: 'a', title: '   ' })).toBeNull()
    expect(planChangeOf({ kind: 'link', id: 'a', link: 'clones', to: 'b', isOn: true })).toBeNull()
    expect(planChangeOf({ kind: 'restore', quests: [{ id: 'a' }] })).toBeNull()
    expect(planChangeOf('rank')).toBeNull()
  })
})

describe('the hierarchy', () => {
  it('stands a child quest under its quest, a quest under its saga', () => {
    const all = quests()
    const byId = byIdOf(all)
    expect(containerOf(byId.get('pdf')!, byId)).toBe('invoice')
    expect(containerOf(byId.get('invoice')!, byId)).toBe('saga')
    expect(containerOf(byId.get('saga')!, byId)).toBeNull()
    expect(ids(childrenIn('saga', all))).toEqual(['invoice'])
    expect(ids(childrenIn('invoice', all))).toEqual(['pdf'])
  })

  it('puts ranked quests first, then the ★ order', () => {
    const all = [planQuest({ id: 'a', order: 0 }), planQuest({ id: 'b', order: 1, rank: 0 }), planQuest({ id: 'c', order: 2 })]
    expect(ids(siblingsOf(null, all))).toEqual(['b', 'a', 'c'])
  })

  it('a drag renumbers every quest beside it', () => {
    const all = [planQuest({ id: 'a', order: 0 }), planQuest({ id: 'b', order: 1 }), planQuest({ id: 'c', order: 2 })]
    expect([...(rankMove(all, 'c', 'a') as Map<string, number>)]).toEqual([['c', 0], ['a', 1], ['b', 2]])
    expect([...(rankMove(all, 'a', null) as Map<string, number>)]).toEqual([['b', 0], ['c', 1], ['a', 2]])
  })

  it('a drag never refiles a quest', () => {
    expect(rankMove(quests(), 'pdf', 'remind')).toEqual({ code: 'notBeside' })
    expect(rankMove(quests(), 'nope', null)).toEqual({ code: 'gone' })
  })

  it('ranks picked quests to the top of each place they stand', () => {
    const all = [planQuest({ id: 'a', order: 0 }), planQuest({ id: 'b', order: 1 }), planQuest({ id: 'c', order: 2 })]
    expect([...rankToEdge(all, ['c'], 'top')]).toEqual([['c', 0], ['a', 1], ['b', 2]])
    expect([...rankToEdge(all, ['a'], 'bottom')]).toEqual([['b', 0], ['c', 1], ['a', 2]])
  })

  it('keeps the backlog three deep at most', () => {
    const all = quests()
    expect(childQuestRefusal(all, 'remind', 'invoice')).toBeNull()
    expect(childQuestRefusal(all, null, 'invoice')).toBeNull()
    expect(childQuestRefusal(all, 'remind', 'pdf')).toEqual({ code: 'childOfChild', parent: 'Invoice PDF' })
    expect(childQuestRefusal(all, 'remind', 'saga')).toEqual({ code: 'childOfSaga', parent: 'Billing saga' })
    expect(childQuestRefusal(all, 'invoice', 'remind')).toEqual({ code: 'hasChildren', quest: 'Send invoices' })
    expect(childQuestRefusal(all, 'saga', 'remind')).toEqual({ code: 'hasChildren', quest: 'Billing saga' })
    expect(childQuestRefusal(all, 'remind', 'remind')).toEqual({ code: 'ownChild' })
    expect(childQuestRefusal(all, 'remind', 'docs')).toEqual({ code: 'closedParent', parent: 'Write docs' })
  })
})

describe('relationships', () => {
  it('shows both ends of every link', () => {
    const all = [planQuest({ id: 'a', dependsOn: ['b'], links: [{ kind: 'duplicates', id: 'c' }] }), planQuest({ id: 'b' }), planQuest({ id: 'c', links: [{ kind: 'relates', id: 'b' }] })]
    const byId = byIdOf(all)
    expect(linksOf(byId.get('a')!, all).map(l => [l.kind, l.quest.id])).toEqual([['dependsOn', 'b'], ['duplicates', 'c']])
    expect(linksOf(byId.get('b')!, all).map(l => [l.kind, l.quest.id])).toEqual([['blocks', 'a'], ['relates', 'c']])
    expect(linksOf(byId.get('c')!, all).map(l => [l.kind, l.quest.id])).toEqual([['relates', 'b'], ['duplicatedBy', 'a']])
  })

  it('refuses a wait that would loop, on a done quest or on itself', () => {
    const all = quests()
    expect(waitLoops(all, 'invoice', 'remind')).toBe(true)
    expect(linkRefusal(all, 'invoice', 'dependsOn', 'remind')).toEqual({ code: 'loop', quest: 'Send invoices', other: 'Payment reminders' })
    expect(linkRefusal(all, 'remind', 'blocks', 'invoice')).toEqual({ code: 'loop', quest: 'Send invoices', other: 'Payment reminders' })
    expect(linkRefusal(all, 'remind', 'dependsOn', 'docs')).toEqual({ code: 'closedWait', other: 'Write docs' })
    expect(linkRefusal(all, 'remind', 'relates', 'remind')).toEqual({ code: 'linkSelf' })
    expect(linkRefusal(all, 'remind', 'relates', 'docs')).toBeNull()
  })
})

describe('filters', () => {
  it('shows the open quests while no status is picked', () => {
    const shown = quests().filter(q => questMatches(q, NO_FILTERS, ''))
    expect(ids(shown)).not.toContain('docs')
    expect(ids(shown)).toContain('login')
  })

  it('matches any value within a kind and every kind picked', () => {
    const filters = { ...NO_FILTERS, statuses: ['ready', 'done'] as const, tags: ['billing'] }
    expect(ids(quests().filter(q => questMatches(q, { ...filters, statuses: [...filters.statuses] }, '')))).toEqual(['invoice'])
  })

  it('searches every word in titles and tags', () => {
    expect(ids(quests().filter(q => questMatches(q, NO_FILTERS, 'invoice pdf')))).toEqual(['pdf'])
    expect(ids(quests().filter(q => questMatches(q, NO_FILTERS, 'BILLING')))).toEqual(['saga', 'invoice'])
  })

  it('reads the open realm unless a view names others', () => {
    expect(realmsShown(NO_FILTERS, 'a', ['a', 'b'])).toEqual(['a'])
    expect(realmsShown({ ...NO_FILTERS, realms: ['b', 'gone'] }, 'a', ['a', 'b'])).toEqual(['b'])
    expect(realmsShown(NO_FILTERS, null, ['a'])).toEqual([])
  })
})
