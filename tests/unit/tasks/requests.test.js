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
var menu_controller_1 = require("../../../hooks/app/menu/menu_controller");
var live_1 = require("../../../hooks/core/session/live");
var requests_controller_1 = require("../../../hooks/features/tasks/presentation/state_management/requests_controller");
var add_request_1 = require("../../../hooks/features/tasks/domain/usecases/add_request");
var drop_requests_1 = require("../../../hooks/features/tasks/domain/usecases/drop_requests");
var take_request_1 = require("../../../hooks/features/tasks/domain/usecases/take_request");
var tasks_controller_1 = require("../../../hooks/features/tasks/presentation/state_management/tasks_controller");
var finish_task_1 = require("../../../hooks/features/tasks/domain/usecases/finish_task");
var tasks_providers_1 = require("../../../hooks/features/tasks/tasks_providers");
var record_source_1 = require("../../../hooks/shared/records/data/datasources/record_source");
var helpers_1 = require("../../helpers");
var FILE = helpers_1.CTX.file;
var request = function (over) {
    if (over === void 0) { over = {}; }
    return (__assign({ id: 'q-1', kind: 'begin', taskId: 'x', at: 'now' }, over));
};
var setup = function (tasks, requests) {
    var _a;
    if (requests === void 0) { requests = []; }
    live_1.live.ctx = helpers_1.CTX;
    live_1.live.isTurnRunning = false;
    live_1.live.recordSeenAt = null;
    var record = __assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: tasks, requests: requests });
    var mem = (0, helpers_1.memoryHost)({ files: (_a = {}, _a[FILE] = JSON.stringify(record), _a) });
    return __assign({ mem: mem }, (0, helpers_1.fakePorts)(mem, { view: { record: record } }));
};
var onDisk = function (mem) {
    var read = (0, record_source_1.parseRecord)(mem.files.get(FILE));
    if (read === 'unreadable')
        throw new Error('should read');
    return read;
};
(0, testing_1.test)('begin sends the first message and leaves the record', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, ports, done, settle, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ state: 'current', title: 'Build it' });
                _a = setup([task], [request({ taskId: task.id })]), mem = _a.mem, ports = _a.ports, done = _a.done, settle = _a.settle;
                _b = testing_1.expect;
                return [4 /*yield*/, (0, requests_controller_1.handleRequests)(ports, helpers_1.CTX)];
            case 1:
                _b.apply(void 0, [_c.sent()]).toBe('handled');
                return [4 /*yield*/, settle()];
            case 2:
                _c.sent();
                (0, testing_1.expect)(onDisk(mem).requests).toEqual([]);
                (0, testing_1.expect)(done.clears).toBe(1);
                (0, testing_1.expect)(done.submits.join('\n')).toContain('Build it');
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a begin for a task no longer current is dropped, and nothing is sent', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, ports, done, settle, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ state: 'queued' });
                _a = setup([task], [request({ taskId: task.id })]), mem = _a.mem, ports = _a.ports, done = _a.done, settle = _a.settle;
                _b = testing_1.expect;
                return [4 /*yield*/, (0, requests_controller_1.handleRequests)(ports, helpers_1.CTX)];
            case 1:
                _b.apply(void 0, [_c.sent()]).toBe('dropped');
                return [4 /*yield*/, settle()];
            case 2:
                _c.sent();
                (0, testing_1.expect)(onDisk(mem).requests).toEqual([]);
                (0, testing_1.expect)(done.submits).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a request waits while a turn runs, and the terminal offers Continue', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, ports, view, done, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ state: 'current' });
                _a = setup([task], [request({ taskId: task.id })]), mem = _a.mem, ports = _a.ports, view = _a.view, done = _a.done;
                live_1.live.isTurnRunning = true;
                _b = testing_1.expect;
                return [4 /*yield*/, (0, requests_controller_1.handleRequests)(ports, helpers_1.CTX)];
            case 1:
                _b.apply(void 0, [_c.sent()]).toBe('waiting');
                (0, testing_1.expect)(view.canContinue).toBe(true);
                (0, testing_1.expect)(onDisk(mem).requests).toHaveLength(1);
                (0, testing_1.expect)(done.submits).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a request waits while something is typed in the prompt box', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, ports, done, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ state: 'current' });
                _a = setup([task], [request({ taskId: task.id })]), ports = _a.ports, done = _a.done;
                done.promptText = 'half a thought';
                _b = testing_1.expect;
                return [4 /*yield*/, (0, requests_controller_1.handleRequests)(ports, helpers_1.CTX)];
            case 1:
                _b.apply(void 0, [_c.sent()]).toBe('waiting');
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('Continue answers a waiting begin, so the task starts once', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, ports, settle, done;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ state: 'current' });
                _a = setup([task], [request({ taskId: task.id })]), mem = _a.mem, ports = _a.ports, settle = _a.settle, done = _a.done;
                return [4 /*yield*/, (0, tasks_controller_1.continueTask)(ports, helpers_1.CTX)];
            case 1:
                _b.sent();
                return [4 /*yield*/, settle()];
            case 2:
                _b.sent();
                (0, testing_1.expect)(onDisk(mem).requests).toEqual([]);
                (0, testing_1.expect)(done.clears).toBe(1);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('putBack puts the task back with its branch and time', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, ports, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ state: 'current', branch: 'task/x', startCommit: 'abc', minutesByDay: { '2026-10-21': 5 } });
                _a = setup([task], [request({ kind: 'putBack', taskId: task.id })]), mem = _a.mem, ports = _a.ports;
                _b = testing_1.expect;
                return [4 /*yield*/, (0, requests_controller_1.handleRequests)(ports, helpers_1.CTX)];
            case 1:
                _b.apply(void 0, [_c.sent()]).toBe('handled');
                (0, testing_1.expect)(onDisk(mem).tasks[0]).toMatchObject({ state: 'queued', branch: 'task/x', startCommit: 'abc', minutesByDay: { '2026-10-21': 5 } });
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('two sessions cannot both take a request', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, ports, deps, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ state: 'current' });
                ports = setup([task], [request({ taskId: task.id })]).ports;
                deps = (0, tasks_providers_1.tasksDepsOf)(ports, helpers_1.CTX);
                _a = testing_1.expect;
                return [4 /*yield*/, (0, take_request_1.takeRequestUseCase)(deps, 'q-1')];
            case 1:
                _a.apply(void 0, [(_c.sent()).kind]).toBe('taken');
                _b = testing_1.expect;
                return [4 /*yield*/, (0, take_request_1.takeRequestUseCase)(deps, 'q-1')];
            case 2:
                _b.apply(void 0, [(_c.sent()).kind]).toBe('gone');
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('task_looks_done marks the task for the app', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, ports, view;
    var _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ state: 'current' });
                _a = setup([task]), mem = _a.mem, ports = _a.ports, view = _a.view;
                return [4 /*yield*/, (0, tasks_controller_1.taskLooksDone)(ports, ' ran the tests ')];
            case 1:
                _e.sent();
                (0, testing_1.expect)(view.isAskingDone).toBe(true);
                (0, testing_1.expect)((_b = onDisk(mem).tasks[0]) === null || _b === void 0 ? void 0 : _b.review).toMatchObject({ checked: 'ran the tests' });
                (0, testing_1.expect)((_d = (_c = onDisk(mem).tasks[0]) === null || _c === void 0 ? void 0 : _c.review) === null || _d === void 0 ? void 0 : _d.at).toMatch(/^2026-10-21T/);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('Yes and Not yet both clear the mark', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _i, _a, answer, task, _b, mem, ports;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _i = 0, _a = [tasks_controller_1.pressDoneYes, tasks_controller_1.pressDoneNotYet];
                _d.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 4];
                answer = _a[_i];
                task = (0, helpers_1.makeTask)({ state: 'current', review: { at: 'x', checked: null } });
                _b = setup([task]), mem = _b.mem, ports = _b.ports;
                return [4 /*yield*/, answer(ports)];
            case 2:
                _d.sent();
                (0, testing_1.expect)((_c = onDisk(mem).tasks[0]) === null || _c === void 0 ? void 0 : _c.review).toBe(null);
                _d.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('Back to queue and Done clear the mark', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, back, finished;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ state: 'current', review: { at: 'x', checked: null } });
                back = setup([task]);
                return [4 /*yield*/, (0, tasks_controller_1.putBack)(back.ports, helpers_1.CTX)];
            case 1:
                _c.sent();
                (0, testing_1.expect)((_a = onDisk(back.mem).tasks[0]) === null || _a === void 0 ? void 0 : _a.review).toBe(null);
                finished = setup([task]);
                return [4 /*yield*/, (0, finish_task_1.finishTaskUseCase)((0, tasks_providers_1.tasksDepsOf)(finished.ports, helpers_1.CTX), helpers_1.CTX, task.id, 'light')];
            case 2:
                _c.sent();
                (0, testing_1.expect)((_b = onDisk(finished.mem).tasks[0]) === null || _b === void 0 ? void 0 : _b.review).toBe(null);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a change on disk reloads, and an answer from the app closes the question', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, ports, view;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ state: 'current', review: { at: 'x', checked: 'c' } });
                _a = setup([task]), mem = _a.mem, ports = _a.ports, view = _a.view;
                view.isAskingDone = true;
                view.checked = 'c';
                return [4 /*yield*/, (0, requests_controller_1.followRecord)(ports, helpers_1.CTX)];
            case 1:
                _d.sent();
                (0, testing_1.expect)(view.isAskingDone).toBe(true);
                return [4 /*yield*/, mem.host.write(FILE, JSON.stringify(__assign(__assign({}, onDisk(mem)), { tasks: [__assign(__assign({}, task), { review: null })] })))];
            case 2:
                _d.sent();
                return [4 /*yield*/, (0, requests_controller_1.followRecord)(ports, helpers_1.CTX)];
            case 3:
                _d.sent();
                (0, testing_1.expect)((_c = (_b = view.record) === null || _b === void 0 ? void 0 : _b.tasks[0]) === null || _c === void 0 ? void 0 : _c.review).toBe(null);
                (0, testing_1.expect)(view.isAskingDone).toBe(false);
                (0, testing_1.expect)(view.checked).toBe(null);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a record gone unreadable on disk says so instead of carrying on', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, mem, ports, view;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = setup([]), mem = _a.mem, ports = _a.ports, view = _a.view;
                return [4 /*yield*/, (0, requests_controller_1.followRecord)(ports, helpers_1.CTX)];
            case 1:
                _b.sent();
                return [4 /*yield*/, mem.host.write(FILE, '{broken')];
            case 2:
                _b.sent();
                return [4 /*yield*/, (0, requests_controller_1.followRecord)(ports, helpers_1.CTX)];
            case 3:
                _b.sent();
                (0, testing_1.expect)(view.load).toBe('failed');
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('Open in Queue-tea app opens the URL for this project', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, mem, ports, view;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = setup([]), mem = _a.mem, ports = _a.ports, view = _a.view;
                mem.git["open queue-tea://open?path=".concat(encodeURIComponent('/p'))] = {};
                return [4 /*yield*/, (0, menu_controller_1.pressOpenApp)(ports)];
            case 1:
                _b.sent();
                (0, testing_1.expect)(view.notice).toBe(null);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('with no app installed, the menu says so', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, ports, view;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = setup([]), ports = _a.ports, view = _a.view;
                return [4 /*yield*/, (0, menu_controller_1.pressOpenApp)(ports)];
            case 1:
                _b.sent();
                (0, testing_1.expect)(view.notice).toContain('may not be installed');
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a putBack carrying a seal puts the task back sealed', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, ports, _b, back;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ state: 'current', title: 'Build it' });
                _a = setup([task], [request({ kind: 'putBack', taskId: task.id, block: { reason: 'waiting for the clinic' } })]), mem = _a.mem, ports = _a.ports;
                _b = testing_1.expect;
                return [4 /*yield*/, (0, requests_controller_1.handleRequests)(ports, helpers_1.CTX)];
            case 1:
                _b.apply(void 0, [_c.sent()]).toBe('handled');
                back = onDisk(mem).tasks.find(function (t) { return t.id === task.id; });
                (0, testing_1.expect)(back.state).toBe('queued');
                (0, testing_1.expect)(back.blockedReason).toBe('waiting for the clinic');
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('adding a request the task already has leaves one', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, ports, deps;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ state: 'current' });
                _a = setup([task]), mem = _a.mem, ports = _a.ports;
                deps = (0, tasks_providers_1.tasksDepsOf)(ports, helpers_1.CTX);
                return [4 /*yield*/, (0, add_request_1.addRequestUseCase)(deps, helpers_1.CTX, 'begin', task.id)];
            case 1:
                _b.sent();
                return [4 /*yield*/, (0, add_request_1.addRequestUseCase)(deps, helpers_1.CTX, 'begin', task.id)];
            case 2:
                _b.sent();
                (0, testing_1.expect)(onDisk(mem).requests.map(function (q) { return q.kind; })).toEqual(['begin']);
                (0, testing_1.expect)(onDisk(mem).requests[0].taskId).toBe(task.id);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('another kind of request for the same task is added beside it', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, ports, deps;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ state: 'current' });
                _a = setup([task]), mem = _a.mem, ports = _a.ports;
                deps = (0, tasks_providers_1.tasksDepsOf)(ports, helpers_1.CTX);
                return [4 /*yield*/, (0, add_request_1.addRequestUseCase)(deps, helpers_1.CTX, 'begin', task.id)];
            case 1:
                _b.sent();
                return [4 /*yield*/, (0, add_request_1.addRequestUseCase)(deps, helpers_1.CTX, 'putBack', task.id, { waitFor: 'other' })];
            case 2:
                _b.sent();
                (0, testing_1.expect)(onDisk(mem).requests.map(function (q) { return q.kind; })).toEqual(['begin', 'putBack']);
                (0, testing_1.expect)(onDisk(mem).requests[1].block).toEqual({ waitFor: 'other' });
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('dropping a task\'s requests leaves those of other tasks', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, ports;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ state: 'current' });
                _a = setup([task], [request({ id: 'mine', taskId: task.id }), request({ id: 'other', taskId: 'someone-else' })]), mem = _a.mem, ports = _a.ports;
                return [4 /*yield*/, (0, drop_requests_1.dropRequestsUseCase)((0, tasks_providers_1.tasksDepsOf)(ports, helpers_1.CTX), task.id)];
            case 1:
                _b.sent();
                (0, testing_1.expect)(onDisk(mem).requests.map(function (q) { return q.id; })).toEqual(['other']);
                return [2 /*return*/];
        }
    });
}); });
