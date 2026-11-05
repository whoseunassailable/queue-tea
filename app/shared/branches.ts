import type { TaskActivity } from '../../types'

export type BranchState = 'queued' | 'working' | 'needsYou' | 'review' | 'paused' | 'unobserved' | 'merged'
export type BranchTip = { id: string; title: string; branch: string; base: string | null; head: string | null; fork: string | null; merged: boolean; state: BranchState; latest: string | null; seenAt: number | null; changed: number | null; commits: number | null }
export type GraphCommit = { id: string; parents: string[]; message: string }
export type BranchGraph = { at: number; integration: string; heads: { branch: string; head: string }[]; commits: GraphCommit[]; tasks: BranchTip[]; limited: boolean }
export type ChangedFile = { path: string; previous: string | null; status: string }
export type MergeEvent = { at: number; command: string; status: 'running' | 'succeeded' | 'failed'; output: string }
export type MergeStage = 'preparing' | 'conflicts' | 'ready' | 'committing' | 'applying' | 'merged' | 'abandoned' | 'failed'
export type MergeOperation = {
  version: 1; id: string; key: string; taskId: string; source: string; target: string; sourceHead: string; targetHead: string;
  created: number; stage: MergeStage; tree: string | null; commit: string | null; message: string | null; events: MergeEvent[];
  published: { remote: string; at: number; commit: string } | null;
}
export type ConflictFile = { path: string; base: string | null; target: string | null; source: string | null; result: string | null; editable: boolean }
export type MergeWorkspace = { operation: MergeOperation; conflicts: ConflictFile[]; diff: string; truncated: boolean; approval: string | null }
export type BranchReview = {
  taskId: string; source: string; target: string; targets: string[]; sourceHead: string; targetHead: string; fingerprint: string;
  files: ChangedFile[]; diff: string; truncated: boolean; commits: GraphCommit[]; steps: TaskActivity[];
  state: BranchState; blocked: string | null; merged: boolean; operation: MergeOperation | null; remotes: string[];
}
export type MergeRequest = { taskId: string; target: string; fingerprint: string; idleConfirmed: boolean }
export type CommitRequest = MergeRequest & { files: string[]; message: string }
export type ResolveRequest = { operationId: string; path: string; choice: 'base' | 'target' | 'source' | 'edited'; text?: string }
export type CompleteRequest = { operationId: string; approval: string; message: string; idleConfirmed: boolean }
export type PushPreview = { operationId: string; remote: string; branch: string; head: string; remoteHead: string | null; commits: GraphCommit[]; fingerprint: string }
