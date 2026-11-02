// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from '@testing-library/preact'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import type { EngineApi, ProjectView } from '../../shared/engine_api'
import { createWorkspace } from '../features/workspace/state_management/workspace_store'
import { t } from '../l10n/en'
import { fakeEngine, GAME, projectRow, projectView, quest } from '../test_support'
import { App } from './app'

const open = async (over: Partial<EngineApi> = {}) => {
  const { engine, fire } = fakeEngine(over)
  const workspace = createWorkspace(engine)
  const view = render(<App workspace={workspace} engine={engine} />)
  await workspace.start()

  return { engine, fire, workspace, ...view }
}

const withView = (view: ProjectView) => ({ readProject: async () => ({ ok: true as const, data: view }) })
const never = <T,>() => new Promise<T>(() => {})
const fail = (message: string) => ({ ok: false as const, error: { message } })

beforeEach(() => {
  window.location.hash = ''
})
afterEach(cleanup)

describe('every view shows where it is', () => {
  it('loading: a progress indicator and what is happening', async () => {
    const { engine } = fakeEngine({ listProjects: never, readGame: never })
    const workspace = createWorkspace(engine)
    render(<App workspace={workspace} engine={engine} />)
    void workspace.start()

    await waitFor(() => expect(screen.getAllByText(t.loading.realms).length).toBeGreaterThan(0))
    expect(screen.getByText(t.loading.game)).toBeTruthy()
    expect(document.querySelector('.spinner')).toBeTruthy()
  })

  it('partly loaded: the quests show while the hoard is still being read', async () => {
    const { engine } = fakeEngine({ readGame: never, ...withView(projectView('a-000001', { name: 'Gait' })) })
    const workspace = createWorkspace(engine)
    render(<App workspace={workspace} engine={engine} />)
    void workspace.start()

    await waitFor(() => expect(screen.getByText(t.board.title)).toBeTruthy())
    expect(screen.getByText(t.loading.game)).toBeTruthy()
  })

  it('done but empty: no realms, and what to try next', async () => {
    await open({ listProjects: async () => ({ ok: true, data: [] }) })

    expect(screen.getByText(t.empty.realmsTitle)).toBeTruthy()
    expect(screen.getByText(t.empty.realmsLine)).toBeTruthy()
  })

  it('done but empty: an empty board says so', async () => {
    await open()

    expect(screen.getByText(`${t.empty.boardTitle}. ${t.empty.boardLine}`)).toBeTruthy()
  })

  it('failed: what went wrong and a way to try again', async () => {
    await open({ listProjects: async () => fail('Could not read your realms.') })

    expect(screen.getByRole('alert').textContent).toContain('Could not read your realms.')
    expect(screen.getByRole('button', { name: t.failed.tryAgain })).toBeTruthy()
  })

  it('failed: a game that fails leaves the quests working', async () => {
    await open({ readGame: async () => fail('Could not work out your level.') })

    expect(screen.getByRole('alert').textContent).toContain('Could not work out your level.')
    expect(screen.getByText(t.board.title)).toBeTruthy()
  })

  it('an unreadable realm says why, in plain words', async () => {
    await open(withView({ kind: 'unreadable', key: 'a-000001', name: 'a', isNewer: true, canRestore: false }))

    expect(screen.getByText(t.unreadable.newer)).toBeTruthy()
  })
})

describe('the sidebar', () => {
  it('shows a realm that does not read as such', async () => {
    await open({ listProjects: async () => ({ ok: true, data: [{ kind: 'unreadable', key: 'a-000001', name: 'a' }] }), ...withView({ kind: 'unreadable', key: 'a-000001', name: 'a', isNewer: false, canRestore: false }) })

    expect(screen.getByText(t.unreadable.sidebar)).toBeTruthy()
  })

  it('shows the status it was given', async () => {
    await open({ listProjects: async () => ({ ok: true, data: [projectRow('a-000001', { waiting: 3, status: { kind: 'waiting', count: 3, title: 'Next' } })] }) })

    expect(screen.getByText('3 waiting · ★ Next')).toBeTruthy()
  })
})

