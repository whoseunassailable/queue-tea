import { expect, mock, test } from 'claude-code/testing'
import type { On } from 'claude-code'
import type { Engine } from 'claude-code/testing'

import { emptyCheckpoint } from '../hooks/checkpoint'
import { emptyRecord, projectKey, recordPath } from '../hooks/record'
import type { MenuView, ProjectRecord } from '../types'
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
  options: {
    file?: string
    others?: Record<string, string>
    status?: string
    git?: Record<string, Run>
    reply?: string
    tokens?: number
  } = {},
) => {
  const mem = memoryHost({
    files: { ...options.others, ...(options.file === undefined ? {} : { [FILE]: options.file }) },
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
    opens: [] as unknown[],
    closes: [] as string[],
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
  on('ui.open', (_, e) => {
    seen.opens.push(e)

    return { value: { isPlaced: true } }
  })
  on('ui.close', (_, e) => {
    seen.closes.push(e.id)

    return { value: undefined }
  })
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

// The menu pane on one of its views, reached the way Rohan reaches it: back
// to the list when a view shows, then the view's entry.
const mountView = async ($: Engine, surface: (typeof SURFACES)[number], view: MenuView) => {
  const ui = await $.ui.mount({ ...PANE, surface })
  if ((await ui.find({ key: 'menu:back' })) !== undefined) await ui.press({ key: 'menu:back' })
  if (view !== 'menu') await ui.press({ key: `menu:${view}` })

  return ui
}

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
    const ui = await mountView($, surface, 'backlog')

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
    const ui = await mountView($, surface, 'backlog')
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
    const ui = await mountView($, surface, 'current')

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
    const ui = await mountView($, surface, 'current')
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

test('the views: a bar each with its count, the done list and the week chart', async ($, on) => {
  const tasks = [
    makeTask({ title: 'Now', state: 'current', priority: 'high', branch: 'task/now', minutesByDay: { '2026-10-20': 30 } }),
    makeTask({ title: 'Waiting', priority: 'urgent' }),
    makeTask({ title: 'Finished', state: 'done', finished: '2026-10-21T08:00:00+02:00', minutesByDay: { [DAY_ONE]: 60 } }),
  ]
  await startSession($, on, { file: record({ tasks }) })
  for (const surface of SURFACES) {
    let ui = await mountView($, surface, 'current')
    expect(await ui.find({ type: 'Text', text: /▶ In progress \(1\)/ })).toBeDefined()
    expect(await ui.find({ key: 'done' })).toBeDefined()
    expect(await ui.find({ key: 'back' })).toBeDefined()
    await ui.unmount()

    ui = await mountView($, surface, 'backlog')
    expect(await ui.find({ type: 'Text', text: /○ Backlog \(1\)/ })).toBeDefined()
    await ui.unmount()

    ui = await mountView($, surface, 'history')
    expect(await ui.find({ type: 'Text', text: /✓ Done this week \(1\) · 1h 30m/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /Finished · done 1h/ })).toBeDefined()
    expect((await ui.find({ type: 'Text', text: /^M / }))?.text).toBe('M    T ▄  W █  T    F    S    S  ')
    await ui.unmount()
  }
})

test('the backlog has a New task field that files what is typed', async ($, on) => {
  const tasks = [makeTask({ title: 'Waiting', priority: 'urgent' })]
  await startSession($, on, { file: record({ tasks }) })
  const ui = await mountView($, 'terminal', 'backlog')

  await ui.input({ key: 'new-task', text: 'Write the docs' })
  const band = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect(await band.find({ type: 'Text', text: /New task: Write the docs/ })).toBeDefined()
  await band.unmount()
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
    const ui = await mountView($, surface, 'current')

    expect(await ui.find({ type: 'Text', text: /Handoff note · 08:30/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: '1 Overview' })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: '5 Next steps' })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: '☐ Write the spec' })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: '✓ Wrote the bars' })).toBeDefined()
    expect(await ui.find({ key: 'continue' })).toBeDefined()
    await ui.unmount()
  }
})

test('Continue shows the checkpoint Claude wrote, as numbered sections', async ($, on) => {
  const task = makeTask({
    title: 'Now',
    state: 'current',
    checkpoint: {
      ...emptyCheckpoint(),
      written: '2026-10-21T08:45:00+02:00',
      goal: 'Show the checkpoint on the card',
      changes: ['Read the card in menu.tsx'],
      remaining: ['Write the test'],
      nextAction: 'Run the tests',
    },
  })
  await startSession($, on, { file: record({ tasks: [task] }) })
  for (const surface of SURFACES) {
    const ui = await mountView($, surface, 'current')

    expect(await ui.find({ type: 'Text', text: /Checkpoint · 08:45/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: '1 Goal' })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: 'Show the checkpoint on the card' })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: '✓ Read the card in menu.tsx' })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: '☐ Write the test' })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: '4 Next action' })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: '☐ Run the tests' })).toBeDefined()
    expect(await ui.find({ key: 'continue' })).toBeDefined()
    await ui.unmount()
  }
})

