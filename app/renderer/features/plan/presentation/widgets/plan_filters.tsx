import { useId, useState } from 'preact/hooks'

import { PLAN_DIFFICULTIES, PLAN_PRIORITIES, PLAN_STATUSES } from '../../../../../shared/plan'
import type { PlanFilters, PlanRealm, SavedPlanView } from '../../../../../shared/plan'
import { Field, Group, Tick } from '../../../../core/widgets/field'
import { t } from '../../../../l10n/en'
import { filterCount, isChanged, saveView } from '../../domain/saved_views'
import type { ViewError, ViewState } from '../../domain/saved_views'

const toggled = <T,>(list: readonly T[], value: T): T[] => (list.includes(value) ? list.filter(v => v !== value) : [...list, value])

type Props = {
  state: ViewState
  realms: readonly PlanRealm[]
  openRealm: string
  tags: readonly string[]
  views: readonly SavedPlanView[]
  viewId: string | null
  onState: (state: ViewState) => void
  onOpenView: (view: SavedPlanView | null) => void
  onViews: (views: SavedPlanView[], said: string, opened: string | null) => void
  newId: () => string
}

// Search, the filters, and the saved views that hold them.
export const PlanFilterBar = ({ state, realms, openRealm, tags, views, viewId, onState, onOpenView, onViews, newId }: Props) => {
  const [isOpen, setOpen] = useState(false)
  const [naming, setNaming] = useState<{ name: string; error: ViewError | null; isTouched: boolean } | null>(null)
  const searchId = useId()
  const panelId = useId()
  const { filters } = state
  const set = (patch: Partial<PlanFilters>) => onState({ ...state, filters: { ...filters, ...patch } })
  const count = filterCount(filters)
  const open = views.find(v => v.id === viewId) ?? null
  const errorText = (error: ViewError | null) => (error === null ? undefined : t.plan.views[error])

  const checkName = (name: string) => {
    const tried = saveView(views, name, state, 'check')

    return 'error' in tried && tried.error !== 'full' ? tried.error : null
  }
  const submitName = () => {
    if (naming === null) return
    const saved = saveView(views, naming.name, state, newId())
    if ('error' in saved) {
      setNaming({ ...naming, error: saved.error, isTouched: true })

      return
    }
    setNaming(null)
    onViews(saved.views, t.plan.views.saved(saved.view.name), saved.view.id)
  }

  return (
    <div class="pl-tools panel">
      <div class="pl-tools-row">
        <label class="sr" for={searchId}>
          {t.plan.search}
        </label>
        <input id={searchId} class="input pl-search" type="search" placeholder={t.plan.searchHint} value={state.search} onInput={e => onState({ ...state, search: (e.target as HTMLInputElement).value })} />
        <button type="button" class={count > 0 ? 'chip-btn on' : 'chip-btn'} aria-expanded={isOpen} aria-controls={panelId} aria-label={t.filters.buttonLabel(count)} onClick={() => setOpen(!isOpen)}>
          {t.filters.button(count)}
        </button>
        {count > 0 || state.search !== '' ? (
          <button type="button" class="link-btn" onClick={() => onState({ ...state, search: '', filters: { ...filters, statuses: [], priorities: [], difficulties: [], tags: [], realms: [] } })}>
            {t.filters.clearAll}
          </button>
        ) : null}
        <span class="pl-tools-gap" />
        <label class="sr" for={`${panelId}-views`}>
          {t.plan.views.open}
        </label>
        <select
          id={`${panelId}-views`}
          class="chip-select"
          value={viewId ?? ''}
          onChange={e => {
            const id = (e.target as HTMLSelectElement).value
            onOpenView(views.find(v => v.id === id) ?? null)
          }}
        >
          <option value="">{views.length === 0 ? t.plan.views.none : t.plan.views.label}</option>
          {views.map(v => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
        {open !== null && isChanged(open, state) && (
          <button type="button" class="chip-btn" title={t.plan.views.changed} onClick={() => onViews(views.map(v => (v.id === open.id ? { ...v, ...state } : v)), t.plan.views.updated(open.name), open.id)}>
            {t.plan.views.update}
          </button>
        )}
        {open !== null && (
          <button type="button" class="link-btn danger" onClick={() => onViews(views.filter(v => v.id !== open.id), t.plan.views.removed(open.name), null)}>
            {t.plan.views.remove}
          </button>
        )}
        <button type="button" class="chip-btn" onClick={() => setNaming({ name: '', error: null, isTouched: false })} disabled={naming !== null}>
          {t.plan.views.save}
        </button>
      </div>
      {naming !== null && (
        <form
          class="pl-name"
          onSubmit={e => {
            e.preventDefault()
            submitName()
          }}
        >
          <Field
            label={t.plan.views.name}
            isRequired
            value={naming.name}
            error={naming.isTouched ? errorText(naming.error) : undefined}
            onInput={name => setNaming({ name, error: checkName(name), isTouched: naming.isTouched })}
            onBlur={() => setNaming({ ...naming, error: checkName(naming.name), isTouched: true })}
            onEnter={submitName}
          />
          <div class="pl-name-actions">
            <button type="submit" class="btn primary">
              {t.plan.views.saveIt}
            </button>
            <button type="button" class="btn" onClick={() => setNaming(null)}>
              {t.plan.views.cancel}
            </button>
          </div>
        </form>
      )}
      {isOpen && (
        <div class="pl-filters" id={panelId}>
          <Group label={t.plan.filter.status}>
            {PLAN_STATUSES.map(status => (
              <Tick key={status} label={t.plan.status[status]} isTicked={filters.statuses.includes(status)} onTick={() => set({ statuses: toggled(filters.statuses, status) })} />
            ))}
            <p class="hint">{t.plan.statusHint}</p>
          </Group>
          <Group label={t.plan.filter.priority}>
            {PLAN_PRIORITIES.map(priority => (
              <Tick key={priority} label={t.priority[priority]} isTicked={filters.priorities.includes(priority)} onTick={() => set({ priorities: toggled(filters.priorities, priority) })} />
            ))}
          </Group>
          <Group label={t.plan.filter.difficulty}>
            {PLAN_DIFFICULTIES.map(difficulty => (
              <Tick key={difficulty} label={t.difficulty[difficulty]} isTicked={filters.difficulties.includes(difficulty)} onTick={() => set({ difficulties: toggled(filters.difficulties, difficulty) })} />
            ))}
          </Group>
          <Group label={t.plan.filter.realm}>
            {realms.map(realm => (
              <Tick key={realm.key} label={realm.key === openRealm ? t.plan.filter.openRealm(realm.name) : realm.name} isTicked={filters.realms.includes(realm.key)} onTick={() => set({ realms: toggled(filters.realms, realm.key) })} />
            ))}
          </Group>
          <Group label={t.plan.filter.tags}>
            {tags.length === 0 ? <p class="hint">{t.plan.filter.noTags}</p> : tags.map(tag => <Tick key={tag} label={tag} isTicked={filters.tags.includes(tag)} onTick={() => set({ tags: toggled(filters.tags, tag) })} />)}
          </Group>
        </div>
      )}
    </div>
  )
}
