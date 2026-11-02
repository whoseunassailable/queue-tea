import { expect, test } from 'claude-code/testing'

import { pressOpenApp } from '../../../hooks/app/menu/menu_controller'
import { live } from '../../../hooks/core/session/live'
import { handleRequests, followRecord } from '../../../hooks/features/tasks/presentation/state_management/requests_controller'
import { addRequestUseCase } from '../../../hooks/features/tasks/domain/usecases/add_request'
import { dropRequestsUseCase } from '../../../hooks/features/tasks/domain/usecases/drop_requests'
import { takeRequestUseCase } from '../../../hooks/features/tasks/domain/usecases/take_request'
import { continueTask, pressDoneNotYet, pressDoneYes, putBack, taskLooksDone } from '../../../hooks/features/tasks/presentation/state_management/tasks_controller'
import { finishTaskUseCase } from '../../../hooks/features/tasks/domain/usecases/finish_task'
import { tasksDepsOf } from '../../../hooks/features/tasks/tasks_providers'
import { emptyRecord, parseRecord } from '../../../hooks/shared/records/data/datasources/record_source'
import type { AppRequest, ProjectRecord, Task } from '../../../types'
import { CTX, fakePorts, makeTask, memoryHost } from '../../helpers'

const FILE = CTX.file
const request = (over: Partial<AppRequest> = {}): AppRequest => ({ id: 'q-1', kind: 'begin', taskId: 'x', at: 'now', ...over })

const setup = (tasks: Task[], requests: AppRequest[] = []) => {
  live.ctx = CTX
  live.isTurnRunning = false
  live.recordSeenAt = null
  const record: ProjectRecord = { ...emptyRecord('p', '/p'), tasks, requests }
  const mem = memoryHost({ files: { [FILE]: JSON.stringify(record) } })

  return { mem, ...fakePorts(mem, { view: { record } }) }
}

const onDisk = (mem: ReturnType<typeof memoryHost>) => {
  const read = parseRecord(mem.files.get(FILE)!)
  if (read === 'unreadable') throw new Error('should read')

  return read
}

test('begin sends the first message and leaves the record', async () => {
  const task = makeTask({ state: 'current', title: 'Build it' })
  const { mem, ports, done, settle } = setup([task], [request({ taskId: task.id })])

  expect(await handleRequests(ports, CTX)).toBe('handled')
  await settle()

  expect(onDisk(mem).requests).toEqual([])
  expect(done.clears).toBe(1)
  expect(done.submits.join('\n')).toContain('Build it')
})

test('a begin for a task no longer current is dropped, and nothing is sent', async () => {
  const task = makeTask({ state: 'queued' })
  const { mem, ports, done, settle } = setup([task], [request({ taskId: task.id })])

  expect(await handleRequests(ports, CTX)).toBe('dropped')
  await settle()

  expect(onDisk(mem).requests).toEqual([])
  expect(done.submits).toEqual([])
})

test('a request waits while a turn runs, and the terminal offers Continue', async () => {
  const task = makeTask({ state: 'current' })
  const { mem, ports, view, done } = setup([task], [request({ taskId: task.id })])
  live.isTurnRunning = true

  expect(await handleRequests(ports, CTX)).toBe('waiting')

  expect(view.canContinue).toBe(true)
  expect(onDisk(mem).requests).toHaveLength(1)
  expect(done.submits).toEqual([])
})

test('a request waits while something is typed in the prompt box', async () => {
  const task = makeTask({ state: 'current' })
  const { ports, done } = setup([task], [request({ taskId: task.id })])
  done.promptText = 'half a thought'

  expect(await handleRequests(ports, CTX)).toBe('waiting')
})

test('Continue answers a waiting begin, so the task starts once', async () => {
  const task = makeTask({ state: 'current' })
  const { mem, ports, settle, done } = setup([task], [request({ taskId: task.id })])

  await continueTask(ports, CTX)
  await settle()

  expect(onDisk(mem).requests).toEqual([])
  expect(done.clears).toBe(1)
})

test('putBack puts the task back with its branch and time', async () => {
  const task = makeTask({ state: 'current', branch: 'task/x', startCommit: 'abc', minutesByDay: { '2026-10-21': 5 } })
  const { mem, ports } = setup([task], [request({ kind: 'putBack', taskId: task.id })])

  expect(await handleRequests(ports, CTX)).toBe('handled')

  expect(onDisk(mem).tasks[0]).toMatchObject({ state: 'queued', branch: 'task/x', startCommit: 'abc', minutesByDay: { '2026-10-21': 5 } })
})

test('two sessions cannot both take a request', async () => {
  const task = makeTask({ state: 'current' })
  const { ports } = setup([task], [request({ taskId: task.id })])
  const deps = tasksDepsOf(ports, CTX)

  expect((await takeRequestUseCase(deps, 'q-1')).kind).toBe('taken')
  expect((await takeRequestUseCase(deps, 'q-1')).kind).toBe('gone')
})

