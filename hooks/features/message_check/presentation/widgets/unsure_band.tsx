import type { EngineInterface, RenderElement, RenderInput } from 'claude-code'
import type { Band } from '../../../../../types'
import { portsOf } from '../../../../core/ports/claude_ports'
import { cancelHeld, sendAsTask, sendQuick, unsureToNew } from '../state_management/message_check_controller'

export async function drawUnsureBand(
  $: EngineInterface,
  e: RenderInput<'AbovePrompt'>,
  band: Extract<Band, { kind: 'unsure' }>,
): Promise<RenderElement> {
  const { Box, Text, Button } = $.ui.resolve(e)

  return (
    <Box flexDirection="column">
      {!band.didCheckRun && <Text>The check didn't run, so pick one.</Text>}
      <Text dimColor>{band.text.slice(0, 80)}</Text>
      <Box>
        <Button key="same-task" label="Same task" onPress={() => void sendAsTask(portsOf($))} />
        <Button key="new-task" label="New task" onPress={() => void unsureToNew(portsOf($))} />
        <Button key="quick-question" label="Quick question" onPress={() => void sendQuick(portsOf($))} />
        <Button key="cancel" label="Cancel" onPress={() => void cancelHeld(portsOf($))} />
      </Box>
    </Box>
  )
}
