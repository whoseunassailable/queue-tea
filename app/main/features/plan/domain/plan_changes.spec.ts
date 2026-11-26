import { describe, expect, it } from 'vitest'

import type { ProjectRecord, Task } from '../../../../../types'
import { emptyRecord } from '../../../../../hooks/shared/records/data/datasources/record_source'
import type { PlanChange } from '../../../../shared/plan'
import { makeTask } from '../../tasks/api/fixtures'
import { applyPlanChange } from './plan_changes'
import type { PlanContext } from './plan_changes'
import { parentQuestsOf, planRealmOf } from './plan_view'

const record = (tasks: Task[], over: Partial<ProjectRecord> = {}): ProjectRecord => ({ ...emptyRecord('demo', '/p/demo'), tasks, ...over })
const CTX: PlanContext = { key: 'demo-abc123', budget: null, now: '2026-11-26T09:00:00+01:00', newId: () => 't-new' }

// A saga with a quest and its child quest, a quest on its own, one in hand,
// one sealed waiting for the quest, and a victory.
const realm = () =>
  record([
    makeTask({ id: 'saga', title: 'Billing saga' }),
    makeTask({ id: 'invoice', title: 'Send invoices', parentIds: ['saga'], tags: ['billing'], points: 5 }),
    makeTask({ id: 'pdf', title: 'Invoice PDF', parentIds: ['saga'], parentQuest: 'invoice' }),
    makeTask({ id: 'lone', title: 'Lone quest', priority: 'low' }),
    makeTask({ id: 'login', title: 'Fix login', state: 'current', started: '2026-11-25T10:00:00+01:00' }),
    makeTask({ id: 'remind', title: 'Payment reminders', blockedBy: ['invoice'] }),
    makeTask({ id: 'docs', title: 'Write docs', state: 'done', finished: '2026-11-24T18:00:00+01:00' }),
  ])

const changed = (r: ProjectRecord, change: PlanChange) => {
  const applied = applyPlanChange(r, change, CTX)
  if (applied.kind !== 'changed') throw new Error(`should change: ${JSON.stringify(applied)}`)

  return applied
}
const refusalOf = (r: ProjectRecord, change: PlanChange) => {
  const applied = applyPlanChange(r, change, CTX)
  if (applied.kind !== 'refused') throw new Error('should be refused')

  return applied.refusal
}
const task = (r: ProjectRecord, id: string) => r.tasks.find(t => t.id === id)!
// Undo puts every quest back as it was, field for field.
const undone = (r: ProjectRecord, change: PlanChange) => changed(changed(r, change).record, { kind: 'restore', quests: changed(r, change).undo }).record

describe('the realm as the Plan tab reads it', () => {
  it('reads where each quest stands from the record', () => {
    const quests = planRealmOf('k', realm(), null).quests
    const status = Object.fromEntries(quests.map(q => [q.id, q.status]))
    expect(status).toMatchObject({ invoice: 'ready', remind: 'blocked', login: 'active', docs: 'done' })
    expect(quests.find(q => q.id === 'saga')).toMatchObject({ isSaga: true })
    expect(quests.find(q => q.id === 'pdf')).toMatchObject({ parentQuest: 'invoice', sagaIds: ['saga'] })
    expect(quests.find(q => q.isStar)?.id).toBeDefined()
  })

  it('reads a quest in review as review', () => {
    const quests = planRealmOf('k', record([makeTask({ id: 'a', state: 'current', review: { at: '2026-11-25T10:00:00Z', checked: null } })]), null).quests
    expect(quests[0]?.status).toBe('review')
  })

  it('leaves out removed quests and keeps effort points apart from minutes', () => {
    const r = record([makeTask({ id: 'a', points: 8, minutesByDay: { '2026-11-25': 45 } }), makeTask({ id: 'b', state: 'removed' })])
    expect(planRealmOf('k', r, null).quests).toMatchObject([{ id: 'a', points: 8, minutes: 45 }])
  })

  it('reads a broken parent quest as none, so the backlog stays three deep', () => {
    const r = record([
      makeTask({ id: 'a', parentQuest: 'b' }),
      makeTask({ id: 'b', parentQuest: 'a' }),
      makeTask({ id: 'c', parentQuest: 'c' }),
      makeTask({ id: 'd', parentQuest: 'gone' }),
      makeTask({ id: 'top' }),
      makeTask({ id: 'mid', parentQuest: 'top' }),
      makeTask({ id: 'deep', parentQuest: 'mid' }),
      makeTask({ id: 'saga' }),
      makeTask({ id: 'chapter', parentIds: ['saga'] }),
      makeTask({ id: 'under-saga', parentQuest: 'saga' }),
      makeTask({ id: 'odd', parentQuest: 42 as unknown as string }),
    ])
    expect([...parentQuestsOf(r.tasks)]).toEqual([['mid', 'top']])
  })

  it('reads hand-edited planning values that do not read as none', () => {
    const r = record([makeTask({ id: 'a', tags: 'ui' as unknown as string[], points: 4, rank: Number.NaN, links: [{ kind: 'x', id: 'b' }] as never })])
    expect(planRealmOf('k', r, null).quests[0]).toMatchObject({ tags: [], points: null, rank: null, links: [] })
  })
})