test('task_looks_done with what Claude checked shows it beside the question', async ($, on) => {
  const task = makeTask({ title: 'Now', state: 'current' })
  await startSession($, on, { file: record({ tasks: [task] }) })
  await $.tool.call({ tool: 'mcp__queue-tea__task_looks_done', checked: 'ran the tests: 130 pass' } as never)
  const ui = await mountView($, 'terminal', 'current')

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
  const ui = await mountView($, 'terminal', 'current')
  await ui.press({ key: 'back' })
  await clock.settle()

  const saved = (JSON.parse(mem.files.get(FILE)!) as ProjectRecord).tasks[0]!
  expect([saved.state, saved.branch, saved.startCommit, saved.handoff?.text]).toEqual(['queued', 'task/now', '1a2b3c4', HANDOFF])
  expect(seen.forks).toBe(1)
  expect(seen.toasts).toEqual(['Back in the backlog: Now'])
  await ui.press({ key: 'menu:back' })
  await ui.press({ key: 'menu:backlog' })
  expect((await ui.find({ key: `row:${task.id}` }))?.text).toMatch(/^★ \[mid\] Now/)
  expect(await ui.find({ type: 'Text', text: /task\/now/ })).toBeDefined()
  await ui.unmount()
})

test('a commit made during a turn is named in the menu', async ($, on) => {
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
    const ui = await mountView($, 'terminal', 'current')
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

// The held message's band: Cancel, and where a message sent on counts.

// The prompt box beneath the plugin: what it holds, and what is put in it.
const promptBox = (on: On, draft: string) => {
  const fills: { text: string; mode: string }[] = []
  on('prompt.read', () => ({ value: { text: draft, cursor: draft.length } }))
  on('prompt.fill', (_, e) => {
    fills.push({ text: e.text, mode: e.mode })

    return { isFilled: true }
  })

  return fills
}

test('Cancel on a held new task sends nothing, files nothing, and puts the message back in the empty prompt box', async ($, on) => {
  const task = makeTask({ title: 'Now', state: 'current' })
  const fills = promptBox(on, '')
  const { seen, mem } = await startSession($, on, { file: record({ tasks: [task] }), reply: NEW_REPLY })
  await $.prompt.submit({ text: 'start the dev server', wait: false, origin: { kind: 'composer' } })

  const band = await $.ui.mount({ ...BAND, surface: 'terminal' })
  await band.press({ key: 'cancel' })
  expect(await band.find({ type: 'Text', text: /New task: Dev server/ })).toBeUndefined()
  await band.unmount()

  expect(seen.prompts).toEqual([])
  expect(fills).toEqual([{ text: 'start the dev server', mode: 'append' }])
  expect((JSON.parse(mem.files.get(FILE)!) as ProjectRecord).tasks.map(t => t.title)).toEqual(['Now'])
})

test('Cancel on the unsure band leaves a draft typed since alone, and the next band goes up', async ($, on) => {
  const fills = promptBox(on, 'half typed')
  const { seen } = await startSession($, on, { file: record() })
  await $.prompt.submit({ text: 'hmm', wait: false, origin: { kind: 'composer' } })
  await $.prompt.submit({ text: 'and this', wait: false, origin: { kind: 'composer' } })

  const band = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect(await band.find({ type: 'Text', text: 'hmm' })).toBeDefined()
  await band.press({ key: 'cancel' })
  expect(await band.find({ type: 'Text', text: 'and this' })).toBeDefined()
  await band.unmount()

  expect(seen.prompts).toEqual([])
  expect(fills).toEqual([])
})

test('Quick question sends the message as Rohan’s; its time goes to the project and it is not counted', async ($, on) => {
  const task = makeTask({ title: 'Now', state: 'current' })
  const { seen, mem, clock } = await startSession($, on, {
    file: record({ tasks: [task] }),
    reply: '{"kind":"unsure","intent":"understanding"}',
  })
  await $.prompt.submit({ text: 'what does this error mean?', wait: false, origin: { kind: 'composer' } })

  const band = await $.ui.mount({ ...BAND, surface: 'terminal' })
  await band.press({ key: 'quick-question' })
  await band.unmount()
  await clock.advance(5 * 60_000)
  await runTurn($, clock, 'what does this error mean?')

  expect(seen.prompts).toEqual([
    { text: 'what does this error mean?', origin: { kind: 'plugin', name: 'queue-tea', asUser: true } },
  ])
  const saved = JSON.parse(mem.files.get(FILE)!) as ProjectRecord
  expect(saved.unassignedMinutesByDay).toEqual({ [DAY_ONE]: 5 })
  expect(saved.tasks[0]!.minutesByDay).toEqual({})
  expect(saved.tasks[0]!.effort.understandingMessages).toBe(0)
})

test('Same task on the unsure band counts the message once, and its time goes to the task', async ($, on) => {
  const task = makeTask({ title: 'Now', state: 'current' })
  const { mem, clock } = await startSession($, on, {
    file: record({ tasks: [task] }),
    reply: '{"kind":"unsure","intent":"understanding"}',
  })
  await $.prompt.submit({ text: 'why does it fail?', wait: false, origin: { kind: 'composer' } })

  const band = await $.ui.mount({ ...BAND, surface: 'terminal' })
  await band.press({ key: 'same-task' })
  await band.unmount()
  await clock.advance(5 * 60_000)
  await runTurn($, clock, 'why does it fail?')

  const saved = JSON.parse(mem.files.get(FILE)!) as ProjectRecord
  expect(saved.tasks[0]!.minutesByDay).toEqual({ [DAY_ONE]: 5 })
  expect(saved.tasks[0]!.effort.understandingMessages).toBe(1)
})

// The tea cup above the prompt and the menu it opens.

const ENTRIES = ['brew', 'backlog', 'current', 'history', 'usage', 'settings'] as const
const SAME_REPLY = '{"kind":"same","intent":"improving"}'
const FOCUSED = { ...PANE, props: { ...PANE.props, isFocused: true } }
const recordOf = (mem: ReturnType<typeof memoryHost>) => JSON.parse(mem.files.get(FILE)!) as ProjectRecord

test('/queue-tea opens the menu asking for the keys, so Esc closes it; opening it files nothing', async ($, on) => {
  const task = makeTask({ title: 'Now', state: 'current', branch: 'task/now' })
  const { mem, seen } = await startSession($, on, { file: record({ tasks: [task] }) })
  const before = mem.files.get(FILE)
  expect(seen.opens).toEqual([])

  const answer = await $.command.run({ command: 'queue-tea', args: '', ...COMMAND })
  expect(answer.text).toBe('Queue-tea menu opened.')
  expect(seen.opens[0]).toMatchObject({ id: 'queue-tea', focus: true, closeOnEscape: true })

  const ui = await $.ui.mount({ ...FOCUSED, surface: 'terminal' })
  for (const [i, view] of ENTRIES.entries()) {
    expect((await ui.find({ key: `menu:${view}` }))?.props.hotkey).toBe(String(i + 1))
  }
  expect((await ui.find({ key: 'menu:brew' }))?.props.autoFocus).toBe(true)
  expect(await ui.find({ type: 'Text', text: '1–6 pick · tab move · enter press · esc close' })).toBeDefined()
  await ui.unmount()

  expect(mem.files.get(FILE)).toBe(before)
  expect(recordOf(mem).tasks.length).toBe(1)
  expect(seen.prompts).toEqual([])
})

test('keyboard: every view has m back to the list, and a closed menu opens on the list again', async ($, on) => {
  const { seen } = await startSession($, on, { file: record({ tasks: [makeTask({ title: 'Waiting' })] }) })
  await $.command.run({ command: 'queue-tea', args: '', ...COMMAND })
  const ui = await $.ui.mount({ ...FOCUSED, surface: 'terminal' })

  for (const view of ENTRIES) {
    await ui.press({ key: `menu:${view}` })
    expect((await ui.find({ key: 'menu:back' }))?.props.hotkey).toBe('m')
    expect(await ui.find({ key: 'menu:brew' })).toBeUndefined()
    expect(await ui.find({ type: 'Text', text: 'm menu · tab move · enter press · esc close' })).toBeDefined()
    await ui.press({ key: 'menu:back' })
    expect(await ui.find({ key: 'menu:brew' })).toBeDefined()
  }

  await ui.press({ key: 'menu:history' })
  const band = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect((await band.find({ key: 'cup-menu' }))?.text).toBe('Close menu')
  await band.press({ key: 'cup-menu' })
  expect(seen.closes).toEqual(['queue-tea'])
  expect((await band.find({ key: 'cup-menu' }))?.text).toBe('Menu')
  await band.unmount()

  await $.command.run({ command: 'queue-tea', args: '', ...COMMAND })
  expect(await ui.find({ key: 'menu:brew' })).toBeDefined()
  await ui.unmount()
})

test('docked 46 columns wide, the list and the hint without the keys fit uncut', async ($, on) => {
  await startSession($, on, { file: record({ tasks: [makeTask({ title: 'Waiting' })] }) })
  const ui = await $.ui.mount({ ...PANE, props: { ...PANE.props, bodyColumns: 46 }, surface: 'terminal' })

  expect(await ui.find({ type: 'Text', text: 'click or ctrl+x tab for keys · esc closes' })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: '/config options and paths' })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /…$/ })).toBeUndefined()
  await ui.unmount()
})

