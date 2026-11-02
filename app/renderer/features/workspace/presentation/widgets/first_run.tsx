import { useRef, useState } from 'preact/hooks'

import cup from '../../../../../../.claude-plugin/icon.png'
import type { FolderPick } from '../../../../../shared/engine_api'
import { Dialog } from '../../../../core/widgets/dialog'
import { t } from '../../../../l10n/en'
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

// Nothing is written until this is answered.
export const AddRealmDialog = ({ pick, isDetected, flows, onClose }: { pick: FolderPick; isDetected: boolean; flows: RealmFlows; onClose: () => void }) => {
  const [failure, setFailure] = useState<string | null>(null)
  const isSending = useRef(false)

  const submit = async () => {
    if (isSending.current) return
    isSending.current = true
    setFailure(null)
    const answer = await flows.add(pick.path, isDetected)
    isSending.current = false
    if (answer.ok) onClose()
    else setFailure(answer.message)
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