test('task_looks_done marks the task for the app', async () => {
  const task = makeTask({ state: 'current' })
  const { mem, ports, view } = setup([task])

  await taskLooksDone(ports, ' ran the tests ')

  expect(view.isAskingDone).toBe(true)
  expect(onDisk(mem).tasks[0]?.review).toMatchObject({ checked: 'ran the tests' })
  expect(onDisk(mem).tasks[0]?.review?.at).toMatch(/^2026-10-21T/)
})

test('Yes and Not yet both clear the mark', async () => {
  for (const answer of [pressDoneYes, pressDoneNotYet]) {
    const task = makeTask({ state: 'current', review: { at: 'x', checked: null } })
    const { mem, ports } = setup([task])

    await answer(ports)

    expect(onDisk(mem).tasks[0]?.review).toBe(null)
  }
})

test('Back to queue and Done clear the mark', async () => {
  const task = makeTask({ state: 'current', review: { at: 'x', checked: null } })
  const back = setup([task])
  await putBack(back.ports, CTX)
  expect(onDisk(back.mem).tasks[0]?.review).toBe(null)

  const finished = setup([task])
  await finishTaskUseCase(tasksDepsOf(finished.ports, CTX), CTX, task.id, 'light')
  expect(onDisk(finished.mem).tasks[0]?.review).toBe(null)
})

test('a change on disk reloads, and an answer from the app closes the question', async () => {
  const task = makeTask({ state: 'current', review: { at: 'x', checked: 'c' } })
  const { mem, ports, view } = setup([task])
  view.isAskingDone = true
  view.checked = 'c'
  await followRecord(ports, CTX)
  expect(view.isAskingDone).toBe(true)

  await mem.host.write(FILE, JSON.stringify({ ...onDisk(mem), tasks: [{ ...task, review: null }] }))
  await followRecord(ports, CTX)

  expect(view.record?.tasks[0]?.review).toBe(null)
  expect(view.isAskingDone).toBe(false)
  expect(view.checked).toBe(null)
})

test('a record gone unreadable on disk says so instead of carrying on', async () => {
  const { mem, ports, view } = setup([])
  await followRecord(ports, CTX)

  await mem.host.write(FILE, '{broken')
  await followRecord(ports, CTX)

  expect(view.load).toBe('failed')
})

test('Open in Queue-tea app opens the URL for this project', async () => {
  const { mem, ports, view } = setup([])
  mem.git[`open queue-tea://open?path=${encodeURIComponent('/p')}`] = {}

  await pressOpenApp(ports)

  expect(view.notice).toBe(null)
})

test('with no app installed, the menu says so', async () => {
  const { ports, view } = setup([])

  await pressOpenApp(ports)

  expect(view.notice).toContain('may not be installed')
})

test('a putBack carrying a seal puts the task back sealed', async () => {
  const task = makeTask({ state: 'current', title: 'Build it' })
  const { mem, ports } = setup([task], [request({ kind: 'putBack', taskId: task.id, block: { reason: 'waiting for the clinic' } })])

  expect(await handleRequests(ports, CTX)).toBe('handled')

  const back = onDisk(mem).tasks.find(t => t.id === task.id)!
  expect(back.state).toBe('queued')
  expect(back.blockedReason).toBe('waiting for the clinic')
})

test('adding a request the task already has leaves one', async () => {
  const task = makeTask({ state: 'current' })
  const { mem, ports } = setup([task])
  const deps = tasksDepsOf(ports, CTX)

  await addRequestUseCase(deps, CTX, 'begin', task.id)
  await addRequestUseCase(deps, CTX, 'begin', task.id)

  expect(onDisk(mem).requests.map(q => q.kind)).toEqual(['begin'])
  expect(onDisk(mem).requests[0]!.taskId).toBe(task.id)
})

test('another kind of request for the same task is added beside it', async () => {
  const task = makeTask({ state: 'current' })
  const { mem, ports } = setup([task])
  const deps = tasksDepsOf(ports, CTX)

  await addRequestUseCase(deps, CTX, 'begin', task.id)
  await addRequestUseCase(deps, CTX, 'putBack', task.id, { waitFor: 'other' })

  expect(onDisk(mem).requests.map(q => q.kind)).toEqual(['begin', 'putBack'])
  expect(onDisk(mem).requests[1]!.block).toEqual({ waitFor: 'other' })
})

test('dropping a task\'s requests leaves those of other tasks', async () => {
  const task = makeTask({ state: 'current' })
  const { mem, ports } = setup([task], [request({ id: 'mine', taskId: task.id }), request({ id: 'other', taskId: 'someone-else' })])

  await dropRequestsUseCase(tasksDepsOf(ports, CTX), task.id)

  expect(onDisk(mem).requests.map(q => q.id)).toEqual(['other'])
})
