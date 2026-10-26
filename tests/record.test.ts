import { expect, test } from 'claude-code/testing'

import {
  backupPath,
  carryOverRecords,
  emptyRecord,
  projectKey,
  readOthers,
  readProblem,
  readRecord,
  recordPath,
  restoreRecord,
  updateRecord,
  whyUnreadable,
} from '../hooks/record'
import type { ProjectRecord } from '../types'
import { makeTask, memoryHost } from './helpers'

const FILE = recordPath('/Users/example', 'example-app-abc123')
const json = (r: ProjectRecord) => JSON.stringify(r)

test('recordPath is under ~/.queue-tea/projects', () => {
  expect(FILE).toBe('/Users/example/.queue-tea/projects/example-app-abc123.json')
})

test('projectKey: same folder name, different paths, different keys', () => {
  const a = projectKey('/a/frontend')
  const b = projectKey('/b/frontend')

  expect(a).toMatch(/^frontend-[0-9a-f]{6}$/)
  expect(b).toMatch(/^frontend-[0-9a-f]{6}$/)
  expect(a === b).toBe(false)
  expect(projectKey('/a/frontend/')).toBe(a)
})

test('a missing file reads as an empty record', async () => {
  const { host } = memoryHost()

  expect(await readRecord(host, FILE, 'example-app', '/x/example-app')).toEqual(
    emptyRecord('example-app', '/x/example-app'),
  )
})

test('updateRecord keeps a task another session wrote in between', async () => {
  const a = makeTask({ title: 'A' })
  const c = makeTask({ title: 'C' })
  const b = makeTask({ title: 'B' })
  const mem = memoryHost({ files: { [FILE]: json({ ...emptyRecord('p', '/p'), tasks: [a] }) } })

  // Another session writes C after this one last read the file.
  mem.files.set(FILE, json({ ...emptyRecord('p', '/p'), tasks: [a, c] }))
  const saved = await updateRecord(mem.host, FILE, r => ({ ...r, tasks: [...r.tasks, b] }), 'p', '/p')

  expect(saved === 'unreadable' ? [] : saved.tasks.map(t => t.title)).toEqual(['A', 'C', 'B'])
  expect((JSON.parse(mem.files.get(FILE)!) as ProjectRecord).tasks.map(t => t.title)).toEqual([
    'A',
    'C',
    'B',
  ])
})

test('updateRecord writes through a temp file and mv', async () => {
  const mem = memoryHost()

  await updateRecord(mem.host, FILE, r => r, 'p', '/p')

  const tmp = mem.writes[0]!
  expect(tmp).toMatch(/\.[0-9a-f]{8}\.tmp$/)
  expect(mem.runs).toEqual([['mkdir', `${FILE}.lock`], ['mv', '-f', tmp, FILE], ['rmdir', `${FILE}.lock`]])
  expect(mem.files.has(tmp)).toBe(false)
  expect(mem.files.has(FILE)).toBe(true)
})

test('an unreadable record is never overwritten', async () => {
  const mem = memoryHost({ files: { [FILE]: '{not json' } })

  expect(await updateRecord(mem.host, FILE, r => r, 'p', '/p')).toBe('unreadable')
  expect(mem.writes).toEqual([])
  expect(mem.runs).toEqual([['mkdir', `${FILE}.lock`], ['rmdir', `${FILE}.lock`]])
  expect(mem.files.get(FILE)).toBe('{not json')
})

test('a record of version 2 is unreadable', async () => {
  const { host } = memoryHost({ files: { [FILE]: JSON.stringify({ ...emptyRecord('p', '/p'), version: 2 }) } })

  expect(await readRecord(host, FILE, 'p', '/p')).toBe('unreadable')
})

const OLD = '/h/.queue-tie/projects'
const NEW = '/h/.queue-tea/projects'
const COPY = { 'mkdir -p /h/.queue-tea': {}, [`cp -Rp ${OLD} ${NEW}`]: {} }

test('the first start after the rename copies the Queue-tie records over', async () => {
  const mem = memoryHost({ files: { [OLD]: '' }, git: COPY })

  expect(await carryOverRecords(mem.host, '/h')).toBe('copied')
  expect(mem.runs).toEqual([
    ['mkdir', '-p', '/h/.queue-tea'],
    ['cp', '-Rp', OLD, NEW],
  ])
})

