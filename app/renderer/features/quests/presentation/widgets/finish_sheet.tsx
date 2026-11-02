import { useRef, useState } from 'preact/hooks'

import type { Difficulty } from '../../../../../../types'
import type { ActiveQuest } from '../../../../../shared/engine_api'
import { DEFAULT_LOG_PATH, XP_BY_DIFFICULTY } from '../../../../core/constants/constants'
import { formatMinutes } from '../../../../core/domain/format'
import { Dialog } from '../../../../core/widgets/dialog'
import { Field } from '../../../../core/widgets/field'
import { Spinner } from '../../../../core/widgets/states'
import { t } from '../../../../l10n/en'
import { logPathError } from '../../domain/quest_form'
import type { QuestFlows } from '../state_management/quest_flows'

const DIFFICULTIES: readonly Difficulty[] = ['light', 'medium', 'hard']

type SheetProps = { realm: string; realmPath: string; quest: ActiveQuest; logPath: string | null; flows: QuestFlows; onClose: () => void }

export const FinishSheet = ({ realm, realmPath, quest, logPath, flows, onClose }: SheetProps) => {
  const [actual, setActual] = useState<Difficulty>(quest.difficulty)
  const [path, setPath] = useState(DEFAULT_LOG_PATH)
  const [isTouched, setTouched] = useState(false)
  const [isWorking, setWorking] = useState(false)
  const [failure, setFailure] = useState<string | null>(null)
  // State waits for a render, and ⌘↩ twice can land before one.
  const isSending = useRef(false)
  const needsPath = logPath === null

  const submit = async () => {
    setTouched(true)
    setFailure(null)
    if (isSending.current || (needsPath && logPathError(path, realmPath) !== undefined)) return
    isSending.current = true
    setWorking(true)
    const answer = await flows.finish(realm, quest, actual, needsPath ? path.trim() : null)
    isSending.current = false
    setWorking(false)
    if (answer.ok) onClose()
    else setFailure(answer.message)
  }

  return (
    <Dialog title={t.finish.title(quest.title)} isSheet onCancel={onClose} onSubmit={() => void submit()}>
      {failure !== null && (
        <p class="form-banner" role="alert">
          {failure}
        </p>
      )}
      <p class="form-line">{t.finish.howHard}</p>
      <div class="seg" role="group" aria-label={t.finish.howHard}>
        {DIFFICULTIES.map(difficulty => (
          <button key={difficulty} type="button" class={difficulty === actual ? 'on' : ''} aria-pressed={difficulty === actual} onClick={() => setActual(difficulty)}>
            {t.finish.option(t.difficulty[difficulty], XP_BY_DIFFICULTY[difficulty], difficulty === quest.difficulty)}
          </button>
        ))}
      </div>
      <p class="card-note">{t.finish.meta(formatMinutes(quest.minutes), quest.branch, quest.improvingMessages)}</p>
      {needsPath ? (
        <>
          <p class="form-line">{t.finish.askPath}</p>
          <Field label={t.finish.path} isRequired value={path} error={isTouched ? logPathError(path, realmPath) : undefined} onInput={setPath} onBlur={() => setTouched(true)} onEnter={() => void submit()} />
          <p class="card-note">{t.finish.firstLine}</p>
        </>
      ) : (
        <p class="card-note">{`${t.finish.measured} ${t.finish.row(logPath)}`}</p>
      )}
      <div class="sheet-actions">
        <button type="button" class="btn" onClick={onClose}>
          {t.actions.cancel}
        </button>
        <button type="submit" class="btn go" disabled={isWorking}>
          {isWorking && <Spinner />}
          {isWorking ? t.finish.going : t.finish.go}
        </button>
      </div>
    </Dialog>
  )
}
