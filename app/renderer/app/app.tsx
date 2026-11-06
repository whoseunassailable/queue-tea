import { useEffect, useMemo, useRef, useState } from 'preact/hooks'

import type { EngineApi, FolderPick, MenuItem, Opened, RealmLine, SessionState } from '../../shared/engine_api'
import { hrefOf, ROUTES, useRoute } from '../config/routing/routes'
import type { Route } from '../config/routing/routes'
import { DETAIL_IS_PAGE_BELOW, PET_MS, SKY_CHECK_MS } from '../core/constants/constants'
import { skyOf } from '../core/domain/sky_time'
import { Sky } from '../core/widgets/art'
import { Empty, Failed, Loading } from '../core/widgets/states'
import { Toasts } from '../core/widgets/toasts'
import { useWindowKeys } from '../core/widgets/window_keys'
import { useWindowWidth } from '../core/widgets/window_width'
import { ChroniclePage } from '../features/chronicle/presentation/pages/chronicle_page'
import { DesignsPage } from '../features/designs/presentation/pages/designs_page'
import { ConnectDialog } from '../features/github/presentation/widgets/connect_dialog'
import { GithubChip } from '../features/github/presentation/widgets/github_chip'
import { GuildPage } from '../features/guild/presentation/pages/guild_page'
import { HoardPage } from '../features/hoard/presentation/pages/hoard_page'
import { HomePage } from '../features/home/presentation/pages/home_page'
import { LibraryPage } from '../features/library/presentation/pages/library_page'
import { ManaPage } from '../features/mana/presentation/pages/mana_page'
import { paletteEntries } from '../features/palette/domain/palette'
import { PaletteDialog } from '../features/palette/presentation/widgets/palette_dialog'
import { BranchesPage } from '../features/branches/presentation/pages/branches_page'
import { QuestsPage } from '../features/quests/presentation/pages/quests_page'
import type { Sheet } from '../features/quests/presentation/pages/quests_page'
import type { QuestActions } from '../features/quests/presentation/state_management/flow_keys'
import { questEdits } from '../features/quests/presentation/state_management/quest_edits'
import type { QuestEdits } from '../features/quests/presentation/state_management/quest_edits'
import { questFlows } from '../features/quests/presentation/state_management/quest_flows'
import type { QuestFlows } from '../features/quests/presentation/state_management/quest_flows'
import { isTyping, menuKey } from '../features/quests/presentation/state_management/quest_keys'
import { FinishSheet } from '../features/quests/presentation/widgets/finish_sheet'
import { MoveDialog } from '../features/quests/presentation/widgets/move_dialog'
import { NewQuestSheet } from '../features/quests/presentation/widgets/new_quest_sheet'
import { RemoveDialog } from '../features/quests/presentation/widgets/remove_dialog'
import { SealDialog } from '../features/quests/presentation/widgets/seal_dialog'
import { VictoryPanel } from '../features/quests/presentation/widgets/victory_panel'
import { SettingsPage } from '../features/settings/presentation/pages/settings_page'
import { questAheadOf } from '../features/workspace/domain/momentum'
import { FailedRecord } from '../features/workspace/presentation/widgets/failed_record'
import { AddRealmDialog, FirstRun } from '../features/workspace/presentation/widgets/first_run'
import { Hud } from '../features/workspace/presentation/widgets/hud'
import { Sidebar } from '../features/workspace/presentation/widgets/sidebar'
import { SkyDial } from '../features/workspace/presentation/widgets/sky_dial'
import { realmFlows } from '../features/workspace/state_management/realm_flows'
import type { RealmFlows } from '../features/workspace/state_management/realm_flows'
import { useWorkspace } from '../features/workspace/state_management/workspace_store'
import type { ReadableView, Workspace, WorkspaceState } from '../features/workspace/state_management/workspace_store'
import { t } from '../l10n/en'

const TABS: readonly { route: Route; label: string }[] = [
  { route: ROUTES.home, label: t.nav.home },
  { route: ROUTES.quests, label: t.nav.quests },
  { route: ROUTES.designs, label: t.nav.designs },
  { route: ROUTES.branches, label: t.nav.branches },
  { route: ROUTES.chronicle, label: t.nav.chronicle },
  { route: ROUTES.mana, label: t.nav.mana },
]

