import { expect, test } from 'claude-code/testing'

import { finishTaskUseCase } from '../../../hooks/features/tasks/domain/usecases/finish_task'
import { leaveCodexUseCase } from '../../../hooks/features/tasks/domain/usecases/leave_codex'
import { putBackUseCase } from '../../../hooks/features/tasks/domain/usecases/put_back'
import { sendToCodexUseCase } from '../../../hooks/features/tasks/domain/usecases/send_to_codex'
import { startTaskUseCase } from '../../../hooks/features/tasks/domain/usecases/start_task'
import { continueTask, finishTask, putBack } from '../../../hooks/features/tasks/presentation/state_management/tasks_controller'
import { tasksDepsOf } from '../../../hooks/features/tasks/tasks_providers'
import type { CodexRepository } from '../../../hooks/shared/codex/domain/repositories/codex_repository'
import { emptyRecord, parseRecord } from '../../../hooks/shared/records/data/datasources/record_source'
import type { AppRequest, ProjectRecord, Task } from '../../../types'
import { CTX, fakePorts, makeTask, memoryHost } from '../../helpers'
import type { Run } from '../../helpers'

// When the task went to Codex: 06:00Z. The fake clock says 07:12Z, 09:12 here.
const SINCE = '2026-10-21T08:00:00+02:00'
const NOW = Date.parse('2026-10-21T07:12:00Z')
const NOW_HERE = '2026-10-21T09:12:00+02:00'
const at = (time: string) => Date.parse(`2026-10-21T${time}:00Z`)
// 10 and 5 minutes, then a 30-minute gap over the idle limit, then 5: 20.
const STAMPS = [at('06:00'), at('06:10'), at('06:15'), at('06:45'), at('06:50')]

const OID = '# branch.oid 1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b'
const CLEAN = [OID, '# branch.head main', '# branch.upstream origin/main', '# branch.ab +0 -0', ''].join('\n')
const git = (): Record<string, Run> => ({
  'git rev-parse --is-inside-work-tree': { stdout: 'true\n' },
  'git status --porcelain=v2 --branch': { stdout: CLEAN },
  'git branch --format=%(refname:short)': { stdout: 'main\n' },
  'git switch -c task/a': {},
})

// The record on disk and the tasks' deps, with Codex's log answering `log`:
// the moments it shows, or the error reading it throws.
const setup = (tasks: Task[], log: number[] | Error = [], options: { requests?: AppRequest[]; git?: Record<string, Run> } = {}) => {
  const record: ProjectRecord = { ...emptyRecord('p', '/p'), tasks, requests: options.requests ?? [] }
  const mem = memoryHost({ files: { [CTX.file]: JSON.stringify(record) }, git: options.git })
  const { ports, done } = fakePorts(mem, { view: { record } })
  const asked: { folder: string; sinceMs: number; nowMs: number }[] = []
  const codex: CodexRepository = {
    activitySince: async (folder, sinceMs, nowMs) => {
      asked.push({ folder, sinceMs, nowMs })
      if (log instanceof Error) throw log

      return log
    },
  }

  return { mem, done, asked, deps: { ...tasksDepsOf(ports, CTX), codex } }
}

const stored = (mem: ReturnType<typeof memoryHost>) => parseRecord(mem.files.get(CTX.file)!) as ProjectRecord

test('a task back from Codex gets the minutes its log shows, under the idle gap, and Claude Code has it again', async () => {
  const task = makeTask({ state: 'current', codexSince: SINCE, minutesByDay: { '2026-10-21': 5 } })
  const { mem, asked, deps } = setup([task], STAMPS)

  expect(await leaveCodexUseCase(deps, CTX, task.id)).toBe(false)

  expect(asked).toEqual([{ folder: '/p', sinceMs: Date.parse(SINCE), nowMs: NOW }])
  expect(stored(mem).tasks[0]).toMatchObject({ state: 'current', codexSince: null, minutesByDay: { '2026-10-21': 25 } })
})

