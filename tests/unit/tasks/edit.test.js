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
var edit_task_1 = require("../../../hooks/features/tasks/domain/usecases/edit_task");
var file_task_1 = require("../../../hooks/features/tasks/domain/usecases/file_task");
var remove_task_1 = require("../../../hooks/features/tasks/domain/usecases/remove_task");
var restore_task_1 = require("../../../hooks/features/tasks/domain/usecases/restore_task");
var tasks_providers_1 = require("../../../hooks/features/tasks/tasks_providers");
var record_source_1 = require("../../../hooks/shared/records/data/datasources/record_source");
var helpers_1 = require("../../helpers");
var setup = function (tasks) {
    var _a;
    var mem = (0, helpers_1.memoryHost)({ files: (_a = {}, _a[helpers_1.CTX.file] = JSON.stringify(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), { tasks: tasks })), _a) });
    return { mem: mem, deps: (0, tasks_providers_1.tasksDepsOf)((0, helpers_1.fakePorts)(mem).ports, helpers_1.CTX) };
};
var onDisk = function (mem) {
    var read = (0, record_source_1.parseRecord)(mem.files.get(helpers_1.CTX.file));
    if (read === 'unreadable')
        throw new Error('should read');
    return read;
};
(0, testing_1.test)('an edit changes only what it names', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, deps;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'Old', description: 'Kept', difficulty: { expected: 'light', actual: null } });
                _a = setup([task]), mem = _a.mem, deps = _a.deps;
                return [4 /*yield*/, (0, edit_task_1.editTaskUseCase)(deps, task.id, { title: 'New', difficulty: 'hard', criteria: ['Passes'] })];
            case 1:
                _b.sent();
                (0, testing_1.expect)(onDisk(mem).tasks[0]).toMatchObject({ title: 'New', description: 'Kept', criteria: ['Passes'], difficulty: { expected: 'hard', actual: null } });
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a description can be cleared', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, deps;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ description: 'Gone soon' });
                _a = setup([task]), mem = _a.mem, deps = _a.deps;
                return [4 /*yield*/, (0, edit_task_1.editTaskUseCase)(deps, task.id, { description: null })];
            case 1:
                _c.sent();
                (0, testing_1.expect)((_b = onDisk(mem).tasks[0]) === null || _b === void 0 ? void 0 : _b.description).toBe(null);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a finished task keeps what it said', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, deps;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ state: 'done', title: 'Won' });
                _a = setup([task]), mem = _a.mem, deps = _a.deps;
                return [4 /*yield*/, (0, edit_task_1.editTaskUseCase)(deps, task.id, { title: 'Changed' })];
            case 1:
                _c.sent();
                (0, testing_1.expect)((_b = onDisk(mem).tasks[0]) === null || _b === void 0 ? void 0 : _b.title).toBe('Won');
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a removed task comes back to the queue', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, deps;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                task = (0, helpers_1.makeTask)();
                _a = setup([task]), mem = _a.mem, deps = _a.deps;
                return [4 /*yield*/, (0, remove_task_1.removeTaskUseCase)(deps, task.id)];
            case 1:
                _d.sent();
                (0, testing_1.expect)((_b = onDisk(mem).tasks[0]) === null || _b === void 0 ? void 0 : _b.state).toBe('removed');
                return [4 /*yield*/, (0, restore_task_1.restoreTaskUseCase)(deps, task.id)];
            case 2:
                _d.sent();
                (0, testing_1.expect)((_c = onDisk(mem).tasks[0]) === null || _c === void 0 ? void 0 : _c.state).toBe('queued');
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('restoring leaves a task that was not removed as it is', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, deps;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ state: 'done' });
                _a = setup([task]), mem = _a.mem, deps = _a.deps;
                return [4 /*yield*/, (0, restore_task_1.restoreTaskUseCase)(deps, task.id)];
            case 1:
                _c.sent();
                (0, testing_1.expect)((_b = onDisk(mem).tasks[0]) === null || _b === void 0 ? void 0 : _b.state).toBe('done');
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a task can be filed with its description and criteria', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, mem, deps;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = setup([]), mem = _a.mem, deps = _a.deps;
                return [4 /*yield*/, (0, file_task_1.fileTaskUseCase)(deps, helpers_1.CTX, { text: 'A', title: 'A', priority: 'mid', difficulty: 'light', intent: 'improving', description: 'Why', criteria: ['Done when'] })];
            case 1:
                _b.sent();
                (0, testing_1.expect)(onDisk(mem).tasks[0]).toMatchObject({ title: 'A', description: 'Why', criteria: ['Done when'], state: 'queued' });
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a task filed without them has neither', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, mem, deps;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = setup([]), mem = _a.mem, deps = _a.deps;
                return [4 /*yield*/, (0, file_task_1.fileTaskUseCase)(deps, helpers_1.CTX, { text: 'A', title: 'A', priority: 'mid', difficulty: 'light', intent: 'improving' })];
            case 1:
                _b.sent();
                (0, testing_1.expect)(onDisk(mem).tasks[0]).toMatchObject({ description: null, criteria: [] });
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('filing without helpers gives Tea-DD on', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, mem, deps;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = setup([]), mem = _a.mem, deps = _a.deps;
                return [4 /*yield*/, (0, file_task_1.fileTaskUseCase)(deps, helpers_1.CTX, { text: 'x', title: 'X', priority: 'mid', difficulty: 'medium', intent: 'improving' })];
            case 1:
                _c.sent();
                (0, testing_1.expect)((_b = onDisk(mem).tasks[0]) === null || _b === void 0 ? void 0 : _b.helpers).toEqual({ on: ['tea-dd'], ran: [], reminded: false });
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('filing with helpers saves them as the on list', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, mem, deps;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = setup([]), mem = _a.mem, deps = _a.deps;
                return [4 /*yield*/, (0, file_task_1.fileTaskUseCase)(deps, helpers_1.CTX, { text: 'x', title: 'X', priority: 'mid', difficulty: 'medium', intent: 'improving', helpers: ['commit-chai-n'] })];
            case 1:
                _c.sent();
                (0, testing_1.expect)((_b = onDisk(mem).tasks[0]) === null || _b === void 0 ? void 0 : _b.helpers.on).toEqual(['commit-chai-n']);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('editing helpers keeps what ran and the reminder', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, deps;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ helpers: { on: ['tea-dd'], ran: ['tea-dd'], reminded: true } });
                _a = setup([task]), mem = _a.mem, deps = _a.deps;
                return [4 /*yield*/, (0, edit_task_1.editTaskUseCase)(deps, task.id, { helpers: [] })];
            case 1:
                _c.sent();
                (0, testing_1.expect)((_b = onDisk(mem).tasks[0]) === null || _b === void 0 ? void 0 : _b.helpers).toEqual({ on: [], ran: ['tea-dd'], reminded: true });
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a finished task keeps its helpers', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, deps;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ state: 'done', helpers: { on: ['tea-dd'], ran: [], reminded: false } });
                _a = setup([task]), mem = _a.mem, deps = _a.deps;
                return [4 /*yield*/, (0, edit_task_1.editTaskUseCase)(deps, task.id, { helpers: [] })];
            case 1:
                _c.sent();
                (0, testing_1.expect)((_b = onDisk(mem).tasks[0]) === null || _b === void 0 ? void 0 : _b.helpers.on).toEqual(['tea-dd']);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)("picking a profile in an edit makes it Rohan's, over Tea-DD's", function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, deps;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ testProfile: { id: 'standard', by: 'tea-dd', reason: 'one feature' } });
                _a = setup([task]), mem = _a.mem, deps = _a.deps;
                return [4 /*yield*/, (0, edit_task_1.editTaskUseCase)(deps, task.id, { testProfile: 'critical' })];
            case 1:
                _c.sent();
                (0, testing_1.expect)((_b = onDisk(mem).tasks[0]) === null || _b === void 0 ? void 0 : _b.testProfile).toEqual({ id: 'critical', by: 'rohan' });
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a null profile lets Tea-DD pick again: the profile is gone', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, deps;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ state: 'current', testProfile: { id: 'quick', by: 'rohan' } });
                _a = setup([task]), mem = _a.mem, deps = _a.deps;
                return [4 /*yield*/, (0, edit_task_1.editTaskUseCase)(deps, task.id, { testProfile: null })];
            case 1:
                _c.sent();
                (0, testing_1.expect)((_b = onDisk(mem).tasks[0]) === null || _b === void 0 ? void 0 : _b.testProfile).toBeUndefined();
                (0, testing_1.expect)(Object.keys(JSON.parse(mem.files.get(helpers_1.CTX.file)).tasks[0])).not.toContain('testProfile');
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('an edit that names no profile keeps the one there', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, deps;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ testProfile: { id: 'deep', by: 'tea-dd', reason: 'a new tool' } });
                _a = setup([task]), mem = _a.mem, deps = _a.deps;
                return [4 /*yield*/, (0, edit_task_1.editTaskUseCase)(deps, task.id, { title: 'Renamed' })];
            case 1:
                _c.sent();
                (0, testing_1.expect)((_b = onDisk(mem).tasks[0]) === null || _b === void 0 ? void 0 : _b.testProfile).toEqual({ id: 'deep', by: 'tea-dd', reason: 'a new tool' });
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a finished task keeps its profile', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, deps;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ state: 'done', testProfile: { id: 'deep', by: 'tea-dd', reason: 'a new tool' } });
                _a = setup([task]), mem = _a.mem, deps = _a.deps;
                return [4 /*yield*/, (0, edit_task_1.editTaskUseCase)(deps, task.id, { testProfile: null })];
            case 1:
                _c.sent();
                return [4 /*yield*/, (0, edit_task_1.editTaskUseCase)(deps, task.id, { testProfile: 'quick' })];
            case 2:
                _c.sent();
                (0, testing_1.expect)((_b = onDisk(mem).tasks[0]) === null || _b === void 0 ? void 0 : _b.testProfile).toEqual({ id: 'deep', by: 'tea-dd', reason: 'a new tool' });
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a due date is set, moved and cleared, and clearing leaves no field behind', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, deps;
    var _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ title: 'Ship' });
                _a = setup([task]), mem = _a.mem, deps = _a.deps;
                return [4 /*yield*/, (0, edit_task_1.editTaskUseCase)(deps, task.id, { due: '2026-12-01' })];
            case 1:
                _e.sent();
                (0, testing_1.expect)((_b = onDisk(mem).tasks[0]) === null || _b === void 0 ? void 0 : _b.due).toBe('2026-12-01');
                return [4 /*yield*/, (0, edit_task_1.editTaskUseCase)(deps, task.id, { title: 'Ship it' })];
            case 2:
                _e.sent();
                (0, testing_1.expect)(onDisk(mem).tasks[0]).toMatchObject({ title: 'Ship it', due: '2026-12-01' });
                return [4 /*yield*/, (0, edit_task_1.editTaskUseCase)(deps, task.id, { due: '2026-12-08' })];
            case 3:
                _e.sent();
                (0, testing_1.expect)((_c = onDisk(mem).tasks[0]) === null || _c === void 0 ? void 0 : _c.due).toBe('2026-12-08');
                return [4 /*yield*/, (0, edit_task_1.editTaskUseCase)(deps, task.id, { due: null })];
            case 4:
                _e.sent();
                (0, testing_1.expect)(Object.keys((_d = onDisk(mem).tasks[0]) !== null && _d !== void 0 ? _d : {})).not.toContain('due');
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('clearing a due date keeps the test profile, and the other way round', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, deps;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ due: '2026-12-01', testProfile: { id: 'deep', by: 'rohan' } });
                _a = setup([task]), mem = _a.mem, deps = _a.deps;
                return [4 /*yield*/, (0, edit_task_1.editTaskUseCase)(deps, task.id, { due: null })];
            case 1:
                _d.sent();
                (0, testing_1.expect)((_b = onDisk(mem).tasks[0]) === null || _b === void 0 ? void 0 : _b.testProfile).toEqual({ id: 'deep', by: 'rohan' });
                return [4 /*yield*/, (0, edit_task_1.editTaskUseCase)(deps, task.id, { due: '2026-12-02', testProfile: null })];
            case 2:
                _d.sent();
                (0, testing_1.expect)(onDisk(mem).tasks[0]).toMatchObject({ due: '2026-12-02' });
                (0, testing_1.expect)((_c = onDisk(mem).tasks[0]) === null || _c === void 0 ? void 0 : _c.testProfile).toBeUndefined();
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a finished task keeps its due date', function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a, mem, deps;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                task = (0, helpers_1.makeTask)({ state: 'done', due: '2026-11-01' });
                _a = setup([task]), mem = _a.mem, deps = _a.deps;
                return [4 /*yield*/, (0, edit_task_1.editTaskUseCase)(deps, task.id, { due: '2026-12-01' })];
            case 1:
                _c.sent();
                (0, testing_1.expect)((_b = onDisk(mem).tasks[0]) === null || _b === void 0 ? void 0 : _b.due).toBe('2026-11-01');
                return [2 /*return*/];
        }
    });
}); });
