import type { RenderElement } from 'claude-code'
import type { MenuContext } from '../../core/widgets/menu_context'
import { cut } from '../../core/widgets/text'

// What Help lists: the commands, the most used first (/instant is /brew's
// other name), then the keys by where they work. A line fits 80 columns; a
// narrower menu wraps it rather than cut it.
export const HELP_COMMANDS: readonly { usage: string; does: string }[] = [
  { usage: '/steep <message>', does: 'file it as a task for later, no check' },
  { usage: '/brew <request>', does: 'do it now, outside the queue (or /instant)' },
  { usage: '/tea <question>', does: 'ask or explain, changing no files' },
  { usage: '/feature [<title>|off]', does: 'show, set or clear the active feature' },
  { usage: '/done', does: 'ask whether the current task is done for now' },
  { usage: '/queue-tea', does: 'open this menu' },
]
const HELP_KEYS: readonly { where: string; keys: string }[] = [
  { where: 'Backlog', keys: 's start ★, or the open row · t time I have' },
  { where: 'Open row', keys: '1–5 priority · f play next · u unblock · x remove' },
  { where: 'Row or task', keys: 'k blocked… · p part of… · a active feature' },
  { where: 'Current task', keys: 'd done · b back to queue · c continue · w switch' },
  { where: '', keys: 'r check again · y / n to "Is this done for now?"' },
  { where: 'Record unreadable', keys: 'l use the last good copy · r try again' },
]
const HELP_WIDTH = 24

export async function drawHelp(c: MenuContext): Promise<RenderElement> {
  const { Box, Text, hints, top, bar } = c
  // Two columns: what is typed or pressed, and what it does, wrapping under
  // its own column.
  const row = (left: string, right: string) => (
    <Box>
      <Box width={HELP_WIDTH} flexShrink={0}>
        <Text>{left}</Text>
      </Box>
      <Text dimColor>{right}</Text>
    </Box>
  )

  return (
    <Box flexDirection="column">
      {top}
      {bar('inactive', '? Commands and keys')}
      {HELP_COMMANDS.map(c => row(c.usage, c.does))}
      {HELP_KEYS.map(k => row(k.where, k.keys))}
      {hints}
    </Box>
  )
}
