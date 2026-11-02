import type { SkyChoice } from '../../../../../shared/engine_api'
import { t } from '../../../../l10n/en'

const CHOICES: readonly { choice: SkyChoice; mark: string }[] = [
  { choice: 'auto', mark: '◷' },
  { choice: 'morning', mark: '❀' },
  { choice: 'day', mark: '☀' },
  { choice: 'evening', mark: '◐' },
  { choice: 'night', mark: '☾' },
]

export const SkyDial = ({ sky, onPick }: { sky: SkyChoice; onPick: (sky: SkyChoice) => void }) => (
  <div class="dial panel" role="group" aria-label={t.sky.label}>
    {CHOICES.map(({ choice, mark }) => (
      <button
        key={choice}
        type="button"
        class={choice === sky ? 'dial-btn on' : 'dial-btn'}
        aria-pressed={choice === sky ? 'true' : 'false'}
        aria-label={t.sky.choices[choice]}
        onClick={() => onPick(choice)}
      >
        {mark}
      </button>
    ))}
    <span class="dial-note">{sky === 'auto' ? t.sky.follows : t.sky.fixed(sky)}</span>
  </div>
)
