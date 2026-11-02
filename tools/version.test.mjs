import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { chmodSync, copyFileSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

import { bumpOf, nextVersion, withVersion } from './version.mjs'

const TOOLS = dirname(fileURLToPath(import.meta.url))

test('a commit subject says how far the version moves', () => {
  assert.equal(bumpOf('fixed the empty board'), 'patch')
  assert.equal(bumpOf('Fix the empty board'), 'patch')
  assert.equal(bumpOf('added the library'), 'minor')
  assert.equal(bumpOf('Add the library'), 'minor')
  assert.equal(bumpOf('large: added the workspace app'), 'major')
  assert.equal(bumpOf('LARGE: added the workspace app'), 'major')
})

test('a subject that names no feature is the smallest step', () => {
  assert.equal(bumpOf('moved the tasks feature out of the flow file'), 'patch')
  assert.equal(bumpOf('address the review comments'), 'patch')
  assert.equal(bumpOf('addition to the docs'), 'patch')
})

test('the next version follows semantic versioning', () => {
  assert.equal(nextVersion('1.2.3', 'patch'), '1.2.4')
  assert.equal(nextVersion('1.2.3', 'minor'), '1.3.0')
  assert.equal(nextVersion('1.2.3', 'major'), '2.0.0')
  assert.equal(nextVersion('0.1.0', 'major'), '1.0.0')
})

test('a version that is not three numbers is refused', () => {
  assert.throws(() => nextVersion('1.2', 'patch'), /not a version/)
})

test('only the file’s own version changes, not a dependency’s', () => {
  const text = '{\n  "version": "0.1.0",\n  "dependencies": { "a": { "version": "0.1.0" } }\n}\n'

  assert.equal(withVersion(text, '1.0.0', 1), '{\n  "version": "1.0.0",\n  "dependencies": { "a": { "version": "0.1.0" } }\n}\n')
})

// A real repository in a temporary folder, with the real hook, so nothing here
// touches this one. The hook's app refresh stays off: it would replace the
// installed app.
const FILES = ['.claude-plugin/plugin.json', 'app/package.json', 'app/package-lock.json']

const repo = () => {
  const root = mkdtempSync(join(tmpdir(), 'version-'))
  const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', env: envFor() }).trim()
  git('init', '-q', '-b', 'main')
  git('config', 'user.name', 'Test')
  git('config', 'user.email', 'test@example.com')
  git('config', 'core.hooksPath', 'tools/hooks')
  mkdirSync(join(root, 'tools/hooks'), { recursive: true })
  mkdirSync(join(root, 'app'))
  mkdirSync(join(root, '.claude-plugin'))
  copyFileSync(join(TOOLS, 'version.mjs'), join(root, 'tools/version.mjs'))
  copyFileSync(join(TOOLS, 'hooks/post-commit'), join(root, 'tools/hooks/post-commit'))
  chmodSync(join(root, 'tools/hooks/post-commit'), 0o755)
  writeFileSync(join(root, '.claude-plugin/plugin.json'), '{\n  "name": "queue-tea",\n  "version": "0.1.0"\n}\n')
  writeFileSync(join(root, 'app/package.json'), '{\n  "name": "queue-tea-app",\n  "version": "0.1.0"\n}\n')
  writeFileSync(join(root, 'app/package-lock.json'), '{\n  "version": "0.1.0",\n  "packages": {\n    "": { "version": "0.1.0" },\n    "node_modules/a": { "version": "0.1.0" }\n  }\n}\n')
  writeFileSync(join(root, 'work.txt'), 'start\n')
  git('add', '-A')
  git('commit', '-q', '-m', 'created the project')

  return { root, git, read: path => readFileSync(join(root, path), 'utf8') }
}

const envFor = () => {
  const env = { ...process.env, QUEUE_TEA_NO_APP_REFRESH: '1' }
  for (const name of Object.keys(env)) if (name.startsWith('GIT_')) delete env[name]

  return env
}

const change = ({ root, git }, subject, file = 'work.txt') => {
  writeFileSync(join(root, file), `${subject}\n`)
  git('add', file)
  git('commit', '-q', '-m', subject)
}

const versionOf = r => JSON.parse(r.read('.claude-plugin/plugin.json')).version

test('a bug fix, a small feature and a large feature each move the version', () => {
  const r = repo()

  change(r, 'added the library')
  assert.equal(versionOf(r), '0.2.0')
  change(r, 'fixed the library')
  assert.equal(versionOf(r), '0.2.1')
  change(r, 'large: added the workspace app')
  assert.equal(versionOf(r), '1.0.0')
})

test('the new version goes in the same commit, in all three files, with a tag', () => {
  const r = repo()

  change(r, 'added the library')

  assert.equal(r.git('rev-list', '--count', 'HEAD'), '2')
  assert.equal(r.git('log', '-1', '--format=%s'), 'added the library')
  assert.deepEqual(r.git('show', '--format=', '--name-only', 'HEAD').split('\n').sort(), [...FILES, 'work.txt'].sort())
  assert.equal(r.git('status', '--porcelain'), '')
  assert.equal(r.git('rev-parse', 'v0.2.0'), r.git('rev-parse', 'HEAD'))
  for (const file of FILES) assert.match(r.read(file), /"version": "0\.2\.0"/)
})

test('the package lock moves its two own versions and leaves a dependency’s', () => {
  const r = repo()

  change(r, 'added the library')

  const lock = JSON.parse(r.read('app/package-lock.json'))
  assert.equal(lock.version, '0.2.0')
  assert.equal(lock.packages[''].version, '0.2.0')
  assert.equal(lock.packages['node_modules/a'].version, '0.1.0')
})

test('amending a commit doesn’t move the version a second time', () => {
  const r = repo()
  change(r, 'added the library')

  r.git('commit', '-q', '--amend', '-m', 'added the library, with a better subject')

  assert.equal(versionOf(r), '0.2.0')
  assert.equal(r.git('rev-parse', 'v0.2.0'), r.git('rev-parse', 'HEAD'))
})

test('a merge commit leaves the version as the branches had it', () => {
  const r = repo()
  r.git('switch', '-q', '-c', 'task/side')
  change(r, 'added the side work', 'side.txt')
  r.git('switch', '-q', 'main')
  change(r, 'fixed the main work')
  const before = versionOf(r)

  // Both sides moved the version, so the merge stops for a person to choose.
  const merged = spawnSync('git', ['merge', '-q', '--no-edit', 'task/side'], { cwd: r.root, encoding: 'utf8', env: envFor() })
  assert.notEqual(merged.status, 0)
  r.git('checkout', '--ours', '--', ...FILES)
  r.git('add', '-A')
  r.git('commit', '-q', '--no-edit')

  assert.equal(r.git('rev-list', '--parents', '-n', '1', 'HEAD').split(' ').length, 3)
  assert.equal(versionOf(r), before)
})

test('a version file with changes of its own is left alone, and says so', () => {
  const r = repo()
  writeFileSync(join(r.root, 'work.txt'), 'changed\n')
  writeFileSync(join(r.root, 'app/package.json'), '{\n  "name": "queue-tea-app",\n  "version": "0.1.0",\n  "private": true\n}\n')
  r.git('add', 'work.txt')

  const committed = spawnSync('git', ['commit', '-m', 'added a thing'], { cwd: r.root, encoding: 'utf8', env: envFor() })

  assert.equal(committed.status, 0)
  assert.match(committed.stderr, /left the version at 0\.1\.0/)
  assert.equal(versionOf(r), '0.1.0')
  assert.match(r.read('app/package.json'), /"private": true/)
})

test('work staged for the next commit stays out of this one', () => {
  const r = repo()
  writeFileSync(join(r.root, 'work.txt'), 'this commit\n')
  writeFileSync(join(r.root, 'next.txt'), 'next commit\n')
  r.git('add', 'next.txt')
  r.git('add', 'work.txt')

  r.git('commit', '-q', '-m', 'added this', '--', 'work.txt')

  assert.ok(!r.git('show', '--format=', '--name-only', 'HEAD').includes('next.txt'))
  assert.equal(r.git('status', '--porcelain'), 'A  next.txt')
})

test('it works from a second working folder of the same repository', () => {
  const r = repo()
  const other = `${r.root}-worktree`
  r.git('worktree', 'add', '-q', '-b', 'task/other', other)
  writeFileSync(join(other, 'other.txt'), 'other\n')
  const git = (...args) => execFileSync('git', args, { cwd: other, encoding: 'utf8', env: envFor() }).trim()
  git('add', 'other.txt')

  git('commit', '-q', '-m', 'added the other work')

  assert.equal(JSON.parse(readFileSync(join(other, 'app/package.json'), 'utf8')).version, '0.2.0')
  assert.equal(git('status', '--porcelain'), '')
})
