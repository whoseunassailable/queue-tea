import type { FolderSpace } from '../../../../shared/branches'
import type { Reply } from '../../../../shared/engine_api'
import { MESSAGES } from '../../../core/messages'
import { Refusal, reply } from '../../../core/reply'
import { questIdOf } from '../../tasks/domain/task_input'
import { scopeOf } from '../../tasks/api/scope'
import type { TasksDeps } from '../../tasks/api/scope'
import { BRANCH_TEXT } from '../domain/constants'
import { gitIn, headsOf } from '../data/branch_source'
import { withBranchLock } from '../data/operation_store'
import { clearBuildFolders, folderStateOf, heldOf, isUpdateRunning, mergedOf, ownedFolders, spaceOf } from '../data/space_source'

export const readFolderSpace = (d: TasksDeps, key: unknown): Promise<Reply<FolderSpace>> =>
  reply(d.log, BRANCH_TEXT.spaceRead, async () => spaceOf(d, await scopeOf(d, key)))

// Every picked folder is checked before any is cleared, so a refusal leaves
// them all as they were.
export const freeFolderSpace = (d: TasksDeps, key: unknown, paths: unknown): Promise<Reply<FolderSpace>> => reply(d.log, BRANCH_TEXT.spaceFree, async () => {
  if (!Array.isArray(paths) || !paths.every(p => typeof p === 'string')) throw new Refusal(BRANCH_TEXT.invalid)
  if (!paths.length) throw new Refusal(BRANCH_TEXT.spaceChoose)
  const initial = await scopeOf(d, key)
  return withBranchLock(d, initial.key, async () => {
    const scope = await scopeOf(d, key); const owned = await ownedFolders(d, scope)
    const picked = [...new Set(paths as string[])].map(path => owned.find(o => o.path === path))
    if (picked.some(o => !o)) throw new Refusal(BRANCH_TEXT.invalid)
    if (await isUpdateRunning(d)) throw new Refusal(BRANCH_TEXT.spaceUpdating)
    for (const o of picked) if (await heldOf(d, scope, o!)) throw new Refusal(BRANCH_TEXT.spaceHeld)
    for (const o of picked) await clearBuildFolders(d, o!.path)
    return spaceOf(d, await scopeOf(d, key))
  })
})

// A plain `git worktree remove`, never --force: git itself refuses a folder
// with changes. The branch is kept, and the quest forgets the folder so
// starting it again makes a fresh one.
export const removeTaskFolder = (d: TasksDeps, key: unknown, taskId: unknown): Promise<Reply<FolderSpace>> => reply(d.log, BRANCH_TEXT.spaceRemove, async () => {
  const initial = await scopeOf(d, key); const id = questIdOf(taskId)
  return withBranchLock(d, initial.key, async () => {
    const scope = await scopeOf(d, key)
    const owned = (await ownedFolders(d, scope)).find(o => o.task.id === id)
    if (!owned) throw new Refusal(BRANCH_TEXT.missing)
    const state = await folderStateOf(d, scope, await headsOf(d, scope.ctx.projectPath), owned)
    if (state.held) throw new Refusal(BRANCH_TEXT.spaceHeld)
    if (!state.merged) throw new Refusal(BRANCH_TEXT.notMerged)
    if (state.changed.length) throw new Refusal(BRANCH_TEXT.folderChanged)
    if (await isUpdateRunning(d)) throw new Refusal(BRANCH_TEXT.spaceUpdating)
    await gitIn(d, scope.ctx.projectPath)(['worktree', 'remove', '--', owned.path])
    d.log.debug(`Removed the worktree ${owned.path}`)
    const saved = await scope.deps.records.update(r => ({ ...r, tasks: r.tasks.map(t => t.id === id && t.worktreePath === owned.path ? { ...t, worktreePath: null } : t) }))
    if (saved === 'unreadable') throw new Refusal(MESSAGES.unreadableRealm)
    return spaceOf(d, await scopeOf(d, key))
  })
})

// After a merge, the build folders of this quest's folder and of every other
// finished, merged quest's folder go, unless someone is working there. A
// quest is usually still current when its own merge completes, so its folder
// is kept then and cleared at a later merge. A put-back quest keeps its
// install for when it resumes. Returns the lines for the merge's log.
export const clearAfterMerge = async (d: TasksDeps, key: unknown, taskId: string): Promise<string[]> => {
  const lines: string[] = []; let others = 0
  try {
    if (await isUpdateRunning(d)) return [BRANCH_TEXT.keptForUpdate]
    const scope = await scopeOf(d, key); const heads = await headsOf(d, scope.ctx.projectPath)
    for (const owned of await ownedFolders(d, scope)) {
      const own = owned.task.id === taskId
      try {
        if (!own && (owned.task.state !== 'done' || !(await mergedOf(d, scope, heads, owned.task)))) continue
        if (await heldOf(d, scope, owned)) { if (own) lines.push(BRANCH_TEXT.keptAfterMerge); continue }
        const cleared = await clearBuildFolders(d, owned.path)
        if (own && cleared.length) lines.push(BRANCH_TEXT.clearedAfterMerge(cleared))
        if (!own && cleared.length) others++
      } catch (err) {
        // The merge is already done; Free space on the Branches page can try again.
        d.log.error(`Clearing build folders in ${owned.path} after a merge failed`, err)
      }
    }
  } catch (err) {
    // As above: the merge stands whatever happens here.
    d.log.error('Clearing build folders after a merge failed', err)
  }
  if (others) lines.push(BRANCH_TEXT.clearedMergedAfterMerge(others))
  return lines
}
