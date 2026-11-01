import { drawCurrent } from '../features/tasks/presentation/views/current_view'
import { drawBacklog } from '../features/tasks/presentation/views/backlog_view'
import { drawBlocking } from '../features/tasks/presentation/views/blocking_view'
import { drawParenting } from '../features/tasks/presentation/views/parenting_view'
import { capital, PRIORITY_COLOR, sum, total } from '../core/widgets/format'
import { drawBrew } from '../features/errands/presentation/views/brew_view'
import { drawUsage } from '../features/conversation/presentation/views/usage_view'
import { drawHistory } from '../features/history/presentation/views/history_view'
import { drawSettings } from '../features/settings/presentation/views/settings_view'
import { resolvePane } from '../core/widgets/menu_context'
import type { MenuContext } from '../core/widgets/menu_context'
import type { Cup } from '../features/tea_cup/domain/services/cup_mood'
import { portsOf } from '../core/ports/claude_ports'
import type { Color, EngineInterface, RenderElement, RenderInput } from 'claude-code'

import type { MenuView, Priority } from '../../types'
import { pressMenu, pressRestore } from '../actions'
import { pressDismissWarning } from '../features/commit_guard/presentation/state_management/commit_guard_controller'
import { loadRecord } from '../shared/records/presentation/state_management/records_controller'
import { activeFeature } from '../shared/backlog/domain/services/families'
import { live } from '../core/session/live'
import { blockedTasks, rankBacklog } from '../shared/backlog/domain/services/ranking'
import { getView } from '../core/store/view_store'
import { readCup } from '../features/tea_cup/presentation/state_management/tea_cup_controller'
import { currentTask } from '../shared/records/domain/services/queue_rules'
import { dayKey, formatMinutes } from '../shared/time/domain/services/time'
import { formatAllowance } from '../features/conversation/domain/services/allowance'
import { KEYS } from '../core/widgets/keys'
import { cut } from '../core/widgets/text'
import { doneThisWeek, weekMinutes, weekOf } from '../shared/time/domain/services/week_stats'

const SPIN = '◐◓◑◒'
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

// What Help lists: the commands, the most used first (/instant is /brew's
// other name), then the keys by where they work. A line fits 80 columns; a
// narrower menu wraps it rather than cut it.
export const HELP_COMMANDS: readonly { usage: string; does: string }[] = [
  { usage: '/steep <message>', does: 'file it as a task for later, no check' },
  { usage: '/brew <request>', does: 'do it now, outside the queue (or /instant)' },
  { usage: '/tea <question>', does: 'ask or explain, changing no files' },
  { usage: '/feature [<title>|off]', does: 'show, set or clear the active feature' },
  { usage: '/done', does: 'ask whether the current task is done for now' },
  { usage: '/queue-tea', does: 'open this menu' },
]
const HELP_KEYS: readonly { where: string; keys: string }[] = [
  { where: 'Backlog', keys: 's start ★, or the open row · t time I have' },
  { where: 'Open row', keys: '1–5 priority · f play next · u unblock · x remove' },
  { where: 'Row or task', keys: 'k blocked… · p part of… · a active feature' },
  { where: 'Current task', keys: 'd done · b back to queue · c continue · w switch' },
  { where: '', keys: 'r check again · y / n to "Is this done for now?"' },
  { where: 'Record unreadable', keys: 'l use the last good copy · r try again' },
]
const HELP_WIDTH = 24

