import type { EngineInterface, RenderElement, RenderInput } from 'claude-code'

import type { Difficulty } from '../../types'
import {
  pickBand,
  saveDifficulty,
  saveDocsPath,
  saveFile,
  sendHeld,
  unsureToNew,
} from '../actions'
import { getView } from '../ports'
import { PRIORITY_ORDER } from '../queue'

const DIFFICULTIES: readonly Difficulty[] = ['light', 'medium', 'hard']

// The band's tree, or null when it has nothing to ask and the engine draws its own.
export async function renderBand($: EngineInterface, e: RenderInput<'AbovePrompt'>): Promise<RenderElement | null> {
  const band = await getView($, 'band')
  if (band.kind === 'none' || e.props.hasSurvey) return null

  const els = $.ui.resolve(e)
  const { Box, Text, Button } = els

  if (band.kind === 'file') {
    return (
      <Box flexDirection="column">
        <Text>New task: {band.title}</Text>
        <Box>
          {PRIORITY_ORDER.map(p =>
            p === band.priority ? (
              <Button key={`prio:${p}`} label={p} variant="primary" onPress={() => {}} />
            ) : (
              <Button key={`prio:${p}`} label={p} onPress={() => void pickBand($, { priority: p })} />
            ),
          )}
        </Box>
        <Box>
          {DIFFICULTIES.map(d =>
            d === band.difficulty ? (
              <Button key={`diff:${d}`} label={d} variant="primary" onPress={() => {}} />
            ) : (
              <Button key={`diff:${d}`} label={d} onPress={() => void pickBand($, { difficulty: d })} />
            ),
          )}
        </Box>
        <Box>
          <Button key="save" label="Save" variant="primary" onPress={() => void saveFile($)} />
          <Button key="same-task" label="Same task" onPress={() => void sendHeld($)} />
        </Box>
      </Box>
    )
  }

  if (band.kind === 'unsure') {
    return (
      <Box flexDirection="column">
        {!band.didCheckRun && <Text>The check didn't run, so pick one.</Text>}
        <Text dimColor>{band.text.slice(0, 80)}</Text>
        <Box>
          <Button key="same-task" label="Same task" onPress={() => void sendHeld($)} />
          <Button key="new-task" label="New task" onPress={() => void unsureToNew($)} />
          <Button key="quick-question" label="Quick question" onPress={() => void sendHeld($)} />
        </Box>
      </Box>
    )
  }

  if (band.kind === 'difficulty') {
    return (
      <Box flexDirection="column">
        <Text>How hard was it?</Text>
        <Box>
          {DIFFICULTIES.map(d =>
            d === band.picked ? (
              <Button key={`diff:${d}`} label={d} variant="primary" onPress={() => {}} />
            ) : (
              <Button key={`diff:${d}`} label={d} onPress={() => void pickBand($, { difficulty: d })} />
            ),
          )}
          <Button key="save-difficulty" label="Save" variant="primary" onPress={() => void saveDifficulty($)} />
        </Box>
      </Box>
    )
  }

  // The docs log's path, asked the first time a task is finished here.
  if (e.surface === 'mobile') {
    return (
      <Box flexDirection="column">
        <Text>Where should this project's task log go?</Text>
        <Button key="docs-path" label={`Use ${band.suggested}`} onPress={() => void saveDocsPath($, band.suggested)} />
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
        onSubmit={value => void saveDocsPath($, value)}
      />
    </Box>
  )
}
