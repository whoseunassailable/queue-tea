import type { Task } from '../../../../../types'
import { KEYS } from '../../../../core/widgets/keys'
import type { MenuContext } from '../../../../core/widgets/menu_context'
import { childrenOf, parentOf } from '../../../../shared/backlog/domain/services/families'
import { pressFeature, pressPartOf } from '../state_management/queue_controller'

// Part of… for a task with none under it; Active feature for one on its own.
export function familyButtons(c: MenuContext, task: Task) {
  const { p, Button, tasks, feature } = c

  return [
    ...(childrenOf(task, tasks).length === 0
      ? [<Button key={`part-of:${task.id}`} plain hotkey={KEYS.partOf} label="Part of…" onPress={() => void pressPartOf(p, task.id)} />]
      : []),
    ...(parentOf(task, tasks) === null
      ? [
          <Button
            key={`feature:${task.id}`}
            plain
            hotkey={KEYS.feature}
            label={feature?.id === task.id ? 'Active feature •' : 'Active feature'}
            onPress={() => void pressFeature(p, task.id)}
          />,
        ]
      : []),
  ]
}