test('/done opens the menu on Current task, where the question is', async ($, on) => {
  const task = makeTask({ title: 'Now', state: 'current' })
  const { seen } = await startSession($, on, { file: record({ tasks: [task] }) })

  const answer = await $.command.run({ command: 'done', args: '', ...COMMAND })
  expect(answer.text).toBe('Asked in the Queue-tea menu.')
  expect(seen.opens[0]).toMatchObject({ id: 'queue-tea', focus: true, closeOnEscape: true })
  const ui = await $.ui.mount({ ...PANE, surface: 'terminal' })
  expect(await ui.find({ type: 'Text', text: 'Is this done for now?' })).toBeDefined()
  expect(await ui.find({ key: 'done-yes' })).toBeDefined()
  await ui.unmount()
})

test('Backlog: priority, Remove and Start go through the queue engine', async ($, on) => {
  const tidy = makeTask({ title: 'Tidy', priority: 'low' })
  const typo = makeTask({ title: 'Typo', priority: 'okay' })
  const { mem } = await startSession($, on, { file: record({ tasks: [tidy, typo] }), status: DIRTY })
  const ui = await mountView($, 'terminal', 'backlog')

  await ui.press({ key: `row:${tidy.id}` })
  await ui.press({ key: `prio:${tidy.id}:high` })
  expect(recordOf(mem).tasks.find(t => t.id === tidy.id)?.priority).toBe('high')

  await ui.press({ key: `row:${typo.id}` })
  await ui.press({ key: `remove:${typo.id}` })
  expect(recordOf(mem).tasks.find(t => t.id === typo.id)?.state).toBe('removed')

  // Start: the git check holds it, and the menu moves to where Check again is.
  await ui.press({ key: `row:${tidy.id}` })
  await ui.press({ key: `start:${tidy.id}` })
  expect(await ui.find({ type: 'Text', text: '3 files not committed · 2 commits not pushed' })).toBeDefined()
  expect(await ui.find({ key: 'check-again' })).toBeDefined()
  expect(mem.runs.some(isBranchRun)).toBe(false)
  await ui.unmount()
})

