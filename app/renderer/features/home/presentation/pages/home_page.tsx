import { useEffect, useMemo, useRef, useState } from 'preact/hooks'

import type { EngineApi, GameView, HomeGroup, HomeNav, LiveFacts, SessionState } from '../../../../../shared/engine_api'
import { useEngineRead } from '../../../../core/api/use_engine_read'
import { DETAIL_FLOATS_BELOW, DETAIL_IS_PAGE_BELOW, GROWS_AT, HOME_BADGES } from '../../../../core/constants/constants'
import { dayOf, formatMinutes } from '../../../../core/domain/format'
import { Dragon } from '../../../../core/widgets/art'
import { useWindowKeys } from '../../../../core/widgets/window_keys'
import { useWindowWidth } from '../../../../core/widgets/window_width'
import { t } from '../../../../l10n/en'
import { EMPTY_BOARD } from '../../../quests/domain/search'
import type { BoardView } from '../../../quests/domain/search'
import type { Sheet } from '../../../quests/presentation/pages/quests_page'
import { runFlowKey } from '../../../quests/presentation/state_management/flow_keys'
import type { QuestActions } from '../../../quests/presentation/state_management/flow_keys'
import type { QuestEdits } from '../../../quests/presentation/state_management/quest_edits'
import { useQuestKeys } from '../../../quests/presentation/state_management/quest_keys'
import { SearchAndFilters, TimeControl } from '../../../quests/presentation/widgets/board_tools'
import { EmptyBoard } from '../../../quests/presentation/widgets/empty_board'
import { FlowCard } from '../../../quests/presentation/widgets/flow_card'
import type { Load, QuestFlow, ReadableView } from '../../../workspace/state_management/workspace_store'
import { allItemsOf, canStartRow, dashboardOf, FIRST_NAV, groupsOf, nextUpOf, pickedOf, shownOf, stepItem, toggleGroup, visibleItemsOf } from '../../domain/dashboard'
import { ActiveHomeCard, HomeGroupView, NextUp, RowHomeCard } from '../widgets/home_cards'
import { HomeDetail } from '../widgets/home_detail'
import '../home.css'

const Lair = ({ game, session, onPet }: { game: Load<GameView>; session: SessionState; onPet: () => void }) => {
  const stage = game.status === 'ready' ? game.data.stage : 'hatchling'

  return (
    <section class="lair" aria-label={t.dragon.plaque(t.stage[stage])}>
      <Dragon stage={stage} onPet={onPet} />
      <div class="plaque panel">
        <span class="plaque-name">{t.dragon.plaque(t.stage[stage])}</span>
        {game.status === 'ready' && <span class="plaque-sub">{t.dragon.level(game.data.level, GROWS_AT[stage])}</span>}
        <span class="plaque-mood">{t.mood[session]}</span>
      </div>
    </section>
  )
}

const Glory = ({ view, game }: { view: ReadableView; game: Load<GameView> }) => (
  <section class="glory panel" aria-labelledby="g-title">
    <div class="sec-h">
      <h2 id="g-title">{t.glory.title}</h2>
      {game.status === 'ready' && <span class="sec-sub">{t.glory.line(game.data.victories)}</span>}
    </div>
    {view.victories.length === 0 && <p class="hint">{game.status === 'ready' && game.data.victories > 0 ? t.empty.noVictoriesHere : t.empty.noVictories}</p>}
    {view.victories.map(v => (
      <p key={v.id} class="victory-row">
        <span>{v.title}</span>
        <span class="v-meta">{t.glory.victory(dayOf(v.finished), formatMinutes(v.minutes), v.xp)}</span>
      </p>
    ))}
    {game.status === 'ready' && (
      <ul class="badges" aria-label={t.glory.badges}>
        {[...game.data.badges]
          .sort((a, b) => Number(b.earnedOn !== null) - Number(a.earnedOn !== null))
          .slice(0, HOME_BADGES)
          .map(badge => (
            <li key={badge.id} class={badge.earnedOn === null ? 'badge' : 'badge got'}>
              <span>
                <b>{t.badges[badge.id]}</b>
                <i>{badge.earnedOn === null ? t.glory.progress(badge.have, badge.need) : t.glory.earned(dayOf(badge.earnedOn))}</i>
              </span>
            </li>
          ))}
      </ul>
    )}
  </section>
)

