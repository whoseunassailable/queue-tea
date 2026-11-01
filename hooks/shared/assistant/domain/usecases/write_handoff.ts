import type { Ctx, Env } from '../../../../core/env/env'
import type { ProjectRecord, Task } from '../../../../../types'
import { checkpointPrompt, emptyCheckpoint, parseCheckpoint } from '../../../checkpoints/domain/services/checkpoints'
import type { GitRepository } from '../../../git/domain/repositories/git_repository'
import type { RecordsRepository } from '../../../records/domain/repositories/records_repository'
import { isoLocal } from '../../../time/domain/services/time'
import type { AssistantRepository } from '../repositories/assistant_repository'

export type HandoffDeps = { records: RecordsRepository; git: GitRepository; assistant: AssistantRepository; env: Env }
export type HandoffResult = { kind: 'written'; record: ProjectRecord } | { kind: 'not_written'; reason: string } | { kind: 'unreadable' }

const factsNow = async (d: HandoffDeps) => {
  try {
    return await d.git.facts()
  } catch (err) {
    d.env.log(`reading git for the checkpoint failed: ${err instanceof Error ? err.message : String(err)}`)

    return null
  }
}

// Asks Claude for the task's checkpoint over the conversation and saves it
// with what git says now. A reply that isn't one is kept as a plain note.
export const writeHandoffUseCase = async (d: HandoffDeps, ctx: Ctx, task: Task): Promise<HandoffResult> => {
  const git = await factsNow(d)
  const reply = await d.assistant.fork(checkpointPrompt(task, git))
  if (!reply.isAnswered || reply.text.trim() === '') return { kind: 'not_written', reason: reply.isAnswered ? 'empty' : reply.reason }
  const written = isoLocal(await d.env.now(), ctx.offsetMinutes)
  const parsed = parseCheckpoint(reply.text, written)
  const saved = await d.records.update(r => ({
    ...r,
    tasks: r.tasks.map(t => {
      if (t.id !== task.id) return t
      if (parsed === null) return { ...t, handoff: { text: reply.text.trim(), written } }
      const before = (t.checkpoint ?? emptyCheckpoint()).seen
      const seen = before === null ? { at: written, files: [], commands: [], git } : { ...before, git: git ?? before.git }

      return { ...t, handoff: null, checkpoint: { ...parsed, seen } }
    }),
  }))

  return saved === 'unreadable' ? { kind: 'unreadable' } : { kind: 'written', record: saved }
}
