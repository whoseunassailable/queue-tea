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
var finish_task_1 = require("../../../hooks/features/tasks/domain/usecases/finish_task");
var leave_codex_1 = require("../../../hooks/features/tasks/domain/usecases/leave_codex");
var put_back_1 = require("../../../hooks/features/tasks/domain/usecases/put_back");
var send_to_codex_1 = require("../../../hooks/features/tasks/domain/usecases/send_to_codex");
var start_task_1 = require("../../../hooks/features/tasks/domain/usecases/start_task");
var tasks_controller_1 = require("../../../hooks/features/tasks/presentation/state_management/tasks_controller");
var tasks_providers_1 = require("../../../hooks/features/tasks/tasks_providers");
var record_source_1 = require("../../../hooks/shared/records/data/datasources/record_source");
var helpers_1 = require("../../helpers");
// When the task went to Codex: 06:00Z. The fake clock says 07:12Z, 09:12 here.
var SINCE = '2026-10-21T08:00:00+02:00';
var NOW = Date.parse('2026-10-21T07:12:00Z');
var NOW_HERE = '2026-10-21T09:12:00+02:00';
var at = function (time) { return Date.parse("2026-10-21T".concat(time, ":00Z")); };
// 10 and 5 minutes, then a 30-minute gap over the idle limit, then 5: 20.
var STAMPS = [at('06:00'), at('06:10'), at('06:15'), at('06:45'), at('06:50')];
var OID = '# branch.oid 1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b';
var CLEAN = [OID, '# branch.head main', '# branch.upstream origin/main', '# branch.ab +0 -0', ''].join('\n');
var git = function () { return ({
    'git rev-parse --is-inside-work-tree': { stdout: 'true\n' },
    'git status --porcelain=v2 --branch': { stdout: CLEAN },
    'git branch --format=%(refname:short)': { stdout: 'main\n' },
    'git switch -c task/a': {},
}); };
// The record on disk and the tasks' deps, with Codex's log answering `log`:
// the moments it shows, or the error reading it throws.
var setup = function (tasks, log, options) {
    var _a;
    var _b;
    if (log === void 0) { log = []; }
    if (options === void 0) { options = {}; }
    var record = __assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: tasks, requests: (_b = options.requests) !== null && _b !== void 0 ? _b : [] });
    var mem = (0, helpers_1.memoryHost)({ files: (_a = {}, _a[helpers_1.CTX.file] = JSON.stringify(record), _a), git: options.git });
    var _c = (0, helpers_1.fakePorts)(mem, { view: { record: record } }), ports = _c.ports, done = _c.done;
    var asked = [];
    var codex = {
        activitySince: function (folder, sinceMs, nowMs) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                asked.push({ folder: folder, sinceMs: sinceMs, nowMs: nowMs });
                if (log instanceof Error)
                    throw log;
                return [2 /*return*/, log];
            });
        }); },
    };
    return { mem: mem, done: done, asked: asked, deps: __assign(__assign({}, (0, tasks_providers_1.tasksDepsOf)(ports, helpers_1.CTX)), { codex: codex }) };
};
var stored = function (mem) { return (0, record_source_1.parseRecord)(mem.files.get(helpers_1.CTX.file)); };
(0, testing_1.test)('a task back from Codex gets the minutes its log shows, under the idle gap, and Claude Code has it again', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, asked, deps, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ state: 'current', codexSince: SINCE, minutesByDay: { '2026-10-21': 5 } });
                _a = setup([task], STAMPS), mem = _a.mem, asked = _a.asked, deps = _a.deps;
                _b = testing_1.expect;
                return [4 /*yield*/, (0, leave_codex_1.leaveCodexUseCase)(deps, helpers_1.CTX, task.id)];
            case 1:
                _b.apply(void 0, [_c.sent()]).toBe(false);
                (0, testing_1.expect)(asked).toEqual([{ folder: '/p', sinceMs: Date.parse(SINCE), nowMs: NOW }]);
                (0, testing_1.expect)(stored(mem).tasks[0]).toMatchObject({ state: 'current', codexSince: null, minutesByDay: { '2026-10-21': 25 } });
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)("when Codex's log can't be read, the task still comes back, without that time, and says so", function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, done, deps, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ state: 'current', codexSince: SINCE, minutesByDay: { '2026-10-21': 5 } });
                _a = setup([task], new Error('EACCES: permission denied')), mem = _a.mem, done = _a.done, deps = _a.deps;
                _b = testing_1.expect;
                return [4 /*yield*/, (0, leave_codex_1.leaveCodexUseCase)(deps, helpers_1.CTX, task.id)];
            case 1:
                _b.apply(void 0, [_c.sent()]).toBe(true);
                (0, testing_1.expect)(stored(mem).tasks[0]).toMatchObject({ codexSince: null, minutesByDay: { '2026-10-21': 5 } });
                (0, testing_1.expect)(done.logs.some(function (line) { return line.includes("reading Codex's log failed") && line.includes('EACCES'); })).toBe(true);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a task Claude Code has is left alone: Codex is not read and nothing is written', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, asked, deps, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ state: 'current', minutesByDay: { '2026-10-21': 5 } });
                _a = setup([task], STAMPS), mem = _a.mem, asked = _a.asked, deps = _a.deps;
                _b = testing_1.expect;
                return [4 /*yield*/, (0, leave_codex_1.leaveCodexUseCase)(deps, helpers_1.CTX, task.id)];
            case 1:
                _b.apply(void 0, [_c.sent()]).toBe(false);
                (0, testing_1.expect)(asked).toEqual([]);
                (0, testing_1.expect)(mem.writes).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('an unreadable record is never written over when a task leaves Codex', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, mem, asked, deps, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = setup([], STAMPS), mem = _a.mem, asked = _a.asked, deps = _a.deps;
                mem.files.set(helpers_1.CTX.file, 'not json');
                _b = testing_1.expect;
                return [4 /*yield*/, (0, leave_codex_1.leaveCodexUseCase)(deps, helpers_1.CTX, 't-x')];
            case 1:
                _b.apply(void 0, [_c.sent()]).toBe(false);
                (0, testing_1.expect)(asked).toEqual([]);
                (0, testing_1.expect)(mem.files.get(helpers_1.CTX.file)).toBe('not json');
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('Continue in Codex marks the task in progress as with Codex from now, and takes back only its own requests', function () { return __awaiter(void 0, void 0, void 0, function () {
    var current, other, requests, _a, mem, deps, after;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                current = (0, helpers_1.makeTask)({ state: 'current' });
                other = (0, helpers_1.makeTask)();
                requests = [
                    { id: 'q-1', kind: 'begin', taskId: current.id, at: 'now' },
                    { id: 'q-2', kind: 'putBack', taskId: current.id, at: 'now' },
                    { id: 'q-3', kind: 'begin', taskId: other.id, at: 'now' },
                ];
                _a = setup([current, other], [], { requests: requests }), mem = _a.mem, deps = _a.deps;
                return [4 /*yield*/, (0, send_to_codex_1.sendToCodexUseCase)(deps, helpers_1.CTX, current.id)];
            case 1:
                _b.sent();
                after = stored(mem);
                (0, testing_1.expect)(after.tasks.map(function (t) { return t.codexSince; })).toEqual([NOW_HERE, null]);
                (0, testing_1.expect)(after.requests.map(function (q) { return q.id; })).toEqual(['q-3']);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a task already with Codex keeps the moment it went, and a queued task is not sent', function () { return __awaiter(void 0, void 0, void 0, function () {
    var current, queued, _a, mem, deps;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                current = (0, helpers_1.makeTask)({ state: 'current', codexSince: SINCE });
                queued = (0, helpers_1.makeTask)();
                _a = setup([current, queued]), mem = _a.mem, deps = _a.deps;
                return [4 /*yield*/, (0, send_to_codex_1.sendToCodexUseCase)(deps, helpers_1.CTX, current.id)];
            case 1:
                _b.sent();
                return [4 /*yield*/, (0, send_to_codex_1.sendToCodexUseCase)(deps, helpers_1.CTX, queued.id)];
            case 2:
                _b.sent();
                (0, testing_1.expect)(stored(mem).tasks.map(function (t) { return t.codexSince; })).toEqual([SINCE, null]);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('Start in Codex claims the task with Codex from the moment it starts, on its own branch', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, deps, result;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'A' });
                _a = setup([task], [], { git: git() }), mem = _a.mem, deps = _a.deps;
                return [4 /*yield*/, (0, start_task_1.startTaskUseCase)(deps, helpers_1.CTX, task.id, 'codex')];
            case 1:
                result = _b.sent();
                (0, testing_1.expect)(result.kind).toBe('started');
                (0, testing_1.expect)(stored(mem).tasks[0]).toMatchObject({ state: 'current', started: NOW_HERE, codexSince: NOW_HERE, branch: 'task/a' });
                (0, testing_1.expect)(mem.runs.some(function (argv) { return argv.join(' ') === 'git switch -c task/a'; })).toBe(true);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('Start in Claude Code, the default, leaves the task with Claude Code', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, deps, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'A' });
                _a = setup([task], [], { git: git() }), mem = _a.mem, deps = _a.deps;
                _b = testing_1.expect;
                return [4 /*yield*/, (0, start_task_1.startTaskUseCase)(deps, helpers_1.CTX, task.id)];
            case 1:
                _b.apply(void 0, [(_c.sent()).kind]).toBe('started');
                (0, testing_1.expect)(stored(mem).tasks[0]).toMatchObject({ state: 'current', codexSince: null });
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a branch git refuses puts a Codex start back in the queue with Claude Code', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, more, _a, mem, deps, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'A' });
                more = git();
                delete more['git switch -c task/a'];
                _a = setup([task], [], { git: more }), mem = _a.mem, deps = _a.deps;
                _b = testing_1.expect;
                return [4 /*yield*/, (0, start_task_1.startTaskUseCase)(deps, helpers_1.CTX, task.id, 'codex')];
            case 1:
                _b.apply(void 0, [(_c.sent()).kind]).toBe('branch_failed');
                (0, testing_1.expect)(stored(mem).tasks[0]).toMatchObject({ state: 'queued', started: null, branch: null, codexSince: null });
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('putting back a Codex quest adds its time on Codex, and it waits in the queue for Claude Code', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, deps, _a, saved, isCodexTimeLost;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ state: 'current', codexSince: SINCE, branch: 'task/a', minutesByDay: { '2026-10-21': 5 } });
                deps = setup([task], STAMPS).deps;
                return [4 /*yield*/, (0, put_back_1.putBackUseCase)(deps, helpers_1.CTX, task.id, undefined)];
            case 1:
                _a = _b.sent(), saved = _a.saved, isCodexTimeLost = _a.isCodexTimeLost;
                (0, testing_1.expect)(isCodexTimeLost).toBe(false);
                (0, testing_1.expect)(saved === 'unreadable' ? null : saved.tasks[0]).toMatchObject({ state: 'queued', codexSince: null, branch: 'task/a', minutesByDay: { '2026-10-21': 25 } });
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)("putting back a Codex quest whose log can't be read still queues it, and says the time was lost", function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, deps, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ state: 'current', codexSince: SINCE, minutesByDay: { '2026-10-21': 5 } });
                _a = setup([task], new Error('EACCES')), mem = _a.mem, deps = _a.deps;
                _b = testing_1.expect;
                return [4 /*yield*/, (0, put_back_1.putBackUseCase)(deps, helpers_1.CTX, task.id, undefined)];
            case 1:
                _b.apply(void 0, [(_c.sent()).isCodexTimeLost]).toBe(true);
                (0, testing_1.expect)(stored(mem).tasks[0]).toMatchObject({ state: 'queued', codexSince: null, minutesByDay: { '2026-10-21': 5 } });
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('finishing a Codex quest adds its time on Codex before it is marked done', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, deps, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ state: 'current', codexSince: SINCE, minutesByDay: { '2026-10-21': 5 } });
                deps = setup([task], STAMPS).deps;
                return [4 /*yield*/, (0, finish_task_1.finishTaskUseCase)(deps, helpers_1.CTX, task.id, 'light')];
            case 1:
                result = _a.sent();
                (0, testing_1.expect)(result.kind).toBe('saved');
                if (result.kind !== 'saved')
                    return [2 /*return*/];
                (0, testing_1.expect)(result.isCodexTimeLost).toBe(false);
                (0, testing_1.expect)(result.record.tasks[0]).toMatchObject({ state: 'done', codexSince: null, minutesByDay: { '2026-10-21': 25 } });
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)("finishing a Codex quest whose log can't be read still finishes it, and says the time was lost", function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, deps, result;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ state: 'current', codexSince: SINCE });
                _a = setup([task], new Error('EACCES')), mem = _a.mem, deps = _a.deps;
                return [4 /*yield*/, (0, finish_task_1.finishTaskUseCase)(deps, helpers_1.CTX, task.id, 'light')];
            case 1:
                result = _b.sent();
                (0, testing_1.expect)(result.kind === 'saved' && result.isCodexTimeLost).toBe(true);
                (0, testing_1.expect)(stored(mem).tasks[0]).toMatchObject({ state: 'done', codexSince: null });
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('finishing a task Claude Code has says no Codex time was lost', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, asked, deps, result;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ state: 'current' });
                _a = setup([task], new Error('never read')), asked = _a.asked, deps = _a.deps;
                return [4 /*yield*/, (0, finish_task_1.finishTaskUseCase)(deps, helpers_1.CTX, task.id, 'light')];
            case 1:
                result = _b.sent();
                (0, testing_1.expect)(result.kind === 'saved' && result.isCodexTimeLost).toBe(false);
                (0, testing_1.expect)(asked).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
