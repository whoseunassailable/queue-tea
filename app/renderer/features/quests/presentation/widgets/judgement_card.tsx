import type { ActiveQuest } from '../../../../../shared/engine_api'
import { formatMinutes } from '../../../../core/domain/format'
import { PriorityTag } from '../../../../core/widgets/tags'
import { t } from '../../../../l10n/en'
import type { QuestActions } from '../state_management/flow_keys'

// Claude says the quest looks done, and only Rohan can say so.
export const JudgementCard = ({ active, actions, kind }: { active: ActiveQuest; actions: QuestActions; kind: 'full' | 'compact' }) => {
  const checked = active.review?.checked ?? null

  return (
    <section class={kind === 'full' ? 'quest panel' : 'active-q panel'} aria-label={t.judgement.label}>
      <div class="q-top">
        <PriorityTag priority={active.priority} />
        <span class="q-meta">{t.judgement.meta(formatMinutes(active.minutes), active.branch, t.difficulty[active.difficulty])}</span>
      </div>
      <h1 class="q-title">{t.judgement.ask(active.title)}</h1>
      {checked !== null && (
        <p class="card-note">
          <b>{t.judgement.checked}</b> {checked}
        </p>
      )}
      {active.criteria.length > 0 && (
        <ul class="chapters">
          {active.criteria.map(line => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}
      <div class="q-actions">
        <button type="button" class="btn primary" onClick={() => actions.onFinish(active)}>
          {t.judgement.yes}
        </button>
        <button type="button" class="btn" onClick={() => actions.onNotYet(active)}>
          {t.judgement.no}
        </button>
        <button type="button" class="btn" onClick={() => actions.onOpenClaude(active)}>
          {active.codexSince !== null ? t.actions.showCodex : t.actions.openClaude}
        </button>
      </div>
    </section>
  )
}
