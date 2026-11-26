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
var activity_controller_1 = require("../../../hooks/shared/activity/presentation/state_management/activity_controller");
var record_source_1 = require("../../../hooks/shared/records/data/datasources/record_source");
var helpers_1 = require("../../helpers");
var setup = function () {
    var _a;
    var record = __assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: [(0, helpers_1.makeTask)({ id: 'first', state: 'current' }), (0, helpers_1.makeTask)({ id: 'second' })] });
    var mem = (0, helpers_1.memoryHost)({ files: (_a = {}, _a[helpers_1.CTX.file] = JSON.stringify(record), _a) });
    var fake = (0, helpers_1.fakePorts)(mem, { view: { record: record } });
    var saved = function () { return JSON.parse(mem.files.get(helpers_1.CTX.file)); };
    return __assign(__assign({}, fake), { mem: mem, saved: saved });
};
(0, testing_1.test)('saves a started tool and how it ended to the same task across a task change, without its output', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, ports, view, mem, saved, finish, switched;
    var _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _a = setup(), ports = _a.ports, view = _a.view, mem = _a.mem, saved = _a.saved;
                live_1.live.ctx = helpers_1.CTX;
                _f.label = 1;
            case 1:
                _f.trys.push([1, , 4, 5]);
                return [4 /*yield*/, (0, activity_controller_1.beginActivity)(ports, 'Bash', { command: 'npm test' })];
            case 2:
                finish = _f.sent();
                (0, testing_1.expect)((_c = (_b = saved().tasks[0]) === null || _b === void 0 ? void 0 : _b.step) === null || _c === void 0 ? void 0 : _c.status).toBe('running');
                switched = __assign(__assign({}, saved()), { tasks: saved().tasks.map(function (t) { return (__assign(__assign({}, t), { state: t.id === 'first' ? 'queued' : 'current' })); }) });
                mem.files.set(helpers_1.CTX.file, JSON.stringify(switched));
                view.record = switched;
                return [4 /*yield*/, (finish === null || finish === void 0 ? void 0 : finish({ result: { stdout: '1 failed', exitCode: 1 } }))];
            case 3:
                _f.sent();
                (0, testing_1.expect)((_d = saved().tasks[0]) === null || _d === void 0 ? void 0 : _d.step).toMatchObject({ kind: 'test', status: 'failed', subject: 'npm test' });
                (0, testing_1.expect)(mem.files.get(helpers_1.CTX.file)).not.toContain('1 failed');
                (0, testing_1.expect)((_e = saved().tasks[1]) === null || _e === void 0 ? void 0 : _e.step).toBeUndefined();
                return [3 /*break*/, 5];
            case 4:
                live_1.live.ctx = null;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('ignores unrelated tools, missing context, and tasks that are not current', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, ports, view, mem, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = setup(), ports = _a.ports, view = _a.view, mem = _a.mem;
                live_1.live.ctx = null;
                _b = testing_1.expect;
                return [4 /*yield*/, (0, activity_controller_1.beginActivity)(ports, 'Bash', { command: 'npm test' })];
            case 1:
                _b.apply(void 0, [_e.sent()]).toBeNull();
                live_1.live.ctx = helpers_1.CTX;
                _e.label = 2;
            case 2:
                _e.trys.push([2, , 5, 6]);
                _c = testing_1.expect;
                return [4 /*yield*/, (0, activity_controller_1.beginActivity)(ports, 'Unrelated', {})];
            case 3:
                _c.apply(void 0, [_e.sent()]).toBeNull();
                view.record = (0, record_source_1.emptyRecord)('p', '/p');
                _d = testing_1.expect;
                return [4 /*yield*/, (0, activity_controller_1.beginActivity)(ports, 'Bash', { command: 'npm test' })];
            case 4:
                _d.apply(void 0, [_e.sent()]).toBeNull();
                (0, testing_1.expect)(mem.writes).toEqual([]);
                return [3 /*break*/, 6];
            case 5:
                live_1.live.ctx = null;
                return [7 /*endfinally*/];
            case 6: return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a recording failure is logged without stopping the tool', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, ports, mem, done, original, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = setup(), ports = _a.ports, mem = _a.mem, done = _a.done;
                live_1.live.ctx = helpers_1.CTX;
                original = mem.host.write;
                mem.host.write = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    throw new Error('disk unavailable');
                }); }); };
                _c.label = 1;
            case 1:
                _c.trys.push([1, , 3, 4]);
                _b = testing_1.expect;
                return [4 /*yield*/, (0, activity_controller_1.beginActivity)(ports, 'Bash', { command: 'npm test' })];
            case 2:
                _b.apply(void 0, [_c.sent()]).toBeNull();
                (0, testing_1.expect)(done.logs.some(function (line) { return line.includes('saving a started step failed'); })).toBe(true);
                return [3 /*break*/, 4];
            case 3:
                live_1.live.ctx = null;
                mem.host.write = original;
                return [7 /*endfinally*/];
            case 4: return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a background check keeps waiting until its own task result is retrieved', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, ports, mem, saved, launched, _b, poll;
    var _c, _d, _e, _f, _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                _a = setup(), ports = _a.ports, mem = _a.mem, saved = _a.saved;
                live_1.live.ctx = helpers_1.CTX;
                _j.label = 1;
            case 1:
                _j.trys.push([1, , 8, 9]);
                return [4 /*yield*/, (0, activity_controller_1.beginActivity)(ports, 'Bash', { command: 'npm test' })];
            case 2:
                launched = _j.sent();
                return [4 /*yield*/, (launched === null || launched === void 0 ? void 0 : launched({ result: { stdout: 'Starting tests', backgroundTaskId: 'bg-1' } }))];
            case 3:
                _j.sent();
                (0, testing_1.expect)((_c = saved().tasks[0]) === null || _c === void 0 ? void 0 : _c.step).toMatchObject({ status: 'running', backgroundId: 'bg-1' });
                (0, testing_1.expect)((_d = saved().tasks[0]) === null || _d === void 0 ? void 0 : _d.waiting).toHaveLength(1);
                _b = testing_1.expect;
                return [4 /*yield*/, (0, activity_controller_1.beginActivity)(ports, 'GetTask', { taskId: 'other' })];
            case 4:
                _b.apply(void 0, [_j.sent()]).toBeNull();
                return [4 /*yield*/, (0, activity_controller_1.beginActivity)(ports, 'GetTask', { taskId: 'bg-1' })];
            case 5:
                poll = _j.sent();
                return [4 /*yield*/, (poll === null || poll === void 0 ? void 0 : poll({ isError: true }))];
            case 6:
                _j.sent();
                (0, testing_1.expect)((_f = (_e = saved().tasks[0]) === null || _e === void 0 ? void 0 : _e.step) === null || _f === void 0 ? void 0 : _f.status).toBe('running');
                return [4 /*yield*/, (poll === null || poll === void 0 ? void 0 : poll({ result: { taskId: 'bg-1', status: 'completed', result: { isError: false, content: [{ type: 'text', text: '12 passed' }] } } }))];
            case 7:
                _j.sent();
                (0, testing_1.expect)((_g = saved().tasks[0]) === null || _g === void 0 ? void 0 : _g.step).toMatchObject({ status: 'succeeded', subject: 'npm test' });
                (0, testing_1.expect)((_h = saved().tasks[0]) === null || _h === void 0 ? void 0 : _h.waiting).toBeUndefined();
                (0, testing_1.expect)(mem.files.get(helpers_1.CTX.file)).not.toContain('12 passed');
                return [3 /*break*/, 9];
            case 8:
                live_1.live.ctx = null;
                return [7 /*endfinally*/];
            case 9: return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('records each concurrent session only on the task in its own worktree', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, ports, view, mem, saved, record, finish;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = setup(), ports = _a.ports, view = _a.view, mem = _a.mem, saved = _a.saved;
                record = __assign(__assign({}, saved()), { version: 2, tasks: [(0, helpers_1.makeTask)({ id: 'first', state: 'current', worktreePath: '/worktrees/first' }), (0, helpers_1.makeTask)({ id: 'second', state: 'current', worktreePath: '/worktrees/second' })] });
                mem.files.set(helpers_1.CTX.file, JSON.stringify(record));
                view.record = record;
                live_1.live.ctx = __assign(__assign({}, helpers_1.CTX), { cwd: '/worktrees/second' });
                _d.label = 1;
            case 1:
                _d.trys.push([1, , 4, 5]);
                return [4 /*yield*/, (0, activity_controller_1.beginActivity)(ports, 'Bash', { command: 'npm test' })];
            case 2:
                finish = _d.sent();
                return [4 /*yield*/, (finish === null || finish === void 0 ? void 0 : finish({ result: { stdout: 'passed', exitCode: 0 } }))];
            case 3:
                _d.sent();
                (0, testing_1.expect)((_b = saved().tasks[0]) === null || _b === void 0 ? void 0 : _b.step).toBeUndefined();
                (0, testing_1.expect)((_c = saved().tasks[1]) === null || _c === void 0 ? void 0 : _c.step).toMatchObject({ status: 'succeeded', subject: 'npm test' });
                return [3 /*break*/, 5];
            case 4:
                live_1.live.ctx = null;
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); });
var notified = function (id, status, summary) {
    return "<task-notification>\n<task-id>".concat(id, "</task-id>\n<status>").concat(status, "</status>\n<summary>").concat(summary, "</summary>\n</task-notification>");
};
var LATER = Date.parse('2026-10-21T07:22:00Z');
(0, testing_1.test)('a notification ends the background check on the task it ran on, after a task change, with its span', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, ports, view, mem, saved, launched, switched;
    var _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _a = setup(), ports = _a.ports, view = _a.view, mem = _a.mem, saved = _a.saved;
                live_1.live.ctx = helpers_1.CTX;
                _f.label = 1;
            case 1:
                _f.trys.push([1, , 5, 6]);
                return [4 /*yield*/, (0, activity_controller_1.beginActivity)(ports, 'Bash', { command: 'npm test' })];
            case 2:
                launched = _f.sent();
                return [4 /*yield*/, (launched === null || launched === void 0 ? void 0 : launched({ result: { stdout: 'Starting tests', backgroundTaskId: 'bg-1' } }))];
            case 3:
                _f.sent();
                switched = __assign(__assign({}, saved()), { tasks: saved().tasks.map(function (t) { return (__assign(__assign({}, t), { state: t.id === 'first' ? 'queued' : 'current' })); }) });
                mem.files.set(helpers_1.CTX.file, JSON.stringify(switched));
                view.record = switched;
                ports.now = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, LATER];
                }); }); };
                return [4 /*yield*/, (0, activity_controller_1.finishNotifiedActivity)(ports, notified('bg-1', 'failed', 'Background command "npm test" failed with exit code 1'))];
            case 4:
                _f.sent();
                (0, testing_1.expect)((_b = saved().tasks[0]) === null || _b === void 0 ? void 0 : _b.step).toMatchObject({ status: 'failed', finished: '2026-10-21T09:22:00+02:00' });
                (0, testing_1.expect)((_c = saved().tasks[0]) === null || _c === void 0 ? void 0 : _c.waiting).toBeUndefined();
                (0, testing_1.expect)((_d = saved().tasks[0]) === null || _d === void 0 ? void 0 : _d.testPeriods).toEqual([{ start: Date.parse('2026-10-21T07:12:00Z'), end: LATER }]);
                (0, testing_1.expect)((_e = saved().tasks[1]) === null || _e === void 0 ? void 0 : _e.step).toBeUndefined();
                return [3 /*break*/, 6];
            case 5:
                live_1.live.ctx = null;
                return [7 /*endfinally*/];
            case 6: return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a notification that ends no running step writes nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, ports, mem, saved, launched, writes, _i, _b, text;
    var _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = setup(), ports = _a.ports, mem = _a.mem, saved = _a.saved;
                live_1.live.ctx = helpers_1.CTX;
                _e.label = 1;
            case 1:
                _e.trys.push([1, , 9, 10]);
                return [4 /*yield*/, (0, activity_controller_1.beginActivity)(ports, 'Bash', { command: 'npm test' })];
            case 2:
                launched = _e.sent();
                return [4 /*yield*/, (launched === null || launched === void 0 ? void 0 : launched({ result: { stdout: 'Starting tests', backgroundTaskId: 'bg-1' } }))];
            case 3:
                _e.sent();
                writes = mem.writes.length;
                _i = 0, _b = ['hello', notified('bg-9', 'completed', 'exit code 0'), notified('bg-1', 'running', 'still going'), '<task-notification>\n<task-id>bg-1</task-id>\n<event>line</event>\n</task-notification>'];
                _e.label = 4;
            case 4:
                if (!(_i < _b.length)) return [3 /*break*/, 7];
                text = _b[_i];
                return [4 /*yield*/, (0, activity_controller_1.finishNotifiedActivity)(ports, text)];
            case 5:
                _e.sent();
                _e.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 4];
            case 7:
                live_1.live.ctx = null;
                return [4 /*yield*/, (0, activity_controller_1.finishNotifiedActivity)(ports, notified('bg-1', 'completed', 'exit code 0'))];
            case 8:
                _e.sent();
                (0, testing_1.expect)(mem.writes.length).toBe(writes);
                (0, testing_1.expect)((_d = (_c = saved().tasks[0]) === null || _c === void 0 ? void 0 : _c.step) === null || _d === void 0 ? void 0 : _d.status).toBe('running');
                return [3 /*break*/, 10];
            case 9:
                live_1.live.ctx = null;
                return [7 /*endfinally*/];
            case 10: return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a failure while ending a background step is logged, and the prompt goes on', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, ports, mem, done, original, launched;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = setup(), ports = _a.ports, mem = _a.mem, done = _a.done;
                live_1.live.ctx = helpers_1.CTX;
                original = mem.host.write;
                _b.label = 1;
            case 1:
                _b.trys.push([1, , 5, 6]);
                return [4 /*yield*/, (0, activity_controller_1.beginActivity)(ports, 'Bash', { command: 'npm test' })];
            case 2:
                launched = _b.sent();
                return [4 /*yield*/, (launched === null || launched === void 0 ? void 0 : launched({ result: { stdout: 'Starting tests', backgroundTaskId: 'bg-1' } }))];
            case 3:
                _b.sent();
                mem.host.write = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    throw new Error('disk unavailable');
                }); }); };
                return [4 /*yield*/, (0, activity_controller_1.finishNotifiedActivity)(ports, notified('bg-1', 'completed', 'exit code 0'))];
            case 4:
                _b.sent();
                (0, testing_1.expect)(done.logs.some(function (line) { return line.includes('finishing a background step failed'); })).toBe(true);
                return [3 /*break*/, 6];
            case 5:
                live_1.live.ctx = null;
                mem.host.write = original;
                return [7 /*endfinally*/];
            case 6: return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a background check that ends after the next step leaves the line on that step, and stops waiting', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, ports, saved, launched, edit;
    var _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = setup(), ports = _a.ports, saved = _a.saved;
                live_1.live.ctx = helpers_1.CTX;
                _e.label = 1;
            case 1:
                _e.trys.push([1, , 7, 8]);
                return [4 /*yield*/, (0, activity_controller_1.beginActivity)(ports, 'Bash', { command: 'npm test' })];
            case 2:
                launched = _e.sent();
                return [4 /*yield*/, (launched === null || launched === void 0 ? void 0 : launched({ result: { stdout: 'Starting tests', backgroundTaskId: 'bg-1' } }))];
            case 3:
                _e.sent();
                return [4 /*yield*/, (0, activity_controller_1.beginActivity)(ports, 'Edit', { file_path: '/p/src/a.ts' })];
            case 4:
                edit = _e.sent();
                return [4 /*yield*/, (edit === null || edit === void 0 ? void 0 : edit({ result: 'ok' }))];
            case 5:
                _e.sent();
                ports.now = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, LATER];
                }); }); };
                return [4 /*yield*/, (0, activity_controller_1.finishNotifiedActivity)(ports, notified('bg-1', 'completed', 'exit code 0'))];
            case 6:
                _e.sent();
                (0, testing_1.expect)((_b = saved().tasks[0]) === null || _b === void 0 ? void 0 : _b.step).toMatchObject({ kind: 'edit', status: 'succeeded', subject: '/p/src/a.ts' });
                (0, testing_1.expect)((_c = saved().tasks[0]) === null || _c === void 0 ? void 0 : _c.waiting).toBeUndefined();
                (0, testing_1.expect)((_d = saved().tasks[0]) === null || _d === void 0 ? void 0 : _d.testPeriods).toEqual([{ start: Date.parse('2026-10-21T07:12:00Z'), end: LATER }]);
                return [3 /*break*/, 8];
            case 7:
                live_1.live.ctx = null;
                return [7 /*endfinally*/];
            case 8: return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)("a step's line is the command's first line, cut to 200 characters", function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, ports, saved, subject;
    var _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = setup(), ports = _a.ports, saved = _a.saved;
                live_1.live.ctx = helpers_1.CTX;
                _e.label = 1;
            case 1:
                _e.trys.push([1, , 3, 4]);
                return [4 /*yield*/, (0, activity_controller_1.beginActivity)(ports, 'Bash', { command: "  ".concat('x'.repeat(300), "\necho done") })];
            case 2:
                _e.sent();
                subject = (_d = (_c = (_b = saved().tasks[0]) === null || _b === void 0 ? void 0 : _b.step) === null || _c === void 0 ? void 0 : _c.subject) !== null && _d !== void 0 ? _d : '';
                (0, testing_1.expect)(subject.length).toBe(200);
                (0, testing_1.expect)(subject.endsWith('…')).toBe(true);
                (0, testing_1.expect)(subject).not.toContain('echo');
                return [3 /*break*/, 4];
            case 3:
                live_1.live.ctx = null;
                return [7 /*endfinally*/];
            case 4: return [2 /*return*/];
        }
    });
}); });
