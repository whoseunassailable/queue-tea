import { withBlock } from '../services/task_rules'
import type { Block } from '../services/task_rules'
import type { Deps } from './deps'

// The current task goes back in the backlog, keeping its branch, start commit
// and time, so Start later goes on where it stopped. With `block`, it goes
// back blocked.
export const putBackUseCase = (d: Deps, taskId: string, block: Block | undefined) =>
  d.records.update(r => ({
    ...r,
    tasks: r.tasks.map(t => (t.id === taskId && t.state === 'current' ? withBlock({ ...t, state: 'queued' }, block) : t)),
  }))
