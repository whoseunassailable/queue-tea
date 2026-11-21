import { useState } from 'preact/hooks'

import { TEST_PROFILE_IDS } from '../../../../../../hooks/shared/records/domain/services/test_profile'
import type { TestProfile, TestProfileId } from '../../../../../../types'
import { Spinner } from '../../../../core/widgets/states'
import { t } from '../../../../l10n/en'

type Props = { profile: TestProfile | null; onChange: (id: TestProfileId | null) => Promise<unknown> | void }

// Tea-DD's pick with its reason, or Rohan's, which Tea-DD keeps to. Pressing a
// chip makes it Rohan's; pressing his again lets Tea-DD pick. A failed save
// shows the saved profile again, and the edit's own note says why.
export const TestProfileControl = ({ profile, onChange }: Props) => {
  const [pending, setPending] = useState<TestProfileId | null | undefined>(undefined)
  const pressed = pending === undefined ? profile?.id ?? null : pending

  const press = async (id: TestProfileId) => {
    const next = profile?.by === 'rohan' && profile.id === id ? null : id
    setPending(next)
    try {
      await onChange(next)
    } finally {
      setPending(undefined)
    }
  }

  return (
    <>
      <div class="helper-chips profile-chips" role="group" aria-label={t.testProfile.label}>
        {TEST_PROFILE_IDS.map(id => (
          <button key={id} type="button" class="helper-chip tests" aria-pressed={pressed === id} onClick={() => void press(id)}>
            {t.testProfile.names[id]}
          </button>
        ))}
      </div>
      {pending !== undefined ? (
        <p class="hint" role="status"><Spinner />{t.testProfile.saving}</p>
      ) : profile === null ? (
        <p class="hint">{t.testProfile.none}</p>
      ) : (
        <p class="hint">
          {profile.by === 'rohan' ? t.testProfile.rohans(t.testProfile.names[profile.id]) : t.testProfile.teaDds(t.testProfile.names[profile.id], profile.reason)}{' '}
          {t.testProfile.runs[profile.id]}
        </p>
      )}
    </>
  )
}
