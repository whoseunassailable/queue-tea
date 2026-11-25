import { useEffect, useState } from 'preact/hooks'
import type { FolderSpace, TaskFolder } from '../../../../../shared/branches'
import type { EngineApi, Reply } from '../../../../../shared/engine_api'
import { ask } from '../../../../core/api/engine_client'
import { Dialog } from '../../../../core/widgets/dialog'
import { Empty, Failed, Loading } from '../../../../core/widgets/states'
import type { Load } from '../../../workspace/state_management/workspace_store'
import { t } from '../../../../l10n/en'
import { CHANGED_SHOWN } from '../../domain/constants'

const s = t.branches.space
const canClear = (f: TaskFolder) => !f.held && f.folders.length > 0

const FolderRow = ({ folder: f, isPicked, isBusy, onPick, onRemove }: { folder: TaskFolder; isPicked: boolean; isBusy: boolean; onPick: (on: boolean) => void; onRemove: () => void }) => {
  const [isConfirming, setConfirming] = useState(false)
  return <li class="panel space-row">
    <label class="branch-confirm"><input type="checkbox" checked={isPicked} disabled={isBusy || !canClear(f)} onChange={e => onPick(e.currentTarget.checked)} /><strong>{f.title}</strong></label>
    <p class="mono hint">{f.path}</p>
    <p>{s.size(s.bytes(f.bytes), s.bytes(f.freeable))}</p>
    {f.held ? <p class="hint">{s.held[f.held]}</p> : f.folders.length === 0 && <p class="hint">{s.nothing}</p>}
    {f.removable && (isConfirming ? <div class="space-confirm">
      <p>{s.removeHint}</p>
      <div class="q-actions">
        <button type="button" class="btn danger" disabled={isBusy} onClick={() => { setConfirming(false); onRemove() }}>{s.confirmRemove}</button>
        <button type="button" class="btn" onClick={() => setConfirming(false)}>{s.keep}</button>
      </div>
    </div> : <div class="q-actions"><button type="button" class="btn" disabled={isBusy} onClick={() => setConfirming(true)}>{s.remove}</button></div>)}
    {f.merged && f.changed.length > 0 && <details>
      <summary>{s.changed(f.changed.length)}</summary>
      <ul class="mono space-files">{f.changed.slice(0, CHANGED_SHOWN).map(c => <li key={c.path}>{c.status} {c.path}</li>)}</ul>
      {f.changed.length > CHANGED_SHOWN && <p class="hint">{s.more(f.changed.length - CHANGED_SHOWN)}</p>}
    </details>}
  </li>
}

// Measures every quest folder once when it opens, and again only when asked:
// measuring walks every build folder, so it never reruns on its own.
export const FreeSpace = ({ engine, realm, onClose }: { engine: EngineApi; realm: string; onClose: () => void }) => {
  const [load, setLoad] = useState<Load<FolderSpace>>({ status: 'loading' })
  const [picked, setPicked] = useState<string[]>([])
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<string | null>(null)
  const measure = async () => {
    setLoad({ status: 'loading' }); setDone(null); setError(null)
    const answer = await ask(engine, () => engine.readFolderSpace(realm))
    setLoad(answer.ok ? { status: 'ready', data: answer.data } : { status: 'failed', message: answer.message })
  }
  useEffect(() => { void measure() }, [realm])
  const run = async (line: string, outcome: string, call: () => Promise<Reply<FolderSpace>>) => {
    setBusy(line); setError(null); setDone(null)
    const answer = await ask(engine, call)
    setBusy(null)
    if (!answer.ok) { setError(answer.message); return }
    setLoad({ status: 'ready', data: answer.data }); setPicked([]); setDone(outcome)
  }
  const folders = load.status === 'ready' ? load.data.folders : []
  const clearable = folders.filter(canClear)
  const chosen = clearable.filter(f => picked.includes(f.path))
  const freeable = chosen.reduce((sum, f) => sum + f.freeable, 0)
  const free = () => {
    if (busy || load.status !== 'ready') return
    if (!chosen.length) { setError(s.choose); return }
    void run(s.freeing, s.freed(s.bytes(freeable)), () => engine.freeFolderSpace(realm, chosen.map(f => f.path)))
  }
  return <Dialog title={s.title} isSheet closeLabel={t.branches.close} onCancel={onClose} onSubmit={free}>
    <p>{s.line}</p>
    {load.status === 'loading' && <Loading line={s.reading} />}
    {load.status === 'failed' && <Failed message={load.message} onRetry={() => void measure()} />}
    {load.status === 'ready' && (folders.length === 0 ? <Empty title={s.empty} line={s.emptyLine} /> : <>
      <div class="sec-row"><p class="hint" role="status">{s.measured(load.data.at)}</p><button type="button" class="btn" disabled={!!busy} onClick={() => void measure()}>{s.measure}</button></div>
      {clearable.length > 0 && <label class="branch-confirm"><input type="checkbox" checked={chosen.length === clearable.length} disabled={!!busy} onChange={e => setPicked(e.currentTarget.checked ? clearable.map(f => f.path) : [])} />{s.selectAll}</label>}
      <ul class="space-list">{folders.map(f => <FolderRow key={f.path} folder={f} isPicked={chosen.includes(f)} isBusy={!!busy}
        onPick={on => setPicked(was => on ? [...was, f.path] : was.filter(p => p !== f.path))}
        onRemove={() => void run(s.removing, s.removed(f.title), () => engine.removeTaskFolder(realm, f.taskId))} />)}</ul>
    </>)}
    {busy && <Loading line={busy} />}
    {done && <p class="note" role="status">{done}</p>}
    <div class="sheet-actions">
      {error && <p class="field-error" role="alert">{error}</p>}
      <button type="submit" class="btn primary" disabled={!!busy || load.status !== 'ready'}>{chosen.length ? s.free(s.bytes(freeable), chosen.length) : s.freeNone}</button>
    </div>
  </Dialog>
}
