import { execFile } from 'node:child_process'
import { mkdir, mkdtemp, readFile, realpath, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import type { ProjectRecord } from '../../../../../types'
import { emptyRecord, parseRecord } from '../../../../../hooks/shared/records/data/datasources/record_source'
import type { Reply } from '../../../../shared/engine_api'
import { createLogger } from '../../../core/logger'
import { nodeHost } from '../../../core/node_host'
import { makeTask } from './fixtures'
import { finishQuest, notYet, retryTaskLog } from './finish_api'
import type { TasksDeps } from './scope'

const KEY = 'demo-abc123'
const NOW = Date.parse('2026-10-27T17:50:00Z')
const run = promisify(execFile)

let home: string
let repo: string
let file: string
let deps: TasksDeps
const logged: string[] = []

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
const active = (over: Parameters<typeof makeTask>[0]) => makeTask({ state: 'current', started: '2026-10-27T16:00:00+01:00', ...over })

beforeEach(async () => {
  home = await realpath(await mkdtemp(join(tmpdir(), 'queue-tea-finish-')))
  repo = join(home, 'repo')
  file = join(home, '.queue-tea/projects', `${KEY}.json`)
  await mkdir(join(home, '.queue-tea/projects'), { recursive: true })
  await mkdir(repo)
  logged.length = 0
  const log = createLogger('dev', line => logged.push(line))
  deps = {
    host: nodeHost(log, async () => ({ exitCode: 0, stdout: '', stderr: '' })),
    home,
    now: () => NOW,
    log,
    offsetMinutes: () => 60,
    newId: () => 'q-1',
    terminal: async () => 'terminal',
    copy: () => {},
  }
})

afterEach(() => rm(home, { recursive: true, force: true }))

describe('Not yet', () => {
  it('clears the review and leaves the quest active', async () => {
    await seed({ tasks: [active({ id: 'one', review: { at: 'now', checked: 'tests pass' } })] })

    data(await notYet(deps, KEY, 'one'))

    expect((await onDisk()).tasks[0]).toMatchObject({ state: 'current', review: null })
  })
})

describe('Finish quest', () => {
  it('saves the win with the difficulty chosen, and adds the log row', async () => {
    await seed({ docsLogPath: 'docs/task_log.md', tasks: [active({ id: 'one', title: 'Fix it', priority: 'high', minutesByDay: { '2026-10-27': 14 }, review: { at: 'now', checked: null } })] })

    const outcome = data(await finishQuest(deps, KEY, 'one', 'hard', null))

    expect((await onDisk()).tasks[0]).toMatchObject({ state: 'done', finished: '2026-10-27T18:50:00+01:00', review: null, difficulty: { expected: 'medium', actual: 'hard' } })
    expect(await readFile(join(repo, 'docs/task_log.md'), 'utf8')).toContain('| Fix it | High | Medium → Hard | 14m |')
    expect(outcome).toMatchObject({ logPath: 'docs/task_log.md', logFailedAt: null, minutes: 14, victory: { xp: 50, title: 'Fix it' } })
  })

  it('measures the lines from git', async () => {
    await run('git', ['init', '-b', 'main'], { cwd: repo })
    await run('git', ['config', 'user.email', 'test@example.com'], { cwd: repo })
    await run('git', ['config', 'user.name', 'Test'], { cwd: repo })
    await writeFile(join(repo, 'a.txt'), 'a\n')
    await run('git', ['add', '.'], { cwd: repo })
    await run('git', ['commit', '-m', 'first'], { cwd: repo })
    const startCommit = (await run('git', ['rev-parse', 'HEAD'], { cwd: repo })).stdout.trim()
    await writeFile(join(repo, 'a.txt'), 'a\nb\nc\n')
    await seed({ docsLogPath: 'docs/task_log.md', tasks: [active({ id: 'one', startCommit })] })

    data(await finishQuest(deps, KEY, 'one', 'medium', null))

    expect((await onDisk()).tasks[0]!.effort).toMatchObject({ linesAdded: 2, linesRemoved: 0, filesTouched: 1 })
  })

  it('keeps the path given on the first finish, and logs there', async () => {
    await seed({ tasks: [active({ id: 'one', title: 'Fix it' })] })

    const outcome = data(await finishQuest(deps, KEY, 'one', 'medium', 'notes/log.md'))

    expect((await onDisk()).docsLogPath).toBe('notes/log.md')
    expect(await readFile(join(repo, 'notes/log.md'), 'utf8')).toContain('| Fix it |')
    expect(outcome.logPath).toBe('notes/log.md')
  })

  it('asks for the path before changing anything when there is none', async () => {
    await seed({ tasks: [active({ id: 'one' })] })

    expect(refused(await finishQuest(deps, KEY, 'one', 'medium', null))).toBe('Task log path is required.')
    expect((await onDisk()).tasks[0]!.state).toBe('current')
  })

  it.each([
    ['a blank path', '   ', 'Task log path is required.'],
    ['a folder', 'docs/', 'Enter a file path, such as docs/task_log.md.'],
    ['two lines', 'docs/a\nb.md', 'Enter a file path, such as docs/task_log.md.'],
  ])('refuses %s, and changes nothing', async (_, path, message) => {
    await seed({ tasks: [active({ id: 'one' })] })

    expect(refused(await finishQuest(deps, KEY, 'one', 'medium', path))).toBe(message)
    expect((await onDisk()).tasks[0]!.state).toBe('current')
    expect((await onDisk()).docsLogPath).toBeNull()
  })

  it('refuses a first log path into another project, and writes nothing there', async () => {
    await seed({ tasks: [active({ id: 'one' })] })
    const other = join(home, 'other-project')
    await mkdir(other)

    expect(refused(await finishQuest(deps, KEY, 'one', 'medium', '../other-project/task_log.md'))).toBe("The task log has to stay inside this realm's folder.")
    expect((await onDisk()).tasks[0]!.state).toBe('current')
    await expect(readFile(join(other, 'task_log.md'), 'utf8')).rejects.toThrow()
  })

  it('stays won, and writes nothing, when a record already holds a path outside', async () => {
    await seed({ docsLogPath: '../other-project/task_log.md', tasks: [active({ id: 'one' })] })
    const other = join(home, 'other-project')
    await mkdir(other)

    const outcome = data(await finishQuest(deps, KEY, 'one', 'medium', null))

    expect(outcome.logFailedAt).toBe('../other-project/task_log.md')
    expect((await onDisk()).tasks[0]!.state).toBe('done')
    await expect(readFile(join(other, 'task_log.md'), 'utf8')).rejects.toThrow()
  })

  it('refuses a difficulty that is not one', async () => {
    await seed({ docsLogPath: 'log.md', tasks: [active({ id: 'one' })] })

    expect((await finishQuest(deps, KEY, 'one', 'impossible', null)).ok).toBe(false)
    expect((await onDisk()).tasks[0]!.state).toBe('current')
  })

  it('refuses a quest that was put back while the sheet was open, and leaves it alone', async () => {
    await seed({ docsLogPath: 'log.md', tasks: [makeTask({ id: 'one', title: 'Fix it' })] })

    expect(refused(await finishQuest(deps, KEY, 'one', 'medium', null))).toBe('That quest is no longer the active one, so nothing was finished.')
    expect((await onDisk()).tasks[0]!.state).toBe('queued')
  })

  it('refuses a quest already won, and adds no second row', async () => {
    await seed({ docsLogPath: 'log.md', tasks: [active({ id: 'one', title: 'Fix it' })] })

    data(await finishQuest(deps, KEY, 'one', 'medium', null))
    expect((await finishQuest(deps, KEY, 'one', 'medium', null)).ok).toBe(false)

    expect((await readFile(join(repo, 'log.md'), 'utf8')).match(/\| Fix it \|/g)).toHaveLength(1)
  })

  it('stays won when the log can\'t be written, and says where', async () => {
    await mkdir(join(repo, 'taken'))
    await seed({ docsLogPath: 'taken', tasks: [active({ id: 'one' })] })

    const outcome = data(await finishQuest(deps, KEY, 'one', 'medium', null))

    expect(outcome.logFailedAt).toBe('taken')
    expect((await onDisk()).tasks[0]!.state).toBe('done')
    expect(outcome.victory).not.toBeNull()
  })

  it('Try again adds the row once the log can be written', async () => {
    await mkdir(join(repo, 'taken'))
    await seed({ docsLogPath: 'taken', tasks: [active({ id: 'one', title: 'Fix it' })] })
    await finishQuest(deps, KEY, 'one', 'medium', null)
    await rm(join(repo, 'taken'), { recursive: true })

    const outcome = data(await retryTaskLog(deps, KEY, 'one', 'taken'))

    expect(outcome).toMatchObject({ logPath: 'taken', logFailedAt: null })
    expect((await readFile(join(repo, 'taken'), 'utf8')).match(/\| Fix it \|/g)).toHaveLength(1)
  })

  it('Try again only logs a quest that has been won', async () => {
    await seed({ docsLogPath: 'log.md', tasks: [active({ id: 'one' })] })

    expect((await retryTaskLog(deps, KEY, 'one', 'log.md')).ok).toBe(false)
  })

  it('still finishes when the game can\'t be worked out', async () => {
    await seed({ docsLogPath: 'log.md', tasks: [active({ id: 'one' })] })
    const list = deps.host.list
    deps = { ...deps, host: { ...deps.host, list: dir => (dir.endsWith('/projects') ? Promise.reject(new Error('folder went away')) : list(dir)) } }

    const outcome = data(await finishQuest(deps, KEY, 'one', 'medium', null))

    expect(outcome.victory).toBeNull()
    expect((await onDisk()).tasks[0]!.state).toBe('done')
    expect(logged.join('\n')).toContain('folder went away')
  })
})
