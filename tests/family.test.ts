import { expect, test } from 'claude-code/testing'

import { checkPrompt, parseCheckAnswer } from '../hooks/check'
import {
  activeFeature,
  childrenOf,
  filingCandidates,
  groupBacklog,
  guessParent,
  loneTasks,
  namedTasks,
  parentChoices,
  parentOf,
  parentRefusal,
  progressOf,
  progressText,
} from '../hooks/family'
import { blockedTasks, rankBacklog } from '../hooks/plan'
import { newTask, removeTask } from '../hooks/queue'
import { emptyRecord, parseRecord } from '../hooks/record'
import type { ProjectRecord, Task } from '../types'
import { makeTask } from './helpers'

const at = (minute: number) => `2026-10-21T10:${String(minute).padStart(2, '0')}:00+02:00`
const recordOf = (tasks: Task[], feature: string | null = null): ProjectRecord => ({ ...emptyRecord('p', '/p'), tasks, feature })

// A feature with three tasks under it: one done, one queued, one blocked.
const family = () => {
  const menu = makeTask({ title: 'Menu parity', priority: 'high', created: at(1) })
  const keys = makeTask({ title: 'Keys hint', parentId: menu.id, created: at(2) })
  const close = makeTask({ title: 'Close button', parentId: menu.id, state: 'done', created: at(3) })
  const docs = makeTask({ title: 'Menu docs', parentId: menu.id, blockedReason: 'waiting for copy', created: at(4) })

  return { menu, keys, close, docs, tasks: [menu, keys, close, docs] }
}

test('a task without a parent is on its own; children leave out removed ones', () => {
  const { menu, keys, close, docs, tasks } = family()
  const gone = makeTask({ title: 'Gone', parentId: menu.id, state: 'removed' })

  expect(parentOf(menu, tasks)).toBeNull()
  expect(parentOf(keys, tasks)?.id).toBe(menu.id)
  expect(childrenOf(menu, [...tasks, gone]).map(t => t.id)).toEqual([keys.id, close.id, docs.id])
})

test('progress counts done, in progress and blocked tasks under a feature', () => {
  const { menu, tasks } = family()
  const now = makeTask({ title: 'Wire it', parentId: menu.id, state: 'current' })
  const p = progressOf(menu, [...tasks, now])

  expect(p).toEqual({ done: 1, total: 4, current: 1, blocked: 1 })
  expect(progressText(p)).toBe('1/4 done ▰▱▱▱▱ · 1 in progress · 1 blocked')
  expect(progressText({ done: 0, total: 0, current: 0, blocked: 0 })).toBe('0/0 done ▱▱▱▱▱')
  expect(progressText({ done: 3, total: 3, current: 0, blocked: 0 })).toBe('3/3 done ▰▰▰▰▰')
})

test('one level deep: no task under itself, under a child, or a feature under another', () => {
  const { menu, keys, tasks } = family()
  const other = makeTask({ title: 'Other' })
  const done = makeTask({ title: 'Old', state: 'done' })
  const all = [...tasks, other, done]

  expect(parentRefusal(all, other.id, menu.id)).toBeNull()
  expect(parentRefusal(all, other.id, other.id)).toBe("A task can't be part of itself.")
  expect(parentRefusal(all, other.id, keys.id)).toBe('Keys hint is part of Menu parity, so its tasks go under that.')
  expect(parentRefusal(all, menu.id, other.id)).toBe("Menu parity has tasks of its own, so it can't be part of another.")
  expect(parentRefusal(all, other.id, done.id)).toBe('That feature is no longer open.')
  expect(parentRefusal(all, other.id, 't-missing')).toBe('That feature is no longer open.')
  // A task not saved yet can go under a feature.
  expect(parentRefusal(all, 't-new', menu.id)).toBeNull()
})