test('Backlog: Play next puts a task first and says why, Start ★ names it; pressed again, it comes off', async ($, on) => {
  const tidy = makeTask({ title: 'Tidy', priority: 'low' })
  const login = makeTask({ title: 'Login', priority: 'high' })
  const { mem } = await startSession($, on, { file: record({ tasks: [tidy, login] }) })
  const ui = await mountView($, 'terminal', 'backlog')
  expect((await ui.find({ key: `row:${login.id}` }))?.text).toMatch(/^★ \[high\] Login/)

  await ui.press({ key: `row:${tidy.id}` })
  await ui.press({ key: `play-next:${tidy.id}` })
  expect(recordOf(mem).playNext).toBe(tidy.id)
  expect((await ui.find({ key: `row:${tidy.id}` }))?.text).toMatch(/^★ \[low\] Tidy/)
  expect(await ui.find({ type: 'Text', text: /you chose Play next/ })).toBeDefined()

  await ui.press({ key: 'menu:back' })
  await ui.press({ key: 'menu:current' })
  expect((await ui.find({ key: 'start-next' }))?.text).toBe('Start ★ Tidy')
  await ui.press({ key: 'menu:back' })
  await ui.press({ key: 'menu:backlog' })

  await ui.press({ key: `row:${tidy.id}` })
  expect((await ui.find({ key: `play-next:${tidy.id}` }))?.text).toBe('Play next •')
  await ui.press({ key: `play-next:${tidy.id}` })
  expect(recordOf(mem).playNext).toBeNull()
  expect((await ui.find({ key: `row:${login.id}` }))?.text).toMatch(/^★ \[high\] Login/)
  await ui.unmount()
})

