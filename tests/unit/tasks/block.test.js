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
var queue_controller_1 = require("../../../hooks/features/tasks/presentation/state_management/queue_controller");
var tasks_controller_1 = require("../../../hooks/features/tasks/presentation/state_management/tasks_controller");
var record_source_1 = require("../../../hooks/shared/records/data/datasources/record_source");
var helpers_1 = require("../../helpers");
var OID = '# branch.oid 1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b';
var CLEAN = [OID, '# branch.head main', '# branch.upstream origin/main', '# branch.ab +0 -0', ''].join('\n');
var stored = function (mem) { return JSON.parse(mem.files.get(helpers_1.CTX.file)); };
var setup = function (tasks, more, git) {
    var _a;
    if (more === void 0) { more = {}; }
    if (git === void 0) { git = {}; }
    var r = __assign(__assign(__assign({}, (0, record_source_1.emptyRecord)('p', '/p')), more), { tasks: tasks });
    var mem = (0, helpers_1.memoryHost)({
        files: (_a = {}, _a[helpers_1.CTX.file] = JSON.stringify(r), _a),
        git: __assign({ 'git rev-parse --is-inside-work-tree': { stdout: 'true\n' }, 'git status --porcelain=v2 --branch': { stdout: CLEAN }, 'git branch --format=%(refname:short)': { stdout: 'main\n' } }, git),
    });
    return __assign({ mem: mem }, (0, helpers_1.fakePorts)(mem, { view: { record: r } }));
};
(0, testing_1.test)('a queued task can wait for another, and Unblock clears it', function () { return __awaiter(void 0, void 0, void 0, function () {
    var a, b, _a, mem, ports;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                a = (0, helpers_1.makeTask)({ title: 'A' });
                b = (0, helpers_1.makeTask)({ title: 'B' });
                _a = setup([a, b]), mem = _a.mem, ports = _a.ports;
                return [4 /*yield*/, (0, queue_controller_1.blockTask)(ports, helpers_1.CTX, b.id, { waitFor: a.id })];
            case 1:
                _b.sent();
                (0, testing_1.expect)(stored(mem).tasks[1].blockedBy).toEqual([a.id]);
                return [4 /*yield*/, (0, queue_controller_1.unblockTask)(ports, helpers_1.CTX, b.id)];
            case 2:
                _b.sent();
                (0, testing_1.expect)([stored(mem).tasks[1].blockedBy, stored(mem).tasks[1].blockedReason]).toEqual([[], null]);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a wait that would loop is refused and said so', function () { return __awaiter(void 0, void 0, void 0, function () {
    var a, b, _a, mem, ports, view;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                a = (0, helpers_1.makeTask)({ title: 'A' });
                b = (0, helpers_1.makeTask)({ title: 'B', blockedBy: [a.id] });
                _a = setup([a, b]), mem = _a.mem, ports = _a.ports, view = _a.view;
                return [4 /*yield*/, (0, queue_controller_1.blockTask)(ports, helpers_1.CTX, a.id, { waitFor: b.id })];
            case 1:
                _b.sent();
                (0, testing_1.expect)(stored(mem).tasks[0].blockedBy).toEqual([]);
                (0, testing_1.expect)(view.notice).toBe('That would make the two tasks wait for each other.');
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('blocking the current task puts it back blocked, with a checkpoint asked for', function () { return __awaiter(void 0, void 0, void 0, function () {
    var now, _a, mem, ports, done;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                now = (0, helpers_1.makeTask)({ title: 'Now', state: 'current', branch: 'task/now' });
                _a = setup([now]), mem = _a.mem, ports = _a.ports, done = _a.done;
                return [4 /*yield*/, (0, queue_controller_1.blockTask)(ports, helpers_1.CTX, now.id, { reason: 'waiting for the API key' })];
            case 1:
                _b.sent();
                (0, testing_1.expect)([stored(mem).tasks[0].state, stored(mem).tasks[0].blockedReason]).toEqual(['queued', 'waiting for the API key']);
                (0, testing_1.expect)(done.toasts).toEqual(['Blocked: Now']);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a blocked task does not start', function () { return __awaiter(void 0, void 0, void 0, function () {
    var a, _a, mem, ports, view, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                a = (0, helpers_1.makeTask)({ title: 'A', blockedReason: 'later' });
                _a = setup([a]), mem = _a.mem, ports = _a.ports, view = _a.view;
                _b = testing_1.expect;
                return [4 /*yield*/, (0, tasks_controller_1.startTask)(ports, helpers_1.CTX, a.id)];
            case 1:
                _b.apply(void 0, [_c.sent()]).toBe('failed');
                (0, testing_1.expect)(stored(mem).tasks[0].state).toBe('queued');
                (0, testing_1.expect)(view.notice).toBe('A is blocked: later. Unblock it first.');
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('Play next is set, taken off, and cleared when its task starts', function () { return __awaiter(void 0, void 0, void 0, function () {
    var a, _a, mem, ports, settle, _b, saved;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                a = (0, helpers_1.makeTask)({ title: 'A' });
                _a = setup([a], {}, { 'git switch -c task/a': {}, 'git rev-parse HEAD': { stdout: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b\n' } }), mem = _a.mem, ports = _a.ports, settle = _a.settle;
                return [4 /*yield*/, (0, queue_controller_1.togglePlayNext)(ports, helpers_1.CTX, a.id)];
            case 1:
                _c.sent();
                (0, testing_1.expect)(stored(mem).playNext).toBe(a.id);
                return [4 /*yield*/, (0, queue_controller_1.togglePlayNext)(ports, helpers_1.CTX, a.id)];
            case 2:
                _c.sent();
                (0, testing_1.expect)(stored(mem).playNext).toBeNull();
                return [4 /*yield*/, (0, queue_controller_1.togglePlayNext)(ports, helpers_1.CTX, a.id)];
            case 3:
                _c.sent();
                _b = testing_1.expect;
                return [4 /*yield*/, (0, tasks_controller_1.startTask)(ports, helpers_1.CTX, a.id)];
            case 4:
                _b.apply(void 0, [_c.sent()]).toBe('started');
                return [4 /*yield*/, settle()];
            case 5:
                _c.sent();
                saved = stored(mem);
                (0, testing_1.expect)(saved.playNext).toBeNull();
                (0, testing_1.expect)([saved.tasks[0].baseBranch, saved.tasks[0].startCommit]).toEqual(['main', '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b']);
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('a put-back task whose branch is gone starts again on a new branch from here', function () { return __awaiter(void 0, void 0, void 0, function () {
    var a, _a, mem, ports, view, _b, saved;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                a = (0, helpers_1.makeTask)({ title: 'A', branch: 'task/a', baseBranch: 'dev', startCommit: '0f0f0f0' });
                _a = setup([a], {}, { 'git switch -c task/a': {}, 'git rev-parse HEAD': { stdout: 'abcdef1234\n' } }), mem = _a.mem, ports = _a.ports, view = _a.view;
                _b = testing_1.expect;
                return [4 /*yield*/, (0, tasks_controller_1.startTask)(ports, helpers_1.CTX, a.id)];
            case 1:
                _b.apply(void 0, [_c.sent()]).toBe('started');
                saved = stored(mem).tasks[0];
                (0, testing_1.expect)([saved.branch, saved.baseBranch, saved.startCommit]).toEqual(['task/a', 'main', 'abcdef1234']);
                (0, testing_1.expect)(view.notice).toBe('task/a was gone, so this task starts again on task/a, made from main.');
                return [2 /*return*/];
        }
    });
}); });
(0, testing_1.test)('putting back keeps a task unblocked unless asked', function () { return __awaiter(void 0, void 0, void 0, function () {
    var now, _a, mem, ports;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                now = (0, helpers_1.makeTask)({ title: 'Now', state: 'current' });
                _a = setup([now]), mem = _a.mem, ports = _a.ports;
                return [4 /*yield*/, (0, tasks_controller_1.putBack)(ports, helpers_1.CTX)];
            case 1:
                _b.sent();
                (0, testing_1.expect)([stored(mem).tasks[0].blockedBy, stored(mem).tasks[0].blockedReason]).toEqual([[], null]);
                return [2 /*return*/];
        }
    });
}); });
