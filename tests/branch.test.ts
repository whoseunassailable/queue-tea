import { expect, test } from 'claude-code/testing'

import { startTask } from '../hooks/flow'
import { emptyRecord, parseRecord } from '../hooks/record'
import type { ProjectRecord } from '../types'
import { CTX, fakePorts, makeTask, memoryHost } from './helpers'
import type { Run } from './helpers'

const OID = '# branch.oid 1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b'
const CLEAN = [OID, '# branch.head main', '# branch.upstream origin/main', '# branch.ab +0 -0', ''].join('\n')
const LONG_TITLE = 'Feature parity audit of the menu against the engine, see http://localhost:5173/menu'
// A name the old slugging made: the whole title, cut at 50 characters.
const OLD_BRANCH = 'task/feature-parity-audit-of-the-menu-against-the-engin'
const stored = (mem: ReturnType<typeof memoryHost>) => JSON.parse(mem.files.get(CTX.file)!) as ProjectRecord
const repo = (tasks: ProjectRecord['tasks'], branches: string[], more: Record<string, Run> = {}) =>
  memoryHost({
    files: { [CTX.file]: JSON.stringify({ ...emptyRecord('p', '/p'), tasks }) },
    git: {
      'git rev-parse --is-inside-work-tree': { stdout: 'true\n' },
      'git status --porcelain=v2 --branch': { stdout: CLEAN },
      'git branch --format=%(refname:short)': { stdout: `${branches.join('\n')}\n` },
      'git rev-parse HEAD': { stdout: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b\n' },
      ...more,
    },
  })

test('a new task gets a short branch, and its whole title stays in the record', async () => {
  const task = makeTask({ title: LONG_TITLE })
  const mem = repo([task], ['main'], { 'git switch -c task/feature-parity-audit-menu': {} })
  const { ports } = fakePorts(mem)

  expect(await startTask(ports, CTX, task.id)).toBe('started')
  const saved = stored(mem).tasks[0]!
  expect(saved.branch).toBe('task/feature-parity-audit-menu')
  expect(saved.title).toBe(LONG_TITLE)
  expect(mem.runs).toContainEqual(['git', 'switch', '-c', 'task/feature-parity-audit-menu'])
})

test('a short name another branch has gets the next free number', async () => {
  const task = makeTask({ title: LONG_TITLE })
  const mem = repo([task], ['main', 'task/feature-parity-audit-menu', 'task/feature-parity-audit-menu-2'], {
    'git switch -c task/feature-parity-audit-menu-3': {},
  })
  const { ports } = fakePorts(mem)

  expect(await startTask(ports, CTX, task.id)).toBe('started')
  expect(stored(mem).tasks[0]!.branch).toBe('task/feature-parity-audit-menu-3')
})

test('a task put back on a branch with an old long name goes back to that branch, never renamed', async () => {
  const task = makeTask({ title: LONG_TITLE, branch: OLD_BRANCH, startCommit: '0f0f0f0', baseBranch: 'main' })
  const mem = repo([task], ['main', OLD_BRANCH], { [`git switch ${OLD_BRANCH}`]: {} })
  const { ports } = fakePorts(mem)

  expect(await startTask(ports, CTX, task.id)).toBe('started')
  const saved = stored(mem).tasks[0]!
  expect([saved.branch, saved.startCommit, saved.baseBranch, saved.title]).toEqual([OLD_BRANCH, '0f0f0f0', 'main', LONG_TITLE])
  expect(mem.runs).toContainEqual(['git', 'switch', OLD_BRANCH])
  expect(mem.runs.some(argv => argv.includes('-c') || argv.includes('-m') || argv.includes('-M'))).toBe(false)
})

test('a task whose old branch is gone starts again on a short one and says so', async () => {
  const task = makeTask({ title: LONG_TITLE, branch: OLD_BRANCH, startCommit: '0f0f0f0' })
  const mem = repo([task], ['main'], { 'git switch -c task/feature-parity-audit-menu': {} })
  const { ports, view } = fakePorts(mem)

  expect(await startTask(ports, CTX, task.id)).toBe('started')
  expect(stored(mem).tasks[0]!.branch).toBe('task/feature-parity-audit-menu')
  expect(view.notice).toBe(`${OLD_BRANCH} was gone, so this task starts again on task/feature-parity-audit-menu, made from main.`)
})

test('a record with old long branch names reads and writes back unchanged', () => {
  const done = makeTask({ title: LONG_TITLE, state: 'done', branch: OLD_BRANCH })
  const text = JSON.stringify({ ...emptyRecord('p', '/p'), tasks: [done] })
  const read = parseRecord(text)

  expect(read === 'unreadable' ? null : read.tasks[0]!.branch).toBe(OLD_BRANCH)
})
