import type { EngineInterface, RenderElement } from 'claude-code'
import { sum } from '../../../../core/widgets/format'
import type { MenuContext } from '../../../../core/widgets/menu_context'
import { cut } from '../../../../core/widgets/text'
import { formatAge, formatMinutes } from '../../../../shared/time/domain/services/time'
import { finishedTasks, weekChart } from '../../../../shared/time/domain/services/week_stats'

const DONE_ROWS = 5
const EARLIER_ROWS = 5


export async function drawHistory($: EngineInterface, c: MenuContext): Promise<RenderElement> {
  const { Box, Text, cols, now, tasks, done, minutes, hints, top, bar } = c
  const earlier = finishedTasks(tasks).filter(t => !done.includes(t))

  return (
    <Box flexDirection="column">
      {top}
      {bar('success', `✓ Done this week (${done.length}) · ${formatMinutes(sum(minutes))}`)}
      {done.slice(0, DONE_ROWS).map(task => (
        <Text>
          <Text color="success">✓</Text> {cut(task.title, cols - 16)}{' '}
          <Text dimColor>· done {formatAge(now - Date.parse(task.finished!))}</Text>
        </Text>
      ))}
      {done.length > DONE_ROWS && <Text dimColor>+{done.length - DONE_ROWS} more</Text>}
      <Text color="success">{weekChart(minutes)}</Text>
      {earlier.length > 0 && bar('inactive', `Earlier (${earlier.length})`)}
      {earlier.slice(0, EARLIER_ROWS).map(task => (
        <Text>
          <Text color="success">✓</Text> {cut(task.title, cols - 16)}{' '}
          <Text dimColor>· {task.finished!.slice(0, 10)}</Text>
        </Text>
      ))}
      {earlier.length > EARLIER_ROWS && <Text dimColor>+{earlier.length - EARLIER_ROWS} more</Text>}
      {hints}
    </Box>
  )
}
