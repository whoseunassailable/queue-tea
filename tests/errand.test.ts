import { expect, test } from 'claude-code/testing'

import { errandNote, errandUsage, isErrandTurn } from '../hooks/errand'
import type { Errand } from '../hooks/errand'
import { makeTask } from './helpers'

const BREW: Errand = { kind: 'brew', text: 'start the dev server', isRunning: false }

test('the /brew note keeps the current task and asks for the work, checked', () => {
  const note = errandNote('brew', makeTask({ title: 'Fix login', state: 'current' }))

  expect(note).toContain('Rohan ran /brew; the request is the next message.')
  expect(note).toContain('the current task "Fix login", its branch and the queue stay as they are')
  expect(note).toContain("don't call task_looks_done")
  expect(note).toContain('check it worked')
})

test('with nothing current the note says nothing in the queue changes', () => {
  expect(errandNote('brew', null)).toContain('no task is made and nothing in the queue changes')
})

test('the /tea note asks for an answer that changes no files', () => {
  const note = errandNote('tea', null)

  expect(note).toContain('Rohan ran /tea; the question is the next message. Answer or explain it.')
  expect(note).toContain('change no files')
})

test('the usage line names what the command takes', () => {
  expect(errandUsage('brew', 'brew')).toBe('Write what you want after the command: /brew <request>')
  expect(errandUsage('queue-tea-tea', 'tea')).toBe('Write what you want after the command: /queue-tea-tea <question>')
})

test('only the main loop’s turn with the errand’s words is the errand', () => {
  expect(isErrandTurn({ text: BREW.text }, BREW)).toBe(true)
  expect(isErrandTurn({ text: BREW.text, agentId: 'a1' }, BREW)).toBe(false)
  expect(isErrandTurn({ text: 'something else' }, BREW)).toBe(false)
  expect(isErrandTurn({ text: BREW.text }, { ...BREW, isRunning: true })).toBe(false)
  expect(isErrandTurn({ text: BREW.text }, null)).toBe(false)
})
