import { expect, mock, test } from 'claude-code/testing'
import type { On } from 'claude-code'
import type { Engine } from 'claude-code/testing'

import { emptyRecord, projectKey, recordPath } from '../hooks/record'
import type { ProjectRecord } from '../types'
import { answerHost, makeTask, memoryHost } from './helpers'
import type { Run } from './helpers'

const FILE = recordPath('/h', projectKey('/p'))
const OID = '# branch.oid 1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b'
const CLEAN = [OID, '# branch.head main', '# branch.upstream origin/main', '# branch.ab +0 -0', ''].join('\n')
const DIRTY = [OID, '# branch.head main', '# branch.upstream origin/main', '# branch.ab +2 -0', '? a', '? b', '? c', ''].join('\n')
const SURFACES = ['terminal', 'desktop'] as const
const PANE = {
  plugin: 'queue-tea',
  component: 'Pane',
  requestId: 'queue-tea',
  props: {
    title: 'Queue-tea · p',
    isFocused: false,
    bodyColumns: 60,
    placement: 'dock',
    scroll: { offset: 0, bodyRows: 30 },
    view: {},
  },
} as const
const BAND = {
  plugin: 'queue-tea',
  component: 'AbovePrompt',
  requestId: 'above-prompt',
  props: { hasSurvey: false, isWorking: false, maxRows: 12, bodyColumns: 60, scroll: { offset: 0, bodyRows: 12 }, view: {} },
} as const
const COMMAND = { origin: { kind: 'composer' }, presentation: { isFullscreen: true, columns: 120 } } as const
const usage = { input_tokens: 1, output_tokens: 1, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 }

// Everything beneath the plugin a session start needs, then the start.
const startSession = async (
  $: Engine,
  on: On,
  options: { file?: string; status?: string; git?: Record<string, Run>; reply?: string; tokens?: number } = {},
) => {
  const mem = memoryHost({
    files: options.file === undefined ? {} : { [FILE]: options.file },
    git: {
      'git rev-parse --show-toplevel': { stdout: '/p\n' },
      'date +%z': { stdout: '+0200\n' },
      'git rev-parse --is-inside-work-tree': { stdout: 'true\n' },
      ...(options.status === 'missing' ? {} : { 'git status --porcelain=v2 --branch': { stdout: options.status ?? CLEAN } }),
      'git branch --format=%(refname:short)': { stdout: 'main\n' },
      ...options.git,
    },
  })
  const seen = {
    toasts: [] as string[],
    submits: [] as string[],
    prompts: [] as { text: string; origin: unknown }[],
    clears: 0,
    forks: 0,
    commands: [] as string[],
    tools: [] as string[],
    logs: [] as string[],
  }
  const clock = mock.clock(on, { now: Date.parse('2026-10-21T07:12:00Z') })
  mock.env(on, { HOME: '/h' })
  on('prompt.submit', (_, e) => {
    seen.submits.push(e.text)
    seen.prompts.push({ text: e.text, origin: e.origin })

    return { text: e.text }
  })
  on('command.run', (_, e) => {
    if (e.command === 'clear') seen.clears += 1

    return { text: '' }
  })
  answerHost(on, mem)
  on('session.cwd', () => ({ value: '/p' }))
  on('tool.register', (_, e) => {
    seen.tools.push(e.name)

    return { value: { tool: `mcp__queue-tea__${e.name}` } }
  })
  on('command.register', (_, e) => {
    seen.commands.push(e.name)

    return { value: { command: e.name } }
  })
  on('session.usage', () => ({
    value: { context: { tokens: options.tokens ?? 1000, window: 1_000_000 }, rateLimits: [] } as never,
  }))
  on('turn.complete', () => ({ text: '', reason: 'end_turn', category: null, explanation: null }) as never)
  on('turn.start', (_, e) => ({ turnId: e.turnId }))
  on('ui.open', () => ({ value: { isPlaced: true } }))
  on('ui.status', () => ({ value: undefined }))
  on('ui.log', (_, e) => {
    seen.logs.push(e.text)

    return { value: undefined }
  })
  on('ui.toast', (_, e) => {
    seen.toasts.push(e.text)

    return { value: undefined }
  })
  on('model.fork', () => {
    seen.forks += 1
    const reply = options.reply

    return {
      value:
        reply === undefined
          ? ({ isAnswered: false, reason: 'api-error', status: 500, error: 'server_error', usage } as const)
          : { isAnswered: true as const, text: reply, usage },
    }
  })
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  await $.session.start({ cwd: '/p', surface: 'terminal', isInteractive: true })

  await clock.settle()

  return { mem, seen, clock }
}

