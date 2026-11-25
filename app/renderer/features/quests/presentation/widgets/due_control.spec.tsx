// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/preact'
import { useState } from 'preact/hooks'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { Answer } from '../../../../core/api/engine_client'
import { t } from '../../../../l10n/en'
import { DueControl } from './due_control'

const TODAY = '2026-11-25'
const field = () => screen.getByLabelText(t.detail.due) as HTMLInputElement

// The control as a pane holds it: the due date comes back from the engine.
const Holder = ({ start, onChange }: { start: string | null; onChange: (due: string | null) => Promise<Answer<unknown>> }) => {
  const [due, setDue] = useState(start)

  return (
    <DueControl
      due={due}
      today={TODAY}
      onChange={async next => {
        const answer = await onChange(next)
        if (answer.ok) setDue(next)

        return answer
      }}
    />
  )
}
const open = (start: string | null, answer: Answer<unknown> = { ok: true, data: null }) => {
  const onChange = vi.fn(async () => answer)
  render(<Holder start={start} onChange={onChange} />)

  return onChange
}

afterEach(cleanup)

describe('the due date', () => {
  it('says there is none, and saves a day only once the field is left', async () => {
    const onChange = open(null)
    expect(screen.getByText(t.detail.dueNone)).toBeTruthy()

    fireEvent.input(field(), { target: { value: '2026-12-01' } })
    expect(onChange).not.toHaveBeenCalled()
    await act(async () => void fireEvent.blur(field()))

    expect(onChange).toHaveBeenCalledWith('2026-12-01')
    expect(await screen.findByText(t.detail.dueOn('2026-12-01', 6))).toBeTruthy()
  })

  it('saves on Return, and not again when nothing changed', async () => {
    const onChange = open('2026-12-01')

    fireEvent.input(field(), { target: { value: '2026-11-26' } })
    await act(async () => void fireEvent.keyDown(field(), { key: 'Enter' }))
    await waitFor(() => expect(onChange).toHaveBeenCalledWith('2026-11-26'))
    await act(async () => void fireEvent.blur(field()))

    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('says when a quest is overdue', () => {
    open('2026-11-20')

    expect(screen.getByText(t.detail.dueOverdue('2026-11-20', -5))).toBeTruthy()
  })

  it('clears it with the button, or by emptying the field', async () => {
    const onChange = open('2026-12-01')

    await act(async () => void fireEvent.click(screen.getByRole('button', { name: t.detail.dueClear })))
    expect(onChange).toHaveBeenLastCalledWith(null)
    expect(await screen.findByText(t.detail.dueNone)).toBeTruthy()
    expect(screen.queryByRole('button', { name: t.detail.dueClear })).toBeNull()

    cleanup()
    const again = open('2026-12-01')
    fireEvent.input(field(), { target: { value: '' } })
    await act(async () => void fireEvent.blur(field()))
    expect(again).toHaveBeenCalledWith(null)
  })

  it("says why, and keeps the day, when the engine won't take it", async () => {
    open('2026-12-01', { ok: false, message: 'Pick a due date from the calendar, or clear it.' })

    fireEvent.input(field(), { target: { value: '2026-12-09' } })
    await act(async () => void fireEvent.blur(field()))

    expect(await screen.findByText('Pick a due date from the calendar, or clear it.')).toBeTruthy()
    expect(field().value).toBe('2026-12-09')
    expect(field().getAttribute('aria-invalid')).toBe('true')
  })

  it("sends nothing for a day that isn't real", async () => {
    const onChange = open(null)

    // A date field won't hold 30 February; it reads as empty.
    fireEvent.input(field(), { target: { value: '2026-02-30' } })
    await act(async () => void fireEvent.blur(field()))

    expect(onChange).not.toHaveBeenCalled()
    expect(screen.getByText(t.detail.dueNone)).toBeTruthy()
  })
})
