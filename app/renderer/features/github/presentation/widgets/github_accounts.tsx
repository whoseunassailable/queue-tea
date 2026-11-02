import type { EngineApi } from '../../../../../shared/engine_api'
import { t } from '../../../../l10n/en'
import { useGithub } from '../state_management/use_github'
import { detailOf, GithubState, SignInPanel } from './github_picker'

// The accounts on this Mac, for Settings. Which realm uses which is the realm's
// own business, and shows with the realm.
export const GithubAccounts = ({ engine, onCopy }: { engine: EngineApi; onCopy: (text: string) => void }) => {
  const github = useGithub(engine)

  return (
    <section class="panel panel-pad" aria-labelledby="set-github">
      <div class="sec-row">
        <h2 id="set-github">{t.github.accounts}</h2>
        <span class="sec-sub">{t.github.accountsSub}</span>
      </div>
      <GithubState github={github} onCopy={onCopy}>
        {accounts => (
          <>
            {accounts.length === 0 && <p class="form-line">{t.github.noAccountsHere}</p>}
            {accounts.map(account => (
              <div key={account.login} class="set-row">
                <span class="mono">{account.login}</span>
                {detailOf(account) !== null && <span class="val">{detailOf(account)}</span>}
              </div>
            ))}
            <SignInPanel github={github} canCancel />
          </>
        )}
      </GithubState>
    </section>
  )
}
