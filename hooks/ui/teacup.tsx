import type { ClientModule } from 'claude-code'

import type { CupArt, Seg } from './cup'

// Every frame lasts a whole number of these.
const TICK_MS = 250

type State = { tick: number; isPointedAt: boolean }

const look = (seg: Seg) => ({
  ...(seg.color === undefined ? {} : { color: seg.color }),
  ...(seg.backgroundColor === undefined ? {} : { backgroundColor: seg.backgroundColor }),
  ...(seg.bold === true ? { bold: true } : {}),
})

// The tea cup above the prompt, drawn on the surface: it plays the frames it
// is handed on the surface's own clock, so the steam moves with no work in
// the hooks module and nothing written. Pointing at it winks; a click goes to
// the hooks module, which opens or closes the menu.
const TeaCup: ClientModule<never, State> = (props, surface) => {
  const art = props as unknown as CupArt
  const { Box, Text } = surface.elements

  if (surface.state === undefined) {
    surface.setState({ tick: 0, isPointedAt: false })
    surface.every(TICK_MS, () => {
      const s = surface.state
      if (s !== undefined) surface.setState({ ...s, tick: s.tick + 1 })
    })
    surface.onPointer(e => {
      const s = surface.state
      if (s !== undefined && (e.type === 'enter' || e.type === 'leave')) {
        surface.setState({ ...s, isPointedAt: e.type === 'enter' })
      }
      if (e.type === 'down' && e.button === 'left') surface.post({ kind: 'press' })
    })
  }

  const s = surface.state ?? { tick: 0, isPointedAt: false }
  const step = Math.max(1, Math.round(art.ms / TICK_MS))
  const shown = s.isPointedAt ? art.wink : (art.frames[Math.floor(s.tick / step) % art.frames.length] ?? art.wink)

  return (
    <Box flexDirection="column">
      {shown.map(row => (
        <Text>
          {row.map(seg => (
            <Text {...look(seg)}>{seg.text}</Text>
          ))}
        </Text>
      ))}
    </Box>
  )
}

export default TeaCup
