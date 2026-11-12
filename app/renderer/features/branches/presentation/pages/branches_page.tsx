import { useEffect, useState } from 'preact/hooks'
import type { BranchState } from '../../../../../shared/branches'
import type { EngineApi } from '../../../../../shared/engine_api'
import { hrefOf, ROUTES } from '../../../../config/routing/routes'
import { useEngineRead } from '../../../../core/api/use_engine_read'
import { ReadView } from '../../../../core/widgets/read_view'
import { t } from '../../../../l10n/en'
import type { QuestActions } from '../../../quests/presentation/state_management/flow_keys'
import { FlowCard } from '../../../quests/presentation/widgets/flow_card'
import type { QuestFlow, ReadableView } from '../../../workspace/state_management/workspace_store'
import { BRANCH_POLL_MS } from '../../domain/constants'
import { BranchGraph } from '../widgets/branch_graph'
import { BranchReview } from '../widgets/branch_review'

export const BranchesPage = ({ view, actions, engine, flow, onOpen }: { view: ReadableView; actions: QuestActions; engine: EngineApi; flow: QuestFlow | undefined; onOpen: (id: string) => void }) => {
  const [selected, setSelected] = useState<string | null>(null)
  const [filter, setFilter] = useState<BranchState | 'all'>('all')
  const read = useEngineRead(engine, () => engine.readBranches(view.key), [view.key])
  useEffect(() => { if (selected) return; const timer = window.setInterval(read.refresh, BRANCH_POLL_MS); return () => window.clearInterval(timer) }, [read.refresh, selected])
  useEffect(() => setSelected(null), [view.key])
  return <main class="branch-page">
    <header class="panel branch-heading">
      <div class="sec-row"><h1>{t.branches.title}</h1><button type="button" class="btn" onClick={read.refresh}>{t.branches.refresh}</button></div>
      <p>{t.branches.line}</p>
      <p class="hint">{t.branches.active(view.activeQuests.length)}</p>
      <a class="btn" href={hrefOf(ROUTES.quests)}>{t.nav.quests}</a>
    </header>
    {flow && <FlowCard flow={flow} actions={actions} />}
    <ReadView read={read} line={t.branches.reading}>{graph => <>
      <p class="hint" role="status">{t.branches.observed(graph.at)}</p>
      {graph.tasks.length === 0 ? <p class="panel branch-heading">{t.branches.empty}</p> : <>
        <BranchGraph graph={graph} onSelect={setSelected} />
        <label class="branch-filter">{t.branches.filter}<select value={filter} onChange={e => setFilter(e.currentTarget.value as BranchState | 'all')}><option value="all">{t.branches.all}</option>{(Object.keys(t.branches.states) as BranchState[]).map(state => <option key={state} value={state}>{t.branches.states[state]}</option>)}</select></label>
        <ul class="branch-cards">{graph.tasks.filter(q => filter === 'all' || q.state === filter).map(quest => {
          const active = view.activeQuests.find(q => q.id === quest.id)
          return <li key={quest.id}><article class={`panel branch-card ${quest.state}`} aria-label={quest.title}>
            <div class="sec-row"><span class={`branch-state ${quest.state === 'working' ? 'observed-working' : ''}`}>{t.branches.states[quest.state]}</span></div>
            <h3><button type="button" class="title-btn" onClick={() => setSelected(quest.id)}>{quest.title}</button></h3>
            <p class="mono">{quest.branch} → {quest.base ?? t.branches.unknown}</p>
            <p class="hint">{quest.head ? t.branches.counts(quest.commits, quest.changed) : t.branches.missingRef}</p>
            {quest.fork && <p class="hint">{t.branches.fork(quest.fork)}</p>}
            {quest.latest && <p class="branch-latest mono">{quest.latest}</p>}
            <div class="q-actions">
              <button type="button" class="btn primary" onClick={() => setSelected(quest.id)}>{t.branches.review}</button>
              {active && <button type="button" class="btn" disabled={flow?.kind === 'working'} onClick={() => actions.onOpenClaude(active)}>{active.codexSince ? t.actions.showCodex : t.actions.openClaude}</button>}
              {quest.state === 'queued' && <button type="button" class="btn" onClick={() => onOpen(quest.id)}>{t.nav.quests}</button>}
            </div>
          </article></li>
        })}</ul>
        {!graph.tasks.some(q => filter === 'all' || q.state === filter) && <p>{t.branches.noMatch}</p>}
      </>}
    </>}</ReadView>
    {selected && <BranchReview key={selected} engine={engine} realm={view.key} id={selected} onClose={() => { setSelected(null); read.refresh() }} />}
  </main>
}
