import { expect, test } from 'claude-code/testing'

import { carryOverRecords, emptyRecord, projectKey, readRecord, recordPath, updateRecord } from '../hooks/record'
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
  expect(mem.runs).toEqual([['mv', '-f', tmp, FILE]])
  expect(mem.files.has(tmp)).toBe(false)
  expect(mem.files.has(FILE)).toBe(true)
})

test('an unreadable record is never overwritten', async () => {
  const mem = memoryHost({ files: { [FILE]: '{not json' } })

  expect(await updateRecord(mem.host, FILE, r => r, 'p', '/p')).toBe('unreadable')
  expect(mem.writes).toEqual([])
  expect(mem.runs).toEqual([])
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
