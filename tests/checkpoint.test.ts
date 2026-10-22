import { expect, test } from 'claude-code/testing'

import {
  checkLines,
  checkpointPrompt,
  commandRun,
  emptyCheckpoint,
  firstMessage,
  latestNote,
  noteSeen,
  parseCheckpoint,
} from '../hooks/checkpoint'
import { parseStatusPaths, readDrift } from '../hooks/git'
import { makeTask, memoryHost } from './helpers'

const AT = '2026-10-21T10:00:00+02:00'
const REPLY = JSON.stringify({
  goal: 'A retry button on the scan page',
  acceptance: ['The button shows when Bluetooth is off', 'Tests pass'],
  changes: ['Added the button in scan_page.dart'],
  decisions: ['Retry reuses the scan, no new state'],
  rejected: ['A timer that retries by itself: hides the problem'],
  remaining: ['Write the widget test'],
  blockers: [],
  nextAction: 'Write test/scan_page_test.dart for the off case',
})

test('a checkpoint reply is read field by field; prose is not a checkpoint', () => {
  const parsed = parseCheckpoint(`Here it is:\n${REPLY}`, AT)

  expect(parsed?.goal).toBe('A retry button on the scan page')
  expect(parsed?.acceptance).toEqual(['The button shows when Bluetooth is off', 'Tests pass'])
  expect(parsed?.rejected).toEqual(['A timer that retries by itself: hides the problem'])
  expect(parsed?.blockers).toEqual([])
  expect(parsed?.written).toBe(AT)
  expect(parseCheckpoint('Button done; colour left.', AT)).toBeNull()
  expect(parseCheckpoint('{"goal":"","nextAction":""}', AT)).toBeNull()
})

test('the prompt gives what git says and only the commands Queue-tea saw', () => {
  const run = commandRun('claude plugin test .', true, ' 143 pass\n 0 fail\n', AT)
  const task = noteSeen(makeTask({ title: 'Retry' }), { at: AT, files: ['a.ts'], commands: [run], git: null })
  const prompt = checkpointPrompt(task, { branch: 'task/retry', head: '1a2b3c4 Add bars', uncommitted: ['a.ts'] })

  expect(prompt).toContain('From git now: branch task/retry; last commit 1a2b3c4 Add bars; 1 not committed: a.ts.')
  expect(prompt).toContain('- passed: claude plugin test . (0 fail)')
  expect(prompt).toContain('Say a check passed only when it is listed as passed below.')
  expect(checkpointPrompt(makeTask(), null)).toContain('Queue-tea saw no shell commands run during this task.')
})

test('commands are kept with their result, tests marked, the last 15 only', () => {
  expect(commandRun('npm test', false, 'FAIL x\n2 failed', AT)).toEqual({
    command: 'npm test',
    isOk: false,
    isTest: true,
    at: AT,
    summary: '2 failed',
  })
  expect(commandRun('ls -la', true, '', AT).isTest).toBe(false)

  let task = makeTask()
  for (let i = 0; i < 20; i += 1) {
    task = noteSeen(task, { at: AT, files: ['a.ts'], commands: [commandRun(`echo ${i}`, true, '', AT)], git: null })
  }
  expect(task.checkpoint!.seen!.commands.length).toBe(15)
  expect(task.checkpoint!.seen!.commands[0]!.command).toBe('echo 5')
  expect(task.checkpoint!.seen!.files).toEqual(['a.ts'])
})

test('the check lines compare the repository now with what was saved', () => {
  const saved = { branch: 'task/retry', head: '1a2b3c4 Add bars', uncommitted: ['a.ts'] }
  const task = makeTask({
    branch: 'task/retry',
    checkpoint: { ...emptyCheckpoint(), seen: { at: AT, files: [], commands: [], git: saved } },
  })

  expect(checkLines(task, saved, [])).toEqual([
    "✓ On task/retry, the task's branch.",
    '✓ Last commit 1a2b3c4 Add bars, as saved.',
    '1 file not committed: a.ts.',
  ])
  expect(checkLines(task, { branch: 'main', head: '9f9f9f9 Other', uncommitted: [] }, ['main has 2 commits that task/retry doesn\'t.'])).toEqual([
    '✗ On main; the task is on task/retry.',
    '! Last commit is now 9f9f9f9 Other; the checkpoint saved 1a2b3c4 Add bars.',
    '0 files not committed (the checkpoint saved 1).',
    "! main has 2 commits that task/retry doesn't.",
  ])
  expect(checkLines(task, null, [])).toEqual(['Not a git repository, so there is no branch to check.'])
})