test('the features a task can move under leave out the one it is under now', () => {
  const { menu, keys, docs, tasks } = family()
  const other = makeTask({ title: 'Other' })
  const all = [...tasks, other]

  expect(parentChoices(all, keys.id).map(t => t.title)).toEqual(['Other'])
  expect(parentChoices(all, other.id).map(t => t.title)).toEqual(['Menu parity'])
  expect(parentChoices(all, menu.id)).toEqual([])
  expect(parentChoices(all, docs.id).map(t => t.title)).toEqual(['Other'])
})

test('the active feature counts only while it is open and on its own', () => {
  const { menu, keys, tasks } = family()

  expect(activeFeature(recordOf(tasks, menu.id))?.id).toBe(menu.id)
  expect(activeFeature(recordOf(tasks, keys.id))).toBeNull()
  expect(activeFeature(recordOf(tasks.map(t => (t.id === menu.id ? { ...t, state: 'done' } : t)), menu.id))).toBeNull()
  expect(activeFeature(recordOf(tasks, 't-missing'))).toBeNull()
  expect(activeFeature(recordOf(tasks))).toBeNull()
})

test('filing offers the active feature, then the current task or its feature, then open features', () => {
  const { menu, keys, tasks } = family()
  const shell = makeTask({ title: 'Shell', created: at(10) })
  const child = makeTask({ title: 'Shell child', parentId: shell.id })
  const login = makeTask({ title: 'Login', state: 'current' })
  const lone = makeTask({ title: 'Lone' })

  expect(filingCandidates(recordOf([...tasks, shell, child, login, lone], shell.id)).map(t => t.title)).toEqual([
    'Shell',
    'Login',
    'Menu parity',
  ])
  // A current task under a feature offers the feature.
  const nowKeys = tasks.map(t => (t.id === keys.id ? { ...t, state: 'current' as const } : t))
  expect(filingCandidates(recordOf(nowKeys)).map(t => t.title)).toEqual(['Menu parity'])
  expect(filingCandidates(recordOf([lone]))).toEqual([])
})

test('a message names a task by its id or its whole title of two words or more', () => {
  const { menu, keys, tasks } = family()
  const ui = makeTask({ title: 'UI' })
  const all = [...tasks, ui]

  expect(namedTasks('add arrows for the menu parity work', all).map(t => t.id)).toEqual([menu.id])
  expect(namedTasks(`part of ${menu.id}: arrows`, all).map(t => t.id)).toEqual([menu.id])
  // One-word titles and tasks under a feature are not named.
  expect(namedTasks('polish the UI keys hint', all)).toEqual([])
  expect(namedTasks('menu parity-ish', all).map(t => t.id)).toEqual([menu.id])
  expect(namedTasks('menus parity', all)).toEqual([])
  expect(keys.parentId).toBe(menu.id)
})

test('guessParent: nothing to offer files it on its own, with no question', () => {
  expect(guessParent(recordOf([makeTask()]), 'add dark mode', 'none')).toBeNull()
  expect(guessParent(recordOf([]), 'add dark mode', null)).toBeNull()
})

test('guessParent: a feature the message names is picked; two named, and Rohan is asked between them', () => {
  const { menu, tasks } = family()
  const shell = makeTask({ title: 'Shell rewrite' })
  const all = [...tasks, shell]

  expect(guessParent(recordOf(all), 'arrows for menu parity', 'none')).toEqual({
    parent: { kind: 'task', id: menu.id },
    choices: [menu.id],
  })
  expect(guessParent(recordOf(all), 'menu parity needs the shell rewrite first', undefined)).toEqual({
    parent: null,
    choices: [menu.id, shell.id],
  })
})

test('guessParent: the check’s pick is suggested; none files it on its own, even with a feature active', () => {
  const { menu, tasks } = family()
  const login = makeTask({ title: 'Login', state: 'current' })
  const all = [...tasks, login]

  expect(guessParent(recordOf(all, menu.id), 'arrow keys', menu.id)?.parent).toEqual({ kind: 'task', id: menu.id })
  expect(guessParent(recordOf(all), 'arrow keys', login.id)?.parent).toEqual({ kind: 'task', id: login.id })
  // Unrelated work: on its own, the active feature still offered.
  expect(guessParent(recordOf(all, menu.id), 'fix the CI cache', 'none')).toEqual({
    parent: { kind: 'none' },
    choices: [menu.id, login.id],
  })
})