test('Backlog: each task shows its estimate, and Time I have puts what fits first', async ($, on) => {
  const rewrite = makeTask({ title: 'Rewrite', priority: 'high', difficulty: { expected: 'hard', actual: null } })
  const typo = makeTask({ title: 'Typo', priority: 'low', difficulty: { expected: 'light', actual: null } })
  await startSession($, on, { file: record({ tasks: [rewrite, typo] }) })
  const ui = await mountView($, 'terminal', 'backlog')
  expect(await ui.find({ type: 'Text', text: /Hard · ~4h · / })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /Light · ~30m short · / })).toBeDefined()
  expect((await ui.find({ key: 'time' }))?.text).toBe('Time I have: any')
  expect((await ui.find({ key: `row:${rewrite.id}` }))?.text).toMatch(/^★ \[high\] Rewrite/)

  await ui.press({ key: 'time' })
  expect((await ui.find({ key: 'time' }))?.text).toBe('Time I have: 30m')
  expect((await ui.find({ key: `row:${typo.id}` }))?.text).toMatch(/^★ \[low\] Typo/)
  expect(await ui.find({ type: 'Text', text: /low · fits 30m/ })).toBeDefined()

  for (const label of ['1h', '2h', 'any']) {
    await ui.press({ key: 'time' })
    expect((await ui.find({ key: 'time' }))?.text).toBe(`Time I have: ${label}`)
  }
  expect((await ui.find({ key: `row:${rewrite.id}` }))?.text).toMatch(/^★ \[high\] Rewrite/)
  await ui.unmount()
})

test('Backlog: Blocked… sets what a task waits for; it moves to Blocked, and Unblock brings it back', async ($, on) => {
  const api = makeTask({ title: 'API', priority: 'mid' })
  const screen = makeTask({ title: 'Screen', priority: 'high' })
  const { mem } = await startSession($, on, { file: record({ tasks: [api, screen] }) })
  const ui = await mountView($, 'terminal', 'backlog')

  await ui.press({ key: `row:${screen.id}` })
  await ui.press({ key: `block:${screen.id}` })
  expect(await ui.find({ type: 'Text', text: /What does Screen wait for\?/ })).toBeDefined()
  await ui.press({ key: 'block-cancel' })
  expect(await ui.find({ type: 'Text', text: /What does Screen wait for\?/ })).toBeUndefined()

  // Cancel goes back to the row, still open.
  await ui.press({ key: `block:${screen.id}` })
  await ui.press({ key: `wait:${api.id}` })
  expect(recordOf(mem).tasks.find(t => t.id === screen.id)?.blockedBy).toEqual([api.id])
  expect(await ui.find({ type: 'Text', text: /Blocked \(1\)/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /waits for API/ })).toBeDefined()
  // API takes the priority of what waits for it, and is the suggestion.
  expect((await ui.find({ key: `row:${api.id}` }))?.text).toMatch(/^★ \[mid\] API/)
  expect(await ui.find({ type: 'Text', text: /high, from what waits for it · unblocks Screen/ })).toBeDefined()

  await ui.press({ key: `row:${screen.id}` })
  await ui.press({ key: `unblock:${screen.id}` })
  expect(recordOf(mem).tasks.find(t => t.id === screen.id)?.blockedBy).toEqual([])
  expect(await ui.find({ type: 'Text', text: /Blocked \(/ })).toBeUndefined()
  await ui.unmount()
})

test('Backlog: other projects with tasks waiting, one dim line each', async ($, on) => {
  const other = { ...emptyRecord('example-app', '/q'), tasks: [makeTask({ title: 'Fix the login' }), makeTask({ title: 'Docs', priority: 'low' })] }
  const idle = emptyRecord('idle-app', '/r')
  await startSession($, on, {
    file: record({ tasks: [makeTask({ title: 'Here' })] }),
    others: { [recordPath('/h', projectKey('/q'))]: JSON.stringify(other), [recordPath('/h', projectKey('/r'))]: JSON.stringify(idle) },
  })
  const ui = await mountView($, 'terminal', 'backlog')

  expect(await ui.find({ type: 'Text', text: /Other projects \(1\)/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: 'example-app · 2 waiting · ★ Fix the login' })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /idle-app/ })).toBeUndefined()
  await ui.unmount()
})

