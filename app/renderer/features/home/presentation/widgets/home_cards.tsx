import type { ComponentChildren } from 'preact'

import type { ActiveQuest, QuestRow, SessionInfo } from '../../../../../shared/engine_api'
import { HOME_GROUP_PAGE } from '../../../../core/constants/constants'
import { formatMinutes, formatSpan } from '../../../../core/domain/format'
import { PriorityTag } from '../../../../core/widgets/tags'
import { t } from '../../../../l10n/en'
import type { Row } from '../../../quests/domain/board'
import type { QuestActions } from '../../../quests/presentation/state_management/flow_keys'
import { canStartRow } from '../../domain/dashboard'

// What a quest in hand is doing, in a few words: its question, its checkpoint,
// Codex, or its session.
const activeStatus = (quest: ActiveQuest, session: SessionInfo): string => {
  if (quest.review !== null || session.state === 'needsYou') return t.home.status.judgement
  if (quest.asking !== null) return t.home.status.checkpoint
  if (quest.codexSince !== null) return t.home.status.codex

  return t.home.status[session.state]
}

const rowStatus = (row: Row): string => {
  if (row.quest.sealedBecause !== null) return `⊘ ${row.quest.sealedBecause}`
  if (row.sagaOf !== null) return t.home.status.saga

  return row.quest.branch === null ? t.home.status.canStart : t.home.status.resumes
}

const rowProgress = (row: Row): string =>
  row.sagaOf === null ? t.home.about(formatSpan(row.quest.estimateMinutes)) : t.home.chapters(row.sagaOf.progress.done, row.sagaOf.progress.total)

type Pick = { isPicked: boolean; onPick: (id: string) => void }

const Body = ({ title, isStar, status, progress }: { title: string; isStar: boolean; status: string; progress: string }) => (
  <>
    <span class="hc-title">
      {isStar && (
        <span class="q-star" role="img" aria-label={t.board.mainQuest}>
          ★{' '}
        </span>
      )}
      {title}
    </span>
    <span class="hc-sub">
      {status} · {progress}
    </span>
  </>
)

// A quest in hand, compact: picking it shows its details; Pause puts it back
// on the board, keeping its branch.
export const ActiveHomeCard = ({ quest, session, actions, isPicked, onPick }: { quest: ActiveQuest; session: SessionInfo; actions: QuestActions } & Pick) => (
  <li class={isPicked ? 'hcard on' : 'hcard'}>
    <button type="button" class="hc-pick" aria-current={isPicked ? 'true' : undefined} aria-label={t.home.pick(quest.title)} onClick={() => onPick(quest.id)}>
      <Body title={quest.title} isStar={false} status={activeStatus(quest, session)} progress={t.home.so(formatMinutes(quest.minutes))} />
    </button>
    <PriorityTag priority={quest.priority} />
    {quest.review === null && (
      <button type="button" class="chip-btn" aria-label={t.home.pauseNamed(quest.title)} disabled={quest.asking === 'putBack'} onClick={() => actions.onBack(quest)}>
        {t.home.pause}
      </button>
    )}
  </li>
)

type RowCardProps = { row: Row; isBusy: boolean; onStart: (quest: QuestRow) => void; onFold: (id: string) => void } & Pick

// A quest or saga on the board, compact. A quest that can start has Start, or
// Resume when it keeps a branch from before; a saga folds its chapters.
export const RowHomeCard = ({ row, isBusy, onStart, onFold, isPicked, onPick }: RowCardProps) => {
  const { quest } = row
  const classes = ['hcard', isPicked ? 'on' : '', row.isChapter ? 'child' : '', quest.sealedBecause === null ? '' : 'sealed'].filter(c => c !== '').join(' ')
  const resumes = quest.branch !== null

  return (
    <li class={classes}>
      {row.sagaOf !== null && (
        <button type="button" class="icon-btn hc-fold" aria-expanded={!row.isFolded} aria-label={row.isFolded ? t.actions.unfold(quest.title) : t.actions.fold(quest.title)} onClick={() => onFold(quest.id)}>
          <span aria-hidden="true">{row.isFolded ? '▸' : '▾'}</span>
        </button>
      )}
      <button type="button" class="hc-pick" aria-current={isPicked ? 'true' : undefined} aria-label={t.home.pick(quest.title)} onClick={() => onPick(quest.id)}>
        <Body title={quest.title} isStar={quest.isStar && row.sagaOf === null} status={rowStatus(row)} progress={rowProgress(row)} />
      </button>
      <PriorityTag priority={quest.priority} />
      {canStartRow(row) && (
        <button type="button" class="chip-btn" aria-label={resumes ? t.home.resumeNamed(quest.title) : t.home.startNamed(quest.title)} disabled={isBusy} onClick={() => onStart(quest)}>
          {resumes ? t.home.resume : t.home.start}
        </button>
      )}
    </li>
  )
}

type GroupProps = { id: string; label: string; count: number; isFolded: boolean; hidden: number; onToggle: () => void; onMore: () => void; side?: ComponentChildren; children: ComponentChildren }

// One group of the list, folded or open, with its count in its header and
// Show more once it holds more than a page.
export const HomeGroupView = ({ id, label, count, isFolded, hidden, onToggle, onMore, side, children }: GroupProps) => (
  <section class="hgroup" aria-labelledby={id}>
    <div class="hg-head">
      <button type="button" id={id} class="hg-toggle" aria-expanded={!isFolded} onClick={onToggle}>
        <span aria-hidden="true">{isFolded ? '▸ ' : '▾ '}</span>
        {t.home.group(label, count)}
      </button>
      {side}
    </div>
    {!isFolded && children}
    {!isFolded && hidden > 0 && (
      <button type="button" class="link-btn hg-more" onClick={onMore}>
        {t.home.more(Math.min(hidden, HOME_GROUP_PAGE))}
      </button>
    )}
  </section>
)

type NextUpProps = { next: QuestRow | null; hasActive: boolean; hasWaiting: boolean; session: SessionInfo; isBusy: boolean; actions: QuestActions }

// The quest to start next, at the top, so it's never below the quests in hand.
// With nothing in hand it is Home's Now card, as before.
export const NextUp = ({ next, hasActive, hasWaiting, session, isBusy, actions }: NextUpProps) => {
  if (hasActive && next === null) return null
  const line = next === null ? (hasWaiting ? t.empty.allSealed : t.quest.noneEmpty) : t.quest.noneLine(next.title)

  return (
    <section class="quest panel home-next" aria-labelledby="home-next-title">
      <h2 class="q-title" id="home-next-title">
        {hasActive ? t.home.nextUp : t.quest.noneTitle}
      </h2>
      <p class="q-line">{hasActive && next !== null ? next.title : line}</p>
      {next?.why != null && <p class="hint">★ {next.why}</p>}
      {!hasActive && <p class="q-status">{t.session[session.state]}</p>}
      {next !== null && (
        <div class="q-actions">
          <button type="button" class="btn primary" aria-label={next.isStar ? undefined : t.home.startNext(next.title)} disabled={isBusy} onClick={() => actions.onStart(next)}>
            {next.isStar ? t.actions.startNamed(next.title) : t.home.startNamed(next.title)}
          </button>
          <button type="button" class="btn" aria-label={t.home.nextUpCodex(next.title)} disabled={isBusy} onClick={() => actions.onStart(next, 'codex')}>
            {t.actions.startCodex}
          </button>
        </div>
      )}
    </section>
  )
}
