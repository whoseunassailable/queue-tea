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
var start_task_1 = require("../../../../../hooks/features/tasks/domain/usecases/start_task");
var record_source_1 = require("../../../../../hooks/shared/records/data/datasources/record_source");
var fixtures_1 = require("../api/fixtures");
var ctx = { cwd: '/repo', home: '/home', projectPath: '/repo', projectName: 'repo', file: '/record', offsetMinutes: 0, options: { idleGapMinutes: 15, freshAtTokens: 100000, handoffAtPercent: 90, checkTimeoutSeconds: 10 } };
// All git calls are fakes: these tests never create or switch real branches.
var setup = function (over) {
    if (over === void 0) { over = {}; }
    var record = __assign(__assign({}, (0, record_source_1.emptyRecord)('repo', '/repo')), { tasks: [(0, fixtures_1.makeTask)(__assign({ id: 'one', title: 'Task activity' }, over))] });
    var id = 0;
    var d = {
        records: {
            read: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, record];
            }); }); },
            update: vitest_1.vi.fn(function (change) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, (record = change(record))];
            }); }); }),
            problem: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, null];
            }); }); }, restore: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, 'no-copy'];
            }); }); }, others: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, []];
            }); }); },
        },
        git: {
            state: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, ({ isRepo: true, branch: 'main', head: 'abc1234', isDetached: false, uncommitted: 0, unpushed: 0, hasUpstream: true })];
            }); }); },
            branches: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, ['main', 'task/resumed']];
            }); }); }, head: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, ({ commit: 'a'.repeat(40), branch: 'main' })];
            }); }); },
            make: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/];
            }); }); }), switchTo: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/];
            }); }); }), facts: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, null];
            }); }); },
            diffSince: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, ({ linesAdded: 0, linesRemoved: 0, filesTouched: 0 })];
            }); }); }, drift: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, []];
            }); }); }, commitsBetween: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, []];
            }); }); },
        },
        taskLog: {},
        codex: { activitySince: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, []];
            }); }); } },
        env: { now: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, Date.parse('2026-11-04T12:00:00Z')];
            }); }); }, newId: function () { return "activity-".concat(++id); }, log: vitest_1.vi.fn() },
    };
    return { d: d, record: function () { return record; } };
};
(0, vitest_1.describe)('branch activity', function () {
    (0, vitest_1.it)('shows switching to a new branch as the step once it is created', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, d, record, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = setup(), d = _a.d, record = _a.record;
                    _b = vitest_1.expect;
                    return [4 /*yield*/, (0, start_task_1.startTaskUseCase)(d, ctx, 'one')];
                case 1:
                    _b.apply(void 0, [(_c.sent()).kind]).toBe('started');
                    (0, vitest_1.expect)(record().tasks[0].step).toMatchObject({ kind: 'branchSwitched', status: 'succeeded', subject: 'task/task-activity' });
                    (0, vitest_1.expect)(record().tasks[0].step).not.toHaveProperty('output');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('records only switching when resuming an existing branch', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, d, record;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = setup({ branch: 'task/resumed' }), d = _a.d, record = _a.record;
                    return [4 /*yield*/, (0, start_task_1.startTaskUseCase)(d, ctx, 'one')];
                case 1:
                    _b.sent();
                    (0, vitest_1.expect)(record().tasks[0].step).toMatchObject({ kind: 'branchSwitched', subject: 'task/resumed' });
                    (0, vitest_1.expect)(d.git.make).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('records no successful step when git fails and returns the task to the queue', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, d, record, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = setup(), d = _a.d, record = _a.record;
                    vitest_1.vi.mocked(d.git.make).mockRejectedValue(new Error('git failed'));
                    _b = vitest_1.expect;
                    return [4 /*yield*/, (0, start_task_1.startTaskUseCase)(d, ctx, 'one')];
                case 1:
                    _b.apply(void 0, [(_c.sent()).kind]).toBe('branch_failed');
                    (0, vitest_1.expect)(record().tasks[0]).toMatchObject({ state: 'queued', branch: null });
                    (0, vitest_1.expect)(record().tasks[0].step).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('does not repeat a successful branch operation if recording its activity fails', function () { return __awaiter(void 0, void 0, void 0, function () {
        var d, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    d = setup().d;
                    vitest_1.vi.mocked(d.records.update).mockImplementationOnce(function (change) { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = change;
                                return [4 /*yield*/, d.records.read()];
                            case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                        }
                    }); }); }).mockRejectedValueOnce(new Error('record unavailable'));
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, start_task_1.startTaskUseCase)(d, ctx, 'one')];
                case 1:
                    _a.apply(void 0, [(_b.sent()).kind]).toBe('started');
                    (0, vitest_1.expect)(d.git.make).toHaveBeenCalledTimes(1);
                    (0, vitest_1.expect)(d.env.log).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
