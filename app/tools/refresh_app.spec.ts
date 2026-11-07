import { execFile } from 'node:child_process'
import { copyFile, mkdir, mkdtemp, readFile, realpath, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { publishedSource, queuePublished, readUpdate, runUpdates } from './update_runner.mjs'
import type { PublishedRequest } from './update_runner.mjs'

const exec = promisify(execFile)
const integration = process.env.QUEUE_TEA_GIT_TESTS === '1' ? describe : describe.skip

// Real objects/worktrees, with every build command replaced and installation
// directed into this test's temporary Applications folder. No network/packages.
integration('updates from acknowledged source in any worktree', () => {
  let folder: string; let repo: string; let task: string; let state: string; let target: string; let request: PublishedRequest
  let commands: string[]; let corrupt: boolean; let fail: boolean; let builtSource: string
  const git = async (cwd: string, ...args: string[]) => (await exec('git', args, { cwd, env: { ...process.env, GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null' } })).stdout.trim()
  const command = async (argv: string[], cwd: string, env: NodeJS.ProcessEnv) => {
    commands.push(argv.join(' '))
    if (fail && argv[1] === 'test') throw new Error('Test failure')
    if (argv[2] === 'package') {
      builtSource = await readFile(join(cwd, 'source.txt'), 'utf8')
      const resources = join(cwd, 'dist/mac-arm64/Queue-tea.app/Contents/Resources')
      await mkdir(resources, { recursive: true })
      const provenance = JSON.parse(await readFile(env.QUEUE_TEA_RELEASE_CONTEXT!, 'utf8'))
      if (corrupt) provenance.commit = '0'.repeat(40)
      await writeFile(join(resources, 'provenance.json'), JSON.stringify(provenance))
    }
    if (argv[0] === '/bin/sh') await exec(argv[0], argv.slice(1), { cwd, env: { ...env, PATH: `${join(folder, 'bin')}:${env.PATH}` } })
  }
  const run = () => runUpdates(state, { target, tools: __dirname, command })
  beforeEach(async () => {
    folder = await realpath(await mkdtemp(join(tmpdir(), 'queue-tea-published-')))
    repo = join(folder, 'repo'); task = join(folder, 'task'); state = join(folder, 'state'); target = join(folder, 'Applications/Queue-tea.app')
    await mkdir(join(repo, 'app/tools'), { recursive: true }); await mkdir(state); await mkdir(join(folder, 'Applications')); await mkdir(join(folder, 'bin'))
    await writeFile(join(folder, 'bin/lsregister'), '#!/bin/sh\nexit 0\n', { mode: 0o755 })
    await git(repo, 'init', '-b', 'main'); await git(repo, 'config', 'user.name', 'Test'); await git(repo, 'config', 'user.email', 'test@example.invalid'); await git(repo, 'config', 'core.hooksPath', '/dev/null'); await git(repo, 'config', 'commit.gpgsign', 'false')
    await writeFile(join(repo, '.gitignore'), 'node_modules/\n')
    await writeFile(join(repo, 'app/package.json'), JSON.stringify({ name: 'queue-tea-app', productName: 'Queue-tea', version: '1.5.2' }))
    await writeFile(join(repo, 'app/package-lock.json'), JSON.stringify({ packages: { '': {}, 'node_modules/electron': { version: '1.0.0' }, 'node_modules/fsevents': { version: '2.0.0', optional: true } } }))
    await writeFile(join(repo, 'app/source.txt'), 'published source')
    await copyFile(join(__dirname, 'release_guard.mjs'), join(repo, 'app/tools/release_guard.mjs'))
    await git(repo, 'add', '.'); await git(repo, 'commit', '-m', 'Published source')
    const commit = await git(repo, 'rev-parse', 'HEAD')
    await git(repo, 'worktree', 'add', '-b', 'task/feature', task)
    await mkdir(join(task, 'app/node_modules/electron'), { recursive: true }); await writeFile(join(task, 'app/node_modules/electron/package.json'), '{"version":"1.0.0"}')
    await writeFile(join(task, 'app/node_modules/electron/path.txt'), 'Electron.app/Contents/MacOS/Electron')
    request = { repo: task, remote: 'origin', branch: 'main', commit, repository: await git(repo, 'rev-parse', '--path-format=absolute', '--git-common-dir') }
    await writeFile(join(state, 'request.json'), JSON.stringify(request))
    commands = []; corrupt = false; fail = false; builtSource = ''
  })
  afterEach(async () => { await rm(folder, { recursive: true, force: true }) })
  it('builds the acknowledged commit from a feature worktree despite dirty files and newer local main, then retains the previous bundle', async () => {
    const resources = join(target, 'Contents/Resources'); await mkdir(resources, { recursive: true })
    await writeFile(join(resources, 'provenance.json'), JSON.stringify({ commit: request.commit }))
    await writeFile(join(repo, 'app/source.txt'), 'unpublished next main'); await git(repo, 'commit', '-am', 'Unpublished main')
    await writeFile(join(task, 'app/source.txt'), 'dirty feature work')
    await run()
    expect(builtSource).toBe('published source')
    expect(commands.slice(0, 3)).toEqual(['npm run typecheck', 'npm test', 'npm run package'])
    expect(commands.some(c => c.includes('codesign --verify'))).toBe(true)
    expect((await readUpdate(state))?.phase).toBe('installed')
    expect(JSON.parse(await readFile(join(resources, 'provenance.json'), 'utf8')).commit).toBe(request.commit)
    expect((await readdir(join(folder, 'Applications'))).some(n => n.startsWith('.Queue-tea.app.previous-'))).toBe(true)
    expect(await readFile(join(task, 'app/source.txt'), 'utf8')).toBe('dirty feature work')
    expect(await git(task, 'branch', '--show-current')).toBe('task/feature')
  })
  it('rejects feature publication before launching a worker or writing state', async () => {
    expect(await publishedSource({ ...request, branch: 'task/feature' })).toBeNull()
    expect(await queuePublished({ ...request, branch: 'task/feature' }, { folder: state })).toBe(false)
    expect(commands).toEqual([]); expect(await readUpdate(state)).toBeNull()
    const other = join(folder, 'other-repository'); await mkdir(other)
    expect(await queuePublished(request, { folder: state, repository: other })).toBe(false)
    expect(await readUpdate(state)).toBeNull()
  })
  it('rejects mismatched packaged provenance before installation', async () => {
    corrupt = true; await run()
    expect((await readUpdate(state))?.phase).toBe('failed')
    expect(commands.some(c => c.startsWith('/bin/sh'))).toBe(false)
  })
  it('refuses changed source files and signature failures before installation', async () => {
    const modify = async (argv: string[], cwd: string, env: NodeJS.ProcessEnv) => {
      await command(argv, cwd, env)
      if (argv[1] === 'test') await writeFile(join(cwd, 'source.txt'), 'modified by check')
    }
    await runUpdates(state, { target, tools: __dirname, command: modify })
    expect((await readUpdate(state))?.phase).toBe('failed')
    expect(commands.some(c => c.startsWith('/bin/sh'))).toBe(false)
    commands = []
    await runUpdates(state, { target, tools: __dirname, command: async (argv, cwd, env) => {
      if (argv[0] === '/usr/bin/codesign') throw new Error('Invalid signature')
      await command(argv, cwd, env)
    } })
    expect((await readUpdate(state))?.phase).toBe('failed')
    expect(commands.some(c => c.startsWith('/bin/sh'))).toBe(false)
  })
  it('fails visibly without installing dependencies and recovers an interrupted worker', async () => {
    await rm(join(task, 'app/node_modules'), { recursive: true })
    await run(); expect((await readUpdate(state))?.phase).toBe('failed'); expect(commands).toEqual([])
    await writeFile(join(state, 'state.json'), JSON.stringify({ phase: 'building', commit: request.commit, repository: request.repository, updatedAt: 1, detail: null }))
    expect(await readUpdate(state)).toMatchObject({ phase: 'failed', detail: expect.stringContaining('retry') })
  })
  it('skips an install older than its lockfile, or missing Electron\'s binary, then builds once it is complete', async () => {
    const electron = join(task, 'app/node_modules/electron')
    await writeFile(join(electron, 'package.json'), '{"version":"0.9.0"}')
    await run(); expect((await readUpdate(state))?.phase).toBe('failed'); expect(commands).toEqual([])
    await writeFile(join(electron, 'package.json'), '{"version":"1.0.0"}'); await rm(join(electron, 'path.txt'))
    await run(); expect((await readUpdate(state))?.phase).toBe('failed'); expect(commands).toEqual([])
    await writeFile(join(electron, 'path.txt'), 'Electron.app/Contents/MacOS/Electron')
    await run(); expect((await readUpdate(state))?.phase).toBe('installed')
  })
  it('preserves production after a failed check and supports retry of the acknowledged commit', async () => {
    fail = true; await run(); expect((await readUpdate(state))?.phase).toBe('failed')
    expect(commands).toEqual(['npm run typecheck', 'npm test'])
    fail = false; await run(); expect((await readUpdate(state))?.phase).toBe('installed')
  })
  it('refuses installed ancestry outside the acknowledged history before building', async () => {
    await mkdir(join(target, 'Contents/Resources'), { recursive: true })
    await writeFile(join(target, 'Contents/Resources/provenance.json'), JSON.stringify({ commit: 'a'.repeat(40) }))
    await run(); expect((await readUpdate(state))?.phase).toBe('failed'); expect(commands).toEqual([])
  })
  it('keeps the worker alive and skips stale installation when another push arrives during the build', async () => {
    let changed = false
    const nextCommand = async (argv: string[], cwd: string, env: NodeJS.ProcessEnv) => {
      await command(argv, cwd, env)
      if (!changed && argv[2] === 'package') {
        changed = true
        await writeFile(join(repo, 'app/source.txt'), 'newly published'); await git(repo, 'commit', '-am', 'Next release')
        request = { ...request, commit: await git(repo, 'rev-parse', 'HEAD') }
        await writeFile(join(state, 'request.json'), JSON.stringify(request))
      }
    }
    await runUpdates(state, { target, tools: __dirname, command: nextCommand })
    expect(commands.filter(c => c.startsWith('/bin/sh'))).toHaveLength(1)
    expect(builtSource).toBe('newly published'); expect((await readUpdate(state))?.commit).toBe(request.commit)
  })
})
