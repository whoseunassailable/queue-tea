import type { PluginState } from 'claude-code'

import type { Allowance, Band, CheckAnswer, Ctx, Difficulty, Intent, Priority, ProjectRecord, Task } from '../types'
import { checkMessage, checkPrompt } from './check'
import type { Ask } from './check'
import { checkLines, checkpointPrompt, emptyCheckpoint, firstMessage, parseCheckpoint } from './checkpoint'
import { writeDocsLog } from './docslog'
import {
  commitsBetween,
  diffSince,
  holdReason,
  listBranches,
  makeBranch,
  readDrift,
  readFacts,
  readGit,
  readHead,
  slugBranch,
  switchBranch,
} from './git'
import type { Host } from './host'
import { blockedText, isBlocked, wouldLoop } from './plan'
import { currentTask, newTask, orderQueue, removeTask } from './queue'
import { readRecord, updateRecord } from './record'
import { dayKey, isoLocal } from './time'
import { shouldFresh, shouldHandoff, windowKey } from './usage'

export { firstMessage } from './checkpoint'

export type View = PluginState['queue-tea']

// What the flow needs from the engine. register.tsx builds them from `$`.
export type Ports = {
  host: Host
  ask: Ask
  clear: () => Promise<void>
  submit: (text: string, asUser?: boolean) => Promise<void>
  toast: (text: string) => void
  status: (text: string | undefined) => void
  now: () => Promise<number>
  later: (work: () => Promise<void>) => void
  newId: () => string
  get: <K extends keyof View>(key: K) => Promise<View[K]>
  set: <K extends keyof View>(key: K, value: View[K]) => Promise<void>
  log: (text: string) => void
}

const NOT_A_REPO = 'Not a git repository, so no branches are made'
const DOCS_LOG = 'docs/task_log.md'

const nowIso = async (p: Ports, ctx: Ctx) => isoLocal(await p.now(), ctx.offsetMinutes)

// One run at a time per key: a second press while the first runs does nothing.
const running = new Set<string>()
const once = async <T>(key: string, work: () => Promise<T>, otherwise: T): Promise<T> => {
  if (running.has(key)) return otherwise
  running.add(key)
  try {
    return await work()
  } finally {
    running.delete(key)
  }
}

// A band goes up, or waits behind the one showing; never replaces it.
export const showBand = async (p: Ports, band: Band): Promise<void> => {
  if ((await p.get('band')).kind === 'none') await p.set('band', band)
  else await p.set('bandQueue', [...(await p.get('bandQueue')), band])
}

// Takes the band down and puts up the next one waiting.
export const closeBand = async (p: Ports): Promise<void> => {
  const [next, ...rest] = await p.get('bandQueue')
  await p.set('bandQueue', rest)
  await p.set('band', next ?? { kind: 'none' })
}

// A fresh conversation is on its way: no other is started until it is.
let isFreshPending = false
const scheduleFresh = (p: Ports, ctx: Ctx, task: Task) => {
  isFreshPending = true
  p.later(() => freshConversation(p, ctx, task))
}

// True while Queue-tea is starting a conversation of its own, so the clear it
// makes is not taken for one to recover from.
export const isStartingFresh = () => isFreshPending

// Changes the record; on an unreadable one says so in the panel and changes
// nothing. Returns the record as saved, or null.
const change = async (p: Ports, ctx: Ctx, fn: (r: ProjectRecord) => ProjectRecord) => {
  const saved = await updateRecord(p.host, ctx.file, fn, ctx.projectName, ctx.projectPath)
  if (saved === 'unreadable') {
    await p.set('load', 'failed')

    return null
  }
  await p.set('record', saved)

  return saved
}

const changeTask = (p: Ports, ctx: Ctx, id: string, fn: (t: Task) => Task) =>
  change(p, ctx, r => ({ ...r, tasks: r.tasks.map(t => (t.id === id ? fn(t) : t)) }))

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

export const taskSection = (record: ProjectRecord | null) => {
  const current = record === null ? null : currentTask(record.tasks)
  if (current === null) return null

  return {
    id: 'queue-tea:task',
    scope: 'session' as const,
    text: `The current Queue-tea task is "${current.title}". When a reply of yours has finished what it asked, call task_looks_done. Never commit or push: Rohan does.`,
  }
}

