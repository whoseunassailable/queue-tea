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
var node_child_process_1 = require("node:child_process");
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var node_util_1 = require("node:util");
var vitest_1 = require("vitest");
var checkpoints_1 = require("../../../../../hooks/shared/checkpoints/domain/services/checkpoints");
var record_source_1 = require("../../../../../hooks/shared/records/data/datasources/record_source");
var logger_1 = require("../../../core/logger");
var node_host_1 = require("../../../core/node_host");
var projects_api_1 = require("../../projects/api/projects_api");
var fixtures_1 = require("./fixtures");
var live_api_1 = require("./live_api");
var tasks_api_1 = require("./tasks_api");
var KEY = 'live-abc123';
var NOW = Date.parse('2026-10-27T17:50:00Z');
var run = (0, node_util_1.promisify)(node_child_process_1.execFile);
var home;
var repo;
var file;
var deps;
var git = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, run('git', args, { cwd: repo })];
            case 1: return [2 /*return*/, (_a.sent()).stdout.trim()];
        }
    }); });
};
var seed = function (over) { return (0, promises_1.writeFile)(file, JSON.stringify(__assign(__assign({}, (0, record_source_1.emptyRecord)('live', repo)), over))); };
var data = function (answer) {
    if (!answer.ok)
        throw new Error("should succeed: ".concat(answer.error.message));
    return answer.data;
};
var facts = function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
    switch (_b.label) {
        case 0:
            _a = data;
            return [4 /*yield*/, (0, live_api_1.readLive)(deps, KEY)];
        case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
    }
}); }); };
var session = function (warning_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([warning_1], args_1, true), void 0, function (warning, heartbeat) {
        if (heartbeat === void 0) { heartbeat = NOW; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, '.queue-tea/sessions'), { recursive: true })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(home, '.queue-tea/sessions/s-1.json'), JSON.stringify({ id: 's-1', projectPath: repo, recordFile: file, currentTaskId: null, isTurnRunning: false, cup: { mood: 'idle', line: '' }, allowance: null, options: {}, heartbeat: heartbeat, startedAt: NOW, warning: warning }))];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