const LiveLines = ({ live, note, onSwitch }: { live: LiveFacts | null; note: string | null; onSwitch: () => void }) => (
  <>
    {live?.drift.map(line => (
      <p key={line} class="live-line">
        ! {line}
      </p>
    ))}
    {live?.mismatch != null && (
      <p class="live-line">
        {live.mismatch.uncommitted === null ? t.live.mismatch(live.mismatch.on, live.mismatch.branch) : t.live.mismatchHeld(live.mismatch.on, live.mismatch.branch)}
        {live.mismatch.uncommitted === null && (
          <button type="button" class="chip-btn" onClick={onSwitch}>
            {t.live.switch}
          </button>
        )}
      </p>
    )}
    {note !== null && <p class="hint">{note}</p>}
  </>
)

type HomeProps = {
  engine: EngineApi
  view: ReadableView
  game: Load<GameView>
  flow: QuestFlow | undefined
  actions: QuestActions
  edits: QuestEdits
  questNotes: Record<string, string>
  savedQuest: string | null
  // What Home remembers of this realm, and the sagas folded, as on Quests.
  nav: HomeNav | undefined
  folds: readonly string[]
  isSheetOpen: boolean
  letterKeys: boolean
  onNav: (nav: HomeNav) => void
  onFold: (id: string) => void
  onPet: () => void
  onSheet: (sheet: Sheet) => void
  onSwitch: (branch: string) => Promise<boolean>
}

const FIRST_PAGES: Record<HomeGroup, number> = { active: 1, ready: 1, sealed: 1 }

