import { describe, expect, it } from 'vitest'

import type { GithubView } from '../../../../shared/engine_api'
import type { Load } from '../../workspace/state_management/workspace_store'
import { hasAccounts, isGone, needsAnswer, NO_ACCOUNT, pickedOf } from './choice'

const account = (login: string) => ({ login, isActive: false, isWorking: true })
const ready = (...logins: string[]): Load<GithubView> => ({ status: 'ready', data: { kind: 'ready', accounts: logins.map(account) } })
const LOADING: Load<GithubView> = { status: 'loading' }
const FAILED: Load<GithubView> = { status: 'failed', message: 'no' }
const MISSING: Load<GithubView> = { status: 'ready', data: { kind: 'missing' } }

describe('what is picked', () => {
  it('is the answer given', () => {
    expect(pickedOf(ready('a', 'b'), 'b')).toBe('b')
    expect(pickedOf(ready('a', 'b'), NO_ACCOUNT)).toBe(NO_ACCOUNT)
  })

  it('is the only account, unasked', () => {
    expect(pickedOf(ready('a'), null)).toBe('a')
  })

  it('is nothing with several to choose from', () => {
    expect(pickedOf(ready('a', 'b'), null)).toBeNull()
  })

  it('isn\'t an account gh no longer knows', () => {
    expect(pickedOf(ready('a', 'b'), 'gone')).toBeNull()
  })

  it('keeps No GitHub account over the only account', () => {
    expect(pickedOf(ready('a'), NO_ACCOUNT)).toBe(NO_ACCOUNT)
  })
})

describe('whether it needs an answer', () => {
  it('does with accounts to pick from', () => {
    expect(needsAnswer(ready('a', 'b'), null)).toBe(true)
  })

  it('does while they\'re still being read', () => {
    expect(needsAnswer(LOADING, null)).toBe(true)
  })

  it('doesn\'t once answered', () => {
    expect(needsAnswer(ready('a', 'b'), 'a')).toBe(false)
    expect(needsAnswer(ready('a', 'b'), NO_ACCOUNT)).toBe(false)
  })

  it('doesn\'t with no answers to give', () => {
    expect(needsAnswer(ready(), null)).toBe(false)
    expect(needsAnswer(MISSING, null)).toBe(false)
    expect(needsAnswer(FAILED, null)).toBe(false)
  })
})

describe('an account gone from gh', () => {
  it('is gone only when gh has answered without it', () => {
    expect(isGone(ready('a'), 'gone')).toBe(true)
    expect(isGone(ready('a'), 'a')).toBe(false)
    expect(isGone(ready('a'), null)).toBe(false)
    expect(isGone(LOADING, 'gone')).toBe(false)
    expect(isGone(FAILED, 'gone')).toBe(false)
    expect(isGone(MISSING, 'gone')).toBe(false)
  })
})

it('knows when there are accounts', () => {
  expect(hasAccounts(ready('a'))).toBe(true)
  expect(hasAccounts(ready())).toBe(false)
  expect(hasAccounts(MISSING)).toBe(false)
})
