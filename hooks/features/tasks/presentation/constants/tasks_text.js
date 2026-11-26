"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STEP_LINE = exports.WRONG_BRANCH = exports.BLOCKED = exports.BACK_IN_BACKLOG = exports.CHECKPOINT_FAILED = exports.CODEX_TIME_LOST = exports.SAVING_CHECKPOINT = exports.STEEP_PICK = exports.STEEP_USAGE = exports.DONE_NONE = exports.DONE_ASKED = exports.MENU_OPENED = exports.ERRAND_RUNNING = exports.DIDNT_RUN = exports.REMIND = exports.ASKED = exports.PROFILE_TEXT = exports.PROFILE_TOOL = exports.PROFILE_LINE = exports.PROFILE_NAMES = exports.HELPER_LINES = exports.HELPER_NAMES = exports.TASK_LINE = void 0;
var test_profile_1 = require("../../../../shared/records/domain/services/test_profile");
// Claude's brief names what the realm's Git mode lets it do.
var GIT_LINE = {
    manual: 'Never commit or push: Rohan does.',
    assisted: 'Never commit or push: Rohan does. When work is ready to commit, propose it with propose_commit, and he commits it from Branches in the Queue-tea app.',
};
var TASK_LINE = function (title, mode) {
    return "The current Queue-tea task is \"".concat(title, "\". When a reply of yours has finished what it asked, call task_looks_done. ").concat(GIT_LINE[mode]);
};
exports.TASK_LINE = TASK_LINE;
exports.HELPER_NAMES = {
    'commit-chai-n': 'Commit Chai-n',
    'mocha-mockup': 'Mocha Mockup',
    'chai-pter': 'Chai-pter',
    'tea-dd': 'Tea-DD',
};
// In work order.
exports.HELPER_LINES = [
    ['mocha-mockup', 'Before writing code, work out the design with Mocha Mockup (`queue-tea:mocha-mockup`).'],
    ['tea-dd', 'Have Tea-DD (`queue-tea:tea-dd`) write and run the tests for each feature or fix, at the test profile the change needs.'],
    ['chai-pter', 'When behaviour changes, have Chai-pter (`queue-tea:chai-pter`) update the docs.'],
    [
        'commit-chai-n',
        'Once the acceptance criteria are met and the tests pass, have Commit Chai-n (`queue-tea:commit-chai-n`) prepare the commits, before calling task_looks_done.',
    ],
];
exports.PROFILE_NAMES = {
    quick: 'Quick',
    standard: 'Standard',
    deep: 'Deep',
    critical: 'Critical',
    release: 'Release',
};
// The brief's line once a profile is set.
var PROFILE_LINE = function (profile) {
    return profile.by === 'rohan'
        ? "Test profile: ".concat(exports.PROFILE_NAMES[profile.id], ", chosen by Rohan. Tea-DD keeps to it.")
        : "Test profile: ".concat(exports.PROFILE_NAMES[profile.id], ", chosen by Tea-DD: ").concat(profile.reason);
};
exports.PROFILE_LINE = PROFILE_LINE;
exports.PROFILE_TOOL = {
    name: 'set_test_profile',
    description: "Record the test profile for the current Queue-tea task before running its checks: quick, standard, deep, critical or release, with the reason. Rohan sees it on the quest. Call it again to move up when the change reaches further than you thought. If Rohan chose the profile, his choice stands and nothing changes.",
    profile: 'The profile: quick, standard, deep, critical or release.',
    reason: "Why, in one line Rohan can read, at most ".concat(test_profile_1.TEST_PROFILE_LIMITS.reason, " characters: what the change reaches."),
};
// What the tool answers. Claude reads it.
exports.PROFILE_TEXT = {
    saved: function (id) { return "Recorded ".concat(exports.PROFILE_NAMES[id], " on the quest. Run the checks it asks for."); },
    rohans: function (id) { return "Rohan chose ".concat(exports.PROFILE_NAMES[id], " for this quest, so it stands. Run its checks; say in your report if you think it should differ."); },
    noTask: 'No Queue-tea task is current in this folder, so no profile was recorded.',
    notCurrent: 'That task is no longer current, so the profile was not recorded.',
    unreadable: "Queue-tea can't read this realm's record, so the profile was not recorded. The Queue-tea menu says why.",
    failed: 'Recording the profile failed. Go on with its checks and name the profile in your report.',
    errand: 'This is a /brew or /tea errand, outside the task, so no profile was recorded.',
    problems: {
        profile: 'Give the profile as one of quick, standard, deep, critical or release.',
        reason: "Give the reason in one line, not empty and at most ".concat(test_profile_1.TEST_PROFILE_LIMITS.reason, " characters."),
    },
};
exports.ASKED = 'Rohan is asked in the Queue-tea menu whether the task is done for now.';
var REMIND = function (name) { return "".concat(name, " is on for this task and hasn't run yet. Run it, then call task_looks_done again."); };
exports.REMIND = REMIND;
var DIDNT_RUN = function (name) { return "".concat(name, " is on and didn't run."); };
exports.DIDNT_RUN = DIDNT_RUN;
exports.ERRAND_RUNNING = 'This turn is a /brew or /tea errand, outside the task, so Rohan is not asked.';
exports.MENU_OPENED = 'Queue-tea menu opened.';
exports.DONE_ASKED = 'Asked in the Queue-tea menu.';
exports.DONE_NONE = 'No Queue-tea task is in progress.';
var STEEP_USAGE = function (command) { return "Write the task after the command: /".concat(command, " <message>"); };
exports.STEEP_USAGE = STEEP_USAGE;
exports.STEEP_PICK = 'Pick its priority in the band above the prompt.';
exports.SAVING_CHECKPOINT = 'Saving a checkpoint…';
exports.CODEX_TIME_LOST = "Couldn't read Codex's log, so this task's time on Codex wasn't added.";
exports.CHECKPOINT_FAILED = "Couldn't save a checkpoint, so Start will begin from what was saved before.";
var BACK_IN_BACKLOG = function (title) { return "Back in the backlog: ".concat(title); };
exports.BACK_IN_BACKLOG = BACK_IN_BACKLOG;
var BLOCKED = function (title) { return "Blocked: ".concat(title); };
exports.BLOCKED = BLOCKED;
var WRONG_BRANCH = function (on, expected) { return "You're on ".concat(on !== null && on !== void 0 ? on : 'a detached HEAD', "; this task is on ").concat(expected, "."); };
exports.WRONG_BRANCH = WRONG_BRANCH;
// The step the task in progress is on, as one line: what is running now, or,
// between steps, the last one and how it ended.
var STEP_DOING = {
    read: 'reading',
    edit: 'editing',
    write: 'writing',
    command: 'running',
    test: 'running checks',
    branchCreated: 'creating branch',
    branchSwitched: 'switching to branch',
};
var STEP_DONE = {
    read: 'read',
    edit: 'edited',
    write: 'wrote',
    command: 'ran',
    test: 'ran checks',
    branchCreated: 'created branch',
    branchSwitched: 'switched to branch',
};
var STEP_LINE = function (step) {
    return step.status === 'running'
        ? "Now: ".concat(STEP_DOING[step.kind], " \u00B7 ").concat(step.subject)
        : "Last step: ".concat(STEP_DONE[step.kind], " \u00B7 ").concat(step.subject).concat(step.status === 'succeeded' ? '' : " \u00B7 ".concat(step.status));
};
exports.STEP_LINE = STEP_LINE;
