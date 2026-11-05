import { describe, expect, it } from 'vitest'
import { isBranch, isFile, parseLog, parseStatus } from './git_rules'
import { codexEvents } from '../data/observation'
import { graphLayout } from '../../../../renderer/features/branches/domain/graph_layout'
import { branchGraph, SOURCE, TARGET, FORK } from '../../../../renderer/features/branches/test_fixtures'
import { argvOf } from '../data/user_git'
import { isForbiddenGit } from '../../../core/node_host'

it('parses NUL-delimited file names and both sides of a rename', () => {
  expect(parseStatus('R  new name\0old\nname\0?? :path\0 M x\0')).toEqual([
    { status: 'R ', path: 'new name', previous: 'old\nname' }, { status: '??', path: ':path', previous: null }, { status: ' M', path: 'x', previous: null },
  ])
})
it('rejects options, traversal and malformed refs but permits slash branches', () => {
  for (const branch of ['--help', 'a..b', 'a.lock', 'refs/./head', 'a b', 'a@{b', 'a\\b', 'a\n']) expect(isBranch(branch)).toBe(false)
  expect(isBranch('task/tea')).toBe(true)
  expect(isFile('../../outside')).toBe(false)
  expect(isFile('dir/.git/config')).toBe(false)
  expect(isFile('folder/:literal')).toBe(true)
})
it('preserves both merge parents and never invents an ancestry edge from task grouping', () => {
  const graph = branchGraph()
  graph.commits.unshift({ id: 'd'.repeat(40), parents: [TARGET, SOURCE], message: 'Approved merge' })
  const layout = graphLayout(graph)
  expect(layout.edges.map(e => [e.from.id, e.to.id])).toEqual([['d'.repeat(40), TARGET], ['d'.repeat(40), SOURCE], [SOURCE, FORK], [TARGET, FORK]])
  expect(parseLog(`${SOURCE}\0${TARGET} ${FORK}\0merge\n`)[0]!.parents).toEqual([TARGET, FORK])
})
it('keeps the general agent Git guard while exposing only typed user operations', () => {
  expect(isForbiddenGit(['git', '-C', '/repo', 'commit', '-am', 'no'])).toBe(true)
  expect(isForbiddenGit(['git', 'push', 'origin'])).toBe(true)
  expect(argvOf({ kind: 'commitFiles', message: 'literal $(text)', files: [':(glob)*'] })).toEqual(['--literal-pathspecs', 'commit', '--only', '-m', 'literal $(text)', '--', ':(glob)*'])
  expect(argvOf({ kind: 'push', remote: 'origin', head: SOURCE, branch: 'main' })).not.toContain('--force')
})

describe('Codex event evidence', () => {
  const now = Date.parse('2026-11-04T12:00:00Z')
  const row = (type: string, payload: Record<string, unknown>, time = now) => JSON.stringify({ timestamp: new Date(time).toISOString(), type, payload })
  it('pulses only for a fresh executing turn and stops after completion or staleness', () => {
    const start = row('event_msg', { type: 'task_started' })
    expect(codexEvents(start, now - 1000, now).state).toBe('working')
    expect(codexEvents(start, now - 1000, now + 100_000).state).toBe('unobserved')
    expect(codexEvents(start + '\n' + row('event_msg', { type: 'task_complete' }), now - 1000, now).state).toBe('review')
  })
  it('records an explicit failing command output and never treats prose as a passed test', () => {
    const text = [row('response_item', { type: 'function_call', name: 'exec_command', call_id: 'a', arguments: JSON.stringify({ cmd: 'npm test' }) }), row('response_item', { type: 'function_call_output', call_id: 'a', output: 'Process exited with code 1\nTests failed' }), row('response_item', { type: 'message', role: 'assistant', content: 'All tests pass' })].join('\n')
    const observed = codexEvents(text, now - 1000, now)
    expect(observed.steps).toHaveLength(1)
    expect(observed.steps[0]).toMatchObject({ kind: 'test', status: 'failed', subject: 'npm test' })
  })
  it('does not call a background launch successful or accept future timestamps', () => {
    const text = [row('response_item', { type: 'function_call', name: 'exec_command', call_id: 'a', arguments: JSON.stringify({ cmd: 'npm test' }) }), row('response_item', { type: 'function_call_output', call_id: 'a', output: 'Process running with session ID 42' }), row('event_msg', { type: 'task_started' }, now + 10000)].join('\n')
    expect(codexEvents(text + '\n{"unfinished', now - 1000, now).steps[0]!.status).toBe('running')
  })
})
