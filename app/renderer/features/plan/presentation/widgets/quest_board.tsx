import { useId, useState } from 'preact/hooks'

import { PLAN_LIMITS, PLAN_STATUSES } from '../../../../../shared/plan'
import type { PlanStatus } from '../../../../../shared/plan'
import { PriorityTag } from '../../../../core/widgets/tags'
import { t } from '../../../../l10n/en'
import { countIn, DONE_SHOWN, openWaits, targetsOf, transitionOf } from '../../domain/plan_board'
import type { BoardCard, BoardLane, MoveContext, MoveRefusal } from '../../domain/plan_board'

// Why a card can't go where it was dragged, in words that say what to do.
export const moveRefusalText = (refusal: MoveRefusal, title: string): string => {
  switch (refusal.code) {
    case 'otherRealm':
      return t.plan.refuse.otherRealm(refusal.realm)
    case 'wip':
      return t.plan.refuse.wip(refusal.limit)
    case 'stillWaits':
      return t.plan.refuse.stillWaits(title, refusal.waits.join(', '))
    case 'unsealFirst':
      return t.plan.refuse.unsealFirst(title)
    case 'startFirst':
      return t.plan.refuse.startFirst(title)
    case 'review':
      return t.plan.refuse.review
    case 'victory':
      return t.plan.refuse.victory
  }
}

type Props = {
  lanes: readonly BoardLane[]
  ctx: MoveContext
  worktrees: number
  isBusy: boolean
  onWip: (limit: number | null) => void
  onMove: (card: BoardCard, to: PlanStatus) => void
  onRefused: (text: string) => void
  onInspect: (realm: string, id: string) => void
  onOpenRealm: (realm: string) => void
}

const cardKey = (card: BoardCard) => `${card.realm.key}/${card.quest.id}`

const Card = ({ card, ctx, isBusy, onDrag, onTry, onInspect, onOpenRealm }: { card: BoardCard; ctx: MoveContext; isBusy: boolean; onDrag: (card: BoardCard | null) => void; onTry: (card: BoardCard, to: PlanStatus) => void } & Pick<Props, 'onInspect' | 'onOpenRealm'>) => {
  const { quest, realm } = card
  const id = useId()
  const isHere = realm.key === ctx.openRealm
  const targets = targetsOf(card, ctx)
  // Every other column is offered, so a move that can't happen says why.
  const choices = isHere && quest.status !== 'done' ? PLAN_STATUSES.filter(s => s !== quest.status) : []
  const waits = openWaits(quest, realm)
  const isBlocked = quest.status === 'blocked'

  return (
    <li
      class={['pl-card', quest.status, isHere ? '' : 'elsewhere', isBlocked ? 'blocked' : ''].filter(c => c !== '').join(' ')}
      draggable={targets.length > 0 && !isBusy}
      onDragStart={event => {
        event.dataTransfer?.setData('text/plain', quest.id)
        onDrag(card)
      }}
      onDragEnd={() => onDrag(null)}
    >
      <button type="button" class="pl-card-title" aria-label={t.plan.row.open(quest.title)} onClick={() => onInspect(realm.key, quest.id)}>
        {quest.isStar && <span class="pl-star" title={t.plan.row.star}>★ </span>}
        {quest.title}
      </button>
      <p class="pl-meta">
        <PriorityTag priority={quest.priority} />
        <span class="pl-points">{quest.points === null ? t.plan.row.noPoints : t.plan.row.points(quest.points)}</span>
        {quest.tags.map(tag => (
          <span key={tag} class="pl-tag">
            {tag}
          </span>
        ))}
      </p>
      {isBlocked && (waits.length > 0 || quest.blockedReason !== null) && (
        <div class="pl-blockers">
          {waits.map(other => (
            <button key={other.id} type="button" class="pl-blocker" aria-label={t.plan.pane.inspect(other.title)} onClick={() => onInspect(realm.key, other.id)}>
              {t.plan.row.waitsFor(other.title)}
            </button>
          ))}
          {quest.blockedReason !== null && <span class="pl-blocker reason">{t.plan.row.sealed(quest.blockedReason)}</span>}
        </div>
      )}
      {!isHere && (
        <p class="pl-card-foot">
          <span class="hint">{t.plan.otherRealm(realm.name)}</span>
          <button type="button" class="link-btn" onClick={() => onOpenRealm(realm.key)}>
            {t.plan.openRealm(realm.name)}
          </button>
        </p>
      )}
      {choices.length > 0 && (
        <p class="pl-card-foot">
          <label class="sr" for={id}>
            {t.plan.moveTo(quest.title)}
          </label>
          <select
            id={id}
            class="chip-select"
            value=""
            disabled={isBusy}
            onChange={event => {
              const select = event.target as HTMLSelectElement
              const to = select.value as PlanStatus | ''
              select.value = ''
              if (to !== '') onTry(card, to)
            }}
          >
            <option value="">{t.plan.moveTo(quest.title)}…</option>
            {choices.map(to => (
              <option key={to} value={to}>
                {t.plan.status[to]}
              </option>
            ))}
          </select>
        </p>
      )}
    </li>
  )
}

