import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import type { ProjectRecord, Task } from '../../../../../types'
import { emptyRecord, parseRecord } from '../../../../../hooks/shared/records/data/datasources/record_source'
import type { NewQuest, ProjectView } from '../../../../shared/engine_api'
import { createLogger } from '../../../core/logger'
import { nodeHost } from '../../../core/node_host'
import * as api from './tasks_api'
import type { TasksDeps } from './scope'

const KEY = 'demo-abc123'
const NOW = Date.parse('2026-10-27T17:50:00Z')
let home: string
let file: string
let deps: TasksDeps
const logged: string[] = []
let ids = 0

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

const seed = (tasks: Task[], over: Partial<ProjectRecord> = {}) => writeFile(file, JSON.stringify({ ...emptyRecord('demo', '/p/demo'), tasks, ...over }))

const onDisk = async () => {
  const read = parseRecord(await readFile(file, 'utf8'))
  if (read === 'unreadable') throw new Error('should read')

  return read
}
const stored = async (id: string) => (await onDisk()).tasks.find(t => t.id === id)!

const viewOf = (reply: { ok: boolean; data?: ProjectView }) => {
  if (!reply.ok || reply.data?.kind !== 'readable') throw new Error(`should succeed: ${JSON.stringify(reply)}`)

  return reply.data
}

const quest = (over: Partial<NewQuest> = {}): NewQuest => ({ title: 'New one', priority: 'mid', difficulty: 'medium', parent: { kind: 'none' }, description: null, criteria: [], helpers: ['tea-dd'], ...over })

beforeEach(async () => {
  home = await mkdtemp(join(tmpdir(), 'queue-tea-tasks-'))
  await mkdir(join(home, '.queue-tea/projects'), { recursive: true })
  file = `${home}/.queue-tea/projects/${KEY}.json`
  logged.length = 0
  const log = createLogger('dev', line => logged.push(line))
  deps = { host: nodeHost(log, async () => ({ exitCode: 0, stdout: '', stderr: '' })), home, now: () => NOW, log, offsetMinutes: () => 60, newId: () => `t-new${(ids += 1)}`, terminal: async () => 'terminal', copy: () => {} }
})
afterEach(() => rm(home, { recursive: true, force: true }))

describe('priority', () => {
  it('writes the record and hands back the realm', async () => {
    await seed([task({ id: 'a' }), task({ id: 'b', priority: 'low' })])

    const view = viewOf(await api.setPriority(deps, KEY, 'b', 'urgent'))

    expect((await stored('b')).priority).toBe('urgent')
    expect(view.ready[0]?.quest.id).toBe('b')
  })

  it('refuses a priority that is not one', async () => {
    await seed([task({ id: 'a' })])

    expect(await api.setPriority(deps, KEY, 'a', 'whenever')).toMatchObject({ ok: false })
    expect((await stored('a')).priority).toBe('mid')
  })

  it('a quest gone from the board changes nothing', async () => {
    await seed([task({ id: 'a' })])
    const before = await readFile(file, 'utf8')

    viewOf(await api.setPriority(deps, KEY, 'gone', 'urgent'))

    expect(JSON.parse(await readFile(file, 'utf8')).tasks).toEqual(JSON.parse(before).tasks)
  })
})

describe('a record that stops reading', () => {
  it('refuses, says so and leaves the file alone', async () => {
    await writeFile(file, '{half a reco')

    const reply = await api.setPriority(deps, KEY, 'a', 'urgent')

    expect(reply).toEqual({ ok: false, error: { message: "This realm's record can't be read, so nothing was changed." } })
    expect(await readFile(file, 'utf8')).toBe('{half a reco')
  })

  it('a newer record is left alone too', async () => {
    const newer = JSON.stringify({ version: 2, tasks: [] })
    await writeFile(file, newer)

    expect(await api.removeQuest(deps, KEY, 'a')).toMatchObject({ ok: false })
    expect(await readFile(file, 'utf8')).toBe(newer)
  })

  it('a key that could leave the folder is refused', async () => {
    expect(await api.togglePlayNext(deps, '../../etc/passwd', 'a')).toMatchObject({ ok: false, error: { message: "That realm isn't one Queue-tea knows. Pick one from the list." } })
  })
})

