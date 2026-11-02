import { execFile } from 'node:child_process'
import { mkdir, mkdtemp, realpath, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import type { ProjectRecord } from '../../../../../types'
import { emptyCheckpoint } from '../../../../../hooks/shared/checkpoints/domain/services/checkpoints'
import { emptyRecord } from '../../../../../hooks/shared/records/data/datasources/record_source'
import type { QuestFacts, Reply } from '../../../../shared/engine_api'
import { createLogger } from '../../../core/logger'
import { nodeHost } from '../../../core/node_host'
import { readQuestFacts } from './detail_api'
import { makeTask } from './fixtures'
import type { TasksDeps } from './scope'

const KEY = 'facts-abc123'
const NOW = Date.parse('2026-10-27T17:50:00Z')
const TODAY = '2026-10-27'
const run = promisify(execFile)

let home: string
let repo: string
let file: string
let deps: TasksDeps

const git = async (...args: string[]) => (await run('git', args, { cwd: repo })).stdout.trim()
const seed = (over: Partial<ProjectRecord>) => writeFile(file, JSON.stringify({ ...emptyRecord('facts', repo), ...over }))
const data = (answer: Reply<QuestFacts>): QuestFacts => {
  if (!answer.ok) throw new Error(`should succeed: ${answer.error.message}`)

  return answer.data
}

beforeEach(async () => {
  home = await realpath(await mkdtemp(join(tmpdir(), 'queue-tea-facts-')))
  repo = join(home, 'repo')
  file = join(home, '.queue-tea/projects', `${KEY}.json`)
  await mkdir(join(home, '.queue-tea/projects'), { recursive: true })
  await mkdir(repo)
  await git('init', '-b', 'main')
  await git('config', 'user.email', 'test@example.com')
  await git('config', 'user.name', 'Test')
  await writeFile(join(repo, 'a.txt'), 'a\n')
  await git('add', '.')
  await git('commit', '-m', 'first')
  const log = createLogger('dev', () => {})
  deps = { host: nodeHost(log, async () => ({ exitCode: 0, stdout: '', stderr: '' })), home, now: () => NOW, log, offsetMinutes: () => 60, newId: () => 'q-1', terminal: async () => 'terminal', copy: () => {} }
})

afterEach(() => rm(home, { recursive: true, force: true }))

describe('a quest on the board', () => {
  it('says what it was filed with', async () => {
    await seed({ tasks: [makeTask({ id: 'one', messages: ['Fix the diagrams please'] })] })

    expect(data(await readQuestFacts(deps, KEY, 'one')).messages).toEqual(['Fix the diagrams please'])
  })

  it('names the branch it will get', async () => {
    await seed({ tasks: [makeTask({ id: 'one', title: 'Fix cut-off text' })] })

    expect(data(await readQuestFacts(deps, KEY, 'one')).branchToBe).toBe('task/fix-cut-off-text')
  })

  it('names a free one when that branch is taken', async () => {
    await git('branch', 'task/fix-cut-off-text')
    await seed({ tasks: [makeTask({ id: 'one', title: 'Fix cut-off text' })] })

    expect(data(await readQuestFacts(deps, KEY, 'one')).branchToBe).toBe('task/fix-cut-off-text-2')
  })

  it('has none to name once it has its own', async () => {
    await git('branch', 'task/mine')
    await seed({ tasks: [makeTask({ id: 'one', branch: 'task/mine' })] })

    expect(data(await readQuestFacts(deps, KEY, 'one')).branchToBe).toBeNull()
  })

  it('names one again when its own has gone, as Start would', async () => {
    await seed({ tasks: [makeTask({ id: 'one', title: 'Fix it', branch: 'task/gone' })] })

    expect(data(await readQuestFacts(deps, KEY, 'one')).branchToBe).toBe('task/fix')
  })

  it('has none to name outside a repository', async () => {
    const plain = join(home, 'plain')
    await mkdir(plain)
    await writeFile(file, JSON.stringify({ ...emptyRecord('facts', plain), tasks: [makeTask({ id: 'one' })] }))

    expect(data(await readQuestFacts(deps, KEY, 'one')).branchToBe).toBeNull()
  })

  it('has nothing about being active', async () => {
    await seed({ tasks: [makeTask({ id: 'one' })] })

    expect(data(await readQuestFacts(deps, KEY, 'one')).active).toBeNull()
  })
})

describe('the note it carries on from', () => {
  it('lists a checkpoint\'s sections', async () => {
    await seed({ tasks: [makeTask({ id: 'one', checkpoint: { ...emptyCheckpoint(), written: '2026-10-26T16:35:00+01:00', goal: 'Fix the docs', remaining: ['The diagrams'] } })] })

    expect(data(await readQuestFacts(deps, KEY, 'one')).note).toEqual({
      title: 'Checkpoint',
      written: '2026-10-26T16:35:00+01:00',
      text: '',
      sections: [
        { heading: 'Goal', lines: ['Fix the docs'] },
        { heading: 'Remaining', lines: ['- The diagrams'] },
      ],
    })
  })

  it('keeps a plain handoff note as text', async () => {
    await seed({ tasks: [makeTask({ id: 'one', handoff: { text: 'Carry on with the diagrams.', written: '2026-10-26T16:35:00+01:00' } })] })

    expect(data(await readQuestFacts(deps, KEY, 'one')).note).toMatchObject({ title: 'Handoff note', text: 'Carry on with the diagrams.', sections: null })
  })

  it('has none for a quest never worked on', async () => {
    await seed({ tasks: [makeTask({ id: 'one' })] })

    expect(data(await readQuestFacts(deps, KEY, 'one')).note).toBeNull()
  })
})

describe('the active quest', () => {
  const active = (over = {}) => makeTask({ id: 'one', state: 'current', branch: 'main', started: '2026-10-20T22:17:00+02:00', minutesByDay: { '2026-10-20': 24, [TODAY]: 19 }, effort: { understandingMessages: 1, improvingMessages: 4, filesRead: 33, filesChanged: 39, linesAdded: 0, linesRemoved: 0, filesTouched: 0 }, ...over })

  it('gives its time, in all and today', async () => {
    await seed({ tasks: [active()] })

    expect(data(await readQuestFacts(deps, KEY, 'one')).active).toMatchObject({ minutes: 43, today: 19, started: '2026-10-20T22:17:00+02:00' })
  })

  it('gives its effort', async () => {
    await seed({ tasks: [active()] })

    expect(data(await readQuestFacts(deps, KEY, 'one')).active).toMatchObject({ understandingMessages: 1, improvingMessages: 4, filesRead: 33, filesChanged: 39 })
  })

  it('measures the lines now, uncommitted work included', async () => {
    const startCommit = await git('rev-parse', 'HEAD')
    await writeFile(join(repo, 'a.txt'), 'a\nb\nc\n')
    await seed({ tasks: [active({ startCommit })] })

    expect(data(await readQuestFacts(deps, KEY, 'one')).active?.lines).toEqual({ added: 2, removed: 0, since: startCommit.slice(0, 7) })
  })

  it('leaves the lines out with no start commit', async () => {
    await seed({ tasks: [active()] })

    expect(data(await readQuestFacts(deps, KEY, 'one')).active?.lines).toBeNull()
  })

  it('leaves the lines out when git has lost the commit, and keeps the rest', async () => {
    await seed({ tasks: [active({ startCommit: 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeef' })] })

    expect(data(await readQuestFacts(deps, KEY, 'one')).active).toMatchObject({ lines: null, minutes: 43 })
  })

  it('gives the last commit and what isn\'t committed', async () => {
    await writeFile(join(repo, 'a.txt'), 'changed\n')
    await writeFile(join(repo, 'b.txt'), 'new\n')
    await seed({ tasks: [active()] })

    const facts = data(await readQuestFacts(deps, KEY, 'one')).active?.git

    expect(facts?.branch).toBe('main')
    expect(facts?.head).toMatch(/^[0-9a-f]{7} first$/)
    expect(facts?.uncommitted.sort()).toEqual(['a.txt', 'b.txt'])
    expect(facts?.uncommittedCount).toBe(2)
  })

  it('counts every file, though it lists at most 20', async () => {
    for (let i = 0; i < 25; i += 1) await writeFile(join(repo, `f${i}.txt`), 'x\n')
    await seed({ tasks: [active()] })

    const facts = data(await readQuestFacts(deps, KEY, 'one')).active?.git

    expect(facts?.uncommitted).toHaveLength(20)
    expect(facts?.uncommittedCount).toBe(25)
  })

  it('has no git facts outside a repository, and the rest stands', async () => {
    const plain = join(home, 'plain')
    await mkdir(plain)
    await writeFile(file, JSON.stringify({ ...emptyRecord('facts', plain), tasks: [active()] }))

    expect(data(await readQuestFacts(deps, KEY, 'one')).active).toMatchObject({ git: null, minutes: 43 })
  })

  it('stands without git when the folder has moved', async () => {
    await writeFile(file, JSON.stringify({ ...emptyRecord('facts', join(home, 'moved-away')), tasks: [active()] }))

    expect(data(await readQuestFacts(deps, KEY, 'one')).active).toMatchObject({ git: null, minutes: 43 })
  })
})

describe('refusals', () => {
  it('refuses a quest it doesn\'t know', async () => {
    await seed({ tasks: [] })

    expect(await readQuestFacts(deps, KEY, 'nope')).toEqual({ ok: false, error: { message: "That quest isn't one Queue-tea knows. Pick it again." } })
  })

  it('refuses a key that isn\'t one', async () => {
    expect((await readQuestFacts(deps, '../x', 'one')).ok).toBe(false)
  })
})
