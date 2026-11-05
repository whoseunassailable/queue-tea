import { useState } from 'preact/hooks'

import { HELPER_IDS } from '../../../../../../hooks/shared/records/domain/services/helpers'
import type { HelperId } from '../../../../../../types'
import { t } from '../../../../l10n/en'
import { HELPERS } from '../../../guild/domain/helpers'

type Props = { on: readonly HelperId[]; onChange: (on: HelperId[]) => Promise<unknown> | void }

// What the quest has on shows at once; a failed save shows the saved list again.
export const HelperToggles = ({ on, onChange }: Props) => {
  const [pending, setPending] = useState<HelperId[] | null>(null)
  const shown = pending ?? on

  const toggle = async (id: HelperId) => {
    const next = HELPER_IDS.filter(other => (other === id ? !shown.includes(id) : shown.includes(other)))
    setPending(next)
    try {
      await onChange(next)
    } finally {
      setPending(current => (current === next ? null : current))
    }
  }

  return (
    <div class="helper-chips" role="group" aria-label={t.helpers.label}>
      {HELPERS.map(helper => (
        <button key={helper.id} type="button" class={`helper-chip ${helper.kind}`} aria-pressed={shown.includes(helper.id)} aria-label={t.helpers.use(helper.name)} onClick={() => void toggle(helper.id)}>
          <img src={helper.logo} alt="" />
          {helper.name}
        </button>
      ))}
    </div>
  )
}