const MORE_PAGES: readonly { route: Route; label: string }[] = [
  { route: ROUTES.guild, label: t.nav.guild },
  { route: ROUTES.hoard, label: t.nav.hoard },
  { route: ROUTES.library, label: t.nav.library },
  { route: ROUTES.settings, label: t.nav.settings },
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

type ContentProps = { state: WorkspaceState; workspace: Workspace; engine: EngineApi; route: Route; edits: QuestEdits; flows: QuestFlows; actionsFor: (view: ReadableView) => QuestActions; sheet: Sheet | null; isPaletteOpen: boolean; onSheet: (sheet: Sheet) => void; onCopy: (text: string) => void; onPet: () => void; realms: RealmFlows; onOpenFolder: () => void; onConnect: (realm: Pick<RealmLine, 'key' | 'name'>) => void }

const Content = ({ state, workspace, engine, route, edits, flows, actionsFor, sheet, isPaletteOpen, onSheet, onCopy, onPet, realms, onOpenFolder, onConnect }: ContentProps) => {
  const branchSelection = useRef<string | null>(null)
  useEffect(() => {
    if (route !== ROUTES.branches && route !== ROUTES.quests) branchSelection.current = null
  }, [route])
  const isCovered = sheet !== null || isPaletteOpen
  const { projects, project, game, selected } = state
  // These don't belong to a realm, so they don't wait for one to be picked.
  if (route === ROUTES.guild) {
    const row = projects.status === 'ready' ? projects.data.find(p => p.key === selected) : undefined

    return <GuildPage engine={engine} realm={row?.kind === 'readable' ? { key: row.key, name: row.name } : null} onCopy={onCopy} />
  }
  if (route === ROUTES.hoard) return <HoardPage engine={engine} />
  if (route === ROUTES.library) return <LibraryPage engine={engine} />
  if (route === ROUTES.settings) {
    return <SettingsPage engine={engine} selected={selected} settings={state.settings} onChange={patch => void workspace.changeSettings(patch)} onCopy={onCopy} onShow={key => void realms.show(key)} onInstall={realms.install} onConnect={onConnect} />
  }
  if (projects.status === 'loading') return <Loading line={t.loading.realms} />
  if (projects.status === 'failed') return <Failed message={projects.message} onRetry={() => void workspace.refresh()} />
  if (projects.data.length === 0) return <FirstRun onOpenFolder={onOpenFolder} onCopy={onCopy} />
  if (selected === null || project.status === 'none') return <Empty title={t.empty.pickTitle} line={t.empty.pickLine} />
  if (project.status === 'loading') return <Loading line={t.loading.quests} />
  if (project.status === 'failed') return <Failed message={project.message} onRetry={() => void workspace.refresh()} />
  const view = project.data
  if (view.kind === 'unreadable') {
    return (
      <FailedRecord
        view={view}
        letterKeys={state.settings.letterKeys}
        isSheetOpen={isCovered}
        onRestore={() => void realms.restore(view.key)}
        onRetry={() => void workspace.refresh()}
        onShow={() => void realms.show(view.key)}
        onCopy={onCopy}
      />
    )
  }
  if (route === ROUTES.mana) return <ManaPage engine={engine} realm={view.key} />
  if (route === ROUTES.designs) return <DesignsPage engine={engine} realm={view.key} name={view.name} onQuests={() => (window.location.hash = hrefOf(ROUTES.quests))} />
  if (route === ROUTES.chronicle) {
    return (
      <ChroniclePage
        engine={engine}
        realm={view.key}
        path={view.path}
        scope={state.settings.chronicleScope}
        onScope={chronicleScope => void workspace.changeSettings({ chronicleScope })}
        onFollowUp={title => onSheet({ kind: 'new', parentId: null, title })}
      />
    )
  }
  const flow = state.flows[view.key]
  const actions = actionsFor(view)
  if (route === ROUTES.branches) return <BranchesPage view={view} actions={actions} engine={engine} flow={flow} onOpen={id => { branchSelection.current = id; workspace.openQuest(view.key, id); window.location.hash = hrefOf(ROUTES.quests) }} />
  if (route === ROUTES.quests) {
    return (
      <QuestsPage
        engine={engine}
        view={view}
        picked={state.openQuests[view.key]}
        initialDetailOpen={branchSelection.current !== null && branchSelection.current === state.openQuests[view.key]}
        folded={state.settings.folds[view.key] ?? []}
        savedQuest={state.savedQuest}
        isRefreshing={game.status === 'loading'}
        isSheetOpen={isCovered}
        letterKeys={state.settings.letterKeys}
        edits={edits}
        flow={flow}
        actions={actions}
        questNotes={state.questNotes}
        board={state.boards[view.key]}
        onBoard={board => workspace.setBoard(view.key, board)}
        onOpen={id => workspace.openQuest(view.key, id)}
        onFold={id => void workspace.toggleFold(view.key, id)}
        onSheet={onSheet}
      />
    )
  }

  return <HomePage engine={engine} onSwitch={branch => flows.switchBranch(view.key, branch)} view={view} game={game} flow={flow} actions={actions} isSheetOpen={isCovered} letterKeys={state.settings.letterKeys} onPet={onPet} onNewQuest={() => onSheet({ kind: 'new', parentId: null })} />
}

type SheetProps = { sheet: Sheet; view: ReadableView; engine: EngineApi; edits: QuestEdits; flows: QuestFlows; onClose: () => void }

const SheetView = ({ sheet, view, engine, edits, flows, onClose }: SheetProps) => {
  const { key } = view
  if (sheet.kind === 'new') return <NewQuestSheet engine={engine} view={view} edits={edits} parentId={sheet.parentId} title={sheet.title} onClose={onClose} />
  if (sheet.kind === 'move') return <MoveDialog engine={engine} realm={key} quest={sheet.quest} preset={sheet.preset} edits={edits} onClose={onClose} />
  if (sheet.kind === 'seal') return <SealDialog engine={engine} realm={key} quest={sheet.quest} isActive={false} onSeal={seal => edits.seal(key, sheet.quest, seal)} onClose={onClose} />
  if (sheet.kind === 'sealActive') return <SealDialog engine={engine} realm={key} quest={sheet.quest} isActive onSeal={seal => flows.sealActive(key, sheet.quest, seal)} onClose={onClose} />
  if (sheet.kind === 'finish') return <FinishSheet realm={key} realmPath={view.path} quest={sheet.quest} logPath={view.docsLogPath} flows={flows} onClose={onClose} />

  return <RemoveDialog realm={view.key} quest={sheet.quest} chapters={sheet.chapters} edits={edits} onClose={onClose} />
}

export const App = ({ workspace, engine }: { workspace: Workspace; engine: EngineApi }) => {
  const state = useWorkspace(workspace)
  const edits = useMemo(() => questEdits(engine, workspace), [engine, workspace])
  const flows = useMemo(() => questFlows(engine, workspace), [engine, workspace])
  const realms = useMemo(() => realmFlows(engine, workspace), [engine, workspace])
  const [adding, setAdding] = useState<{ pick: FolderPick; isDetected: boolean } | null>(null)
  const [connecting, setConnecting] = useState<Pick<RealmLine, 'key' | 'name'> | null>(null)
  const [isPaletteOpen, setPaletteOpen] = useState(false)
  const [isSideOpen, setSideOpen] = useState(false)
  const [sheet, setSheet] = useState<Sheet | null>(null)
  const route = useRoute()
  const useNarrowTabs = useWindowWidth() < DETAIL_IS_PAGE_BELOW
  const go = (to: Route) => {
    window.location.hash = hrefOf(to)
  }
  const hour = useHour()
  const [isPetted, setPetted] = useState(false)
  useEffect(() => {
    if (!isPetted) return undefined
    const timer = setTimeout(() => setPetted(false), PET_MS)

    return () => clearTimeout(timer)
  }, [isPetted])

  const readable = state.project.status === 'ready' && state.project.data.kind === 'readable' ? state.project.data : null
  const session = readable?.session.state ?? 'none'
  // The tabs of a realm that doesn't read all show the same failure. From the
  // rest of the app they're still the way back to it.
  const isBroken = state.project.status === 'ready' && state.project.data.kind === 'unreadable'
  const isTab = TABS.some(tab => tab.route === route)

  const actionsFor = (view: ReadableView): QuestActions => ({
    onStart: (quest, platform) => void flows.start(view.key, quest, platform),
    onContinueIn: (quest, platform) => void flows.continueIn(view.key, quest, platform),
    onFinish: quest => setSheet({ kind: 'finish', quest }),
    onBack: quest => void flows.back(view.key, quest),
    onBackNow: quest => void flows.backNow(view.key, quest),
    onSealActive: quest => setSheet({ kind: 'sealActive', quest }),
    onNotYet: quest => void flows.notYet(view.key, quest),
    onOpenClaude: (quest = view.active ?? undefined) => {
      if (quest !== undefined) void flows.openClaude(view.key, quest)
    },
    onCheckAgain: () => void flows.checkAgain(view.key),
    onCancel: () => flows.cancel(view.key),
    onCopy: text => void flows.copy(text),
    onStepBudget: () => void flows.stepBudget(view.key, view.budget),
  })

  const openFolder = async () => {
    const pick = await realms.openFolder()
    if (pick !== null) setAdding({ pick, isDetected: false })
  }

  const connect = (key: string, name: string, login: string | null) => {
    void workspace.setRealmAccount(key, login)
    workspace.say({ tone: 'success', text: login === null ? t.github.disconnected(name) : t.github.connectedTo(login, name) })
  }

  const closeWon = () => {
    workspace.showWon(null)
    workspace.dismissBadges()
  }

  // ⌘N and ⌘Z work from every screen. Inside a text field ⌘Z is the field's,
  // and on Designs it's the editor's.
  useWindowKeys(event => {
    if (event.key === 'Escape' && state.won !== null) closeWon()
    if (!event.metaKey || sheet !== null || isPaletteOpen) return
    const tab = TABS[Number(event.key) - 1]
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault()
      setSideOpen(!isSideOpen)
    } else if (tab !== undefined && /^[1-9]$/.test(event.key)) {
      event.preventDefault()
      go(tab.route)
    } else if (event.key === ',') {
      event.preventDefault()
      go(ROUTES.settings)
    } else if (event.key === 'k') {
      event.preventDefault()
      setPaletteOpen(true)
    } else if (event.key === 'o') {
      event.preventDefault()
      void openFolder()
    } else if (event.key === 'n' && readable !== null) {
      event.preventDefault()
      setSheet({ kind: 'new', parentId: null })
    } else if (event.key === 'z' && !event.shiftKey && !isTyping(event.target) && route !== ROUTES.designs) {
      event.preventDefault()
      void workspace.undo()
    }
  })

  const latestMenu = useRef<(item: MenuItem) => void>(() => {})
  latestMenu.current = item => {
    if (item.kind === 'toggleRealms') setSideOpen(!isSideOpen)
    else if (item.kind === 'installCommand') void realms.install()
    else if (item.kind === 'showRecord') {
      if (state.selected !== null) void realms.show(state.selected)
    } else window.dispatchEvent(menuKey(item.key, item.isMeta))
  }
  useEffect(() => engine.onMenu(item => latestMenu.current(item)), [engine])

  // What brought the app forward, whether it's listening yet or not.
  useEffect(() => {
    const arrived = (opened: Opened) => void realms.arrived(opened, pick => setAdding({ pick, isDetected: true }), () => go(ROUTES.home))
    const stop = engine.onOpened(arrived)
    void realms.takeWaiting(arrived)

    return stop
  }, [engine, realms])

  const pickRealm = (key: string) => {
    setSideOpen(false)
    void workspace.pick(key)
  }
  const entries = isPaletteOpen
    ? paletteEntries({
        view: readable,
        realms: state.projects.status === 'ready' ? state.projects.data : [],
        selected: state.selected,
        onStart: quest => readable !== null && void flows.start(readable.key, quest),
        onOpenQuest: id => {
          if (readable === null) return
          workspace.openQuest(readable.key, id)
          go(ROUTES.quests)
        },
        onFinish: () => readable?.active != null && setSheet({ kind: 'finish', quest: readable.active }),
        onBack: () => readable?.active != null && void flows.back(readable.key, readable.active),
        onOpenClaude: () => readable?.active != null && void flows.openClaude(readable.key, readable.active),
        onNewQuest: title => setSheet({ kind: 'new', parentId: null, ...(title === '' ? {} : { title }) }),
        onGo: go,
        onPickRealm: pickRealm,
        onOpenFolder: () => void openFolder(),
      })
    : []

  const classes = ['rm', `t-${skyOf(state.settings.sky, hour)}`, state.won === null ? moodOf(session) : 'm-cheer', isPetted ? 'pet' : '', state.settings.isCalm ? 'calm' : '', isSideOpen ? 'side-open' : ''].filter(c => c !== '')

  return (
    <div class={classes.join(' ')} data-testid="root">
      <Sky />
      <Sidebar engine={engine} projects={state.projects} selected={state.selected} detected={state.detected} route={route} onPick={pickRealm} onOpenFolder={() => void openFolder()} />
      <div class="main">
        <header class="top">
          <button type="button" class="icon-btn big panel side-toggle" aria-label={t.narrow.showRealms} aria-expanded={isSideOpen} onClick={() => setSideOpen(!isSideOpen)}>
            ☰
          </button>
          {useNarrowTabs && (
            <select class="chip-select tab-menu" aria-label={t.narrow.section} value={route} disabled={isBroken && isTab} onChange={event => go((event.target as HTMLSelectElement).value as Route)}>
              {[...TABS, ...MORE_PAGES].map(tab => (
                <option key={tab.route} value={tab.route}>
                  {tab.label}
                </option>
              ))}
            </select>
          )}
          {!useNarrowTabs && <nav class="tabs panel" aria-label={t.nav.sections}>
            {TABS.map(tab =>
              isBroken && isTab ? (
                <span key={tab.route} class="tab" aria-disabled="true">
                  {tab.label}
                </span>
              ) : (
                <a key={tab.route} class={tab.route === route ? 'tab on' : 'tab'} href={hrefOf(tab.route)} aria-current={tab.route === route ? 'page' : undefined}>
                  {tab.label}
                </a>
              ),
            )}
          </nav>}
          <Hud game={state.game} quest={questAheadOf(readable)} onRetry={() => void workspace.refresh()}>
            {readable !== null && <GithubChip login={state.settings.realmAccounts[readable.key] ?? null} onOpen={() => setConnecting(readable)} />}
          </Hud>
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
        <Content state={state} workspace={workspace} engine={engine} route={route} edits={edits} flows={flows} actionsFor={actionsFor} sheet={sheet} isPaletteOpen={isPaletteOpen} onSheet={setSheet} onCopy={text => void flows.copy(text)} onPet={() => setPetted(true)} realms={realms} onOpenFolder={() => void openFolder()} onConnect={setConnecting} />
      </div>
      {sheet !== null && readable !== null && <SheetView sheet={sheet} view={readable} engine={engine} edits={edits} flows={flows} onClose={() => setSheet(null)} />}
      {isPaletteOpen && <PaletteDialog entries={entries} onClose={() => setPaletteOpen(false)} />}
      {adding !== null && <AddRealmDialog engine={engine} pick={adding.pick} isDetected={adding.isDetected} flows={realms} onAccount={(key, login) => void workspace.setRealmAccount(key, login)} onCopy={text => void flows.copy(text)} onClose={() => setAdding(null)} />}
      {connecting !== null && <ConnectDialog engine={engine} realm={connecting.name} connected={state.settings.realmAccounts[connecting.key] ?? null} onSave={login => connect(connecting.key, connecting.name, login)} onCopy={text => void flows.copy(text)} onClose={() => setConnecting(null)} />}
      {state.won !== null && <VictoryPanel won={state.won} isCalm={state.settings.isCalm} onClose={closeWon} />}
      <Toasts toasts={state.toasts} onDismiss={workspace.dismiss} />
    </div>
  )
}
