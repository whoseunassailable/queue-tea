import { useRef, useState } from 'preact/hooks'

import type { Book, BookInput, EngineApi, LibraryView } from '../../../../../shared/engine_api'
import { ask } from '../../../../core/api/engine_client'
import type { Answer } from '../../../../core/api/engine_client'
import { useEngineRead } from '../../../../core/api/use_engine_read'
import { Dialog } from '../../../../core/widgets/dialog'
import { ReadView } from '../../../../core/widgets/read_view'
import { Empty } from '../../../../core/widgets/states'
import { t } from '../../../../l10n/en'
import { AddBookSheet } from '../widgets/add_book_sheet'
import { BookCard } from '../widgets/book_card'
import type { ShelfActions } from '../widgets/book_card'

const RemoveBook = ({ book, onRemove, onClose }: { book: Book; onRemove: (book: Book) => Promise<Answer<unknown>>; onClose: () => void }) => {
  const [failure, setFailure] = useState<string | null>(null)
  const isSending = useRef(false)

  const submit = async () => {
    if (isSending.current) return
    isSending.current = true
    const answer = await onRemove(book)
    isSending.current = false
    if (answer.ok) onClose()
    else setFailure(answer.message)
  }

  return (
    <Dialog title={t.library.removeTitle(book.title)} onCancel={onClose} onSubmit={() => void submit()}>
      <p class="form-line">{t.library.removeLine}</p>
      {failure !== null && (
        <p class="form-banner" role="alert">
          {failure}
        </p>
      )}
      <div class="sheet-actions">
        <button type="button" class="btn" onClick={onClose}>
          {t.actions.cancel}
        </button>
        <button type="submit" class="btn primary">
          {t.library.removeIt}
        </button>
      </div>
    </Dialog>
  )
}

const FinishedBook = ({ book, onRemove }: { book: Book; onRemove: (book: Book) => void }) => (
  <div class="set-row">
    <span>
      <span class="book-done">{book.title}</span>
      {book.author !== null && <span class="sub"> · {book.author}</span>}
    </span>
    <span class="val">{t.library.finishedOn(t.library.day(book.finished ?? book.started), book.totalPages)}</span>
    <button type="button" class="chip-btn" aria-label={t.library.remove(book.title)} onClick={() => onRemove(book)}>
      {t.library.removeShort}
    </button>
  </div>
)

const Shelf = ({ view, actions }: { view: LibraryView; actions: ShelfActions }) => {
  if (view.reading.length === 0 && view.finished.length === 0) return <Empty title={t.library.emptyTitle} line={t.library.empty} />

  return (
    <>
      <section class="panel panel-pad" aria-labelledby="lib-reading">
        <div class="sec-row">
          <h2 id="lib-reading">{t.library.reading}</h2>
        </div>
        {view.reading.length === 0 && <p class="hint">{t.library.noneReading}</p>}
        <div class="shelf">
          {view.reading.map(book => (
            <BookCard key={book.id} book={book} actions={actions} />
          ))}
        </div>
      </section>
      <section class="panel panel-pad" aria-labelledby="lib-finished">
        <div class="sec-row">
          <h2 id="lib-finished">{t.library.finished}</h2>
        </div>
        {view.finished.length === 0 && <p class="hint">{t.library.noneFinished}</p>}
        {view.finished.map(book => (
          <FinishedBook key={book.id} book={book} onRemove={actions.onRemove} />
        ))}
      </section>
    </>
  )
}

// Your reading, which belongs to no realm, so this page doesn't wait for one.
export const LibraryPage = ({ engine }: { engine: EngineApi }) => {
  const read = useEngineRead(engine, () => engine.readLibrary(), [])
  const [isAdding, setAdding] = useState(false)
  const [removing, setRemoving] = useState<Book | null>(null)

  const change = async (call: () => ReturnType<EngineApi['readLibrary']>): Promise<Answer<LibraryView>> => {
    const answer = await ask(engine, call)
    if (answer.ok) read.adopt(answer.data)

    return answer
  }
  const actions: ShelfActions = {
    onPage: (book, page) => change(() => engine.setBookPage(book.id, page)),
    onFinish: book => change(() => engine.finishBook(book.id)),
    onRemove: setRemoving,
  }

  return (
    <main class="page lib">
      <ReadView read={read} line={t.loading.library}>
        {view => (
          <>
            <div class="page-h panel">
              <h1>{t.library.title}</h1>
              {view.reading.length + view.finished.length > 0 && (
                <p class="lib-stats">
                  <b>{t.library.stats(view.finishedCount, view.pagesRead)}</b>
                  <span class="sub">{t.library.pace(view.pagesToday, view.pagesThisWeek)}</span>
                </p>
              )}
              <button type="button" class="btn primary" onClick={() => setAdding(true)}>
                {t.library.add}
              </button>
            </div>
            <Shelf view={view} actions={actions} />
          </>
        )}
      </ReadView>
      {isAdding && <AddBookSheet onAdd={(book: BookInput) => change(() => engine.addBook(book))} onClose={() => setAdding(false)} />}
      {removing !== null && <RemoveBook book={removing} onRemove={book => change(() => engine.removeBook(book.id))} onClose={() => setRemoving(null)} />}
    </main>
  )
}
