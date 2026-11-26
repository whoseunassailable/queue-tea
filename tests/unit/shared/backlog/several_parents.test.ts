import { expect, test } from 'claude-code/testing'

import { editTaskUseCase } from '../../../../hooks/features/tasks/domain/usecases/edit_task'
import { fileTaskUseCase, NEW_PARENT } from '../../../../hooks/features/tasks/domain/usecases/file_task'
import { moveTaskUseCase } from '../../../../hooks/features/tasks/domain/usecases/move_task'
import { tasksDepsOf } from '../../../../hooks/features/tasks/tasks_providers'
import { childrenOf, criteriaSetsOf, groupBacklog, homeOf, parentChoices, parentsOf, parentsRefusal, progressOf, sharedInto, titlesText } from '../../../../hooks/shared/backlog/domain/services/families'
import { rankBacklog } from '../../../../hooks/shared/backlog/domain/services/ranking'
import { firstMessage } from '../../../../hooks/shared/checkpoints/domain/services/checkpoints'
import { FIRST_MESSAGE_LABELS } from '../../../../hooks/shared/checkpoints/domain/constants/checkpoints_text'
import { emptyRecord, parseRecord } from '../../../../hooks/shared/records/data/datasources/record_source'
import { foldCriteria, removeTask } from '../../../../hooks/shared/records/domain/services/queue_rules'
import type { Task } from '../../../../types'
import { CTX, fakePorts, makeTask, memoryHost } from '../../../helpers'

const at = (minute: number) => `2026-11-26T10:${String(minute).padStart(2, '0')}:00+01:00`

// Sign in works the same for users and admins; only the screens differ.
const shared = () => {
  const users = makeTask({ title: 'Users', created: at(1) })
  const admins = makeTask({ title: 'Admins', created: at(2) })
  const login = makeTask({ title: 'Sign in', parentIds: [users.id, admins.id], created: at(3) })
  const list = makeTask({ title: 'User list', parentIds: [admins.id], state: 'done', created: at(4) })

  return { users, admins, login, list, tasks: [users, admins, login, list] }
}

const setup = (tasks: Task[]) => {
  const mem = memoryHost({ files: { [CTX.file]: JSON.stringify({ ...emptyRecord('p', '/p'), tasks }) } })

  return { mem, deps: tasksDepsOf(fakePorts(mem).ports, CTX) }
}

const onDisk = (mem: ReturnType<typeof memoryHost>) => {
  const read = parseRecord(mem.files.get(CTX.file)!)
  if (read === 'unreadable') throw new Error('should read')

  return read
}

const readTask = (stored: Record<string, unknown>): Task => {
  const read = parseRecord(JSON.stringify({ ...emptyRecord('p', '/p'), tasks: [stored] }))
  if (read === 'unreadable') throw new Error('should read')

  return read.tasks[0]!
}

test('a task under two features is a task of each: it counts in both, and its row stands under the first', () => {
  const { users, admins, login, tasks } = shared()

  expect(parentsOf(login, tasks).map(t => t.title)).toEqual(['Users', 'Admins'])
  expect(homeOf(login, tasks)?.id).toBe(users.id)
  expect(childrenOf(admins, tasks).map(t => t.title)).toEqual(['Sign in', 'User list'])
  expect(progressOf(users, tasks)).toMatchObject({ done: 0, total: 1 })
  expect(progressOf(admins, tasks)).toMatchObject({ done: 1, total: 2 })
  // Listed once, under Users; Admins names it as shared.
  const { ready } = groupBacklog(rankBacklog({ tasks, playNext: null }, null), [], tasks)
  const under = (title: string) => ready.flatMap(e => (e.kind === 'group' && e.group.parent.title === title ? e.group.rows.map(r => r.task.title) : []))
  expect(under('Users')).toContain('Sign in')
  expect(under('Admins')).not.toContain('Sign in')
  expect(sharedInto(admins, tasks).map(t => t.title)).toEqual(['Sign in'])
  expect(sharedInto(users, tasks)).toEqual([])
})

test('a removed feature is no longer one of its parents, and the next one becomes its home', () => {
  const { users, admins, login, tasks } = shared()
  const after = removeTask(tasks, users.id)

  expect(after.find(t => t.id === login.id)?.parentIds).toEqual([admins.id])
  expect(homeOf(after.find(t => t.id === login.id)!, after)?.id).toBe(admins.id)
})

