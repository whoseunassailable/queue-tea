import type { Band } from '../../../types'
import type { Ports } from '../ports/ports'

// A band goes up, or waits behind the one showing; never replaces it.
export const showBand = async (p: Ports, band: Band): Promise<void> => {
  if ((await p.get('band')).kind === 'none') await p.set('band', band)
  else await p.set('bandQueue', [...(await p.get('bandQueue')), band])
}

// Takes the band down and puts up the next one waiting.
export const closeBand = async (p: Ports): Promise<void> => {
  const [next, ...rest] = await p.get('bandQueue')
  await p.set('bandQueue', rest)
  await p.set('band', next ?? { kind: 'none' })
}
