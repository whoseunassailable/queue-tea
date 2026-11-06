import { chmod, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { RunResult } from '../../../../../hooks/core/host/host'
import { emptyRecord } from '../../../../../hooks/shared/records/data/datasources/record_source'
import type { MergeStage } from '../../../../shared/branches'
import type { HelperJob } from '../../../../shared/engine_api'
import { createLogger } from '../../../core/logger'
import { MESSAGES } from '../../../core/messages'
import { nodeHost } from '../../../core/node_host'
import { streamProcess } from '../../../core/stream_process'
import type { ProcessRequest } from '../../../core/stream_process'
import { mergeOperation } from '../../../../renderer/features/branches/test_fixtures'
import { makeTask } from '../../tasks/api/fixtures'
import { HELPER_LIMITS } from '../domain/helper_stream'
import { helpersApi } from './helpers_api'

const KEY = 'demo-abc123'
const NOW = Date.parse('2026-11-06T09:00:00Z')
const line = (event: object) => `${JSON.stringify(event)}\n`
const INIT = line({ type: 'system', subtype: 'init', agents: ['claude', 'queue-tea:tea-dd', 'queue-tea:chai-pter'] })
const READ = line({ type: 'assistant', message: { content: [{ type: 'tool_use', name: 'Read', input: { file_path: '/x/timer.ts' } }] } })
const DONE = line({ type: 'result', subtype: 'success', is_error: false, result: 'Added three tests.' })
const ran = (exitCode: number, stderr = ''): RunResult => ({ exitCode, stdout: '', stderr })

let home: string
let folder: string
let told: HelperJob[][]
let requests: ProcessRequest[]
let script: (request: ProcessRequest, out: (chunk: string) => void) => Promise<RunResult>
let api: ReturnType<typeof helpersApi>

const last = (): HelperJob[] => told[told.length - 1] ?? []
const jobOf = (helper: string) => last().find(job => job.helper === helper)
const seed = (tasks = [makeTask({ id: 'a' })]) => writeFile(`${home}/.queue-tea/projects/${KEY}.json`, JSON.stringify({ ...emptyRecord('demo', folder), tasks }))
const data = <T>(reply: { ok: true; data: T } | { ok: false; error: { message: string } }): T => {
  if (!reply.ok) throw new Error(reply.error.message)

  return reply.data
}
// A run that waits until it is stopped, as a long order would. Like the real
// one, it ends at once when the stop came first.
const untilStopped = (request: ProcessRequest) =>
  new Promise<RunResult>(done => {
    if (request.signal!.aborted) done(ran(130))
    else request.signal!.addEventListener('abort', () => done(ran(130)), { once: true })
  })

beforeEach(async () => {
  home = await mkdtemp(join(tmpdir(), 'queue-tea-helpers-'))
  folder = join(home, 'demo')
  await mkdir(join(home, '.queue-tea/projects'), { recursive: true })
  await mkdir(folder)
  await seed()
  told = []
  requests = []
  script = async (_, out) => {
    out(INIT + READ.slice(0, 20))
    out(READ.slice(20) + DONE)

    return ran(0)
  }
  const log = createLogger('dev', () => {})
  const stream = (async (_log, request, out) => {
    requests.push(request)

    return script(request, out ?? (() => {}))
  }) as typeof streamProcess
  api = helpersApi({ host: nodeHost(log, async () => ran(0)), home, now: () => NOW, log, offsetMinutes: () => 60, newId: () => 't-new', terminal: async () => 'terminal', copy: () => {}, stream, tell: jobs => told.push(jobs) })
})
afterEach(() => rm(home, { recursive: true, force: true }))

// A real shell starts slowly while the whole suite runs.
const REAL_WAIT = { timeout: 5_000 }

describe('sending a helper an order', () => {
  it('runs Claude Code as that helper in the realm, and keeps the window told', async () => {
    const job = data(await api.sendHelper(KEY, 'tea-dd', '  Write tests for the timer  '))

    expect(job).toMatchObject({ helper: 'tea-dd', realm: KEY, folder, order: 'Write tests for the timer', status: 'working' })
    await vi.waitFor(() => expect(jobOf('tea-dd')?.status).toBe('done'))
    expect(requests[0]).toMatchObject({ cwd: folder, argv: ['claude', '-p', '--agent', 'queue-tea:tea-dd', '--output-format', 'stream-json', '--verbose', '--', 'Write tests for the timer'] })
    expect(told.some(jobs => jobs[0]?.doing?.target === 'timer.ts')).toBe(true)
    expect(jobOf('tea-dd')).toMatchObject({ reply: 'Added three tests.', steps: 1, doing: null, finished: NOW })
    expect(data(await api.readHelpers())).toEqual(last())
  })

  it('works in the worktree of the quest under way', async () => {
    const worktree = join(home, 'demo-wt')
    await mkdir(worktree)
    await seed([makeTask({ id: 'a', state: 'current', worktreePath: worktree })])

    data(await api.sendHelper(KEY, 'tea-dd', 'Test it'))

    await vi.waitFor(() => expect(requests[0]?.cwd).toBe(worktree))
  })

  it('takes one order at a time per helper, while the others stay free', async () => {
    script = untilStopped
    data(await api.sendHelper(KEY, 'tea-dd', 'First'))

    expect(await api.sendHelper(KEY, 'tea-dd', 'Second')).toEqual({ ok: false, error: { message: MESSAGES.helperBusy } })
    expect((await api.sendHelper(KEY, 'chai-pter', 'Write it up')).ok).toBe(true)
    expect(api.isBusy()).toBe(true)
    data(await api.stopHelper('tea-dd'))
    data(await api.stopHelper('chai-pter'))
    await vi.waitFor(() => expect(api.isBusy()).toBe(false))
  })

  it('starts one run when two sends for the same helper land at once', async () => {
    script = untilStopped

    const both = await Promise.all([api.sendHelper(KEY, 'tea-dd', 'First'), api.sendHelper(KEY, 'tea-dd', 'Second')])

    expect(both.filter(answer => answer.ok)).toHaveLength(1)
    expect(both).toContainEqual({ ok: false, error: { message: MESSAGES.helperBusy } })
    expect(requests).toHaveLength(1)
    data(await api.stopHelper('tea-dd'))
    await vi.waitFor(() => expect(api.isBusy()).toBe(false))
  })

  it('counts a step for each tool, not for thinking', async () => {
    const think = line({ type: 'assistant', message: { content: [{ type: 'text', text: 'Let me look.' }] } })
    script = async (_, out) => {
      out(INIT + think + READ + think + READ + DONE)

      return ran(0)
    }
    data(await api.sendHelper(KEY, 'tea-dd', 'Test it'))

    await vi.waitFor(() => expect(jobOf('tea-dd')).toMatchObject({ status: 'done', steps: 2 }))
    expect(told.some(jobs => jobs[0]?.doing?.kind === 'thinking')).toBe(true)
  })

  it('fails plainly when the run ends without an answer', async () => {
    script = async (_, out) => {
      out(INIT + READ)

      return ran(0)
    }
    data(await api.sendHelper(KEY, 'tea-dd', 'Test it'))

    await vi.waitFor(() => expect(jobOf('tea-dd')).toMatchObject({ status: 'failed', error: MESSAGES.helperFailed, doing: null, finished: NOW }))
  })

  it('stops when told to', async () => {
    script = untilStopped
    data(await api.sendHelper(KEY, 'tea-dd', 'A long one'))

    data(await api.stopHelper('tea-dd'))

    await vi.waitFor(() => expect(jobOf('tea-dd')?.status).toBe('stopped'))
  })

  it("stops and says so when Claude Code doesn't have the helper", async () => {
    script = (request, out) => {
      out(line({ type: 'system', subtype: 'init', agents: ['claude'] }))

      return untilStopped(request)
    }
    data(await api.sendHelper(KEY, 'tea-dd', 'Test it'))

    await vi.waitFor(() => expect(jobOf('tea-dd')).toMatchObject({ status: 'failed', error: MESSAGES.helperMissing }))
  })

  it("says Claude Code couldn't be found", async () => {
    script = async () => ran(1, 'spawn claude ENOENT')
    data(await api.sendHelper(KEY, 'tea-dd', 'Test it'))

    await vi.waitFor(() => expect(jobOf('tea-dd')).toMatchObject({ status: 'failed', error: MESSAGES.helperNoClaude }))
  })

  it('says an order that ran out of time was stopped', async () => {
    script = async () => ran(130)
    data(await api.sendHelper(KEY, 'tea-dd', 'Test it'))

    await vi.waitFor(() => expect(jobOf('tea-dd')).toMatchObject({ status: 'failed', error: MESSAGES.helperTimedOut(HELPER_LIMITS.runMinutes) }))
  })

  it('fails plainly when the run ends in an error', async () => {
    script = async (_, out) => {
      out(INIT + line({ type: 'result', subtype: 'error_during_execution', is_error: true }))

      return ran(1)
    }
    data(await api.sendHelper(KEY, 'tea-dd', 'Test it'))

    await vi.waitFor(() => expect(jobOf('tea-dd')).toMatchObject({ status: 'failed', error: MESSAGES.helperFailed }))
  })
})

describe('sending a helper to resolve a merge', () => {
  const OP = '12345678-1234-1234-1234-123456789abc'
  const integration = () => join(home, '.queue-tea/integrations', KEY)
  const prepare = async (stage: MergeStage = 'conflicts') => {
    await mkdir(join(integration(), OP, 'worktree'), { recursive: true })
    await writeFile(join(integration(), `${OP}.json`), JSON.stringify(mergeOperation({ key: KEY, id: OP, stage, source: 'task/guild', target: 'main' })))
  }

  it("runs the helper in that merge's own folder with the Tea-concile order", async () => {
    await prepare()

    const job = data(await api.concileMerge(KEY, 'chai-pter', OP))

    expect(job).toMatchObject({ helper: 'chai-pter', realm: KEY, merge: OP, folder: join(integration(), OP, 'worktree'), status: 'working' })
    expect(job.order).toContain('queue-tea:tea-concile')
    expect(job.order).toContain('task/guild into main')
    await vi.waitFor(() => expect(jobOf('chai-pter')?.status).toBe('done'))
    expect(requests[0]).toMatchObject({ cwd: join(integration(), OP, 'worktree') })
    expect(requests[0]?.argv.slice(0, 4)).toEqual(['claude', '-p', '--agent', 'queue-tea:chai-pter'])
  })

  it('refuses a merge with no conflicts left, one it cannot find, and a busy helper', async () => {
    await prepare('ready')
    expect(await api.concileMerge(KEY, 'tea-dd', OP)).toEqual({ ok: false, error: { message: MESSAGES.helperNoConflicts } })
    expect(await api.concileMerge(KEY, 'tea-dd', '../escape')).toMatchObject({ ok: false })
    expect(await api.concileMerge(KEY, 'not-one', OP)).toEqual({ ok: false, error: { message: MESSAGES.badValue } })
    await prepare()
    script = untilStopped
    data(await api.sendHelper(KEY, 'tea-dd', 'Test it'))
    expect(await api.concileMerge(KEY, 'tea-dd', OP)).toEqual({ ok: false, error: { message: MESSAGES.helperBusy } })
    data(await api.stopHelper('tea-dd'))
    expect(requests).toHaveLength(1)
  })

  it('an order from the Guild Hall belongs to no merge', async () => {
    expect(data(await api.sendHelper(KEY, 'tea-dd', 'Test it')).merge).toBeNull()
  })
})

describe('what it refuses', () => {
  it('a helper that is not one, or an order that is empty or too long', async () => {
    expect(await api.sendHelper(KEY, 'barista', 'Hi')).toEqual({ ok: false, error: { message: MESSAGES.badValue } })
    expect(await api.sendHelper(KEY, 'tea-dd', '   ')).toEqual({ ok: false, error: { message: MESSAGES.helperOrderEmpty } })
    expect(await api.sendHelper(KEY, 'tea-dd', 'x'.repeat(HELPER_LIMITS.orderChars + 1))).toEqual({ ok: false, error: { message: MESSAGES.helperOrderLong(HELPER_LIMITS.orderChars) } })
    expect(await api.stopHelper('barista')).toEqual({ ok: false, error: { message: MESSAGES.badValue } })
    expect(requests).toEqual([])
  })

  it('a realm it does not know, or one whose folder has gone', async () => {
    expect(await api.sendHelper('nope-000000', 'tea-dd', 'Hi')).toEqual({ ok: false, error: { message: MESSAGES.unknownProject } })
    await rm(folder, { recursive: true })

    expect(await api.sendHelper(KEY, 'tea-dd', 'Hi')).toEqual({ ok: false, error: { message: MESSAGES.folderGone(folder) } })
    expect(requests).toEqual([])
  })

  it('a realm whose record cannot be read', async () => {
    await writeFile(`${home}/.queue-tea/projects/${KEY}.json`, '{ not json')

    expect(await api.sendHelper(KEY, 'tea-dd', 'Hi')).toEqual({ ok: false, error: { message: MESSAGES.unreadableRealm } })
    expect(requests).toEqual([])
  })
})

// The same API over a real process: a stand-in claude, found first on the
// path, so no test spends tokens.
describe('with a real process', () => {
  const plant = async (body: string) => {
    const bin = join(home, '.local/bin')
    await mkdir(bin, { recursive: true })
    await writeFile(join(bin, 'claude'), `#!/bin/sh\n${body}\n`)
    await chmod(join(bin, 'claude'), 0o755)
    // Only the planted bin and the system folders, never a real claude.
    vi.stubEnv('PATH', '')
  }
  const say = (event: object) => `printf '%s\\n' '${JSON.stringify(event)}'`
  const real = () => {
    const log = createLogger('dev', () => {})

    return helpersApi({ host: nodeHost(log, async () => ran(0)), home, now: () => NOW, log, offsetMinutes: () => 60, newId: () => 't-new', terminal: async () => 'terminal', copy: () => {}, stream: streamProcess, tell: jobs => told.push(jobs) })
  }
  afterEach(() => vi.unstubAllEnvs())

  it('stops an order before its first step', async () => {
    await plant('sleep 20')
    const helpers = real()
    data(await helpers.sendHelper(KEY, 'tea-dd', 'A long one'))

    data(await helpers.stopHelper('tea-dd'))

    await vi.waitFor(() => expect(jobOf('tea-dd')).toMatchObject({ status: 'stopped', steps: 0, doing: null }), REAL_WAIT)
  })

  it('a line it cannot read does not end the order', async () => {
    await plant(
      [
        say({ type: 'system', subtype: 'init', agents: ['claude', 'queue-tea:tea-dd'] }),
        say({ type: 'assistant', message: { content: [null] } }),
        'sleep 0.3',
        say({ type: 'result', subtype: 'success', is_error: false, result: 'Added three tests.' }),
      ].join('\n'),
    )
    const helpers = real()
    data(await helpers.sendHelper(KEY, 'tea-dd', 'Test it'))

    await vi.waitFor(() => expect(jobOf('tea-dd')?.status).not.toBe('working'), REAL_WAIT)
    expect(jobOf('tea-dd')).toMatchObject({ status: 'done', reply: 'Added three tests.', error: null })
  })
})
