import { describe, expect, it } from 'vitest'

import { planQuest, planRealm, planView } from '../test_fixtures'
import { boardOf, countIn, openWaits, targetsOf, transitionOf } from './plan_board'
import type { BoardCard, MoveContext } from './plan_board'

const realm = planView().realms[0]!
const cards: BoardCard[] = realm.quests.filter(q => !q.isSaga).map(quest => ({ quest, realm }))
const card = (id: string): BoardCard => cards.find(c => c.quest.id === id)!
const ctx: MoveContext = { openRealm: realm.key, active: 1, wipLimit: null }
const ids = (list: readonly BoardCard[]) => list.map(c => c.quest.id)

describe('the quest board', () => {
  it('puts each quest in its status column, the same status the backlog shows', () => {
    const [lane] = boardOf(cards, 'none', 'No saga', p => p)
    expect(ids(lane!.columns.ready)).toEqual(['invoice', 'pdf'])
    expect(ids(lane!.columns.blocked)).toEqual(['remind'])
    expect(ids(lane!.columns.active)).toEqual(['login'])
    expect(ids(lane!.columns.done)).toEqual(['docs'])
    expect(lane!.label).toBeNull()
  })

  it('lanes by saga, with quests outside any saga last', () => {
    const lanes = boardOf(cards, 'saga', 'No saga', p => p)
    expect(lanes.map(l => l.label)).toEqual(['Billing saga', 'No saga'])
    expect(ids(lanes[0]!.columns.ready)).toEqual(['invoice', 'pdf'])
    expect(countIn(lanes, 'ready')).toBe(2)
  })

  it('lanes by priority in priority order, and by realm', () => {
    expect(boardOf(cards, 'priority', 'No saga', p => p.toUpperCase()).map(l => l.label)).toEqual(['URGENT', 'HIGH', 'MID'])
    const other = planRealm('b-000002', [planQuest({ id: 'x', title: 'Other' })])
    const both = [...cards, { quest: other.quests[0]!, realm: other }]
    expect(boardOf(both, 'realm', 'No saga', p => p).map(l => l.label)).toEqual(['a', 'b'])
  })
})

describe('moves between columns', () => {
  it('maps each allowed move to the flow the Quests page uses', () => {
    expect(transitionOf(card('invoice'), 'active', ctx)).toEqual({ kind: 'move', move: 'start' })
    expect(transitionOf(card('invoice'), 'blocked', ctx)).toEqual({ kind: 'move', move: 'seal' })
    expect(transitionOf(card('login'), 'ready', ctx)).toEqual({ kind: 'move', move: 'back' })
    expect(transitionOf(card('login'), 'blocked', ctx)).toEqual({ kind: 'move', move: 'sealActive' })
    expect(transitionOf(card('login'), 'done', ctx)).toEqual({ kind: 'move', move: 'finish' })
    const review: BoardCard = { quest: { ...card('login').quest, status: 'review' }, realm }
    expect(transitionOf(review, 'active', ctx)).toEqual({ kind: 'move', move: 'notYet' })
  })

  it('refuses a sealed quest that still waits, naming what it waits for', () => {
    expect(openWaits(card('remind').quest, realm).map(q => q.title)).toEqual(['Send invoices'])
    expect(transitionOf(card('remind'), 'ready', ctx)).toEqual({ kind: 'refused', refusal: { code: 'stillWaits', waits: ['Send invoices'] } })
    const free: BoardCard = { quest: { ...card('remind').quest, dependsOn: ['docs'] }, realm }
    expect(transitionOf(free, 'ready', ctx)).toEqual({ kind: 'move', move: 'unseal' })
  })

  it('holds Active to its WIP limit', () => {
    expect(transitionOf(card('invoice'), 'active', { ...ctx, wipLimit: 1 })).toEqual({ kind: 'refused', refusal: { code: 'wip', limit: 1 } })
    expect(transitionOf(card('invoice'), 'active', { ...ctx, wipLimit: 2 })).toEqual({ kind: 'move', move: 'start' })
  })

  it('refuses what has no flow, with a reason', () => {
    expect(transitionOf(card('invoice'), 'done', ctx)).toEqual({ kind: 'refused', refusal: { code: 'startFirst' } })
    expect(transitionOf(card('invoice'), 'review', ctx)).toEqual({ kind: 'refused', refusal: { code: 'review' } })
    expect(transitionOf(card('remind'), 'active', ctx)).toEqual({ kind: 'refused', refusal: { code: 'unsealFirst' } })
    expect(transitionOf(card('docs'), 'ready', ctx)).toEqual({ kind: 'refused', refusal: { code: 'victory' } })
    expect(transitionOf(card('invoice'), 'active', { ...ctx, openRealm: 'other' })).toEqual({ kind: 'refused', refusal: { code: 'otherRealm', realm: 'a' } })
    expect(transitionOf(card('invoice'), 'ready', ctx)).toEqual({ kind: 'none' })
  })

  it('offers only the columns a card can go to', () => {
    expect(targetsOf(card('invoice'), ctx)).toEqual(['blocked', 'active'])
    expect(targetsOf(card('remind'), ctx)).toEqual([])
    expect(targetsOf(card('docs'), ctx)).toEqual([])
  })
})
