import { mkdir, mkdtemp, realpath, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import type { MergeOperation } from '../../../../shared/branches'
import { createLogger } from '../../../core/logger'
import { nodeHost } from '../../../core/node_host'
import type { TasksDeps } from '../../tasks/api/scope'
import { workspaceOf } from './merge_workspace'

const state = vi.hoisted(() => ({ folder: '', index: '', untracked: '', unstaged: '' }))
vi.mock('./operation_store', () => ({ operationPath: () => state.folder }))
vi.mock('./checks_source', () => ({ discoverChecks: async () => [], readChecks: async () => [], checksPassed: () => true }))
vi.mock('./branch_source', () => ({
  digest: (text: string) => text,
  gitIn: () => async (args: string[]) => {
    if (args[0] === 'rev-parse') return args.at(-1) === 'index' ? state.index : 'target'
    if (args[0] === 'ls-files') return args.includes('--others') ? state.untracked : ''
    if (args[0] === 'diff') return args.length === 4 ? state.unstaged : ''
    return ''
  },
}))
let root: string; let d: TasksDeps
const operation = { id: 'operation', key: 'demo', stage: 'ready', sourceHead: 'source', targetHead: 'target', commit: null } as MergeOperation
beforeEach(async () => {
  root = await realpath(await mkdtemp(join(tmpdir(), 'queue-tea-dependency-review-')))
  state.folder = join(root, 'operation'); state.index = join(root, 'index'); state.untracked = ''; state.unstaged = ''
  await mkdir(join(state.folder, 'worktree/docs'), { recursive: true })
  await writeFile(state.index, 'private index fixture')
  const log = createLogger('dev', () => {})
  const host = nodeHost(log, async () => ({ exitCode: 0, stdout: '', stderr: '' }))
  host.run = async argv => ({ exitCode: 0, stdout: argv[0] === 'env' ? 'tree' : 'source', stderr: '' })
  d = { host, home: root, log, now: () => Date.now() } as TasksDeps
})
afterEach(async () => { await rm(root, { recursive: true, force: true }) })

it('keeps the same approval after local nested dependency setup without requiring an ignore edit', async () => {
  const before = await workspaceOf(d, root, operation)
  await mkdir(join(state.folder, 'worktree/docs/node_modules'))
  state.untracked = 'docs/node_modules/\0'
  expect((await workspaceOf(d, root, operation)).approval).toBe(before.approval)
  expect(before.approval).toBeTruthy()
})
it('still refuses unrelated untracked files alongside an installation', async () => {
  await mkdir(join(state.folder, 'worktree/docs/node_modules'))
  state.untracked = 'docs/node_modules/\0unreviewed.txt\0'
  expect((await workspaceOf(d, root, operation)).approval).toBeNull()
})
it('still refuses tracked changes alongside an installation', async () => {
  await mkdir(join(state.folder, 'worktree/docs/node_modules'))
  state.untracked = 'docs/node_modules/\0'; state.unstaged = 'changed package-lock.json'
  expect((await workspaceOf(d, root, operation)).approval).toBeNull()
})
it('does not exempt a shared node_modules link from review', async () => {
  const other = join(root, 'other'); await mkdir(other)
  await symlink(other, join(state.folder, 'worktree/docs/node_modules'), 'dir')
  state.untracked = 'docs/node_modules\0'
  expect((await workspaceOf(d, root, operation)).approval).toBeNull()
})
it('does not exempt dependency folders reached through an external ancestor link', async () => {
  const other = join(root, 'other'); await mkdir(join(other, 'node_modules'), { recursive: true })
  await symlink(other, join(state.folder, 'worktree/external'), 'dir')
  state.untracked = 'external/node_modules/\0'
  expect((await workspaceOf(d, root, operation)).approval).toBeNull()
})
