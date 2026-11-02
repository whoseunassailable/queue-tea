import { useEffect, useMemo, useState } from 'preact/hooks'

import type { EngineApi, ProjectView, SessionState } from '../../shared/engine_api'
import { hrefOf, ROUTES, useRoute } from '../config/routing/routes'
import type { Route } from '../config/routing/routes'
import { PET_MS, SKY_CHECK_MS } from '../core/constants/constants'
import { skyOf } from '../core/domain/sky_time'
import { Sky } from '../core/widgets/art'
import { Empty, Failed, Loading } from '../core/widgets/states'
import { Toasts } from '../core/widgets/toasts'
import { useWindowKeys } from '../core/widgets/window_keys'
import { HomePage } from '../features/home/presentation/pages/home_page'
import { QuestsPage } from '../features/quests/presentation/pages/quests_page'
import type { Sheet } from '../features/quests/presentation/pages/quests_page'
import type { QuestActions } from '../features/quests/presentation/state_management/flow_keys'
import { questEdits } from '../features/quests/presentation/state_management/quest_edits'
import type { QuestEdits } from '../features/quests/presentation/state_management/quest_edits'
import { questFlows } from '../features/quests/presentation/state_management/quest_flows'
import type { QuestFlows } from '../features/quests/presentation/state_management/quest_flows'
import { isTyping } from '../features/quests/presentation/state_management/quest_keys'
import { FinishSheet } from '../features/quests/presentation/widgets/finish_sheet'
import { MoveDialog } from '../features/quests/presentation/widgets/move_dialog'
import { NewQuestSheet } from '../features/quests/presentation/widgets/new_quest_sheet'
import { RemoveDialog } from '../features/quests/presentation/widgets/remove_dialog'
import { SealDialog } from '../features/quests/presentation/widgets/seal_dialog'
import { VictoryPanel } from '../features/quests/presentation/widgets/victory_panel'
import { Hud } from '../features/workspace/presentation/widgets/hud'
import { Sidebar } from '../features/workspace/presentation/widgets/sidebar'
import { SkyDial } from '../features/workspace/presentation/widgets/sky_dial'
import { useWorkspace } from '../features/workspace/state_management/workspace_store'
import type { ReadableView, Workspace, WorkspaceState } from '../features/workspace/state_management/workspace_store'
import { t } from '../l10n/en'

const TABS: readonly { route: Route; label: string }[] = [
  { route: ROUTES.home, label: t.nav.home },
  { route: ROUTES.quests, label: t.nav.quests },
]

const moodOf = (session: SessionState): string => {
  if (session === 'none') return 'm-asleep'
  if (session === 'working') return 'm-working'

  return session === 'needsYou' ? 'm-alert' : 'm-awake'
}

const useHour = (): number => {
  const [hour, setHour] = useState(() => new Date().getHours())
  useEffect(() => {
    const timer = setInterval(() => setHour(new Date().getHours()), SKY_CHECK_MS)

    return () => clearInterval(timer)
  }, [])

  return hour
}

const Unreadable = ({ view }: { view: Extract<ProjectView, { kind: 'unreadable' }> }) => (
  <Empty title={t.unreadable.title} line={view.isNewer ? t.unreadable.newer : view.canRestore ? t.unreadable.restorable : t.unreadable.broken} />
)

type ContentProps = { state: WorkspaceState; workspace: Workspace; route: Route; edits: QuestEdits; actionsFor: (view: ReadableView) => QuestActions; sheet: Sheet | null; onSheet: (sheet: Sheet) => void; onPet: () => void }

const Content = ({ state, workspace, route, edits, actionsFor, sheet, onSheet, onPet }: ContentProps) => {
  const { projects, project, game, selected } = state
  if (projects.status === 'loading') return <Loading line={t.loading.realms} />
  if (projects.status === 'failed') return <Failed message={projects.message} onRetry={() => void workspace.refresh()} />
  if (projects.data.length === 0) return <Empty title={t.empty.realmsTitle} line={t.empty.realmsLine} />
  if (selected === null || project.status === 'none') return <Empty title={t.empty.pickTitle} line={t.empty.pickLine} />
  if (project.status === 'loading') return <Loading line={t.loading.quests} />
  if (project.status === 'failed') return <Failed message={project.message} onRetry={() => void workspace.refresh()} />
  const view = project.data
  if (view.kind === 'unreadable') return <Unreadable view={view} />
  const flow = state.flows[view.key]
  const actions = actionsFor(view)
  if (route === ROUTES.quests) {
    return (
      <QuestsPage
        view={view}
        picked={state.openQuests[view.key]}
        folded={state.settings.folds[view.key] ?? []}
        savedQuest={state.savedQuest}
        isRefreshing={game.status === 'loading'}
        isSheetOpen={sheet !== null}
        edits={edits}
        flow={flow}
        actions={actions}
        questNotes={state.questNotes}
        onOpen={id => workspace.openQuest(view.key, id)}
        onFold={id => void workspace.toggleFold(view.key, id)}
        onSheet={onSheet}
      />
    )
  }

  return <HomePage view={view} game={game} flow={flow} actions={actions} isSheetOpen={sheet !== null} onPet={onPet} />
}

type SheetProps = { sheet: Sheet; view: ReadableView; engine: EngineApi; edits: QuestEdits; flows: QuestFlows; onClose: () => void }

