import { change, changeTask, markUnreadable } from './shared/records/presentation/state_management/records_controller'
import { isStartingFresh, scheduleFresh, writeHandoff } from './shared/assistant/presentation/state_management/conversation_controller'
import type { Ports } from './core/ports/ports'
import { closeBand, showBand } from './core/store/band_queue'

import type { Difficulty, Intent, ParentPick, Priority, ProjectRecord, Task } from '../types'
import type { Ctx } from './core/env/env'
import { firstMessage } from './shared/checkpoints/domain/services/checkpoints'
import { writeDocsLog } from './docslog'
import { activeFeature, parentOf, parentRefusal, setParent } from './shared/backlog/domain/services/families'
import { diffSince, listBranches, makeBranch, readDrift, readGit, readHead, switchBranch } from './shared/git/data/datasources/git_source'
import { holdReason, slugBranch } from './shared/git/domain/services/branch_rules'
import { blockedText, isBlocked, wouldLoop } from './shared/backlog/domain/services/ranking'
import { currentTask, newTask, removeTask } from './shared/records/domain/services/queue_rules'
import { readRecord } from './shared/records/data/datasources/record_source'
import { dayKey, isoLocal } from './shared/time/domain/services/time'

import { once } from './core/session/once'
export { firstMessage } from './shared/checkpoints/domain/services/checkpoints'

const NOT_A_REPO = 'Not a git repository, so no branches are made'
const DOCS_LOG = 'docs/task_log.md'

const nowIso = async (p: Ports, ctx: Ctx) => isoLocal(await p.now(), ctx.offsetMinutes)

export const taskSection = (record: ProjectRecord | null) => {
  const current = record === null ? null : currentTask(record.tasks)
  if (current === null) return null

  return {
    id: 'queue-tea:task',
    scope: 'session' as const,
    text: `The current Queue-tea task is "${current.title}". When a reply of yours has finished what it asked, call task_looks_done. Never commit or push: Rohan does.`,
  }
}

// The git check, the branch, then a fresh conversation for the task.
export const startTask = (p: Ports, ctx: Ctx, taskId: string): Promise<'started' | 'held' | 'failed'> =>
  once(`start:${taskId}`, () => startOnce(p, ctx, taskId), 'failed')