describe('filing', () => {
  it('files a quest and never starts it', async () => {
    await seed([])

    const view = viewOf(await api.fileQuest(deps, KEY, quest({ title: '  Spaced  ', description: ' Why ', criteria: [' Passes ', ' '] })))

    expect(view.active).toBe(null)
    expect(await onDisk()).toMatchObject({ tasks: [{ title: 'Spaced', state: 'queued', description: 'Why', criteria: ['Passes'], messages: ['Spaced'] }] })
  })

  it('files with the helpers chosen, once each, in list order', async () => {
    await seed([])

    await api.fileQuest(deps, KEY, quest({ helpers: ['tea-dd', 'commit-chai-n', 'tea-dd'] }))

    expect((await onDisk()).tasks[0]?.helpers.on).toEqual(['commit-chai-n', 'tea-dd'])
  })

  it('files a chapter under a saga', async () => {
    await seed([task({ id: 'saga' })])

    await api.fileQuest(deps, KEY, quest({ parent: { kind: 'task', id: 'saga' } }))

    expect((await onDisk()).tasks[1]?.parentId).toBe('saga')
  })

  it('files a new saga with its first chapter', async () => {
    await seed([])

    await api.fileQuest(deps, KEY, quest({ title: 'Chapter', parent: { kind: 'new', title: 'Saga' } }))

    const { tasks } = await onDisk()
    expect(tasks.map(t => t.title)).toEqual(['Saga', 'Chapter'])
    expect(tasks[1]?.parentId).toBe(tasks[0]?.id)
  })

  it('a saga that went since the sheet opened is refused, in the engine’s words', async () => {
    await seed([task({ id: 'saga', state: 'done' })])

    expect(await api.fileQuest(deps, KEY, quest({ parent: { kind: 'task', id: 'saga' } }))).toEqual({ ok: false, error: { message: 'That saga is no longer open. Pick again.' } })
    expect((await onDisk()).tasks).toHaveLength(1)
  })

  it.each([
    [{ title: '   ' }, 'Title is required.'],
    [{ title: 'x'.repeat(201) }, 'Title must be 200 characters or fewer.'],
    [{ parent: { kind: 'new' as const, title: ' ' } }, 'Title is required.'],
    [{ helpers: ['general-purpose'] }, "That value isn't one Queue-tea can use. Pick another."],
    [{ helpers: 'tea-dd' }, "That value isn't one Queue-tea can use. Pick another."],
  ])('refuses %j', async (over, message) => {
    await seed([])

    expect(await api.fileQuest(deps, KEY, quest(over as Partial<NewQuest>))).toEqual({ ok: false, error: { message } })
    expect((await onDisk()).tasks).toEqual([])
  })
})

describe('moving', () => {
  it('moves a quest under a saga and back', async () => {
    await seed([task({ id: 'saga' }), task({ id: 'a' })])

    await api.moveQuest(deps, KEY, 'a', 'saga')
    expect((await stored('a')).parentId).toBe('saga')

    await api.moveQuest(deps, KEY, 'a', null)
    expect((await stored('a')).parentId).toBe(null)
  })

  it('a move the engine refuses shows its sentence and changes nothing', async () => {
    await seed([task({ id: 'saga' }), task({ id: 'chapter', parentId: 'saga' }), task({ id: 'other' })])

    const reply = await api.moveQuest(deps, KEY, 'saga', 'other')

    expect(reply).toEqual({ ok: false, error: { message: "saga has chapters of its own, so it can't be part of another saga." } })
    expect((await stored('saga')).parentId).toBe(null)
  })
})

