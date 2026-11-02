import type { RenderElement } from 'claude-code'
import type { Task } from '../../../../../types'
import { live } from '../../../../core/session/live'
import { grouped } from '../../../../core/widgets/format'
import type { MenuContext } from '../../../../core/widgets/menu_context'
import { cut } from '../../../../core/widgets/text'

export async function drawSettings(c: MenuContext): Promise<RenderElement> {
  const { Box, Text, cols, record, allowance, done, minutes, hints, top, bar } = c
  const opts = live.ctx?.options ?? live.opts

  return (
    <Box flexDirection="column">
      {top}
      {bar('inactive', '≡ Settings')}
      <Text>Idle gap that stops the clock: {opts.idleGapMinutes} minutes</Text>
      <Text>Fresh conversation at: {grouped(opts.freshAtTokens)} tokens</Text>
      <Text>Handoff note at: {opts.handoffAtPercent}% of the 5-hour allowance</Text>
      <Text>Message check time limit: {opts.checkTimeoutSeconds} seconds</Text>
      <Text>{cut(`Task log: ${record?.docsLogPath ?? 'asked when the first task here is done'}`, cols)}</Text>
      <Text dimColor>{cut(`Record: ${live.ctx?.file ?? 'not found'}`, cols)}</Text>
      <Text dimColor>Change the first four with /config.</Text>
      {hints}
    </Box>
  )
}