test('guessParent: unsure, or no sign with a feature active, asks; never the feature by default', () => {
  const { menu, tasks } = family()
  const login = makeTask({ title: 'Login', state: 'current' })
  const all = [...tasks, login]

  expect(guessParent(recordOf(all), 'tidy up', 'unsure')?.parent).toBeNull()
  // A feature active: no answer, no check, or a feature the check made up all ask.
  expect(guessParent(recordOf(all, menu.id), 'tidy up', undefined)?.parent).toBeNull()
  expect(guessParent(recordOf(all, menu.id), 'tidy up', null)?.parent).toBeNull()
  expect(guessParent(recordOf(all, menu.id), 'tidy up', 't-made-up')?.parent).toBeNull()
  // No feature active: no sign files it on its own.
  expect(guessParent(recordOf(all), 'tidy up', undefined)?.parent).toEqual({ kind: 'none' })
  expect(guessParent(recordOf(all), 'tidy up', null)?.parent).toEqual({ kind: 'none' })
})

test('guessParent: a task on its own can take the first piece of it, when the check ties the work to it', () => {
  const insole = makeTask({ title: 'Finish Insole Bridge', created: at(1) })
  const docs = makeTask({ title: 'Fix the documentation', created: at(5) })
  const old = makeTask({ title: 'Old docs pass', state: 'done', created: at(6) })
  const all = [insole, docs, old]
  const homepage = 'the parts on the home page should not be on the home page'

  expect(guessParent(recordOf(all), homepage, docs.id)).toEqual({ parent: { kind: 'task', id: docs.id }, choices: [docs.id] })
  // Unrelated work, or no answer: on its own, with no question, as before.
  expect(guessParent(recordOf(all), 'add a battery alert', 'none')).toBeNull()
  expect(guessParent(recordOf(all), 'add a battery alert', undefined)).toBeNull()
  expect(guessParent(recordOf(all), 'add a battery alert', 't-made-up')).toBeNull()
  // The check can't tell: Rohan is asked, offered the tasks it was shown.
  expect(guessParent(recordOf(all), homepage, 'unsure')).toEqual({ parent: null, choices: [docs.id, insole.id] })
})

test('loneTasks: the newest five open tasks on their own, without features, the current task or tasks under one', () => {
  const { tasks } = family()
  const login = makeTask({ title: 'Login', state: 'current', created: at(9) })
  const many = [10, 11, 12, 13, 14, 15].map(m => makeTask({ title: `Task ${m}`, created: at(m) }))

  expect(loneTasks(recordOf([...tasks, login, ...many])).map(t => t.title)).toEqual([
    'Task 15',
    'Task 14',
    'Task 13',
    'Task 12',
    'Task 11',
  ])
  expect(loneTasks(recordOf(tasks))).toEqual([])
})

test('the check is shown the tasks on their own too, apart from the features', () => {
  const { menu } = family()
  const docs = makeTask({ title: 'Fix the documentation' })

  const alone = checkPrompt(null, [docs], 'x', [], null, [docs])
  expect(alone).toContain('"parent":"<feature id>|none|unsure"')
  expect(alone).toContain(`Tasks on their own: ${docs.id} "Fix the documentation".`)
  expect(alone).not.toContain('Features:')
  const both = checkPrompt(null, [docs], 'x', [menu], null, [docs])
  expect(both).toContain(`Features: ${menu.id} "Menu parity".`)
  expect(both).toContain(`Tasks on their own: ${docs.id} "Fix the documentation".`)
})

