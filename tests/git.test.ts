import { expect, test } from 'claude-code/testing'

import {
  branchSlug,
  diffSince,
  holdReason,
  listBranches,
  makeBranch,
  parseShortstat,
  parseStatus,
  readGit,
  slugBranch,
} from '../hooks/git'
import { memoryHost } from './helpers'

const OID = '# branch.oid 1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b'
const status = (...lines: string[]) => lines.join('\n') + '\n'
const repo = (statusText: string) =>
  memoryHost({
    git: {
      'git rev-parse --is-inside-work-tree': { stdout: 'true\n' },
      'git status --porcelain=v2 --branch': { stdout: statusText },
    },
  })

test('parseStatus: clean, pushed branch', async () => {
  const { host } = repo(status(OID, '# branch.head task/a', '# branch.upstream origin/task/a', '# branch.ab +0 -0'))
  const git = await readGit(host, '/r')

  expect(git).toEqual({
    isRepo: true,
    branch: 'task/a',
    isDetached: false,
    head: '1a2b3c4',
    uncommitted: 0,
    unpushed: 0,
    hasUpstream: true,
  })
  expect(holdReason(git)).toBeNull()
})

test('parseStatus: 3 changed, 2 ahead', () => {
  const g = parseStatus(
    status(
      OID,
      '# branch.head main',
      '# branch.upstream origin/main',
      '# branch.ab +2 -0',
      '1 .M N... 100644 100644 100644 aaa bbb lib/a.dart',
      '1 M. N... 100644 100644 100644 aaa bbb lib/b.dart',
      '? notes.txt',
    ),
  )

  expect(holdReason({ isRepo: true, ...g })).toBe('3 files not committed · 2 commits not pushed')
})

test('one file, one commit is singular', () => {
  const g = parseStatus(
    status(OID, '# branch.head main', '# branch.upstream origin/main', '# branch.ab +1 -0', '? a.txt'),
  )

  expect(holdReason({ isRepo: true, ...g })).toBe('1 file not committed · 1 commit not pushed')
})

test('only uncommitted files', () => {
  const g = parseStatus(
    status(OID, '# branch.head main', '# branch.upstream origin/main', '# branch.ab +0 -3', '? a.txt'),
  )

  expect(holdReason({ isRepo: true, ...g })).toBe('1 file not committed')
})

// Without an upstream, the commits no remote has; with no remote at all, that
// is every commit.
const noUpstream = (localOnly: string) =>
  memoryHost({
    git: {
      'git rev-parse --is-inside-work-tree': { stdout: 'true\n' },
      'git status --porcelain=v2 --branch': { stdout: status(OID, '# branch.head task/new') },
      'git rev-list --count HEAD --not --remotes': { stdout: localOnly },
    },
  })

test('no upstream, with commits no remote has', async () => {
  const git = await readGit(noUpstream('2\n').host, '/r')

  expect(git.hasUpstream).toBe(false)
  expect(git.unpushed).toBe(2)
  expect(holdReason(git)).toBe('This branch has never been pushed')
})

test('no upstream, but every commit is already on a remote', async () => {
  const git = await readGit(noUpstream('0\n').host, '/r')

  expect(git.hasUpstream).toBe(false)
  expect(git.unpushed).toBe(0)
  expect(holdReason(git)).toBeNull()
})

test('no upstream and files not committed', async () => {
  const { host } = memoryHost({
    git: {
      'git rev-parse --is-inside-work-tree': { stdout: 'true\n' },
      'git status --porcelain=v2 --branch': { stdout: status(OID, '# branch.head task/new', '? a.txt') },
      'git rev-list --count HEAD --not --remotes': { stdout: '3\n' },
    },
  })

  expect(holdReason(await readGit(host, '/r'))).toBe('1 file not committed')
})

test('detached', () => {
  const g = parseStatus(status(OID, '# branch.head (detached)'))

  expect(g.isDetached).toBe(true)
  expect(g.branch).toBeNull()
  expect(holdReason({ isRepo: true, ...g })).toBe('Detached HEAD: check out a branch first')
})

test('not a repo', async () => {
  const { host } = memoryHost({ git: { 'git rev-parse --is-inside-work-tree': { exitCode: 128 } } })
  const git = await readGit(host, '/x')

  expect(git.isRepo).toBe(false)
  expect(holdReason(git)).toBeNull()
})

test('slugBranch: plain title, filler words left out', () => {
  expect(slugBranch('Retry button on the scan page', [])).toBe('task/retry-button-scan-page')
  expect(slugBranch('Add dark mode', [])).toBe('task/add-dark-mode')
})

