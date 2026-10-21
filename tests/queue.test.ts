import { expect, test } from 'claude-code/testing'

import {
  currentTask,
  newTask,
  orderQueue,
  removeTask,
  setPriority,
  suggestion,
} from '../hooks/queue'
import { makeTask } from './helpers'

const at = (minute: number) => `2026-10-21T10:${String(minute).padStart(2, '0')}:00+02:00`

test('urgent before high before mid before okay before low', () => {
  const tasks = [
    makeTask({ title: 'low', priority: 'low', created: at(1) }),
    makeTask({ title: 'okay', priority: 'okay', created: at(2) }),
    makeTask({ title: 'mid', priority: 'mid', created: at(3) }),
    makeTask({ title: 'high', priority: 'high', created: at(4) }),
    makeTask({ title: 'urgent', priority: 'urgent', created: at(5) }),
  ]

  expect(orderQueue(tasks).map(t => t.title)).toEqual(['urgent', 'high', 'mid', 'okay', 'low'])
})

test('same priority: oldest first', () => {
  const tasks = [
    makeTask({ title: 'newer', priority: 'high', created: at(9) }),
    makeTask({ title: 'older', priority: 'high', created: at(2) }),
  ]

  expect(orderQueue(tasks).map(t => t.title)).toEqual(['older', 'newer'])
})

test('only queued tasks are in the queue', () => {
  const tasks = [
    makeTask({ title: 'q' }),
    makeTask({ title: 'c', state: 'current' }),
    makeTask({ title: 'd', state: 'done' }),
    makeTask({ title: 'r', state: 'removed' }),
  ]

  expect(orderQueue(tasks).map(t => t.title)).toEqual(['q'])
})

test('suggestion is the first of the queue, null when empty', () => {
  const tasks = [
    makeTask({ title: 'later', priority: 'low' }),
    makeTask({ title: 'first', priority: 'urgent' }),
  ]

  expect(suggestion(tasks)?.title).toBe('first')
  expect(suggestion([])).toBeNull()
})

test('currentTask finds the current one, null when none', () => {
  const tasks = [makeTask(), makeTask({ title: 'now', state: 'current' })]

  expect(currentTask(tasks)?.title).toBe('now')
  expect(currentTask([makeTask()])).toBeNull()
})

test('removeTask marks a queued task removed and leaves a current one alone', () => {
  const queued = makeTask()
  const current = makeTask({ state: 'current' })
  const tasks = [queued, current]

  expect(removeTask(tasks, queued.id).find(t => t.id === queued.id)?.state).toBe('removed')
  expect(removeTask(tasks, current.id).find(t => t.id === current.id)?.state).toBe('current')
})

test('setPriority moves a task in the order', () => {
  const a = makeTask({ title: 'a', priority: 'high', created: at(1) })
  const b = makeTask({ title: 'b', priority: 'low', created: at(2) })

  expect(orderQueue(setPriority([a, b], b.id, 'urgent')).map(t => t.title)).toEqual(['b', 'a'])
})

test('newTask is queued with empty time and effort', () => {
  const task = newTask({
    title: 'Retry button',
    priority: 'high',
    difficulty: 'light',
    messages: ['add a retry button'],
    now: at(0),
    id: 't-0000abcd',
  })

  expect(task.state).toBe('queued')
  expect(task.difficulty).toEqual({ expected: 'light', actual: null })
  expect(task.created).toBe(at(0))
  expect(task.minutesByDay).toEqual({})
  expect(task.effort.linesAdded).toBe(0)
  expect(task.files).toEqual({ read: [], changed: [] })
})
