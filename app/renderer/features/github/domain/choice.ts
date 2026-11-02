import type { GithubAccount, GithubView } from '../../../../shared/engine_api'
import type { Load } from '../../workspace/state_management/workspace_store'

// The answer "No GitHub account". Null is no answer yet. A login is never empty.
export const NO_ACCOUNT = ''

const accountsIn = (load: Load<GithubView>): GithubAccount[] => (load.status === 'ready' && load.data.kind === 'ready' ? load.data.accounts : [])

const isKnown = (load: Load<GithubView>, login: string): boolean => accountsIn(load).some(account => account.login === login)

// What's picked: a real answer, or the only account there is. A login gh no
// longer knows isn't an answer, however it was saved.
export const pickedOf = (load: Load<GithubView>, choice: string | null): string | null => {
  if (choice === NO_ACCOUNT || (choice !== null && isKnown(load, choice))) return choice
  const accounts = accountsIn(load)

  return accounts.length === 1 ? accounts[0]!.login : null
}

// Only a question there are answers to holds anything up.
export const needsAnswer = (load: Load<GithubView>, picked: string | null): boolean => picked === null && (load.status === 'loading' || accountsIn(load).length > 0)

export const isGone = (load: Load<GithubView>, connected: string | null): boolean => connected !== null && load.status === 'ready' && load.data.kind === 'ready' && !isKnown(load, connected)

export const hasAccounts = (load: Load<GithubView>): boolean => accountsIn(load).length > 0
