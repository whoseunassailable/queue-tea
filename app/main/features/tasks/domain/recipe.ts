import type { CommandRun, HelperId, Task, TaskStep } from '../../../../../types'
import { handoffSections } from '../../../../../hooks/shared/checkpoints/domain/services/card_note'
import type { Recipe, RecipeAttention, RecipeCheck, RecipeMark, RecipeNote, RecipeStage, RecipeStageId, RecipeStep } from '../../../../shared/engine_api'

// A quest's recipe, worked out from what its record already holds: the stages
// from what Queue-tea saw happen, the steps and notes from the checkpoint or
// handoff note Claude wrote. Nothing new is stored, so every record, old ones
// included, has a recipe as soon as it has been started.

const DESIGNER: HelperId = 'mocha-mockup'

// The stages in order. Design is there only when Mocha Mockup is on the quest,
// so a recipe has five or six.
const stagesFor = (task: Task): RecipeStageId[] => {
  const hasDesign = task.helpers.on.includes(DESIGNER) || task.helpers.ran.includes(DESIGNER)

  return hasDesign ? ['setOut', 'understand', 'design', 'build', 'verify', 'review'] : ['setOut', 'understand', 'build', 'verify', 'review']
}

const testsSeen = (task: Task): CommandRun[] => (task.checkpoint?.seen?.commands ?? []).filter(command => command.isTest)

// The furthest stage the record shows the quest has reached.
const reachedOf = (task: Task, stages: readonly RecipeStageId[]): RecipeStageId => {
  const { effort, helpers, checkpoint, step } = task
  const kind = step?.kind
  const hasChecks = (task.testPeriods?.length ?? 0) > 0 || (task.minutesInChecks ?? 0) > 0 || kind === 'test' || testsSeen(task).length > 0
  const hasChanges = effort.filesChanged > 0 || kind === 'edit' || kind === 'write' || (checkpoint?.changes.length ?? 0) > 0
  const hasDesign = stages.includes('design') && helpers.ran.includes(DESIGNER)
  const hasLooked = effort.filesRead > 0 || effort.understandingMessages > 0 || kind === 'read'
  if (task.review !== null) return 'review'
  if (hasChecks) return 'verify'
  if (hasChanges) return 'build'
  if (hasDesign) return 'design'

  return hasLooked ? 'understand' : 'setOut'
}

// What the latest step says the quest is doing, when it says anything. A check
// is verifying and an edit is building, even after the checks have run, so
// fixing what a check found shows as building again. Reads, other commands and
// branch steps say nothing new: the quest stays where it had reached.
const stepStage = (step: TaskStep | undefined): RecipeStageId | null => {
  if (step === undefined) return null
  if (step.kind === 'test') return 'verify'

  return step.kind === 'edit' || step.kind === 'write' ? 'build' : null
}

export const currentStage = (task: Task, stages: readonly RecipeStageId[]): RecipeStageId => {
  const reached = reachedOf(task, stages)
  if (reached === 'review' || task.state !== 'current') return reached

  return stepStage(task.step) ?? reached
}

const marked = (stages: readonly RecipeStageId[], current: RecipeStageId | null): RecipeStage[] => {
  const at = current === null ? stages.length : stages.indexOf(current)

  return stages.map((id, i) => ({ id, mark: i < at ? 'done' : i === at ? 'now' : 'next' }))
}

// A list line without its bullet or checkbox, and whether the box was ticked.
const MARKER = /^\s*(?:[-*•]\s+)?(?:\[( |x|X)\]\s+)?/
const cleanLine = (line: string): { text: string; isTicked: boolean } => {
  const box = line.match(MARKER)?.[1]

  return { text: line.replace(MARKER, '').trim(), isTicked: box === 'x' || box === 'X' }
}

// Handoff headings that hold what was done, what is left, and what needs Rohan.
const DONE_HEADING = /chang|done|did|complet|progress/i
const LEFT_HEADING = /next|remain|left|to ?do|outstanding/i
const ASK_HEADING = /block|question|need(s)? (you|rohan|input|a decision)|decide|ask/i

type FromNote = { goal: string | null; steps: RecipeStep[]; doneWhen: string[]; attention: RecipeAttention[]; notes: RecipeNote[]; written: Recipe['written'] }

const NO_NOTE: FromNote = { goal: null, steps: [], doneWhen: [], attention: [], notes: [], written: null }

