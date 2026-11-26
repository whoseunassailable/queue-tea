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
var set_test_profile_1 = require("../../../hooks/features/tasks/domain/usecases/set_test_profile");
var tasks_text_1 = require("../../../hooks/features/tasks/presentation/constants/tasks_text");
var tasks_controller_1 = require("../../../hooks/features/tasks/presentation/state_management/tasks_controller");
var tasks_providers_1 = require("../../../hooks/features/tasks/tasks_providers");
var record_source_1 = require("../../../hooks/shared/records/data/datasources/record_source");
var helpers_1 = require("../../helpers");
var stored = function (mem) { return JSON.parse(mem.files.get(helpers_1.CTX.file)); };
var withTasks = function (tasks) {
    var _a;
    return (_a = {}, _a[helpers_1.CTX.file] = JSON.stringify(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: tasks })), _a);
};
var PICK = { id: 'deep', reason: 'a stored field old records must still read' };
// ── The use case ──
(0, testing_1.test)("Tea-DD's pick is saved on the current task with its reason", function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, mem, set;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ state: 'current' });
                mem = (0, helpers_1.memoryHost)({ files: withTasks([task]) });
                return [4 /*yield*/, (0, set_test_profile_1.setTestProfileUseCase)((0, tasks_providers_1.tasksDepsOf)((0, helpers_1.fakePorts)(mem).ports, helpers_1.CTX), helpers_1.CTX, task.id, PICK)];
            case 1:
                set = _b.sent();
                (0, testing_1.expect)(set.kind).toBe('saved');
                (0, testing_1.expect)((_a = stored(mem).tasks[0]) === null || _a === void 0 ? void 0 : _a.testProfile).toEqual({ id: 'deep', by: 'tea-dd', reason: PICK.reason });
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('Tea-DD can move up from its own earlier pick', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, mem;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ state: 'current', testProfile: { id: 'standard', by: 'tea-dd', reason: 'one feature' } });
                mem = (0, helpers_1.memoryHost)({ files: withTasks([task]) });
                return [4 /*yield*/, (0, set_test_profile_1.setTestProfileUseCase)((0, tasks_providers_1.tasksDepsOf)((0, helpers_1.fakePorts)(mem).ports, helpers_1.CTX), helpers_1.CTX, task.id, { id: 'critical', reason: 'it reaches the lock' })];
            case 1:
                _b.sent();
                (0, testing_1.expect)((_a = stored(mem).tasks[0]) === null || _a === void 0 ? void 0 : _a.testProfile).toEqual({ id: 'critical', by: 'tea-dd', reason: 'it reaches the lock' });
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)("Rohan's pick stands: Tea-DD's is refused and the record keeps his", function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, mem, set;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ state: 'current', testProfile: { id: 'quick', by: 'rohan' } });
                mem = (0, helpers_1.memoryHost)({ files: withTasks([task]) });
                return [4 /*yield*/, (0, set_test_profile_1.setTestProfileUseCase)((0, tasks_providers_1.tasksDepsOf)((0, helpers_1.fakePorts)(mem).ports, helpers_1.CTX), helpers_1.CTX, task.id, PICK)];
            case 1:
                set = _b.sent();
                (0, testing_1.expect)(set).toEqual({ kind: 'rohans', id: 'quick' });
                (0, testing_1.expect)((_a = stored(mem).tasks[0]) === null || _a === void 0 ? void 0 : _a.testProfile).toEqual({ id: 'quick', by: 'rohan' });
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a task that is no longer current gets no profile', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, mem, set;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ state: 'queued' });
                mem = (0, helpers_1.memoryHost)({ files: withTasks([task]) });
                return [4 /*yield*/, (0, set_test_profile_1.setTestProfileUseCase)((0, tasks_providers_1.tasksDepsOf)((0, helpers_1.fakePorts)(mem).ports, helpers_1.CTX), helpers_1.CTX, task.id, PICK)];
            case 1:
                set = _b.sent();
                (0, testing_1.expect)(set).toEqual({ kind: 'notCurrent' });
                (0, testing_1.expect)((_a = stored(mem).tasks[0]) === null || _a === void 0 ? void 0 : _a.testProfile).toBeUndefined();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('an unreadable record is reported and left as it was', function () { return __awaiter(void 0, void 0, void 0, function () {
    var mem, _a;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                mem = (0, helpers_1.memoryHost)({ files: (_b = {}, _b[helpers_1.CTX.file] = '{bad', _b) });
                _a = testing_1.expect;
                return [4 /*yield*/, (0, set_test_profile_1.setTestProfileUseCase)((0, tasks_providers_1.tasksDepsOf)((0, helpers_1.fakePorts)(mem).ports, helpers_1.CTX), helpers_1.CTX, 't-1', PICK)];
            case 1:
                _a.apply(void 0, [_c.sent()]).toEqual({ kind: 'unreadable' });
                (0, testing_1.expect)(mem.files.get(helpers_1.CTX.file)).toBe('{bad');
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)("the task current in another worktree gets no profile from this folder's pick", function () { return __awaiter(void 0, void 0, void 0, function () {
    var ours, other, mem, set;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ours = (0, helpers_1.makeTask)({ id: 'ours', state: 'current' });
                other = (0, helpers_1.makeTask)({ id: 'other', state: 'current', worktreePath: '/worktrees/other' });
                mem = (0, helpers_1.memoryHost)({ files: withTasks([ours, other]) });
                return [4 /*yield*/, (0, set_test_profile_1.setTestProfileUseCase)((0, tasks_providers_1.tasksDepsOf)((0, helpers_1.fakePorts)(mem).ports, helpers_1.CTX), helpers_1.CTX, 'other', PICK)];
            case 1:
                set = _a.sent();
                (0, testing_1.expect)(set).toEqual({ kind: 'notCurrent' });
                (0, testing_1.expect)(stored(mem).tasks.map(function (t) { return t.testProfile; })).toEqual([undefined, undefined]);
                return [2 /*return*/];
        }
    });
}); });
// ── What the tool answers ──
var toolSetup = function (task, view) {
    live_1.live.ctx = helpers_1.CTX;
    var mem = (0, helpers_1.memoryHost)({ files: withTasks(task === null ? [] : [task]) });
    return __assign({ mem: mem }, (0, helpers_1.fakePorts)(mem, { view: __assign({ record: stored(mem) }, view) }));
};
(0, testing_1.test)('a saved pick answers that it was recorded, and the menu sees it at once', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, mem, ports, view, _b;
    var _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _a = toolSetup((0, helpers_1.makeTask)({ state: 'current' })), mem = _a.mem, ports = _a.ports, view = _a.view;
                _b = testing_1.expect;
                return [4 /*yield*/, (0, tasks_controller_1.setTestProfile)(ports, { profile: 'deep', reason: '  a new tool  ' })];
            case 1:
                _b.apply(void 0, [_f.sent()]).toBe(tasks_text_1.PROFILE_TEXT.saved('deep'));
                (0, testing_1.expect)((_c = stored(mem).tasks[0]) === null || _c === void 0 ? void 0 : _c.testProfile).toEqual({ id: 'deep', by: 'tea-dd', reason: 'a new tool' });
                (0, testing_1.expect)((_e = (_d = view.record) === null || _d === void 0 ? void 0 : _d.tasks[0]) === null || _e === void 0 ? void 0 : _e.testProfile).toEqual({ id: 'deep', by: 'tea-dd', reason: 'a new tool' });
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)("Rohan's pick stands, and the answer names it", function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, mem, ports, before, _b;
    var _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = toolSetup((0, helpers_1.makeTask)({ state: 'current', testProfile: { id: 'critical', by: 'rohan' } })), mem = _a.mem, ports = _a.ports;
                before = (_c = stored(mem).tasks[0]) === null || _c === void 0 ? void 0 : _c.testProfile;
                _b = testing_1.expect;
                return [4 /*yield*/, (0, tasks_controller_1.setTestProfile)(ports, { profile: 'quick', reason: 'only text' })];
            case 1:
                _b.apply(void 0, [_e.sent()]).toBe(tasks_text_1.PROFILE_TEXT.rohans('critical'));
                (0, testing_1.expect)((_d = stored(mem).tasks[0]) === null || _d === void 0 ? void 0 : _d.testProfile).toEqual(before);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a pick Rohan just made in the app stands, though the menu has not seen it yet', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, ports, _b;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ state: 'current' });
                _a = toolSetup(task), mem = _a.mem, ports = _a.ports;
                mem.files.set(helpers_1.CTX.file, JSON.stringify(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: [__assign(__assign({}, task), { testProfile: { id: 'release', by: 'rohan' } })] })));
                _b = testing_1.expect;
                return [4 /*yield*/, (0, tasks_controller_1.setTestProfile)(ports, { profile: 'quick', reason: 'only text' })];
            case 1:
                _b.apply(void 0, [_d.sent()]).toBe(tasks_text_1.PROFILE_TEXT.rohans('release'));
                (0, testing_1.expect)((_c = stored(mem).tasks[0]) === null || _c === void 0 ? void 0 : _c.testProfile).toEqual({ id: 'release', by: 'rohan' });
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('with no current task the tool says so and writes nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, mem, ports, before, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = toolSetup((0, helpers_1.makeTask)({ state: 'queued' })), mem = _a.mem, ports = _a.ports;
                before = mem.files.get(helpers_1.CTX.file);
                _b = testing_1.expect;
                return [4 /*yield*/, (0, tasks_controller_1.setTestProfile)(ports, { profile: 'deep', reason: 'x' })];
            case 1:
                _b.apply(void 0, [_c.sent()]).toBe(tasks_text_1.PROFILE_TEXT.noTask);
                (0, testing_1.expect)(mem.files.get(helpers_1.CTX.file)).toBe(before);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('an unknown profile is refused with the five names', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, mem, ports, before, _i, _b, input, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = toolSetup((0, helpers_1.makeTask)({ state: 'current' })), mem = _a.mem, ports = _a.ports;
                before = mem.files.get(helpers_1.CTX.file);
                _i = 0, _b = [{ profile: 'huge', reason: 'x' }, { profile: 'Deep', reason: 'x' }, { reason: 'x' }, null, 'deep'];
                _d.label = 1;
            case 1:
                if (!(_i < _b.length)) return [3 /*break*/, 4];
                input = _b[_i];
                _c = testing_1.expect;
                return [4 /*yield*/, (0, tasks_controller_1.setTestProfile)(ports, input)];
            case 2:
                _c.apply(void 0, [_d.sent()]).toBe(tasks_text_1.PROFILE_TEXT.problems.profile);
                _d.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4:
                (0, testing_1.expect)(mem.files.get(helpers_1.CTX.file)).toBe(before);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a reason that is missing, blank or longer than 160 characters is refused; 160 is kept', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, mem, ports, _i, _b, reason, _c, _d;
    var _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _a = toolSetup((0, helpers_1.makeTask)({ state: 'current' })), mem = _a.mem, ports = _a.ports;
                _i = 0, _b = [undefined, '', '   ', 42, 'x'.repeat(161)];
                _f.label = 1;
            case 1:
                if (!(_i < _b.length)) return [3 /*break*/, 4];
                reason = _b[_i];
                _c = testing_1.expect;
                return [4 /*yield*/, (0, tasks_controller_1.setTestProfile)(ports, { profile: 'deep', reason: reason })];
            case 2:
                _c.apply(void 0, [_f.sent()]).toBe(tasks_text_1.PROFILE_TEXT.problems.reason);
                _f.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4:
                (0, testing_1.expect)((_e = stored(mem).tasks[0]) === null || _e === void 0 ? void 0 : _e.testProfile).toBeUndefined();
                _d = testing_1.expect;
                return [4 /*yield*/, (0, tasks_controller_1.setTestProfile)(ports, { profile: 'deep', reason: 'é'.repeat(160) })];
            case 5:
                _d.apply(void 0, [_f.sent()]).toBe(tasks_text_1.PROFILE_TEXT.saved('deep'));
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a failed save answers that it failed and logs why', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, mem, ports, done, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = toolSetup((0, helpers_1.makeTask)({ state: 'current' })), mem = _a.mem, ports = _a.ports, done = _a.done;
                mem.host.run = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, ({ exitCode: 1, stdout: '', stderr: 'no' })];
                }); }); };
                _b = testing_1.expect;
                return [4 /*yield*/, (0, tasks_controller_1.setTestProfile)(ports, PICK_INPUT)];
            case 1:
                _b.apply(void 0, [_c.sent()]).toBe(tasks_text_1.PROFILE_TEXT.failed);
                (0, testing_1.expect)(done.logs.length).toBe(1);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('an unreadable record answers so, and is left as it was', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, mem, ports, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = toolSetup((0, helpers_1.makeTask)({ state: 'current' })), mem = _a.mem, ports = _a.ports;
                mem.files.set(helpers_1.CTX.file, '{bad');
                _b = testing_1.expect;
                return [4 /*yield*/, (0, tasks_controller_1.setTestProfile)(ports, PICK_INPUT)];
            case 1:
                _b.apply(void 0, [_c.sent()]).toBe(tasks_text_1.PROFILE_TEXT.unreadable);
                (0, testing_1.expect)(mem.files.get(helpers_1.CTX.file)).toBe('{bad');
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a task put back since the menu last read answers that it is no longer current', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, ports, _b;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ state: 'current' });
                _a = toolSetup(task), mem = _a.mem, ports = _a.ports;
                mem.files.set(helpers_1.CTX.file, JSON.stringify(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: [__assign(__assign({}, task), { state: 'queued' })] })));
                _b = testing_1.expect;
                return [4 /*yield*/, (0, tasks_controller_1.setTestProfile)(ports, PICK_INPUT)];
            case 1:
                _b.apply(void 0, [_d.sent()]).toBe(tasks_text_1.PROFILE_TEXT.notCurrent);
                (0, testing_1.expect)((_c = stored(mem).tasks[0]) === null || _c === void 0 ? void 0 : _c.testProfile).toBeUndefined();
                return [2 /*return*/];
        }
    });
}); });
var PICK_INPUT = { profile: PICK.id, reason: PICK.reason };
