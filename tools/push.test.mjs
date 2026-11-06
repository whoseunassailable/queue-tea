import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, test } from 'node:test'

const fixtures = []
afterEach(() => { for (const path of fixtures.splice(0)) rmSync(path, { recursive: true, force: true }) })
const fixture = () => {
  const folder = realpathSync(mkdtempSync(join(tmpdir(), 'queue-tea-push-'))); fixtures.push(folder)
  const repo = join(folder, 'repo'); const remote = join(folder, 'remote.git')
  mkdirSync(join(repo, 'tools'), { recursive: true }); mkdirSync(join(repo, 'app/tools'), { recursive: true }); mkdirSync(remote)
  const env = { ...process.env, GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null' }
  const git = (...args) => execFileSync('git', args, { cwd: repo, encoding: 'utf8', env }).trim()
  git('init', '-b', 'main'); git('config', 'user.name', 'Test'); git('config', 'user.email', 'test@example.invalid'); git('config', 'core.hooksPath', '/dev/null'); git('config', 'commit.gpgsign', 'false')
  copyFileSync(join(dirname(fileURLToPath(import.meta.url)), 'push.mjs'), join(repo, 'tools/push.mjs'))
  // Exercise the real push boundary with only the updater replaced. Even a bug
  // in this test cannot invoke a build or touch the real Applications folder.
  writeFileSync(join(repo, 'app/tools/update_runner.mjs'), `import { writeFileSync } from 'node:fs'; export const queuePublished = async request => writeFileSync('ack.json', JSON.stringify(request));`)
  git('add', '.'); git('commit', '-m', 'Initial source')
  execFileSync('git', ['init', '--bare', remote], { env })
  git('remote', 'add', 'origin', remote)
  return { repo, remote, git, push: (...args) => spawnSync(process.execPath, ['tools/push.mjs', ...args], { cwd: repo, env, encoding: 'utf8' }) }
}
test('a successful terminal push acknowledges the exact requested branch object', () => {
  const r = fixture(); const commit = r.git('rev-parse', 'HEAD')
  r.git('switch', '-c', 'task/preview')
  const result = r.push(); assert.equal(result.status, 0, result.stderr)
  assert.deepEqual(JSON.parse(readFileSync(join(r.repo, 'ack.json'), 'utf8')), { repo: r.repo, remote: 'origin', branch: 'main', commit })
  assert.equal(r.git('branch', '--show-current'), 'task/preview')
})
test('a rejected terminal push never acknowledges an update', () => {
  const r = fixture(); writeFileSync(join(r.remote, 'hooks/pre-receive'), '#!/bin/sh\nexit 1\n', { mode: 0o755 })
  const result = r.push(); assert.notEqual(result.status, 0)
  assert.throws(() => readFileSync(join(r.repo, 'ack.json')))
})