const record = (over: Partial<ProjectRecord> = {}) => JSON.stringify({ ...emptyRecord('p', '/p'), ...over })

test('loading shows the turning character and Reading your queue…', async $ => {
  for (const surface of SURFACES) {
    const ui = await $.ui.mount({ ...PANE, surface })

    expect((await ui.find({ type: 'Text', text: /Reading your queue…/ }))?.text).toMatch(/^[◐◓◑◒] Reading your queue…$/)
    await ui.unmount()
  }
})

test('empty shows the empty line', async ($, on) => {
  await startSession($, on)
  for (const surface of SURFACES) {
    const ui = await $.ui.mount({ ...PANE, surface })

    expect(
      await ui.find({ type: 'Text', text: "Nothing queued yet. Tell me what you're working on and it becomes the first task." }),
    ).toBeDefined()
    await ui.unmount()
  }
})

test("failed shows Couldn't read your task record and Try again", async ($, on) => {
  await startSession($, on, { file: '{bad' })
  for (const surface of SURFACES) {
    const ui = await $.ui.mount({ ...PANE, surface })

    expect(await ui.find({ type: 'Text', text: "Couldn't read your task record" })).toBeDefined()
    expect(await ui.find({ key: 'retry' })).toBeDefined()
    await ui.unmount()
  }
})

test('after a /clear the record is read again', async ($, on) => {
  on('classic.SessionStart', () => ({}))
  const { mem } = await startSession($, on, { file: record() })
  const task = makeTask({ title: 'Filed in another session', priority: 'high' })
  mem.files.set(FILE, record({ tasks: [task] }))

  await $.classic.SessionStart({ source: 'clear' })
  for (const surface of SURFACES) {
    const ui = await $.ui.mount({ ...PANE, surface })

    expect(await ui.find({ type: 'Text', text: /Reading your queue…/ })).toBeUndefined()
    expect((await ui.find({ key: `row:${task.id}` }))?.text).toMatch(/^★ \[high\] Filed in another session/)
    await ui.unmount()
  }
})

test('Up next is in priority order with the suggestion marked', async ($, on) => {
  const tasks = [
    makeTask({ title: 'Later', priority: 'low' }),
    makeTask({ title: 'Soon', priority: 'urgent' }),
    makeTask({ title: 'Now', state: 'current' }),
  ]
  await startSession($, on, { file: record({ tasks }) })
  for (const surface of SURFACES) {
    const ui = await $.ui.mount({ ...PANE, surface })
    const first = await ui.find({ key: `row:${tasks[1]!.id}` })
    const second = await ui.find({ key: `row:${tasks[0]!.id}` })

    expect(first?.text).toMatch(/^★ \[urgent\] Soon/)
    expect(second?.text).toMatch(/^ {2}\[low\] Later/)
    await ui.unmount()
  }
})

test('a held start shows what is left and Check again', async ($, on) => {
  const { mem } = await startSession($, on, { file: record(), status: DIRTY })
  await $.command.run({ command: 'steep', args: 'add dark mode', ...COMMAND })
  for (const surface of SURFACES) {
    const band = await $.ui.mount({ ...BAND, surface })
    await band.press({ key: 'save' })
    await band.unmount()
    const ui = await $.ui.mount({ ...PANE, surface })

    expect(await ui.find({ type: 'Text', text: '3 files not committed · 2 commits not pushed' })).toBeDefined()
    expect(await ui.find({ key: 'check-again' })).toBeDefined()
    await ui.unmount()
    break
  }
  expect(mem.runs.some(argv => argv.includes('switch'))).toBe(false)
})

