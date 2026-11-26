import { describe, expect, it } from 'vitest'

import type { CalendarEvent } from '../../../../shared/calendar'
import { activeQuest, note, projectView, quest } from '../../../test_support'
import { dueItemsOf, eventItemOf, itemsOf, itemsOn, lanesOf, meetingItemsOf, minutesOn } from './calendar_items'
import type { CalendarItem } from './calendar_items'

const HERE = 'America/Chicago'
const timed = (id: string, start: string, end: string, zone = HERE): CalendarEvent => ({ id, title: id, when: { kind: 'timed', start, end, zone }, place: null, notes: null })
const allDay = (id: string, startDay: string, endDay: string): CalendarEvent => ({ id, title: id, when: { kind: 'allDay', startDay, endDay }, place: null, notes: null })
const realmOf = (over: Parameters<typeof projectView>[1] = {}) => {
  const view = projectView('demo-abc123', over)
  if (view.kind !== 'readable') throw new Error('readable')

  return view
}
const keys = (items: CalendarItem[]) => items.map(item => item.key)

describe('events on the Mac’s clock', () => {
  it('shows a call made in Lisbon at its hour in Chicago', () => {
    const item = eventItemOf(timed('call', '2026-11-25T09:00', '2026-11-25T10:00', 'Europe/Lisbon'), HERE)

    expect(item).toMatchObject({ firstDay: '2026-11-25', lastDay: '2026-11-25', start: '2026-11-25T03:00', end: '2026-11-25T04:00' })
  })

  it('moves a morning call in Tokyo onto the evening before in Chicago', () => {
    const item = eventItemOf(timed('standup', '2026-11-26T09:00', '2026-11-26T09:30', 'Asia/Tokyo'), HERE)

    expect(item).toMatchObject({ firstDay: '2026-11-25', start: '2026-11-25T18:00' })
  })

  it('keeps an all-day event on its own days, whatever the zone', () => {
    expect(eventItemOf(allDay('trip', '2026-12-03', '2026-12-06'), 'Asia/Tokyo')).toMatchObject({ firstDay: '2026-12-03', lastDay: '2026-12-06', start: null })
  })

  it('puts an event that ends at midnight on its one day only, and one past midnight on both', () => {
    expect(eventItemOf(timed('late', '2026-11-25T22:00', '2026-11-26T00:00'), HERE)).toMatchObject({ firstDay: '2026-11-25', lastDay: '2026-11-25' })
    expect(eventItemOf(timed('later', '2026-11-25T22:00', '2026-11-26T01:00'), HERE)).toMatchObject({ firstDay: '2026-11-25', lastDay: '2026-11-26' })
  })

  it('cuts a part on another day at the edges of the day', () => {
    const item = { start: '2026-11-25T22:00', end: '2026-11-26T01:30' }

    expect(minutesOn(item, '2026-11-25')).toEqual({ from: 22 * 60, to: 24 * 60 })
    expect(minutesOn(item, '2026-11-26')).toEqual({ from: 0, to: 90 })
  })
})

describe('due dates', () => {
  it('takes every quest in play with a due date: on the board, in a saga, sealed and active', () => {
    const realm = realmOf({
      ready: [
        { kind: 'quest', quest: quest({ id: 'a', due: '2026-12-01' }) },
        { kind: 'quest', quest: quest({ id: 'none' }) },
        { kind: 'saga', quest: quest({ id: 'saga', due: '2026-12-10' }), chapters: [quest({ id: 'ch', due: '2026-12-02' }), quest({ id: 'ch-sealed', due: '2026-12-03', sealedBecause: 'Waits for ch' })], progress: { done: 0, total: 2, current: 0, blocked: 1 }, hasStar: false, shared: [] },
      ],
      sealed: [{ kind: 'quest', quest: quest({ id: 's', due: '2026-11-20', sealedBecause: 'Waits for a' }) }],
      activeQuests: [activeQuest({ id: 'x', due: '2026-11-24' })],
    })
    const items = dueItemsOf(realm, '2026-11-25')

    expect(items.map(item => item.kind === 'due' && [item.questId, item.state, item.isOverdue])).toEqual([
      ['x', 'active', true],
      ['a', 'waiting', false],
      ['saga', 'waiting', false],
      ['ch', 'waiting', false],
      ['ch-sealed', 'sealed', false],
      ['s', 'sealed', true],
    ])
  })

  it('is not overdue on the day itself', () => {
    const realm = realmOf({ ready: [{ kind: 'quest', quest: quest({ id: 'a', due: '2026-11-25' }) }] })

    expect(dueItemsOf(realm, '2026-11-25')[0]).toMatchObject({ isOverdue: false })
  })
})

