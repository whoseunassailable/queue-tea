// @vitest-environment jsdom
import { cleanup, render, screen, within } from '@testing-library/preact'
import { afterEach, expect, it } from 'vitest'

import type { QuestActivity } from '../../../../shared/engine_api'
import type { TaskStep } from '../../../../../types'
import { t } from '../../../l10n/en'
import { TaskActivity } from './widgets/task_activity'

afterEach(cleanup)
const running: TaskStep = { id: 'test', at: '2026-11-04T12:01:00Z', finished: null, kind: 'test', status: 'running', subject: 'npm test' }
const activity = (step: TaskStep | null = running): QuestActivity => ({
  step,
  commits: [{ id: 'abc1234', at: '2026-11-04T12:03:00Z', message: 'added the activity feed', remotes: ['origin/main'] }],
  gitUnavailable: false,
})

it('shows one line with the step the quest is on now, and its commits', () => {
  render(<TaskActivity activity={activity()} />)
  const line = screen.getByLabelText(t.activity.stepLabel)
  expect(within(line).getByText(t.activity.now)).toBeTruthy()
  expect(within(line).getByText(t.activity.doing.test)).toBeTruthy()
  expect(within(line).getByText('npm test')).toBeTruthy()
  expect(within(line).queryByText(t.activity.status.running)).toBeNull()
  const rows = screen.getAllByRole('listitem')
  expect(rows).toHaveLength(1)
  expect(within(rows[0]!).getByText('added the activity feed')).toBeTruthy()
  expect(screen.getByText(t.activity.remote(['origin/main']))).toBeTruthy()
  expect(screen.getByText(t.activity.remoteHint)).toBeTruthy()
})

it('between steps, shows the last one and how it ended', () => {
  const view = render(<TaskActivity activity={activity({ ...running, status: 'failed', finished: '2026-11-04T12:02:00Z' })} />)
  const line = screen.getByLabelText(t.activity.stepLabel)
  expect(within(line).getByText(t.activity.last)).toBeTruthy()
  expect(within(line).getByText(t.activity.done.test)).toBeTruthy()
  expect(within(line).getByText(t.activity.status.failed)).toBeTruthy()
  view.rerender(<TaskActivity activity={activity({ ...running, id: 'edit', kind: 'edit', subject: 'a.ts', status: 'succeeded', finished: '2026-11-04T12:02:00Z' })} />)
  expect(screen.getAllByLabelText(t.activity.stepLabel)).toHaveLength(1)
  expect(within(screen.getByLabelText(t.activity.stepLabel)).getByText('a.ts')).toBeTruthy()
})

it('renders a step as plain text', () => {
  render(<TaskActivity activity={activity({ ...running, subject: '<img src=x onerror="alert(1)">' })} />)
  expect(screen.getByText('<img src=x onerror="alert(1)">').tagName).toBe('CODE')
  expect(document.querySelector('img')).toBeNull()
})

it('explains an empty quest and failed reads', () => {
  const view = render(<TaskActivity activity={{ step: null, commits: [], gitUnavailable: true }} />)
  expect(screen.getByText(t.activity.empty)).toBeTruthy()
  expect(screen.getByRole('alert').textContent).toBe(t.activity.gitUnavailable)
  const data = activity()
  data.commits[0]!.remotes = null
  view.rerender(<TaskActivity activity={data} />)
  expect(screen.getByText(t.activity.unknownRemote)).toBeTruthy()
})
