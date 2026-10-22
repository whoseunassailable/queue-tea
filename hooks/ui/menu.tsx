import type { Color, EngineInterface, RenderElement, RenderInput } from 'claude-code'

import type { MenuView, Priority, Task } from '../../types'
import {
  brewNow,
  fileFromCommand,
  loadRecord,
  pressBackToQueue,
  pressCheckAgain,
  pressContinue,
  pressDismissWarning,
  pressDoneNotYet,
  pressDoneYes,
  pressMenu,
  pressPriority,
  pressRemove,
  pressRow,
  pressStartFromBacklog,
  pressStartNext,
  pressSwitch,
} from '../actions'
import { live } from '../live'
import { getView, readCup } from '../ports'
import { currentTask, orderQueue, PRIORITY_ORDER } from '../queue'
import { dayKey, formatMinutes } from '../time'
import { formatAllowance } from '../usage'
import { handoffSections } from './handoff'
import { KEYS } from './keys'
import { cut, doneThisWeek, finishedTasks, formatAge, weekChart, weekMinutes, weekOf } from './status'

const SPIN = '◐◓◑◒'
const EMPTY = "Nothing queued yet. Tell me what you're working on and it becomes the first task."
const DONE_ROWS = 5
const EARLIER_ROWS = 5

const PRIORITY_COLOR: Record<Priority, Color> = {
  urgent: 'error',
  high: 'warning',
  mid: 'suggestion',
  okay: 'success',
  low: 'inactive',
}

// The list, in order, each entry with its key.
const ENTRIES: readonly { view: Exclude<MenuView, 'menu'>; hotkey: string; label: string }[] = [
  { view: 'brew', hotkey: '1', label: 'Brew now' },
  { view: 'backlog', hotkey: '2', label: 'Backlog' },
  { view: 'current', hotkey: '3', label: 'Current task' },
  { view: 'history', hotkey: '4', label: 'History' },
  { view: 'usage', hotkey: '5', label: 'Usage & time' },
  { view: 'settings', hotkey: '6', label: 'Settings' },
]
const LABEL_WIDTH = 14

const capital = (word: string) => word.charAt(0).toUpperCase() + word.slice(1)
const total = (byDay: Record<string, number>) => Object.values(byDay).reduce((a, b) => a + b, 0)
const sum = (minutes: number[]) => minutes.reduce((a, b) => a + b, 0)
const grouped = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',')

// A handoff line's mark, from its section: a step still to do, one done, or
// a plain point.
const markFor = (heading: string) => (/next|left|to do|todo/i.test(heading) ? '☐' : /changed|done/i.test(heading) ? '✓' : '•')

