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
var record_source_1 = require("../../../../../hooks/shared/records/data/datasources/record_source");
var logger_1 = require("../../../core/logger");
var node_host_1 = require("../../../core/node_host");
var project_source_1 = require("../../../../../hooks/shared/records/data/datasources/project_source");
var take_request_1 = require("../../../../../hooks/features/tasks/domain/usecases/take_request");
var scope_1 = require("./scope");
var fixtures_1 = require("./fixtures");
var start_api_1 = require("./start_api");
var KEY = 'demo-abc123';
var NOW = Date.parse('2026-10-27T17:50:00Z');
var run = (0, node_util_1.promisify)(node_child_process_1.execFile);
var home;
var repo;
var file;
var deps;
var terminalRuns;
var allRuns;
var copied;
var terminalExit;
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
var seed = function (over) { return (0, promises_1.writeFile)(file, JSON.stringify(__assign(__assign({}, (0, record_source_1.emptyRecord)('demo', repo)), over))); };
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
var refused = function (answer) {
    if (answer.ok)
        throw new Error('should be refused');
    return answer.error.message;
};
var held = function (check) {
    if (check.kind !== 'held')
        throw new Error("should be held: ".concat(check.kind));
    return check.hold;
};
var started = function (outcome) {
    if (outcome.kind !== 'started')
        throw new Error("should start: ".concat(JSON.stringify(outcome)));
    return outcome;
};
var session = function () {
    var args_1 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args_1[_i] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (over) {
        if (over === void 0) { over = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, '.queue-tea/sessions'), { recursive: true })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(home, '.queue-tea/sessions/s-1.json'), JSON.stringify(__assign({ id: 's-1', projectPath: repo, recordFile: file, currentTaskId: null, isTurnRunning: false, cup: { mood: 'idle', line: '' }, allowance: null, options: {}, heartbeat: NOW, startedAt: NOW }, over)))];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
