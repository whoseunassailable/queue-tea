import type { TestProfile, TestProfileId } from '../../../../../types'

// Lightest first: each profile runs everything the ones before it run.
export const TEST_PROFILE_IDS: readonly TestProfileId[] = ['quick', 'standard', 'deep', 'critical', 'release']

export const TEST_PROFILE_LIMITS = { reason: 160 } as const

export const isTestProfileId = (value: unknown): value is TestProfileId =>
  TEST_PROFILE_IDS.includes(value as TestProfileId)

export type TestPick = { id: TestProfileId; reason: string }

// Tea-DD's pick as the tool received it: a known profile and a reason Rohan can read.
export const checkTestPick = (input: unknown): TestPick | 'profile' | 'reason' => {
  const v = (input ?? {}) as { profile?: unknown; reason?: unknown }
  if (!isTestProfileId(v.profile)) return 'profile'
  const reason = typeof v.reason === 'string' ? v.reason.trim() : ''
  if (reason === '' || reason.length > TEST_PROFILE_LIMITS.reason) return 'reason'

  return { id: v.profile, reason }
}

// Reads a hand-edited field: anything malformed is no profile, never an unreadable realm.
export const readTestProfile = (value: unknown): TestProfile | undefined => {
  const v = (value ?? {}) as { id?: unknown; by?: unknown; reason?: unknown }
  if (!isTestProfileId(v.id)) return undefined
  if (v.by === 'rohan') return { id: v.id, by: 'rohan' }
  const reason = typeof v.reason === 'string' ? v.reason.trim().slice(0, TEST_PROFILE_LIMITS.reason) : ''

  return v.by === 'tea-dd' && reason !== '' ? { id: v.id, by: 'tea-dd', reason } : undefined
}
