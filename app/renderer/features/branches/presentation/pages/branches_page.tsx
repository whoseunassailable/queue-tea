import { useState } from 'preact/hooks'

import type { BranchQuest, EngineApi } from '../../../../../shared/engine_api'
import { hrefOf, ROUTES } from '../../../../config/routing/routes'
import { useEngineRead } from '../../../../core/api/use_engine_read'
import { Dialog } from '../../../../core/widgets/dialog'
import { ReadView } from '../../../../core/widgets/read_view'
import { t } from '../../../../l10n/en'
import type { QuestActions } from '../../../quests/presentation/state_management/flow_keys'
import { CopyLine } from '../../../quests/presentation/widgets/copy_line'
import { FlowCard } from '../../../quests/presentation/widgets/flow_card'
import type { QuestFlow, ReadableView } from '../../../workspace/state_management/workspace_store'

const MergeDialog = ({ engine, realm, quest, onCopy, onClose }: { engine: EngineApi; realm: string; quest: BranchQuest; onCopy: (text: string) => void; onClose: () => void }) => {
  const read = useEngineRead(engine, () => engine.readMerge(realm, quest.id), [realm, quest.id])

  return <Dialog title={t.branches.merge} isSheet onCancel={onClose} onSubmit={onClose}>
    <p class="mono">{quest.branch} → {quest.baseBranch ?? t.branches.unknown}</p>
    <ReadView read={read} line={t.branches.checking}>{check => <>
      <p role="status">{check.message}</p>
      {check.command && <CopyLine text={check.command} onCopy={onCopy} />}
      {check.cleanup && <><p>{t.branches.cleanup}</p><CopyLine text={check.cleanup} onCopy={onCopy} /></>}
    </>}</ReadView>
    <p class="hint">{t.branches.manual}</p>
    <div class="sheet-actions">
      <button type="button" class="btn" onClick={read.retry}>{t.branches.checkAgain}</button>
      <button type="submit" class="btn primary">{t.branches.close}</button>
    </div>
  </Dialog>
}

export const BranchesPage = ({ view, actions, engine, flow, onOpen }: { view: ReadableView; actions: QuestActions; engine: EngineApi; flow: QuestFlow | undefined; onOpen: (id: string) => void }) => {
  const [merging, setMerging] = useState<BranchQuest | null>(null)
  const bases = [...new Set(view.branches.map(q => q.baseBranch))]
  const busy = flow?.kind === 'working'

  return <main class="branch-page">
    <header class="panel branch-heading">
      <h1>{t.branches.title}</h1>
      <p>{t.branches.line}</p>
      <p class="hint">{t.branches.active(view.activeQuests.length)}</p>
      <a class="btn" href={hrefOf(ROUTES.quests)}>{t.nav.quests}</a>
    </header>
    {flow && <FlowCard flow={flow} actions={actions} />}
    {view.branches.length === 0 && <p class="panel branch-heading">{t.branches.empty}</p>}
    {bases.map(base => <section key={base ?? ''} class="branch-group" aria-label={base ?? t.branches.unknown}>
      <h2 class="branch-base panel mono">{base ?? t.branches.unknown}</h2>
      <ul class="branch-tree">{view.branches.filter(q => q.baseBranch === base).map(quest => {
        const active = view.activeQuests.find(q => q.id === quest.id)

        return <li key={quest.id} class="branch-node">
          <article class="panel branch-card" aria-label={quest.title}>
            <div class="sec-row"><span class="tag plain">{t.branches.state[quest.state]}</span>{quest.platform && <span>{t.branches.platform[quest.platform]}</span>}</div>
            <h3>{quest.state === 'done' ? quest.title : <button type="button" class="title-btn" onClick={() => onOpen(quest.id)}>{quest.title}</button>}</h3>
            <p class="mono">{quest.branch}</p>
            {quest.parent && <button type="button" class="link-btn" onClick={() => onOpen(quest.parent!.id)}>{t.branches.saga(quest.parent.title)}</button>}
            <p class="hint branch-path">{quest.path}</p>
            <div class="q-actions">
              {active && <button type="button" class="btn primary" disabled={busy} onClick={() => actions.onOpenClaude(active)}>{active.codexSince ? t.actions.showCodex : t.actions.openClaude}</button>}
              {quest.state === 'queued' && <button type="button" class="btn" onClick={() => onOpen(quest.id)}>{t.nav.quests}</button>}
              <button type="button" class="btn" onClick={() => actions.onCopy(quest.path)}>{t.branches.folder}</button>
              <button type="button" class="btn" onClick={() => setMerging(quest)}>{t.branches.merge}</button>
            </div>
          </article>
        </li>
      })}</ul>
    </section>)}
    {merging && <MergeDialog engine={engine} realm={view.key} quest={merging} onCopy={actions.onCopy} onClose={() => setMerging(null)} />}
  </main>
}