const fromCheckpoint = (task: Task): FromNote => {
  const c = task.checkpoint
  if (c === null || c.written === null) return NO_NOTE
  const next = c.nextAction === '' ? [] : [c.nextAction]
  const remaining = c.remaining.filter(line => line !== c.nextAction)
  const steps: RecipeStep[] = [
    ...c.changes.map(text => ({ text, mark: 'done' as const })),
    ...next.map(text => ({ text, mark: 'now' as const })),
    ...remaining.map(text => ({ text, mark: 'next' as const })),
  ]
  const notes: RecipeNote[] = [
    { kind: 'decisions' as const, heading: null, lines: c.decisions },
    { kind: 'rejected' as const, heading: null, lines: c.rejected },
  ].filter(note => note.lines.length > 0)

  return {
    goal: c.goal === '' ? null : c.goal,
    steps,
    doneWhen: c.acceptance,
    attention: c.blockers.map(text => ({ kind: 'blocker' as const, text })),
    notes,
    written: { kind: 'checkpoint', at: c.written },
  }
}

const fromHandoff = (task: Task): FromNote => {
  if (task.handoff === null) return NO_NOTE
  const { text, written } = task.handoff
  const sections = handoffSections(text)
  if (sections === null) return { ...NO_NOTE, notes: [{ kind: 'note', heading: null, lines: [text.trim()] }], written: { kind: 'handoff', at: written } }

  const steps: RecipeStep[] = []
  const attention: RecipeAttention[] = []
  for (const section of sections) {
    const lines = section.lines.map(cleanLine).filter(line => line.text !== '')
    if (ASK_HEADING.test(section.heading)) attention.push(...lines.map(line => ({ kind: 'question' as const, text: line.text })))
    else if (DONE_HEADING.test(section.heading)) steps.push(...lines.map(line => ({ text: line.text, mark: 'done' as const })))
    else if (LEFT_HEADING.test(section.heading)) steps.push(...lines.map(line => ({ text: line.text, mark: line.isTicked ? ('done' as const) : ('next' as const) })))
  }
  // Every section stays readable in full, in the technical depth.
  const notes = sections.map(section => ({ kind: 'section' as const, heading: section.heading, lines: section.lines.map(line => cleanLine(line).text).filter(Boolean) }))

  return { ...NO_NOTE, steps, attention, notes, written: { kind: 'handoff', at: written } }
}

// The note the quest carries on from: the newer of the two, as Continue uses.
const fromNote = (task: Task): FromNote => {
  const checkpointAt = task.checkpoint?.written ?? null
  if (task.handoff === null) return fromCheckpoint(task)
  if (checkpointAt === null) return fromHandoff(task)

  return Date.parse(task.handoff.written) > Date.parse(checkpointAt) ? fromHandoff(task) : fromCheckpoint(task)
}

// Each check once, at its latest run, in the order they last ran.
export const latestChecks = (commands: readonly CommandRun[]): RecipeCheck[] => {
  const latest = new Map<string, CommandRun>()
  for (const run of commands) {
    latest.delete(run.command)
    latest.set(run.command, run)
  }

  return [...latest.values()].map(({ command, isOk, at, summary }) => ({ command, isOk, at, summary }))
}

const phaseOf = (task: Task): Recipe['phase'] => (task.state === 'current' ? 'active' : task.state === 'done' ? 'complete' : 'paused')

const hasNote = (task: Task) => task.handoff !== null || (task.checkpoint?.written ?? null) !== null

// The recipe for a quest's detail pane; null for one never started and with no
// note to carry on from, and for one that was removed. `latest` is the newest
// step seen anywhere, Codex's included, when it is newer than the record's.
export const recipeOf = (record: Task, latest: TaskStep | null = null): Recipe | null => {
  const task = latest === null ? record : { ...record, step: latest }
  if (task.state === 'removed') return null
  if (task.state === 'queued' && task.started === null && !hasNote(task)) return null

  const stages = stagesFor(task)
  const phase = phaseOf(task)
  const note = fromNote(task)
  const files = task.checkpoint?.seen?.files ?? []
  const attention: RecipeAttention[] = [...(task.review !== null && phase === 'active' ? [{ kind: 'looksDone' as const, text: null }] : []), ...note.attention]
  const notes: RecipeNote[] = [...note.notes, ...(files.length === 0 ? [] : [{ kind: 'files' as const, heading: null, lines: files }])]

  return {
    phase,
    stages: marked(stages, phase === 'complete' ? null : currentStage(task, stages)),
    goal: note.goal,
    steps: phase === 'complete' ? note.steps.map(step => ({ ...step, mark: 'done' as RecipeMark })) : note.steps,
    doneWhen: note.doneWhen,
    attention: phase === 'complete' ? [] : attention,
    profile: task.testProfile ?? null,
    checks: latestChecks(testsSeen(task)),
    notes,
    written: note.written,
  }
}
