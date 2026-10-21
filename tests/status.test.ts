import { expect, test } from 'claude-code/testing'

import { formatAge, statusText, weekLine } from '../hooks/ui/status'
import { makeTask } from './helpers'

test('statusText', () => {
  const task = makeTask({ title: 'Retry button' })

  expect(statusText(task, 72, { percent: 62.4, resetsAt: null }, true)).toBe('Queue-tie: checking your message…')
  expect(statusText(task, 72, { percent: 62.4, resetsAt: null }, false)).toBe('Queue-tie: Retry button · 1h 12m · 5h 62%')
  expect(statusText(task, 72, null, false)).toBe('Queue-tie: Retry button · 1h 12m')
  expect(statusText(null, 0, null, false)).toBeUndefined()
})

test('weekLine counts this week from Monday only', () => {
  // 2026-10-21 is a Wednesday; its week starts Monday 2026-10-19.
  const tasks = [
    makeTask({ state: 'done', finished: '2026-10-20T10:00:00+02:00', minutesByDay: { '2026-10-20': 100 } }),
    makeTask({ state: 'done', finished: '2026-10-21T10:00:00+02:00', minutesByDay: { '2026-10-21': 60 } }),
    makeTask({ state: 'done', finished: '2026-10-18T10:00:00+02:00', minutesByDay: { '2026-10-18': 500 } }),
    makeTask({ state: 'current', minutesByDay: { '2026-10-18': 30, '2026-10-19': 40 } }),
  ]

  expect(weekLine(tasks, { '2026-10-19': 20, '2026-10-12': 99 }, '2026-10-21')).toBe('2 done · 3h 40m')
})

test('weekLine on a Monday and a Sunday', () => {
  const done = makeTask({ state: 'done', finished: '2026-10-19T08:00:00+02:00', minutesByDay: { '2026-10-19': 30 } })

  expect(weekLine([done], {}, '2026-10-19')).toBe('1 done · 30m')
  expect(weekLine([done], {}, '2026-10-25')).toBe('1 done · 30m')
  expect(weekLine([done], {}, '2026-10-26')).toBe('0 done · 0m')
})

test('formatAge', () => {
  const MIN = 60_000

  expect(formatAge(5 * MIN)).toBe('5m')
  expect(formatAge(3 * 60 * MIN)).toBe('3h')
  expect(formatAge(50 * 60 * MIN)).toBe('2d')
  expect(formatAge(-5)).toBe('0m')
})
