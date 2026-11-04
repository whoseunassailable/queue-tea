import { drawHelp } from './help_view'
import { drawHome } from './home_view'
import { drawCurrent } from '../../features/tasks/presentation/views/current_view'
import { drawBacklog } from '../../features/tasks/presentation/views/backlog_view'
import { drawBlocking } from '../../features/tasks/presentation/views/blocking_view'
import { drawParenting } from '../../features/tasks/presentation/views/parenting_view'
import { capital, PRIORITY_COLOR } from '../../core/widgets/format'
import { drawBrew } from '../../features/errands/presentation/views/brew_view'
import { drawUsage } from '../../features/conversation/presentation/views/usage_view'
import { drawHistory } from '../../features/history/presentation/views/history_view'
import { drawSettings } from '../../features/settings/presentation/views/settings_view'
import { resolvePane } from '../../core/widgets/menu_context'
import type { MenuContext } from '../../core/widgets/menu_context'
import { portsOf } from '../../core/ports/claude_ports'
import type { Color, EngineInterface, RenderElement, RenderInput } from 'claude-code'

import type { Priority } from '../../../types'
import { pressMenu } from './menu_controller'
import { pressRestore } from '../session/session_rhythm'
import { pressDismissWarning } from '../../features/commit_guard/presentation/state_management/commit_guard_controller'
import { loadRecord } from '../../shared/records/presentation/state_management/records_controller'
import { activeFeature } from '../../shared/backlog/domain/services/families'
import { live } from '../../core/session/live'
import { blockedTasks, rankBacklog } from '../../shared/backlog/domain/services/ranking'
import { getView } from '../../core/store/view_store'
import { readCup } from '../../features/tea_cup/presentation/state_management/tea_cup_controller'
import { currentTask } from '../../shared/records/domain/services/queue_rules'
import { dayKey } from '../../shared/time/domain/services/time'
import { formatAllowance } from '../../features/conversation/domain/services/allowance'
import { KEYS } from '../../core/widgets/keys'
import { cut } from '../../core/widgets/text'
import { doneThisWeek, weekMinutes } from '../../shared/time/domain/services/week_stats'

const SPIN = '◐◓◑◒'

// The menu the tea cup opens: the list, or one of its views. Every press
// goes to the same actions the panel used; opening, moving between views and
// closing write nothing to the record.
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
            <Button key="restore" label="Use the last good copy" hotkey={KEYS.restore} onPress={() => void pressRestore(portsOf($))} />
          )}
          <Button key="retry" label="Try again" hotkey={KEYS.retry} onPress={() => void loadRecord(portsOf($))} />
        </Box>
      </Box>
    )
  }

  const view = await getView($, 'menuView')
  const record = await getView($, 'record')
  const tasks = record?.tasks ?? []
  const current = currentTask(tasks, live.ctx)
  const budget = await getView($, 'budget')
  // The tasks that can start, in the order Start ★ takes them; the blocked
  // ones apart.
  const queue = record === null ? [] : rankBacklog(record, budget).map(r => r.task)
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
      <Button key="menu:back" plain hotkey={KEYS.menu} label="‹ Menu" onPress={() => void pressMenu(portsOf($), 'menu')} />
    </Box>
  )

  const tag = (p: Priority) => <Text color={PRIORITY_COLOR[p]}>[{p}]</Text>
  const p = portsOf($)
  const c: MenuContext = {
    e, p, Box, Text, Button, view, cols, now, today, offset, record, tasks, current, budget, queue, blocked, waiting, feature,
    others, allowance, hold, isAskingDone, isChoosingNext, canContinue, openRow, checked, busy, drift, mismatch, openParents, done,
    minutes, header, lines, hints, top, bar, tag,
  }

  if (view === 'menu') return drawHome(c, cup)
  if (view === 'brew') return drawBrew($, c)
  const blockingTask = blocking === null ? undefined : tasks.find(t => t.id === blocking)
  if (blockingTask !== undefined && (view === 'backlog' || view === 'current')) return drawBlocking($, c, blockingTask)
  const parentingTask = parenting === null ? undefined : tasks.find(t => t.id === parenting)
  if (parentingTask !== undefined && (view === 'backlog' || view === 'current')) return drawParenting(c, parentingTask)
  if (view === 'backlog') return drawBacklog($, c)
  if (view === 'current') return drawCurrent(c)
  if (view === 'history') return drawHistory(c)
  if (view === 'usage') return drawUsage(c)
  if (view === 'help') return drawHelp(c)

  return drawSettings(c)
}
