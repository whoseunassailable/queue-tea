import { expect, test } from 'claude-code/testing'

import {
  blockedTasks,
  blockedText,
  canWaitFor,
  effectivePriority,
  estimateMinutes,
  isBlocked,
  nextBudget,
  rankBacklog,
  suggest,
  typicalMinutes,
  wouldLoop,
} from '../hooks/plan'
import { makeTask } from './helpers'

const at = (minute: number) => `2026-10-21T10:${String(minute).padStart(2, '0')}:00+02:00`
const titles = (record: Parameters<typeof rankBacklog>[0], budget: number | null = null) =>
  rankBacklog(record, budget).map(r => r.task.title)

test('a task waiting for an unfinished one is blocked; a done or removed blocker stops blocking', () => {
  const a = makeTask({ title: 'A' })
  const b = makeTask({ title: 'B', blockedBy: [a.id] })

  expect(isBlocked(b, [a, b])).toBe(true)
  expect(blockedText(b, [a, b])).toBe('waits for A')
  expect(isBlocked(b, [{ ...a, state: 'done' }, b])).toBe(false)
  expect(isBlocked(b, [{ ...a, state: 'removed' }, b])).toBe(false)
})

test('a typed reason blocks until it is cleared', () => {
  const a = makeTask({ title: 'A', blockedReason: 'waiting for the API key' })

  expect(isBlocked(a, [a])).toBe(true)
  expect(blockedText(a, [a])).toBe('waiting for the API key')
  expect(blockedTasks([a]).map(t => t.title)).toEqual(['A'])
})

test('a wait that would close a loop is found, and is not offered', () => {
  const a = makeTask({ title: 'A' })
  const b = makeTask({ title: 'B', blockedBy: [a.id] })
  const c = makeTask({ title: 'C', blockedBy: [b.id] })
  const tasks = [a, b, c]

  expect(wouldLoop(tasks, a.id, c.id)).toBe(true)
  expect(wouldLoop(tasks, c.id, a.id)).toBe(false)
  expect(canWaitFor(tasks, a.id).map(t => t.title)).toEqual([])
  expect(canWaitFor(tasks, c.id).map(t => t.title)).toEqual(['A'])
})

test('a blocked task is never suggested', () => {
  const a = makeTask({ title: 'A', priority: 'low', created: at(2) })
  const b = makeTask({ title: 'B', priority: 'urgent', created: at(1), blockedBy: [a.id] })

  expect(titles({ tasks: [a, b], playNext: null })).toEqual(['A'])
  expect(suggest({ tasks: [b, { ...a, blockedReason: 'later' }], playNext: null }, null)).toBe(null)
})

test('a task takes the highest priority of the tasks waiting for it', () => {
  const a = makeTask({ title: 'A', priority: 'low', created: at(1) })
  const b = makeTask({ title: 'B', priority: 'urgent', blockedBy: [a.id] })
  const c = makeTask({ title: 'C', priority: 'high', created: at(0) })

  expect(effectivePriority(a, [a, b, c])).toBe('urgent')
  expect(titles({ tasks: [a, b, c], playNext: null })).toEqual(['A', 'C'])
  expect(rankBacklog({ tasks: [a, b, c], playNext: null }, null)[0]!.why).toBe('urgent, from what waits for it · unblocks B')
})

test('same priority: the one that unblocks more first, then the oldest', () => {
  const a = makeTask({ title: 'A', created: at(1) })
  const b = makeTask({ title: 'B', created: at(2) })
  const waits = makeTask({ title: 'W', blockedBy: [b.id] })

  expect(titles({ tasks: [a, b, waits], playNext: null })).toEqual(['B', 'A'])
})

test('Play next comes before every priority', () => {
  const a = makeTask({ title: 'A', priority: 'urgent' })
  const b = makeTask({ title: 'B', priority: 'low' })
  const ranked = rankBacklog({ tasks: [a, b], playNext: b.id }, null)

  expect(ranked.map(r => r.task.title)).toEqual(['B', 'A'])
  expect(ranked[0]!.why).toBe('you chose Play next')
})

test('with a time set, what fits comes first; with nothing fitting, the shortest', () => {
  const refactor = makeTask({ title: 'Refactor', priority: 'high', difficulty: { expected: 'hard', actual: null } })
  const fix = makeTask({ title: 'Fix', priority: 'mid', difficulty: { expected: 'light', actual: null } })
  const record = { tasks: [refactor, fix], playNext: null }

  expect(titles(record)).toEqual(['Refactor', 'Fix'])
  expect(titles(record, 30)).toEqual(['Fix', 'Refactor'])
  expect(rankBacklog(record, 30)[0]!.why).toBe('mid · fits 30m')
  expect(rankBacklog({ tasks: [refactor], playNext: null }, 30)[0]!.why).toBe('high · nothing fits 30m; the shortest')
})

test('the estimate: defaults until three tasks of a difficulty are done, then their middle value, less time so far', () => {
  const done = (minutes: number) =>
    makeTask({ state: 'done', difficulty: { expected: 'light', actual: 'light' }, minutesByDay: { '2026-10-20': minutes } })
  const light = makeTask({ difficulty: { expected: 'light', actual: null } })

  expect(typicalMinutes([light], 'light')).toBe(30)
  expect(typicalMinutes([light], 'medium')).toBe(90)
  expect(typicalMinutes([light], 'hard')).toBe(240)
  expect(typicalMinutes([done(20), done(50), done(12), light], 'light')).toBe(20)
  expect(typicalMinutes([done(20), done(50), done(12), done(40), light], 'light')).toBe(30)
  expect(estimateMinutes({ ...light, minutesByDay: { '2026-10-21': 25 } }, [light])).toBe(10)
  expect(rankBacklog({ tasks: [light], playNext: null }, null)[0]!.isShort).toBe(true)
})

test('Time I have steps any, 30m, 1h, 2h and round again', () => {
  expect(nextBudget(null)).toBe(30)
  expect(nextBudget(30)).toBe(60)
  expect(nextBudget(60)).toBe(120)
  expect(nextBudget(120)).toBe(null)
})
