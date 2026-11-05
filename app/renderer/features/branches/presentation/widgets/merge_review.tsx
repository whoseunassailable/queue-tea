import { useEffect, useState } from 'preact/hooks'
import type { ConflictFile, MergeWorkspace, PushPreview } from '../../../../../shared/branches'
import type { EngineApi, Reply } from '../../../../../shared/engine_api'
import { ask } from '../../../../core/api/engine_client'
import { useEngineRead } from '../../../../core/api/use_engine_read'
import { ReadView } from '../../../../core/widgets/read_view'
import { Loading } from '../../../../core/widgets/states'
import { t } from '../../../../l10n/en'
import { MERGE_POLL_MS, MESSAGE_LIMIT } from '../../domain/constants'

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
  useEffect(() => { if (!busy) return; const timer = window.setInterval(read.refresh, MERGE_POLL_MS); return () => window.clearInterval(timer) }, [busy, read.refresh])
  const run = async (line: string, call: () => Promise<Reply<MergeWorkspace>>) => {
    if (busy) return
    setBusy(line); setError(null)
    const result = await ask(engine, call)
    if (result.ok) { read.adopt(result.data); onChanged(); setPush(null) } else { setError(result.message); read.refresh() }
    setBusy(null)
  }
  return <section class="merge-review">
    {error && <p class="note" role="alert">{error}</p>}
    {busy && <Loading line={busy} />}
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
        <button type="button" class="btn" disabled={!!busy} onClick={async () => {
          const opened = await ask(engine, () => engine.openMergeFolder(realm, op.id))
          if (!opened.ok) setError(opened.message)
        }}>{t.branches.openIntegration}</button>
        {workspace.conflicts.map(file => <ConflictEditor key={file.path} file={file} source={op.source} target={op.target} busy={!!busy} onResolve={(choice, text) => void run(t.branches.resolving, () => engine.resolveMergeFile(realm, { operationId: op.id, path: file.path, choice, ...(text === undefined ? {} : { text }) }))} />)}
        {op.stage === 'ready' || op.stage === 'applying' ? <>
          <details open><summary>{t.branches.diff}</summary><pre class="branch-diff">{workspace.diff}</pre></details>
          {workspace.truncated && <p role="status">{t.branches.truncated}</p>}
          <p class="hint">{t.branches.checkHint}</p>
          {!workspace.approval && <p role="status">{t.branches.unstaged}</p>}
          <label>{t.branches.commitMessage}<textarea value={commitMessage} disabled={!!busy || op.stage === 'applying'} onInput={e => setMessage(e.currentTarget.value)} onBlur={validateMessage} aria-invalid={!!messageError} /></label>
          {messageError && <p role="alert">{messageError}</p>}
          <label class="branch-confirm"><input type="checkbox" checked={idle} disabled={!!busy} onChange={e => setIdleFor(e.currentTarget.checked ? approval : null)} />{t.branches.idle}</label>
          <button type="button" class="btn primary" disabled={!!busy || !idle || !workspace.approval} onClick={() => {
            if (validateMessage()) void run(t.branches.completing, () => engine.completeMerge(realm, { operationId: op.id, approval: workspace.approval!, message: commitMessage, idleConfirmed: idle }))
          }}>{t.branches.approve(op.source, op.target)}</button>
        </> : null}
        {op.stage === 'merged' && op.commit && <>
          <p role="status">{t.branches.merged(op.commit, op.target)}</p>
          <p class="mono">{op.message}</p>
          {op.published && <p role="status">{t.branches.pushed(op.published.remote, op.target, op.published.commit)}</p>}
          {remotes.length === 0 ? <p>{t.branches.noRemote}</p> : <>
            <label>{t.branches.remote}<select value={remote} disabled={!!busy} onChange={e => { setRemote(e.currentTarget.value); setPush(null) }}>{remotes.map(name => <option key={name} value={name}>{name}</option>)}</select></label>
            <p class="hint">{t.branches.pushHint}</p>
            <button type="button" class="btn" disabled={!!busy} onClick={async () => {
              setBusy(t.branches.checkingRemote); setError(null); setPush(null)
              const result = await ask(engine, () => engine.readPush(realm, op.id, remote))
              if (result.ok) setPush(result.data); else setError(result.message)
              setBusy(null)
            }}>{t.branches.checkRemote}</button>
            {push && <div class="push-preview">
              <p class="mono">{push.head.slice(0, 7)} → {push.remote}/{push.branch}</p>
              <ul>{push.commits.map(c => <li key={c.id}><code>{c.id.slice(0, 7)}</code> {c.message}</li>)}</ul>
              <button type="button" class="btn primary" disabled={!!busy} onClick={() => void run(t.branches.pushing, () => engine.pushMerge(realm, push))}>{t.branches.push(push.remote, push.branch)}</button>
            </div>}
          </>}
        </>}
        {op.stage === 'failed' && <p role="status">{t.branches.retained}</p>}
        <details class="merge-log" open><summary>{t.branches.operationLog}</summary><ol>{op.events.map((event, i) => <li key={i}>
          <time>{new Date(event.at).toLocaleTimeString()}</time> <strong>{t.activity.status[event.status]}</strong><code>{event.command}</code>
          {event.output && <pre>{event.output}</pre>}
        </li>)}</ol></details>
        <div class="q-actions">
          <button type="button" class="btn" disabled={!!busy} onClick={read.refresh}>{t.branches.refresh}</button>
          {!['merged', 'abandoned', 'applying', 'committing'].includes(op.stage) && <button type="button" class="btn" disabled={!!busy} onClick={() => setAbandon(true)}>{t.branches.abandon}</button>}
        </div>
        {abandon && <div class="branch-abandon" role="group" aria-label={t.branches.abandon}>
          <p>{t.branches.abandonHint}</p>
          <button type="button" class="btn" disabled={!!busy} onClick={() => setAbandon(false)}>{t.branches.cancel}</button>
          <button type="button" class="btn danger" disabled={!!busy} onClick={() => { setAbandon(false); void run(t.branches.abandoning, () => engine.abandonMerge(realm, op.id)) }}>{t.branches.confirmAbandon}</button>
        </div>}
      </>
    }}</ReadView>
  </section>
}
