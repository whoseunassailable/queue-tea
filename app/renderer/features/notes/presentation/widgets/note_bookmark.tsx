import { useEffect, useState } from 'preact/hooks'

import type { EngineApi } from '../../../../../shared/engine_api'
import type { NoteBookmark as Bookmark } from '../../../../../shared/note_bookmarks'
import { ask } from '../../../../core/api/engine_client'
import { Spinner } from '../../../../core/widgets/states'
import { t } from '../../../../l10n/en'

type Props = { engine: EngineApi; url: string; onOpenLink: (url: string) => void }
type State = { kind: 'loading' } | { kind: 'failed'; message: string } | { kind: 'ready'; bookmark: Bookmark }

// The link opens in every state; the preview only adds the page's own words.
export const NoteBookmark = ({ engine, url, onOpenLink }: Props) => {
  const [state, setState] = useState<State>({ kind: 'loading' })
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    let isCurrent = true
    setState({ kind: 'loading' })
    void ask(engine, () => engine.readBookmark(url)).then(answer => {
      if (isCurrent) setState(answer.ok ? { kind: 'ready', bookmark: answer.data } : { kind: 'failed', message: answer.message })
    })

    return () => { isCurrent = false }
  }, [url, attempt])

  // The Read view passes only links bookmarkUrlOf accepted, so this parses.
  const host = new URL(url).host
  const shown = state.kind === 'ready' ? state.bookmark : null
  const title = shown?.title ?? host

  return <div class="nt-bookmark">
    <a href={url} class="nt-bookmark-title" title={url} aria-label={t.notebook.openBookmark(title, host)} onClick={event => {
      event.preventDefault()
      onOpenLink(url)
    }}>{title}</a>
    {shown?.description != null && <p class="nt-bookmark-text">{shown.description}</p>}
    <span class="nt-bookmark-site">{shown?.site != null && shown.site !== host ? `${shown.site} · ${host}` : host}</span>
    {state.kind === 'loading' && <span class="nt-file-status" role="status"><Spinner /> {t.notebook.readingBookmark}</span>}
    {shown !== null && shown.title === null && shown.description === null && <span class="nt-file-status">{t.notebook.noBookmarkPreview}</span>}
    {state.kind === 'failed' && <span class="nt-file-status" role="alert">{state.message}{' '}<button type="button" class="chip-btn" onClick={() => setAttempt(attempt + 1)}>{t.failed.tryAgain}</button></span>}
  </div>
}
