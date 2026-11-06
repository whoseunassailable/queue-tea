import { useCallback, useEffect, useRef, useState } from 'preact/hooks'

import type { Scene } from '../../../../../shared/designs'
import type { EngineApi } from '../../../../../shared/engine_api'
import { ask } from '../../../../core/api/engine_client'
import { AUTOSAVE_MS } from '../../../../core/constants/constants'

export type SaveState = { kind: 'idle' } | { kind: 'saving' } | { kind: 'saved'; at: number } | { kind: 'failed'; message: string } | { kind: 'changed' }

// Saves a design a moment after the last change, one save at a time. When
// the file changed on disk since it was read, nothing more is written until
// the editor says what to do.
export const useAutosave = (engine: EngineApi, realm: string, folder: string, id: string, firstStamp: string) => {
  const [state, setState] = useState<SaveState>({ kind: 'idle' })
  const stamp = useRef(firstStamp)
  const pending = useRef<Scene | null>(null)
  const isBusy = useRef(false)
  const isHeld = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const flush = useCallback(async () => {
    clearTimeout(timer.current)
    if (isBusy.current || isHeld.current || pending.current === null) return
    const scene = pending.current
    pending.current = null
    isBusy.current = true
    setState({ kind: 'saving' })
    const answer = await ask(engine, () => engine.saveDesign(realm, folder, id, scene, stamp.current))
    isBusy.current = false
    if (!answer.ok || answer.data.kind === 'changed') {
      // What didn't save waits, unless something newer is already waiting.
      pending.current ??= scene
      if (answer.ok) isHeld.current = true
      setState(answer.ok ? { kind: 'changed' } : { kind: 'failed', message: answer.message })

      return
    }
    stamp.current = answer.data.stamp
    setState({ kind: 'saved', at: answer.data.at })
    if (pending.current !== null) void flush()
  }, [engine, realm, folder, id])

  const schedule = useCallback(
    (scene: Scene) => {
      pending.current = scene
      clearTimeout(timer.current)
      timer.current = setTimeout(() => void flush(), AUTOSAVE_MS)
    },
    [flush],
  )

  // A fresh read of the file: what's waiting is dropped, and saving resumes.
  const reset = useCallback((nextStamp: string) => {
    clearTimeout(timer.current)
    pending.current = null
    isHeld.current = false
    stamp.current = nextStamp
    setState({ kind: 'idle' })
  }, [])

  // Leaving the design, or closing the window, saves what's waiting.
  useEffect(() => {
    const closing = () => void flush()
    window.addEventListener('beforeunload', closing)

    return () => {
      window.removeEventListener('beforeunload', closing)
      void flush()
    }
  }, [flush])

  return { state, schedule, flush, reset, hasPending: () => pending.current !== null }
}