test('Current task: what has moved under it is named, in the warning colour', async ($, on) => {
  const task = makeTask({ title: 'Now', state: 'current', branch: 'task/now', baseBranch: 'main', startCommit: '1a2b3c4' })
  await startSession($, on, { file: record({ tasks: [task] }) })
  const ui = await mountView($, 'terminal', 'current')

  expect((await ui.find({ type: 'Text', text: '! The branch task/now is gone.' }))?.props.color).toBe('warning')
  await ui.unmount()
})

test('Usage: the current task’s lines so far, from git since it started, measured again after each turn', async ($, on) => {
  const task = makeTask({ title: 'Now', state: 'current', branch: 'main', startCommit: '1a2b3c4' })
  const { mem, clock } = await startSession($, on, {
    file: record({ tasks: [task] }),
    git: { 'git diff --shortstat 1a2b3c4': { stdout: ' 3 files changed, 42 insertions(+), 7 deletions(-)\n' } },
  })
  const ui = await mountView($, 'terminal', 'usage')
  expect(await ui.find({ type: 'Text', text: /changed · \+42 −7 lines$/ })).toBeDefined()

  mem.git['git diff --shortstat 1a2b3c4'] = { stdout: ' 4 files changed, 50 insertions(+), 9 deletions(-)\n' }
  await runTurn($, clock, 'go on')
  expect(await ui.find({ type: 'Text', text: /changed · \+50 −9 lines$/ })).toBeDefined()
  await ui.unmount()
})

test('Usage: a task with no start commit shows no line count rather than +0 −0', async ($, on) => {
  await startSession($, on, { file: record({ tasks: [makeTask({ title: 'Now', state: 'current' })] }) })
  const ui = await mountView($, 'terminal', 'usage')
  expect(await ui.find({ type: 'Text', text: /files read · 0 changed$/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /lines/ })).toBeUndefined()
  await ui.unmount()
})

test('Current task: Blocked… with a reason puts it back blocked, with a checkpoint', async ($, on) => {
  const task = makeTask({ title: 'Now', state: 'current', branch: 'task/now', startCommit: '1a2b3c4' })
  const { mem, seen, clock } = await startSession($, on, {
    file: record({ tasks: [task] }),
    reply: HANDOFF,
    git: { 'git log -1 --format=%h %s': { stdout: '1a2b3c4 Add bars\n' } },
  })
  const ui = await mountView($, 'terminal', 'current')
  await ui.press({ key: `block:${task.id}` })
  expect(await ui.find({ type: 'Text', text: /What does Now wait for\?/ })).toBeDefined()
  await ui.input({ key: 'block-reason', text: 'waiting for the API key' })
  await clock.settle()

  const saved = recordOf(mem).tasks[0]!
  expect([saved.state, saved.blockedReason, saved.handoff?.text]).toEqual(['queued', 'waiting for the API key', HANDOFF])
  expect(seen.toasts).toEqual(['Blocked: Now'])
  await ui.unmount()
})

test('moving around the menu leaves the current task, its branch and the record as they were', async ($, on) => {
  const task = makeTask({ title: 'Fix login', state: 'current', branch: 'task/fix-login', startCommit: '1a2b3c4' })
  const { mem, seen, clock } = await startSession($, on, { file: record({ tasks: [task] }) })
  const before = mem.files.get(FILE)
  const runs = mem.runs.length

  await $.command.run({ command: 'queue-tea', args: '', ...COMMAND })
  const ui = await $.ui.mount({ ...PANE, surface: 'terminal' })
  for (const view of ENTRIES) {
    await ui.press({ key: `menu:${view}` })
    await ui.press({ key: 'menu:back' })
  }
  await ui.unmount()
  const band = await $.ui.mount({ ...BAND, surface: 'terminal' })
  await band.press({ key: 'cup-menu' })
  await band.press({ key: 'cup-menu' })
  await band.unmount()
  await clock.settle()

  expect(mem.files.get(FILE)).toBe(before)
  expect(mem.runs.slice(runs).filter(isBranchRun)).toEqual([])
  expect(seen.clears).toBe(0)
  expect(seen.prompts).toEqual([])
  expect(recordOf(mem).tasks.map(t => [t.title, t.state, t.branch])).toEqual([['Fix login', 'current', 'task/fix-login']])
})

