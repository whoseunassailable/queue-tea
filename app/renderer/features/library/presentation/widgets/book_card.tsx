import { useId, useState } from 'preact/hooks'

import type { Book } from '../../../../../shared/engine_api'
import type { Answer } from '../../../../core/api/engine_client'
import { t } from '../../../../l10n/en'
import { pageError } from '../../domain/book_form'

export type ShelfActions = { onPage: (book: Book, page: number) => Promise<Answer<unknown>>; onFinish: (book: Book) => Promise<Answer<unknown>>; onRemove: (book: Book) => void }

// A book on the go: how far through it you are, and the page you've reached,
// saved as the field is left.
export const BookCard = ({ book, actions }: { book: Book; actions: ShelfActions }) => {
  // What's being typed. Null shows the saved page, so a page saved elsewhere
  // shows here too.
  const [draft, setDraft] = useState<string | null>(null)
  const [error, setError] = useState<string | undefined>(undefined)
  const errorId = `${useId()}-error`
  const page = draft ?? String(book.page)
  const percent = Math.round((book.page / book.totalPages) * 100)

  const save = async () => {
    const problem = pageError(page, book.totalPages)
    setError(problem)
    if (problem !== undefined) return
    if (Number(page.trim()) !== book.page) {
      const answer = await actions.onPage(book, Number(page.trim()))
      if (!answer.ok) {
        setError(answer.message)

        return
      }
    }
    setDraft(null)
  }

  const finish = async () => {
    setError(undefined)
    const answer = await actions.onFinish(book)
    if (!answer.ok) setError(answer.message)
  }

  return (
    <article class="book panel panel-pad">
      <div class="book-head">
        <h3 class="book-title">{book.title}</h3>
        {book.author !== null && <p class="book-author">{book.author}</p>}
      </div>
      <span class="book-bar" role="img" aria-label={t.library.percent(percent)}>
        <span class="fill" style={{ transform: `scaleX(${book.page / book.totalPages})` }} />
      </span>
      <p class="hud-sub">{t.library.progress(percent, book.totalPages - book.page)}</p>
      <div class="book-page">
        <span aria-hidden="true">{t.library.page}</span>
        <input
          class="input"
          type="text"
          inputMode="numeric"
          aria-label={t.library.pageOf(book.title)}
          aria-invalid={error === undefined ? undefined : 'true'}
          aria-describedby={error === undefined ? undefined : errorId}
          value={page}
          onInput={event => setDraft((event.target as HTMLInputElement).value)}
          onBlur={() => void save()}
          onKeyDown={event => {
            if (event.key === 'Enter') (event.target as HTMLInputElement).blur()
          }}
        />
        <span>{t.library.ofTotal(book.totalPages)}</span>
      </div>
      {error !== undefined && (
        <p class="field-error" id={errorId}>
          {error}
        </p>
      )}
      <div class="book-actions">
        <button type="button" class="chip-btn" aria-label={t.library.finish(book.title)} onClick={() => void finish()}>
          {t.library.finishShort}
        </button>
        <button type="button" class="chip-btn" aria-label={t.library.remove(book.title)} onClick={() => actions.onRemove(book)}>
          {t.library.removeShort}
        </button>
      </div>
    </article>
  )
}
