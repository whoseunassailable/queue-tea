import { atom, read, update } from 'claude-code'
import type { EngineInterface } from 'claude-code'

import { askOf } from './check'
import type { Ports, View } from './flow'
import { hostOf } from './host'
import { currentTask } from './queue'
import { cupOf } from './ui/cup'
import type { Cup } from './ui/cup'
import { statusText } from './ui/status'

const recordAtom = atom({ plugin: 'queue-tea', key: 'record' } as const, null)
const loadAtom = atom({ plugin: 'queue-tea', key: 'load' } as const, 'loading')
const loadErrorAtom = atom({ plugin: 'queue-tea', key: 'loadError' } as const, null as View['loadError'])
const holdAtom = atom({ plugin: 'queue-tea', key: 'hold' } as const, null)
const bandAtom = atom({ plugin: 'queue-tea', key: 'band' } as const, { kind: 'none' } as View['band'])
const isAskingDoneAtom = atom({ plugin: 'queue-tea', key: 'isAskingDone' } as const, false)
const isChoosingNextAtom = atom({ plugin: 'queue-tea', key: 'isChoosingNext' } as const, false)
const openRowAtom = atom({ plugin: 'queue-tea', key: 'openRow' } as const, null)
const isCheckingAtom = atom({ plugin: 'queue-tea', key: 'isChecking' } as const, false)
const allowanceAtom = atom({ plugin: 'queue-tea', key: 'allowance' } as const, null)
const noticeAtom = atom({ plugin: 'queue-tea', key: 'notice' } as const, null)
const spinAtom = atom({ plugin: 'queue-tea', key: 'spin' } as const, 0)
const canContinueAtom = atom({ plugin: 'queue-tea', key: 'canContinue' } as const, false)
const mismatchAtom = atom({ plugin: 'queue-tea', key: 'mismatch' } as const, null)
const bandQueueAtom = atom({ plugin: 'queue-tea', key: 'bandQueue' } as const, [] as View['bandQueue'])
const checkedAtom = atom({ plugin: 'queue-tea', key: 'checked' } as const, null)
const busyAtom = atom({ plugin: 'queue-tea', key: 'busy' } as const, null)
const warningAtom = atom({ plugin: 'queue-tea', key: 'warning' } as const, null)
const blockingAtom = atom({ plugin: 'queue-tea', key: 'blocking' } as const, null)
const budgetAtom = atom({ plugin: 'queue-tea', key: 'budget' } as const, null)
const driftAtom = atom({ plugin: 'queue-tea', key: 'drift' } as const, [] as View['drift'])
const linesAtom = atom({ plugin: 'queue-tea', key: 'lines' } as const, null as View['lines'])
const othersAtom = atom({ plugin: 'queue-tea', key: 'others' } as const, [] as View['others'])
const menuViewAtom = atom({ plugin: 'queue-tea', key: 'menuView' } as const, 'menu' as View['menuView'])
const isMenuOpenAtom = atom({ plugin: 'queue-tea', key: 'isMenuOpen' } as const, false)
const isCupStillAtom = atom({ plugin: 'queue-tea', key: 'isCupStill' } as const, false)
const parentingAtom = atom({ plugin: 'queue-tea', key: 'parenting' } as const, null)
const openParentsAtom = atom({ plugin: 'queue-tea', key: 'openParents' } as const, [] as View['openParents'])

export function debug($: EngineInterface, what: string, err: unknown) {
  $.ui.log(`${what}: ${err instanceof Error ? err.message : String(err)}`, { to: 'debug' })
}

// Reads one view value. Read while drawing, it redraws the reader on a change.
export async function getView<K extends keyof View>($: EngineInterface, key: K): Promise<View[K]> {
  switch (key) {
    case 'record':
      return (await read($, recordAtom)) as View[K]
    case 'load':
      return (await read($, loadAtom)) as View[K]
    case 'loadError':
      return (await read($, loadErrorAtom)) as View[K]
    case 'hold':
      return (await read($, holdAtom)) as View[K]
    case 'band':
      return (await read($, bandAtom)) as View[K]
    case 'isAskingDone':
      return (await read($, isAskingDoneAtom)) as View[K]
    case 'isChoosingNext':
      return (await read($, isChoosingNextAtom)) as View[K]
    case 'openRow':
      return (await read($, openRowAtom)) as View[K]
    case 'isChecking':
      return (await read($, isCheckingAtom)) as View[K]
    case 'allowance':
      return (await read($, allowanceAtom)) as View[K]
    case 'notice':
      return (await read($, noticeAtom)) as View[K]
    case 'canContinue':
      return (await read($, canContinueAtom)) as View[K]
    case 'mismatch':
      return (await read($, mismatchAtom)) as View[K]
    case 'bandQueue':
      return (await read($, bandQueueAtom)) as View[K]
    case 'checked':
      return (await read($, checkedAtom)) as View[K]
    case 'busy':
      return (await read($, busyAtom)) as View[K]
    case 'warning':
      return (await read($, warningAtom)) as View[K]
    case 'blocking':
      return (await read($, blockingAtom)) as View[K]
    case 'budget':
      return (await read($, budgetAtom)) as View[K]
    case 'drift':
      return (await read($, driftAtom)) as View[K]
    case 'lines':
      return (await read($, linesAtom)) as View[K]
    case 'others':
      return (await read($, othersAtom)) as View[K]
    case 'menuView':
      return (await read($, menuViewAtom)) as View[K]
    case 'isMenuOpen':
      return (await read($, isMenuOpenAtom)) as View[K]
    case 'isCupStill':
      return (await read($, isCupStillAtom)) as View[K]
    case 'parenting':
      return (await read($, parentingAtom)) as View[K]
    case 'openParents':
      return (await read($, openParentsAtom)) as View[K]
    default:
      return (await read($, spinAtom)) as View[K]
  }
}