// The controller, with Codex's log read from the memory host under /h.
var onBoard = function (task) {
    var _a;
    var record = __assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: [task] });
    var mem = (0, helpers_1.memoryHost)({ files: (_a = {}, _a[helpers_1.CTX.file] = JSON.stringify(record), _a) });
    return __assign({ mem: mem }, (0, helpers_1.fakePorts)(mem, { view: { record: record } }));
};
(0, testing_1.test)('Back to queue on a Codex quest asks Claude for no handoff, and says nothing about a checkpoint', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, ports, view, done, asks, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'Now', state: 'current', codexSince: SINCE });
                _a = onBoard(task), mem = _a.mem, ports = _a.ports, view = _a.view, done = _a.done;
                asks = 0;
                ports.ask = __assign(__assign({}, ports.ask), { fork: function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            asks += 1;
                            throw new Error('no reply');
                        });
                    }); } });
                _b = testing_1.expect;
                return [4 /*yield*/, (0, tasks_controller_1.putBack)(ports, helpers_1.CTX)];
            case 1:
                _b.apply(void 0, [_c.sent()]).toBe('queued');
                (0, testing_1.expect)(asks).toBe(0);
                (0, testing_1.expect)(view.notice).toBeNull();
                (0, testing_1.expect)(done.toasts).toEqual(['Back in the backlog: Now']);
                (0, testing_1.expect)(stored(mem).tasks[0]).toMatchObject({ state: 'queued', codexSince: null, handoff: null });
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)("Back to queue on a Codex quest whose log can't be read says its time on Codex wasn't added", function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, ports, view, exists, _b;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'Now', state: 'current', codexSince: SINCE });
                _a = onBoard(task), mem = _a.mem, ports = _a.ports, view = _a.view;
                exists = mem.host.exists;
                mem.host.exists = function (path) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        if (path.includes('/.codex/'))
                            throw new Error('EPERM');
                        return [2 /*return*/, exists(path)];
                    });
                }); };
                _b = testing_1.expect;
                return [4 /*yield*/, (0, tasks_controller_1.putBack)(ports, helpers_1.CTX)];
            case 1:
                _b.apply(void 0, [_d.sent()]).toBe('queued');
                (0, testing_1.expect)(view.notice).toBe("Couldn't read Codex's log, so this task's time on Codex wasn't added.");
                (0, testing_1.expect)((_c = stored(mem).tasks[0]) === null || _c === void 0 ? void 0 : _c.state).toBe('queued');
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)("finishing a Codex quest whose log can't be read says its time on Codex wasn't added", function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, ports, view, exists;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'Now', state: 'current', codexSince: SINCE });
                _a = onBoard(task), mem = _a.mem, ports = _a.ports, view = _a.view;
                exists = mem.host.exists;
                mem.host.exists = function (path) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        if (path.includes('/.codex/'))
                            throw new Error('EPERM');
                        return [2 /*return*/, exists(path)];
                    });
                }); };
                return [4 /*yield*/, (0, tasks_controller_1.finishTask)(ports, helpers_1.CTX, task.id, 'light')];
            case 1:
                _c.sent();
                (0, testing_1.expect)(view.notice).toBe("Couldn't read Codex's log, so this task's time on Codex wasn't added.");
                (0, testing_1.expect)((_b = stored(mem).tasks[0]) === null || _b === void 0 ? void 0 : _b.state).toBe('done');
                return [2 /*return*/];
        }
    });
}); });
// Codex's log under /h in the memory host: one session in /p, changed now.
var withCodexLog = function (mem, stamps) {
    var dir = '/h/.codex/sessions/2026/10/21';
    var lines = stamps.map(function (timestamp, i) { return JSON.stringify(i === 0 ? { timestamp: timestamp, type: 'session_meta', payload: { cwd: '/p' } } : { timestamp: timestamp, type: 'event_msg' }); });
    mem.dirs.add(dir);
    mem.files.set("".concat(dir, "/rollout-a.jsonl"), "".concat(lines.join('\n'), "\n"));
    var modifiedAt = mem.host.modifiedAt;
    mem.host.modifiedAt = function (path) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, (path.startsWith('/h/.codex/') ? NOW : modifiedAt(path))];
    }); }); };
};
(0, testing_1.test)('Continue in Claude Code takes a quest back from Codex with its time, then sends the first message', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, ports, view, done, settle;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'Now', state: 'current', codexSince: SINCE, minutesByDay: { '2026-10-21': 5 } });
                _a = onBoard(task), mem = _a.mem, ports = _a.ports, view = _a.view, done = _a.done, settle = _a.settle;
                // 10 and 5 minutes with Codex.
                withCodexLog(mem, ['2026-10-21T06:00:00Z', '2026-10-21T06:10:00Z', '2026-10-21T06:15:00Z']);
                return [4 /*yield*/, (0, tasks_controller_1.continueTask)(ports, helpers_1.CTX)];
            case 1:
                _d.sent();
                return [4 /*yield*/, settle()];
            case 2:
                _d.sent();
                (0, testing_1.expect)(stored(mem).tasks[0]).toMatchObject({ state: 'current', codexSince: null, minutesByDay: { '2026-10-21': 20 } });
                (0, testing_1.expect)((_c = (_b = view.record) === null || _b === void 0 ? void 0 : _b.tasks[0]) === null || _c === void 0 ? void 0 : _c.codexSince).toBeNull();
                (0, testing_1.expect)(view.notice).toBeNull();
                (0, testing_1.expect)(done.submits).toEqual(['Task: Now']);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)("Continue in Claude Code with Codex's log unreadable says the time wasn't added, and still continues", function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, ports, view, done, settle, exists;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'Now', state: 'current', codexSince: SINCE, minutesByDay: { '2026-10-21': 5 } });
                _a = onBoard(task), mem = _a.mem, ports = _a.ports, view = _a.view, done = _a.done, settle = _a.settle;
                exists = mem.host.exists;
                mem.host.exists = function (path) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        if (path.includes('/.codex/'))
                            throw new Error('EPERM');
                        return [2 /*return*/, exists(path)];
                    });
                }); };
                return [4 /*yield*/, (0, tasks_controller_1.continueTask)(ports, helpers_1.CTX)];
            case 1:
                _b.sent();
                return [4 /*yield*/, settle()];
            case 2:
                _b.sent();
                (0, testing_1.expect)(stored(mem).tasks[0]).toMatchObject({ codexSince: null, minutesByDay: { '2026-10-21': 5 } });
                (0, testing_1.expect)(view.notice).toBe("Couldn't read Codex's log, so this task's time on Codex wasn't added.");
                (0, testing_1.expect)(done.submits).toEqual(['Task: Now']);
                return [2 /*return*/];
        }
    });
}); });
