import { useState } from 'preact/hooks'
import type { RefObject } from 'preact'

import type { Difficulty, Priority } from '../../../../../../types'
import { budgetLabel } from '../../../../../../hooks/shared/backlog/domain/services/ranking'
import { t } from '../../../../l10n/en'
import type { BoardSection, BoardView, Filters } from '../../domain/search'

const PRIORITIES: readonly Priority[] = ['urgent', 'high', 'mid', 'okay', 'low']
const DIFFICULTIES: readonly Difficulty[] = ['light', 'medium', 'hard']
const SECTIONS: readonly BoardSection[] = ['ready', 'active', 'judgement', 'sealed', 'victories']

// Time I have steps through its choices, as the terminal's t key does.
export const TimeControl = ({ budget, onStep }: { budget: number | null; onStep: () => void }) => (
  <button type="button" class="chip-btn" aria-label={t.board.timeLabel(budgetLabel(budget))} onClick={onStep}>
    {t.board.time(budgetLabel(budget))}
  </button>
)

const toggled = <T,>(list: readonly T[], item: T): T[] => (list.includes(item) ? list.filter(x => x !== item) : [...list, item])

const Check = ({ label, isOn, onToggle }: { label: string; isOn: boolean; onToggle: () => void }) => (
  <label class="check">
    <input type="checkbox" checked={isOn} onChange={onToggle} />
    <span>{label}</span>
  </label>
)

const FiltersPopover = ({ filters, hasTime, onChange }: { filters: Filters; hasTime: boolean; onChange: (patch: Partial<Filters>) => void }) => (
  <div class="filters panel" role="group" aria-label={t.filters.title}>
    <p class="filters-h">{t.form.priority}</p>
    <div class="filters-row">
      {PRIORITIES.map(priority => (
        <Check key={priority} label={t.priority[priority]} isOn={filters.priorities.includes(priority)} onToggle={() => onChange({ priorities: toggled(filters.priorities, priority) })} />
      ))}
    </div>
    <p class="filters-h">{t.form.difficulty}</p>
    <div class="filters-row">
      {DIFFICULTIES.map(difficulty => (
        <Check key={difficulty} label={t.difficulty[difficulty]} isOn={filters.difficulties.includes(difficulty)} onToggle={() => onChange({ difficulties: toggled(filters.difficulties, difficulty) })} />
      ))}
    </div>
    <p class="filters-h">{t.filters.state}</p>
    <div class="filters-row">
      {SECTIONS.map(section => (
        <Check key={section} label={t.filters.sections[section]} isOn={filters.sections.includes(section)} onToggle={() => onChange({ sections: toggled(filters.sections, section) })} />
      ))}
    </div>
    <div class="filters-row">
      <Check label={t.filters.onlySaga} isOn={filters.onlySaga} onToggle={() => onChange({ onlySaga: !filters.onlySaga })} />
      {hasTime && <Check label={t.filters.fitsTime} isOn={filters.fitsTime} onToggle={() => onChange({ fitsTime: !filters.fitsTime })} />}
    </div>
  </div>
)

type Chip = { key: string; label: string; drop: Partial<Filters> }

// Each filter that's on, with what turning it off leaves.
const chipsOf = (f: Filters): Chip[] => [
  ...f.priorities.map(p => ({ key: `p-${p}`, label: t.priority[p], drop: { priorities: toggled(f.priorities, p) } })),
  ...f.difficulties.map(d => ({ key: `d-${d}`, label: t.difficulty[d], drop: { difficulties: toggled(f.difficulties, d) } })),
  ...f.sections.map(s => ({ key: `s-${s}`, label: t.filters.sections[s], drop: { sections: toggled(f.sections, s) } })),
  ...(f.onlySaga ? [{ key: 'saga', label: t.filters.onlySaga, drop: { onlySaga: false } }] : []),
  ...(f.fitsTime ? [{ key: 'time', label: t.filters.fitsTime, drop: { fitsTime: false } }] : []),
]

const Funnel = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M2 3h12l-4.5 5.5V13l-3 1.5v-6z" />
  </svg>
)

type ToolsProps = { view: BoardView; hasTime: boolean; searchBox: RefObject<HTMLInputElement>; onChange: (patch: Partial<BoardView>) => void; onClear: () => void }

export const SearchAndFilters = ({ view, hasTime, searchBox, onChange, onClear }: ToolsProps) => {
  const [isOpen, setOpen] = useState(false)
  const { filters } = view
  const chips = chipsOf(filters)

  return (
    <div class="board-tools">
      <div class="board-tools-row">
        <input
          ref={searchBox}
          class="input grow"
          type="search"
          aria-label={t.filters.search}
          placeholder={t.filters.search}
          value={view.search}
          onInput={event => onChange({ search: (event.target as HTMLInputElement).value })}
          onKeyDown={event => {
            if (event.key === 'Escape') {
              event.stopPropagation()
              onChange({ search: '' })
            }
          }}
        />
        <button type="button" class={chips.length > 0 ? 'chip-btn on' : 'chip-btn'} aria-expanded={isOpen} aria-label={t.filters.buttonLabel(chips.length)} onClick={() => setOpen(!isOpen)}>
          <Funnel />
          {t.filters.button(chips.length)}
        </button>
      </div>
      {chips.length > 0 && (
        <div class="board-tools-row wrap" role="group" aria-label={t.filters.on}>
          {chips.map(chip => (
            <button key={chip.key} type="button" class="chip-btn" aria-label={t.filters.remove(chip.label)} onClick={() => onChange({ filters: { ...filters, ...chip.drop } })}>
              {chip.label}
              <span aria-hidden="true">✕</span>
            </button>
          ))}
          <button type="button" class="chip-btn" onClick={onClear}>
            {t.filters.clearAll}
          </button>
        </div>
      )}
      {isOpen && <FiltersPopover filters={filters} hasTime={hasTime} onChange={patch => onChange({ filters: { ...filters, ...patch } })} />}
    </div>
  )
}
