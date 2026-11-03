import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import type { ProjectRecord, Task } from '../../../../../types'
import { groupBacklog } from '../../../../../hooks/shared/backlog/domain/services/families'
import { blockedTasks, rankBacklog } from '../../../../../hooks/shared/backlog/domain/services/ranking'
import { emptyRecord, parseRecord } from '../../../../../hooks/shared/records/data/datasources/record_source'
import type { SessionFile } from '../../../../../hooks/shared/sessions/domain/entities/session_file'
import { createLogger } from '../../../core/logger'
import { nodeHost } from '../../../core/node_host'
import { isProjectKey, listProjects, readProject } from './projects_api'
import type { ProjectsDeps } from './projects_api'

const NOW = Date.parse('2026-10-27T17:50:00Z')
let home: string
let deps: ProjectsDeps
const logged: string[] = []

const task = (over: Partial<Task> & { id: string }): Task =>
  ({
    title: over.id,
    state: 'queued',
    priority: 'mid',
    difficulty: { expected: 'medium', actual: null },
    messages: [],
    handoff: null,
    branch: null,
    baseBranch: null,
    startCommit: null,
    blockedBy: [],
    blockedReason: null,
    checkpoint: null,
    created: '2026-10-20T09:00:00+02:00',
    started: null,
    finished: null,
    minutesByDay: {},
    effort: { understandingMessages: 0, improvingMessages: 0, filesRead: 0, filesChanged: 0, linesAdded: 0, linesRemoved: 0, filesTouched: 0 },
    files: { read: [], changed: [] },
    parentId: null,
    description: null,
    criteria: [],
    review: null,
    helpers: { on: ['tea-dd'], ran: [], reminded: false },
    ...over,
  }) as Task

const record = (name: string, tasks: Task[]): ProjectRecord => ({ ...emptyRecord(name, `/p/${name}`), tasks })
const put = (name: string, text: string) => writeFile(join(home, '.queue-tea/projects', name), text)
const putRecord = (key: string, r: ProjectRecord) => put(`${key}.json`, JSON.stringify(r))

const session = (over: Partial<SessionFile>): SessionFile => ({
  id: 's-1',
  projectPath: '/p/a',
  recordFile: 'x',
  currentTaskId: null,
  isTurnRunning: false,
  cup: { mood: 'idle', line: '' },
  allowance: null,
  options: { idleGapMinutes: 15, freshAtTokens: 1, handoffAtPercent: 90, checkTimeoutSeconds: 10 },
  heartbeat: NOW,
  startedAt: NOW,
  ...over,
})
const putSession = (s: SessionFile) => writeFile(join(home, '.queue-tea/sessions', `${s.id}.json`), JSON.stringify(s))

const list = async () => {
  const listed = await listProjects(deps)
  if (!listed.ok) throw new Error(listed.error.message)

  return listed.data
}
const read = async (key: string) => {
  const reply = await readProject(deps, key)
  if (!reply.ok) throw new Error(reply.error.message)
  if (reply.data.kind !== 'readable') throw new Error('should read')

  return reply.data
}

beforeEach(async () => {
  home = await mkdtemp(join(tmpdir(), 'queue-tea-projects-'))
  await mkdir(join(home, '.queue-tea/projects'), { recursive: true })
  await mkdir(join(home, '.queue-tea/sessions'), { recursive: true })
  logged.length = 0
  const log = createLogger('dev', line => logged.push(line))
  deps = { host: nodeHost(log, async () => ({ exitCode: 0, stdout: '', stderr: '' })), home, now: () => NOW, log }
})
afterEach(() => rm(home, { recursive: true, force: true }))

