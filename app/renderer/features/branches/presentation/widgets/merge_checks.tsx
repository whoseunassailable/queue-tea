import { useState } from 'preact/hooks'
import type { MergeWorkspace } from '../../../../../shared/branches'
import { t } from '../../../../l10n/en'

export const MergeChecks = ({ workspace, busy, onRun, onCancel }: { workspace: MergeWorkspace; busy: boolean; onRun: (ids: string[]) => void; onCancel: () => void }) => {
  const [selected, setSelected] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const choices = workspace.availableChecks ?? []
  const runs = workspace.checks ?? []
  const running = runs.some(r => r.status === 'running')
  const validSelected = selected.filter(id => choices.some(c => c.id === id))
  return <section class="merge-checks" aria-label={t.branches.preparedChecks}>
    <h4>{t.branches.preparedChecks}</h4>
    <p class="hint">{t.branches.preparedChecksHint}</p>
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
      <p class="hint">{t.branches.checkedTree(run.tree.slice(0, 7))}{run.tree !== workspace.operation.tree ? ` · ${t.branches.staleChecks}` : ''}</p>
      <pre class="live-terminal" role="log" aria-label={t.branches.checkOutput(run.name)}>{run.output || t.branches.waitingOutput}</pre>
      {run.exitCode !== null && <p>{t.branches.exitCode(run.exitCode)}</p>}
      {run.truncated && <p class="hint">{t.activity.excerpt}</p>}
    </li>)}</ol>
    {choices.length > 0 && !workspace.checksCurrent && <p role="status">{t.branches.checksBeforeMerge}</p>}
  </section>
}
