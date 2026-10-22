import { expect, test } from 'claude-code/testing'

import { emptyRecord } from '../hooks/record'
import { CUP_COLUMNS, CUP_ROWS, cupArt, cupOf, DONE_FOR_MS, frameText } from '../hooks/ui/cup'
import type { CupFacts, Mood } from '../hooks/ui/cup'
import type { Task } from '../types'
import { makeTask } from './helpers'

const NOW = Date.parse('2026-10-21T07:12:00Z')
const MOODS: readonly Mood[] = ['idle', 'working', 'attention', 'done']

const facts = (tasks: Task[], over: Partial<CupFacts> = {}): CupFacts => ({
  load: 'ready',
  record: { ...emptyRecord('p', '/p'), tasks },
  band: { kind: 'none' },
  isAskingDone: false,
  hold: null,
  mismatch: null,
  canContinue: false,
  warning: null,
  isChecking: false,
  busy: null,
  isTurnRunning: false,
  budget: null,
  now: NOW,
  ...over,
})

test('idle: nothing queued, or the ★ task waiting', () => {
  expect(cupOf(facts([]))).toEqual({ mood: 'idle', line: 'Nothing queued', view: 'menu' })
  const tasks = [makeTask({ title: 'Later', priority: 'low' }), makeTask({ title: 'Soon', priority: 'urgent' })]
  expect(cupOf(facts(tasks))).toEqual({ mood: 'idle', line: '2 waiting · ★ Soon', view: 'backlog' })
})

test('idle: the ★ is the backlog’s suggestion, with Play next and the time Rohan has', () => {
  const later = makeTask({ title: 'Later', priority: 'low', difficulty: { expected: 'light', actual: null } })
  const soon = makeTask({ title: 'Soon', priority: 'urgent', difficulty: { expected: 'hard', actual: null } })
  const record = { ...emptyRecord('p', '/p'), tasks: [later, soon] }

  expect(cupOf(facts([], { record: { ...record, playNext: later.id } })).line).toBe('2 waiting · ★ Later')
  expect(cupOf(facts([], { record, budget: 30 })).line).toBe('2 waiting · ★ Later')
  expect(cupOf(facts([makeTask({ title: 'Wait', blockedReason: 'later' })]))).toEqual({
    mood: 'idle',
    line: '1 waiting · all blocked',
    view: 'backlog',
  })
})

test('working: a current task, the message check, work under way, or a turn outside the queue', () => {
  const now = makeTask({ title: 'Fix login', state: 'current', minutesByDay: { '2026-10-21': 42 } })
  expect(cupOf(facts([now]))).toEqual({ mood: 'working', line: 'Fix login · 42m', view: 'current' })
  expect(cupOf(facts([], { isChecking: true })).line).toBe('Checking your message…')
  expect(cupOf(facts([now], { busy: 'Saving a handoff note…' })).line).toBe('Saving a handoff note…')
  expect(cupOf(facts([], { isTurnRunning: true }))).toEqual({ mood: 'working', line: 'Brewing outside the queue', view: 'menu' })
  expect(cupOf(facts([], { load: 'loading' })).mood).toBe('working')
})

test('attention: whatever waits on Rohan comes before the work', () => {
  const now = makeTask({ title: 'Fix login', state: 'current' })
  expect(cupOf(facts([now], { isAskingDone: true }))).toEqual({
    mood: 'attention',
    line: 'Is this done for now? Fix login',
    view: 'current',
  })
  expect(cupOf(facts([now], { canContinue: true })).line).toBe('Ready to continue: Fix login')
  expect(cupOf(facts([now], { hold: { text: '3 files not committed' } })).line).toBe('3 files not committed')
  expect(cupOf(facts([now], { mismatch: "You're on main; this task is on task/fix" })).view).toBe('current')
  expect(cupOf(facts([], { warning: 'During the last turn a commit appeared: abc' })).mood).toBe('attention')
  expect(cupOf(facts([], { band: { kind: 'unsure', text: 'hmm', intent: 'improving', didCheckRun: true } })).mood).toBe(
    'attention',
  )
  expect(cupOf(facts([], { load: 'failed' })).line).toBe("Couldn't read your task record")
  expect(cupOf(facts([now], { isChecking: true, isAskingDone: true })).mood).toBe('attention')
})

test('done: a task finished in the last 15 minutes, and none started since', () => {
  const finished = (msAgo: number) =>
    makeTask({ title: 'Dark mode', state: 'done', finished: new Date(NOW - msAgo).toISOString() })
  expect(cupOf(facts([finished(5 * 60_000)]))).toEqual({ mood: 'done', line: 'Finished: Dark mode', view: 'history' })
  expect(cupOf(facts([finished(DONE_FOR_MS + 1)])).mood).toBe('idle')
  expect(cupOf(facts([finished(60_000), makeTask({ state: 'current' })])).mood).toBe('working')
})

test('every frame of every mood is the cup’s size, one column per glyph', () => {
  for (const mood of MOODS) {
    const art = cupArt(mood)
    for (const frame of [...art.frames, art.wink]) {
      const rows = frameText(frame)
      expect(rows.length).toBe(CUP_ROWS)
      for (const row of rows) expect([...row].length).toBe(CUP_COLUMNS)
    }
  }
})

test('each mood has its own face, the steam moves, and the wink is the pointer’s', () => {
  const faces = MOODS.map(mood => frameText(cupArt(mood).frames[0]!)[2])
  expect(new Set(faces).size).toBe(4)
  expect(faces[1]).toContain('•ω•')
  const working = cupArt('working')
  expect(new Set(working.frames.map(f => frameText(f)[0])).size).toBeGreaterThan(1)
  expect(frameText(working.wink)[2]).toContain('•ω-')
  expect(frameText(cupArt('attention').frames[0]!)[0]).toContain('!')
})
