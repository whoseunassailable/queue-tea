import { useEffect, useState } from 'preact/hooks'

import { titlesText } from '../../../../../../hooks/shared/backlog/domain/services/families'
import type { EngineApi, QuestChoice, QuestRow } from '../../../../../shared/engine_api'
import { ask } from '../../../../core/api/engine_client'
import { Dialog } from '../../../../core/widgets/dialog'
import { Group, Tick } from '../../../../core/widgets/field'
import { Failed, Loading } from '../../../../core/widgets/states'
import { t } from '../../../../l10n/en'
import type { Load } from '../../../workspace/state_management/workspace_store'
import { tickPart } from '../../domain/quest_form'
import type { QuestEdits } from '../state_management/quest_edits'

type MoveProps = { engine: EngineApi; realm: string; quest: QuestRow; preset?: { id: string; title: string } | undefined; edits: QuestEdits; onClose: () => void }

// The sagas it is part of start ticked, in their order; 'none' is On its own,
// and nothing ticked is no answer yet. `preset` is what a quest was dragged
// onto, and dragging moves it there alone. It's offered even when the engine
// wouldn't list it: the move is refused with the engine's own sentence.
export const MoveDialog = ({ engine, realm, quest, preset, edits, onClose }: MoveProps) => {
  const current = quest.parents.map(parent => parent.id)
  const [ticked, setTicked] = useState<string[]>(preset === undefined ? current : [preset.id])
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

  const listed: QuestChoice[] = [...quest.parents.map(parent => ({ ...parent, detail: null })), ...(choices.status === 'ready' ? choices.data : [])]
  const data = preset === undefined || listed.some(c => c.id === preset.id) ? listed : [...listed, { id: preset.id, title: preset.title, detail: null }]
  const sagas = ticked.filter(id => id !== 'none')
  const titles = sagas.map(id => data.find(c => c.id === id)?.title ?? id)
  const canGoAlone = quest.parents.length > 0
  const isSame = sagas.length === current.length && sagas.every((id, i) => id === current[i])

  const submit = async () => {
    if (ticked.length === 0) {
      setError(t.form.pickMove)

      return
    }
    if (isSame) {
      onClose()

      return
    }
    const answer = await edits.move(realm, quest, sagas, titles)
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
            {canGoAlone && <Tick label={t.form.alone} isTicked={ticked.includes('none')} onTick={() => setTicked(tickPart(ticked, 'none'))} />}
            {data.map(choice => (
              <Tick key={choice.id} label={choice.title} detail={choice.detail} isTicked={ticked.includes(choice.id)} onTick={() => setTicked(tickPart(ticked, choice.id))} />
            ))}
          </div>
        </Group>
      )}
      {ticked.includes('none') && <p class="form-line">{t.form.aloneLine(quest.title)}</p>}
      {sagas.length > 0 && !isSame && <p class="form-line">{t.form.moveLine(quest.title, titlesText(titles))}</p>}
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
