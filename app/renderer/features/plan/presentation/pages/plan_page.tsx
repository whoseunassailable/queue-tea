import { useMemo, useRef, useState } from 'preact/hooks'

import type { EngineApi, QuestRow, Settings } from '../../../../../shared/engine_api'
import { NO_FILTERS, PLAN_LANES, PLAN_STATUSES, questMatches, realmsShown } from '../../../../../shared/plan'
import type { BulkOp, PlanChange, PlanLanes, PlanQuest, PlanRealm, PlanStatus, PlanView, SavedPlanView } from '../../../../../shared/plan'
import { hrefOf, ROUTES } from '../../../../config/routing/routes'
import type { Route } from '../../../../config/routing/routes'
import { useEngineRead } from '../../../../core/api/use_engine_read'
import { ReadView } from '../../../../core/widgets/read_view'
import { Empty } from '../../../../core/widgets/states'
import { t } from '../../../../l10n/en'
import type { Sheet } from '../../../quests/presentation/pages/quests_page'
import type { QuestActions } from '../../../quests/presentation/state_management/flow_keys'
import type { QuestEdits } from '../../../quests/presentation/state_management/quest_edits'
import type { ReadableView, Workspace } from '../../../workspace/state_management/workspace_store'
import { boardOf, transitionOf } from '../../domain/plan_board'
import type { BoardCard, Move, MoveContext } from '../../domain/plan_board'
import { backlogOf, foldKey, isFiltered, pointsOf } from '../../domain/plan_tree'
import type { ViewState } from '../../domain/saved_views'
import { planEdits } from '../state_management/plan_edits'
import { BacklogTree } from '../widgets/backlog_tree'
import { BulkBar } from '../widgets/bulk_bar'
import { PlanFilterBar } from '../widgets/plan_filters'
import { PlanPane } from '../widgets/plan_pane'
import { moveRefusalText, QuestBoard } from '../widgets/quest_board'
import '../plan.css'

type Props = {
  engine: EngineApi
  workspace: Workspace
  view: ReadableView
  route: Route
  settings: Settings
  actions: QuestActions
  edits: QuestEdits
  onSheet: (sheet: Sheet) => void
  onSettings: (patch: Partial<Settings>) => void
  onOpenQuest: (realm: string, id: string) => void
  onOpenRealm: (realm: string) => void
  newId?: () => string
}

