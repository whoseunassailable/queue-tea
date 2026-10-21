import { expect, test } from 'claude-code/testing'

import {
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

test('no upstream', () => {
  const g = parseStatus(status(OID, '# branch.head task/new'))

  expect(g.hasUpstream).toBe(false)
  expect(holdReason({ isRepo: true, ...g })).toBe('This branch has never been pushed')
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

test('slugBranch: plain title', () => {
  expect(slugBranch('Retry button on the scan page', [])).toBe('task/retry-button-on-the-scan-page')
})

test('slugBranch: slashes, pipes, backticks, emoji, 200 chars', () => {
  const name = slugBranch(`Fix a/b | \`c\` 🚀 ${'x'.repeat(200)}`, [])

  expect(name).toMatch(/^task\/[a-z0-9-]+$/)
  expect(name.length).toBeLessThanOrEqual(55)
  expect(name.endsWith('-')).toBe(false)
  expect(name.startsWith('task/fix-a-b-c-')).toBe(true)
})

test('slugBranch: nothing usable becomes task', () => {
  expect(slugBranch('🚀🚀', [])).toBe('task/task')
})

test('slugBranch: taken names get -2 then -3', () => {
  expect(slugBranch('Retry', ['task/retry'])).toBe('task/retry-2')
  expect(slugBranch('Retry', ['task/retry', 'task/retry-2'])).toBe('task/retry-3')
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
