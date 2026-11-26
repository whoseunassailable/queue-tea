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
var check_repository_impl_1 = require("../../../hooks/features/message_check/data/repositories/check_repository_impl");
var docs_log_source_1 = require("../../../hooks/features/tasks/data/datasources/docs_log_source");
var effort_tracker_1 = require("../../../hooks/shared/effort/domain/services/effort_tracker");
var conversation_turn_controller_1 = require("../../../hooks/features/conversation/presentation/state_management/conversation_turn_controller");
var tasks_controller_1 = require("../../../hooks/features/tasks/presentation/state_management/tasks_controller");
var filing_controller_1 = require("../../../hooks/features/tasks/presentation/state_management/filing_controller");
var queue_controller_1 = require("../../../hooks/features/tasks/presentation/state_management/queue_controller");
var message_check_controller_1 = require("../../../hooks/features/message_check/presentation/state_management/message_check_controller");
var check_prompt_1 = require("../../../hooks/features/message_check/domain/services/check_prompt");
var record_source_1 = require("../../../hooks/shared/records/data/datasources/record_source");
var helpers_1 = require("../../helpers");
var OID = '# branch.oid 1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b';
var CLEAN = [OID, '# branch.head main', '# branch.upstream origin/main', '# branch.ab +0 -0', ''].join('\n');
var DIRTY = [OID, '# branch.head main', '# branch.upstream origin/main', '# branch.ab +0 -0', '? a', ''].join('\n');
var git = function (status, more) {
    if (status === void 0) { status = CLEAN; }
    if (more === void 0) { more = {}; }
    return (__assign({ 'git rev-parse --is-inside-work-tree': { stdout: 'true\n' }, 'git status --porcelain=v2 --branch': { stdout: status }, 'git branch --format=%(refname:short)': { stdout: 'main\n' }, 'git switch -c task/a': {}, 'git switch -c task/b': {} }, more));
};
var withRecord = function (r) {
    var _a;
    return (_a = {}, _a[helpers_1.CTX.file] = JSON.stringify(r), _a);
};
var stored = function (mem) { return JSON.parse(mem.files.get(helpers_1.CTX.file)); };
var newReply = function (title) { return "{\"kind\":\"new\",\"intent\":\"improving\",\"title\":\"".concat(title, "\",\"difficulty\":\"light\"}"); };
(0, testing_1.test)('a second held message waits behind the first band, and both get filed', function () { return __awaiter(void 0, void 0, void 0, function () {
    var current, record, mem, first, ports;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                current = (0, helpers_1.makeTask)({ state: 'current' });
                record = __assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: [current] });
                mem = (0, helpers_1.memoryHost)({ files: withRecord(record) });
                first = (0, helpers_1.fakePorts)(mem, { reply: newReply('A'), view: { record: record } });
                return [4 /*yield*/, (0, message_check_controller_1.onMessage)(first.ports, helpers_1.CTX, 'do A')];
            case 1:
                _a.sent();
                ports = __assign(__assign({}, first.ports), { ask: (0, helpers_1.fakePorts)(mem, { reply: newReply('B') }).ports.ask });
                return [4 /*yield*/, (0, message_check_controller_1.onMessage)(ports, helpers_1.CTX, 'do B')];
            case 2:
                _a.sent();
                (0, testing_1.expect)(first.view.band.title).toBe('A');
                return [4 /*yield*/, (0, filing_controller_1.fileTask)(ports, helpers_1.CTX, first.view.band)];
            case 3:
                _a.sent();
                (0, testing_1.expect)(first.view.band.title).toBe('B');
                return [4 /*yield*/, (0, filing_controller_1.fileTask)(ports, helpers_1.CTX, first.view.band)];
            case 4:
                _a.sent();
                (0, testing_1.expect)(first.view.band).toEqual({ kind: 'none' });
                (0, testing_1.expect)(stored(mem).tasks.map(function (t) { return t.title; })).toEqual([current.title, 'A', 'B']);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('afterTurn twice before the fresh conversation starts writes one note and clears once', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, record, mem, _a, ports, done, settle, forks, fork;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ state: 'current' });
                record = __assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: [task] });
                mem = (0, helpers_1.memoryHost)({ files: withRecord(record) });
                _a = (0, helpers_1.fakePorts)(mem, { reply: 'note', view: { record: record } }), ports = _a.ports, done = _a.done, settle = _a.settle;
                forks = 0;
                fork = ports.ask.fork;
                ports.ask.fork = function (prompt) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        forks += 1;
                        return [2 /*return*/, fork(prompt)];
                    });
                }); };
                return [4 /*yield*/, (0, conversation_turn_controller_1.afterTurn)(ports, helpers_1.CTX, { tokens: 150000, allowance: null }, null)];
            case 1:
                _b.sent();
                return [4 /*yield*/, (0, conversation_turn_controller_1.afterTurn)(ports, helpers_1.CTX, { tokens: 160000, allowance: null }, null)];
            case 2:
                _b.sent();
                return [4 /*yield*/, settle()];
            case 3:
                _b.sent();
                (0, testing_1.expect)(forks).toBe(1);
                (0, testing_1.expect)(done.clears).toBe(1);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a save that cannot write keeps the band and says so', function () { return __awaiter(void 0, void 0, void 0, function () {
    var mem, band, _a, ports, view;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                mem = (0, helpers_1.memoryHost)({ files: (_b = {}, _b[helpers_1.CTX.file] = '{bad', _b) });
                band = { kind: 'file', text: 'do A', title: 'A', priority: 'mid', difficulty: 'light', intent: 'improving' };
                _a = (0, helpers_1.fakePorts)(mem, { view: { band: band } }), ports = _a.ports, view = _a.view;
                return [4 /*yield*/, (0, filing_controller_1.fileTask)(ports, helpers_1.CTX, band)];
            case 1:
                _c.sent();
                (0, testing_1.expect)(view.band).toEqual(band);
                (0, testing_1.expect)(view.load).toBe('failed');
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a save whose write fails keeps the band', function () { return __awaiter(void 0, void 0, void 0, function () {
    var mem, run, band, _a, ports, view;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                mem = (0, helpers_1.memoryHost)({ files: withRecord((0, record_source_1.emptyRecord)('p', '/p')) });
                run = mem.host.run;
                mem.host.run = function (argv, cwd) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, (argv[0] === 'mv' ? { exitCode: 1, stdout: '', stderr: 'no' } : run(argv, cwd))];
                }); }); };
                band = { kind: 'file', text: 'do A', title: 'A', priority: 'mid', difficulty: 'light', intent: 'improving' };
                _a = (0, helpers_1.fakePorts)(mem, { view: { band: band } }), ports = _a.ports, view = _a.view;
                return [4 /*yield*/, (0, filing_controller_1.fileTask)(ports, helpers_1.CTX, band)];
            case 1:
                _b.sent();
                (0, testing_1.expect)(view.band).toEqual(band);
                (0, testing_1.expect)(view.notice).toBe("Couldn't save the task. Try Save again.");
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a prompt with attachments is not checked', function () {
    (0, testing_1.expect)((0, check_prompt_1.shouldCheck)({ origin: { kind: 'composer' }, attachments: [{ kind: 'image' }] })).toBe(false);
    (0, testing_1.expect)((0, check_prompt_1.shouldCheck)({ origin: { kind: 'composer' }, attachments: [] })).toBe(true);
});
(0, testing_1.test)('a held message sent on goes as Rohan’s and shows the next band', function () { return __awaiter(void 0, void 0, void 0, function () {
    var next, _a, ports, view, done, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                next = { kind: 'unsure', text: 'two', intent: 'improving', didCheckRun: true };
                _a = (0, helpers_1.fakePorts)((0, helpers_1.memoryHost)(), {
                    view: { band: { kind: 'unsure', text: 'one', intent: 'understanding', didCheckRun: false }, bandQueue: [next] },
                }), ports = _a.ports, view = _a.view, done = _a.done;
                _b = testing_1.expect;
                return [4 /*yield*/, (0, message_check_controller_1.sendHeld)(ports)];
            case 1:
                _b.apply(void 0, [_c.sent()]).toBe('understanding');
                (0, testing_1.expect)(done.submits).toEqual(['one']);
                (0, testing_1.expect)(done.asUser).toEqual([true]);
                (0, testing_1.expect)(view.band).toEqual(next);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('onMessage says what kind the message was', function () { return __awaiter(void 0, void 0, void 0, function () {
    var ports, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                ports = (0, helpers_1.fakePorts)((0, helpers_1.memoryHost)(), {
                    reply: '{"kind":"quick","intent":"understanding"}',
                    view: { record: (0, record_source_1.emptyRecord)('p', '/p') },
                }).ports;
                _a = testing_1.expect;
                return [4 /*yield*/, (0, message_check_controller_1.onMessage)(ports, helpers_1.CTX, 'what is this?')];
            case 1:
                _a.apply(void 0, [_b.sent()]).toEqual({ verdict: 'pass', intent: 'understanding', kind: 'quick' });
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('after a quick question, time goes to the project until the next task message', function () {
    var T0 = Date.parse('2026-10-21T08:00:00Z');
    var tracker = (0, effort_tracker_1.createTracker)(15, 0);
    tracker.activity(T0);
    tracker.route('project');
    tracker.activity(T0 + 4 * 60000);
    tracker.route('task');
    tracker.activity(T0 + 10 * 60000);
    var current = (0, helpers_1.makeTask)({ state: 'current' });
    var after = (0, effort_tracker_1.applyPending)(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: [current] }), tracker.take());
    (0, testing_1.expect)(after.unassignedMinutesByDay).toEqual({ '2026-10-21': 4 });
    (0, testing_1.expect)(after.tasks[0].minutesByDay).toEqual({ '2026-10-21': 6 });
});
(0, testing_1.test)('Start pressed twice makes one branch and clears once', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, mem, _a, ports, done, settle;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'A' });
                mem = (0, helpers_1.memoryHost)({ files: withRecord(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: [task] })), git: git() });
                _a = (0, helpers_1.fakePorts)(mem), ports = _a.ports, done = _a.done, settle = _a.settle;
                return [4 /*yield*/, Promise.all([(0, tasks_controller_1.startTask)(ports, helpers_1.CTX, task.id), (0, tasks_controller_1.startTask)(ports, helpers_1.CTX, task.id)])];
            case 1:
                _b.sent();
                return [4 /*yield*/, settle()];
            case 2:
                _b.sent();
                (0, testing_1.expect)(mem.runs.filter(function (argv) { return argv.includes('switch'); })).toHaveLength(1);
                (0, testing_1.expect)(done.clears).toBe(1);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('finishing twice, or saving the docs path twice, writes one row', function () { return __awaiter(void 0, void 0, void 0, function () {
    var a, mem, ports, b, mem2, second;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                a = (0, helpers_1.makeTask)({ title: 'A', state: 'current' });
                mem = (0, helpers_1.memoryHost)({ files: withRecord(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { docsLogPath: 'docs/task_log.md', tasks: [a] })) });
                ports = (0, helpers_1.fakePorts)(mem).ports;
                return [4 /*yield*/, Promise.all([(0, tasks_controller_1.finishTask)(ports, helpers_1.CTX, a.id, 'light'), (0, tasks_controller_1.finishTask)(ports, helpers_1.CTX, a.id, 'light')])];
            case 1:
                _a.sent();
                b = (0, helpers_1.makeTask)({ title: 'B', state: 'current' });
                mem2 = (0, helpers_1.memoryHost)({ files: withRecord(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: [b] })) });
                second = (0, helpers_1.fakePorts)(mem2);
                return [4 /*yield*/, (0, tasks_controller_1.finishTask)(second.ports, helpers_1.CTX, b.id, 'light')];
            case 2:
                _a.sent();
                return [4 /*yield*/, Promise.all([
                        (0, tasks_controller_1.finishDocs)(second.ports, helpers_1.CTX, b.id, 'docs/task_log.md'),
                        (0, tasks_controller_1.finishDocs)(second.ports, helpers_1.CTX, b.id, 'docs/task_log.md'),
                    ])];
            case 3:
                _a.sent();
                (0, testing_1.expect)(mem.files.get('/p/docs/task_log.md').split('\n').filter(function (l) { return l.startsWith('| A |'); })).toHaveLength(1);
                (0, testing_1.expect)(mem2.files.get('/p/docs/task_log.md').split('\n').filter(function (l) { return l.startsWith('| B |'); })).toHaveLength(1);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('Check again does not start a removed task, and Remove clears its hold', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, mem, _a, ports, view, done, settle, _b;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'A' });
                mem = (0, helpers_1.memoryHost)({ files: withRecord(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: [task] })), git: git(DIRTY) });
                _a = (0, helpers_1.fakePorts)(mem), ports = _a.ports, view = _a.view, done = _a.done, settle = _a.settle;
                return [4 /*yield*/, (0, tasks_controller_1.startTask)(ports, helpers_1.CTX, task.id)];
            case 1:
                _d.sent();
                (0, testing_1.expect)((_c = view.hold) === null || _c === void 0 ? void 0 : _c.taskId).toBe(task.id);
                return [4 /*yield*/, (0, queue_controller_1.removeQueued)(ports, helpers_1.CTX, task.id)];
            case 2:
                _d.sent();
                (0, testing_1.expect)(view.hold).toBeNull();
                mem.git['git status --porcelain=v2 --branch'] = { stdout: CLEAN };
                _b = testing_1.expect;
                return [4 /*yield*/, (0, tasks_controller_1.startTask)(ports, helpers_1.CTX, task.id)];
            case 3:
                _b.apply(void 0, [_d.sent()]).toBe('failed');
                return [4 /*yield*/, settle()];
            case 4:
                _d.sent();
                (0, testing_1.expect)(mem.runs.some(function (argv) { return argv.includes('switch'); })).toBe(false);
                (0, testing_1.expect)(done.clears).toBe(0);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a task cannot start while another is current', function () { return __awaiter(void 0, void 0, void 0, function () {
    var current, queued, mem, ports, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                current = (0, helpers_1.makeTask)({ title: 'Now', state: 'current' });
                queued = (0, helpers_1.makeTask)({ title: 'B' });
                mem = (0, helpers_1.memoryHost)({ files: withRecord(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: [current, queued] })), git: git() });
                ports = (0, helpers_1.fakePorts)(mem).ports;
                _a = testing_1.expect;
                return [4 /*yield*/, (0, tasks_controller_1.startTask)(ports, helpers_1.CTX, queued.id)];
            case 1:
                _a.apply(void 0, [_b.sent()]).toBe('failed');
                (0, testing_1.expect)(stored(mem).tasks.filter(function (t) { return t.state === 'current'; })).toHaveLength(1);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a task another session starts first is not started here, and git is left alone', function () { return __awaiter(void 0, void 0, void 0, function () {
    var a, b, mem, _a, ports, view, done, settle, run, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                a = (0, helpers_1.makeTask)({ title: 'A' });
                b = (0, helpers_1.makeTask)({ title: 'B' });
                mem = (0, helpers_1.memoryHost)({ files: withRecord(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: [a, b] })), git: git() });
                _a = (0, helpers_1.fakePorts)(mem), ports = _a.ports, view = _a.view, done = _a.done, settle = _a.settle;
                run = mem.host.run;
                mem.host.run = function (argv) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        if (argv.join(' ') === 'git branch --format=%(refname:short)') {
                            mem.files.set(helpers_1.CTX.file, JSON.stringify(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: [a, __assign(__assign({}, b), { state: 'current' })] })));
                        }
                        return [2 /*return*/, run(argv)];
                    });
                }); };
                _b = testing_1.expect;
                return [4 /*yield*/, (0, tasks_controller_1.startTask)(ports, helpers_1.CTX, a.id)];
            case 1:
                _b.apply(void 0, [_c.sent()]).toBe('failed');
                return [4 /*yield*/, settle()];
            case 2:
                _c.sent();
                (0, testing_1.expect)(mem.runs.some(function (argv) { return argv.includes('switch'); })).toBe(false);
                (0, testing_1.expect)(stored(mem).tasks.map(function (t) { return t.state; })).toEqual(['queued', 'current']);
                (0, testing_1.expect)(view.notice).toBe('B was started first, maybe in another session, so A waits in the backlog.');
                (0, testing_1.expect)(done.clears).toBe(0);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a branch git refuses puts the claimed task back as it was', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, more, mem, _a, ports, view, _b, after;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'A' });
                more = git();
                delete more['git switch -c task/a'];
                mem = (0, helpers_1.memoryHost)({ files: withRecord(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { playNext: task.id, tasks: [task] })), git: more });
                _a = (0, helpers_1.fakePorts)(mem), ports = _a.ports, view = _a.view;
                _b = testing_1.expect;
                return [4 /*yield*/, (0, tasks_controller_1.startTask)(ports, helpers_1.CTX, task.id)];
            case 1:
                _b.apply(void 0, [_d.sent()]).toBe('held');
                after = stored(mem);
                (0, testing_1.expect)(after.playNext).toBe(task.id);
                (0, testing_1.expect)(after.tasks[0]).toMatchObject({ state: 'queued', started: null, branch: null, baseBranch: null, startCommit: null });
                (0, testing_1.expect)((_c = view.hold) === null || _c === void 0 ? void 0 : _c.text).toBe("Couldn't make the branch task/a. Check again to retry.");
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a claim that can’t be taken back after a refused branch shows as it is saved, and says how to get out', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, more, mem, _a, ports, view, done, run, _b;
    var _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'A' });
                more = git();
                delete more['git switch -c task/a'];
                mem = (0, helpers_1.memoryHost)({ files: withRecord(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: [task] })), git: more });
                _a = (0, helpers_1.fakePorts)(mem), ports = _a.ports, view = _a.view, done = _a.done;
                run = mem.host.run;
                mem.host.run = function (argv) { return __awaiter(void 0, void 0, void 0, function () {
                    var ran;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, run(argv)];
                            case 1:
                                ran = _a.sent();
                                if (argv.join(' ') === 'git switch -c task/a') {
                                    mem.host.write = function () { return __awaiter(void 0, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            throw new Error('disk full');
                                        });
                                    }); };
                                }
                                return [2 /*return*/, ran];
                        }
                    });
                }); };
                _b = testing_1.expect;
                return [4 /*yield*/, (0, tasks_controller_1.startTask)(ports, helpers_1.CTX, task.id)];
            case 1:
                _b.apply(void 0, [_f.sent()]).toBe('failed');
                (0, testing_1.expect)((_c = stored(mem).tasks[0]) === null || _c === void 0 ? void 0 : _c.state).toBe('current');
                (0, testing_1.expect)((_e = (_d = view.record) === null || _d === void 0 ? void 0 : _d.tasks[0]) === null || _e === void 0 ? void 0 : _e.state).toBe('current');
                // Check again would find the task not queued and only clear the line.
                (0, testing_1.expect)(view.hold).toBeNull();
                (0, testing_1.expect)(view.notice).toBe("Couldn't make the branch task/a or put A back in the queue. Press Back to queue to try again.");
                (0, testing_1.expect)(done.logs.some(function (line) { return line.includes('disk full'); })).toBe(true);
                (0, testing_1.expect)(done.clears).toBe(0);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a first message that fails offers Continue, and Continue sends it', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, mem, _a, ports, view, done, settle, submit, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'A' });
                mem = (0, helpers_1.memoryHost)({ files: withRecord(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: [task] })), git: git() });
                _a = (0, helpers_1.fakePorts)(mem), ports = _a.ports, view = _a.view, done = _a.done, settle = _a.settle;
                submit = ports.submit;
                ports.submit = function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        throw new Error('refused');
                    });
                }); };
                _b = testing_1.expect;
                return [4 /*yield*/, (0, tasks_controller_1.startTask)(ports, helpers_1.CTX, task.id)];
            case 1:
                _b.apply(void 0, [_c.sent()]).toBe('started');
                return [4 /*yield*/, settle()];
            case 2:
                _c.sent();
                (0, testing_1.expect)(stored(mem).tasks[0].state).toBe('current');
                (0, testing_1.expect)(view.canContinue).toBe(true);
                (0, testing_1.expect)(view.notice).toBe("Couldn't open the conversation for A. Press Continue to try again.");
                (0, testing_1.expect)(done.logs.some(function (l) { return l.includes('refused'); })).toBe(true);
                ports.submit = submit;
                view.record = stored(mem);
                return [4 /*yield*/, (0, tasks_controller_1.continueTask)(ports, helpers_1.CTX)];
            case 3:
                _c.sent();
                return [4 /*yield*/, settle()];
            case 4:
                _c.sent();
                (0, testing_1.expect)(done.submits).toEqual(['Task: A']);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('two record writes use different temp files', function () { return __awaiter(void 0, void 0, void 0, function () {
    var mem, temps;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                mem = (0, helpers_1.memoryHost)();
                return [4 /*yield*/, (0, record_source_1.updateRecord)(mem.host, helpers_1.CTX.file, function (r) { return r; }, 'p', '/p')];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, record_source_1.updateRecord)(mem.host, helpers_1.CTX.file, function (r) { return r; }, 'p', '/p')];
            case 2:
                _a.sent();
                temps = mem.writes.filter(function (w) { return w.endsWith('.tmp'); });
                (0, testing_1.expect)(temps).toHaveLength(2);
                (0, testing_1.expect)(temps[0] === temps[1]).toBe(false);
                (0, testing_1.expect)(temps.every(function (w) { return w.startsWith("".concat(helpers_1.CTX.file, ".")); })).toBe(true);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a check whose model call rejects gives null, and onMessage stops checking', function () { return __awaiter(void 0, void 0, void 0, function () {
    var logs, ask, _a, _b, ports, view;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                logs = [];
                ask = {
                    fork: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ isAnswered: false, reason: 'nothing-to-fork' })];
                    }); }); },
                    complete: function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            throw new Error('blocked model');
                        });
                    }); },
                    sleep: function () { return new Promise(function () { }); },
                    log: function (text) { return logs.push(text); },
                };
                _a = testing_1.expect;
                return [4 /*yield*/, (0, check_repository_impl_1.checkMessage)(ask, 'p', 10000)];
            case 1:
                _a.apply(void 0, [_c.sent()]).toBeNull();
                (0, testing_1.expect)(logs.length).toBe(1);
                _b = (0, helpers_1.fakePorts)((0, helpers_1.memoryHost)(), { view: { record: (0, record_source_1.emptyRecord)('p', '/p') } }), ports = _b.ports, view = _b.view;
                ports.ask.fork = function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        throw new Error('boom');
                    });
                }); };
                return [4 /*yield*/, (0, message_check_controller_1.onMessage)(ports, helpers_1.CTX, 'x').catch(function () { })];
            case 2:
                _c.sent();
                (0, testing_1.expect)(view.isChecking).toBe(false);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a title cannot break the table or an MDX build', function () {
    (0, testing_1.expect)((0, docs_log_source_1.escapeCell)('a \\| b')).toBe('a \\\\\\| b');
    (0, testing_1.expect)((0, docs_log_source_1.escapeCell)('<Button> {x}')).toBe('&lt;Button> \\{x\\}');
    (0, testing_1.expect)((0, docs_log_source_1.escapeCell)('one\r\ntwo\rthree')).toBe('one two three');
});