describe('Home', () => {
  const active = { id: 'x', title: 'The boss', priority: 'urgent', difficulty: 'hard', xp: 50, branch: 'task/x', minutes: 43, started: '2026-10-20T22:17:00+02:00', isBoss: true, improvingMessages: 4, filesChanged: 40, review: null } as const

  it('shows the active quest with its reward and time', async () => {
    await open(withView(projectView('a-000001', { active, session: { state: 'working', allowance: null } })))

    expect(screen.getByRole('heading', { name: 'The boss' })).toBeTruthy()
    expect(screen.getByText(t.quest.boss)).toBeTruthy()
    expect(screen.getByText('In progress · 43m so far · started 20 Oct 22:17')).toBeTruthy()
    expect(screen.getByText(t.session.working)).toBeTruthy()
    expect(document.querySelector('.rm')?.className).toContain('m-working')
  })

  it('shows Judgement when Claude says it looks done, with what it checked', async () => {
    await open(withView(projectView('a-000001', { active: { ...active, review: { at: 'x', checked: 'ran the tests' } } })))

    expect(document.querySelector('.q-status')?.textContent).toBe(`${t.quest.judgement} · ${t.quest.checked('ran the tests')}`)
  })

  it('with no active quest, names the main quest and why', async () => {
    await open(withView(projectView('a-000001', { canStart: 1, ready: [{ kind: 'quest', quest: quest({ id: 'n', title: 'Next one', isStar: true, why: 'urgent' }) }] })))

    expect(screen.getByRole('heading', { name: t.quest.noneTitle })).toBeTruthy()
    expect(screen.getByText(t.quest.noneLine('Next one'))).toBeTruthy()
    expect(screen.getByText('★ urgent')).toBeTruthy()
  })

  it('shows the HUD from the game', async () => {
    await open()

    expect(screen.getByText('Lv 2')).toBeTruthy()
    expect(screen.getByText('20 / 200 XP to Lv 3')).toBeTruthy()
    expect(screen.getByText('38% mana')).toBeTruthy()
    expect(screen.getByText(String(GAME.gold))).toBeTruthy()
  })
})

describe('Quests', () => {
  const ready = [
    { kind: 'quest' as const, quest: quest({ id: 'first', title: 'First', isStar: true, why: 'urgent · unblocks Later', priority: 'urgent' }) },
    { kind: 'saga' as const, quest: quest({ id: 'saga', title: 'Saga' }), chapters: [quest({ id: 'chapter', title: 'Chapter' })], progress: { done: 1, total: 3, current: 0, blocked: 0 }, hasStar: false },
    { kind: 'quest' as const, quest: quest({ id: 'last', title: 'Last' }) },
  ]

  beforeEach(() => {
    window.location.hash = '#/quests'
  })

  it('keeps the order it was given, chapters under their saga, the ★ line as written', async () => {
    await open(withView(projectView('a-000001', { ready, canStart: 4 })))

    const titles = [...document.querySelectorAll('.board-list .qc-title')].map(el => el.textContent)
    expect(titles).toEqual(['First', 'Saga', 'Chapter', 'Last'])
    expect(document.querySelector('.qrow.child .qc-title')?.textContent).toBe('Chapter')
    expect(screen.getByText('★ urgent · unblocks Later')).toBeTruthy()
  })

  it('opens the ★ in the detail pane, then the quest picked', async () => {
    await open(withView(projectView('a-000001', { ready, canStart: 4 })))

    const detail = () => document.querySelector('.detail .d-title')?.textContent
    expect(detail()).toBe('First')

    ;(screen.getByText('Last').closest('button') as HTMLButtonElement).click()
    await waitFor(() => expect(detail()).toBe('Last'))
  })

  it('shows sealed quests apart, with why', async () => {
    await open(withView(projectView('a-000001', { sealedCount: 1, sealed: [{ kind: 'quest', quest: quest({ id: 's', title: 'Stuck', sealedBecause: 'waiting for the clinic' }) }] })))

    expect(document.querySelector('.fold .qrow.sealed .qc-sub')?.textContent).toBe('⊘ waiting for the clinic')
    expect(screen.getByText(t.empty.allSealed)).toBeTruthy()
  })
})

describe('the rules that hold everywhere', () => {
  it('no button reads Commit, Push, Merge or Pull on any screen', async () => {
    const view = projectView('a-000001', { canStart: 1, ready: [{ kind: 'quest', quest: quest({ id: 'x', isStar: true }) }] })
    for (const hash of ['#/home', '#/quests']) {
      window.location.hash = hash
      await open(withView(view))
      const words = [...document.querySelectorAll('button, a')].map(el => (el.textContent ?? '').toLowerCase())
      expect(words.filter(word => /\b(commit|push|merge|pull)\b/.test(word))).toEqual([])
      cleanup()
    }
  })

  it('Calm mode marks the window, so every loop stops', async () => {
    await open({ readSettings: async () => ({ ok: true, data: { sky: 'day', isCalm: true, lastProject: null, folds: {} } }) })

    expect(document.querySelector('.rm')?.className).toContain('calm')
  })

  it('the sky changes colours and scenery by class alone', async () => {
    await open({ readSettings: async () => ({ ok: true, data: { sky: 'night', isCalm: false, lastProject: null, folds: {} } }) })

    expect(document.querySelector('.rm')?.className).toContain('t-night')
  })
})