test('more parents follow the one-level rule for each, and the choices leave out the ones it has', () => {
  const { users, admins, login, list, tasks } = shared()
  const solo = makeTask({ title: 'Docs' })
  const all = [...tasks, solo]

  expect(parentsRefusal(all, solo.id, [users.id, admins.id])).toBeNull()
  expect(parentsRefusal(all, solo.id, [users.id, login.id])).toBe('Sign in is part of Users, so its tasks go under that.')
  expect(parentsRefusal(all, users.id, [solo.id])).toBe("Users has tasks of its own, so it can't be part of another.")
  expect(parentChoices(all, login.id).map(t => t.title)).not.toContain('Users')
  expect(parentChoices(all, login.id).map(t => t.title)).not.toContain('Admins')
  expect(parentChoices(all, list.id).map(t => t.title)).toContain('Users')
})

test('titlesText names one, two or more titles the way a sentence does', () => {
  expect(titlesText([])).toBe('')
  expect(titlesText(['Users'])).toBe('Users')
  expect(titlesText(['Users', 'Admins'])).toBe('Users and Admins')
  expect(titlesText(['Users', 'Admins', 'Guests'])).toBe('Users, Admins and Guests')
})

test('an older record with one parentId reads as a list of one, and the old field is gone', () => {
  const old = { ...makeTask({ title: 'Keys' }), parentId: 't-00000001' } as Record<string, unknown>
  delete old.parentIds
  const task = readTask(old)

  expect(task.parentIds).toEqual(['t-00000001'])
  expect('parentId' in task).toBe(false)
  const alone = { ...makeTask({ title: 'Alone' }), parentId: null } as Record<string, unknown>
  delete alone.parentIds
  expect(readTask(alone).parentIds).toEqual([])
})

test('a stored list wins over an old parentId, keeps its order, and drops repeats and empty ids', () => {
  expect(readTask({ ...makeTask(), parentIds: ['t-2', 't-1', 't-2', ''], parentId: 't-9' }).parentIds).toEqual(['t-2', 't-1'])
  // A list that isn't one is read as no list.
  expect(readTask({ ...makeTask(), parentIds: 't-2', parentId: 't-9' }).parentIds).toEqual(['t-9'])
})

test('sets for each feature fold into one set once fewer than two features are left, every line kept once', () => {
  const task = makeTask({ parentIds: ['t-1'], criteria: ['Tests pass'], criteriaByParent: { 't-1': ['Shows the user form', 'Tests pass'], 't-2': ['Shows the admin form'] } })

  const { criteriaByParent: _sets, ...rest } = task
  expect(foldCriteria(task)).toEqual({ ...rest, criteria: ['Tests pass', 'Shows the user form', 'Shows the admin form'] })
  expect(readTask(task as unknown as Record<string, unknown>).criteriaByParent).toBeUndefined()
  // Under two, the sets stay as they are, and a set that isn't lists is dropped.
  const two = makeTask({ parentIds: ['t-1', 't-2'], criteriaByParent: { 't-1': ['A'], 't-2': ['B'] } })
  expect(foldCriteria(two)).toBe(two)
  expect(readTask({ ...two, criteriaByParent: { 't-1': 'A' } }).criteriaByParent).toBeUndefined()
})

test('filing under two features and a new one keeps a criteria set for each, the new one under its new id', async () => {
  const { users, admins, tasks } = shared()
  const { mem, deps } = setup(tasks)

  const filed = await fileTaskUseCase(deps, CTX, {
    text: 'Reset password',
    title: 'Reset password',
    priority: 'mid',
    difficulty: 'light',
    intent: 'improving',
    parent: { kind: 'several', ids: [users.id, admins.id], title: 'Guests' },
    criteria: [],
    criteriaByParent: { [users.id]: ['Users get the email'], [admins.id]: ['Admins see the log'], [NEW_PARENT]: ['Guests are sent to sign up'] },
  })

  if (filed.kind !== 'filed') throw new Error('should file')
  const guests = onDisk(mem).tasks.find(t => t.title === 'Guests')!
  const reset = onDisk(mem).tasks.find(t => t.title === 'Reset password')!
  expect(reset.parentIds).toEqual([users.id, admins.id, guests.id])
  expect(reset.criteriaByParent).toEqual({ [users.id]: ['Users get the email'], [admins.id]: ['Admins see the log'], [guests.id]: ['Guests are sent to sign up'] })
  expect(filed.parent?.id).toBe(users.id)
})

