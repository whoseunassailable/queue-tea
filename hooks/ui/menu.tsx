import { capital, markFor, PRIORITY_COLOR, sum, total } from '../core/widgets/format'
import { drawBrew } from '../features/errands/presentation/views/brew_view'
import { drawUsage } from '../features/conversation/presentation/views/usage_view'
import { drawHistory } from '../features/history/presentation/views/history_view'
import { drawSettings } from '../features/settings/presentation/views/settings_view'
import { resolvePane } from '../core/widgets/menu_context'
import type { MenuContext } from '../core/widgets/menu_context'
import type { Cup } from '../features/tea_cup/domain/services/cup_mood'
import { portsOf } from '../core/ports/claude_ports'
import type { Color, EngineInterface, RenderElement, RenderInput } from 'claude-code'

import type { MenuView, Priority, Task } from '../../types'
import { fileFromCommand, pressBackToQueue, pressBlock, pressBlockWith, pressBudget, pressCancelBlock, pressCancelPartOf, pressCheckAgain, pressClearFeature, pressContinue, pressDoneNotYet, pressDoneYes, pressFeature, pressFold, pressMenu, pressPartOf, pressPartOfWith, pressPlayNext, pressPriority, pressRemove, pressRestore, pressRow, pressStartFromBacklog, pressStartNext, pressSwitch, pressUnblock } from '../actions'
import { pressDismissWarning } from '../features/commit_guard/presentation/state_management/commit_guard_controller'
import { loadRecord } from '../shared/records/presentation/state_management/records_controller'
import { activeFeature, childrenOf, groupBacklog, parentChoices, parentOf, progressOf, progressText } from '../shared/backlog/domain/services/families'
import type { Group } from '../shared/backlog/domain/services/families'
import { live } from '../core/session/live'
import { blockedTasks, blockedText, budgetLabel, canWaitFor, formatSpan, isBlocked, rankBacklog } from '../shared/backlog/domain/services/ranking'
import type { Ranked } from '../shared/backlog/domain/services/ranking'
import { getView } from '../core/store/view_store'
import { readCup } from '../features/tea_cup/presentation/state_management/tea_cup_controller'
import { currentTask, PRIORITY_ORDER } from '../shared/records/domain/services/queue_rules'
import { dayKey, formatMinutes, formatAge } from '../shared/time/domain/services/time'
import { formatAllowance } from '../features/conversation/domain/services/allowance'
import { cardNote } from '../shared/checkpoints/domain/services/card_note'
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

// Blocked…: the tasks it can wait for, a reason, or Cancel. Asked from a
// backlog row or the current task, in the view it was asked from.
export async function drawBlocking($: EngineInterface, c: MenuContext, blockingTask: Task): Promise<RenderElement> {
  const { e, Box, Text, Button, cols, tasks, waiting, hints, top, bar } = c
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
            if (value.trim() !== '') void pressBlockWith($, blockingTask.id, { reason: value.trim() })
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
          onPress={() => void pressBlockWith($, blockingTask.id, { waitFor: t.id })}
        />
      ))}
      {reason}
      <Button key="block-cancel" plain label="Cancel" onPress={() => void pressCancelBlock($)} />
      {hints}
    </Box>
  )
}

// Part of…: the features a task can go under, On its own, or Cancel. Asked
// from a backlog row or the current task, in the view it was asked from.
export async function drawParenting($: EngineInterface, c: MenuContext, parentingTask: Task): Promise<RenderElement> {
  const { Box, Text, Button, cols, tasks, feature, hints, top, bar } = c
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
          onPress={() => void pressPartOfWith($, parentingTask.id, t.id)}
        />
      ))}
      {under !== null && (
        <Button key="parent:none" plain hotkey="0" label="On its own" onPress={() => void pressPartOfWith($, parentingTask.id, null)} />
      )}
      <Button key="part-of-cancel" plain label="Cancel" onPress={() => void pressCancelPartOf($)} />
      {hints}
    </Box>
  )
}

// Part of… for a task with none under it; Active feature for one on its own.
function familyButtons($: EngineInterface, c: MenuContext, task: Task) {
  const { Button, tasks, feature } = c

  return [
    ...(childrenOf(task, tasks).length === 0
      ? [<Button key={`part-of:${task.id}`} plain hotkey={KEYS.partOf} label="Part of…" onPress={() => void pressPartOf($, task.id)} />]
      : []),
    ...(parentOf(task, tasks) === null
      ? [
          <Button
            key={`feature:${task.id}`}
            plain
            hotkey={KEYS.feature}
            label={feature?.id === task.id ? 'Active feature •' : 'Active feature'}
            onPress={() => void pressFeature($, task.id)}
          />,
        ]
      : []),
  ]
}