test('Is this done for now? Yes leads to the difficulty band', async ($, on) => {
  const task = makeTask({ title: 'Now', state: 'current' })
  await startSession($, on, { file: record({ tasks: [task] }) })
  await $.tool.call({ tool: 'mcp__queue-tea__task_looks_done' })
  for (const surface of SURFACES) {
    const ui = await $.ui.mount({ ...PANE, surface })
    expect(await ui.find({ type: 'Text', text: /Is this done for now\?/ })).toBeDefined()
    await ui.press({ key: 'done-yes' })
    await ui.unmount()

    const band = await $.ui.mount({ ...BAND, surface })
    expect(await band.find({ key: 'diff:hard' })).toBeDefined()
    expect(await band.find({ key: 'save-difficulty' })).toBeDefined()
    await band.unmount()
    break
  }
})

test('the file band: pick high and hard, Save, toast Queued: … (high)', async ($, on) => {
  const task = makeTask({ title: 'Now', state: 'current' })
  const { seen, mem } = await startSession($, on, {
    file: record({ tasks: [task] }),
    reply: '{"kind":"new","intent":"improving","title":"Dark mode","difficulty":"light"}',
  })
  await $.prompt.submit({ text: 'add dark mode', wait: false, origin: { kind: 'composer' } })

  for (const surface of SURFACES) {
    const band = await $.ui.mount({ ...BAND, surface })
    expect(await band.find({ type: 'Text', text: /New task: Dark mode/ })).toBeDefined()
    await band.press({ key: 'prio:high' })
    await band.press({ key: 'diff:hard' })
    await band.press({ key: 'save' })
    await band.unmount()
    break
  }

  expect(seen.toasts).toEqual(['Queued: Dark mode (high)'])
  const saved = (JSON.parse(mem.files.get(FILE)!) as ProjectRecord).tasks.find(t => t.title === 'Dark mode')
  expect([saved?.priority, saved?.difficulty.expected, saved?.state]).toEqual(['high', 'hard', 'queued'])
})

test("the unsure band without a check says the check didn't run", async ($, on) => {
  await startSession($, on, { file: record() })
  await $.prompt.submit({ text: 'hmm', wait: false, origin: { kind: 'composer' } })

  for (const surface of SURFACES) {
    const band = await $.ui.mount({ ...BAND, surface })
    expect(await band.find({ type: 'Text', text: "The check didn't run, so pick one." })).toBeDefined()
    expect(await band.find({ key: 'same-task' })).toBeDefined()
    expect(await band.find({ key: 'new-task' })).toBeDefined()
    expect(await band.find({ key: 'quick-question' })).toBeDefined()
    await band.unmount()
  }
})

test('/steep files without a check', async ($, on) => {
  await startSession($, on, { file: record() })
  const answer = await $.command.run({ command: 'steep', args: 'add dark mode', ...COMMAND })

  expect(JSON.stringify(answer)).toContain('band above the prompt')
  const band = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect(await band.find({ type: 'Text', text: /New task: add dark mode/ })).toBeDefined()
  await band.unmount()
})

test('a subagent finishing writes no handoff note and clears nothing', async ($, on) => {
  const task = makeTask({ title: 'Now', state: 'current' })
  const { seen, clock } = await startSession($, on, { file: record({ tasks: [task] }), tokens: 200_000, reply: 'note' })
  const turn = { answer: '', durationMs: 1, isAborted: false, turnId: 't1', reason: 'end_turn', category: null, explanation: null }

  await $.turn.complete({ ...turn, agentId: 'a1' } as never)
  await clock.settle()
  expect(seen.forks).toBe(0)
  expect(seen.clears).toBe(0)

  await $.turn.complete(turn as never)
  await clock.settle()
  expect(seen.forks).toBe(1)
  expect(seen.clears).toBe(1)
})

test('a git error at the start still registers the tool and the commands', async ($, on) => {
  const task = makeTask({ title: 'Now', state: 'current', branch: 'task/now' })
  const { seen } = await startSession($, on, { file: record({ tasks: [task] }), status: 'missing' })

  expect(seen.tools).toEqual(['task_looks_done'])
  expect(seen.commands).toEqual(['queue-tea', 'done', 'steep', 'brew', 'instant', 'tea'])
})

