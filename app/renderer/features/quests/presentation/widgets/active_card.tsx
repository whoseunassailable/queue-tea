import type { ActiveQuest, SessionInfo } from '../../../../../shared/engine_api'
import { dayAndTime, formatMinutes } from '../../../../core/domain/format'
import { Spinner } from '../../../../core/widgets/states'
import { GoldReward, XpReward } from '../../../../core/widgets/tags'
import { t } from '../../../../l10n/en'
import { askingLine } from '../../domain/flow_lines'
import type { QuestActions } from '../state_management/flow_keys'

type CardProps = { active: ActiveQuest; session: SessionInfo; actions: QuestActions; kind: 'full' | 'compact' }

// The quest in hand, on Home at full size and on the board in short.
export const ActiveCard = ({ active, session, actions, kind }: CardProps) => {
  const started = active.started === null ? null : dayAndTime(active.started)
  const waiting = askingLine(active, session.state)

  return (
    <section class={kind === 'full' ? 'quest panel' : 'active-q panel'} aria-labelledby="active-title">
      {kind === 'compact' && (
        <div class="sec-row">
          <h2>{t.quest.active}</h2>
        </div>
      )}
      <div class="q-top">
        <span class={active.isBoss ? 'tag boss' : 'tag plain'}>{active.isBoss ? t.quest.boss : t.quest.active}</span>
        <span class="q-meta">{t.quest.inProgress(formatMinutes(active.minutes), started)}</span>
      </div>
      {kind === 'full' ? (
        <h1 class="q-title" id="active-title">
          {active.title}
        </h1>
      ) : (
        <p class="aq-title" id="active-title">
          {active.title}
        </p>
      )}
      <p class="q-line">
        {active.branch !== null && <span class="mono">{active.branch} · </span>}
        {t.difficulty[active.difficulty]}
      </p>
      {kind === 'full' && (
        <div class="q-reward">
          <XpReward xp={active.xp} />
          <GoldReward gold={active.xp} />
          <span class="q-saga">{t.quest.effort(active.improvingMessages, active.filesChanged)}</span>
        </div>
      )}
      {waiting === null ? (
        <p class="q-status">{t.session[session.state]}</p>
      ) : (
        <ul class="steps" role="status">
          <li>
            <span class="st wait">
              <Spinner />
            </span>
            {waiting}
          </li>
        </ul>
      )}
      {active.asking === 'putBack' ? (
        <div class="q-actions">
          <button type="button" class="btn" onClick={() => actions.onBackNow(active)}>
            {t.actions.backNow}
          </button>
        </div>
      ) : (
        <div class="q-actions">
          <button type="button" class="btn primary" onClick={actions.onOpenClaude}>
            {t.actions.openClaude}
          </button>
          <button type="button" class="btn go" onClick={() => actions.onFinish(active)}>
            {t.actions.finish}
          </button>
          <button type="button" class="btn" onClick={() => actions.onBack(active)}>
            {t.actions.back}
          </button>
          <button type="button" class="btn" onClick={() => actions.onSealActive(active)}>
            {t.actions.seal}
          </button>
        </div>
      )}
    </section>
  )
}