test('the check is told the features only when there are some, and reads its parent answer', () => {
  const { menu } = family()

  expect(checkPrompt(null, [], 'x')).not.toContain('parent')
  const prompt = checkPrompt(null, [], 'x', [menu], menu.id)
  expect(prompt).toContain('"parent":"<feature id>|none|unsure"')
  expect(prompt).toContain(`Features: ${menu.id} "Menu parity" (active).`)
  expect(prompt).toContain('never just because it is active or current')

  expect(parseCheckAnswer(`{"kind":"new","intent":"improving","title":"Arrows","parent":"${menu.id}"}`)).toEqual({
    kind: 'new',
    intent: 'improving',
    title: 'Arrows',
    difficulty: 'medium',
    parent: menu.id,
  })
  expect(parseCheckAnswer('{"kind":"new","intent":"improving","title":"Arrows","parent":""}')).toEqual({
    kind: 'new',
    intent: 'improving',
    title: 'Arrows',
    difficulty: 'medium',
  })
  expect(parseCheckAnswer('{"kind":"same","intent":"improving","parent":"none"}')).toEqual({ kind: 'same', intent: 'improving' })
})

test('the backlog groups a feature’s tasks where its first task stands, keeping the order', () => {
  const lone = makeTask({ title: 'Lone', priority: 'urgent', created: at(1) })
  const menu = makeTask({ title: 'Menu parity', priority: 'mid', created: at(2) })
  const keys = makeTask({ title: 'Keys hint', priority: 'high', parentId: menu.id, created: at(3) })
  const docs = makeTask({ title: 'Docs', priority: 'low', parentId: menu.id, created: at(4) })
  const typo = makeTask({ title: 'Typo', priority: 'okay', created: at(5) })
  const tasks = [lone, menu, keys, docs, typo]
  const ranked = rankBacklog({ tasks, playNext: null }, null)

  expect(ranked.map(r => r.task.title)).toEqual(['Lone', 'Keys hint', 'Menu parity', 'Typo', 'Docs'])
  const { ready, blocked } = groupBacklog(ranked, blockedTasks(tasks), tasks)
  expect(ready.map(e => (e.kind === 'group' ? `◆ ${e.group.parent.title}` : e.kind === 'task' ? e.row.task.title : ''))).toEqual([
    'Lone',
    '◆ Menu parity',
    'Typo',
  ])
  const group = ready[1]
  expect(group?.kind === 'group' ? group.group.rows.map(r => r.task.title) : []).toEqual(['Keys hint', 'Menu parity', 'Docs'])
  expect(group?.kind === 'group' ? group.group.hasStar : true).toBe(false)
  expect(blocked).toEqual([])
})

test('the ★ inside a feature marks the feature; a feature with nothing that can start stands among the blocked', () => {
  const { menu, keys, docs, tasks } = family()
  const stuck = makeTask({ title: 'Stuck', blockedReason: 'no key', created: at(5) })
  const lone = makeTask({ title: 'Lone', priority: 'low', created: at(6) })
  const all = [...tasks.map(t => (t.id === keys.id ? { ...t, priority: 'urgent' as const } : t)), stuck, lone]
  const ranked = rankBacklog({ tasks: all, playNext: null }, null)
  const { ready, blocked } = groupBacklog(ranked, blockedTasks(all), all)

  expect(ranked[0]?.task.id).toBe(keys.id)
  expect(ready[0]?.kind === 'group' && ready[0].group.hasStar).toBe(true)
  // The blocked task under the feature goes with its feature, not to Blocked.
  expect(ready[0]?.kind === 'group' ? ready[0].group.blocked.map(t => t.id) : []).toEqual([docs.id])
  expect(blocked.map(e => (e.kind === 'blocked' ? e.task.title : ''))).toEqual(['Stuck'])

  // Everything under another feature blocked: the feature stands among the blocked.
  const shell = makeTask({ title: 'Shell', state: 'current', created: at(7) })
  const waits = makeTask({ title: 'Shell waits', parentId: shell.id, blockedReason: 'later', created: at(8) })
  const both = [...all, shell, waits]
  const regrouped = groupBacklog(rankBacklog({ tasks: both, playNext: null }, null), blockedTasks(both), both)
  expect(regrouped.blocked.map(e => (e.kind === 'group' ? `◆ ${e.group.parent.title}` : e.kind === 'blocked' ? e.task.title : ''))).toEqual([
    'Stuck',
    '◆ Shell',
  ])
  expect(ready.some(e => e.kind === 'group' && e.group.parent.id === menu.id)).toBe(true)
})