export async function drawBacklog($: EngineInterface, c: MenuContext): Promise<RenderElement> {
  const { e, Box, Text, Button, p, cols, now, record, tasks, current, budget, ranked, queue, blocked, waiting, feature, others, isChoosingNext, openRow, openParents, hints, top, bar, tag } = c
  // A row's own buttons once it is pressed open: Start and Play next for one
  // that can start, Unblock for a blocked one.
  const rowButtons = (task: Task, isBlockedRow: boolean) => (
    <Box flexWrap="wrap" columnGap={2}>
      {current === null && !isBlockedRow && (
        <Button
          key={`start:${task.id}`}
          plain
          hotkey={KEYS['start-next']}
          label="Start"
          onPress={() => void pressStartFromBacklog($, task.id)}
        />
      )}
      {PRIORITY_ORDER.map((p, n) => (
        <Button
          key={`prio:${task.id}:${p}`}
          plain
          hotkey={String(n + 1)}
          label={p === task.priority ? `${p} •` : p}
          onPress={() => (p === task.priority ? undefined : void pressPriority($, task.id, p))}
        />
      ))}
      {!isBlockedRow && (
        <Button
          key={`play-next:${task.id}`}
          plain
          hotkey={KEYS.playNext}
          label={record?.playNext === task.id ? 'Play next •' : 'Play next'}
          onPress={() => void pressPlayNext($, task.id)}
        />
      )}
      {!isBlockedRow && (
        <Button key={`block:${task.id}`} plain hotkey={KEYS.block} label="Blocked…" onPress={() => void pressBlock($, task.id)} />
      )}
      {isBlockedRow && (
        <Button key={`unblock:${task.id}`} plain hotkey={KEYS.unblock} label="Unblock" onPress={() => void pressUnblock($, task.id)} />
      )}
      {familyButtons($, c, task)}
      <Button key={`remove:${task.id}`} plain hotkey={KEYS.remove} label="Remove" onPress={() => void pressRemove($, task.id)} />
    </Box>
  )
  const newTask =
    e.surface === 'mobile' ? null : (() => {
      const { Input } = $.ui.resolve(e as RenderInput<'Pane', 'terminal'>)

      return (
        <Input
          key="new-task"
          label="New task"
          placeholder="Type it, then Enter"
          submitLabel="File"
          onSubmit={value => {
            if (value.trim() !== '') void fileFromCommand($, value.trim())
          }}
        />
      )
    })()

  // The ★ row is the first in the order; a feature's tasks are drawn under
  // it, `pad` further in.
  const star = ranked[0]
  const readyRow = (r: Ranked, pad: string) => {
    const task = r.task
    const isStar = r === star
    const waited = formatAge(now - Date.parse(task.created))
    const soFar = total(task.minutesByDay)
    const dim = [
      capital(task.difficulty.expected),
      `~${formatSpan(r.estimate)}${r.isShort ? ' short' : ''}`,
      `waited ${waited}`,
      ...(task.branch === null ? [] : [task.branch]),
      ...(soFar > 0 ? [`${formatMinutes(soFar)} so far`] : []),
    ].join(' · ')

    return (
      <Box flexDirection="column">
        <Button key={`row:${task.id}`} plain {...(isStar ? { autoFocus: true as const } : {})} onPress={() => void pressRow($, task.id)}>
          {pad}
          {isStar ? '★ ' : '  '}
          {tag(task.priority)} {cut(task.title, cols - task.priority.length - 5 - pad.length)}
        </Button>
        <Text dimColor>{cut(`${pad}  ${dim}`, cols)}</Text>
        {isStar && <Text dimColor>{cut(`${pad}  ${r.why}`, cols)}</Text>}
        {openRow === task.id && rowButtons(task, false)}
      </Box>
    )
  }
  const blockedRow = (task: Task, pad: string) => (
    <Box flexDirection="column">
      <Button key={`row:${task.id}`} plain onPress={() => void pressRow($, task.id)}>
        {pad}
        {'  '}
        {tag(task.priority)} {cut(task.title, cols - task.priority.length - 5 - pad.length)}
      </Button>
      <Text dimColor>{cut(`${pad}  ${blockedText(task, tasks)}`, cols)}</Text>
      {openRow === task.id && rowButtons(task, true)}
    </Box>
  )
  // A feature: ▸ shows its tasks under it and ▾ folds them away. Its title
  // opens its own buttons while it is queued, and folds it otherwise. Under
  // it, how far its tasks are, and while folded the ★ task in it.
  const groupRows = (g: Group) => {
    const parent = g.parent
    const isOpen = openParents.includes(parent.id)
    const isQueued = parent.state === 'queued'
    const starHere = g.hasStar ? star : undefined
    const mark = parent.state === 'current' ? '▶ ' : parent.state === 'done' ? '✓ ' : ''
    const finished = childrenOf(parent, tasks).filter(t => t.state === 'current' || t.state === 'done')

    return (
      <Box flexDirection="column">
        <Box>
          <Text>{g.hasStar ? '★ ' : '  '}</Text>
          <Button key={`fold:${parent.id}`} plain label={isOpen ? '▾' : '▸'} onPress={() => void pressFold($, parent.id)} />
          <Text> </Text>
          <Button
            key={`row:${parent.id}`}
            plain
            {...(g.hasStar ? { autoFocus: true as const } : {})}
            onPress={() => void (isQueued ? pressRow($, parent.id) : pressFold($, parent.id))}
          >
            {mark}
            {tag(parent.priority)} {cut(parent.title, cols - parent.priority.length - 7 - mark.length)}
          </Button>
        </Box>
        <Text dimColor>
          {cut(`    ◆ ${progressText(progressOf(parent, tasks))}${feature?.id === parent.id ? ' · active feature' : ''}`, cols)}
        </Text>
        {starHere !== undefined && (starHere.task === parent || !isOpen) && (
          <Text dimColor>{cut(`    ${starHere.task === parent ? '' : `★ ${starHere.task.title} · `}${starHere.why}`, cols)}</Text>
        )}
        {openRow === parent.id && isQueued && rowButtons(parent, isBlocked(parent, tasks))}
        {isOpen && g.rows.filter(r => r.task !== parent).map(r => readyRow(r, '  '))}
        {isOpen && g.blocked.filter(t => t !== parent).map(t => blockedRow(t, '  '))}
        {isOpen &&
          finished.map(t => (
            <Text dimColor>{cut(`      ${t.state === 'current' ? '▶' : '✓'} ${t.title}${t.state === 'current' ? ' · in progress' : ''}`, cols)}</Text>
          ))}
      </Box>
    )
  }
  const { ready, blocked: stuck } = groupBacklog(ranked, blocked, tasks)
  // The blocked tasks drawn under Blocked; the rest stand with their feature.
  const stuckCount = stuck.reduce((n, entry) => n + (entry.kind === 'group' ? entry.group.blocked.length : 1), 0)

  return (
    <Box flexDirection="column">
      {top}
      {bar('inactive', `○ Backlog${queue.length > 0 ? ` (${queue.length})` : ''}`)}
      {feature !== null && (
        <Box>
          <Text dimColor>{cut(`◆ Active feature: ${feature.title} `, cols - 6)}</Text>
          <Button key="feature:clear" plain label="Clear" onPress={() => void pressClearFeature($)} />
        </Box>
      )}
      {waiting === 0 && <Text dimColor>Nothing waiting.</Text>}
      {waiting > 0 && queue.length === 0 && <Text dimColor>Nothing can start: every task waiting is blocked.</Text>}
      {waiting > 0 && (
        <Button key="time" plain hotkey={KEYS.time} label={`Time I have: ${budgetLabel(budget)}`} onPress={() => void pressBudget($)} />
      )}
      {isChoosingNext && queue.length > 0 && current === null && (
        <Text dimColor>Pick the next task: s starts ★, or press a row.</Text>
      )}
      {ready.map(entry => (entry.kind === 'group' ? groupRows(entry.group) : entry.kind === 'task' ? readyRow(entry.row, '') : null))}
      {stuckCount > 0 && bar('error', `⊘ Blocked (${stuckCount})`)}
      {stuck.map(entry => (entry.kind === 'group' ? groupRows(entry.group) : entry.kind === 'blocked' ? blockedRow(entry.task, '') : null))}
      {others.length > 0 && bar('inactive', `◇ Other projects (${others.length})`)}
      {others.map(o => (
        <Text dimColor>{cut(`${o.name} · ${o.waiting} waiting · ${o.next === null ? 'all blocked' : `★ ${o.next}`}`, cols)}</Text>
      ))}
      {newTask}
      {hints}
    </Box>
  )
}

