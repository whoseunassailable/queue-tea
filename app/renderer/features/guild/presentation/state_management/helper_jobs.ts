import { useEffect } from 'preact/hooks'

import type { HelperId } from '../../../../../../types'
import type { EngineApi, HelperJob } from '../../../../../shared/engine_api'
import { ask } from '../../../../core/api/engine_client'
import { useEngineRead } from '../../../../core/api/use_engine_read'

// What each helper is doing: read once, then kept current by main's pushes.
export const useHelperJobs = (engine: EngineApi) => {
  const read = useEngineRead(engine, () => engine.readHelpers(), [])
  const { adopt } = read
  useEffect(() => engine.onHelpers(adopt), [engine, adopt])
  const jobs = read.load.status === 'ready' ? read.load.data : []

  // The error to show, or null once the helper has the order.
  const send = async (key: string, helper: HelperId, order: string): Promise<string | null> => {
    const answer = await ask(engine, () => engine.sendHelper(key, helper, order))
    if (!answer.ok) return answer.message
    // Read again rather than patch the list: a push may have landed meanwhile.
    read.refresh()

    return null
  }

  // The error to show, or null once the helper is on its way to the merge.
  const concile = async (key: string, helper: HelperId, mergeId: string): Promise<string | null> => {
    const answer = await ask(engine, () => engine.concileMerge(key, helper, mergeId))
    if (!answer.ok) return answer.message
    read.refresh()

    return null
  }

  // The same order again: to the merge it was for, or to the realm.
  const retry = (job: HelperJob): Promise<string | null> => (job.merge === null ? send(job.realm, job.helper, job.order) : concile(job.realm, job.helper, job.merge))

  const stop = async (helper: HelperId): Promise<string | null> => {
    const answer = await ask(engine, () => engine.stopHelper(helper))

    return answer.ok ? null : answer.message
  }

  const jobOf = (helper: HelperId): HelperJob | null => jobs.find(job => job.helper === helper) ?? null

  return { read, jobs, jobOf, send, concile, retry, stop }
}
