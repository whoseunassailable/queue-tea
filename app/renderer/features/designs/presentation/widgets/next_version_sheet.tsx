import { useRef, useState } from 'preact/hooks'

import { PRIORITY_ORDER } from '../../../../../../hooks/shared/records/domain/services/queue_rules'
import type { DesignComment } from '../../../../../shared/designs'
import type { Answer } from '../../../../core/api/engine_client'
import { Dialog } from '../../../../core/widgets/dialog'
import { Field, Group, Pick } from '../../../../core/widgets/field'
import { t } from '../../../../l10n/en'
import { relabel, validateNext } from '../../domain/design_forms'
import type { NextErrors, NextField, NextForm } from '../../domain/design_forms'
import type { Names } from '../../domain/design_forms'

type Props = {
  realm: string
  first: NextForm
  taken: readonly string[]
  comments: readonly DesignComment[]
  names: Names
  uncommitted: number
  // Files the quest, then marks the comments; either can fail on its own.
  onFile: (form: NextForm) => Promise<{ filed: Answer<unknown>; marked: Answer<unknown> | null }>
  onMarkAgain: (form: NextForm) => Promise<Answer<unknown>>
  onDone: (form: NextForm) => void
  onClose: () => void
}

export const NextVersionSheet = ({ realm, first, taken, comments, names, uncommitted, onFile, onMarkAgain, onDone, onClose }: Props) => {
  const [form, setForm] = useState(first)
  const [touched, setTouched] = useState<Partial<Record<NextField, true>>>({})
  const [failure, setFailure] = useState<string | null>(null)
  // Set once the quest is filed, so Try again only marks the comments.
  const [isFiled, setFiled] = useState(false)
  const isSending = useRef(false)
  const errors: NextErrors = validateNext(form, taken)
  const shown: NextErrors = Object.fromEntries(Object.entries(errors).filter(([field]) => touched[field as NextField]))
  const set = (patch: Partial<NextForm>) => setForm(was => ({ ...was, ...patch }))
  const draft = (field: 'title' | 'description' | 'criteria', value: string) => setForm(was => ({ ...was, [field]: value, edited: { ...was.edited, [field]: true } }))

  const submit = async () => {
    setTouched({ label: true, title: true })
    if (Object.keys(errors).length > 0 || isSending.current) return
    isSending.current = true
    if (isFiled) {
      const marked = await onMarkAgain(form)
      isSending.current = false
      if (marked.ok) onDone(form)
      else setFailure(t.designs.filedButNotMarked(marked.message))

      return
    }
    const { filed, marked } = await onFile(form)
    isSending.current = false
    if (!filed.ok) setFailure(filed.message)
    else if (marked !== null && !marked.ok) {
      setFiled(true)
      setFailure(t.designs.filedButNotMarked(marked.message))
    } else onDone(form)
  }

  return (
    <Dialog title={form.from === null ? t.designs.firstSheet : t.designs.nextSheet(form.from.label)} isSheet onCancel={onClose} onSubmit={() => void submit()}>
      <p class="form-line">{form.from === null ? t.designs.firstIntro(realm) : t.designs.nextIntro(realm)}</p>
      {form.from !== null && uncommitted > 0 && (
        <p class="note dz-uncommitted" role="status">
          {t.designs.uncommitted(form.from.label, uncommitted)}
        </p>
      )}
      {failure !== null && (
        <p class="form-banner" role="alert">
          {failure}
        </p>
      )}
      <fieldset class="dz-plain" disabled={isFiled}>
        <Field
          label={t.designs.versionLabel}
          isRequired
          value={form.label}
          error={shown.label}
          onInput={label => setForm(was => relabel(was, label, realm, comments, names))}
          onBlur={() => setTouched(was => ({ ...was, label: true }))}
        />
        <p class="hint">{t.designs.labelHint}</p>
        <Field label={t.designs.questTitle} isRequired value={form.title} error={shown.title} onInput={title => draft('title', title)} onBlur={() => setTouched(was => ({ ...was, title: true }))} />
        <Field label={t.designs.description} isLong value={form.description} onInput={description => draft('description', description)} />
        <Field label={t.designs.criteria} isLong value={form.criteria} onInput={criteria => draft('criteria', criteria)} />
        <p class="hint">{t.designs.criteriaHint}</p>
        <Group label={t.form.priority}>
          <div class="segments">
            {PRIORITY_ORDER.map(priority => (
              <Pick key={priority} name="priority" label={t.priority[priority]} isPicked={form.priority === priority} onPick={() => set({ priority })} />
            ))}
          </div>
        </Group>
      </fieldset>
      <div class="sheet-actions">
        <span class="sub">{t.designs.keys}</span>
        <button type="button" class="btn" onClick={onClose}>
          {t.actions.cancel}
        </button>
        <button type="submit" class="btn primary">
          {isFiled ? t.failed.tryAgain : t.designs.fileQuest}
        </button>
      </div>
    </Dialog>
  )
}
