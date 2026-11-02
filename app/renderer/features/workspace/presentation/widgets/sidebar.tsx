import type { ProjectRow, ProjectStatus, SessionState } from '../../../../../shared/engine_api'
import { hrefOf, ROUTES } from '../../../../config/routing/routes'
import type { Route } from '../../../../config/routing/routes'
import { Spinner } from '../../../../core/widgets/states'
import { t } from '../../../../l10n/en'
import type { Load } from '../../state_management/workspace_store'

const statusLine = (status: ProjectStatus): string => {
  if (status.kind === 'judgement') return t.status.judgement
  if (status.kind === 'needsYou') return t.status.needsYou
  if (status.kind === 'working') return t.status.working
  if (status.kind === 'current') return t.status.current(status.title)

  return status.kind === 'nothing' ? t.status.nothing : t.status.waiting(status.count, status.title)
}

const markOf = (session: SessionState): string => {
  if (session === 'none') return 'mark'

  return session === 'working' || session === 'needsYou' ? 'mark working' : 'mark idle'
}

const Row = ({ row, isSelected, isDetected, onPick }: { row: ProjectRow; isSelected: boolean; isDetected: boolean; onPick: (key: string) => void }) => (
  <button type="button" class={isSelected ? 'realm sel' : 'realm'} aria-current={isSelected ? 'true' : undefined} onClick={() => onPick(row.key)}>
    {row.kind === 'unreadable' ? (
      <>
        <span class="realm-l1">
          <span class="mark" aria-hidden="true">
            ⚠
          </span>
          <span class="realm-name">{row.name}</span>
        </span>
        <span class="realm-l2">{t.unreadable.sidebar}</span>
      </>
    ) : (
      <>
        <span class="realm-l1">
          <span class={markOf(row.session)} aria-hidden="true" />
          <span class="realm-name">{row.name}</span>
          {row.waiting > 0 && <span class="count">{row.waiting}</span>}
        </span>
        <span class="realm-l2">
          {isDetected && `${t.status.detected} · `}
          {row.status.kind === 'judgement' || row.status.kind === 'needsYou' ? <b>{statusLine(row.status)}</b> : statusLine(row.status)}
        </span>
      </>
    )}
  </button>
)

const LINKS: readonly { route: Route; label: string }[] = [
  { route: ROUTES.guild, label: t.nav.guild },
  { route: ROUTES.hoard, label: t.nav.hoard },
  { route: ROUTES.settings, label: t.nav.settings },
]

type SidebarProps = { projects: Load<ProjectRow[]>; selected: string | null; detected: string | null; route: Route; onPick: (key: string) => void; onOpenFolder: () => void }

export const Sidebar = ({ projects, selected, detected, route, onPick, onOpenFolder }: SidebarProps) => (
  <nav class="side panel" aria-label={t.nav.realms}>
    <div class="lights" aria-hidden="true" />
    <div class="side-h">
      <span>{t.nav.realms}</span>
      <button type="button" class="icon-btn" aria-label={t.firstRun.openFolder} onClick={onOpenFolder}>
        +
      </button>
    </div>
    {projects.status === 'loading' && (
      <p class="side-note" role="status">
        <Spinner />
        {t.loading.realms}
      </p>
    )}
    {projects.status === 'ready' && projects.data.length === 0 && <p class="side-note">{t.firstRun.noRealms}</p>}
    {projects.status === 'ready' && projects.data.map(row => <Row key={row.key} row={row} isSelected={row.key === selected} isDetected={row.key === detected} onPick={onPick} />)}
    <div class="side-fill" />
    <nav aria-label={t.nav.elsewhere}>
      {LINKS.map(link => (
        <a key={link.route} class={link.route === route ? 'side-link on' : 'side-link'} href={hrefOf(link.route)} aria-current={link.route === route ? 'page' : undefined}>
          {link.label}
        </a>
      ))}
    </nav>
  </nav>
)