// Decides what happens to a typed message: through to Claude, or held for the
// band. The intent is for the effort count.
export const onMessage = async (
  p: Ports,
  ctx: Ctx,
  text: string,
): Promise<{ verdict: 'pass' | 'drop'; intent: Intent | null; kind: CheckAnswer['kind'] | null }> => {
  const record = await p.get('record')
  if (record === null) return { verdict: 'pass', intent: null, kind: null }

  await p.set('isChecking', true)
  let answer: CheckAnswer | null
  try {
    const prompt = checkPrompt(currentTask(record.tasks), orderQueue(record.tasks), text)
    answer = await checkMessage(p.ask, prompt, ctx.options.checkTimeoutSeconds * 1000)
  } finally {
    await p.set('isChecking', false)
  }

  if (answer?.kind === 'same' || answer?.kind === 'quick') {
    return { verdict: 'pass', intent: answer.intent, kind: answer.kind }
  }
  if (answer?.kind === 'new') {
    await showBand(p, {
      kind: 'file',
      text,
      title: answer.title ?? text.slice(0, 60),
      priority: 'mid',
      difficulty: answer.difficulty ?? 'medium',
      intent: answer.intent,
    })

    return { verdict: 'drop', intent: answer.intent, kind: 'new' }
  }

  const intent = answer?.intent ?? 'improving'
  await showBand(p, { kind: 'unsure', text, intent, didCheckRun: answer !== null })

  return { verdict: 'drop', intent: answer === null ? null : intent, kind: answer === null ? null : 'unsure' }
}

// What the repository says now, beside the task's checkpoint; null for a
// task with nothing saved yet, or when git can't be read.
export const checkNow = async (p: Ports, ctx: Ctx, task: Task): Promise<string[] | null> => {
  if (task.handoff === null && task.checkpoint === null) return null
  try {
    const now = await readFacts(p.host, ctx.projectPath)
    const drift = now === null ? [] : await readDrift(p.host, ctx.projectPath, task)

    return checkLines(task, now, drift)
  } catch (err) {
    p.log(`checking the repository failed: ${err instanceof Error ? err.message : String(err)}`)

    return null
  }
}

export const freshConversation = async (p: Ports, ctx: Ctx, task: Task): Promise<void> => {
  try {
    const checked = await checkNow(p, ctx, task)
    await p.clear()
    await p.submit(firstMessage(task, checked))
  } finally {
    isFreshPending = false
  }
}

// The git check, the branch, then a fresh conversation for the task.
export const startTask = (p: Ports, ctx: Ctx, taskId: string): Promise<'started' | 'held' | 'failed'> =>
  once(`start:${taskId}`, () => startOnce(p, ctx, taskId), 'failed')