describe('ranking by drag', () => {
  it('renumbers the quests beside it and keeps every other field', () => {
    const r = realm()
    const { record: next } = changed(r, { kind: 'rank', id: 'remind', before: 'lone' })
    const top = planRealmOf('k', next, null).quests.filter(q => q.sagaIds.length === 0 && q.parentQuest === null && q.status !== 'done')
    const order = top.sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99)).map(q => q.id)
    expect(order.indexOf('remind')).toBeLessThan(order.indexOf('lone'))
    expect(task(next, 'remind').blockedBy).toEqual(['invoice'])
    expect(undone(r, { kind: 'rank', id: 'remind', before: 'lone' })).toEqual(r)
  })

  it('refuses a drop among other quests and a done quest', () => {
    expect(refusalOf(realm(), { kind: 'rank', id: 'pdf', before: 'lone' })).toEqual({ code: 'notBeside' })
    expect(refusalOf(realm(), { kind: 'rank', id: 'docs', before: null })).toEqual({ code: 'closed', quest: 'Write docs' })
  })
})

describe('bulk edits', () => {
  it('sets priority, difficulty and points on every quest picked, and undoes', () => {
    const r = realm()
    for (const op of [
      { kind: 'priority', priority: 'urgent' },
      { kind: 'difficulty', difficulty: 'hard' },
      { kind: 'points', points: 13 },
    ] as const) {
      const { record: next } = changed(r, { kind: 'bulk', ids: ['lone', 'remind'], op })
      expect(task(next, 'invoice')).toEqual(task(r, 'invoice'))
      expect(undone(r, { kind: 'bulk', ids: ['lone', 'remind'], op })).toEqual(r)
    }
    expect(task(changed(r, { kind: 'bulk', ids: ['lone'], op: { kind: 'points', points: 13 } }).record, 'lone').points).toBe(13)
    expect('points' in task(changed(r, { kind: 'bulk', ids: ['invoice'], op: { kind: 'points', points: null } }).record, 'invoice')).toBe(false)
  })

  it('adds and takes off tags, and refuses an eleventh', () => {
    const r = realm()
    const added = changed(r, { kind: 'bulk', ids: ['invoice', 'lone'], op: { kind: 'addTag', tag: 'q4' } }).record
    expect(task(added, 'invoice').tags).toEqual(['billing', 'q4'])
    expect(task(added, 'lone').tags).toEqual(['q4'])
    const removed = changed(added, { kind: 'bulk', ids: ['invoice', 'lone'], op: { kind: 'removeTag', tag: 'q4' } }).record
    expect(task(removed, 'invoice').tags).toEqual(['billing'])
    expect('tags' in task(removed, 'lone')).toBe(false)
    const full = record([makeTask({ id: 'a', title: 'Full', tags: Array.from({ length: 10 }, (_, i) => `t${i}`) })])
    expect(refusalOf(full, { kind: 'bulk', ids: ['a'], op: { kind: 'addTag', tag: 'one-more' } })).toEqual({ code: 'tooManyTags', quest: 'Full' })
  })

  it('is whole or refused: one done quest stops the lot', () => {
    expect(refusalOf(realm(), { kind: 'bulk', ids: ['lone', 'docs'], op: { kind: 'priority', priority: 'high' } })).toEqual({ code: 'closed', quest: 'Write docs' })
    expect(refusalOf(realm(), { kind: 'bulk', ids: ['lone', 'nope'], op: { kind: 'priority', priority: 'high' } })).toEqual({ code: 'gone' })
  })

  it('moves a quest under another as a child quest, in that quest’s sagas', () => {
    const r = realm()
    const { record: next } = changed(r, { kind: 'bulk', ids: ['lone'], op: { kind: 'move', to: { kind: 'quest', id: 'invoice' } } })
    expect(task(next, 'lone')).toMatchObject({ parentQuest: 'invoice', parentIds: ['saga'] })
    expect(undone(r, { kind: 'bulk', ids: ['lone'], op: { kind: 'move', to: { kind: 'quest', id: 'invoice' } } })).toEqual(r)
  })

  it('moves a quest into a saga, its child quests with it', () => {
    const r = record([...realm().tasks, makeTask({ id: 'saga2', title: 'Other saga' }), makeTask({ id: 'ch', parentIds: ['saga2'] })])
    const { record: next } = changed(r, { kind: 'bulk', ids: ['invoice'], op: { kind: 'move', to: { kind: 'saga', id: 'saga2' } } })
    expect(task(next, 'invoice').parentIds).toEqual(['saga2'])
    expect(task(next, 'pdf')).toMatchObject({ parentIds: ['saga2'], parentQuest: 'invoice' })
  })

  it('takes a child quest out to stand on its own', () => {
    const { record: next } = changed(realm(), { kind: 'bulk', ids: ['pdf'], op: { kind: 'move', to: { kind: 'none' } } })
    expect(task(next, 'pdf').parentIds).toEqual([])
    expect('parentQuest' in task(next, 'pdf')).toBe(false)
  })

  it('refuses a move that would nest deeper than three', () => {
    expect(refusalOf(realm(), { kind: 'bulk', ids: ['lone'], op: { kind: 'move', to: { kind: 'quest', id: 'pdf' } } })).toMatchObject({ code: 'childOfChild' })
    expect(refusalOf(realm(), { kind: 'bulk', ids: ['invoice'], op: { kind: 'move', to: { kind: 'quest', id: 'lone' } } })).toMatchObject({ code: 'hasChildren' })
    expect(refusalOf(realm(), { kind: 'bulk', ids: ['lone'], op: { kind: 'move', to: { kind: 'saga', id: 'pdf' } } })).toEqual({ code: 'cantBeSaga', quest: 'Invoice PDF', why: 'child' })
    expect(refusalOf(realm(), { kind: 'bulk', ids: ['lone'], op: { kind: 'move', to: { kind: 'saga', id: 'invoice' } } })).toEqual({ code: 'cantBeSaga', quest: 'Send invoices', why: 'parent' })
    const withChapter = record([...realm().tasks, makeTask({ id: 'chapter', title: 'A chapter', parentIds: ['saga'] })])
    expect(refusalOf(withChapter, { kind: 'bulk', ids: ['lone'], op: { kind: 'move', to: { kind: 'saga', id: 'chapter' } } })).toMatchObject({ code: 'engine' })
  })

  it('archives queued quests, frees their child quests, and undoes', () => {
    const r = realm()
    const change: PlanChange = { kind: 'bulk', ids: ['invoice', 'lone'], op: { kind: 'archive' } }
    const { record: next } = changed(r, change)
    expect(task(next, 'invoice').state).toBe('removed')
    expect('parentQuest' in task(next, 'pdf')).toBe(false)
    expect(undone(r, change)).toEqual(r)
  })

  it('archiving a saga sets its quests free, and Undo files them back', () => {
    const r = realm()
    const change: PlanChange = { kind: 'bulk', ids: ['saga'], op: { kind: 'archive' } }
    expect(task(changed(r, change).record, 'invoice').parentIds).toEqual([])
    expect(undone(r, change)).toEqual(r)
  })

  it('refuses to archive a quest in hand', () => {
    expect(refusalOf(realm(), { kind: 'bulk', ids: ['lone', 'login'], op: { kind: 'archive' } })).toEqual({ code: 'archiveActive', quest: 'Fix login' })
  })

  it('ranks picked quests to the top', () => {
    const { record: next } = changed(realm(), { kind: 'bulk', ids: ['remind'], op: { kind: 'rankTo', edge: 'top' } })
    expect(task(next, 'remind').rank).toBe(0)
  })
})

