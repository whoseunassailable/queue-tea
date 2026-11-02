import { weekOf } from '../../../../../hooks/shared/time/domain/services/week_stats'
import type { Book, BookInput, Library, LibraryView } from '../../../../shared/engine_api'

const VERSION = 1

export const emptyLibrary = (): Library => ({ version: VERSION, books: [] })

const isBook = (value: unknown): value is Book => {
  const book = value as Partial<Book> | null

  return typeof book?.id === 'string' && typeof book.title === 'string' && typeof book.totalPages === 'number' && typeof book.firstPage === 'number' && typeof book.page === 'number' && Array.isArray(book.log)
}

export const parseLibrary = (text: string): Library | 'unreadable' => {
  try {
    const parsed = JSON.parse(text) as Partial<Library> | null
    if (parsed?.version !== VERSION || !Array.isArray(parsed.books) || !parsed.books.every(isBook)) return 'unreadable'

    return parsed as Library
  } catch {
    // Not JSON: the caller says so, and keeps the file as it is.
    return 'unreadable'
  }
}

const withEntry = (log: Book['log'], day: string, page: number): Book['log'] => [...log.filter(entry => entry.day !== day), { day, page }]

export const addBook = (library: Library, input: BookInput, id: string, today: string): Library => ({
  ...library,
  books: [
    ...library.books,
    {
      id,
      title: input.title,
      author: input.author,
      totalPages: input.totalPages,
      firstPage: input.page,
      page: input.page,
      started: today,
      finished: input.page >= input.totalPages ? today : null,
      log: [{ day: today, page: input.page }],
    },
  ],
})

const changed = (library: Library, id: string, change: (book: Book) => Book): Library => ({ ...library, books: library.books.map(book => (book.id === id ? change(book) : book)) })

// The last page finishes a book, and going back in one opens it again.
export const setPage = (library: Library, id: string, page: number, today: string): Library =>
  changed(library, id, book => ({
    ...book,
    page,
    finished: page < book.totalPages ? null : (book.finished ?? today),
    log: withEntry(book.log, today, page),
  }))

export const finishBook = (library: Library, id: string, today: string): Library => changed(library, id, book => ({ ...book, page: book.totalPages, finished: today, log: withEntry(book.log, today, book.totalPages) }))

export const removeBook = (library: Library, id: string): Library => ({ ...library, books: library.books.filter(book => book.id !== id) })

// The new pages each entry reached. Going back in a book isn't reading, and
// reading the same pages again isn't more of it.
const gainsOf = (book: Book): { day: string; pages: number }[] => {
  let reached = book.firstPage

  return [...book.log]
    .sort((a, b) => a.day.localeCompare(b.day))
    .map(entry => {
      const pages = Math.max(0, entry.page - reached)
      reached = Math.max(reached, entry.page)

      return { day: entry.day, pages }
    })
}

export const libraryViewOf = (library: Library, today: string): LibraryView => {
  const week = weekOf(today)
  const gains = library.books.flatMap(gainsOf)
  const count = (isDay: (day: string) => boolean) => gains.reduce((sum, gain) => (isDay(gain.day) ? sum + gain.pages : sum), 0)
  const finished = library.books.filter(book => book.finished !== null).sort((a, b) => (b.finished ?? '').localeCompare(a.finished ?? ''))

  return {
    reading: library.books.filter(book => book.finished === null),
    finished,
    finishedCount: finished.length,
    // What you'd read before it came onto the shelf counts here, and only here.
    pagesRead: count(() => true) + library.books.reduce((sum, book) => sum + book.firstPage, 0),
    pagesThisWeek: count(day => week.includes(day)),
    pagesToday: count(day => day === today),
  }
}