const startOnce = async (p: Ports, ctx: Ctx, taskId: string): Promise<'started' | 'held' | 'failed'> => {
  const record = await readRecord(p.host, ctx.file, ctx.projectName, ctx.projectPath)
  if (record === 'unreadable') {
    await p.set('load', 'failed')

    return 'failed'
  }
  const task = record.tasks.find(t => t.id === taskId)
  if (task === undefined || task.state !== 'queued' || currentTask(record.tasks) !== null) {
    const hold = await p.get('hold')
    if (hold?.taskId === taskId) await p.set('hold', null)

    return 'failed'
  }
  if (isBlocked(task, record.tasks)) {
    await p.set('notice', `${task.title} is blocked: ${blockedText(task, record.tasks)}. Unblock it first.`)

    return 'failed'
  }

  const git = await readGit(p.host, ctx.projectPath)
  const reason = holdReason(git)
  if (reason !== null) {
    await p.set('hold', { taskId, text: reason })

    return 'held'
  }

  let branch: string | null = null
  let isResumed = false
  if (git.isRepo) {
    const branches = await listBranches(p.host, ctx.projectPath)
    // A task put back in the queue goes on on its own branch; one whose
    // branch is gone starts again on a new one from here.
    isResumed = task.branch !== null && branches.includes(task.branch)
    const name = isResumed ? task.branch! : slugBranch(task.title, branches)
    if (task.branch !== null && !isResumed) {
      await p.set('notice', `${task.branch} was gone, so this task starts again on ${name}, made from ${git.branch}.`)
    }
    try {
      if (isResumed && git.branch !== name) await switchBranch(p.host, ctx.projectPath, name)
      else if (!isResumed) await makeBranch(p.host, ctx.projectPath, name)
      branch = name
    } catch (err) {
      p.log(`${isResumed ? 'switching to' : 'making'} ${name} failed: ${err instanceof Error ? err.message : String(err)}`)
      await p.set('hold', {
        taskId,
        text: `Couldn't ${isResumed ? 'switch to' : 'make'} the branch ${name}. Check again to retry.`,
      })

      return 'held'
    }
  } else {
    await p.set('notice', NOT_A_REPO)
  }

  // The commit in full, so a rebase or a reset of the branch can be told.
  const head = git.isRepo && !isResumed ? ((await readHead(p.host, ctx.projectPath))?.commit ?? git.head) : null
  const started = await nowIso(p, ctx)
  const saved = await change(p, ctx, r => ({
    ...r,
    playNext: r.playNext === taskId ? null : r.playNext,
    tasks: r.tasks.map(t =>
      t.id !== taskId
        ? t
        : {
            ...t,
            state: 'current',
            started: t.started ?? started,
            branch,
            baseBranch: isResumed ? t.baseBranch : git.isRepo ? git.branch : null,
            startCommit: isResumed ? t.startCommit : head,
          },
    ),
  }))
  if (saved === null) return 'failed'

  await p.set('hold', null)
  await p.set('isChoosingNext', false)
  await p.set('openRow', null)
  await p.set('drift', [])
  scheduleFresh(p, ctx, saved.tasks.find(t => t.id === taskId)!)

  return 'started'
}

const filing = new Set<string>()

// Saves a held message as a task. Two presses of Save file it once.
export const fileTask = async (
  p: Ports,
  ctx: Ctx,
  input: { text: string; title: string; priority: Priority; difficulty: Difficulty; intent: Intent },
): Promise<void> => {
  if (filing.has(input.text)) return
  filing.add(input.text)
  try {
    const task = newTask({
      title: input.title,
      priority: input.priority,
      difficulty: input.difficulty,
      messages: [input.text],
      now: await nowIso(p, ctx),
      id: p.newId(),
    })
    let saved: ProjectRecord | null
    try {
      saved = await change(p, ctx, r => ({ ...r, tasks: [...r.tasks, task] }))
    } catch (err) {
      p.log(`saving the task failed: ${err instanceof Error ? err.message : String(err)}`)
      await p.set('notice', "Couldn't save the task. Try Save again.")

      return
    }
    if (saved === null) return

    await closeBand(p)
    p.toast(`Queued: ${task.title} (${task.priority})`)
    if (currentTask(saved.tasks) === null) await startTask(p, ctx, task.id)
  } finally {
    filing.delete(input.text)
  }
}

// The done question, with what Claude says it checked when it says.
export const taskLooksDone = async (p: Ports, checked?: unknown): Promise<void> => {
  const line = typeof checked === 'string' ? checked.trim().slice(0, 300) : ''
  await p.set('checked', line === '' ? null : line)
  await p.set('isAskingDone', true)
}

const totalMinutes = (t: Task) => Object.values(t.minutesByDay).reduce((a, b) => a + b, 0)

const writeRow = async (p: Ports, ctx: Ctx, record: ProjectRecord, taskId: string, logPath: string) => {
  const task = record.tasks.find(t => t.id === taskId)
  if (task === undefined || task.finished === null) return
  const row = {
    title: task.title,
    priority: task.priority,
    expected: task.difficulty.expected,
    actual: task.difficulty.actual ?? task.difficulty.expected,
    minutes: totalMinutes(task),
    branch: task.branch,
  }
  try {
    await writeDocsLog(p.host, ctx.projectPath, logPath, row, dayKey(Date.parse(task.finished), ctx.offsetMinutes))
  } catch (err) {
    p.log(`writing the docs log failed: ${err instanceof Error ? err.message : String(err)}`)
    await p.set('notice', `Couldn't write the task log at ${logPath}`)
  }
}

// Marks the task done with its change size, then logs it, asking for the
// docs log's path the first time.
export const finishTask = (p: Ports, ctx: Ctx, taskId: string, actual: Difficulty): Promise<void> =>
  once(`finish:${taskId}`, () => finishOnce(p, ctx, taskId, actual), undefined)

