import type { Host } from '../../../../core/host/host'
import type { Worktree, WorktreesRepository } from '../../domain/repositories/worktrees_repository'

export const worktreesRepositoryImpl = (host: Host, root: string): WorktreesRepository => {
  const git = async (args: string[]): Promise<string> => {
    const result = await host.run(['git', ...args], root)
    if (result.exitCode !== 0) throw new Error(`git ${args[0]} failed: ${result.stderr}`)

    return result.stdout.trim()
  }

  return {
    list: async () => {
      const result: Worktree[] = []
      for (const part of (await git(['worktree', 'list', '--porcelain', '-z'])).split('\0')) {
        if (part.startsWith('worktree ')) result.push({ path: part.slice(9), branch: null })
        else if (part.startsWith('branch refs/heads/') && result.length > 0) result[result.length - 1]!.branch = part.slice(18)
      }

      return result
    },
    base: async () => {
      let branch: string | null = null
      for (const candidate of ['main', 'master']) {
        if ((await host.run(['git', 'show-ref', '--verify', '--quiet', `refs/heads/${candidate}`], root)).exitCode === 0) {
          branch = candidate
          break
        }
      }
      branch ??= await git(['symbolic-ref', '--short', 'HEAD'])

      return { branch, commit: await git(['rev-parse', '--verify', `refs/heads/${branch}^{commit}`]) }
    },
    create: async (path, branch, base, isNew) => {
      const made = await host.makeDirs(path.slice(0, path.lastIndexOf('/')))
      if (made.exitCode !== 0) throw new Error(`making the worktree folder failed: ${made.stderr}`)
      await git(isNew ? ['worktree', 'add', '-b', branch, path, base] : ['worktree', 'add', path, branch])
    },
  }
}
