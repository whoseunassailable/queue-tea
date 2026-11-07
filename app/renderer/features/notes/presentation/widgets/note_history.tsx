import { useEffect, useRef, useState } from 'preact/hooks'

import type { EngineApi } from '../../../../../shared/engine_api'
import type { Note, NoteSave, NoteVersion } from '../../../../../shared/notes'
import { ask } from '../../../../core/api/engine_client'
import { Dialog } from '../../../../core/widgets/dialog'
import { Failed, Loading, Spinner } from '../../../../core/widgets/states'
import { useWindowKeys } from '../../../../core/widgets/window_keys'
import { t } from '../../../../l10n/en'

type Read<T> = { kind: 'loading' } | { kind: 'failed'; message: string } | { kind: 'ready'; data: T }
type Saved = Extract<NoteSave, { kind: 'saved' }>
type Props = { engine: EngineApi; realm: string; note: Note; onClose: () => void; onRestored: (saved: Saved) => void; onRefresh: () => void }

export const NoteHistory = ({ engine, realm, note, onClose, onRestored, onRefresh }: Props) => {
  const [versions, setVersions] = useState<Read<NoteVersion[]>>({ kind: 'loading' })
  const [selected, setSelected] = useState<string | null>(null)
  const [preview, setPreview] = useState<Read<Note>>({ kind: 'loading' })
  const [readAttempt, setReadAttempt] = useState(0)
  const [previewAttempt, setPreviewAttempt] = useState(0)
  const [isRestoring, setRestoring] = useState(false)
  const [failure, setFailure] = useState<string | null>(null)
  const [hasConflict, setConflict] = useState(false)
  const content = useRef<HTMLDivElement>(null)
  const restoring = useRef(false)

  useEffect(() => {
    let isHere = true
    setVersions({ kind: 'loading' })
    void ask(engine, () => engine.readNoteHistory(realm, note.id)).then(answer => {
      if (!isHere) return
      setVersions(answer.ok ? { kind: 'ready', data: answer.data } : { kind: 'failed', message: answer.message })
      if (answer.ok) setSelected(answer.data[0]?.id ?? null)
    })

    return () => { isHere = false }
  }, [readAttempt])

  useEffect(() => {
    if (selected === null) return
    let isHere = true
    setPreview({ kind: 'loading' })
    void ask(engine, () => engine.readNoteVersion(realm, note.id, selected)).then(answer => {
      if (isHere) setPreview(answer.ok ? { kind: 'ready', data: answer.data } : { kind: 'failed', message: answer.message })
    })

    return () => { isHere = false }
  }, [selected, previewAttempt])

  // Keep Tab inside the modal, including while its asynchronous content changes.
  useWindowKeys(event => {
    if (event.key !== 'Tab') return
    const dialog = content.current?.closest('[role="dialog"]')
    if (dialog === null || dialog === undefined) return
    const stops = [...dialog.querySelectorAll<HTMLElement>('button:not(:disabled), [tabindex="0"]')]
    const first = stops[0]
    const last = stops.at(-1)
    const isOffStop = !stops.includes(document.activeElement as HTMLElement)
    if (event.shiftKey && (document.activeElement === first || isOffStop)) {
      event.preventDefault()
      last?.focus()
    } else if (!event.shiftKey && (document.activeElement === last || isOffStop)) {
      event.preventDefault()
      first?.focus()
    }
  })

  const isCurrent = preview.kind === 'ready' && preview.data.stamp === note.stamp
  const restore = async () => {
    if (restoring.current || hasConflict || selected === null || preview.kind !== 'ready' || isCurrent) return
    restoring.current = true
    setRestoring(true)
    setFailure(null)
    const answer = await ask(engine, () => engine.restoreNoteVersion(realm, note.id, selected, note.stamp))
    restoring.current = false
    setRestoring(false)
    if (!answer.ok) setFailure(answer.message)
    else if (answer.data.kind === 'changed') {
      setConflict(true)
      setFailure(t.notebook.history.changed)
      onRefresh()
    } else onRestored(answer.data)
  }

  return (
    <Dialog isSheet title={t.notebook.history.title(note.title)} onCancel={() => { if (!restoring.current) onClose() }} onSubmit={() => void restore()}>
      <div class="nt-history" ref={content} aria-busy={isRestoring}>
        <p class="hint">{t.notebook.history.policy}</p>
        {versions.kind === 'loading' && <Loading line={t.notebook.history.loading} />}
        {versions.kind === 'failed' && <Failed message={versions.message} onRetry={() => setReadAttempt(n => n + 1)} />}
        {versions.kind === 'ready' && versions.data.length === 0 && <p>{t.notebook.history.empty}</p>}
        {versions.kind === 'ready' && versions.data.length > 0 && (
          <div class="nt-history-grid">
            <ul class="nt-versions" aria-label={t.notebook.history.versions}>
              {versions.data.map(version => (
                <li key={version.id}>
                  <button type="button" class={selected === version.id ? 'nt-item on' : 'nt-item'} aria-pressed={selected === version.id} disabled={isRestoring} onClick={() => { if (selected === version.id) return; setPreview({ kind: 'loading' }); setSelected(version.id); if (!hasConflict) setFailure(null) }}>
                    <time dateTime={version.savedAt} title={version.savedAt}>{new Date(version.savedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'medium' })}</time>
                  </button>
                </li>
              ))}
            </ul>
            <section class="nt-version-preview">
              {preview.kind === 'loading' && <Loading line={t.notebook.history.loadingPreview} />}
              {preview.kind === 'failed' && <Failed message={preview.message} onRetry={() => setPreviewAttempt(n => n + 1)} />}
              {preview.kind === 'ready' && (
                <>
                  <h3>{preview.data.title}</h3>
                  <p class="sub">{t.notebook.folder}: {preview.data.folder}</p>
                  {preview.data.tags.length > 0 && <p class="sub">{t.notebook.tags}: {preview.data.tags.map(tag => `#${tag}`).join(' ')}</p>}
                  {isCurrent && <p class="hint">{t.notebook.history.current}</p>}
                  <pre class="nt-history-text" tabIndex={0} aria-label={t.notebook.history.preview}>{preview.data.body || t.notebook.history.emptyBody}</pre>
                </>
              )}
            </section>
          </div>
        )}
        {failure !== null && <p class="nt-banner" role="alert">{failure}</p>}
        {isRestoring && <p role="status"><Spinner /> {t.notebook.history.restoring}</p>}
        {selected !== null && <p class="hint">{t.notebook.history.restoreLine}</p>}
      </div>
      <div class="sheet-actions">
        <button type="button" class="btn" disabled={isRestoring} onClick={onClose}>{t.notebook.history.close}</button>
        {selected !== null && <button type="submit" class="btn primary" disabled={isRestoring || hasConflict || preview.kind !== 'ready' || isCurrent}>{t.notebook.history.restore}</button>}
      </div>
    </Dialog>
  )
}
