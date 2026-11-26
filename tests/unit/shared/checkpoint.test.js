"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("claude-code/testing");
var checkpoints_1 = require("../../../hooks/shared/checkpoints/domain/services/checkpoints");
var checkpoints_text_1 = require("../../../hooks/shared/checkpoints/domain/constants/checkpoints_text");
var check_now_1 = require("../../../hooks/shared/checkpoints/domain/usecases/check_now");
var branch_rules_1 = require("../../../hooks/shared/git/domain/services/branch_rules");
var git_source_1 = require("../../../hooks/shared/git/data/datasources/git_source");
var helpers_1 = require("../../helpers");
var AT = '2026-10-21T10:00:00+02:00';
var REPLY = JSON.stringify({
    goal: 'A retry button on the scan page',
    acceptance: ['The button shows when Bluetooth is off', 'Tests pass'],
    changes: ['Added the button in scan_page.dart'],
    decisions: ['Retry reuses the scan, no new state'],
    rejected: ['A timer that retries by itself: hides the problem'],
    remaining: ['Write the widget test'],
    blockers: [],
    nextAction: 'Write test/scan_page_test.dart for the off case',
});
(0, testing_1.test)('a checkpoint reply is read field by field; prose is not a checkpoint', function () {
    var parsed = (0, checkpoints_1.parseCheckpoint)("Here it is:\n".concat(REPLY), AT);
    (0, testing_1.expect)(parsed === null || parsed === void 0 ? void 0 : parsed.goal).toBe('A retry button on the scan page');
    (0, testing_1.expect)(parsed === null || parsed === void 0 ? void 0 : parsed.acceptance).toEqual(['The button shows when Bluetooth is off', 'Tests pass']);
    (0, testing_1.expect)(parsed === null || parsed === void 0 ? void 0 : parsed.rejected).toEqual(['A timer that retries by itself: hides the problem']);
    (0, testing_1.expect)(parsed === null || parsed === void 0 ? void 0 : parsed.blockers).toEqual([]);
    (0, testing_1.expect)(parsed === null || parsed === void 0 ? void 0 : parsed.written).toBe(AT);
    (0, testing_1.expect)((0, checkpoints_1.parseCheckpoint)('Button done; colour left.', AT)).toBeNull();
    (0, testing_1.expect)((0, checkpoints_1.parseCheckpoint)('{"goal":"","nextAction":""}', AT)).toBeNull();
});
(0, testing_1.test)('the prompt gives what git says and only the commands Queue-tea saw', function () {
    var run = (0, checkpoints_1.commandRun)('claude plugin test .', true, ' 143 pass\n 0 fail\n', AT);
    var task = (0, checkpoints_1.noteSeen)((0, helpers_1.makeTask)({ title: 'Retry' }), { at: AT, files: ['a.ts'], commands: [run], git: null });
    var prompt = (0, checkpoints_1.checkpointPrompt)(task, { branch: 'task/retry', head: '1a2b3c4 Add bars', uncommitted: ['a.ts'] });
    (0, testing_1.expect)(prompt).toContain('From git now: branch task/retry; last commit 1a2b3c4 Add bars; 1 not committed: a.ts.');
    (0, testing_1.expect)(prompt).toContain('- passed: claude plugin test . (0 fail)');
    (0, testing_1.expect)(prompt).toContain('Say a check passed only when it is listed as passed below.');
    (0, testing_1.expect)((0, checkpoints_1.checkpointPrompt)((0, helpers_1.makeTask)(), null)).toContain('Queue-tea saw no shell commands run during this task.');
});
(0, testing_1.test)('commands are kept with their result, tests marked, the last 15 only', function () {
    (0, testing_1.expect)((0, checkpoints_1.commandRun)('npm test', false, 'FAIL x\n2 failed', AT)).toEqual({
        command: 'npm test',
        isOk: false,
        isTest: true,
        at: AT,
        summary: '2 failed',
    });
    (0, testing_1.expect)((0, checkpoints_1.commandRun)('ls -la', true, '', AT).isTest).toBe(false);
    var task = (0, helpers_1.makeTask)();
    for (var i = 0; i < 20; i += 1) {
        task = (0, checkpoints_1.noteSeen)(task, { at: AT, files: ['a.ts'], commands: [(0, checkpoints_1.commandRun)("echo ".concat(i), true, '', AT)], git: null });
    }
    (0, testing_1.expect)(task.checkpoint.seen.commands.length).toBe(15);
    (0, testing_1.expect)(task.checkpoint.seen.commands[0].command).toBe('echo 5');
    (0, testing_1.expect)(task.checkpoint.seen.files).toEqual(['a.ts']);
});
(0, testing_1.test)('the check lines compare the repository now with what was saved', function () {
    var saved = { branch: 'task/retry', head: '1a2b3c4 Add bars', uncommitted: ['a.ts'] };
    var task = (0, helpers_1.makeTask)({
        branch: 'task/retry',
        checkpoint: __assign(__assign({}, (0, checkpoints_1.emptyCheckpoint)()), { seen: { at: AT, files: [], commands: [], git: saved } }),
    });
    (0, testing_1.expect)((0, checkpoints_1.checkLines)(task, saved, [])).toEqual([
        "✓ On task/retry, the task's branch.",
        '✓ Last commit 1a2b3c4 Add bars, as saved.',
        '1 file not committed: a.ts.',
    ]);
    (0, testing_1.expect)((0, checkpoints_1.checkLines)(task, { branch: 'main', head: '9f9f9f9 Other', uncommitted: [] }, ['main has 2 commits that task/retry doesn\'t.'])).toEqual([
        '✗ On main; the task is on task/retry.',
        '! Last commit is now 9f9f9f9 Other; the checkpoint saved 1a2b3c4 Add bars.',
        '0 files not committed (the checkpoint saved 1).',
        "! main has 2 commits that task/retry doesn't.",
    ]);
    (0, testing_1.expect)((0, checkpoints_1.checkLines)(task, null, [])).toEqual(['Not a git repository, so there is no branch to check.']);
});
(0, testing_1.test)('the first message brings the checkpoint, what was seen, what was checked, and the order to compare', function () {
    var parsed = (0, checkpoints_1.parseCheckpoint)(REPLY, AT);
    var run = (0, checkpoints_1.commandRun)('flutter test', false, 'Some tests failed.', AT);
    var task = (0, helpers_1.makeTask)({
        title: 'Retry',
        messages: ['add a retry button'],
        checkpoint: __assign(__assign({}, parsed), { seen: { at: AT, files: ['lib/scan_page.dart'], commands: [run], git: null } }),
    });
    var text = (0, checkpoints_1.firstMessage)(task, ['✓ On task/retry, the task\'s branch.']);
    (0, testing_1.expect)(text).toStartWith('Task: Retry\n\nadd a retry button\n\nCheckpoint from an earlier conversation (2026-10-21T10:00:00+02:00).');
    (0, testing_1.expect)(text).toContain('Goal: A retry button on the scan page');
    (0, testing_1.expect)(text).toContain('Acceptance criteria:\n- The button shows when Bluetooth is off\n- Tests pass');
    (0, testing_1.expect)(text).toContain('Approaches rejected:\n- A timer that retries by itself: hides the problem');
    (0, testing_1.expect)(text).toContain('Next action: Write test/scan_page_test.dart for the off case');
    (0, testing_1.expect)(text).toContain('Files Claude changed: lib/scan_page.dart');
    (0, testing_1.expect)(text).toContain('- failed: flutter test (Some tests failed.)');
    (0, testing_1.expect)(text).toContain("Checked by Queue-tea just now:\n- ✓ On task/retry, the task's branch.");
    (0, testing_1.expect)(text).toEndWith('Then do the next action.');
    (0, testing_1.expect)(text).not.toContain('Blockers');
    (0, testing_1.expect)((0, checkpoints_1.firstMessage)((0, helpers_1.makeTask)({ title: 'New', messages: ['do it'] }))).toBe('Task: New\n\ndo it');
});
(0, testing_1.test)('firstMessage carries the description and criteria', function () {
    (0, testing_1.expect)((0, checkpoints_1.firstMessage)((0, helpers_1.makeTask)({ title: 'New', messages: ['do it'], description: 'Why', criteria: ['One', 'Two'] }))).toBe('Task: New\n\nDescription: Why\n\nAcceptance criteria:\n- One\n- Two\n\ndo it');
});
var IMAGE = "attachments/".concat('a1'.repeat(32), ".png");
var PDF = "attachments/".concat('b2'.repeat(32), ".pdf");
var NOTES = '/h/.queue-tea/notes/p-000000';
(0, testing_1.test)('the first message points every file the description links at the notes folder, and says so once', function () {
    var task = (0, helpers_1.makeTask)({ title: 'New', messages: ['do it'], description: "Like this:\n![mock.png](<".concat(IMAGE, ">)\nand [spec.pdf](").concat(PDF, ")"), criteria: ['One'] });
    (0, testing_1.expect)((0, checkpoints_1.firstMessage)(task, null, NOTES)).toBe("Task: New\n\nDescription: Like this:\n![mock.png](<".concat(NOTES, "/").concat(IMAGE, ">)\nand [spec.pdf](<").concat(NOTES, "/").concat(PDF, ">)\n\n").concat(checkpoints_text_1.FIRST_MESSAGE_LABELS.files, "\n\nAcceptance criteria:\n- One\n\ndo it"));
});
(0, testing_1.test)('a description that links no saved file reads as before, notes folder or not', function () {
    var task = (0, helpers_1.makeTask)({ title: 'New', messages: ['do it'], description: 'Why [site](https://example.com) [named](attachments/photo.png)' });
    (0, testing_1.expect)((0, checkpoints_1.firstMessage)(task, null, NOTES)).toBe('Task: New\n\nDescription: Why [site](https://example.com) [named](attachments/photo.png)\n\ndo it');
    (0, testing_1.expect)((0, checkpoints_1.firstMessage)((0, helpers_1.makeTask)({ title: 'New', messages: ['do it'] }), null, NOTES)).toBe('Task: New\n\ndo it');
});
(0, testing_1.test)('with no notes folder given, a linked file stays as written and nothing is added', function () {
    var task = (0, helpers_1.makeTask)({ title: 'New', messages: ['do it'], description: "![mock.png](<".concat(IMAGE, ">)") });
    (0, testing_1.expect)((0, checkpoints_1.firstMessage)(task)).toBe("Task: New\n\nDescription: ![mock.png](<".concat(IMAGE, ">)\n\ndo it"));
});
(0, testing_1.test)("Codex's brief carries the description with its files' paths", function () {
    var task = (0, helpers_1.makeTask)({ title: 'Retry', messages: ['add a retry button'], description: "![mock.png](<".concat(IMAGE, ">)") });
    var brief = (0, checkpoints_1.codexBrief)(task, '/p/app', null, NOTES);
    (0, testing_1.expect)(brief).toContain("Description: ![mock.png](<".concat(NOTES, "/").concat(IMAGE, ">)\n\n").concat(checkpoints_text_1.FIRST_MESSAGE_LABELS.files));
    (0, testing_1.expect)(brief).toEndWith("\n\n".concat((0, checkpoints_1.firstMessage)(task, null, NOTES)));
});
(0, testing_1.test)('a plain note written after the checkpoint is the one the first message carries', function () {
    var checkpoint = __assign(__assign({}, (0, checkpoints_1.parseCheckpoint)(REPLY, AT)), { seen: null });
    var newer = (0, helpers_1.makeTask)({ checkpoint: checkpoint, handoff: { text: 'Plain note.', written: '2026-10-21T11:00:00+02:00' } });
    var older = (0, helpers_1.makeTask)({ checkpoint: checkpoint, handoff: { text: 'Old note.', written: '2026-10-21T09:00:00+02:00' } });
    (0, testing_1.expect)((0, checkpoints_1.latestNote)(newer)).toBe('handoff');
    (0, testing_1.expect)((0, checkpoints_1.firstMessage)(newer)).toContain('Handoff note (2026-10-21T11:00:00+02:00):\nPlain note.');
    (0, testing_1.expect)((0, checkpoints_1.firstMessage)(newer)).not.toContain('Goal:');
    (0, testing_1.expect)((0, checkpoints_1.latestNote)(older)).toBe('checkpoint');
    (0, testing_1.expect)((0, checkpoints_1.firstMessage)(older)).toContain('Goal: A retry button on the scan page');
    (0, testing_1.expect)((0, checkpoints_1.latestNote)((0, helpers_1.makeTask)())).toBeNull();
});
(0, testing_1.test)('status paths: changed, renamed and untracked files', function () {
    var status = [
        '# branch.head main',
        '1 .M N... 100644 100644 100644 a b src/x.ts',
        '2 R. N... 100644 100644 100644 a b R100 src/new name.ts\tsrc/old.ts',
        '? notes.md',
        '',
    ].join('\n');
    (0, testing_1.expect)((0, branch_rules_1.parseStatusPaths)(status)).toEqual(['src/x.ts', 'src/new name.ts', 'notes.md']);
});
(0, testing_1.test)('drift: a gone branch, a lost start commit, a base branch ahead', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, branches, _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                task = { branch: 'task/x', baseBranch: 'main', startCommit: '1a2b3c4d5e6f' };
                branches = { 'git branch --format=%(refname:short)': { stdout: 'main\ntask/x\n' } };
                _a = testing_1.expect;
                return [4 /*yield*/, (0, git_source_1.readDrift)((0, helpers_1.memoryHost)({ git: { 'git branch --format=%(refname:short)': { stdout: 'main\n' } } }).host, '/p', task)];
            case 1:
                _a.apply(void 0, [_e.sent()]).toEqual([
                    'The branch task/x is gone.',
                ]);
                _b = testing_1.expect;
                return [4 /*yield*/, (0, git_source_1.readDrift)((0, helpers_1.memoryHost)({
                        git: __assign(__assign({}, branches), { 'git merge-base --is-ancestor 1a2b3c4d5e6f task/x': { exitCode: 1 }, 'git rev-list --count 1a2b3c4d5e6f..main': { stdout: '3\n' } }),
                    }).host, '/p', task)];
            case 2:
                _b.apply(void 0, [_e.sent()]).toEqual(['task/x no longer holds the commit it started from (1a2b3c4): a rebase or a reset?', "main has 3 commits that task/x doesn't."]);
                _c = testing_1.expect;
                return [4 /*yield*/, (0, git_source_1.readDrift)((0, helpers_1.memoryHost)({
                        git: __assign(__assign({}, branches), { 'git merge-base --is-ancestor 1a2b3c4d5e6f task/x': {}, 'git rev-list --count 1a2b3c4d5e6f..main': { stdout: '0\n' } }),
                    }).host, '/p', task)];
            case 3:
                _c.apply(void 0, [_e.sent()]).toEqual([]);
                _d = testing_1.expect;
                return [4 /*yield*/, (0, git_source_1.readDrift)((0, helpers_1.memoryHost)().host, '/p', __assign(__assign({}, task), { branch: null }))];
            case 4:
                _d.apply(void 0, [_e.sent()]).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)("Codex's brief puts Queue-tea's rules, with the folder and branch, before what Claude would be told", function () {
    var task = (0, helpers_1.makeTask)({ title: 'Retry', messages: ['add a retry button'], branch: 'task/retry' });
    var brief = (0, checkpoints_1.codexBrief)(task, '/p/app', ['✓ On task/retry, the task\'s branch.']);
    (0, testing_1.expect)(brief).toStartWith('From Queue-tea, before you start:\n');
    (0, testing_1.expect)(brief).toContain("- You're working on one task, in /p/app, on the branch task/retry. Stay in that folder and on that branch.");
    (0, testing_1.expect)(brief).toContain('Never commit, push, merge, rebase, cherry-pick, revert, reset or tag, and never run gh pr merge.');
    (0, testing_1.expect)(brief).toContain('When you say a check passed, name the command and what it printed.');
    (0, testing_1.expect)(brief).toEndWith("\n\n".concat((0, checkpoints_1.firstMessage)(task, ['✓ On task/retry, the task\'s branch.'])));
});
(0, testing_1.test)("Codex's brief for a task with no branch names only the folder", function () {
    var brief = (0, checkpoints_1.codexBrief)((0, helpers_1.makeTask)({ title: 'Notes', messages: ['tidy'] }), '/p/notes', null);
    (0, testing_1.expect)(brief).toContain("- You're working on one task, in /p/notes. Stay in that folder.\n");
    (0, testing_1.expect)(brief).not.toContain('branch');
    (0, testing_1.expect)(brief).toEndWith('\n\nTask: Notes\n\ntidy');
});
// Git that answers facts and drift, and counts how often it was asked.
var fakeGit = function (facts, drift) {
    if (drift === void 0) { drift = []; }
    var asked = 0;
    var git = {
        facts: function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                asked += 1;
                return [2 /*return*/, facts()];
            });
        }); },
        drift: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, drift];
        }); }); },
    };
    return { git: git, asked: function () { return asked; } };
};
(0, testing_1.test)('checking now puts what git says beside the checkpoint', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, now, git, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ handoff: { text: 'Button done.', written: AT } });
                now = { branch: 'task/retry', head: '1a2b3c4 Add bars', uncommitted: [] };
                git = fakeGit(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, now];
                }); }); }, ['lib/a.dart']).git;
                _a = testing_1.expect;
                return [4 /*yield*/, (0, check_now_1.checkNowUseCase)(git, function () { }, task)];
            case 1:
                _a.apply(void 0, [_b.sent()]).toEqual((0, checkpoints_1.checkLines)(task, now, ['lib/a.dart']));
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('checking now outside a repository says there is no branch to check', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ handoff: { text: 'Button done.', written: AT } });
                _a = testing_1.expect;
                return [4 /*yield*/, (0, check_now_1.checkNowUseCase)(fakeGit(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, null];
                    }); }); }, ['ignored']).git, function () { }, task)];
            case 1:
                _a.apply(void 0, [_b.sent()]).toEqual(['Not a git repository, so there is no branch to check.']);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a task with nothing saved yet is not checked, and git is not asked', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, git, asked, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = fakeGit(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, null];
                }); }); }), git = _a.git, asked = _a.asked;
                _b = testing_1.expect;
                return [4 /*yield*/, (0, check_now_1.checkNowUseCase)(git, function () { }, (0, helpers_1.makeTask)())];
            case 1:
                _b.apply(void 0, [_c.sent()]).toBeNull();
                (0, testing_1.expect)(asked()).toBe(0);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('git failing while checking gives no check, and the failure is logged', function () { return __awaiter(void 0, void 0, void 0, function () {
    var logs, git, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                logs = [];
                git = fakeGit(function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        throw new Error('git broke');
                    });
                }); }).git;
                _a = testing_1.expect;
                return [4 /*yield*/, (0, check_now_1.checkNowUseCase)(git, function (text) { return logs.push(text); }, (0, helpers_1.makeTask)({ handoff: { text: 'x', written: AT } }))];
            case 1:
                _a.apply(void 0, [_b.sent()]).toBeNull();
                (0, testing_1.expect)(logs).toEqual(['checking the repository failed: git broke']);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a command counts as a check when one of its steps runs a test runner, type check or linter', function () {
    for (var _i = 0, _a = [
        'npm test',
        'npm run test:unit',
        'pnpm test -- --watch=false',
        'yarn lint',
        'bun run typecheck',
        'npm run check',
        'cd app && npm test',
        'cd app; npm run typecheck',
        'npm test 2>&1 | tail -40',
        'npx vitest related --run a.ts',
        'npx -y -p typescript@5.9 tsc -p .',
        'npx --package=typescript tsc',
        'caffeinate -i npm run e2e -- flows.e2e.ts',
        'CI=1 npm test',
        'env FORCE_COLOR=0 jest',
        'timeout 60 pytest -q',
        'time vitest',
        '(cd app && npm run lint)',
        '! npm test',
        'for f in a b; do npx vitest $f; done',
        'claude plugin test .',
        'claude plugin validate .',
        "node --test 'tools/*.test.mjs'",
        'node tools/check_layers.mjs',
        'cd app && node scripts/lint.cjs --fix',
        'npx playwright test',
        'python3 -m pytest tests',
        'go test ./...',
        'cargo test',
        'flutter test',
        'dart analyze',
        'eslint .',
        'mocha',
    ]; _i < _a.length; _i++) {
        var command = _a[_i];
        (0, testing_1.expect)([command, (0, checkpoints_1.isTestCommand)(command)]).toEqual([command, true]);
    }
});
(0, testing_1.test)('looking at tests, building, installing or naming a runner in text is not a check', function () {
    for (var _i = 0, _a = [
        'ls tests',
        'cat test.txt',
        'grep -rn e2e src',
        'cat package.json | grep test',
        'echo npm test',
        'git commit -m "fixed the test"',
        'mkdir -p tests/unit',
        'npm run build',
        'npm install',
        'cargo build',
        'npm run testing',
        'tscx',
        'vitest-ui',
        'playwright show-report',
        'node tools/version.mjs',
        'node tools/checkout.mjs',
        'node tools/push.mjs origin main',
        'node tools/check_layers.ts',
        'node eslint-check.js',
        'node server.js',
        '',
    ]; _i < _a.length; _i++) {
        var command = _a[_i];
        (0, testing_1.expect)([command, (0, checkpoints_1.isTestCommand)(command)]).toEqual([command, false]);
    }
});
