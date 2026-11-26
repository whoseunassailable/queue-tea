"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BRANCH_TEXT = exports.operationsFolder = exports.BRANCH_LIMITS = exports.checkPath = exports.CHECK_BIN_DIRS = void 0;
exports.CHECK_BIN_DIRS = ['/opt/homebrew/bin', '/usr/local/bin', '/usr/bin', '/bin', '/usr/sbin', '/sbin'];
var checkPath = function (home, inherited) { return __spreadArray([inherited !== null && inherited !== void 0 ? inherited : '', "".concat(home, "/.local/bin"), "".concat(home, "/.volta/bin"), "".concat(home, "/.asdf/shims")], exports.CHECK_BIN_DIRS, true).filter(Boolean).join(':'); };
exports.checkPath = checkPath;
exports.BRANCH_LIMITS = { graph: 160, graphWorkers: 4, diff: 120000, conflict: 120000, output: 8000, message: 2000, recentMs: 90000, codexDays: 14, streamMs: 120, checksMs: 900000, checkChoices: 64 };
var operationsFolder = function (home, key) { return "".concat(home, "/.queue-tea/integrations/").concat(key); };
exports.operationsFolder = operationsFolder;
exports.BRANCH_TEXT = {
    read: 'The branch history could not be read. Check that the project folder is available, then try again.',
    action: 'This action could not finish. Your work is retained. Refresh the review and inspect the operation log before trying again.',
    busy: 'Another branch operation is running. Wait for it to finish, then refresh.',
    stale: 'The branches or files changed after this review. Refresh and review the new result before approving it.',
    dirty: 'Commit the source changes before preparing the merge. The destination must also have a clean working folder.',
    writer: 'A session is still working in one of these folders. Stop it before continuing.',
    idle: 'Confirm that agents and editors have stopped changing the source and destination folders.',
    missing: 'This branch or its working folder is unavailable. Restore it, then refresh.',
    invalid: 'This selection is no longer valid. Refresh the branch review and try again.',
    pending: 'This folder already has a merge, rebase, or cherry-pick in progress. Finish it before continuing.',
    reserved: 'A retained merge already uses this destination. Finish or abandon it before preparing another.',
    unresolved: 'Resolve every conflict and review the resulting changes before completing the merge.',
    unsafePath: 'This file cannot be edited safely here. Choose one complete side, or resolve it in the retained integration folder.',
    message: 'Enter a commit message of no more than 2,000 characters.',
    staged: 'Unselected files are already staged. Include them or unstage them in your editor before committing.',
    receipt: 'A previous commit attempt is retained. Refresh to inspect its result before starting another commit.',
    push: 'The push did not complete. The local merge is retained. Check your connection, authentication, and remote branch rules, then review the push again.',
    multiplePush: 'This remote has several push destinations. Configure one destination before publishing from this review.',
    checkSelection: 'Choose at least one check from this prepared result.',
    checksRequired: 'Run checks on the current prepared result before merging. Failed or cancelled checks must pass when retried.',
    checkChanged: 'The check changed prepared files. Review those files and prepare the result again before approving it.',
    checkCancelled: 'Dependency inspection was cancelled. Run the check again when ready.',
    checkTimeout: 'The check exceeded its 15-minute limit. Inspect the output before retrying.',
    checkPreparationFailed: 'The check could not start. Check access to the integration folder, then retry.',
    dependencyMissing: 'This package has no installed dependencies in the integration folder.',
    dependencyMismatch: 'The manifest, lockfile and installed dependencies do not match.',
    dependencyLockMissing: 'Commit an npm lockfile for this package before preparing the merge again.',
    dependencyLockUnsupported: 'This package needs an npm lockfile with lockfileVersion 2 or 3. Update and commit it before preparing the merge again.',
    dependencyUnsafe: 'A dependency path points outside this integration folder or uses a shared node_modules link. Prepare a local installation; do not run npm ci through that link.',
    dependencyUnreadable: 'Dependency files are missing, unreadable or incomplete. Check folder permissions and the last installation result.',
    dependencySetup: function (reason, folder, command) { return "Dependency setup required. ".concat(reason, "\nPackage folder: ").concat(folder, "\n").concat(command ? "After approving dependency installation, use the locked setup command in this integration folder:\n".concat(command, "\nThis command can run package install scripts. Review them and any network access they need before approving.") : 'Resolve the lockfile or shared-path problem above before installing dependencies.', "\nIf the offline cache is incomplete, setup has failed; approve network access separately before retrying npm ci without --offline. Queue-tea does not install packages or retry online automatically. Leave other worktrees alone. After successful setup, refresh the review and run the check again."); },
    noMerge: 'There are no new commits to merge into this destination.',
    spaceRead: 'The task folders could not be measured. Check that the project folder is available, then try again.',
    spaceFree: 'Some build folders could not be cleared. Everything else in the folders is kept. Refresh and try again.',
    spaceRemove: 'The folder could not be removed, so it is kept with everything in it. Refresh, check its changes and try again.',
    spaceHeld: 'A quest or a session started working in one of these folders. Refresh and choose again.',
    spaceChoose: 'Choose at least one folder to clear.',
    spaceUpdating: 'An app update is building and may be using these packages. Try again once it has finished.',
    notMerged: 'This branch is not merged yet, so its folder is kept.',
    folderChanged: 'This folder has uncommitted or untracked files, so it is kept. Commit or remove them first.',
    clearedAfterMerge: function (folders) { return "Cleared build folders in the task's folder: ".concat(folders.join(', ')); },
    keptAfterMerge: "Kept the task's build folders: a quest or a session is working there.",
    keptForUpdate: 'Kept every build folder: an app update is building. Free space can clear them once it has finished.',
    clearedMergedAfterMerge: function (count) { return "Cleared build folders in ".concat(count, " other merged ").concat(count === 1 ? "quest's folder" : "quests' folders", "."); },
};