export async function renderMenu($: EngineInterface, e: RenderInput<'Pane'>): Promise<RenderElement> {
  const els = resolvePane($, e)
  const { Box, Text, Button } = els
  const spin = SPIN[(await getView($, 'spin')) % 4]
  const load = await getView($, 'load')
  const cols = Math.max(20, e.props.bodyColumns)

  if (load === 'loading') {
    return (
      <Box flexDirection="column">
        <Text>{spin} Reading your queue…</Text>
      </Box>
    )
  }
  if (load === 'failed') {
    const problem = await getView($, 'loadError')
    const canRestore = problem?.canRestore === true

    return (
      <Box flexDirection="column">
        <Text>Couldn't read your task record</Text>
        {problem !== null && <Text color="warning">{capital(problem.reason)}.</Text>}
        <Text dimColor>
          {`It is left as it is. ${canRestore ? 'Use the last good copy, try again,' : 'Try again,'} or look at the file in ~/.queue-tea/projects.`}
        </Text>
        <Box>
          {canRestore && (
            <Button key="restore" label="Use the last good copy" hotkey={KEYS.restore} onPress={() => void pressRestore($)} />
          )}
          <Button key="retry" label="Try again" hotkey={KEYS.retry} onPress={() => void loadRecord(portsOf($))} />
        </Box>
      </Box>
    )
  }

  const view = await getView($, 'menuView')
  const record = await getView($, 'record')
  const tasks = record?.tasks ?? []
  const current = currentTask(tasks)
  const budget = await getView($, 'budget')
  // The tasks that can start, in the order Start ★ takes them; the blocked
  // ones apart.
  const ranked = record === null ? [] : rankBacklog(record, budget)
  const queue = ranked.map(r => r.task)
  const blocked = blockedTasks(tasks)
  const waiting = queue.length + blocked.length
  const blocking = await getView($, 'blocking')
  const parenting = await getView($, 'parenting')
  const openParents = await getView($, 'openParents')
  const feature = record === null ? null : activeFeature(record)
  const drift = await getView($, 'drift')
  const others = await getView($, 'others')
  const allowance = await getView($, 'allowance')
  const notice = await getView($, 'notice')
  const mismatch = await getView($, 'mismatch')
  const hold = await getView($, 'hold')
  const isAskingDone = await getView($, 'isAskingDone')
  const isChoosingNext = await getView($, 'isChoosingNext')
  const isChecking = await getView($, 'isChecking')
  const canContinue = await getView($, 'canContinue')
  const openRow = await getView($, 'openRow')
  const checked = await getView($, 'checked')
  const busy = await getView($, 'busy')
  const warning = await getView($, 'warning')
  const cup = await readCup(portsOf($), false)
  const offset = live.ctx?.offsetMinutes ?? 0
  const now = await $.clock.now()
  const today = dayKey(now, offset)
  const name = live.ctx?.projectName ?? 'this project'
  const done = doneThisWeek(tasks, today)
  const minutes = weekMinutes(tasks, record?.unassignedMinutesByDay ?? {}, today)

  // A solid bar over each view: its icon, name and count.
  const bar = (color: Color, text: string) => (
    <Box backgroundColor={color}>
      <Text color="inverseText" bold>
        {cut(` ${text} `, cols)}
      </Text>
    </Box>
  )

  const header = (
    <Box justifyContent="space-between">
      <Text bold>Queue-tea · {name}</Text>
      {allowance !== null && <Text dimColor>{formatAllowance(allowance, offset)}</Text>}
    </Box>
  )

  const lines = (
    <Box flexDirection="column">
      {warning !== null && (
        <Box>
          <Text color="warning">⚠ {warning} </Text>
          <Button key="dismiss-warning" plain hotkey={KEYS.dismiss} label="OK" onPress={() => void pressDismissWarning(portsOf($))} />
        </Box>
      )}
      {isChecking && <Text>{spin} Checking your message…</Text>}
      {busy !== null && (
        <Text>
          {spin} {busy}
        </Text>
      )}
      {notice !== null && <Text dimColor>{notice}</Text>}
    </Box>
  )

  const hints = (
    <Text dimColor>
      {cut(
        !e.props.isFocused
          ? 'click or ctrl+x tab for keys · esc closes'
          : view === 'menu'
            ? '1–7 pick · tab move · enter press · esc close'
            : 'm menu · tab move · enter press · esc close',
        cols,
      )}
    </Text>
  )

  // A view's top: the header and its lines, then the way back to the list.
  const top = (
    <Box flexDirection="column">
      {header}
      {lines}
      <Button key="menu:back" plain hotkey={KEYS.menu} label="‹ Menu" onPress={() => void pressMenu($, 'menu')} />
    </Box>
  )

  const tag = (p: Priority) => <Text color={PRIORITY_COLOR[p]}>[{p}]</Text>
  const p = portsOf($)
  const c: MenuContext = {
    e, p, Box, Text, Button, view, cols, now, today, offset, record, tasks, current, budget, ranked, queue, blocked, waiting, feature,
    others, allowance, hold, isAskingDone, isChoosingNext, canContinue, openRow, checked, busy, drift, mismatch, openParents, done,
    minutes, header, lines, hints, top, bar, tag,
  }

  if (view === 'menu') return drawHome($, c, cup)
  if (view === 'brew') return drawBrew($, c)
  const blockingTask = blocking === null ? undefined : tasks.find(t => t.id === blocking)
  if (blockingTask !== undefined && (view === 'backlog' || view === 'current')) return drawBlocking($, c, blockingTask)
  const parentingTask = parenting === null ? undefined : tasks.find(t => t.id === parenting)
  if (parentingTask !== undefined && (view === 'backlog' || view === 'current')) return drawParenting($, c, parentingTask)
  if (view === 'backlog') return drawBacklog($, c)
  if (view === 'current') return drawCurrent($, c)
  if (view === 'history') return drawHistory($, c)
  if (view === 'usage') return drawUsage($, c)
  if (view === 'help') return drawHelp($, c)

  return drawSettings($, c)
}

export async function drawHome($: EngineInterface, c: MenuContext, cup: Cup): Promise<RenderElement> {
  const { Box, Text, Button, cols, now, today, current, queue, blocked, waiting, feature, allowance, done, minutes, header, lines, hints } = c
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
          onPress={() => void pressMenu($, entry.view)}
        >
          {entry.label.padEnd(LABEL_WIDTH)}
          {entry.view === 'current' && needsYou ? (
            <Text color="warning">{cut(summary[entry.view], cols - LABEL_WIDTH - 3)}</Text>
          ) : (
            <Text dimColor>{cut(summary[entry.view], cols - LABEL_WIDTH - 3)}</Text>
          )}
        </Button>
      ))}
      {hints}
    </Box>
  )
}

export async function drawHelp($: EngineInterface, c: MenuContext): Promise<RenderElement> {
  const { Box, Text, hints, top, bar } = c
  // Two columns: what is typed or pressed, and what it does, wrapping under
  // its own column.
  const row = (left: string, right: string) => (
    <Box>
      <Box width={HELP_WIDTH} flexShrink={0}>
        <Text>{left}</Text>
      </Box>
      <Text dimColor>{right}</Text>
    </Box>
  )

  return (
    <Box flexDirection="column">
      {top}
      {bar('inactive', '? Commands and keys')}
      {HELP_COMMANDS.map(c => row(c.usage, c.does))}
      {HELP_KEYS.map(k => row(k.where, k.keys))}
      {hints}
    </Box>
  )
}