// The menu the tea cup opens: the list, or one of its views. Every press
// goes to the same actions the panel used; opening, moving between views and
// closing write nothing to the record.
export async function renderMenu($: EngineInterface, e: RenderInput<'Pane'>): Promise<RenderElement> {
  const els = $.ui.resolve(e)
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
    return (
      <Box flexDirection="column">
        <Text>Couldn't read your task record</Text>
        <Text dimColor>It is left as it is. Try again, or look at the file in ~/.queue-tea/projects.</Text>
        <Button key="retry" label="Try again" hotkey={KEYS.retry} onPress={() => void loadRecord($)} />
      </Box>
    )
  }

  const view = await getView($, 'menuView')
  const record = await getView($, 'record')
  const tasks = record?.tasks ?? []
  const current = currentTask(tasks)
  const queue = orderQueue(tasks)
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
  const cup = await readCup($, false)
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
          <Button key="dismiss-warning" plain hotkey={KEYS.dismiss} label="OK" onPress={() => void pressDismissWarning($)} />
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
            ? '1–6 pick · tab move · enter press · esc close'
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

  if (view === 'menu') {
    const isEmpty = current === null && queue.length === 0 && done.length === 0
    const needsYou = cup.mood === 'attention' && cup.view === 'current'
    const todayMinutes = minutes[weekOf(today).indexOf(today)] ?? 0
    const summary: Record<Exclude<MenuView, 'menu'>, string> = {
      brew: 'do it now, outside the queue',
      backlog: queue.length === 0 ? 'nothing waiting' : `${queue.length} waiting · ★ ${queue[0]!.title}`,
      current: needsYou ? cup.line : current === null ? 'none' : `${current.title} · ${formatMinutes(total(current.minutesByDay))}`,
      history: `${done.length} this week · ${formatMinutes(sum(minutes))}`,
      usage: `${allowance === null ? '' : `5h ${Math.round(allowance.percent)}% · `}today ${formatMinutes(todayMinutes)}`,
      settings: '/config options and paths',
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

  if (view === 'brew') {
    const field =
      e.surface === 'mobile' ? (
        <Text>Type /brew and your request at the prompt.</Text>
      ) : (
        (() => {
          const { Input } = $.ui.resolve(e as RenderInput<'Pane', 'terminal'>)

          return (
            <Input
              key="brew"
              label="Brew"
              placeholder="start the dev server and tell me its URL"
              submitLabel="Brew"
              autoFocus
              onSubmit={value => void brewNow($, value)}
            />
          )
        })()
      )

    return (
      <Box flexDirection="column">
        {top}
        {bar('suggestion', '~ Brew now')}
        <Text dimColor>Claude does it right away, outside the queue: no task, the same branch and conversation.</Text>
        {field}
        {hints}
      </Box>
    )
  }

  const tag = (p: Priority) => <Text color={PRIORITY_COLOR[p]}>[{p}]</Text>

  if (view === 'backlog') {
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

    return (
      <Box flexDirection="column">
        {top}
        {bar('inactive', `○ Backlog${queue.length > 0 ? ` (${queue.length})` : ''}`)}
        {queue.length === 0 && <Text dimColor>Nothing waiting.</Text>}
        {isChoosingNext && queue.length > 0 && current === null && (
          <Text dimColor>Pick the next task: s starts ★, or press a row.</Text>
        )}
        {queue.map((task, i) => {
          const waited = formatAge(now - Date.parse(task.created))
          const soFar = total(task.minutesByDay)
          const dim = [
            capital(task.difficulty.expected),
            `waited ${waited}`,
            ...(task.branch === null ? [] : [task.branch]),
            ...(soFar > 0 ? [`${formatMinutes(soFar)} so far`] : []),
          ].join(' · ')

          return (
            <Box flexDirection="column">
              <Button key={`row:${task.id}`} plain {...(i === 0 ? { autoFocus: true as const } : {})} onPress={() => void pressRow($, task.id)}>
                {i === 0 ? '★ ' : '  '}
                {tag(task.priority)} {cut(task.title, cols - task.priority.length - 5)}
              </Button>
              <Text dimColor>{cut(`  ${dim}`, cols)}</Text>
              {openRow === task.id && (
                <Box flexWrap="wrap" columnGap={2}>
                  {current === null && (
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
                  <Button key={`remove:${task.id}`} plain hotkey={KEYS.remove} label="Remove" onPress={() => void pressRemove($, task.id)} />
                </Box>
              )}
            </Box>
          )
        })}
        {newTask}
        {hints}
      </Box>
    )
  }

  if (view === 'current') {
    const handoffCard = (task: Task) => {
      if (task.handoff === null) return null
      const sections = handoffSections(task.handoff.text)
      const written = task.handoff.written
      const when = written.slice(0, 10) === today ? written.slice(11, 16) : `${written.slice(0, 10)} ${written.slice(11, 16)}`

      return (
        <Box flexDirection="column" borderStyle="round" borderColor="subtle" paddingX={1}>
          <Text bold>
            Handoff note <Text dimColor>· {when}</Text>
          </Text>
          {sections === null ? (
            <Text>{task.handoff.text}</Text>
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
          <Box gap={2}>
            {!isAskingDone && <Button key="done" plain hotkey={KEYS.done} label="Done" onPress={() => void pressDoneYes($)} />}
            <Button key="back" plain hotkey={KEYS.back} label="Back to queue" onPress={() => void pressBackToQueue($)} />
          </Box>
        )}
        {hints}
      </Box>
    )
  }

  if (view === 'history') {
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

  if (view === 'usage') {
    const todayMinutes = minutes[weekOf(today).indexOf(today)] ?? 0
    const outside = sum(weekOf(today).map(day => record?.unassignedMinutesByDay[day] ?? 0))
    const effort = current?.effort

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
              {cut(`  ${effort.filesRead} files read · ${effort.filesChanged} changed · +${effort.linesAdded} −${effort.linesRemoved} lines`, cols)}
            </Text>
          </Box>
        )}
        <Text dimColor>Outside tasks this week: {formatMinutes(outside)}</Text>
        {hints}
      </Box>
    )
  }

  const opts = live.ctx?.options ?? live.opts

  return (
    <Box flexDirection="column">
      {top}
      {bar('inactive', '≡ Settings')}
      <Text>Idle gap that stops the clock: {opts.idleGapMinutes} minutes</Text>
      <Text>Fresh conversation at: {grouped(opts.freshAtTokens)} tokens</Text>
      <Text>Handoff note at: {opts.handoffAtPercent}% of the 5-hour allowance</Text>
      <Text>Message check time limit: {opts.checkTimeoutSeconds} seconds</Text>
      <Text>{cut(`Task log: ${record?.docsLogPath ?? 'asked when the first task here is done'}`, cols)}</Text>
      <Text dimColor>{cut(`Record: ${live.ctx?.file ?? 'not found'}`, cols)}</Text>
      <Text dimColor>Change the first four with /config.</Text>
      {hints}
    </Box>
  )
}
