// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/preact'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { questLinkOf } from '../../../../../shared/notes'
import { t } from '../../../../l10n/en'
import type { QuestLine } from '../../domain/notes_view'
import { ReadView } from './read_view'

afterEach(cleanup)

const line = (title: string, state: QuestLine['state']): QuestLine => ({ title, state, priority: 'mid', difficulty: 'medium' })
const callbacks = () => ({ isLive: true, notes: [], onToggle: vi.fn(), onOpenNote: vi.fn(), onOpenQuest: vi.fn(), onOpenLink: vi.fn() })

describe('quest links in Read', () => {
  it('opens the linked id and redraws the title and state when the quest changes', () => {
    const props = { ...callbacks(), body: 'See [[quest:t-abc|Original title]].' }
    const { rerender } = render(<ReadView {...props} quests={new Map([['t-abc', line('Current title', 'waiting')]])} />)
    fireEvent.click(screen.getByRole('button', { name: t.notebook.openQuestLink('Current title', 'waiting') }))
    expect(props.onOpenQuest).toHaveBeenCalledWith('t-abc')
    expect(screen.getByText(t.notebook.questState.waiting)).toBeTruthy()

    rerender(<ReadView {...props} quests={new Map([['t-abc', line('Renamed quest', 'active')]])} />)
    expect(screen.getByRole('button', { name: t.notebook.openQuestLink('Renamed quest', 'in progress') })).toBeTruthy()
    expect(screen.queryByText('Current title')).toBeNull()
    expect(screen.getByText(t.notebook.questState.active)).toBeTruthy()
  })

  it('renders done and missing quests as text, preserving the written title when missing', () => {
    const props = { ...callbacks(), body: '[[quest:t-abc|Old]] and [[quest:t-def|Missing quest]]' }
    const { container } = render(<ReadView {...props} quests={new Map([['t-abc', line('Finished quest', 'done')]])} />)
    expect(screen.queryByRole('button')).toBeNull()
    expect(screen.getByText('Finished quest')).toBeTruthy()
    expect(screen.getByText(t.notebook.questState.done)).toBeTruthy()
    expect(screen.getByText('Missing quest').classList.contains('nt-md-broken')).toBe(true)
    expect(container.textContent).toContain(t.notebook.questState.gone)
  })

  it('keeps a quest link whole when its written title contains Markdown or HTML', () => {
    const title = 'Fix `input` and **output** <img src=x> & café'
    const props = { ...callbacks(), body: `Before [[${questLinkOf('t-abc', title)}]] after.` }
    const { container } = render(<ReadView {...props} quests={new Map([['t-abc', line(title, 'sealed')]])} />)
    expect(screen.getByRole('button', { name: t.notebook.openQuestLink(title, 'sealed') }).textContent).toBe(title)
    expect(container.querySelector('img')).toBeNull()
    expect(container.textContent).toContain('Before ')
    expect(container.textContent).toContain(' after.')
  })

  it('leaves quest syntax inside code as code', () => {
    const props = { ...callbacks(), body: '`[[quest:t-abc|Example]]`\n\n```md\n[[quest:t-abc|Example]]\n```' }
    const { container } = render(<ReadView {...props} quests={new Map([['t-abc', line('Example', 'waiting')]])} />)
    expect(screen.queryByRole('button')).toBeNull()
    expect([...container.querySelectorAll('code')].map(code => code.textContent)).toEqual(['[[quest:t-abc|Example]]', '[[quest:t-abc|Example]]'])
  })
})
