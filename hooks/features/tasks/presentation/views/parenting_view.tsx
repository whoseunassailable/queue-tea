import type { RenderElement } from 'claude-code'
import type { Task } from '../../../../../types'
import type { MenuContext } from '../../../../core/widgets/menu_context'
import { cut } from '../../../../core/widgets/text'
import { parentChoices, parentOf } from '../../../../shared/backlog/domain/services/families'
import { pressCancelPartOf, pressPartOfWith } from '../state_management/queue_controller'

// Part of…: the features a task can go under, On its own, or Cancel. Asked
// from a backlog row or the current task, in the view it was asked from.
export async function drawParenting(c: MenuContext, parentingTask: Task): Promise<RenderElement> {
  const { p, Box, Text, Button, cols, tasks, feature, hints, top, bar } = c
  const choices = parentChoices(tasks, parentingTask.id)
  const under = parentOf(parentingTask, tasks)

  return (
    <Box flexDirection="column">
      {top}
      {bar('suggestion', '◆ Part of…')}
      <Text>{cut(`Which feature is ${parentingTask.title} part of?`, cols)}</Text>
      {under !== null && <Text dimColor>{cut(`Now part of ${under.title}.`, cols)}</Text>}
      {choices.length === 0 && <Text dimColor>No other open task it can go under.</Text>}
      {choices.map((t, n) => (
        <Button
          key={`parent:${t.id}`}
          plain
          {...(n < 9 ? { hotkey: String(n + 1) } : {})}
          label={cut(t.title, cols - 3)}
          onPress={() => void pressPartOfWith(p, parentingTask.id, t.id)}
        />
      ))}
      {under !== null && (
        <Button key="parent:none" plain hotkey="0" label="On its own" onPress={() => void pressPartOfWith(p, parentingTask.id, null)} />
      )}
      <Button key="part-of-cancel" plain label="Cancel" onPress={() => void pressCancelPartOf(p)} />
      {hints}
    </Box>
  )
}
