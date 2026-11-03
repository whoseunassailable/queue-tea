import type { HelperId } from '../../../../../types'

export const TASK_LINE = (title: string): string =>
  `The current Queue-tea task is "${title}". When a reply of yours has finished what it asked, call task_looks_done. Never commit or push: Rohan does.`

export const HELPER_NAMES: Record<HelperId, string> = {
  'commit-chai-n': 'Commit Chai-n',
  'mocha-mockup': 'Mocha Mockup',
  'chai-pter': 'Chai-pter',
  'tea-dd': 'Tea-DD',
}

// In work order.
export const HELPER_LINES: readonly (readonly [HelperId, string])[] = [
  ['mocha-mockup', 'Before writing code, work out the design with Mocha Mockup (`queue-tea:mocha-mockup`).'],
  ['tea-dd', 'Have Tea-DD (`queue-tea:tea-dd`) write and run the tests for each feature or fix.'],
  ['chai-pter', 'When behaviour changes, have Chai-pter (`queue-tea:chai-pter`) update the docs.'],
  [
    'commit-chai-n',
    'Once the acceptance criteria are met and the tests pass, have Commit Chai-n (`queue-tea:commit-chai-n`) prepare the commits, before calling task_looks_done.',
  ],
]

export const ASKED = 'Rohan is asked in the Queue-tea menu whether the task is done for now.'

export const REMIND = (name: string): string => `${name} is on for this task and hasn't run yet. Run it, then call task_looks_done again.`

export const DIDNT_RUN = (name: string): string => `${name} is on and didn't run.`

export const ERRAND_RUNNING = 'This turn is a /brew or /tea errand, outside the task, so Rohan is not asked.'
export const MENU_OPENED = 'Queue-tea menu opened.'
export const DONE_ASKED = 'Asked in the Queue-tea menu.'
export const DONE_NONE = 'No Queue-tea task is in progress.'
export const STEEP_USAGE = (command: string): string => `Write the task after the command: /${command} <message>`
export const STEEP_PICK = 'Pick its priority in the band above the prompt.'

export const SAVING_CHECKPOINT = 'Saving a checkpoint…'
export const CODEX_TIME_LOST = "Couldn't read Codex's log, so this task's time on Codex wasn't added."
export const CHECKPOINT_FAILED = "Couldn't save a checkpoint, so Start will begin from what was saved before."
export const BACK_IN_BACKLOG = (title: string): string => `Back in the backlog: ${title}`
export const BLOCKED = (title: string): string => `Blocked: ${title}`
export const WRONG_BRANCH = (on: string | null, expected: string | null): string => `You're on ${on ?? 'a detached HEAD'}; this task is on ${expected}.`
