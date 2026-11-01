import type { EngineInterface, RenderElement, RenderInput } from 'claude-code'
import type { Band, Task } from '../../../../../types'
import { portsOf } from '../../../../core/ports/claude_ports'
import { saveDocsPath } from '../state_management/tasks_controller'

export async function drawDocsPathBand(
  $: EngineInterface,
  e: RenderInput<'AbovePrompt'>,
  band: Extract<Band, { kind: 'docsPath' }>,
): Promise<RenderElement> {
  const { Box, Text, Button } = $.ui.resolve(e)

  // The docs log's path, asked the first time a task is finished here.
  if (e.surface === 'mobile') {
    return (
      <Box flexDirection="column">
        <Text>Where should this project's task log go?</Text>
        <Button key="docs-path" label={`Use ${band.suggested}`} onPress={() => void saveDocsPath(portsOf($), band.suggested)} />
      </Box>
    )
  }
  const { Input } = $.ui.resolve(e as RenderInput<'AbovePrompt', 'terminal'>)

  return (
    <Box flexDirection="column">
      <Text>Where should this project's task log go?</Text>
      <Input
        key="docs-path"
        label="Task log path"
        value={band.suggested}
        submitLabel="Save"
        onSubmit={value => void saveDocsPath(portsOf($), value)}
      />
    </Box>
  )
}
