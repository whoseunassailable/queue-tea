import { useEffect, useState } from 'preact/hooks'

import type { EngineApi } from '../../../../../shared/engine_api'
import { noteFileUrl } from '../../../../../shared/note_attachments'
import type { NoteAttachment as File } from '../../../../../shared/note_attachments'
import { ask } from '../../../../core/api/engine_client'
import { Spinner } from '../../../../core/widgets/states'
import { t } from '../../../../l10n/en'

type Props = { engine: EngineApi; realm: string; path: string; name: string; embedded: boolean }
type State = { kind: 'loading' } | { kind: 'failed'; message: string } | { kind: 'ready'; file: File }

export const NoteAttachment = ({ engine, realm, path, name, embedded }: Props) => {
  const [state, setState] = useState<State>({ kind: 'loading' })
  const [attempt, setAttempt] = useState(0)
  const [isPreview, setPreview] = useState(false)
  const [isLoading, setLoading] = useState(true)
  const [isDownloading, setDownloading] = useState(false)
  const [download, setDownload] = useState('')
  useEffect(() => {
    let isCurrent = true
    setState({ kind: 'loading' })
    setLoading(true)
    void ask(engine, () => engine.readNoteFile(realm, path)).then(answer => {
      if (isCurrent) setState(answer.ok ? { kind: 'ready', file: answer.data } : { kind: 'failed', message: answer.message })
    })

    return () => { isCurrent = false }
  }, [realm, path, attempt])

  const save = async () => {
    setDownloading(true)
    setDownload('')
    const answer = await ask(engine, () => engine.downloadNoteFile(realm, path))
    setDownloading(false)
    if (!answer.ok) setDownload(answer.message)
    else if (answer.data) setDownload(t.notebook.downloaded)
  }
  if (state.kind === 'loading') return <span class="nt-file" role="status"><Spinner /> {t.notebook.readingFile(name)}</span>
  if (state.kind === 'failed') return <span class="nt-file" role="alert">{name}: {state.message}{' '}<button type="button" class="chip-btn" onClick={() => setAttempt(attempt + 1)}>{t.failed.tryAgain}</button></span>
  const url = noteFileUrl(realm, state.file.path)
  const isImage = state.file.kind === 'image' && embedded
  const isPdf = state.file.kind === 'pdf'
  const previewFailed = () => {
    engine.log('error', `note preview failed: ${path}`)
    setState({ kind: 'failed', message: t.notebook.previewFailed })
  }

  return <span class="nt-file">
    <span class="nt-file-actions">
      <span>{name}</span>
      {isPdf && <button type="button" class="chip-btn" aria-label={t.notebook.previewPdfName(name)} aria-expanded={isPreview} onClick={() => { setPreview(!isPreview); setLoading(true) }}>{isPreview ? t.notebook.closePreview : t.notebook.previewPdf}</button>}
      <button type="button" class="chip-btn" disabled={isDownloading} aria-label={t.notebook.downloadFile(name)} onClick={() => void save()}>{t.notebook.download}</button>
    </span>
    {(isDownloading || ((isImage || isPreview) && isLoading)) && <span class="nt-file-status" role="status"><Spinner /> {isDownloading ? t.notebook.downloading : t.notebook.loadingPreview}</span>}
    {isImage && <img key={attempt} class="nt-file-image" src={url} alt={name} onLoad={() => setLoading(false)} onError={previewFailed} />}
    {isPdf && isPreview && <iframe key={attempt} class="nt-file-pdf" src={`${url}#navpanes=0&view=FitH`} title={t.notebook.pdfTitle(name)} onLoad={() => setLoading(false)} onError={previewFailed} />}
    {download !== '' && <span class="nt-file-status" role={download === t.notebook.downloaded ? 'status' : 'alert'}>{download}</span>}
  </span>
}
