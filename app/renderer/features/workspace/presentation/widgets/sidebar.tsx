import type { ProjectRow, ProjectStatus, SessionState } from '../../../../../shared/engine_api'
import { Spinner } from '../../../../core/widgets/states'
import { t } from '../../../../l10n/en'
import type { Load } from '../../state_management/workspace_store'

const statusLine = (status: ProjectStatus): string => {
  if (status.kind === 'needsYou') return t.status.needsYou
  if (status.kind === 'working') return t.status.working
  if (status.kind === 'current') return t.status.current(status.title)

  return status.kind === 'nothing' ? t.status.nothing : t.status.waiting(status.count, status.title)
}

const markOf = (session: SessionState): string => {
  if (session === 'none') return 'mark'

  return session === 'working' || session === 'needsYou' ? 'mark working' : 'mark idle'
}

const Row = ({ row, isSelected, onPick }: { row: ProjectRow; isSelected: boolean; onPick: (key: string) => void }) => (
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
        <span class="realm-l2">{statusLine(row.status)}</span>
      </>
    )}
  </button>
)

export const Sidebar = ({ projects, selected, onPick }: { projects: Load<ProjectRow[]>; selected: string | null; onPick: (key: string) => void }) => (
  <nav class="side panel" aria-label={t.nav.realms}>
    <div class="lights" aria-hidden="true" />
    <div class="side-h">
      <span>{t.nav.realms}</span>
    </div>
    {projects.status === 'loading' && (
      <p class="side-note" role="status">
        <Spinner />
        {t.loading.realms}
      </p>
    )}
    {projects.status === 'ready' && projects.data.map(row => <Row key={row.key} row={row} isSelected={row.key === selected} onPick={onPick} />)}
    <div class="side-fill" />
  </nav>
)