test('tasks in the record are all there after a restart, and the menu shows them', async ($, on) => {
  const now = makeTask({ title: 'Fix login', state: 'current', branch: 'task/fix-login' })
  const next = makeTask({ title: 'Dark mode', priority: 'high' })
  const { mem, clock } = await startSession($, on, { file: record({ tasks: [now, next] }) })
  await $.command.run({ command: 'queue-tea', args: '', ...COMMAND })
  await $.command.run({ command: 'steep', args: 'Write the docs', ...COMMAND })
  const band = await $.ui.mount({ ...BAND, surface: 'terminal' })
  await band.press({ key: 'save' })
  await band.unmount()

  // A restart: a new session reads the same record.
  await $.session.start({ cwd: '/p', surface: 'terminal', isInteractive: true })
  await clock.settle()

  expect(recordOf(mem).tasks.map(t => [t.title, t.state])).toEqual([
    ['Fix login', 'current'],
    ['Dark mode', 'queued'],
    ['Write the docs', 'queued'],
  ])
  const ui = await mountView($, 'terminal', 'backlog')
  expect(await ui.find({ key: `row:${next.id}` })).toBeDefined()
  expect(await ui.find({ text: /Write the docs/ })).toBeDefined()
  await ui.press({ key: 'menu:back' })
  await ui.press({ key: 'menu:current' })
  expect(await ui.find({ type: 'Text', text: /Fix login/ })).toBeDefined()
  await ui.unmount()
})

test('Brew now is the /brew errand: outside the queue, the task and branch kept, the menu closed', async ($, on) => {
  const task = makeTask({ title: 'Fix login', state: 'current', branch: 'task/fix-login' })
  const rows = mock.session(on)
  const { mem, seen, clock } = await startSession($, on, { file: record({ tasks: [task] }) })
  await $.command.run({ command: 'queue-tea', args: '', ...COMMAND })
  const ui = await mountView($, 'terminal', 'brew')

  await ui.input({ key: 'brew', text: ' run the tests ' })
  await clock.settle()

  expect(seen.closes).toEqual(['queue-tea'])
  const note = JSON.stringify(rows.appended().map(row => row.message))
  expect(note).toContain('Rohan ran /brew')
  expect(note).toContain('\\"Fix login\\"')
  expect(seen.prompts).toEqual([{ text: 'run the tests', origin: { kind: 'plugin', name: 'queue-tea', asUser: true } }])

  // Its turn is the errand's: task_looks_done asks nothing during it.
  await $.turn.start({ text: 'run the tests', turnId: 't1' })
  expect(JSON.stringify(await $.tool.call({ tool: 'mcp__queue-tea__task_looks_done' }))).toContain('errand')
  expect(recordOf(mem).tasks.map(t => [t.title, t.state, t.branch])).toEqual([['Fix login', 'current', 'task/fix-login']])
  await ui.unmount()
})

test('the cup idles when nothing is going on', async ($, on) => {
  await startSession($, on, { file: record() })
  const band = await $.ui.mount({ ...BAND, surface: 'terminal' })

  expect(await band.find({ type: 'Client', key: 'cup' })).toBeDefined()
  expect(await band.find({ type: 'Text', text: '-ω-', in: 'cup' })).toBeDefined()
  expect(await band.find({ type: 'Text', text: 'idle' })).toBeDefined()
  expect(await band.find({ type: 'Text', text: 'Nothing queued' })).toBeDefined()
  await band.unmount()
})

test('the cup brews while a task is current, or while a turn runs outside the queue', async ($, on) => {
  const task = makeTask({ title: 'Now', state: 'current', minutesByDay: { [DAY_ONE]: 42 } })
  await startSession($, on, { file: record({ tasks: [task] }), reply: SAME_REPLY })
  await $.prompt.submit({ text: 'keep going', wait: false, origin: { kind: 'composer' } })

  let band = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect(await band.find({ type: 'Text', text: '•ω•', in: 'cup' })).toBeDefined()
  expect(await band.find({ type: 'Text', text: 'brewing' })).toBeDefined()
  expect(await band.find({ type: 'Text', text: 'Now · 42m' })).toBeDefined()
  await band.unmount()

  band = await $.ui.mount({ ...BAND, surface: 'terminal', props: { ...BAND.props, isWorking: true } })
  expect(await band.find({ type: 'Text', text: 'brewing' })).toBeDefined()
  await band.unmount()
})

test('the cup needs Rohan when Queue-tea asks, and the menu opens where the answer is', async ($, on) => {
  const task = makeTask({ title: 'Now', state: 'current' })
  const { seen } = await startSession($, on, { file: record({ tasks: [task] }) })
  await $.tool.call({ tool: 'mcp__queue-tea__task_looks_done' })

  const band = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect(await band.find({ type: 'Text', text: '•o•', in: 'cup' })).toBeDefined()
  expect(await band.find({ type: 'Text', text: '     !     ', in: 'cup' })).toBeDefined()
  expect(await band.find({ type: 'Text', text: 'needs you' })).toBeDefined()
  expect(await band.find({ type: 'Text', text: 'Is this done for now? Now' })).toBeDefined()

  await band.press({ key: 'cup-menu' })
  expect(seen.opens[0]).toMatchObject({ id: 'queue-tea' })
  const ui = await $.ui.mount({ ...PANE, surface: 'terminal' })
  expect(await ui.find({ key: 'done-yes' })).toBeDefined()
  await ui.unmount()
  await band.unmount()
})

