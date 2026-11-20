import { expect, test } from 'claude-code/testing'

import { live } from '../../../hooks/core/session/live'
import { checkProposal, creditsClaude, PROPOSAL_LIMITS } from '../../../hooks/features/commit_guard/domain/services/commit_proposal'
import { proposeCommitUseCase } from '../../../hooks/features/commit_guard/domain/usecases/propose_commit'
import { GUARD_TEXT, PROPOSAL_TEXT } from '../../../hooks/features/commit_guard/presentation/constants/commit_guard_text'
import { guardText, proposeCommit } from '../../../hooks/features/commit_guard/presentation/state_management/commit_guard_controller'
import { gitRepositoryImpl } from '../../../hooks/shared/git/data/repositories/git_repository_impl'
import { emptyRecord } from '../../../hooks/shared/records/data/datasources/record_source'
import { recordsRepositoryImpl } from '../../../hooks/shared/records/data/repositories/records_repository_impl'
import type { ProjectRecord, Task } from '../../../types'
import { CTX, fakePorts, makeTask, memoryHost } from '../../helpers'

const HEAD = '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b'
const AT = '2026-10-21T09:12:00+02:00'
const GIT = { 'git rev-parse HEAD': { stdout: `${HEAD}\n` }, 'git symbolic-ref --short -q HEAD': { stdout: 'task/x\n' } }
const stored = (mem: ReturnType<typeof memoryHost>) => JSON.parse(mem.files.get(CTX.file)!) as ProjectRecord
const ok = { message: 'fixed the retry button', files: ['src/retry.ts'] }

// ── What Claude may propose ──

test('a proposal keeps its files and its message, trimmed', () => {
  expect(checkProposal({ message: '  fixed the retry button\n\nWhy it broke.\n', files: ['src/retry.ts', 'tests/retry.test.ts'] })).toEqual({
    message: 'fixed the retry button\n\nWhy it broke.',
    files: ['src/retry.ts', 'tests/retry.test.ts'],
  })
})

test('a file named twice is proposed once, in the order first given', () => {
  expect(checkProposal({ message: 'x', files: ['b.ts', 'a.ts', 'b.ts', 'a.ts'] })).toEqual({ message: 'x', files: ['b.ts', 'a.ts'] })
})

test('no input, or a message that is missing, not text or blank, is a message problem', () => {
  for (const input of [null, undefined, 'fixed x', {}, { files: ['a.ts'] }, { message: 42, files: ['a.ts'] }, { message: '', files: ['a.ts'] }, { message: ' \n\t ', files: ['a.ts'] }]) {
    expect([input, checkProposal(input)]).toEqual([input, 'message'])
  }
})

test('a message of 2,000 characters is taken, one more is not', () => {
  expect(PROPOSAL_LIMITS.message).toBe(2_000)
  expect(checkProposal({ message: 'x'.repeat(2_000), files: ['a.ts'] })).toEqual({ message: 'x'.repeat(2_000), files: ['a.ts'] })
  expect(checkProposal({ message: 'x'.repeat(2_001), files: ['a.ts'] })).toBe('message')
})

test('the length is measured after trimming, so 2,000 characters with space around them are taken', () => {
  expect(checkProposal({ message: 'x'.repeat(2_000) + '\n', files: ['a.ts'] })).toEqual({ message: 'x'.repeat(2_000), files: ['a.ts'] })
  expect(checkProposal({ message: `  \n${'x'.repeat(2_000)}\n\n`, files: ['a.ts'] })).toEqual({ message: 'x'.repeat(2_000), files: ['a.ts'] })
  expect(checkProposal({ message: `  ${'x'.repeat(2_001)}\n`, files: ['a.ts'] })).toBe('message')
})

test('a message with a NUL in it is a message problem', () => {
  expect(checkProposal({ message: 'fixed\0x', files: ['a.ts'] })).toBe('message')
})

test('files that are not a list, an empty list or more than 500 are a files problem', () => {
  const many = (n: number) => Array.from({ length: n }, (_, i) => `src/f${i}.ts`)

  for (const files of [undefined, 'a.ts', { 0: 'a.ts' }, []]) {
    expect([files, checkProposal({ message: 'x', files })]).toEqual([files, 'files'])
  }
  expect(PROPOSAL_LIMITS.files).toBe(500)
  expect(checkProposal({ message: 'x', files: many(500) })).toEqual({ message: 'x', files: many(500) })
  expect(checkProposal({ message: 'x', files: many(501) })).toBe('files')
})