test('branchSlug: at most four words and 30 characters, in the title’s order', () => {
  expect(branchSlug('Feature parity audit of the menu against the engine')).toBe('feature-parity-audit-menu')
  expect(branchSlug('Short branch names and parent-child tasks')).toBe('short-branch-names-parent')
  // A word that would run past 30 characters is passed over for a later one.
  expect(branchSlug('Refactor authentication middleware for sessions')).toBe('refactor-authentication')
  expect(branchSlug('Internationalization localization support')).toBe('internationalization-support')
  for (const title of ['Feature parity audit of the menu against the engine', 'x'.repeat(200), 'a b c d e f g h']) {
    expect(branchSlug(title).length).toBeLessThanOrEqual(30)
  }
})

test('branchSlug: punctuation, slashes, pipes, backticks and emoji', () => {
  expect(branchSlug('Fix: the `parseStatus()` crash (again!) — urgent?')).toBe('fix-parsestatus-crash-urgent')
  expect(branchSlug("Don't reset the user’s draft")).toBe('dont-reset-users-draft')
  const name = slugBranch(`Fix a/b | \`c\` 🚀 ${'x'.repeat(200)}`, [])
  expect(name).toMatch(/^task\/[a-z0-9]+(?:-[a-z0-9]+)*$/)
  expect(name).toBe('task/fix')
})

test('branchSlug: links, hosts and port numbers are left out', () => {
  expect(branchSlug('Get the dev server running on localhost:3000 and tell me its URL')).toBe('dev-server-running-url')
  expect(branchSlug('Proxy https://api.example.com/v2/users?id=7 calls through 127.0.0.1:8080')).toBe('proxy-calls')
  expect(branchSlug('Move the app off port 5173 to www.example.org')).toBe('move-app-off')
  expect(branchSlug('Fix issue 42 in the parser')).toBe('fix-issue-42-parser')
})

test('branchSlug: one word too long is cut; nothing usable becomes task; filler alone is kept', () => {
  expect(branchSlug('x'.repeat(200))).toBe('x'.repeat(30))
  expect(branchSlug('🚀🚀')).toBe('task')
  expect(slugBranch('🚀🚀', [])).toBe('task/task')
  expect(branchSlug('Do it now')).toBe('do-it-now')
})

test('branchSlug: the same title always gives the same name', () => {
  const title = 'Feature parity audit of the menu against the engine'

  expect(branchSlug(title)).toBe(branchSlug(title))
  expect(slugBranch(title, ['main'])).toBe(slugBranch(title, ['main']))
})

test('slugBranch: taken names get -2 then -3, whatever order the branches are listed in', () => {
  expect(slugBranch('Retry', ['task/retry'])).toBe('task/retry-2')
  expect(slugBranch('Retry', ['task/retry', 'task/retry-2'])).toBe('task/retry-3')
  expect(slugBranch('Retry', ['task/retry-2', 'main', 'task/retry'])).toBe('task/retry-3')
  // Two titles that shorten to the same name.
  expect(slugBranch('Retry the button', ['task/retry-button'])).toBe('task/retry-button-2')
  expect(slugBranch('Retry button, please', ['task/retry-button', 'task/retry-button-2'])).toBe('task/retry-button-3')
})

test('parseShortstat', () => {
  expect(parseShortstat(' 4 files changed, 160 insertions(+), 38 deletions(-)\n')).toEqual({
    linesAdded: 160,
    linesRemoved: 38,
    filesTouched: 4,
  })
  expect(parseShortstat(' 1 file changed, 2 insertions(+)\n')).toEqual({
    linesAdded: 2,
    linesRemoved: 0,
    filesTouched: 1,
  })
  expect(parseShortstat(' 1 file changed, 5 deletions(-)\n')).toEqual({
    linesAdded: 0,
    linesRemoved: 5,
    filesTouched: 1,
  })
  expect(parseShortstat('')).toEqual({ linesAdded: 0, linesRemoved: 0, filesTouched: 0 })
})

test('branches: list, make, and diff go through git', async () => {
  const mem = memoryHost({
    git: {
      'git branch --format=%(refname:short)': { stdout: 'main\ntask/a\n' },
      'git switch -c task/b': {},
      'git diff --shortstat abc1234': { stdout: ' 2 files changed, 9 insertions(+), 1 deletion(-)\n' },
    },
  })

  expect(await listBranches(mem.host, '/r')).toEqual(['main', 'task/a'])
  await makeBranch(mem.host, '/r', 'task/b')
  expect(await diffSince(mem.host, '/r', 'abc1234')).toEqual({ linesAdded: 9, linesRemoved: 1, filesTouched: 2 })
})

test('makeBranch rejects when git fails', async () => {
  const { host } = memoryHost()

  await expect(makeBranch(host, '/r', 'task/b')).rejects.toThrow()
})
