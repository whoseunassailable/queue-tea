// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/preact'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { questLinkOf } from '../../../../../shared/notes'
import { t } from '../../../../l10n/en'
import type { QuestLine } from '../../domain/notes_view'
import { fakeEngine } from '../../../../test_support'
import { ReadView } from './read_view'

afterEach(cleanup)

const line = (title: string, state: QuestLine['state']): QuestLine => ({ title, state, priority: 'mid', difficulty: 'medium' })
const callbacks = () => ({ engine: fakeEngine().engine, realm: 'demo-abc123', isLive: true, notes: [], onToggle: vi.fn(), onOpenNote: vi.fn(), onOpenQuest: vi.fn(), onOpenLink: vi.fn() })

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

it('renders a quest link beside image and PDF attachments in the same note', async () => {
  const props = { ...callbacks(), body: '[[quest:t-abc|Fix **image**]]\n\n![[attachments/photo.png|Screenshot]]\n\n[Report](attachments/report.pdf)\n\n`[[quest:t-abc|Example]]`' }
  render(<ReadView {...props} quests={new Map([['t-abc', line('Fix image', 'active')]])} />)
  expect(screen.getByRole('button', { name: t.notebook.openQuestLink('Fix image', 'in progress') })).toBeTruthy()
  expect(await screen.findByAltText('Screenshot')).toBeTruthy()
  expect(await screen.findByRole('button', { name: 'Preview PDF: Report' })).toBeTruthy()
  expect(screen.getByText('[[quest:t-abc|Example]]').tagName).toBe('CODE')
})

