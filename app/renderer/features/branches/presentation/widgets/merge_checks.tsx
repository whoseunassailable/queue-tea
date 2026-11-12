import { useEffect, useState } from 'preact/hooks'
import type { MergeWorkspace } from '../../../../../shared/branches'
import { t } from '../../../../l10n/en'
import { CHECK_CLOCK_MS } from '../../domain/constants'

const duration = (ms: number) => { const seconds = Math.floor(Math.max(0, ms) / 1000); return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}` }

export const MergeChecks = ({ workspace, busy, onRun, onCancel }: { workspace: MergeWorkspace; busy: boolean; onRun: (ids: string[]) => void; onCancel: () => void }) => {
  const [selected, setSelected] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const choices = workspace.availableChecks ?? []
  // Keep retry history on disk without rendering every old log on each tick.
  const latest = new Map((workspace.checks ?? []).filter(run => choices.some(choice => choice.id === run.checkId)).map(run => [run.checkId, run]))
  const runs = [...latest.values()]
  const running = (workspace.checks ?? []).some(r => r.status === 'running')
  const [now, setNow] = useState(Date.now)
  useEffect(() => {
    if (!running) return
    setNow(Date.now())
    const timer = window.setInterval(() => setNow(Date.now()), CHECK_CLOCK_MS)
    return () => window.clearInterval(timer)
  }, [running])
  const validSelected = selected.filter(id => choices.some(c => c.id === id))
  return <section class="merge-checks" aria-label={t.branches.preparedChecks}>
    <h4>{t.branches.preparedChecks}</h4>
    <p class="hint">{t.branches.preparedChecksHint}</p>
    {runs.length > 0 && <p class="hint">{t.branches.latestChecks}</p>}
    {choices.length === 0 ? <p>{t.branches.noConfiguredChecks}</p> : <>
      <ul class="branch-files">{choices.map(choice => <li key={choice.id}><label>
        <input type="checkbox" disabled={busy || running} checked={validSelected.includes(choice.id)} onChange={e => {
          const checked = e.currentTarget.checked
          setSelected(was => checked ? [...was, choice.id] : was.filter(id => id !== choice.id)); setError(null)
        }} /><span><strong>{choice.name}</strong><code class="activity-subject">{choice.command}</code></span>
      </label></li>)}</ul>
      {error && <p role="alert">{error}</p>}
      <button type="button" class="btn primary" disabled={busy || running || !workspace.approval} onClick={() => {
        if (!validSelected.length) { setError(t.branches.chooseChecks); return }
        onRun(validSelected)
      }}>{t.branches.runChecks}</button>
    </>}
    {running && <button type="button" class="btn" onClick={onCancel}>{t.branches.cancelChecks}</button>}
    <ol class="check-runs">{runs.map(run => <li key={run.id}>
      <div class="sec-row"><strong>{run.name}</strong><span>{t.branches.checkStatus[run.status]}</span></div>
      <code>{run.command}</code>
      <p class="hint">{run.finished === null ? t.branches.checkElapsed(duration(now - run.at)) : t.branches.checkDuration(duration(run.finished - run.at))}</p>
      <p class="hint">{t.branches.checkedTree(run.tree.slice(0, 7))}{run.tree !== workspace.operation.tree ? ` · ${t.branches.staleChecks}` : ''}</p>
      <pre class="live-terminal" role="log" aria-label={t.branches.checkOutput(run.name)}>{run.output || t.branches.waitingOutput}</pre>
      {run.exitCode !== null && <p>{t.branches.exitCode(run.exitCode)}</p>}
      {run.truncated && <p class="hint">{t.activity.excerpt}</p>}
    </li>)}</ol>
    {choices.length > 0 && !workspace.checksCurrent && <p role="status">{t.branches.checksBeforeMerge}</p>}
  </section>
}
