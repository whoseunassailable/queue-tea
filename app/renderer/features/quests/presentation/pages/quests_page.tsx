import type { Priority } from '../../../../../../types'
import type { ActiveQuest } from '../../../../../shared/engine_api'
import { dayOf } from '../../../../core/domain/format'
import { Spinner } from '../../../../core/widgets/states'
import { t } from '../../../../l10n/en'
import type { QuestFlow, ReadableView } from '../../../workspace/state_management/workspace_store'
import { allRows, openRow, rowsOf, stepFrom } from '../../domain/board'
import type { Row } from '../../domain/board'
import { runFlowKey } from '../state_management/flow_keys'
import type { QuestActions } from '../state_management/flow_keys'
import type { QuestEdits } from '../state_management/quest_edits'
import { useQuestKeys } from '../state_management/quest_keys'
import type { QuestKey } from '../state_management/quest_keys'
import { ActiveCard } from '../widgets/active_card'
import { AddChapter } from '../widgets/add_chapter'
import { FlowCard } from '../widgets/flow_card'
import { JudgementCard } from '../widgets/judgement_card'
import { QuestDetail } from '../widgets/quest_detail'
import { QuestRowView } from '../widgets/quest_row'

// What the page opens above itself.
export type Sheet =
  | { kind: 'new'; parentId: string | null }
  | { kind: 'seal'; quest: Row['quest'] }
  | { kind: 'sealActive'; quest: ActiveQuest }
  | { kind: 'finish'; quest: ActiveQuest }
  | { kind: 'move'; quest: Row['quest'] }
  | { kind: 'remove'; quest: Row['quest']; chapters: number }

type PageProps = {
  view: ReadableView
  picked: string | undefined
  folded: readonly string[]
  savedQuest: string | null
  isRefreshing: boolean
  isSheetOpen: boolean
  edits: QuestEdits
  flow: QuestFlow | undefined
  actions: QuestActions
  questNotes: Record<string, string>
  onOpen: (id: string) => void
  onFold: (id: string) => void
  onSheet: (sheet: Sheet) => void
}