const startOnce = async (p: Ports, ctx: Ctx, taskId: string): Promise<'started' | 'held' | 'failed'> => {
  const record = await readRecord(p.host, ctx.file, ctx.projectName, ctx.projectPath)
  if (record === 'unreadable') {
    await markUnreadable(p, ctx)

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

  // A task put back in the queue goes on on its own branch; one whose branch
  // is gone starts again on a new one from here.
  let branch: string | null = null
  let isResumed = false
  if (git.isRepo) {
    const branches = await listBranches(p.host, ctx.projectPath)
    isResumed = task.branch !== null && branches.includes(task.branch)
    branch = isResumed ? task.branch! : slugBranch(task.title, branches)
  }
  // The commit in full, so a rebase or a reset of the branch can be told.
  const head = git.isRepo && !isResumed ? ((await readHead(p.host, ctx.projectPath))?.commit ?? git.head) : null
  const started = await nowIso(p, ctx)

  // The task is claimed before git is touched, against the record as it is
  // now: another session may have started a task since it was read.
  let refused = null as string | null
  let before = task
  const saved = await change(p, ctx, r => {
    const fresh = r.tasks.find(t => t.id === taskId)
    const other = currentTask(r.tasks)
    refused =
      fresh === undefined || (fresh.state !== 'queued' && fresh.state !== 'current')
        ? `${task.title} is no longer in the backlog.`
        : other !== null
          ? other.id === taskId
            ? `${task.title} was started already, maybe in another session.`
            : `${other.title} was started first, maybe in another session, so ${task.title} waits in the backlog.`
          : isBlocked(fresh, r.tasks)
            ? `${task.title} is blocked: ${blockedText(fresh, r.tasks)}. Unblock it first.`
            : null
    if (refused !== null || fresh === undefined) return r
    before = fresh

    return {
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
    }
  })
  if (saved === null) return 'failed'
  if (refused !== null) {
    const hold = await p.get('hold')
    if (hold?.taskId === taskId) await p.set('hold', null)
    await p.set('notice', refused)

    return 'failed'
  }

  if (branch !== null) {
    if (task.branch !== null && !isResumed) {
      await p.set('notice', `${task.branch} was gone, so this task starts again on ${branch}, made from ${git.branch}.`)
    }
    try {
      if (isResumed && git.branch !== branch) await switchBranch(p.host, ctx.projectPath, branch)
      else if (!isResumed) await makeBranch(p.host, ctx.projectPath, branch)
    } catch (err) {
      p.log(`${isResumed ? 'switching to' : 'making'} ${branch} failed: ${err instanceof Error ? err.message : String(err)}`)
      // The claim is taken back, so the task waits as it was.
      const wasNext = record.playNext === taskId
      await change(p, ctx, r => ({
        ...r,
        playNext: wasNext && r.playNext === null ? taskId : r.playNext,
        tasks: r.tasks.map(t =>
          t.id === taskId && t.state === 'current'
            ? {
                ...t,
                state: 'queued',
                started: before.started,
                branch: before.branch,
                baseBranch: before.baseBranch,
                startCommit: before.startCommit,
              }
            : t,
        ),
      }))
      await p.set('hold', {
        taskId,
        text: `Couldn't ${isResumed ? 'switch to' : 'make'} the branch ${branch}. Check again to retry.`,
      })

      return 'held'
    }
  } else {
    await p.set('notice', NOT_A_REPO)
  }

  await p.set('hold', null)
  await p.set('isChoosingNext', false)
  await p.set('openRow', null)
  await p.set('drift', [])
  scheduleFresh(p, ctx, saved.tasks.find(t => t.id === taskId)!)

  return 'started'
}

const filing = new Set<string>()

// Saves a held message as a task: on its own, under a feature, or under a new
// feature filed with it. Two presses of Save file it once. Filing never
// touches the current task, its branch or the conversation; with nothing
// current, the task itself starts, never a new feature.
export const fileTask = async (
  p: Ports,
  ctx: Ctx,
  input: {
    text: string
    title: string
    priority: Priority
    difficulty: Difficulty
    intent: Intent
    parent?: ParentPick | null
  },
): Promise<void> => {
  const pick = input.parent ?? { kind: 'none' }
  if (input.parent === null || (pick.kind === 'new' && pick.title.trim() === '')) {
    await p.set('notice', pick.kind === 'new' ? 'Name the new feature first.' : 'Pick what it is part of first, or On its own.')

    return
  }
  if (filing.has(input.text)) return
  filing.add(input.text)
  try {
    const now = await nowIso(p, ctx)
    const feature =
      pick.kind === 'new'
        ? newTask({ title: pick.title.trim(), priority: input.priority, difficulty: 'medium', messages: [], now, id: p.newId() })
        : null
    const task = newTask({
      title: input.title,
      priority: input.priority,
      difficulty: input.difficulty,
      messages: [input.text],
      now,
      id: p.newId(),
      parentId: pick.kind === 'task' ? pick.id : (feature?.id ?? null),
    })
    // The feature may have gone since the band went up: checked against the
    // record as it is now.
    let refused = null as string | null
    let saved: ProjectRecord | null
    try {
      saved = await change(p, ctx, r => {
        refused = pick.kind === 'task' ? parentRefusal(r.tasks, task.id, pick.id) : null

        return refused === null ? { ...r, tasks: [...r.tasks, ...(feature === null ? [] : [feature]), task] } : r
      })
    } catch (err) {
      p.log(`saving the task failed: ${err instanceof Error ? err.message : String(err)}`)
      await p.set('notice', "Couldn't save the task. Try Save again.")

      return
    }
    if (saved === null) return
    if (refused !== null) {
      await p.set('notice', `${refused} Pick again.`)

      return
    }

    await closeBand(p)
    const under = parentOf(task, saved.tasks)
    p.toast(`Queued: ${task.title} (${task.priority})${under === null ? '' : ` · part of ${under.title}`}`)
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
    await markUnreadable(p, ctx)

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
  if (current !== null && !isStartingFresh()) scheduleFresh(p, ctx, current)
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
  if (current === null || isStartingFresh()) return 'none'

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

// Removes a queued task, and the git check's hold on it. The tasks under it
// are then on their own, and it is no longer the active feature.
export const removeQueued = async (p: Ports, ctx: Ctx, taskId: string): Promise<void> => {
  const saved = await change(p, ctx, r => {
    const tasks = removeTask(r.tasks, taskId)

    return tasks === r.tasks ? r : { ...r, feature: r.feature === taskId ? null : r.feature, tasks }
  })
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

// Makes a task the active feature, or none with null. Only an open task on
// its own can be one. Returns what happened, in plain words.
export const setFeature = async (p: Ports, ctx: Ctx, taskId: string | null): Promise<string> => {
  let said = ''
  const saved = await change(p, ctx, r => {
    if (taskId === null) {
      said = r.feature === null ? 'No feature was active.' : 'No active feature now.'

      return { ...r, feature: null }
    }
    const task = r.tasks.find(t => t.id === taskId)
    const above = task === undefined ? null : parentOf(task, r.tasks)
    if (task === undefined || (task.state !== 'queued' && task.state !== 'current')) {
      said = 'That task is no longer open.'

      return r
    }
    if (above !== null) {
      said = `${task.title} is part of ${above.title}; make that the feature instead.`

      return r
    }
    said = `Active feature: ${task.title}. New tasks that belong to it are offered under it.`

    return { ...r, feature: taskId }
  })

  return saved === null ? "Couldn't read the task record." : said
}

// /feature: with nothing after it, says which feature is active; "off" (or
// "clear", "none") clears it; otherwise the words pick an open task on its
// own, by its id or its title.
export const featureCommand = async (p: Ports, ctx: Ctx, args: string): Promise<string> => {
  const words = args.trim()
  const record = await readRecord(p.host, ctx.file, ctx.projectName, ctx.projectPath)
  if (record === 'unreadable') return "Couldn't read the task record."
  if (words === '') {
    const feature = activeFeature(record)

    return feature === null
      ? 'No active feature. /feature <title of a task> sets one; /feature off clears it.'
      : `Active feature: ${feature.title}. /feature off clears it.`
  }
  if (/^(off|clear|none)$/i.test(words)) return setFeature(p, ctx, null)

  const said = words.toLowerCase()
  const open = record.tasks.filter(t => (t.state === 'queued' || t.state === 'current') && parentOf(t, record.tasks) === null)
  const byId = open.filter(t => t.id === words)
  const exact = open.filter(t => t.title.toLowerCase() === said)
  const found = byId.length > 0 ? byId : exact.length > 0 ? exact : open.filter(t => t.title.toLowerCase().includes(said))
  if (found.length === 1) return setFeature(p, ctx, found[0]!.id)
  if (found.length > 1) return `Several tasks match: ${found.map(t => t.title).join('; ')}. Use more of the title.`

  return `No open task matches "${words}". File it first with /steep, then /feature <its title>.`
}

// Files a task under a feature, or on its own with null. Refused, saying why,
// when it would nest deeper than one level.
export const moveTask = async (p: Ports, ctx: Ctx, taskId: string, parentId: string | null): Promise<void> => {
  await p.set('parenting', null)
  let refused = null as string | null
  const saved = await change(p, ctx, r => {
    refused = parentId === null ? null : parentRefusal(r.tasks, taskId, parentId)

    return refused === null ? { ...r, tasks: setParent(r.tasks, taskId, parentId) } : r
  })
  if (saved === null) return
  if (refused !== null) {
    await p.set('notice', refused)

    return
  }
  const task = saved.tasks.find(t => t.id === taskId)
  const under = task === undefined ? null : parentOf(task, saved.tasks)
  if (task !== undefined) p.toast(under === null ? `On its own: ${task.title}` : `Part of ${under.title}: ${task.title}`)
}
