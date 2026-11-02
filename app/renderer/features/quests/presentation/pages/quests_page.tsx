import type { ProjectView } from '../../../../../shared/engine_api'
import { dayOf } from '../../../../core/domain/format'
import { Spinner } from '../../../../core/widgets/states'
import { PriorityTag, XpReward } from '../../../../core/widgets/tags'
import { t } from '../../../../l10n/en'
import { allRows, metaOf, openRow, rowsOf } from '../../domain/board'
import type { Row } from '../../domain/board'
import { ActiveCard } from '../widgets/active_card'
import { QuestDetail } from '../widgets/quest_detail'

type View = Extract<ProjectView, { kind: 'readable' }>

const RowButton = ({ row, isOpen, onOpen }: { row: Row; isOpen: boolean; onOpen: (id: string) => void }) => {
  const { quest, isChapter } = row
  const parts = ['qrow', isChapter ? 'child' : '', isOpen ? 'sel' : '', quest.sealedBecause === null ? '' : 'sealed'].filter(part => part !== '')

  return (
    <li>
      <button type="button" class={parts.join(' ')} aria-pressed={isOpen ? 'true' : 'false'} onClick={() => onOpen(quest.id)}>
        <span class="qr-mark" aria-label={quest.isStar ? t.board.mainQuest : undefined}>
          {quest.isStar ? '★' : ''}
        </span>
        <span class="qc-body">
          <span class="qc-title">{quest.title}</span>
          <span class="qc-sub">{metaOf(row)}</span>
          {quest.why !== null && <span class="qc-sub">★ {quest.why}</span>}
        </span>
        <span class="qc-side">
          <PriorityTag priority={quest.priority} />
          <XpReward xp={quest.xp} />
        </span>
      </button>
    </li>
  )
}

export const QuestsPage = ({ view, picked, isRefreshing, onOpen }: { view: View; picked: string | undefined; isRefreshing: boolean; onOpen: (id: string) => void }) => {
  const ready = rowsOf(view.ready)
  const sealed = rowsOf(view.sealed)
  const open = openRow(allRows(view), picked)
  const isEmpty = ready.length === 0 && sealed.length === 0
  const last = view.victories[0]?.finished ?? null

  return (
    <main class="quests">
      <div class="qlist">
        {view.active !== null && <ActiveCard active={view.active} session={view.session} kind="compact" />}
        <section class="board-list panel" aria-labelledby="qb-h">
          <div class="sec-row">
            <h2 id="qb-h">{t.board.title}</h2>
            <span class="sec-sub">{t.board.counts(view.canStart, view.sealedCount)}</span>
            {isRefreshing && (
              <span class="sec-sub" role="status">
                <Spinner />
                {t.loading.stillReading}
              </span>
            )}
          </div>
          {view.activeSaga !== null && <p class="saga-line">{t.board.activeSaga(view.activeSaga)}</p>}
          {isEmpty && <p class="hint">{t.empty.boardTitle}. {t.empty.boardLine}</p>}
          {!isEmpty && ready.length === 0 && <p class="hint">{t.empty.allSealed}</p>}
          {ready.length > 0 && (
            <ul class="rows">
              {ready.map(row => (
                <RowButton key={row.quest.id} row={row} isOpen={row.quest.id === open?.quest.id} onOpen={onOpen} />
              ))}
            </ul>
          )}
        </section>
        <section class="fold panel" aria-label={t.board.sealed}>
          <h2>{t.board.sealed}</h2>
          <span class="sec-sub">{sealed.length === 0 ? `0 · ${t.board.sealedNone}` : view.sealedCount}</span>
          {sealed.length > 0 && (
            <ul class="rows sealed-rows">
              {sealed.map(row => (
                <RowButton key={row.quest.id} row={row} isOpen={row.quest.id === open?.quest.id} onOpen={onOpen} />
              ))}
            </ul>
          )}
        </section>
        <section class="fold panel" aria-label={t.board.victories}>
          <h2>{t.board.victories}</h2>
          <span class="sec-sub">{t.board.victoriesLine(view.victoryCount, last === null ? null : dayOf(last))}</span>
        </section>
      </div>
      <QuestDetail row={open} hasActive={view.active !== null} />
    </main>
  )
}