export const QuestsPage = ({ view, picked, folded, savedQuest, isRefreshing, isSheetOpen, edits, flow, actions, questNotes, onOpen, onFold, onSheet }: PageProps) => {
  const ready = rowsOf(view.ready, folded)
  const sealed = rowsOf(view.sealed, folded)
  const rows = allRows(view, folded)
  const open = openRow(rows, picked)
  const isEmpty = ready.length === 0 && sealed.length === 0
  const last = view.victories[0]?.finished ?? null

  const remove = (row: Row) => {
    if (row.sagaOf !== null) onSheet({ kind: 'remove', quest: row.quest, chapters: row.sagaOf.chapters.length })
    else void edits.remove(view.key, row.quest)
  }
  const unseal = (row: Row) => {
    if (row.quest.sealedBecause !== null) void edits.unseal(view.key, row.quest)
  }
  const toggleActiveSaga = (row: Row) => void edits.setActiveSaga(view.key, view.activeSagaId === row.quest.id ? null : row.quest)

  const canStart = (row: Row | null): row is Row => row !== null && view.active === null && row.quest.sealedBecause === null

  useQuestKeys(!isSheetOpen, (key: QuestKey) => {
    if (runFlowKey(key, view, flow, actions)) return
    if (key.kind === 'start') {
      if (canStart(open)) actions.onStart(open.quest)

      return
    }
    if (key.kind === 'up' || key.kind === 'down') {
      const next = stepFrom(rows, open?.quest.id, key.kind === 'up' ? -1 : 1)
      if (next !== null) onOpen(next.quest.id)

      return
    }
    if (open === null) return
    if (key.kind === 'fold' || key.kind === 'unfold') {
      if (open.sagaOf !== null && (key.kind === 'fold') !== open.isFolded) onFold(open.quest.id)
      else if (key.kind === 'fold' && open.quest.parentId !== null) onOpen(open.quest.parentId)
    } else if (key.kind === 'priority') {
      if (key.priority !== open.quest.priority) void edits.setPriority(view.key, open.quest, key.priority)
    } else if (key.kind === 'playNext') void edits.togglePlayNext(view.key, open.quest)
    else if (key.kind === 'seal') onSheet({ kind: 'seal', quest: open.quest })
    else if (key.kind === 'unseal') unseal(open)
    else if (key.kind === 'partOf') onSheet({ kind: 'move', quest: open.quest })
    else if (key.kind === 'activeSaga') toggleActiveSaga(open)
    else remove(open)
  })

  const rowOf = (row: Row) => (
    <QuestRowView
      key={row.quest.id}
      row={row}
      isOpen={row.quest.id === open?.quest.id}
      isSaved={row.quest.id === savedQuest}
      onOpen={onOpen}
      onFold={onFold}
      onPriority={(r, priority: Priority) => void edits.setPriority(view.key, r.quest, priority)}
    />
  )
  // Each unfolded saga ends with its Add a chapter row.
  const withAdds = (list: Row[]) =>
    list.flatMap((row, i) => {
      const next = list[i + 1]
      const saga = row.isChapter ? [...list.slice(0, i)].reverse().find(r => r.sagaOf !== null) : row
      const endsSaga = saga?.sagaOf != null && !saga.isFolded && next?.isChapter !== true

      return endsSaga ? [rowOf(row), <AddChapter key={`add-${saga.quest.id}`} realm={view.key} saga={saga.quest} edits={edits} />] : [rowOf(row)]
    })

  return (
    <main class="quests">
      <div class="qlist">
        {flow !== undefined && <FlowCard flow={flow} actions={actions} />}
        {flow === undefined && view.active !== null && view.active.review !== null && <JudgementCard active={view.active} actions={actions} kind="compact" />}
        {flow === undefined && view.active !== null && view.active.review === null && <ActiveCard active={view.active} session={view.session} actions={actions} kind="compact" />}
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
          {ready.length > 0 && <ul class="rows">{withAdds(ready)}</ul>}
          <button type="button" class="add-row" onClick={() => onSheet({ kind: 'new', parentId: null })}>
            + {t.actions.newQuest}
          </button>
        </section>
        <section class="fold panel" aria-label={t.board.sealed}>
          <h2>{t.board.sealed}</h2>
          <span class="sec-sub">{sealed.length === 0 ? `0 · ${t.board.sealedNone}` : view.sealedCount}</span>
          {sealed.length > 0 && <ul class="rows sealed-rows">{sealed.map(rowOf)}</ul>}
        </section>
        <section class="fold panel" aria-label={t.board.victories}>
          <h2>{t.board.victories}</h2>
          <span class="sec-sub">{t.board.victoriesLine(view.victoryCount, last === null ? null : dayOf(last))}</span>
        </section>
      </div>
      <QuestDetail
        realm={view.key}
        row={open}
        hasActive={view.active !== null}
        isBusy={flow?.kind === 'working'}
        note={open === null ? undefined : questNotes[open.quest.id]}
        onStart={() => canStart(open) && actions.onStart(open.quest)}
        isActiveSaga={open !== null && view.activeSagaId === open.quest.id}
        isSaved={open !== null && open.quest.id === savedQuest}
        edits={edits}
        onSeal={() => open !== null && onSheet({ kind: 'seal', quest: open.quest })}
        onUnseal={() => open !== null && unseal(open)}
        onPartOf={() => open !== null && onSheet({ kind: 'move', quest: open.quest })}
        onRemove={() => open !== null && remove(open)}
        onPlayNext={() => open !== null && void edits.togglePlayNext(view.key, open.quest)}
        onActiveSaga={() => open !== null && toggleActiveSaga(open)}
      />
    </main>
  )
}
