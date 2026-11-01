import type { EngineInterface, RenderElement, RenderInput } from 'claude-code'
import type { Task } from '../../../../../types'
import { pressStartFromBacklog } from '../state_management/tasks_controller'
import { capital, total } from '../../../../core/widgets/format'
import { KEYS } from '../../../../core/widgets/keys'
import type { MenuContext } from '../../../../core/widgets/menu_context'
import { cut } from '../../../../core/widgets/text'
import { childrenOf, groupBacklog, progressOf, progressText } from '../../../../shared/backlog/domain/services/families'
import type { Group } from '../../../../shared/backlog/domain/services/families'
import { blockedText, budgetLabel, formatSpan, isBlocked } from '../../../../shared/backlog/domain/services/ranking'
import type { Ranked } from '../../../../shared/backlog/domain/services/ranking'
import { PRIORITY_ORDER } from '../../../../shared/records/domain/services/queue_rules'
import { formatAge, formatMinutes } from '../../../../shared/time/domain/services/time'
import { fileFromCommand } from '../state_management/filing_controller'
import { pressBlock, pressBudget, pressClearFeature, pressFold, pressPlayNext, pressPriority, pressRemove, pressRow, pressUnblock } from '../state_management/queue_controller'
import { familyButtons } from '../widgets/family_buttons'

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
          onPress={() => void pressStartFromBacklog(p, task.id)}
        />
      )}
      {PRIORITY_ORDER.map((level, n) => (
        <Button
          key={`prio:${task.id}:${level}`}
          plain
          hotkey={String(n + 1)}
          label={level === task.priority ? `${level} •` : level}
          onPress={() => (level === task.priority ? undefined : void pressPriority(p, task.id, level))}
        />
      ))}
      {!isBlockedRow && (
        <Button
          key={`play-next:${task.id}`}
          plain
          hotkey={KEYS.playNext}
          label={record?.playNext === task.id ? 'Play next •' : 'Play next'}
          onPress={() => void pressPlayNext(p, task.id)}
        />
      )}
      {!isBlockedRow && (
        <Button key={`block:${task.id}`} plain hotkey={KEYS.block} label="Blocked…" onPress={() => void pressBlock(p, task.id)} />
      )}
      {isBlockedRow && (
        <Button key={`unblock:${task.id}`} plain hotkey={KEYS.unblock} label="Unblock" onPress={() => void pressUnblock(p, task.id)} />
      )}
      {familyButtons(c, task)}
      <Button key={`remove:${task.id}`} plain hotkey={KEYS.remove} label="Remove" onPress={() => void pressRemove(p, task.id)} />
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
            if (value.trim() !== '') void fileFromCommand(p, value.trim())
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
        <Button key={`row:${task.id}`} plain {...(isStar ? { autoFocus: true as const } : {})} onPress={() => void pressRow(p, task.id)}>
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
      <Button key={`row:${task.id}`} plain onPress={() => void pressRow(p, task.id)}>
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
          <Button key={`fold:${parent.id}`} plain label={isOpen ? '▾' : '▸'} onPress={() => void pressFold(p, parent.id)} />
          <Text> </Text>
          <Button
            key={`row:${parent.id}`}
            plain
            {...(g.hasStar ? { autoFocus: true as const } : {})}
            onPress={() => void (isQueued ? pressRow(p, parent.id) : pressFold(p, parent.id))}
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
          <Button key="feature:clear" plain label="Clear" onPress={() => void pressClearFeature(p)} />
        </Box>
      )}
      {waiting === 0 && <Text dimColor>Nothing waiting.</Text>}
      {waiting > 0 && queue.length === 0 && <Text dimColor>Nothing can start: every task waiting is blocked.</Text>}
      {waiting > 0 && (
        <Button key="time" plain hotkey={KEYS.time} label={`Time I have: ${budgetLabel(budget)}`} onPress={() => void pressBudget(p)} />
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
