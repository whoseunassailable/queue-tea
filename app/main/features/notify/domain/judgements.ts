import { currentTask } from '../../../../../hooks/shared/records/domain/services/queue_rules'
import type { Scanned } from '../../projects/data/projects_source'

export type Asked = { key: string; taskId: string; title: string; at: string }

type WatchDeps = {
  scan: () => Promise<Scanned[]>
  // True when no window of ours has the keyboard.
  isAway: () => boolean
  notify: (asked: Asked) => void
  log: { error: (text: string, err?: unknown) => void }
}

const idOf = (asked: Asked): string => `${asked.key}:${asked.taskId}:${asked.at}`

// Every quest in every realm that reads, where Claude is asking for Judgement.
export const askedOf = (scanned: Scanned[]): Asked[] =>
  scanned.flatMap(s => {
    if (s.kind !== 'readable') return []
    const current = currentTask(s.record.tasks)

    return current?.review == null ? [] : [{ key: s.key, taskId: current.id, title: current.title, at: current.review.at }]
  })

// Says once when Claude newly asks and the app isn't in front. What was already
// asked when the app opened isn't news. The `at` is part of what's seen, so
// Claude asking again after Not yet is news again.
export const judgementWatch = (d: WatchDeps) => {
  let seen: Set<string> | null = null
  let isChecking = false
  let isAskedAgain = false

  const check = async (): Promise<void> => {
    if (isChecking) {
      isAskedAgain = true

      return
    }
    isChecking = true
    try {
      const asked = askedOf(await d.scan())
      const known = seen
      seen = new Set(asked.map(idOf))
      if (known !== null && d.isAway()) asked.filter(a => !known.has(idOf(a))).forEach(a => d.notify(a))
    } catch (err) {
      d.log.error('looking for a Judgement failed', err)
    }
    isChecking = false
    if (isAskedAgain) {
      isAskedAgain = false
      await check()
    }
  }

  return check
}
