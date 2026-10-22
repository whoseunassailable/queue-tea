import type { Checkpoint, CommandRun, GitFacts, Task } from '../types'
import { firstObject } from './check'

// A task's checkpoint: what Claude writes at a handoff, beside what
// Queue-tea saw itself, and the first message a fresh conversation gets.

const KEEP_COMMANDS = 15

export const emptyCheckpoint = (): Checkpoint => ({
  written: null,
  goal: '',
  acceptance: [],
  changes: [],
  decisions: [],
  rejected: [],
  remaining: [],
  blockers: [],
  nextAction: '',
  seen: null,
})

// Test runners, type checks, linters and builds: the checks a "done" leans on.
const TEST = /\b(test|tests|pytest|jest|vitest|mocha|tsc|lint|eslint|analyze|validate|typecheck|check|build)\b/

export const isTestCommand = (command: string): boolean => TEST.test(command)

const lastLine = (text: string) =>
  text
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .at(-1) ?? ''

// One shell command as Queue-tea keeps it: cut short, with the last line of
// what it printed.
export const commandRun = (command: string, isOk: boolean, output: string, at: string): CommandRun => ({
  command: command.replace(/\s+/g, ' ').trim().slice(0, 160),
  isOk,
  isTest: isTestCommand(command),
  at,
  summary: lastLine(output).slice(0, 120),
})

// Adds what Queue-tea saw since the last turn to a task's checkpoint.
export const noteSeen = (
  task: Task,
  seen: { at: string; files: string[]; commands: CommandRun[]; git: GitFacts | null },
): Task => {
  const before = task.checkpoint ?? emptyCheckpoint()
  const files = [...(before.seen?.files ?? [])]
  for (const f of seen.files) if (!files.includes(f)) files.push(f)

  return {
    ...task,
    checkpoint: {
      ...before,
      seen: {
        at: seen.at,
        files,
        commands: [...(before.seen?.commands ?? []), ...seen.commands].slice(-KEEP_COMMANDS),
        git: seen.git ?? before.seen?.git ?? null,
      },
    },
  }
}

const ran = (c: CommandRun) => `- ${c.isOk ? 'passed' : 'failed'}: ${c.command}${c.summary === '' ? '' : ` (${c.summary})`}`

// The question for a checkpoint, with what git and Queue-tea saw, so Claude
// need not guess and cannot claim a check it didn't run.
export const checkpointPrompt = (task: Task, git: GitFacts | null): string => {
  const seen = task.checkpoint?.seen

  return [
    'Write a checkpoint for the current task so a fresh conversation can carry it on. Answer with one JSON object only, no other text:',
    '{"goal":"…","acceptance":["…"],"changes":["…"],"decisions":["…"],"rejected":["…"],"remaining":["…"],"blockers":["…"],"nextAction":"…"}',
    '- goal: what the task is for, in one or two lines.',
    '- acceptance: how to tell it is finished, one point each.',
    '- changes: what is done so far, naming the files.',
    '- decisions: what was decided, and why.',
    '- rejected: approaches tried or weighed and dropped, and why.',
    '- remaining: what is left, the next first.',
    '- blockers: what stops the work, or [] when nothing does.',
    '- nextAction: the very next step, exact enough to start on: a file, a command, a question.',
    'Say a check passed only when it is listed as passed below. Do not call the task finished unless every acceptance point is met and checked.',
    `The task: "${task.title}".`,
    git === null
      ? 'Not a git repository.'
      : `From git now: branch ${git.branch ?? 'none (detached HEAD)'}; last commit ${git.head ?? 'none'}; ${git.uncommitted.length} not committed${git.uncommitted.length === 0 ? '' : `: ${git.uncommitted.join(', ')}`}.`,
    ...(seen == null || seen.commands.length === 0
      ? ['Queue-tea saw no shell commands run during this task.']
      : ['Shell commands Queue-tea saw, latest last:', ...seen.commands.map(ran)]),
    'Under 300 words in all.',
  ].join('\n')
}

const strings = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string' && v.trim() !== '').map(v => v.trim()) : []
const text = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

// Claude's part of a checkpoint, or null when the reply isn't one.
export const parseCheckpoint = (reply: string, written: string): Omit<Checkpoint, 'seen'> | null => {
  const object = firstObject(reply)
  if (object === null) return null
  let parsed: Record<string, unknown>
  try {
    parsed = JSON.parse(object) as Record<string, unknown>
  } catch {
    return null
  }
  const goal = text(parsed.goal)
  const nextAction = text(parsed.nextAction)
  if (goal === '' && nextAction === '') return null

  return {
    written,
    goal,
    acceptance: strings(parsed.acceptance),
    changes: strings(parsed.changes),
    decisions: strings(parsed.decisions),
    rejected: strings(parsed.rejected),
    remaining: strings(parsed.remaining),
    blockers: strings(parsed.blockers),
    nextAction,
  }
}