async function setView<K extends keyof View>($: EngineInterface, key: K, value: View[K]) {
  const v = value as never
  switch (key) {
    case 'record':
      return update($, recordAtom, () => v)
    case 'load':
      return update($, loadAtom, () => v)
    case 'loadError':
      return update($, loadErrorAtom, () => v)
    case 'hold':
      return update($, holdAtom, () => v)
    case 'band':
      return update($, bandAtom, () => v)
    case 'isAskingDone':
      return update($, isAskingDoneAtom, () => v)
    case 'isChoosingNext':
      return update($, isChoosingNextAtom, () => v)
    case 'openRow':
      return update($, openRowAtom, () => v)
    case 'isChecking':
      return update($, isCheckingAtom, () => v)
    case 'allowance':
      return update($, allowanceAtom, () => v)
    case 'notice':
      return update($, noticeAtom, () => v)
    case 'canContinue':
      return update($, canContinueAtom, () => v)
    case 'mismatch':
      return update($, mismatchAtom, () => v)
    case 'bandQueue':
      return update($, bandQueueAtom, () => v)
    case 'checked':
      return update($, checkedAtom, () => v)
    case 'busy':
      return update($, busyAtom, () => v)
    case 'warning':
      return update($, warningAtom, () => v)
    case 'blocking':
      return update($, blockingAtom, () => v)
    case 'budget':
      return update($, budgetAtom, () => v)
    case 'drift':
      return update($, driftAtom, () => v)
    case 'lines':
      return update($, linesAtom, () => v)
    case 'others':
      return update($, othersAtom, () => v)
    case 'menuView':
      return update($, menuViewAtom, () => v)
    case 'isMenuOpen':
      return update($, isMenuOpenAtom, () => v)
    case 'isCupStill':
      return update($, isCupStillAtom, () => v)
    case 'parenting':
      return update($, parentingAtom, () => v)
    case 'openParents':
      return update($, openParentsAtom, () => v)
    default:
      return update($, spinAtom, () => v)
  }
}

// The status line, from the current task, the check and the allowance.
export async function refreshStatus($: EngineInterface) {
  const record = await read($, recordAtom)
  const current = record === null ? null : currentTask(record.tasks)
  const minutes = current === null ? 0 : Object.values(current.minutesByDay).reduce((a, b) => a + b, 0)
  $.ui.status(statusText(current, minutes, await read($, allowanceAtom), await read($, isCheckingAtom)))
}

// The tea cup's mood, from the same values the menu shows. Read while
// drawing, it redraws the cup when one of them changes.
export async function readCup($: EngineInterface, isTurnRunning: boolean): Promise<Cup> {
  return cupOf({
    load: await read($, loadAtom),
    record: await read($, recordAtom),
    band: await read($, bandAtom),
    isAskingDone: await read($, isAskingDoneAtom),
    hold: await read($, holdAtom),
    mismatch: await read($, mismatchAtom),
    canContinue: await read($, canContinueAtom),
    warning: await read($, warningAtom),
    isChecking: await read($, isCheckingAtom),
    busy: await read($, busyAtom),
    isTurnRunning,
    budget: await read($, budgetAtom),
    now: await $.clock.now(),
  })
}

const STATUS_KEYS: readonly (keyof View)[] = ['record', 'isChecking', 'allowance']
const hex = (bytes: Uint8Array) => [...bytes].map(b => b.toString(16).padStart(2, '0')).join('')

export function portsOf($: EngineInterface): Ports {
  return {
    host: hostOf($),
    ask: askOf($),
    clear: async () => {
      await $.command.run({ command: 'clear' })
    },
    submit: async (text, asUser) => {
      await $.prompt.submit(asUser === true ? { text, asUser: true } : { text })
    },
    toast: text => $.ui.toast(text),
    status: text => $.ui.status(text),
    now: () => $.clock.now(),
    later: work => {
      $.clock.after(0, () => {
        work().catch(err => debug($, 'queue-tea work failed', err))
      })
    },
    newId: () => `t-${hex(crypto.getRandomValues(new Uint8Array(4)))}`,
    get: key => getView($, key),
    set: async (key, value) => {
      await setView($, key, value)
      if (STATUS_KEYS.includes(key)) await refreshStatus($)
    },
    log: text => $.ui.log(text, { to: 'debug' }),
  }
}
