import type { ActiveQuest, SessionInfo } from '../../../../../shared/engine_api'
import { dayAndTime, formatMinutes } from '../../../../core/domain/format'
import { GoldReward, XpReward } from '../../../../core/widgets/tags'
import { t } from '../../../../l10n/en'

// The quest in hand, on Home at full size and on the board in short.
export const ActiveCard = ({ active, session, kind }: { active: ActiveQuest; session: SessionInfo; kind: 'full' | 'compact' }) => {
  const started = active.started === null ? null : dayAndTime(active.started)

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
      {active.review === null ? (
        <p class="q-status">{t.session[session.state]}</p>
      ) : (
        <p class="q-status">
          {t.quest.judgement}
          {active.review.checked !== null && ` · ${t.quest.checked(active.review.checked)}`}
        </p>
      )}
    </section>
  )
}