test('the cup is pleased just after a task is done', async ($, on) => {
  const done = makeTask({ title: 'Dark mode', state: 'done', finished: '2026-10-21T09:05:00+02:00' })
  await startSession($, on, { file: record({ tasks: [done] }) })

  const band = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect(await band.find({ type: 'Text', text: '^ω^', in: 'cup' })).toBeDefined()
  expect(await band.find({ type: 'Text', text: 'done' })).toBeDefined()
  expect(await band.find({ type: 'Text', text: 'Finished: Dark mode' })).toBeDefined()
  await band.unmount()
})

test('the steam moves on the surface’s own clock, and nothing is written for it', async ($, on) => {
  const { mem, seen } = await startSession($, on, { file: record() })
  const writes = mem.writes.length
  const band = await $.ui.mount({ ...BAND, surface: 'terminal', props: { ...BAND.props, isWorking: true } })
  const steam = async () => (await band.find({ type: 'Text', text: /\(/, in: 'cup' }))?.text

  const first = await steam()
  await band.advance(500)
  const second = await steam()
  await band.advance(500)

  expect(first).toBe('   ) ( )   ')
  expect(second).toBe('   ( ) (   ')
  expect(await steam()).toBe('   ) ) (   ')
  expect(mem.writes.length).toBe(writes)
  expect(seen.opens).toEqual([])
  await band.unmount()
})

test('pointing at the cup winks, and a click opens the menu and closes it', async ($, on) => {
  const { seen } = await startSession($, on, { file: record() })
  const band = await $.ui.mount({
    ...BAND,
    surface: 'terminal',
    viewport: { columns: 120, rows: 40, isFullscreen: true },
  })
  await band.resize({ columns: 11, rows: 3, in: 'cup' })
  expect(await band.find({ type: 'Text', text: ' · /queue-tea, or click the cup' })).toBeDefined()

  await band.pointer({ type: 'enter', x: 5, y: 2 })
  expect(await band.find({ type: 'Text', text: '•ω-', in: 'cup' })).toBeDefined()

  await band.pointer({ type: 'down', x: 5, y: 2, button: 'left' })
  expect(seen.opens[0]).toMatchObject({ id: 'queue-tea', focus: true, closeOnEscape: true })
  expect((await band.find({ key: 'cup-menu' }))?.text).toBe('Close menu')

  await band.pointer({ type: 'down', x: 5, y: 2, button: 'left' })
  expect(seen.closes).toEqual(['queue-tea'])
  expect((await band.find({ key: 'cup-menu' }))?.text).toBe('Menu')
  await band.unmount()
})

test('with no mouse, no Client or little room, the band still works from the keyboard', async ($, on) => {
  const { seen } = await startSession($, on, { file: record() })

  // The main screen reports no clicks: the band names the keyboard way alone.
  const main = await $.ui.mount({ ...BAND, surface: 'terminal', viewport: { columns: 100, rows: 30, isFullscreen: false } })
  expect(await main.find({ type: 'Text', text: ' · /queue-tea' })).toBeDefined()
  expect(await main.find({ type: 'Text', text: /click/ })).toBeUndefined()
  await main.press({ key: 'cup-menu' })
  expect(seen.opens.length).toBe(1)
  await main.unmount()

  // A surface that runs no Client draws the cup still.
  for (const surface of ['vscode', 'mobile'] as const) {
    const still = await $.ui.mount({ ...BAND, surface })
    expect(await still.find({ type: 'Client' })).toBeUndefined()
    expect(await still.find({ type: 'Text', text: '-ω-' })).toBeDefined()
    await still.unmount()
  }

  // A narrow band has the words without the cup.
  const narrow = await $.ui.mount({ ...BAND, surface: 'terminal', props: { ...BAND.props, bodyColumns: 30 } })
  expect(await narrow.find({ type: 'Client' })).toBeUndefined()
  expect(await narrow.find({ type: 'Text', text: 'Nothing queued' })).toBeDefined()
  expect(await narrow.find({ key: 'cup-menu' })).toBeDefined()
  await narrow.unmount()
})
