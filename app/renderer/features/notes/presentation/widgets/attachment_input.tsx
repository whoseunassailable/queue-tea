import type { ComponentChildren } from 'preact'
import { useRef, useState } from 'preact/hooks'

import type { EngineApi } from '../../../../../shared/engine_api'
import { attachmentError, attachmentMarkdown, NOTE_FILE_ACCEPT } from '../../../../../shared/note_attachments'
import { ask } from '../../../../core/api/engine_client'
import { Spinner } from '../../../../core/widgets/states'
import { t } from '../../../../l10n/en'

type Props = { engine: EngineApi; realm: string; id: string; isLive?: boolean; children: ComponentChildren; onInsert: (markdown: string) => Promise<void> }
type State = { kind: 'idle' } | { kind: 'busy'; name: string } | { kind: 'done' } | { kind: 'failed'; message: string }

// FileReader works in both the sandboxed window and the component tests.
const bytesOf = (file: File): Promise<Uint8Array> => new Promise((done, fail) => {
  const reader = new FileReader()
  reader.onload = () => done(new Uint8Array(reader.result as ArrayBuffer))
  reader.onerror = () => fail(reader.error ?? new Error('reading a file failed'))
  reader.onabort = () => fail(new Error('reading a file was aborted'))
  reader.readAsArrayBuffer(file)
})

export const AttachmentInput = ({ engine, realm, id, isLive = true, children, onInsert }: Props) => {
  const [state, setState] = useState<State>({ kind: 'idle' })
  const [isOver, setOver] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const isBusy = useRef(false)
  const retry = useRef<File[]>([])

  const attach = async (files: File[]) => {
    if (files.length === 0) return
    setOver(false)
    for (const file of files) {
      const error = attachmentError(file)
      if (error === undefined) continue
      if (!isBusy.current) retry.current = []
      setState({ kind: 'failed', message: error === 'type' ? t.notebook.fileType : t.notebook.fileSize })

      return
    }
    if (isBusy.current) {
      retry.current = [...retry.current, ...files]

      return
    }
    isBusy.current = true
    retry.current = files
    try {
      while (retry.current.length > 0) {
        const file = retry.current[0]!
        setState({ kind: 'busy', name: file.name })
        const bytes = await bytesOf(file)
        const answer = await ask(engine, () => engine.attachNoteFile(realm, id, { name: file.name, type: file.type, bytes }))
        if (!answer.ok) {
          setState({ kind: 'failed', message: answer.message })

          return
        }
        await onInsert(attachmentMarkdown(answer.data, file.name))
        // Retrying a batch starts at the failed file, keeping earlier links once.
        retry.current = retry.current.slice(1)
      }
      setState({ kind: 'done' })
    } catch (err) {
      engine.log('error', `attaching a note file failed: ${err instanceof Error ? err.stack : String(err)}`)
      setState({ kind: 'failed', message: t.notebook.attachFailed })
    } finally {
      isBusy.current = false
    }
  }

  if (!isLive) return <>{children}</>

  return <div class={isOver ? 'nt-dropzone over' : 'nt-dropzone'}
    onDragOver={event => {
      if (!Array.from(event.dataTransfer?.types ?? []).includes('Files')) return
      event.preventDefault()
      setOver(true)
    }}
    onDragLeave={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOver(false) }}
    onDrop={event => {
      const files = Array.from(event.dataTransfer?.files ?? [])
      if (files.length === 0) return
      event.preventDefault()
      event.stopPropagation()
      void attach(files)
    }}
    onPaste={event => {
      const files = Array.from(event.clipboardData?.files ?? [])
      if (files.length === 0) return
      event.preventDefault()
      void attach(files)
    }}>
    <div class="nt-attach-bar">
      <button type="button" class="chip-btn" disabled={state.kind === 'busy'} onClick={() => input.current?.click()}>{t.notebook.attachFile}</button>
      <input ref={input} type="file" class="sr" tabIndex={-1} aria-label={t.notebook.attachFile} accept={NOTE_FILE_ACCEPT} multiple
        onChange={event => { const files = Array.from(event.currentTarget.files ?? []); event.currentTarget.value = ''; void attach(files) }} />
      <span class="hint">{isOver ? t.notebook.dropFile : t.notebook.attachHint}</span>
    </div>
    {state.kind === 'busy' && <p class="nt-file-status" role="status"><Spinner /> {t.notebook.attaching(state.name)}</p>}
    {state.kind === 'done' && <p class="nt-file-status" role="status">{t.notebook.attached}</p>}
    {state.kind === 'failed' && <p class="field-error" role="alert">{state.message}{' '}{retry.current.length > 0 && <button type="button" class="chip-btn" onClick={() => void attach(retry.current)}>{t.failed.tryAgain}</button>}</p>}
    {children}
  </div>
}
