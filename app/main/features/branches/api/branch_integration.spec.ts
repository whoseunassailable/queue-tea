import { execFile } from 'node:child_process'
import { mkdir, mkdtemp, readFile, realpath, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { emptyRecord } from '../../../../../hooks/shared/records/data/datasources/record_source'
import type { Reply } from '../../../../shared/engine_api'
import { createLogger } from '../../../core/logger'
import { nodeHost } from '../../../core/node_host'
import { makeTask } from '../../tasks/api/fixtures'
import { nodeUserGit } from '../data/user_git'
import { workspacePath } from '../data/merge_workspace'
import { completeMerge, prepareMerge, readBranch, readBranches, readMergeWorkspace, resolveMergeFile, abandonMerge } from './branch_api'
import type { BranchDeps } from './branch_api'
import { commitBranchFiles } from './commit_api'
import { pushMerge, readPush } from './push_api'

// Opt-in because these tests execute real commits/merges and a local-only
// push. Every repository, worktree, record and remote is under our temp root.
// No production repository, app, user Git hooks, or network is touched.
const integration = process.env.QUEUE_TEA_GIT_TESTS === '1' ? describe : describe.skip
const run = promisify(execFile)
const KEY = 'demo-abc123'
const data = <T>(reply: Reply<T>): T => { if (!reply.ok) throw new Error(reply.error.message); return reply.data }

integration('user-approved branch workflow in disposable repositories', () => {
  let folder: string; let repo: string; let taskPath: string; let d: BranchDeps
  const git = async (cwd: string, ...args: string[]) => (await run('git', args, { cwd, env: { ...process.env, GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null' } })).stdout.trim()
  const review = async () => data(await readBranch(d, KEY, 'one', 'main'))
  const prepare = async () => { const r = await review(); return data(await prepareMerge(d, KEY, { taskId: 'one', target: 'main', fingerprint: r.fingerprint, idleConfirmed: true })) }
  const finish = async (id: string, approval: string) => completeMerge(d, KEY, { operationId: id, approval, message: 'Merge task/one into main', idleConfirmed: true })
  const taskCommit = async (name: string, text: string) => { await writeFile(join(taskPath, name), text); await git(taskPath, 'add', '--', name); await git(taskPath, 'commit', '-m', 'Task change') }
  beforeEach(async () => {
    folder = await realpath(await mkdtemp(join(tmpdir(), 'queue-tea-merge-test-')))
    repo = join(folder, 'repo'); taskPath = join(folder, 'task')
    await mkdir(repo)
    await git(repo, 'init', '-b', 'main')
    await git(repo, 'config', 'user.name', 'Queue-tea test')
    await git(repo, 'config', 'user.email', 'test@example.invalid')
    await git(repo, 'config', 'core.hooksPath', '/dev/null')
    await git(repo, 'config', 'commit.gpgsign', 'false')
    await writeFile(join(repo, 'a.txt'), 'base\n')
    await git(repo, 'add', 'a.txt'); await git(repo, 'commit', '-m', 'Base')
    const startCommit = await git(repo, 'rev-parse', 'HEAD')
    await git(repo, 'worktree', 'add', '-b', 'task/one', taskPath, 'main')
    await taskCommit('feature.txt', 'feature\n')
    const log = createLogger('dev', () => {})
    d = { host: nodeHost(log, async () => ({ exitCode: 0, stdout: '', stderr: '' })), home: folder, now: () => Date.now(), log, offsetMinutes: () => 0, newId: () => 'test', terminal: async () => 'terminal', copy: () => {}, userGit: nodeUserGit(log) }
    const record = { ...emptyRecord('demo', repo), version: 2, tasks: [makeTask({ id: 'one', state: 'current', branch: 'task/one', baseBranch: 'main', startCommit, worktreePath: taskPath })] }
    await mkdir(join(folder, '.queue-tea/projects'), { recursive: true })
    await writeFile(join(folder, `.queue-tea/projects/${KEY}.json`), JSON.stringify(record))
  })
  afterEach(async () => { if (folder) await rm(folder, { recursive: true, force: true }) })

  it('prepares separately, merges with two parents, retains task work, and recovers duplicate delivery', async () => {
    const before = await git(repo, 'rev-parse', 'HEAD'); const source = await git(taskPath, 'rev-parse', 'HEAD')
    const prepared = await prepare()
    expect(prepared.operation.stage).toBe('ready'); expect(prepared.approval).toBeTruthy()
    expect(await git(repo, 'rev-parse', 'HEAD')).toBe(before)
    expect(await git(taskPath, 'rev-parse', 'HEAD')).toBe(source)
    const completed = data(await finish(prepared.operation.id, prepared.approval!))
    expect(completed.operation.stage).toBe('merged')
    expect(await git(repo, 'show', '-s', '--format=%P', 'HEAD')).toBe(`${before} ${source}`)
    expect(await readFile(join(repo, 'feature.txt'), 'utf8')).toBe('feature\n')
    expect(await git(taskPath, 'branch', '--show-current')).toBe('task/one')
    const repeated = data(await finish(prepared.operation.id, prepared.approval!))
    expect(repeated.operation.commit).toBe(completed.operation.commit)
    expect(data(await readBranches(d, KEY)).tasks[0]!.merged).toBe(true)
  })
  it('invalidates approval when the source changes, and blocks a dirty destination', async () => {
    const prepared = await prepare()
    await taskCommit('later.txt', 'later\n')
    expect(await finish(prepared.operation.id, prepared.approval!)).toMatchObject({ ok: false, error: { message: expect.stringContaining('changed') } })
    const before = await git(repo, 'rev-parse', 'HEAD')
    await writeFile(join(repo, 'unrelated.txt'), 'keep\n')
    expect((await review()).blocked).toContain('clean working folder')
    expect(await git(repo, 'rev-parse', 'HEAD')).toBe(before)
  })
  it('isolates conflicts, rejects markers, and applies only the reviewed resolution', async () => {
    await taskCommit('a.txt', 'task side\n')
    await writeFile(join(repo, 'a.txt'), 'main side\n'); await git(repo, 'commit', '-am', 'Main change')
    const prepared = await prepare()
    expect(prepared.operation.stage).toBe('conflicts')
    expect(prepared.conflicts[0]).toMatchObject({ path: 'a.txt', base: 'base\n', target: 'main side\n', source: 'task side\n' })
    expect(await readFile(join(taskPath, 'a.txt'), 'utf8')).toBe('task side\n')
    expect(await resolveMergeFile(d, KEY, { operationId: prepared.operation.id, path: 'a.txt', choice: 'edited', text: '<<<<<<< HEAD\nunresolved' })).toMatchObject({ ok: false })
    const resolved = data(await resolveMergeFile(d, KEY, { operationId: prepared.operation.id, path: 'a.txt', choice: 'edited', text: 'combined\n' }))
    expect(resolved.operation.stage).toBe('ready')
    data(await finish(prepared.operation.id, resolved.approval!))
    expect(await readFile(join(repo, 'a.txt'), 'utf8')).toBe('combined\n')
    expect(await readFile(join(taskPath, 'a.txt'), 'utf8')).toBe('task side\n')
  })
  it('abandons only the isolated preparation and permits a new one', async () => {
    const prepared = await prepare()
    expect(data(await abandonMerge(d, KEY, prepared.operation.id)).operation.stage).toBe('abandoned')
    expect(await git(taskPath, 'branch', '--show-current')).toBe('task/one')
    expect((await prepare()).operation.id).not.toBe(prepared.operation.id)
  })
  it('recovers a committed merge after a lost response without making another commit', async () => {
    const prepared = await prepare(); const original = d.userGit
    let commits = 0
    d.userGit = async (cwd, action) => {
      const result = await original(cwd, action)
      if (action.kind === 'commit') { commits++; throw new Error('simulated lost response') }
      return result
    }
    expect(await finish(prepared.operation.id, prepared.approval!)).toMatchObject({ ok: false })
    const recovered = data(await readMergeWorkspace(d, KEY, prepared.operation.id))
    expect(recovered.operation.stage).toBe('applying')
    data(await finish(prepared.operation.id, recovered.approval!))
    expect(commits).toBe(1)
  })
  it('serializes concurrent preparation attempts and retains a single operation', async () => {
    const r = await review(); const request = { taskId: 'one', target: 'main', fingerprint: r.fingerprint, idleConfirmed: true }
    const answers = await Promise.all([prepareMerge(d, KEY, request), prepareMerge(d, KEY, request)])
    expect(answers.filter(a => a.ok)).toHaveLength(1)
    const again = data(await prepareMerge(d, KEY, request))
    expect(again.operation.id).toBe(data(answers.find(a => a.ok)!).operation.id)
  })
  it('commits selected files only and a duplicate request cannot commit again', async () => {
    await writeFile(join(taskPath, 'one.txt'), 'include\n'); await writeFile(join(taskPath, 'two.txt'), 'leave\n')
    const r = await review(); const request = { taskId: 'one', target: 'main', fingerprint: r.fingerprint, idleConfirmed: true, files: ['one.txt'], message: 'Selected work' }
    data(await commitBranchFiles(d, KEY, request))
    const committed = await git(taskPath, 'rev-parse', 'HEAD')
    expect(await git(taskPath, 'status', '--porcelain')).toBe('?? two.txt')
    data(await commitBranchFiles(d, KEY, request))
    expect(await git(taskPath, 'rev-parse', 'HEAD')).toBe(committed)
  })
  it('keeps a local merge after push failure and publishes only after a fresh remote review', async () => {
    const remote = join(folder, 'remote.git'); await mkdir(remote); await git(remote, 'init', '--bare')
    await git(repo, 'remote', 'add', 'origin', remote)
    const prepared = await prepare(); const completed = data(await finish(prepared.operation.id, prepared.approval!))
    const checked = data(await readPush(d, KEY, completed.operation.id, 'origin'))
    const original = d.userGit
    d.userGit = async (cwd, action) => action.kind === 'push' ? { exitCode: 1, stdout: '', stderr: 'Rejected' } : original(cwd, action)
    expect(await pushMerge(d, KEY, checked)).toMatchObject({ ok: false })
    expect(await git(repo, 'rev-parse', 'HEAD')).toBe(completed.operation.commit)
    d.userGit = original
    const published = data(await pushMerge(d, KEY, checked))
    expect(published.operation.published?.commit).toBe(completed.operation.commit)
    expect(await git(remote, 'rev-parse', 'refs/heads/main')).toBe(completed.operation.commit)
    expect(await git(workspacePath(d, published.operation), 'status', '--porcelain')).toBe('')
  })
  it('requires a new approval when a commit hook changes the prepared result', async () => {
    const prepared = await prepare(); const before = await git(repo, 'rev-parse', 'HEAD'); const original = d.userGit
    d.userGit = async (cwd, action) => {
      if (action.kind === 'commit') {
        await writeFile(join(cwd, 'generated.txt'), 'hook output\n')
        await git(cwd, 'add', 'generated.txt')
      }
      return original(cwd, action)
    }
    const changed = data(await finish(prepared.operation.id, prepared.approval!))
    expect(changed.operation.stage).toBe('applying')
    expect(changed.diff).toContain('hook output')
    expect(await git(repo, 'rev-parse', 'HEAD')).toBe(before)
    expect(changed.approval).not.toBe(prepared.approval)
    data(await finish(prepared.operation.id, changed.approval!))
    expect(await readFile(join(repo, 'generated.txt'), 'utf8')).toBe('hook output\n')
  })
  it('blocks observed writers even when no current task owns that session', async () => {
    await mkdir(join(folder, '.queue-tea/sessions'), { recursive: true })
    await writeFile(join(folder, '.queue-tea/sessions/working.json'), JSON.stringify({ id: 'writer', projectPath: repo, workingPath: taskPath, heartbeat: Date.now(), isTurnRunning: true, cup: { mood: 'working', line: '' } }))
    const r = await review()
    expect(r.blocked).toContain('still working')
    expect(await prepareMerge(d, KEY, { taskId: 'one', target: 'main', fingerprint: r.fingerprint, idleConfirmed: true })).toMatchObject({ ok: false })
  })
  it('invalidates a selected-file commit when already-dirty file contents change', async () => {
    await writeFile(join(taskPath, 'a.txt'), 'first edit\n')
    const r = await review(); const before = await git(taskPath, 'rev-parse', 'HEAD')
    await writeFile(join(taskPath, 'a.txt'), 'second edit\n')
    expect(await commitBranchFiles(d, KEY, { taskId: 'one', target: 'main', fingerprint: r.fingerprint, idleConfirmed: true, files: ['a.txt'], message: 'Reviewed first edit' })).toMatchObject({ ok: false, error: { message: expect.stringContaining('changed') } })
    expect(await git(taskPath, 'rev-parse', 'HEAD')).toBe(before)
  })
  it('updates a destination without a checkout without switching the project folder', async () => {
    await git(repo, 'switch', '-c', 'holding')
    const before = await git(repo, 'rev-parse', 'HEAD')
    const prepared = await prepare(); const finished = data(await finish(prepared.operation.id, prepared.approval!))
    expect(await git(repo, 'branch', '--show-current')).toBe('holding')
    expect(await git(repo, 'rev-parse', 'HEAD')).toBe(before)
    expect(await git(repo, 'rev-parse', 'main')).toBe(finished.operation.commit)
  })

  it('allows a definite failed commit to be retried without changing or unstaging the selected files', async () => {
    await writeFile(join(taskPath, 'a.txt'), 'staged work\n'); await git(taskPath, 'add', 'a.txt')
    const r = await review(); const request = { taskId: 'one', target: 'main', fingerprint: r.fingerprint, idleConfirmed: true, files: ['a.txt'], message: 'Selected staged work' }
    const original = d.userGit
    d.userGit = async () => ({ exitCode: 1, stdout: '', stderr: 'Commit hook rejected the message' })
    expect(await commitBranchFiles(d, KEY, request)).toMatchObject({ ok: false })
    d.userGit = original
    data(await commitBranchFiles(d, KEY, request))
    expect(await git(taskPath, 'log', '-1', '--format=%s')).toBe(request.message)
  })

})