export async function drawCurrent($: EngineInterface, c: MenuContext): Promise<RenderElement> {
  const { Box, Text, Button, cols, now, today, tasks, current, queue, feature, hold, isAskingDone, canContinue, openRow, checked, busy, drift, mismatch, done, hints, top, bar, tag } = c
  // The feature the current task is part of, or how far its own tasks are.
  const currentParent = current === null ? null : parentOf(current, tasks)
  const currentFamily =
    current === null
      ? null
      : currentParent !== null
        ? `part of ${currentParent.title} · ${progressText(progressOf(currentParent, tasks))}`
        : childrenOf(current, tasks).length > 0
          ? `feature · ${progressText(progressOf(current, tasks))}${feature?.id === current.id ? ' · active feature' : ''}`
          : feature?.id === current.id
            ? 'active feature'
            : null
  const handoffCard = (task: Task) => {
    const note = cardNote(task)
    if (note === null) return null
    const { sections, written } = note
    const when = written.slice(0, 10) === today ? written.slice(11, 16) : `${written.slice(0, 10)} ${written.slice(11, 16)}`

    return (
      <Box flexDirection="column" borderStyle="round" borderColor="subtle" paddingX={1}>
        <Text bold>
          {note.title} <Text dimColor>· {when}</Text>
        </Text>
        {sections === null ? (
          <Text>{note.text}</Text>
        ) : (
          sections.map((s, i) => (
            <Box flexDirection="column">
              <Text bold color="suggestion">
                {i + 1} {s.heading}
              </Text>
              {s.lines.map(line => (
                <Text>{line.startsWith('- ') ? `${markFor(s.heading)} ${line.slice(2)}` : line}</Text>
              ))}
            </Box>
          ))
        )}
      </Box>
    )
  }

  return (
    <Box flexDirection="column">
      {top}
      {bar('warning', current === null ? '▶ In progress' : '▶ In progress (1)')}
      {current === null ? (
        <Box flexDirection="column">
          <Text dimColor>No task in progress.</Text>
          {queue.length > 0 && openRow === null && hold === null && (
            <Button
              key="start-next"
              plain
              hotkey={KEYS['start-next']}
              label={cut(`Start ★ ${queue[0]!.title}`, cols - 3)}
              onPress={() => void pressStartNext($)}
            />
          )}
        </Box>
      ) : (
        <Box flexDirection="column">
          <Text>
            {'  '}
            {tag(current.priority)} {cut(current.title, cols - current.priority.length - 5)}
          </Text>
          <Text dimColor>
            {cut(
              `  ${capital(current.difficulty.expected)} · ${current.branch ?? 'no branch'} · ${formatMinutes(total(current.minutesByDay))}`,
              cols,
            )}
          </Text>
          {currentFamily !== null && <Text dimColor>{cut(`  ◆ ${currentFamily}`, cols)}</Text>}
          {drift.map(line => (
            <Text color="warning">{cut(`! ${line}`, cols)}</Text>
          ))}
        </Box>
      )}
      {mismatch !== null && (
        <Box flexDirection="column">
          <Text>{mismatch}</Text>
          <Button key="switch" plain hotkey={KEYS.switch} label="Switch" onPress={() => void pressSwitch($)} />
        </Box>
      )}
      {hold !== null && (
        <Box flexDirection="column">
          <Text>{hold.text}</Text>
          <Button key="check-again" plain hotkey={KEYS['check-again']} label="Check again" onPress={() => void pressCheckAgain($)} />
        </Box>
      )}
      {isAskingDone && current !== null && (
        <Box flexDirection="column">
          <Text>Is this done for now?</Text>
          {checked !== null && <Text dimColor>Claude checked: {checked}</Text>}
          <Box gap={2}>
            <Button key="done-yes" plain hotkey={KEYS.yes} label="Yes" onPress={() => void pressDoneYes($)} />
            <Button key="done-not-yet" plain hotkey={KEYS.notYet} label="Not yet" onPress={() => void pressDoneNotYet($)} />
          </Box>
        </Box>
      )}
      {canContinue && current !== null && (
        <Box flexDirection="column">
          {handoffCard(current)}
          <Button key="continue" plain hotkey={KEYS.continue} label="Continue" onPress={() => void pressContinue($)} />
        </Box>
      )}
      {current !== null && busy === null && (
        <Box flexWrap="wrap" columnGap={2}>
          {!isAskingDone && <Button key="done" plain hotkey={KEYS.done} label="Done" onPress={() => void pressDoneYes($)} />}
          <Button key="back" plain hotkey={KEYS.back} label="Back to queue" onPress={() => void pressBackToQueue($)} />
          <Button key={`block:${current.id}`} plain hotkey={KEYS.block} label="Blocked…" onPress={() => void pressBlock($, current.id)} />
          {familyButtons($, c, current)}
        </Box>
      )}
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