test('the first message brings the checkpoint, what was seen, what was checked, and the order to compare', () => {
  const parsed = parseCheckpoint(REPLY, AT)!
  const run = commandRun('flutter test', false, 'Some tests failed.', AT)
  const task = makeTask({
    title: 'Retry',
    messages: ['add a retry button'],
    checkpoint: { ...parsed, seen: { at: AT, files: ['lib/scan_page.dart'], commands: [run], git: null } },
  })
  const text = firstMessage(task, ['✓ On task/retry, the task\'s branch.'])

  expect(text).toStartWith('Task: Retry\n\nadd a retry button\n\nCheckpoint from an earlier conversation (2026-10-21T10:00:00+02:00).')
  expect(text).toContain('Goal: A retry button on the scan page')
  expect(text).toContain('Acceptance criteria:\n- The button shows when Bluetooth is off\n- Tests pass')
  expect(text).toContain('Approaches rejected:\n- A timer that retries by itself: hides the problem')
  expect(text).toContain('Next action: Write test/scan_page_test.dart for the off case')
  expect(text).toContain('Files Claude changed: lib/scan_page.dart')
  expect(text).toContain('- failed: flutter test (Some tests failed.)')
  expect(text).toContain("Checked by Queue-tea just now:\n- ✓ On task/retry, the task's branch.")
  expect(text).toEndWith('Then do the next action.')
  expect(text).not.toContain('Blockers')
  expect(firstMessage(makeTask({ title: 'New', messages: ['do it'] }))).toBe('Task: New\n\ndo it')
})

test('a plain note written after the checkpoint is the one the first message carries', () => {
  const checkpoint = { ...parseCheckpoint(REPLY, AT)!, seen: null }
  const newer = makeTask({ checkpoint, handoff: { text: 'Plain note.', written: '2026-10-21T11:00:00+02:00' } })
  const older = makeTask({ checkpoint, handoff: { text: 'Old note.', written: '2026-10-21T09:00:00+02:00' } })

  expect(latestNote(newer)).toBe('handoff')
  expect(firstMessage(newer)).toContain('Handoff note (2026-10-21T11:00:00+02:00):\nPlain note.')
  expect(firstMessage(newer)).not.toContain('Goal:')
  expect(latestNote(older)).toBe('checkpoint')
  expect(firstMessage(older)).toContain('Goal: A retry button on the scan page')
  expect(latestNote(makeTask())).toBeNull()
})

test('status paths: changed, renamed and untracked files', () => {
  const status = [
    '# branch.head main',
    '1 .M N... 100644 100644 100644 a b src/x.ts',
    '2 R. N... 100644 100644 100644 a b R100 src/new name.ts\tsrc/old.ts',
    '? notes.md',
    '',
  ].join('\n')

  expect(parseStatusPaths(status)).toEqual(['src/x.ts', 'src/new name.ts', 'notes.md'])
})

test('drift: a gone branch, a lost start commit, a base branch ahead', async () => {
  const task = { branch: 'task/x', baseBranch: 'main', startCommit: '1a2b3c4d5e6f' }
  const branches = { 'git branch --format=%(refname:short)': { stdout: 'main\ntask/x\n' } }

  expect(await readDrift(memoryHost({ git: { 'git branch --format=%(refname:short)': { stdout: 'main\n' } } }).host, '/p', task)).toEqual([
    'The branch task/x is gone.',
  ])
  expect(
    await readDrift(
      memoryHost({
        git: {
          ...branches,
          'git merge-base --is-ancestor 1a2b3c4d5e6f task/x': { exitCode: 1 },
          'git rev-list --count 1a2b3c4d5e6f..main': { stdout: '3\n' },
        },
      }).host,
      '/p',
      task,
    ),
  ).toEqual(['task/x no longer holds the commit it started from (1a2b3c4): a rebase or a reset?', "main has 3 commits that task/x doesn't."])
  expect(
    await readDrift(
      memoryHost({
        git: {
          ...branches,
          'git merge-base --is-ancestor 1a2b3c4d5e6f task/x': {},
          'git rev-list --count 1a2b3c4d5e6f..main': { stdout: '0\n' },
        },
      }).host,
      '/p',
      task,
    ),
  ).toEqual([])
  expect(await readDrift(memoryHost().host, '/p', { ...task, branch: null })).toEqual([])
})
