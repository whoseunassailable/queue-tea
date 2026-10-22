import { expect, test } from 'claude-code/testing'

import { commitWarning, putBack, startTask } from '../hooks/flow'
import { emptyRecord } from '../hooks/record'
import { handoffSections } from '../hooks/ui/handoff'
import { cut, weekChart } from '../hooks/ui/status'
import type { ProjectRecord } from '../types'
import { CTX, fakePorts, makeTask, memoryHost } from './helpers'

const OID = '# branch.oid 1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b'
const CLEAN = [OID, '# branch.head main', '# branch.upstream origin/main', '# branch.ab +0 -0', ''].join('\n')
const stored = (mem: ReturnType<typeof memoryHost>) => JSON.parse(mem.files.get(CTX.file)!) as ProjectRecord
const withTasks = (tasks: ProjectRecord['tasks']) => ({ ...emptyRecord('p', '/p'), tasks })

test('putting back without a handoff note still queues the task and says so', async () => {
  const task = makeTask({ title: 'Now', state: 'current', branch: 'task/now' })
  const r = withTasks([task])
  const mem = memoryHost({ files: { [CTX.file]: JSON.stringify(r) } })
  const { ports, view, done } = fakePorts(mem, { view: { record: r, isAskingDone: true, canContinue: true } })

  expect(await putBack(ports, CTX)).toBe('queued')
  expect(stored(mem).tasks[0]!.state).toBe('queued')
  expect(stored(mem).tasks[0]!.handoff).toBeNull()
  expect([view.isAskingDone, view.canContinue, view.isChoosingNext, view.busy]).toEqual([false, false, true, null])
  expect(view.notice).toBe("Couldn't save a checkpoint, so Start will begin from what was saved before.")
  expect(done.toasts).toEqual(['Back in the backlog: Now'])
})

test('with no current task, putting back does nothing', async () => {
  const r = withTasks([makeTask()])
  const mem = memoryHost({ files: { [CTX.file]: JSON.stringify(r) } })
  const { ports } = fakePorts(mem, { view: { record: r } })

  expect(await putBack(ports, CTX)).toBe('none')
  expect(mem.writes).toEqual([])
})

test('starting a put-back task goes back to its branch and keeps its start', async () => {
  const task = makeTask({ title: 'Now', branch: 'task/now', startCommit: '0f0f0f0', started: '2026-10-20T10:00:00+02:00' })
  const r = withTasks([task])
  const mem = memoryHost({
    files: { [CTX.file]: JSON.stringify(r) },
    git: {
      'git rev-parse --is-inside-work-tree': { stdout: 'true\n' },
      'git status --porcelain=v2 --branch': { stdout: CLEAN },
      'git branch --format=%(refname:short)': { stdout: 'main\ntask/now\n' },
      'git switch task/now': {},
    },
  })
  const { ports } = fakePorts(mem, { view: { record: r } })

  expect(await startTask(ports, CTX, task.id)).toBe('started')
  const saved = stored(mem).tasks[0]!
  expect([saved.state, saved.branch, saved.startCommit, saved.started]).toEqual([
    'current',
    'task/now',
    '0f0f0f0',
    '2026-10-20T10:00:00+02:00',
  ])
  expect(mem.runs.some(argv => argv.join(' ') === 'git switch task/now')).toBe(true)
  expect(mem.runs.some(argv => argv.includes('-c'))).toBe(false)
})

test('a branch change during a turn is no commit warning', async () => {
  const mem = memoryHost({
    git: { 'git rev-parse HEAD': { stdout: 'bbbbbbb\n' }, 'git symbolic-ref --short -q HEAD': { stdout: 'other\n' } },
  })
  const { ports, view } = fakePorts(mem)

  expect(await commitWarning(ports, CTX, { commit: 'aaaaaaa', branch: 'task/now' })).toBeNull()
  expect(await commitWarning(ports, CTX, { commit: 'bbbbbbb', branch: 'other' })).toBeNull()
  expect(await commitWarning(ports, CTX, null)).toBeNull()
  expect(view.warning).toBeNull()
})

test('two new commits are counted, the newest named', async () => {
  const mem = memoryHost({
    git: {
      'git rev-parse HEAD': { stdout: 'ccccccc\n' },
      'git symbolic-ref --short -q HEAD': { stdout: 'main\n' },
      'git log --format=%h %s aaaaaaa..ccccccc': { stdout: 'ccccccc Second\nbbbbbbb First\n' },
    },
  })
  const { ports, view } = fakePorts(mem)

  await commitWarning(ports, CTX, { commit: 'aaaaaaa', branch: 'main' })
  expect(view.warning).toBe("During the last turn 2 commits appeared, newest ccccccc Second. Queue-tea stops Claude's commits, so check it was yours.")
})

test('a note in the older shape is split at its own headings', () => {
  const note = ['Task: the review', '', 'Done:', '- Read the chat', 'Files changed:', '- docs/x.md', 'Left:', '- File the ideas'].join('\n')

  expect(handoffSections(note)).toEqual([
    { heading: 'Note', lines: ['Task: the review'] },
    { heading: 'Done', lines: ['- Read the chat'] },
    { heading: 'Files changed', lines: ['- docs/x.md'] },
    { heading: 'Left', lines: ['- File the ideas'] },
  ])
  expect(handoffSections('Just one line of text.\nAnd another.')).toBeNull()
  expect(handoffSections('## Overview\n- a\n**Next steps:**\n- b')?.map(s => s.heading)).toEqual(['Overview', 'Next steps'])
})

test('the week chart is blank with no time, and cut ends with an ellipsis', () => {
  expect(weekChart([0, 0, 0, 0, 0, 0, 0])).toBe('M    T    W    T    F    S    S  ')
  expect(weekChart([10, 80, 0, 0, 0, 0, 40])).toBe('M ▁  T █  W    T    F    S    S ▄')
  expect(cut('Finish the scan page', 10)).toBe('Finish th…')
  expect(cut('Short', 10)).toBe('Short')
})