describe('links', () => {
  it('depends on and blocks are one wait, read from either end', () => {
    const r = realm()
    const dep = changed(r, { kind: 'link', id: 'lone', link: 'dependsOn', to: 'invoice', isOn: true }).record
    const blocks = changed(r, { kind: 'link', id: 'invoice', link: 'blocks', to: 'lone', isOn: true }).record
    expect(task(dep, 'lone').blockedBy).toEqual(['invoice'])
    expect(blocks).toEqual(dep)
    expect(task(changed(dep, { kind: 'link', id: 'lone', link: 'dependsOn', to: 'invoice', isOn: false }).record, 'lone').blockedBy).toEqual([])
  })

  it('keeps relates to once, and takes it off from either end', () => {
    const r = realm()
    const on = changed(r, { kind: 'link', id: 'lone', link: 'relates', to: 'invoice', isOn: true }).record
    expect(changed(on, { kind: 'link', id: 'invoice', link: 'relates', to: 'lone', isOn: true }).record).toEqual(on)
    const off = changed(on, { kind: 'link', id: 'invoice', link: 'relates', to: 'lone', isOn: false }).record
    expect('links' in task(off, 'lone')).toBe(false)
  })

  it('records duplicates on the duplicate, and undoes', () => {
    const r = realm()
    const change: PlanChange = { kind: 'link', id: 'remind', link: 'duplicates', to: 'lone', isOn: true }
    expect(task(changed(r, change).record, 'remind').links).toEqual([{ kind: 'duplicates', id: 'lone' }])
    expect(undone(r, change)).toEqual(r)
  })

  it('refuses a loop and a wait for a victory', () => {
    expect(refusalOf(realm(), { kind: 'link', id: 'invoice', link: 'dependsOn', to: 'remind', isOn: true })).toMatchObject({ code: 'loop' })
    expect(refusalOf(realm(), { kind: 'link', id: 'lone', link: 'dependsOn', to: 'docs', isOn: true })).toMatchObject({ code: 'closedWait' })
    expect(refusalOf(realm(), { kind: 'link', id: 'docs', link: 'dependsOn', to: 'lone', isOn: true })).toMatchObject({ code: 'closed' })
  })
})

describe('child quests', () => {
  it('adds one under a quest, in its sagas, at its priority', () => {
    const r = realm()
    const { record: next, undo } = changed(r, { kind: 'childQuest', parentId: 'invoice', title: 'Email copy' })
    expect(task(next, 't-new')).toMatchObject({ title: 'Email copy', parentQuest: 'invoice', parentIds: ['saga'], state: 'queued', priority: 'mid' })
    expect(undo).toEqual([expect.objectContaining({ id: 't-new', state: 'new' })])
    expect(task(changed(next, { kind: 'restore', quests: undo }).record, 't-new').state).toBe('removed')
  })

  it('refuses one under a child quest or a saga', () => {
    expect(refusalOf(realm(), { kind: 'childQuest', parentId: 'pdf', title: 'x' })).toMatchObject({ code: 'childOfChild' })
    expect(refusalOf(realm(), { kind: 'childQuest', parentId: 'saga', title: 'x' })).toMatchObject({ code: 'childOfSaga' })
  })
})