// The sections of Claude's part, as the card and the first message list them.
export const checkpointSections = (c: Checkpoint): { heading: string; lines: string[] }[] =>
  [
    { heading: 'Goal', lines: c.goal === '' ? [] : [c.goal] },
    { heading: 'Acceptance criteria', lines: c.acceptance },
    { heading: 'Changes made', lines: c.changes },
    { heading: 'Decisions', lines: c.decisions },
    { heading: 'Approaches rejected', lines: c.rejected },
    { heading: 'Remaining', lines: c.remaining },
    { heading: 'Blockers', lines: c.blockers },
    { heading: 'Next action', lines: c.nextAction === '' ? [] : [c.nextAction] },
  ].filter(s => s.lines.length > 0)

const count = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

// The repository now beside what the checkpoint saved, one line each:
// ✓ as saved, ✗ wrong for the task, ! changed since.
export const checkLines = (task: Task, now: GitFacts | null, drift: string[]): string[] => {
  if (now === null) return ['Not a git repository, so there is no branch to check.']
  const saved = task.checkpoint?.seen?.git ?? null
  const lines: string[] = []

  if (task.branch !== null) {
    lines.push(
      now.branch === task.branch
        ? `✓ On ${task.branch}, the task's branch.`
        : `✗ On ${now.branch ?? 'a detached HEAD'}; the task is on ${task.branch}.`,
    )
  }
  if (now.head !== null) {
    lines.push(
      saved?.head == null
        ? `Last commit: ${now.head}.`
        : saved.head === now.head
          ? `✓ Last commit ${now.head}, as saved.`
          : `! Last commit is now ${now.head}; the checkpoint saved ${saved.head}.`,
    )
  }
  const n = now.uncommitted.length
  const listed = n === 0 ? '' : `: ${now.uncommitted.slice(0, 8).join(', ')}${n > 8 ? ` +${n - 8}` : ''}`
  const was = saved === null || saved.uncommitted.length === n ? '' : ` (the checkpoint saved ${saved.uncommitted.length})`
  lines.push(`${count(n, 'file', 'files')} not committed${listed}${was}.`)

  return [...lines, ...drift.map(d => `! ${d}`)]
}

const list = (lines: string[]) => lines.map(l => `- ${l}`)

// The note a task carries on from, for the first message and the Continue
// card alike: the checkpoint Claude wrote, or the plain handoff note when it
// is newer or the only one.
export const latestNote = (task: Task): 'checkpoint' | 'handoff' | null => {
  const written = task.checkpoint?.written ?? null
  if (task.handoff === null) return written === null ? null : 'checkpoint'
  if (written === null) return 'handoff'

  return Date.parse(task.handoff.written) > Date.parse(written) ? 'handoff' : 'checkpoint'
}

// The first message of a task's fresh conversation. A task that has been
// worked on brings its checkpoint, what Queue-tea checked just now, and the
// order to compare before trusting either.
export const firstMessage = (task: Task, checked: string[] | null = null): string => {
  const c = task.checkpoint
  const hasNote = task.handoff !== null || (c !== null && (c.written !== null || c.seen !== null))
  const parts = [`Task: ${task.title}`, ...task.messages]
  if (!hasNote) return parts.join('\n\n')

  const note = latestNote(task)
  if (note === 'checkpoint' && c !== null && c.written !== null) {
    parts.push(
      [
        `Checkpoint from an earlier conversation (${c.written}). It may be out of date or wrong: check it before relying on it.`,
        ...checkpointSections(c).flatMap(s =>
          s.heading === 'Goal' || s.heading === 'Next action' ? [`${s.heading}: ${s.lines[0]}`] : [`${s.heading}:`, ...list(s.lines)],
        ),
      ].join('\n'),
    )
  } else if (note === 'handoff' && task.handoff !== null) {
    parts.push(`Handoff note (${task.handoff.written}):\n${task.handoff.text}`)
  }
  const seen = c?.seen
  if (seen != null && (seen.files.length > 0 || seen.commands.length > 0)) {
    parts.push(
      [
        `Seen by Queue-tea (${seen.at}):`,
        ...(seen.files.length === 0 ? [] : [`Files Claude changed: ${seen.files.join(', ')}`]),
        ...(seen.commands.length === 0 ? [] : ['Shell commands, latest last:', ...seen.commands.map(ran)]),
      ].join('\n'),
    )
  }
  if (checked !== null) parts.push(['Checked by Queue-tea just now:', ...list(checked)].join('\n'))
  parts.push(
    'First compare the checkpoint with the repository and say in one line what differs. A check counts as passed only when Queue-tea saw it pass; rerun the ones the work relies on. Then do the next action.',
  )

  return parts.join('\n\n')
}
