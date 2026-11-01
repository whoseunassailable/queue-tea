import type { LoadError, OtherProject, ProjectRecord } from '../../../../../types'

// What a change to the record leaves: the record as saved, or a file that
// can't be read.
export type Saved = ProjectRecord | 'unreadable'

// The task record, whatever holds it.
export type RecordsRepository = {
  read: () => Promise<ProjectRecord | 'unreadable'>
  update: (fn: (r: ProjectRecord) => ProjectRecord) => Promise<ProjectRecord | 'unreadable'>
  problem: () => Promise<LoadError | null>
  restore: (stamp: string) => Promise<{ record: ProjectRecord; keptAt: string } | 'readable' | 'no-copy'>
  others: (title: (r: ProjectRecord) => string | null) => Promise<OtherProject[]>
}
