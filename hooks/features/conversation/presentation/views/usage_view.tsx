import type { EngineInterface, RenderElement } from 'claude-code'
import { getView } from '../../../../core/store/view_store'
import { sum, total } from '../../../../core/widgets/format'
import type { MenuContext } from '../../../../core/widgets/menu_context'
import { cut } from '../../../../core/widgets/text'
import { formatMinutes } from '../../../../shared/time/domain/services/time'
import { weekChart, weekOf } from '../../../../shared/time/domain/services/week_stats'
import { formatAllowance } from '../../domain/services/allowance'

export async function drawUsage($: EngineInterface, c: MenuContext): Promise<RenderElement> {
  const { Box, Text, cols, today, offset, record, tasks, current, allowance, minutes, lines, hints, top, bar } = c
  const todayMinutes = minutes[weekOf(today).indexOf(today)] ?? 0
  const outside = sum(weekOf(today).map(day => record?.unassignedMinutesByDay[day] ?? 0))
  const effort = current?.effort
  // Lines are measured from git after each turn; before the first, or with
  // no start commit, none are shown rather than a count of nothing.
  const measured = await getView($, 'lines')
  const linesSoFar =
    measured === null || measured.taskId !== current?.id ? '' : ` · +${measured.added} −${measured.removed} lines`

  return (
    <Box flexDirection="column">
      {top}
      {bar('suggestion', '◔ Usage & time')}
      <Text>5-hour allowance: {allowance === null ? 'not reported yet' : formatAllowance(allowance, offset).replace(/^5h: /, '')}</Text>
      <Text>
        Today {formatMinutes(todayMinutes)} · this week {formatMinutes(sum(minutes))}
      </Text>
      <Text color="success">{weekChart(minutes)}</Text>
      {current !== null && effort !== undefined && (
        <Box flexDirection="column">
          <Text>{cut(`Current task: ${current.title} · ${formatMinutes(total(current.minutesByDay))}`, cols)}</Text>
          <Text dimColor>
            {cut(`  ${effort.understandingMessages} understanding · ${effort.improvingMessages} improving messages`, cols)}
          </Text>
          <Text dimColor>
            {cut(`  ${effort.filesRead} files read · ${effort.filesChanged} changed${linesSoFar}`, cols)}
          </Text>
        </Box>
      )}
      <Text dimColor>Outside tasks this week: {formatMinutes(outside)}</Text>
      {hints}
    </Box>
  )
}
