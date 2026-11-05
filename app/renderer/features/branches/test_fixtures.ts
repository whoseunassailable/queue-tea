import type { BranchGraph, BranchReview, MergeOperation, MergeWorkspace } from '../../../shared/branches'
export const SOURCE = 'a'.repeat(40)
export const TARGET = 'b'.repeat(40)
export const FORK = 'c'.repeat(40)
export const MERGE = 'd'.repeat(40)
export const branchGraph = (): BranchGraph => ({ at: Date.parse('2026-11-04T12:00:00Z'), integration: 'main', heads: [{ branch: 'main', head: TARGET }, { branch: 'task/first', head: SOURCE }],
  commits: [{ id: SOURCE, parents: [FORK], message: 'Task work' }, { id: TARGET, parents: [FORK], message: 'Main work' }, { id: FORK, parents: [], message: 'Start' }],
  tasks: [{ id: 'one', title: 'Auto update', branch: 'task/first', base: 'main', head: SOURCE, fork: FORK, merged: false, state: 'review', latest: null, seenAt: null, changed: 0, commits: 1 }], limited: false })
export const branchReview = (over: Partial<BranchReview> = {}): BranchReview => ({ taskId: 'one', source: 'task/first', target: 'main', targets: ['main'], sourceHead: SOURCE, targetHead: TARGET, fingerprint: 'e'.repeat(64), files: [], diff: '+Task work', truncated: false, commits: [{ id: SOURCE, parents: [FORK], message: 'Task work' }], steps: [], state: 'review', blocked: null, merged: false, operation: null, remotes: ['origin'], ...over })
export const mergeOperation = (over: Partial<MergeOperation> = {}): MergeOperation => ({ version: 1, id: '12345678-1234-1234-1234-123456789abc', key: 'a-000001', taskId: 'one', source: 'task/first', target: 'main', sourceHead: SOURCE, targetHead: TARGET, created: Date.parse('2026-11-04T12:00:00Z'), stage: 'ready', tree: 'f'.repeat(40), commit: null, message: null, events: [], published: null, ...over })
export const mergeWorkspace = (over: Partial<MergeWorkspace> = {}): MergeWorkspace => ({ operation: mergeOperation(), conflicts: [], diff: '+Task work', truncated: false, approval: 'approval', ...over })
