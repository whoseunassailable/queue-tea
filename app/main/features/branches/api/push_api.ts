import type { PushPreview, MergeWorkspace } from '../../../../shared/branches'
import type { Reply } from '../../../../shared/engine_api'
import { Refusal, reply } from '../../../core/reply'
import { scopeOf } from '../../tasks/api/scope'
import type { TasksDeps } from '../../tasks/api/scope'
import { BRANCH_TEXT } from '../domain/constants'
import { isOid, parseLog } from '../domain/git_rules'
import { ancestor, digest, gitIn, headOf } from '../data/branch_source'
import { loadOperation, saveOperation, withBranchLock } from '../data/operation_store'
import { workspaceOf } from '../data/merge_workspace'
import { runStep } from './branch_api'
import type { BranchDeps } from './branch_api'

// Called only by the user's Check remote action. Opening a branch never
// reaches the network, and preparing/completing a merge stays entirely local.
const preview = async (d: TasksDeps, key: unknown, id: unknown, remote: unknown): Promise<PushPreview> => {
  const scope = await scopeOf(d, key); const git = gitIn(d, scope.ctx.projectPath)
  const op = await loadOperation(d, scope.key, id)
  if (!op.commit || op.stage !== 'merged') throw new Refusal(BRANCH_TEXT.invalid)
  const remotes = (await git(['remote'])).trim().split('\n')
  if (typeof remote !== 'string' || !remotes.includes(remote) || remote.startsWith('-')) throw new Refusal(BRANCH_TEXT.invalid)
  const head = await headOf(d, scope.ctx.projectPath, op.target)
  if (!(await ancestor(d, scope.ctx.projectPath, op.commit, head))) throw new Refusal(BRANCH_TEXT.stale)
  const urls = (await git(['remote', 'get-url', '--push', '--all', remote])).trim().split('\n')
  if (urls.length !== 1 || !urls[0]) throw new Refusal(BRANCH_TEXT.multiplePush)
  const url = urls[0]
  const remoteResult = await git(['ls-remote', '--heads', '--', url, `refs/heads/${op.target}`])
  const remoteHead = remoteResult.trim().split(/\s/)[0] || null
  if (remoteHead && !isOid(remoteHead)) throw new Refusal(BRANCH_TEXT.push)
  const known = remoteHead ? await d.host.run(['git', 'cat-file', '-e', `${remoteHead}^{commit}`], scope.ctx.projectPath) : null
  const range = remoteHead && known?.exitCode === 0 ? `${remoteHead}..${head}` : `${op.targetHead}..${head}`
  return { operationId: op.id, remote, branch: op.target, head, remoteHead, commits: parseLog(await git(['log', '--format=%H%x00%P%x00%s', range, '--'])), fingerprint: digest(op.id + remote + url + head + remoteHead) }
}
export const readPush = (d: TasksDeps, key: unknown, id: unknown, remote: unknown): Promise<Reply<PushPreview>> => reply(d.log, BRANCH_TEXT.push, () => preview(d, key, id, remote))
export const pushMerge = (d: BranchDeps, key: unknown, input: unknown): Promise<Reply<MergeWorkspace>> => reply(d.log, BRANCH_TEXT.push, async () => {
  const scope = await scopeOf(d, key); const r = input as Partial<PushPreview> | null
  if (!r || typeof r.fingerprint !== 'string') throw new Refusal(BRANCH_TEXT.invalid)
  return withBranchLock(d, scope.key, async () => {
    const checked = await preview(d, key, r.operationId, r.remote)
    if (checked.fingerprint !== r.fingerprint) throw new Refusal(BRANCH_TEXT.stale)
    const op = await loadOperation(d, scope.key, checked.operationId)
    // Remote inspection recovers a successful push whose reply was lost.
    if (checked.remoteHead !== checked.head) {
      const result = await runStep(d, op, scope.ctx.projectPath, { kind: 'push', remote: checked.remote, branch: checked.branch, head: checked.head })
      if (result.exitCode !== 0) throw new Refusal(BRANCH_TEXT.push)
    }
    op.published = { remote: checked.remote, at: d.now(), commit: checked.head }; await saveOperation(d, op)
    return workspaceOf(d, scope.ctx.projectPath, op)
  })
})
