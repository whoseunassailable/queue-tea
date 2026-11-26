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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var vitest_1 = require("vitest");
var families_1 = require("../../../../../hooks/shared/backlog/domain/services/families");
var ranking_1 = require("../../../../../hooks/shared/backlog/domain/services/ranking");
var record_source_1 = require("../../../../../hooks/shared/records/data/datasources/record_source");
var logger_1 = require("../../../core/logger");
var node_host_1 = require("../../../core/node_host");
var projects_api_1 = require("./projects_api");
var NOW = Date.parse('2026-10-27T17:50:00Z');
var home;
var deps;
var logged = [];
var task = function (over) {
    return (__assign({ title: over.id, state: 'queued', priority: 'mid', difficulty: { expected: 'medium', actual: null }, messages: [], handoff: null, branch: null, baseBranch: null, startCommit: null, blockedBy: [], blockedReason: null, checkpoint: null, created: '2026-10-20T09:00:00+02:00', started: null, finished: null, minutesByDay: {}, effort: { understandingMessages: 0, improvingMessages: 0, filesRead: 0, filesChanged: 0, linesAdded: 0, linesRemoved: 0, filesTouched: 0 }, files: { read: [], changed: [] }, parentId: null, description: null, criteria: [], review: null, helpers: { on: ['tea-dd'], ran: [], reminded: false } }, over));
};
var record = function (name, tasks) { return (__assign(__assign({}, (0, record_source_1.emptyRecord)(name, "/p/".concat(name))), { tasks: tasks })); };
var put = function (name, text) { return (0, promises_1.writeFile)((0, node_path_1.join)(home, '.queue-tea/projects', name), text); };
var putRecord = function (key, r) { return put("".concat(key, ".json"), JSON.stringify(r)); };
var session = function (over) { return (__assign({ id: 's-1', projectPath: '/p/a', recordFile: 'x', currentTaskId: null, isTurnRunning: false, cup: { mood: 'idle', line: '' }, allowance: null, options: { idleGapMinutes: 15, freshAtTokens: 1, handoffAtPercent: 90, checkTimeoutSeconds: 10 }, heartbeat: NOW, startedAt: NOW }, over)); };
var putSession = function (s) { return (0, promises_1.writeFile)((0, node_path_1.join)(home, '.queue-tea/sessions', "".concat(s.id, ".json")), JSON.stringify(s)); };
var list = function () { return __awaiter(void 0, void 0, void 0, function () {
    var listed;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, projects_api_1.listProjects)(deps)];
            case 1:
                listed = _a.sent();
                if (!listed.ok)
                    throw new Error(listed.error.message);
                return [2 /*return*/, listed.data];
        }
    });
}); };
var read = function (key) { return __awaiter(void 0, void 0, void 0, function () {
    var reply;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, projects_api_1.readProject)(deps, key)];
            case 1:
                reply = _a.sent();
                if (!reply.ok)
                    throw new Error(reply.error.message);
                if (reply.data.kind !== 'readable')
                    throw new Error('should read');
                return [2 /*return*/, reply.data];
        }
    });
}); };
(0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
    var log;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-projects-'))];
            case 1:
                home = _a.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, '.queue-tea/projects'), { recursive: true })];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, '.queue-tea/sessions'), { recursive: true })];
            case 3:
                _a.sent();
                logged.length = 0;
                log = (0, logger_1.createLogger)('dev', function (line) { return logged.push(line); });
                deps = { host: (0, node_host_1.nodeHost)(log, function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ exitCode: 0, stdout: '', stderr: '' })];
                    }); }); }), home: home, now: function () { return NOW; }, log: log };
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.afterEach)(function () { return (0, promises_1.rm)(home, { recursive: true, force: true }); });
(0, vitest_1.describe)('listing the realms', function () {
    (0, vitest_1.it)('lists nothing when there is nothing yet', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, promises_1.rm)((0, node_path_1.join)(home, '.queue-tea'), { recursive: true })];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, list()];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('hides everything beside the records that is not one', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, putRecord('a-000001', record('a', []))];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, put('a-000001.json.bak', '{}')];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, put('a-000001.json.broken-2026', '{}')];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, put('a-000001.json.abc.tmp', '{}')];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, put('.brew-repro-tmp-2d9b32.json', JSON.stringify(record('tmp', [])))];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, '.queue-tea/projects/a-000001.json.lock'))];
                case 6:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, list()];
                case 7:
                    _a.apply(void 0, [(_b.sent()).map(function (r) { return r.key; })]).toEqual(['a-000001']);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('one broken record leaves the others on screen', function () { return __awaiter(void 0, void 0, void 0, function () {
        var rows;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, putRecord('a-000001', record('a', []))];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, put('broken-000002.json', '{half a reco')];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, list()];
                case 3:
                    rows = _b.sent();
                    (0, vitest_1.expect)(rows.map(function (r) { return r.kind; }).sort()).toEqual(['readable', 'unreadable']);
                    (0, vitest_1.expect)((_a = rows.find(function (r) { return r.kind === 'unreadable'; })) === null || _a === void 0 ? void 0 : _a.name).toBe('broken');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a record from a newer Queue-tea reads as unreadable and says so, untouched', function () { return __awaiter(void 0, void 0, void 0, function () {
        var newer, reply;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    newer = JSON.stringify({ version: 3, tasks: [] });
                    return [4 /*yield*/, put('new-000003.json', newer)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, projects_api_1.readProject)(deps, 'new-000003')];
                case 2:
                    reply = _a.sent();
                    (0, vitest_1.expect)(reply).toMatchObject({ ok: true, data: { kind: 'unreadable', key: 'new-000003', name: 'new', isNewer: true, canRestore: false } });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('offers the last good copy only when it reads', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, put('a-000001.json', '{bad')];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, put('a-000001.json.bak', JSON.stringify(record('a', [])))];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, put('b-000002.json', '{bad')];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, put('b-000002.json.bak', '{also bad')];
                case 4:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, projects_api_1.readProject)(deps, 'a-000001')];
                case 5:
                    _a.apply(void 0, [_c.sent()]).toMatchObject({ data: { canRestore: true } });
                    _b = vitest_1.expect;
                    return [4 /*yield*/, (0, projects_api_1.readProject)(deps, 'b-000002')];
                case 6:
                    _b.apply(void 0, [_c.sent()]).toMatchObject({ data: { canRestore: false } });
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('the status line', function () {
    var statusOf = function (r) {
        var sessions = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            sessions[_i - 1] = arguments[_i];
        }
        return __awaiter(void 0, void 0, void 0, function () {
            var _a, sessions_1, s;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, putRecord('a-000001', r)];
                    case 1:
                        _b.sent();
                        _a = 0, sessions_1 = sessions;
                        _b.label = 2;
                    case 2:
                        if (!(_a < sessions_1.length)) return [3 /*break*/, 5];
                        s = sessions_1[_a];
                        return [4 /*yield*/, putSession(s)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        _a++;
                        return [3 /*break*/, 2];
                    case 5: return [4 /*yield*/, list()];
                    case 6: return [2 /*return*/, (_b.sent())[0]];
                }
            });
        });
    };
    (0, vitest_1.it)('says what waits, or that nothing does', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = vitest_1.expect;
                    return [4 /*yield*/, statusOf(record('a', []))];
                case 1:
                    _a.apply(void 0, [_c.sent()]).toMatchObject({ status: { kind: 'nothing' }, session: 'none' });
                    _b = vitest_1.expect;
                    return [4 /*yield*/, statusOf(record('a', [task({ id: 'x', title: 'Next' })]))];
                case 2:
                    _b.apply(void 0, [_c.sent()]).toMatchObject({ waiting: 1, status: { kind: 'waiting', count: 1, title: 'Next' } });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('names the current task', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = vitest_1.expect;
                    return [4 /*yield*/, statusOf(record('a', [task({ id: 'x', title: 'Now', state: 'current' })]))];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toMatchObject({ status: { kind: 'current', title: 'Now' } });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('working wins over the current task, and needing you over working', function () { return __awaiter(void 0, void 0, void 0, function () {
        var now, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    now = task({ id: 'x', state: 'current' });
                    _a = vitest_1.expect;
                    return [4 /*yield*/, statusOf(record('a', [now]), session({ isTurnRunning: true }))];
                case 1:
                    _a.apply(void 0, [_c.sent()]).toMatchObject({ status: { kind: 'working' }, session: 'working' });
                    _b = vitest_1.expect;
                    return [4 /*yield*/, statusOf(record('a', [now]), session({ isTurnRunning: true, cup: { mood: 'attention', line: '' } }))];
                case 2:
                    _b.apply(void 0, [_c.sent()]).toMatchObject({ status: { kind: 'needsYou' } });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a task waiting for an answer asks for Judgement with no session open', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = vitest_1.expect;
                    return [4 /*yield*/, statusOf(record('a', [task({ id: 'x', state: 'current', review: { at: 'x', checked: null } })]))];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toMatchObject({ status: { kind: 'judgement' } });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a session that crashed counts as none after 90 s', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = vitest_1.expect;
                    return [4 /*yield*/, statusOf(record('a', []), session({ heartbeat: NOW - 90000 }))];
                case 1:
                    _a.apply(void 0, [_c.sent()]).toMatchObject({ session: 'open' });
                    _b = vitest_1.expect;
                    return [4 /*yield*/, statusOf(record('a', []), session({ heartbeat: NOW - 90001 }))];
                case 2:
                    _b.apply(void 0, [_c.sent()]).toMatchObject({ session: 'none' });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('two sessions in one realm say so', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = vitest_1.expect;
                    return [4 /*yield*/, statusOf(record('a', []), session({ id: 's-1' }), session({ id: 's-2' }))];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toMatchObject({ session: 'several' });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("another project's session doesn't count", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = vitest_1.expect;
                    return [4 /*yield*/, statusOf(record('a', []), session({ projectPath: '/p/b' }))];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toMatchObject({ session: 'none' });
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('reading a realm', function () {
    (0, vitest_1.it)('refuses a key that could leave the folder', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _i, _a, bad, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _i = 0, _a = ['../../etc/passwd', '.hidden-000000', 'a/b-000000', '', 12, null];
                    _c.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    bad = _a[_i];
                    (0, vitest_1.expect)((0, projects_api_1.isProjectKey)(bad)).toBe(false);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, (0, projects_api_1.readProject)(deps, bad)];
                case 2:
                    _b.apply(void 0, [(_c.sent()).ok]).toBe(false);
                    _c.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('never hands an exception to the window', function () { return __awaiter(void 0, void 0, void 0, function () {
        var reply;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, projects_api_1.readProject)(deps, 'gone-000000')];
                case 1:
                    reply = _a.sent();
                    (0, vitest_1.expect)(reply).toEqual({ ok: false, error: { message: "Couldn't read this realm's quests. Try again." } });
                    (0, vitest_1.expect)(logged.join('')).toContain('no record for gone-000000');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('the board keeps the ranking order and the ★ line, character for character', function () { return __awaiter(void 0, void 0, void 0, function () {
        var r, parsed, ranked, expected, view, idsOf, star;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    r = record('a', [
                        task({ id: 'low', title: 'Low', priority: 'low' }),
                        task({ id: 'urgent', title: 'Urgent', priority: 'urgent' }),
                        task({ id: 'saga', title: 'Saga', priority: 'high' }),
                        task({ id: 'chapter', title: 'Chapter', priority: 'mid', parentId: 'saga' }),
                        task({ id: 'stuck', title: 'Stuck', blockedReason: 'waiting for the clinic' }),
                    ]);
                    return [4 /*yield*/, putRecord('a-000001', r)];
                case 1:
                    _b.sent();
                    parsed = (0, record_source_1.parseRecord)(JSON.stringify(r));
                    if (parsed === 'unreadable')
                        throw new Error('should read');
                    ranked = (0, ranking_1.rankBacklog)(parsed, null);
                    expected = (0, families_1.groupBacklog)(ranked, (0, ranking_1.blockedTasks)(parsed.tasks), parsed.tasks);
                    return [4 /*yield*/, read('a-000001')];
                case 2:
                    view = _b.sent();
                    idsOf = function (e) { return (e.kind === 'group' ? e.group.parent.id : e.row.task.id); };
                    (0, vitest_1.expect)(view.ready.map(function (e) { return e.quest.id; })).toEqual(expected.ready.map(idsOf));
                    star = view.ready.flatMap(function (e) { return (e.kind === 'saga' ? __spreadArray([e.quest], e.chapters, true) : [e.quest]); }).find(function (q) { return q.isStar; });
                    (0, vitest_1.expect)(star === null || star === void 0 ? void 0 : star.why).toBe((_a = ranked[0]) === null || _a === void 0 ? void 0 : _a.why);
                    (0, vitest_1.expect)(view.canStart).toBe(4);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a saga carries its chapters, the sealed ones too, and its progress', function () { return __awaiter(void 0, void 0, void 0, function () {
        var saga;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, putRecord('a-000001', record('a', [
                        task({ id: 'saga', title: 'Saga' }),
                        task({ id: 'one', parentId: 'saga' }),
                        task({ id: 'two', parentId: 'saga', blockedReason: 'later' }),
                        task({ id: 'three', parentId: 'saga', state: 'done', finished: '2026-10-21T09:00:00+02:00' }),
                    ]))];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, read('a-000001')];
                case 2:
                    saga = (_b.sent()).ready[0];
                    if ((saga === null || saga === void 0 ? void 0 : saga.kind) !== 'saga')
                        throw new Error('should be a saga');
                    (0, vitest_1.expect)(saga.chapters.map(function (c) { return c.id; })).toEqual(['one', 'two']);
                    (0, vitest_1.expect)((_a = saga.chapters[1]) === null || _a === void 0 ? void 0 : _a.sealedBecause).toBe('later');
                    (0, vitest_1.expect)(saga.progress).toMatchObject({ done: 1, total: 3 });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('an urgent current task is the boss, and its reward follows its difficulty', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, putRecord('a-000001', record('a', [task({ id: 'x', state: 'current', priority: 'urgent', difficulty: { expected: 'hard', actual: null }, minutesByDay: { a: 20, b: 23 } })]))];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, read('a-000001')];
                case 2:
                    _a.apply(void 0, [(_b.sent()).active]).toMatchObject({ isBoss: true, xp: 50, minutes: 43 });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps the three latest victories and the full count', function () { return __awaiter(void 0, void 0, void 0, function () {
        var won, view;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    won = ['20', '21', '22', '23'].map(function (d) { return task({ id: d, state: 'done', finished: "2026-10-".concat(d, "T09:00:00+02:00"), difficulty: { expected: 'light', actual: 'hard' } }); });
                    return [4 /*yield*/, putRecord('a-000001', record('a', won))];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, read('a-000001')];
                case 2:
                    view = _b.sent();
                    (0, vitest_1.expect)(view.victories.map(function (v) { return v.id; })).toEqual(['23', '22', '21']);
                    (0, vitest_1.expect)((_a = view.victories[0]) === null || _a === void 0 ? void 0 : _a.xp).toBe(50);
                    (0, vitest_1.expect)(view.victoryCount).toBe(4);
                    return [2 /*return*/];
            }
        });
    }); });
});
