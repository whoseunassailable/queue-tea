import type { Ports } from '../../../../core/ports/ports'

// Lifts the git check's hold on a task, if it has one.
export const clearHold = async (p: Ports, taskId: string): Promise<void> => {
  const hold = await p.get('hold')
  if (hold?.taskId === taskId) await p.set('hold', null)
}
