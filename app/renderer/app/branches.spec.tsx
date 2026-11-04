// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/preact'
import { afterEach, beforeEach, expect, it } from 'vitest'

import type { EngineApi, MergeCheck, Reply } from '../../shared/engine_api'
import { createWorkspace } from '../features/workspace/state_management/workspace_store'
import { activeQuest, fakeEngine, projectView } from '../test_support'
import { App } from './app'

const KEY = 'a-000001'
const one = activeQuest({ id: 'one', title: 'Auto update', worktreePath: '/quests/one', baseBranch: 'main' })
const two = activeQuest({ id: 'two', title: 'Settings option', branch: 'task/settings', worktreePath: '/quests/two', baseBranch: 'main', codexSince: '2026-11-03T12:00:00Z' })
const view = projectView(KEY, {
  active: one, activeQuests: [one, two],
  branches: [one, two].map(q => ({ id: q.id, title: q.title, branch: q.branch!, baseBranch: 'main', path: q.worktreePath!, state: 'current', platform: q.codexSince ? 'codex' : 'claude', parent: { id: 'saga', title: 'App improvements' } })),
})

const open = async (over: Partial<EngineApi> = {}) => {
  const { engine } = fakeEngine({ readProject: async () => ({ ok: true, data: view }), ...over })
  const workspace = createWorkspace(engine)
  await act(async () => { render(<App workspace={workspace} engine={engine} />); await workspace.start() })

  return { engine, workspace }
}

beforeEach(() => { window.location.hash = '#/branches' })
afterEach(cleanup)

it('places Branches next to Quests and opens the selected terminal and quest', async () => {
  const { engine, workspace } = await open()
  expect([...screen.getByRole('navigation', { name: 'Sections' }).querySelectorAll('a')].map(a => a.textContent)).toEqual(['Home', 'Quests', 'Branches', 'Chronicle', 'Mana & time'])
  expect(screen.getByRole('heading', { name: 'main' })).toBeTruthy()
  expect(screen.getByText('2 in progress')).toBeTruthy()
  const card = within(screen.getByRole('article', { name: two.title }))
  await act(() => void fireEvent.click(card.getByRole('button', { name: 'Show Codex' })))
  expect(engine.openClaude).toHaveBeenCalledWith(KEY, 'two')
  await act(() => void fireEvent.click(card.getByRole('button', { name: two.title })))
  await waitFor(() => expect(window.location.hash).toBe('#/quests'))
  expect(workspace.getState().openQuests[KEY]).toBe('two')
  expect((await screen.findByRole('complementary')).textContent).toContain(two.title)
  await act(() => void fireEvent.keyDown(document.body, { key: 'c' }))
  expect(engine.openClaude).toHaveBeenLastCalledWith(KEY, 'two')
  expect(engine.openClaude).toHaveBeenCalledTimes(2)
})

it('shows a loading merge check, then its failure and retry', async () => {
  let answer!: (reply: Reply<MergeCheck>) => void
  const { engine } = await open({ readMerge: () => new Promise(resolve => { answer = resolve }) })
  await act(() => void fireEvent.click(within(screen.getByRole('article', { name: two.title })).getByRole('button', { name: 'Merge instructions' })))
  expect(screen.getByText('Checking the branch and its base…')).toBeTruthy()
  await act(() => answer({ ok: false, error: { message: 'The merge check could not be read. Try again.' } }))
  expect(await screen.findByText('The merge check could not be read. Try again.')).toBeTruthy()
  expect(screen.getByRole('button', { name: 'Try again' })).toBeTruthy()
  expect(engine.copyText).not.toHaveBeenCalled()
})

it('keeps both active cards usable on Home', async () => {
  window.location.hash = '#/home'
  const { engine } = await open()
  expect(screen.getByRole('heading', { name: one.title })).toBeTruthy()
  expect(screen.getByRole('heading', { name: two.title })).toBeTruthy()
  await act(() => void fireEvent.click(screen.getByRole('button', { name: 'Show Codex' })))
  expect(engine.openClaude).toHaveBeenCalledWith(KEY, 'two')
})
