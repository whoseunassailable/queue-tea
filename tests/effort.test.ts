import { expect, test } from 'claude-code/testing'

import { applyPending, countToolCall, createTracker } from '../hooks/effort'
import { emptyRecord } from '../hooks/record'
import { makeTask } from './helpers'

const MIN = 60_000
const T0 = Date.parse('2026-10-21T08:00:00Z')

test('each file counts once', () => {
  let files = { read: [] as string[], changed: [] as string[] }
  files = countToolCall(files, 'Read', { file_path: '/r/a.ts' })
  files = countToolCall(files, 'Read', { file_path: '/r/a.ts' })
  files = countToolCall(files, 'Edit', { file_path: '/r/a.ts' })
  files = countToolCall(files, 'Grep', { pattern: 'x', path: '/r/lib' })
  files = countToolCall(files, 'Glob', { pattern: '*.ts' })
  files = countToolCall(files, 'Write', { file_path: '/r/b.ts' })
  files = countToolCall(files, 'NotebookEdit', { notebook_path: '/r/n.ipynb' })
  files = countToolCall(files, 'Bash', { command: 'cat /r/c.ts' })

  expect(files).toEqual({ read: ['/r/a.ts', '/r/lib'], changed: ['/r/a.ts', '/r/b.ts', '/r/n.ipynb'] })
})

test('the tracker counts gaps of up to 15 minutes, by local day', () => {
  const tracker = createTracker(15, 120)
  tracker.activity(T0)
  tracker.activity(T0 + 5 * MIN)
  tracker.activity(T0 + 9 * MIN)
  tracker.activity(T0 + 40 * MIN) // a 31-minute gap: not counted
  tracker.activity(T0 + 42 * MIN)

  expect(tracker.take().minutes).toEqual({ '2026-10-21': 11 })
  expect(tracker.take().minutes).toEqual({})
})

test('a turn flushes minutes, files and intents to the current task', () => {
  const tracker = createTracker(15, 0)
  tracker.activity(T0)
  tracker.toolCall('Read', { file_path: '/r/a.ts' })
  tracker.toolCall('Edit', { file_path: '/r/b.ts' })
  tracker.intent('understanding')
  tracker.intent('improving')
  tracker.intent('improving')
  tracker.activity(T0 + 9 * MIN)

  const current = makeTask({ state: 'current', files: { read: ['/r/a.ts'], changed: [] } })
  const record = { ...emptyRecord('p', '/p'), tasks: [makeTask(), current] }
  const after = applyPending(record, tracker.take())
  const task = after.tasks.find(t => t.id === current.id)!

  expect(task.minutesByDay).toEqual({ '2026-10-21': 9 })
  expect(task.files).toEqual({ read: ['/r/a.ts'], changed: ['/r/b.ts'] })
  expect(task.effort.filesRead).toBe(1)
  expect(task.effort.filesChanged).toBe(1)
  expect(task.effort.understandingMessages).toBe(1)
  expect(task.effort.improvingMessages).toBe(2)
  expect(after.unassignedMinutesByDay).toEqual({})
})

test('with no current task, minutes go to the project and nothing else changes', () => {
  const tracker = createTracker(15, 0)
  tracker.activity(T0)
  tracker.toolCall('Read', { file_path: '/r/a.ts' })
  tracker.intent('understanding')
  tracker.activity(T0 + 4 * MIN)

  const queued = makeTask()
  const after = applyPending({ ...emptyRecord('p', '/p'), tasks: [queued] }, tracker.take())

  expect(after.unassignedMinutesByDay).toEqual({ '2026-10-21': 4 })
  expect(after.tasks[0]).toEqual(queued)
})
