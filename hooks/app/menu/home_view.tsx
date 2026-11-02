import type { RenderElement } from 'claude-code'
import type { MenuView } from '../../../types'
import { sum, total } from '../../core/widgets/format'
import type { MenuContext } from '../../core/widgets/menu_context'
import { cut } from '../../core/widgets/text'
import type { Cup } from '../../features/tea_cup/domain/services/cup_mood'
import { formatMinutes } from '../../shared/time/domain/services/time'
import { weekOf } from '../../shared/time/domain/services/week_stats'
import { pressMenu, pressOpenApp } from './menu_controller'

const EMPTY = "Nothing queued yet. Tell me what you're working on and it becomes the first task."

// The list, in order, each entry with its key.
const ENTRIES: readonly { view: Exclude<MenuView, 'menu'>; hotkey: string; label: string }[] = [
  { view: 'brew', hotkey: '1', label: 'Brew now' },
  { view: 'backlog', hotkey: '2', label: 'Backlog' },
  { view: 'current', hotkey: '3', label: 'Current task' },
  { view: 'history', hotkey: '4', label: 'History' },
  { view: 'usage', hotkey: '5', label: 'Usage & time' },
  { view: 'settings', hotkey: '6', label: 'Settings' },
  { view: 'help', hotkey: '7', label: 'Help' },
]
const LABEL_WIDTH = 14

export async function drawHome(c: MenuContext, cup: Cup): Promise<RenderElement> {
  const { p, Box, Text, Button, cols, now, today, current, queue, blocked, waiting, feature, allowance, done, minutes, header, lines, hints } = c
  const isEmpty = current === null && waiting === 0 && done.length === 0
  const needsYou = cup.mood === 'attention' && cup.view === 'current'
  const todayMinutes = minutes[weekOf(today).indexOf(today)] ?? 0
  const summary: Record<Exclude<MenuView, 'menu'>, string> = {
    brew: 'do it now, outside the queue',
    backlog:
      waiting === 0 ? 'nothing waiting' : `${waiting} waiting · ${queue.length === 0 ? 'all blocked' : `★ ${queue[0]!.title}`}`,
    current: needsYou ? cup.line : current === null ? 'none' : `${current.title} · ${formatMinutes(total(current.minutesByDay))}`,
    history: `${done.length} this week · ${formatMinutes(sum(minutes))}`,
    usage: `${allowance === null ? '' : `5h ${Math.round(allowance.percent)}% · `}today ${formatMinutes(todayMinutes)}`,
    settings: '/config options and paths',
    help: '/steep /brew /tea /feature',
  }

  return (
    <Box flexDirection="column">
      {header}
      {lines}
      {isEmpty && <Text>{EMPTY}</Text>}
      {ENTRIES.map((entry, i) => (
        <Button
          key={`menu:${entry.view}`}
          plain
          hotkey={entry.hotkey}
          {...(i === 0 ? { autoFocus: true as const } : {})}
          onPress={() => void pressMenu(p, entry.view)}
        >
          {entry.label.padEnd(LABEL_WIDTH)}
          {entry.view === 'current' && needsYou ? (
            <Text color="warning">{cut(summary[entry.view], cols - LABEL_WIDTH - 3)}</Text>
          ) : (
            <Text dimColor>{cut(summary[entry.view], cols - LABEL_WIDTH - 3)}</Text>
          )}
        </Button>
      ))}
      <Button key="menu:app" plain hotkey="8" onPress={() => void pressOpenApp(p)}>
        {'Open in Queue-tea app'}
      </Button>
      {hints}
    </Box>
  )
}
