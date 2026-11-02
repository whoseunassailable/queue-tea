import { dayOf, formatSpan } from '../../../../core/domain/format'
import { GoldReward, PriorityTag, XpReward } from '../../../../core/widgets/tags'
import { t } from '../../../../l10n/en'
import type { Row } from '../../domain/board'

export const QuestDetail = ({ row, hasActive }: { row: Row | null; hasActive: boolean }) => {
  if (row === null) {
    return (
      <aside class="detail panel" aria-label={t.detail.label}>
        <p class="ph">{t.detail.pick}</p>
      </aside>
    )
  }
  const { quest, sagaOf } = row
  const kind = quest.sealedBecause !== null ? t.detail.sealed : sagaOf !== null ? t.detail.saga : t.detail.quest

  return (
    <aside class="detail panel" aria-label={t.detail.label}>
      <p class="d-kind">{t.detail.onBoard(kind)}</p>
      <h2 class="d-title">{quest.title}</h2>
      <div class="d-chips">
        <PriorityTag priority={quest.priority} />
        <span class="tag plain">{t.difficulty[quest.difficulty]}</span>
        <span class="d-est">~{formatSpan(quest.estimateMinutes)}</span>
      </div>
      <div class="d-reward">
        <XpReward xp={quest.xp} />
        <GoldReward gold={quest.xp} />
      </div>
      {hasActive && <p class="hint">{t.board.startHint}</p>}
      <hr />
      {quest.why !== null && <p class="d-star">{t.detail.main(quest.why)}</p>}
      {quest.sealedBecause !== null && <p class="d-star">⊘ {quest.sealedBecause}</p>}
      <h3>{t.detail.description}</h3>
      <p class={quest.description === null ? 'ph' : ''}>{quest.description ?? t.detail.noDescription}</p>
      <h3>{t.detail.criteria}</h3>
      {quest.criteria.length === 0 ? (
        <p class="ph">{t.detail.noCriteria}</p>
      ) : (
        <ul class="chapters">
          {quest.criteria.map(line => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}
      {sagaOf?.kind === 'saga' && (
        <>
          <h3>{t.detail.chapters(sagaOf.chapters.length)}</h3>
          <ul class="chapters">
            {sagaOf.chapters.map(chapter => (
              <li key={chapter.id}>{chapter.title}</li>
            ))}
          </ul>
        </>
      )}
      <hr />
      <dl class="facts">
        <dt>{t.detail.branch}</dt>
        <dd class="mono">{quest.branch ?? t.detail.noBranch}</dd>
        <dt>{t.detail.filed}</dt>
        <dd>{dayOf(quest.created)}</dd>
      </dl>
    </aside>
  )
}