test("when Codex's log can't be read, the task still comes back, without that time, and says so", async () => {
  const task = makeTask({ state: 'current', codexSince: SINCE, minutesByDay: { '2026-10-21': 5 } })
  const { mem, done, deps } = setup([task], new Error('EACCES: permission denied'))

  expect(await leaveCodexUseCase(deps, CTX, task.id)).toBe(true)

  expect(stored(mem).tasks[0]).toMatchObject({ codexSince: null, minutesByDay: { '2026-10-21': 5 } })
  expect(done.logs.some(line => line.includes("reading Codex's log failed") && line.includes('EACCES'))).toBe(true)
})

test('a task Claude Code has is left alone: Codex is not read and nothing is written', async () => {
  const task = makeTask({ state: 'current', minutesByDay: { '2026-10-21': 5 } })
  const { mem, asked, deps } = setup([task], STAMPS)

  expect(await leaveCodexUseCase(deps, CTX, task.id)).toBe(false)

  expect(asked).toEqual([])
  expect(mem.writes).toEqual([])
})

test('an unreadable record is never written over when a task leaves Codex', async () => {
  const { mem, asked, deps } = setup([], STAMPS)
  mem.files.set(CTX.file, 'not json')

  expect(await leaveCodexUseCase(deps, CTX, 't-x')).toBe(false)

  expect(asked).toEqual([])
  expect(mem.files.get(CTX.file)).toBe('not json')
})

test('Continue in Codex marks the task in progress as with Codex from now, and takes back only its own requests', async () => {
  const current = makeTask({ state: 'current' })
  const other = makeTask()
  const requests: AppRequest[] = [
    { id: 'q-1', kind: 'begin', taskId: current.id, at: 'now' },
    { id: 'q-2', kind: 'putBack', taskId: current.id, at: 'now' },
    { id: 'q-3', kind: 'begin', taskId: other.id, at: 'now' },
  ]
  const { mem, deps } = setup([current, other], [], { requests })

  await sendToCodexUseCase(deps, CTX, current.id)

  const after = stored(mem)
  expect(after.tasks.map(t => t.codexSince)).toEqual([NOW_HERE, null])
  expect(after.requests.map(q => q.id)).toEqual(['q-3'])
})

test('a task already with Codex keeps the moment it went, and a queued task is not sent', async () => {
  const current = makeTask({ state: 'current', codexSince: SINCE })
  const queued = makeTask()
  const { mem, deps } = setup([current, queued])

  await sendToCodexUseCase(deps, CTX, current.id)
  await sendToCodexUseCase(deps, CTX, queued.id)

  expect(stored(mem).tasks.map(t => t.codexSince)).toEqual([SINCE, null])
})

test('Start in Codex claims the task with Codex from the moment it starts, on its own branch', async () => {
  const task = makeTask({ title: 'A' })
  const { mem, deps } = setup([task], [], { git: git() })

  const result = await startTaskUseCase(deps, CTX, task.id, 'codex')

  expect(result.kind).toBe('started')
  expect(stored(mem).tasks[0]).toMatchObject({ state: 'current', started: NOW_HERE, codexSince: NOW_HERE, branch: 'task/a' })
  expect(mem.runs.some(argv => argv.join(' ') === 'git switch -c task/a')).toBe(true)
})

test('Start in Claude Code, the default, leaves the task with Claude Code', async () => {
  const task = makeTask({ title: 'A' })
  const { mem, deps } = setup([task], [], { git: git() })

  expect((await startTaskUseCase(deps, CTX, task.id)).kind).toBe('started')
  expect(stored(mem).tasks[0]).toMatchObject({ state: 'current', codexSince: null })
})

