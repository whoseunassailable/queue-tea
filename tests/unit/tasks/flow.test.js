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
var filing_controller_1 = require("../../../hooks/features/tasks/presentation/state_management/filing_controller");
var tasks_controller_1 = require("../../../hooks/features/tasks/presentation/state_management/tasks_controller");
var checkpoints_1 = require("../../../hooks/shared/checkpoints/domain/services/checkpoints");
var message_check_controller_1 = require("../../../hooks/features/message_check/presentation/state_management/message_check_controller");
var check_prompt_1 = require("../../../hooks/features/message_check/domain/services/check_prompt");
var record_source_1 = require("../../../hooks/shared/records/data/datasources/record_source");
var tasks_text_1 = require("../../../hooks/features/tasks/presentation/constants/tasks_text");
var task_rules_1 = require("../../../hooks/features/tasks/domain/services/task_rules");
var live_1 = require("../../../hooks/core/session/live");
var helpers_1 = require("../../helpers");
var OID = '# branch.oid 1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b';
var CLEAN = [OID, '# branch.head main', '# branch.upstream origin/main', '# branch.ab +0 -0', ''].join('\n');
var DIRTY = [
    OID,
    '# branch.head main',
    '# branch.upstream origin/main',
    '# branch.ab +2 -0',
    '1 .M N... 100644 100644 100644 a b x.ts',
    '1 .M N... 100644 100644 100644 a b y.ts',
    '? z.ts',
    '',
].join('\n');
var gitWith = function (status, more) {
    if (more === void 0) { more = {}; }
    return (__assign({ 'git rev-parse --is-inside-work-tree': { stdout: 'true\n' }, 'git status --porcelain=v2 --branch': { stdout: status }, 'git branch --format=%(refname:short)': { stdout: 'main\n' }, 'git switch -c task/dark-mode': {} }, more));
};
var stored = function (mem) { return JSON.parse(mem.files.get(helpers_1.CTX.file)); };
var withRecord = function (r) {
    var _a;
    return (_a = {}, _a[helpers_1.CTX.file] = JSON.stringify(r), _a);
};
var FILE_INPUT = {
    text: 'add dark mode',
    title: 'Dark mode',
    priority: 'high',
    difficulty: 'hard',
    intent: 'improving',
};
(0, testing_1.test)('a new message is held and the band asks for its priority', function () { return __awaiter(void 0, void 0, void 0, function () {
    var mem, _a, ports, view, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                mem = (0, helpers_1.memoryHost)({ files: withRecord((0, record_source_1.emptyRecord)('p', '/p')) });
                _a = (0, helpers_1.fakePorts)(mem, {
                    reply: '{"kind":"new","intent":"improving","title":"Dark mode","difficulty":"hard"}',
                    view: { record: (0, record_source_1.emptyRecord)('p', '/p') },
                }), ports = _a.ports, view = _a.view;
                _b = testing_1.expect;
                return [4 /*yield*/, (0, message_check_controller_1.onMessage)(ports, helpers_1.CTX, 'add dark mode')];
            case 1:
                _b.apply(void 0, [_c.sent()]).toEqual({ verdict: 'drop', intent: 'improving', kind: 'new' });
                (0, testing_1.expect)(view.band).toEqual({
                    kind: 'file',
                    text: 'add dark mode',
                    title: 'Dark mode',
                    priority: 'mid',
                    difficulty: 'hard',
                    intent: 'improving',
                });
                (0, testing_1.expect)(view.isChecking).toBe(false);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a same-task message goes through', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, ports, view, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = (0, helpers_1.fakePorts)((0, helpers_1.memoryHost)(), {
                    reply: '{"kind":"same","intent":"understanding"}',
                    view: { record: (0, record_source_1.emptyRecord)('p', '/p') },
                }), ports = _a.ports, view = _a.view;
                _b = testing_1.expect;
                return [4 /*yield*/, (0, message_check_controller_1.onMessage)(ports, helpers_1.CTX, 'why does it fail?')];
            case 1:
                _b.apply(void 0, [_c.sent()]).toEqual({ verdict: 'pass', intent: 'understanding', kind: 'same' });
                (0, testing_1.expect)(view.band).toEqual({ kind: 'none' });
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a quick question goes through', function () { return __awaiter(void 0, void 0, void 0, function () {
    var ports, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                ports = (0, helpers_1.fakePorts)((0, helpers_1.memoryHost)(), {
                    reply: '{"kind":"quick","intent":"understanding"}',
                    view: { record: (0, record_source_1.emptyRecord)('p', '/p') },
                }).ports;
                _a = testing_1.expect;
                return [4 /*yield*/, (0, message_check_controller_1.onMessage)(ports, helpers_1.CTX, 'what does this error mean?')];
            case 1:
                _a.apply(void 0, [(_b.sent()).verdict]).toBe('pass');
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a failed check holds the message and says the check did not run', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, ports, view, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = (0, helpers_1.fakePorts)((0, helpers_1.memoryHost)(), { reply: 'no idea', view: { record: (0, record_source_1.emptyRecord)('p', '/p') } }), ports = _a.ports, view = _a.view;
                _b = testing_1.expect;
                return [4 /*yield*/, (0, message_check_controller_1.onMessage)(ports, helpers_1.CTX, 'hmm')];
            case 1:
                _b.apply(void 0, [(_c.sent()).verdict]).toBe('drop');
                (0, testing_1.expect)(view.band).toEqual({ kind: 'unsure', text: 'hmm', intent: 'improving', didCheckRun: false });
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('an unsure answer asks, saying the check ran', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, ports, view;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = (0, helpers_1.fakePorts)((0, helpers_1.memoryHost)(), {
                    reply: '{"kind":"unsure","intent":"understanding"}',
                    view: { record: (0, record_source_1.emptyRecord)('p', '/p') },
                }), ports = _a.ports, view = _a.view;
                return [4 /*yield*/, (0, message_check_controller_1.onMessage)(ports, helpers_1.CTX, 'hmm')];
            case 1:
                _b.sent();
                (0, testing_1.expect)(view.band).toEqual({ kind: 'unsure', text: 'hmm', intent: 'understanding', didCheckRun: true });
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('with no record loaded, a message goes through unchecked', function () { return __awaiter(void 0, void 0, void 0, function () {
    var ports, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                ports = (0, helpers_1.fakePorts)((0, helpers_1.memoryHost)(), { reply: '{"kind":"new","intent":"improving","title":"X"}' }).ports;
                _a = testing_1.expect;
                return [4 /*yield*/, (0, message_check_controller_1.onMessage)(ports, helpers_1.CTX, 'x')];
            case 1:
                _a.apply(void 0, [_b.sent()]).toEqual({ verdict: 'pass', intent: null, kind: null });
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('slash commands and the mod’s own prompts are not checked', function () {
    (0, testing_1.expect)((0, check_prompt_1.shouldCheck)({ origin: { kind: 'composer' } })).toBe(true);
    (0, testing_1.expect)((0, check_prompt_1.shouldCheck)({ origin: { kind: 'composer' }, command: { name: 'help', args: '' } })).toBe(false);
    (0, testing_1.expect)((0, check_prompt_1.shouldCheck)({ origin: { kind: 'composer' }, isMeta: true })).toBe(false);
    var fromPlugin = { kind: 'plugin', name: 'queue-tea' };
    (0, testing_1.expect)((0, check_prompt_1.shouldCheck)({ origin: fromPlugin })).toBe(false);
    (0, testing_1.expect)((0, check_prompt_1.shouldCheck)({ origin: { kind: 'task-notification' } })).toBe(false);
});
(0, testing_1.test)('Save twice files one task', function () { return __awaiter(void 0, void 0, void 0, function () {
    var current, mem, _a, ports, done;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                current = (0, helpers_1.makeTask)({ state: 'current' });
                mem = (0, helpers_1.memoryHost)({ files: withRecord(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: [current] })) });
                _a = (0, helpers_1.fakePorts)(mem), ports = _a.ports, done = _a.done;
                return [4 /*yield*/, Promise.all([(0, filing_controller_1.fileTask)(ports, helpers_1.CTX, FILE_INPUT), (0, filing_controller_1.fileTask)(ports, helpers_1.CTX, FILE_INPUT)])];
            case 1:
                _b.sent();
                (0, testing_1.expect)(stored(mem).tasks.filter(function (t) { return t.title === 'Dark mode'; })).toHaveLength(1);
                (0, testing_1.expect)(done.toasts).toEqual(['Queued: Dark mode (high)']);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('filing with nothing current starts the task: branch, clear, first message', function () { return __awaiter(void 0, void 0, void 0, function () {
    var mem, _a, ports, view, done, settle, task;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                mem = (0, helpers_1.memoryHost)({ files: withRecord((0, record_source_1.emptyRecord)('p', '/p')), git: gitWith(CLEAN) });
                _a = (0, helpers_1.fakePorts)(mem), ports = _a.ports, view = _a.view, done = _a.done, settle = _a.settle;
                return [4 /*yield*/, (0, filing_controller_1.fileTask)(ports, helpers_1.CTX, FILE_INPUT)];
            case 1:
                _b.sent();
                return [4 /*yield*/, settle()];
            case 2:
                _b.sent();
                task = stored(mem).tasks[0];
                (0, testing_1.expect)(mem.runs).toContainEqual(['git', 'switch', '-c', 'task/dark-mode']);
                (0, testing_1.expect)(task.state).toBe('current');
                (0, testing_1.expect)(task.branch).toBe('task/dark-mode');
                (0, testing_1.expect)(task.startCommit).toBe('1a2b3c4');
                (0, testing_1.expect)(task.created).toBe('2026-10-21T09:12:00+02:00');
                (0, testing_1.expect)(task.started).toBe('2026-10-21T09:12:00+02:00');
                (0, testing_1.expect)(done.clears).toBe(1);
                (0, testing_1.expect)(done.submits[0].startsWith('Task: Dark mode')).toBe(true);
                (0, testing_1.expect)(view.hold).toBeNull();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a dirty tree holds the start and says what is left', function () { return __awaiter(void 0, void 0, void 0, function () {
    var mem, _a, ports, view, done, settle, task;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                mem = (0, helpers_1.memoryHost)({ files: withRecord((0, record_source_1.emptyRecord)('p', '/p')), git: gitWith(DIRTY) });
                _a = (0, helpers_1.fakePorts)(mem), ports = _a.ports, view = _a.view, done = _a.done, settle = _a.settle;
                return [4 /*yield*/, (0, filing_controller_1.fileTask)(ports, helpers_1.CTX, FILE_INPUT)];
            case 1:
                _b.sent();
                return [4 /*yield*/, settle()];
            case 2:
                _b.sent();
                task = stored(mem).tasks[0];
                (0, testing_1.expect)(view.hold).toEqual({ taskId: task.id, text: '3 files not committed · 2 commits not pushed' });
                (0, testing_1.expect)(task.state).toBe('queued');
                (0, testing_1.expect)(mem.runs.some(function (argv) { return argv.includes('switch'); })).toBe(false);
                (0, testing_1.expect)(done.clears).toBe(0);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('Check again after a commit and push starts the held task', function () { return __awaiter(void 0, void 0, void 0, function () {
    var mem, _a, ports, view, settle, id, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                mem = (0, helpers_1.memoryHost)({ files: withRecord((0, record_source_1.emptyRecord)('p', '/p')), git: gitWith(DIRTY) });
                _a = (0, helpers_1.fakePorts)(mem), ports = _a.ports, view = _a.view, settle = _a.settle;
                return [4 /*yield*/, (0, filing_controller_1.fileTask)(ports, helpers_1.CTX, FILE_INPUT)];
            case 1:
                _c.sent();
                id = view.hold.taskId;
                mem.git['git status --porcelain=v2 --branch'] = { stdout: CLEAN };
                _b = testing_1.expect;
                return [4 /*yield*/, (0, tasks_controller_1.startTask)(ports, helpers_1.CTX, id)];
            case 2:
                _b.apply(void 0, [_c.sent()]).toBe('started');
                return [4 /*yield*/, settle()];
            case 3:
                _c.sent();
                (0, testing_1.expect)(view.hold).toBeNull();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('not a repo starts without a branch', function () { return __awaiter(void 0, void 0, void 0, function () {
    var mem, _a, ports, view, done, settle;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                mem = (0, helpers_1.memoryHost)({
                    files: withRecord((0, record_source_1.emptyRecord)('p', '/p')),
                    git: { 'git rev-parse --is-inside-work-tree': { exitCode: 128 } },
                });
                _a = (0, helpers_1.fakePorts)(mem), ports = _a.ports, view = _a.view, done = _a.done, settle = _a.settle;
                return [4 /*yield*/, (0, filing_controller_1.fileTask)(ports, helpers_1.CTX, FILE_INPUT)];
            case 1:
                _b.sent();
                return [4 /*yield*/, settle()];
            case 2:
                _b.sent();
                (0, testing_1.expect)(stored(mem).tasks[0].state).toBe('current');
                (0, testing_1.expect)(stored(mem).tasks[0].branch).toBeNull();
                (0, testing_1.expect)(view.notice).toBe('Not a git repository, so no branches are made');
                (0, testing_1.expect)(done.clears).toBe(1);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a branch git refuses to make holds the start with a way to retry', function () { return __awaiter(void 0, void 0, void 0, function () {
    var git, mem, _a, ports, view, done;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                git = gitWith(CLEAN);
                delete git['git switch -c task/dark-mode'];
                mem = (0, helpers_1.memoryHost)({ files: withRecord((0, record_source_1.emptyRecord)('p', '/p')), git: git });
                _a = (0, helpers_1.fakePorts)(mem), ports = _a.ports, view = _a.view, done = _a.done;
                return [4 /*yield*/, (0, filing_controller_1.fileTask)(ports, helpers_1.CTX, FILE_INPUT)];
            case 1:
                _c.sent();
                (0, testing_1.expect)((_b = view.hold) === null || _b === void 0 ? void 0 : _b.text).toBe("Couldn't make the branch task/dark-mode. Check again to retry.");
                (0, testing_1.expect)(done.clears).toBe(0);
                (0, testing_1.expect)(done.logs.length).toBe(1);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('task_looks_done asks in the panel', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, ports, view;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = (0, helpers_1.fakePorts)((0, helpers_1.memoryHost)()), ports = _a.ports, view = _a.view;
                return [4 /*yield*/, (0, tasks_controller_1.taskLooksDone)(ports)];
            case 1:
                _b.sent();
                (0, testing_1.expect)(view.isAskingDone).toBe(true);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('finishing measures the diff, marks done and writes the docs log', function () { return __awaiter(void 0, void 0, void 0, function () {
    var current, mem, _a, ports, view, task;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                current = (0, helpers_1.makeTask)({
                    title: 'Retry button',
                    state: 'current',
                    priority: 'high',
                    difficulty: { expected: 'light', actual: null },
                    branch: 'task/retry-button',
                    startCommit: 'abc1234',
                    minutesByDay: { '2026-10-21': 84 },
                });
                mem = (0, helpers_1.memoryHost)({
                    files: withRecord(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { docsLogPath: 'docs/task_log.md', tasks: [current] })),
                    git: {
                        'git rev-parse --is-inside-work-tree': { stdout: 'true\n' },
                        'git diff --shortstat abc1234': { stdout: ' 4 files changed, 160 insertions(+), 38 deletions(-)\n' },
                    },
                });
                _a = (0, helpers_1.fakePorts)(mem, { view: { isAskingDone: true } }), ports = _a.ports, view = _a.view;
                return [4 /*yield*/, (0, tasks_controller_1.finishTask)(ports, helpers_1.CTX, current.id, 'medium')];
            case 1:
                _b.sent();
                task = stored(mem).tasks[0];
                (0, testing_1.expect)(task.state).toBe('done');
                (0, testing_1.expect)(task.finished).toBe('2026-10-21T09:12:00+02:00');
                (0, testing_1.expect)(task.difficulty).toEqual({ expected: 'light', actual: 'medium' });
                (0, testing_1.expect)([task.effort.linesAdded, task.effort.linesRemoved, task.effort.filesTouched]).toEqual([160, 38, 4]);
                (0, testing_1.expect)(mem.files.get('/p/docs/task_log.md')).toContain('| Retry button | High | Light → Medium | 1h 24m | `task/retry-button` |');
                (0, testing_1.expect)(view.isChoosingNext).toBe(true);
                (0, testing_1.expect)(view.isAskingDone).toBe(false);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('the first finish in a project asks for the docs log path', function () { return __awaiter(void 0, void 0, void 0, function () {
    var current, mem, _a, ports, view;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                current = (0, helpers_1.makeTask)({ title: 'Retry button', state: 'current', startCommit: null });
                mem = (0, helpers_1.memoryHost)({ files: withRecord(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: [current] })) });
                _a = (0, helpers_1.fakePorts)(mem), ports = _a.ports, view = _a.view;
                return [4 /*yield*/, (0, tasks_controller_1.finishTask)(ports, helpers_1.CTX, current.id, 'light')];
            case 1:
                _b.sent();
                (0, testing_1.expect)(view.band).toEqual({ kind: 'docsPath', taskId: current.id, suggested: 'docs/task_log.md' });
                (0, testing_1.expect)(mem.files.has('/p/docs/task_log.md')).toBe(false);
                return [4 /*yield*/, (0, tasks_controller_1.finishDocs)(ports, helpers_1.CTX, current.id, 'docs/task_log.md')];
            case 2:
                _b.sent();
                (0, testing_1.expect)(stored(mem).docsLogPath).toBe('docs/task_log.md');
                (0, testing_1.expect)(mem.files.get('/p/docs/task_log.md')).toContain('| Retry button |');
                (0, testing_1.expect)(view.band).toEqual({ kind: 'none' });
                (0, testing_1.expect)(view.isChoosingNext).toBe(true);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('the compose section names the task only while one is current', function () {
    var current = (0, helpers_1.makeTask)({ title: 'Retry button', state: 'current' });
    (0, testing_1.expect)((0, tasks_controller_1.taskSection)(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: [(0, helpers_1.makeTask)()] }))).toBeNull();
    (0, testing_1.expect)((0, tasks_controller_1.taskSection)(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: [current] }))).toEqual({
        id: 'queue-tea:task',
        scope: 'session',
        text: 'The current Queue-tea task is "Retry button". When a reply of yours has finished what it asked, call task_looks_done. Never commit or push: Rohan does. When work is ready to commit, propose it with propose_commit, and he commits it from Branches in the Queue-tea app.',
    });
    (0, testing_1.expect)((0, tasks_controller_1.taskSection)(null)).toBeNull();
});
(0, testing_1.test)('in a Manual realm the brief only says Rohan commits, and names no propose_commit', function () {
    var _a;
    var current = (0, helpers_1.makeTask)({ title: 'Retry button', state: 'current' });
    var text = (_a = (0, tasks_controller_1.taskSection)(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { gitMode: 'manual', tasks: [current] }))) === null || _a === void 0 ? void 0 : _a.text;
    (0, testing_1.expect)(text).toBe((0, tasks_text_1.TASK_LINE)('Retry button', 'manual'));
    (0, testing_1.expect)(text).toBe('The current Queue-tea task is "Retry button". When a reply of yours has finished what it asked, call task_looks_done. Never commit or push: Rohan does.');
});
(0, testing_1.test)('an Assisted realm’s brief asks for propose_commit', function () {
    var _a;
    var current = (0, helpers_1.makeTask)({ title: 'Retry button', state: 'current' });
    (0, testing_1.expect)((_a = (0, tasks_controller_1.taskSection)(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { gitMode: 'assisted', tasks: [current] }))) === null || _a === void 0 ? void 0 : _a.text).toBe((0, tasks_text_1.TASK_LINE)('Retry button', 'assisted'));
    (0, testing_1.expect)((0, tasks_text_1.TASK_LINE)('Retry button', 'assisted')).toContain('propose_commit');
});
(0, testing_1.test)('the compose section adds a line for each helper that is on, in work order', function () {
    var _a;
    var current = (0, helpers_1.makeTask)({ title: 'Retry button', state: 'current', helpers: { on: ['commit-chai-n', 'tea-dd'], ran: [], reminded: false } });
    var line = function (id) { return tasks_text_1.HELPER_LINES.find(function (_a) {
        var h = _a[0];
        return h === id;
    })[1]; };
    (0, testing_1.expect)((_a = (0, tasks_controller_1.taskSection)(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: [current] }))) === null || _a === void 0 ? void 0 : _a.text).toBe([(0, tasks_text_1.TASK_LINE)('Retry button', 'assisted'), line('tea-dd'), line('commit-chai-n')].join('\n'));
});
(0, testing_1.test)("a profile Tea-DD picked closes the compose section, with its reason", function () {
    var _a;
    var current = (0, helpers_1.makeTask)({ title: 'Retry button', state: 'current', helpers: { on: ['tea-dd'], ran: [], reminded: false }, testProfile: { id: 'deep', by: 'tea-dd', reason: 'a new tool' } });
    var line = tasks_text_1.HELPER_LINES.find(function (_a) {
        var h = _a[0];
        return h === 'tea-dd';
    })[1];
    (0, testing_1.expect)((_a = (0, tasks_controller_1.taskSection)(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: [current] }))) === null || _a === void 0 ? void 0 : _a.text).toBe([(0, tasks_text_1.TASK_LINE)('Retry button', 'assisted'), line, 'Test profile: Deep, chosen by Tea-DD: a new tool'].join('\n'));
});
(0, testing_1.test)("a profile Rohan picked tells Claude that Tea-DD keeps to it", function () {
    var _a;
    var current = (0, helpers_1.makeTask)({ title: 'Retry button', state: 'current', testProfile: { id: 'critical', by: 'rohan' } });
    (0, testing_1.expect)((_a = (0, tasks_controller_1.taskSection)(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: [current] }))) === null || _a === void 0 ? void 0 : _a.text).toBe([(0, tasks_text_1.TASK_LINE)('Retry button', 'assisted'), 'Test profile: Critical, chosen by Rohan. Tea-DD keeps to it.'].join('\n'));
});
(0, testing_1.test)('with no helpers on, the compose section is the task line alone', function () {
    var _a;
    var current = (0, helpers_1.makeTask)({ title: 'Retry button', state: 'current' });
    (0, testing_1.expect)((_a = (0, tasks_controller_1.taskSection)(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: [current] }))) === null || _a === void 0 ? void 0 : _a.text).toBe((0, tasks_text_1.TASK_LINE)('Retry button', 'assisted'));
});
(0, testing_1.test)('firstMessage includes the handoff note when there is one', function () {
    var task = (0, helpers_1.makeTask)({ title: 'Retry button', messages: ['add a retry button', 'make it blue'] });
    (0, testing_1.expect)((0, checkpoints_1.firstMessage)(task)).toBe('Task: Retry button\n\nadd a retry button\n\nmake it blue');
    (0, testing_1.expect)((0, checkpoints_1.firstMessage)(__assign(__assign({}, task), { handoff: { text: 'Button done; colour left.', written: '2026-10-21T10:00:00+02:00' } }))).toBe('Task: Retry button\n\nadd a retry button\n\nmake it blue\n\nHandoff note (2026-10-21T10:00:00+02:00):\nButton done; colour left.\n\n' +
        'First compare the checkpoint with the repository and say in one line what differs. A check counts as passed only when Queue-tea saw it pass; rerun the ones the work relies on. Then do the next action.');
});
(0, testing_1.test)('an unreadable record stops the start: no branch, no clear', function () { return __awaiter(void 0, void 0, void 0, function () {
    var mem, _a, ports, view, done, settle;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                mem = (0, helpers_1.memoryHost)({ files: (_b = {}, _b[helpers_1.CTX.file] = '{bad', _b), git: gitWith(CLEAN) });
                _a = (0, helpers_1.fakePorts)(mem), ports = _a.ports, view = _a.view, done = _a.done, settle = _a.settle;
                return [4 /*yield*/, (0, filing_controller_1.fileTask)(ports, helpers_1.CTX, FILE_INPUT)];
            case 1:
                _c.sent();
                return [4 /*yield*/, settle()];
            case 2:
                _c.sent();
                (0, testing_1.expect)(view.load).toBe('failed');
                (0, testing_1.expect)(mem.runs.some(function (argv) { return argv.includes('switch'); })).toBe(false);
                (0, testing_1.expect)(done.clears).toBe(0);
                (0, testing_1.expect)(mem.files.get(helpers_1.CTX.file)).toBe('{bad');
                return [2 /*return*/];
        }
    });
}); });
var helpersOf = function (on, ran, reminded) {
    if (ran === void 0) { ran = []; }
    if (reminded === void 0) { reminded = false; }
    return ({ on: on, ran: ran, reminded: reminded });
};
var doneSetup = function (on, failWrite) {
    if (failWrite === void 0) { failWrite = false; }
    live_1.live.ctx = helpers_1.CTX;
    var task = (0, helpers_1.makeTask)({ state: 'current', helpers: helpersOf(on) });
    var mem = (0, helpers_1.memoryHost)({ files: withRecord(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: [task] })) });
    if (failWrite) {
        // Only the first write fails: the reminder mark; the review mark after it saves.
        var run_1 = mem.host.run;
        var isFailed_1 = false;
        mem.host.run = function (argv, cwd) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (argv[0] !== 'mv' || isFailed_1)
                    return [2 /*return*/, run_1(argv, cwd)];
                isFailed_1 = true;
                return [2 /*return*/, { exitCode: 1, stdout: '', stderr: 'no' }];
            });
        }); };
    }
    return __assign({ mem: mem }, (0, helpers_1.fakePorts)(mem, { view: { record: stored(mem) } }));
};
(0, testing_1.test)('helperToRemind picks Tea-DD, then Commit Chai-n, and never the other two', function () {
    var t = function (on, ran) {
        if (ran === void 0) { ran = []; }
        return (0, helpers_1.makeTask)({ helpers: helpersOf(on, ran) });
    };
    (0, testing_1.expect)((0, task_rules_1.helperToRemind)(t(['tea-dd']))).toBe('tea-dd');
    (0, testing_1.expect)((0, task_rules_1.helperToRemind)(t(['tea-dd', 'commit-chai-n'], ['tea-dd']))).toBe('commit-chai-n');
    (0, testing_1.expect)((0, task_rules_1.helperToRemind)(t(['mocha-mockup', 'chai-pter']))).toBeNull();
    (0, testing_1.expect)((0, task_rules_1.helperToRemind)(t(['tea-dd'], ['tea-dd']))).toBeNull();
});
(0, testing_1.test)("task_looks_done reminds once, then asks Rohan with the didn't-run line", function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, mem, ports, view, _b, _c;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = doneSetup(['tea-dd']), mem = _a.mem, ports = _a.ports, view = _a.view;
                _b = testing_1.expect;
                return [4 /*yield*/, (0, tasks_controller_1.taskLooksDone)(ports)];
            case 1:
                _b.apply(void 0, [_e.sent()]).toBe((0, tasks_text_1.REMIND)('Tea-DD'));
                (0, testing_1.expect)(view.isAskingDone).not.toBe(true);
                (0, testing_1.expect)((_d = stored(mem).tasks[0]) === null || _d === void 0 ? void 0 : _d.helpers.reminded).toBe(true);
                _c = testing_1.expect;
                return [4 /*yield*/, (0, tasks_controller_1.taskLooksDone)(ports, 'ran it')];
            case 2:
                _c.apply(void 0, [_e.sent()]).toBe(tasks_text_1.ASKED);
                (0, testing_1.expect)(view.isAskingDone).toBe(true);
                (0, testing_1.expect)(view.checked).toBe("ran it Tea-DD is on and didn't run.");
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)("a long checked line still ends with the didn't-run line", function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, ports, view;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = doneSetup(['tea-dd']), ports = _a.ports, view = _a.view;
                return [4 /*yield*/, (0, tasks_controller_1.taskLooksDone)(ports)];
            case 1:
                _c.sent();
                return [4 /*yield*/, (0, tasks_controller_1.taskLooksDone)(ports, 'x'.repeat(400))];
            case 2:
                _c.sent();
                (0, testing_1.expect)((_b = view.checked) === null || _b === void 0 ? void 0 : _b.endsWith((0, tasks_text_1.DIDNT_RUN)('Tea-DD'))).toBe(true);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a failed reminder save asks Rohan instead', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, ports, view, done, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = doneSetup(['tea-dd'], true), ports = _a.ports, view = _a.view, done = _a.done;
                _b = testing_1.expect;
                return [4 /*yield*/, (0, tasks_controller_1.taskLooksDone)(ports)];
            case 1:
                _b.apply(void 0, [_c.sent()]).toBe(tasks_text_1.ASKED);
                (0, testing_1.expect)(view.isAskingDone).toBe(true);
                (0, testing_1.expect)(done.logs.length).toBe(1);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('an unreadable record on the reminder save asks Rohan instead', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, mem, ports, view, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = doneSetup(['tea-dd']), mem = _a.mem, ports = _a.ports, view = _a.view;
                mem.files.set(helpers_1.CTX.file, '{bad');
                _b = testing_1.expect;
                return [4 /*yield*/, (0, tasks_controller_1.taskLooksDone)(ports)];
            case 1:
                _b.apply(void 0, [_c.sent()]).toBe(tasks_text_1.ASKED);
                (0, testing_1.expect)(view.isAskingDone).toBe(true);
                (0, testing_1.expect)(view.checked).toBe((0, tasks_text_1.DIDNT_RUN)('Tea-DD'));
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('noteHelperRun notes a helper once', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, mem, ports;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = doneSetup(['tea-dd']), mem = _a.mem, ports = _a.ports;
                return [4 /*yield*/, (0, tasks_controller_1.noteHelperRun)(ports, 'queue-tea:tea-dd')];
            case 1:
                _c.sent();
                return [4 /*yield*/, (0, tasks_controller_1.noteHelperRun)(ports, 'queue-tea:tea-dd')];
            case 2:
                _c.sent();
                (0, testing_1.expect)((_b = stored(mem).tasks[0]) === null || _b === void 0 ? void 0 : _b.helpers.ran).toEqual(['tea-dd']);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('other agents and odd input are ignored', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, mem, ports, done, before, _i, _b, agent;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = doneSetup(['tea-dd']), mem = _a.mem, ports = _a.ports, done = _a.done;
                before = mem.files.get(helpers_1.CTX.file);
                _i = 0, _b = ['general-purpose', 'queue-tea:nobody', undefined, 42];
                _d.label = 1;
            case 1:
                if (!(_i < _b.length)) return [3 /*break*/, 4];
                agent = _b[_i];
                return [4 /*yield*/, (0, tasks_controller_1.noteHelperRun)(ports, agent)];
            case 2:
                _d.sent();
                _d.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4:
                (0, testing_1.expect)((_c = stored(mem).tasks[0]) === null || _c === void 0 ? void 0 : _c.helpers.ran).toEqual([]);
                (0, testing_1.expect)(mem.files.get(helpers_1.CTX.file)).toBe(before);
                (0, testing_1.expect)(done.logs).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