describe('sealing', () => {
  it('seals with a reason and clears Play next', async () => {
    await seed([task({ id: 'a' })], { playNext: 'a' })

    const view = viewOf(await api.sealQuest(deps, KEY, 'a', { reason: ' waiting for the clinic ' }))

    expect((await stored('a')).blockedReason).toBe('waiting for the clinic')
    expect((await onDisk()).playNext).toBe(null)
    expect(view.sealedCount).toBe(1)
  })

  it('seals to wait for another, and unseals', async () => {
    await seed([task({ id: 'a' }), task({ id: 'b' })])

    await api.sealQuest(deps, KEY, 'a', { waitFor: 'b' })
    expect((await stored('a')).blockedBy).toEqual(['b'])

    await api.unsealQuest(deps, KEY, 'a')
    expect((await stored('a')).blockedBy).toEqual([])
  })

  it('refuses a wait that would loop', async () => {
    await seed([task({ id: 'a', blockedBy: ['b'] }), task({ id: 'b' })])

    expect(await api.sealQuest(deps, KEY, 'b', { waitFor: 'a' })).toEqual({ ok: false, error: { message: 'That would make the two quests wait for each other.' } })
  })

  it('wants a quest or a reason', async () => {
    await seed([task({ id: 'a' })])

    expect(await api.sealQuest(deps, KEY, 'a', { reason: '  ' })).toEqual({ ok: false, error: { message: 'Pick a quest to wait for, or write a reason.' } })
  })

  it('asks for the active quest to go back first', async () => {
    await seed([task({ id: 'a', state: 'current' })])

    expect(await api.sealQuest(deps, KEY, 'a', { reason: 'x' })).toMatchObject({ ok: false, error: { message: 'Put the active quest back on the board first, then seal it.' } })
  })
})

describe('removing', () => {
  it('removes a quest, and restore brings it back', async () => {
    await seed([task({ id: 'a' })])

    expect(viewOf(await api.removeQuest(deps, KEY, 'a')).ready).toEqual([])
    expect((await stored('a')).state).toBe('removed')

    expect(viewOf(await api.restoreQuest(deps, KEY, 'a')).ready).toHaveLength(1)
  })

  it('removing a saga sets its chapters free', async () => {
    await seed([task({ id: 'saga' }), task({ id: 'chapter', parentId: 'saga' })])

    await api.removeQuest(deps, KEY, 'saga')

    expect((await stored('chapter')).parentId).toBe(null)
  })

  it('leaves the active quest alone', async () => {
    await seed([task({ id: 'a', state: 'current' })])

    await api.removeQuest(deps, KEY, 'a')

    expect((await stored('a')).state).toBe('current')
  })
})

describe('the rest', () => {
  it('Play next turns on and off', async () => {
    await seed([task({ id: 'a' })])

    expect(viewOf(await api.togglePlayNext(deps, KEY, 'a')).ready[0]?.quest.isPlayNext).toBe(true)
    expect(viewOf(await api.togglePlayNext(deps, KEY, 'a')).ready[0]?.quest.isPlayNext).toBe(false)
  })

  it('edits only what it was given', async () => {
    await seed([task({ id: 'a', description: 'Kept' })])

    await api.editQuest(deps, KEY, 'a', { title: ' New ', difficulty: 'hard' })

    expect(await stored('a')).toMatchObject({ title: 'New', description: 'Kept', difficulty: { expected: 'hard' } })
  })

  it('edits the helpers', async () => {
    await seed([task({ id: 'a' })])

    const view = viewOf(await api.editQuest(deps, KEY, 'a', { helpers: ['chai-pter'] }))

    expect((await stored('a')).helpers.on).toEqual(['chai-pter'])
    expect(view.ready[0]?.quest.helpers).toEqual(['chai-pter'])
  })

  it('an edit with an unknown helper is refused and changes nothing', async () => {
    await seed([task({ id: 'a' })])

    expect(await api.editQuest(deps, KEY, 'a', { helpers: ['general-purpose'] } as never)).toEqual({ ok: false, error: { message: "That value isn't one Queue-tea can use. Pick another." } })
    expect((await stored('a')).helpers.on).toEqual(['tea-dd'])
  })

  it('an empty description clears it, and a blank title is refused', async () => {
    await seed([task({ id: 'a', description: 'Gone' })])

    await api.editQuest(deps, KEY, 'a', { description: '   ' })
    expect((await stored('a')).description).toBe(null)

    expect(await api.editQuest(deps, KEY, 'a', { title: ' ' })).toEqual({ ok: false, error: { message: 'Title is required.' } })
  })

  it('makes a saga active and turns it off', async () => {
    await seed([task({ id: 'a' })])

    expect(viewOf(await api.setActiveSaga(deps, KEY, 'a')).activeSagaId).toBe('a')
    expect(viewOf(await api.setActiveSaga(deps, KEY, null)).activeSagaId).toBe(null)
  })

  it('a chapter cannot be the active saga', async () => {
    await seed([task({ id: 'saga' }), task({ id: 'chapter', parentId: 'saga' })])

    expect(await api.setActiveSaga(deps, KEY, 'chapter')).toMatchObject({ ok: false })
    expect((await onDisk()).feature).toBe(null)
  })
})

