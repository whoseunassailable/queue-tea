import { describe, expect, it } from 'vitest'

import { t } from '../../../l10n/en'
import { bookOf, EMPTY_BOOK, pageError, totalPagesError, validateBook } from './book_form'

const FORM = { ...EMPTY_BOOK, title: 'Dune', totalPages: '412' }

describe('total pages', () => {
  it.each(['1', '412', '100000', ' 412 '])('takes %s', value => {
    expect(totalPagesError(value)).toBeUndefined()
  })

  it('is required', () => {
    expect(totalPagesError('  ')).toBe(t.library.pagesRequired)
  })

  it.each(['0', 'lots', '12.5', '-3', '100001'])('refuses %s', value => {
    expect(totalPagesError(value)).toBe(t.library.pagesBad)
  })
})

describe('the page reached', () => {
  it.each(['0', '100', '412'])('takes %s of 412', value => {
    expect(pageError(value, 412)).toBeUndefined()
  })

  it.each(['413', 'ten', '1.5', '-1', ''])('refuses "%s", naming the end', value => {
    expect(pageError(value, 412)).toBe(t.library.badPage(412))
  })
})

describe('a whole book', () => {
  it('passes with a title and a total', () => {
    expect(validateBook(FORM)).toEqual({})
  })

  it('says everything that\'s wrong at once', () => {
    expect(validateBook(EMPTY_BOOK)).toEqual({ title: t.form.titleRequired, totalPages: t.library.pagesRequired })
  })

  it('checks the page against the total', () => {
    expect(validateBook({ ...FORM, page: '413' })).toEqual({ page: t.library.badPage(412) })
  })

  it('leaves the page alone until the total reads', () => {
    expect(validateBook({ ...FORM, totalPages: 'lots', page: '5' })).toEqual({ totalPages: t.library.pagesBad })
  })

  it('reads a blank page as not started, and a blank author as none', () => {
    expect(bookOf({ ...FORM, author: '  ' })).toEqual({ title: 'Dune', author: null, totalPages: 412, page: 0 })
  })

  it('trims what it keeps', () => {
    expect(bookOf({ title: ' Dune ', author: ' Frank Herbert ', totalPages: ' 412 ', page: ' 30 ' })).toEqual({ title: 'Dune', author: 'Frank Herbert', totalPages: 412, page: 30 })
  })
})
