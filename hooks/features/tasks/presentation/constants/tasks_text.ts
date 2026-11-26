import type { GitMode, HelperId, TaskStep, TestProfile, TestProfileId } from '../../../../../types'
import { TEST_PROFILE_LIMITS } from '../../../../shared/records/domain/services/test_profile'

// Claude's brief names what the realm's Git mode lets it do.
const GIT_LINE: Record<GitMode, string> = {
  manual: 'Never commit or push: Rohan does.',
  assisted: 'Never commit or push: Rohan does. When work is ready to commit, propose it with propose_commit, and he commits it from Branches in the Queue-tea app.',
}

export const TASK_LINE = (title: string, mode: GitMode): string =>
  `The current Queue-tea task is "${title}". When a reply of yours has finished what it asked, call task_looks_done. ${GIT_LINE[mode]}`

export const HELPER_NAMES: Record<HelperId, string> = {
  'commit-chai-n': 'Commit Chai-n',
  'mocha-mockup': 'Mocha Mockup',
  'chai-pter': 'Chai-pter',
  'tea-dd': 'Tea-DD',
}

// In work order.
export const HELPER_LINES: readonly (readonly [HelperId, string])[] = [
  ['mocha-mockup', 'Before writing code, work out the design with Mocha Mockup (`queue-tea:mocha-mockup`).'],
  ['tea-dd', 'Have Tea-DD (`queue-tea:tea-dd`) write and run the tests for each feature or fix, at the test profile the change needs.'],
  ['chai-pter', 'When behaviour changes, have Chai-pter (`queue-tea:chai-pter`) update the docs.'],
  [
    'commit-chai-n',
    'Once the acceptance criteria are met and the tests pass, have Commit Chai-n (`queue-tea:commit-chai-n`) prepare the commits, before calling task_looks_done.',
  ],
]

export const PROFILE_NAMES: Record<TestProfileId, string> = {
  quick: 'Quick',
  standard: 'Standard',
  deep: 'Deep',
  critical: 'Critical',
  release: 'Release',
}

// The brief's line once a profile is set.
export const PROFILE_LINE = (profile: TestProfile): string =>
  profile.by === 'rohan'
    ? `Test profile: ${PROFILE_NAMES[profile.id]}, chosen by Rohan. Tea-DD keeps to it.`
    : `Test profile: ${PROFILE_NAMES[profile.id]}, chosen by Tea-DD: ${profile.reason}`

export const PROFILE_TOOL = {
  name: 'set_test_profile',
  description:
    "Record the test profile for the current Queue-tea task before running its checks: quick, standard, deep, critical or release, with the reason. Rohan sees it on the quest. Call it again to move up when the change reaches further than you thought. If Rohan chose the profile, his choice stands and nothing changes.",
  profile: 'The profile: quick, standard, deep, critical or release.',
  reason: `Why, in one line Rohan can read, at most ${TEST_PROFILE_LIMITS.reason} characters: what the change reaches.`,
} as const

// What the tool answers. Claude reads it.
export const PROFILE_TEXT = {
  saved: (id: TestProfileId) => `Recorded ${PROFILE_NAMES[id]} on the quest. Run the checks it asks for.`,
  rohans: (id: TestProfileId) => `Rohan chose ${PROFILE_NAMES[id]} for this quest, so it stands. Run its checks; say in your report if you think it should differ.`,
  noTask: 'No Queue-tea task is current in this folder, so no profile was recorded.',
  notCurrent: 'That task is no longer current, so the profile was not recorded.',
  unreadable: "Queue-tea can't read this realm's record, so the profile was not recorded. The Queue-tea menu says why.",
  failed: 'Recording the profile failed. Go on with its checks and name the profile in your report.',
  errand: 'This is a /brew or /tea errand, outside the task, so no profile was recorded.',
  problems: {
    profile: 'Give the profile as one of quick, standard, deep, critical or release.',
    reason: `Give the reason in one line, not empty and at most ${TEST_PROFILE_LIMITS.reason} characters.`,
  },
} as const

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

// The step the task in progress is on, as one line: what is running now, or,
// between steps, the last one and how it ended.
const STEP_DOING: Record<TaskStep['kind'], string> = {
  read: 'reading',
  edit: 'editing',
  write: 'writing',
  command: 'running',
  test: 'running checks',
  branchCreated: 'creating branch',
  branchSwitched: 'switching to branch',
}
const STEP_DONE: Record<TaskStep['kind'], string> = {
  read: 'read',
  edit: 'edited',
  write: 'wrote',
  command: 'ran',
  test: 'ran checks',
  branchCreated: 'created branch',
  branchSwitched: 'switched to branch',
}

export const STEP_LINE = (step: TaskStep): string =>
  step.status === 'running'
    ? `Now: ${STEP_DOING[step.kind]} · ${step.subject}`
    : `Last step: ${STEP_DONE[step.kind]} · ${step.subject}${step.status === 'succeeded' ? '' : ` · ${step.status}`}`
