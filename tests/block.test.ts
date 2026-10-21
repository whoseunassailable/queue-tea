import { expect, test } from 'claude-code/testing'

import { blockTask, putBack, startTask, togglePlayNext, unblockTask } from '../hooks/flow'
import { emptyRecord } from '../hooks/record'
import type { ProjectRecord } from '../types'
import { CTX, fakePorts, makeTask, memoryHost } from './helpers'

const OID = '# branch.oid 1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b'
const CLEAN = [OID, '# branch.head main', '# branch.upstream origin/main', '# branch.ab +0 -0', ''].join('\n')
const stored = (mem: ReturnType<typeof memoryHost>) => JSON.parse(mem.files.get(CTX.file)!) as ProjectRecord
const setup = (tasks: ProjectRecord['tasks'], more: Partial<ProjectRecord> = {}, git: Record<string, { stdout?: string; exitCode?: number }> = {}) => {
  const r = { ...emptyRecord('p', '/p'), ...more, tasks }
  const mem = memoryHost({
    files: { [CTX.file]: JSON.stringify(r) },
    git: {
      'git rev-parse --is-inside-work-tree': { stdout: 'true\n' },
      'git status --porcelain=v2 --branch': { stdout: CLEAN },
      'git branch --format=%(refname:short)': { stdout: 'main\n' },
      ...git,
    },
  })

  return { mem, ...fakePorts(mem, { view: { record: r } }) }
}

test('a queued task can wait for another, and Unblock clears it', async () => {
  const a = makeTask({ title: 'A' })
  const b = makeTask({ title: 'B' })
  const { mem, ports } = setup([a, b])

  await blockTask(ports, CTX, b.id, { waitFor: a.id })
  expect(stored(mem).tasks[1]!.blockedBy).toEqual([a.id])
  await unblockTask(ports, CTX, b.id)
  expect([stored(mem).tasks[1]!.blockedBy, stored(mem).tasks[1]!.blockedReason]).toEqual([[], null])
})

test('a wait that would loop is refused and said so', async () => {
  const a = makeTask({ title: 'A' })
  const b = makeTask({ title: 'B', blockedBy: [a.id] })
  const { mem, ports, view } = setup([a, b])

  await blockTask(ports, CTX, a.id, { waitFor: b.id })
  expect(stored(mem).tasks[0]!.blockedBy).toEqual([])
  expect(view.notice).toBe('That would make the two tasks wait for each other.')
})

test('blocking the current task puts it back blocked, with a checkpoint asked for', async () => {
  const now = makeTask({ title: 'Now', state: 'current', branch: 'task/now' })
  const { mem, ports, done } = setup([now])

  await blockTask(ports, CTX, now.id, { reason: 'waiting for the API key' })
  expect([stored(mem).tasks[0]!.state, stored(mem).tasks[0]!.blockedReason]).toEqual(['queued', 'waiting for the API key'])
  expect(done.toasts).toEqual(['Blocked: Now'])
})

test('a blocked task does not start', async () => {
  const a = makeTask({ title: 'A', blockedReason: 'later' })
  const { mem, ports, view } = setup([a])

  expect(await startTask(ports, CTX, a.id)).toBe('failed')
  expect(stored(mem).tasks[0]!.state).toBe('queued')
  expect(view.notice).toBe('A is blocked: later. Unblock it first.')
})

test('Play next is set, taken off, and cleared when its task starts', async () => {
  const a = makeTask({ title: 'A' })
  const { mem, ports, settle } = setup([a], {}, { 'git switch -c task/a': {}, 'git rev-parse HEAD': { stdout: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b\n' } })

  await togglePlayNext(ports, CTX, a.id)
  expect(stored(mem).playNext).toBe(a.id)
  await togglePlayNext(ports, CTX, a.id)
  expect(stored(mem).playNext).toBeNull()
  await togglePlayNext(ports, CTX, a.id)
  expect(await startTask(ports, CTX, a.id)).toBe('started')
  await settle()
  const saved = stored(mem)
  expect(saved.playNext).toBeNull()
  expect([saved.tasks[0]!.baseBranch, saved.tasks[0]!.startCommit]).toEqual(['main', '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b'])
})

test('a put-back task whose branch is gone starts again on a new branch from here', async () => {
  const a = makeTask({ title: 'A', branch: 'task/a', baseBranch: 'dev', startCommit: '0f0f0f0' })
  const { mem, ports, view } = setup([a], {}, { 'git switch -c task/a': {}, 'git rev-parse HEAD': { stdout: 'abcdef1234\n' } })

  expect(await startTask(ports, CTX, a.id)).toBe('started')
  const saved = stored(mem).tasks[0]!
  expect([saved.branch, saved.baseBranch, saved.startCommit]).toEqual(['task/a', 'main', 'abcdef1234'])
  expect(view.notice).toBe('task/a was gone, so this task starts again on task/a, made from main.')
})

test('putting back keeps a task unblocked unless asked', async () => {
  const now = makeTask({ title: 'Now', state: 'current' })
  const { mem, ports } = setup([now])

  await putBack(ports, CTX)
  expect([stored(mem).tasks[0]!.blockedBy, stored(mem).tasks[0]!.blockedReason]).toEqual([[], null])
})
