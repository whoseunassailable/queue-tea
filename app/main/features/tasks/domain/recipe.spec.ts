import { describe, expect, it } from 'vitest'

import type { Checkpoint, CommandRun, Task, TaskStep } from '../../../../../types'
import { makeTask } from '../api/fixtures'
import { latestChecks, recipeOf } from './recipe'

const AT = '2026-11-25T15:33:10-06:00'

const step = (kind: TaskStep['kind'], status: TaskStep['status'] = 'succeeded'): TaskStep => ({ id: 's-1', at: AT, finished: status === 'running' ? null : AT, kind, status, subject: 'x' })
const run = (command: string, isOk: boolean, isTest = true): CommandRun => ({ command, isOk, isTest, at: AT, summary: isOk ? '12 passed' : '1 failed' })

const checkpoint = (over: Partial<Checkpoint> = {}): Checkpoint => ({
  written: AT,
  goal: 'Stop saving every command',
  acceptance: ['One line shows the current step'],
  changes: ['Dropped activity from the record'],
  decisions: ['Keep the latest step only'],
  rejected: ['A capped list of steps'],
  remaining: ['Update the docs', 'Run the e2e'],
  blockers: [],
  nextAction: 'Update the docs',
  seen: null,
  ...over,
})

const started = (over: Partial<Task> = {}): Task =>
  makeTask({ id: 'one', state: 'current', started: AT, branch: 'task/one', ...over })

const stageMarks = (task: Task) => recipeOf(task)!.stages.map(stage => `${stage.id}:${stage.mark}`)
const now = (task: Task) => recipeOf(task)!.stages.find(stage => stage.mark === 'now')?.id ?? null

