import type { Band, Intent, ProjectRecord } from '../../../../../types'
import type { Ctx } from '../../../../core/env/env'
import { activeFeature, filingCandidates, guessParent, loneTasks } from '../../../../shared/backlog/domain/services/families'
import { currentTask, orderQueue } from '../../../../shared/records/domain/services/queue_rules'
import type { CheckRepository } from '../repositories/check_repository'
import { checkPrompt } from '../services/check_prompt'

export type TypedVerdict =
  | { kind: 'same' | 'quick'; intent: Intent }
  | { kind: 'new'; band: Band; intent: Intent }
  | { kind: 'unsure'; band: Band; intent: Intent | null; wasChecked: boolean }

// Decides what happens to a typed message: through to Claude, or held for the
// band. The intent is for the effort count.
export const checkTypedMessage = async (check: CheckRepository, ctx: Ctx, record: ProjectRecord, text: string): Promise<TypedVerdict> => {
  const prompt = checkPrompt(
    currentTask(record.tasks),
    orderQueue(record.tasks),
    text,
    filingCandidates(record),
    activeFeature(record)?.id ?? null,
    loneTasks(record),
  )
  const answer = await check.check(prompt, ctx.options.checkTimeoutSeconds * 1000)

  if (answer?.kind === 'same' || answer?.kind === 'quick') return { kind: answer.kind, intent: answer.intent }
  if (answer?.kind === 'new') {
    return {
      kind: 'new',
      intent: answer.intent,
      band: {
        kind: 'file',
        text,
        title: answer.title ?? text.slice(0, 60),
        priority: 'mid',
        difficulty: answer.difficulty ?? 'medium',
        intent: answer.intent,
        ...guessParent(record, text, answer.parent),
      },
    }
  }

  const intent = answer?.intent ?? 'improving'
  const wasChecked = answer !== null

  return { kind: 'unsure', intent: wasChecked ? intent : null, wasChecked, band: { kind: 'unsure', text, intent, didCheckRun: wasChecked } }
}