test('filing under one feature keeps no sets, and a refused feature files nothing', async () => {
  const { users, login, tasks } = shared()
  const { mem, deps } = setup(tasks)

  await fileTaskUseCase(deps, CTX, { text: 'A', title: 'A', priority: 'mid', difficulty: 'light', intent: 'improving', parent: { kind: 'task', id: users.id }, criteriaByParent: { [users.id]: ['Only'] } })
  expect(onDisk(mem).tasks.find(t => t.title === 'A')).toMatchObject({ parentIds: [users.id] })
  expect(onDisk(mem).tasks.find(t => t.title === 'A')?.criteriaByParent).toBeUndefined()

  const refused = await fileTaskUseCase(deps, CTX, { text: 'B', title: 'B', priority: 'mid', difficulty: 'light', intent: 'improving', parent: { kind: 'several', ids: [users.id, login.id], title: null } })
  expect(refused.kind).toBe('refused')
  expect(onDisk(mem).tasks.some(t => t.title === 'B')).toBe(false)
})

test('moving sets the features in the order given; one it already has is kept even if it could not take it now', async () => {
  const { users, admins, login, tasks } = shared()
  const closed = { ...users, state: 'done' as const }
  const { mem, deps } = setup([closed, admins, { ...login, criteriaByParent: { [users.id]: ['U'], [admins.id]: ['A'] } }])

  expect((await moveTaskUseCase(deps, login.id, [admins.id, users.id])).kind).toBe('moved')
  expect(onDisk(mem).tasks.find(t => t.id === login.id)?.parentIds).toEqual([admins.id, users.id])

  // Down to one: the sets fold into its criteria.
  await moveTaskUseCase(deps, login.id, [admins.id])
  expect(onDisk(mem).tasks.find(t => t.id === login.id)).toMatchObject({ parentIds: [admins.id], criteria: ['A', 'U'] })
  expect(onDisk(mem).tasks.find(t => t.id === login.id)?.criteriaByParent).toBeUndefined()

  // The closed feature is no longer one of its parents, so it can't come back.
  expect((await moveTaskUseCase(deps, login.id, [admins.id, users.id])).kind).toBe('refused')
})

test('editing sets one feature’s criteria and leaves the others; null goes back to one set', async () => {
  const { users, admins, login, tasks } = shared()
  const { mem, deps } = setup(tasks)

  await editTaskUseCase(deps, login.id, { criteria: [], criteriaByParent: { [users.id]: ['Users land on home'], 't-elsewhere': ['Ignored'] } })
  expect(onDisk(mem).tasks.find(t => t.id === login.id)?.criteriaByParent).toEqual({ [users.id]: ['Users land on home'], [admins.id]: [] })

  await editTaskUseCase(deps, login.id, { criteriaByParent: { [admins.id]: ['Admins land on the dashboard'] } })
  expect(onDisk(mem).tasks.find(t => t.id === login.id)?.criteriaByParent).toEqual({ [users.id]: ['Users land on home'], [admins.id]: ['Admins land on the dashboard'] })

  await editTaskUseCase(deps, login.id, { criteria: ['Users land on home', 'Admins land on the dashboard'], criteriaByParent: null })
  expect(onDisk(mem).tasks.find(t => t.id === login.id)).toMatchObject({ criteria: ['Users land on home', 'Admins land on the dashboard'] })
  expect(onDisk(mem).tasks.find(t => t.id === login.id)?.criteriaByParent).toBeUndefined()
})

test('the first message names whose each criteria set is', () => {
  const { users, admins, login, tasks } = shared()
  const task = { ...login, messages: ['do it'], criteria: ['Tests pass'], criteriaByParent: { [users.id]: ['Users land on home'], [admins.id]: [] } }

  expect(criteriaSetsOf(task, tasks).map(set => set.parent?.title ?? null)).toEqual([null, 'Users'])
  expect(firstMessage(task, null, null, tasks)).toBe(
    `Task: Sign in\n\n${FIRST_MESSAGE_LABELS.criteria}\n- Tests pass\n\n${FIRST_MESSAGE_LABELS.criteriaUnder('Users')}\n- Users land on home\n\ndo it`,
  )
})
