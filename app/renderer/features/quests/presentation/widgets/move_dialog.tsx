import { useEffect, useState } from 'preact/hooks'

import type { EngineApi, QuestChoice, QuestRow } from '../../../../../shared/engine_api'
import { ask } from '../../../../core/api/engine_client'
import { Dialog } from '../../../../core/widgets/dialog'
import { Group, Pick } from '../../../../core/widgets/field'
import { Failed, Loading } from '../../../../core/widgets/states'
import { t } from '../../../../l10n/en'
import type { Load } from '../../../workspace/state_management/workspace_store'
import type { QuestEdits } from '../state_management/quest_edits'

// 'alone' is On its own; null is nothing picked yet.
type Picked = string | null

type MoveProps = { engine: EngineApi; realm: string; quest: QuestRow; preset?: { id: string; title: string } | undefined; edits: QuestEdits; onClose: () => void }

// `preset` is what a quest was dragged onto. It's offered even when the engine
// wouldn't list it: the move is refused with the engine's own sentence.
export const MoveDialog = ({ engine, realm, quest, preset, edits, onClose }: MoveProps) => {
  const [picked, setPicked] = useState<Picked>(preset?.id ?? null)
  const [choices, setChoices] = useState<Load<QuestChoice[]>>({ status: 'loading' })
  const [error, setError] = useState<string | undefined>(undefined)

  const load = async () => {
    setChoices({ status: 'loading' })
    const answer = await ask(engine, () => engine.readChoices(realm, quest.id))
    setChoices(answer.ok ? { status: 'ready', data: answer.data.parents } : { status: 'failed', message: answer.message })
  }
  useEffect(() => {
    void load()
  }, [])

  const listed = choices.status === 'ready' ? choices.data : []
  const data = preset === undefined || listed.some(c => c.id === preset.id) ? listed : [...listed, { id: preset.id, title: preset.title, detail: null }]
  const pickedTitle = picked === 'alone' ? t.form.alone : (data.find(c => c.id === picked)?.title ?? null)
  const canGoAlone = quest.parentId !== null

  const submit = async () => {
    if (picked === null) {
      setError(t.form.pickMove)

      return
    }
    const isAlone = picked === 'alone'
    const answer = await edits.move(realm, quest, isAlone ? null : picked, isAlone ? null : pickedTitle)
    if (answer.ok) onClose()
    else setError(answer.message)
  }

  return (
    <Dialog title={t.form.moveTitle} isSheet onCancel={onClose} onSubmit={() => void submit()}>
      {choices.status === 'loading' && <Loading line={t.form.loading} />}
      {choices.status === 'failed' && <Failed message={choices.message} onRetry={() => void load()} />}
      {choices.status === 'ready' && (
        <Group label={t.form.moveTo} error={error}>
          {data.length === 0 && !canGoAlone && <p class="hint">{t.form.noMoves}</p>}
          <div class="picks">
            {canGoAlone && <Pick name="move" label={t.form.alone} isPicked={picked === 'alone'} onPick={() => setPicked('alone')} />}
            {data.map(choice => (
              <Pick key={choice.id} name="move" label={choice.title} detail={choice.detail} isPicked={picked === choice.id} onPick={() => setPicked(choice.id)} />
            ))}
          </div>
        </Group>
      )}
      {pickedTitle !== null && <p class="form-line">{t.form.moveLine(quest.title, pickedTitle)}</p>}
      <div class="sheet-actions">
        <button type="button" class="btn" onClick={onClose}>
          {t.actions.cancel}
        </button>
        <button type="submit" class="btn primary">
          {t.actions.move}
        </button>
      </div>
    </Dialog>
  )
}
