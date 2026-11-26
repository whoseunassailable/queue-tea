import { useEffect, useState } from 'preact/hooks'

import type { Difficulty, Priority } from '../../../../../../types'
import type { Choices, EngineApi } from '../../../../../shared/engine_api'
import { ask } from '../../../../core/api/engine_client'
import { AttachmentInput } from '../../../../core/widgets/attachment_input'
import { Dialog } from '../../../../core/widgets/dialog'
import { titlesText } from '../../../../../../hooks/shared/backlog/domain/services/families'
import { Field, Group, Pick, Tick } from '../../../../core/widgets/field'
import { Failed, Loading } from '../../../../core/widgets/states'
import { t } from '../../../../l10n/en'
import type { Load, ReadableView } from '../../../workspace/state_management/workspace_store'
import { asksCriteriaMode, emptyQuestForm, questOf, sagasOf, tickPart, validateQuest, withCriteriaMode } from '../../domain/quest_form'
import type { QuestErrors, QuestField, QuestForm } from '../../domain/quest_form'
import type { QuestEdits } from '../state_management/quest_edits'
import { DescriptionFiles, withFileLink } from './description_files'
import { HelperToggles } from './helper_toggles'

const PRIORITIES: readonly Priority[] = ['urgent', 'high', 'mid', 'okay', 'low']
const DIFFICULTIES: readonly Difficulty[] = ['light', 'medium', 'hard']

const titleOfPart = (choices: Choices['features'], part: string, sagaTitle: string): string => {
  if (part === 'new') return sagaTitle.trim() === '' ? t.form.newSagaName : sagaTitle.trim()

  return choices.find(c => c.id === part)?.title ?? part
}

type SheetProps = { engine: EngineApi; view: ReadableView; edits: QuestEdits; parentId: string | null; title?: string | undefined; onClose: () => void }

export const NewQuestSheet = ({ engine, view, edits, parentId, title, onClose }: SheetProps) => {
  // With an active saga the answer has to be given; otherwise a quest stands
  // on its own, as it does in the terminal.
  const [form, setForm] = useState<QuestForm>({ ...emptyQuestForm(parentId !== null ? [parentId] : view.activeSagaId === null ? ['none'] : []), title: title ?? '' })
  const [touched, setTouched] = useState<readonly QuestField[]>([])
  const [choices, setChoices] = useState<Load<Choices>>({ status: 'loading' })
  const [failure, setFailure] = useState<string | null>(null)
  const [isSaving, setSaving] = useState(false)
  // A quest filed mid-upload would lose the file's link, so filing waits.
  const [isAttaching, setAttaching] = useState(false)
  const [isWaitShown, setWaitShown] = useState(false)

  const load = async () => {
    setChoices({ status: 'loading' })
    const answer = await ask(engine, () => engine.readChoices(view.key, null))
    setChoices(answer.ok ? { status: 'ready', data: answer.data } : { status: 'failed', message: answer.message })
  }
  useEffect(() => {
    void load()
  }, [])

  const errors = validateQuest(form)
  const parent = [...view.ready, ...view.sealed].find(entry => entry.quest.id === parentId)?.quest
  const parentChoices = choices.status === 'ready' ? [...choices.data.features, ...choices.data.lone] : []
  // The board can pick a quest outside the limited list of suggested parents.
  if (parent !== undefined && !parentChoices.some(choice => choice.id === parent.id)) {
    parentChoices.unshift({ id: parent.id, title: parent.title, detail: null })
  }
  const shown: QuestErrors = Object.fromEntries(Object.entries(errors).filter(([field]) => touched.includes(field as QuestField)))
  const set = (patch: Partial<QuestForm>) => setForm({ ...form, ...patch })
  const touch = (field: QuestField) => setTouched(touched.includes(field) ? touched : [...touched, field])

  const submit = async () => {
    setTouched(['title', 'part', 'sagaTitle'])
    setFailure(null)
    setWaitShown(isAttaching)
    if (isSaving || isAttaching || Object.keys(validateQuest(form)).length > 0) return
    setSaving(true)
    const sagas = sagasOf(form)
    const answer = await edits.file(view.key, questOf(form), sagas.length === 0 ? null : titlesText(sagas.map(part => titleOfPart(parentChoices, part, form.sagaTitle))))
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
      <Group label={t.helpers.label}>
        <HelperToggles on={form.helpers} onChange={helpers => set({ helpers })} />
      </Group>
      <Group label={`${t.form.partOf}${view.activeSagaId === null ? '' : ' *'}`} error={shown.part}>
        {choices.status === 'loading' && <Loading line={t.form.loading} />}
        {choices.status === 'failed' && <Failed message={choices.message} onRetry={() => void load()} />}
        {choices.status === 'ready' && (
          <div class="picks">
            <Tick label={t.form.alone} isTicked={form.parts.includes('none')} onTick={() => set({ parts: tickPart(form.parts, 'none') })} />
            {parentChoices.map(choice => (
              <Tick
                key={choice.id}
                label={choice.title}
                detail={choice.id === view.activeSagaId ? t.form.active : choice.detail}
                isTicked={form.parts.includes(choice.id)}
                onTick={() => set({ parts: tickPart(form.parts, choice.id) })}
              />
            ))}
            <Tick label={t.form.newSaga} isTicked={form.parts.includes('new')} onTick={() => set({ parts: tickPart(form.parts, 'new') })} />
          </div>
        )}
      </Group>
      {form.parts.includes('new') && (
        <Field label={t.form.sagaTitle} isRequired value={form.sagaTitle} error={shown.sagaTitle} onInput={sagaTitle => set({ sagaTitle })} onBlur={() => touch('sagaTitle')} />
      )}
      {asksCriteriaMode(form) && (
        <Group label={t.form.criteriaSets}>
          <div class="segments">
            <Pick name="criteria-mode" label={t.form.criteriaOne} isPicked={form.criteriaMode === 'one'} onPick={() => setForm(withCriteriaMode(form, 'one'))} />
            <Pick name="criteria-mode" label={t.form.criteriaEach} isPicked={form.criteriaMode === 'each'} onPick={() => setForm(withCriteriaMode(form, 'each'))} />
          </div>
        </Group>
      )}
      {asksCriteriaMode(form) &&
        form.criteriaMode === 'each' &&
        sagasOf(form).map(part => (
          <Field
            key={part}
            label={t.form.criteriaFor(titleOfPart(parentChoices, part, form.sagaTitle))}
            isLong
            value={form.criteriaFor[part] ?? ''}
            onInput={text => set({ criteriaFor: { ...form.criteriaFor, [part]: text } })}
          />
        ))}
      <details class="form-more">
        <summary>{t.form.optional}</summary>
        <AttachmentInput
          engine={engine}
          realm={view.key}
          id={null}
          onBusy={busy => {
            setAttaching(busy)
            if (!busy) setWaitShown(false)
          }}
          onInsert={async markdown => setForm(now => ({ ...now, description: withFileLink(now.description, markdown) }))}
        >
          <Field label={t.form.description} isLong value={form.description} error={isAttaching && isWaitShown ? t.form.stillAttaching : undefined} onInput={description => set({ description })} />
          <DescriptionFiles engine={engine} realm={view.key} text={form.description} />
        </AttachmentInput>
        {!(asksCriteriaMode(form) && form.criteriaMode === 'each') && <Field label={t.form.criteria} isLong value={form.criteria} onInput={criteria => set({ criteria })} />}
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
