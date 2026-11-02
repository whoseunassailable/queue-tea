import type { EngineInterface, ModelCompleteResult, ModelForkResult, PluginState } from 'claude-code'

import type { Env } from '../env/env'
import type { Host } from '../host/host'

export type View = PluginState['queue-tea']

// What the check needs from the engine, so it can be tested without one.
export type Ask = {
  fork: (prompt: string) => Promise<ModelForkResult>
  complete: (prompt: string) => Promise<ModelCompleteResult>
  sleep: (ms: number) => Promise<void>
  log: (text: string) => void
}

export type MenuSpec = Parameters<EngineInterface['ui']['open']>[0]
export type SessionUsage = Awaited<ReturnType<EngineInterface['session']['usage']>>

// What a controller needs from the engine. register.tsx builds them from `$`.
export type Ports = Env & {
  host: Host
  ask: Ask
  clear: () => Promise<void>
  submit: (text: string, asUser?: boolean) => Promise<void>
  toast: (text: string) => void
  status: (text: string | undefined) => void
  later: (work: () => Promise<void>) => void
  get: <K extends keyof View>(key: K) => Promise<View[K]>
  set: <K extends keyof View>(key: K, value: View[K]) => Promise<void>
  ui: { open: (spec: MenuSpec) => Promise<{ isPlaced: boolean }>; close: (id: string) => Promise<void> }
  prompt: {
    read: () => Promise<{ text: string }>
    fill: (text: string) => Promise<{ isFilled: boolean }>
    send: (text: string) => Promise<{ drop?: unknown }>
  }
  session: { id: () => Promise<string>; usage: () => Promise<SessionUsage>; append: (note: string) => Promise<void> }
}
