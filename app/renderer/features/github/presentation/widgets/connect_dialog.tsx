import { useState } from 'preact/hooks'

import type { EngineApi } from '../../../../../shared/engine_api'
import { Dialog } from '../../../../core/widgets/dialog'
import { t } from '../../../../l10n/en'
import { hasAccounts, isGone, needsAnswer, NO_ACCOUNT, pickedOf } from '../../domain/choice'
import { useGithub } from '../state_management/use_github'
import { GithubPicker } from './github_picker'

type ConnectProps = { engine: EngineApi; realm: string; connected: string | null; onSave: (login: string | null) => void; onCopy: (text: string) => void; onClose: () => void }

// Which account a realm belongs to, kept with the app's settings.
export const ConnectDialog = ({ engine, realm, connected, onSave, onCopy, onClose }: ConnectProps) => {
  const [choice, setChoice] = useState(connected)
  const [isTouched, setTouched] = useState(false)
  const github = useGithub(engine, setChoice)
  const picked = pickedOf(github.accounts, choice)

  const submit = () => {
    setTouched(true)
    if (needsAnswer(github.accounts, picked) || github.isSigningIn) return
    if (hasAccounts(github.accounts)) onSave(picked === NO_ACCOUNT ? null : picked)
    onClose()
  }

  return (
    <Dialog title={t.github.title(realm)} onCancel={onClose} onSubmit={submit}>
      <p class="form-line">{t.github.line}</p>
      {connected !== null && isGone(github.accounts, connected) && <p class="form-banner">{t.github.gone(connected)}</p>}
      <GithubPicker github={github} picked={picked} error={isTouched && needsAnswer(github.accounts, picked) ? t.github.pickOne : undefined} onPick={setChoice} onCopy={onCopy} />
      <p class="card-note">{t.github.note}</p>
      <div class="sheet-actions">
        <button type="button" class="btn" onClick={onClose}>
          {t.actions.cancel}
        </button>
        {hasAccounts(github.accounts) && (
          <button type="submit" class="btn primary">
            {t.actions.save}
          </button>
        )}
      </div>
    </Dialog>
  )
}
