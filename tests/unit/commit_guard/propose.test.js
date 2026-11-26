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
var live_1 = require("../../../hooks/core/session/live");
var commit_proposal_1 = require("../../../hooks/features/commit_guard/domain/services/commit_proposal");
var propose_commit_1 = require("../../../hooks/features/commit_guard/domain/usecases/propose_commit");
var commit_guard_text_1 = require("../../../hooks/features/commit_guard/presentation/constants/commit_guard_text");
var commit_guard_controller_1 = require("../../../hooks/features/commit_guard/presentation/state_management/commit_guard_controller");
var git_repository_impl_1 = require("../../../hooks/shared/git/data/repositories/git_repository_impl");
var record_source_1 = require("../../../hooks/shared/records/data/datasources/record_source");
var records_repository_impl_1 = require("../../../hooks/shared/records/data/repositories/records_repository_impl");
var helpers_1 = require("../../helpers");
var HEAD = '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b';
var AT = '2026-10-21T09:12:00+02:00';
var GIT = { 'git rev-parse HEAD': { stdout: "".concat(HEAD, "\n") }, 'git symbolic-ref --short -q HEAD': { stdout: 'task/x\n' } };
var stored = function (mem) { return JSON.parse(mem.files.get(helpers_1.CTX.file)); };
var ok = { message: 'fixed the retry button', files: ['src/retry.ts'] };
// ── What Claude may propose ──
(0, testing_1.test)('a proposal keeps its files and its message, trimmed', function () {
    (0, testing_1.expect)((0, commit_proposal_1.checkProposal)({ message: '  fixed the retry button\n\nWhy it broke.\n', files: ['src/retry.ts', 'tests/retry.test.ts'] })).toEqual({
        message: 'fixed the retry button\n\nWhy it broke.',
        files: ['src/retry.ts', 'tests/retry.test.ts'],
    });
});
(0, testing_1.test)('a file named twice is proposed once, in the order first given', function () {
    (0, testing_1.expect)((0, commit_proposal_1.checkProposal)({ message: 'x', files: ['b.ts', 'a.ts', 'b.ts', 'a.ts'] })).toEqual({ message: 'x', files: ['b.ts', 'a.ts'] });
});
(0, testing_1.test)('no input, or a message that is missing, not text or blank, is a message problem', function () {
    for (var _i = 0, _a = [null, undefined, 'fixed x', {}, { files: ['a.ts'] }, { message: 42, files: ['a.ts'] }, { message: '', files: ['a.ts'] }, { message: ' \n\t ', files: ['a.ts'] }]; _i < _a.length; _i++) {
        var input = _a[_i];
        (0, testing_1.expect)([input, (0, commit_proposal_1.checkProposal)(input)]).toEqual([input, 'message']);
    }
});
(0, testing_1.test)('a message of 2,000 characters is taken, one more is not', function () {
    (0, testing_1.expect)(commit_proposal_1.PROPOSAL_LIMITS.message).toBe(2000);
    (0, testing_1.expect)((0, commit_proposal_1.checkProposal)({ message: 'x'.repeat(2000), files: ['a.ts'] })).toEqual({ message: 'x'.repeat(2000), files: ['a.ts'] });
    (0, testing_1.expect)((0, commit_proposal_1.checkProposal)({ message: 'x'.repeat(2001), files: ['a.ts'] })).toBe('message');
});
(0, testing_1.test)('the length is measured after trimming, so 2,000 characters with space around them are taken', function () {
    (0, testing_1.expect)((0, commit_proposal_1.checkProposal)({ message: 'x'.repeat(2000) + '\n', files: ['a.ts'] })).toEqual({ message: 'x'.repeat(2000), files: ['a.ts'] });
    (0, testing_1.expect)((0, commit_proposal_1.checkProposal)({ message: "  \n".concat('x'.repeat(2000), "\n\n"), files: ['a.ts'] })).toEqual({ message: 'x'.repeat(2000), files: ['a.ts'] });
    (0, testing_1.expect)((0, commit_proposal_1.checkProposal)({ message: "  ".concat('x'.repeat(2001), "\n"), files: ['a.ts'] })).toBe('message');
});
(0, testing_1.test)('a message with a NUL in it is a message problem', function () {
    (0, testing_1.expect)((0, commit_proposal_1.checkProposal)({ message: 'fixed\0x', files: ['a.ts'] })).toBe('message');
});
(0, testing_1.test)('files that are not a list, an empty list or more than 500 are a files problem', function () {
    var many = function (n) { return Array.from({ length: n }, function (_, i) { return "src/f".concat(i, ".ts"); }); };
    for (var _i = 0, _a = [undefined, 'a.ts', { 0: 'a.ts' }, []]; _i < _a.length; _i++) {
        var files = _a[_i];
        (0, testing_1.expect)([files, (0, commit_proposal_1.checkProposal)({ message: 'x', files: files })]).toEqual([files, 'files']);
    }
    (0, testing_1.expect)(commit_proposal_1.PROPOSAL_LIMITS.files).toBe(500);
    (0, testing_1.expect)((0, commit_proposal_1.checkProposal)({ message: 'x', files: many(500) })).toEqual({ message: 'x', files: many(500) });
    (0, testing_1.expect)((0, commit_proposal_1.checkProposal)({ message: 'x', files: many(501) })).toBe('files');
});
(0, testing_1.test)('a path that is not a plain path from the top of the repository is a path problem', function () {
    var bad = [
        3,
        null,
        '',
        ' a.ts',
        'a.ts ',
        'a\0.ts',
        '/etc/passwd',
        '..',
        '../outside.ts',
        'src/../../outside.ts',
        'src/..',
        'x'.repeat(1025),
    ];
    for (var _i = 0, bad_1 = bad; _i < bad_1.length; _i++) {
        var path = bad_1[_i];
        (0, testing_1.expect)([path, (0, commit_proposal_1.checkProposal)({ message: 'x', files: ['ok.ts', path] })]).toEqual([path, 'path']);
    }
});
(0, testing_1.test)('dots inside a name, dot folders and a path of 1,024 characters are fine', function () {
    var good = ['a..b.ts', '.github/workflows/ci.yml', 'docs/.hidden', 'x'.repeat(1024), 'dir with spaces/ü.ts'];
    (0, testing_1.expect)(commit_proposal_1.PROPOSAL_LIMITS.path).toBe(1024);
    (0, testing_1.expect)((0, commit_proposal_1.checkProposal)({ message: 'x', files: good })).toEqual({ message: 'x', files: good });
});
(0, testing_1.test)('the message is checked before the files, and the count of files before each path', function () {
    (0, testing_1.expect)((0, commit_proposal_1.checkProposal)({ message: '', files: [] })).toBe('message');
    (0, testing_1.expect)((0, commit_proposal_1.checkProposal)({ message: 'x', files: Array.from({ length: 501 }, function () { return '/abs'; }) })).toBe('files');
});
// ── Never crediting Claude ──
var CREDITING = [
    'fixed x\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>',
    'fixed x\n\nco-authored-by: claude <someone@example.com>',
    'fixed x\n\n  CO-AUTHORED-BY: The Anthropic bot <bot@example.com>',
    'fixed x\n\nCo-Authored-By: Rohan <r@example.com>\nCo-Authored-By: Claude <c@example.com>',
    'fixed x\n\nSigned-off-by: bot <noreply@anthropic.com>',
    'fixed x\n\nGenerated with Claude Code',
    'fixed x\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)',
    'fixed x\n\ngenerated by claude',
    'Generated with Claude Code',
    'fixed x\n\n- Generated with Claude Code',
    'fixed x\n\n  generated by Claude',
    'fixed x\n\nProposed by Claude.',
    'fixed x (written with Claude)',
    'fixed x\n\nDrafted by Claude',
    'fixed x\n\nauthored by claude',
    'fixed x\n\nCreated with Claude',
    'fixed x\n\nMade with Claude',
    'fixed x\n\nSuggested by Claude',
    'fixed x\n\nPrepared by Claude',
    'fixed x 🤖',
];
var NAMING = [
    'added Codex in place of Claude Code for the quest',
    "fixed the Claude Code session's time",
    'ask Claude to look at each file',
    'added Claude Code session probe',
    'fixed x\n\nCo-Authored-By: Rohan <r@example.com>',
    'added the anthropic logo to the helper bench',
    'fixed the task titles generated by Claude',
    'fixed x\n\nThe task titles generated with Claude now keep their accents.',
];
(0, testing_1.test)('every way of crediting Claude is caught', function () {
    for (var _i = 0, CREDITING_1 = CREDITING; _i < CREDITING_1.length; _i++) {
        var message = CREDITING_1[_i];
        (0, testing_1.expect)([message, (0, commit_proposal_1.creditsClaude)(message)]).toEqual([message, true]);
        (0, testing_1.expect)([message, (0, commit_proposal_1.checkProposal)({ message: message, files: ['a.ts'] })]).toEqual([message, 'credit']);
    }
});
(0, testing_1.test)('a message that only names Claude Code as a feature is not a credit', function () {
    for (var _i = 0, NAMING_1 = NAMING; _i < NAMING_1.length; _i++) {
        var message = NAMING_1[_i];
        (0, testing_1.expect)([message, (0, commit_proposal_1.creditsClaude)(message)]).toEqual([message, false]);
        (0, testing_1.expect)([message, (0, commit_proposal_1.checkProposal)({ message: message, files: ['a.ts'] })]).toEqual([message, { message: message, files: ['a.ts'] }]);
    }
});
(0, testing_1.test)('a credit is named before any problem with the files', function () {
    (0, testing_1.expect)((0, commit_proposal_1.checkProposal)({ message: 'fixed x\n\nGenerated with Claude Code', files: [] })).toBe('credit');
    (0, testing_1.expect)((0, commit_proposal_1.checkProposal)({ message: 'fixed x\n\nGenerated with Claude Code', files: ['/abs'] })).toBe('credit');
});
// ── Saving the proposal ──
var useCaseWith = function (tasks, over, git) {
    var _a;
    if (over === void 0) { over = {}; }
    if (git === void 0) { git = GIT; }
    var mem = (0, helpers_1.memoryHost)({ files: (_a = {}, _a[helpers_1.CTX.file] = JSON.stringify(__assign(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: tasks }), over)), _a), git: git });
    return { mem: mem, deps: { records: (0, records_repository_impl_1.recordsRepositoryImpl)(mem.host, helpers_1.CTX), git: (0, git_repository_impl_1.gitRepositoryImpl)(mem.host, helpers_1.CTX.cwd) } };
};
(0, testing_1.test)('a proposal is saved on the current task with the commit it was made on and when', function () { return __awaiter(void 0, void 0, void 0, function () {
    var current, other, _a, mem, deps, proposed, proposal;
    var _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                current = (0, helpers_1.makeTask)({ state: 'current' });
                other = (0, helpers_1.makeTask)({ state: 'queued' });
                _a = useCaseWith([current, other]), mem = _a.mem, deps = _a.deps;
                return [4 /*yield*/, (0, propose_commit_1.proposeCommitUseCase)(deps, current.id, ok, AT)];
            case 1:
                proposed = _e.sent();
                proposal = { message: ok.message, files: ok.files, head: HEAD, at: AT };
                (0, testing_1.expect)(proposed.kind).toBe('saved');
                (0, testing_1.expect)(proposed.kind === 'saved' && ((_b = proposed.record.tasks.find(function (t) { return t.id === current.id; })) === null || _b === void 0 ? void 0 : _b.commitProposal)).toEqual(proposal);
                (0, testing_1.expect)((_c = stored(mem).tasks.find(function (t) { return t.id === current.id; })) === null || _c === void 0 ? void 0 : _c.commitProposal).toEqual(proposal);
                (0, testing_1.expect)((_d = stored(mem).tasks.find(function (t) { return t.id === other.id; })) === null || _d === void 0 ? void 0 : _d.commitProposal).toBeUndefined();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a new proposal replaces the last one', function () { return __awaiter(void 0, void 0, void 0, function () {
    var current, _a, mem, deps;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                current = (0, helpers_1.makeTask)({ state: 'current', commitProposal: { message: 'old', files: ['old.ts'], head: 'f'.repeat(40), at: '2026-10-20T09:00:00+02:00' } });
                _a = useCaseWith([current]), mem = _a.mem, deps = _a.deps;
                return [4 /*yield*/, (0, propose_commit_1.proposeCommitUseCase)(deps, current.id, ok, AT)];
            case 1:
                _c.sent();
                (0, testing_1.expect)((_b = stored(mem).tasks[0]) === null || _b === void 0 ? void 0 : _b.commitProposal).toEqual({ message: ok.message, files: ok.files, head: HEAD, at: AT });
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('in a Manual realm nothing is saved', function () { return __awaiter(void 0, void 0, void 0, function () {
    var current, _a, mem, deps, before, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                current = (0, helpers_1.makeTask)({ state: 'current' });
                _a = useCaseWith([current], { gitMode: 'manual' }), mem = _a.mem, deps = _a.deps;
                before = stored(mem);
                _b = testing_1.expect;
                return [4 /*yield*/, (0, propose_commit_1.proposeCommitUseCase)(deps, current.id, ok, AT)];
            case 1:
                _b.apply(void 0, [_c.sent()]).toEqual({ kind: 'manual' });
                (0, testing_1.expect)(stored(mem)).toEqual(before);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a task that is no longer current gets no proposal', function () { return __awaiter(void 0, void 0, void 0, function () {
    var finished, _a, mem, deps, before, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                finished = (0, helpers_1.makeTask)({ state: 'done' });
                _a = useCaseWith([finished]), mem = _a.mem, deps = _a.deps;
                before = stored(mem);
                _b = testing_1.expect;
                return [4 /*yield*/, (0, propose_commit_1.proposeCommitUseCase)(deps, finished.id, ok, AT)];
            case 1:
                _b.apply(void 0, [_d.sent()]).toEqual({ kind: 'notCurrent' });
                _c = testing_1.expect;
                return [4 /*yield*/, (0, propose_commit_1.proposeCommitUseCase)(deps, 't-gone', ok, AT)];
            case 2:
                _c.apply(void 0, [_d.sent()]).toEqual({ kind: 'notCurrent' });
                (0, testing_1.expect)(stored(mem)).toEqual(before);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('with no commit to read, nothing is saved', function () { return __awaiter(void 0, void 0, void 0, function () {
    var current, _a, mem, deps, before, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                current = (0, helpers_1.makeTask)({ state: 'current' });
                _a = useCaseWith([current], {}, {}), mem = _a.mem, deps = _a.deps;
                before = mem.files.get(helpers_1.CTX.file);
                _b = testing_1.expect;
                return [4 /*yield*/, (0, propose_commit_1.proposeCommitUseCase)(deps, current.id, ok, AT)];
            case 1:
                _b.apply(void 0, [_c.sent()]).toEqual({ kind: 'noHead' });
                (0, testing_1.expect)(mem.files.get(helpers_1.CTX.file)).toBe(before);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('an unreadable record is left as it is', function () { return __awaiter(void 0, void 0, void 0, function () {
    var mem, deps, _a;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                mem = (0, helpers_1.memoryHost)({ files: (_b = {}, _b[helpers_1.CTX.file] = '{bad', _b), git: GIT });
                deps = { records: (0, records_repository_impl_1.recordsRepositoryImpl)(mem.host, helpers_1.CTX), git: (0, git_repository_impl_1.gitRepositoryImpl)(mem.host, helpers_1.CTX.cwd) };
                _a = testing_1.expect;
                return [4 /*yield*/, (0, propose_commit_1.proposeCommitUseCase)(deps, 't-1', ok, AT)];
            case 1:
                _a.apply(void 0, [_c.sent()]).toEqual({ kind: 'unreadable' });
                (0, testing_1.expect)(mem.files.get(helpers_1.CTX.file)).toBe('{bad');
                return [2 /*return*/];
        }
    });
}); });
// ── The propose_commit tool ──
var toolWith = function (tasks, over) {
    var _a;
    if (over === void 0) { over = {}; }
    live_1.live.ctx = helpers_1.CTX;
    var record = __assign(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: tasks }), over);
    var mem = (0, helpers_1.memoryHost)({ files: (_a = {}, _a[helpers_1.CTX.file] = JSON.stringify(record), _a), git: GIT });
    return __assign({ mem: mem }, (0, helpers_1.fakePorts)(mem, { view: { record: record } }));
};
(0, testing_1.test)('with no current task the tool says there is nothing to propose for', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, mem, ports, before, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = toolWith([(0, helpers_1.makeTask)({ state: 'queued' })]), mem = _a.mem, ports = _a.ports;
                before = mem.files.get(helpers_1.CTX.file);
                _b = testing_1.expect;
                return [4 /*yield*/, (0, commit_guard_controller_1.proposeCommit)(ports, ok)];
            case 1:
                _b.apply(void 0, [_c.sent()]).toBe(commit_guard_text_1.PROPOSAL_TEXT.noTask);
                (0, testing_1.expect)(mem.files.get(helpers_1.CTX.file)).toBe(before);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a task current in another checkout is not this session’s to propose for', function () { return __awaiter(void 0, void 0, void 0, function () {
    var ports, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                ports = toolWith([(0, helpers_1.makeTask)({ state: 'current', worktreePath: '/elsewhere' })]).ports;
                _a = testing_1.expect;
                return [4 /*yield*/, (0, commit_guard_controller_1.proposeCommit)(ports, ok)];
            case 1:
                _a.apply(void 0, [_b.sent()]).toBe(commit_guard_text_1.PROPOSAL_TEXT.noTask);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('with no session context or no record the tool has nothing to propose for', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, ports, view, _b, second, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = toolWith([(0, helpers_1.makeTask)({ state: 'current' })]), ports = _a.ports, view = _a.view;
                view.record = null;
                _b = testing_1.expect;
                return [4 /*yield*/, (0, commit_guard_controller_1.proposeCommit)(ports, ok)];
            case 1:
                _b.apply(void 0, [_d.sent()]).toBe(commit_guard_text_1.PROPOSAL_TEXT.noTask);
                second = toolWith([(0, helpers_1.makeTask)({ state: 'current' })]);
                live_1.live.ctx = null;
                _c = testing_1.expect;
                return [4 /*yield*/, (0, commit_guard_controller_1.proposeCommit)(second.ports, ok)];
            case 2:
                _c.apply(void 0, [_d.sent()]).toBe(commit_guard_text_1.PROPOSAL_TEXT.noTask);
                (0, testing_1.expect)(second.mem.writes).toEqual([]);
                live_1.live.ctx = helpers_1.CTX;
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a bad proposal gets the words for what is wrong, and nothing is saved', function () { return __awaiter(void 0, void 0, void 0, function () {
    var cases, _i, cases_1, _a, input, answer, _b, mem, ports, view, before, _c, _d;
    var _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                cases = [
                    [{ files: ['a.ts'] }, commit_guard_text_1.PROPOSAL_TEXT.problems.message],
                    [{ message: 'x', files: [] }, commit_guard_text_1.PROPOSAL_TEXT.problems.files],
                    [{ message: 'x', files: ['/etc/passwd'] }, commit_guard_text_1.PROPOSAL_TEXT.problems.path],
                    [{ message: 'fixed x\n\nCo-Authored-By: Claude <noreply@anthropic.com>', files: ['a.ts'] }, commit_guard_text_1.PROPOSAL_TEXT.problems.credit],
                ];
                _i = 0, cases_1 = cases;
                _g.label = 1;
            case 1:
                if (!(_i < cases_1.length)) return [3 /*break*/, 4];
                _a = cases_1[_i], input = _a[0], answer = _a[1];
                _b = toolWith([(0, helpers_1.makeTask)({ state: 'current' })]), mem = _b.mem, ports = _b.ports, view = _b.view;
                before = mem.files.get(helpers_1.CTX.file);
                _c = testing_1.expect;
                _d = [input];
                return [4 /*yield*/, (0, commit_guard_controller_1.proposeCommit)(ports, input)];
            case 2:
                _c.apply(void 0, [_d.concat([_g.sent()])]).toEqual([input, answer]);
                (0, testing_1.expect)(mem.files.get(helpers_1.CTX.file)).toBe(before);
                (0, testing_1.expect)((_f = (_e = view.record) === null || _e === void 0 ? void 0 : _e.tasks[0]) === null || _f === void 0 ? void 0 : _f.commitProposal).toBeUndefined();
                _g.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a saved proposal says how many files it holds, and the view follows the record', function () { return __awaiter(void 0, void 0, void 0, function () {
    var current, _a, mem, ports, view, _b, proposal;
    var _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                current = (0, helpers_1.makeTask)({ state: 'current' });
                _a = toolWith([current]), mem = _a.mem, ports = _a.ports, view = _a.view;
                _b = testing_1.expect;
                return [4 /*yield*/, (0, commit_guard_controller_1.proposeCommit)(ports, { message: ' fixed x ', files: ['a.ts', 'b.ts', 'a.ts'] })];
            case 1:
                _b.apply(void 0, [_f.sent()]).toBe(commit_guard_text_1.PROPOSAL_TEXT.saved(2));
                proposal = { message: 'fixed x', files: ['a.ts', 'b.ts'], head: HEAD, at: AT };
                (0, testing_1.expect)((_c = stored(mem).tasks[0]) === null || _c === void 0 ? void 0 : _c.commitProposal).toEqual(proposal);
                (0, testing_1.expect)((_e = (_d = view.record) === null || _d === void 0 ? void 0 : _d.tasks[0]) === null || _e === void 0 ? void 0 : _e.commitProposal).toEqual(proposal);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('the saved answer counts one file as one file', function () { return __awaiter(void 0, void 0, void 0, function () {
    var ports, answer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ports = toolWith([(0, helpers_1.makeTask)({ state: 'current' })]).ports;
                return [4 /*yield*/, (0, commit_guard_controller_1.proposeCommit)(ports, ok)];
            case 1:
                answer = _a.sent();
                (0, testing_1.expect)(answer).toBe(commit_guard_text_1.PROPOSAL_TEXT.saved(1));
                (0, testing_1.expect)(answer).toContain('commit of 1 file,');
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('the tool refuses in a Manual realm and saves nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, mem, ports, before, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = toolWith([(0, helpers_1.makeTask)({ state: 'current' })], { gitMode: 'manual' }), mem = _a.mem, ports = _a.ports;
                before = stored(mem);
                _b = testing_1.expect;
                return [4 /*yield*/, (0, commit_guard_controller_1.proposeCommit)(ports, ok)];
            case 1:
                _b.apply(void 0, [_c.sent()]).toBe(commit_guard_text_1.PROPOSAL_TEXT.manual);
                (0, testing_1.expect)(stored(mem)).toEqual(before);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('the mode is read from the record on disk: switched to Manual in the app, the tool refuses', function () { return __awaiter(void 0, void 0, void 0, function () {
    var current, _a, mem, ports, _b;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                current = (0, helpers_1.makeTask)({ state: 'current' });
                _a = toolWith([current]), mem = _a.mem, ports = _a.ports;
                // The app wrote Manual after this session last read the record.
                mem.files.set(helpers_1.CTX.file, JSON.stringify(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: [current], gitMode: 'manual' })));
                _b = testing_1.expect;
                return [4 /*yield*/, (0, commit_guard_controller_1.proposeCommit)(ports, ok)];
            case 1:
                _b.apply(void 0, [_d.sent()]).toBe(commit_guard_text_1.PROPOSAL_TEXT.manual);
                (0, testing_1.expect)((_c = stored(mem).tasks[0]) === null || _c === void 0 ? void 0 : _c.commitProposal).toBeUndefined();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a task finished in the app meanwhile gets no proposal', function () { return __awaiter(void 0, void 0, void 0, function () {
    var current, _a, mem, ports, _b;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                current = (0, helpers_1.makeTask)({ state: 'current' });
                _a = toolWith([current]), mem = _a.mem, ports = _a.ports;
                mem.files.set(helpers_1.CTX.file, JSON.stringify(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: [__assign(__assign({}, current), { state: 'done' })] })));
                _b = testing_1.expect;
                return [4 /*yield*/, (0, commit_guard_controller_1.proposeCommit)(ports, ok)];
            case 1:
                _b.apply(void 0, [_d.sent()]).toBe(commit_guard_text_1.PROPOSAL_TEXT.notCurrent);
                (0, testing_1.expect)((_c = stored(mem).tasks[0]) === null || _c === void 0 ? void 0 : _c.commitProposal).toBeUndefined();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('with no commit to read the tool says so', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, mem, ports, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = toolWith([(0, helpers_1.makeTask)({ state: 'current' })]), mem = _a.mem, ports = _a.ports;
                delete mem.git['git rev-parse HEAD'];
                _b = testing_1.expect;
                return [4 /*yield*/, (0, commit_guard_controller_1.proposeCommit)(ports, ok)];
            case 1:
                _b.apply(void 0, [_c.sent()]).toBe(commit_guard_text_1.PROPOSAL_TEXT.noHead);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('an unreadable record on disk is named, and left alone', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, mem, ports, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = toolWith([(0, helpers_1.makeTask)({ state: 'current' })]), mem = _a.mem, ports = _a.ports;
                mem.files.set(helpers_1.CTX.file, '{bad');
                _b = testing_1.expect;
                return [4 /*yield*/, (0, commit_guard_controller_1.proposeCommit)(ports, ok)];
            case 1:
                _b.apply(void 0, [_c.sent()]).toBe(commit_guard_text_1.PROPOSAL_TEXT.unreadable);
                (0, testing_1.expect)(mem.files.get(helpers_1.CTX.file)).toBe('{bad');
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('when git or the disk throws, the tool answers that saving failed and never throws', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, ports, mem, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = toolWith([(0, helpers_1.makeTask)({ state: 'current' })]), ports = _a.ports, mem = _a.mem;
                mem.host.run = function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        throw new Error('spawn git ENOENT');
                    });
                }); };
                _b = testing_1.expect;
                return [4 /*yield*/, (0, commit_guard_controller_1.proposeCommit)(ports, ok)];
            case 1:
                _b.apply(void 0, [_c.sent()]).toBe(commit_guard_text_1.PROPOSAL_TEXT.failed);
                return [2 /*return*/];
        }
    });
}); });
// ── The guard's words ──
(0, testing_1.test)('with no record the guard uses the plain refusal', function () {
    (0, testing_1.expect)((0, commit_guard_controller_1.guardText)(null)).toBe(commit_guard_text_1.GUARD_TEXT.manual);
});
(0, testing_1.test)('a record made before Git modes gets the Assisted refusal, which names propose_commit', function () {
    (0, testing_1.expect)((0, commit_guard_controller_1.guardText)((0, record_source_1.emptyRecord)('p', '/p'))).toBe(commit_guard_text_1.GUARD_TEXT.assisted);
    (0, testing_1.expect)(commit_guard_text_1.GUARD_TEXT.assisted).toContain('propose_commit');
});
(0, testing_1.test)('a Manual realm gets the plain refusal, an Assisted one the propose_commit one', function () {
    (0, testing_1.expect)((0, commit_guard_controller_1.guardText)(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { gitMode: 'manual' }))).toBe(commit_guard_text_1.GUARD_TEXT.manual);
    (0, testing_1.expect)((0, commit_guard_controller_1.guardText)(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { gitMode: 'assisted' }))).toBe(commit_guard_text_1.GUARD_TEXT.assisted);
    (0, testing_1.expect)(commit_guard_text_1.GUARD_TEXT.manual).not.toContain('propose_commit');
});
