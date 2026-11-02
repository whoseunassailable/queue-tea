import { mkdir, mkdtemp, readdir, readFile, realpath, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import type { BookInput, LibraryView, Reply } from '../../../../shared/engine_api'
import { createLogger } from '../../../core/logger'
import { nodeHost } from '../../../core/node_host'
import { libraryApi } from './library_api'

const NOW = Date.parse('2026-11-04T12:00:00Z')
const DUNE: BookInput = { title: 'Dune', author: 'Frank Herbert', totalPages: 412, page: 0 }

let home: string
let file: string
let ids: number
let api: ReturnType<typeof libraryApi>

const data = (answer: Reply<LibraryView>): LibraryView => {
  if (!answer.ok) throw new Error(`should succeed: ${answer.error.message}`)

  return answer.data
}
const refused = (answer: Reply<LibraryView>): string => {
  if (answer.ok) throw new Error('should be refused')

  return answer.error.message
}
const onDisk = async () => JSON.parse(await readFile(file, 'utf8'))

beforeEach(async () => {
  home = await realpath(await mkdtemp(join(tmpdir(), 'queue-tea-library-')))
  file = join(home, '.queue-tea/library.json')
  ids = 0
  const log = createLogger('dev', () => {})
  api = libraryApi({ host: nodeHost(log, async () => ({ exitCode: 0, stdout: '', stderr: '' })), home, now: () => NOW, offsetMinutes: () => 60, log, newId: () => `b-${(ids += 1)}` })
})

afterEach(() => rm(home, { recursive: true, force: true }))

describe('the shelf', () => {
  it('starts empty, and writes nothing to find that out', async () => {
    expect(data(await api.readLibrary())).toMatchObject({ reading: [], finished: [] })
    await expect(readFile(file, 'utf8')).rejects.toThrow()
  })

  it('keeps a book in its own file, outside every record', async () => {
    data(await api.addBook(DUNE))

    expect((await onDisk()).books[0]).toMatchObject({ title: 'Dune', totalPages: 412 })
    expect(file.includes('/projects/')).toBe(false)
  })

  it('reads back what it saved', async () => {
    data(await api.addBook(DUNE))

    expect(data(await api.readLibrary()).reading.map(b => b.title)).toEqual(['Dune'])
  })

  it('leaves a copy of the last good file, and no temp file', async () => {
    data(await api.addBook(DUNE))
    data(await api.addBook({ ...DUNE, title: 'Second' }))

    expect((await readdir(join(home, '.queue-tea'))).sort()).toEqual(['library.json', 'library.json.bak'])
  })

  it('takes two saves at once without losing either', async () => {
    await Promise.all([api.addBook(DUNE), api.addBook({ ...DUNE, title: 'Second' })])

    expect((await onDisk()).books).toHaveLength(2)
  })
})

describe('checking a book', () => {
  it.each([
    ['no title', { ...DUNE, title: '   ' }, 'Title is required.'],
    ['a title too long', { ...DUNE, title: 'x'.repeat(201) }, 'Title must be 200 characters or fewer.'],
    ['no pages', { ...DUNE, totalPages: 0 }, 'Total pages must be a whole number from 1 to 100,000.'],
    ['part of a page', { ...DUNE, totalPages: 10.5 }, 'Total pages must be a whole number from 1 to 100,000.'],
    ['a page past the end', { ...DUNE, page: 413 }, 'Enter a page from 0 to 412.'],
    ['a page before the start', { ...DUNE, page: -1 }, 'Enter a page from 0 to 412.'],
  ])('refuses %s', async (_, input, message) => {
    expect(refused(await api.addBook(input))).toBe(message)
    await expect(readFile(file, 'utf8')).rejects.toThrow()
  })

  it('keeps no empty author', async () => {
    data(await api.addBook({ ...DUNE, author: '   ' }))

    expect((await onDisk()).books[0].author).toBeNull()
  })

  it('refuses something that isn\'t a book at all', async () => {
    expect((await api.addBook(null)).ok).toBe(false)
  })
})

describe('reading on', () => {
  beforeEach(async () => {
    data(await api.addBook(DUNE))
  })

  it('moves the page', async () => {
    expect(data(await api.setBookPage('b-1', 100)).reading[0]?.page).toBe(100)
  })

  it('refuses a page past the end, naming the end', async () => {
    expect(refused(await api.setBookPage('b-1', 500))).toBe('Enter a page from 0 to 412.')
    expect((await onDisk()).books[0].page).toBe(0)
  })

  it('finishes a book', async () => {
    expect(data(await api.finishBook('b-1')).finished.map(b => b.title)).toEqual(['Dune'])
  })

  it('removes a book', async () => {
    expect(data(await api.removeBook('b-1')).reading).toEqual([])
  })

  it('refuses a book it doesn\'t know', async () => {
    expect(refused(await api.setBookPage('nope', 1))).toBe("That book isn't on the shelf any more.")
    expect(refused(await api.finishBook('nope'))).toBe("That book isn't on the shelf any more.")
    expect(refused(await api.removeBook('nope'))).toBe("That book isn't on the shelf any more.")
  })
})

describe('a file that doesn\'t read', () => {
  beforeEach(async () => {
    await mkdir(join(home, '.queue-tea'), { recursive: true })
    await writeFile(file, '{ broken')
  })

  it('says so', async () => {
    expect(refused(await api.readLibrary())).toContain("can't be read")
  })

  it('never overwrites it', async () => {
    expect((await api.addBook(DUNE)).ok).toBe(false)

    expect(await readFile(file, 'utf8')).toBe('{ broken')
  })
})
