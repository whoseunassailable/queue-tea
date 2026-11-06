import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(typeof __dirname === 'string' ? __dirname : dirname(fileURLToPath(import.meta.url)), '../..')
const git = (...args) => execFileSync('git', args, { cwd: process.env.QUEUE_TEA_RELEASE_REPOSITORY || root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()
export const currentProvenance = () => {
  if (process.env.QUEUE_TEA_RELEASE_CONTEXT) {
    const context = JSON.parse(readFileSync(process.env.QUEUE_TEA_RELEASE_CONTEXT, 'utf8'))
    if (releaseProblem(context, null, () => true) || context.commit !== process.env.QUEUE_TEA_RELEASE_COMMIT || context.repository !== git('rev-parse', '--path-format=absolute', '--git-common-dir')) throw new Error('The published source context is invalid.')
    // The snapshot was exported from this exact acknowledged object. A newer
    // local commit may exist, but an unpublished/rewritten history cannot pass.
    git('merge-base', '--is-ancestor', context.commit, `refs/heads/${context.integration}`)
    return context
  }
  let integration = 'main'
  try { integration = git('config', '--get', 'queue-tea.integrationBranch') || 'main' } catch { /* An unset integration branch defaults to main. */ }
  return { version: 1, commit: git('rev-parse', 'HEAD'), branch: git('branch', '--show-current'), integration,
    dirty: git('status', '--porcelain', '--untracked-files=normal') !== '', builtAt: new Date().toISOString(), repository: git('rev-parse', '--path-format=absolute', '--git-common-dir') }
}
export const releaseProblem = (candidate, installed, isAncestor) => {
  if (!candidate || candidate.version !== 1 || !/^[a-f0-9]{40,64}$/.test(candidate.commit ?? '')) return 'The build has no valid source provenance. Rebuild from the integration branch.'
  if (!candidate.branch || candidate.branch !== candidate.integration) return 'Feature and detached builds are previews. Merge into the integration branch before updating the installed app.'
  if (candidate.dirty !== false) return 'Commit the integrated changes before building an installed update.'
  if (installed && !isAncestor(installed.commit, candidate.commit)) return 'This build does not include the installed source history. The installed app was kept.'
  return null
}
const run = () => {
  const mode = process.argv[2]
  const current = currentProvenance()
  if (mode !== 'install') throw new Error('Use install.')
  const [built, target] = process.argv.slice(3)
  if (!built || !target) throw new Error('Supply the built and installed app paths.')
  const candidate = JSON.parse(readFileSync(join(built, 'Contents/Resources/provenance.json'), 'utf8'))
  const installedFile = join(target, 'Contents/Resources/provenance.json')
  let installed = existsSync(installedFile) ? JSON.parse(readFileSync(installedFile, 'utf8')) : null
  if (existsSync(target) && !installed) {
    const adopted = process.env.QUEUE_TEA_ADOPT_INSTALLED_COMMIT
    if (!/^[a-f0-9]{40,64}$/.test(adopted ?? '')) throw new Error('The installed app predates source tracking. Identify its source commit and set QUEUE_TEA_ADOPT_INSTALLED_COMMIT for this one upgrade. The installed app was kept.')
    installed = { commit: adopted }
  }
  if (current.commit !== candidate.commit || current.branch !== candidate.integration || current.dirty || (current.published && JSON.stringify(current) !== JSON.stringify(candidate))) throw new Error('The checkout changed after this build. Rebuild from clean integrated source.')
  const problem = releaseProblem(candidate, installed, (old, next) => {
    if (!/^[a-f0-9]{40,64}$/.test(old ?? '')) return false
    try { git('merge-base', '--is-ancestor', old, next); return true } catch { return false }
  })
  if (problem) throw new Error(problem)
  process.stdout.write(`Verified integrated build ${candidate.commit}.\n`)
}
if (typeof __filename !== 'string' && process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    run()
  } catch (err) { process.stderr.write(`Queue-tea update refused: ${err instanceof Error ? err.message : String(err)}\n`); process.exitCode = 1 }
}
