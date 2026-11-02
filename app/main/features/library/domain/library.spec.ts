import { describe, expect, it } from 'vitest'

import type { Book, Library } from '../../../../shared/engine_api'
import { addBook, emptyLibrary, finishBook, libraryViewOf, parseLibrary, removeBook, setPage } from './library'

const DAY = '2026-11-04' // a Wednesday

const book = (over: Partial<Book> & { id: string }): Book => ({ title: over.id, author: null, totalPages: 300, firstPage: 0, page: 0, started: '2026-11-01', finished: null, log: [], ...over })
const library = (...books: Book[]): Library => ({ version: 1, books })

describe('adding a book', () => {
  it('starts reading at the page given', () => {
    const next = addBook(emptyLibrary(), { title: 'Dune', author: 'Frank Herbert', totalPages: 412, page: 30 }, 'b-1', DAY)

    expect(next.books).toEqual([{ id: 'b-1', title: 'Dune', author: 'Frank Herbert', totalPages: 412, firstPage: 30, page: 30, started: DAY, finished: null, log: [{ day: DAY, page: 30 }] }])
  })

  it('counts a book already read through as finished', () => {
    expect(addBook(emptyLibrary(), { title: 'Dune', author: null, totalPages: 412, page: 412 }, 'b-1', DAY).books[0]?.finished).toBe(DAY)
  })
})

describe('reading on', () => {
  it('moves the page and logs the day', () => {
    const next = setPage(library(book({ id: 'a', page: 10 })), 'a', 40, DAY)

    expect(next.books[0]).toMatchObject({ page: 40, finished: null, log: [{ day: DAY, page: 40 }] })
  })

  it('keeps one entry a day, the latest', () => {
    const once = setPage(library(book({ id: 'a' })), 'a', 40, DAY)

    expect(setPage(once, 'a', 60, DAY).books[0]?.log).toEqual([{ day: DAY, page: 60 }])
  })

  it('finishes a book on its last page', () => {
    expect(setPage(library(book({ id: 'a' })), 'a', 300, DAY).books[0]?.finished).toBe(DAY)
  })

  it('reopens a finished book when you go back in it', () => {
    expect(setPage(library(book({ id: 'a', page: 300, finished: DAY })), 'a', 200, DAY).books[0]?.finished).toBeNull()
  })

  it('leaves other books alone', () => {
    const other = book({ id: 'b', page: 5 })

    expect(setPage(library(book({ id: 'a' }), other), 'a', 40, DAY).books[1]).toEqual(other)
  })

  it('finishing moves to the last page', () => {
    expect(finishBook(library(book({ id: 'a', page: 10 })), 'a', DAY).books[0]).toMatchObject({ page: 300, finished: DAY })
  })

  it('removing leaves the rest', () => {
    expect(removeBook(library(book({ id: 'a' }), book({ id: 'b' })), 'a').books.map(b => b.id)).toEqual(['b'])
  })
})

describe('what the page shows', () => {
  it('splits reading from finished, the latest finished first', () => {
    const view = libraryViewOf(library(book({ id: 'r' }), book({ id: 'old', page: 300, finished: '2026-10-01' }), book({ id: 'new', page: 300, finished: '2026-11-01' })), DAY)

    expect(view.reading.map(b => b.id)).toEqual(['r'])
    expect(view.finished.map(b => b.id)).toEqual(['new', 'old'])
  })

  it('counts what was finished', () => {
    expect(libraryViewOf(library(book({ id: 'a', page: 300, finished: DAY }), book({ id: 'b' })), DAY).finishedCount).toBe(1)
  })

  it('counts pages read in all, today and this week, not where you stood', () => {
    const view = libraryViewOf(
      library(
        book({
          id: 'a',
          page: 120,
          log: [
            { day: '2026-10-20', page: 50 },
            { day: '2026-11-02', page: 100 },
            { day: DAY, page: 120 },
          ],
        }),
      ),
      DAY,
    )

    expect(view).toMatchObject({ pagesRead: 120, pagesThisWeek: 70, pagesToday: 20 })
  })

  it('doesn\'t call the pages you\'d read already today\'s reading', () => {
    const added = addBook(emptyLibrary(), { title: 'Dune', author: null, totalPages: 412, page: 300 }, 'b-1', DAY)

    expect(libraryViewOf(added, DAY)).toMatchObject({ pagesRead: 300, pagesThisWeek: 0, pagesToday: 0 })
  })

  it('counts on from the page a book came in at', () => {
    const added = addBook(emptyLibrary(), { title: 'Dune', author: null, totalPages: 412, page: 300 }, 'b-1', DAY)

    expect(libraryViewOf(setPage(added, 'b-1', 320, DAY), DAY)).toMatchObject({ pagesRead: 320, pagesToday: 20 })
  })

  it('counts a book already read through as read, and none of it as today', () => {
    const added = addBook(emptyLibrary(), { title: 'Dune', author: null, totalPages: 412, page: 412 }, 'b-1', DAY)

    expect(libraryViewOf(added, DAY)).toMatchObject({ finishedCount: 1, pagesRead: 412, pagesToday: 0 })
  })

  it('doesn\'t count the same pages twice', () => {
    const view = libraryViewOf(library(book({ id: 'a', page: 120, log: [{ day: '2026-11-01', page: 100 }, { day: '2026-11-02', page: 50 }, { day: DAY, page: 120 }] })), DAY)

    expect(view).toMatchObject({ pagesRead: 120, pagesToday: 20 })
  })

  it('doesn\'t count going back as reading', () => {
    const view = libraryViewOf(library(book({ id: 'a', page: 50, log: [{ day: '2026-11-02', page: 100 }, { day: DAY, page: 50 }] })), DAY)

    expect(view.pagesToday).toBe(0)
  })

  it('is all zeroes for an empty shelf', () => {
    expect(libraryViewOf(emptyLibrary(), DAY)).toEqual({ reading: [], finished: [], finishedCount: 0, pagesRead: 0, pagesThisWeek: 0, pagesToday: 0 })
  })
})

describe('reading the file', () => {
  it('reads what it wrote', () => {
    const shelf = library(book({ id: 'a' }))

    expect(parseLibrary(JSON.stringify(shelf))).toEqual(shelf)
  })

  it.each([
    ['not JSON', '{ nope'],
    ['no books', '{"version":1}'],
    ['a newer version', '{"version":2,"books":[]}'],
    ['books that aren\'t', '{"version":1,"books":[{"title":1}]}'],
  ])('refuses %s', (_, text) => {
    expect(parseLibrary(text)).toBe('unreadable')
  })
})
