import { useEffect, useRef, useState } from 'preact/hooks'

import type { LayoutInput, Point } from '../../domain/note_graph_layout'

// Lays the graph out off the window's thread, so a big realm never freezes it.

export type LayoutMessage = { kind: 'progress'; share: number } | { kind: 'done'; points: Map<string, Point> } | { kind: 'failed'; detail: string }
export type LayoutRun = (input: LayoutInput, onProgress: (share: number) => void) => { done: Promise<Map<string, Point>>; cancel: () => void }

// One worker per run, ended when it answers, fails or is cancelled. A
// cancelled run's promise never settles, and nothing waits on it.
export const workerLayout: LayoutRun = (input, onProgress) => {
  const worker = new Worker(new URL('./note_graph.worker.ts', import.meta.url), { type: 'module' })
  const done = new Promise<Map<string, Point>>((resolve, reject) => {
    worker.onmessage = (event: MessageEvent<LayoutMessage>) => {
      const message = event.data
      if (message.kind === 'progress') return onProgress(message.share)
      worker.terminate()
      if (message.kind === 'done') resolve(message.points)
      else reject(new Error(message.detail))
    }
    worker.onerror = event => {
      worker.terminate()
      reject(new Error(`the layout worker stopped: ${event.message}`))
    }
  })
  worker.postMessage(input)

  return { done, cancel: () => worker.terminate() }
}

export type GraphLayoutState = { kind: 'laying'; share: number } | { kind: 'done'; points: Map<string, Point> } | { kind: 'failed' }

const LAYING: GraphLayoutState = { kind: 'laying', share: 0 }

// input must keep its identity until the graph changes (callers memoise it); null means nothing to lay out.
export const useGraphLayout = (run: LayoutRun, input: LayoutInput | null, log: (text: string) => void, ready: Map<string, Point> | null = null): { state: GraphLayoutState; retry: () => void } => {
  // Each state remembers its input, so a new input reads as laying from its
  // first render instead of showing the old input's result until its run starts.
  const [held, setHeld] = useState<{ input: LayoutInput | null; state: GraphLayoutState }>({ input, state: ready === null ? LAYING : { kind: 'done', points: ready } })
  const state = input === null || held.input === input ? held.state : LAYING
  const [attempt, setAttempt] = useState(0)
  // Points ready for the first input stand in for its run; a later input or a retry runs.
  const skip = useRef(ready !== null ? input : undefined)
  const latestLog = useRef(log)
  latestLog.current = log

  useEffect(() => {
    if (input === null) return
    const isSkipped = skip.current === input
    skip.current = undefined
    if (isSkipped) return
    // A run that was replaced or left may still answer; its answer is for a
    // graph no longer on screen, so it is dropped.
    let isCurrent = true
    setHeld({ input, state: LAYING })
    const fail = (error: unknown) => {
      latestLog.current(`graph layout failed: ${error instanceof Error ? (error.stack ?? error.message) : String(error)}`)
      setHeld({ input, state: { kind: 'failed' } })
    }
    let job: ReturnType<LayoutRun>
    try {
      job = run(input, share => isCurrent && setHeld({ input, state: { kind: 'laying', share } }))
    } catch (error) {
      fail(error)

      return () => {
        isCurrent = false
      }
    }
    job.done.then(
      points => isCurrent && setHeld({ input, state: { kind: 'done', points } }),
      (error: unknown) => {
        if (isCurrent) fail(error)
      },
    )

    return () => {
      isCurrent = false
      job.cancel()
    }
  }, [run, input, attempt])

  return { state, retry: () => setAttempt(n => n + 1) }
}