describe('a day’s items', () => {
  it('lists all-day events, then due dates, then timed ones by their start', () => {
    const realm = realmOf({ ready: [{ kind: 'quest', quest: quest({ id: 'ship', due: '2026-11-25' }) }] })
    const items = itemsOf([timed('noon', '2026-11-25T12:00', '2026-11-25T13:00'), timed('nine', '2026-11-25T09:00', '2026-11-25T09:30'), allDay('trip', '2026-11-24', '2026-11-26')], realm, HERE, '2026-11-25')

    expect(keys(itemsOn(items, '2026-11-25'))).toEqual(['trip', 'due-ship', 'nine', 'noon'])
    expect(keys(itemsOn(items, '2026-11-26'))).toEqual(['trip'])
  })
})

describe('lanes', () => {
  const lanes = (spans: [string, number, number][]) => lanesOf(spans.map(([item, from, to]) => ({ item, from, to }))).map(p => [p.item, p.lane, p.lanes])

  it('gives events that overlap a lane each, and leaves the rest full width', () => {
    expect(lanes([['a', 540, 600], ['b', 570, 630], ['c', 700, 760]])).toEqual([
      ['a', 0, 2],
      ['b', 1, 2],
      ['c', 0, 1],
    ])
  })

  it('reuses a lane once its event is over', () => {
    expect(lanes([['a', 540, 660], ['b', 540, 580], ['c', 600, 640]])).toEqual([
      ['a', 0, 2],
      ['b', 1, 2],
      ['c', 1, 2],
    ])
  })

  it('draws a five-minute call tall enough to read, and lanes it by that size', () => {
    const placed = lanesOf([{ item: 'quick', from: 540, to: 545 }, { item: 'next', from: 550, to: 600 }])

    expect(placed[0]).toMatchObject({ to: 560, lanes: 2 })
  })
})

describe('meeting notes', () => {
  const meeting = (id: string, start: string, end: string, zone = HERE, over: Parameters<typeof note>[0] = {}) =>
    note({ id, title: id, type: 'meeting', meeting: { attendees: [], link: 'https://zoom.us/j/1', time: { start, end, zone } }, ...over })

  it("puts a Meeting note with a time on the Mac's clock, and leaves out the rest", () => {
    const notes = [
      meeting('lisbon', '2026-11-25T15:00', '2026-11-25T15:30', 'Europe/Lisbon'),
      meeting('archived', '2026-11-25T10:00', '2026-11-25T11:00', HERE, { isArchived: true }),
      meeting('idea', '2026-11-25T10:00', '2026-11-25T11:00', HERE, { type: 'idea' }),
      note({ id: 'untimed', type: 'meeting' }),
    ]

    expect(meetingItemsOf(notes, HERE)).toEqual([
      { kind: 'meeting', key: 'meeting-lisbon', noteId: 'lisbon', title: 'lisbon', time: { start: '2026-11-25T15:00', end: '2026-11-25T15:30', zone: 'Europe/Lisbon' }, link: 'https://zoom.us/j/1', firstDay: '2026-11-25', lastDay: '2026-11-25', start: '2026-11-25T09:00', end: '2026-11-25T09:30' },
    ])
  })

  it('puts one that ends at midnight on its one day, and one past midnight on both', () => {
    expect(meetingItemsOf([meeting('late', '2026-11-25T23:00', '2026-11-26T00:00')], HERE)[0]).toMatchObject({ firstDay: '2026-11-25', lastDay: '2026-11-25' })
    expect(meetingItemsOf([meeting('later', '2026-11-25T23:00', '2026-11-26T00:30')], HERE)[0]).toMatchObject({ firstDay: '2026-11-25', lastDay: '2026-11-26' })
  })

  it("sorts with the day's events by when they start", () => {
    const items = itemsOf([timed('noon', '2026-11-25T12:00', '2026-11-25T13:00')], realmOf(), HERE, '2026-11-25', [meeting('standup', '2026-11-25T09:00', '2026-11-25T09:15')])

    expect(keys(itemsOn(items, '2026-11-25'))).toEqual(['meeting-standup', 'noon'])
  })
})
