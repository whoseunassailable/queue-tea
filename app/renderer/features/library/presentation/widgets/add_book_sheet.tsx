import { useRef, useState } from 'preact/hooks'

import type { BookInput } from '../../../../../shared/engine_api'
import type { Answer } from '../../../../core/api/engine_client'
import { Dialog } from '../../../../core/widgets/dialog'
import { Field } from '../../../../core/widgets/field'
import { t } from '../../../../l10n/en'
import { bookOf, EMPTY_BOOK, validateBook } from '../../domain/book_form'
import type { BookField } from '../../domain/book_form'

export const AddBookSheet = ({ onAdd, onClose }: { onAdd: (book: BookInput) => Promise<Answer<unknown>>; onClose: () => void }) => {
  const [form, setForm] = useState(EMPTY_BOOK)
  const [touched, setTouched] = useState<Partial<Record<BookField, boolean>>>({})
  const [failure, setFailure] = useState<string | null>(null)
  const isSending = useRef(false)
  const errors = validateBook(form)
  const errorOf = (field: BookField) => (touched[field] === true ? errors[field] : undefined)
  const touch = (field: BookField) => () => setTouched(was => ({ ...was, [field]: true }))

  const submit = async () => {
    setTouched({ title: true, totalPages: true, page: true })
    setFailure(null)
    if (isSending.current || Object.keys(errors).length > 0) return
    isSending.current = true
    const answer = await onAdd(bookOf(form))
    isSending.current = false
    if (answer.ok) onClose()
    else setFailure(answer.message)
  }

  return (
    <Dialog title={t.library.sheet} isSheet onCancel={onClose} onSubmit={() => void submit()}>
      {failure !== null && (
        <p class="form-banner" role="alert">
          {failure}
        </p>
      )}
      <Field label={t.form.title} isRequired value={form.title} error={errorOf('title')} onInput={title => setForm(was => ({ ...was, title }))} onBlur={touch('title')} onEnter={() => void submit()} />
      <Field label={t.library.author} value={form.author} onInput={author => setForm(was => ({ ...was, author }))} onEnter={() => void submit()} />
      <Field label={t.library.totalPages} isRequired value={form.totalPages} error={errorOf('totalPages')} onInput={totalPages => setForm(was => ({ ...was, totalPages }))} onBlur={touch('totalPages')} onEnter={() => void submit()} />
      <Field label={t.library.startPage} value={form.page} error={errorOf('page')} onInput={page => setForm(was => ({ ...was, page }))} onBlur={touch('page')} onEnter={() => void submit()} />
      <div class="sheet-actions">
        <button type="button" class="btn" onClick={onClose}>
          {t.actions.cancel}
        </button>
        <button type="submit" class="btn primary">
          {t.library.addIt}
        </button>
      </div>
    </Dialog>
  )
}
