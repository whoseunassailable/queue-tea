import type { Color, EngineInterface, RenderElement, RenderInput } from 'claude-code'

import type { Priority, Task } from '../../types'
import {
  fileFromCommand,
  loadRecord,
  pressBackToQueue,
  pressCheckAgain,
  pressContinue,
  pressDismissWarning,
  pressDoneNotYet,
  pressDoneYes,
  pressPalette,
  pressPriority,
  pressRemove,
  pressRow,
  pressStart,
  pressStartNext,
  pressSwitch,
} from '../actions'
import { live } from '../live'
import { getView } from '../ports'
import { currentTask, orderQueue, PRIORITY_ORDER } from '../queue'
import { dayKey, formatMinutes } from '../time'
import { formatAllowance } from '../usage'
import { handoffSections } from './handoff'
import { KEYS, paletteItems } from './keys'
import type { ActionId } from './keys'
import { cut, doneThisWeek, formatAge, weekChart, weekMinutes } from './status'

const SPIN = '◐◓◑◒'
const EMPTY = "Nothing queued yet. Tell me what you're working on and it becomes the first task."
const DONE_ROWS = 5

const PRIORITY_COLOR: Record<Priority, Color> = {
  urgent: 'error',
  high: 'warning',
  mid: 'suggestion',
  okay: 'success',
  low: 'inactive',
}

const capital = (word: string) => word.charAt(0).toUpperCase() + word.slice(1)
const total = (byDay: Record<string, number>) => Object.values(byDay).reduce((a, b) => a + b, 0)

// A handoff line's mark, from its section: a step still to do, one done, or
// a plain point.
const markFor = (heading: string) => (/next|left|to do|todo/i.test(heading) ? '☐' : /changed|done/i.test(heading) ? '✓' : '•')

export async function renderPanel($: EngineInterface, e: RenderInput<'Pane'>): Promise<RenderElement> {
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
        <Text dimColor>It is left as it is. Try again, or look at the file in ~/.queue-tie/projects.</Text>
        <Button key="retry" label="Try again" hotkey={KEYS.retry} onPress={() => void loadRecord($)} />
      </Box>
    )
  }

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
  const isPaletteOpen = await getView($, 'isPaletteOpen')
  const offset = live.ctx?.offsetMinutes ?? 0
  const now = await $.clock.now()
  const today = dayKey(now, offset)
  const name = live.ctx?.projectName ?? 'this project'

  // A solid bar over each section: its icon, name and count.
  const bar = (color: Color, text: string) => (
    <Box backgroundColor={color}>
      <Text color="inverseText" bold>
        {cut(` ${text} `, cols)}
      </Text>
    </Box>
  )

  const header = (
    <Box justifyContent="space-between">
      <Text bold>Queue-tie · {name}</Text>
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
    <Box>
      <Button key="palette" plain hotkey={KEYS.close} label={isPaletteOpen ? 'board' : 'actions'} onPress={() => void pressPalette($)} />
      <Text dimColor>
        {e.props.isFocused ? ' · tab move · enter press · esc back to the chat' : ' · ctrl+x tab, or a click, to use the keys here'}
      </Text>
    </Box>
  )

  if (isPaletteOpen) {
    const items = paletteItems({
      current,
      next: queue[0] ?? null,
      hasHold: hold !== null,
      hasMismatch: mismatch !== null,
      canContinue,
      isBusy: busy !== null,
      hasWarning: warning !== null,
    })
    const run: Record<ActionId, () => void> = {
      'start-next': () => void pressStartNext($),
      'check-again': () => void pressCheckAgain($),
      switch: () => void pressSwitch($),
      continue: () => void pressContinue($),
      done: () => void pressDoneYes($),
      back: () => void pressBackToQueue($),
      dismiss: () => void pressDismissWarning($),
      close: () => void pressPalette($),
    }
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
        {header}
        {bar('suggestion', '⌘ Actions')}
        {items
          .filter(item => item.id !== 'close')
          .map(item => (
            <Box flexDirection="column">
              <Button key={`palette:${item.id}`} plain hotkey={item.hotkey} label={cut(item.label, cols - 3)} onPress={run[item.id]} />
              <Text dimColor>{cut(`   ${item.hint}`, cols)}</Text>
            </Box>
          ))}
        {newTask}
        {hints}
      </Box>
    )
  }

  if (current === null && queue.length === 0 && doneThisWeek(tasks, today).length === 0) {
    return (
      <Box flexDirection="column">
        {header}
        {lines}
        <Text>{EMPTY}</Text>
        {hints}
      </Box>
    )
  }

  const tag = (p: Priority) => <Text color={PRIORITY_COLOR[p]}>[{p}]</Text>

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

  const inProgress = (
    <Box flexDirection="column">
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
    </Box>
  )

  const upNext = (
    <Box flexDirection="column">
      {bar('inactive', `○ Up next${queue.length > 0 ? ` (${queue.length})` : ''}`)}
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
            <Button key={`row:${task.id}`} plain onPress={() => void pressRow($, task.id)}>
              {i === 0 ? '★ ' : '  '}
              {tag(task.priority)} {cut(task.title, cols - task.priority.length - 5)}
            </Button>
            <Text dimColor>{cut(`  ${dim}`, cols)}</Text>
            {openRow === task.id && (
              <Box flexWrap="wrap" columnGap={2}>
                {current === null && (
                  <Button key={`start:${task.id}`} plain hotkey={KEYS['start-next']} label="Start" onPress={() => void pressStart($, task.id)} />
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
    </Box>
  )

  const done = doneThisWeek(tasks, today)
  const minutes = weekMinutes(tasks, record?.unassignedMinutesByDay ?? {}, today)
  const doneWeek = (
    <Box flexDirection="column">
      {bar('success', `✓ Done this week (${done.length}) · ${formatMinutes(minutes.reduce((a, b) => a + b, 0))}`)}
      {done.slice(0, DONE_ROWS).map(task => (
        <Text>
          <Text color="success">✓</Text> {cut(task.title, cols - 16)}{' '}
          <Text dimColor>· done {formatAge(now - Date.parse(task.finished!))}</Text>
        </Text>
      ))}
      {done.length > DONE_ROWS && <Text dimColor>+{done.length - DONE_ROWS} more</Text>}
      <Text color="success">{weekChart(minutes)}</Text>
    </Box>
  )

  return (
    <Box flexDirection="column">
      {header}
      {lines}
      {inProgress}
      {upNext}
      {doneWeek}
      {hints}
    </Box>
  )
}
