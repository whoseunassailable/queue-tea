import { useState } from 'preact/hooks'

import type { QuestRow } from '../../../../../shared/engine_api'
import { Dialog } from '../../../../core/widgets/dialog'
import { t } from '../../../../l10n/en'
import type { QuestEdits } from '../state_management/quest_edits'

// Removing a saga sets its chapters free, so it asks first.
export const RemoveDialog = ({ realm, quest, chapters, edits, onClose }: { realm: string; quest: QuestRow; chapters: number; edits: QuestEdits; onClose: () => void }) => {
  const [failure, setFailure] = useState<string | null>(null)

  const submit = async () => {
    setFailure(null)
    const answer = await edits.removeSaga(realm, quest)
    if (answer.ok) onClose()
    else setFailure(answer.message)
  }

  return (
    <Dialog title={t.form.removeTitle(quest.title)} onCancel={onClose} onSubmit={() => void submit()}>
      <p class="form-line">{t.form.removeLine(chapters)}</p>
      {quest.branch !== null && <p class="form-line">{t.form.removeBranch(quest.branch)}</p>}
      {failure !== null && (
        <p class="form-banner" role="alert">
          {failure}
        </p>
      )}
      <div class="sheet-actions">
        <button type="button" class="btn" onClick={onClose}>
          {t.actions.cancel}
        </button>
        <button type="submit" class="btn primary">
          {t.actions.removeIt}
        </button>
      </div>
    </Dialog>
  )
}
