import type { ProjectRecord } from '../../../../../types'
import type { Ctx } from '../../../../core/env/env'
import type { Deps } from './deps'
import { logRow } from './log_row'

export type DocsPathResult = { kind: 'unreadable' } | { kind: 'saved'; record: ProjectRecord; logFailedAt: string | null }

// Keeps the task log's path, then logs the task that asked for it.
export const saveDocsPathUseCase = async (d: Deps, ctx: Ctx, taskId: string, path: string): Promise<DocsPathResult> => {
  const saved = await d.records.update(r => ({ ...r, docsLogPath: path }))
  if (saved === 'unreadable') return { kind: 'unreadable' }

  return { kind: 'saved', record: saved, logFailedAt: await logRow(d, ctx, saved, taskId, path) }
}
