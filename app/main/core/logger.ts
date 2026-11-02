import { appendFile } from 'node:fs/promises'

import type { Flavor } from './flavor'

export type Logger = {
  debug: (text: string) => void
  warn: (text: string) => void
  error: (text: string, err?: unknown) => void
}

const stackOf = (err: unknown): string => (err instanceof Error ? (err.stack ?? err.message) : String(err))

// The one logger. Dev writes everything; stage and prod warnings and errors.
export const createLogger = (flavor: Flavor, write: (line: string) => void): Logger => {
  const line = (level: string, text: string) => write(`${new Date().toISOString()} ${level} ${text}\n`)

  return {
    debug: text => {
      if (flavor === 'dev') line('debug', text)
    },
    warn: text => line('warn', text),
    error: (text, err) => line('error', err === undefined ? text : `${text}\n${stackOf(err)}`),
  }
}

// Lines go to a file, and to the terminal in dev. A log that can't be written
// has nowhere to report to, so it is dropped.
export const fileSink = (file: string, flavor: Flavor) => (line: string) => {
  if (flavor === 'dev') process.stderr.write(line)
  appendFile(file, line).catch(() => {})
}