const DAY_ONE = '2026-10-21'
const HANDOFF = [
  'Overview:',
  '- Redesign the panel',
  'What changed:',
  '- Wrote the bars',
  'Current state:',
  '- On task/now, 2 files not committed, 130 tests pass',
  'Decisions:',
  '- Stacked sections',
  'Next steps:',
  '- Write the spec',
].join('\n')

test('the board: a bar per section with its count, the done list and the week chart', async ($, on) => {
  const tasks = [
    makeTask({ title: 'Now', state: 'current', priority: 'high', branch: 'task/now', minutesByDay: { '2026-10-20': 30 } }),
    makeTask({ title: 'Waiting', priority: 'urgent' }),
    makeTask({ title: 'Finished', state: 'done', finished: '2026-10-21T08:00:00+02:00', minutesByDay: { [DAY_ONE]: 60 } }),
  ]
  await startSession($, on, { file: record({ tasks }) })
  for (const surface of SURFACES) {
    const ui = await $.ui.mount({ ...PANE, surface })

    expect(await ui.find({ type: 'Text', text: /▶ In progress \(1\)/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /○ Up next \(1\)/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /✓ Done this week \(1\) · 1h 30m/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /Finished · done 1h/ })).toBeDefined()
    expect((await ui.find({ type: 'Text', text: /^M / }))?.text).toBe('M    T ▄  W █  T    F    S    S  ')
    expect(await ui.find({ key: 'done' })).toBeDefined()
    expect(await ui.find({ key: 'back' })).toBeDefined()
    await ui.unmount()
  }
})

test('the palette lists what can be done now, and p goes back to the board', async ($, on) => {
  const tasks = [makeTask({ title: 'Waiting', priority: 'urgent' })]
  await startSession($, on, { file: record({ tasks }) })
  const ui = await $.ui.mount({ ...PANE, surface: 'terminal' })
  await ui.press({ key: 'palette' })

  expect(await ui.find({ key: 'palette:start-next' })).toBeDefined()
  expect(await ui.find({ key: 'palette:done' })).toBeUndefined()
  expect(await ui.find({ key: 'new-task' })).toBeDefined()
  await ui.press({ key: 'palette' })
  expect(await ui.find({ key: 'palette:start-next' })).toBeUndefined()
  expect(await ui.find({ key: 'start-next' })).toBeDefined()
  await ui.unmount()
})

test('Continue shows the handoff note as numbered sections', async ($, on) => {
  const task = makeTask({
    title: 'Now',
    state: 'current',
    handoff: { text: HANDOFF, written: '2026-10-21T08:30:00+02:00' },
  })
  await startSession($, on, { file: record({ tasks: [task] }) })
  for (const surface of SURFACES) {
    const ui = await $.ui.mount({ ...PANE, surface })

    expect(await ui.find({ type: 'Text', text: /Handoff note · 08:30/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: '1 Overview' })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: '5 Next steps' })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: '☐ Write the spec' })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: '✓ Wrote the bars' })).toBeDefined()
    expect(await ui.find({ key: 'continue' })).toBeDefined()
    await ui.unmount()
  }
})

test('task_looks_done with what Claude checked shows it beside the question', async ($, on) => {
  const task = makeTask({ title: 'Now', state: 'current' })
  await startSession($, on, { file: record({ tasks: [task] }) })
  await $.tool.call({ tool: 'mcp__queue-tea__task_looks_done', checked: 'ran the tests: 130 pass' } as never)
  const ui = await $.ui.mount({ ...PANE, surface: 'terminal' })

  expect(await ui.find({ type: 'Text', text: 'Claude checked: ran the tests: 130 pass' })).toBeDefined()
  await ui.press({ key: 'done-not-yet' })
  expect(await ui.find({ type: 'Text', text: /Claude checked/ })).toBeUndefined()
  await ui.unmount()
})

