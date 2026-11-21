import { expect, test } from 'claude-code/testing'

import { live } from '../../../hooks/core/session/live'
import { setTestProfileUseCase } from '../../../hooks/features/tasks/domain/usecases/set_test_profile'
import { PROFILE_TEXT } from '../../../hooks/features/tasks/presentation/constants/tasks_text'
import { setTestProfile } from '../../../hooks/features/tasks/presentation/state_management/tasks_controller'
import { tasksDepsOf } from '../../../hooks/features/tasks/tasks_providers'
import { emptyRecord } from '../../../hooks/shared/records/data/datasources/record_source'
import type { ProjectRecord, Task } from '../../../types'
import { CTX, fakePorts, makeTask, memoryHost } from '../../helpers'

const stored = (mem: ReturnType<typeof memoryHost>) => JSON.parse(mem.files.get(CTX.file)!) as ProjectRecord
const withTasks = (tasks: Task[]) => ({ [CTX.file]: JSON.stringify({ ...emptyRecord('p', '/p'), tasks }) })
const PICK = { id: 'deep' as const, reason: 'a stored field old records must still read' }

// ── The use case ──

test("Tea-DD's pick is saved on the current task with its reason", async () => {
  const task = makeTask({ state: 'current' })
  const mem = memoryHost({ files: withTasks([task]) })

  const set = await setTestProfileUseCase(tasksDepsOf(fakePorts(mem).ports, CTX), CTX, task.id, PICK)

  expect(set.kind).toBe('saved')
  expect(stored(mem).tasks[0]?.testProfile).toEqual({ id: 'deep', by: 'tea-dd', reason: PICK.reason })
})

test('Tea-DD can move up from its own earlier pick', async () => {
  const task = makeTask({ state: 'current', testProfile: { id: 'standard', by: 'tea-dd', reason: 'one feature' } })
  const mem = memoryHost({ files: withTasks([task]) })

  await setTestProfileUseCase(tasksDepsOf(fakePorts(mem).ports, CTX), CTX, task.id, { id: 'critical', reason: 'it reaches the lock' })

  expect(stored(mem).tasks[0]?.testProfile).toEqual({ id: 'critical', by: 'tea-dd', reason: 'it reaches the lock' })
})

test("Rohan's pick stands: Tea-DD's is refused and the record keeps his", async () => {
  const task = makeTask({ state: 'current', testProfile: { id: 'quick', by: 'rohan' } })
  const mem = memoryHost({ files: withTasks([task]) })

  const set = await setTestProfileUseCase(tasksDepsOf(fakePorts(mem).ports, CTX), CTX, task.id, PICK)

  expect(set).toEqual({ kind: 'rohans', id: 'quick' })
  expect(stored(mem).tasks[0]?.testProfile).toEqual({ id: 'quick', by: 'rohan' })
})

test('a task that is no longer current gets no profile', async () => {
  const task = makeTask({ state: 'queued' })
  const mem = memoryHost({ files: withTasks([task]) })

  const set = await setTestProfileUseCase(tasksDepsOf(fakePorts(mem).ports, CTX), CTX, task.id, PICK)

  expect(set).toEqual({ kind: 'notCurrent' })
  expect(stored(mem).tasks[0]?.testProfile).toBeUndefined()
})

test('an unreadable record is reported and left as it was', async () => {
  const mem = memoryHost({ files: { [CTX.file]: '{bad' } })

  expect(await setTestProfileUseCase(tasksDepsOf(fakePorts(mem).ports, CTX), CTX, 't-1', PICK)).toEqual({ kind: 'unreadable' })
  expect(mem.files.get(CTX.file)).toBe('{bad')
})

test("the task current in another worktree gets no profile from this folder's pick", async () => {
  const ours = makeTask({ id: 'ours', state: 'current' })
  const other = makeTask({ id: 'other', state: 'current', worktreePath: '/worktrees/other' })
  const mem = memoryHost({ files: withTasks([ours, other]) })

  const set = await setTestProfileUseCase(tasksDepsOf(fakePorts(mem).ports, CTX), CTX, 'other', PICK)

  expect(set).toEqual({ kind: 'notCurrent' })
  expect(stored(mem).tasks.map(t => t.testProfile)).toEqual([undefined, undefined])
})

// ── What the tool answers ──

const toolSetup = (task: Task | null, view?: Partial<{ record: ProjectRecord }>) => {
  live.ctx = CTX
  const mem = memoryHost({ files: withTasks(task === null ? [] : [task]) })

  return { mem, ...fakePorts(mem, { view: { record: stored(mem), ...view } }) }
}

