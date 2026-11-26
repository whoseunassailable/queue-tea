// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/preact'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { t } from '../../l10n/en'
import { Empty, Failed, Loading } from './states'

afterEach(cleanup)

describe('the states a waiting view shows', () => {
  it('loading says what is happening beside a progress circle', () => {
    render(<Loading line="Reading your queue…" />)

    const state = screen.getByRole('status')
    expect(state.textContent).toBe('Reading your queue…')
    expect(state.querySelector('.spinner')).not.toBeNull()
  })

  it('failed says what went wrong and tries again', () => {
    const retry = vi.fn()
    render(<Failed message="Couldn't read the record." onRetry={retry} />)

    expect(screen.getByRole('alert').textContent).toContain("Couldn't read the record.")
    expect(screen.queryByRole('heading')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: t.failed.tryAgain }))
    expect(retry).toHaveBeenCalledOnce()
  })

  it('failed can carry a title and another way to put it right, beside Try again', () => {
    render(
      <Failed title="Couldn't read Notes" message="The folder is missing." onRetry={() => {}}>
        <button type="button">Show in Finder</button>
      </Failed>,
    )

    expect(screen.getByRole('heading', { name: "Couldn't read Notes" })).toBeTruthy()
    const actions = screen.getByRole('button', { name: t.failed.tryAgain }).parentElement!
    expect([...actions.querySelectorAll('button')].map(button => button.textContent)).toEqual([t.failed.tryAgain, 'Show in Finder'])
  })

  it('empty says nothing was found and what to try next', () => {
    render(<Empty title="Nothing on the quest board" line="Add one here." />)

    expect(screen.getByRole('heading', { name: 'Nothing on the quest board' })).toBeTruthy()
    expect(screen.getByText('Add one here.')).toBeTruthy()
  })
})
