import { useEffect, useState } from 'preact/hooks'

import type { Difficulty, Priority } from '../../../../../../types'
import type { Choices, EngineApi } from '../../../../../shared/engine_api'
import { ask } from '../../../../core/api/engine_client'
import { Dialog } from '../../../../core/widgets/dialog'
import { Field, Group, Pick } from '../../../../core/widgets/field'
import { Failed, Loading } from '../../../../core/widgets/states'
import { t } from '../../../../l10n/en'
import type { Load, ReadableView } from '../../../workspace/state_management/workspace_store'
import { emptyQuestForm, questOf, validateQuest } from '../../domain/quest_form'
import type { QuestErrors, QuestField, QuestForm } from '../../domain/quest_form'
import type { QuestEdits } from '../state_management/quest_edits'

const PRIORITIES: readonly Priority[] = ['urgent', 'high', 'mid', 'okay', 'low']
const DIFFICULTIES: readonly Difficulty[] = ['light', 'medium', 'hard']

const titleOfPart = (choices: Choices, part: string, sagaTitle: string): string | null => {
  if (part === 'new') return sagaTitle.trim()

  return [...choices.features, ...choices.lone].find(c => c.id === part)?.title ?? null
}

export const NewQuestSheet = ({ engine, view, edits, parentId, onClose }: { engine: EngineApi; view: ReadableView; edits: QuestEdits; parentId: string | null; onClose: () => void }) => {
  // With an active saga the answer has to be given; otherwise a quest stands
  // on its own, as it does in the terminal.
  const [form, setForm] = useState<QuestForm>(emptyQuestForm(parentId ?? (view.activeSagaId === null ? 'none' : 'unset')))
  const [touched, setTouched] = useState<readonly QuestField[]>([])
  const [choices, setChoices] = useState<Load<Choices>>({ status: 'loading' })
  const [failure, setFailure] = useState<string | null>(null)
  const [isSaving, setSaving] = useState(false)

  const load = async () => {
    setChoices({ status: 'loading' })
    const answer = await ask(engine, () => engine.readChoices(view.key, null))
    setChoices(answer.ok ? { status: 'ready', data: answer.data } : { status: 'failed', message: answer.message })
  }
  useEffect(() => {
    void load()
  }, [])

  const errors = validateQuest(form)
  const shown: QuestErrors = Object.fromEntries(Object.entries(errors).filter(([field]) => touched.includes(field as QuestField)))
  const set = (patch: Partial<QuestForm>) => setForm({ ...form, ...patch })
  const touch = (field: QuestField) => setTouched(touched.includes(field) ? touched : [...touched, field])

  const submit = async () => {
    setTouched(['title', 'part', 'sagaTitle'])
    setFailure(null)
    if (isSaving || Object.keys(validateQuest(form)).length > 0) return
    setSaving(true)
    const saga = choices.status === 'ready' ? titleOfPart(choices.data, form.part, form.sagaTitle) : null
    const answer = await edits.file(view.key, questOf(form), saga)
    setSaving(false)
    if (answer.ok) onClose()
    else setFailure(answer.message)
  }

  return (
    <Dialog title={t.form.newTitle(view.name)} isSheet onCancel={onClose} onSubmit={() => void submit()}>
      {failure !== null && (
        <p class="form-banner" role="alert">
          {failure}
        </p>
      )}
      <Field label={t.form.title} isRequired value={form.title} error={shown.title} onInput={title => set({ title })} onBlur={() => touch('title')} />
      <Group label={t.form.priority}>
        <div class="segments">
          {PRIORITIES.map(priority => (
            <Pick key={priority} name="priority" label={t.priority[priority]} isPicked={form.priority === priority} onPick={() => set({ priority })} />
          ))}
        </div>
      </Group>
      <Group label={t.form.difficulty}>
        <div class="segments">
          {DIFFICULTIES.map(difficulty => (
            <Pick key={difficulty} name="difficulty" label={t.difficulty[difficulty]} isPicked={form.difficulty === difficulty} onPick={() => set({ difficulty })} />
          ))}
        </div>
      </Group>
      <Group label={`${t.form.partOf}${view.activeSagaId === null ? '' : ' *'}`} error={shown.part}>
        {choices.status === 'loading' && <Loading line={t.form.loading} />}
        {choices.status === 'failed' && <Failed message={choices.message} onRetry={() => void load()} />}
        {choices.status === 'ready' && (
          <div class="picks">
            <Pick name="part" label={t.form.alone} isPicked={form.part === 'none'} onPick={() => set({ part: 'none' })} />
            {[...choices.data.features, ...choices.data.lone].map(choice => (
              <Pick
                key={choice.id}
                name="part"
                label={choice.title}
                detail={choice.id === view.activeSagaId ? t.form.active : choice.detail}
                isPicked={form.part === choice.id}
                onPick={() => set({ part: choice.id })}
              />
            ))}
            <Pick name="part" label={t.form.newSaga} isPicked={form.part === 'new'} onPick={() => set({ part: 'new' })} />
          </div>
        )}
      </Group>
      {form.part === 'new' && (
        <Field label={t.form.sagaTitle} isRequired value={form.sagaTitle} error={shown.sagaTitle} onInput={sagaTitle => set({ sagaTitle })} onBlur={() => touch('sagaTitle')} />
      )}
      <details class="form-more">
        <summary>{t.form.optional}</summary>
        <Field label={t.form.description} isLong value={form.description} onInput={description => set({ description })} />
        <Field label={t.form.criteria} isLong value={form.criteria} onInput={criteria => set({ criteria })} />
      </details>
      <p class="hint">{t.form.waits}</p>
      <div class="sheet-actions">
        <button type="button" class="btn" onClick={onClose}>
          {t.actions.cancel}
        </button>
        <button type="submit" class="btn primary">
          {t.actions.add}
        </button>
      </div>
    </Dialog>
  )
}
