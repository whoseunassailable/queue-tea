import { expect, it, vi } from 'vitest'
import type { Task } from '../../../../../types'
import type { Scope, TasksDeps } from '../../tasks/api/scope'
import { graphOf } from './branch_source'

vi.mock('./observation', () => ({ observeTask: async () => ({ state: 'paused', steps: [], seenAt: null }) }))
vi.mock('../../../../../hooks/shared/git/data/repositories/worktrees_repository_impl', () => ({ worktreesRepositoryImpl: () => ({ list: async () => [] }) }))

it('bounds Git fanout across a large graph and preserves task order and live values', async () => {
  const tasks = Array.from({ length: 24 }, (_, n) => ({ id: `task-${n}`, title: `Task ${n}`, branch: `task/${n}`, baseBranch: 'main', state: 'current', startCommit: 'old' }) as Task)
  const scope = { ctx: { projectPath: '/repo' }, record: { tasks } } as Scope
  let active = 0; let peak = 0; let count = 1
  const run = vi.fn(async (argv: string[]) => {
    active++; peak = Math.max(peak, active)
    await new Promise<void>(done => setImmediate(done))
    active--
    const command = argv[2]
    const stdout = command === 'for-each-ref' ? ['main\0base', ...tasks.map(t => `${t.branch}\0${t.id}`)].join('\n') : command === 'rev-list' ? String(count) : 'fork'
    return { exitCode: command === 'merge-base' && argv.includes('--is-ancestor') ? 1 : 0, stdout, stderr: '' }
  })
  const d = { host: { run }, now: () => count } as unknown as TasksDeps
  const first = await graphOf(d, scope)
  expect(peak).toBeLessThanOrEqual(4)
  expect(first.tasks.map(t => t.id)).toEqual(tasks.map(t => t.id))
  expect(first.tasks.every(t => t.commits === 1)).toBe(true)
  count = 2
  expect((await graphOf(d, scope)).tasks.every(t => t.commits === 2)).toBe(true)
})

it('drains outstanding task reads after a failure before releasing a graph for retry', async () => {
  const tasks = Array.from({ length: 12 }, (_, n) => ({ id: `task-${n}`, branch: `task/${n}`, baseBranch: 'main', state: 'current' }) as Task)
  let release!: () => void; let started!: () => void
  const held = new Promise<void>(done => { release = done })
  const firstBatch = new Promise<void>(done => { started = done })
  let jobs = 0
  const startedTasks = new Set<string>()
  const run = vi.fn(async (argv: string[]) => {
    if (argv.includes('for-each-ref')) return { exitCode: 0, stdout: ['main\0base', ...tasks.map(t => `${t.branch}\0${t.id}`)].join('\n'), stderr: '' }
    if (argv.includes('merge-base')) {
      startedTasks.add(argv.find(arg => /^task-/.test(arg))!)
      jobs++
      if (jobs === 4) started()
      if (jobs === 1) { await firstBatch; throw new Error('disk failed') }
      await held
    }
    return { exitCode: 0, stdout: '', stderr: '' }
  })
  const d = { host: { run }, now: () => 1 } as unknown as TasksDeps
  let settled = false
  const graph = graphOf(d, { ctx: { projectPath: '/repo' }, record: { tasks } } as Scope).then(() => { settled = true }, () => { settled = true })
  await firstBatch
  await new Promise<void>(done => setImmediate(done))
  expect(settled).toBe(false)
  expect(jobs).toBe(4)
  release(); await graph
  expect(settled).toBe(true)
  expect(startedTasks.size).toBe(4)
})
