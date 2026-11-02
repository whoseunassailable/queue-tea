import { useEffect, useState } from 'preact/hooks'

import type { EngineApi, QuestChoice, QuestRow } from '../../../../../shared/engine_api'
import { ask } from '../../../../core/api/engine_client'
import { Dialog } from '../../../../core/widgets/dialog'
import { Field, Pick } from '../../../../core/widgets/field'
import { Failed, Loading } from '../../../../core/widgets/states'
import { t } from '../../../../l10n/en'
import type { Load } from '../../../workspace/state_management/workspace_store'
import { sealError, sealOf } from '../../domain/quest_form'
import type { SealForm } from '../../domain/quest_form'
import type { QuestEdits } from '../state_management/quest_edits'

export const SealDialog = ({ engine, realm, quest, edits, onClose }: { engine: EngineApi; realm: string; quest: QuestRow; edits: QuestEdits; onClose: () => void }) => {
  const [form, setForm] = useState<SealForm>({ waitFor: null, reason: '' })
  const [filter, setFilter] = useState('')
  const [choices, setChoices] = useState<Load<QuestChoice[]>>({ status: 'loading' })
  const [isTouched, setTouched] = useState(false)
  const [failure, setFailure] = useState<string | null>(null)

  const load = async () => {
    setChoices({ status: 'loading' })
    const answer = await ask(engine, () => engine.readChoices(realm, quest.id))
    setChoices(answer.ok ? { status: 'ready', data: answer.data.waitFor } : { status: 'failed', message: answer.message })
  }
  useEffect(() => {
    void load()
  }, [])

  const submit = async () => {
    setTouched(true)
    setFailure(null)
    if (sealError(form) !== undefined) return
    const answer = await edits.seal(realm, quest, sealOf(form))
    if (answer.ok) onClose()
    else setFailure(answer.message)
  }

  const words = filter.trim().toLowerCase()
  const shown = choices.status === 'ready' ? choices.data.filter(c => c.title.toLowerCase().includes(words)) : []

  return (
    <Dialog title={t.form.sealTitle} isSheet onCancel={onClose} onSubmit={() => void submit()}>
      <p class="form-line">{t.form.sealAsk(quest.title)}</p>
      {failure !== null && (
        <p class="form-banner" role="alert">
          {failure}
        </p>
      )}
      {choices.status === 'loading' && <Loading line={t.form.loading} />}
      {choices.status === 'failed' && <Failed message={choices.message} onRetry={() => void load()} />}
      {choices.status === 'ready' && choices.data.length === 0 && <p class="hint">{t.form.nothingToWaitFor}</p>}
      {choices.status === 'ready' && choices.data.length > 0 && (
        <>
          <Field label={t.form.filter} value={filter} onInput={setFilter} />
          {shown.length === 0 && <p class="hint">{t.form.noFilterMatch}</p>}
          <div class="picks">
            {shown.map(choice => (
              <Pick key={choice.id} name="wait" label={choice.title} isPicked={form.waitFor === choice.id} onPick={() => setForm({ waitFor: choice.id, reason: '' })} />
            ))}
          </div>
        </>
      )}
      <Field label={t.form.reason} value={form.reason} error={isTouched ? sealError(form) : undefined} onInput={reason => setForm({ waitFor: null, reason })} onBlur={() => setTouched(true)} />
      <div class="sheet-actions">
        <button type="button" class="btn" onClick={onClose}>
          {t.actions.cancel}
        </button>
        <button type="submit" class="btn primary">
          {t.actions.sealIt}
        </button>
      </div>
    </Dialog>
  )
}
