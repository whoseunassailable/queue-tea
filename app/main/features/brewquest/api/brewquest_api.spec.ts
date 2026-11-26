import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { emptyRecord } from '../../../../../hooks/shared/records/data/datasources/record_source'
import type { BrewDraft } from '../../../../shared/brew_draft'
import type { BrewProgress, Reply } from '../../../../shared/engine_api'
import { NO_MEETING } from '../../../../shared/meetings'
import type { Note, NotesView } from '../../../../shared/notes'
import { createLogger } from '../../../core/logger'
import { MESSAGES } from '../../../core/messages'
import { nodeHost } from '../../../core/node_host'
import type { ProcessRequest, ProcessResult, streamProcess } from '../../../core/stream_process'
import { makeTask } from '../../tasks/api/fixtures'
import { BREW_REFUSED_TOOLS, brewquestApi } from './brewquest_api'

const KEY = 'demo-abc123'
const NOW = Date.parse('2026-11-07T12:00:00Z')
const line = (event: object) => `${JSON.stringify(event)}\n`
const INIT = line({ type: 'system', subtype: 'init', agents: ['claude', 'queue-tea:brewquest'] })
const GREP = line({ type: 'assistant', message: { content: [{ type: 'tool_use', name: 'Grep', input: { pattern: 'terminal' } }] } })
const DRAFT = { understood: 'Count terminal time.', groups: [{ parent: { new: 'Terminal time' }, quests: [{ key: 'q1', title: 'Count terminal time', priority: 'high', difficulty: 'medium', points: 5, criteria: ['Counts iTerm'], sources: [{ note: 'Plan', quote: 'Count terminal time' }] }] }] }
const answered = (value: unknown = DRAFT) => line({ type: 'result', subtype: 'success', is_error: false, result: `\`\`\`brewquest-draft\n${JSON.stringify(value)}\n\`\`\`` })
const ran = (exitCode: number, stderr = '', over: Partial<ProcessResult> = {}): ProcessResult => ({ exitCode, stdout: '', stderr, ...over })
const noteOf = (over: Partial<Note> = {}): Note => ({ id: 'n-1', title: 'Plan', folder: 'Ideas', type: null, isPinned: false, tags: [], created: '2026-11-01', updated: '2026-11-01', isArchived: false, quests: [], meeting: NO_MEETING, body: 'Count terminal time.\n\n- [ ] Scan logs', stamp: 's', ...over })

let home: string
let folder: string
let notes: Note[]
let told: BrewProgress[]
let requests: ProcessRequest[]
let script: (request: ProcessRequest, out: (chunk: string) => void) => Promise<ProcessResult>
let api: ReturnType<typeof brewquestApi>

const data = <T>(answer: Reply<T>): T => {
  if (!answer.ok) throw new Error(answer.error.message)

  return answer.data
}
const claude = (id = 'n-1', withLinked = false) => api.draftNoteQuests(KEY, id, { mode: 'claude', withLinked })
const untilStopped = (request: ProcessRequest) =>
  new Promise<ProcessResult>(done => {
    if (request.signal!.aborted) done(ran(130))
    else request.signal!.addEventListener('abort', () => done(ran(130)), { once: true })
  })
const isChecklist = (draft: BrewDraft, trouble: string | null) => {
  expect(draft.by).toBe('checklist')
  expect(draft.trouble).toBe(trouble)
  expect(draft.groups[0]!.quests.map(quest => quest.title)).toEqual(['Scan logs'])
}

beforeEach(async () => {
  home = await mkdtemp(join(tmpdir(), 'queue-tea-brewquest-'))
  folder = join(home, 'demo')
  await mkdir(join(home, '.queue-tea/projects'), { recursive: true })
  await mkdir(folder)
  await writeFile(join(folder, 'CLAUDE.md'), '# Demo')
  await writeFile(`${home}/.queue-tea/projects/${KEY}.json`, JSON.stringify({ ...emptyRecord('demo', folder), tasks: [makeTask({ id: 't-1', title: 'Sidebar polish' })] }))
  notes = [noteOf()]
  told = []
  requests = []
  script = async (_, out) => {
    out(INIT + GREP.slice(0, 30))
    out(GREP.slice(30) + answered())

    return ran(0)
  }
  const log = createLogger('dev', () => {})
  const stream = (async (_log, request, out) => {
    requests.push(request)

    return script(request, out ?? (() => {}))
  }) as typeof streamProcess
  let drafts = 0
  api = brewquestApi({
    host: nodeHost(log, async () => ran(0)),
    home,
    now: () => NOW,
    log,
    offsetMinutes: () => 60,
    newId: () => 't-new',
    terminal: async () => 'terminal',
    copy: () => {},
    stream,
    newDraftId: () => `d-test000${(drafts += 1)}`,
    readNotes: async () => ({ ok: true, data: { notes, unreadable: [], folder: '/n' } satisfies NotesView }),
    tell: progress => told.push(progress),
  })
})
afterEach(() => rm(home, { recursive: true, force: true }))

