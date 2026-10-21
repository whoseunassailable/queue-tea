import { expect, test } from 'claude-code/testing'

import { checkMessage, checkPrompt, parseCheckAnswer } from '../hooks/check'
import type { Ask } from '../hooks/check'
import { makeTask } from './helpers'

const usage = { input_tokens: 1, output_tokens: 1, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 }
const answered = (text: string) => ({ isAnswered: true as const, text, usage })

// An Ask whose fork answers after `forkMs`, on a clock the test moves.
const fakeAsk = (fork: () => unknown, forkMs = 0) => {
  let now = 0
  const waits: { at: number; done: () => void }[] = []
  const logs: string[] = []
  const sleep = (ms: number) => new Promise<void>(done => waits.push({ at: now + ms, done }))
  const advance = async (ms: number) => {
    now += ms
    for (const w of waits.filter(w => w.at <= now)) w.done()
    await Promise.resolve()
  }
  const ask: Ask = {
    fork: async () => {
      if (forkMs > 0) await sleep(forkMs)

      return fork() as never
    },
    complete: async () => answered('{"kind":"quick","intent":"understanding"}') as never,
    sleep,
    log: text => logs.push(text),
  }

  return { ask, advance, logs }
}

test('parses a clean answer', () => {
  expect(parseCheckAnswer('{"kind":"same","intent":"improving"}')).toEqual({ kind: 'same', intent: 'improving' })
})

test('parses an answer inside prose and a code fence', () => {
  const reply = 'Sure! Here it is:\n```json\n{"kind":"new","intent":"improving","title":"Retry button","difficulty":"light"}\n```\nHope that helps.'

  expect(parseCheckAnswer(reply)).toEqual({ kind: 'new', intent: 'improving', title: 'Retry button', difficulty: 'light' })
})

test('new without a title is null; new without difficulty is medium', () => {
  expect(parseCheckAnswer('{"kind":"new","intent":"improving"}')).toBeNull()
  expect(parseCheckAnswer('{"kind":"new","intent":"improving","title":"X"}')).toEqual({
    kind: 'new',
    intent: 'improving',
    title: 'X',
    difficulty: 'medium',
  })
})

test('an unknown kind, a bad intent, or no object is null', () => {
  expect(parseCheckAnswer('{"kind":"maybe","intent":"improving"}')).toBeNull()
  expect(parseCheckAnswer('{"kind":"same","intent":"vibes"}')).toBeNull()
  expect(parseCheckAnswer('no json here')).toBeNull()
  expect(parseCheckAnswer('{broken')).toBeNull()
})

test('a long title is cut to 60 characters', () => {
  const answer = parseCheckAnswer(`{"kind":"new","intent":"improving","title":"${'x'.repeat(80)}"}`)

  expect(answer?.title?.length).toBe(60)
})

test('a fork that answers in time gives the answer', async () => {
  const { ask } = fakeAsk(() => answered('{"kind":"same","intent":"understanding"}'))

  expect(await checkMessage(ask, 'p', 10_000)).toEqual({ kind: 'same', intent: 'understanding' })
})

test('a fork slower than the time limit gives null', async () => {
  const { ask, advance, logs } = fakeAsk(() => answered('{"kind":"same","intent":"understanding"}'), 11_000)
  const result = checkMessage(ask, 'p', 10_000)
  await advance(10_000)

  expect(await result).toBeNull()
  expect(logs.length).toBe(1)
})

test('nothing-to-fork falls back to a completion', async () => {
  const { ask } = fakeAsk(() => ({ isAnswered: false, reason: 'nothing-to-fork' }))

  expect(await checkMessage(ask, 'p', 10_000)).toEqual({ kind: 'quick', intent: 'understanding' })
})

test('an unanswered fork gives null and is logged', async () => {
  const { ask, logs } = fakeAsk(() => ({ isAnswered: false, reason: 'api-error', status: 500, error: 'x', usage }))

  expect(await checkMessage(ask, 'p', 10_000)).toBeNull()
  expect(logs.length).toBe(1)
})

test('the prompt names the current task and the queue', () => {
  const prompt = checkPrompt(
    makeTask({ title: 'Retry button', state: 'current' }),
    [makeTask({ title: 'Dark mode' }), makeTask({ title: 'Export CSV' })],
    'also make it blue',
  )

  expect(prompt).toContain('Retry button')
  expect(prompt).toContain('Dark mode')
  expect(prompt).toContain('Export CSV')
  expect(prompt).toContain('also make it blue')
  expect(prompt).toContain('"kind"')
})

test('with no current task, the prompt says work is new', () => {
  expect(checkPrompt(null, [], 'add dark mode')).toContain('No task is current')
})
