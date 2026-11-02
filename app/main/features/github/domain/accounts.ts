import type { GithubAccount } from '../../../../shared/engine_api'

const HOST = 'github.com'
const LOGIN = /^[A-Za-z0-9][A-Za-z0-9-]{0,38}$/
const CODE = /one-time code:\s*([A-Z0-9]{4}-[A-Z0-9]{4})/
const ADDRESS = /https:\/\/github\.com\/login\/device/

type GhAccount = { state?: unknown; active?: unknown; login?: unknown; gitProtocol?: unknown }

export const isGithubLogin = (value: unknown): value is string => typeof value === 'string' && LOGIN.test(value)

const rawAccounts = (json: string): GhAccount[] => {
  try {
    const parsed = JSON.parse(json) as { hosts?: Record<string, GhAccount[]> } | null
    const accounts = parsed?.hosts?.[HOST]

    return Array.isArray(accounts) ? accounts : []
  } catch {
    // Anything but gh's JSON means no accounts can be read from it.
    return []
  }
}

// `gh auth status --json hosts`. Tokens never come into it: gh keeps them. A
// timeout means GitHub couldn't be reached, which says nothing about the sign-in.
export const accountsOf = (json: string): GithubAccount[] =>
  rawAccounts(json).flatMap(account => (isGithubLogin(account.login) ? [{ login: account.login, isActive: account.active === true, isWorking: account.state !== 'error' }] : []))

// The protocol gh is set to, so adding an account doesn't change it.
export const gitProtocolOf = (json: string): string => {
  const protocol = rawAccounts(json).find(account => account.gitProtocol !== undefined)?.gitProtocol

  return protocol === 'ssh' ? 'ssh' : 'https'
}

// The one-time code in gh's sign-in output, once it has printed the address too.
// Only GitHub's own address counts, because the app opens it.
export const codeOf = (output: string): { code: string; url: string } | null => {
  const code = output.match(CODE)?.[1]
  const url = output.match(ADDRESS)?.[0]

  return code === undefined || url === undefined ? null : { code, url }
}
