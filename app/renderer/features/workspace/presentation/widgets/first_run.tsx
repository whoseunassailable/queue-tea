import { useRef, useState } from 'preact/hooks'

import cup from '../../../../../../.claude-plugin/icon.png'
import type { EngineApi, FolderPick } from '../../../../../shared/engine_api'
import { Dialog } from '../../../../core/widgets/dialog'
import { t } from '../../../../l10n/en'
import { needsAnswer, NO_ACCOUNT, pickedOf } from '../../../github/domain/choice'
import { useGithub } from '../../../github/presentation/state_management/use_github'
import { GithubPicker } from '../../../github/presentation/widgets/github_picker'
import { CopyLine } from '../../../quests/presentation/widgets/copy_line'
import type { RealmFlows } from '../../state_management/realm_flows'

const COMMAND = 'queue-tea open'

export const FirstRun = ({ onOpenFolder, onCopy }: { onOpenFolder: () => void; onCopy: (text: string) => void }) => (
  <main class="first-run">
    <div class="first-run-box panel panel-pad">
      <img src={cup} alt="" width={120} height={120} />
      <h1>{t.firstRun.title}</h1>
      <p>{t.firstRun.line}</p>
      <button type="button" class="btn primary" onClick={onOpenFolder}>
        {t.firstRun.open}
      </button>
      <p class="card-note">{t.firstRun.orTerminal}</p>
      <CopyLine text={COMMAND} onCopy={onCopy} />
      <p class="card-note">{t.firstRun.hint}</p>
    </div>
  </main>
)

type AddRealmProps = { engine: EngineApi; pick: FolderPick; isDetected: boolean; flows: RealmFlows; onAccount: (key: string, login: string) => void; onCopy: (text: string) => void; onClose: () => void }

// Nothing is written until this is answered, GitHub included when there are
// accounts to choose from. No accounts, or no gh, doesn't hold anyone up.
export const AddRealmDialog = ({ engine, pick, isDetected, flows, onAccount, onCopy, onClose }: AddRealmProps) => {
  const [choice, setChoice] = useState<string | null>(null)
  const [isTouched, setTouched] = useState(false)
  const [failure, setFailure] = useState<string | null>(null)
  const isSending = useRef(false)
  const github = useGithub(engine, setChoice)
  const picked = pickedOf(github.accounts, choice)

  const submit = async () => {
    setTouched(true)
    if (isSending.current || needsAnswer(github.accounts, picked) || github.isSigningIn) return
    isSending.current = true
    setFailure(null)
    const answer = await flows.add(pick.path, isDetected)
    isSending.current = false
    if (!answer.ok) {
      setFailure(answer.message)

      return
    }
    if (picked !== null && picked !== NO_ACCOUNT) onAccount(answer.data, picked)
    onClose()
  }

  return (
    <Dialog title={t.addRealm.notYet(pick.name)} onCancel={onClose} onSubmit={() => void submit()}>
      {failure !== null && (
        <p class="form-banner" role="alert">
          {failure}
        </p>
      )}
      <p class="form-line">{t.addRealm.note}</p>
      {!pick.isRepo && <p class="form-line">{t.addRealm.noRepo}</p>}
      <GithubPicker github={github} picked={picked} error={isTouched && needsAnswer(github.accounts, picked) ? t.github.pickOne : undefined} onPick={setChoice} onCopy={onCopy} />
      <div class="sheet-actions">
        <button type="button" class="btn" onClick={onClose}>
          {t.actions.cancel}
        </button>
        <button type="submit" class="btn primary">
          {t.addRealm.add}
        </button>
      </div>
    </Dialog>
  )
}
