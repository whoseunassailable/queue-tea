// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from '@testing-library/preact'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { TestProfile, TestProfileId } from '../../../../../types'
import { t } from '../../../l10n/en'
import { TestProfileControl } from './widgets/test_profile_control'

afterEach(cleanup)

const chip = (id: TestProfileId) => screen.getByRole('button', { name: t.testProfile.names[id] })
const pressed = () => screen.getAllByRole('button').filter(b => b.getAttribute('aria-pressed') === 'true').map(b => b.textContent)
const show = (profile: TestProfile | null, onChange: (id: TestProfileId | null) => Promise<unknown> | void = vi.fn()) => {
  render(<TestProfileControl profile={profile} onChange={onChange} />)

  return onChange
}

describe('the test profile control', () => {
  it('offers the five profiles, lightest first, and with none picked says Tea-DD will pick', () => {
    show(null)

    expect(screen.getByRole('group', { name: t.testProfile.label })).toBeTruthy()
    expect(screen.getAllByRole('button').map(b => b.textContent)).toEqual(['Quick', 'Standard', 'Deep', 'Critical', 'Release'])
    expect(pressed()).toEqual([])
    expect(screen.getByText(t.testProfile.none)).toBeTruthy()
  })

  it("shows Tea-DD's pick pressed, with its reason and what the profile runs", () => {
    show({ id: 'deep', by: 'tea-dd', reason: 'a stored field old records must still read' })

    expect(pressed()).toEqual(['Deep'])
    expect(screen.getByText(new RegExp(`Tea-DD chose Deep: a stored field old records must still read ${t.testProfile.runs.deep}`))).toBeTruthy()
  })

  it("shows Rohan's pick as his, and how to hand it back", () => {
    show({ id: 'critical', by: 'rohan' })

    expect(pressed()).toEqual(['Critical'])
    expect(screen.getByText(new RegExp(t.testProfile.rohans('Critical').replace(/[.;?]/g, '\\$&')))).toBeTruthy()
  })

  it("pressing a profile saves it as Rohan's, over Tea-DD's, and says it is saving until the save ends", async () => {
    let finish = () => {}
    const onChange = vi.fn(() => new Promise<void>(resolve => (finish = resolve)))
    show({ id: 'standard', by: 'tea-dd', reason: 'one feature' }, onChange)

    fireEvent.click(chip('release'))

    expect(onChange).toHaveBeenCalledWith('release')
    expect(pressed()).toEqual(['Release'])
    expect(screen.getByRole('status').textContent).toContain(t.testProfile.saving)

    await act(async () => finish())

    expect(screen.queryByRole('status')).toBeNull()
  })

  it("pressing Tea-DD's own pick makes it Rohan's, not a clear", () => {
    const onChange = show({ id: 'deep', by: 'tea-dd', reason: 'a new tool' })

    fireEvent.click(chip('deep'))

    expect(onChange).toHaveBeenCalledWith('deep')
  })

  it("pressing Rohan's pick again lets Tea-DD pick", () => {
    const onChange = show({ id: 'quick', by: 'rohan' })

    fireEvent.click(chip('quick'))

    expect(onChange).toHaveBeenCalledWith(null)
    expect(pressed()).toEqual([])
  })

  it("pressing another profile while Rohan's stands swaps his pick", () => {
    const onChange = show({ id: 'quick', by: 'rohan' })

    fireEvent.click(chip('standard'))

    expect(onChange).toHaveBeenCalledWith('standard')
  })

  it('a save that did not take shows the saved profile again', async () => {
    const onChange = vi.fn(async () => ({ ok: false }))
    show({ id: 'deep', by: 'tea-dd', reason: 'a new tool' }, onChange)

    await act(async () => {
      fireEvent.click(chip('quick'))
    })

    expect(pressed()).toEqual(['Deep'])
    expect(screen.queryByRole('status')).toBeNull()
    expect(screen.getByText(/Tea-DD chose Deep: a new tool/)).toBeTruthy()
  })
})
