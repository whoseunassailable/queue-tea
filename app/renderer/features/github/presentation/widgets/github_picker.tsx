import type { ComponentChildren } from 'preact'

import type { GithubAccount } from '../../../../../shared/engine_api'
import { Group, Pick } from '../../../../core/widgets/field'
import { Spinner } from '../../../../core/widgets/states'
import { t } from '../../../../l10n/en'
import { CopyLine } from '../../../quests/presentation/widgets/copy_line'
import { NO_ACCOUNT } from '../../domain/choice'
import type { Github } from '../state_management/use_github'

const INSTALL = 'brew install gh'
const RADIOS = 'github-account'

export const detailOf = (account: GithubAccount): string | null => {
  if (!account.isWorking) return t.github.lapsed

  return account.isActive ? t.github.active : null
}

// The code to give GitHub, and the wait while you do.
const SignInPanel = ({ github, canCancel }: { github: Github; canCancel: boolean }) => {
  const { signIn } = github
  if (signIn.status === 'starting') {
    return (
      <p class="form-line gh-wait" role="status">
        <Spinner />
        {t.github.starting}
      </p>
    )
  }
  if (signIn.status === 'code') {
    return (
      <div class="gh-code-box">
        <p class="form-line">{t.github.signInAs}</p>
        <code class="gh-code">{signIn.code}</code>
        <button type="button" class="btn primary" onClick={() => github.openGithub(signIn.code)}>
          {t.github.openIt}
        </button>
        {signIn.note !== null && (
          <p class="form-banner" role="alert">
            {signIn.note}
          </p>
        )}
        <p class="form-line gh-wait" role="status">
          <Spinner />
          {t.github.waiting}
        </p>
        {canCancel && (
          <button type="button" class="link-btn" onClick={github.cancel}>
            {t.actions.cancel}
          </button>
        )}
      </div>
    )
  }

  return (
    <>
      {signIn.status === 'failed' && (
        <p class="form-banner" role="alert">
          {signIn.message}
        </p>
      )}
      {signIn.status === 'same' && <p class="form-line">{t.github.sameAccount}</p>}
      <button type="button" class="btn gh-add" onClick={github.add}>
        {t.github.add}
      </button>
    </>
  )
}

// Where gh stands: still being asked, couldn't be asked, or not installed.
// Anything else is a list of accounts, for `children` to show.
export const GithubState = ({ github, onCopy, children }: { github: Github; onCopy: (text: string) => void; children: (accounts: GithubAccount[]) => ComponentChildren }) => {
  const { accounts } = github
  if (accounts.status === 'loading') {
    return (
      <p class="form-line gh-wait" role="status">
        <Spinner />
        {t.loading.github}
      </p>
    )
  }
  if (accounts.status === 'failed') {
    return (
      <div class="form-banner" role="alert">
        <p>{accounts.message}</p>
        <button type="button" class="link-btn" onClick={github.read}>
          {t.failed.tryAgain}
        </button>
      </div>
    )
  }
  if (accounts.data.kind === 'missing') {
    return (
      <div class="gh-missing">
        <p class="form-line">{t.github.missing}</p>
        <CopyLine text={INSTALL} onCopy={onCopy} />
        <button type="button" class="link-btn" onClick={github.read}>
          {t.failed.tryAgain}
        </button>
      </div>
    )
  }

  return <>{children(accounts.data.accounts)}</>
}

type PickerProps = { github: Github; picked: string | null; error: string | undefined; onPick: (login: string) => void; onCopy: (text: string) => void }

// Pick an account, or none, or add one. The same in every place that asks.
export const GithubPicker = ({ github, picked, error, onPick, onCopy }: PickerProps) => (
  <GithubState github={github} onCopy={onCopy}>
    {accounts => (
      <>
        {accounts.length === 0 ? (
          <p class="form-line">{t.github.noAccounts}</p>
        ) : (
          <Group label={t.github.question} error={error}>
            {accounts.map(account => (
              <Pick key={account.login} name={RADIOS} label={account.login} detail={detailOf(account)} isPicked={picked === account.login} onPick={() => onPick(account.login)} />
            ))}
            <Pick name={RADIOS} label={t.github.none} isPicked={picked === NO_ACCOUNT} onPick={() => onPick(NO_ACCOUNT)} />
          </Group>
        )}
        <SignInPanel github={github} canCancel={false} />
      </>
    )}
  </GithubState>
)

export { SignInPanel }
