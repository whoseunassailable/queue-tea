import { changedBuild } from '../../../../shared/update'
import type { AppIdentity } from '../../../../shared/update'

type WatchDeps = {
  running: AppIdentity
  // The version now on disk, which an install swaps in under the running app.
  installed: () => Promise<AppIdentity | null>
  // True when no window of ours has the keyboard.
  isAway: () => boolean
  // True while a restart would lose something: a dialog open, a field being
  // typed in, or an engine call still running.
  isBusy: () => Promise<boolean>
  // True when you say restart now.
  ask: (version: string) => Promise<boolean>
  restart: (isInFront: boolean) => Promise<void>
  log: { error: (text: string, err?: unknown) => void }
}

const majorOf = (version: string): string => version.split('.')[0] ?? ''

// A new copy on disk takes over without stopping your work: it waits until
// you're away from the window with nothing half done. A new major version may
// not get on with the old one's records, so that one asks you, once.
export const updateWatch = (d: WatchDeps) => {
  let isChecking = false
  let hasAsked = false

  return async (): Promise<void> => {
    if (isChecking) return
    isChecking = true
    try {
      const installed = await d.installed()
      if (installed !== null && changedBuild(d.running, installed)) {
        if (d.isAway() && !(await d.isBusy())) await d.restart(false)
        else if (!hasAsked && !(await d.isBusy()) && majorOf(installed.version) !== majorOf(d.running.version)) {
          hasAsked = true
          if (await d.ask(installed.version) && !(await d.isBusy())) await d.restart(true)
        }
      }
    } catch (err) {
      d.log.error('moving to the installed version failed', err)
    }
    isChecking = false
  }
}
