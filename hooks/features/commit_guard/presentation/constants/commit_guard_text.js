"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROPOSAL_TEXT = exports.PROPOSE_TOOL = exports.GUARD_TEXT = void 0;
var commit_proposal_1 = require("../../domain/services/commit_proposal");
// The guard's refusal, by the realm's Git mode. Claude reads it, and Rohan sees it.
exports.GUARD_TEXT = {
    manual: 'Queue-tea: commits and pushes are yours to make.',
    assisted: 'Queue-tea: commits and pushes are yours to make. Claude: propose the commit with propose_commit, and Rohan commits it from Branches in the Queue-tea app.',
};
exports.PROPOSE_TOOL = {
    name: 'propose_commit',
    description: 'Propose a commit for the current Queue-tea task: the files and the message. Rohan reviews it, edits it and commits it from Branches in the Queue-tea app. Call it again to replace your last proposal. It only works in a realm whose Git mode is Assisted. The message never credits Claude: no Co-Authored-By or "Generated with" lines, nothing saying Claude proposed or wrote it.',
    message: "The commit message, at most ".concat(commit_proposal_1.PROPOSAL_LIMITS.message.toLocaleString('en'), " characters. The first line is the subject, written the way this project writes them."),
    files: "The changed files to commit, as paths from the top of the repository, at most ".concat(commit_proposal_1.PROPOSAL_LIMITS.files, ". Leave out files that belong to other work."),
};
// What the tool answers. Claude reads it.
exports.PROPOSAL_TEXT = {
    saved: function (files) { return "Proposed. Branches in the Queue-tea app now shows Rohan this commit of ".concat(files === 1 ? '1 file' : "".concat(files, " files"), ", ready to edit and commit. Don't commit it yourself."); },
    manual: "This realm's Git mode is Manual, so Queue-tea takes no proposals. Hand Rohan the commands to run instead.",
    noTask: 'No Queue-tea task is current in this folder, so there is nothing to propose a commit for.',
    notCurrent: 'That task is no longer current, so the proposal was not saved.',
    noHead: "Git couldn't read this folder's current commit, so the proposal was not saved. Check that this is the task's repository.",
    unreadable: "Queue-tea can't read this realm's record, so the proposal was not saved. The Queue-tea menu says why.",
    failed: 'Saving the proposal failed. Try again; if it fails again, hand Rohan the commands instead.',
    problems: {
        message: "Give a commit message that is not empty and at most ".concat(commit_proposal_1.PROPOSAL_LIMITS.message.toLocaleString('en'), " characters."),
        credit: 'Take out every line or phrase that credits Claude (Co-Authored-By, Generated with Claude Code, proposed by Claude) and propose again: Rohan\'s commits never say who drafted them.',
        files: "Give between 1 and ".concat(commit_proposal_1.PROPOSAL_LIMITS.files, " files to commit."),
        path: 'Give each file as a path from the top of the repository, without a leading / or ..',
    },
};
