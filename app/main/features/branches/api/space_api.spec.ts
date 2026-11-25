import { execFile, spawn } from 'node:child_process'
import { once } from 'node:events'
import { access, lstat, mkdir, mkdtemp, readFile, readdir, realpath, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, sep } from 'node:path'
import { promisify } from 'node:util'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import type { ProjectRecord, Task } from '../../../../../types'
import type { Host } from '../../../../../hooks/core/host/host'
import { emptyRecord, parseRecord } from '../../../../../hooks/shared/records/data/datasources/record_source'
import type { Reply } from '../../../../shared/engine_api'
import { createLogger } from '../../../core/logger'
import { nodeHost } from '../../../core/node_host'
import { makeTask } from '../../tasks/api/fixtures'
import type { TasksDeps } from '../../tasks/api/scope'
import { startQuest } from '../../tasks/api/start_api'
import { BRANCH_TEXT } from '../domain/constants'
import { clearAfterMerge, freeFolderSpace, readFolderSpace, removeTaskFolder } from './space_api'

// Real Git in a disposable folder: a project with two quest worktrees, each
// holding build output beside things that must survive. Only git, rm and du
// run for real; anything else (a terminal) is answered without running.
const KEY = 'demo-abc123'
const NOW = Date.parse('2026-11-25T10:00:00Z')
const run = promisify(execFile)

let home: string; let repo: string; let one: string; let two: string; let file: string; let startCommit: string
let d: TasksDeps; let runs: string[][]; let logged: string[]; let failing: ((argv: string[], cwd?: string) => boolean) | null

