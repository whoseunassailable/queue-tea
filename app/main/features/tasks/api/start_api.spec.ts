import { execFile } from 'node:child_process'
import { mkdir, mkdtemp, readFile, realpath, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import type { ProjectRecord } from '../../../../../types'
import { emptyRecord, parseRecord } from '../../../../../hooks/shared/records/data/datasources/record_source'
import type { Host } from '../../../../../hooks/core/host/host'
import type { GitHold, Reply, StartCheck, StartOutcome, TerminalChoice } from '../../../../shared/engine_api'
import { createLogger } from '../../../core/logger'
import { nodeHost } from '../../../core/node_host'
import { makeTask } from './fixtures'
import type { TasksDeps } from './scope'
import { checkStart, copyText, openClaude, startQuest } from './start_api'

const KEY = 'demo-abc123'
const NOW = Date.parse('2026-10-27T17:50:00Z')
const run = promisify(execFile)

let home: string
let repo: string
let file: string
let deps: TasksDeps
let terminalRuns: string[][]
let allRuns: string[][]
let copied: string[]
let terminalExit: number

const git = async (...args: string[]) => (await run('git', args, { cwd: repo })).stdout.trim()
const seed = (over: Partial<ProjectRecord>) => writeFile(file, JSON.stringify({ ...emptyRecord('demo', repo), ...over }))
const onDisk = async () => {
  const read = parseRecord(await readFile(file, 'utf8'))
  if (read === 'unreadable') throw new Error('should read')

  return read
}
const data = <T>(answer: Reply<T>): T => {
  if (!answer.ok) throw new Error(`should succeed: ${answer.error.message}`)

  return answer.data
}
const refused = <T>(answer: Reply<T>): string => {
  if (answer.ok) throw new Error('should be refused')

  return answer.error.message
}
const held = (check: StartCheck | StartOutcome): GitHold => {
  if (check.kind !== 'held') throw new Error(`should be held: ${check.kind}`)

  return check.hold
}
const started = (outcome: StartOutcome) => {
  if (outcome.kind !== 'started') throw new Error(`should start: ${JSON.stringify(outcome)}`)

  return outcome
}
const session = async (over: { heartbeat?: number } = {}) => {
  await mkdir(join(home, '.queue-tea/sessions'), { recursive: true })
  await writeFile(join(home, '.queue-tea/sessions/s-1.json'), JSON.stringify({ id: 's-1', projectPath: repo, recordFile: file, currentTaskId: null, isTurnRunning: false, cup: { mood: 'idle', line: '' }, allowance: null, options: {}, heartbeat: NOW, startedAt: NOW, ...over }))
}

// A record kept beside a real repository that matches its remote, so nothing
// holds a Start until a test makes it.
beforeEach(async () => {
  home = await realpath(await mkdtemp(join(tmpdir(), 'queue-tea-start-')))
  repo = join(home, 'repo')
  file = join(home, '.queue-tea/projects', `${KEY}.json`)
  await mkdir(join(home, '.queue-tea/projects'), { recursive: true })
  await mkdir(repo)
  await run('git', ['init', '--bare', '-b', 'main', join(home, 'remote.git')])
  await git('init', '-b', 'main')
  await git('config', 'user.email', 'test@example.com')
  await git('config', 'user.name', 'Test')
  await writeFile(join(repo, 'a.txt'), 'a\n')
  await git('add', '.')
  await git('commit', '-m', 'first')
  await git('remote', 'add', 'origin', join(home, 'remote.git'))
  await git('push', '-u', 'origin', 'main')

  terminalRuns = []
  allRuns = []
  copied = []
  terminalExit = 0
  const log = createLogger('dev', () => {})
  const real = nodeHost(log, async () => ({ exitCode: 0, stdout: '', stderr: '' }))
  const host: Host = {
    ...real,
    run: async (argv, cwd) => {
      allRuns.push(argv)
      if (argv[0] !== 'git') {
        terminalRuns.push(argv)

        return { exitCode: terminalExit, stdout: '', stderr: terminalExit === 0 ? '' : 'no such app' }
      }

      return real.run(argv, cwd)
    },
  }
  let ids = 0
  deps = {
    host,
    home,
    now: () => NOW,
    log,
    offsetMinutes: () => 60,
    newId: () => `q-${(ids += 1)}`,
    terminal: async (): Promise<TerminalChoice> => 'terminal',
    copy: text => void copied.push(text),
  }
})

afterEach(() => rm(home, { recursive: true, force: true }))

describe('the check before Start', () => {
  it('holds on files not committed, in the engine\'s own words, and changes nothing', async () => {
    await seed({ tasks: [makeTask({ id: 'one', title: 'Fix the docs' })] })
    await writeFile(join(repo, 'b.txt'), 'b\n')
    await writeFile(join(repo, 'a.txt'), 'changed\n')
    const before = await readFile(file, 'utf8')

    const hold = held(data(await checkStart(deps, KEY, 'one')))

    expect(hold).toMatchObject({ kind: 'uncommitted', reason: '2 files not committed', branch: 'main', fileCount: 2, command: 'git status' })
    expect(hold.files.sort()).toEqual(['a.txt', 'b.txt'])
    expect(await readFile(file, 'utf8')).toBe(before)
    expect(await git('branch', '--format=%(refname:short)')).toBe('main')
  })

  it('counts every file, though it lists at most 20', async () => {
    await seed({ tasks: [makeTask({ id: 'one' })] })
    for (let i = 0; i < 25; i += 1) await writeFile(join(repo, `f${i}.txt`), 'x\n')

    const hold = held(data(await checkStart(deps, KEY, 'one')))

    expect(hold.files).toHaveLength(20)
    expect(hold.fileCount).toBe(25)
  })

  it('holds on commits not pushed', async () => {
    await seed({ tasks: [makeTask({ id: 'one' })] })
    await writeFile(join(repo, 'a.txt'), 'two\n')
    await git('commit', '-am', 'second')

    expect(held(data(await checkStart(deps, KEY, 'one')))).toMatchObject({ kind: 'unpushed', reason: '1 commit not pushed', command: 'git push', files: [] })
  })

  it('holds on a branch never pushed, with the command for that branch', async () => {
    await seed({ tasks: [makeTask({ id: 'one' })] })
    await git('switch', '-c', 'side')
    await writeFile(join(repo, 'a.txt'), 'two\n')
    await git('commit', '-am', 'second')

    expect(held(data(await checkStart(deps, KEY, 'one')))).toMatchObject({ kind: 'neverPushed', reason: 'This branch has never been pushed', command: 'git push -u origin side' })
  })

  it('holds on a detached HEAD', async () => {
    await seed({ tasks: [makeTask({ id: 'one' })] })
    await git('switch', '--detach')

    expect(held(data(await checkStart(deps, KEY, 'one')))).toMatchObject({ kind: 'detached', reason: 'Detached HEAD: check out a branch first', command: 'git switch <branch>' })
  })

  it('says the branch a first start will make, and where from', async () => {
    await seed({ tasks: [makeTask({ id: 'one', title: 'Fix the documentation' })] })

    expect(data(await checkStart(deps, KEY, 'one'))).toEqual({ kind: 'clear', step: { kind: 'make', branch: 'task/fix-documentation', from: 'main' } })
  })

  it('says a quest put back goes back to its own branch', async () => {
    await git('branch', 'task/mine')
    await seed({ tasks: [makeTask({ id: 'one', branch: 'task/mine', startCommit: 'abc' })] })

    expect(data(await checkStart(deps, KEY, 'one'))).toEqual({ kind: 'clear', step: { kind: 'switch', branch: 'task/mine' } })
  })

  it('says when there is no repository', async () => {
    const plain = join(home, 'plain')
    await mkdir(plain)
    await writeFile(file, JSON.stringify({ ...emptyRecord('demo', plain), tasks: [makeTask({ id: 'one' })] }))

    expect(data(await checkStart(deps, KEY, 'one'))).toEqual({ kind: 'clear', step: { kind: 'noRepo' } })
  })

  it('refuses a quest that has left the board', async () => {
    await seed({ tasks: [makeTask({ id: 'one', state: 'done' })] })

    expect(refused(await checkStart(deps, KEY, 'one'))).toContain('Pick it again')
  })

  it('refuses a sealed quest in the game\'s words', async () => {
    await seed({ tasks: [makeTask({ id: 'one', title: 'Stuck', blockedReason: 'waiting' })] })

    expect(refused(await checkStart(deps, KEY, 'one'))).toBe('Stuck is sealed: waiting. Unseal it first.')
  })

  it('names the quest that got there first', async () => {
    await seed({ tasks: [makeTask({ id: 'mine', state: 'current', title: 'The other one' }), makeTask({ id: 'one', title: 'This one' })] })

    expect(refused(await checkStart(deps, KEY, 'one'))).toBe('The other one was started first, maybe in another session, so This one waits on the board.')
  })

  it('refuses when the realm\'s folder has moved, rather than starting with no branch', async () => {
    const gone = join(home, 'moved-away')
    await writeFile(file, JSON.stringify({ ...emptyRecord('demo', gone), tasks: [makeTask({ id: 'one' })] }))

    expect(refused(await checkStart(deps, KEY, 'one'))).toContain(gone)
    expect(refused(await startQuest(deps, KEY, 'one'))).toContain(gone)
    expect((await onDisk()).tasks[0]!.state).toBe('queued')
  })
})

describe('Start', () => {
  it('makes the branch from where it stood, claims the quest and opens a terminal with nothing open', async () => {
    await seed({ tasks: [makeTask({ id: 'one', title: 'Fix the documentation' })] })

    const outcome = started(data(await startQuest(deps, KEY, 'one')))

    expect(await git('branch', '--show-current')).toBe('task/fix-documentation')
    const task = (await onDisk()).tasks[0]!
    expect(task).toMatchObject({ state: 'current', branch: 'task/fix-documentation', baseBranch: 'main', started: '2026-10-27T18:50:00+01:00' })
    expect(task.startCommit).toBe(await git('rev-parse', 'HEAD'))
    expect((await onDisk()).requests.map(q => ({ kind: q.kind, taskId: q.taskId }))).toEqual([{ kind: 'begin', taskId: 'one' }])
    expect(outcome).toMatchObject({ branch: 'task/fix-documentation', handover: { kind: 'opened', terminal: 'terminal' } })
    expect(terminalRuns).toHaveLength(1)
    expect(terminalRuns[0]!.join(' ')).toContain('claude')
    if (outcome.view.kind !== 'readable') throw new Error('should read')
    expect(outcome.view.active).toMatchObject({ id: 'one', asking: 'begin' })
  })

  it('with a session open adds the request and opens nothing', async () => {
    await session()
    await seed({ tasks: [makeTask({ id: 'one' })] })

    const outcome = started(data(await startQuest(deps, KEY, 'one')))

    expect(outcome.handover).toEqual({ kind: 'session' })
    expect(terminalRuns).toEqual([])
    expect((await onDisk()).requests).toHaveLength(1)
  })

  it('treats a session gone stale as no session', async () => {
    await session({ heartbeat: NOW - 91_000 })
    await seed({ tasks: [makeTask({ id: 'one' })] })

    expect(started(data(await startQuest(deps, KEY, 'one'))).handover.kind).toBe('opened')
  })

  it('returns a quest put back to its own branch and keeps its start commit', async () => {
    await git('branch', 'task/mine')
    await seed({ tasks: [makeTask({ id: 'one', branch: 'task/mine', startCommit: 'abc', baseBranch: 'main' })] })

    started(data(await startQuest(deps, KEY, 'one')))

    expect(await git('branch', '--show-current')).toBe('task/mine')
    expect((await onDisk()).tasks[0]).toMatchObject({ startCommit: 'abc', branch: 'task/mine' })
  })

  it('says so when the quest\'s branch was deleted', async () => {
    await seed({ tasks: [makeTask({ id: 'one', title: 'Fix it', branch: 'task/gone' })] })

    const outcome = started(data(await startQuest(deps, KEY, 'one')))

    expect(outcome.notice).toBe('task/gone was gone, so this quest starts again on task/fix, made from main.')
  })

  it('starts with no repository, and says no branches are made', async () => {
    const plain = join(home, 'plain')
    await mkdir(plain)
    await writeFile(file, JSON.stringify({ ...emptyRecord('demo', plain), tasks: [makeTask({ id: 'one' })] }))

    const outcome = started(data(await startQuest(deps, KEY, 'one')))

    expect(outcome.notice).toBe('Not a git repository, so no branches are made')
    expect(outcome.branch).toBeNull()
  })

  it('holds when git changed after the check, and writes nothing', async () => {
    await seed({ tasks: [makeTask({ id: 'one' })] })
    await writeFile(join(repo, 'b.txt'), 'b\n')

    expect(held(data(await startQuest(deps, KEY, 'one')))).toMatchObject({ kind: 'uncommitted', reason: '1 file not committed' })
    expect((await onDisk()).tasks[0]!.state).toBe('queued')
    expect((await onDisk()).requests).toEqual([])
    expect(await git('branch', '--show-current')).toBe('main')
  })

  it('takes the claim back when the branch can\'t be made, and offers Check again', async () => {
    await seed({ tasks: [makeTask({ id: 'one', title: 'Fix it' })] })
    const real = deps.host.run
    deps = { ...deps, host: { ...deps.host, run: (argv, cwd) => (argv.includes('switch') ? Promise.resolve({ exitCode: 1, stdout: '', stderr: 'locked' }) : real(argv, cwd)) } }

    const hold = held(data(await startQuest(deps, KEY, 'one')))

    expect(hold).toMatchObject({ kind: 'branch', reason: "Couldn't make the branch task/fix. Check again to retry.", command: null })
    expect((await onDisk()).tasks[0]).toMatchObject({ state: 'queued', branch: null, started: null })
    expect((await onDisk()).requests).toEqual([])
  })

  it('a terminal that won\'t open leaves the quest started, with the line to copy', async () => {
    terminalExit = 1
    await seed({ tasks: [makeTask({ id: 'one' })] })

    const outcome = started(data(await startQuest(deps, KEY, 'one')))

    expect(outcome.handover).toEqual({ kind: 'failed', terminal: 'terminal', command: `cd '${repo}' && claude` })
    expect((await onDisk()).tasks[0]!.state).toBe('current')
    expect((await onDisk()).requests).toHaveLength(1)
  })

  it('names the quest that got there first when two start at once', async () => {
    await seed({ tasks: [makeTask({ id: 'mine', state: 'current', title: 'The other one' }), makeTask({ id: 'one', title: 'This one' })] })

    expect(refused(await startQuest(deps, KEY, 'one'))).toBe('The other one was started first, maybe in another session, so This one waits on the board.')
  })

  it('never runs a commit, a push, a merge or a pull', async () => {
    await seed({ tasks: [makeTask({ id: 'one' })] })
    await startQuest(deps, KEY, 'one')

    const words = allRuns.filter(argv => argv[0] === 'git').map(argv => argv[1])
    expect(words).toContain('switch')
    for (const word of ['commit', 'push', 'merge', 'pull']) expect(words).not.toContain(word)
  })
})

describe('Open in Claude Code', () => {
  it('opens a terminal with no session', async () => {
    await seed({ tasks: [] })

    expect(data(await openClaude(deps, KEY))).toEqual({ kind: 'opened', terminal: 'terminal' })
    expect(terminalRuns[0]!.join(' ')).toContain('claude')
  })

  it('only brings the terminal forward with a session open', async () => {
    await session()
    await seed({ tasks: [] })

    await openClaude(deps, KEY)

    expect(terminalRuns[0]!.join(' ')).not.toContain('claude')
  })
})

describe('copying text', () => {
  it('puts the text on the clipboard', async () => {
    expect((await copyText(deps, 'git status')).ok).toBe(true)
    expect(copied).toEqual(['git status'])
  })

  it('refuses what isn\'t text', async () => {
    expect((await copyText(deps, 42)).ok).toBe(false)
    expect(copied).toEqual([])
  })
})