test('a saved pick answers that it was recorded, and the menu sees it at once', async () => {
  const { mem, ports, view } = toolSetup(makeTask({ state: 'current' }))

  expect(await setTestProfile(ports, { profile: 'deep', reason: '  a new tool  ' })).toBe(PROFILE_TEXT.saved('deep'))
  expect(stored(mem).tasks[0]?.testProfile).toEqual({ id: 'deep', by: 'tea-dd', reason: 'a new tool' })
  expect(view.record?.tasks[0]?.testProfile).toEqual({ id: 'deep', by: 'tea-dd', reason: 'a new tool' })
})

test("Rohan's pick stands, and the answer names it", async () => {
  const { mem, ports } = toolSetup(makeTask({ state: 'current', testProfile: { id: 'critical', by: 'rohan' } }))
  const before = stored(mem).tasks[0]?.testProfile

  expect(await setTestProfile(ports, { profile: 'quick', reason: 'only text' })).toBe(PROFILE_TEXT.rohans('critical'))
  expect(stored(mem).tasks[0]?.testProfile).toEqual(before)
})

test('a pick Rohan just made in the app stands, though the menu has not seen it yet', async () => {
  const task = makeTask({ state: 'current' })
  const { mem, ports } = toolSetup(task)
  mem.files.set(CTX.file, JSON.stringify({ ...emptyRecord('p', '/p'), tasks: [{ ...task, testProfile: { id: 'release', by: 'rohan' } }] }))

  expect(await setTestProfile(ports, { profile: 'quick', reason: 'only text' })).toBe(PROFILE_TEXT.rohans('release'))
  expect(stored(mem).tasks[0]?.testProfile).toEqual({ id: 'release', by: 'rohan' })
})

test('with no current task the tool says so and writes nothing', async () => {
  const { mem, ports } = toolSetup(makeTask({ state: 'queued' }))
  const before = mem.files.get(CTX.file)

  expect(await setTestProfile(ports, { profile: 'deep', reason: 'x' })).toBe(PROFILE_TEXT.noTask)
  expect(mem.files.get(CTX.file)).toBe(before)
})

test('an unknown profile is refused with the five names', async () => {
  const { mem, ports } = toolSetup(makeTask({ state: 'current' }))
  const before = mem.files.get(CTX.file)

  for (const input of [{ profile: 'huge', reason: 'x' }, { profile: 'Deep', reason: 'x' }, { reason: 'x' }, null, 'deep']) {
    expect(await setTestProfile(ports, input)).toBe(PROFILE_TEXT.problems.profile)
  }
  expect(mem.files.get(CTX.file)).toBe(before)
})

test('a reason that is missing, blank or longer than 160 characters is refused; 160 is kept', async () => {
  const { mem, ports } = toolSetup(makeTask({ state: 'current' }))

  for (const reason of [undefined, '', '   ', 42, 'x'.repeat(161)]) {
    expect(await setTestProfile(ports, { profile: 'deep', reason })).toBe(PROFILE_TEXT.problems.reason)
  }
  expect(stored(mem).tasks[0]?.testProfile).toBeUndefined()

  expect(await setTestProfile(ports, { profile: 'deep', reason: 'é'.repeat(160) })).toBe(PROFILE_TEXT.saved('deep'))
})

test('a failed save answers that it failed and logs why', async () => {
  const { mem, ports, done } = toolSetup(makeTask({ state: 'current' }))
  mem.host.run = async () => ({ exitCode: 1, stdout: '', stderr: 'no' })

  expect(await setTestProfile(ports, PICK_INPUT)).toBe(PROFILE_TEXT.failed)
  expect(done.logs.length).toBe(1)
})

test('an unreadable record answers so, and is left as it was', async () => {
  const { mem, ports } = toolSetup(makeTask({ state: 'current' }))
  mem.files.set(CTX.file, '{bad')

  expect(await setTestProfile(ports, PICK_INPUT)).toBe(PROFILE_TEXT.unreadable)
  expect(mem.files.get(CTX.file)).toBe('{bad')
})

test('a task put back since the menu last read answers that it is no longer current', async () => {
  const task = makeTask({ state: 'current' })
  const { mem, ports } = toolSetup(task)
  mem.files.set(CTX.file, JSON.stringify({ ...emptyRecord('p', '/p'), tasks: [{ ...task, state: 'queued' }] }))

  expect(await setTestProfile(ports, PICK_INPUT)).toBe(PROFILE_TEXT.notCurrent)
  expect(stored(mem).tasks[0]?.testProfile).toBeUndefined()
})

const PICK_INPUT = { profile: PICK.id, reason: PICK.reason }
