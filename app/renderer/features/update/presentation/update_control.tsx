import { useEffect, useRef, useState } from 'preact/hooks'
import type { EngineApi } from '../../../../shared/engine_api'
import { ask } from '../../../core/api/engine_client'
import { useEngineRead } from '../../../core/api/use_engine_read'
import { Spinner } from '../../../core/widgets/states'
import { t } from '../../../l10n/en'
import { UPDATE_POLL_MS } from '../../../core/constants/constants'
import { hrefOf, ROUTES } from '../../../config/routing/routes'

export const UpdateControl = ({ engine, isSettings = false }: { engine: EngineApi; isSettings?: boolean }) => {
  const read = useEngineRead(engine, () => engine.readAppUpdate(), [engine])
  const [sending, setSending] = useState(false)
  // A failed press holds the update it was pressed on, and stops showing once a read moves past it.
  const [failure, setFailure] = useState<{ message: string; at: string } | null>(null)
  const pending = useRef(false)
  useEffect(() => {
    const timer = setInterval(read.refresh, UPDATE_POLL_MS)
    return () => clearInterval(timer)
  }, [read.refresh])
  const data = read.load.status === 'ready' ? read.load.data : null
  const phase = data?.state.phase ?? 'idle'
  const readFailed = read.note !== null
  const at = `${phase} ${data?.state.commit}`
  const busy = sending || read.load.status === 'loading' || ['queued', 'checking', 'building', 'verifying', 'installing'].includes(phase)
  const apply = async () => {
    if (pending.current) return
    if (readFailed) { read.retry(); return }
    pending.current = true; setSending(true); setFailure(null)
    const result = await ask(engine, () => engine.applyAppUpdate())
    pending.current = false; setSending(false)
    if (result.ok) read.adopt(result.data)
    else setFailure({ message: result.message, at })
  }
  const failed = failure?.at === at ? failure.message : null
  const line = failed ?? read.note ?? data?.state.detail ?? (read.load.status === 'loading' ? t.update.reading : data?.canRestart ? t.update.ready : t.update.phases[phase])
  return <div class="app-update" aria-label={t.update.label}>
    <a class={isSettings ? 'side-link on' : 'side-link'} href={hrefOf(ROUTES.settings)} aria-label={t.nav.settings} aria-current={isSettings ? 'page' : undefined}>
      {t.nav.settings} <span class="app-version" title={data?.running.commit ?? undefined}>{data ? t.update.version(data.running.version) : t.update.reading}</span>
    </a>
    <button type="button" class="update-button" disabled={sending || (!data?.canRestart && (busy || (!data?.canRetry && !readFailed)))} onClick={() => void apply()}>
      {data?.canRetry || readFailed ? t.update.retry : t.update.button}
    </button>
    <p role={failed || phase === 'failed' || read.note ? 'alert' : 'status'}>{busy && <Spinner />}{line}</p>
  </div>
}