test('a path that is not a plain path from the top of the repository is a path problem', () => {
  const bad = [
    3,
    null,
    '',
    ' a.ts',
    'a.ts ',
    'a\0.ts',
    '/etc/passwd',
    '..',
    '../outside.ts',
    'src/../../outside.ts',
    'src/..',
    'x'.repeat(1_025),
  ]
  for (const path of bad) {
    expect([path, checkProposal({ message: 'x', files: ['ok.ts', path] })]).toEqual([path, 'path'])
  }
})

test('dots inside a name, dot folders and a path of 1,024 characters are fine', () => {
  const good = ['a..b.ts', '.github/workflows/ci.yml', 'docs/.hidden', 'x'.repeat(1_024), 'dir with spaces/ü.ts']

  expect(PROPOSAL_LIMITS.path).toBe(1_024)
  expect(checkProposal({ message: 'x', files: good })).toEqual({ message: 'x', files: good })
})

test('the message is checked before the files, and the count of files before each path', () => {
  expect(checkProposal({ message: '', files: [] })).toBe('message')
  expect(checkProposal({ message: 'x', files: Array.from({ length: 501 }, () => '/abs') })).toBe('files')
})

// ── Never crediting Claude ──

const CREDITING = [
  'fixed x\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>',
  'fixed x\n\nco-authored-by: claude <someone@example.com>',
  'fixed x\n\n  CO-AUTHORED-BY: The Anthropic bot <bot@example.com>',
  'fixed x\n\nCo-Authored-By: Rohan <r@example.com>\nCo-Authored-By: Claude <c@example.com>',
  'fixed x\n\nSigned-off-by: bot <noreply@anthropic.com>',
  'fixed x\n\nGenerated with Claude Code',
  'fixed x\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)',
  'fixed x\n\ngenerated by claude',
  'Generated with Claude Code',
  'fixed x\n\n- Generated with Claude Code',
  'fixed x\n\n  generated by Claude',
  'fixed x\n\nProposed by Claude.',
  'fixed x (written with Claude)',
  'fixed x\n\nDrafted by Claude',
  'fixed x\n\nauthored by claude',
  'fixed x\n\nCreated with Claude',
  'fixed x\n\nMade with Claude',
  'fixed x\n\nSuggested by Claude',
  'fixed x\n\nPrepared by Claude',
  'fixed x 🤖',
]

const NAMING = [
  'added Codex in place of Claude Code for the quest',
  "fixed the Claude Code session's time",
  'ask Claude to look at each file',
  'added Claude Code session probe',
  'fixed x\n\nCo-Authored-By: Rohan <r@example.com>',
  'added the anthropic logo to the helper bench',
  'fixed the task titles generated by Claude',
  'fixed x\n\nThe task titles generated with Claude now keep their accents.',
]

test('every way of crediting Claude is caught', () => {
  for (const message of CREDITING) {
    expect([message, creditsClaude(message)]).toEqual([message, true])
    expect([message, checkProposal({ message, files: ['a.ts'] })]).toEqual([message, 'credit'])
  }
})

test('a message that only names Claude Code as a feature is not a credit', () => {
  for (const message of NAMING) {
    expect([message, creditsClaude(message)]).toEqual([message, false])
    expect([message, checkProposal({ message, files: ['a.ts'] })]).toEqual([message, { message, files: ['a.ts'] }])
  }
})

test('a credit is named before any problem with the files', () => {
  expect(checkProposal({ message: 'fixed x\n\nGenerated with Claude Code', files: [] })).toBe('credit')
  expect(checkProposal({ message: 'fixed x\n\nGenerated with Claude Code', files: ['/abs'] })).toBe('credit')
})

// ── Saving the proposal ──

const useCaseWith = (tasks: Task[], over: Partial<ProjectRecord> = {}, git: Record<string, { stdout?: string; exitCode?: number }> = GIT) => {
  const mem = memoryHost({ files: { [CTX.file]: JSON.stringify({ ...emptyRecord('p', '/p'), tasks, ...over }) }, git })

  return { mem, deps: { records: recordsRepositoryImpl(mem.host, CTX), git: gitRepositoryImpl(mem.host, CTX.cwd) } }
}

test('a proposal is saved on the current task with the commit it was made on and when', async () => {
  const current = makeTask({ state: 'current' })
  const other = makeTask({ state: 'queued' })
  const { mem, deps } = useCaseWith([current, other])

  const proposed = await proposeCommitUseCase(deps, current.id, ok, AT)

  const proposal = { message: ok.message, files: ok.files, head: HEAD, at: AT }
  expect(proposed.kind).toBe('saved')
  expect(proposed.kind === 'saved' && proposed.record.tasks.find(t => t.id === current.id)?.commitProposal).toEqual(proposal)
  expect(stored(mem).tasks.find(t => t.id === current.id)?.commitProposal).toEqual(proposal)
  expect(stored(mem).tasks.find(t => t.id === other.id)?.commitProposal).toBeUndefined()
})

