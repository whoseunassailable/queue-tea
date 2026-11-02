import type { BookInput } from '../../../../shared/engine_api'
import { t } from '../../../l10n/en'
import { titleError } from '../../quests/domain/quest_form'

const MOST_PAGES = 100_000
const WHOLE = /^\d+$/

export type BookForm = { title: string; author: string; totalPages: string; page: string }
export type BookField = keyof Pick<BookForm, 'title' | 'totalPages' | 'page'>
export type BookErrors = Partial<Record<BookField, string>>

export const EMPTY_BOOK: BookForm = { title: '', author: '', totalPages: '', page: '' }

export const totalPagesError = (value: string): string | undefined => {
  const trimmed = value.trim()
  if (trimmed === '') return t.library.pagesRequired

  return WHOLE.test(trimmed) && Number(trimmed) >= 1 && Number(trimmed) <= MOST_PAGES ? undefined : t.library.pagesBad
}

export const pageError = (value: string, total: number): string | undefined => (WHOLE.test(value.trim()) && Number(value.trim()) <= total ? undefined : t.library.badPage(total))

// A book you haven't started has no page to give, so an empty one is 0. A page
// can only be judged against a total that reads.
const startError = (form: BookForm): string | undefined => (form.page.trim() === '' || totalPagesError(form.totalPages) !== undefined ? undefined : pageError(form.page, Number(form.totalPages.trim())))

export const validateBook = (form: BookForm): BookErrors => {
  const errors = { title: titleError(form.title), totalPages: totalPagesError(form.totalPages), page: startError(form) }

  return Object.fromEntries(Object.entries(errors).filter(([, error]) => error !== undefined))
}

export const bookOf = (form: BookForm): BookInput => ({
  title: form.title.trim(),
  author: form.author.trim() === '' ? null : form.author.trim(),
  totalPages: Number(form.totalPages.trim()),
  page: form.page.trim() === '' ? 0 : Number(form.page.trim()),
})
