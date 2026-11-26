import { useId, useState } from 'preact/hooks'

import { EFFORT_POINTS, PLAN_DIFFICULTIES, PLAN_PRIORITIES, tagOf } from '../../../../../shared/plan'
import type { BulkOp, PlanQuest, PlanRealm, PlanTarget } from '../../../../../shared/plan'
import { Dialog } from '../../../../core/widgets/dialog'
import { t } from '../../../../l10n/en'

type Props = {
  realm: PlanRealm
  picked: readonly string[]
  isBusy: boolean
  onBulk: (op: BulkOp, said: string) => void
  onClear: () => void
}

const NONE = '-'

// A select that acts once on a choice and goes back to its prompt, so the
// same choice can be made again.
const ActSelect = ({ label, options, onPick, disabled }: { label: string; options: readonly { value: string; label: string }[]; onPick: (value: string) => void; disabled: boolean }) => {
  const id = useId()

  return (
    <span class="pl-bulk-field">
      <label for={id}>{label}</label>
      <select
        id={id}
        class="chip-select"
        value=""
        disabled={disabled}
        onChange={event => {
          const select = event.target as HTMLSelectElement
          const value = select.value
          select.value = ''
          if (value !== '') onPick(value)
        }}
      >
        <option value="">{t.plan.bulk.choose}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </span>
  )
}

// Where the picked quests can be filed: on their own, into a saga, or under a
// quest that is not itself a child, isn't picked and isn't done.
const targetsOf = (realm: PlanRealm, picked: readonly string[]): { value: string; label: string; target: PlanTarget }[] => {
  const isPicked = (id: string) => picked.includes(id)
  const open = (q: PlanQuest) => q.status !== 'done' && !isPicked(q.id)
  const sagas = realm.quests.filter(q => q.isSaga && open(q))
  const parents = realm.quests.filter(q => !q.isSaga && q.parentQuest === null && open(q))

  return [
    { value: NONE, label: t.plan.bulk.moveNone, target: { kind: 'none' } },
    ...sagas.map(q => ({ value: `saga:${q.id}`, label: t.plan.bulk.moveSaga(q.title), target: { kind: 'saga', id: q.id } as const })),
    ...parents.map(q => ({ value: `quest:${q.id}`, label: t.plan.bulk.moveQuest(q.title), target: { kind: 'quest', id: q.id } as const })),
  ]
}

// The bar over the backlog while quests are picked. Every change goes to all
// of them at once, or to none.
export const BulkBar = ({ realm, picked, isBusy, onBulk, onClear }: Props) => {
  const [tag, setTag] = useState('')
  const [tagError, setTagError] = useState<string | null>(null)
  const [isArchiving, setArchiving] = useState(false)
  const tagId = useId()
  const n = picked.length
  const changed = t.plan.bulk.changed(n)
  const targets = targetsOf(realm, picked)
  const pickedTags = [...new Set(realm.quests.filter(q => picked.includes(q.id)).flatMap(q => q.tags))].sort()
  const sendTag = (kind: 'addTag' | 'removeTag') => {
    const clean = tagOf(tag)
    if (clean === null) {
      setTagError(t.plan.pane.tagError)

      return
    }
    setTagError(null)
    setTag('')
    onBulk({ kind, tag: clean }, changed)
  }

  return (
    <section class="pl-bulk panel" aria-label={t.plan.bulk.label}>
      <div class="pl-bulk-head">
        <strong>{t.plan.bulk.picked(n, realm.name)}</strong>
        <button type="button" class="link-btn" onClick={onClear}>
          {t.plan.bulk.clear}
        </button>
      </div>
      <div class="pl-bulk-row">
        <ActSelect label={t.plan.bulk.priority} disabled={isBusy} options={PLAN_PRIORITIES.map(p => ({ value: p, label: t.priority[p] }))} onPick={value => onBulk({ kind: 'priority', priority: value as (typeof PLAN_PRIORITIES)[number] }, changed)} />
        <ActSelect label={t.plan.bulk.difficulty} disabled={isBusy} options={PLAN_DIFFICULTIES.map(d => ({ value: d, label: t.difficulty[d] }))} onPick={value => onBulk({ kind: 'difficulty', difficulty: value as (typeof PLAN_DIFFICULTIES)[number] }, changed)} />
        <ActSelect
          label={t.plan.bulk.points}
          disabled={isBusy}
          options={[...EFFORT_POINTS.map(p => ({ value: String(p), label: t.plan.row.points(p) })), { value: NONE, label: t.plan.bulk.noPoints }]}
          onPick={value => onBulk({ kind: 'points', points: value === NONE ? null : Number(value) }, changed)}
        />
        <ActSelect
          label={t.plan.bulk.move}
          disabled={isBusy}
          options={targets}
          onPick={value => {
            const target = targets.find(o => o.value === value)?.target
            if (target !== undefined) onBulk({ kind: 'move', to: target }, changed)
          }}
        />
      </div>
      <div class="pl-bulk-row">
        <span class="pl-bulk-field pl-bulk-tag">
          <label for={tagId}>{t.plan.bulk.tag}</label>
          <input
            id={tagId}
            class="input"
            list={`${tagId}-known`}
            value={tag}
            aria-invalid={tagError === null ? undefined : 'true'}
            aria-describedby={tagError === null ? undefined : `${tagId}-error`}
            onInput={event => {
              setTag((event.target as HTMLInputElement).value)
              if (tagError !== null) setTagError(null)
            }}
            onBlur={() => setTagError(tag.trim() === '' || tagOf(tag) !== null ? null : t.plan.pane.tagError)}
          />
          <datalist id={`${tagId}-known`}>
            {pickedTags.map(known => (
              <option key={known} value={known} />
            ))}
          </datalist>
          <button type="button" class="btn" disabled={isBusy} onClick={() => sendTag('addTag')}>
            {t.plan.bulk.addTag}
          </button>
          <button type="button" class="btn" disabled={isBusy} onClick={() => sendTag('removeTag')}>
            {t.plan.bulk.removeTag}
          </button>
          {tagError !== null && (
            <span class="field-error" id={`${tagId}-error`}>
              {tagError}
            </span>
          )}
        </span>
        <span class="pl-bulk-actions">
          <button type="button" class="btn" disabled={isBusy} onClick={() => onBulk({ kind: 'rankTo', edge: 'top' }, t.plan.bulk.ranked(n))}>
            {t.plan.bulk.top}
          </button>
          <button type="button" class="btn" disabled={isBusy} onClick={() => onBulk({ kind: 'rankTo', edge: 'bottom' }, t.plan.bulk.ranked(n))}>
            {t.plan.bulk.bottom}
          </button>
          <button type="button" class="btn pl-danger" disabled={isBusy} onClick={() => setArchiving(true)}>
            {t.plan.bulk.archive}
          </button>
        </span>
      </div>
      {isArchiving && (
        <Dialog
          title={t.plan.bulk.archiveTitle(n)}
          onCancel={() => setArchiving(false)}
          onSubmit={() => {
            setArchiving(false)
            onBulk({ kind: 'archive' }, t.plan.bulk.archived(n))
          }}
        >
          <p class="form-line">{t.plan.bulk.archiveLine}</p>
          <div class="sheet-actions">
            <button type="button" class="btn" onClick={() => setArchiving(false)}>
              {t.plan.bulk.cancel}
            </button>
            <button type="submit" class="btn primary">
              {t.plan.bulk.archiveYes}
            </button>
          </div>
        </Dialog>
      )}
    </section>
  )
}