describe('drafting with Claude', () => {
  it('runs BrewQuest in the realm’s folder with read-only tools, and keeps every window told', async () => {
    const draft = data(await claude())

    expect(requests).toHaveLength(1)
    expect(requests[0]!.cwd).toBe(folder)
    expect(requests[0]!.argv.slice(0, 9)).toEqual(['claude', '-p', '--agent', 'queue-tea:brewquest', '--disallowedTools', BREW_REFUSED_TOOLS.join(','), '--output-format', 'stream-json', '--verbose'])
    expect(requests[0]!.argv.slice(9, 10)).toEqual(['--'])
    expect(requests[0]!.argv[10]).toContain('<note title="Plan">\nCount terminal time.')
    expect(requests[0]!.argv[10]).toContain(': CLAUDE.md.')
    expect(requests[0]!.argv[10]).toContain('t-1 | queued | mid | Sidebar polish')
    expect(requests[0]!.timeoutMs).toBe(8 * 60_000)
    expect(told.map(progress => [progress.noteId, progress.doing?.kind ?? null, progress.steps])).toEqual([
      ['n-1', null, 0],
      ['n-1', 'searching', 1],
    ])
    expect(draft).toMatchObject({ id: 'd-test0001', by: 'claude', understood: 'Count terminal time.', trouble: null, learned: [] })
    expect(draft.groups[0]!.quests[0]).toMatchObject({ key: 'd-test0001.q1', title: 'Count terminal time', points: 5, sources: [{ noteId: 'n-1', isFound: true }] })
    expect(api.isBusy()).toBe(false)
  })

  it('reads the notes beside it only when asked', async () => {
    notes = [noteOf({ body: 'See [[Research]].\n\n- [ ] Scan logs' }), noteOf({ id: 'n-2', title: 'Research', body: 'iTerm counts.' })]

    data(await claude())
    data(await claude('n-1', true))

    expect(requests[0]!.argv[10]).not.toContain('<note title="Research">')
    expect(requests[1]!.argv[10]).toContain('<note title="Research">\niTerm counts.\n</note>')
  })

  it('tells BrewQuest what past reviews in the realm showed, and the window too', async () => {
    await mkdir(join(home, '.queue-tea/brewquest'))
    await writeFile(join(home, '.queue-tea/brewquest', `${KEY}.json`), JSON.stringify([{ id: 'd-old00001', by: 'claude', proposed: 3, rejected: ['Old idea'], merged: 0, reused: 0, changed: [], at: '2026-11-01T10:00:00+01:00', filed: 2 }]))

    const draft = data(await claude())

    expect(draft.learned).toEqual(['Rohan reviewed 1 draft with 3 quests in this realm.', 'He turned down 1 quest, such as "Old idea".'])
    expect(requests[0]!.argv[10]).toContain('- He turned down 1 quest, such as "Old idea".')
  })

  it('drafts the checklist with no run when asked for it', async () => {
    isChecklist(data(await api.draftNoteQuests(KEY, 'n-1', { mode: 'checklist', withLinked: false })), null)
    expect(requests).toEqual([])
  })

  it('refuses an ask it can’t read, a note that isn’t there and a realm that isn’t', async () => {
    expect(await api.draftNoteQuests(KEY, 'n-1', { mode: 'magic', withLinked: false })).toEqual({ ok: false, error: { message: MESSAGES.badBrewAsk } })
    expect(await claude('n-9')).toEqual({ ok: false, error: { message: MESSAGES.unknownNote } })
    expect(await api.draftNoteQuests('other-abc123', 'n-1', { mode: 'claude', withLinked: false })).toEqual({ ok: false, error: { message: MESSAGES.unknownProject } })
  })
})

describe('when reading fails, the checklist with the reason', () => {
  it('says when Claude Code doesn’t have BrewQuest, and stops the run at once', async () => {
    script = async (request, out) => {
      out(line({ type: 'system', subtype: 'init', agents: ['claude'] }))

      return request.signal!.aborted ? ran(130) : ran(0)
    }

    isChecklist(data(await claude()), MESSAGES.brewMissing)
  })

  it('says when Claude Code isn’t installed, timed out, failed or answered something else', async () => {
    script = async () => ran(127, 'spawn claude ENOENT')
    isChecklist(data(await claude()), MESSAGES.brewNoClaude)

    script = async () => ran(143, '', { timedOut: true })
    isChecklist(data(await claude()), MESSAGES.brewTimedOut(8))

    script = async (_, out) => (out(INIT + line({ type: 'result', subtype: 'error_during_execution', is_error: true, result: '' })), ran(1))
    isChecklist(data(await claude()), MESSAGES.brewFailed)

    script = async (_, out) => (out(INIT + line({ type: 'result', subtype: 'success', is_error: false, result: 'I drafted three quests.' })), ran(0))
    isChecklist(data(await claude()), MESSAGES.brewUnreadable)
  })

  it('says when the realm’s folder is gone, with no run', async () => {
    await rm(folder, { recursive: true })

    isChecklist(data(await claude()), MESSAGES.brewFolderGone(folder))
    expect(requests).toEqual([])
  })
})

describe('one read at a time per realm', () => {
  it('refuses a second read while one runs, and stopping it gives the checklist', async () => {
    script = untilStopped
    const first = claude()
    await vi.waitFor(() => expect(api.isBusy()).toBe(true))

    expect(await claude()).toEqual({ ok: false, error: { message: MESSAGES.brewBusy } })
    data(await api.stopNoteDraft(KEY))

    isChecklist(data(await first), MESSAGES.brewStopped)
    expect(api.isBusy()).toBe(false)
    expect(data(await api.stopNoteDraft(KEY))).toBeNull()
  })
})
