import { expect, test } from 'claude-code/testing'

import { editTaskUseCase } from '../../../hooks/features/tasks/domain/usecases/edit_task'
import { fileTaskUseCase } from '../../../hooks/features/tasks/domain/usecases/file_task'
import { removeTaskUseCase } from '../../../hooks/features/tasks/domain/usecases/remove_task'
import { restoreTaskUseCase } from '../../../hooks/features/tasks/domain/usecases/restore_task'
import { tasksDepsOf } from '../../../hooks/features/tasks/tasks_providers'
import { emptyRecord, parseRecord } from '../../../hooks/shared/records/data/datasources/record_source'
import type { Task } from '../../../types'
import { CTX, fakePorts, makeTask, memoryHost } from '../../helpers'

const setup = (tasks: Task[]) => {
  const mem = memoryHost({ files: { [CTX.file]: JSON.stringify({ ...emptyRecord('p', '/p'), tasks }) } })

  return { mem, deps: tasksDepsOf(fakePorts(mem).ports, CTX) }
}

const onDisk = (mem: ReturnType<typeof memoryHost>) => {
  const read = parseRecord(mem.files.get(CTX.file)!)
  if (read === 'unreadable') throw new Error('should read')

  return read
}

test('an edit changes only what it names', async () => {
  const task = makeTask({ title: 'Old', description: 'Kept', difficulty: { expected: 'light', actual: null } })
  const { mem, deps } = setup([task])

  await editTaskUseCase(deps, task.id, { title: 'New', difficulty: 'hard', criteria: ['Passes'] })

  expect(onDisk(mem).tasks[0]).toMatchObject({ title: 'New', description: 'Kept', criteria: ['Passes'], difficulty: { expected: 'hard', actual: null } })
})

test('a description can be cleared', async () => {
  const task = makeTask({ description: 'Gone soon' })
  const { mem, deps } = setup([task])

  await editTaskUseCase(deps, task.id, { description: null })

  expect(onDisk(mem).tasks[0]?.description).toBe(null)
})

test('a finished task keeps what it said', async () => {
  const task = makeTask({ state: 'done', title: 'Won' })
  const { mem, deps } = setup([task])

  await editTaskUseCase(deps, task.id, { title: 'Changed' })

  expect(onDisk(mem).tasks[0]?.title).toBe('Won')
})

test('a removed task comes back to the queue', async () => {
  const task = makeTask()
  const { mem, deps } = setup([task])

  await removeTaskUseCase(deps, task.id)
  expect(onDisk(mem).tasks[0]?.state).toBe('removed')

  await restoreTaskUseCase(deps, task.id)
  expect(onDisk(mem).tasks[0]?.state).toBe('queued')
})

test('restoring leaves a task that was not removed as it is', async () => {
  const task = makeTask({ state: 'done' })
  const { mem, deps } = setup([task])

  await restoreTaskUseCase(deps, task.id)

  expect(onDisk(mem).tasks[0]?.state).toBe('done')
})

test('a task can be filed with its description and criteria', async () => {
  const { mem, deps } = setup([])

  await fileTaskUseCase(deps, CTX, { text: 'A', title: 'A', priority: 'mid', difficulty: 'light', intent: 'improving', description: 'Why', criteria: ['Done when'] })

  expect(onDisk(mem).tasks[0]).toMatchObject({ title: 'A', description: 'Why', criteria: ['Done when'], state: 'queued' })
})

test('a task filed without them has neither', async () => {
  const { mem, deps } = setup([])

  await fileTaskUseCase(deps, CTX, { text: 'A', title: 'A', priority: 'mid', difficulty: 'light', intent: 'improving' })

  expect(onDisk(mem).tasks[0]).toMatchObject({ description: null, criteria: [] })
})
