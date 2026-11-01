import type { Allowance, Task } from '../../../../../types'
import { formatMinutes } from '../../../../shared/time/domain/services/time'

export const statusText = (
  task: Task | null,
  minutes: number,
  allowance: Allowance | null,
  isChecking: boolean,
): string | undefined => {
  if (isChecking) return 'Queue-tea: checking your message…'
  if (task === null) return undefined
  const used = allowance === null ? '' : ` · 5h ${Math.round(allowance.percent)}%`

  return `Queue-tea: ${task.title} · ${formatMinutes(minutes)}${used}`
}
