import { useEffect, useRef, useState } from 'preact/hooks'
import type { HelperId } from '../../../../../../types'
import type { ConflictFile, MergeWorkspace, PushPreview } from '../../../../../shared/branches'
import type { EngineApi, Reply } from '../../../../../shared/engine_api'
import { ask } from '../../../../core/api/engine_client'
import { useEngineRead } from '../../../../core/api/use_engine_read'
import { ReadView } from '../../../../core/widgets/read_view'
import { Loading } from '../../../../core/widgets/states'
import { t } from '../../../../l10n/en'
import { useHelperJobs } from '../../../guild/presentation/state_management/helper_jobs'
import { MERGE_POLL_MS, MESSAGE_LIMIT, HELPER_DRAG } from '../../domain/constants'
import { HelperBench, helperDropped } from './helper_bench'
import { MergeChecks } from './merge_checks'

const ConflictEditor = ({ file, source, target, busy, onResolve }: { file: ConflictFile; source: string; target: string; busy: boolean; onResolve: (choice: 'base' | 'source' | 'target' | 'edited', text?: string) => void }) => {
  const [text, setText] = useState(file.result ?? file.target ?? file.source ?? '')
  const [error, setError] = useState<string | null>(null)
  return <section class="conflict-file" aria-label={file.path}>
    <h4 class="mono">{file.path}</h4>
    <div class="three-way">{(['base', 'target', 'source'] as const).map(side => <details key={side} open>
      <summary>{side === 'base' ? t.branches.base : side === 'target' ? target : source}</summary>
      <pre>{file[side] ?? t.branches.absent}</pre>
    </details>)}</div>
    {!file.editable && <p class="hint">{t.branches.binary}</p>}
    <div class="q-actions">
      <button type="button" class="btn" disabled={busy} onClick={() => onResolve('target')}>{t.branches.useTarget}</button>
      <button type="button" class="btn" disabled={busy} onClick={() => onResolve('source')}>{t.branches.useSource}</button>
      <button type="button" class="btn" disabled={busy} onClick={() => onResolve('base')}>{t.branches.useBase}</button>
    </div>
    {file.editable && <>
      <label>{t.branches.result}<textarea class="conflict-result mono" value={text} disabled={busy} onInput={e => { setText(e.currentTarget.value); setError(null) }} /></label>
      {error && <p role="alert">{error}</p>}
      <button type="button" class="btn primary" disabled={busy} onClick={() => {
        if (/^(<{7}|={7}|>{7}|\|{7})( |$)/m.test(text)) setError(t.branches.markers)
        else onResolve('edited', text)
      }}>{t.branches.saveResolution}</button>
    </>}
  </section>
}