const WipControl = ({ ctx, onWip }: Pick<Props, 'ctx' | 'onWip'>) => {
  const id = useId()
  const limit = ctx.wipLimit
  const isOver = limit !== null && ctx.active > limit

  return (
    <div class="pl-wip">
      <label for={id}>{t.plan.wip}</label>
      <select id={id} class="chip-select" value={limit === null ? '' : String(limit)} onChange={event => {
        const value = (event.target as HTMLSelectElement).value
        onWip(value === '' ? null : Number(value))
      }}>
        <option value="">{t.plan.wipNone}</option>
        {Array.from({ length: PLAN_LIMITS.wip }, (_, i) => i + 1).map(n => (
          <option key={n} value={String(n)}>
            {n}
          </option>
        ))}
      </select>
      {limit !== null && (
        <span class={isOver ? 'pl-wip-count over' : 'pl-wip-count'} role={isOver ? 'alert' : undefined}>
          {isOver ? t.plan.wipOver(ctx.active, limit) : t.plan.wipOf(ctx.active, limit)}
        </span>
      )}
    </div>
  )
}

// Status columns, with lanes across them. Moves go through the same flows the
// Quests page uses; a move that can't happen says why.
export const QuestBoard = ({ lanes, ctx, worktrees, isBusy, onWip, onMove, onRefused, onInspect, onOpenRealm }: Props) => {
  const [dragging, setDragging] = useState<BoardCard | null>(null)
  const [over, setOver] = useState<string | null>(null)
  const isLaned = lanes.length > 1 || lanes[0]?.label !== null
  const tryMove = (card: BoardCard, to: PlanStatus) => {
    const transition = transitionOf(card, to, ctx)
    if (transition.kind === 'refused') onRefused(moveRefusalText(transition.refusal, card.quest.title))
    else if (transition.kind === 'move') onMove(card, to)
  }
  const drop = (to: PlanStatus) => {
    const card = dragging
    setDragging(null)
    setOver(null)
    if (card !== null) tryMove(card, to)
  }

  return (
    <div class="pl-board">
      <div class="pl-board-heads" role="presentation">
        {PLAN_STATUSES.map(status => (
          <div key={status} class={`pl-col-head ${status}`}>
            <h2>
              {t.plan.status[status]} <span class="pl-count">{countIn(lanes, status)}</span>
            </h2>
            {status === 'active' && (
              <>
                <WipControl ctx={ctx} onWip={onWip} />
                {worktrees > 0 && <p class="hint">{t.plan.worktrees(worktrees)}</p>}
              </>
            )}
          </div>
        ))}
      </div>
      {lanes.map(lane => (
        <section key={lane.key} class="pl-lane" aria-label={lane.label ?? t.plan.board}>
          {isLaned && <h3 class="pl-lane-title">{lane.label}</h3>}
          <div class="pl-columns">
            {PLAN_STATUSES.map(status => {
              const cards = lane.columns[status]
              const shown = status === 'done' ? cards.slice(0, DONE_SHOWN) : cards
              const dropKey = `${lane.key}:${status}`

              return (
                <div
                  key={status}
                  class={['pl-col', status, over === dropKey ? 'over' : ''].filter(c => c !== '').join(' ')}
                  aria-label={t.plan.column(t.plan.status[status], cards.length)}
                  role="group"
                  onDragOver={event => {
                    if (dragging === null) return
                    event.preventDefault()
                    setOver(dropKey)
                  }}
                  onDragLeave={() => setOver(o => (o === dropKey ? null : o))}
                  onDrop={event => {
                    event.preventDefault()
                    drop(status)
                  }}
                >
                  <ul class="pl-cards" role="list">
                    {shown.map(card => (
                      <Card key={cardKey(card)} card={card} ctx={ctx} isBusy={isBusy} onDrag={setDragging} onTry={tryMove} onInspect={onInspect} onOpenRealm={onOpenRealm} />
                    ))}
                  </ul>
                  {cards.length > shown.length && <p class="hint">{t.plan.doneMore(cards.length - shown.length)}</p>}
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
