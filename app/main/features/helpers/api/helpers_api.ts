import type { HelperId } from '../../../../../types'
import { HELPER_IDS, isHelperId } from '../../../../../hooks/shared/records/domain/services/helpers'
import { currentTask } from '../../../../../hooks/shared/records/domain/services/queue_rules'
import type { HelperJob, Reply } from '../../../../shared/engine_api'
import { MESSAGES } from '../../../core/messages'
import { Refusal, reply } from '../../../core/reply'
import type { streamProcess } from '../../../core/stream_process'
import { loadOperation } from '../../branches/data/operation_store'
import { workspacePath } from '../../branches/data/merge_workspace'
import { checkPath } from '../../branches/domain/constants'
import { scopeOf } from '../../tasks/api/scope'
import type { TasksDeps } from '../../tasks/api/scope'
import { HELPER_LIMITS, lineReader, orderOf, seenIn } from '../domain/helper_stream'
import type { Seen } from '../domain/helper_stream'

export type HelpersDeps = TasksDeps & { stream: typeof streamProcess; tell: (jobs: HelperJob[]) => void }

// The Guild Hall's helpers, each one a headless Claude Code session run as that
// helper. It lives in the realm's folder, or the worktree of the quest under way,
// and the window hears every change to what it is doing.
// shortcut: jobs live in memory, so a restart forgets the last answers; save them if Rohan wants a history.
export const helpersApi = (d: HelpersDeps) => {
  const jobs = new Map<HelperId, HelperJob>()
  const stops = new Map<HelperId, AbortController>()
  const list = (): HelperJob[] => HELPER_IDS.flatMap(id => jobs.get(id) ?? [])
  const update = (helper: HelperId, change: Partial<HelperJob>) => {
    const job = jobs.get(helper)
    if (job === undefined) return
    jobs.set(helper, { ...job, ...change })
    d.tell(list())
  }

  const run = async (job: HelperJob, stop: AbortController) => {
    const agent = `queue-tea:${job.helper}`
    let isMissing = false
    let last: Seen | null = null
    const read = lineReader(line => {
      const seen = seenIn(line, agent)
      if (seen === null) return
      if (seen.kind === 'doing') {
        const steps = (jobs.get(job.helper)?.steps ?? 0) + (seen.doing.kind === 'thinking' ? 0 : 1)
        update(job.helper, { doing: seen.doing, steps })
      } else if (seen.kind === 'missing') {
        isMissing = true
        stop.abort()
      } else last = seen
    })
    d.log.debug(`helper ${job.helper} starts in ${job.folder}`)
    const ran = await d.stream(
      d.log,
      { argv: ['claude', '-p', '--agent', agent, '--output-format', 'stream-json', '--verbose', '--', job.order], cwd: job.folder, signal: stop.signal, timeoutMs: HELPER_LIMITS.runMinutes * 60_000, env: { PATH: checkPath(d.home, process.env.PATH) } },
      read,
    )
    stops.delete(job.helper)
    const finished = d.now()
    const ended = last as Seen | null
    d.log.debug(`helper ${job.helper} ended with exit ${ran.exitCode}`)
    if (isMissing) return update(job.helper, { status: 'failed', error: MESSAGES.helperMissing, doing: null, finished })
    if (stop.signal.aborted) return update(job.helper, { status: 'stopped', doing: null, finished })
    if (ended?.kind === 'done') return update(job.helper, { status: 'done', reply: ended.reply, doing: null, finished })
    d.log.warn(`helper ${job.helper} failed: ${ended?.kind === 'failed' ? ended.detail : ran.stderr.slice(-2_000)}`)
    const error = /ENOENT/.test(ran.stderr) ? MESSAGES.helperNoClaude : ran.exitCode === 130 ? MESSAGES.helperTimedOut(HELPER_LIMITS.runMinutes) : MESSAGES.helperFailed

    return update(job.helper, { status: 'failed', error, doing: null, finished })
  }

  const readHelpers = (): Promise<Reply<HelperJob[]>> => reply(d.log, MESSAGES.readHelpers, async () => list())

  const sendHelper = (key: unknown, helper: unknown, input: unknown): Promise<Reply<HelperJob>> =>
    reply(d.log, MESSAGES.sendHelper, async () => {
      if (!isHelperId(helper)) throw new Refusal(MESSAGES.badValue)
      const order = orderOf(input)
      if (!order.ok) throw new Refusal(order.why === 'empty' ? MESSAGES.helperOrderEmpty : MESSAGES.helperOrderLong(HELPER_LIMITS.orderChars))
      const scope = await scopeOf(d, key)
      const folder = currentTask(scope.record.tasks)?.worktreePath ?? scope.ctx.cwd

      return start(helper, scope.key, folder, order.order, null)
    })

  // A helper dropped on a prepared merge: it runs Tea-concile in that merge's own
  // folder, which only the merge uses, and stages what it resolves for Rohan to approve.
  const concileMerge = (key: unknown, helper: unknown, operationId: unknown): Promise<Reply<HelperJob>> =>
    reply(d.log, MESSAGES.concileMerge, async () => {
      if (!isHelperId(helper)) throw new Refusal(MESSAGES.badValue)
      const scope = await scopeOf(d, key)
      const op = await loadOperation(d, scope.key, operationId)
      if (op.stage !== 'conflicts') throw new Refusal(MESSAGES.helperNoConflicts)

      return start(helper, scope.key, workspacePath(d, op), MESSAGES.concileOrder(op.source, op.target), op.id)
    })

  const start = async (helper: HelperId, realm: string, folder: string, order: string, merge: string | null): Promise<HelperJob> => {
    if (!(await d.host.exists(folder))) throw new Refusal(MESSAGES.folderGone(folder))
    // After the last await, so two quick sends can't both pass.
    if (jobs.get(helper)?.status === 'working') throw new Refusal(MESSAGES.helperBusy)
    const job: HelperJob = { helper, realm, folder, order, merge, status: 'working', doing: null, steps: 0, reply: null, error: null, started: d.now(), finished: null }
    const stop = new AbortController()
    jobs.set(helper, job)
    stops.set(helper, stop)
    d.tell(list())
    run(job, stop).catch(err => {
      d.log.error(`helper ${helper} broke off`, err)
      stops.delete(helper)
      update(helper, { status: 'failed', error: MESSAGES.helperFailed, doing: null, finished: d.now() })
    })

    return job
  }

  const stopHelper = (helper: unknown): Promise<Reply<null>> =>
    reply(d.log, MESSAGES.stopHelper, async () => {
      if (!isHelperId(helper)) throw new Refusal(MESSAGES.badValue)
      stops.get(helper)?.abort()

      return null
    })

  const isBusy = (): boolean => [...jobs.values()].some(job => job.status === 'working')

  return { readHelpers, sendHelper, concileMerge, stopHelper, isBusy }
}

export type HelpersApi = ReturnType<typeof helpersApi>
