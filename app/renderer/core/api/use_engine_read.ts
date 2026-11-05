import { useCallback, useEffect, useRef, useState } from 'preact/hooks'

import type { EngineApi, Reply } from '../../../shared/engine_api'
import type { Load } from '../../features/workspace/state_management/workspace_store'
import { ask } from './engine_client'

export type EngineRead<T> = { load: Load<T>; note: string | null; isRefreshing: boolean; retry: () => void; refresh: () => void; adopt: (data: T) => void }

// One page's read: it runs when `deps` change and again whenever a record does.
// What's on screen stays through a refresh, and a refresh that fails says so
// beside it. The newest read wins, so a slow one can't paint over a later week.
export const useEngineRead = <T>(engine: EngineApi, read: () => Promise<Reply<T>>, deps: readonly unknown[]): EngineRead<T> => {
  const [load, setLoad] = useState<Load<T>>({ status: 'loading' })
  const [note, setNote] = useState<string | null>(null)
  const [isRefreshing, setRefreshing] = useState(false)
  const number = useRef(0)
  const latest = useRef(read)
  latest.current = read

  const run = useCallback(async () => {
    number.current += 1
    const mine = number.current
    setRefreshing(true)
    const answer = await ask(engine, () => latest.current())
    if (mine !== number.current) return
    setRefreshing(false)
    setNote(answer.ok ? null : answer.message)
    setLoad(was => {
      if (answer.ok) return { status: 'ready', data: answer.data }

      return was.status === 'ready' ? was : { status: 'failed', message: answer.message }
    })
  }, [engine])

  useEffect(() => {
    void run()
  }, deps)
  useEffect(() => engine.onChange(() => void run()), [engine, run])
  // A read that lands after the page has gone has nowhere to go.
  useEffect(
    () => () => {
      number.current += 1
    },
    [],
  )

  const refresh = useCallback(() => void run(), [run])

  // What a change handed back, with no need to read it again. A read still on
  // its way is older than this, so it no longer counts.
  const adopt = useCallback((data: T) => {
    number.current += 1
    setNote(null)
    setRefreshing(false)
    setLoad({ status: 'ready', data })
  }, [])

  const retry = () => {
    setLoad({ status: 'loading' })
    void run()
  }

  return { load, note, isRefreshing, retry, refresh, adopt }
}
