import type { SkyChoice } from '../../../shared/engine_api'

export type SkyTime = Exclude<SkyChoice, 'auto'>

export const skyAt = (hour: number): SkyTime => {
  if (hour >= 5 && hour < 10) return 'morning'
  if (hour >= 10 && hour < 17) return 'day'

  return hour >= 17 && hour < 20 ? 'evening' : 'night'
}

export const skyOf = (choice: SkyChoice, hour: number): SkyTime => (choice === 'auto' ? skyAt(hour) : choice)
