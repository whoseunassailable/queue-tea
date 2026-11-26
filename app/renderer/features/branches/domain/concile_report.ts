// Tea-Concile ends its report with a fenced `tea-concile-decisions` block: a
// JSON list of the files it left for Rohan, each with the choice, what each
// side does, and its recommendation. Branches shows each one on its file.

export type ConcileChoice = 'target' | 'source' | 'result'
export type ConcileDecision = { file: string; question: string; target: string; source: string; recommend: ConcileChoice | null; why: string }
// `text` is the report without the block. `problem` is set when a block was
// there but didn't read, so nothing could be marked on the files; the window
// logs it, since this layer has no logger.
export type ConcileReport = { text: string; decisions: ConcileDecision[]; problem: string | null }

export const DECISION_LIMITS = { field: 600, decisions: 50 } as const

const BLOCKS = /```tea-concile-decisions[^\n]*\n([\s\S]*?)```/g
const CHOICES: readonly ConcileChoice[] = ['target', 'source', 'result']

const clip = (value: unknown): string => {
  if (typeof value !== 'string') return ''
  const text = value.trim()

  return text.length > DECISION_LIMITS.field ? `${text.slice(0, DECISION_LIMITS.field - 1)}…` : text
}

// A path in the merge folder, the way git names it: relative, inside it.
const isPath = (value: unknown): value is string =>
  typeof value === 'string' && value.length > 0 && value.length <= DECISION_LIMITS.field && !value.startsWith('/') && !value.includes('\0') && !value.split('/').some(part => part === '..' || part === '')

const decisionOf = (entry: unknown): ConcileDecision | null => {
  if (typeof entry !== 'object' || entry === null) return null
  const e = entry as Record<string, unknown>
  const question = clip(e.question)
  if (!isPath(e.file) || question === '') return null
  const recommend = CHOICES.find(choice => choice === e.recommend) ?? null

  return { file: e.file, question, target: clip(e.target), source: clip(e.source), recommend, why: clip(e.why) }
}

const parsed = (json: string): { list: unknown } | { problem: string } => {
  try {
    return { list: JSON.parse(json) }
  } catch (error) {
    // A block that doesn't parse marks nothing: the window logs the problem and
    // says so, and the report's own words still say what is left.
    return { problem: error instanceof Error ? (error.stack ?? error.message) : String(error) }
  }
}

export const concileReport = (reply: string | null): ConcileReport => {
  const whole = reply ?? ''
  const blocks = [...whole.matchAll(BLOCKS)]
  const text = whole.replace(BLOCKS, '').trim()
  // The block comes last; an earlier one is an example the report quoted.
  const last = blocks.at(-1)
  if (last === undefined) return { text, decisions: [], problem: null }
  const read = parsed(last[1] ?? '')
  if ('problem' in read) return { text, decisions: [], problem: read.problem }
  if (!Array.isArray(read.list)) return { text, decisions: [], problem: 'the decisions block is not a list' }
  const decisions: ConcileDecision[] = []
  for (const entry of read.list.slice(0, DECISION_LIMITS.decisions)) {
    const decision = decisionOf(entry)
    if (decision !== null && !decisions.some(one => one.file === decision.file)) decisions.push(decision)
  }

  return { text, decisions, problem: null }
}