test('a branch git refuses puts a Codex start back in the queue with Claude Code', async () => {
  const task = makeTask({ title: 'A' })
  const more = git()
  delete more['git switch -c task/a']
  const { mem, deps } = setup([task], [], { git: more })

  expect((await startTaskUseCase(deps, CTX, task.id, 'codex')).kind).toBe('branch_failed')
  expect(stored(mem).tasks[0]).toMatchObject({ state: 'queued', started: null, branch: null, codexSince: null })
})

test('putting back a Codex quest adds its time on Codex, and it waits in the queue for Claude Code', async () => {
  const task = makeTask({ state: 'current', codexSince: SINCE, branch: 'task/a', minutesByDay: { '2026-10-21': 5 } })
  const { deps } = setup([task], STAMPS)

  const { saved, isCodexTimeLost } = await putBackUseCase(deps, CTX, task.id, undefined)

  expect(isCodexTimeLost).toBe(false)
  expect(saved === 'unreadable' ? null : saved.tasks[0]).toMatchObject({ state: 'queued', codexSince: null, branch: 'task/a', minutesByDay: { '2026-10-21': 25 } })
})

test("putting back a Codex quest whose log can't be read still queues it, and says the time was lost", async () => {
  const task = makeTask({ state: 'current', codexSince: SINCE, minutesByDay: { '2026-10-21': 5 } })
  const { mem, deps } = setup([task], new Error('EACCES'))

  expect((await putBackUseCase(deps, CTX, task.id, undefined)).isCodexTimeLost).toBe(true)
  expect(stored(mem).tasks[0]).toMatchObject({ state: 'queued', codexSince: null, minutesByDay: { '2026-10-21': 5 } })
})

test('finishing a Codex quest adds its time on Codex before it is marked done', async () => {
  const task = makeTask({ state: 'current', codexSince: SINCE, minutesByDay: { '2026-10-21': 5 } })
  const { deps } = setup([task], STAMPS)

  const result = await finishTaskUseCase(deps, CTX, task.id, 'light')

  expect(result.kind).toBe('saved')
  if (result.kind !== 'saved') return
  expect(result.isCodexTimeLost).toBe(false)
  expect(result.record.tasks[0]).toMatchObject({ state: 'done', codexSince: null, minutesByDay: { '2026-10-21': 25 } })
})

test("finishing a Codex quest whose log can't be read still finishes it, and says the time was lost", async () => {
  const task = makeTask({ state: 'current', codexSince: SINCE })
  const { mem, deps } = setup([task], new Error('EACCES'))

  const result = await finishTaskUseCase(deps, CTX, task.id, 'light')

  expect(result.kind === 'saved' && result.isCodexTimeLost).toBe(true)
  expect(stored(mem).tasks[0]).toMatchObject({ state: 'done', codexSince: null })
})

test('finishing a task Claude Code has says no Codex time was lost', async () => {
  const task = makeTask({ state: 'current' })
  const { asked, deps } = setup([task], new Error('never read'))

  const result = await finishTaskUseCase(deps, CTX, task.id, 'light')

  expect(result.kind === 'saved' && result.isCodexTimeLost).toBe(false)
  expect(asked).toEqual([])
})

// The controller, with Codex's log read from the memory host under /h.
const onBoard = (task: Task) => {
  const record: ProjectRecord = { ...emptyRecord('p', '/p'), tasks: [task] }
  const mem = memoryHost({ files: { [CTX.file]: JSON.stringify(record) } })

  return { mem, ...fakePorts(mem, { view: { record } }) }
}

test('Back to queue on a Codex quest asks Claude for no handoff, and says nothing about a checkpoint', async () => {
  const task = makeTask({ title: 'Now', state: 'current', codexSince: SINCE })
  const { mem, ports, view, done } = onBoard(task)
  let asks = 0
  ports.ask = {
    ...ports.ask,
    fork: async () => {
      asks += 1
      throw new Error('no reply')
    },
  }

  expect(await putBack(ports, CTX)).toBe('queued')

  expect(asks).toBe(0)
  expect(view.notice).toBeNull()
  expect(done.toasts).toEqual(['Back in the backlog: Now'])
  expect(stored(mem).tasks[0]).toMatchObject({ state: 'queued', codexSince: null, handoff: null })
})