// A record kept beside a real repository that matches its remote, so nothing
// holds a Start until a test makes it.
(0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, log, real, host, ids;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = promises_1.realpath;
                return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-start-'))];
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
                return [4 /*yield*/, run('git', ['init', '--bare', '-b', 'main', (0, node_path_1.join)(home, 'remote.git')])];
            case 5:
                _b.sent();
                return [4 /*yield*/, git('init', '-b', 'main')];
            case 6:
                _b.sent();
                return [4 /*yield*/, git('config', 'user.email', 'test@example.com')];
            case 7:
                _b.sent();
                return [4 /*yield*/, git('config', 'user.name', 'Test')];
            case 8:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(repo, 'a.txt'), 'a\n')];
            case 9:
                _b.sent();
                return [4 /*yield*/, git('add', '.')];
            case 10:
                _b.sent();
                return [4 /*yield*/, git('commit', '-m', 'first')];
            case 11:
                _b.sent();
                return [4 /*yield*/, git('remote', 'add', 'origin', (0, node_path_1.join)(home, 'remote.git'))];
            case 12:
                _b.sent();
                return [4 /*yield*/, git('push', '-u', 'origin', 'main')];
            case 13:
                _b.sent();
                terminalRuns = [];
                allRuns = [];
                copied = [];
                terminalExit = 0;
                log = (0, logger_1.createLogger)('dev', function () { });
                real = (0, node_host_1.nodeHost)(log, function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, ({ exitCode: 0, stdout: '', stderr: '' })];
                }); }); });
                host = __assign(__assign({}, real), { run: function (argv, cwd) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            allRuns.push(argv);
                            if (argv[0] !== 'git') {
                                terminalRuns.push(argv);
                                return [2 /*return*/, { exitCode: terminalExit, stdout: '', stderr: terminalExit === 0 ? '' : 'no such app' }];
                            }
                            return [2 /*return*/, real.run(argv, cwd)];
                        });
                    }); } });
                ids = 0;
                deps = {
                    host: host,
                    home: home,
                    now: function () { return NOW; },
                    log: log,
                    offsetMinutes: function () { return 60; },
                    newId: function () { return "q-".concat((ids += 1)); },
                    terminal: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, 'terminal'];
                    }); }); },
                    copy: function (text) { return void copied.push(text); },
                };
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.afterEach)(function () { return (0, promises_1.rm)(home, { recursive: true, force: true }); });
(0, vitest_1.describe)('the check before Start', function () {
    vitest_1.it.each(['dirty', 'unpushed', 'side', 'detached'])('can create a worktree while the main checkout is %s, changing nothing', function (state) { return __awaiter(void 0, void 0, void 0, function () {
        var before, status, head, _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one', title: 'Fix the docs' })] })];
                case 1:
                    _f.sent();
                    if (!(state === 'dirty')) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(repo, 'a.txt'), 'changed\n')];
                case 2:
                    _f.sent();
                    _f.label = 3;
                case 3:
                    if (!(state === 'side')) return [3 /*break*/, 5];
                    return [4 /*yield*/, git('switch', '-c', 'side')];
                case 4:
                    _f.sent();
                    _f.label = 5;
                case 5:
                    if (!(state === 'unpushed')) return [3 /*break*/, 8];
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(repo, 'a.txt'), 'two\n')];
                case 6:
                    _f.sent();
                    return [4 /*yield*/, git('commit', '-am', 'second')];
                case 7:
                    _f.sent();
                    _f.label = 8;
                case 8:
                    if (!(state === 'detached')) return [3 /*break*/, 10];
                    return [4 /*yield*/, git('switch', '--detach')];
                case 9:
                    _f.sent();
                    _f.label = 10;
                case 10: return [4 /*yield*/, (0, promises_1.readFile)(file, 'utf8')];
                case 11:
                    before = _f.sent();
                    return [4 /*yield*/, git('status', '--porcelain')];
                case 12:
                    status = _f.sent();
                    return [4 /*yield*/, git('rev-parse', 'HEAD')];
                case 13:
                    head = _f.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, (0, start_api_1.checkStart)(deps, KEY, 'one')];
                case 14:
                    _a.apply(void 0, [_b.apply(void 0, [_f.sent()])]).toMatchObject({ kind: 'clear', step: { kind: 'make', from: 'main' } });
                    _c = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)(file, 'utf8')];
                case 15:
                    _c.apply(void 0, [_f.sent()]).toBe(before);
                    _d = vitest_1.expect;
                    return [4 /*yield*/, git('status', '--porcelain')];
                case 16:
                    _d.apply(void 0, [_f.sent()]).toBe(status);
                    _e = vitest_1.expect;
                    return [4 /*yield*/, git('rev-parse', 'HEAD')];
                case 17:
                    _e.apply(void 0, [_f.sent()]).toBe(head);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says the branch a first start will make, and where from', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one', title: 'Fix the documentation' })] })];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, (0, start_api_1.checkStart)(deps, KEY, 'one')];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]).toEqual({ kind: 'clear', step: { kind: 'make', branch: 'task/fix-documentation', from: 'main' } });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says a quest put back goes back to its own branch', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, git('branch', 'task/mine')];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one', branch: 'task/mine', startCommit: 'abc' })] })];
                case 2:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, (0, start_api_1.checkStart)(deps, KEY, 'one')];
                case 3:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]).toEqual({ kind: 'clear', step: { kind: 'switch', branch: 'task/mine' } });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says when there is no repository', function () { return __awaiter(void 0, void 0, void 0, function () {
        var plain, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    plain = (0, node_path_1.join)(home, 'plain');
                    return [4 /*yield*/, (0, promises_1.mkdir)(plain)];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)(file, JSON.stringify(__assign(__assign({}, (0, record_source_1.emptyRecord)('demo', plain)), { tasks: [(0, fixtures_1.makeTask)({ id: 'one' })] })))];
                case 2:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, (0, start_api_1.checkStart)(deps, KEY, 'one')];
                case 3:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]).toEqual({ kind: 'clear', step: { kind: 'noRepo' } });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a quest that has left the board', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one', state: 'done' })] })];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, (0, start_api_1.checkStart)(deps, KEY, 'one')];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]).toContain('Pick it again');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a sealed quest in the game\'s words', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one', title: 'Stuck', blockedReason: 'waiting' })] })];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, (0, start_api_1.checkStart)(deps, KEY, 'one')];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]).toBe('Stuck is sealed: waiting. Unseal it first.');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('allows a second quest alongside the current one', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'mine', state: 'current', title: 'The other one' }), (0, fixtures_1.makeTask)({ id: 'one', title: 'This one' })] })];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, (0, start_api_1.checkStart)(deps, KEY, 'one')];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]).toMatchObject({ kind: 'clear' });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses when the realm\'s folder has moved, rather than starting with no branch', function () { return __awaiter(void 0, void 0, void 0, function () {
        var gone, _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    gone = (0, node_path_1.join)(home, 'moved-away');
                    return [4 /*yield*/, (0, promises_1.writeFile)(file, JSON.stringify(__assign(__assign({}, (0, record_source_1.emptyRecord)('demo', gone)), { tasks: [(0, fixtures_1.makeTask)({ id: 'one' })] })))];
                case 1:
                    _f.sent();
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, (0, start_api_1.checkStart)(deps, KEY, 'one')];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_f.sent()])]).toContain(gone);
                    _c = vitest_1.expect;
                    _d = refused;
                    return [4 /*yield*/, (0, start_api_1.startQuest)(deps, KEY, 'one', 'claude')];
                case 3:
                    _c.apply(void 0, [_d.apply(void 0, [_f.sent()])]).toContain(gone);
                    _e = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 4:
                    _e.apply(void 0, [(_f.sent()).tasks[0].state]).toBe('queued');
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('Start', function () {
    (0, vitest_1.it)('makes a worktree from main, claims the quest and opens its own terminal', function () { return __awaiter(void 0, void 0, void 0, function () {
        var outcome, _a, _b, _c, task, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one', title: 'Fix the documentation' })] })];
                case 1:
                    _g.sent();
                    _a = started;
                    _b = data;
                    return [4 /*yield*/, (0, start_api_1.startQuest)(deps, KEY, 'one', 'claude')];
                case 2:
                    outcome = _a.apply(void 0, [_b.apply(void 0, [_g.sent()])]);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, git('branch', '--show-current')];
                case 3:
                    _c.apply(void 0, [_g.sent()]).toBe('main');
                    return [4 /*yield*/, onDisk()];
                case 4:
                    task = (_g.sent()).tasks[0];
                    (0, vitest_1.expect)(task).toMatchObject({ state: 'current', branch: 'task/fix-documentation', baseBranch: 'main', started: '2026-10-27T18:50:00+01:00' });
                    _e = (_d = (0, vitest_1.expect)(task.startCommit)).toBe;
                    return [4 /*yield*/, git('rev-parse', 'HEAD')];
                case 5:
                    _e.apply(_d, [_g.sent()]);
                    _f = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 6:
                    _f.apply(void 0, [(_g.sent()).requests.map(function (q) { return ({ kind: q.kind, taskId: q.taskId }); })]).toEqual([{ kind: 'begin', taskId: 'one' }]);
                    (0, vitest_1.expect)(outcome).toMatchObject({ branch: 'task/fix-documentation', handover: { kind: 'opened', terminal: 'terminal' } });
                    (0, vitest_1.expect)(terminalRuns).toHaveLength(1);
                    (0, vitest_1.expect)(terminalRuns[0].join(' ')).toContain('claude');
                    if (outcome.view.kind !== 'readable')
                        throw new Error('should read');
                    (0, vitest_1.expect)(outcome.view.active).toMatchObject({ id: 'one', asking: 'begin' });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('with a session in the original folder opens a new terminal in the worktree', function () { return __awaiter(void 0, void 0, void 0, function () {
        var outcome, _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, session()];
                case 1:
                    _f.sent();
                    return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one' })] })];
                case 2:
                    _f.sent();
                    _a = started;
                    _b = data;
                    return [4 /*yield*/, (0, start_api_1.startQuest)(deps, KEY, 'one', 'claude')];
                case 3:
                    outcome = _a.apply(void 0, [_b.apply(void 0, [_f.sent()])]);
                    (0, vitest_1.expect)(outcome.handover).toMatchObject({ kind: 'opened' });
                    (0, vitest_1.expect)(terminalRuns).toHaveLength(1);
                    _d = (_c = (0, vitest_1.expect)(terminalRuns[0].join(' '))).toContain;
                    return [4 /*yield*/, onDisk()];
                case 4:
                    _d.apply(_c, [(_f.sent()).tasks[0].worktreePath]);
                    _e = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 5:
                    _e.apply(void 0, [(_f.sent()).requests]).toHaveLength(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('treats a session gone stale as no session', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, session({ heartbeat: NOW - 91000 })];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one' })] })];
                case 2:
                    _d.sent();
                    _a = vitest_1.expect;
                    _b = started;
                    _c = data;
                    return [4 /*yield*/, (0, start_api_1.startQuest)(deps, KEY, 'one', 'claude')];
                case 3:
                    _a.apply(void 0, [_b.apply(void 0, [_c.apply(void 0, [_d.sent()])]).handover.kind]).toBe('opened');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('returns a quest put back to its own branch and keeps its start commit', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, folder, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, git('branch', 'task/mine')];
                case 1:
                    _f.sent();
                    return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one', branch: 'task/mine', startCommit: 'abc', baseBranch: 'main' })] })];
                case 2:
                    _f.sent();
                    _a = started;
                    _b = data;
                    return [4 /*yield*/, (0, start_api_1.startQuest)(deps, KEY, 'one', 'claude')];
                case 3:
                    _a.apply(void 0, [_b.apply(void 0, [_f.sent()])]);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, git('branch', '--show-current')];
                case 4:
                    _c.apply(void 0, [_f.sent()]).toBe('main');
                    return [4 /*yield*/, onDisk()];
                case 5:
                    folder = (_f.sent()).tasks[0].worktreePath;
                    _d = vitest_1.expect;
                    return [4 /*yield*/, run('git', ['branch', '--show-current'], { cwd: folder })];
                case 6:
                    _d.apply(void 0, [(_f.sent()).stdout.trim()]).toBe('task/mine');
                    _e = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 7:
                    _e.apply(void 0, [(_f.sent()).tasks[0]]).toMatchObject({ startCommit: 'abc', branch: 'task/mine' });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says so when the quest\'s branch was deleted', function () { return __awaiter(void 0, void 0, void 0, function () {
        var outcome, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one', title: 'Fix it', branch: 'task/gone' })] })];
                case 1:
                    _c.sent();
                    _a = started;
                    _b = data;
                    return [4 /*yield*/, (0, start_api_1.startQuest)(deps, KEY, 'one', 'claude')];
                case 2:
                    outcome = _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]);
                    (0, vitest_1.expect)(outcome.notice).toBe('task/gone was gone, so this quest starts again on task/fix, made from main.');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('starts with no repository, and says no branches are made', function () { return __awaiter(void 0, void 0, void 0, function () {
        var plain, outcome, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    plain = (0, node_path_1.join)(home, 'plain');
                    return [4 /*yield*/, (0, promises_1.mkdir)(plain)];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)(file, JSON.stringify(__assign(__assign({}, (0, record_source_1.emptyRecord)('demo', plain)), { tasks: [(0, fixtures_1.makeTask)({ id: 'one' })] })))];
                case 2:
                    _c.sent();
                    _a = started;
                    _b = data;
                    return [4 /*yield*/, (0, start_api_1.startQuest)(deps, KEY, 'one', 'claude')];
                case 3:
                    outcome = _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]);
                    (0, vitest_1.expect)(outcome.notice).toBe('Not a git repository, so no branches are made');
                    (0, vitest_1.expect)(outcome.branch).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('starts with dirty files in the original folder, leaving them there', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, task, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one' })] })];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(repo, 'b.txt'), 'b\n')];
                case 2:
                    _e.sent();
                    _a = started;
                    _b = data;
                    return [4 /*yield*/, (0, start_api_1.startQuest)(deps, KEY, 'one', 'claude')];
                case 3:
                    _a.apply(void 0, [_b.apply(void 0, [_e.sent()])]);
                    return [4 /*yield*/, onDisk()];
                case 4:
                    task = (_e.sent()).tasks[0];
                    (0, vitest_1.expect)(task.state).toBe('current');
                    _c = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(repo, 'b.txt'), 'utf8')];
                case 5:
                    _c.apply(void 0, [_e.sent()]).toBe('b\n');
                    return [4 /*yield*/, (0, vitest_1.expect)((0, promises_1.readFile)((0, node_path_1.join)(task.worktreePath, 'b.txt'))).rejects.toThrow()];
                case 6:
                    _e.sent();
                    _d = vitest_1.expect;
                    return [4 /*yield*/, git('branch', '--show-current')];
                case 7:
                    _d.apply(void 0, [_e.sent()]).toBe('main');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('takes the claim back when the branch can\'t be made, and offers Check again', function () { return __awaiter(void 0, void 0, void 0, function () {
        var real, hold, _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one', title: 'Fix it' })] })];
                case 1:
                    _e.sent();
                    real = deps.host.run;
                    deps = __assign(__assign({}, deps), { host: __assign(__assign({}, deps.host), { run: function (argv, cwd) { return (argv.includes('worktree') && argv.includes('add') ? Promise.resolve({ exitCode: 1, stdout: '', stderr: 'locked' }) : real(argv, cwd)); } }) });
                    _a = held;
                    _b = data;
                    return [4 /*yield*/, (0, start_api_1.startQuest)(deps, KEY, 'one', 'claude')];
                case 2:
                    hold = _a.apply(void 0, [_b.apply(void 0, [_e.sent()])]);
                    (0, vitest_1.expect)(hold).toMatchObject({ kind: 'branch', reason: 'The quest folder could not be created. Check its branch and folder, then try again.', command: null });
                    _c = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 3:
                    _c.apply(void 0, [(_e.sent()).tasks[0]]).toMatchObject({ state: 'queued', branch: null, started: null });
                    _d = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 4:
                    _d.apply(void 0, [(_e.sent()).requests]).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a terminal that won\'t open leaves the quest started, with the line to copy', function () { return __awaiter(void 0, void 0, void 0, function () {
        var outcome, _a, _b, _c, _d, _e, _f, _g;
        var _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    terminalExit = 1;
                    return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one' })] })];
                case 1:
                    _j.sent();
                    _a = started;
                    _b = data;
                    return [4 /*yield*/, (0, start_api_1.startQuest)(deps, KEY, 'one', 'claude')];
                case 2:
                    outcome = _a.apply(void 0, [_b.apply(void 0, [_j.sent()])]);
                    _d = (_c = (0, vitest_1.expect)(outcome.handover)).toEqual;
                    _h = { kind: 'failed', terminal: 'terminal' };
                    _e = "cd '".concat;
                    return [4 /*yield*/, onDisk()];
                case 3:
                    _d.apply(_c, [(_h.command = _e.apply("cd '", [(_j.sent()).tasks[0].worktreePath, "' && claude"]), _h)]);
                    _f = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 4:
                    _f.apply(void 0, [(_j.sent()).tasks[0].state]).toBe('current');
                    _g = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 5:
                    _g.apply(void 0, [(_j.sent()).requests]).toHaveLength(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('starts a separate quest alongside a legacy current task', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'mine', state: 'current', title: 'The other one' }), (0, fixtures_1.makeTask)({ id: 'one', title: 'This one' })] })];
                case 1:
                    _d.sent();
                    _a = started;
                    _b = data;
                    return [4 /*yield*/, (0, start_api_1.startQuest)(deps, KEY, 'one', 'claude')];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_d.sent()])]);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 3:
                    _c.apply(void 0, [(_d.sent()).tasks.filter(function (t) { return t.state === 'current'; })]).toHaveLength(2);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('never runs a commit, a push, a merge or a pull', function () { return __awaiter(void 0, void 0, void 0, function () {
        var words, _i, _a, word;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one' })] })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, (0, start_api_1.startQuest)(deps, KEY, 'one', 'claude')];
                case 2:
                    _b.sent();
                    words = allRuns.filter(function (argv) { return argv[0] === 'git'; }).map(function (argv) { return argv[1]; });
                    (0, vitest_1.expect)(words).toContain('worktree');
                    for (_i = 0, _a = ['commit', 'push', 'merge', 'pull']; _i < _a.length; _i++) {
                        word = _a[_i];
                        (0, vitest_1.expect)(words).not.toContain(word);
                    }
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('Open in Claude Code', function () {
    (0, vitest_1.it)('opens a terminal with no session', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [] })];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, (0, start_api_1.openClaude)(deps, KEY)];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]).toEqual({ kind: 'opened', terminal: 'terminal' });
                    (0, vitest_1.expect)(terminalRuns[0].join(' ')).toContain('claude');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('only brings the terminal forward with a session open', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, session()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, seed({ tasks: [] })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, start_api_1.openClaude)(deps, KEY)];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(terminalRuns[0].join(' ')).not.toContain('claude');
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('copying text', function () {
    (0, vitest_1.it)('puts the text on the clipboard', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, start_api_1.copyText)(deps, 'git status')];
                case 1:
                    _a.apply(void 0, [(_b.sent()).ok]).toBe(true);
                    (0, vitest_1.expect)(copied).toEqual(['git status']);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses what isn\'t text', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, start_api_1.copyText)(deps, 42)];
                case 1:
                    _a.apply(void 0, [(_b.sent()).ok]).toBe(false);
                    (0, vitest_1.expect)(copied).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
});
// Codex's log for the repo: one session, its lines at the moments given.
var codexLog = function (stamps) { return __awaiter(void 0, void 0, void 0, function () {
    var dir, lines;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                dir = (0, node_path_1.join)(home, '.codex/sessions/2026/10/27');
                return [4 /*yield*/, (0, promises_1.mkdir)(dir, { recursive: true })];
            case 1:
                _a.sent();
                lines = stamps.map(function (timestamp, i) { return JSON.stringify(i === 0 ? { timestamp: timestamp, type: 'session_meta', payload: { cwd: repo } } : { timestamp: timestamp, type: 'event_msg' }); });
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(dir, 'rollout-a.jsonl'), "".concat(lines.join('\n'), "\n"))];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var brief = function (id) { return (0, promises_1.readFile)((0, node_path_1.join)(home, '.queue-tea/briefs', "".concat(id, ".md")), 'utf8'); };
var CODEX_SINCE = '2026-10-27T18:00:00+01:00';
(0, vitest_1.describe)('Start in Codex', function () {
    (0, vitest_1.it)('claims the quest with Codex, asks no session, and opens Codex with the brief', function () { return __awaiter(void 0, void 0, void 0, function () {
        var outcome, _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0: return [4 /*yield*/, session()];
                case 1:
                    _k.sent();
                    return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one', title: 'Fix the documentation' })] })];
                case 2:
                    _k.sent();
                    _a = started;
                    _b = data;
                    return [4 /*yield*/, (0, start_api_1.startQuest)(deps, KEY, 'one', 'codex')];
                case 3:
                    outcome = _a.apply(void 0, [_b.apply(void 0, [_k.sent()])]);
                    (0, vitest_1.expect)(outcome.handover).toEqual({ kind: 'opened', terminal: 'terminal' });
                    _c = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 4:
                    _c.apply(void 0, [(_k.sent()).tasks[0]]).toMatchObject({ state: 'current', branch: 'task/fix-documentation', codexSince: '2026-10-27T18:50:00+01:00' });
                    _d = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 5:
                    _d.apply(void 0, [(_k.sent()).requests]).toEqual([]);
                    (0, vitest_1.expect)(terminalRuns).toHaveLength(1);
                    (0, vitest_1.expect)(terminalRuns[0].join(' ')).toContain('codex --sandbox workspace-write --ask-for-approval on-request');
                    _e = vitest_1.expect;
                    return [4 /*yield*/, brief('one')];
                case 6:
                    _g = (_f = (_k.sent())).startsWith;
                    _h = "From Queue-tea, before you start:\n- You're working on one task, in ".concat;
                    return [4 /*yield*/, onDisk()];
                case 7:
                    _e.apply(void 0, [_g.apply(_f, [_h.apply("From Queue-tea, before you start:\n- You're working on one task, in ", [(_k.sent()).tasks[0].worktreePath, ", on the branch task/fix-documentation."])])]).toBe(true);
                    _j = vitest_1.expect;
                    return [4 /*yield*/, brief('one')];
                case 8:
                    _j.apply(void 0, [_k.sent()]).toContain('Task: Fix the documentation');
                    if (outcome.view.kind !== 'readable')
                        throw new Error('should read');
                    (0, vitest_1.expect)(outcome.view.active).toMatchObject({ id: 'one', codexSince: '2026-10-27T18:50:00+01:00', asking: null });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("points the brief at the files the description links, in the realm's notes folder", function () { return __awaiter(void 0, void 0, void 0, function () {
        var image, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    image = "attachments/".concat('a1'.repeat(32), ".png");
                    return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one', title: 'Fix the documentation', description: "Like this:\n![mock.png](<".concat(image, ">)") })] })];
                case 1:
                    _d.sent();
                    _a = started;
                    _b = data;
                    return [4 /*yield*/, (0, start_api_1.startQuest)(deps, KEY, 'one', 'codex')];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_d.sent()])]);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, brief('one')];
                case 3:
                    _c.apply(void 0, [_d.sent()]).toContain("Description: Like this:\n![mock.png](<".concat((0, node_path_1.join)(home, '.queue-tea/notes', KEY, image), ">)\n\nThe description links files Queue-tea saved."));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a platform it does not know, and changes nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one' })] })];
                case 1:
                    _e.sent();
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, (0, start_api_1.startQuest)(deps, KEY, 'one', 'gemini')];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_e.sent()])]).toBe('Pick Claude Code or Codex.');
                    _c = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 3:
                    _c.apply(void 0, [(_e.sent()).tasks[0]]).toMatchObject({ state: 'queued', branch: null, codexSince: null });
                    _d = vitest_1.expect;
                    return [4 /*yield*/, git('branch', '--show-current')];
                case 4:
                    _d.apply(void 0, [_e.sent()]).toBe('main');
                    (0, vitest_1.expect)(terminalRuns).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('Continue in', function () {
    (0, vitest_1.it)('refuses to move a quest to Codex while Claude Code is working on it, and changes nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var before, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, session({ isTurnRunning: true })];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one', title: 'This one', state: 'current', branch: 'task/one' })] })];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, (0, promises_1.readFile)(file, 'utf8')];
                case 3:
                    before = _d.sent();
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, (0, start_api_1.continueIn)(deps, KEY, 'one', 'codex')];
                case 4:
                    _a.apply(void 0, [_b.apply(void 0, [_d.sent()])]).toBe('Claude Code is still working on This one. Wait for its turn to end, or stop it with Esc in its terminal, then try again. Nothing has changed.');
                    _c = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)(file, 'utf8')];
                case 5:
                    _c.apply(void 0, [_d.sent()]).toBe(before);
                    (0, vitest_1.expect)(terminalRuns).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('moves the quest to Codex between turns, takes back what the session was asked, and opens Codex with the brief', function () { return __awaiter(void 0, void 0, void 0, function () {
        var outcome, _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, session()];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, seed({
                            tasks: [(0, fixtures_1.makeTask)({ id: 'one', title: 'This one', state: 'current' })],
                            requests: [{ id: 'q-0', kind: 'begin', taskId: 'one', at: '2026-10-27T18:49:00+01:00' }],
                        })];
                case 2:
                    _e.sent();
                    _a = data;
                    return [4 /*yield*/, (0, start_api_1.continueIn)(deps, KEY, 'one', 'codex')];
                case 3:
                    outcome = _a.apply(void 0, [_e.sent()]);
                    (0, vitest_1.expect)(outcome).toMatchObject({ handover: { kind: 'opened', terminal: 'terminal' }, isCodexTimeLost: false });
                    _b = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 4:
                    _b.apply(void 0, [(_e.sent()).tasks[0].codexSince]).toBe('2026-10-27T18:50:00+01:00');
                    _c = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 5:
                    _c.apply(void 0, [(_e.sent()).requests]).toEqual([]);
                    (0, vitest_1.expect)(terminalRuns[0].join(' ')).toContain('codex --sandbox');
                    _d = vitest_1.expect;
                    return [4 /*yield*/, brief('one')];
                case 6:
                    _d.apply(void 0, [_e.sent()]).toContain('Task: This one');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('brings the quest back to Claude Code with its time on Codex, and asks for it to begin', function () { return __awaiter(void 0, void 0, void 0, function () {
        var outcome, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one', state: 'current', codexSince: CODEX_SINCE, minutesByDay: { '2026-10-27': 5 } })] })
                    // 10 and 10 minutes with Codex.
                ];
                case 1:
                    _d.sent();
                    // 10 and 10 minutes with Codex.
                    return [4 /*yield*/, codexLog(['2026-10-27T17:00:00Z', '2026-10-27T17:10:00Z', '2026-10-27T17:20:00Z'])];
                case 2:
                    // 10 and 10 minutes with Codex.
                    _d.sent();
                    _a = data;
                    return [4 /*yield*/, (0, start_api_1.continueIn)(deps, KEY, 'one', 'claude')];
                case 3:
                    outcome = _a.apply(void 0, [_d.sent()]);
                    (0, vitest_1.expect)(outcome).toMatchObject({ handover: { kind: 'opened', terminal: 'terminal' }, isCodexTimeLost: false });
                    _b = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 4:
                    _b.apply(void 0, [(_d.sent()).tasks[0]]).toMatchObject({ state: 'current', codexSince: null, minutesByDay: { '2026-10-27': 25 } });
                    _c = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 5:
                    _c.apply(void 0, [(_d.sent()).requests.map(function (q) { return ({ kind: q.kind, taskId: q.taskId }); })]).toEqual([{ kind: 'begin', taskId: 'one' }]);
                    (0, vitest_1.expect)(terminalRuns[0].join(' ')).toContain('claude');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a quest that is not the active one', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one' })] })];
                case 1:
                    _d.sent();
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, (0, start_api_1.continueIn)(deps, KEY, 'one', 'codex')];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_d.sent()])]).toBe('That quest is no longer the active one, so nothing moved.');
                    _c = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 3:
                    _c.apply(void 0, [(_d.sent()).tasks[0].codexSince]).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a platform it does not know', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one', state: 'current' })] })];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, (0, start_api_1.continueIn)(deps, KEY, 'one', 'gemini')];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]).toBe('Pick Claude Code or Codex.');
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('Open for a quest with Codex', function () {
    (0, vitest_1.it)('keeps the recovery command on Codex when bringing the terminal forward fails', function () { return __awaiter(void 0, void 0, void 0, function () {
        var handover, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    terminalExit = 1;
                    return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one', title: 'Keep working', state: 'current', codexSince: CODEX_SINCE })] })];
                case 1:
                    _d.sent();
                    _a = data;
                    return [4 /*yield*/, (0, start_api_1.openClaude)(deps, KEY)];
                case 2:
                    handover = _a.apply(void 0, [_d.sent()]);
                    (0, vitest_1.expect)(handover.kind).toBe('failed');
                    if (handover.kind !== 'failed')
                        throw new Error('should fail');
                    (0, vitest_1.expect)(handover.command).toContain('codex --sandbox workspace-write --ask-for-approval on-request');
                    (0, vitest_1.expect)(handover.command).toContain('Task: Keep working');
                    (0, vitest_1.expect)(handover.command).not.toContain('&& claude');
                    _b = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 3:
                    _b.apply(void 0, [(_d.sent()).tasks[0].codexSince]).toBe(CODEX_SINCE);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 4:
                    _c.apply(void 0, [(_d.sent()).requests]).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("the recovery command's brief points at the files the description links", function () { return __awaiter(void 0, void 0, void 0, function () {
        var image, handover, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    terminalExit = 1;
                    image = "attachments/".concat('a1'.repeat(32), ".png");
                    return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one', title: 'Keep working', state: 'current', codexSince: CODEX_SINCE, description: "![mock.png](<".concat(image, ">)") })] })];
                case 1:
                    _b.sent();
                    _a = data;
                    return [4 /*yield*/, (0, start_api_1.openClaude)(deps, KEY)];
                case 2:
                    handover = _a.apply(void 0, [_b.sent()]);
                    if (handover.kind !== 'failed')
                        throw new Error('should fail');
                    (0, vitest_1.expect)(handover.command).toContain("![mock.png](<".concat((0, node_path_1.join)(home, '.queue-tea/notes', KEY, image), ">)"));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('only brings the terminal forward, so a second Codex or a Claude Code session is not started', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one', state: 'current', codexSince: CODEX_SINCE })] })];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, (0, start_api_1.openClaude)(deps, KEY)];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]).toEqual({ kind: 'opened', terminal: 'terminal' });
                    (0, vitest_1.expect)(terminalRuns).toHaveLength(1);
                    (0, vitest_1.expect)(terminalRuns[0].join(' ')).not.toContain('claude');
                    (0, vitest_1.expect)(terminalRuns[0].join(' ')).not.toContain('codex');
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('parallel quests in real worktrees', function () {
    (0, vitest_1.it)('starts two quests concurrently from main, in distinct branches and terminals, sharing the project', function () { return __awaiter(void 0, void 0, void 0, function () {
        var results, record, _loop_1, _i, _a, task, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one', title: 'Same title' }), (0, fixtures_1.makeTask)({ id: 'two', title: 'Same title' })] })];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, git('switch', '-c', 'unrelated')];
                case 2:
                    _e.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(repo, 'a.txt'), 'uncommitted local work\n')];
                case 3:
                    _e.sent();
                    return [4 /*yield*/, Promise.all([(0, start_api_1.startQuest)(deps, KEY, 'one', 'claude'), (0, start_api_1.startQuest)(deps, KEY, 'two', 'codex')])];
                case 4:
                    results = _e.sent();
                    results.forEach(function (r) { return started(data(r)); });
                    return [4 /*yield*/, onDisk()];
                case 5:
                    record = _e.sent();
                    (0, vitest_1.expect)(record.version).toBe(2);
                    (0, vitest_1.expect)(record.tasks.map(function (t) { return t.state; })).toEqual(['current', 'current']);
                    (0, vitest_1.expect)(new Set(record.tasks.map(function (t) { return t.branch; })).size).toBe(2);
                    (0, vitest_1.expect)(new Set(record.tasks.map(function (t) { return t.worktreePath; })).size).toBe(2);
                    (0, vitest_1.expect)(terminalRuns).toHaveLength(2);
                    _loop_1 = function (task) {
                        var _f, _g, _h, _j, place;
                        return __generator(this, function (_k) {
                            switch (_k.label) {
                                case 0:
                                    (0, vitest_1.expect)(task.baseBranch).toBe('main');
                                    _g = (_f = (0, vitest_1.expect)(task.startCommit)).toBe;
                                    return [4 /*yield*/, git('rev-parse', 'main')];
                                case 1:
                                    _g.apply(_f, [_k.sent()]);
                                    _h = vitest_1.expect;
                                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(task.worktreePath, 'a.txt'), 'utf8')];
                                case 2:
                                    _h.apply(void 0, [_k.sent()]).toBe('a\n');
                                    _j = vitest_1.expect;
                                    return [4 /*yield*/, run('git', ['branch', '--show-current'], { cwd: task.worktreePath })];
                                case 3:
                                    _j.apply(void 0, [(_k.sent()).stdout.trim()]).toBe(task.branch);
                                    return [4 /*yield*/, (0, project_source_1.readProjectPlace)(deps.host, task.worktreePath, home, function () { })];
                                case 4:
                                    place = _k.sent();
                                    (0, vitest_1.expect)(place.projectPath).toBe(repo);
                                    (0, vitest_1.expect)(place.workingPath).toBe(task.worktreePath);
                                    (0, vitest_1.expect)(terminalRuns.some(function (argv) { return argv.join(' ').includes(task.worktreePath); })).toBe(true);
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, _a = record.tasks;
                    _e.label = 6;
                case 6:
                    if (!(_i < _a.length)) return [3 /*break*/, 9];
                    task = _a[_i];
                    return [5 /*yield**/, _loop_1(task)];
                case 7:
                    _e.sent();
                    _e.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 6];
                case 9:
                    _b = vitest_1.expect;
                    return [4 /*yield*/, git('branch', '--show-current')];
                case 10:
                    _b.apply(void 0, [_e.sent()]).toBe('unrelated');
                    _c = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(repo, 'a.txt'), 'utf8')];
                case 11:
                    _c.apply(void 0, [_e.sent()]).toBe('uncommitted local work\n');
                    (0, vitest_1.expect)(record.requests.map(function (q) { return q.taskId; })).toEqual(['one']);
                    _d = vitest_1.expect;
                    return [4 /*yield*/, brief('two')];
                case 12:
                    _d.apply(void 0, [_e.sent()]).toContain(record.tasks[1].worktreePath);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('allows only one concurrent claim of the same quest', function () { return __awaiter(void 0, void 0, void 0, function () {
        var results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one' })] })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, Promise.all([(0, start_api_1.startQuest)(deps, KEY, 'one', 'claude'), (0, start_api_1.startQuest)(deps, KEY, 'one', 'codex')])];
                case 2:
                    results = _a.sent();
                    (0, vitest_1.expect)(results.filter(function (r) { return r.ok && r.data.kind === 'started'; })).toHaveLength(1);
                    (0, vitest_1.expect)(terminalRuns).toHaveLength(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('routes session requests only to their quest folder and focuses the selected quest', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d, first, second, request, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one' }), (0, fixtures_1.makeTask)({ id: 'two' })] })];
                case 1:
                    _j.sent();
                    _a = started;
                    _b = data;
                    return [4 /*yield*/, (0, start_api_1.startQuest)(deps, KEY, 'one', 'claude')];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_j.sent()])]);
                    _c = started;
                    _d = data;
                    return [4 /*yield*/, (0, start_api_1.startQuest)(deps, KEY, 'two', 'claude')];
                case 3:
                    _c.apply(void 0, [_d.apply(void 0, [_j.sent()])]);
                    return [4 /*yield*/, (0, scope_1.scopeOf)(deps, KEY, 'one')];
                case 4:
                    first = _j.sent();
                    return [4 /*yield*/, (0, scope_1.scopeOf)(deps, KEY, 'two')];
                case 5:
                    second = _j.sent();
                    request = second.record.requests.find(function (q) { return q.taskId === 'two'; });
                    _e = vitest_1.expect;
                    return [4 /*yield*/, (0, take_request_1.takeRequestUseCase)(first.deps, request.id, first.ctx)];
                case 6:
                    _e.apply(void 0, [(_j.sent()).kind]).toBe('gone');
                    _f = vitest_1.expect;
                    return [4 /*yield*/, (0, take_request_1.takeRequestUseCase)(second.deps, request.id, second.ctx)];
                case 7:
                    _f.apply(void 0, [(_j.sent()).kind]).toBe('taken');
                    _g = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 8:
                    _g.apply(void 0, [(_j.sent()).requests.map(function (q) { return q.taskId; })]).toEqual(['one']);
                    return [4 /*yield*/, session({ workingPath: second.ctx.cwd })];
                case 9:
                    _j.sent();
                    terminalRuns.length = 0;
                    _h = data;
                    return [4 /*yield*/, (0, start_api_1.openClaude)(deps, KEY, 'two')];
                case 10:
                    _h.apply(void 0, [_j.sent()]);
                    (0, vitest_1.expect)(terminalRuns).toHaveLength(1);
                    (0, vitest_1.expect)(terminalRuns[0].join(' ')).toContain(second.ctx.cwd);
                    (0, vitest_1.expect)(terminalRuns[0].join(' ')).not.toContain('do script');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('does not let another worktree session block a Codex handoff', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d, record, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, seed({ tasks: [(0, fixtures_1.makeTask)({ id: 'one' }), (0, fixtures_1.makeTask)({ id: 'two' })] })];
                case 1:
                    _h.sent();
                    _a = started;
                    _b = data;
                    return [4 /*yield*/, (0, start_api_1.startQuest)(deps, KEY, 'one', 'claude')];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_h.sent()])]);
                    _c = started;
                    _d = data;
                    return [4 /*yield*/, (0, start_api_1.startQuest)(deps, KEY, 'two', 'claude')];
                case 3:
                    _c.apply(void 0, [_d.apply(void 0, [_h.sent()])]);
                    return [4 /*yield*/, onDisk()];
                case 4:
                    record = _h.sent();
                    return [4 /*yield*/, session({ workingPath: record.tasks[0].worktreePath, isTurnRunning: true })];
                case 5:
                    _h.sent();
                    _e = data;
                    return [4 /*yield*/, (0, start_api_1.continueIn)(deps, KEY, 'two', 'codex')];
                case 6:
                    _e.apply(void 0, [_h.sent()]);
                    _f = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 7:
                    _f.apply(void 0, [(_h.sent()).tasks[0].codexSince]).toBeNull();
                    _g = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 8:
                    _g.apply(void 0, [(_h.sent()).tasks[1].codexSince]).not.toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
});