export const MergeReview = ({ engine, realm, id, remotes, onChanged }: { engine: EngineApi; realm: string; id: string; remotes: string[]; onChanged: () => void }) => {
  const read = useEngineRead(engine, () => engine.readMergeWorkspace(realm, id), [realm, id])
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [messageError, setMessageError] = useState<string | null>(null)
  const [idleFor, setIdleFor] = useState<string | null>(null)
  const [abandon, setAbandon] = useState(false)
  const [remote, setRemote] = useState(remotes[0] ?? '')
  const [push, setPush] = useState<PushPreview | null>(null)
  const approval = read.load.status === 'ready' ? read.load.data.approval : null
  const idle = approval !== null && idleFor === approval
  const hasRunningChecks = read.load.status === 'ready' && read.load.data.checks?.some(run => run.status === 'running')
  const helpers = useHelperJobs(engine)
  // A helper resolving this merge edits its folder, so nothing else may until it is done.
  const isHelperAtWork = helpers.jobs.some(job => job.merge === id && job.status === 'working')
  const held = !!busy || isHelperAtWork
  const [isDropping, setDropping] = useState(false)
  const canSendHelper = read.load.status === 'ready' && read.load.data.operation.stage === 'conflicts' && !held
  useEffect(() => { if (!busy && !hasRunningChecks && !isHelperAtWork) return; const timer = window.setInterval(read.refresh, MERGE_POLL_MS); return () => window.clearInterval(timer) }, [busy, hasRunningChecks, isHelperAtWork, read.refresh])
  // One more read when the helper finishes, for what it staged last.
  const wasHelperAtWork = useRef(false)
  useEffect(() => { if (wasHelperAtWork.current && !isHelperAtWork) read.refresh(); wasHelperAtWork.current = isHelperAtWork }, [isHelperAtWork, read.refresh])
  const tell = (failed: string | null) => { if (failed !== null) setError(failed) }
  const sendHelper = async (helper: HelperId) => { setError(null); tell(await helpers.concile(realm, helper, id)) }
  const run = async (line: string, call: () => Promise<Reply<MergeWorkspace>>) => {
    if (busy) return
    setBusy(line); setError(null)
    const result = await ask(engine, call)
    if (result.ok) { read.adopt(result.data); onChanged(); setPush(null) } else { setError(result.message); read.refresh() }
    setBusy(null)
  }
  return <section class={`merge-review${isDropping ? ' dropping' : ''}`}
    onDragOver={event => { if (!canSendHelper || !event.dataTransfer?.types.includes(HELPER_DRAG)) return; event.preventDefault(); setDropping(true) }}
    onDragLeave={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDropping(false) }}
    onDrop={event => { setDropping(false); const helper = helperDropped(event); if (!canSendHelper || helper === null) return; event.preventDefault(); void sendHelper(helper) }}>
    {error && <p class="note" role="alert">{error}</p>}
    {busy && <Loading line={busy} />}
    {(hasRunningChecks || busy === t.branches.runningChecks) && <p class="hint">{t.branches.checksContinue}</p>}
    <ReadView read={read} line={t.branches.workspace}>{workspace => {
      const op = workspace.operation
      const commitMessage = message ?? op.message ?? t.branches.mergeMessage(op.source, op.target)
      const validateMessage = () => {
        const problem = !commitMessage.trim() ? t.branches.messageRequired : commitMessage.length > MESSAGE_LIMIT ? t.branches.messageLong : null
        setMessageError(problem); return !problem
      }
      return <>
        <h3>{t.branches.mergeStages[op.stage]}</h3>
        <p class="mono">{op.source} → {op.target}</p>
        <p class="hint">{t.branches.isolation}</p>
        <p class="hint">{t.branches.checkIntegration}</p>
        {(op.stage === 'conflicts' || helpers.jobs.some(job => job.merge === op.id)) && <HelperBench jobs={helpers.jobs} mergeId={op.id} canSend={canSendHelper}
          onSend={helper => void sendHelper(helper)} onStop={helper => void helpers.stop(helper).then(tell)} onRetry={job => void helpers.retry(job).then(tell)} />}
        <button type="button" class="btn" disabled={held} onClick={async () => {
          const opened = await ask(engine, () => engine.openMergeFolder(realm, op.id))
          if (!opened.ok) setError(opened.message)
        }}>{t.branches.openIntegration}</button>
        {workspace.conflicts.map(file => <ConflictEditor key={file.path} file={file} source={op.source} target={op.target} busy={held} onResolve={(choice, text) => void run(t.branches.resolving, () => engine.resolveMergeFile(realm, { operationId: op.id, path: file.path, choice, ...(text === undefined ? {} : { text }) }))} />)}
        {op.stage === 'ready' || op.stage === 'applying' ? <>
          <details open><summary>{t.branches.diff}</summary><pre class="branch-diff">{workspace.diff}</pre></details>
          {workspace.truncated && <p role="status">{t.branches.truncated}</p>}
          <MergeChecks workspace={workspace} busy={held} onRun={ids => void run(t.branches.runningChecks, () => engine.runMergeChecks(realm, { operationId: op.id, approval: workspace.approval!, checkIds: ids }))} onCancel={async () => {
            const result = await ask(engine, () => engine.cancelMergeChecks(realm, op.id))
            if (!result.ok) setError(result.message)
          }} />
          {!workspace.approval && <p role="status">{t.branches.unstaged}</p>}
          <label>{t.branches.commitMessage}<textarea value={commitMessage} disabled={held || op.stage === 'applying'} onInput={e => setMessage(e.currentTarget.value)} onBlur={validateMessage} aria-invalid={!!messageError} /></label>
          {messageError && <p role="alert">{messageError}</p>}
          <label class="branch-confirm"><input type="checkbox" checked={idle} disabled={held} onChange={e => setIdleFor(e.currentTarget.checked ? approval : null)} />{t.branches.idle}</label>
          <button type="button" class="btn primary" disabled={held || !idle || !workspace.approval || workspace.checksCurrent === false} onClick={() => {
            if (validateMessage()) void run(t.branches.completing, () => engine.completeMerge(realm, { operationId: op.id, approval: workspace.approval!, message: commitMessage, idleConfirmed: idle }))
          }}>{t.branches.approve(op.source, op.target)}</button>
        </> : null}
        {op.stage === 'merged' && op.commit && <>
          <p role="status">{t.branches.merged(op.commit, op.target)}</p>
          <p class="mono">{op.message}</p>
          {op.published && <p role="status">{t.branches.pushed(op.published.remote, op.target, op.published.commit)}</p>}
          {remotes.length === 0 ? <p>{t.branches.noRemote}</p> : <>
            <label>{t.branches.remote}<select value={remote} disabled={held} onChange={e => { setRemote(e.currentTarget.value); setPush(null) }}>{remotes.map(name => <option key={name} value={name}>{name}</option>)}</select></label>
            <p class="hint">{t.branches.pushHint}</p>
            <button type="button" class="btn" disabled={held} onClick={async () => {
              setBusy(t.branches.checkingRemote); setError(null); setPush(null)
              const result = await ask(engine, () => engine.readPush(realm, op.id, remote))
              if (result.ok) setPush(result.data); else setError(result.message)
              setBusy(null)
            }}>{t.branches.checkRemote}</button>
            {push && <div class="push-preview">
              <p class="mono">{push.head.slice(0, 7)} → {push.remote}/{push.branch}</p>
              <ul>{push.commits.map(c => <li key={c.id}><code>{c.id.slice(0, 7)}</code> {c.message}</li>)}</ul>
              <button type="button" class="btn primary" disabled={held} onClick={() => void run(t.branches.pushing, () => engine.pushMerge(realm, push))}>{t.branches.push(push.remote, push.branch)}</button>
            </div>}
          </>}
        </>}
        {op.stage === 'failed' && <p role="status">{t.branches.retained}</p>}
        <details class="merge-log" open><summary>{t.branches.operationLog}</summary><ol>{op.events.map((event, i) => <li key={i}>
          <time>{new Date(event.at).toLocaleTimeString()}</time> <strong>{t.activity.status[event.status]}</strong><code>{event.command}</code>
          {event.output && <pre class="live-terminal" role="log" aria-label={t.branches.operationOutput}>{event.output}</pre>}
        </li>)}</ol></details>
        <div class="q-actions">
          <button type="button" class="btn" disabled={held} onClick={read.refresh}>{t.branches.refresh}</button>
          {!['merged', 'abandoned', 'committing'].includes(op.stage) && <button type="button" class="btn" disabled={held} onClick={() => setAbandon(true)}>{t.branches.abandon}</button>}
        </div>
        {abandon && <div class="branch-abandon" role="group" aria-label={t.branches.abandon}>
          <p>{op.commit ? t.branches.abandonRetained : t.branches.abandonHint}</p>
          <button type="button" class="btn" disabled={held} onClick={() => setAbandon(false)}>{t.branches.cancel}</button>
          <button type="button" class="btn danger" disabled={held} onClick={() => { setAbandon(false); void run(t.branches.abandoning, () => engine.abandonMerge(realm, op.id)) }}>{t.branches.confirmAbandon}</button>
        </div>}
      </>
    }}</ReadView>
  </section>
}