const SheetView = ({ sheet, view, engine, edits, flows, onClose }: SheetProps) => {
  const { key } = view
  if (sheet.kind === 'new') return <NewQuestSheet engine={engine} view={view} edits={edits} parentId={sheet.parentId} onClose={onClose} />
  if (sheet.kind === 'seal') return <SealDialog engine={engine} realm={key} quest={sheet.quest} isActive={false} onSeal={seal => edits.seal(key, sheet.quest, seal)} onClose={onClose} />
  if (sheet.kind === 'sealActive') return <SealDialog engine={engine} realm={key} quest={sheet.quest} isActive onSeal={seal => flows.sealActive(key, sheet.quest, seal)} onClose={onClose} />
  if (sheet.kind === 'finish') return <FinishSheet realm={key} quest={sheet.quest} logPath={view.docsLogPath} flows={flows} onClose={onClose} />
  if (sheet.kind === 'move') return <MoveDialog engine={engine} realm={view.key} quest={sheet.quest} edits={edits} onClose={onClose} />

  return <RemoveDialog realm={view.key} quest={sheet.quest} chapters={sheet.chapters} edits={edits} onClose={onClose} />
}

export const App = ({ workspace, engine }: { workspace: Workspace; engine: EngineApi }) => {
  const state = useWorkspace(workspace)
  const edits = useMemo(() => questEdits(engine, workspace), [engine, workspace])
  const flows = useMemo(() => questFlows(engine, workspace), [engine, workspace])
  const [sheet, setSheet] = useState<Sheet | null>(null)
  const route = useRoute()
  const hour = useHour()
  const [isPetted, setPetted] = useState(false)
  useEffect(() => {
    if (!isPetted) return undefined
    const timer = setTimeout(() => setPetted(false), PET_MS)

    return () => clearTimeout(timer)
  }, [isPetted])

  const readable = state.project.status === 'ready' && state.project.data.kind === 'readable' ? state.project.data : null
  const session = readable?.session.state ?? 'none'

  const actionsFor = (view: ReadableView): QuestActions => ({
    onStart: quest => void flows.start(view.key, quest),
    onFinish: quest => setSheet({ kind: 'finish', quest }),
    onBack: quest => void flows.back(view.key, quest),
    onBackNow: quest => void flows.backNow(view.key, quest),
    onSealActive: quest => setSheet({ kind: 'sealActive', quest }),
    onNotYet: quest => void flows.notYet(view.key, quest),
    onOpenClaude: () => {
      if (view.active !== null) void flows.openClaude(view.key, view.active)
    },
    onCheckAgain: () => void flows.checkAgain(view.key),
    onCancel: () => flows.cancel(view.key),
    onCopy: text => void flows.copy(text),
  })

  const closeWon = () => {
    workspace.showWon(null)
    workspace.dismissBadges()
  }

  // ⌘N and ⌘Z work from every screen. Inside a text field ⌘Z is the field's.
  useWindowKeys(event => {
    if (event.key === 'Escape' && state.won !== null) closeWon()
    if (!event.metaKey || sheet !== null) return
    if (event.key === 'n' && readable !== null) {
      event.preventDefault()
      setSheet({ kind: 'new', parentId: null })
    } else if (event.key === 'z' && !event.shiftKey && !isTyping(event.target)) {
      event.preventDefault()
      void workspace.undo()
    }
  })

  const classes = ['rm', `t-${skyOf(state.settings.sky, hour)}`, state.won === null ? moodOf(session) : 'm-cheer', isPetted ? 'pet' : '', state.settings.isCalm ? 'calm' : ''].filter(c => c !== '')

  return (
    <div class={classes.join(' ')} data-testid="root">
      <Sky />
      <Sidebar projects={state.projects} selected={state.selected} onPick={key => void workspace.pick(key)} />
      <div class="main">
        <header class="top">
          <nav class="tabs panel" aria-label={t.nav.sections}>
            {TABS.map(tab => (
              <a key={tab.route} class={tab.route === route ? 'tab on' : 'tab'} href={hrefOf(tab.route)} aria-current={tab.route === route ? 'page' : undefined}>
                {tab.label}
              </a>
            ))}
          </nav>
          <Hud game={state.game} onRetry={() => void workspace.refresh()} />
          <SkyDial sky={state.settings.sky} onPick={sky => void workspace.setSky(sky)} />
          {readable !== null && (
            <button type="button" class="icon-btn big panel" aria-label={t.actions.newQuest} onClick={() => setSheet({ kind: 'new', parentId: null })}>
              +
            </button>
          )}
        </header>
        {state.note !== null && (
          <p class="note panel" role="status">
            {state.note}
          </p>
        )}
        <Content state={state} workspace={workspace} route={route} edits={edits} actionsFor={actionsFor} sheet={sheet} onSheet={setSheet} onPet={() => setPetted(true)} />
      </div>
      {sheet !== null && readable !== null && <SheetView sheet={sheet} view={readable} engine={engine} edits={edits} flows={flows} onClose={() => setSheet(null)} />}
      {state.won !== null && <VictoryPanel won={state.won} isCalm={state.settings.isCalm} onClose={closeWon} />}
      <Toasts toasts={state.toasts} onDismiss={workspace.dismiss} />
    </div>
  )
}
