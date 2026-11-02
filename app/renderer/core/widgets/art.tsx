import type { Stage } from '../../../shared/engine_api'
import { t } from '../../l10n/en'
import { STAGE_SCALE } from '../constants/constants'
import dragon from './art/dragon.svg.html?raw'
import island from './art/island.svg.html?raw'
import sky from './art/sky.html?raw'

// The art is the mockups' own, bundled with the app and never built from data.
export const Sky = () => <div class="sky" aria-hidden="true" dangerouslySetInnerHTML={{ __html: sky }} />

export const Dragon = ({ stage, onPet }: { stage: Stage; onPet: () => void }) => (
  <>
    <div class="lair-art" aria-hidden="true" dangerouslySetInnerHTML={{ __html: island }} />
    <button type="button" class="dragon" aria-label={t.dragon.pet(t.stage[stage])} onClick={onPet}>
      <span class="dragon-size" style={{ transform: `scale(${STAGE_SCALE[stage]})` }} dangerouslySetInnerHTML={{ __html: dragon }} />
    </button>
  </>
)
