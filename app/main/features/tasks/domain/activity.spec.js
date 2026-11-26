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
var vitest_1 = require("vitest");
var activity_1 = require("../../../../../hooks/shared/activity/domain/services/activity");
var step_limits_1 = require("../../../../../hooks/shared/activity/domain/constants/step_limits");
var record_source_1 = require("../../../../../hooks/shared/records/data/datasources/record_source");
var checkpoints_1 = require("../../../../../hooks/shared/checkpoints/domain/services/checkpoints");
var fixtures_1 = require("../api/fixtures");
var activity_source_1 = require("../data/activity_source");
var logger_1 = require("../../../core/logger");
var AT = '2026-11-04T12:00:00Z';
var END = '2026-11-04T12:01:00Z';
var step = function () { return (0, activity_1.toolStep)('Bash', { command: 'npm test' }, 'run-1', AT); };
var log = (0, logger_1.createLogger)('dev', function () { });
var ok = function (stdout) { return ({ exitCode: 0, stdout: stdout, stderr: '' }); };
(0, vitest_1.describe)('the step a task is on', function () {
    (0, vitest_1.it)('reads a stored step, keeping only its own fields, and drops a malformed one', function () {
        (0, vitest_1.expect)((0, activity_1.stepOf)(__assign(__assign({}, step()), { output: '24 passed', truncated: true }))).toEqual(step());
        for (var _i = 0, _a = [null, { steps: [] }, __assign(__assign({}, step()), { kind: 'unexpected' }), __assign(__assign({}, step()), { at: 'bad date' }), __assign(__assign({}, step()), { id: '' })]; _i < _a.length; _i++) {
            var bad = _a[_i];
            (0, vitest_1.expect)((0, activity_1.stepOf)(bad)).toBeNull();
        }
    });
    (0, vitest_1.it)('names the command by its first line, cut to the limit, and starts without claiming success', function () {
        (0, vitest_1.expect)(step()).toEqual({ id: 'run-1', at: AT, finished: null, kind: 'test', status: 'running', subject: 'npm test' });
        (0, vitest_1.expect)((0, activity_1.toolStep)('Bash', { command: "".concat('x'.repeat(step_limits_1.STEP_SUBJECT_LIMIT + 50), "\necho done") }, 'long', AT).subject).toHaveLength(step_limits_1.STEP_SUBJECT_LIMIT);
        (0, vitest_1.expect)((0, activity_1.toolStep)('Edit', { file_path: 'test/a.spec.ts' }, 'edit', AT)).toMatchObject({ kind: 'edit', subject: 'test/a.spec.ts' });
        (0, vitest_1.expect)((0, activity_1.toolStep)('Read', {}, 'read', AT)).toBeNull();
        (0, vitest_1.expect)((0, activity_1.toolStep)('Unknown', {}, 'other', AT)).toBeNull();
    });
    vitest_1.it.each([
        [{ result: { stdout: '24 passed', exitCode: 0 } }, 'succeeded'],
        [{ result: { stderr: '1 failed', exitCode: 1 } }, 'failed'],
        [{ result: { exit_code: 2 } }, 'failed'],
        [{ result: { interrupted: true } }, 'failed'],
        [{ isError: true }, 'failed'],
        [{ deny: 'Commits belong to you' }, 'blocked'],
    ])('records the actual outcome of %j, and none of its output', function (result, status) {
        var ended = (0, activity_1.finishStep)(step(), result, END);
        (0, vitest_1.expect)(ended).toMatchObject({ status: status, finished: END });
        (0, vitest_1.expect)(JSON.stringify(ended)).not.toMatch(/passed|1 failed|Commits belong/);
    });
    (0, vitest_1.it)('does not count a background launch as a passing check', function () {
        (0, vitest_1.expect)((0, activity_1.finishStep)(step(), { result: { stdout: 'Starting…', backgroundTaskId: 'bg-1' } }, END)).toMatchObject({ status: 'running', finished: null, backgroundId: 'bg-1' });
    });
    (0, vitest_1.it)('keeps one step: the newest replaces the last, and a task keeps no history', function () {
        var task = (0, fixtures_1.makeTask)({ id: 'one' });
        var finished = (0, activity_1.keepStep)((0, activity_1.keepStep)(task, step()), (0, activity_1.finishStep)(step(), { result: 'passed' }, END));
        (0, vitest_1.expect)(finished.step).toMatchObject({ id: 'run-1', status: 'succeeded' });
        var next = (0, activity_1.keepStep)(finished, (0, activity_1.toolStep)('Edit', { file_path: 'a.ts' }, 'edit', END));
        (0, vitest_1.expect)(next.step).toMatchObject({ id: 'edit', kind: 'edit' });
        (0, vitest_1.expect)(task.step).toBeUndefined();
        (0, vitest_1.expect)(Object.keys(next)).not.toContain('activity');
    });
    (0, vitest_1.it)('the later of two steps is the one started last', function () {
        var later = __assign(__assign({}, step()), { id: 'later', at: END });
        (0, vitest_1.expect)((0, activity_1.latestStep)(step(), later, null, undefined)).toBe(later);
        (0, vitest_1.expect)((0, activity_1.latestStep)(later, step())).toBe(later);
        (0, vitest_1.expect)((0, activity_1.latestStep)()).toBeNull();
    });
});
(0, vitest_1.describe)("an older record's step log", function () {
    var entry = function (id, at, extra) {
        if (extra === void 0) { extra = {}; }
        return (__assign(__assign(__assign({}, step()), { id: id, at: at, finished: at, status: 'succeeded', output: 'x'.repeat(8000), truncated: true }), extra));
    };
    (0, vitest_1.it)('leaves its latest step and the background checks still waiting, without output', function () {
        var _a;
        var old = (0, activity_1.fromOldLog)([entry('b', END, { kind: 'edit', subject: 'a.ts' }), entry('a', AT, { status: 'running', finished: null, backgroundId: 'bg-1' }), 'junk']);
        (0, vitest_1.expect)(old.step).toEqual({ id: 'b', at: END, finished: END, kind: 'edit', status: 'succeeded', subject: 'a.ts' });
        (0, vitest_1.expect)((_a = old.waiting) === null || _a === void 0 ? void 0 : _a.map(function (s) { return s.backgroundId; })).toEqual(['bg-1']);
        (0, vitest_1.expect)(JSON.stringify(old)).not.toContain('xxxx');
        (0, vitest_1.expect)((0, activity_1.fromOldLog)(undefined)).toEqual({});
    });
    (0, vitest_1.it)('is gone once the record is read, and a record of 300 long steps comes back small', function () {
        var _a;
        var steps = Array.from({ length: 300 }, function (_, i) { return entry("s-".concat(i), new Date(Date.parse(AT) + i * 1000).toISOString()); });
        var text = JSON.stringify({ version: 2, project: { name: 'p', path: '/p' }, docsLogPath: null, playNext: null, feature: null, tasks: [__assign(__assign({}, (0, fixtures_1.makeTask)({ id: 'one' })), { activity: steps })], unassignedMinutesByDay: {}, requests: [] });
        (0, vitest_1.expect)(text.length).toBeGreaterThan(2000000);
        var read = (0, record_source_1.parseRecord)(text);
        if (read === 'unreadable')
            throw new Error('unreadable');
        var saved = JSON.stringify(read, null, 2);
        (0, vitest_1.expect)(saved.length).toBeLessThan(10000);
        (0, vitest_1.expect)(saved).not.toContain('"activity"');
        (0, vitest_1.expect)((_a = read.tasks[0].step) === null || _a === void 0 ? void 0 : _a.id).toBe('s-299');
    });
});
(0, vitest_1.describe)('activity from local git', function () {
    var COMMIT = 'a'.repeat(40);
    var task = function () { return (0, fixtures_1.makeTask)({ id: 'one', branch: 'task/one', startCommit: 'b'.repeat(40), step: step() }); };
    var host = function () { return ({ run: vitest_1.vi.fn(function (argv) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, ok(argv[1] === 'log' ? "".concat(COMMIT, "\0").concat(END, "\0added task activity\n") : 'refs/remotes/origin/main\nrefs/remotes/origin/HEAD\n')];
        }); }); }) }); };
    (0, vitest_1.it)('reads the task branch, commit message, and containing remote refs without any mutation or network command', function () { return __awaiter(void 0, void 0, void 0, function () {
        var h, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    h = host();
                    return [4 /*yield*/, (0, activity_source_1.readActivity)(h, log, '/repo', task())];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.commits).toEqual([{ id: COMMIT, at: END, message: 'added task activity', remotes: ['origin/main'] }]);
                    (0, vitest_1.expect)(h.run.mock.calls.map(function (_a) {
                        var argv = _a[0];
                        return argv[1];
                    })).toEqual(['log', 'for-each-ref']);
                    (0, vitest_1.expect)(h.run.mock.calls[0][0]).toContain("".concat('b'.repeat(40), "..refs/heads/task/one"));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps the step when git fails', function () { return __awaiter(void 0, void 0, void 0, function () {
        var h, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    h = { run: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            throw new Error('folder moved');
                        }); }); }) };
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, activity_source_1.readActivity)(h, log, '/repo', task())];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toMatchObject({ step: step(), gitUnavailable: true });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('does not call unverified remote state a push or fail the rest of the history', function () { return __awaiter(void 0, void 0, void 0, function () {
        var h, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    h = host();
                    h.run.mockImplementation(function (argv) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, argv[1] === 'log' ? ok("".concat(COMMIT, "\0").concat(END, "\0message\n")) : { exitCode: 1, stdout: '', stderr: 'failed' }];
                    }); }); });
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, activity_source_1.readActivity)(h, log, '/repo', task())];
                case 1:
                    _a.apply(void 0, [(_b.sent()).commits[0].remotes]).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('handles an old task with no branch or step without invoking git, and shows no checkpoint commands as steps', function () { return __awaiter(void 0, void 0, void 0, function () {
        var h, command, old, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    h = host();
                    command = { command: 'npm test', isTest: true, isOk: true, at: END, summary: '24 passed' };
                    old = (0, fixtures_1.makeTask)({ id: 'old', checkpoint: __assign(__assign({}, (0, checkpoints_1.emptyCheckpoint)()), { seen: { at: END, files: [], git: null, commands: [command] } }) });
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, activity_source_1.readActivity)(h, log, '/repo', old)];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toEqual({ step: null, commits: [], gitUnavailable: false });
                    (0, vitest_1.expect)(h.run).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("a quest's testing time", function () {
    var span = function (at, finished) { return ({ start: Date.parse(at), end: Date.parse(finished) }); };
    (0, vitest_1.it)('a finished check adds its span once, though the step is saved twice', function () {
        var started = (0, activity_1.keepStep)((0, fixtures_1.makeTask)({ id: 'one' }), step());
        (0, vitest_1.expect)(started.testPeriods).toBeUndefined();
        var finished = (0, activity_1.keepStep)(started, (0, activity_1.finishStep)(step(), { result: { stdout: '1 failed', exitCode: 1 } }, END));
        var again = (0, activity_1.keepStep)(finished, (0, activity_1.finishStep)(step(), { result: { stdout: '1 failed', exitCode: 1 } }, END));
        (0, vitest_1.expect)(finished.testPeriods).toEqual([span(AT, END)]);
        (0, vitest_1.expect)(again.testPeriods).toEqual([span(AT, END)]);
    });
    (0, vitest_1.it)('two checks running at once count their time once', function () {
        var other = __assign({}, (0, activity_1.toolStep)('Bash', { command: 'npx vitest' }, 'run-2', '2026-11-04T12:00:30Z'));
        var task = (0, activity_1.keepStep)((0, fixtures_1.makeTask)({ id: 'one' }), (0, activity_1.finishStep)(step(), { result: 'passed' }, END));
        task = (0, activity_1.keepStep)(task, (0, activity_1.finishStep)(other, { result: 'passed' }, '2026-11-04T12:01:30Z'));
        (0, vitest_1.expect)(task.testPeriods).toEqual([span(AT, '2026-11-04T12:01:30Z')]);
    });
    (0, vitest_1.it)('a command or an edit adds no testing time', function () {
        var ls = (0, activity_1.toolStep)('Bash', { command: 'ls tests' }, 'ls', AT);
        var edit = (0, activity_1.toolStep)('Edit', { file_path: 'a.ts' }, 'edit', AT);
        var task = (0, activity_1.keepStep)((0, fixtures_1.makeTask)({ id: 'one' }), (0, activity_1.finishStep)(ls, { result: 'a.test.ts' }, END));
        task = (0, activity_1.keepStep)(task, (0, activity_1.finishStep)(edit, { result: 'ok' }, END));
        (0, vitest_1.expect)(ls.kind).toBe('command');
        (0, vitest_1.expect)(task.testPeriods).toBeUndefined();
    });
    (0, vitest_1.it)('the testing time outlives the step it came from', function () {
        var _a;
        var task = (0, activity_1.keepStep)((0, fixtures_1.makeTask)({ id: 'one' }), (0, activity_1.finishStep)(step(), { result: 'passed' }, END));
        task = (0, activity_1.keepStep)(task, (0, activity_1.toolStep)('Bash', { command: 'ls' }, 'ls', END));
        (0, vitest_1.expect)((_a = task.step) === null || _a === void 0 ? void 0 : _a.id).toBe('ls');
        (0, vitest_1.expect)(task.testPeriods).toEqual([span(AT, END)]);
    });
});
(0, vitest_1.describe)('a background shell ending by notification', function () {
    var note = function (id, status, summary) {
        return "<task-notification>\n<task-id>".concat(id, "</task-id>\n<tool-use-id>toolu_1</tool-use-id>\n<output-file>/tmp/").concat(id, ".output</output-file>\n<status>").concat(status, "</status>\n<summary>").concat(summary, "</summary>\n</task-notification>");
    };
    var PASSED = 'Background command "Run the tests" completed (exit code 0)';
    (0, vitest_1.it)('a completed run with exit code 0 is a pass', function () {
        (0, vitest_1.expect)((0, activity_1.notifiedEnds)(note('bg-1', 'completed', PASSED))).toEqual([{ id: 'bg-1', isOk: true }]);
    });
    vitest_1.it.each([
        ['failed', 'Background command "Run the tests" failed with exit code 1'],
        ['killed', 'Background command "Run the tests" was stopped'],
        ['completed', 'Background command "Run the tests" completed (exit code 2)'],
        ['completed', 'Background command "Run the tests" completed (exit code 10)'],
    ])('a %s run reading "%s" is a failure', function (status, summary) {
        (0, vitest_1.expect)((0, activity_1.notifiedEnds)(note('bg-1', status, summary))).toEqual([{ id: 'bg-1', isOk: false }]);
    });
    (0, vitest_1.it)('one delivery with two blocks gives both ends, in order', function () {
        var text = "".concat(note('bg-1', 'completed', PASSED), "\nThe other one:\n").concat(note('bg-2', 'failed', 'failed with exit code 1'));
        (0, vitest_1.expect)((0, activity_1.notifiedEnds)(text).map(function (end) { return [end.id, end.isOk]; })).toEqual([['bg-1', true], ['bg-2', false]]);
    });
    (0, vitest_1.it)('a block with no status, an unknown status or no id, and plain text, end nothing', function () {
        var monitor = '<task-notification>\n<task-id>mon-1</task-id>\n<event>build finished</event>\n</task-notification>';
        (0, vitest_1.expect)((0, activity_1.notifiedEnds)(monitor)).toEqual([]);
        (0, vitest_1.expect)((0, activity_1.notifiedEnds)(note('bg-1', 'running', 'still going'))).toEqual([]);
        (0, vitest_1.expect)((0, activity_1.notifiedEnds)(note('', 'completed', PASSED))).toEqual([]);
        (0, vitest_1.expect)((0, activity_1.notifiedEnds)('the tests completed (exit code 0)')).toEqual([]);
        (0, vitest_1.expect)((0, activity_1.notifiedEnds)('')).toEqual([]);
    });
    var launched = function (id, command) {
        if (command === void 0) { command = 'npm test'; }
        return (0, activity_1.finishStep)((0, activity_1.toolStep)('Bash', { command: command }, "run-".concat(id), AT), { result: { stdout: 'Starting…', backgroundTaskId: id } }, AT);
    };
    var ended = function (id, isOk) {
        if (isOk === void 0) { isOk = true; }
        return [{ id: id, isOk: isOk }];
    };
    (0, vitest_1.it)('ends only the waiting step with that id; the line stays on the step started last', function () {
        var _a, _b;
        var task = (0, activity_1.keepStep)((0, activity_1.keepStep)((0, fixtures_1.makeTask)({ id: 'one' }), launched('bg-1')), launched('bg-2'));
        (0, vitest_1.expect)((_a = task.waiting) === null || _a === void 0 ? void 0 : _a.map(function (s) { return s.backgroundId; })).toEqual(['bg-1', 'bg-2']);
        var after = (0, activity_1.finishNotified)(task, ended('bg-1'), END);
        (0, vitest_1.expect)((_b = after.waiting) === null || _b === void 0 ? void 0 : _b.map(function (s) { return s.backgroundId; })).toEqual(['bg-2']);
        (0, vitest_1.expect)(after.step).toMatchObject({ id: 'run-bg-2', status: 'running' });
        var last = (0, activity_1.finishNotified)(after, ended('bg-2', false), END);
        (0, vitest_1.expect)(last.step).toMatchObject({ id: 'run-bg-2', status: 'failed', finished: END });
        (0, vitest_1.expect)(last.waiting).toBeUndefined();
    });
    (0, vitest_1.it)('a step GetTask already ended stays as it is, and the same task comes back', function () {
        var done = (0, activity_1.keepStep)((0, activity_1.keepStep)((0, fixtures_1.makeTask)({ id: 'one' }), launched('bg-1')), (0, activity_1.finishStep)(launched('bg-1'), { result: '12 passed' }, END));
        (0, vitest_1.expect)(done.waiting).toBeUndefined();
        (0, vitest_1.expect)((0, activity_1.finishNotified)(done, ended('bg-1', false), '2026-11-04T12:05:00Z')).toBe(done);
        (0, vitest_1.expect)(done.step).toMatchObject({ status: 'succeeded', finished: END });
    });
    (0, vitest_1.it)('with nothing to end, the same task comes back', function () {
        var task = (0, activity_1.keepStep)((0, fixtures_1.makeTask)({ id: 'one' }), launched('bg-1'));
        var empty = (0, fixtures_1.makeTask)({ id: 'two' });
        (0, vitest_1.expect)((0, activity_1.finishNotified)(task, ended('bg-9'), END)).toBe(task);
        (0, vitest_1.expect)((0, activity_1.finishNotified)(task, [], END)).toBe(task);
        (0, vitest_1.expect)((0, activity_1.finishNotified)(empty, ended('bg-1'), END)).toBe(empty);
    });
    (0, vitest_1.it)('waits on at most the limit of background shells, the newest', function () {
        var task = (0, fixtures_1.makeTask)({ id: 'one' });
        for (var i = 0; i <= step_limits_1.WAITING_LIMIT; i++)
            task = (0, activity_1.keepStep)(task, launched("bg-".concat(i)));
        (0, vitest_1.expect)(task.waiting).toHaveLength(step_limits_1.WAITING_LIMIT);
        (0, vitest_1.expect)(task.waiting[0].backgroundId).toBe('bg-1');
    });
    (0, vitest_1.it)("a check's span joins the testing time; a command's adds none", function () {
        var check = (0, activity_1.finishNotified)((0, activity_1.keepStep)((0, fixtures_1.makeTask)({ id: 'one' }), launched('bg-1')), ended('bg-1', false), END);
        var server = (0, activity_1.finishNotified)((0, activity_1.keepStep)((0, fixtures_1.makeTask)({ id: 'two' }), launched('bg-2', 'npm run dev')), ended('bg-2'), END);
        (0, vitest_1.expect)(check.testPeriods).toEqual([{ start: Date.parse(AT), end: Date.parse(END) }]);
        (0, vitest_1.expect)(server.step).toMatchObject({ kind: 'command', status: 'succeeded' });
        (0, vitest_1.expect)(server.testPeriods).toBeUndefined();
    });
});
