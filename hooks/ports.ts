import { atom, read, update } from 'claude-code'
import type { EngineInterface } from 'claude-code'

import { askOf } from './check'
import type { Ports, View } from './flow'
import { hostOf } from './host'
import { currentTask } from './queue'
import { statusText } from './ui/status'

const recordAtom = atom({ plugin: 'queue-tie', key: 'record' } as const, null)
const loadAtom = atom({ plugin: 'queue-tie', key: 'load' } as const, 'loading')
const holdAtom = atom({ plugin: 'queue-tie', key: 'hold' } as const, null)
const bandAtom = atom({ plugin: 'queue-tie', key: 'band' } as const, { kind: 'none' } as View['band'])
const isAskingDoneAtom = atom({ plugin: 'queue-tie', key: 'isAskingDone' } as const, false)
const isChoosingNextAtom = atom({ plugin: 'queue-tie', key: 'isChoosingNext' } as const, false)
const openRowAtom = atom({ plugin: 'queue-tie', key: 'openRow' } as const, null)
const isCheckingAtom = atom({ plugin: 'queue-tie', key: 'isChecking' } as const, false)
const allowanceAtom = atom({ plugin: 'queue-tie', key: 'allowance' } as const, null)
const noticeAtom = atom({ plugin: 'queue-tie', key: 'notice' } as const, null)
const spinAtom = atom({ plugin: 'queue-tie', key: 'spin' } as const, 0)
const canContinueAtom = atom({ plugin: 'queue-tie', key: 'canContinue' } as const, false)
const mismatchAtom = atom({ plugin: 'queue-tie', key: 'mismatch' } as const, null)
const bandQueueAtom = atom({ plugin: 'queue-tie', key: 'bandQueue' } as const, [] as View['bandQueue'])
const checkedAtom = atom({ plugin: 'queue-tie', key: 'checked' } as const, null)
const busyAtom = atom({ plugin: 'queue-tie', key: 'busy' } as const, null)
const warningAtom = atom({ plugin: 'queue-tie', key: 'warning' } as const, null)
const isPaletteOpenAtom = atom({ plugin: 'queue-tie', key: 'isPaletteOpen' } as const, false)
const blockingAtom = atom({ plugin: 'queue-tie', key: 'blocking' } as const, null)
const budgetAtom = atom({ plugin: 'queue-tie', key: 'budget' } as const, null)
const driftAtom = atom({ plugin: 'queue-tie', key: 'drift' } as const, [] as View['drift'])
const othersAtom = atom({ plugin: 'queue-tie', key: 'others' } as const, [] as View['others'])

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
    case 'isPaletteOpen':
      return (await read($, isPaletteOpenAtom)) as View[K]
    case 'blocking':
      return (await read($, blockingAtom)) as View[K]
    case 'budget':
      return (await read($, budgetAtom)) as View[K]
    case 'drift':
      return (await read($, driftAtom)) as View[K]
    case 'others':
      return (await read($, othersAtom)) as View[K]
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
    case 'isPaletteOpen':
      return update($, isPaletteOpenAtom, () => v)
    case 'blocking':
      return update($, blockingAtom, () => v)
    case 'budget':
      return update($, budgetAtom, () => v)
    case 'drift':
      return update($, driftAtom, () => v)
    case 'others':
      return update($, othersAtom, () => v)
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
        work().catch(err => debug($, 'queue-tie work failed', err))
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
