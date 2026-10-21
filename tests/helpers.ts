import type { On } from 'claude-code'
import type { Ports, View } from '../hooks/flow'
import type { Host } from '../hooks/host'
import type { Ctx, Task } from '../types'

let next = 0

// A task with every field filled; `over` sets what a test cares about.
export const makeTask = (over: Partial<Task> = {}): Task => {
  next += 1

  return {
    id: `t-${String(next).padStart(8, '0')}`,
    title: `Task ${next}`,
    state: 'queued',
    priority: 'mid',
    difficulty: { expected: 'medium', actual: null },
    messages: [],
    handoff: null,
    branch: null,
    baseBranch: null,
    startCommit: null,
    blockedBy: [],
    blockedReason: null,
    checkpoint: null,
    created: `2026-10-21T09:${String(next % 60).padStart(2, '0')}:00+02:00`,
    started: null,
    finished: null,
    minutesByDay: {},
    effort: {
      understandingMessages: 0,
      improvingMessages: 0,
      filesRead: 0,
      filesChanged: 0,
      linesAdded: 0,
      linesRemoved: 0,
      filesTouched: 0,
    },
    files: { read: [], changed: [] },
    ...over,
  }
}

export type Run = { stdout?: string; exitCode?: number }

// A host held in memory: files in a map, `mv` as a rename in that map, every
// other argv answered from `git` by `argv.join(' ')`; an argv it lacks exits 1.
export const memoryHost = (
  options: { files?: Record<string, string>; git?: Record<string, Run> } = {},
) => {
  const files = new Map(Object.entries(options.files ?? {}))
  const runs: string[][] = []
  const writes: string[] = []
  const git = { ...(options.git ?? {}) }
  const result = (exitCode: number, stdout = '') => ({ exitCode, stdout, stderr: '' })

  const host: Host = {
    exists: async path => files.has(path),
    read: async path => {
      const text = files.get(path)
      if (text === undefined) throw new Error(`ENOENT: ${path}`)

      return text
    },
    write: async (path, text) => {
      files.set(path, text)
      writes.push(path)
    },
    run: async argv => {
      runs.push([...argv])
      if (argv[0] === 'mv') {
        const from = argv[2]
        const to = argv[3]
        const text = from === undefined ? undefined : files.get(from)
        if (from === undefined || to === undefined || text === undefined) return result(1)
        files.delete(from)
        files.set(to, text)

        return result(0)
      }
      const run = git[argv.join(' ')]

      return run === undefined ? result(1) : result(run.exitCode ?? 0, run.stdout ?? '')
    },
    list: async dir =>
      [...files.keys()]
        .filter(path => path.startsWith(`${dir}/`))
        .map(path => path.slice(dir.length + 1))
        .filter(name => !name.includes('/')),
  }

  return { files, runs, writes, git, host }
}

// Answers the plugin's $.fs and $.process.run from a memory host, for tests
// that raise events.
export const answerHost = (on: On, mem: ReturnType<typeof memoryHost>) => {
  on('fs.exists', async (_, e) => ({ value: await mem.host.exists(e.path) }))
  on('fs.read', async (_, e) => ({ value: await mem.host.read(e.path) }))
  on('fs.write', async (_, e) => ({ value: await mem.host.write(e.path, e.text) }))
  on('process.run', async (_, e) => ({
    value: { ...(await mem.host.run([...e.argv])), isStdoutTruncated: false, isStderrTruncated: false },
  }))
}

// Ports held in memory for the flow: the view as a plain object, and what the
// flow cleared, submitted and toasted. `settle` runs the work it left for later.
export const fakePorts = (
  mem: ReturnType<typeof memoryHost>,
  options: { reply?: string; view?: Partial<View> } = {},
) => {
  const view: View = {
    record: null,
    load: 'ready',
    hold: null,
    band: { kind: 'none' },
    bandQueue: [],
    isAskingDone: false,
    isChoosingNext: false,
    openRow: null,
    isChecking: false,
    allowance: null,
    notice: null,
    spin: 0,
    canContinue: false,
    mismatch: null,
    checked: null,
    busy: null,
    warning: null,
    isPaletteOpen: false,
    blocking: null,
    budget: null,
    drift: [],
    others: [],
    ...options.view,
  }
  const done = { clears: 0, asUser: [] as boolean[], submits: [] as string[], toasts: [] as string[], logs: [] as string[], statuses: [] as (string | undefined)[] }
  const later: (() => Promise<void>)[] = []
  let id = 0
  const usage = { input_tokens: 1, output_tokens: 1, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 }
  const answer = (text: string | undefined) =>
    (text === undefined
      ? { isAnswered: false, reason: 'api-error', status: 500, error: 'api_error', usage }
      : { isAnswered: true, text, usage }) as never

  const ports: Ports = {
    host: mem.host,
    ask: {
      fork: async () => answer(options.reply),
      complete: async () => answer(options.reply),
      sleep: () => new Promise<void>(() => {}),
      log: text => done.logs.push(text),
    },
    clear: async () => {
      done.clears += 1
    },
    submit: async (text, asUser) => {
      done.submits.push(text)
      done.asUser.push(asUser === true)
    },
    toast: text => done.toasts.push(text),
    status: text => done.statuses.push(text),
    now: async () => Date.parse('2026-10-21T07:12:00Z'),
    later: work => later.push(work),
    newId: () => `t-${String((id += 1)).padStart(8, '0')}`,
    get: async key => view[key],
    set: async (key, value) => {
      view[key] = value
    },
    log: text => done.logs.push(text),
  }
  const settle = async () => {
    while (later.length > 0) await later.shift()!()
  }

  return { ports, view, done, settle }
}

export const CTX: Ctx = {
  cwd: '/p',
  projectPath: '/p',
  projectName: 'p',
  file: '/h/.queue-tie/projects/p-000000.json',
  offsetMinutes: 120,
  options: { idleGapMinutes: 15, freshAtTokens: 100000, handoffAtPercent: 90, checkTimeoutSeconds: 10 },
}