const git = async (cwd: string, ...args: string[]) => (await run('git', args, { cwd, env: { ...process.env, GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null' } })).stdout.trim()
const isThere = (path: string) => access(path).then(() => true, () => false)
const seed = (tasks: Task[]) => writeFile(file, JSON.stringify({ ...emptyRecord('demo', repo), version: 2, tasks }))
const onDisk = async (): Promise<ProjectRecord> => {
  const read = parseRecord(await readFile(file, 'utf8'))
  if (read === 'unreadable') throw new Error('should read')
  return read
}
type Id = 'one' | 'two' | 'three'
const folderOf = (id: Id) => join(home, 'quests', id)
const quest = (id: Id, over: Partial<Task> = {}) => makeTask({ id, title: `Quest ${id}`, state: 'done', branch: `task/${id}`, baseBranch: 'main', startCommit, worktreePath: folderOf(id), ...over })
const data = <T>(answer: Reply<T>): T => { if (!answer.ok) throw new Error(`should succeed: ${answer.error.message}`); return answer.data }
const refused = <T>(answer: Reply<T>): string => { if (answer.ok) throw new Error('should be refused'); return answer.error.message }
const session = async (over: { heartbeat?: number; workingPath?: string; projectPath?: string }) => {
  await mkdir(join(home, '.queue-tea/sessions'), { recursive: true })
  await writeFile(join(home, '.queue-tea/sessions/s-1.json'), JSON.stringify({ id: 's-1', projectPath: repo, recordFile: file, currentTaskId: null, isTurnRunning: false, cup: { mood: 'idle', line: '' }, allowance: null, options: {}, heartbeat: NOW, startedAt: NOW, ...over }))
}
// Build output a tool makes again, and what lives beside it and must stay.
const fill = async (path: string) => {
  for (const [name, text] of [['node_modules/pkg/index.js', 'module'], ['dist/app.js', 'bundle'], ['packages/app/node_modules/x/index.js', 'nested'],
    ['target/junk.o', 'object'], ['logs/out.log', 'log'], ['.env', 'SECRET=1']] as const) {
    await mkdir(join(path, name, '..'), { recursive: true }); await writeFile(join(path, name), text)
  }
  await symlink(join(home, 'shared-modules'), join(path, 'apps/web/node_modules'))
}
// A third quest folder, for a sweep that must tell two other folders apart.
const addThree = async () => { await git(repo, 'worktree', 'add', '-b', 'task/three', folderOf('three'), 'main'); await fill(folderOf('three')) }
// The quest's work lands on main through a real merge commit.
const mergeIntoMain = async (id: Id) => {
  const path = folderOf(id)
  await writeFile(join(path, `${id}.txt`), `${id}\n`); await git(path, 'add', `${id}.txt`); await git(path, 'commit', '-m', `Work on ${id}`)
  await git(repo, 'merge', '--no-ff', '--no-edit', `task/${id}`)
}
// The app update's saved state, written where the update runner keeps it for
// this home. Spelled out here, so a test can never write the real one.
const update = async (state: string | { phase: string; updatedAt?: number; worker?: number }) => {
  const folder = join(home, 'Library/Logs/Queue-tea')
  await mkdir(join(folder, 'refresh.lock'), { recursive: true })
  if (typeof state === 'string') return writeFile(join(folder, 'state.json'), state)
  await writeFile(join(folder, 'state.json'), JSON.stringify({ phase: state.phase, commit: 'a'.repeat(40), repository: join(repo, '.git'), detail: null, updatedAt: state.updatedAt ?? Date.now() }))
  if (state.worker) await writeFile(join(folder, 'refresh.lock/pid'), String(state.worker))
}
const deadPid = async () => { const child = spawn(process.execPath, ['-e', '']); await once(child, 'exit'); return child.pid! }
// Every path under the test's home outside git's and Queue-tea's own files
// (the branch lock's folder comes and goes), and the record: what a refused
// or skipped call must leave exactly as it was.
const snapshot = async () => ({ paths: (await readdir(home, { recursive: true })).filter(p => !p.split(sep).includes('.git') && !p.startsWith('.queue-tea')).sort(), record: await readFile(file, 'utf8') })

beforeEach(async () => {
  home = await realpath(await mkdtemp(join(tmpdir(), 'queue-tea-space-')))
  repo = join(home, 'repo'); one = join(home, 'quests/one'); two = join(home, 'quests/two')
  file = join(home, '.queue-tea/projects', `${KEY}.json`)
  await mkdir(join(home, '.queue-tea/projects'), { recursive: true }); await mkdir(repo); await mkdir(join(home, 'quests'))
  await mkdir(join(home, 'shared-modules')); await writeFile(join(home, 'shared-modules/keep.js'), 'shared')
  await git(repo, 'init', '-b', 'main')
  await git(repo, 'config', 'user.name', 'Queue-tea test'); await git(repo, 'config', 'user.email', 'test@example.invalid')
  await git(repo, 'config', 'core.hooksPath', '/dev/null'); await git(repo, 'config', 'commit.gpgsign', 'false')
  await writeFile(join(repo, '.gitignore'), 'node_modules\ndist/\ntarget/\nlogs/\n.env\n')
  for (const [name, text] of [['a.txt', 'base\n'], ['build/index.html', '<p>tracked</p>\n'], ['packages/app/package.json', '{}\n'], ['apps/web/package.json', '{}\n'], ['target/keep.txt', 'tracked\n']] as const) {
    await mkdir(join(repo, name, '..'), { recursive: true }); await writeFile(join(repo, name), text)
  }
  await git(repo, 'add', '.'); await git(repo, 'add', '-f', 'target/keep.txt'); await git(repo, 'commit', '-m', 'Base')
  startCommit = await git(repo, 'rev-parse', 'HEAD')
  await git(repo, 'worktree', 'add', '-b', 'task/one', one, 'main'); await git(repo, 'worktree', 'add', '-b', 'task/two', two, 'main')
  // The project folder's own build output is never a quest folder's.
  await mkdir(join(repo, 'node_modules/root'), { recursive: true }); await writeFile(join(repo, 'node_modules/root/index.js'), 'root')
  await fill(one); await fill(two)
  await seed([quest('one'), quest('two')])

  runs = []; logged = []; failing = null
  const log = createLogger('dev', line => logged.push(line))
  const real = nodeHost(log, async () => ({ exitCode: 0, stdout: '', stderr: '' }))
  const host: Host = {
    ...real,
    run: async (argv, cwd) => {
      runs.push(argv)
      if (failing?.(argv, cwd)) return { exitCode: 128, stdout: '', stderr: 'fatal: simulated' }
      return ['git', 'rm', 'du'].includes(argv[0]!) ? real.run(argv, cwd) : { exitCode: 0, stdout: '', stderr: '' }
    },
  }
  let ids = 0
  d = { host, home, now: () => NOW, log, offsetMinutes: () => 60, newId: () => `q-${(ids += 1)}`, terminal: async () => 'terminal', copy: () => {} }
})
afterEach(() => rm(home, { recursive: true, force: true }))

describe('measuring the quest folders', () => {
  it('lists each quest folder with its build folders and sizes, and never the project folder', async () => {
    const space = data(await readFolderSpace(d, KEY))
    expect(space.at).toBe(NOW)
    expect(space.folders.map(f => f.path).sort()).toEqual([one, two])
    const row = space.folders.find(f => f.taskId === 'one')!
    expect(row).toMatchObject({ title: 'Quest one', branch: 'task/one', folders: ['dist', 'node_modules', 'packages/app/node_modules'], held: null, merged: false, changed: [], removable: false })
    expect(row.freeable).toBeGreaterThan(0)
    expect(row.bytes).toBeGreaterThanOrEqual(row.freeable)
  })
  it('marks a merged folder with nothing uncommitted as removable', async () => {
    await mergeIntoMain('one')
    const row = data(await readFolderSpace(d, KEY)).folders.find(f => f.taskId === 'one')!
    expect(row).toMatchObject({ merged: true, changed: [], removable: true })
  })
  it('lists the uncommitted files that keep a merged folder', async () => {
    await mergeIntoMain('one'); await writeFile(join(one, 'a.txt'), 'edited\n'); await writeFile(join(one, 'draft.md'), 'draft\n')
    const row = data(await readFolderSpace(d, KEY)).folders.find(f => f.taskId === 'one')!
    expect(row.removable).toBe(false)
    expect(row.changed.map(c => `${c.status} ${c.path}`).sort()).toEqual([' M a.txt', '?? draft.md'])
  })
})

describe('Free space', () => {
  it('deletes only ignored build folders: tracked folders, folders holding tracked files, .env, other ignored folders and a symlinked node_modules survive', async () => {
    data(await freeFolderSpace(d, KEY, [one]))

    for (const gone of ['node_modules', 'dist', 'packages/app/node_modules']) expect(await isThere(join(one, gone))).toBe(false)
    expect(await readFile(join(one, 'build/index.html'), 'utf8')).toBe('<p>tracked</p>\n')
    expect(await readFile(join(one, 'target/keep.txt'), 'utf8')).toBe('tracked\n')
    expect(await readFile(join(one, 'target/junk.o'), 'utf8')).toBe('object')
    expect(await readFile(join(one, '.env'), 'utf8')).toBe('SECRET=1')
    expect(await readFile(join(one, 'logs/out.log'), 'utf8')).toBe('log')
    expect((await lstat(join(one, 'apps/web/node_modules'))).isSymbolicLink()).toBe(true)
    expect(await readFile(join(home, 'shared-modules/keep.js'), 'utf8')).toBe('shared')
    expect(await git(one, 'status', '--porcelain')).toBe('')
  })
  it('leaves folders that were not picked, and the project folder, as they were', async () => {
    data(await freeFolderSpace(d, KEY, [one]))
    expect(await isThere(join(two, 'node_modules/pkg/index.js'))).toBe(true)
    expect(await isThere(join(repo, 'node_modules/root/index.js'))).toBe(true)
  })
  it('answers with the folders measured again, the cleared one now with nothing to free', async () => {
    const row = data(await freeFolderSpace(d, KEY, [one])).folders.find(f => f.taskId === 'one')!
    expect(row).toMatchObject({ folders: [], freeable: 0 })
  })
  it('keeps a folder git does not call ignored, even when the listing names it', async () => {
    // build/ holds tracked and untracked work: only check-ignore stands between it and rm.
    await writeFile(join(one, 'build/work.js'), 'mine')
    const listing = d.host.run; let isLied = false
    // Only the first listing lies; measuring again afterwards asks git itself.
    d.host.run = async (argv, cwd) => argv.includes('ls-files') && !isLied ? (isLied = true, { exitCode: 0, stdout: 'build/\0node_modules/\0', stderr: '' }) : listing(argv, cwd)
    data(await freeFolderSpace(d, KEY, [one]))
    expect(await readFile(join(one, 'build/work.js'), 'utf8')).toBe('mine')
    expect(await readFile(join(one, 'build/index.html'), 'utf8')).toBe('<p>tracked</p>\n')
    expect(await isThere(join(one, 'node_modules'))).toBe(false)
  })
  it('runs one rm -rf per confirmed folder, inside the quest folder, never git clean', async () => {
    data(await freeFolderSpace(d, KEY, [one]))
    expect(runs.filter(a => a[0] === 'rm')).toEqual([['rm', '-rf', '--', 'dist'], ['rm', '-rf', '--', 'node_modules'], ['rm', '-rf', '--', 'packages/app/node_modules']])
    expect(runs.some(a => a[0] === 'git' && a.includes('clean'))).toBe(false)
  })
  it('refuses when the current quest works in one picked folder, and clears none of them', async () => {
    await seed([quest('one', { state: 'current' }), quest('two')])
    expect(refused(await freeFolderSpace(d, KEY, [two, one]))).toBe(BRANCH_TEXT.spaceHeld)
    expect(await isThere(join(one, 'node_modules/pkg/index.js'))).toBe(true)
    expect(await isThere(join(two, 'node_modules/pkg/index.js'))).toBe(true)
    expect(runs.some(a => a[0] === 'rm')).toBe(false)
  })
  it('refuses a folder another current quest has taken as its own', async () => {
    await seed([quest('one'), quest('two', { state: 'current', worktreePath: one })])
    expect(refused(await freeFolderSpace(d, KEY, [one]))).toBe(BRANCH_TEXT.spaceHeld)
    expect(await isThere(join(one, 'node_modules/pkg/index.js'))).toBe(true)
  })
  it('refuses a folder a live session is working in', async () => {
    await session({ workingPath: one })
    expect(refused(await freeFolderSpace(d, KEY, [one]))).toBe(BRANCH_TEXT.spaceHeld)
    expect(await isThere(join(one, 'node_modules/pkg/index.js'))).toBe(true)
  })
  it('refuses a folder a live session reaches through a symlink, and changes nothing', async () => {
    await symlink(join(home, 'quests'), join(home, 'linked')); await session({ workingPath: join(home, 'linked/one') })
    const before = await snapshot()
    expect(refused(await freeFolderSpace(d, KEY, [one]))).toBe(BRANCH_TEXT.spaceHeld)
    expect(await snapshot()).toEqual(before)
  })
  it('clears a folder while a live session works in a folder that no longer exists', async () => {
    await session({ workingPath: join(home, 'gone') })
    data(await freeFolderSpace(d, KEY, [one]))
    expect(await isThere(join(one, 'node_modules'))).toBe(false)
  })
  it('clears a folder whose session has gone stale', async () => {
    await session({ workingPath: one, heartbeat: NOW - 91_000 })
    data(await freeFolderSpace(d, KEY, [one]))
    expect(await isThere(join(one, 'node_modules'))).toBe(false)
  })
  it('clears a quest folder while a session works in the project folder', async () => {
    await session({ projectPath: repo })
    data(await freeFolderSpace(d, KEY, [one]))
    expect(await isThere(join(one, 'node_modules'))).toBe(false)
  })
  it('refuses the project folder, a folder that is no quest\'s, and anything but a list of paths', async () => {
    expect(refused(await freeFolderSpace(d, KEY, [repo]))).toBe(BRANCH_TEXT.invalid)
    expect(refused(await freeFolderSpace(d, KEY, [one, join(home, 'elsewhere')]))).toBe(BRANCH_TEXT.invalid)
    expect(refused(await freeFolderSpace(d, KEY, one))).toBe(BRANCH_TEXT.invalid)
    expect(refused(await freeFolderSpace(d, KEY, [1]))).toBe(BRANCH_TEXT.invalid)
    expect(refused(await freeFolderSpace(d, KEY, []))).toBe(BRANCH_TEXT.spaceChoose)
    expect(await isThere(join(repo, 'node_modules/root/index.js'))).toBe(true)
    expect(await isThere(join(one, 'node_modules/pkg/index.js'))).toBe(true)
  })
})

describe('Remove folder', () => {
  const removals = () => runs.filter(a => a.includes('worktree') && a.includes('remove'))

  it('removes a merged, clean folder with a plain git worktree remove, keeps the branch and forgets the folder', async () => {
    await mergeIntoMain('one')
    const space = data(await removeTaskFolder(d, KEY, 'one'))

    expect(await isThere(one)).toBe(false)
    expect(removals()).toEqual([['git', '--no-optional-locks', 'worktree', 'remove', '--', one]])
    expect(runs.every(a => !a.includes('--force') && !a.includes('-f'))).toBe(true)
    expect(await git(repo, 'branch', '--list', 'task/one')).toContain('task/one')
    expect((await onDisk()).tasks.find(t => t.id === 'one')!.worktreePath).toBeNull()
    expect((await onDisk()).tasks.find(t => t.id === 'two')!.worktreePath).toBe(two)
    expect(space.folders.map(f => f.taskId)).toEqual(['two'])
  })
  it('refuses a folder with an uncommitted change, and leaves it with the change', async () => {
    await mergeIntoMain('one'); await writeFile(join(one, 'a.txt'), 'unsaved\n')
    expect(refused(await removeTaskFolder(d, KEY, 'one'))).toBe(BRANCH_TEXT.folderChanged)
    expect(await readFile(join(one, 'a.txt'), 'utf8')).toBe('unsaved\n')
    expect(removals()).toEqual([])
    expect((await onDisk()).tasks[0]!.worktreePath).toBe(one)
  })
  it('refuses a folder with an untracked file, and leaves the file there', async () => {
    await mergeIntoMain('one'); await mkdir(join(one, 'notes')); await writeFile(join(one, 'notes/idea.md'), 'idea\n')
    expect(refused(await removeTaskFolder(d, KEY, 'one'))).toBe(BRANCH_TEXT.folderChanged)
    expect(await readFile(join(one, 'notes/idea.md'), 'utf8')).toBe('idea\n')
    expect(removals()).toEqual([])
  })
  it('refuses a folder whose branch is not merged', async () => {
    await writeFile(join(one, 'one.txt'), 'one\n'); await git(one, 'add', 'one.txt'); await git(one, 'commit', '-m', 'Unmerged work')
    expect(refused(await removeTaskFolder(d, KEY, 'one'))).toBe(BRANCH_TEXT.notMerged)
    expect(await isThere(join(one, 'one.txt'))).toBe(true)
  })
  it('refuses a branch with no commits since it started, though main contains it', async () => {
    expect(refused(await removeTaskFolder(d, KEY, 'one'))).toBe(BRANCH_TEXT.notMerged)
    expect(await isThere(one)).toBe(true)
  })
  it('refuses a merged, clean folder the current quest or a live session works in', async () => {
    await mergeIntoMain('one')
    await seed([quest('one', { state: 'current' }), quest('two')])
    expect(refused(await removeTaskFolder(d, KEY, 'one'))).toBe(BRANCH_TEXT.spaceHeld)
    await seed([quest('one'), quest('two')]); await session({ workingPath: one })
    expect(refused(await removeTaskFolder(d, KEY, 'one'))).toBe(BRANCH_TEXT.spaceHeld)
    expect(await isThere(one)).toBe(true)
    expect(removals()).toEqual([])
  })
  it('refuses a quest with no folder of its own', async () => {
    expect(refused(await removeTaskFolder(d, KEY, 'nobody'))).toBe(BRANCH_TEXT.missing)
  })
  it('keeps the folder and the record when git refuses the removal', async () => {
    await mergeIntoMain('one')
    failing = argv => argv.includes('worktree') && argv.includes('remove')
    expect(refused(await removeTaskFolder(d, KEY, 'one'))).toBe(BRANCH_TEXT.spaceRemove)
    expect(await isThere(one)).toBe(true)
    expect((await onDisk()).tasks[0]!.worktreePath).toBe(one)
  })
  it('lets the quest start again in a fresh worktree on the branch it kept', async () => {
    await mergeIntoMain('one')
    data(await removeTaskFolder(d, KEY, 'one'))
    await seed([quest('one', { state: 'queued', worktreePath: null }), quest('two')])

    data(await startQuest(d, KEY, 'one', 'claude'))

    const task = (await onDisk()).tasks.find(t => t.id === 'one')!
    expect(task).toMatchObject({ state: 'current', branch: 'task/one' })
    expect(task.worktreePath).toBeTruthy()
    expect(await git(task.worktreePath!, 'branch', '--show-current')).toBe('task/one')
    expect(await readFile(join(task.worktreePath!, 'one.txt'), 'utf8')).toBe('one\n')
  })
})

describe('clearing after a merge', () => {
  const BUILD = ['dist', 'node_modules', 'packages/app/node_modules']

  it('clears the merged quest\'s build folders and says which, keeping everything else', async () => {
    await mergeIntoMain('one')
    expect(await clearAfterMerge(d, KEY, 'one')).toEqual([BRANCH_TEXT.clearedAfterMerge(BUILD)])
    expect(await isThere(join(one, 'node_modules'))).toBe(false)
    expect(await readFile(join(one, '.env'), 'utf8')).toBe('SECRET=1')
    expect(await isThere(join(two, 'node_modules/pkg/index.js'))).toBe(true)
  })
  it('keeps the build folders of a current quest and says why', async () => {
    await seed([quest('one', { state: 'current' }), quest('two')])
    expect(await clearAfterMerge(d, KEY, 'one')).toEqual([BRANCH_TEXT.keptAfterMerge])
    expect(await isThere(join(one, 'node_modules/pkg/index.js'))).toBe(true)
  })
  it('keeps the build folders a live session works in', async () => {
    await session({ workingPath: one })
    expect(await clearAfterMerge(d, KEY, 'one')).toEqual([BRANCH_TEXT.keptAfterMerge])
    expect(await isThere(join(one, 'node_modules/pkg/index.js'))).toBe(true)
  })
  it('keeps the build folders a live session reaches through a symlink', async () => {
    await symlink(join(home, 'quests'), join(home, 'linked')); await session({ workingPath: join(home, 'linked/one') })
    expect(await clearAfterMerge(d, KEY, 'one')).toEqual([BRANCH_TEXT.keptAfterMerge])
    expect(await isThere(join(one, 'node_modules/pkg/index.js'))).toBe(true)
  })
  it('clears them when the session there has gone stale', async () => {
    await session({ workingPath: one, heartbeat: NOW - 91_000 })
    expect(await clearAfterMerge(d, KEY, 'one')).toEqual([BRANCH_TEXT.clearedAfterMerge(BUILD)])
    expect(await isThere(join(one, 'node_modules'))).toBe(false)
  })
  it('says nothing for a quest with no folder or nothing to clear', async () => {
    expect(await clearAfterMerge(d, KEY, 'nobody')).toEqual([])
    for (const folder of BUILD) await rm(join(one, folder), { recursive: true })
    expect(await clearAfterMerge(d, KEY, 'one')).toEqual([])
  })
  it('never throws when git fails, and leaves the folder as it was', async () => {
    failing = argv => argv.includes('ls-files')
    expect(await clearAfterMerge(d, KEY, 'one')).toEqual([])
    expect(await isThere(join(one, 'node_modules/pkg/index.js'))).toBe(true)
  })

  it('also clears another merged quest\'s folder nobody works in, counted in one line after the quest\'s own', async () => {
    await mergeIntoMain('two'); await mergeIntoMain('one')
    expect(await clearAfterMerge(d, KEY, 'one')).toEqual([BRANCH_TEXT.clearedAfterMerge(BUILD), BRANCH_TEXT.clearedMergedAfterMerge(1)])
    expect(await isThere(join(two, 'node_modules'))).toBe(false)
  })
  it('keeps a still-current quest\'s own folder and sweeps the earlier merged one', async () => {
    // How merges really go: the quest is finished only after its merge.
    await mergeIntoMain('two'); await mergeIntoMain('one')
    await seed([quest('one', { state: 'current' }), quest('two')])
    expect(await clearAfterMerge(d, KEY, 'one')).toEqual([BRANCH_TEXT.keptAfterMerge, BRANCH_TEXT.clearedMergedAfterMerge(1)])
    expect(await isThere(join(one, 'node_modules/pkg/index.js'))).toBe(true)
    expect(await isThere(join(two, 'node_modules'))).toBe(false)
  })
  it('counts two other swept folders in one plural line', async () => {
    await addThree(); await mergeIntoMain('two'); await mergeIntoMain('three'); await mergeIntoMain('one')
    await seed([quest('one'), quest('two'), quest('three')])
    const lines = await clearAfterMerge(d, KEY, 'one')
    expect(lines).toEqual([BRANCH_TEXT.clearedAfterMerge(BUILD), BRANCH_TEXT.clearedMergedAfterMerge(2)])
    expect(lines[1]).toBe("Cleared build folders in 2 other merged quests' folders.")
    expect(await isThere(join(two, 'node_modules'))).toBe(false)
    expect(await isThere(join(folderOf('three'), 'node_modules'))).toBe(false)
  })
  it('keeps a put-back merged quest\'s build folders for when it resumes, and sweeps a finished one', async () => {
    await addThree(); await mergeIntoMain('two'); await mergeIntoMain('three'); await mergeIntoMain('one')
    await seed([quest('one'), quest('two', { state: 'queued' }), quest('three')])
    expect(await clearAfterMerge(d, KEY, 'one')).toEqual([BRANCH_TEXT.clearedAfterMerge(BUILD), BRANCH_TEXT.clearedMergedAfterMerge(1)])
    expect(await isThere(join(two, 'node_modules/pkg/index.js'))).toBe(true)
    expect(await isThere(join(two, 'dist/app.js'))).toBe(true)
    expect(await isThere(join(folderOf('three'), 'node_modules'))).toBe(false)
  })
  it('clears the merged quest\'s own folder even when it was put back', async () => {
    await mergeIntoMain('one'); await seed([quest('one', { state: 'queued' }), quest('two')])
    expect(await clearAfterMerge(d, KEY, 'one')).toEqual([BRANCH_TEXT.clearedAfterMerge(BUILD)])
    expect(await isThere(join(one, 'node_modules'))).toBe(false)
  })
  it.each([
    ['has work main does not contain', async () => { await writeFile(join(two, 'two.txt'), 'two\n'); await git(two, 'add', 'two.txt'); await git(two, 'commit', '-m', 'Unmerged') }],
    ['has no commits since it started', async () => {}],
  ])('leaves another quest\'s folder alone when its branch %s', async (_, arrange) => {
    await arrange(); await mergeIntoMain('one')
    expect(await clearAfterMerge(d, KEY, 'one')).toEqual([BRANCH_TEXT.clearedAfterMerge(BUILD)])
    expect(await isThere(join(two, 'node_modules/pkg/index.js'))).toBe(true)
    expect(await isThere(join(two, 'dist/app.js'))).toBe(true)
  })
  it.each([
    ['its quest is current', () => seed([quest('one'), quest('two', { state: 'current' })])],
    ['a live session works there', () => session({ workingPath: two })],
  ])('leaves another merged quest\'s folder alone while %s', async (_, hold) => {
    await mergeIntoMain('two'); await mergeIntoMain('one'); await hold()
    expect(await clearAfterMerge(d, KEY, 'one')).toEqual([BRANCH_TEXT.clearedAfterMerge(BUILD)])
    expect(await isThere(join(two, 'node_modules/pkg/index.js'))).toBe(true)
  })
  it.each([
    ['the quest\'s own folder', () => one, () => two, [BRANCH_TEXT.clearedMergedAfterMerge(1)]],
    ['the other merged folder', () => two, () => one, [BRANCH_TEXT.clearedAfterMerge(BUILD)]],
  ])('a git failure in %s leaves it as it was, still clears the other and does not throw', async (_, broken, fine, lines) => {
    await mergeIntoMain('two'); await mergeIntoMain('one')
    failing = (argv, cwd) => cwd === broken() && argv.includes('ls-files')
    expect(await clearAfterMerge(d, KEY, 'one')).toEqual(lines)
    expect(await isThere(join(broken(), 'node_modules/pkg/index.js'))).toBe(true)
    expect(await isThere(join(fine(), 'node_modules'))).toBe(false)
  })
  it('clears nothing and says nothing when the branches cannot be read', async () => {
    await mergeIntoMain('two'); await mergeIntoMain('one')
    failing = argv => argv.includes('for-each-ref')
    expect(await clearAfterMerge(d, KEY, 'one')).toEqual([])
    expect(await isThere(join(one, 'node_modules/pkg/index.js'))).toBe(true)
    expect(await isThere(join(two, 'node_modules/pkg/index.js'))).toBe(true)
  })
  it('keeps .env, tracked folders, other ignored folders and a symlinked node_modules in a swept folder', async () => {
    await mergeIntoMain('two'); await mergeIntoMain('one')
    await clearAfterMerge(d, KEY, 'one')
    for (const gone of BUILD) expect(await isThere(join(two, gone))).toBe(false)
    expect(await readFile(join(two, 'build/index.html'), 'utf8')).toBe('<p>tracked</p>\n')
    expect(await readFile(join(two, 'target/keep.txt'), 'utf8')).toBe('tracked\n')
    expect(await readFile(join(two, 'target/junk.o'), 'utf8')).toBe('object')
    expect(await readFile(join(two, '.env'), 'utf8')).toBe('SECRET=1')
    expect(await readFile(join(two, 'logs/out.log'), 'utf8')).toBe('log')
    expect((await lstat(join(two, 'apps/web/node_modules'))).isSymbolicLink()).toBe(true)
    expect(await readFile(join(home, 'shared-modules/keep.js'), 'utf8')).toBe('shared')
    expect(await git(two, 'status', '--porcelain')).toBe('')
  })
})

// An app update builds with the first node_modules it finds, which can be a
// quest folder's: nothing goes while one runs.
describe('while an app update runs', () => {
  const BUILD = ['dist', 'node_modules', 'packages/app/node_modules']
  const touched = () => runs.filter(a => a[0] === 'rm' || (a.includes('worktree') && a.includes('remove')))

  beforeEach(async () => { await mergeIntoMain('two'); await mergeIntoMain('one') })

  it.each(['queued', 'checking', 'building', 'verifying', 'installing'])('an update that is %s keeps every folder: the merge clears nothing, Free space and Remove folder refuse', async phase => {
    await update({ phase, worker: process.pid }); const before = await snapshot()

    expect(await clearAfterMerge(d, KEY, 'one')).toEqual([BRANCH_TEXT.keptForUpdate])
    expect(refused(await freeFolderSpace(d, KEY, [one, two]))).toBe(BRANCH_TEXT.spaceUpdating)
    expect(refused(await removeTaskFolder(d, KEY, 'one'))).toBe(BRANCH_TEXT.spaceUpdating)

    expect(await snapshot()).toEqual(before)
    expect(touched()).toEqual([])
  })
  it('an update that has not saved progress for a while still counts while its worker is alive', async () => {
    await update({ phase: 'building', updatedAt: Date.now() - 60_000, worker: process.pid })
    expect(await clearAfterMerge(d, KEY, 'one')).toEqual([BRANCH_TEXT.keptForUpdate])
    expect(await isThere(join(one, 'node_modules/pkg/index.js'))).toBe(true)
  })
  it('Remove folder names a folder\'s own reason before the update', async () => {
    await update({ phase: 'building', worker: process.pid }); await writeFile(join(one, 'a.txt'), 'unsaved\n')
    expect(refused(await removeTaskFolder(d, KEY, 'one'))).toBe(BRANCH_TEXT.folderChanged)
    await seed([quest('one'), quest('two', { state: 'current' })])
    expect(refused(await removeTaskFolder(d, KEY, 'two'))).toBe(BRANCH_TEXT.spaceHeld)
  })

  it.each([
    ['is idle', () => update({ phase: 'idle' })],
    ['has installed', () => update({ phase: 'installed' })],
    ['has failed', () => update({ phase: 'failed' })],
    ['stalled and its worker has exited', async () => update({ phase: 'building', updatedAt: Date.now() - 60_000, worker: await deadPid() })],
    ['stalled with no worker', () => update({ phase: 'installing', updatedAt: Date.now() - 60_000 })],
  ])('an update that %s leaves the merge, Free space and Remove folder free to clear', async (_, arrange) => {
    await arrange()
    data(await freeFolderSpace(d, KEY, [two]))
    expect(await isThere(join(two, 'node_modules'))).toBe(false)
    expect(await clearAfterMerge(d, KEY, 'one')).toEqual([BRANCH_TEXT.clearedAfterMerge(BUILD)])
    expect(await isThere(join(one, 'node_modules'))).toBe(false)
    data(await removeTaskFolder(d, KEY, 'one'))
    expect(await isThere(one)).toBe(false)
  })
  it.each([
    ['is not JSON', '{"phase": "buil'],
    ['names a phase there is no such thing as', JSON.stringify({ phase: 'brewing', commit: 'a'.repeat(40), repository: 'x', detail: null })],
  ])('a damaged update state that %s is logged and leaves clearing possible', async (_, text) => {
    await update(text)
    expect(await clearAfterMerge(d, KEY, 'one')).toEqual([BRANCH_TEXT.clearedAfterMerge(BUILD), BRANCH_TEXT.clearedMergedAfterMerge(1)])
    expect(await isThere(join(one, 'node_modules'))).toBe(false)
    expect(logged.some(l => l.includes(' error Reading the update state before clearing build folders failed\n'))).toBe(true)
  })
})