test("Back to queue on a Codex quest whose log can't be read says its time on Codex wasn't added", async () => {
  const task = makeTask({ title: 'Now', state: 'current', codexSince: SINCE })
  const { mem, ports, view } = onBoard(task)
  const exists = mem.host.exists
  mem.host.exists = async path => {
    if (path.includes('/.codex/')) throw new Error('EPERM')

    return exists(path)
  }

  expect(await putBack(ports, CTX)).toBe('queued')

  expect(view.notice).toBe("Couldn't read Codex's log, so this task's time on Codex wasn't added.")
  expect(stored(mem).tasks[0]?.state).toBe('queued')
})

test("finishing a Codex quest whose log can't be read says its time on Codex wasn't added", async () => {
  const task = makeTask({ title: 'Now', state: 'current', codexSince: SINCE })
  const { mem, ports, view } = onBoard(task)
  const exists = mem.host.exists
  mem.host.exists = async path => {
    if (path.includes('/.codex/')) throw new Error('EPERM')

    return exists(path)
  }

  await finishTask(ports, CTX, task.id, 'light')

  expect(view.notice).toBe("Couldn't read Codex's log, so this task's time on Codex wasn't added.")
  expect(stored(mem).tasks[0]?.state).toBe('done')
})

// Codex's log under /h in the memory host: one session in /p, changed now.
const withCodexLog = (mem: ReturnType<typeof memoryHost>, stamps: string[]) => {
  const dir = '/h/.codex/sessions/2026/10/21'
  const lines = stamps.map((timestamp, i) => JSON.stringify(i === 0 ? { timestamp, type: 'session_meta', payload: { cwd: '/p' } } : { timestamp, type: 'event_msg' }))
  mem.dirs.add(dir)
  mem.files.set(`${dir}/rollout-a.jsonl`, `${lines.join('\n')}\n`)
  const modifiedAt = mem.host.modifiedAt
  mem.host.modifiedAt = async path => (path.startsWith('/h/.codex/') ? NOW : modifiedAt(path))
}

test('Continue in Claude Code takes a quest back from Codex with its time, then sends the first message', async () => {
  const task = makeTask({ title: 'Now', state: 'current', codexSince: SINCE, minutesByDay: { '2026-10-21': 5 } })
  const { mem, ports, view, done, settle } = onBoard(task)
  // 10 and 5 minutes with Codex.
  withCodexLog(mem, ['2026-10-21T06:00:00Z', '2026-10-21T06:10:00Z', '2026-10-21T06:15:00Z'])

  await continueTask(ports, CTX)
  await settle()

  expect(stored(mem).tasks[0]).toMatchObject({ state: 'current', codexSince: null, minutesByDay: { '2026-10-21': 20 } })
  expect(view.record?.tasks[0]?.codexSince).toBeNull()
  expect(view.notice).toBeNull()
  expect(done.submits).toEqual(['Task: Now'])
})

test("Continue in Claude Code with Codex's log unreadable says the time wasn't added, and still continues", async () => {
  const task = makeTask({ title: 'Now', state: 'current', codexSince: SINCE, minutesByDay: { '2026-10-21': 5 } })
  const { mem, ports, view, done, settle } = onBoard(task)
  const exists = mem.host.exists
  mem.host.exists = async path => {
    if (path.includes('/.codex/')) throw new Error('EPERM')

    return exists(path)
  }

  await continueTask(ports, CTX)
  await settle()

  expect(stored(mem).tasks[0]).toMatchObject({ codexSince: null, minutesByDay: { '2026-10-21': 5 } })
  expect(view.notice).toBe("Couldn't read Codex's log, so this task's time on Codex wasn't added.")
  expect(done.submits).toEqual(['Task: Now'])
})
