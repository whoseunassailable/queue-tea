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
var checkpoints_1 = require("../../../../../hooks/shared/checkpoints/domain/services/checkpoints");
var record_source_1 = require("../../../../../hooks/shared/records/data/datasources/record_source");
var logger_1 = require("../../../core/logger");
var node_host_1 = require("../../../core/node_host");
var back_api_1 = require("./back_api");
var fixtures_1 = require("./fixtures");
var KEY = 'demo-abc123';
var NOW = Date.parse('2026-10-27T17:50:00Z');
var PATH = '/p/demo';
var home;
var file;
var deps;
var seed = function (over) { return (0, promises_1.writeFile)(file, JSON.stringify(__assign(__assign({}, (0, record_source_1.emptyRecord)('demo', PATH)), over))); };
var onDisk = function () { return __awaiter(void 0, void 0, void 0, function () {
    var read, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = record_source_1.parseRecord;
                return [4 /*yield*/, (0, promises_1.readFile)(file, 'utf8')];
            case 1:
                read = _a.apply(void 0, [_b.sent()]);
                if (read === 'unreadable')
                    throw new Error('should read');
                return [2 /*return*/, read];
        }
    });
}); };
var data = function (answer) {
    if (!answer.ok)
        throw new Error("should succeed: ".concat(answer.error.message));
    return answer.data;
};
var session = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, '.queue-tea/sessions'), { recursive: true })];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(home, '.queue-tea/sessions/s-1.json'), JSON.stringify({ id: 's-1', projectPath: PATH, recordFile: file, currentTaskId: 'one', isTurnRunning: false, cup: { mood: 'idle', line: '' }, allowance: null, options: {}, heartbeat: NOW, startedAt: NOW }))];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var active = function (over) {
    if (over === void 0) { over = {}; }
    return (0, fixtures_1.makeTask)(__assign({ id: 'one', title: 'Fix it', state: 'current', branch: 'task/fix', startCommit: 'abc', minutesByDay: { '2026-10-27': 14 }, priority: 'high' }, over));
};
var request = function (kind, over) {
    if (over === void 0) { over = {}; }
    return (__assign({ id: 'q-9', kind: kind, taskId: 'one', at: 'now' }, over));
};
(0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, log;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = promises_1.realpath;
                return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-back-'))];
            case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
            case 2:
                home = _b.sent();
                file = (0, node_path_1.join)(home, '.queue-tea/projects', "".concat(KEY, ".json"));
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, '.queue-tea/projects'), { recursive: true })];
            case 3:
                _b.sent();
                log = (0, logger_1.createLogger)('dev', function () { });
                deps = { host: (0, node_host_1.nodeHost)(log, function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ exitCode: 0, stdout: '', stderr: '' })];
                    }); }); }), home: home, now: function () { return NOW; }, log: log, offsetMinutes: function () { return 60; }, newId: function () { return 'q-1'; }, terminal: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, 'terminal'];
                    }); }); }, copy: function () { } };
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.afterEach)(function () { return (0, promises_1.rm)(home, { recursive: true, force: true }); });
(0, vitest_1.describe)('Back to the board with a session open', function () {
    (0, vitest_1.it)('asks the session, and the quest stays active until it acts', function () { return __awaiter(void 0, void 0, void 0, function () {
        var outcome, _a, _b, _c;
        var _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, session()];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, seed({ tasks: [active()] })];
                case 2:
                    _e.sent();
                    _a = data;
                    return [4 /*yield*/, (0, back_api_1.putBackQuest)(deps, KEY, 'one', null)];
                case 3:
                    outcome = _a.apply(void 0, [_e.sent()]);
                    (0, vitest_1.expect)(outcome).toMatchObject({ went: 'asked', missedCheckpoint: null });
                    _b = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 4:
                    _b.apply(void 0, [(_e.sent()).tasks[0].state]).toBe('current');
                    _c = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 5:
                    _c.apply(void 0, [(_e.sent()).requests.map(function (q) { return q.kind; })]).toEqual(['putBack']);
                    if (outcome.view.kind !== 'readable')
                        throw new Error('should read');
                    (0, vitest_1.expect)((_d = outcome.view.active) === null || _d === void 0 ? void 0 : _d.asking).toBe('putBack');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a second press adds no second request', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, session()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, seed({ tasks: [active()] })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, back_api_1.putBackQuest)(deps, KEY, 'one', null)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, (0, back_api_1.putBackQuest)(deps, KEY, 'one', null)];
                case 4:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 5:
                    _a.apply(void 0, [(_b.sent()).requests]).toHaveLength(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('carries the seal for the session to apply', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, session()];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, seed({ tasks: [active()] })];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, (0, back_api_1.putBackQuest)(deps, KEY, 'one', { reason: 'waiting for the clinic' })];
                case 3:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 4:
                    _a.apply(void 0, [(_c.sent()).requests[0].block]).toEqual({ reason: 'waiting for the clinic' });
                    _b = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 5:
                    _b.apply(void 0, [(_c.sent()).tasks[0].blockedReason]).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('goes back at once when Claude has not begun, since there is nothing to save', function () { return __awaiter(void 0, void 0, void 0, function () {
        var outcome, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, session()];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, seed({ tasks: [active()], requests: [request('begin')] })];
                case 2:
                    _d.sent();
                    _a = data;
                    return [4 /*yield*/, (0, back_api_1.putBackQuest)(deps, KEY, 'one', null)];
                case 3:
                    outcome = _a.apply(void 0, [_d.sent()]);
                    (0, vitest_1.expect)(outcome).toMatchObject({ went: 'back', missedCheckpoint: null });
                    _b = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 4:
                    _b.apply(void 0, [(_d.sent()).tasks[0].state]).toBe('queued');
                    _c = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 5:
                    _c.apply(void 0, [(_d.sent()).requests]).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('Back to the board with no session', function () {
    (0, vitest_1.it)('goes back at once, keeping branch, start commit, time and priority', function () { return __awaiter(void 0, void 0, void 0, function () {
        var outcome, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [active()] })];
                case 1:
                    _c.sent();
                    _a = data;
                    return [4 /*yield*/, (0, back_api_1.putBackQuest)(deps, KEY, 'one', null)];
                case 2:
                    outcome = _a.apply(void 0, [_c.sent()]);
                    (0, vitest_1.expect)(outcome.went).toBe('back');
                    _b = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 3:
                    _b.apply(void 0, [(_c.sent()).tasks[0]]).toMatchObject({ state: 'queued', branch: 'task/fix', startCommit: 'abc', priority: 'high', minutesByDay: { '2026-10-27': 14 } });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says no checkpoint was written, and when the last one was', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [active({ checkpoint: __assign(__assign({}, (0, checkpoints_1.emptyCheckpoint)()), { written: '2026-10-26T16:35:00+01:00', goal: 'Fix it' }) })] })];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, (0, back_api_1.putBackQuest)(deps, KEY, 'one', null)];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()]).missedCheckpoint]).toEqual({ lastAt: '2026-10-26T16:35:00+01:00' });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says so with no checkpoint to fall back on', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [active()] })];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, (0, back_api_1.putBackQuest)(deps, KEY, 'one', null)];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()]).missedCheckpoint]).toEqual({ lastAt: null });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a session gone since Start leaves the begin dropped and nothing to say', function () { return __awaiter(void 0, void 0, void 0, function () {
        var outcome, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [active()], requests: [request('begin')] })];
                case 1:
                    _c.sent();
                    _a = data;
                    return [4 /*yield*/, (0, back_api_1.putBackQuest)(deps, KEY, 'one', null)];
                case 2:
                    outcome = _a.apply(void 0, [_c.sent()]);
                    (0, vitest_1.expect)(outcome.missedCheckpoint).toBeNull();
                    _b = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 3:
                    _b.apply(void 0, [(_c.sent()).requests]).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('seals the active quest with a reason', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [active()] })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, (0, back_api_1.putBackQuest)(deps, KEY, 'one', { reason: 'waiting for the clinic' })];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 3:
                    _a.apply(void 0, [(_b.sent()).tasks[0]]).toMatchObject({ state: 'queued', blockedReason: 'waiting for the clinic' });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('seals the active quest on another', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [active(), (0, fixtures_1.makeTask)({ id: 'two' })] })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, (0, back_api_1.putBackQuest)(deps, KEY, 'one', { waitFor: 'two' })];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 3:
                    _a.apply(void 0, [(_b.sent()).tasks[0]]).toMatchObject({ state: 'queued', blockedBy: ['two'] });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a seal that would make two quests wait for each other', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [active(), (0, fixtures_1.makeTask)({ id: 'two', blockedBy: ['one'] })] })];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, back_api_1.putBackQuest)(deps, KEY, 'one', { waitFor: 'two' })];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toEqual({ ok: false, error: { message: 'That would make the two quests wait for each other.' } });
                    _b = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 3:
                    _b.apply(void 0, [(_c.sent()).tasks[0].state]).toBe('current');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a seal with nothing in it', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [active()] })];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, back_api_1.putBackQuest)(deps, KEY, 'one', { reason: '  ' })];
                case 2:
                    _a.apply(void 0, [(_c.sent()).ok]).toBe(false);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 3:
                    _b.apply(void 0, [(_c.sent()).tasks[0].state]).toBe('current');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a quest that is no longer the active one', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one' })] })];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, back_api_1.putBackQuest)(deps, KEY, 'one', null)];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toEqual({ ok: false, error: { message: 'That quest is no longer the active one, so nothing changed.' } });
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('Put it back now, without one', function () {
    (0, vitest_1.it)('takes the request back, and says no checkpoint was written', function () { return __awaiter(void 0, void 0, void 0, function () {
        var outcome, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, session()];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, seed({ tasks: [active()], requests: [request('putBack')] })];
                case 2:
                    _d.sent();
                    _a = data;
                    return [4 /*yield*/, (0, back_api_1.putBackNow)(deps, KEY, 'one')];
                case 3:
                    outcome = _a.apply(void 0, [_d.sent()]);
                    (0, vitest_1.expect)(outcome.went).toBe('back');
                    (0, vitest_1.expect)(outcome.missedCheckpoint).toEqual({ lastAt: null });
                    _b = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 4:
                    _b.apply(void 0, [(_d.sent()).tasks[0].state]).toBe('queued');
                    _c = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 5:
                    _c.apply(void 0, [(_d.sent()).requests]).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('works when the session that was asked has ended', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [active()], requests: [request('putBack')] })];
                case 1:
                    _c.sent();
                    _a = data;
                    return [4 /*yield*/, (0, back_api_1.putBackNow)(deps, KEY, 'one')];
                case 2:
                    _a.apply(void 0, [_c.sent()]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 3:
                    _b.apply(void 0, [(_c.sent()).tasks[0].state]).toBe('queued');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps the seal the session was going to apply', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [active()], requests: [request('putBack', { block: { reason: 'waiting' } })] })];
                case 1:
                    _c.sent();
                    _a = data;
                    return [4 /*yield*/, (0, back_api_1.putBackNow)(deps, KEY, 'one')];
                case 2:
                    _a.apply(void 0, [_c.sent()]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 3:
                    _b.apply(void 0, [(_c.sent()).tasks[0]]).toMatchObject({ state: 'queued', blockedReason: 'waiting' });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses when the session got there first', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one' })] })];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, back_api_1.putBackNow)(deps, KEY, 'one')];
                case 2:
                    _a.apply(void 0, [(_b.sent()).ok]).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('Back to the board for a quest with Codex', function () {
    var CODEX_SINCE = '2026-10-27T18:00:00+01:00';
    (0, vitest_1.it)('goes back straight away with its time on Codex, though a session is open, asking it nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var dir, outcome, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, session()];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, seed({ tasks: [active({ codexSince: CODEX_SINCE })] })];
                case 2:
                    _d.sent();
                    dir = (0, node_path_1.join)(home, '.codex/sessions/2026/10/27');
                    return [4 /*yield*/, (0, promises_1.mkdir)(dir, { recursive: true })
                        // 10 minutes with Codex.
                    ];
                case 3:
                    _d.sent();
                    // 10 minutes with Codex.
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(dir, 'rollout-a.jsonl'), "".concat(JSON.stringify({ timestamp: '2026-10-27T17:00:00Z', type: 'session_meta', payload: { cwd: PATH } }), "\n").concat(JSON.stringify({ timestamp: '2026-10-27T17:10:00Z', type: 'event_msg' }), "\n"))];
                case 4:
                    // 10 minutes with Codex.
                    _d.sent();
                    _a = data;
                    return [4 /*yield*/, (0, back_api_1.putBackQuest)(deps, KEY, 'one', null)];
                case 5:
                    outcome = _a.apply(void 0, [_d.sent()]);
                    (0, vitest_1.expect)(outcome).toMatchObject({ went: 'back', missedCheckpoint: null, isCodexTimeLost: false });
                    _b = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 6:
                    _b.apply(void 0, [(_d.sent()).tasks[0]]).toMatchObject({ state: 'queued', codexSince: null, branch: 'task/fix', minutesByDay: { '2026-10-27': 24 } });
                    _c = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 7:
                    _c.apply(void 0, [(_d.sent()).requests]).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("still goes back when Codex's log can't be read, and says its time on Codex wasn't added", function () { return __awaiter(void 0, void 0, void 0, function () {
        var exists, outcome, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [active({ codexSince: CODEX_SINCE })] })];
                case 1:
                    _c.sent();
                    exists = deps.host.exists;
                    deps = __assign(__assign({}, deps), { host: __assign(__assign({}, deps.host), { exists: function (path) { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    if (path.includes('/.codex/'))
                                        throw new Error('EPERM: operation not permitted');
                                    return [2 /*return*/, exists(path)];
                                });
                            }); } }) });
                    _a = data;
                    return [4 /*yield*/, (0, back_api_1.putBackQuest)(deps, KEY, 'one', null)];
                case 2:
                    outcome = _a.apply(void 0, [_c.sent()]);
                    (0, vitest_1.expect)(outcome).toMatchObject({ went: 'back', isCodexTimeLost: true });
                    _b = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 3:
                    _b.apply(void 0, [(_c.sent()).tasks[0]]).toMatchObject({ state: 'queued', codexSince: null, minutesByDay: { '2026-10-27': 14 } });
                    return [2 /*return*/];
            }
        });
    }); });
});