test('a new proposal replaces the last one', async () => {
  const current = makeTask({ state: 'current', commitProposal: { message: 'old', files: ['old.ts'], head: 'f'.repeat(40), at: '2026-10-20T09:00:00+02:00' } })
  const { mem, deps } = useCaseWith([current])

  await proposeCommitUseCase(deps, current.id, ok, AT)

  expect(stored(mem).tasks[0]?.commitProposal).toEqual({ message: ok.message, files: ok.files, head: HEAD, at: AT })
})

test('in a Manual realm nothing is saved', async () => {
  const current = makeTask({ state: 'current' })
  const { mem, deps } = useCaseWith([current], { gitMode: 'manual' })
  const before = stored(mem)

  expect(await proposeCommitUseCase(deps, current.id, ok, AT)).toEqual({ kind: 'manual' })
  expect(stored(mem)).toEqual(before)
})

test('a task that is no longer current gets no proposal', async () => {
  const finished = makeTask({ state: 'done' })
  const { mem, deps } = useCaseWith([finished])
  const before = stored(mem)

  expect(await proposeCommitUseCase(deps, finished.id, ok, AT)).toEqual({ kind: 'notCurrent' })
  expect(await proposeCommitUseCase(deps, 't-gone', ok, AT)).toEqual({ kind: 'notCurrent' })
  expect(stored(mem)).toEqual(before)
})

test('with no commit to read, nothing is saved', async () => {
  const current = makeTask({ state: 'current' })
  const { mem, deps } = useCaseWith([current], {}, {})
  const before = mem.files.get(CTX.file)

  expect(await proposeCommitUseCase(deps, current.id, ok, AT)).toEqual({ kind: 'noHead' })
  expect(mem.files.get(CTX.file)).toBe(before)
})

test('an unreadable record is left as it is', async () => {
  const mem = memoryHost({ files: { [CTX.file]: '{bad' }, git: GIT })
  const deps = { records: recordsRepositoryImpl(mem.host, CTX), git: gitRepositoryImpl(mem.host, CTX.cwd) }

  expect(await proposeCommitUseCase(deps, 't-1', ok, AT)).toEqual({ kind: 'unreadable' })
  expect(mem.files.get(CTX.file)).toBe('{bad')
})

// ── The propose_commit tool ──

const toolWith = (tasks: Task[], over: Partial<ProjectRecord> = {}) => {
  live.ctx = CTX
  const record: ProjectRecord = { ...emptyRecord('p', '/p'), tasks, ...over }
  const mem = memoryHost({ files: { [CTX.file]: JSON.stringify(record) }, git: GIT })

  return { mem, ...fakePorts(mem, { view: { record } }) }
}

test('with no current task the tool says there is nothing to propose for', async () => {
  const { mem, ports } = toolWith([makeTask({ state: 'queued' })])
  const before = mem.files.get(CTX.file)

  expect(await proposeCommit(ports, ok)).toBe(PROPOSAL_TEXT.noTask)
  expect(mem.files.get(CTX.file)).toBe(before)
})

test('a task current in another checkout is not this session’s to propose for', async () => {
  const { ports } = toolWith([makeTask({ state: 'current', worktreePath: '/elsewhere' })])

  expect(await proposeCommit(ports, ok)).toBe(PROPOSAL_TEXT.noTask)
})

test('with no session context or no record the tool has nothing to propose for', async () => {
  const { ports, view } = toolWith([makeTask({ state: 'current' })])
  view.record = null
  expect(await proposeCommit(ports, ok)).toBe(PROPOSAL_TEXT.noTask)

  const second = toolWith([makeTask({ state: 'current' })])
  live.ctx = null
  expect(await proposeCommit(second.ports, ok)).toBe(PROPOSAL_TEXT.noTask)
  expect(second.mem.writes).toEqual([])
  live.ctx = CTX
})

test('a bad proposal gets the words for what is wrong, and nothing is saved', async () => {
  const cases: [unknown, string][] = [
    [{ files: ['a.ts'] }, PROPOSAL_TEXT.problems.message],
    [{ message: 'x', files: [] }, PROPOSAL_TEXT.problems.files],
    [{ message: 'x', files: ['/etc/passwd'] }, PROPOSAL_TEXT.problems.path],
    [{ message: 'fixed x\n\nCo-Authored-By: Claude <noreply@anthropic.com>', files: ['a.ts'] }, PROPOSAL_TEXT.problems.credit],
  ]
  for (const [input, answer] of cases) {
    const { mem, ports, view } = toolWith([makeTask({ state: 'current' })])
    const before = mem.files.get(CTX.file)

    expect([input, await proposeCommit(ports, input)]).toEqual([input, answer])
    expect(mem.files.get(CTX.file)).toBe(before)
    expect(view.record?.tasks[0]?.commitProposal).toBeUndefined()
  }
})

