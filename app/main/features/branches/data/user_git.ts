import { execFile } from 'node:child_process'
import type { RunResult } from '../../../../../hooks/core/host/host'
import type { Logger } from '../../../core/logger'

// Only the branch workflow receives this capability. The agent Host keeps its
// commit/push/merge guard. No renderer-supplied command or cwd crosses IPC.
export type UserGitAction =
  | { kind: 'prepare'; source: string }
  | { kind: 'commit'; message: string }
  | { kind: 'commitFiles'; message: string; files: string[] }
  | { kind: 'apply'; commit: string }
  | { kind: 'abort' }
  | { kind: 'push'; remote: string; head: string; branch: string }
export type UserGit = (cwd: string, action: UserGitAction) => Promise<RunResult>
export const argvOf = (action: UserGitAction): string[] => {
  switch (action.kind) {
    case 'prepare': return ['merge', '--no-ff', '--no-commit', '--', action.source]
    case 'commit': return ['commit', '-m', action.message]
    case 'commitFiles': return ['--literal-pathspecs', 'commit', '--only', '-m', action.message, '--', ...action.files]
    case 'apply': return ['merge', '--ff-only', '--', action.commit]
    case 'abort': return ['merge', '--abort']
    case 'push': return ['push', '--porcelain', '--', action.remote, `${action.head}:refs/heads/${action.branch}`]
  }
}
export const nodeUserGit = (log: Logger): UserGit => (cwd, action) => new Promise(done => {
  const args = argvOf(action)
  log.debug(`user branch action: git ${args.join(' ')}`)
  execFile('git', args, { cwd, maxBuffer: 16 * 1024 * 1024 }, (err, stdout, stderr) => {
    if (err) log.error(`user branch action failed: ${action.kind}`, err)
    done({ exitCode: err === null ? 0 : typeof err.code === 'number' ? err.code : 1, stdout, stderr: err && !stderr ? err.message : stderr })
  })
})
