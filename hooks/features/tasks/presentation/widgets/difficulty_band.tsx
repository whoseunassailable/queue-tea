import type { EngineInterface, RenderElement, RenderInput } from 'claude-code'
import type { Band } from '../../../../../types'
import { portsOf } from '../../../../core/ports/claude_ports'
import { DIFFICULTIES } from '../../domain/services/task_rules'
import { pickBand } from '../state_management/filing_controller'
import { saveDifficulty } from '../state_management/tasks_controller'

export async function drawDifficultyBand(
  $: EngineInterface,
  e: RenderInput<'AbovePrompt'>,
  band: Extract<Band, { kind: 'difficulty' }>,
): Promise<RenderElement> {
  const { Box, Text, Button } = $.ui.resolve(e)

  return (
    <Box flexDirection="column">
      <Text>How hard was it?</Text>
      <Box>
        {DIFFICULTIES.map(d =>
          d === band.picked ? (
            <Button key={`diff:${d}`} label={d} variant="primary" onPress={() => {}} />
          ) : (
            <Button key={`diff:${d}`} label={d} onPress={() => void pickBand(portsOf($), { difficulty: d })} />
          ),
        )}
        <Button key="save-difficulty" label="Save" variant="primary" onPress={() => void saveDifficulty(portsOf($))} />
      </Box>
    </Box>
  )
}
