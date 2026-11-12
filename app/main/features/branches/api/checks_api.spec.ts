import { mkdir, mkdtemp, readFile, realpath, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import type { CheckRun, MergeOperation } from '../../../../shared/branches'
import { createLogger } from '../../../core/logger'
import { nodeHost } from '../../../core/node_host'
import { streamProcess } from '../../../core/stream_process'
import { runMergeChecks, cancelMergeChecks } from './checks_api'
import type { BranchDeps } from './branch_api'

const state = vi.hoisted(() => ({ folder: '', source: '', approval: 'approved', runs: [] as CheckRun[], subfolder: 'docs' }))
vi.mock('../../tasks/api/scope', () => ({ scopeOf: async () => ({ key: 'demo', ctx: { projectPath: state.source } }) }))
vi.mock('../../../../../hooks/shared/git/data/repositories/worktrees_repository_impl', () => ({ worktreesRepositoryImpl: () => ({ list: async () => [{ path: state.source, branch: 'task/one' }] }) }))
vi.mock('../data/operation_store', () => ({
  withBranchLock: async (_d: unknown, _key: string, work: () => Promise<unknown>) => work(),
  loadOperation: async () => ({ id: 'operation', key: 'demo', source: 'task/one' }),
  operationPath: () => join(state.folder, 'metadata'),
}))
vi.mock('../data/checks_source', () => ({
  discoverChecks: async () => [{ id: 'build', name: 'docs: build', command: 'npm run build', script: 'build', folder: state.subfolder, manifest: 'docs/package.json' }],
  readChecks: async () => state.runs,
  saveChecks: async (_d: unknown, _op: unknown, runs: CheckRun[]) => { state.runs = runs },
}))
vi.mock('../data/merge_workspace', () => ({
  workspacePath: () => state.folder,
  workspaceOf: async (_d: unknown, _root: string, operation: MergeOperation) => ({ operation: { ...operation, tree: 'tree' }, approval: state.approval, checks: state.runs, checksCurrent: state.runs.at(-1)?.status === 'succeeded' }),
}))
vi.mock('../../../core/stream_process', () => ({ streamProcess: vi.fn() }))

let root: string; let d: BranchDeps
const manifest = { dependencies: { fixture: '1.0.0' }, scripts: { build: 'docusaurus build' } }
const packages = { '': { dependencies: manifest.dependencies }, 'node_modules/fixture': { version: '1.0.0', resolved: 'https://example.invalid/fixture.tgz', integrity: 'sha512-fixture' } }
const fixture = async (base: string, installed = false) => {
  const path = join(base, state.subfolder)
  await mkdir(path, { recursive: true })
  await writeFile(join(path, 'package.json'), JSON.stringify(manifest))
  await writeFile(join(path, 'package-lock.json'), JSON.stringify({ lockfileVersion: 3, packages }))
  if (installed) {
    await mkdir(join(path, 'node_modules/fixture'), { recursive: true })
    await writeFile(join(path, 'node_modules/fixture/package.json'), JSON.stringify({ name: 'fixture', version: '1.0.0' }))
    await writeFile(join(path, 'node_modules/.package-lock.json'), JSON.stringify({ lockfileVersion: 3, packages: { 'node_modules/fixture': packages['node_modules/fixture'] } }))
  }
  return path
}
const run = async () => {
  const reply = await runMergeChecks(d, 'demo', { operationId: 'operation', approval: 'approved', checkIds: ['build'] })
  if (!reply.ok) throw new Error(reply.error.message)
  return reply.data
}
beforeEach(async () => {
  vi.clearAllMocks()
  root = await realpath(await mkdtemp(join(tmpdir(), 'queue-tea-check-deps-')))
  state.folder = join(root, 'merge'); state.source = join(root, 'source'); state.runs = []; state.approval = 'approved'; state.subfolder = 'docs'
  await mkdir(state.folder); await mkdir(state.source)
  const log = createLogger('dev', () => {})
  d = { host: nodeHost(log, async () => ({ exitCode: 0, stdout: '', stderr: '' })), home: root, now: () => Date.now(), log } as BranchDeps
  vi.mocked(streamProcess).mockResolvedValue({ exitCode: 0, stdout: '', stderr: '' })
})
afterEach(async () => { await rm(root, { recursive: true, force: true }) })

it.each(['.', 'docs'])('stops a fresh %s package before its build and explains locked offline setup', async subfolder => {
  state.subfolder = subfolder
  const path = await fixture(state.folder)
  const result = await run()
  expect(result.checks?.at(-1)).toMatchObject({ status: 'setupRequired', exitCode: null, finished: expect.any(Number) })
  expect(result.checks?.at(-1)?.output).toContain(path)
  expect(result.checks?.at(-1)?.output).toContain('npm ci --offline')
  expect(result.checks?.at(-1)?.output).toContain('cache')
  expect(result.checksCurrent).toBe(false)
  expect(streamProcess).not.toHaveBeenCalled()
})
it.each([false, true])('does not borrow or change another worktree even when its manifest matches: %s', async mismatch => {
  await fixture(state.folder)
  const source = await fixture(state.source, true)
  if (mismatch) await writeFile(join(source, 'package-lock.json'), '{"lockfileVersion":3,"packages":{}}')
  const before = await readFile(join(source, 'node_modules/.package-lock.json'), 'utf8')
  expect((await run()).checks?.at(-1)?.status).toBe('setupRequired')
  expect(await d.host.exists(join(state.folder, state.subfolder, 'node_modules'))).toBe(false)
  expect(await readFile(join(source, 'node_modules/.package-lock.json'), 'utf8')).toBe(before)
  expect(streamProcess).not.toHaveBeenCalled()
})
it.each(['installed lock', 'installed version', 'manifest', 'lockfile'])('rejects stale dependencies after a change to the %s', async change => {
  const path = await fixture(state.folder, true)
  if (change === 'installed lock') await writeFile(join(path, 'node_modules/.package-lock.json'), JSON.stringify({ lockfileVersion: 3, packages: { 'node_modules/fixture': { ...packages['node_modules/fixture'], version: '0.9.0' } } }))
  if (change === 'installed version') await writeFile(join(path, 'node_modules/fixture/package.json'), '{"version":"0.9.0"}')
  if (change === 'manifest') await writeFile(join(path, 'package.json'), JSON.stringify({ ...manifest, dependencies: { fixture: '2.0.0' } }))
  if (change === 'lockfile') await writeFile(join(path, 'package-lock.json'), JSON.stringify({ lockfileVersion: 3, packages: { ...packages, 'node_modules/fixture': { version: '2.0.0' } } }))
  expect((await run()).checks?.at(-1)?.status).toBe('setupRequired')
  expect(streamProcess).not.toHaveBeenCalled()
})
it('reuses verified dependencies inside the merge folder and keeps an actual build failure failed', async () => {
  await fixture(state.folder, true)
  vi.mocked(streamProcess).mockImplementation(async (_log, _request, output) => { output?.('BUILD FAILED'); return { exitCode: 1, stdout: 'BUILD FAILED', stderr: '' } })
  const result = await run()
  expect(result.checks?.at(-1)).toMatchObject({ status: 'failed', exitCode: 1, output: 'BUILD FAILED' })
  expect(result.checksCurrent).toBe(false)
})
it('runs a dependency-free check without requiring node_modules', async () => {
  const path = await fixture(state.folder)
  await writeFile(join(path, 'package.json'), '{"scripts":{"build":"node check.cjs"}}')
  expect((await run()).checks?.at(-1)?.status).toBe('succeeded')
})
it('runs a check with matching local locked dependencies without installing anything', async () => {
  const path = await fixture(state.folder, true)
  expect((await run()).checks?.at(-1)?.status).toBe('succeeded')
  expect(streamProcess).toHaveBeenCalledWith(d.log, expect.objectContaining({ argv: ['npm', 'run', 'build'], cwd: path, env: expect.objectContaining({ npm_config_offline: 'true' }), timeoutMs: expect.any(Number) }), expect.any(Function))
})
it('keeps an incomplete offline-cache installation blocked and accepts a successful local setup retry', async () => {
  const path = await fixture(state.folder)
  await mkdir(join(path, 'node_modules'))
  const incomplete = await run()
  expect(incomplete.checks?.at(-1)).toMatchObject({ status: 'setupRequired', exitCode: null })
  expect(incomplete.checks?.at(-1)?.output).toContain('offline cache is incomplete, setup has failed')
  expect(incomplete.checks?.at(-1)?.output).toContain('approve network access separately')
  expect(streamProcess).not.toHaveBeenCalled()
  await fixture(state.folder, true)
  const retry = await run()
  expect(retry.checks?.at(-1)?.status).toBe('succeeded')
  expect(retry.checksCurrent).toBe(true)
  expect(retry.approval).toBe(incomplete.approval)
})
it('refuses installation metadata linked into another worktree', async () => {
  const path = await fixture(state.folder, true)
  const source = await fixture(state.source, true)
  await rm(join(path, 'node_modules/.package-lock.json'))
  await symlink(join(source, 'node_modules/.package-lock.json'), join(path, 'node_modules/.package-lock.json'))
  expect((await run()).checks?.at(-1)?.status).toBe('setupRequired')
  expect(streamProcess).not.toHaveBeenCalled()
})
it('requires root dependencies when a workspace script relies on root tools without declaring its own dependencies', async () => {
  state.subfolder = '.'
  const path = await fixture(state.folder)
  const docs = { name: 'docs', scripts: { build: 'fixture build' } }
  await mkdir(join(path, 'docs'))
  await writeFile(join(path, 'docs/package.json'), JSON.stringify(docs))
  await writeFile(join(path, 'package-lock.json'), JSON.stringify({ lockfileVersion: 3, packages: { ...packages, docs } }))
  state.subfolder = 'docs'
  expect((await run()).checks?.at(-1)).toMatchObject({ status: 'setupRequired', output: expect.stringContaining(`cd '${path}' && npm ci --offline`) })
  expect(streamProcess).not.toHaveBeenCalled()
})
it('uses the locked root installation for an npm workspace package', async () => {
  state.subfolder = '.'
  const path = await fixture(state.folder, true)
  const workspaceManifest = { ...manifest, name: 'docs', version: '1.0.0' }
  const workspacePackages = { ...packages, docs: workspaceManifest, 'node_modules/docs': { resolved: 'docs', link: true } }
  await writeFile(join(path, 'package.json'), JSON.stringify({ ...manifest, workspaces: ['docs'] }))
  await writeFile(join(path, 'package-lock.json'), JSON.stringify({ lockfileVersion: 3, packages: workspacePackages }))
  await writeFile(join(path, 'node_modules/.package-lock.json'), JSON.stringify({ lockfileVersion: 3, packages: { docs: workspaceManifest, 'node_modules/docs': workspacePackages['node_modules/docs'], 'node_modules/fixture': packages['node_modules/fixture'] } }))
  await mkdir(join(path, 'docs'))
  await writeFile(join(path, 'docs/package.json'), JSON.stringify(workspaceManifest))
  await symlink(join(path, 'docs'), join(path, 'node_modules/docs'), 'dir')
  state.subfolder = 'docs'
  expect((await run()).checks?.at(-1)?.status).toBe('succeeded')
})
it('accepts omitted optional platform packages but rejects missing required packages', async () => {
  const path = await fixture(state.folder, true)
  await writeFile(join(path, 'package-lock.json'), JSON.stringify({ lockfileVersion: 3, packages: { ...packages, 'node_modules/platform-only': { version: '1.0.0', optional: true } } }))
  expect((await run()).checks?.at(-1)?.status).toBe('succeeded')
  await writeFile(join(path, 'package-lock.json'), JSON.stringify({ lockfileVersion: 3, packages: { ...packages, 'node_modules/required': { version: '1.0.0' } } }))
  expect((await run()).checks?.at(-1)?.status).toBe('setupRequired')
})
it('uses shrinkwrap before package-lock and reports old lock formats explicitly', async () => {
  const path = await fixture(state.folder, true)
  await writeFile(join(path, 'npm-shrinkwrap.json'), JSON.stringify({ lockfileVersion: 3, packages }))
  await writeFile(join(path, 'package-lock.json'), '{}')
  expect((await run()).checks?.at(-1)?.status).toBe('succeeded')
  await writeFile(join(path, 'npm-shrinkwrap.json'), '{"lockfileVersion":1}')
  expect((await run()).checks?.at(-1)).toMatchObject({ status: 'setupRequired', output: expect.stringContaining('lockfileVersion 2 or 3') })
})
it('requires setup when an installed command link is missing even if package versions match', async () => {
  const path = await fixture(state.folder, true)
  const entry = { ...packages['node_modules/fixture'], bin: { docusaurus: 'cli.js' } }
  await writeFile(join(path, 'package-lock.json'), JSON.stringify({ lockfileVersion: 3, packages: { ...packages, 'node_modules/fixture': entry } }))
  await writeFile(join(path, 'node_modules/.package-lock.json'), JSON.stringify({ lockfileVersion: 3, packages: { 'node_modules/fixture': entry } }))
  await writeFile(join(path, 'node_modules/fixture/cli.js'), 'console.log("build")')
  expect((await run()).checks?.at(-1)?.status).toBe('setupRequired')
  expect(streamProcess).not.toHaveBeenCalled()
})
it('does not allow a shared dependency link after dependencies are removed from a manifest', async () => {
  const path = await fixture(state.folder)
  const source = await fixture(state.source, true)
  await symlink(join(source, 'node_modules'), join(path, 'node_modules'), 'dir')
  await writeFile(join(path, 'package.json'), '{"scripts":{"build":"node check.cjs"}}')
  expect((await run()).checks?.at(-1)?.status).toBe('setupRequired')
  expect(streamProcess).not.toHaveBeenCalled()
})
it('rejects a legacy shared node_modules link before the check can write through it', async () => {
  const path = await fixture(state.folder)
  const source = await fixture(state.source, true)
  await symlink(join(source, 'node_modules'), join(path, 'node_modules'), 'dir')
  expect((await run()).checks?.at(-1)?.status).toBe('setupRequired')
  expect(streamProcess).not.toHaveBeenCalled()
})
it('refuses obsolete approval before reading dependencies or running a check', async () => {
  state.approval = 'new approval'
  expect(await runMergeChecks(d, 'demo', { operationId: 'operation', approval: 'approved', checkIds: ['build'] })).toMatchObject({ ok: false })
  expect(streamProcess).not.toHaveBeenCalled()
})
it('requires setup when a lock is missing and never attempts an install or online fallback', async () => {
  const path = await fixture(state.folder)
  await rm(join(path, 'package-lock.json'))
  const result = await run()
  expect(result.checks?.at(-1)?.status).toBe('setupRequired')
  expect(result.checks?.at(-1)?.output).toContain('Commit an npm lockfile')
  expect(result.checks?.at(-1)?.output).toContain('approve network access separately')
  expect(streamProcess).not.toHaveBeenCalled()
})
it('reports an unreadable installation as setup required and logs the underlying error', async () => {
  const path = await fixture(state.folder, true)
  const original = d.host.read
  d.log.error = vi.fn()
  d.host.read = async file => {
    if (file === join(path, 'node_modules/.package-lock.json')) throw Object.assign(new Error('private permission detail'), { code: 'EACCES' })
    return original(file)
  }
  const result = await run()
  expect(result.checks?.at(-1)?.status).toBe('setupRequired')
  expect(result.checks?.at(-1)?.output).toContain('permissions')
  expect(result.checks?.at(-1)?.output).not.toContain('private permission detail')
  expect(d.log.error).toHaveBeenCalled()
  expect(streamProcess).not.toHaveBeenCalled()
})
it('refuses a nested package symlink outside the operation', async () => {
  await fixture(state.source, true)
  await symlink(join(state.source, 'docs'), join(state.folder, 'docs'), 'dir')
  expect((await run()).checks?.at(-1)?.status).toBe('setupRequired')
  expect(streamProcess).not.toHaveBeenCalled()
})
it('does not run a build when dependency inspection changes the approved tree', async () => {
  await fixture(state.folder, true)
  const original = d.host.read
  d.host.read = async file => { state.approval = 'changed'; return original(file) }
  const result = await run()
  expect(result.checks?.at(-1)?.status).toBe('failed')
  expect(result.checks?.at(-1)?.output).toContain('changed prepared files')
  expect(streamProcess).not.toHaveBeenCalled()
})
it('includes dependency inspection in the check timeout and releases the runner for retry', async () => {
  const path = await fixture(state.folder, true)
  let now = 1
  d.now = () => now
  const original = d.host.read
  d.host.read = async file => {
    if (file === join(path, 'package.json')) now += 900_001
    return original(file)
  }
  expect((await run()).checks?.at(-1)).toMatchObject({ status: 'failed', output: expect.stringContaining('15-minute limit') })
  expect(streamProcess).not.toHaveBeenCalled()
  d.host.read = original
  expect((await run()).checks?.at(-1)?.status).toBe('succeeded')
})
it('keeps a process timeout failed rather than reporting it as a passing or user-cancelled check', async () => {
  await fixture(state.folder, true)
  vi.mocked(streamProcess).mockResolvedValue({ exitCode: 130, stdout: '', stderr: '', timedOut: true })
  expect((await run()).checks?.at(-1)).toMatchObject({ status: 'failed', exitCode: 130, output: expect.stringContaining('15-minute limit') })
})
it('does not describe an actual script exit code of 130 as a timeout', async () => {
  await fixture(state.folder, true)
  vi.mocked(streamProcess).mockResolvedValue({ exitCode: 130, stdout: '', stderr: '' })
  const result = await run()
  expect(result.checks?.at(-1)).toMatchObject({ status: 'failed', exitCode: 130 })
  expect(result.checks?.at(-1)?.output).not.toContain('15-minute limit')
})
it('cancels during dependency inspection without starting the build or leaving a running record', async () => {
  const path = await fixture(state.folder, true)
  const original = d.host.read
  d.host.read = async file => {
    if (file === join(path, 'package.json')) await cancelMergeChecks(d, 'demo', 'operation')
    return original(file)
  }
  expect((await run()).checks?.at(-1)?.status).toBe('cancelled')
  expect(streamProcess).not.toHaveBeenCalled()
})
