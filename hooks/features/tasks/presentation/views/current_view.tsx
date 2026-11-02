import type { RenderElement } from 'claude-code'
import type { Task } from '../../../../../types'
import { capital, markFor, total } from '../../../../core/widgets/format'
import { KEYS } from '../../../../core/widgets/keys'
import type { MenuContext } from '../../../../core/widgets/menu_context'
import { cut } from '../../../../core/widgets/text'
import { childrenOf, parentOf, progressOf, progressText } from '../../../../shared/backlog/domain/services/families'
import { cardNote } from '../../../../shared/checkpoints/domain/services/card_note'
import { formatMinutes } from '../../../../shared/time/domain/services/time'
import { pressBlock } from '../state_management/queue_controller'
import { pressBackToQueue, pressCheckAgain, pressContinue, pressDoneNotYet, pressDoneYes, pressStartNext, pressSwitch } from '../state_management/tasks_controller'
import { familyButtons } from '../widgets/family_buttons'

export async function drawCurrent(c: MenuContext): Promise<RenderElement> {
  const { p, Box, Text, Button, cols, now, today, tasks, current, queue, feature, hold, isAskingDone, canContinue, openRow, checked, busy, drift, mismatch, done, hints, top, bar, tag } = c
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
              onPress={() => void pressStartNext(p)}
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
          <Button key="switch" plain hotkey={KEYS.switch} label="Switch" onPress={() => void pressSwitch(p)} />
        </Box>
      )}
      {hold !== null && (
        <Box flexDirection="column">
          <Text>{hold.text}</Text>
          <Button key="check-again" plain hotkey={KEYS['check-again']} label="Check again" onPress={() => void pressCheckAgain(p)} />
        </Box>
      )}
      {isAskingDone && current !== null && (
        <Box flexDirection="column">
          <Text>Is this done for now?</Text>
          {checked !== null && <Text dimColor>Claude checked: {checked}</Text>}
          <Box gap={2}>
            <Button key="done-yes" plain hotkey={KEYS.yes} label="Yes" onPress={() => void pressDoneYes(p)} />
            <Button key="done-not-yet" plain hotkey={KEYS.notYet} label="Not yet" onPress={() => void pressDoneNotYet(p)} />
          </Box>
        </Box>
      )}
      {canContinue && current !== null && (
        <Box flexDirection="column">
          {handoffCard(current)}
          <Button key="continue" plain hotkey={KEYS.continue} label="Continue" onPress={() => void pressContinue(p)} />
        </Box>
      )}
      {current !== null && busy === null && (
        <Box flexWrap="wrap" columnGap={2}>
          {!isAskingDone && <Button key="done" plain hotkey={KEYS.done} label="Done" onPress={() => void pressDoneYes(p)} />}
          <Button key="back" plain hotkey={KEYS.back} label="Back to queue" onPress={() => void pressBackToQueue(p)} />
          <Button key={`block:${current.id}`} plain hotkey={KEYS.block} label="Blocked…" onPress={() => void pressBlock(p, current.id)} />
          {familyButtons(c, current)}
        </Box>
      )}
      {hints}
    </Box>
  )
}