test('a saved proposal says how many files it holds, and the view follows the record', async () => {
  const current = makeTask({ state: 'current' })
  const { mem, ports, view } = toolWith([current])

  expect(await proposeCommit(ports, { message: ' fixed x ', files: ['a.ts', 'b.ts', 'a.ts'] })).toBe(PROPOSAL_TEXT.saved(2))

  const proposal = { message: 'fixed x', files: ['a.ts', 'b.ts'], head: HEAD, at: AT }
  expect(stored(mem).tasks[0]?.commitProposal).toEqual(proposal)
  expect(view.record?.tasks[0]?.commitProposal).toEqual(proposal)
})

test('the saved answer counts one file as one file', async () => {
  const { ports } = toolWith([makeTask({ state: 'current' })])

  const answer = await proposeCommit(ports, ok)

  expect(answer).toBe(PROPOSAL_TEXT.saved(1))
  expect(answer).toContain('commit of 1 file,')
})

test('the tool refuses in a Manual realm and saves nothing', async () => {
  const { mem, ports } = toolWith([makeTask({ state: 'current' })], { gitMode: 'manual' })
  const before = stored(mem)

  expect(await proposeCommit(ports, ok)).toBe(PROPOSAL_TEXT.manual)
  expect(stored(mem)).toEqual(before)
})

test('the mode is read from the record on disk: switched to Manual in the app, the tool refuses', async () => {
  const current = makeTask({ state: 'current' })
  const { mem, ports } = toolWith([current])
  // The app wrote Manual after this session last read the record.
  mem.files.set(CTX.file, JSON.stringify({ ...emptyRecord('p', '/p'), tasks: [current], gitMode: 'manual' }))

  expect(await proposeCommit(ports, ok)).toBe(PROPOSAL_TEXT.manual)
  expect(stored(mem).tasks[0]?.commitProposal).toBeUndefined()
})

test('a task finished in the app meanwhile gets no proposal', async () => {
  const current = makeTask({ state: 'current' })
  const { mem, ports } = toolWith([current])
  mem.files.set(CTX.file, JSON.stringify({ ...emptyRecord('p', '/p'), tasks: [{ ...current, state: 'done' }] }))

  expect(await proposeCommit(ports, ok)).toBe(PROPOSAL_TEXT.notCurrent)
  expect(stored(mem).tasks[0]?.commitProposal).toBeUndefined()
})

test('with no commit to read the tool says so', async () => {
  const { mem, ports } = toolWith([makeTask({ state: 'current' })])
  delete mem.git['git rev-parse HEAD']

  expect(await proposeCommit(ports, ok)).toBe(PROPOSAL_TEXT.noHead)
})

test('an unreadable record on disk is named, and left alone', async () => {
  const { mem, ports } = toolWith([makeTask({ state: 'current' })])
  mem.files.set(CTX.file, '{bad')

  expect(await proposeCommit(ports, ok)).toBe(PROPOSAL_TEXT.unreadable)
  expect(mem.files.get(CTX.file)).toBe('{bad')
})

test('when git or the disk throws, the tool answers that saving failed and never throws', async () => {
  const { ports, mem } = toolWith([makeTask({ state: 'current' })])
  mem.host.run = async () => {
    throw new Error('spawn git ENOENT')
  }

  expect(await proposeCommit(ports, ok)).toBe(PROPOSAL_TEXT.failed)
})

// ── The guard's words ──

test('with no record the guard uses the plain refusal', () => {
  expect(guardText(null)).toBe(GUARD_TEXT.manual)
})

test('a record made before Git modes gets the Assisted refusal, which names propose_commit', () => {
  expect(guardText(emptyRecord('p', '/p'))).toBe(GUARD_TEXT.assisted)
  expect(GUARD_TEXT.assisted).toContain('propose_commit')
})

test('a Manual realm gets the plain refusal, an Assisted one the propose_commit one', () => {
  expect(guardText({ ...emptyRecord('p', '/p'), gitMode: 'manual' })).toBe(GUARD_TEXT.manual)
  expect(guardText({ ...emptyRecord('p', '/p'), gitMode: 'assisted' })).toBe(GUARD_TEXT.assisted)
  expect(GUARD_TEXT.manual).not.toContain('propose_commit')
})
