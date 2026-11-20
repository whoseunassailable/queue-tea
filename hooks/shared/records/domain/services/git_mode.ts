import type { GitMode, ProjectRecord } from '../../../../../types'

export const GIT_MODES: readonly GitMode[] = ['manual', 'assisted']

export const isGitMode = (value: unknown): value is GitMode => GIT_MODES.includes(value as GitMode)

// A record made before Git modes has none, and works as Assisted.
export const gitModeOf = (record: Pick<ProjectRecord, 'gitMode'>): GitMode => (record.gitMode === 'manual' ? 'manual' : 'assisted')
