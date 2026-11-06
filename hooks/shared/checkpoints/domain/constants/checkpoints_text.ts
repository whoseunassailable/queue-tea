export const FIRST_MESSAGE_LABELS = { task: 'Task:', description: 'Description:', criteria: 'Acceptance criteria:' }

// What Codex is told before the task. Codex runs without Queue-tea's git
// guard, so the rules come first; its sandbox and approvals back them up.
export const CODEX_RULES = (folder: string, branch: string | null): string =>
  [
    'From Queue-tea, before you start:',
    `- You're working on one task, in ${folder}${branch === null ? '' : `, on the branch ${branch}`}. Stay in that folder${branch === null ? '' : ' and on that branch'}.`,
    '- Never commit, push, merge, rebase, cherry-pick, revert, reset or tag, and never run gh pr merge. Rohan makes every commit and push himself: leave your changes uncommitted.',
    "- Ask before anything that deletes files outside the task's own changes, installs software or reaches the network.",
    "- Queue-tea can't see what you run. When you say a check passed, name the command and what it printed.",
    "- When the task looks done, say so and say what's left, if anything. Rohan finishes it in Queue-tea.",
    '- If the Queue-tea MCP tools are connected, read queue_tea for the task in this folder, and use task_looks_done with its taskId to request review. Do not mark it finished.',
    '- Queue-tea skills in Codex: $brew, $instant, $tea, $steep, $done, $feature, $queue-tea, $chai-pter, $commit-chai-n, $mocha-mockup, $tea-dd and $tea-concile. Use /skills to find them. Bare /brew and the other Claude slash commands are not registered by this integration.',
  ].join('\n')
