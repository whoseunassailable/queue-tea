import { useState } from 'preact/hooks'

import type { QuestRow } from '../../../../../shared/engine_api'
import { Field } from '../../../../core/widgets/field'
import { t } from '../../../../l10n/en'
import { emptyQuestForm, questOf, titleError } from '../../domain/quest_form'
import type { QuestEdits } from '../state_management/quest_edits'

// Files a chapter under its saga, right in the list. It counts as the pick, so
// it never asks what the quest is part of.
export const AddChapter = ({ realm, saga, edits }: { realm: string; saga: QuestRow; edits: QuestEdits }) => {
  const [isOpen, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [error, setError] = useState<string | undefined>(undefined)

  const save = async () => {
    const problem = titleError(title)
    setError(problem)
    if (problem !== undefined) return
    const answer = await edits.file(realm, questOf({ ...emptyQuestForm(saga.id), title }), saga.title)
    if (!answer.ok) {
      setError(answer.message)

      return
    }
    setTitle('')
    setOpen(false)
  }

  if (!isOpen) {
    return (
      <li>
        <button type="button" class="add-row chapter-add" onClick={() => setOpen(true)}>
          {t.actions.addChapter}
        </button>
      </li>
    )
  }

  return (
    <li
      class="chapter-form"
      onKeyDown={event => {
        if (event.key === 'Escape') {
          event.stopPropagation()
          setOpen(false)
        }
      }}
    >
      <Field label={t.form.chapterHint(saga.title)} value={title} error={error} onInput={setTitle} onEnter={() => void save()} />
    </li>
  )
}