test('Back to queue saves a handoff note and puts the task in Up next on its branch', async ($, on) => {
  const task = makeTask({ title: 'Now', state: 'current', branch: 'task/now', startCommit: '1a2b3c4' })
  const { mem, seen, clock } = await startSession($, on, {
    file: record({ tasks: [task] }),
    reply: HANDOFF,
    git: { 'git log -1 --format=%h %s': { stdout: '1a2b3c4 Add bars\n' } },
  })
  const ui = await $.ui.mount({ ...PANE, surface: 'terminal' })
  await ui.press({ key: 'back' })
  await clock.settle()

  const saved = (JSON.parse(mem.files.get(FILE)!) as ProjectRecord).tasks[0]!
  expect([saved.state, saved.branch, saved.startCommit, saved.handoff?.text]).toEqual(['queued', 'task/now', '1a2b3c4', HANDOFF])
  expect(seen.forks).toBe(1)
  expect(seen.toasts).toEqual(['Back in the backlog: Now'])
  expect((await ui.find({ key: `row:${task.id}` }))?.text).toMatch(/^★ \[mid\] Now/)
  expect(await ui.find({ type: 'Text', text: /task\/now/ })).toBeDefined()
  await ui.unmount()
})

test('a commit made during a turn is named in the panel', async ($, on) => {
  const task = makeTask({ title: 'Now', state: 'current', branch: 'task/now' })
  const { mem, seen, clock } = await startSession($, on, {
    file: record({ tasks: [task] }),
    git: {
      'git rev-parse HEAD': { stdout: 'aaaaaaa\n' },
      'git symbolic-ref --short -q HEAD': { stdout: 'task/now\n' },
      'git log --format=%h %s aaaaaaa..bbbbbbb': { stdout: 'bbbbbbb Sneaky commit\n' },
    },
  })
  const turn = { answer: '', durationMs: 1, isAborted: false, turnId: 't1', reason: 'end_turn', category: null, explanation: null }

  await $.turn.start({ text: 'go', turnId: 't1' })
  mem.git['git rev-parse HEAD'] = { stdout: 'bbbbbbb\n' }
  await $.turn.complete(turn as never)
  await clock.settle()

  expect(seen.toasts).toEqual(['Queue-tea: a commit appeared: bbbbbbb Sneaky commit'])
  const ui = await $.ui.mount({ ...PANE, surface: 'terminal' })
  expect(await ui.find({ type: 'Text', text: /During the last turn a commit appeared: bbbbbbb Sneaky commit/ })).toBeDefined()
  await ui.press({ key: 'dismiss-warning' })
  expect(await ui.find({ type: 'Text', text: /During the last turn/ })).toBeUndefined()
  await ui.unmount()
})

const TURN = { answer: '', durationMs: 1, isAborted: false, turnId: 't1', reason: 'end_turn', category: null, explanation: null }
const NEW_REPLY = '{"kind":"new","intent":"improving","title":"Dev server","difficulty":"light"}'
// A git command that makes or changes the branch; listing them is neither.
const isBranchRun = (argv: string[]) => argv[0] === 'git' && ['switch', 'checkout'].includes(argv[1] ?? '')
const noteOf = (answer: { context?: readonly string[] }) => (answer.context ?? []).join('\n')

// The turn the engine runs for a submitted prompt: its start, then its end.
const runTurn = async ($: Engine, clock: { settle: () => Promise<void> }, text: string, turnId = 't1') => {
  await $.turn.start({ text, turnId })
  await $.turn.complete({ ...TURN, turnId } as never)
  await clock.settle()
}

test('/brew sends the request as Rohan’s, outside the queue: no check, no task, no branch, no clear', async ($, on) => {
  const task = makeTask({ title: 'Fix login', state: 'current', branch: 'task/fix-login' })
  const { seen, mem, clock } = await startSession($, on, { file: record({ tasks: [task] }), reply: NEW_REPLY })
  const runs = mem.runs.length

  const answer = await $.command.run({ command: 'brew', args: ' start the dev server and tell me its URL ', ...COMMAND })
  await clock.settle()

  expect(answer.text).toBe('Brewing now, outside the queue.')
  expect(noteOf(answer)).toContain('Rohan ran /brew')
  expect(noteOf(answer)).toContain('"Fix login"')
  expect(seen.logs).toEqual([])
  expect(seen.prompts).toEqual([
    { text: 'start the dev server and tell me its URL', origin: { kind: 'plugin', name: 'queue-tea', asUser: true } },
  ])

  await runTurn($, clock, 'start the dev server and tell me its URL')
  expect(seen.forks).toBe(0)
  expect(seen.clears).toBe(0)
  expect(mem.runs.slice(runs).filter(isBranchRun)).toEqual([])
  expect((JSON.parse(mem.files.get(FILE)!) as ProjectRecord).tasks.map(t => [t.title, t.state, t.branch])).toEqual([
    ['Fix login', 'current', 'task/fix-login'],
  ])
})

