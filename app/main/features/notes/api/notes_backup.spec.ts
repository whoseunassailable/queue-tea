import { chmod, mkdir, mkdtemp, readdir, readFile, realpath, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { emptyRecord } from '../../../../../hooks/shared/records/data/datasources/record_source'
import type { Reply } from '../../../../shared/engine_api'
import type { NoteChange, NotesExport, NotesRestore } from '../../../../shared/notes'
import { createLogger } from '../../../core/logger'
import { MESSAGES } from '../../../core/messages'
import { nodeHost } from '../../../core/node_host'
import { notesApi } from './notes_api'
import type { NotesDeps } from './notes_api'

const KEY = 'demo-abc123'
const OTHER = 'other-def456'
const NOW = Date.parse('2026-11-07T12:00:00Z')
const BACKUP = `Notes backup ${KEY} 2026-11-07`
const MANIFEST = 'queue-tea-notes.json'
const TEN_MB = 10 * 1024 * 1024
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aWQAAAABJRU5ErkJggg==', 'base64')
const PDF = Buffer.from('%PDF-1.4\n%%EOF\n')
// Front matter that never closes, with a Latin-1 é that isn't UTF-8.
const LOOSE = Buffer.concat([Buffer.from('---\ntitle: [unclosed\nCaf'), Buffer.from([0xe9]), Buffer.from('\n')])
const WINDOWS = '---\r\ntitle: Windows\r\n---\r\nLine one\r\nLine two\r\n'

let home: string
let dir: string
let outside: string
let ids: number
let chosen: string | null
let buttons: string[]
let deps: NotesDeps
let api: ReturnType<typeof notesApi>

const data = <T>(answer: Reply<T>): T => {
  if (!answer.ok) throw new Error(`should succeed: ${answer.error.message}`)

  return answer.data
}
const refused = <T>(answer: Reply<T>): string => {
  if (answer.ok) throw new Error('should be refused')

  return answer.error.message
}
const change = (over: Partial<NoteChange> = {}): NoteChange => ({ title: 'Plan', folder: 'Ideas', type: null, isPinned: false, tags: [], body: 'Body', ...over })
const created = async (over: Partial<NoteChange> = {}) => data(await api.createNote(KEY, change(over)))
const vaultOf = (key: string) => join(home, '.queue-tea/notes', key)

// Every entry under root by its path: a plain file's bytes, or what else it is.
const tree = async (root: string, prefix = ''): Promise<Record<string, Buffer | string>> => {
  const found: Record<string, Buffer | string> = {}
  for (const entry of await readdir(join(root, prefix), { withFileTypes: true }).catch(() => [])) {
    const path = prefix === '' ? entry.name : `${prefix}/${entry.name}`
    if (entry.isSymbolicLink()) found[path] = 'symlink'
    else if (entry.isDirectory()) Object.assign(found, await tree(root, path))
    else found[path] = await readFile(join(root, path))
  }

  return found
}
const historyCount = async (key: string) => Object.keys(await tree(vaultOf(key), '.history')).length

// A realm with what a vault holds: a live note, an archived one, one that
// won't parse, one with Windows line ends, a picture, a file at the top, and
// what a backup must leave behind.
const fillRealm = async () => {
  const plan = await created({ title: 'Plan', body: 'Live body' })
  const old = await created({ title: 'Old' })
  data(await api.archiveNote(KEY, old.id, true))
  const picture = data(await api.attachNoteFile(KEY, plan.id, { name: 'diagram.png', type: 'image/png', bytes: new Uint8Array(PNG) }))
  await writeFile(join(dir, 'Loose.md'), LOOSE)
  await writeFile(join(dir, 'Windows.md'), WINDOWS)
  await writeFile(join(dir, 'table.csv'), 'a,b\n1,2\n')
  await writeFile(join(dir, 'Draft.md.tmp'), 'half written')
  await writeFile(join(dir, 'Draft.md.bak'), 'an old save')
  await writeFile(join(dir, `${picture.path}.1234.tmp`), 'half a picture')
  await writeFile(join(dir, '.hidden.png'), PNG)
  await writeFile(join(dir, '.DS_Store'), 'finder')
  await mkdir(join(dir, 'sub'))
  await writeFile(join(dir, 'sub/inner.png'), PNG)
  await mkdir(join(dir, 'attachments/nested'))
  await writeFile(join(dir, 'attachments/nested/deep.png'), PNG)
  await writeFile(join(home, 'secret.png'), PNG)
  await writeFile(join(home, 'Secret.md'), 'private')
  await symlink(join(home, 'secret.png'), join(dir, 'linked.png'))
  await symlink(join(home, 'Secret.md'), join(dir, 'Linked.md'))

  return { plan, old, picture, exported: [`${plan.id}.md`, `${old.id}.md`, 'Loose.md', 'Windows.md', picture.path, 'table.csv'] }
}

const exported = async (): Promise<string> => {
  chosen = outside
  const done = data(await api.exportNotes(KEY)) as NotesExport

  return join(outside, done.folder)
}
// The reply as it comes, for a folder restore should refuse.
const restoreFrom = (folder: string) => {
  chosen = folder

  return api.restoreNotes(KEY)
}
const restored = async (backup: string, key = KEY, from = api): Promise<NotesRestore> => {
  chosen = backup

  return data(await from.restoreNotes(key)) as NotesRestore
}

beforeEach(async () => {
  home = await realpath(await mkdtemp(join(tmpdir(), 'queue-tea-backup-')))
  dir = vaultOf(KEY)
  outside = join(home, 'Backups')
  ids = 0
  chosen = outside
  buttons = []
  await mkdir(outside)
  await mkdir(join(home, '.queue-tea/projects'), { recursive: true })
  await writeFile(join(home, '.queue-tea/projects', `${KEY}.json`), JSON.stringify(emptyRecord('demo', '/p/demo')))
  await writeFile(join(home, '.queue-tea/projects', `${OTHER}.json`), JSON.stringify(emptyRecord('other', '/p/other')))
  const log = createLogger('dev', () => {})
  const host = nodeHost(log, async () => ({ exitCode: 0, stdout: '', stderr: '' }))
  deps = { host, home, now: () => NOW, offsetMinutes: () => 60, log, newId: () => `t-${(ids += 1)}`, newNoteId: () => `n-${(ids += 1)}`, terminal: async () => 'terminal', copy: () => {}, prepareCodex: async () => [], reveal: () => {}, pickFolder: async button => {
      buttons.push(button)

      return chosen
    } }
  api = notesApi(deps)
})

afterEach(() => rm(home, { recursive: true, force: true }))

describe('exporting notes', () => {
  it('copies the notes and the files they can link byte for byte, and nothing else but the manifest', async () => {
    const realm = await fillRealm()
    const done = data(await api.exportNotes(KEY))

    expect(buttons).toEqual([MESSAGES.exportButton])
    expect(done).toEqual({ folder: BACKUP, notes: 4, files: 2, skipped: [] })
    const backup = await tree(join(outside, BACKUP))
    expect(Object.keys(backup).sort()).toEqual([...realm.exported, MANIFEST].sort())
    for (const path of realm.exported) expect(backup[path], path).toEqual(await readFile(join(dir, path)))
  })

  it('writes a manifest saying the format, the realm, when, and how many notes and files went in', async () => {
    await fillRealm()
    data(await api.exportNotes(KEY))

    expect(JSON.parse(await readFile(join(outside, BACKUP, MANIFEST), 'utf8'))).toEqual({ format: 1, realm: KEY, exported: '2026-11-07T13:00:00+01:00', notes: 4, files: 2 })
  })

  it('leaves out a file too large and one that will not read, names them, and exports the rest', async () => {
    const plan = await created()
    await writeFile(join(dir, 'huge.pdf'), Buffer.alloc(TEN_MB))
    await writeFile(join(dir, 'Locked.md'), 'secret')
    await chmod(join(dir, 'Locked.md'), 0o000)

    expect(data(await api.exportNotes(KEY))).toEqual({ folder: BACKUP, notes: 1, files: 0, skipped: [{ path: 'Locked.md', reason: 'unreadable' }, { path: 'huge.pdf', reason: 'size' }] })
    expect(Object.keys(await tree(join(outside, BACKUP))).sort()).toEqual([`${plan.id}.md`, MANIFEST].sort())
  })

  it('refuses a realm with no notes before the picker opens, and writes nothing', async () => {
    expect(refused(await api.exportNotes(KEY))).toBe(MESSAGES.nothingToExport)
    await mkdir(join(dir, 'attachments'), { recursive: true })
    await writeFile(join(dir, 'attachments/picture.png'), PNG)
    await writeFile(join(dir, 'Draft.md.tmp'), 'half written')

    expect(refused(await api.exportNotes(KEY))).toBe(MESSAGES.nothingToExport)
    expect(refused(await api.exportNotes('unknown-abc123'))).toBe(MESSAGES.unknownProject)
    expect(buttons).toEqual([])
    expect(await readdir(outside)).toEqual([])
  })

  it('a cancelled picker gives nothing back and writes nothing', async () => {
    await fillRealm()
    const before = await tree(dir)
    chosen = null

    expect(data(await api.exportNotes(KEY))).toBeNull()
    expect(await readdir(outside)).toEqual([])
    expect(await tree(dir)).toEqual(before)
  })

  it('a backup name already taken that day gets the next number, and the first backup stays as it was', async () => {
    const { id, view } = await created({ body: 'First' })
    data(await api.exportNotes(KEY))
    const first = await tree(join(outside, BACKUP))
    data(await api.saveNote(KEY, id, change({ body: 'Second' }), view.notes[0]!.stamp))

    expect(data(await api.exportNotes(KEY))!.folder).toBe(`${BACKUP} 2`)
    expect(await tree(join(outside, BACKUP))).toEqual(first)
    expect((await readFile(join(outside, `${BACKUP} 2`, `${id}.md`), 'utf8'))).toContain('Second')
  })

  it('a write that fails part way removes the unfinished backup and says nothing was saved', async () => {
    await created({ title: 'A' })
    // A note whose path in the backup is longer than the system allows.
    await writeFile(join(dir, `Z${'z'.repeat(80)}.md`), 'too long a path there')
    let parent = outside
    while (parent.length < 950) parent = join(parent, 'd'.repeat(Math.min(200, 950 - parent.length - 1)))
    await mkdir(parent, { recursive: true })
    chosen = parent

    expect(refused(await api.exportNotes(KEY))).toBe(MESSAGES.exportNotes)
    expect(await readdir(parent)).toEqual([])
  })
})

describe('restoring notes', () => {
  it('into an empty realm brings back every note and file byte for byte, archived ones archived', async () => {
    const realm = await fillRealm()
    const backup = await exported()
    await rm(dir, { recursive: true })
    buttons = []
    const done = await restored(backup)

    expect(buttons).toEqual([MESSAGES.restoreButton])
    expect(done).toMatchObject({ added: 4, renamed: 0, same: 0, toHistory: 0, skipped: [] })
    for (const path of realm.exported) expect((await tree(dir))[path], path).toEqual(await readFile(join(backup, path)))
    expect(done.view.notes.map(note => [note.id, note.isArchived]).sort()).toEqual([[realm.plan.id, false], [realm.old.id, true], ['Loose', false], ['Windows', false]].sort())
  })

  it("never brings the backup's own manifest into the realm, so the realm exports again", async () => {
    const realm = await fillRealm()
    const backup = await exported()
    await rm(dir, { recursive: true })
    const done = await restored(backup)

    expect(done.files).toBe(2)
    expect(Object.keys(await tree(dir)).filter(path => !path.startsWith('.history/')).sort()).toEqual([...realm.exported].sort())
    chosen = outside
    expect(await api.exportNotes(KEY)).toMatchObject({ ok: true, data: { notes: 4, files: 2, skipped: [] } })
  })

  it('a realm still holding a manifest from an earlier restore exports, with a fresh manifest of its own', async () => {
    const plan = await created()
    await writeFile(join(dir, MANIFEST), '{"format": 1, "realm": "elsewhere"}')

    expect(data(await api.exportNotes(KEY))).toEqual({ folder: BACKUP, notes: 1, files: 0, skipped: [] })
    expect(Object.keys(await tree(join(outside, BACKUP))).sort()).toEqual([`${plan.id}.md`, MANIFEST].sort())
    expect(JSON.parse(await readFile(join(outside, BACKUP, MANIFEST), 'utf8'))).toMatchObject({ format: 1, realm: KEY })
  })

  it('a second and third restore of the same backup change nothing, even after a restart', async () => {
    const realm = await fillRealm()
    const backup = await exported()
    await rm(join(dir, 'Windows.md'))
    await rm(join(dir, realm.picture.path))
    expect((await restored(backup)).added).toBe(1)
    const after = await tree(dir)
    const counts = { notes: Object.keys(after).filter(path => !path.includes('/') && path.endsWith('.md')).length, history: await historyCount(KEY), attachments: (await readdir(join(dir, 'attachments'))).length }

    for (const from of [api, notesApi(deps)]) {
      expect(await restored(backup, KEY, from)).toMatchObject({ added: 0, renamed: 0, same: 4, toHistory: 0, files: 0, skipped: [] })
      expect(await tree(dir)).toEqual(after)
      expect({ notes: counts.notes, history: await historyCount(KEY), attachments: (await readdir(join(dir, 'attachments'))).length }).toEqual(counts)
    }
  })

  it("a live note that differs stays as it is, and the backup's text joins its History once", async () => {
    await fillRealm()
    const backup = await exported()
    // Edited in Obsidian after the backup: no History of its own yet.
    await writeFile(join(dir, 'Windows.md'), '---\ntitle: Windows\n---\nRewritten\n')
    const live = await readFile(join(dir, 'Windows.md'))

    expect(await restored(backup)).toMatchObject({ added: 0, same: 3, toHistory: 1 })
    expect(await restored(backup)).toMatchObject({ added: 0, same: 4, toHistory: 0 })
    expect(await readFile(join(dir, 'Windows.md'))).toEqual(live)
    expect(Object.values(await tree(dir, '.history/Windows'))).toEqual([Buffer.from(WINDOWS)])
    expect(data(await api.readNoteHistory(KEY, 'Windows'))).toHaveLength(1)
  })

  it("a backup's text already in the note's History counts as already here", async () => {
    const { id, view } = await created({ body: 'First' })
    const backup = await exported()
    data(await api.saveNote(KEY, id, change({ body: 'Second' }), view.notes[0]!.stamp))
    const live = await readFile(join(dir, `${id}.md`))
    const history = await tree(dir, `.history/${id}`)

    expect(await restored(backup)).toMatchObject({ added: 0, same: 1, toHistory: 0 })
    expect(await readFile(join(dir, `${id}.md`))).toEqual(live)
    expect(await tree(dir, `.history/${id}`)).toEqual(history)
  })

  it('a missing note whose title is taken now comes back as "Plan 2", and a second restore adds nothing', async () => {
    const plan = await created({ title: 'Plan', body: 'From the backup' })
    const backup = await exported()
    data(await api.archiveNote(KEY, plan.id, true))
    data(await api.deleteNote(KEY, plan.id))
    const taken = await created({ title: 'Plan', body: 'Written since' })
    const takenText = await readFile(join(dir, `${taken.id}.md`))

    const first = await restored(backup)
    expect(first).toMatchObject({ added: 1, renamed: 1, same: 0, toHistory: 0, skipped: [] })
    expect(first.view.notes.map(note => [note.id, note.title, note.body]).sort()).toEqual([[plan.id, 'Plan 2', 'From the backup'], [taken.id, 'Plan', 'Written since']].sort())
    expect(await readFile(join(dir, `${taken.id}.md`))).toEqual(takenText)
    const original = await readFile(join(backup, `${plan.id}.md`))
    expect(Object.values(await tree(dir, `.history/${plan.id}`)).filter(text => original.equals(text as Buffer))).toHaveLength(1)
    const after = await tree(dir)

    expect(await restored(backup)).toMatchObject({ added: 0, renamed: 0, same: 1, toHistory: 0, files: 0, skipped: [] })
    expect(await tree(dir)).toEqual(after)
  })

  it('leaves out a damaged, a taken, a too-large and an unreadable file and a too-long note, names each, and restores the rest', async () => {
    const realm = await fillRealm()
    const report = data(await api.attachNoteFile(KEY, realm.plan.id, { name: 'report.pdf', type: 'application/pdf', bytes: new Uint8Array(PDF) }))
    const backup = await exported()
    await rm(join(dir, 'Windows.md'))
    await rm(join(dir, realm.picture.path))
    await rm(join(dir, report.path))
    await writeFile(join(dir, 'table.csv'), 'a,b\n9,9\n')
    await writeFile(join(backup, realm.picture.path), 'not the picture its name promises')
    await writeFile(join(backup, 'huge.pdf'), Buffer.alloc(TEN_MB))
    await writeFile(join(backup, 'locked.csv'), 'x')
    await chmod(join(backup, 'locked.csv'), 0o000)
    await writeFile(join(backup, 'Long.md'), `---\ntitle: Long\n---\n${'x'.repeat(1_000_001)}`)
    await symlink(join(home, 'secret.png'), join(backup, 'attachments/escape.png'))

    const done = await restored(backup)
    expect([...done.skipped].sort((a, b) => a.path.localeCompare(b.path))).toEqual(
      [
        { path: 'Long.md', reason: 'size' },
        { path: realm.picture.path, reason: 'damaged' },
        { path: 'huge.pdf', reason: 'size' },
        { path: 'locked.csv', reason: 'unreadable' },
        { path: 'table.csv', reason: 'taken' },
      ].sort((a, b) => a.path.localeCompare(b.path)),
    )
    expect(done.added).toBe(1)
    const now = await tree(dir)
    expect(now['Windows.md']).toEqual(Buffer.from(WINDOWS))
    expect(now[report.path]).toEqual(PDF)
    expect(now['table.csv']).toEqual(Buffer.from('a,b\n9,9\n'))
    for (const path of [realm.picture.path, 'huge.pdf', 'locked.csv', 'Long.md', 'attachments/escape.png']) expect(now[path], path).toBeUndefined()
  })

  it("never follows a backup's attachments folder that links elsewhere", async () => {
    const plan = await created()
    const backup = await exported()
    await mkdir(join(home, 'elsewhere'))
    await writeFile(join(home, 'elsewhere/private.png'), PNG)
    await symlink(join(home, 'elsewhere'), join(backup, 'attachments'))

    expect(await restored(backup)).toMatchObject({ added: 0, same: 1, files: 0, skipped: [] })
    expect(Object.keys(await tree(dir)).filter(path => !path.startsWith('.history/'))).toEqual([`${plan.id}.md`])
  })

  it('writes nothing through a live attachments folder that links outside the vault', async () => {
    const realm = await fillRealm()
    const backup = await exported()
    await rm(join(dir, 'attachments'), { recursive: true })
    await mkdir(join(home, 'outside-vault'))
    await symlink(join(home, 'outside-vault'), join(dir, 'attachments'))

    expect((await restored(backup)).skipped.map(skip => skip.path)).toEqual([realm.picture.path])
    expect(await readdir(join(home, 'outside-vault'))).toEqual([])
  })

  it('refuses a folder that is not a backup, or one from a newer Queue-tea, and writes nothing', async () => {
    const cases: [string, string | null, string][] = [
      ['no manifest', null, MESSAGES.notABackup],
      ['not JSON', '{"format": 1', MESSAGES.notABackup],
      ['null', 'null', MESSAGES.notABackup],
      ['a format in words', '{"format": "1"}', MESSAGES.notABackup],
      ['format 0', '{"format": 0}', MESSAGES.notABackup],
      ['format 2', '{"format": 2}', MESSAGES.backupTooNew],
    ]
    for (const [name, manifest, message] of cases) {
      const folder = join(outside, name)
      await mkdir(folder)
      await writeFile(join(folder, 'n-1.md'), '---\ntitle: Plan\n---\nBody')
      if (manifest !== null) await writeFile(join(folder, MANIFEST), manifest)

      expect(refused(await restoreFrom(folder)), name).toBe(message)
    }
    const linked = join(outside, 'manifest linked')
    await mkdir(linked)
    await writeFile(join(home, 'real.json'), '{"format": 1}')
    await symlink(join(home, 'real.json'), join(linked, MANIFEST))
    expect(refused(await restoreFrom(linked))).toBe(MESSAGES.notABackup)
    expect(await tree(dir)).toEqual({})
  })

  it('refuses a backup of more than 5,000 notes and writes nothing', async () => {
    const folder = join(outside, 'big')
    await mkdir(folder)
    await writeFile(join(folder, MANIFEST), '{"format": 1}')
    for (let n = 0; n < 5001; n += 1) await writeFile(join(folder, `n-${n}.md`), 'x')

    expect(refused(await restoreFrom(folder))).toBe(MESSAGES.backupTooBig)
    expect(await tree(dir)).toEqual({})
  })

  it('a cancelled picker gives nothing back and changes nothing', async () => {
    await fillRealm()
    const before = await tree(dir)
    chosen = null

    expect(data(await api.restoreNotes(KEY))).toBeNull()
    expect(await tree(dir)).toEqual(before)
  })

  it('restores into another realm and leaves the first as it was', async () => {
    const realm = await fillRealm()
    const backup = await exported()
    const first = await tree(dir)

    expect(await restored(backup, OTHER)).toMatchObject({ added: 4, toHistory: 0, skipped: [] })
    const other = await tree(vaultOf(OTHER))
    for (const path of realm.exported) expect(other[path], path).toEqual(first[path])
    expect(await tree(dir)).toEqual(first)
  })

  it('a restore that cannot write here says so, and trying again adds the rest', async () => {
    await fillRealm()
    const backup = await exported()
    await rm(dir, { recursive: true })
    await mkdir(dir, { recursive: true })
    await writeFile(join(dir, 'attachments'), 'a file where the folder goes')

    chosen = backup
    expect(refused(await api.restoreNotes(KEY))).toBe(MESSAGES.restoreNotes)
    await rm(join(dir, 'attachments'))
    expect(await restored(backup)).toMatchObject({ added: 4, skipped: [] })
  })

  it('two restores at once leave one copy of everything, and only one of them adds it', async () => {
    const realm = await fillRealm()
    const backup = await exported()
    await rm(dir, { recursive: true })
    chosen = backup
    // Either may reach the save queue first; the other finds everything there.
    const [first, second] = (await Promise.all([api.restoreNotes(KEY), api.restoreNotes(KEY)])).map(answer => data(answer) as NotesRestore).sort((a, b) => b.added - a.added)

    expect(first).toMatchObject({ added: 4, files: 2, skipped: [] })
    expect(second).toMatchObject({ added: 0, same: 4, files: 0, skipped: [] })
    for (const path of realm.exported) expect((await tree(dir))[path], path).toEqual(await readFile(join(backup, path)))
  })
})
