// @vitest-environment jsdom
import { act, cleanup, render, screen } from '@testing-library/preact'
import { afterEach, expect, it, vi } from 'vitest'
import type { CheckRun } from '../../../../../shared/branches'
import { mergeWorkspace } from '../../test_fixtures'
import { MergeChecks } from './merge_checks'

afterEach(() => { cleanup(); vi.useRealTimers() })
it('replaces old failures with the latest attempt and bounds the number of rendered logs', async () => {
  const workspace = mergeWorkspace({ availableChecks: [{ id: 'test', name: 'test', folder: '.', command: 'npm test' }] })
  const run: CheckRun = { id: 'old', checkId: 'test', name: 'test', command: 'npm test', tree: workspace.operation.tree!, at: 1000, finished: 2000, owner: 1, status: 'failed', output: 'OLD FAILURE', exitCode: 1, truncated: false }
  workspace.checks = Array.from({ length: 100 }, (_, n) => ({ ...run, id: `old-${n}` }))
  workspace.checks.push({ ...run, id: 'retry', status: 'running', finished: null, exitCode: null, output: 'new live output' })
  const page = render(<MergeChecks workspace={workspace} busy onRun={() => {}} onCancel={() => {}} />)
  expect(screen.queryByText('OLD FAILURE')).toBeNull()
  expect(screen.getAllByRole('log')).toHaveLength(1)
  expect(screen.getByRole('log').textContent).toBe('new live output')
  const checks = [...workspace.checks.slice(0, -1), { ...run, id: 'retry', status: 'succeeded' as const, output: 'new passed output', exitCode: 0 }]
  await act(async () => page.rerender(<MergeChecks workspace={{ ...workspace, checks, checksCurrent: true }} busy={false} onRun={() => {}} onCancel={() => {}} />))
  expect(screen.getByText('Passed')).toBeTruthy()
  expect(screen.queryByText('Failed')).toBeNull()
  expect(screen.getByRole('log').textContent).toBe('new passed output')
})

it('ticks elapsed time during a check and freezes its duration after completion', async () => {
  vi.useFakeTimers(); vi.setSystemTime(10_000)
  const workspace = mergeWorkspace({ availableChecks: [{ id: 'build', name: 'build', folder: '.', command: 'npm run build' }], checks: [{ id: 'run', checkId: 'build', name: 'build', command: 'npm run build', tree: 'tree', at: 8000, finished: null, owner: 1, status: 'running', output: '', exitCode: null, truncated: false }] })
  const page = render(<MergeChecks workspace={workspace} busy onRun={() => {}} onCancel={() => {}} />)
  expect(screen.getByText(/Elapsed 0:02/)).toBeTruthy()
  await act(async () => { vi.advanceTimersByTime(3000) })
  expect(screen.getByText(/Elapsed 0:05/)).toBeTruthy()
  await act(async () => page.rerender(<MergeChecks workspace={{ ...workspace, checks: [{ ...workspace.checks![0]!, status: 'failed', finished: 13_000 }] }} busy={false} onRun={() => {}} onCancel={() => {}} />))
  expect(screen.getByText('Duration 0:05')).toBeTruthy()
  await act(async () => { vi.advanceTimersByTime(10_000) })
  expect(screen.getByText('Duration 0:05')).toBeTruthy()
})
