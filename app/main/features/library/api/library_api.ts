import type { Host } from '../../../../../hooks/core/host/host'
import { dayKey } from '../../../../../hooks/shared/time/domain/services/time'
import type { Book, BookInput, Library, LibraryView, Reply } from '../../../../shared/engine_api'
import type { Logger } from '../../../core/logger'
import { MESSAGES } from '../../../core/messages'
import { Refusal, reply } from '../../../core/reply'
import { addBook, emptyLibrary, finishBook, libraryViewOf, parseLibrary, removeBook, setPage } from '../domain/library'

export type LibraryDeps = { host: Host; home: string; now: () => number; offsetMinutes: () => number; log: Logger; newId: () => string }

const TITLE_LIMIT = 200
const AUTHOR_LIMIT = 200
const MOST_PAGES = 100_000

const isPageCount = (value: unknown): value is number => Number.isInteger(value) && (value as number) >= 1 && (value as number) <= MOST_PAGES

const pageIn = (value: unknown, total: number): number => {
  if (!Number.isInteger(value) || (value as number) < 0 || (value as number) > total) throw new Refusal(MESSAGES.badPage(total))

  return value as number
}

const bookOf = (value: unknown): BookInput => {
  const v = (value ?? {}) as Record<string, unknown>
  const title = typeof v.title === 'string' ? v.title.trim() : ''
  if (title === '') throw new Refusal(MESSAGES.titleRequired)
  if (title.length > TITLE_LIMIT) throw new Refusal(MESSAGES.titleTooLong)
  if (!isPageCount(v.totalPages)) throw new Refusal(MESSAGES.badTotalPages)
  const author = typeof v.author === 'string' ? v.author.trim().slice(0, AUTHOR_LIMIT) : ''

  return { title, author: author === '' ? null : author, totalPages: v.totalPages, page: pageIn(v.page, v.totalPages) }
}

// Books have nothing to do with any project, so they keep to a file of their
// own, beside the records and never in one. Every flavor of the app shares it.
export const libraryApi = (d: LibraryDeps) => {
  const file = `${d.home}/.queue-tea/library.json`
  const today = () => dayKey(d.now(), d.offsetMinutes())

  const load = async (): Promise<Library> => {
    if (!(await d.host.exists(file))) return emptyLibrary()
    const library = parseLibrary(await d.host.read(file))
    // A file that doesn't read is left for you: it's your reading history.
    if (library === 'unreadable') throw new Refusal(MESSAGES.brokenLibrary(file))

    return library
  }

  const save = async (library: Library): Promise<void> => {
    const made = await d.host.makeDirs(`${d.home}/.queue-tea`)
    if (made.exitCode !== 0) throw new Error(made.stderr)
    const tmp = `${file}.tmp`
    await d.host.write(tmp, JSON.stringify(library, null, 2))
    if (await d.host.exists(file)) await d.host.write(`${file}.bak`, await d.host.read(file))
    const moved = await d.host.move(tmp, file)
    if (moved.exitCode !== 0) throw new Error(moved.stderr)
  }

  // One change at a time, so two quick ones can't lose each other.
  let queue: Promise<unknown> = Promise.resolve()
  const change = (failure: string, work: (library: Library) => Library): Promise<Reply<LibraryView>> => {
    const run = queue.then(() =>
      reply(d.log, failure, async () => {
        const next = work(await load())
        await save(next)

        return libraryViewOf(next, today())
      }),
    )
    queue = run

    return run
  }

  const known = (library: Library, id: unknown): Book => {
    const book = library.books.find(b => b.id === id)
    if (book === undefined) throw new Refusal(MESSAGES.bookGone)

    return book
  }

  return {
    readLibrary: (): Promise<Reply<LibraryView>> => reply(d.log, MESSAGES.readLibrary, async () => libraryViewOf(await load(), today())),

    addBook: (input: unknown) => change(MESSAGES.saveBook, library => addBook(library, bookOf(input), d.newId(), today())),

    setBookPage: (id: unknown, page: unknown) =>
      change(MESSAGES.saveBook, library => {
        const book = known(library, id)

        return setPage(library, book.id, pageIn(page, book.totalPages), today())
      }),

    finishBook: (id: unknown) => change(MESSAGES.saveBook, library => finishBook(library, known(library, id).id, today())),

    removeBook: (id: unknown) => change(MESSAGES.saveBook, library => removeBook(library, known(library, id).id)),
  }
}

export type LibraryApi = ReturnType<typeof libraryApi>
