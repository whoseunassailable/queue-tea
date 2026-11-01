import type { EngineInterface, RenderElement, RenderInput } from 'claude-code'
import type { Task } from '../../../../../types'
import type { MenuContext } from '../../../../core/widgets/menu_context'
import { cut } from '../../../../core/widgets/text'
import { canWaitFor } from '../../../../shared/backlog/domain/services/ranking'
import { pressBlockWith, pressCancelBlock } from '../state_management/queue_controller'

// Blocked…: the tasks it can wait for, a reason, or Cancel. Asked from a
// backlog row or the current task, in the view it was asked from.
export async function drawBlocking($: EngineInterface, c: MenuContext, blockingTask: Task): Promise<RenderElement> {
  const { p, e, Box, Text, Button, cols, tasks, waiting, hints, top, bar } = c
  const waits = canWaitFor(tasks, blockingTask.id)
  const reason =
    e.surface === 'mobile' ? null : (() => {
      const { Input } = $.ui.resolve(e as RenderInput<'Pane', 'terminal'>)

      return (
        <Input
          key="block-reason"
          label="Or a reason"
          placeholder="waiting for the API key"
          submitLabel="Block"
          onSubmit={value => {
            if (value.trim() !== '') void pressBlockWith(p, blockingTask.id, { reason: value.trim() })
          }}
        />
      )
    })()

  return (
    <Box flexDirection="column">
      {top}
      {bar('error', '⊘ Blocked…')}
      <Text>{cut(`What does ${blockingTask.title} wait for?`, cols)}</Text>
      {blockingTask.state === 'current' && <Text dimColor>It goes back in the backlog with a checkpoint.</Text>}
      {waits.length === 0 && <Text dimColor>No other task it can wait for.</Text>}
      {waits.map((t, n) => (
        <Button
          key={`wait:${t.id}`}
          plain
          {...(n < 9 ? { hotkey: String(n + 1) } : {})}
          label={cut(t.title, cols - 3)}
          onPress={() => void pressBlockWith(p, blockingTask.id, { waitFor: t.id })}
        />
      ))}
      {reason}
      <Button key="block-cancel" plain label="Cancel" onPress={() => void pressCancelBlock(p)} />
      {hints}
    </Box>
  )
}
