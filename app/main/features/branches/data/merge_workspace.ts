import { copyFile, lstat, realpath } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { dirname, join, relative, resolve } from 'node:path'
import type { ConflictFile, MergeOperation, MergeWorkspace } from '../../../../shared/branches'
import { Refusal } from '../../../core/reply'
import type { TasksDeps } from '../../tasks/api/scope'
import { BRANCH_LIMITS, BRANCH_TEXT } from '../domain/constants'
import { checksPassed, discoverChecks, readChecks } from './checks_source'
import { isFile } from '../domain/git_rules'
import { ancestor, digest, gitIn, headOf } from './branch_source'
import { operationPath } from './operation_store'

export const workspacePath = (d: TasksDeps, op: MergeOperation) => `${operationPath(d, op.key, op.id)}/worktree`
type StageEntry = { mode: string; oid: string; stage: number; path: string }
export const conflictEntries = (text: string): StageEntry[] => text.split('\0').filter(Boolean).map(line => {
  const tab = line.indexOf('\t'); const [mode = '', oid = '', stage = ''] = line.slice(0, tab).split(' ')
  return { mode, oid, stage: Number(stage), path: line.slice(tab + 1) }
})
// Never follow a symlink (including a symlink in an ancestor folder) when
// writing a resolution. Git blobs can still be selected safely via the index.
export const safeResolutionPath = async (folder: string, path: string) => {
  if (!isFile(path)) throw new Refusal(BRANCH_TEXT.unsafePath)
  const root = await realpath(folder); const file = resolve(root, path)
  if (relative(root, file).startsWith('..')) throw new Refusal(BRANCH_TEXT.unsafePath)
  const parent = await realpath(dirname(file))
  if (parent !== root && !parent.startsWith(root + '/')) throw new Refusal(BRANCH_TEXT.unsafePath)
  try { if (!(await lstat(file)).isFile()) throw new Refusal(BRANCH_TEXT.unsafePath) } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') throw err
  }
  return join(parent, file.slice(file.lastIndexOf('/') + 1))
}
export const workspaceOf = async (d: TasksDeps, root: string, saved: MergeOperation): Promise<MergeWorkspace> => {
  const op = { ...saved }; const path = workspacePath(d, op)
  if (!(await d.host.exists(path)) || op.stage === 'abandoned') return { operation: op, conflicts: [], diff: '', truncated: false, approval: null }
  const git = gitIn(d, path)
  const head = (await git(['rev-parse', 'HEAD'])).trim()
  // Recover a committed result before issuing another commit. A user hook may
  // amend the merge, so verify its parents, not an assumed commit identifier.
  if (['committing', 'applying', 'merged'].includes(op.stage) && head !== op.targetHead) {
    const parents = (await git(['show', '-s', '--format=%P', head])).trim().split(' ')
    if (parents[0] !== op.targetHead || parents[1] !== op.sourceHead || parents.length !== 2) throw new Refusal(BRANCH_TEXT.stale)
    op.commit = head
    op.message = (await git(['show', '-s', '--format=%B', head])).trimEnd()
    op.stage = await ancestor(d, root, head, await headOf(d, root, op.target)) ? 'merged' : 'applying'
  }
  const entries = conflictEntries(await git(['ls-files', '-u', '-z']))
  const conflicts: ConflictFile[] = []
  for (const name of [...new Set(entries.map(e => e.path))]) {
    const parts = entries.filter(e => e.path === name)
    let editable = parts.every(p => p.mode === '100644' || p.mode === '100755')
    const texts = await Promise.all([1, 2, 3].map(async stage => {
      const entry = parts.find(p => p.stage === stage)
      if (!entry) return null
      const size = Number(await git(['cat-file', '-s', entry.oid]))
      if (size > BRANCH_LIMITS.conflict) { editable = false; return null }
      const text = await git(['cat-file', 'blob', entry.oid])
      if (text.includes('\0') || text.includes('\ufffd')) { editable = false; return null }
      return text
    }))
    let result: string | null = null
    if (editable) {
      try { result = await d.host.read(await safeResolutionPath(path, name)) } catch (err) {
        if ((err as NodeJS.ErrnoException).code !== 'ENOENT') { editable = false; d.log.warn(`Conflict result unavailable: ${String(err)}`) }
      }
      if ((result?.length ?? 0) > BRANCH_LIMITS.conflict) { editable = false; result = null }
    }
    conflicts.push({ path: name, base: texts[0] ?? null, target: texts[1] ?? null, source: texts[2] ?? null, result, editable })
  }
  if (['preparing', 'conflicts', 'ready', 'committing'].includes(op.stage) && !op.commit) {
    const mergeHead = await d.host.run(['git', 'rev-parse', '-q', '--verify', 'MERGE_HEAD'], path)
    if (mergeHead.exitCode === 0 && mergeHead.stdout.trim() === op.sourceHead) op.stage = conflicts.length ? 'conflicts' : 'ready'
    else op.stage = 'failed'
  }
  const diff = await git(['diff', '--no-ext-diff', '--no-textconv', op.targetHead, '--'])
  const unstaged = await git(['diff', '--no-ext-diff', '--no-textconv', '--'])
  let untracked = (await git(['ls-files', '--others', '--exclude-standard', '-z'])).split('\0').filter(Boolean)
  const metadata = `${operationPath(d, op.key, op.id)}/dependencies.json`
  if (await d.host.exists(metadata)) {
    const links = JSON.parse(await d.host.read(metadata)) as { path: string; target: string }[]
    for (const link of links) {
      if (!isFile(link.path) || link.path.split('/').at(-1) !== 'node_modules' || !untracked.includes(link.path)) continue
      const file = resolve(path, link.path)
      if ((await lstat(file)).isSymbolicLink() && await realpath(file) === link.target) untracked = untracked.filter(p => p !== link.path)
    }
  }
  let tree: string | null = null
  if (!conflicts.length) {
    // write-tree refreshes the index cache. Use a private copy so simultaneous
    // UI reads cannot take the real index lock from a commit or another read.
    const original = (await git(['rev-parse', '--path-format=absolute', '--git-path', 'index'])).trim()
    const temporary = `${operationPath(d, op.key, op.id)}/index-${randomUUID()}`
    try {
      await copyFile(original, temporary)
      const result = await d.host.run(['env', `GIT_INDEX_FILE=${temporary}`, 'git', 'write-tree'], path)
      if (result.exitCode) throw new Error(`Reading prepared tree failed: ${result.stderr}`)
      tree = result.stdout.trim()
    } finally {
      for (const file of [temporary, temporary + '.lock']) {
        if ((await d.host.remove(file)).exitCode) d.log.warn('Could not remove a temporary review index')
      }
    }
  }
  const committedTree = op.commit ? (await git(['rev-parse', `${op.commit}^{tree}`])).trim() : null
  op.tree = tree
  const availableChecks = tree ? await discoverChecks(d, path, tree) : []
  const checks = await readChecks(d, op)
  const checksCurrent = tree !== null && checksPassed(checks, tree, availableChecks)
  return { availableChecks, checks, checksCurrent, operation: op, conflicts, diff: diff.slice(0, BRANCH_LIMITS.diff), truncated: diff.length > BRANCH_LIMITS.diff,
    approval: (op.stage === 'ready' || op.stage === 'applying') && tree && !unstaged && !untracked.length && (!committedTree || committedTree === tree) ? digest(op.id + op.sourceHead + op.targetHead + tree + (op.commit ?? '')) : null }
}