describe('listing the realms', () => {
  it('lists nothing when there is nothing yet', async () => {
    await rm(join(home, '.queue-tea'), { recursive: true })

    expect(await list()).toEqual([])
  })

  it('hides everything beside the records that is not one', async () => {
    await putRecord('a-000001', record('a', []))
    await put('a-000001.json.bak', '{}')
    await put('a-000001.json.broken-2026', '{}')
    await put('a-000001.json.abc.tmp', '{}')
    await put('.brew-repro-tmp-2d9b32.json', JSON.stringify(record('tmp', [])))
    await mkdir(join(home, '.queue-tea/projects/a-000001.json.lock'))

    expect((await list()).map(r => r.key)).toEqual(['a-000001'])
  })

  it('one broken record leaves the others on screen', async () => {
    await putRecord('a-000001', record('a', []))
    await put('broken-000002.json', '{half a reco')

    const rows = await list()

    expect(rows.map(r => r.kind).sort()).toEqual(['readable', 'unreadable'])
    expect(rows.find(r => r.kind === 'unreadable')?.name).toBe('broken')
  })

  it('a record from a newer Queue-tea reads as unreadable and says so, untouched', async () => {
    const newer = JSON.stringify({ version: 2, tasks: [] })
    await put('new-000003.json', newer)

    const reply = await readProject(deps, 'new-000003')

    expect(reply).toMatchObject({ ok: true, data: { kind: 'unreadable', key: 'new-000003', name: 'new', isNewer: true, canRestore: false } })
  })

  it('offers the last good copy only when it reads', async () => {
    await put('a-000001.json', '{bad')
    await put('a-000001.json.bak', JSON.stringify(record('a', [])))
    await put('b-000002.json', '{bad')
    await put('b-000002.json.bak', '{also bad')

    expect(await readProject(deps, 'a-000001')).toMatchObject({ data: { canRestore: true } })
    expect(await readProject(deps, 'b-000002')).toMatchObject({ data: { canRestore: false } })
  })
})

describe('the status line', () => {
  const statusOf = async (r: ProjectRecord, ...sessions: SessionFile[]) => {
    await putRecord('a-000001', r)
    for (const s of sessions) await putSession(s)

    return (await list())[0]
  }

  it('says what waits, or that nothing does', async () => {
    expect(await statusOf(record('a', []))).toMatchObject({ status: { kind: 'nothing' }, session: 'none' })
    expect(await statusOf(record('a', [task({ id: 'x', title: 'Next' })]))).toMatchObject({ waiting: 1, status: { kind: 'waiting', count: 1, title: 'Next' } })
  })

  it('names the current task', async () => {
    expect(await statusOf(record('a', [task({ id: 'x', title: 'Now', state: 'current' })]))).toMatchObject({ status: { kind: 'current', title: 'Now' } })
  })

  it('working wins over the current task, and needing you over working', async () => {
    const now = task({ id: 'x', state: 'current' })

    expect(await statusOf(record('a', [now]), session({ isTurnRunning: true }))).toMatchObject({ status: { kind: 'working' }, session: 'working' })
    expect(await statusOf(record('a', [now]), session({ isTurnRunning: true, cup: { mood: 'attention', line: '' } }))).toMatchObject({ status: { kind: 'needsYou' } })
  })

  it('a task waiting for an answer asks for Judgement with no session open', async () => {
    expect(await statusOf(record('a', [task({ id: 'x', state: 'current', review: { at: 'x', checked: null } })]))).toMatchObject({ status: { kind: 'judgement' } })
  })

  it('a session that crashed counts as none after 90 s', async () => {
    expect(await statusOf(record('a', []), session({ heartbeat: NOW - 90_000 }))).toMatchObject({ session: 'open' })
    expect(await statusOf(record('a', []), session({ heartbeat: NOW - 90_001 }))).toMatchObject({ session: 'none' })
  })

  it('two sessions in one realm say so', async () => {
    expect(await statusOf(record('a', []), session({ id: 's-1' }), session({ id: 's-2' }))).toMatchObject({ session: 'several' })
  })

  it("another project's session doesn't count", async () => {
    expect(await statusOf(record('a', []), session({ projectPath: '/p/b' }))).toMatchObject({ session: 'none' })
  })
})

