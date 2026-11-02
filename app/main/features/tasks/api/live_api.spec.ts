import { execFile } from 'node:child_process'
import { mkdir, mkdtemp, readFile, realpath, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import type { ProjectRecord } from '../../../../../types'
import { emptyCheckpoint } from '../../../../../hooks/shared/checkpoints/domain/services/checkpoints'
import { emptyRecord } from '../../../../../hooks/shared/records/data/datasources/record_source'
import type { LiveFacts, Reply } from '../../../../shared/engine_api'
import { createLogger } from '../../../core/logger'
import { nodeHost } from '../../../core/node_host'
import { readProject } from '../../projects/api/projects_api'
import { makeTask } from './fixtures'
import { readLive, setTimeBudget, switchBranch } from './live_api'
import type { TasksDeps } from './scope'
import { setPriority } from './tasks_api'

const KEY = 'live-abc123'
const NOW = Date.parse('2026-10-27T17:50:00Z')
const run = promisify(execFile)

let home: string
let repo: string
let file: string
let deps: TasksDeps

const git = async (...args: string[]) => (await run('git', args, { cwd: repo })).stdout.trim()
const seed = (over: Partial<ProjectRecord>) => writeFile(file, JSON.stringify({ ...emptyRecord('live', repo), ...over }))
const data = <T>(answer: Reply<T>): T => {
  if (!answer.ok) throw new Error(`should succeed: ${answer.error.message}`)

  return answer.data
}
const facts = async (): Promise<LiveFacts> => data(await readLive(deps, KEY))
const session = async (warning: string | null, heartbeat = NOW) => {
  await mkdir(join(home, '.queue-tea/sessions'), { recursive: true })
  await writeFile(join(home, '.queue-tea/sessions/s-1.json'), JSON.stringify({ id: 's-1', projectPath: repo, recordFile: file, currentTaskId: null, isTurnRunning: false, cup: { mood: 'idle', line: '' }, allowance: null, options: {}, heartbeat, startedAt: NOW, warning }))
}

beforeEach(async () => {
  home = await realpath(await mkdtemp(join(tmpdir(), 'queue-tea-live-')))
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
  await git('branch', 'task/mine')
  const log = createLogger('dev', () => {})
  deps = { host: nodeHost(log, async () => ({ exitCode: 0, stdout: '', stderr: '' })), home, now: () => NOW, log, offsetMinutes: () => 60, newId: () => 'q-1', terminal: async () => 'terminal', copy: () => {} }
})

afterEach(() => rm(home, { recursive: true, force: true }))

describe('what git says about the active quest', () => {
  it('has nothing to say with no active quest', async () => {
    await seed({ tasks: [makeTask({ id: 'one' })] })

    expect(await facts()).toEqual({ drift: [], mismatch: null, warning: null })
  })

  it('has nothing to say on the quest\'s own branch', async () => {
    await git('switch', 'task/mine')
    await seed({ tasks: [makeTask({ id: 'one', state: 'current', branch: 'task/mine' })] })

    expect(await facts()).toEqual({ drift: [], mismatch: null, warning: null })
  })

  it('says when the quest\'s branch has gone', async () => {
    await seed({ tasks: [makeTask({ id: 'one', state: 'current', branch: 'task/gone' })] })

    expect((await facts()).drift).toEqual(['The branch task/gone is gone.'])
  })

  it('says when another branch is checked out', async () => {
    await seed({ tasks: [makeTask({ id: 'one', state: 'current', branch: 'task/mine' })] })

    expect((await facts()).mismatch).toEqual({ on: 'main', branch: 'task/mine', uncommitted: null })
  })

  it('gives what holds a switch back', async () => {
    await writeFile(join(repo, 'a.txt'), 'changed\n')
    await seed({ tasks: [makeTask({ id: 'one', state: 'current', branch: 'task/mine' })] })

    expect((await facts()).mismatch).toEqual({ on: 'main', branch: 'task/mine', uncommitted: '1 file not committed' })
  })

  it('has nothing to say on a detached HEAD, or outside a repository, about a branch', async () => {
    await seed({ tasks: [makeTask({ id: 'one', state: 'current', branch: null })] })

    expect((await facts()).mismatch).toBeNull()
  })
})

describe('the commit warning', () => {
  it('reads it from the session', async () => {
    await session('During the last turn a commit appeared.')
    await seed({ tasks: [] })

    expect((await facts()).warning).toBe('During the last turn a commit appeared.')
  })

  it('ignores a session gone stale', async () => {
    await session('Old news.', NOW - 91_000)
    await seed({ tasks: [] })

    expect((await facts()).warning).toBeNull()
  })

  it('reads a session from before the field existed', async () => {
    await session(null)
    await seed({ tasks: [] })

    expect((await facts()).warning).toBeNull()
  })
})

describe('Switch', () => {
  it('goes to the quest\'s branch', async () => {
    await seed({ tasks: [makeTask({ id: 'one', state: 'current', branch: 'task/mine' })] })

    data(await switchBranch(deps, KEY))

    expect(await git('branch', '--show-current')).toBe('task/mine')
  })

  it('stays put with work uncommitted, and says so', async () => {
    await writeFile(join(repo, 'a.txt'), 'changed\n')
    await seed({ tasks: [makeTask({ id: 'one', state: 'current', branch: 'task/mine' })] })

    expect(await switchBranch(deps, KEY)).toEqual({ ok: false, error: { message: '1 file not committed: commit or stash first, then Switch.' } })
    expect(await git('branch', '--show-current')).toBe('main')
  })

  it('refuses with no active quest', async () => {
    await seed({ tasks: [] })

    expect((await switchBranch(deps, KEY)).ok).toBe(false)
  })
})

describe('Time I have', () => {
  const twoQuests = [makeTask({ id: 'long', priority: 'urgent', difficulty: { expected: 'hard', actual: null } }), makeTask({ id: 'short', priority: 'low', difficulty: { expected: 'light', actual: null } })]
  const starOf = (view: unknown) => (view as { ready: { quest: { id: string; isStar: boolean } }[] }).ready.find(entry => entry.quest.isStar)?.quest.id

  afterEach(() => setTimeBudget(deps, KEY, null))

  it('ranks what fits first, and says it is set', async () => {
    await seed({ tasks: twoQuests })

    const view = data(await setTimeBudget(deps, KEY, 30))

    expect(starOf(view)).toBe('short')
    expect(view).toMatchObject({ budget: 30 })
  })

  it('holds through a read', async () => {
    await seed({ tasks: twoQuests })
    await setTimeBudget(deps, KEY, 30)

    expect(starOf(data(await readProject(deps, KEY)))).toBe('short')
  })

  it('holds through an edit, so the ★ doesn\'t jump', async () => {
    await seed({ tasks: twoQuests })
    await setTimeBudget(deps, KEY, 30)

    expect(starOf(data(await setPriority(deps, KEY, 'long', 'high')))).toBe('short')
  })

  it('goes back to any', async () => {
    await seed({ tasks: twoQuests })
    await setTimeBudget(deps, KEY, 30)

    expect(starOf(data(await setTimeBudget(deps, KEY, null)))).toBe('long')
  })

  it('refuses an amount it doesn\'t offer', async () => {
    await seed({ tasks: twoQuests })

    expect((await setTimeBudget(deps, KEY, 45)).ok).toBe(false)
  })

  it('is written nowhere', async () => {
    await seed({ tasks: twoQuests })
    const before = await readFile(file, 'utf8')

    await setTimeBudget(deps, KEY, 30)

    expect(await readFile(file, 'utf8')).toBe(before)
  })
})

describe('filling a quest in from its checkpoint', () => {
  it('offers the goal and acceptance criteria on the row', async () => {
    await seed({ tasks: [makeTask({ id: 'one', checkpoint: { ...emptyCheckpoint(), written: 'x', goal: 'Fix the docs', acceptance: ['Docs build'] } })] })

    const view = data(await readProject(deps, KEY))
    if (view.kind !== 'readable') throw new Error('should read')

    expect(view.ready[0]!.quest).toMatchObject({ goal: 'Fix the docs', acceptance: ['Docs build'] })
  })

  it('has nothing to offer with no checkpoint', async () => {
    await seed({ tasks: [makeTask({ id: 'one' })] })

    const view = data(await readProject(deps, KEY))
    if (view.kind !== 'readable') throw new Error('should read')

    expect(view.ready[0]!.quest).toMatchObject({ goal: null, acceptance: [] })
  })
})
