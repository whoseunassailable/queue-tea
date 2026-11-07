import { createHash } from 'node:crypto'
import { mkdir, mkdtemp, readdir, readFile, realpath, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { emptyRecord, parseRecord } from '../../../../../hooks/shared/records/data/datasources/record_source'
import type { Reply } from '../../../../shared/engine_api'
import type { NoteChange, NotesView } from '../../../../shared/notes'
import { createLogger } from '../../../core/logger'
import { nodeHost } from '../../../core/node_host'
import { notesApi } from './notes_api'
import type { NotesDeps } from './notes_api'

const KEY = 'demo-abc123'
const NOW = Date.parse('2026-11-07T12:00:00Z')

let home: string
let dir: string
let api: ReturnType<typeof notesApi>
let deps: NotesDeps
let ids: number
const revealed: string[] = []

const data = <T>(answer: Reply<T>): T => {
  if (!answer.ok) throw new Error(`should succeed: ${answer.error.message}`)

  return answer.data
}
const refused = <T>(answer: Reply<T>): string => {
  if (answer.ok) throw new Error('should be refused')

  return answer.error.message
}
const change = (over: Partial<NoteChange> = {}): NoteChange => ({ title: 'Plan', folder: 'Ideas', tags: [], body: 'Body', ...over })
const created = async (over: Partial<NoteChange> = {}) => data(await api.createNote(KEY, change(over)))
const only = (view: NotesView, id: string) => view.notes.find(n => n.id === id)!

beforeEach(async () => {
  home = await realpath(await mkdtemp(join(tmpdir(), 'queue-tea-notes-')))
  dir = join(home, '.queue-tea/notes', KEY)
  ids = 0
  await mkdir(join(home, '.queue-tea/projects'), { recursive: true })
  await writeFile(join(home, '.queue-tea/projects', `${KEY}.json`), JSON.stringify(emptyRecord('demo', '/p/demo')))
  const log = createLogger('dev', () => {})
  const host = nodeHost(log, async () => ({ exitCode: 0, stdout: '', stderr: '' }))
  deps = { host, home, now: () => NOW, offsetMinutes: () => 60, log, newId: () => `t-${(ids += 1)}`, newNoteId: () => `n-${(ids += 1)}`, terminal: async () => 'terminal', copy: () => {}, prepareCodex: async () => [], reveal: path => void revealed.push(path) }
  api = notesApi(deps)
})

afterEach(() => rm(home, { recursive: true, force: true }))

describe('reading notes', () => {
  it('a realm with no notes yet has none, and says where they will live', async () => {
    expect(data(await api.readNotes(KEY))).toEqual({ notes: [], unreadable: [], folder: dir })
  })

  it('refuses a realm Queue-tea does not know, and a key that could leave the folder', async () => {
    expect(refused(await api.readNotes('other-abc123'))).toBe("That realm isn't one Queue-tea knows. Pick one from the list.")
    expect(refused(await api.readNotes('../x'))).toBe("That realm isn't one Queue-tea knows. Pick one from the list.")
  })

  it('reads notes made elsewhere, newest first, and skips what is not a note', async () => {
    await mkdir(dir, { recursive: true })
    await writeFile(join(dir, 'Old idea.md'), '---\ntitle: Old idea\nupdated: 2026-01-01T00:00:00\n---\nText')
    await writeFile(join(dir, 'New.md'), 'No front matter')
    await writeFile(join(dir, 'New.md.bak'), 'a backup')
    await writeFile(join(dir, '.hidden.md'), 'hidden')
    const view = data(await api.readNotes(KEY))

    expect(view.notes.map(n => [n.id, n.title])).toEqual([
      ['New', 'New'],
      ['Old idea', 'Old idea'],
    ])
  })
})

describe('opening a link', () => {
  it('opens web and email links, and refuses every other kind', async () => {
    expect(data(await api.openLink('https://example.com/a?b=1'))).toBeNull()
    expect(data(await api.openLink('mailto:rohan@example.com'))).toBeNull()

    for (const url of ['file:///etc/passwd', 'javascript:alert(1)', 'not a url', 7, 'https://x/' + 'a'.repeat(2050)]) expect(refused(await api.openLink(url))).toBe('Queue-tea opens only web and email links from a note.')
  })
})

describe('showing the folder', () => {
  it('makes the realm’s notes folder if needed, and shows it in Finder', async () => {
    expect(data(await api.showNotes(KEY))).toBeNull()

    expect(revealed.at(-1)).toBe(dir)
    expect(await readdir(dir)).toEqual([])
  })
})

describe('writing notes', () => {
  it('creates a note as Markdown with front matter', async () => {
    const { view, id } = await created({ tags: ['ignored'] })

    expect(id).toBe('n-1')
    expect(only(view, id)).toMatchObject({ title: 'Plan', folder: 'Ideas', tags: [], created: '2026-11-07T13:00:00+01:00', quests: [], body: 'Body' })
    expect(await readFile(join(dir, 'n-1.md'), 'utf8')).toBe('---\ntitle: "Plan"\nfolder: "Ideas"\ntags: []\ncreated: "2026-11-07T13:00:00+01:00"\nupdated: "2026-11-07T13:00:00+01:00"\narchived: false\nquests: []\naliases: ["Plan"]\n---\nBody')
  })

  it('checks a note as the editor does', async () => {
    expect(refused(await api.createNote(KEY, change({ title: '  ' })))).toBe('Title is required.')
    expect(refused(await api.createNote(KEY, change({ title: 'A [[link]]' })))).toBe("A note title can't have [ ] | or # in it, because links are made of them.")
    expect(refused(await api.createNote(KEY, change({ title: 'x'.repeat(201) })))).toBe('A note title can be 200 characters at most.')
    expect(refused(await api.createNote(KEY, change({ folder: 'a/b' })))).toBe('A folder is one level, so leave out /.')
    expect(await readdir(home + '/.queue-tea')).not.toContain('notes')
  })

  it('keeps titles unique among live notes: a new one is numbered, a rename is refused', async () => {
    const first = await created({ title: 'Plan' })
    const second = await created({ title: 'plan' })
    expect(only(second.view, second.id).title).toBe('plan 2')

    expect(refused(await api.saveNote(KEY, second.id, change({ title: 'PLAN' }), only(second.view, second.id).stamp))).toBe('A note called “PLAN” already exists. Pick another title.')
    // A note that already shares its title, as one from Obsidian might, still saves its text.
    expect(data(await api.saveNote(KEY, first.id, change({ title: 'Plan', body: 'More' }), only(second.view, first.id).stamp)).kind).toBe('saved')
  })

  it('a note restored while another has its title comes back numbered', async () => {
    const old = await created({ title: 'Plan' })
    await api.archiveNote(KEY, old.id, true)
    await created({ title: 'Plan' })

    expect(only(data(await api.archiveNote(KEY, old.id, false)), old.id).title).toBe('Plan 2')
  })

  it('saves over the file it read, and refuses to when the file has changed', async () => {
    const { view, id } = await created()
    const saved = data(await api.saveNote(KEY, id, change({ body: 'New', tags: ['#idea', 'idea', ' '] }), only(view, id).stamp))
    if (saved.kind !== 'saved') throw new Error('should save')
    expect(saved.note).toMatchObject({ body: 'New', tags: ['idea'] })

    expect(data(await api.saveNote(KEY, id, change({ body: 'Stale' }), only(view, id).stamp))).toEqual({ kind: 'changed', note: saved.note })
    await rm(join(dir, `${id}.md`))
    expect(data(await api.saveNote(KEY, id, change(), saved.note.stamp))).toEqual({ kind: 'changed', note: null })
  })

  it('keeps each save in hidden history, including the first, across reopening the API', async () => {
    const { view, id } = await created()
    await api.saveNote(KEY, id, change({ body: 'Second' }), only(view, id).stamp)
    api = notesApi(deps)
    const history = data(await api.readNoteHistory(KEY, id))
    expect(history).toHaveLength(2)
    expect(data(await api.readNoteVersion(KEY, id, history[0]!.id)).body).toBe('Second')
    expect(data(await api.readNoteVersion(KEY, id, history[1]!.id)).body).toBe('Body')
    expect(data(await api.readNotes(KEY)).notes).toHaveLength(1)
    expect(await readdir(dir)).not.toContain(`${id}.md.bak`)
  })

  it('renaming a note rewrites the links to it, unless the old title is shared', async () => {
    const target = await created({ title: 'Plan' })
    const linking = await created({ title: 'Linking', body: 'See [[Plan]] and [[plan|this]].' })
    const view = data(await api.saveNote(KEY, target.id, change({ title: 'Roadmap' }), only(target.view, target.id).stamp))
    if (view.kind !== 'saved') throw new Error('should save')
    expect(only(view.view, linking.id).body).toBe('See [[Roadmap]] and [[Roadmap|this]].')
    expect(view.relinked).toBe(1)

    // Only a file made outside the app can share a title.
    await writeFile(join(dir, 'Roadmap copy.md'), '---\ntitle: Roadmap\n---\n')
    const again = data(await api.readNotes(KEY))
    await api.saveNote(KEY, target.id, change({ title: 'Third' }), only(again, target.id).stamp)
    expect(only(data(await api.readNotes(KEY)), linking.id).body).toBe('See [[Roadmap]] and [[Roadmap|this]].')
  })

  it('archives, restores, and deletes only an archived note', async () => {
    const { id } = await created()
    expect(refused(await api.deleteNote(KEY, id))).toBe('Archive the note first. Only archived notes can be deleted.')
    expect(only(data(await api.archiveNote(KEY, id, true)), id).isArchived).toBe(true)
    expect(data(await api.deleteNote(KEY, id)).notes).toEqual([])
    expect(await readdir(dir)).toEqual(['.history'])
    expect(await readdir(join(dir, '.history'))).toEqual([])
    expect(refused(await api.archiveNote(KEY, id, false))).toBe("That note isn't there any more. Pick another from the list.")
  })

  it('refuses a note id that could leave the folder', async () => {
    expect(refused(await api.archiveNote(KEY, '../../projects/demo-abc123', true))).toBe("That note isn't one Queue-tea can open. Pick another from the list.")
  })
})

describe('note history', () => {
  it('repairs a damaged recovery point before replacing the live note', async () => {
    const { view, id } = await created()
    const first = data(await api.readNoteHistory(KEY, id))[0]!
    await writeFile(join(dir, '.history', id, `${first.id}.md`), 'Damaged')
    await api.saveNote(KEY, id, change({ body: 'Next' }), only(view, id).stamp)
    const versions = data(await api.readNoteHistory(KEY, id))
    expect(data(await api.readNoteVersion(KEY, id, versions[1]!.id)).body).toBe('Body')
  })

  it('a failed snapshot or live-file replacement keeps the existing note readable', async () => {
    const { view, id } = await created()
    const path = join(dir, `${id}.md`)
    const original = await readFile(path, 'utf8')
    api = notesApi({ ...deps, host: { ...deps.host, write: async (to, text) => {
      if (to.includes('/.history/')) throw new Error('disk full')
      await deps.host.write(to, text)
    } } })
    expect((await api.saveNote(KEY, id, change({ body: 'Unsaved' }), only(view, id).stamp)).ok).toBe(false)
    expect(await readFile(path, 'utf8')).toBe(original)
    expect(data(await api.readNoteHistory(KEY, id))).toHaveLength(1)
    api = notesApi({ ...deps, host: { ...deps.host, move: async (from, to) => to === path ? { exitCode: 1, stdout: '', stderr: 'disk failure' } : deps.host.move(from, to) } })
    expect((await api.saveNote(KEY, id, change({ body: 'Recoverable attempt' }), only(view, id).stamp)).ok).toBe(false)
    expect(await readFile(path, 'utf8')).toBe(original)
    api = notesApi(deps)
    const versions = data(await api.readNoteHistory(KEY, id))
    expect(data(await api.readNoteVersion(KEY, id, versions[0]!.id)).body).toBe('Recoverable attempt')
  })

  it('saving over an external edit preserves it as a recovery point', async () => {
    const { id } = await created()
    await writeFile(join(dir, `${id}.md`), 'Written outside')
    const current = only(data(await api.readNotes(KEY)), id)
    await api.saveNote(KEY, id, change({ body: 'Kept mine' }), current.stamp)
    const versions = data(await api.readNoteHistory(KEY, id))
    expect(versions).toHaveLength(3)
    expect(data(await api.readNoteVersion(KEY, id, versions[1]!.id)).body).toBe('Written outside')
  })

  it('an imported note has no history until saving, which also preserves its original file and legacy backup', async () => {
    await mkdir(dir, { recursive: true })
    await writeFile(join(dir, 'Imported.md'), 'Original from Obsidian')
    await writeFile(join(dir, 'Imported.md.bak'), 'Older backup')
    expect(data(await api.readNoteHistory(KEY, 'Imported'))).toEqual([])
    const original = only(data(await api.readNotes(KEY)), 'Imported')
    await api.saveNote(KEY, 'Imported', change({ body: 'Edited here' }), original.stamp)
    const history = data(await api.readNoteHistory(KEY, 'Imported'))
    expect(await Promise.all(history.map(async version => data(await api.readNoteVersion(KEY, 'Imported', version.id)).body))).toEqual(['Edited here', 'Original from Obsidian', 'Older backup'])
    expect(await readdir(dir)).not.toContain('Imported.md.bak')
  })

  it('restores editable fields, keeps quest links and archive status, and can recover the replaced text', async () => {
    const { view, id } = await created({ body: 'Original', tags: [] })
    const first = data(await api.readNoteHistory(KEY, id))[0]!
    await api.saveNote(KEY, id, change({ title: 'Renamed', folder: 'Later', tags: ['later'], body: 'Latest' }), only(view, id).stamp)
    await api.fileNoteQuests(KEY, id, { parent: { kind: 'none' }, quests: [{ title: 'Do it', priority: 'mid', difficulty: 'medium', item: 'Do it' }] })
    const archived = only(data(await api.archiveNote(KEY, id, true)), id)
    const restored = data(await api.restoreNoteVersion(KEY, id, first.id, archived.stamp))
    if (restored.kind !== 'saved') throw new Error('should restore')
    expect(restored.note).toMatchObject({ title: 'Plan', folder: 'Ideas', tags: [], body: 'Original', isArchived: true, quests: archived.quests, created: archived.created })
    const history = data(await api.readNoteHistory(KEY, id))
    expect(data(await api.readNoteVersion(KEY, id, history[1]!.id))).toMatchObject({ body: 'Latest', quests: archived.quests, isArchived: true })
  })

  it('refuses a stale restore, and refused saves never add a version', async () => {
    const { view, id } = await created()
    const first = data(await api.readNoteHistory(KEY, id))[0]!
    await writeFile(join(dir, `${id}.md`), 'Changed outside')
    const stamp = only(view, id).stamp
    expect(data(await api.restoreNoteVersion(KEY, id, first.id, stamp)).kind).toBe('changed')
    expect(data(await api.saveNote(KEY, id, change(), stamp)).kind).toBe('changed')
    expect(data(await api.readNoteHistory(KEY, id))).toHaveLength(1)
    expect(await readFile(join(dir, `${id}.md`), 'utf8')).toBe('Changed outside')
  })

  it('restoring a renamed note updates backlinks, and a taken title gets the next number', async () => {
    const { view, id } = await created()
    const first = data(await api.readNoteHistory(KEY, id))[0]!
    await api.saveNote(KEY, id, change({ title: 'Roadmap' }), only(view, id).stamp)
    const linking = await created({ title: 'Links', body: 'See [[Roadmap]].' })
    let now = only(data(await api.readNotes(KEY)), id)
    const restored = data(await api.restoreNoteVersion(KEY, id, first.id, now.stamp))
    expect(restored.kind).toBe('saved')
    expect(only(data(await api.readNotes(KEY)), linking.id).body).toBe('See [[Plan]].')
    await api.archiveNote(KEY, id, true)
    await created()
    await api.archiveNote(KEY, id, false)
    now = only(data(await api.readNotes(KEY)), id)
    const numbered = data(await api.restoreNoteVersion(KEY, id, first.id, now.stamp))
    if (numbered.kind !== 'saved') throw new Error('should restore')
    expect(numbered.note.title).toBe('Plan 2')
  })

  it('checks realm, note and version ids before using them as paths, and reports missing or damaged versions', async () => {
    const { id } = await created()
    expect((await api.readNoteHistory('../outside', id)).ok).toBe(false)
    expect((await api.readNoteHistory(KEY, '../outside')).ok).toBe(false)
    for (const version of ['../../projects/demo-abc123', 42, 'v-not-a-version']) {
      expect((await api.readNoteVersion(KEY, id, version)).ok).toBe(false)
      expect((await api.restoreNoteVersion(KEY, id, version, 'stamp')).ok).toBe(false)
    }
    const first = data(await api.readNoteHistory(KEY, id))[0]!
    await writeFile(join(dir, '.history', id, `${first.id}.md`), 'Damaged')
    expect((await api.readNoteVersion(KEY, id, first.id)).ok).toBe(false)
    await rm(join(dir, '.history', id, `${first.id}.md`))
    expect((await api.readNoteVersion(KEY, id, first.id)).ok).toBe(false)
  })

  it('prunes frequent saves to a bounded history and keeps independently queued saves', async () => {
    const { view, id } = await created()
    const stamp = only(view, id).stamp
    const original = await readFile(join(dir, `${id}.md`), 'utf8')
    // A full on-disk history exercises pruning without 120 redundant saves.
    await Promise.all(Array.from({ length: 120 }, async (_, n) => {
      const text = original.replace('\nBody', `\nSave ${n}`)
      const hash = createHash('sha1').update(text).digest('hex')
      await writeFile(join(dir, '.history', id, `v-${NOW - 1000 + n}-${hash}.md`), text)
    }))
    const answers = await Promise.all([api.saveNote(KEY, id, change({ body: 'Writer one' }), stamp), api.saveNote(KEY, id, change({ body: 'Writer two' }), stamp)])
    expect(answers.map(answer => data(answer).kind)).toEqual(['saved', 'changed'])
    const history = data(await api.readNoteHistory(KEY, id))
    expect(history).toHaveLength(51)
    expect(data(await api.readNoteVersion(KEY, id, history[0]!.id)).body).toBe('Writer one')
    expect(await readdir(join(dir, '.history', id))).toHaveLength(history.length)
  })
})

describe('filing quests from a note', () => {
  const record = async () => {
    const read = parseRecord(await readFile(join(home, '.queue-tea/projects', `${KEY}.json`), 'utf8'))
    if (read === 'unreadable') throw new Error('should read')

    return read
  }

  it('files a new parent and its children, and links each to the note', async () => {
    const { id } = await created({ title: 'Bug Bounty Helper', body: 'A helper.\n\n- [ ] Scan\n- [ ] Report' })
    const filed = data(
      await api.fileNoteQuests(KEY, id, {
        parent: { kind: 'new', title: 'Bug Bounty Helper' },
        quests: [
          { title: 'Scan', priority: 'high', difficulty: 'hard', item: 'Scan' },
          { title: 'Report', priority: 'mid', difficulty: 'light', item: 'Report' },
        ],
      }),
    )
    const tasks = (await record()).tasks

    expect(tasks.map(t => [t.id, t.title, t.parentId])).toEqual([
      ['t-2', 'Bug Bounty Helper', null],
      ['t-3', 'Scan', 't-2'],
      ['t-4', 'Report', 't-2'],
    ])
    expect(tasks[1]).toMatchObject({ priority: 'high', description: 'From the note "Bug Bounty Helper" in Notes.' })
    expect(only(filed.view, id).quests).toEqual([
      { id: 't-2', item: null },
      { id: 't-3', item: 'Scan' },
      { id: 't-4', item: 'Report' },
    ])
    expect(filed.project.kind).toBe('readable')
  })

  it('a note with no checklist is one quest, described by its first paragraph', async () => {
    const { id } = await created({ title: 'Idea', body: '# Idea\n\nWhy it matters.' })
    await api.fileNoteQuests(KEY, id, { parent: { kind: 'none' }, quests: [{ title: 'Idea', priority: 'mid', difficulty: 'medium', item: null }] })

    expect((await record()).tasks[0]).toMatchObject({ title: 'Idea', parentId: null, description: 'From the note "Idea" in Notes.\n\nWhy it matters.' })
  })

  it('checks the quests and files nothing when one is wrong', async () => {
    const { id } = await created()

    expect(refused(await api.fileNoteQuests(KEY, id, { parent: { kind: 'none' }, quests: [] }))).toBe('Pick at least one quest to file.')
    expect(refused(await api.fileNoteQuests(KEY, id, { parent: { kind: 'none' }, quests: [{ title: ' ', priority: 'mid', difficulty: 'medium', item: null }] }))).toBe('Title is required.')
    expect((await record()).tasks).toEqual([])
  })

  it('never files a line twice, and puts new lines under the note’s open parent', async () => {
    const { id } = await created({ title: 'Saga', body: '- [ ] A\n- [ ] B' })
    const a = { title: 'A', priority: 'mid' as const, difficulty: 'medium' as const, item: 'A' }
    await api.fileNoteQuests(KEY, id, { parent: { kind: 'new', title: 'Saga' }, quests: [a] })
    const again = data(await api.fileNoteQuests(KEY, id, { parent: { kind: 'new', title: 'Saga' }, quests: [a, { ...a, title: 'B', item: 'B' }] }))

    expect((await record()).tasks.map(t => [t.title, t.parentId])).toEqual([
      ['Saga', null],
      ['A', 't-2'],
      ['B', 't-2'],
    ])
    expect(only(again.view, id).quests.map(q => q.item)).toEqual([null, 'A', 'B'])
  })

  it('once the note’s parent is done, new lines go under a new one', async () => {
    const { id } = await created({ title: 'Saga' })
    await api.fileNoteQuests(KEY, id, { parent: { kind: 'new', title: 'Saga' }, quests: [{ title: 'A', priority: 'mid', difficulty: 'medium', item: 'A' }] })
    const file = join(home, '.queue-tea/projects', `${KEY}.json`)
    const done = JSON.parse(await readFile(file, 'utf8'))
    done.tasks = done.tasks.map((t: { state: string }) => ({ ...t, state: 'done' }))
    await writeFile(file, JSON.stringify(done))
    await api.fileNoteQuests(KEY, id, { parent: { kind: 'new', title: 'Saga' }, quests: [{ title: 'B', priority: 'mid', difficulty: 'medium', item: 'B' }] })

    const tasks = (await record()).tasks
    expect(tasks.map(t => [t.title, t.parentId])).toEqual([
      ['Saga', null],
      ['A', 't-2'],
      ['Saga', null],
      ['B', 't-4'],
    ])
  })

  it('refuses a parent that is not open, and files nothing', async () => {
    const { id } = await created()
    const message = refused(await api.fileNoteQuests(KEY, id, { parent: { kind: 'task', id: 't-gone' }, quests: [{ title: 'A', priority: 'mid', difficulty: 'medium', item: 'A' }] }))

    expect(message).toMatch(/Pick again\.$/)
    expect(only(data(await api.readNotes(KEY)), id).quests).toEqual([])
  })
})