export const HomePage = ({ engine, view, game, flow, actions, edits, questNotes, savedQuest, nav, folds, isSheetOpen, letterKeys, onNav, onFold, onPet, onSheet, onSwitch }: HomeProps) => {
  const read = useEngineRead(engine, () => engine.readLive(view.key), [view.key, view.active?.id, view.active?.branch])
  const [dismissed, setDismissed] = useState<string | null>(null)
  const live = read.load.status === 'ready' ? read.load.data : null
  const failure = read.note ?? (read.load.status === 'failed' ? read.load.message : null)
  const warning = live?.warning != null && live.warning !== dismissed ? live.warning : null
  const switchBranch = () => {
    if (live?.mismatch?.uncommitted === null) void onSwitch(live.mismatch.branch).then(isDone => isDone && read.refresh())
  }

  // Home keeps its own search, so narrowing it leaves Quests as it was.
  const [board, setBoard] = useState<BoardView>(EMPTY_BOARD)
  const [pages, setPages] = useState(FIRST_PAGES)
  const remembered = nav ?? FIRST_NAV
  const dashboard = useMemo(() => dashboardOf(view, board, folds), [view, board, folds])
  const groups = useMemo(() => groupsOf(dashboard), [dashboard])
  const items = useMemo(() => allItemsOf(groups), [groups])
  const nextUp = useMemo(() => nextUpOf(view), [view])
  const picked = pickedOf(items, remembered.open, nextUp)
  const pickedId = picked?.id ?? null
  const search = board.search.trim()
  const isBusy = flow?.kind === 'working'

  const width = useWindowWidth()
  const isFloating = width < DETAIL_FLOATS_BELOW
  const isPaged = width < DETAIL_IS_PAGE_BELOW
  const [isDetailOpen, setDetailOpen] = useState(false)
  const wasFloating = useRef(isFloating)
  useEffect(() => {
    if (wasFloating.current !== isFloating) setDetailOpen(false)
    wasFloating.current = isFloating
  }, [isFloating])
  const showDetail = !isFloating || isDetailOpen

  const list = useRef<HTMLDivElement>(null)
  // The list keeps the picked card in view as the arrows move it.
  useEffect(() => {
    list.current?.querySelector('.hcard.on')?.scrollIntoView?.({ block: 'nearest' })
  }, [pickedId])

  const pick = (id: string) => onNav({ ...remembered, open: id })
  const pickAndOpen = (id: string) => {
    pick(id)
    setDetailOpen(true)
  }
  // A quest started from Home is picked, so its details follow it into hand.
  const homeActions: QuestActions = {
    ...actions,
    onStart: (quest, platform) => {
      pick(quest.id)
      actions.onStart(quest, platform)
    },
  }
  const toggle = (group: HomeGroup) => onNav({ ...remembered, folded: toggleGroup(remembered.folded, group) })
  const more = (group: HomeGroup) => setPages({ ...pages, [group]: pages[group] + 1 })

  const searchBox = useRef<HTMLInputElement>(null)
  useWindowKeys(event => {
    if (event.key === 'f' && event.metaKey) {
      event.preventDefault()
      searchBox.current?.focus()
    }
  })

  useQuestKeys(!isSheetOpen, letterKeys, key => {
    if (key.kind === 'cancel' && isFloating && isDetailOpen) {
      setDetailOpen(false)

      return true
    }
    // The keys for the quest in hand act on the one picked, else the first.
    const inHand = picked?.kind === 'active' ? picked.quest : view.active
    if (runFlowKey(key, inHand === null ? view : { ...view, active: inHand }, flow, actions)) return true
    if (key.kind === 'up' || key.kind === 'down') {
      const next = stepItem(visibleItemsOf(groups, remembered.folded, pages, pickedId), pickedId, key.kind === 'up' ? -1 : 1)
      if (next !== null) pick(next.id)
    } else if (key.kind === 'detail' && picked !== null) setDetailOpen(true)
    else if (key.kind === 'start') {
      const quest = picked?.kind === 'row' && canStartRow(picked.row) ? picked.row.quest : nextUp
      if (quest === null) return false
      if (!isBusy) homeActions.onStart(quest)
    } else if (key.kind === 'seal') {
      if (picked?.kind === 'row' && picked.row.quest.sealedBecause === null) onSheet({ kind: 'seal', quest: picked.row.quest })
      else if (inHand !== null) actions.onSealActive(inHand)
      else return false
    } else if (key.kind === 'switch') switchBranch()
    else if (key.kind === 'dismiss' && warning !== null) setDismissed(warning)
    else return false

    return true
  })

  const isOn = (id: string) => id === pickedId
  const isEmpty = view.ready.length === 0 && view.sealed.length === 0
  const isNothing = dashboard.isNarrowed && items.length === 0
  const shown = (group: HomeGroup) => shownOf(groups[group], pages[group], pickedId)
  const hidden = (group: HomeGroup) => groups[group].length - shown(group).length
  const rowCards = (group: 'ready' | 'sealed') => (
    <ul class="hcards">
      {shown(group).map(item =>
        item.kind === 'row' ? <RowHomeCard key={item.id} row={item.row} isBusy={isBusy} isPicked={isOn(item.id)} onPick={pickAndOpen} onStart={quest => homeActions.onStart(quest)} onFold={onFold} /> : null,
      )}
    </ul>
  )

  return (
    <main class={isFloating ? (isPaged ? 'home floating paged' : 'home floating') : 'home'}>
      {!(isPaged && isDetailOpen) && (
        <div class="home-list" ref={list}>
          <Lair game={game} session={view.session.state} onPet={onPet} />
          {warning !== null && (
            <div class="warning-strip panel" role="alert">
              <span class="grow">{warning}</span>
              <button type="button" class="chip-btn" onClick={() => setDismissed(warning)}>
                {t.actions.ok}
              </button>
            </div>
          )}
          {flow === undefined ? (
            <NextUp next={nextUp} hasActive={view.activeQuests.length > 0} hasWaiting={view.ready.length > 0} session={view.session} isBusy={isBusy} actions={homeActions} />
          ) : (
            <FlowCard flow={flow} actions={actions} />
          )}
          <LiveLines live={live} note={failure} onSwitch={switchBranch} />
          <section class="home-quests panel" aria-labelledby="home-list-title">
            <div class="sec-h">
              <h2 id="home-list-title">{t.home.list(view.name)}</h2>
              <span class="sec-sub">{t.home.counts(view.activeQuests.length, view.canStart, view.sealedCount)}</span>
            </div>
            <SearchAndFilters view={board} hasTime={view.budget !== null} searchBox={searchBox} onChange={patch => setBoard({ ...board, ...patch })} onClear={() => setBoard({ ...board, filters: EMPTY_BOARD.filters })} />
            {isNothing && (
              <p class="hint">
                {t.filters.noMatch(search)}{' '}
                {search !== '' && (
                  <button type="button" class="link-btn" onClick={() => setBoard({ ...board, search: '' })}>
                    {t.filters.clearSearch}
                  </button>
                )}
              </p>
            )}
            <HomeGroupView id="hg-active" label={t.home.groups.active} count={groups.active.length} isFolded={remembered.folded.includes('active')} hidden={hidden('active')} onToggle={() => toggle('active')} onMore={() => more('active')}>
              {groups.active.length === 0 ? (
                <p class="hint">{t.home.noneActive}</p>
              ) : (
                <ul class="hcards">
                  {shown('active').map(item =>
                    item.kind === 'active' ? <ActiveHomeCard key={item.id} quest={item.quest} session={item.quest.session ?? view.session} actions={actions} isPicked={isOn(item.id)} onPick={pickAndOpen} /> : null,
                  )}
                </ul>
              )}
            </HomeGroupView>
            <HomeGroupView
              id="hg-ready"
              label={t.home.groups.ready}
              count={groups.ready.length}
              isFolded={remembered.folded.includes('ready')}
              hidden={hidden('ready')}
              onToggle={() => toggle('ready')}
              onMore={() => more('ready')}
              side={<TimeControl budget={view.budget} onStep={actions.onStepBudget} />}
            >
              {isEmpty && <EmptyBoard onNewQuest={() => onSheet({ kind: 'new', parentId: null })} />}
              {!isEmpty && groups.ready.length === 0 && !dashboard.isNarrowed && <p class="hint">{t.empty.allSealed}</p>}
              {groups.ready.length > 0 && rowCards('ready')}
            </HomeGroupView>
            <HomeGroupView id="hg-sealed" label={t.home.groups.sealed} count={groups.sealed.length} isFolded={remembered.folded.includes('sealed')} hidden={hidden('sealed')} onToggle={() => toggle('sealed')} onMore={() => more('sealed')}>
              {groups.sealed.length === 0 ? <p class="hint">{t.home.noneSealed}</p> : rowCards('sealed')}
            </HomeGroupView>
          </section>
          <Glory view={view} game={game} />
        </div>
      )}
      {isFloating && isDetailOpen && (
        <button type="button" class={isPaged ? 'link-btn detail-back' : 'icon-btn detail-close'} aria-label={isPaged ? t.home.back : t.narrow.closeDetail} onClick={() => setDetailOpen(false)}>
          {isPaged ? t.home.back : '✕'}
        </button>
      )}
      {showDetail && <HomeDetail engine={engine} view={view} picked={picked} flow={flow} actions={homeActions} edits={edits} questNotes={questNotes} savedQuest={savedQuest} onSheet={onSheet} />}
    </main>
  )
}