describe('what the forms offer', () => {
  it('offers open sagas, lone quests, and for a quest only what it can take', async () => {
    await seed([
      task({ id: 'saga', title: 'Saga' }),
      task({ id: 'chapter', parentId: 'saga' }),
      task({ id: 'lone' }),
      task({ id: 'won', state: 'done' }),
      task({ id: 'waits', blockedBy: ['lone'] }),
    ])

    const choices = await api.readChoices(deps, KEY, 'lone')

    if (!choices.ok) throw new Error('should read')
    expect(choices.data.features.map(c => c.id)).toEqual(['saga'])
    expect(choices.data.features[0]?.detail).toContain('0/1')
    expect(choices.data.lone.map(c => c.id)).toContain('lone')
    expect(choices.data.parents.map(c => c.id)).not.toContain('lone')
    expect(choices.data.parents.map(c => c.id)).not.toContain('chapter')
    // Waiting for what already waits for it would close a loop.
    expect(choices.data.waitFor.map(c => c.id)).not.toContain('waits')
    expect(choices.data.waitFor.map(c => c.id)).not.toContain('won')
  })
})

describe('the engine in the game\'s words', () => {
  it('leaves a title that holds the same words alone', async () => {
    await seed([task({ id: 'x', title: 'Fix the task log' }), task({ id: 'chapter', parentId: 'x' }), task({ id: 'other' })])

    expect(await api.moveQuest(deps, KEY, 'x', 'other')).toEqual({ ok: false, error: { message: "Fix the task log has chapters of its own, so it can't be part of another saga." } })
  })
})

describe('both sides of the record', () => {
  it('everything the app writes keeps fields it does not know', async () => {
    await writeFile(file, JSON.stringify({ ...emptyRecord('demo', '/p/demo'), fromTheMod: 1, tasks: [{ ...task({ id: 'a' }), fromTheMod: 2 }] }))

    await api.setPriority(deps, KEY, 'a', 'high')
    await api.fileQuest(deps, KEY, quest())
    await api.editQuest(deps, KEY, 'a', { title: 'Still here' })

    const raw = JSON.parse(await readFile(file, 'utf8'))
    expect(raw.fromTheMod).toBe(1)
    expect(raw.tasks[0].fromTheMod).toBe(2)
    expect(parseRecord(await readFile(file, 'utf8'))).not.toBe('unreadable')
  })

  it('leaves no lock or temp file behind', async () => {
    await seed([task({ id: 'a' })])

    await api.setPriority(deps, KEY, 'a', 'high')

    expect((await deps.host.list(`${home}/.queue-tea/projects`)).sort()).toEqual([`${KEY}.json`, `${KEY}.json.bak`])
    expect(await deps.host.exists(`${file}.lock`)).toBe(false)
  })
})
