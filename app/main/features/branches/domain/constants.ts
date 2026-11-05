export const BRANCH_LIMITS = { graph: 160, diff: 120_000, conflict: 120_000, output: 8_000, message: 2_000, recentMs: 90_000, codexDays: 14 } as const
export const operationsFolder = (home: string, key: string) => `${home}/.queue-tea/integrations/${key}`
export const BRANCH_TEXT = {
  read: 'The branch history could not be read. Check that the project folder is available, then try again.',
  action: 'This action could not finish. Your work is retained. Refresh the review and inspect the operation log before trying again.',
  busy: 'Another branch operation is running. Wait for it to finish, then refresh.',
  stale: 'The branches or files changed after this review. Refresh and review the new result before approving it.',
  dirty: 'Commit the source changes before preparing the merge. The destination must also have a clean working folder.',
  writer: 'A session is still working in one of these folders. Stop it before continuing.',
  idle: 'Confirm that agents and editors have stopped changing the source and destination folders.',
  missing: 'This branch or its working folder is unavailable. Restore it, then refresh.',
  invalid: 'This selection is no longer valid. Refresh the branch review and try again.',
  pending: 'This folder already has a merge, rebase, or cherry-pick in progress. Finish it before continuing.',
  reserved: 'A retained merge already uses this destination. Finish or abandon it before preparing another.',
  unresolved: 'Resolve every conflict and review the resulting changes before completing the merge.',
  unsafePath: 'This file cannot be edited safely here. Choose one complete side, or resolve it in the retained integration folder.',
  message: 'Enter a commit message of no more than 2,000 characters.',
  staged: 'Unselected files are already staged. Include them or unstage them in your editor before committing.',
  receipt: 'A previous commit attempt is retained. Refresh to inspect its result before starting another commit.',
  push: 'The push did not complete. The local merge is retained. Check your connection, authentication, and remote branch rules, then review the push again.',
  multiplePush: 'This remote has several push destinations. Configure one destination before publishing from this review.',
  noMerge: 'There are no new commits to merge into this destination.',
} as const
