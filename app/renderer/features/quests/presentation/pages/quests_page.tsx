import { useEffect, useRef, useState } from 'preact/hooks'

import type { Priority } from '../../../../../../types'
import type { ActiveQuest, EngineApi } from '../../../../../shared/engine_api'
import { dayOf } from '../../../../core/domain/format'
import { Spinner } from '../../../../core/widgets/states'
import { useWindowKeys } from '../../../../core/widgets/window_keys'
import { useWindowWidth } from '../../../../core/widgets/window_width'
import { t } from '../../../../l10n/en'
import type { QuestFlow, ReadableView } from '../../../workspace/state_management/workspace_store'
import { openRow, rowsOf, stepFrom, withWholeSagas } from '../../domain/board'
import type { Row } from '../../domain/board'
import { DETAIL_FLOATS_BELOW, DETAIL_IS_PAGE_BELOW } from '../../../../core/constants/constants'
import { EMPTY_BOARD, filterEntries, isFiltering, showsSection } from '../../domain/search'
import type { BoardView } from '../../domain/search'
import { runFlowKey } from '../state_management/flow_keys'
import type { QuestActions } from '../state_management/flow_keys'
import type { QuestEdits } from '../state_management/quest_edits'
import { useQuestKeys } from '../state_management/quest_keys'
import type { QuestKey } from '../state_management/quest_keys'
import { ActiveCard } from '../widgets/active_card'
import { ActiveDetail } from '../widgets/active_detail'
import { AddChapter } from '../widgets/add_chapter'
import { SearchAndFilters, TimeControl } from '../widgets/board_tools'
import { EmptyBoard } from '../widgets/empty_board'
import { FlowCard } from '../widgets/flow_card'
import { JudgementCard } from '../widgets/judgement_card'
import { QuestDetail } from '../widgets/quest_detail'
import { QuestRowView } from '../widgets/quest_row'

// What the page opens above itself.
export type Sheet =
  | { kind: 'new'; parentId: string | null; title?: string }
  | { kind: 'seal'; quest: Row['quest'] }
  | { kind: 'sealActive'; quest: ActiveQuest }
  | { kind: 'finish'; quest: ActiveQuest }
  | { kind: 'move'; quest: Row['quest']; preset?: { id: string; title: string } }
  | { kind: 'remove'; quest: Row['quest']; chapters: number }

type PageProps = {
  engine: EngineApi
  view: ReadableView
  picked: string | undefined
  initialDetailOpen: boolean
  folded: readonly string[]
  savedQuest: string | null
  isRefreshing: boolean
  isSheetOpen: boolean
  letterKeys: boolean
  edits: QuestEdits
  flow: QuestFlow | undefined
  actions: QuestActions
  questNotes: Record<string, string>
  board: BoardView | undefined
  onBoard: (board: BoardView) => void
  onOpen: (id: string) => void
  onFold: (id: string) => void
  onSheet: (sheet: Sheet) => void
}

