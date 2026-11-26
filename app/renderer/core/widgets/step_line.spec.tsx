// @vitest-environment jsdom
import { cleanup, render, screen, within } from '@testing-library/preact'
import { afterEach, expect, it } from 'vitest'

import type { TaskStep } from '../../../../types'
import { t } from '../../l10n/en'
import { StepLine } from './step_line'

afterEach(cleanup)
const running: TaskStep = { id: 'test', at: '2026-11-04T12:01:00Z', finished: null, kind: 'test', status: 'running', subject: 'npm test' }

it('shows the step a task is on now, in one line', () => {
  render(<StepLine step={running} />)
  const line = screen.getByLabelText(t.activity.stepLabel)
  expect(within(line).getByText(t.activity.now)).toBeTruthy()
  expect(within(line).getByText(t.activity.doing.test)).toBeTruthy()
  expect(within(line).getByText('npm test')).toBeTruthy()
  expect(within(line).queryByText(t.activity.status.running)).toBeNull()
})

it('between steps, shows the last one and how it ended', () => {
  const view = render(<StepLine step={{ ...running, status: 'failed', finished: '2026-11-04T12:02:00Z' }} />)
  const line = screen.getByLabelText(t.activity.stepLabel)
  expect(within(line).getByText(t.activity.last)).toBeTruthy()
  expect(within(line).getByText(t.activity.done.test)).toBeTruthy()
  expect(within(line).getByText(t.activity.status.failed)).toBeTruthy()
  view.rerender(<StepLine step={{ ...running, id: 'edit', kind: 'edit', subject: 'a.ts', status: 'succeeded', finished: '2026-11-04T12:02:00Z' }} />)
  expect(screen.getAllByLabelText(t.activity.stepLabel)).toHaveLength(1)
  expect(within(screen.getByLabelText(t.activity.stepLabel)).getByText('a.ts')).toBeTruthy()
})

it('renders a step as plain text', () => {
  render(<StepLine step={{ ...running, subject: '<img src=x onerror="alert(1)">' }} />)
  expect(screen.getByText('<img src=x onerror="alert(1)">').tagName).toBe('CODE')
  expect(document.querySelector('img')).toBeNull()
})
