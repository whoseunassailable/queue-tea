import { expect, test } from 'claude-code/testing'

import { featureCommand, fileTask, moveTask, onMessage, removeQueued, setFeature, startTask } from '../hooks/flow'
import { emptyRecord, updateRecord } from '../hooks/record'
import type { ProjectRecord, Task } from '../types'
import { CTX, fakePorts, makeTask, memoryHost } from './helpers'
import type { Run } from './helpers'

const OID = '# branch.oid 1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b'
const CLEAN = [OID, '# branch.head main', '# branch.upstream origin/main', '# branch.ab +0 -0', ''].join('\n')
const DIRTY = [OID, '# branch.head task/menu', '# branch.upstream origin/task/menu', '# branch.ab +0 -0', '? a.ts', ''].join('\n')
const stored = (mem: ReturnType<typeof memoryHost>) => JSON.parse(mem.files.get(CTX.file)!) as ProjectRecord
const recordOf = (tasks: Task[], feature: string | null = null): ProjectRecord => ({ ...emptyRecord('p', '/p'), tasks, feature })
const repo = (r: ProjectRecord, git: Record<string, Run> = {}) => memoryHost({ files: { [CTX.file]: JSON.stringify(r) }, git })
const gitWith = (status: string, more: Record<string, Run> = {}): Record<string, Run> => ({
  'git rev-parse --is-inside-work-tree': { stdout: 'true\n' },
  'git status --porcelain=v2 --branch': { stdout: status },
  'git branch --format=%(refname:short)': { stdout: 'main\n' },
  'git rev-parse HEAD': { stdout: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b\n' },
  ...more,
})
const ARROWS = { text: 'add arrow keys to the menu', title: 'Arrow keys', priority: 'high' as const, difficulty: 'light' as const, intent: 'improving' as const }
const isGitWrite = (argv: string[]) => argv[0] === 'git' && ['switch', 'checkout', 'branch', 'commit', 'push'].includes(argv[1] ?? '')

test('with a feature active, a message the check ties to it is offered under it, Save waiting on nothing', async () => {
  const menu = makeTask({ title: 'Menu parity' })
  const r = recordOf([menu], menu.id)
  const { ports, view } = fakePorts(repo(r), {
    reply: `{"kind":"new","intent":"improving","title":"Arrow keys","difficulty":"light","parent":"${menu.id}"}`,
    view: { record: r },
  })

  expect((await onMessage(ports, CTX, 'add arrow keys')).kind).toBe('new')
  expect(view.band).toEqual({
    kind: 'file',
    ...ARROWS,
    text: 'add arrow keys',
    priority: 'mid',
    parent: { kind: 'task', id: menu.id },
    choices: [menu.id],
  })
})

test('with a feature active, unrelated work stays on its own; the check is told which one is active', async () => {
  const menu = makeTask({ title: 'Menu parity' })
  const r = recordOf([menu], menu.id)
  const prompts: string[] = []
  const { ports, view } = fakePorts(repo(r), {
    reply: '{"kind":"new","intent":"improving","title":"CI cache","difficulty":"light","parent":"none"}',
    view: { record: r },
  })
  const fork = ports.ask.fork
  ports.ask.fork = async prompt => {
    prompts.push(prompt)

    return fork(prompt)
  }

  await onMessage(ports, CTX, 'fix the CI cache')
  expect(view.band.kind === 'file' ? view.band.parent : undefined).toEqual({ kind: 'none' })
  expect(prompts[0]).toContain(`${menu.id} "Menu parity" (active)`)
})

test('when the check can’t tell, Rohan is asked, and Save files nothing until he picks', async () => {
  const menu = makeTask({ title: 'Menu parity' })
  const r = recordOf([menu], menu.id)
  const mem = repo(r)
  const { ports, view } = fakePorts(mem, {
    reply: '{"kind":"new","intent":"improving","title":"Tidy","difficulty":"light","parent":"unsure"}',
    view: { record: r },
  })

  await onMessage(ports, CTX, 'tidy things up')
  expect(view.band.kind === 'file' ? view.band.parent : undefined).toBeNull()

  await fileTask(ports, CTX, { ...ARROWS, parent: null })
  expect(view.notice).toBe('Pick what it is part of first, or On its own.')
  expect(mem.writes).toEqual([])
  expect(view.band.kind).toBe('file')
})

test('a message the check ties to a task on its own is offered under it; saved, that task becomes its feature', async () => {
  const now = makeTask({ title: 'Insole bridge', state: 'current', branch: 'task/insole-bridge', startCommit: 'abc1234' })
  const docs = makeTask({ title: 'Fix the documentation' })
  const r = recordOf([now, docs])
  const mem = repo(r, gitWith(CLEAN))
  const prompts: string[] = []
  const { ports, view, done, settle } = fakePorts(mem, {
    reply: `{"kind":"new","intent":"improving","title":"Homepage parts","difficulty":"light","parent":"${docs.id}"}`,
    view: { record: r },
  })
  const fork = ports.ask.fork
  ports.ask.fork = async prompt => {
    prompts.push(prompt)

    return fork(prompt)
  }

  await onMessage(ports, CTX, 'the parts on the home page should go elsewhere')
  expect(prompts[0]).toContain(`Tasks on their own: ${docs.id} "Fix the documentation".`)
  expect(view.band).toMatchObject({ kind: 'file', parent: { kind: 'task', id: docs.id }, choices: [docs.id, now.id] })

  await fileTask(ports, CTX, { ...ARROWS, title: 'Homepage parts', parent: { kind: 'task', id: docs.id } })
  await settle()
  const saved = stored(mem)
  expect(saved.tasks.map(t => [t.title, t.state, t.parentId])).toEqual([
    ['Insole bridge', 'current', null],
    ['Fix the documentation', 'queued', null],
    ['Homepage parts', 'queued', docs.id],
  ])
  expect(saved.feature).toBeNull()
  expect(mem.runs.filter(isGitWrite)).toEqual([])
  expect(done.toasts).toEqual(['Queued: Homepage parts (high) · part of Fix the documentation'])
})

test('filing a task under the current one keeps the current task, its branch and the conversation', async () => {
  const menu = makeTask({ title: 'Menu parity', state: 'current', branch: 'task/menu-parity', startCommit: 'abc1234' })
  const r = recordOf([menu])
  const mem = repo(r, gitWith(CLEAN))
  const { ports, done, settle } = fakePorts(mem, { view: { record: r } })

  await fileTask(ports, CTX, { ...ARROWS, parent: { kind: 'task', id: menu.id } })
  await settle()

  const tasks = stored(mem).tasks
  expect(tasks.map(t => [t.title, t.state, t.branch, t.parentId])).toEqual([
    ['Menu parity', 'current', 'task/menu-parity', null],
    ['Arrow keys', 'queued', null, menu.id],
  ])
  expect(tasks[1]!.title).toBe('Arrow keys')
  expect(mem.runs.filter(isGitWrite)).toEqual([])
  expect([done.clears, done.submits]).toEqual([0, []])
  expect(done.toasts).toEqual(['Queued: Arrow keys (high) · part of Menu parity'])
})

test('a new feature is filed with its first task; with nothing current, the task starts, not the feature', async () => {
  const mem = repo(recordOf([]), gitWith(CLEAN, { 'git switch -c task/arrow-keys': {} }))
  const { ports, settle } = fakePorts(mem)

  await fileTask(ports, CTX, { ...ARROWS, parent: { kind: 'new', title: '  Menu parity ' } })
  await settle()

  const [feature, arrows] = stored(mem).tasks
  expect([feature?.title, feature?.state, feature?.parentId, feature?.priority]).toEqual(['Menu parity', 'queued', null, 'high'])
  expect([arrows?.title, arrows?.state, arrows?.branch, arrows?.parentId]).toEqual(['Arrow keys', 'current', 'task/arrow-keys', feature?.id])
})

test('a new feature with no name files nothing', async () => {
  const mem = repo(recordOf([]))
  const { ports, view } = fakePorts(mem)

  await fileTask(ports, CTX, { ...ARROWS, parent: { kind: 'new', title: ' ' } })
  expect(view.notice).toBe('Name the new feature first.')
  expect(mem.writes).toEqual([])
})

test('a feature removed in another session since the band went up: refused, nothing filed, the band kept', async () => {
  const menu = makeTask({ title: 'Menu parity' })
  const mem = repo(recordOf([{ ...menu, state: 'removed' }]))
  const { ports, view, done } = fakePorts(mem, { view: { band: { kind: 'file', ...ARROWS, parent: { kind: 'task', id: menu.id }, choices: [menu.id] } } })

  await fileTask(ports, CTX, { ...ARROWS, parent: { kind: 'task', id: menu.id } })
  expect(stored(mem).tasks.map(t => t.title)).toEqual(['Menu parity'])
  expect(view.notice).toBe('That feature is no longer open. Pick again.')
  expect(view.band.kind).toBe('file')
  expect(done.toasts).toEqual([])
})

test('two sessions filing at once: each task is kept, with its feature', async () => {
  const menu = makeTask({ title: 'Menu parity', state: 'current' })
  const mem = repo(recordOf([menu]))
  const { ports } = fakePorts(mem)

  // Another session files a task between this one's read and its write.
  const other = makeTask({ title: 'From the other session', parentId: menu.id })
  const read = mem.host.read
  let isFirst = true
  mem.host.read = async path => {
    const text = await read(path)
    if (isFirst && path === CTX.file) {
      isFirst = false
      mem.files.set(CTX.file, JSON.stringify(recordOf([menu, other])))

      return mem.files.get(CTX.file)!
    }

    return text
  }
  await fileTask(ports, CTX, { ...ARROWS, parent: { kind: 'task', id: menu.id } })

  expect(stored(mem).tasks.map(t => [t.title, t.parentId])).toEqual([
    ['Menu parity', null],
    ['From the other session', menu.id],
    ['Arrow keys', menu.id],
  ])
})

test('a write from another session after this one keeps the parent and the feature', async () => {
  const menu = makeTask({ title: 'Menu parity' })
  const keys = makeTask({ title: 'Keys', parentId: menu.id })
  const mem = repo(recordOf([menu, keys], menu.id))

  // A change that knows nothing of features, as an older Queue-tea's, spreads
  // the record and the tasks it read.
  await updateRecord(mem.host, CTX.file, r => ({ ...r, tasks: r.tasks.map(t => ({ ...t, priority: 'low' as const })) }), 'p', '/p')

  expect(stored(mem).feature).toBe(menu.id)
  expect(stored(mem).tasks.map(t => [t.priority, t.parentId])).toEqual([
    ['low', null],
    ['low', menu.id],
  ])
})

test('Part of…: a task moves under a feature and back; deeper nesting is refused with why', async () => {
  const menu = makeTask({ title: 'Menu parity' })
  const keys = makeTask({ title: 'Keys', parentId: menu.id })
  const docs = makeTask({ title: 'Docs' })
  const mem = repo(recordOf([menu, keys, docs]))
  const { ports, view, done } = fakePorts(mem, { view: { parenting: docs.id } })

  await moveTask(ports, CTX, docs.id, menu.id)
  expect(stored(mem).tasks.find(t => t.id === docs.id)?.parentId).toBe(menu.id)
  expect(view.parenting).toBeNull()
  expect(done.toasts).toEqual(['Part of Menu parity: Docs'])

  await moveTask(ports, CTX, docs.id, null)
  expect(stored(mem).tasks.find(t => t.id === docs.id)?.parentId).toBeNull()
  expect(done.toasts.at(-1)).toBe('On its own: Docs')

  await moveTask(ports, CTX, docs.id, keys.id)
  expect(stored(mem).tasks.find(t => t.id === docs.id)?.parentId).toBeNull()
  expect(view.notice).toBe('Keys is part of Menu parity, so its tasks go under that.')

  await moveTask(ports, CTX, menu.id, docs.id)
  expect(stored(mem).tasks.find(t => t.id === menu.id)?.parentId).toBeNull()
  expect(view.notice).toBe("Menu parity has tasks of its own, so it can't be part of another.")
})

test('moving the current task under a feature changes nothing else about it', async () => {
  const now = makeTask({ title: 'Now', state: 'current', branch: 'task/now', startCommit: 'abc1234' })
  const menu = makeTask({ title: 'Menu parity' })
  const mem = repo(recordOf([now, menu]))
  const { ports } = fakePorts(mem)

  await moveTask(ports, CTX, now.id, menu.id)
  expect(stored(mem).tasks[0]).toEqual({ ...now, parentId: menu.id })
  expect(mem.runs.filter(isGitWrite)).toEqual([])
})

test('/feature: shows, sets by title or id, says when several or none match, and clears', async () => {
  const menu = makeTask({ title: 'Menu parity' })
  const menuDocs = makeTask({ title: 'Menu docs' })
  const keys = makeTask({ title: 'Keys hint', parentId: menu.id })
  const mem = repo(recordOf([menu, menuDocs, keys]))
  const { ports } = fakePorts(mem)

  expect(await featureCommand(ports, CTX, '')).toBe('No active feature. /feature <title of a task> sets one; /feature off clears it.')
  expect(await featureCommand(ports, CTX, 'menu')).toBe('Several tasks match: Menu parity; Menu docs. Use more of the title.')
  expect(await featureCommand(ports, CTX, 'dark mode')).toBe('No open task matches "dark mode". File it first with /steep, then /feature <its title>.')
  // A task under a feature is never one itself.
  expect(await featureCommand(ports, CTX, 'keys hint')).toBe('No open task matches "keys hint". File it first with /steep, then /feature <its title>.')
  expect(stored(mem).feature).toBeNull()

  expect(await featureCommand(ports, CTX, 'menu PARITY')).toBe('Active feature: Menu parity. New tasks that belong to it are offered under it.')
  expect(stored(mem).feature).toBe(menu.id)
  expect(await featureCommand(ports, CTX, '')).toBe('Active feature: Menu parity. /feature off clears it.')
  expect(await featureCommand(ports, CTX, menuDocs.id)).toContain('Active feature: Menu docs.')
  expect(await featureCommand(ports, CTX, 'off')).toBe('No active feature now.')
  expect(stored(mem).feature).toBeNull()
  expect(await featureCommand(ports, CTX, 'clear')).toBe('No feature was active.')
})

test('setFeature refuses a task under a feature, and one no longer open', async () => {
  const menu = makeTask({ title: 'Menu parity' })
  const keys = makeTask({ title: 'Keys', parentId: menu.id })
  const old = makeTask({ title: 'Old', state: 'done' })
  const mem = repo(recordOf([menu, keys, old]))
  const { ports } = fakePorts(mem)

  expect(await setFeature(ports, CTX, keys.id)).toBe('Keys is part of Menu parity; make that the feature instead.')
  expect(await setFeature(ports, CTX, old.id)).toBe('That task is no longer open.')
  expect(stored(mem).feature).toBeNull()
})

test('removing a feature leaves its tasks on their own and it is no longer active', async () => {
  const menu = makeTask({ title: 'Menu parity' })
  const keys = makeTask({ title: 'Keys', parentId: menu.id })
  const mem = repo(recordOf([menu, keys], menu.id))
  const { ports } = fakePorts(mem)

  await removeQueued(ports, CTX, menu.id)
  expect(stored(mem).feature).toBeNull()
  expect(stored(mem).tasks.map(t => [t.state, t.parentId])).toEqual([
    ['removed', null],
    ['queued', null],
  ])
})

test('a task under the current feature can’t start while the feature is current: one task at a time', async () => {
  const menu = makeTask({ title: 'Menu parity', state: 'current', branch: 'task/menu-parity' })
  const keys = makeTask({ title: 'Keys', parentId: menu.id })
  const mem = repo(recordOf([menu, keys]), gitWith(CLEAN, { 'git switch -c task/keys': {} }))
  const { ports } = fakePorts(mem)

  expect(await startTask(ports, CTX, keys.id)).toBe('failed')
  expect(stored(mem).tasks.map(t => t.state)).toEqual(['current', 'queued'])
  expect(mem.runs.filter(isGitWrite)).toEqual([])
})

test('a task under a feature still waits for the git check', async () => {
  const menu = makeTask({ title: 'Menu parity', state: 'done', branch: 'task/menu-parity' })
  const keys = makeTask({ title: 'Keys', parentId: menu.id })
  const mem = repo(recordOf([menu, keys]), gitWith(DIRTY))
  const { ports, view } = fakePorts(mem)

  expect(await startTask(ports, CTX, keys.id)).toBe('held')
  expect(view.hold).toEqual({ taskId: keys.id, text: '1 file not committed' })
  expect(mem.runs.filter(isGitWrite)).toEqual([])
})
