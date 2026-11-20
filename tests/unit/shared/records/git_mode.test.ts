import { expect, test } from 'claude-code/testing'

import { emptyRecord } from '../../../../hooks/shared/records/data/datasources/record_source'
import { GIT_MODES, gitModeOf, isGitMode } from '../../../../hooks/shared/records/domain/services/git_mode'

test('the Git modes are Manual and Assisted', () => {
  expect(GIT_MODES).toEqual(['manual', 'assisted'])
})

test('only manual and assisted are Git modes', () => {
  expect(isGitMode('manual')).toBe(true)
  expect(isGitMode('assisted')).toBe(true)
  for (const value of ['Manual', 'ASSISTED', 'auto', '', ' manual', null, undefined, 1, {}, ['manual']]) {
    expect([value, isGitMode(value)]).toEqual([value, false])
  }
})

test('a record made before Git modes works as Assisted', () => {
  expect(gitModeOf(emptyRecord('p', '/p'))).toBe('assisted')
})

test('a record keeps the mode it was given', () => {
  expect(gitModeOf({ gitMode: 'manual' })).toBe('manual')
  expect(gitModeOf({ gitMode: 'assisted' })).toBe('assisted')
})