export const QuestsPage = ({ engine, view, picked, initialDetailOpen, folded, savedQuest, isRefreshing, isSheetOpen, letterKeys, edits, flow, actions, questNotes, board, onBoard, onOpen, onFold, onSheet }: PageProps) => {
  const shown = board ?? EMPTY_BOARD
  const { filters } = shown
  const isNarrowed = isFiltering(shown)
  // While it's narrowed a fold can't hide a match.
  const foldsNow = isNarrowed ? [] : folded
  const narrow = (entries: typeof view.ready) => withWholeSagas(rowsOf(filterEntries(entries, shown, view.activeSaga, view.budget), foldsNow), view)
  const ready = showsSection(filters, 'ready') ? narrow(view.ready) : []
  const sealed = showsSection(filters, 'sealed') ? narrow(view.sealed) : []
  const rows = [...ready, ...sealed]
  const open = openRow(rows, picked)
  const isEmpty = view.ready.length === 0 && view.sealed.length === 0
  // The pane shows the quest in hand once it's picked, and while it stays so.
  const activeOpen = view.activeQuests.find(quest => quest.id === picked) ?? null
  const search = shown.search.trim()
  const searchBox = useRef<HTMLInputElement>(null)
  const width = useWindowWidth()
  const isFloating = width < DETAIL_FLOATS_BELOW
  const isPaged = width < DETAIL_IS_PAGE_BELOW
  const [isDetailOpen, setDetailOpen] = useState(initialDetailOpen)
  const wasFloating = useRef(isFloating)
  useEffect(() => {
    if (wasFloating.current !== isFloating) setDetailOpen(false)
    wasFloating.current = isFloating
  }, [isFloating])
  const showDetail = !isFloating || isDetailOpen
  const openDetail = (id: string) => {
    onOpen(id)
    setDetailOpen(true)
  }
  const [dragged, setDragged] = useState<Row | null>(null)
  const [overId, setOverId] = useState<string | null>(null)
  const endDrag = () => {
    setDragged(null)
    setOverId(null)
  }
  const dragOver = (row: Row, event: DragEvent) => {
    if (dragged === null || dragged.quest.id === row.quest.id) return
    // Only a row that takes the drop cancels the event.
    event.preventDefault()
    setOverId(row.quest.id)
  }
  const drop = (row: Row) => {
    const from = dragged
    endDrag()
    if (from !== null && from.quest.id !== row.quest.id) onSheet({ kind: 'move', quest: from.quest, preset: { id: row.quest.id, title: row.quest.title } })
  }
  useWindowKeys(event => {
    if (event.key === 'f' && event.metaKey) {
      event.preventDefault()
      searchBox.current?.focus()
    }
  })
  const last = view.victories[0]?.finished ?? null

  const remove = (row: Row) => {
    if (row.sagaOf !== null) onSheet({ kind: 'remove', quest: row.quest, chapters: row.sagaOf.chapters.length })
    else void edits.remove(view.key, row.quest)
  }
  const unseal = (row: Row) => {
    if (row.quest.sealedBecause !== null) void edits.unseal(view.key, row.quest)
  }
  const toggleActiveSaga = (row: Row) => void edits.setActiveSaga(view.key, view.activeSagaId === row.quest.id ? null : row.quest)

  const canStart = (row: Row | null): row is Row => row !== null && row.quest.sealedBecause === null && flow?.kind !== 'working'

  useQuestKeys(!isSheetOpen, letterKeys, (key: QuestKey) => {
    if (key.kind === 'cancel' && isFloating && isDetailOpen) {
      setDetailOpen(false)

      return
    }
    if (key.kind === 'detail') {
      if (open !== null) openDetail(open.quest.id)

      return
    }
    if (runFlowKey(key, activeOpen === null ? view : { ...view, active: activeOpen }, flow, actions)) return
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
      isOpen={activeOpen === null && row.quest.id === open?.quest.id}
      isSaved={row.quest.id === savedQuest}
      onOpen={openDetail}
      onFold={onFold}
      onAddChild={id => onSheet({ kind: 'new', parentId: id })}
      onPriority={(r, priority: Priority) => void edits.setPriority(view.key, r.quest, priority)}
      search={search}
      isDropTarget={row.quest.id === overId}
      onDragStart={setDragged}
      onDragEnd={endDrag}
      onDragOver={dragOver}
      onDrop={drop}
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
    <main class={isFloating ? 'quests floating' : 'quests'}>
      {!(isPaged && isDetailOpen) && <div class="qlist">
        {flow !== undefined && <FlowCard flow={flow} actions={actions} />}
        {flow === undefined && view.activeQuests.map(active => active.review !== null
          ? showsSection(filters, 'judgement') && <JudgementCard key={active.id} active={active} actions={actions} kind="compact" />
          : showsSection(filters, 'active') && <ActiveCard key={active.id} active={active} session={active.session ?? view.session} actions={actions} kind="compact" onDetail={() => openDetail(active.id)} />)}
        <SearchAndFilters
          view={shown}
          hasTime={view.budget !== null}
          searchBox={searchBox}
          onChange={patch => onBoard({ ...shown, ...patch })}
          onClear={() => onBoard({ ...shown, filters: EMPTY_BOARD.filters })}
        />
        {showsSection(filters, 'ready') && <section class="board-list panel" aria-labelledby="qb-h">
          <div class="sec-row">
            <h2 id="qb-h">{t.board.title}</h2>
            <span class="sec-sub">{t.board.counts(view.canStart, view.sealedCount)}</span>
            <TimeControl budget={view.budget} onStep={actions.onStepBudget} />
            {isRefreshing && (
              <span class="sec-sub" role="status">
                <Spinner />
                {t.loading.stillReading}
              </span>
            )}
          </div>
          {view.activeSaga !== null && <p class="saga-line">{t.board.activeSaga(view.activeSaga)}</p>}
          {isEmpty && <EmptyBoard onNewQuest={() => onSheet({ kind: 'new', parentId: null })} />}
          {!isEmpty && ready.length === 0 && !isNarrowed && <p class="hint">{t.empty.allSealed}</p>}
          {isNarrowed && rows.length === 0 && (
            <p class="hint">
              {t.filters.noMatch(search)}{' '}
              {/* With only filters on, the chips above are the way out. */}
              {search !== '' && (
                <button type="button" class="link-btn" onClick={() => onBoard({ ...shown, search: '' })}>
                  {t.filters.clearSearch}
                </button>
              )}
            </p>
          )}
          {ready.length > 0 && <ul class="rows">{withAdds(ready)}</ul>}
          <button type="button" class="add-row" onClick={() => onSheet({ kind: 'new', parentId: null })}>
            + {t.actions.newQuest}
          </button>
        </section>}
        {showsSection(filters, 'sealed') && (
          <section class="fold panel" aria-label={t.board.sealed}>
            <h2>{t.board.sealed}</h2>
            <span class="sec-sub">{sealed.length === 0 ? `0 · ${t.board.sealedNone}` : view.sealedCount}</span>
            {sealed.length > 0 && <ul class="rows sealed-rows">{sealed.map(rowOf)}</ul>}
          </section>
        )}
        {showsSection(filters, 'victories') && (
          <section class="fold panel" aria-label={t.board.victories}>
            <h2>{t.board.victories}</h2>
            <span class="sec-sub">{t.board.victoriesLine(view.victoryCount, last === null ? null : dayOf(last))}</span>
          </section>
        )}
      </div>}
      {isFloating && isDetailOpen && (
        <button type="button" class={isPaged ? 'link-btn detail-back' : 'icon-btn detail-close'} aria-label={isPaged ? t.narrow.back : t.narrow.closeDetail} onClick={() => setDetailOpen(false)}>
          {isPaged ? t.narrow.back : '✕'}
        </button>
      )}
      {showDetail && activeOpen !== null && <ActiveDetail engine={engine} realm={view.key} active={activeOpen} isSaved={activeOpen.id === savedQuest} edits={edits} />}
      {showDetail && activeOpen === null && <QuestDetail
        engine={engine}
        realm={view.key}
        row={open}
        isBusy={flow?.kind === 'working'}
        note={open === null ? undefined : questNotes[open.quest.id]}
        onStart={platform => canStart(open) && actions.onStart(open.quest, platform)}
        allowance={view.session.allowance}
        isActiveSaga={open !== null && view.activeSagaId === open.quest.id}
        isSaved={open !== null && open.quest.id === savedQuest}
        edits={edits}
        onSeal={() => open !== null && onSheet({ kind: 'seal', quest: open.quest })}
        onUnseal={() => open !== null && unseal(open)}
        onPartOf={() => open !== null && onSheet({ kind: 'move', quest: open.quest })}
        onRemove={() => open !== null && remove(open)}
        onPlayNext={() => open !== null && void edits.togglePlayNext(view.key, open.quest)}
        onActiveSaga={() => open !== null && toggleActiveSaga(open)}
      />}
    </main>
  )
}
