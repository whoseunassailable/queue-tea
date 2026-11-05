import { spawn } from 'node:child_process'
import type { RunResult } from '../../../hooks/core/host/host'
import type { Logger } from './logger'

export type ProcessRequest = { argv: string[]; cwd: string; env?: NodeJS.ProcessEnv; signal?: AbortSignal; timeoutMs?: number }
export type OutputSink = (chunk: string) => void
const OUTPUT_LIMIT = 64_000
const KILL_GRACE_MS = 2_000
const running = new Set<() => void>()
export const stopProcesses = () => { for (const stop of running) stop() }
// One process group per user action. Stream before exit; stop children too on
// cancellation/timeouts. Output stays bounded even for a very noisy command.
export const streamProcess = (log: Logger, request: ProcessRequest, output?: OutputSink): Promise<RunResult> => new Promise(resolve => {
  let stdout = ''; let stderr = ''; let stopped = false; let settled = false
  const child = spawn(request.argv[0]!, request.argv.slice(1), { cwd: request.cwd, env: { ...process.env, ...request.env }, detached: process.platform !== 'win32', stdio: ['ignore', 'pipe', 'pipe'] })
  let force: ReturnType<typeof setTimeout> | undefined
  const kill = (signal: NodeJS.Signals) => {
    try {
      if (child.pid) process.platform === 'win32' ? child.kill(signal) : process.kill(-child.pid, signal)
    } catch (err) { if ((err as NodeJS.ErrnoException).code !== 'ESRCH') log.error('stopping a process failed', err) }
  }
  const stop = () => {
    if (stopped || settled) return
    stopped = true; kill('SIGTERM'); force = setTimeout(() => kill('SIGKILL'), KILL_GRACE_MS)
  }
  running.add(stop)
  const timeout = request.timeoutMs ? setTimeout(stop, request.timeoutMs) : undefined
  const finish = (exitCode: number) => {
    if (settled) return
    settled = true; running.delete(stop); clearTimeout(timeout); clearTimeout(force); request.signal?.removeEventListener('abort', stop)
    resolve({ exitCode: stopped ? 130 : exitCode, stdout, stderr })
  }
  const chunk = (text: string, isError: boolean) => {
    if (isError) stderr = (stderr + text).slice(-OUTPUT_LIMIT); else stdout = (stdout + text).slice(-OUTPUT_LIMIT)
    try { output?.(text) } catch (err) { log.error('streaming process output failed', err); stop() }
  }
  child.stdout.setEncoding('utf8').on('data', (text: string) => chunk(text, false))
  child.stderr.setEncoding('utf8').on('data', (text: string) => chunk(text, true))
  child.on('error', err => { log.error('starting a process failed', err); stderr = err.message; finish(1) })
  child.on('close', code => finish(code ?? 1))
  request.signal?.addEventListener('abort', stop, { once: true })
  if (request.signal?.aborted) stop()
})
