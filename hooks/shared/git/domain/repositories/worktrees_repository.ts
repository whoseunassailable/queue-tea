export type Worktree = { path: string; branch: string | null }

// Each quest has a checkout, while all checkouts share the repository.
export type WorktreesRepository = {
  list: () => Promise<Worktree[]>
  base: () => Promise<{ branch: string; commit: string }>
  create: (path: string, branch: string, base: string, isNew: boolean) => Promise<void>
}