test('records are not copied once ~/.queue-tea exists, without old ones, or without a home', async () => {
  const both = memoryHost({ files: { [OLD]: '', [NEW]: '' }, git: COPY })
  const none = memoryHost({ git: COPY })
  const homeless = memoryHost({ files: { '/.queue-tie/projects': '' }, git: COPY })

  expect(await carryOverRecords(both.host, '/h')).toBe('none')
  expect(await carryOverRecords(none.host, '/h')).toBe('none')
  expect(await carryOverRecords(homeless.host, '')).toBe('none')
  expect([...both.runs, ...none.runs, ...homeless.runs]).toEqual([])
})

test('a copy that fails says so', async () => {
  const mem = memoryHost({ files: { [OLD]: '' }, git: { 'mkdir -p /h/.queue-tea': {} } })

  await expect(carryOverRecords(mem.host, '/h')).rejects.toThrow('cp of the old records failed')
})

test('why a record cannot be read: bad JSON, a newer Queue-tea, or not a record', () => {
  expect(whyUnreadable('{bad').reason).toMatch(/^it isn't valid JSON \(.+\)$/)
  expect(whyUnreadable(json({ ...emptyRecord('p', '/p'), version: 2 as 1 }))).toEqual({
    reason: 'it was written by a newer Queue-tea (record version 2); update Queue-tea to read it',
    isNewer: true,
  })
  expect(whyUnreadable('[1, 2]')).toEqual({ reason: "it isn't a Queue-tea record", isNewer: false })
})

test('each write keeps the record it replaced as the last good copy', async () => {
  const before = json({ ...emptyRecord('p', '/p'), tasks: [makeTask({ title: 'A' })] })
  const mem = memoryHost({ files: { [FILE]: before } })

  await updateRecord(mem.host, FILE, r => ({ ...r, tasks: [] }), 'p', '/p')

  expect(mem.files.get(backupPath(FILE))).toBe(before)
  expect((JSON.parse(mem.files.get(FILE)!) as ProjectRecord).tasks).toEqual([])
})

test('the first write of a new record has no copy to keep', async () => {
  const mem = memoryHost()

  await updateRecord(mem.host, FILE, r => r, 'p', '/p')

  expect(mem.files.has(backupPath(FILE))).toBe(false)
})

test('the last good copy is not taken for another project', async () => {
  const other = recordPath('/Users/example', 'other-def456')
  const mem = memoryHost({
    files: {
      [FILE]: json(emptyRecord('example-app', '/x')),
      [backupPath(other)]: json({ ...emptyRecord('other', '/o'), tasks: [makeTask()] }),
      [`${other}.broken-2026-10-26T09-00-00`]: json({ ...emptyRecord('other', '/o'), tasks: [makeTask()] }),
    },
  })

  expect(await readOthers(mem.host, FILE, () => null)).toEqual([])
})

test('a broken record with a good copy can be restored; the broken file is kept', async () => {
  const good = json({ ...emptyRecord('p', '/p'), tasks: [makeTask({ title: 'Kept' })] })
  const mem = memoryHost({ files: { [FILE]: '{bad', [backupPath(FILE)]: good } })

  expect(await readProblem(mem.host, FILE)).toMatchObject({ canRestore: true })
  const restored = await restoreRecord(mem.host, FILE, '2026-10-26T09-00-00')

  expect(restored).toMatchObject({ keptAt: `${FILE}.broken-2026-10-26T09-00-00` })
  expect(restored !== 'readable' && restored !== 'no-copy' && restored.record.tasks.map(t => t.title)).toEqual(['Kept'])
  expect(mem.files.get(FILE)).toBe(good)
  expect(mem.files.get(`${FILE}.broken-2026-10-26T09-00-00`)).toBe('{bad')
})

test('no restore over a newer Queue-tea’s record, without a copy, or from a broken copy', async () => {
  const good = json(emptyRecord('p', '/p'))
  const newer = json({ ...emptyRecord('p', '/p'), version: 2 as 1 })
  const cases = [
    memoryHost({ files: { [FILE]: newer, [backupPath(FILE)]: good } }),
    memoryHost({ files: { [FILE]: '{bad' } }),
    memoryHost({ files: { [FILE]: '{bad', [backupPath(FILE)]: '{also bad' } }),
  ]

  for (const mem of cases) {
    const before = new Map(mem.files)
    expect((await readProblem(mem.host, FILE))?.canRestore).toBe(false)
    expect(await restoreRecord(mem.host, FILE, 'x')).toBe('no-copy')
    expect(mem.files).toEqual(before)
  }
})

test('a record that reads is never restored over', async () => {
  const now = json({ ...emptyRecord('p', '/p'), tasks: [makeTask({ title: 'Now' })] })
  const mem = memoryHost({ files: { [FILE]: now, [backupPath(FILE)]: json(emptyRecord('p', '/p')) } })

  expect(await readProblem(mem.host, FILE)).toBe(null)
  expect(await restoreRecord(mem.host, FILE, 'x')).toBe('readable')
  expect(mem.files.get(FILE)).toBe(now)
})

// Lets other work waiting on promises run, n turns of it.
const turns = async (n: number) => {
  for (let i = 0; i < n; i += 1) await Promise.resolve()
}

test('two sessions writing at once both keep their change', async () => {
  const mem = memoryHost({ files: { [FILE]: json(emptyRecord('p', '/p')) } })
  // The first session is held after its read, until the second has started:
  // without the lock, the second would read the same record and one change
  // would be lost. The second's waits are real turns of the event loop.
  let letGo = () => {}
  const held = new Promise<void>(resolve => (letGo = resolve))
  const read = mem.host.read
  let reads = 0
  mem.host.read = async path => {
    const text = await read(path)
    reads += 1
    if (path === FILE && reads === 1) await held

    return text
  }
  mem.host.sleep = () => turns(10)
  const add = (title: string) => (r: ProjectRecord) => ({ ...r, tasks: [...r.tasks, makeTask({ title })] })

  const first = updateRecord(mem.host, FILE, add('From A'), 'p', '/p')
  const second = updateRecord(mem.host, FILE, add('From B'), 'p', '/p')
  await turns(20)
  letGo()
  await Promise.all([first, second])

  expect((JSON.parse(mem.files.get(FILE)!) as ProjectRecord).tasks.map(t => t.title)).toEqual(['From A', 'From B'])
  expect(mem.dirs.has(`${FILE}.lock`)).toBe(false)
})

test('a lock left by a session that stopped is taken over', async () => {
  const mem = memoryHost({ files: { [FILE]: json(emptyRecord('p', '/p')) } })
  mem.dirs.add(`${FILE}.lock`)

  const saved = await updateRecord(mem.host, FILE, r => ({ ...r, docsLogPath: 'docs/log.md' }), 'p', '/p')

  expect(saved === 'unreadable' ? null : saved.docsLogPath).toBe('docs/log.md')
  expect(mem.runs.filter(argv => argv[0] === 'mkdir')).toHaveLength(40)
  expect(mem.dirs.has(`${FILE}.lock`)).toBe(false)
})

test('the first record of all makes its folder before the lock', async () => {
  const mem = memoryHost()
  const mkdir = mem.host.run
  let isFolder = false
  // Without the folder, mkdir of the lock fails and nothing is there.
  mem.host.run = async argv => {
    if (argv[0] === 'mkdir' && argv[1] === '-p') isFolder = true
    else if (argv[0] === 'mkdir' && !isFolder) return { exitCode: 1, stdout: '', stderr: 'No such file or directory' }

    return mkdir(argv)
  }

  expect(await updateRecord(mem.host, FILE, r => r, 'p', '/p')).not.toBe('unreadable')
  expect(mem.runs.map(argv => argv.join(' '))).toEqual([
    `mkdir ${FILE.slice(0, FILE.lastIndexOf('/'))}`.replace('mkdir ', 'mkdir -p '),
    `mkdir ${FILE}.lock`,
    expect.stringMatching(/^mv -f /),
    `rmdir ${FILE}.lock`,
  ])
})
