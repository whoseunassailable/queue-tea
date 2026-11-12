import { useCallback, useEffect, useRef, useState } from 'preact/hooks'

import type { EngineApi, Reply } from '../../../shared/engine_api'
import type { Load } from '../../features/workspace/state_management/workspace_store'
import { ask } from './engine_client'

export type EngineRead<T> = { load: Load<T>; note: string | null; isRefreshing: boolean; retry: () => void; refresh: () => void; adopt: (data: T) => void }

// One page's read: it runs when `deps` change and again whenever a record does.
// What's on screen stays through a refresh, and a refresh that fails says so
// beside it. Keep one request and one trailing refresh, so slow polling cannot
// build an unbounded queue. Parameter changes and adopted replies retire old data.
export const useEngineRead = <T>(engine: EngineApi, read: () => Promise<Reply<T>>, deps: readonly unknown[]): EngineRead<T> => {
  const [load, setLoad] = useState<Load<T>>({ status: 'loading' })
  const [note, setNote] = useState<string | null>(null)
  const [isRefreshing, setRefreshing] = useState(false)
  const number = useRef(0)
  const mounted = useRef(false)
  const inFlight = useRef(false)
  const queued = useRef(false)
  const latest = useRef(read)
  const currentEngine = useRef(engine)
  latest.current = read
  currentEngine.current = engine

  const run = useCallback(async () => {
    if (!mounted.current) return
    if (inFlight.current) { queued.current = true; return }
    inFlight.current = true
    const mine = number.current
    setRefreshing(true)
    const answer = await ask(currentEngine.current, () => latest.current())
    inFlight.current = false
    if (!mounted.current) return
    if (mine === number.current) {
      setRefreshing(false)
      setNote(answer.ok ? null : answer.message)
      setLoad(was => {
        if (answer.ok) return { status: 'ready', data: answer.data }

        return was.status === 'ready' ? was : { status: 'failed', message: answer.message }
      })
    }
    if (queued.current) { queued.current = false; void run() }
  }, [])

  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false; queued.current = false; number.current += 1 }
  }, [])
  useEffect(() => {
    number.current += 1
    void run()
  }, [engine, ...deps])
  useEffect(() => engine.onChange(() => void run()), [engine, run])

  const refresh = useCallback(() => void run(), [run])

  // What a change handed back, with no need to read it again. A read still on
  // its way is older than this, so it no longer counts.
  const adopt = useCallback((data: T) => {
    if (!mounted.current) return
    number.current += 1
    queued.current = false
    setNote(null)
    setRefreshing(false)
    setLoad({ status: 'ready', data })
  }, [])

  const retry = () => {
    if (!mounted.current) return
    setLoad({ status: 'loading' })
    void run()
  }

  return { load, note, isRefreshing, retry, refresh, adopt }
}