describe('a quest\'s recipe', () => {
  it('has none before the quest is started, and none once it is removed', () => {
    expect(recipeOf(makeTask({ id: 'one' }))).toBeNull()
    expect(recipeOf(makeTask({ id: 'one', state: 'removed', started: AT }))).toBeNull()
  })

  it('has five stages, or six when Mocha Mockup designs the quest', () => {
    expect(recipeOf(started())!.stages.map(stage => stage.id)).toEqual(['setOut', 'understand', 'build', 'verify', 'review'])
    expect(recipeOf(started({ helpers: { on: ['mocha-mockup', 'tea-dd'], ran: [], reminded: false } }))!.stages.map(stage => stage.id)).toEqual(['setOut', 'understand', 'design', 'build', 'verify', 'review'])
  })

  it('starts by setting out, then follows what the record saw', () => {
    expect(stageMarks(started())).toEqual(['setOut:now', 'understand:next', 'build:next', 'verify:next', 'review:next'])

    const reading = started({ effort: { ...started().effort, filesRead: 4 }, step: step('read') })
    expect(now(reading)).toBe('understand')

    const building = started({ effort: { ...started().effort, filesRead: 4, filesChanged: 2 }, step: step('edit') })
    expect(stageMarks(building)).toEqual(['setOut:done', 'understand:done', 'build:now', 'verify:next', 'review:next'])

    const checking = started({ effort: { ...started().effort, filesChanged: 2 }, step: step('test', 'running') })
    expect(now(checking)).toBe('verify')
  })

  it('designs once Mocha Mockup has run', () => {
    const designed = started({ helpers: { on: ['mocha-mockup'], ran: ['mocha-mockup'], reminded: false }, effort: { ...started().effort, filesRead: 3 }, step: step('read') })

    expect(now(designed)).toBe('design')
  })

  it('goes back to building when an edit follows the checks, and stays verifying on a read', () => {
    const checked = { testPeriods: [{ start: 1, end: 2 }], minutesInChecks: 3, effort: { ...started().effort, filesChanged: 2 } }

    expect(now(started({ ...checked, step: step('edit') }))).toBe('build')
    expect(now(started({ ...checked, step: step('read') }))).toBe('verify')
  })

  it('stays where it had reached when the quest is resumed on its branch', () => {
    const resumed = started({ effort: { ...started().effort, filesChanged: 5 }, step: step('branchSwitched') })

    expect(now(resumed)).toBe('build')
  })

  it('is in review once Claude says the quest looks done, and asks Rohan', () => {
    const recipe = recipeOf(started({ review: { at: AT, checked: null }, step: step('edit') }))!

    expect(recipe.stages.find(stage => stage.mark === 'now')?.id).toBe('review')
    expect(recipe.attention).toEqual([{ kind: 'looksDone', text: null }])
  })

  it('keeps a put-back quest at the stage it reached, paused', () => {
    const recipe = recipeOf(started({ state: 'queued', effort: { ...started().effort, filesChanged: 1 }, step: step('edit') }))!

    expect(recipe.phase).toBe('paused')
    expect(recipe.stages.find(stage => stage.mark === 'now')?.id).toBe('build')
  })

  it('ticks every stage and step of a finished quest, and asks nothing', () => {
    const recipe = recipeOf(started({ state: 'done', review: { at: AT, checked: null }, checkpoint: checkpoint({ blockers: ['Waiting on the API'] }) }))!

    expect(recipe.phase).toBe('complete')
    expect(recipe.stages.every(stage => stage.mark === 'done')).toBe(true)
    expect(recipe.steps.every(s => s.mark === 'done')).toBe(true)
    expect(recipe.attention).toEqual([])
  })

  it('splits a checkpoint into the goal, its steps, what counts as done and its notes', () => {
    const recipe = recipeOf(started({ checkpoint: checkpoint() }))!

    expect(recipe.goal).toBe('Stop saving every command')
    expect(recipe.steps).toEqual([
      { text: 'Dropped activity from the record', mark: 'done' },
      { text: 'Update the docs', mark: 'now' },
      { text: 'Run the e2e', mark: 'next' },
    ])
    expect(recipe.doneWhen).toEqual(['One line shows the current step'])
    expect(recipe.notes).toEqual([
      { kind: 'decisions', heading: null, lines: ['Keep the latest step only'] },
      { kind: 'rejected', heading: null, lines: ['A capped list of steps'] },
    ])
    expect(recipe.written).toEqual({ kind: 'checkpoint', at: AT })
  })

  it('puts a checkpoint\'s blockers where Rohan sees them', () => {
    const recipe = recipeOf(started({ checkpoint: checkpoint({ blockers: ['Needs the staging key'] }) }))!

    expect(recipe.attention).toEqual([{ kind: 'blocker', text: 'Needs the staging key' }])
  })

  it('reads a handoff note\'s sections as steps, questions and notes', () => {
    const text = ['## What changed', '- Moved the panel', '## Next steps', '- [x] Wire the switch', '- [ ] Write the tests', '## Questions', '- Keep the old note?'].join('\n')
    const recipe = recipeOf(started({ handoff: { text, written: AT } }))!

    expect(recipe.steps).toEqual([
      { text: 'Moved the panel', mark: 'done' },
      { text: 'Wire the switch', mark: 'done' },
      { text: 'Write the tests', mark: 'next' },
    ])
    expect(recipe.attention).toEqual([{ kind: 'question', text: 'Keep the old note?' }])
    expect(recipe.notes.map(note => note.heading)).toEqual(['What changed', 'Next steps', 'Questions'])
    expect(recipe.written).toEqual({ kind: 'handoff', at: AT })
  })

  it('keeps a plain handoff note whole, as a note', () => {
    const recipe = recipeOf(started({ handoff: { text: 'Carry on with the diagrams.', written: AT } }))!

    expect(recipe.steps).toEqual([])
    expect(recipe.notes).toEqual([{ kind: 'note', heading: null, lines: ['Carry on with the diagrams.'] }])
  })

  it('carries on from the newer note, as Continue does', () => {
    const later = '2026-11-26T09:00:00-06:00'
    const both = started({ checkpoint: checkpoint(), handoff: { text: 'Plain note.', written: later } })

    expect(recipeOf(both)!.written).toEqual({ kind: 'handoff', at: later })
  })

  it('names the test profile and lists each check once, without the other commands', () => {
    const seen = { at: AT, files: ['app/a.ts'], git: null, commands: [run('npm test', false), run('ls', true, false), run('npm run typecheck', true), run('npm test', true)] }
    const recipe = recipeOf(started({ testProfile: { id: 'deep', by: 'tea-dd', reason: 'a stored field' }, checkpoint: checkpoint({ seen }) }))!

    expect(recipe.profile).toEqual({ id: 'deep', by: 'tea-dd', reason: 'a stored field' })
    expect(recipe.checks.map(check => `${check.command}:${check.isOk}`)).toEqual(['npm run typecheck:true', 'npm test:true'])
    expect(recipe.notes.at(-1)).toEqual({ kind: 'files', heading: null, lines: ['app/a.ts'] })
  })

  it('reads an old record with no profile, no steps and no checks', () => {
    const recipe = recipeOf(makeTask({ id: 'old', state: 'done', started: AT, finished: AT }))!

    expect(recipe.profile).toBeNull()
    expect(recipe.checks).toEqual([])
    expect(recipe.steps).toEqual([])
    expect(recipe.written).toBeNull()
  })
})

describe('the checks a recipe lists', () => {
  it('keeps the latest run of each, in the order they last ran', () => {
    expect(latestChecks([run('a', false), run('b', true), run('a', true)]).map(check => `${check.command}:${check.isOk}`)).toEqual(['b:true', 'a:true'])
  })
})