const newViewId = () => `v-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

// The Quests page's row for a quest waiting in the open realm, chapters too.
const rowOf = (view: ReadableView, id: string): QuestRow | null => {
  for (const entry of [...view.ready, ...view.sealed]) {
    if (entry.quest.id === id) return entry.quest
    if (entry.kind === 'saga') {
      const chapter = entry.chapters.find(c => c.id === id)
      if (chapter !== undefined) return chapter
    }
  }

  return null
}

const withRealm = (plan: PlanView, realm: PlanRealm): PlanView => ({ ...plan, realms: plan.realms.map(r => (r.key === realm.key ? realm : r)) })

type Opened = { realm: string; id: string }
type Picked = { realm: string; ids: string[] }

const Body = ({ plan, props, onChange, isBusy }: { plan: PlanView; props: Props; onChange: (key: string, change: PlanChange, said: string) => Promise<boolean>; isBusy: boolean }) => {
  const { view, route, settings, workspace } = props
  const isBoard = route === ROUTES.planBoard
  const [state, setState] = useState<ViewState>({ filters: NO_FILTERS, search: '', lanes: 'none' })
  const [viewId, setViewId] = useState<string | null>(null)
  const [folded, setFolded] = useState<ReadonlySet<string>>(new Set())
  const [picked, setPicked] = useState<Picked | null>(null)
  const [opened, setOpened] = useState<Opened | null>(null)
  const views = settings.planViews ?? []
  const known = plan.realms.map(r => r.key)
  const shownKeys = realmsShown(state.filters, view.key, known)
  const shown = plan.realms.filter(r => shownKeys.includes(r.key))
  const tags = [...new Set(shown.flatMap(r => r.quests.flatMap(q => q.tags)))].sort()
  const isEmpty = plan.realms.every(r => r.quests.length === 0)
  const isFilteredNow = isFiltered(state.filters, state.search)
  const realmOf = (key: string) => plan.realms.find(r => r.key === key)
  const say = (text: string, tone: 'warning' | 'success' = 'warning') => workspace.say({ tone, text })

  // Picks stay in one realm, and only quests still there count.
  const pickedRealm = picked === null ? undefined : realmOf(picked.realm)
  const pickedIds = pickedRealm === undefined || picked === null ? [] : picked.ids.filter(id => pickedRealm.quests.some(q => q.id === id))
  const pick = (realm: string, id: string) => {
    if (picked === null || picked.realm !== realm) {
      setPicked({ realm, ids: [id] })

      return
    }
    const ids = pickedIds.includes(id) ? pickedIds.filter(i => i !== id) : [...pickedIds, id]
    setPicked(ids.length === 0 ? null : { realm, ids })
  }
  const bulk = async (op: BulkOp, said: string) => {
    if (pickedRealm === undefined) return
    const isDone = await onChange(pickedRealm.key, { kind: 'bulk', ids: pickedIds, op }, said)
    if (isDone && op.kind === 'archive') setPicked(null)
  }

  const openedRealm = opened === null ? undefined : realmOf(opened.realm)
  const openedQuest: PlanQuest | undefined = opened === null ? undefined : openedRealm?.quests.find(q => q.id === opened.id)

  const filterBar = (
    <PlanFilterBar
      state={state}
      realms={plan.realms}
      openRealm={view.key}
      tags={tags}
      views={views}
      viewId={viewId}
      onState={next => setState(next)}
      onOpenView={(saved: SavedPlanView | null) => {
        setViewId(saved?.id ?? null)
        if (saved !== null) setState({ filters: saved.filters, search: saved.search, lanes: saved.lanes })
      }}
      onViews={(next, said, open) => {
        props.onSettings({ planViews: next })
        setViewId(open)
        say(said, 'success')
      }}
      newId={props.newId ?? newViewId}
    />
  )

  const pane =
    openedRealm !== undefined && openedQuest !== undefined ? (
      <PlanPane
        realm={openedRealm}
        quest={openedQuest}
        isBusy={isBusy}
        onChange={(change, said) => onChange(openedRealm.key, change, said)}
        onInspect={id => setOpened({ realm: openedRealm.key, id })}
        onOpenInQuests={id => props.onOpenQuest(openedRealm.key, id)}
        onClose={() => setOpened(null)}
      />
    ) : null

  const backlog = () => {
    const { groups, matches } = backlogOf(shown, state.filters, state.search, folded)
    const sum = pointsOf(matches)

    return (
      <>
        <p class="pl-summary" role="status">
          {t.plan.summary(sum.quests, sum.points, sum.unestimated)}
        </p>
        {pickedRealm !== undefined && pickedIds.length > 0 && <BulkBar realm={pickedRealm} picked={pickedIds} isBusy={isBusy} onBulk={(op, said) => void bulk(op, said)} onClear={() => setPicked(null)} />}
        {groups.length === 0 ? (
          <NoMatch isFiltered={isFilteredNow} onClear={() => setState({ ...state, filters: NO_FILTERS, search: '' })} />
        ) : (
          <BacklogTree
            groups={groups}
            picked={new Set(pickedIds)}
            opened={opened?.id ?? null}
            isManyRealms={shown.length > 1}
            actions={{
              onOpen: (realm, id) => setOpened({ realm, id }),
              onPick: pick,
              onFold: (realm, id) => {
                const key = foldKey(realm, id)
                const next = new Set(folded)
                if (next.has(key)) next.delete(key)
                else next.add(key)
                setFolded(next)
              },
              onRank: (realm, quest, before) => void onChange(realm.key, { kind: 'rank', id: quest.id, before }, t.plan.ranked(quest.title)),
              onRefused: text => say(text),
              onAddChild: async (realm, parent, title) => {
                const isAdded = await onChange(realm.key, { kind: 'childQuest', parentId: parent.id, title }, t.plan.child.added(title))
                if (isAdded && folded.has(foldKey(realm.key, parent.id))) {
                  const next = new Set(folded)
                  next.delete(foldKey(realm.key, parent.id))
                  setFolded(next)
                }

                return isAdded
              },
            }}
          />
        )}
      </>
    )
  }

  const board = () => {
    // The board shows every status unless some are picked: Done is a column.
    const filters = state.filters.statuses.length === 0 ? { ...state.filters, statuses: [...PLAN_STATUSES] } : state.filters
    const cards: BoardCard[] = shown.flatMap(realm => realm.quests.filter(q => !q.isSaga && questMatches(q, filters, state.search)).map(quest => ({ quest, realm })))
    const lanes = boardOf(cards, state.lanes, t.plan.noSaga, p => t.priority[p])
    const wipLimit = settings.wipLimits?.[view.key] ?? null
    const ctx: MoveContext = { openRealm: view.key, active: view.activeQuests.length, wipLimit }
    const move = (card: BoardCard, to: PlanStatus) => {
      const transition = transitionOf(card, to, ctx)
      if (transition.kind === 'refused') {
        say(moveRefusalText(transition.refusal, card.quest.title))

        return
      }
      if (transition.kind === 'move' && !runMove(transition.move, card.quest.id)) say(t.plan.refuse.notFound)
    }
    const runMove = (kind: Move, id: string): boolean => {
      const { actions } = props
      if (kind === 'start' || kind === 'seal' || kind === 'unseal') {
        const row = rowOf(view, id)
        if (row === null) return false
        if (kind === 'start') actions.onStart(row)
        else if (kind === 'seal') props.onSheet({ kind: 'seal', quest: row })
        else void props.edits.unseal(view.key, row)

        return true
      }
      const active = view.activeQuests.find(q => q.id === id)
      if (active === undefined) return false
      if (kind === 'back') actions.onBack(active)
      else if (kind === 'sealActive') actions.onSealActive(active)
      else if (kind === 'finish') actions.onFinish(active)
      else actions.onNotYet(active)

      return true
    }
    const setWip = (limit: number | null) => {
      const { [view.key]: _gone, ...others } = settings.wipLimits ?? {}
      props.onSettings({ wipLimits: limit === null ? others : { ...others, [view.key]: limit } })
    }

    return (
      <>
        <div class="seg pl-lanes" role="group" aria-label={t.plan.lanes.label}>
          <span class="hint">{t.plan.lanes.label}</span>
          {PLAN_LANES.map((lanes: PlanLanes) => (
            <button key={lanes} type="button" class={state.lanes === lanes ? 'on' : undefined} aria-pressed={state.lanes === lanes} onClick={() => setState({ ...state, lanes })}>
              {t.plan.lanes[lanes]}
            </button>
          ))}
        </div>
        {cards.length === 0 ? (
          <NoMatch isFiltered={isFilteredNow} onClear={() => setState({ ...state, filters: NO_FILTERS, search: '' })} />
        ) : (
          <QuestBoard
            lanes={lanes}
            ctx={ctx}
            worktrees={view.activeQuests.filter(q => q.worktreePath !== null).length}
            isBusy={isBusy}
            onWip={setWip}
            onMove={move}
            onRefused={text => say(text)}
            onInspect={(realm, id) => setOpened({ realm, id })}
            onOpenRealm={props.onOpenRealm}
          />
        )}
      </>
    )
  }

  return (
    <>
      <div class="page-h panel pl-head">
        <h1>{t.plan.title}</h1>
        <div class="seg" role="group" aria-label={t.plan.modes}>
          <button type="button" class={isBoard ? undefined : 'on'} aria-pressed={!isBoard} onClick={() => (window.location.hash = hrefOf(ROUTES.plan))}>
            {t.plan.backlog}
          </button>
          <button type="button" class={isBoard ? 'on' : undefined} aria-pressed={isBoard} onClick={() => (window.location.hash = hrefOf(ROUTES.planBoard))}>
            {t.plan.board}
          </button>
        </div>
      </div>
      {plan.unreadable > 0 && (
        <p class="note panel" role="status">
          {t.plan.unreadable(plan.unreadable)}
        </p>
      )}
      {isEmpty ? (
        <Empty title={t.plan.emptyTitle} line={t.plan.emptyLine} />
      ) : (
        <>
          {filterBar}
          <div class={pane === null ? 'pl-body' : 'pl-body has-pane'}>
            <div class="pl-main">{isBoard ? board() : backlog()}</div>
            {pane}
          </div>
        </>
      )}
    </>
  )
}

const NoMatch = ({ isFiltered: isOn, onClear }: { isFiltered: boolean; onClear: () => void }) => (
  <div class="state panel">
    <p class="state-line">{isOn ? t.plan.noMatch : t.plan.emptyLine}</p>
    {isOn && (
      <button type="button" class="btn" onClick={onClear}>
        {t.plan.clearFilters}
      </button>
    )}
  </div>
)

// The backlog and the quest board, across realms. Planning fields live in each
// realm's own record; moves on the board go through the Quests page's flows.
export const PlanPage = (props: Props) => {
  const { engine, workspace, view } = props
  const read = useEngineRead(engine, () => engine.readPlan(), [view])
  const latest = useRef(read)
  latest.current = read
  const [busy, setBusy] = useState(0)
  const edits = useMemo(
    () =>
      planEdits(engine, workspace, realm => {
        const now = latest.current.load
        if (now.status === 'ready') latest.current.adopt(withRealm(now.data, realm))
      }),
    [engine, workspace],
  )
  const change = async (key: string, plan: PlanChange, said: string): Promise<boolean> => {
    setBusy(n => n + 1)
    const answer = await edits.change(key, plan, said)
    setBusy(n => n - 1)

    return answer.ok
  }

  return (
    <main class="page pl">
      <ReadView read={read} line={t.loading.plan}>
        {plan => <Body plan={plan} props={props} onChange={change} isBusy={busy > 0} />}
      </ReadView>
    </main>
  )
}