const finishOnce = async (p: Ports, ctx: Ctx, taskId: string, actual: Difficulty): Promise<void> => {
  const record = await readRecord(p.host, ctx.file, ctx.projectName, ctx.projectPath)
  if (record === 'unreadable') {
    await p.set('load', 'failed')

    return
  }
  const before = record.tasks.find(t => t.id === taskId) ?? null
  if (before === null || before.state === 'done') return
  let diff = { linesAdded: 0, linesRemoved: 0, filesTouched: 0 }
  if (before?.startCommit) {
    try {
      diff = await diffSince(p.host, ctx.projectPath, before.startCommit)
    } catch (err) {
      p.log(`measuring the change failed: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  const finished = await nowIso(p, ctx)
  const saved = await changeTask(p, ctx, taskId, t => ({
    ...t,
    state: 'done',
    finished,
    difficulty: { ...t.difficulty, actual },
    effort: { ...t.effort, ...diff },
  }))
  if (saved === null) return

  await p.set('isAskingDone', false)
  await p.set('checked', null)
  if (saved.docsLogPath === null) {
    await showBand(p, { kind: 'docsPath', taskId, suggested: DOCS_LOG })

    return
  }
  await writeRow(p, ctx, saved, taskId, saved.docsLogPath)
  await p.set('isChoosingNext', true)
}

export const finishDocs = (p: Ports, ctx: Ctx, taskId: string, path: string): Promise<void> =>
  once(`docs:${taskId}`, () => docsOnce(p, ctx, taskId, path), undefined)

const docsOnce = async (p: Ports, ctx: Ctx, taskId: string, path: string): Promise<void> => {
  const band = await p.get('band')
  if (band.kind !== 'docsPath' || band.taskId !== taskId) return
  const saved = await change(p, ctx, r => ({ ...r, docsLogPath: path }))
  if (saved === null) return

  await closeBand(p)
  await writeRow(p, ctx, saved, taskId, path)
  await p.set('isChoosingNext', true)
}

export const continueTask = async (p: Ports, ctx: Ctx): Promise<void> => {
  const record = await p.get('record')
  const current = record === null ? null : currentTask(record.tasks)
  if (current !== null && !isFreshPending) scheduleFresh(p, ctx, current)
}

// Switches to the current task's branch, unless something is uncommitted.
export const switchToTask = async (p: Ports, ctx: Ctx): Promise<'switched' | string> => {
  const record = await p.get('record')
  const current = record === null ? null : currentTask(record.tasks)
  if (current?.branch == null) return 'switched'

  const git = await readGit(p.host, ctx.projectPath)
  if (git.uncommitted > 0) return holdReason({ ...git, unpushed: 0, hasUpstream: true }) ?? 'switched'
  await switchBranch(p.host, ctx.projectPath, current.branch)
  await p.set('notice', null)

  return 'switched'
}

const HANDOFF_FAILED = "Queue-tea: couldn't write the checkpoint; trying again after the next reply"

const factsNow = async (p: Ports, ctx: Ctx) => {
  try {
    return await readFacts(p.host, ctx.projectPath)
  } catch (err) {
    p.log(`reading git for the checkpoint failed: ${err instanceof Error ? err.message : String(err)}`)

    return null
  }
}

// Asks Claude for the task's checkpoint over the conversation and saves it
// with what git says now. A reply that isn't one is kept as a plain note.
export const writeHandoff = async (p: Ports, ctx: Ctx, taskId: string): Promise<Task | null> => {
  const record = await p.get('record')
  const task = record?.tasks.find(t => t.id === taskId)
  if (task === undefined) return null
  const git = await factsNow(p, ctx)
  const reply = await p.ask.fork(checkpointPrompt(task, git))
  if (!reply.isAnswered || reply.text.trim() === '') {
    p.log(`checkpoint not written: ${reply.isAnswered ? 'empty' : reply.reason}`)
    p.status(HANDOFF_FAILED)

    return null
  }
  const written = await nowIso(p, ctx)
  const parsed = parseCheckpoint(reply.text, written)
  const saved = await changeTask(p, ctx, taskId, t => {
    if (parsed === null) return { ...t, handoff: { text: reply.text.trim(), written } }
    const before = (t.checkpoint ?? emptyCheckpoint()).seen
    const seen = before === null ? { at: written, files: [], commands: [], git } : { ...before, git: git ?? before.git }

    return { ...t, handoff: null, checkpoint: { ...parsed, seen } }
  })

  return saved?.tasks.find(t => t.id === taskId) ?? null
}

// After each turn: a fresh conversation past the size, and a handoff note
// once per reset window at the allowance mark. Returns the reset time a note
// was last written for.
export const afterTurn = async (
  p: Ports,
  ctx: Ctx,
  reading: { tokens?: number; allowance: Allowance | null },
  handedOffFor: string | null,
): Promise<string | null> => {
  const record = await p.get('record')
  const current = record === null ? null : currentTask(record.tasks)
  if (current === null || isFreshPending) return handedOffFor

  if (shouldFresh(reading.tokens, ctx.options.freshAtTokens)) {
    isFreshPending = true
    const task = await writeHandoff(p, ctx, current.id)
    if (task === null) isFreshPending = false
    else scheduleFresh(p, ctx, task)

    return handedOffFor
  }

  const a = reading.allowance
  if (a !== null && shouldHandoff(a.percent, ctx.options.handoffAtPercent, handedOffFor, a.resetsAt)) {
    const task = await writeHandoff(p, ctx, current.id)

    return task === null ? handedOffFor : windowKey(a.resetsAt)
  }

  return handedOffFor
}

// Sends a held message on to Claude after all, as Rohan's own, and puts up the
// next band. Returns the message's intent for the effort count.
export const sendHeld = async (p: Ports): Promise<Intent | null> => {
  const band = await p.get('band')
  if (band.kind !== 'file' && band.kind !== 'unsure') return null
  await closeBand(p)
  await p.submit(band.text, true)

  return band.intent
}

// Drops a held message: Claude never sees it and nothing is filed. Puts up
// the next band, and returns the message so it can go back in the prompt box.
export const dropHeld = async (p: Ports): Promise<string | null> => {
  const band = await p.get('band')
  if (band.kind !== 'file' && band.kind !== 'unsure') return null
  await closeBand(p)

  return band.text
}

export type Block = { waitFor: string } | { reason: string }

// Puts the current task back in the backlog with a checkpoint, keeping its
// branch, start commit and time, so Start later goes on where it stopped.
// With `block`, it goes back blocked.
export const putBack = (p: Ports, ctx: Ctx, block?: Block): Promise<'queued' | 'none'> =>
  once('put-back', () => putBackOnce(p, ctx, block), 'none')

const withBlock = (t: Task, block: Block | undefined): Task =>
  block === undefined
    ? t
    : 'waitFor' in block
      ? { ...t, blockedBy: t.blockedBy.includes(block.waitFor) ? t.blockedBy : [...t.blockedBy, block.waitFor] }
      : { ...t, blockedReason: block.reason }

const putBackOnce = async (p: Ports, ctx: Ctx, block: Block | undefined): Promise<'queued' | 'none'> => {
  const record = await p.get('record')
  const current = record === null ? null : currentTask(record.tasks)
  if (current === null || isFreshPending) return 'none'

  await p.set('busy', 'Saving a checkpoint…')
  let isNoted: boolean
  try {
    isNoted = (await writeHandoff(p, ctx, current.id)) !== null
  } catch (err) {
    p.log(`the handoff note failed: ${err instanceof Error ? err.message : String(err)}`)
    isNoted = false
  } finally {
    await p.set('busy', null)
  }
  const saved = await changeTask(p, ctx, current.id, t => (t.state === 'current' ? withBlock({ ...t, state: 'queued' }, block) : t))
  if (saved === null) return 'none'

  await p.set('isAskingDone', false)
  await p.set('checked', null)
  await p.set('canContinue', false)
  await p.set('mismatch', null)
  await p.set('isChoosingNext', true)
  await p.set('drift', [])
  if (!isNoted) await p.set('notice', "Couldn't save a checkpoint, so Start will begin from what was saved before.")
  p.toast(block === undefined ? `Back in the backlog: ${current.title}` : `Blocked: ${current.title}`)

  return 'queued'
}

// After a turn: names the commits that appeared since `before`, the commit
// and branch the turn started on. A change of branch is no commit.
export const commitWarning = async (
  p: Ports,
  ctx: Ctx,
  before: { commit: string; branch: string | null } | null,
): Promise<string | null> => {
  if (before === null) return null
  const after = await readHead(p.host, ctx.projectPath)
  if (after === null || after.commit === before.commit || after.branch !== before.branch) return null
  let commits: string[]
  try {
    commits = await commitsBetween(p.host, ctx.projectPath, before.commit, after.commit)
  } catch {
    // Not a descendant (a reset, a rebase): no new commit to name.
    return null
  }
  if (commits.length === 0) return null

  const named = commits.length === 1 ? `a commit appeared: ${commits[0]}` : `${commits.length} commits appeared, newest ${commits[0]}`
  const text = `During the last turn ${named}. Queue-tea stops Claude's commits, so check it was yours.`
  await p.set('warning', text)
  p.toast(`Queue-tea: ${named}`)

  return text
}

// Removes a queued task, and the git check's hold on it.
export const removeQueued = async (p: Ports, ctx: Ctx, taskId: string): Promise<void> => {
  const saved = await change(p, ctx, r => ({ ...r, tasks: removeTask(r.tasks, taskId) }))
  if (saved === null) return
  const hold = await p.get('hold')
  if (hold?.taskId === taskId) await p.set('hold', null)
  await p.set('openRow', null)
}

// Sets a queued task to wait for another, or to be blocked for a reason; on
// the current task it puts the task back, blocked. A wait that would loop is
// refused.
export const blockTask = async (p: Ports, ctx: Ctx, taskId: string, block: Block): Promise<void> => {
  const record = await p.get('record')
  const task = record?.tasks.find(t => t.id === taskId)
  await p.set('blocking', null)
  if (record === null || task === undefined) return
  if ('waitFor' in block && wouldLoop(record.tasks, taskId, block.waitFor)) {
    await p.set('notice', 'That would make the two tasks wait for each other.')

    return
  }
  if (task.state === 'current') {
    await putBack(p, ctx, block)

    return
  }
  await change(p, ctx, r => ({
    ...r,
    playNext: r.playNext === taskId ? null : r.playNext,
    tasks: r.tasks.map(t => (t.id === taskId && t.state === 'queued' ? withBlock(t, block) : t)),
  }))
  await p.set('openRow', null)
}

// Clears what blocks a task: its waits and its reason.
export const unblockTask = async (p: Ports, ctx: Ctx, taskId: string): Promise<void> => {
  await change(p, ctx, r => ({
    ...r,
    tasks: r.tasks.map(t => (t.id === taskId ? { ...t, blockedBy: [], blockedReason: null } : t)),
  }))
  await p.set('openRow', null)
}

// Marks a queued task to be suggested before every other, or takes the mark
// off it.
export const togglePlayNext = async (p: Ports, ctx: Ctx, taskId: string): Promise<void> => {
  await change(p, ctx, r => ({ ...r, playNext: r.playNext === taskId ? null : taskId }))
  await p.set('openRow', null)
}

// What has moved under the current task, for the panel.
export const refreshDrift = async (p: Ports, ctx: Ctx): Promise<void> => {
  const record = await p.get('record')
  const current = record === null ? null : currentTask(record.tasks)
  if (current === null) {
    await p.set('drift', [])

    return
  }
  try {
    await p.set('drift', await readDrift(p.host, ctx.projectPath, current))
  } catch (err) {
    p.log(`reading the drift failed: ${err instanceof Error ? err.message : String(err)}`)
  }
}

// The current task's lines so far, for the panel: what finishing it would
// measure now. Marked with the task, so another task's count never shows.
export const refreshLines = async (p: Ports, ctx: Ctx): Promise<void> => {
  const record = await p.get('record')
  const current = record === null ? null : currentTask(record.tasks)
  if (current === null || current.startCommit === null) {
    await p.set('lines', null)

    return
  }
  try {
    const diff = await diffSince(p.host, ctx.projectPath, current.startCommit)
    await p.set('lines', { taskId: current.id, added: diff.linesAdded, removed: diff.linesRemoved })
  } catch (err) {
    p.log(`measuring the change failed: ${err instanceof Error ? err.message : String(err)}`)
  }
}
