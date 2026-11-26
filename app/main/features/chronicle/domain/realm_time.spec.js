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
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var effort_tracker_1 = require("../../../../../hooks/shared/effort/domain/services/effort_tracker");
var leave_codex_1 = require("../../../../../hooks/features/tasks/domain/usecases/leave_codex");
var record_source_1 = require("../../../../../hooks/shared/records/data/datasources/record_source");
var week_stats_1 = require("../../../../../hooks/shared/time/domain/services/week_stats");
var node_host_1 = require("../../../core/node_host");
var fixtures_1 = require("../../tasks/api/fixtures");
var mana_1 = require("../../mana/domain/mana");
var chronicle_1 = require("./chronicle");
var DAY = '2026-11-19';
var MINUTE = 60000;
var at = function (hour) { return Date.parse("".concat(DAY, "T00:00:00Z")) + hour * 60 * MINUTE; };
var folders = [];
(0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.all(folders.splice(0).map(function (folder) { return (0, promises_1.rm)(folder, { recursive: true, force: true }); }))];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
var store = function (record) { return __awaiter(void 0, void 0, void 0, function () {
    var folder, file, quiet, host;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-realm-time-'))];
            case 1:
                folder = _a.sent();
                folders.push(folder);
                file = (0, node_path_1.join)(folder, 'record.json');
                return [4 /*yield*/, (0, promises_1.writeFile)(file, JSON.stringify(record))];
            case 2:
                _a.sent();
                quiet = function () { };
                host = (0, node_host_1.nodeHost)({ debug: quiet, warn: quiet, error: quiet }, function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, ({ exitCode: 0, stdout: '', stderr: '' })];
                }); }); });
                return [2 /*return*/, { file: file, host: host }];
        }
    });
}); };
var realm = function (name) {
    if (name === void 0) { name = 'demo'; }
    return (__assign(__assign({}, (0, record_source_1.emptyRecord)(name, "/p/".concat(name))), { tasks: ['one', 'two'].map(function (id) { return (0, fixtures_1.makeTask)({ id: id, title: id, state: 'current', worktreePath: "/trees/".concat(id) }); }) }));
};
var pending = function (start, end, elsewhere, offset) {
    if (elsewhere === void 0) { elsewhere = false; }
    if (offset === void 0) { offset = 0; }
    var tracker = (0, effort_tracker_1.createTracker)(15, offset);
    if (elsewhere)
        tracker.route('project');
    tracker.activity(start);
    for (var time = start + 15 * MINUTE; time < end; time += 15 * MINUTE)
        tracker.activity(time);
    tracker.activity(end);
    return tracker.take();
};
var add = function (record, id, start, end, elsewhere, offset) {
    if (elsewhere === void 0) { elsewhere = false; }
    if (offset === void 0) { offset = 0; }
    return (0, effort_tracker_1.applyPending)(record, pending(start, end, elsewhere, offset), undefined, { projectPath: record.project.path, cwd: "/trees/".concat(id) });
};
(0, vitest_1.describe)('daily work time in a Realm', function () {
    (0, vitest_1.it)('merges 1–4 pm and 2–5 pm into four Realm hours and keeps three hours on each task', function () {
        var record = add(add(realm(), 'one', at(13), at(16)), 'two', at(14), at(17));
        var view = (0, mana_1.manaOf)(record, DAY);
        (0, vitest_1.expect)(view.today).toEqual({ day: DAY, onQuests: 240, elsewhere: 0 });
        (0, vitest_1.expect)(view.weekMinutes).toBe(240);
        (0, vitest_1.expect)(view.byQuest.map(function (row) { return row.minutes; })).toEqual([180, 180]);
        (0, vitest_1.expect)((0, chronicle_1.chronicleOf)([record], DAY, DAY).minutes).toBe(240);
        (0, vitest_1.expect)((0, week_stats_1.weekMinutes)(record.tasks, record.unassignedMinutesByDay, DAY, record.realmTime)[3]).toBe(240);
    });
    (0, vitest_1.it)('preserves gaps, joins touching periods and ignores nested overlaps regardless of arrival order', function () {
        var record = add(realm(), 'two', at(14), at(15));
        record = add(record, 'one', at(9), at(10));
        record = add(record, 'two', at(9.25), at(9.75));
        record = add(record, 'one', at(10), at(11));
        (0, vitest_1.expect)((0, chronicle_1.dayTimeOf)([record], DAY).onQuests).toBe(180);
        (0, vitest_1.expect)((0, mana_1.manaOf)(record, DAY).byQuest.map(function (row) { return row.minutes; })).toEqual([120, 90]);
    });
    (0, vitest_1.it)('keeps each Realm independent when work overlaps across projects', function () {
        var first = add(realm('first'), 'one', at(13), at(16));
        var second = add(realm('second'), 'one', at(14), at(17));
        (0, vitest_1.expect)((0, mana_1.manaOf)(first, DAY).weekMinutes).toBe(180);
        (0, vitest_1.expect)((0, mana_1.manaOf)(second, DAY).weekMinutes).toBe(180);
    });
    (0, vitest_1.it)('counts Elsewhere only once when it overlaps task work, without reducing the saved task time', function () {
        var record = add(add(realm(), 'one', at(13), at(16)), 'two', at(14), at(17), true);
        (0, vitest_1.expect)((0, chronicle_1.dayTimeOf)([record], DAY)).toEqual({ day: DAY, onQuests: 180, elsewhere: 60 });
        (0, vitest_1.expect)(record.tasks[0].minutesByDay[DAY]).toBe(180);
        (0, vitest_1.expect)(record.unassignedMinutesByDay[DAY]).toBe(180);
    });
    (0, vitest_1.it)('preserves earlier recorded minutes that have no periods, including a write from an older tracker', function () {
        var record = realm();
        record.tasks[0].minutesByDay[DAY] = 25;
        record.unassignedMinutesByDay[DAY] = 10;
        record = add(add(record, 'one', at(13), at(16)), 'two', at(14), at(17));
        (0, vitest_1.expect)((0, mana_1.manaOf)(record, DAY).weekMinutes).toBe(275);
        record.tasks[1].minutesByDay[DAY] += 7;
        (0, vitest_1.expect)((0, mana_1.manaOf)(record, DAY).weekMinutes).toBe(282);
    });
    (0, vitest_1.it)('splits Realm work at local midnight while leaving the task accounting rule intact', function () {
        var start = Date.parse('2026-11-19T21:55:00Z');
        var record = add(realm(), 'one', start, start + 10 * MINUTE, false, 120);
        (0, vitest_1.expect)((0, chronicle_1.dayTimeOf)([record], DAY).onQuests).toBe(5);
        (0, vitest_1.expect)((0, chronicle_1.dayTimeOf)([record], '2026-11-20').onQuests).toBe(5);
        (0, vitest_1.expect)(record.tasks[0].minutesByDay).toEqual({ '2026-11-20': 10 });
    });
    (0, vitest_1.it)('does not turn a long idle gap into continuous work', function () {
        var tracker = (0, effort_tracker_1.createTracker)(15, 0);
        for (var _i = 0, _a = [at(9), at(9.25), at(14), at(14.25)]; _i < _a.length; _i++) {
            var time = _a[_i];
            tracker.activity(time);
        }
        var record = (0, effort_tracker_1.applyPending)(realm(), tracker.take(), undefined, { cwd: '/trees/one', projectPath: '/p/demo' });
        (0, vitest_1.expect)((0, mana_1.manaOf)(record, DAY).weekMinutes).toBe(30);
    });
    (0, vitest_1.it)('survives serialization, a restarted tracker and two concurrent writers to the same record', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, file, host, record, _b, resumed;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, store(realm())];
                case 1:
                    _a = _c.sent(), file = _a.file, host = _a.host;
                    return [4 /*yield*/, Promise.all([
                            (0, record_source_1.updateRecord)(host, file, function (r) { return add(r, 'one', at(13), at(16)); }, 'demo', '/p/demo'),
                            (0, record_source_1.updateRecord)(host, file, function (r) { return add(r, 'two', at(14), at(17)); }, 'demo', '/p/demo'),
                        ])];
                case 2:
                    _c.sent();
                    _b = record_source_1.parseRecord;
                    return [4 /*yield*/, (0, promises_1.readFile)(file, 'utf8')];
                case 3:
                    record = _b.apply(void 0, [_c.sent()]);
                    (0, vitest_1.expect)(record).not.toBe('unreadable');
                    if (record === 'unreadable')
                        throw new Error('Saved record did not load');
                    (0, vitest_1.expect)((0, mana_1.manaOf)(record, DAY).weekMinutes).toBe(240);
                    resumed = add(record, 'one', at(17), at(18));
                    (0, vitest_1.expect)((0, mana_1.manaOf)(resumed, DAY).weekMinutes).toBe(300);
                    (0, vitest_1.expect)(resumed.tasks.map(function (task) { return task.minutesByDay[DAY]; })).toEqual([240, 180]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('merges returned Codex activity with live Claude activity and imports a concurrent return once', function () { return __awaiter(void 0, void 0, void 0, function () {
        var initial, _a, file, host, stamps, deps, ctx, saved, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    initial = add(realm(), 'one', at(13), at(16));
                    initial.tasks[1].codexSince = new Date(at(14)).toISOString();
                    return [4 /*yield*/, store(initial)];
                case 1:
                    _a = _c.sent(), file = _a.file, host = _a.host;
                    stamps = Array.from({ length: 13 }, function (_, index) { return at(14) + index * 15 * MINUTE; });
                    deps = {
                        records: {
                            read: function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _a = record_source_1.parseRecord;
                                        return [4 /*yield*/, (0, promises_1.readFile)(file, 'utf8')];
                                    case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                                }
                            }); }); },
                            update: function (change) { return (0, record_source_1.updateRecord)(host, file, change, 'demo', '/p/demo'); },
                        },
                        codex: { activitySince: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, stamps];
                            }); }); } },
                        env: { now: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, at(17)];
                            }); }); }, log: function () { } },
                    };
                    ctx = {
                        projectPath: '/p/demo', projectName: 'demo', cwd: '/trees/two', home: (0, node_os_1.tmpdir)(),
                        file: file,
                        offsetMinutes: 0,
                        options: { idleGapMinutes: 15, freshAtTokens: 100000, handoffAtPercent: 90, checkTimeoutSeconds: 10 },
                    };
                    return [4 /*yield*/, Promise.all([(0, leave_codex_1.leaveCodexUseCase)(deps, ctx, 'two'), (0, leave_codex_1.leaveCodexUseCase)(deps, ctx, 'two')])];
                case 2:
                    _c.sent();
                    _b = record_source_1.parseRecord;
                    return [4 /*yield*/, (0, promises_1.readFile)(file, 'utf8')];
                case 3:
                    saved = _b.apply(void 0, [_c.sent()]);
                    if (saved === 'unreadable')
                        throw new Error('Codex record did not load');
                    (0, vitest_1.expect)((0, mana_1.manaOf)(saved, DAY).weekMinutes).toBe(240);
                    (0, vitest_1.expect)(saved.tasks.map(function (task) { return task.minutesByDay[DAY]; })).toEqual([180, 180]);
                    (0, vitest_1.expect)(saved.tasks[1].codexSince).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('stores adjacent activity compactly instead of saving every tool stamp', function () {
        var _a, _b;
        var record = add(realm(), 'one', at(13), at(16));
        (0, vitest_1.expect)((_b = (_a = record.realmTime) === null || _a === void 0 ? void 0 : _a.days[DAY]) === null || _b === void 0 ? void 0 : _b.onQuests).toEqual([{ start: at(13), end: at(16) }]);
    });
    (0, vitest_1.it)('preserves older records, but refuses malformed saved work periods', function () {
        (0, vitest_1.expect)((0, record_source_1.parseRecord)(JSON.stringify(realm()))).not.toBe('unreadable');
        var record = add(realm(), 'one', at(13), at(16));
        var malformed = JSON.parse(JSON.stringify(record));
        malformed.realmTime.days[DAY].onQuests[0].end = 'not a time';
        (0, vitest_1.expect)((0, record_source_1.parseRecord)(JSON.stringify(malformed))).toBe('unreadable');
    });
});
