import { chmod, mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

type Account = { login: string; active: boolean }

const statusOf = (accounts: Account[]) => JSON.stringify({ hosts: { 'github.com': accounts.map(account => ({ state: 'success', active: account.active, host: 'github.com', login: account.login, tokenSource: 'keyring', scopes: 'repo', gitProtocol: 'ssh' })) } })

// A stand-in for gh in the throwaway home, found before any real one, so no test
// sees the accounts on this Mac. Signing in prints what the real one prints and
// waits until the test says how it went.
export const plantGh = async (home: string, accounts: Account[] = []) => {
  const bin = join(home, '.local/bin')
  const place = (name: string) => join(home, `gh-${name}`)
  await mkdir(bin, { recursive: true })
  await writeFile(place('status'), statusOf(accounts))
  await writeFile(
    join(bin, 'gh'),
    `#!/bin/sh
echo "$*" >> '${place('calls')}'
case "$2" in
  status) cat '${place('status')}' ;;
  login)
    echo $$ > '${place('pid')}'
    printf '\\n! First copy your one-time code: 100F-29B8\\nOpen this URL to continue in your web browser: https://github.com/login/device\\n' >&2
    while [ ! -f '${place('go')}' ]; do sleep 0.05; done
    rm '${place('go')}'
    ;;
esac
`,
  )
  await chmod(join(bin, 'gh'), 0o755)

  return {
    place,
    // The sign-in succeeds, and gh now knows these accounts.
    finishSignIn: async (next: Account[]) => {
      await writeFile(place('status'), statusOf(next))
      await writeFile(place('go'), '')
    },
  }
}
