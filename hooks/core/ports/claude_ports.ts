import type { EngineInterface } from 'claude-code'

import { hostOf } from '../host/claude_host'
import { debug } from '../logger/logger'
import { getView, setView } from '../store/view_store'
import type { Ask, Ports, View } from './ports'

export function askOf($: EngineInterface): Ask {
  return {
    fork: prompt => $.model.fork({ prompt }),
    complete: prompt => $.model.complete({ model: 'claude-haiku-5-5', prompt, maxTokens: 200 }),
    sleep: ms => $.clock.sleep(ms),
    log: text => $.ui.log(text, { to: 'debug' }),
  }
}

const STATUS_KEYS: readonly (keyof View)[] = ['record', 'isChecking', 'allowance']
const hex = (bytes: Uint8Array) => [...bytes].map(b => b.toString(16).padStart(2, '0')).join('')

// What runs when a value the status line shows changes, kept out of here so
// the core doesn't reach the feature that draws it.
let viewChanged: ((p: Ports) => Promise<void>) | null = null
export const onViewChange = (fn: (p: Ports) => Promise<void>): void => {
  viewChanged = fn
}

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
        work().catch(err => debug(portsOf($), 'queue-tea work failed', err))
      })
    },
    newId: () => `t-${hex(crypto.getRandomValues(new Uint8Array(4)))}`,
    get: key => getView($, key),
    set: async (key, value) => {
      await setView($, key, value)
      if (STATUS_KEYS.includes(key)) await viewChanged?.(portsOf($))
    },
    log: text => $.ui.log(text, { to: 'debug' }),
    ui: {
      open: spec => $.ui.open(spec),
      close: async id => {
        await $.ui.close({ id })
      },
    },
    prompt: {
      read: () => $.prompt.read(),
      fill: text => $.prompt.fill({ text, mode: 'append' }),
      send: text => $.prompt.submit({ text, asUser: true }),
    },
    session: {
      usage: () => $.session.usage(),
      append: async note => {
        await $.session.append({ message: { type: 'user', content: [{ type: 'text', text: note }] } })
      },
    },
  }
}