describe('bookmarks in Read', () => {
  const URL_ = 'https://example.com/post'
  const cards = (container: ParentNode) => container.querySelectorAll('.nt-bookmark')

  it('turns a link alone on its line into a card with the page’s title, description and site', async () => {
    const props = { ...callbacks(), body: URL_ }
    const { container } = render(<ReadView {...props} quests={new Map()} />)
    expect(await screen.findByRole('link', { name: t.notebook.openBookmark('Example page', 'example.com') })).toBeTruthy()
    expect(screen.getByText('What the page is about.')).toBeTruthy()
    expect(screen.getByText('Example · example.com')).toBeTruthy()
    expect(cards(container)).toHaveLength(1)
    expect(props.engine.readBookmark).toHaveBeenCalledWith(URL_)
  })

  it('makes a card of a link on the line right after a text line, keeping the text around it', async () => {
    const { container } = render(<ReadView {...callbacks()} body={`Read this:\n${URL_}\nThen reply.`} quests={new Map()} />)
    expect(await screen.findByRole('link', { name: t.notebook.openBookmark('Example page', 'example.com') })).toBeTruthy()
    expect([...container.querySelectorAll('p')].map(p => p.textContent)).toContain('Read this:')
    expect(container.textContent).toContain('Then reply.')
    expect(cards(container)).toHaveLength(1)
  })

  it('leaves a link inside a sentence and links in code as they are', () => {
    const props = { ...callbacks(), body: `See ${URL_} today.\n\n    ${URL_}\n\n\`\`\`\n${URL_}\n\`\`\`` }
    const { container } = render(<ReadView {...props} quests={new Map()} />)
    expect(cards(container)).toHaveLength(0)
    expect(screen.getByRole('link', { name: URL_ }).classList.contains('nt-md-link')).toBe(true)
    expect([...container.querySelectorAll('pre code')].map(code => code.textContent?.trim())).toEqual([URL_, URL_])
    expect(props.engine.readBookmark).not.toHaveBeenCalled()
  })

  it('leaves a link alone in a list item as a plain link that opens', () => {
    const props = { ...callbacks(), body: `- ${URL_}\n- [ ] ${URL_}\n1. ${URL_}` }
    const { container } = render(<ReadView {...props} quests={new Map()} />)
    expect(cards(container)).toHaveLength(0)
    const links = screen.getAllByRole('link', { name: URL_ })
    expect(links).toHaveLength(3)
    for (const link of links) {
      expect(link.classList.contains('nt-md-link')).toBe(true)
      expect(link.closest('li')).not.toBeNull()
      fireEvent.click(link)
    }
    expect(props.onOpenLink.mock.calls).toEqual([[URL_], [URL_], [URL_]])
    expect(props.engine.readBookmark).not.toHaveBeenCalled()
  })

  it('leaves a link alone in a quote as a plain link that opens', () => {
    const props = { ...callbacks(), body: `> ${URL_}` }
    const { container } = render(<ReadView {...props} quests={new Map()} />)
    expect(cards(container)).toHaveLength(0)
    const link = screen.getByRole('link', { name: URL_ })
    expect(link.classList.contains('nt-md-link')).toBe(true)
    expect(link.closest('blockquote')).not.toBeNull()
    fireEvent.click(link)
    expect(props.onOpenLink).toHaveBeenCalledWith(URL_)
    expect(props.engine.readBookmark).not.toHaveBeenCalled()
  })

  it('leaves a link alone in a callout’s body as a plain link that opens', () => {
    const props = { ...callbacks(), body: `> [!note] Reading\n> ${URL_}` }
    const { container } = render(<ReadView {...props} quests={new Map()} />)
    expect(cards(container)).toHaveLength(0)
    const link = screen.getByRole('link', { name: URL_ })
    expect(link.classList.contains('nt-md-link')).toBe(true)
    expect(link.closest('aside.nt-md-callout')?.getAttribute('aria-label')).toBe('Reading')
    fireEvent.click(link)
    expect(props.onOpenLink).toHaveBeenCalledWith(URL_)
    expect(props.engine.readBookmark).not.toHaveBeenCalled()
  })

  it('says it is reading the page, and the title opens the link while it waits', () => {
    const props = { ...callbacks(), engine: fakeEngine({ readBookmark: () => new Promise(() => {}) }).engine, body: URL_ }
    render(<ReadView {...props} quests={new Map()} />)
    expect(screen.getByRole('status').textContent).toContain(t.notebook.readingBookmark)
    fireEvent.click(screen.getByRole('link', { name: t.notebook.openBookmark('example.com', 'example.com') }))
    expect(props.onOpenLink).toHaveBeenCalledWith(URL_)
  })

  it('says there is no preview for a page with no title or description, and names it by its host', async () => {
    const props = { ...callbacks(), engine: fakeEngine({ readBookmark: async url => ({ ok: true, data: { url, title: null, description: null, site: null } }) }).engine, body: URL_ }
    render(<ReadView {...props} quests={new Map()} />)
    expect(await screen.findByText(t.notebook.noBookmarkPreview)).toBeTruthy()
    expect(screen.queryByRole('status')).toBeNull()
    fireEvent.click(screen.getByRole('link', { name: t.notebook.openBookmark('example.com', 'example.com') }))
    expect(props.onOpenLink).toHaveBeenCalledWith(URL_)
  })

  it('shows the host once when the site name is the host', async () => {
    render(<ReadView {...callbacks()} engine={fakeEngine({ readBookmark: async url => ({ ok: true, data: { url, title: 'Post', description: null, site: 'example.com' } }) }).engine} body={URL_} quests={new Map()} />)
    expect(await screen.findByRole('link', { name: t.notebook.openBookmark('Post', 'example.com') })).toBeTruthy()
    expect(document.querySelector('.nt-bookmark-site')?.textContent).toBe('example.com')
    expect(screen.queryByText(t.notebook.noBookmarkPreview)).toBeNull()
  })

  it('says why a read failed, still opens the link, and Try again reads the page anew', async () => {
    const { engine } = fakeEngine()
    vi.mocked(engine.readBookmark).mockResolvedValueOnce({ ok: false, error: { message: 'That page took too long to answer. Try again.' } })
    const props = { ...callbacks(), engine, body: URL_ }
    render(<ReadView {...props} quests={new Map()} />)
    expect((await screen.findByRole('alert')).textContent).toContain('That page took too long to answer.')
    fireEvent.click(screen.getByRole('link', { name: t.notebook.openBookmark('example.com', 'example.com') }))
    expect(props.onOpenLink).toHaveBeenCalledWith(URL_)
    fireEvent.click(screen.getByRole('button', { name: t.failed.tryAgain }))
    expect(await screen.findByRole('link', { name: t.notebook.openBookmark('Example page', 'example.com') })).toBeTruthy()
    expect(screen.queryByRole('alert')).toBeNull()
    expect(engine.readBookmark).toHaveBeenCalledTimes(2)
  })
})