test('a feature comes after its own tasks of the same priority, but priority still comes first', () => {
  const menu = makeTask({ title: 'Menu parity', priority: 'mid', created: at(1) })
  const keys = makeTask({ title: 'Keys hint', priority: 'mid', parentId: menu.id, created: at(2) })
  const urgentFeature = makeTask({ title: 'Outage', priority: 'urgent', created: at(3) })
  const fix = makeTask({ title: 'Fix', priority: 'mid', parentId: urgentFeature.id, created: at(4) })

  expect(rankBacklog({ tasks: [menu, keys], playNext: null }, null).map(r => r.task.title)).toEqual(['Keys hint', 'Menu parity'])
  expect(rankBacklog({ tasks: [menu, keys, urgentFeature, fix], playNext: null }, null).map(r => r.task.title)).toEqual([
    'Outage',
    'Keys hint',
    'Fix',
    'Menu parity',
  ])
  // Without features, the order is as it was: oldest first.
  const a = makeTask({ title: 'A', created: at(1) })
  const b = makeTask({ title: 'B', created: at(2) })
  expect(rankBacklog({ tasks: [b, a], playNext: null }, null).map(r => r.task.title)).toEqual(['A', 'B'])
})

test('removing a feature leaves its tasks on their own', () => {
  const { menu, keys, tasks } = family()
  const after = removeTask(tasks, menu.id)

  expect(after.find(t => t.id === menu.id)?.state).toBe('removed')
  expect(after.find(t => t.id === keys.id)?.parentId).toBeNull()
  // A task that can't be removed changes nothing.
  const current = makeTask({ state: 'current' })
  expect(removeTask([current, keys], current.id)).toEqual([current, keys])
})

test('a new task is on its own unless given a parent', () => {
  const base = { title: 'X', priority: 'mid' as const, difficulty: 'light' as const, messages: [], now: at(0), id: 't-1' }

  expect(newTask(base).parentId).toBeNull()
  expect(newTask({ ...base, parentId: 't-0' }).parentId).toBe('t-0')
})

test('a record from before features loads: no parent, no feature, every field kept', () => {
  const old = makeTask({ title: 'Old', branch: 'task/old', blockedBy: ['t-x'] }) as Partial<Task>
  delete old.parentId
  const text = JSON.stringify({ version: 1, project: { name: 'p', path: '/p' }, docsLogPath: null, playNext: null, tasks: [old], unassignedMinutesByDay: {} })
  const read = parseRecord(text)

  expect(read === 'unreadable').toBe(false)
  if (read === 'unreadable') return
  expect(read.feature).toBeNull()
  expect(read.tasks[0]).toEqual({ ...old, parentId: null } as Task)
})

test('a task saved without an id gets one from its creation and title, the same at every read', () => {
  const bare = makeTask({ title: 'No id', created: at(7) }) as Partial<Task>
  delete bare.id
  const text = JSON.stringify({ ...emptyRecord('p', '/p'), tasks: [bare, makeTask({ title: 'Has id' })] })
  const first = parseRecord(text)
  const second = parseRecord(text)

  const idOf = (r: ProjectRecord | 'unreadable') => (r === 'unreadable' ? null : r.tasks[0]!.id)
  expect(idOf(first)).toMatch(/^t-[0-9a-f]{8}$/)
  expect(idOf(first)).toBe(idOf(second))
})

test('parent and feature survive a write and a read', () => {
  const { menu, tasks } = family()
  const read = parseRecord(JSON.stringify(recordOf(tasks, menu.id)))

  expect(read === 'unreadable' ? null : [read.feature, read.tasks.map(t => t.parentId)]).toEqual([
    menu.id,
    [null, menu.id, menu.id, menu.id],
  ])
})
