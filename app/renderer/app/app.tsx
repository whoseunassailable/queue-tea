import { useEffect, useState } from 'preact/hooks'

import type { ProjectView, SessionState } from '../../shared/engine_api'
import { hrefOf, ROUTES, useRoute } from '../config/routing/routes'
import type { Route } from '../config/routing/routes'
import { PET_MS, SKY_CHECK_MS } from '../core/constants/constants'
import { skyOf } from '../core/domain/sky_time'
import { Sky } from '../core/widgets/art'
import { Empty, Failed, Loading } from '../core/widgets/states'
import { HomePage } from '../features/home/presentation/pages/home_page'
import { QuestsPage } from '../features/quests/presentation/pages/quests_page'
import { Hud } from '../features/workspace/presentation/widgets/hud'
import { Sidebar } from '../features/workspace/presentation/widgets/sidebar'
import { SkyDial } from '../features/workspace/presentation/widgets/sky_dial'
import { useWorkspace } from '../features/workspace/state_management/workspace_store'
import type { Workspace, WorkspaceState } from '../features/workspace/state_management/workspace_store'
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

const Content = ({ state, workspace, route, onPet }: { state: WorkspaceState; workspace: Workspace; route: Route; onPet: () => void }) => {
  const { projects, project, game, selected } = state
  if (projects.status === 'loading') return <Loading line={t.loading.realms} />
  if (projects.status === 'failed') return <Failed message={projects.message} onRetry={() => void workspace.refresh()} />
  if (projects.data.length === 0) return <Empty title={t.empty.realmsTitle} line={t.empty.realmsLine} />
  if (selected === null || project.status === 'none') return <Empty title={t.empty.pickTitle} line={t.empty.pickLine} />
  if (project.status === 'loading') return <Loading line={t.loading.quests} />
  if (project.status === 'failed') return <Failed message={project.message} onRetry={() => void workspace.refresh()} />
  const view = project.data
  if (view.kind === 'unreadable') return <Unreadable view={view} />
  if (route === ROUTES.quests) {
    return <QuestsPage view={view} picked={state.openQuests[view.key]} isRefreshing={game.status === 'loading'} onOpen={id => workspace.openQuest(view.key, id)} />
  }

  return <HomePage view={view} game={game} onPet={onPet} />
}

export const App = ({ workspace }: { workspace: Workspace }) => {
  const state = useWorkspace(workspace)
  const route = useRoute()
  const hour = useHour()
  const [isPetted, setPetted] = useState(false)
  useEffect(() => {
    if (!isPetted) return undefined
    const timer = setTimeout(() => setPetted(false), PET_MS)

    return () => clearTimeout(timer)
  }, [isPetted])

  const session = state.project.status === 'ready' && state.project.data.kind === 'readable' ? state.project.data.session.state : 'none'
  const classes = ['rm', `t-${skyOf(state.settings.sky, hour)}`, moodOf(session), isPetted ? 'pet' : '', state.settings.isCalm ? 'calm' : ''].filter(c => c !== '')

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
        </header>
        {state.note !== null && (
          <p class="note panel" role="status">
            {state.note}
          </p>
        )}
        <Content state={state} workspace={workspace} route={route} onPet={() => setPetted(true)} />
      </div>
    </div>
  )
}
