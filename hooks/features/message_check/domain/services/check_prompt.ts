import { firstObject } from '../../../../shared/checkpoints/domain/services/first_object'
import type { CheckAnswer } from '../../../../shared/assistant/domain/entities/check_answer'
import type { Difficulty, Intent, Task } from '../../../../../types'

const KINDS = ['same', 'new', 'quick', 'unsure'] as const
const INTENTS: readonly Intent[] = ['understanding', 'improving']
const DIFFICULTIES: readonly Difficulty[] = ['light', 'medium', 'hard']

// `features` are the tasks new work can be filed under, `featureId` the one
// Rohan made active, and `lone` the tasks on their own a first piece of work
// can go under; with none of them, the prompt is as it was before features.
export const checkPrompt = (
  current: Task | null,
  queued: Task[],
  text: string,
  features: Task[] = [],
  featureId: string | null = null,
  lone: Task[] = [],
): string =>
  [
    'You sort a message Rohan just typed for a task queue. Answer with one JSON object only, no other text:',
    features.length + lone.length === 0
      ? '{"kind":"same|new|quick|unsure","intent":"understanding|improving","title":"…","difficulty":"light|medium|hard"}'
      : '{"kind":"same|new|quick|unsure","intent":"understanding|improving","title":"…","difficulty":"light|medium|hard","parent":"<feature id>|none|unsure"}',
    '- same: it continues the current task.',
    '- new: it is other work, to do later.',
    "- quick: a side question that isn't work to queue.",
    '- unsure: you cannot tell.',
    '- intent: understanding when it asks how or why or explores; improving when it asks for a change.',
    '- title (at most 60 characters) and difficulty only for new. A bug fix is usually light, a new feature hard.',
    ...(features.length + lone.length === 0
      ? []
      : [
          '- parent only for new: the id of the feature or task below that the work is part of; none when it is separate work; unsure when you cannot tell. Give one only on clear evidence, such as the message naming it or plainly being a piece of it, never just because it is active or current. A broad task on its own can take the first piece of it.',
          ...(features.length === 0
            ? []
            : [`Features: ${features.map(t => `${t.id} "${t.title}"${t.id === featureId ? ' (active)' : ''}`).join(', ')}.`]),
          ...(lone.length === 0 ? [] : [`Tasks on their own: ${lone.map(t => `${t.id} "${t.title}"`).join(', ')}.`]),
        ]),
    current === null
      ? 'No task is current, so any message that is work is new.'
      : `The current task: "${current.title}".`,
    queued.length === 0 ? 'Nothing is queued.' : `Queued: ${queued.map(t => `"${t.title}"`).join(', ')}.`,
    '',
    'The message:',
    text,
  ].join('\n')

export const parseCheckAnswer = (reply: string): CheckAnswer | null => {
  const object = firstObject(reply)
  if (object === null) return null
  let parsed: Record<string, unknown>
  try {
    parsed = JSON.parse(object) as Record<string, unknown>
  } catch {
    return null
  }

  const kind = KINDS.find(k => k === parsed.kind)
  const intent = INTENTS.find(i => i === parsed.intent)
  if (kind === undefined || intent === undefined) return null
  if (kind !== 'new') return { kind, intent }

  const title = typeof parsed.title === 'string' ? parsed.title.trim().slice(0, 60) : ''
  if (title === '') return null
  const difficulty = DIFFICULTIES.find(d => d === parsed.difficulty) ?? 'medium'
  const parent = typeof parsed.parent === 'string' ? parsed.parent.trim() : ''

  return parent === '' ? { kind, intent, title, difficulty } : { kind, intent, title, difficulty, parent }
}

// Only what Rohan types is checked: not slash commands, hidden prompts, or
// what a plugin or another session sent.
export const shouldCheck = (e: {
  origin: { kind: string }
  command?: unknown
  isMeta?: true
  attachments?: readonly unknown[]
}): boolean =>
  e.origin.kind === 'composer' &&
  e.command === undefined &&
  e.isMeta === undefined &&
  (e.attachments === undefined || e.attachments.length === 0)
