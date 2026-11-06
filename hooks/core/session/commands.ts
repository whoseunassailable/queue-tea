// Both hosts expose these workflows. Each host chooses its own UI and transport.
export const QUEUE_TEA_COMMANDS = [
  { name: 'queue-tea', description: 'Open the Queue-tea menu' },
  { name: 'done', description: 'Ask whether the current Queue-tea task is done for now' },
  { name: 'steep', description: 'Steep a message for later: file it as a new Queue-tea task, with no check', argumentHint: '<message>' },
  { name: 'brew', description: 'Do this now, outside the Queue-tea queue: no task, same branch and conversation', argumentHint: '<request>' },
  { name: 'instant', description: 'The same as /brew', argumentHint: '<request>' },
  { name: 'tea', description: 'Ask or explain, outside the Queue-tea queue: no task, no changes', argumentHint: '<question>' },
  { name: 'feature', description: 'Show, set or clear the Queue-tea feature new tasks are offered under', argumentHint: '<task title> | off' },
] as const
