import type { Task } from '../../../../../types'
import { isFile } from './git_rules'

// Build output a tool makes again: these go, nothing else does.
export const BUILD_FOLDERS: readonly string[] = ['node_modules', 'build', '.dart_tool', 'dist', '.gradle', 'Pods', '.next', 'target']

// The build folders in a `git ls-files -z --others --ignored --directory`
// listing, outermost first. Git ends a folder with `/` only when it is a real
// folder holding nothing tracked, so symlinks and folders with tracked files
// never appear. A folder inside one already kept is dropped.
export const buildFoldersIn = (listing: string): string[] => {
  const kept: string[] = []
  for (const folder of listing.split('\0').filter(e => e.endsWith('/')).map(e => e.slice(0, -1)).sort()) {
    if (!isFile(folder) || !BUILD_FOLDERS.includes(folder.slice(folder.lastIndexOf('/') + 1))) continue
    if (!kept.some(k => folder.startsWith(`${k}/`))) kept.push(folder)
  }
  return kept
}

// Who is working in a quest's folder: its quest or another current one, then
// a live session. A held folder is never cleared or removed.
export const holdOf = (tasks: Task[], task: Task, path: string, projectPath: string, isSessionOpen: boolean): 'current' | 'session' | null =>
  task.state === 'current' || tasks.some(t => t.state === 'current' && (t.worktreePath ?? projectPath) === path) ? 'current' : isSessionOpen ? 'session' : null
