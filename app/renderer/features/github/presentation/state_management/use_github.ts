import { useCallback, useEffect, useRef, useState } from 'preact/hooks'

import type { EngineApi, GithubView } from '../../../../../shared/engine_api'
import { ask } from '../../../../core/api/engine_client'
import type { Load } from '../../../workspace/state_management/workspace_store'

export type SignIn = { status: 'idle' } | { status: 'starting' } | { status: 'code'; code: string; note: string | null } | { status: 'same' } | { status: 'failed'; message: string }

const IDLE: SignIn = { status: 'idle' }

// The accounts gh knows and adding one. Read once, on opening: asking gh goes
// out to GitHub, so it doesn't run every time a record changes. A sign-in still
// running when this goes away is cancelled, so none outlives its dialog.
export const useGithub = (engine: EngineApi, onAdded?: (login: string) => void) => {
  const [accounts, setAccounts] = useState<Load<GithubView>>({ status: 'loading' })
  const [signIn, setSignIn] = useState<SignIn>(IDLE)
  const isAlive = useRef(true)
  const isRunning = useRef(false)
  const wasCancelled = useRef(false)
  const added = useRef(onAdded)
  added.current = onAdded

  const stop = useCallback(() => ask(engine, () => engine.cancelGithubLogin()), [engine])

  const read = useCallback(async () => {
    setAccounts({ status: 'loading' })
    const answer = await ask(engine, () => engine.readGithub())
    if (isAlive.current) setAccounts(answer.ok ? { status: 'ready', data: answer.data } : { status: 'failed', message: answer.message })
  }, [engine])

  useEffect(() => {
    void read()
  }, [read])
  useEffect(
    () => () => {
      isAlive.current = false
      if (isRunning.current) void stop()
    },
    [stop],
  )

  const add = async () => {
    if (isRunning.current) return
    isRunning.current = true
    wasCancelled.current = false
    setSignIn({ status: 'starting' })
    const started = await ask(engine, () => engine.startGithubLogin())
    if (!isAlive.current || wasCancelled.current) {
      // It finished starting after everyone stopped waiting for it.
      if (started.ok) void stop()
      isRunning.current = false

      return
    }
    if (!started.ok) {
      isRunning.current = false
      setSignIn({ status: 'failed', message: started.message })

      return
    }
    setSignIn({ status: 'code', code: started.data.code, note: null })
    const outcome = await ask(engine, () => engine.awaitGithubLogin())
    isRunning.current = false
    if (!isAlive.current || wasCancelled.current) return
    if (!outcome.ok) {
      setSignIn({ status: 'failed', message: outcome.message })

      return
    }
    setAccounts({ status: 'ready', data: outcome.data.view })
    setSignIn(outcome.data.added === null ? { status: 'same' } : IDLE)
    if (outcome.data.added !== null) added.current?.(outcome.data.added)
  }

  const openGithub = async (code: string) => {
    await ask(engine, () => engine.copyText(code))
    const opened = await ask(engine, () => engine.openGithubLogin())
    if (!opened.ok && isAlive.current) setSignIn({ status: 'code', code, note: opened.message })
  }

  const cancel = async () => {
    wasCancelled.current = true
    setSignIn(IDLE)
    await stop()
  }

  return { accounts, signIn, isSigningIn: signIn.status === 'starting' || signIn.status === 'code', read: () => void read(), add: () => void add(), openGithub: (code: string) => void openGithub(code), cancel: () => void cancel() }
}

export type Github = ReturnType<typeof useGithub>
