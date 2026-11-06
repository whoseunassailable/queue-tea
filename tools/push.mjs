// Owner-invoked terminal equivalent of the app's Push button. There is no Git
// post-push hook: pre-push cannot know whether publication will succeed.
import { execFileSync, spawnSync } from 'node:child_process'
import { queuePublished } from '../app/tools/update_runner.mjs'

try {
  const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim()
  let integration = 'main'
  try { integration = git('config', '--get', 'queue-tea.integrationBranch') || 'main' } catch (err) { if (err.status !== 1) throw err }
  const [remote = 'origin', branch = integration, ...extra] = process.argv.slice(2)
  if (extra.length || remote.startsWith('-') || branch.startsWith('-')) throw new Error('Use node tools/push.mjs [remote] [branch].')
  git('check-ref-format', `refs/heads/${branch}`)
  const repo = git('rev-parse', '--show-toplevel')
  const commit = git('rev-parse', `refs/heads/${branch}^{commit}`)
  const result = spawnSync('git', ['push', '--porcelain', '--', remote, `${commit}:refs/heads/${branch}`], { stdio: 'inherit' })
  if (result.error) throw result.error
  if (result.status !== 0) process.exitCode = result.status || 1
  else {
    try { await queuePublished({ repo, remote, branch, commit }) }
    catch (err) { process.stderr.write(`Push succeeded; the app update could not start: ${err.stack || err}\n`) }
  }
} catch (err) { process.stderr.write(`${err.stack || err}\n`); process.exitCode = 1 }
