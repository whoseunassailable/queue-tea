import { useEffect, useLayoutEffect, useState } from 'preact/hooks'
import type { BranchReview as Review } from '../../../../../shared/branches'
import type { EngineApi } from '../../../../../shared/engine_api'
import { ask } from '../../../../core/api/engine_client'
import { useEngineRead } from '../../../../core/api/use_engine_read'
import { Dialog } from '../../../../core/widgets/dialog'
import { ReadView } from '../../../../core/widgets/read_view'
import { Loading } from '../../../../core/widgets/states'
import { t } from '../../../../l10n/en'
import { MESSAGE_LIMIT } from '../../domain/constants'
import { MergeReview } from './merge_review'

type Tab = keyof typeof t.branches.tabs
const ReviewContents = ({ engine, realm, review, pending, onTarget, onRefresh, onAdopt }: { engine: EngineApi; realm: string; review: Review; pending: boolean; onTarget: (target: string) => void; onRefresh: () => void; onAdopt: (review: Review) => void }) => {
  const [tab, setTab] = useState<Tab>('overview')
  const [selected, setSelected] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [messageError, setMessageError] = useState<string | null>(null)
  const [idleFor, setIdleFor] = useState<string | null>(null)
  const idle = idleFor === review.fingerprint
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [operationId, setOperationId] = useState<string | null>(review.operation?.id ?? null)
  useLayoutEffect(() => { setSelected([]) }, [review.fingerprint])
  useEffect(() => { setOperationId(review.operation?.id ?? null) }, [review.operation?.id])
  const request = { taskId: review.taskId, target: review.target, fingerprint: review.fingerprint, idleConfirmed: idle }
  const validate = () => {
    const problem = !message.trim() ? t.branches.messageRequired : message.length > MESSAGE_LIMIT ? t.branches.messageLong : null
    setMessageError(problem); return !problem
  }
  const disabled = !!busy || pending
  const steps = tab === 'checks' ? review.steps.filter(s => s.kind === 'test') : review.steps
  return <>
    <p class="branch-direction mono">{review.source} → {review.target}</p>
    <label>{t.branches.destination}<select value={review.target} disabled={!!busy} onChange={e => onTarget(e.currentTarget.value)}>{review.targets.map(branch => <option key={branch} value={branch}>{branch}</option>)}</select></label>
    <div class="branch-tabs" role="tablist">{(Object.keys(t.branches.tabs) as Tab[]).map(name => <button type="button" role="tab" aria-selected={name === tab} class={name === tab ? 'selected' : ''} key={name} onClick={() => setTab(name)}>{t.branches.tabs[name]}</button>)}</div>
    {error && <p class="note" role="alert">{error}</p>}
    {busy && <Loading line={busy} />}
    <section role="tabpanel" aria-label={t.branches.tabs[tab]}>
      {tab === 'overview' && <>
        <p><strong>{t.branches.states[review.state]}</strong></p>
        <dl class="branch-refs"><dt>{t.branches.source}</dt><dd class="mono">{review.sourceHead}</dd><dt>{t.branches.target}</dt><dd class="mono">{review.targetHead}</dd></dl>
        <p class="hint">{t.branches.localOnly}</p>
        <h3>{t.branches.commits}</h3>
        {review.commits.length ? <ul class="branch-commits">{review.commits.map(c => <li key={c.id}><code>{c.id.slice(0, 7)}</code> {c.message}</li>)}</ul> : <p>{t.branches.noCommits}</p>}
      </>}
      {tab === 'changes' && <>
        <h3>{t.branches.files}</h3>
        {review.files.length === 0 ? <p>{t.branches.noFiles}</p> : <>
          <ul class="branch-files">{review.files.map(file => <li key={file.path}><label><input type="checkbox" checked={selected.includes(file.path)} disabled={disabled} onChange={e => setSelected(was => e.currentTarget.checked ? [...was, file.path] : was.filter(f => f !== file.path))} /><code>{file.status}</code> {file.path}</label></li>)}</ul>
          <label>{t.branches.commitMessage}<textarea value={message} disabled={disabled} onInput={e => setMessage(e.currentTarget.value)} onBlur={validate} aria-invalid={!!messageError} /></label>
          {messageError && <p role="alert">{messageError}</p>}
          <label class="branch-confirm"><input type="checkbox" checked={idle} disabled={disabled} onChange={e => setIdleFor(e.currentTarget.checked ? review.fingerprint : null)} />{t.branches.idle}</label>
          <button type="button" class="btn primary" disabled={disabled || !idle || review.state === 'working'} onClick={async () => {
            if (!validate()) return
            if (!selected.length) { setError(t.branches.selectFiles); return }
            setBusy(t.branches.committing); setError(null)
            const answer = await ask(engine, () => engine.commitBranchFiles(realm, { ...request, files: selected, message }))
            if (answer.ok) { onAdopt(answer.data); setMessage('') } else setError(answer.message)
            setBusy(null)
          }}>{t.branches.commitSelected}</button>
        </>}
        <details open><summary>{t.branches.diff}</summary><pre class="branch-diff">{review.diff}</pre></details>
        {review.truncated && <p role="status">{t.branches.truncated}</p>}
      </>}
      {(tab === 'checks' || tab === 'activity') && <>
        <p class="hint">{tab === 'checks' ? t.branches.checkHint : t.branches.activityHint}</p>
        {!steps.length && <p>{tab === 'checks' ? t.branches.noChecks : t.branches.noActivity}</p>}
        <ol class="activity-list">{steps.map(step => <li key={step.id}>
          <time>{new Date(step.at).toLocaleString()}</time><strong>{t.activity.kind[step.kind]}</strong> <span class={`activity-status ${step.status}`}>{t.activity.status[step.status]}</span>
          <code class="activity-subject">{step.subject}</code>
          {step.output && <details><summary>{t.branches.output}</summary><pre>{step.output}</pre></details>}
          {step.truncated && <p class="hint">{t.activity.excerpt}</p>}
        </li>)}</ol>
      </>}
    </section>
    {operationId ? <MergeReview key={operationId} engine={engine} realm={realm} id={operationId} remotes={review.remotes} onChanged={onRefresh} /> : <div class="merge-start">
      {review.blocked && <p role="status">{review.blocked}</p>}
      <label class="branch-confirm"><input type="checkbox" checked={idle} disabled={disabled} onChange={e => setIdleFor(e.currentTarget.checked ? review.fingerprint : null)} />{t.branches.idle}</label>
      <button type="button" class="btn primary" disabled={disabled || !!review.blocked || !idle} onClick={async () => {
        setBusy(t.branches.preparing); setError(null)
        const answer = await ask(engine, () => engine.prepareMerge(realm, request))
        if (answer.ok) { setOperationId(answer.data.operation.id); onRefresh() } else { setError(answer.message); onRefresh() }
        setBusy(null)
      }}>{t.branches.prepare}</button>
    </div>}
  </>
}

export const BranchReview = ({ engine, realm, id, onClose }: { engine: EngineApi; realm: string; id: string; onClose: () => void }) => {
  const [target, setTarget] = useState<string | null>(null)
  const read = useEngineRead(engine, () => engine.readBranch(realm, id, target), [realm, id, target])
  return <Dialog title={t.branches.review} isSheet onCancel={onClose} onSubmit={() => { /* Only a named action button may mutate Git. */ }}>
    <div class="branch-review">
      <ReadView read={read} line={t.branches.checking}>{review => <ReviewContents key={`${id}:${review.target}`} engine={engine} realm={realm} review={review} pending={read.isRefreshing} onTarget={setTarget} onRefresh={read.refresh} onAdopt={read.adopt} />}</ReadView>
    </div>
    <div class="sheet-actions"><button type="button" class="btn" onClick={read.refresh}>{t.branches.refresh}</button><button type="button" class="btn" onClick={onClose}>{t.branches.close}</button></div>
  </Dialog>
}