describe('reading a realm', () => {
  it('refuses a key that could leave the folder', async () => {
    for (const bad of ['../../etc/passwd', '.hidden-000000', 'a/b-000000', '', 12, null]) {
      expect(isProjectKey(bad)).toBe(false)
      expect((await readProject(deps, bad)).ok).toBe(false)
    }
  })

  it('never hands an exception to the window', async () => {
    const reply = await readProject(deps, 'gone-000000')

    expect(reply).toEqual({ ok: false, error: { message: "Couldn't read this realm's quests. Try again." } })
    expect(logged.join('')).toContain('no record for gone-000000')
  })

  it('the board keeps the ranking order and the ★ line, character for character', async () => {
    const r = record('a', [
      task({ id: 'low', title: 'Low', priority: 'low' }),
      task({ id: 'urgent', title: 'Urgent', priority: 'urgent' }),
      task({ id: 'saga', title: 'Saga', priority: 'high' }),
      task({ id: 'chapter', title: 'Chapter', priority: 'mid', parentId: 'saga' }),
      task({ id: 'stuck', title: 'Stuck', blockedReason: 'waiting for the clinic' }),
    ])
    await putRecord('a-000001', r)
    const parsed = parseRecord(JSON.stringify(r))
    if (parsed === 'unreadable') throw new Error('should read')
    const ranked = rankBacklog(parsed, null)
    const expected = groupBacklog(ranked, blockedTasks(parsed.tasks), parsed.tasks)

    const view = await read('a-000001')

    const idsOf = (e: { kind: string; row?: { task: Task }; group?: { parent: Task } }) => (e.kind === 'group' ? e.group!.parent.id : e.row!.task.id)
    expect(view.ready.map(e => e.quest.id)).toEqual(expected.ready.map(idsOf))
    const star = view.ready.flatMap(e => (e.kind === 'saga' ? [e.quest, ...e.chapters] : [e.quest])).find(q => q.isStar)
    expect(star?.why).toBe(ranked[0]?.why)
    expect(view.canStart).toBe(4)
  })

  it('a saga carries its chapters, the sealed ones too, and its progress', async () => {
    await putRecord(
      'a-000001',
      record('a', [
        task({ id: 'saga', title: 'Saga' }),
        task({ id: 'one', parentId: 'saga' }),
        task({ id: 'two', parentId: 'saga', blockedReason: 'later' }),
        task({ id: 'three', parentId: 'saga', state: 'done', finished: '2026-10-21T09:00:00+02:00' }),
      ]),
    )

    const [saga] = (await read('a-000001')).ready

    if (saga?.kind !== 'saga') throw new Error('should be a saga')
    expect(saga.chapters.map(c => c.id)).toEqual(['one', 'two'])
    expect(saga.chapters[1]?.sealedBecause).toBe('later')
    expect(saga.progress).toMatchObject({ done: 1, total: 3 })
  })

  it('an urgent current task is the boss, and its reward follows its difficulty', async () => {
    await putRecord('a-000001', record('a', [task({ id: 'x', state: 'current', priority: 'urgent', difficulty: { expected: 'hard', actual: null }, minutesByDay: { a: 20, b: 23 } })]))

    expect((await read('a-000001')).active).toMatchObject({ isBoss: true, xp: 50, minutes: 43 })
  })

  it('keeps the three latest victories and the full count', async () => {
    const won = ['20', '21', '22', '23'].map(d => task({ id: d, state: 'done', finished: `2026-10-${d}T09:00:00+02:00`, difficulty: { expected: 'light', actual: 'hard' } }))
    await putRecord('a-000001', record('a', won))

    const view = await read('a-000001')

    expect(view.victories.map(v => v.id)).toEqual(['23', '22', '21'])
    expect(view.victories[0]?.xp).toBe(50)
    expect(view.victoryCount).toBe(4)
  })
})
