import { execFile } from 'node:child_process'
import { copyFile, mkdir, mkdtemp, readFile, realpath, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { promisify } from 'node:util'
import { expect, it } from 'vitest'

const exec = promisify(execFile)
const integration = process.env.QUEUE_TEA_GIT_TESTS === '1' ? it : it.skip

// Exercise the actual Vite config in the same Git-free archive used by the
// updater. Everything, including the source commit, belongs to this temp test.
integration('builds the real application from an acknowledged archive with matching embedded and packaged provenance', async () => {
  const root = resolve(__dirname, '../..')
  const folder = await realpath(await mkdtemp(join(tmpdir(), 'queue-tea-build-context-')))
  const repo = join(folder, 'repo'); const snapshot = join(folder, 'snapshot')
  const env = { ...process.env, GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null' }
  const git = async (cwd: string, ...args: string[]) => (await exec('git', args, { cwd, env, maxBuffer: 8 * 1024 * 1024 })).stdout.trim()
  try {
    await mkdir(repo); await mkdir(snapshot)
    const paths = (await git(root, 'ls-files', '--cached', '--others', '--exclude-standard', '-z')).split('\0').filter(Boolean)
    for (const path of paths) { await mkdir(dirname(join(repo, path)), { recursive: true }); await copyFile(join(root, path), join(repo, path)) }
    await git(repo, 'init', '-b', 'main'); await git(repo, 'config', 'user.name', 'Test'); await git(repo, 'config', 'user.email', 'test@example.invalid'); await git(repo, 'config', 'core.hooksPath', '/dev/null'); await git(repo, 'config', 'commit.gpgsign', 'false')
    await git(repo, 'add', '.'); await git(repo, 'commit', '-m', 'Snapshot build test')
    const commit = await git(repo, 'rev-parse', 'HEAD')
    await git(repo, 'archive', '--format=tar', '-o', join(folder, 'source.tar'), commit)
    await exec('/usr/bin/tar', ['-xf', join(folder, 'source.tar'), '-C', snapshot])
    await symlink(await realpath(join(root, 'app/node_modules')), join(snapshot, 'app/node_modules'))
    const source = { version: 1, commit, branch: 'main', integration: 'main', dirty: false, builtAt: new Date().toISOString(), repository: join(repo, '.git'), published: { remote: 'local-test', commit } }
    const context = join(folder, 'context.json'); await writeFile(context, JSON.stringify(source))
    await exec('npm', ['run', 'build'], { cwd: join(snapshot, 'app'), env: { ...env, QUEUE_TEA_RELEASE_CONTEXT: context, QUEUE_TEA_RELEASE_REPOSITORY: repo, QUEUE_TEA_RELEASE_COMMIT: commit }, maxBuffer: 8 * 1024 * 1024 })
    expect(JSON.parse(await readFile(join(snapshot, 'app/out/provenance.json'), 'utf8'))).toEqual(source)
    expect(await readFile(join(snapshot, 'app/out/main/main.js'), 'utf8')).toContain(commit)
  } finally { await rm(folder, { recursive: true, force: true }) }
}, 30_000)
