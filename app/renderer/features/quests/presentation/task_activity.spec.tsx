// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from '@testing-library/preact'
import { afterEach, expect, it } from 'vitest'

import type { QuestActivity } from '../../../../shared/engine_api'
import { t } from '../../../l10n/en'
import { TaskActivity } from './widgets/task_activity'

afterEach(cleanup)
const activity = (): QuestActivity => ({
  steps: [
    { id: 'branch', at: '2026-11-04T12:00:00Z', finished: '2026-11-04T12:00:00Z', kind: 'branchCreated', status: 'succeeded', subject: 'task/activity', output: '', truncated: false },
    { id: 'test', at: '2026-11-04T12:01:00Z', finished: '2026-11-04T12:02:00Z', kind: 'test', status: 'failed', subject: 'npm test', output: '1 failed\nExpected 2, received 1', truncated: false },
  ],
  commits: [{ id: 'abc1234', at: '2026-11-04T12:03:00Z', message: 'added the activity feed', remotes: ['origin/main'] }],
  gitUnavailable: false,
})

it('shows ordered steps, command outcomes, expandable output, and the real commit message', () => {
  render(<TaskActivity activity={activity()} />)
  const rows = screen.getAllByRole('listitem')
  expect(within(rows[0]!).getByText('task/activity')).toBeTruthy()
  expect(within(rows[1]!).getByText(t.activity.status.failed)).toBeTruthy()
  expect(within(rows[1]!).getByText('npm test')).toBeTruthy()
  const details = screen.getByText(t.activity.output).closest('details')!
  expect(details.open).toBe(false)
  fireEvent.click(screen.getByText(t.activity.output))
  expect(details.textContent).toContain('Expected 2, received 1')
  expect(within(rows[2]!).getByText('added the activity feed')).toBeTruthy()
  expect(screen.getByText(t.activity.remote(['origin/main']))).toBeTruthy()
  expect(screen.getByText(t.activity.remoteHint)).toBeTruthy()
})

it('updates a command in place and preserves expanded output on refresh', () => {
  const data = activity()
  const view = render(<TaskActivity activity={data} />)
  const details = screen.getByText(t.activity.output).closest('details')!
  details.open = true
  view.rerender(<TaskActivity activity={{ ...data, steps: [...data.steps, { ...data.steps[1]!, id: 'next', status: 'running', output: '' }] }} />)
  expect(details.open).toBe(true)
  expect(screen.getByText(t.activity.status.running)).toBeTruthy()
  expect(screen.getByText(t.activity.waiting)).toBeTruthy()
})

it('renders command output as plain text', () => {
  const data = activity()
  data.steps[1]!.output = '<img src=x onerror="alert(1)">'
  render(<TaskActivity activity={data} />)
  expect(screen.getByText(data.steps[1]!.output).tagName).toBe('PRE')
  expect(document.querySelector('img')).toBeNull()
})

it('explains empty, incomplete, and failed reads', () => {
  const view = render(<TaskActivity activity={{ steps: [], commits: [], gitUnavailable: true }} />)
  expect(screen.getByText(t.activity.empty)).toBeTruthy()
  expect(screen.getByRole('alert').textContent).toBe(t.activity.gitUnavailable)
  const data = activity()
  data.steps[1]!.truncated = true
  data.commits[0]!.remotes = null
  view.rerender(<TaskActivity activity={data} />)
  expect(screen.getByText(t.activity.excerpt)).toBeTruthy()
  expect(screen.getByText(t.activity.unknownRemote)).toBeTruthy()
})
