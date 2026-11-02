import { mkdir, mkdtemp, readFile, realpath, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import type { AppRequest, ProjectRecord } from '../../../../../types'
import { emptyCheckpoint } from '../../../../../hooks/shared/checkpoints/domain/services/checkpoints'
import { emptyRecord, parseRecord } from '../../../../../hooks/shared/records/data/datasources/record_source'
import type { BackOutcome, Reply } from '../../../../shared/engine_api'
import { createLogger } from '../../../core/logger'
import { nodeHost } from '../../../core/node_host'
import { putBackNow, putBackQuest } from './back_api'
import { makeTask } from './fixtures'
import type { TasksDeps } from './scope'

const KEY = 'demo-abc123'
const NOW = Date.parse('2026-10-27T17:50:00Z')
const PATH = '/p/demo'

let home: string
let file: string
let deps: TasksDeps

const seed = (over: Partial<ProjectRecord>) => writeFile(file, JSON.stringify({ ...emptyRecord('demo', PATH), ...over }))
const onDisk = async () => {
  const read = parseRecord(await readFile(file, 'utf8'))
  if (read === 'unreadable') throw new Error('should read')

  return read
}
const data = (answer: Reply<BackOutcome>): BackOutcome => {
  if (!answer.ok) throw new Error(`should succeed: ${answer.error.message}`)

  return answer.data
}
const session = async () => {
  await mkdir(join(home, '.queue-tea/sessions'), { recursive: true })
  await writeFile(join(home, '.queue-tea/sessions/s-1.json'), JSON.stringify({ id: 's-1', projectPath: PATH, recordFile: file, currentTaskId: 'one', isTurnRunning: false, cup: { mood: 'idle', line: '' }, allowance: null, options: {}, heartbeat: NOW, startedAt: NOW }))
}
const active = (over: Partial<Parameters<typeof makeTask>[0]> = {}) =>
  makeTask({ id: 'one', title: 'Fix it', state: 'current', branch: 'task/fix', startCommit: 'abc', minutesByDay: { '2026-10-27': 14 }, priority: 'high', ...over })
const request = (kind: AppRequest['kind'], over: Partial<AppRequest> = {}): AppRequest => ({ id: 'q-9', kind, taskId: 'one', at: 'now', ...over })

beforeEach(async () => {
  home = await realpath(await mkdtemp(join(tmpdir(), 'queue-tea-back-')))
  file = join(home, '.queue-tea/projects', `${KEY}.json`)
  await mkdir(join(home, '.queue-tea/projects'), { recursive: true })
  const log = createLogger('dev', () => {})
  deps = { host: nodeHost(log, async () => ({ exitCode: 0, stdout: '', stderr: '' })), home, now: () => NOW, log, offsetMinutes: () => 60, newId: () => 'q-1', terminal: async () => 'terminal', copy: () => {} }
})

afterEach(() => rm(home, { recursive: true, force: true }))

describe('Back to the board with a session open', () => {
  it('asks the session, and the quest stays active until it acts', async () => {
    await session()
    await seed({ tasks: [active()] })

    const outcome = data(await putBackQuest(deps, KEY, 'one', null))

    expect(outcome).toMatchObject({ went: 'asked', missedCheckpoint: null })
    expect((await onDisk()).tasks[0]!.state).toBe('current')
    expect((await onDisk()).requests.map(q => q.kind)).toEqual(['putBack'])
    if (outcome.view.kind !== 'readable') throw new Error('should read')
    expect(outcome.view.active?.asking).toBe('putBack')
  })

  it('a second press adds no second request', async () => {
    await session()
    await seed({ tasks: [active()] })

    await putBackQuest(deps, KEY, 'one', null)
    await putBackQuest(deps, KEY, 'one', null)

    expect((await onDisk()).requests).toHaveLength(1)
  })

  it('carries the seal for the session to apply', async () => {
    await session()
    await seed({ tasks: [active()] })

    await putBackQuest(deps, KEY, 'one', { reason: 'waiting for the clinic' })

    expect((await onDisk()).requests[0]!.block).toEqual({ reason: 'waiting for the clinic' })
    expect((await onDisk()).tasks[0]!.blockedReason).toBeNull()
  })

  it('goes back at once when Claude has not begun, since there is nothing to save', async () => {
    await session()
    await seed({ tasks: [active()], requests: [request('begin')] })

    const outcome = data(await putBackQuest(deps, KEY, 'one', null))

    expect(outcome).toMatchObject({ went: 'back', missedCheckpoint: null })
    expect((await onDisk()).tasks[0]!.state).toBe('queued')
    expect((await onDisk()).requests).toEqual([])
  })
})

describe('Back to the board with no session', () => {
  it('goes back at once, keeping branch, start commit, time and priority', async () => {
    await seed({ tasks: [active()] })

    const outcome = data(await putBackQuest(deps, KEY, 'one', null))

    expect(outcome.went).toBe('back')
    expect((await onDisk()).tasks[0]).toMatchObject({ state: 'queued', branch: 'task/fix', startCommit: 'abc', priority: 'high', minutesByDay: { '2026-10-27': 14 } })
  })

  it('says no checkpoint was written, and when the last one was', async () => {
    await seed({ tasks: [active({ checkpoint: { ...emptyCheckpoint(), written: '2026-10-26T16:35:00+01:00', goal: 'Fix it' } })] })

    expect(data(await putBackQuest(deps, KEY, 'one', null)).missedCheckpoint).toEqual({ lastAt: '2026-10-26T16:35:00+01:00' })
  })

  it('says so with no checkpoint to fall back on', async () => {
    await seed({ tasks: [active()] })

    expect(data(await putBackQuest(deps, KEY, 'one', null)).missedCheckpoint).toEqual({ lastAt: null })
  })

  it('a session gone since Start leaves the begin dropped and nothing to say', async () => {
    await seed({ tasks: [active()], requests: [request('begin')] })

    const outcome = data(await putBackQuest(deps, KEY, 'one', null))

    expect(outcome.missedCheckpoint).toBeNull()
    expect((await onDisk()).requests).toEqual([])
  })

  it('seals the active quest with a reason', async () => {
    await seed({ tasks: [active()] })

    await putBackQuest(deps, KEY, 'one', { reason: 'waiting for the clinic' })

    expect((await onDisk()).tasks[0]).toMatchObject({ state: 'queued', blockedReason: 'waiting for the clinic' })
  })

  it('seals the active quest on another', async () => {
    await seed({ tasks: [active(), makeTask({ id: 'two' })] })

    await putBackQuest(deps, KEY, 'one', { waitFor: 'two' })

    expect((await onDisk()).tasks[0]).toMatchObject({ state: 'queued', blockedBy: ['two'] })
  })

  it('refuses a seal that would make two quests wait for each other', async () => {
    await seed({ tasks: [active(), makeTask({ id: 'two', blockedBy: ['one'] })] })

    expect(await putBackQuest(deps, KEY, 'one', { waitFor: 'two' })).toEqual({ ok: false, error: { message: 'That would make the two quests wait for each other.' } })
    expect((await onDisk()).tasks[0]!.state).toBe('current')
  })

  it('refuses a seal with nothing in it', async () => {
    await seed({ tasks: [active()] })

    expect((await putBackQuest(deps, KEY, 'one', { reason: '  ' })).ok).toBe(false)
    expect((await onDisk()).tasks[0]!.state).toBe('current')
  })

  it('refuses a quest that is no longer the active one', async () => {
    await seed({ tasks: [makeTask({ id: 'one' })] })

    expect(await putBackQuest(deps, KEY, 'one', null)).toEqual({ ok: false, error: { message: 'That quest is no longer the active one, so nothing changed.' } })
  })
})

describe('Put it back now, without one', () => {
  it('takes the request back, and says no checkpoint was written', async () => {
    await session()
    await seed({ tasks: [active()], requests: [request('putBack')] })

    const outcome = data(await putBackNow(deps, KEY, 'one'))

    expect(outcome.went).toBe('back')
    expect(outcome.missedCheckpoint).toEqual({ lastAt: null })
    expect((await onDisk()).tasks[0]!.state).toBe('queued')
    expect((await onDisk()).requests).toEqual([])
  })

  it('works when the session that was asked has ended', async () => {
    await seed({ tasks: [active()], requests: [request('putBack')] })

    data(await putBackNow(deps, KEY, 'one'))

    expect((await onDisk()).tasks[0]!.state).toBe('queued')
  })

  it('keeps the seal the session was going to apply', async () => {
    await seed({ tasks: [active()], requests: [request('putBack', { block: { reason: 'waiting' } })] })

    data(await putBackNow(deps, KEY, 'one'))

    expect((await onDisk()).tasks[0]).toMatchObject({ state: 'queued', blockedReason: 'waiting' })
  })

  it('refuses when the session got there first', async () => {
    await seed({ tasks: [makeTask({ id: 'one' })] })

    expect((await putBackNow(deps, KEY, 'one')).ok).toBe(false)
  })
})