test('/brew with nothing after it says what to write and sends nothing', async ($, on) => {
  const { seen, clock } = await startSession($, on, { file: record() })

  const answer = await $.command.run({ command: 'brew', args: '  ', ...COMMAND })
  await clock.settle()

  expect(answer.text).toBe('Write what you want after the command: /brew <request>')
  expect(answer.context).toBeUndefined()
  expect(seen.prompts).toEqual([])
})

test('/instant is /brew, and /tea asks for an answer that changes no files', async ($, on) => {
  const { seen, clock } = await startSession($, on, { file: record() })

  const instant = await $.command.run({ command: 'instant', args: 'run the tests', ...COMMAND })
  await clock.settle()
  await runTurn($, clock, 'run the tests')
  const tea = await $.command.run({ command: 'tea', args: 'how do I start the server?', ...COMMAND })
  await clock.settle()

  expect(tea.text).toBe('Pouring an answer, outside the queue.')
  expect(seen.prompts.map(p => p.text)).toEqual(['run the tests', 'how do I start the server?'])
  expect(noteOf(instant)).toContain('Rohan ran /brew')
  expect(noteOf(tea)).toContain('Rohan ran /tea')
  expect(noteOf(tea)).toContain('change no files')
  expect(seen.forks).toBe(0)
})

test('during a /brew turn task_looks_done asks nothing; after it, it asks again', async ($, on) => {
  const task = makeTask({ title: 'Now', state: 'current' })
  const { clock } = await startSession($, on, { file: record({ tasks: [task] }) })
  const asksDone = async () => {
    const ui = await $.ui.mount({ ...PANE, surface: 'terminal' })
    const found = await ui.find({ type: 'Text', text: /Is this done for now\?/ })
    await ui.unmount()

    return found !== undefined
  }

  await $.command.run({ command: 'brew', args: 'start the server', ...COMMAND })
  await clock.settle()
  await $.turn.start({ text: 'start the server', turnId: 't1' })
  const during = await $.tool.call({ tool: 'mcp__queue-tea__task_looks_done' })
  expect(JSON.stringify(during)).toContain('errand')
  expect(await asksDone()).toBe(false)

  await $.turn.complete(TURN as never)
  await clock.settle()
  await $.tool.call({ tool: 'mcp__queue-tea__task_looks_done' })
  expect(await asksDone()).toBe(true)
})

test('a /brew turn past the size starts no fresh conversation; the next turn does', async ($, on) => {
  const task = makeTask({ title: 'Now', state: 'current' })
  const { seen, clock } = await startSession($, on, { file: record({ tasks: [task] }), tokens: 200_000, reply: 'note' })

  await $.command.run({ command: 'brew', args: 'start the server', ...COMMAND })
  await clock.settle()
  await runTurn($, clock, 'start the server')
  expect(seen.forks).toBe(0)
  expect(seen.clears).toBe(0)

  await runTurn($, clock, 'and the tests?', 't2')
  expect(seen.forks).toBe(1)
  expect(seen.clears).toBe(1)
})

test('a message typed after /brew is checked as before', async ($, on) => {
  const { seen, clock } = await startSession($, on, { file: record(), reply: NEW_REPLY })

  await $.command.run({ command: 'brew', args: 'start the server', ...COMMAND })
  await clock.settle()
  await runTurn($, clock, 'start the server')
  await $.prompt.submit({ text: 'start the server', wait: false, origin: { kind: 'composer' } })

  expect(seen.forks).toBe(1)
  expect(seen.prompts.map(p => p.text)).toEqual(['start the server'])
})
