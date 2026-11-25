import { realpath } from 'node:fs/promises'
import type { Task } from '../../../../../types'
import { readUpdate, updateFolder } from '../../../../tools/update_runner.mjs'
import { sessionsRepositoryImpl } from '../../../../../hooks/shared/sessions/data/repositories/sessions_repository_impl'
import { isFresh } from '../../../../../hooks/shared/sessions/domain/services/session_rules'
import { worktreesRepositoryImpl } from '../../../../../hooks/shared/git/data/repositories/worktrees_repository_impl'
import type { FolderSpace, TaskFolder } from '../../../../shared/branches'
import type { Scope, TasksDeps } from '../../tasks/api/scope'
import { parseStatus } from '../domain/git_rules'
import { buildFoldersIn, holdOf } from '../domain/space_rules'
import { ancestor, gitIn, headsOf, taskReads } from './branch_source'

type Owned = { task: Task; path: string }
type Heads = Awaited<ReturnType<typeof headsOf>>

// Each quest's own checkout: never the project's folder, nor a merge's
// detached integration folder.
export const ownedFolders = async (d: TasksDeps, scope: Scope): Promise<Owned[]> => {
  const root = scope.ctx.projectPath
  return (await worktreesRepositoryImpl(d.host, root).list()).flatMap(w => {
    const task = w.path !== root && w.branch ? scope.record.tasks.find(t => t.branch === w.branch) : undefined
    return task ? [{ task, path: w.path }] : []
  })
}

// The build folders git itself calls ignored, checked again with
// check-ignore. Never `git clean -X`: that would take .env files too.
export const buildFoldersOf = async (d: TasksDeps, path: string): Promise<string[]> => {
  const listed = buildFoldersIn(await gitIn(d, path)(['ls-files', '-z', '--others', '--ignored', '--exclude-standard', '--directory']))
  const ignored: string[] = []
  for (const folder of listed) {
    // One quiet check per folder: the exit code answers, so no printed path
    // needs unquoting. 0 is ignored, 1 is not.
    const checked = await d.host.run(['git', 'check-ignore', '-q', '--', folder], path)
    if (checked.exitCode > 1) throw new Error(`git check-ignore failed (${checked.exitCode}): ${checked.stderr}`)
    if (checked.exitCode === 0) ignored.push(folder)
  }
  return ignored
}

export const clearBuildFolders = async (d: TasksDeps, path: string): Promise<string[]> => {
  const folders = await buildFoldersOf(d, path)
  for (const folder of folders) {
    const removed = await d.host.run(['rm', '-rf', '--', folder], path)
    if (removed.exitCode !== 0) throw new Error(`removing ${folder} in ${path} failed: ${removed.stderr}`)
    d.log.debug(`Cleared ${folder} in ${path}`)
  }
  return folders
}

// Disk use in bytes. du still prints what it could read when part of a
// folder is unreadable, so only an empty answer is a failure.
const bytesOf = async (d: TasksDeps, cwd: string, paths: string[]): Promise<number> => {
  if (!paths.length) return 0
  const r = await d.host.run(['du', '-sk', '--', ...paths], cwd)
  if (r.exitCode !== 0 && !r.stdout.trim()) throw new Error(`du failed in ${cwd} (${r.exitCode}): ${r.stderr}`)
  return r.stdout.split('\n').reduce((sum, line) => sum + (Number.parseInt(line, 10) || 0), 0) * 1024
}

// A session can reach a folder through a symlink. A path that no longer
// resolves is safe to compare as written: it cannot match a real folder's.
const realOf = (path: string) => realpath(path).catch(() => path)

const isSessionIn = async (d: TasksDeps, path: string) => {
  const real = await realOf(path)
  for (const s of await sessionsRepositoryImpl(d.host, d.home).list()) {
    if (isFresh(s, d.now()) && await realOf(s.workingPath ?? s.projectPath) === real) return true
  }
  return false
}

// An app update builds with the first matching node_modules it finds, which
// can be a task folder's, so no build folder goes while one runs.
export const isUpdateRunning = async (d: TasksDeps): Promise<boolean> => {
  try {
    const state = await readUpdate(updateFolder(d.home))
    return !!state && !['idle', 'installed', 'failed'].includes(state.phase)
  } catch (err) {
    // A damaged update state cannot say; clearing stays possible, and a
    // broken update can be retried.
    d.log.error('Reading the update state before clearing build folders failed', err)
    return false
  }
}

export const heldOf = async (d: TasksDeps, scope: Scope, { task, path }: Owned) =>
  holdOf(scope.record.tasks, task, path, scope.ctx.projectPath, await isSessionIn(d, path))

export const mergedOf = async (d: TasksDeps, scope: Scope, heads: Heads, task: Task) => {
  const head = heads.find(h => h.branch === task.branch)?.head
  const base = heads.find(h => h.branch === task.baseBranch)?.head
  return !!head && !!base && head !== task.startCommit && await ancestor(d, scope.ctx.projectPath, head, base)
}

// What the Free space sheet decides on, without the sizes.
export const folderStateOf = async (d: TasksDeps, scope: Scope, heads: Heads, owned: Owned) => {
  const { task, path } = owned
  const merged = await mergedOf(d, scope, heads, task)
  const changed = parseStatus(await gitIn(d, path)(['status', '--porcelain=v1', '-z', '--untracked-files=all']))
  const held = await heldOf(d, scope, owned)
  return { merged, changed, held, removable: merged && !held && changed.length === 0 }
}

export const spaceOf = async (d: TasksDeps, scope: Scope): Promise<FolderSpace> => {
  const heads = await headsOf(d, scope.ctx.projectPath)
  const folders = await taskReads(await ownedFolders(d, scope), async (owned): Promise<TaskFolder> => {
    const folders = await buildFoldersOf(d, owned.path)
    return { taskId: owned.task.id, title: owned.task.title, branch: owned.task.branch!, path: owned.path, folders,
      bytes: await bytesOf(d, owned.path, ['.']), freeable: await bytesOf(d, owned.path, folders), ...await folderStateOf(d, scope, heads, owned) }
  })
  return { at: d.now(), folders: folders.sort((a, b) => b.freeable - a.freeable) }
}
