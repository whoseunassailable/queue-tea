import type { Stage } from '../../../../shared/engine_api'

// Reaching level L + 1 takes 100 × L XP more than reaching level L.
const xpForLevel = (level: number): number => (100 * level * (level - 1)) / 2

const FIRST_LEVEL: Record<Stage, number> = { egg: 1, hatchling: 2, young: 5, adult: 10, elder: 20 }

export const STAGES: readonly Stage[] = ['egg', 'hatchling', 'young', 'adult', 'elder']

export const stageXp = (stage: Stage): number => xpForLevel(FIRST_LEVEL[stage])

export const stageState = (stage: Stage, now: Stage): 'done' | 'now' | 'locked' => {
  const [at, here] = [STAGES.indexOf(stage), STAGES.indexOf(now)]
  if (at === here) return 'now'

  return at < here ? 'done' : 'locked'
}