(0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, log;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = promises_1.realpath;
                return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-live-'))];
            case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
            case 2:
                home = _b.sent();
                repo = (0, node_path_1.join)(home, 'repo');
                file = (0, node_path_1.join)(home, '.queue-tea/projects', "".concat(KEY, ".json"));
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, '.queue-tea/projects'), { recursive: true })];
            case 3:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)(repo)];
            case 4:
                _b.sent();
                return [4 /*yield*/, git('init', '-b', 'main')];
            case 5:
                _b.sent();
                return [4 /*yield*/, git('config', 'user.email', 'test@example.com')];
            case 6:
                _b.sent();
                return [4 /*yield*/, git('config', 'user.name', 'Test')];
            case 7:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(repo, 'a.txt'), 'a\n')];
            case 8:
                _b.sent();
                return [4 /*yield*/, git('add', '.')];
            case 9:
                _b.sent();
                return [4 /*yield*/, git('commit', '-m', 'first')];
            case 10:
                _b.sent();
                return [4 /*yield*/, git('branch', 'task/mine')];
            case 11:
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
(0, vitest_1.describe)('what git says about the active quest', function () {
    (0, vitest_1.it)('has nothing to say with no active quest', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one' })] })];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, facts()];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toEqual({ drift: [], mismatch: null, warning: null });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('has nothing to say on the quest\'s own branch', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, git('switch', 'task/mine')];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one', state: 'current', branch: 'task/mine' })] })];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, facts()];
                case 3:
                    _a.apply(void 0, [_b.sent()]).toEqual({ drift: [], mismatch: null, warning: null });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says when the quest\'s branch has gone', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one', state: 'current', branch: 'task/gone' })] })];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, facts()];
                case 2:
                    _a.apply(void 0, [(_b.sent()).drift]).toEqual(['The branch task/gone is gone.']);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says when another branch is checked out', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one', state: 'current', branch: 'task/mine' })] })];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, facts()];
                case 2:
                    _a.apply(void 0, [(_b.sent()).mismatch]).toEqual({ on: 'main', branch: 'task/mine', uncommitted: null });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('gives what holds a switch back', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(repo, 'a.txt'), 'changed\n')];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one', state: 'current', branch: 'task/mine' })] })];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, facts()];
                case 3:
                    _a.apply(void 0, [(_b.sent()).mismatch]).toEqual({ on: 'main', branch: 'task/mine', uncommitted: '1 file not committed' });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('has nothing to say on a detached HEAD, or outside a repository, about a branch', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one', state: 'current', branch: null })] })];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, facts()];
                case 2:
                    _a.apply(void 0, [(_b.sent()).mismatch]).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('the commit warning', function () {
    (0, vitest_1.it)('reads it from the session', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, session('During the last turn a commit appeared.')];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, seed({ tasks: [] })];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, facts()];
                case 3:
                    _a.apply(void 0, [(_b.sent()).warning]).toBe('During the last turn a commit appeared.');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('ignores a session gone stale', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, session('Old news.', NOW - 91000)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, seed({ tasks: [] })];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, facts()];
                case 3:
                    _a.apply(void 0, [(_b.sent()).warning]).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('reads a session from before the field existed', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, session(null)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, seed({ tasks: [] })];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, facts()];
                case 3:
                    _a.apply(void 0, [(_b.sent()).warning]).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('Switch', function () {
    (0, vitest_1.it)('goes to the quest\'s branch', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one', state: 'current', branch: 'task/mine' })] })];
                case 1:
                    _c.sent();
                    _a = data;
                    return [4 /*yield*/, (0, live_api_1.switchBranch)(deps, KEY)];
                case 2:
                    _a.apply(void 0, [_c.sent()]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, git('branch', '--show-current')];
                case 3:
                    _b.apply(void 0, [_c.sent()]).toBe('task/mine');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('stays put with work uncommitted, and says so', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(repo, 'a.txt'), 'changed\n')];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one', state: 'current', branch: 'task/mine' })] })];
                case 2:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, live_api_1.switchBranch)(deps, KEY)];
                case 3:
                    _a.apply(void 0, [_c.sent()]).toEqual({ ok: false, error: { message: '1 file not committed: commit or stash first, then Switch.' } });
                    _b = vitest_1.expect;
                    return [4 /*yield*/, git('branch', '--show-current')];
                case 4:
                    _b.apply(void 0, [_c.sent()]).toBe('main');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses with no active quest', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [] })];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, live_api_1.switchBranch)(deps, KEY)];
                case 2:
                    _a.apply(void 0, [(_b.sent()).ok]).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('Time I have', function () {
    var twoQuests = [(0, fixtures_1.makeTask)({ id: 'long', priority: 'urgent', difficulty: { expected: 'hard', actual: null } }), (0, fixtures_1.makeTask)({ id: 'short', priority: 'low', difficulty: { expected: 'light', actual: null } })];
    var starOf = function (view) { var _a; return (_a = view.ready.find(function (entry) { return entry.quest.isStar; })) === null || _a === void 0 ? void 0 : _a.quest.id; };
    (0, vitest_1.afterEach)(function () { return (0, live_api_1.setTimeBudget)(deps, KEY, null); });
    (0, vitest_1.it)('ranks what fits first, and says it is set', function () { return __awaiter(void 0, void 0, void 0, function () {
        var view, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, seed({ tasks: twoQuests })];
                case 1:
                    _b.sent();
                    _a = data;
                    return [4 /*yield*/, (0, live_api_1.setTimeBudget)(deps, KEY, 30)];
                case 2:
                    view = _a.apply(void 0, [_b.sent()]);
                    (0, vitest_1.expect)(starOf(view)).toBe('short');
                    (0, vitest_1.expect)(view).toMatchObject({ budget: 30 });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('holds through a read', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, seed({ tasks: twoQuests })];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, (0, live_api_1.setTimeBudget)(deps, KEY, 30)];
                case 2:
                    _d.sent();
                    _a = vitest_1.expect;
                    _b = starOf;
                    _c = data;
                    return [4 /*yield*/, (0, projects_api_1.readProject)(deps, KEY)];
                case 3:
                    _a.apply(void 0, [_b.apply(void 0, [_c.apply(void 0, [_d.sent()])])]).toBe('short');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('holds through an edit, so the ★ doesn\'t jump', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, seed({ tasks: twoQuests })];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, (0, live_api_1.setTimeBudget)(deps, KEY, 30)];
                case 2:
                    _d.sent();
                    _a = vitest_1.expect;
                    _b = starOf;
                    _c = data;
                    return [4 /*yield*/, (0, tasks_api_1.setPriority)(deps, KEY, 'long', 'high')];
                case 3:
                    _a.apply(void 0, [_b.apply(void 0, [_c.apply(void 0, [_d.sent()])])]).toBe('short');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('goes back to any', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, seed({ tasks: twoQuests })];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, (0, live_api_1.setTimeBudget)(deps, KEY, 30)];
                case 2:
                    _d.sent();
                    _a = vitest_1.expect;
                    _b = starOf;
                    _c = data;
                    return [4 /*yield*/, (0, live_api_1.setTimeBudget)(deps, KEY, null)];
                case 3:
                    _a.apply(void 0, [_b.apply(void 0, [_c.apply(void 0, [_d.sent()])])]).toBe('long');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses an amount it doesn\'t offer', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, seed({ tasks: twoQuests })];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, live_api_1.setTimeBudget)(deps, KEY, 45)];
                case 2:
                    _a.apply(void 0, [(_b.sent()).ok]).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('is written nowhere', function () { return __awaiter(void 0, void 0, void 0, function () {
        var before, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, seed({ tasks: twoQuests })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, (0, promises_1.readFile)(file, 'utf8')];
                case 2:
                    before = _b.sent();
                    return [4 /*yield*/, (0, live_api_1.setTimeBudget)(deps, KEY, 30)];
                case 3:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)(file, 'utf8')];
                case 4:
                    _a.apply(void 0, [_b.sent()]).toBe(before);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('filling a quest in from its checkpoint', function () {
    (0, vitest_1.it)('offers the goal and acceptance criteria on the row', function () { return __awaiter(void 0, void 0, void 0, function () {
        var view, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one', checkpoint: __assign(__assign({}, (0, checkpoints_1.emptyCheckpoint)()), { written: 'x', goal: 'Fix the docs', acceptance: ['Docs build'] }) })] })];
                case 1:
                    _b.sent();
                    _a = data;
                    return [4 /*yield*/, (0, projects_api_1.readProject)(deps, KEY)];
                case 2:
                    view = _a.apply(void 0, [_b.sent()]);
                    if (view.kind !== 'readable')
                        throw new Error('should read');
                    (0, vitest_1.expect)(view.ready[0].quest).toMatchObject({ goal: 'Fix the docs', acceptance: ['Docs build'] });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('has nothing to offer with no checkpoint', function () { return __awaiter(void 0, void 0, void 0, function () {
        var view, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one' })] })];
                case 1:
                    _b.sent();
                    _a = data;
                    return [4 /*yield*/, (0, projects_api_1.readProject)(deps, KEY)];
                case 2:
                    view = _a.apply(void 0, [_b.sent()]);
                    if (view.kind !== 'readable')
                        throw new Error('should read');
                    (0, vitest_1.expect)(view.ready[0].quest).toMatchObject({ goal: null, acceptance: [] });
                    return [2 /*return*/];
            }
        });
    }); });
});
