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
var node_child_process_1 = require("node:child_process");
var node_events_1 = require("node:events");
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var node_util_1 = require("node:util");
var vitest_1 = require("vitest");
var record_source_1 = require("../../../../../hooks/shared/records/data/datasources/record_source");
var logger_1 = require("../../../core/logger");
var node_host_1 = require("../../../core/node_host");
var fixtures_1 = require("../../tasks/api/fixtures");
var start_api_1 = require("../../tasks/api/start_api");
var constants_1 = require("../domain/constants");
var space_api_1 = require("./space_api");
// Real Git in a disposable folder: a project with two quest worktrees, each
// holding build output beside things that must survive. Only git, rm and du
// run for real; anything else (a terminal) is answered without running.
var KEY = 'demo-abc123';
var NOW = Date.parse('2026-11-25T10:00:00Z');
var run = (0, node_util_1.promisify)(node_child_process_1.execFile);
var home;
var repo;
var one;
var two;
var file;
var startCommit;
var d;
var runs;
var logged;
var failing;
var git = function (cwd) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, run('git', args, { cwd: cwd, env: __assign(__assign({}, process.env), { GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null' }) })];
            case 1: return [2 /*return*/, (_a.sent()).stdout.trim()];
        }
    }); });
};
var isThere = function (path) { return (0, promises_1.access)(path).then(function () { return true; }, function () { return false; }); };
var seed = function (tasks) { return (0, promises_1.writeFile)(file, JSON.stringify(__assign(__assign({}, (0, record_source_1.emptyRecord)('demo', repo)), { version: 2, tasks: tasks }))); };
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
var folderOf = function (id) { return (0, node_path_1.join)(home, 'quests', id); };
var quest = function (id, over) {
    if (over === void 0) { over = {}; }
    return (0, fixtures_1.makeTask)(__assign({ id: id, title: "Quest ".concat(id), state: 'done', branch: "task/".concat(id), baseBranch: 'main', startCommit: startCommit, worktreePath: folderOf(id) }, over));
};
var data = function (answer) { if (!answer.ok)
    throw new Error("should succeed: ".concat(answer.error.message)); return answer.data; };
var refused = function (answer) { if (answer.ok)
    throw new Error('should be refused'); return answer.error.message; };
var session = function (over) { return __awaiter(void 0, void 0, void 0, function () {
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
}); };
// Build output a tool makes again, and what lives beside it and must stay.
var fill = function (path) { return __awaiter(void 0, void 0, void 0, function () {
    var _i, _a, _b, name_1, text;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _i = 0, _a = [['node_modules/pkg/index.js', 'module'], ['dist/app.js', 'bundle'], ['packages/app/node_modules/x/index.js', 'nested'],
                    ['target/junk.o', 'object'], ['logs/out.log', 'log'], ['.env', 'SECRET=1']];
                _c.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 5];
                _b = _a[_i], name_1 = _b[0], text = _b[1];
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(path, name_1, '..'), { recursive: true })];
            case 2:
                _c.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(path, name_1), text)];
            case 3:
                _c.sent();
                _c.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 1];
            case 5: return [4 /*yield*/, (0, promises_1.symlink)((0, node_path_1.join)(home, 'shared-modules'), (0, node_path_1.join)(path, 'apps/web/node_modules'))];
            case 6:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); };
// A third quest folder, for a sweep that must tell two other folders apart.
var addThree = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, git(repo, 'worktree', 'add', '-b', 'task/three', folderOf('three'), 'main')];
        case 1:
            _a.sent();
            return [4 /*yield*/, fill(folderOf('three'))];
        case 2:
            _a.sent();
            return [2 /*return*/];
    }
}); }); };
// The quest's work lands on main through a real merge commit.
var mergeIntoMain = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var path;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                path = folderOf(id);
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(path, "".concat(id, ".txt")), "".concat(id, "\n"))];
            case 1:
                _a.sent();
                return [4 /*yield*/, git(path, 'add', "".concat(id, ".txt"))];
            case 2:
                _a.sent();
                return [4 /*yield*/, git(path, 'commit', '-m', "Work on ".concat(id))];
            case 3:
                _a.sent();
                return [4 /*yield*/, git(repo, 'merge', '--no-ff', '--no-edit', "task/".concat(id))];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// The app update's saved state, written where the update runner keeps it for
// this home. Spelled out here, so a test can never write the real one.
var update = function (state) { return __awaiter(void 0, void 0, void 0, function () {
    var folder;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                folder = (0, node_path_1.join)(home, 'Library/Logs/Queue-tea');
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(folder, 'refresh.lock'), { recursive: true })];
            case 1:
                _b.sent();
                if (typeof state === 'string')
                    return [2 /*return*/, (0, promises_1.writeFile)((0, node_path_1.join)(folder, 'state.json'), state)];
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(folder, 'state.json'), JSON.stringify({ phase: state.phase, commit: 'a'.repeat(40), repository: (0, node_path_1.join)(repo, '.git'), detail: null, updatedAt: (_a = state.updatedAt) !== null && _a !== void 0 ? _a : Date.now() }))];
            case 2:
                _b.sent();
                if (!state.worker) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(folder, 'refresh.lock/pid'), String(state.worker))];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); };
var deadPid = function () { return __awaiter(void 0, void 0, void 0, function () { var child; return __generator(this, function (_a) {
    switch (_a.label) {
        case 0:
            child = (0, node_child_process_1.spawn)(process.execPath, ['-e', '']);
            return [4 /*yield*/, (0, node_events_1.once)(child, 'exit')];
        case 1:
            _a.sent();
            return [2 /*return*/, child.pid];
    }
}); }); };
// Every path under the test's home outside git's and Queue-tea's own files
// (the branch lock's folder comes and goes), and the record: what a refused
// or skipped call must leave exactly as it was.
var snapshot = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = {};
                return [4 /*yield*/, (0, promises_1.readdir)(home, { recursive: true })];
            case 1:
                _a.paths = (_b.sent()).filter(function (p) { return !p.split(node_path_1.sep).includes('.git') && !p.startsWith('.queue-tea'); }).sort();
                return [4 /*yield*/, (0, promises_1.readFile)(file, 'utf8')];
            case 2: return [2 /*return*/, (_a.record = _b.sent(), _a)];
        }
    });
}); };
(0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _i, _b, _c, name_2, text, log, real, host, ids;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = promises_1.realpath;
                return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-space-'))];
            case 1: return [4 /*yield*/, _a.apply(void 0, [_d.sent()])];
            case 2:
                home = _d.sent();
                repo = (0, node_path_1.join)(home, 'repo');
                one = (0, node_path_1.join)(home, 'quests/one');
                two = (0, node_path_1.join)(home, 'quests/two');
                file = (0, node_path_1.join)(home, '.queue-tea/projects', "".concat(KEY, ".json"));
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, '.queue-tea/projects'), { recursive: true })];
            case 3:
                _d.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)(repo)];
            case 4:
                _d.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, 'quests'))];
            case 5:
                _d.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, 'shared-modules'))];
            case 6:
                _d.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(home, 'shared-modules/keep.js'), 'shared')];
            case 7:
                _d.sent();
                return [4 /*yield*/, git(repo, 'init', '-b', 'main')];
            case 8:
                _d.sent();
                return [4 /*yield*/, git(repo, 'config', 'user.name', 'Queue-tea test')];
            case 9:
                _d.sent();
                return [4 /*yield*/, git(repo, 'config', 'user.email', 'test@example.invalid')];
            case 10:
                _d.sent();
                return [4 /*yield*/, git(repo, 'config', 'core.hooksPath', '/dev/null')];
            case 11:
                _d.sent();
                return [4 /*yield*/, git(repo, 'config', 'commit.gpgsign', 'false')];
            case 12:
                _d.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(repo, '.gitignore'), 'node_modules\ndist/\ntarget/\nlogs/\n.env\n')];
            case 13:
                _d.sent();
                _i = 0, _b = [['a.txt', 'base\n'], ['build/index.html', '<p>tracked</p>\n'], ['packages/app/package.json', '{}\n'], ['apps/web/package.json', '{}\n'], ['target/keep.txt', 'tracked\n']];
                _d.label = 14;
            case 14:
                if (!(_i < _b.length)) return [3 /*break*/, 18];
                _c = _b[_i], name_2 = _c[0], text = _c[1];
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(repo, name_2, '..'), { recursive: true })];
            case 15:
                _d.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(repo, name_2), text)];
            case 16:
                _d.sent();
                _d.label = 17;
            case 17:
                _i++;
                return [3 /*break*/, 14];
            case 18: return [4 /*yield*/, git(repo, 'add', '.')];
            case 19:
                _d.sent();
                return [4 /*yield*/, git(repo, 'add', '-f', 'target/keep.txt')];
            case 20:
                _d.sent();
                return [4 /*yield*/, git(repo, 'commit', '-m', 'Base')];
            case 21:
                _d.sent();
                return [4 /*yield*/, git(repo, 'rev-parse', 'HEAD')];
            case 22:
                startCommit = _d.sent();
                return [4 /*yield*/, git(repo, 'worktree', 'add', '-b', 'task/one', one, 'main')];
            case 23:
                _d.sent();
                return [4 /*yield*/, git(repo, 'worktree', 'add', '-b', 'task/two', two, 'main')
                    // The project folder's own build output is never a quest folder's.
                ];
            case 24:
                _d.sent();
                // The project folder's own build output is never a quest folder's.
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(repo, 'node_modules/root'), { recursive: true })];
            case 25:
                // The project folder's own build output is never a quest folder's.
                _d.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(repo, 'node_modules/root/index.js'), 'root')];
            case 26:
                _d.sent();
                return [4 /*yield*/, fill(one)];
            case 27:
                _d.sent();
                return [4 /*yield*/, fill(two)];
            case 28:
                _d.sent();
                return [4 /*yield*/, seed([quest('one'), quest('two')])];
            case 29:
                _d.sent();
                runs = [];
                logged = [];
                failing = null;
                log = (0, logger_1.createLogger)('dev', function (line) { return logged.push(line); });
                real = (0, node_host_1.nodeHost)(log, function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, ({ exitCode: 0, stdout: '', stderr: '' })];
                }); }); });
                host = __assign(__assign({}, real), { run: function (argv, cwd) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            runs.push(argv);
                            if (failing === null || failing === void 0 ? void 0 : failing(argv, cwd))
                                return [2 /*return*/, { exitCode: 128, stdout: '', stderr: 'fatal: simulated' }];
                            return [2 /*return*/, ['git', 'rm', 'du'].includes(argv[0]) ? real.run(argv, cwd) : { exitCode: 0, stdout: '', stderr: '' }];
                        });
                    }); } });
                ids = 0;
                d = { host: host, home: home, now: function () { return NOW; }, log: log, offsetMinutes: function () { return 60; }, newId: function () { return "q-".concat((ids += 1)); }, terminal: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, 'terminal'];
                    }); }); }, copy: function () { } };
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.afterEach)(function () { return (0, promises_1.rm)(home, { recursive: true, force: true }); });
(0, vitest_1.describe)('measuring the quest folders', function () {
    (0, vitest_1.it)('lists each quest folder with its build folders and sizes, and never the project folder', function () { return __awaiter(void 0, void 0, void 0, function () {
        var space, _a, row;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = data;
                    return [4 /*yield*/, (0, space_api_1.readFolderSpace)(d, KEY)];
                case 1:
                    space = _a.apply(void 0, [_b.sent()]);
                    (0, vitest_1.expect)(space.at).toBe(NOW);
                    (0, vitest_1.expect)(space.folders.map(function (f) { return f.path; }).sort()).toEqual([one, two]);
                    row = space.folders.find(function (f) { return f.taskId === 'one'; });
                    (0, vitest_1.expect)(row).toMatchObject({ title: 'Quest one', branch: 'task/one', folders: ['dist', 'node_modules', 'packages/app/node_modules'], held: null, merged: false, changed: [], removable: false });
                    (0, vitest_1.expect)(row.freeable).toBeGreaterThan(0);
                    (0, vitest_1.expect)(row.bytes).toBeGreaterThanOrEqual(row.freeable);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('marks a merged folder with nothing uncommitted as removable', function () { return __awaiter(void 0, void 0, void 0, function () {
        var row, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, mergeIntoMain('one')];
                case 1:
                    _b.sent();
                    _a = data;
                    return [4 /*yield*/, (0, space_api_1.readFolderSpace)(d, KEY)];
                case 2:
                    row = _a.apply(void 0, [_b.sent()]).folders.find(function (f) { return f.taskId === 'one'; });
                    (0, vitest_1.expect)(row).toMatchObject({ merged: true, changed: [], removable: true });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('lists the uncommitted files that keep a merged folder', function () { return __awaiter(void 0, void 0, void 0, function () {
        var row, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, mergeIntoMain('one')];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(one, 'a.txt'), 'edited\n')];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(one, 'draft.md'), 'draft\n')];
                case 3:
                    _b.sent();
                    _a = data;
                    return [4 /*yield*/, (0, space_api_1.readFolderSpace)(d, KEY)];
                case 4:
                    row = _a.apply(void 0, [_b.sent()]).folders.find(function (f) { return f.taskId === 'one'; });
                    (0, vitest_1.expect)(row.removable).toBe(false);
                    (0, vitest_1.expect)(row.changed.map(function (c) { return "".concat(c.status, " ").concat(c.path); }).sort()).toEqual([' M a.txt', '?? draft.md']);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('Free space', function () {
    (0, vitest_1.it)('deletes only ignored build folders: tracked folders, folders holding tracked files, .env, other ignored folders and a symlinked node_modules survive', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _i, _b, gone, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    _a = data;
                    return [4 /*yield*/, (0, space_api_1.freeFolderSpace)(d, KEY, [one])];
                case 1:
                    _a.apply(void 0, [_m.sent()]);
                    _i = 0, _b = ['node_modules', 'dist', 'packages/app/node_modules'];
                    _m.label = 2;
                case 2:
                    if (!(_i < _b.length)) return [3 /*break*/, 5];
                    gone = _b[_i];
                    _c = vitest_1.expect;
                    return [4 /*yield*/, isThere((0, node_path_1.join)(one, gone))];
                case 3:
                    _c.apply(void 0, [_m.sent()]).toBe(false);
                    _m.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    _d = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(one, 'build/index.html'), 'utf8')];
                case 6:
                    _d.apply(void 0, [_m.sent()]).toBe('<p>tracked</p>\n');
                    _e = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(one, 'target/keep.txt'), 'utf8')];
                case 7:
                    _e.apply(void 0, [_m.sent()]).toBe('tracked\n');
                    _f = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(one, 'target/junk.o'), 'utf8')];
                case 8:
                    _f.apply(void 0, [_m.sent()]).toBe('object');
                    _g = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(one, '.env'), 'utf8')];
                case 9:
                    _g.apply(void 0, [_m.sent()]).toBe('SECRET=1');
                    _h = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(one, 'logs/out.log'), 'utf8')];
                case 10:
                    _h.apply(void 0, [_m.sent()]).toBe('log');
                    _j = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.lstat)((0, node_path_1.join)(one, 'apps/web/node_modules'))];
                case 11:
                    _j.apply(void 0, [(_m.sent()).isSymbolicLink()]).toBe(true);
                    _k = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(home, 'shared-modules/keep.js'), 'utf8')];
                case 12:
                    _k.apply(void 0, [_m.sent()]).toBe('shared');
                    _l = vitest_1.expect;
                    return [4 /*yield*/, git(one, 'status', '--porcelain')];
                case 13:
                    _l.apply(void 0, [_m.sent()]).toBe('');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('leaves folders that were not picked, and the project folder, as they were', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = data;
                    return [4 /*yield*/, (0, space_api_1.freeFolderSpace)(d, KEY, [one])];
                case 1:
                    _a.apply(void 0, [_d.sent()]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, isThere((0, node_path_1.join)(two, 'node_modules/pkg/index.js'))];
                case 2:
                    _b.apply(void 0, [_d.sent()]).toBe(true);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, isThere((0, node_path_1.join)(repo, 'node_modules/root/index.js'))];
                case 3:
                    _c.apply(void 0, [_d.sent()]).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('answers with the folders measured again, the cleared one now with nothing to free', function () { return __awaiter(void 0, void 0, void 0, function () {
        var row, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = data;
                    return [4 /*yield*/, (0, space_api_1.freeFolderSpace)(d, KEY, [one])];
                case 1:
                    row = _a.apply(void 0, [_b.sent()]).folders.find(function (f) { return f.taskId === 'one'; });
                    (0, vitest_1.expect)(row).toMatchObject({ folders: [], freeable: 0 });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps a folder git does not call ignored, even when the listing names it', function () { return __awaiter(void 0, void 0, void 0, function () {
        var listing, isLied, _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: 
                // build/ holds tracked and untracked work: only check-ignore stands between it and rm.
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(one, 'build/work.js'), 'mine')];
                case 1:
                    // build/ holds tracked and untracked work: only check-ignore stands between it and rm.
                    _e.sent();
                    listing = d.host.run;
                    isLied = false;
                    // Only the first listing lies; measuring again afterwards asks git itself.
                    d.host.run = function (argv, cwd) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, argv.includes('ls-files') && !isLied ? (isLied = true, { exitCode: 0, stdout: 'build/\0node_modules/\0', stderr: '' }) : listing(argv, cwd)];
                    }); }); };
                    _a = data;
                    return [4 /*yield*/, (0, space_api_1.freeFolderSpace)(d, KEY, [one])];
                case 2:
                    _a.apply(void 0, [_e.sent()]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(one, 'build/work.js'), 'utf8')];
                case 3:
                    _b.apply(void 0, [_e.sent()]).toBe('mine');
                    _c = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(one, 'build/index.html'), 'utf8')];
                case 4:
                    _c.apply(void 0, [_e.sent()]).toBe('<p>tracked</p>\n');
                    _d = vitest_1.expect;
                    return [4 /*yield*/, isThere((0, node_path_1.join)(one, 'node_modules'))];
                case 5:
                    _d.apply(void 0, [_e.sent()]).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('runs one rm -rf per confirmed folder, inside the quest folder, never git clean', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = data;
                    return [4 /*yield*/, (0, space_api_1.freeFolderSpace)(d, KEY, [one])];
                case 1:
                    _a.apply(void 0, [_b.sent()]);
                    (0, vitest_1.expect)(runs.filter(function (a) { return a[0] === 'rm'; })).toEqual([['rm', '-rf', '--', 'dist'], ['rm', '-rf', '--', 'node_modules'], ['rm', '-rf', '--', 'packages/app/node_modules']]);
                    (0, vitest_1.expect)(runs.some(function (a) { return a[0] === 'git' && a.includes('clean'); })).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses when the current quest works in one picked folder, and clears none of them', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, seed([quest('one', { state: 'current' }), quest('two')])];
                case 1:
                    _e.sent();
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, (0, space_api_1.freeFolderSpace)(d, KEY, [two, one])];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_e.sent()])]).toBe(constants_1.BRANCH_TEXT.spaceHeld);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, isThere((0, node_path_1.join)(one, 'node_modules/pkg/index.js'))];
                case 3:
                    _c.apply(void 0, [_e.sent()]).toBe(true);
                    _d = vitest_1.expect;
                    return [4 /*yield*/, isThere((0, node_path_1.join)(two, 'node_modules/pkg/index.js'))];
                case 4:
                    _d.apply(void 0, [_e.sent()]).toBe(true);
                    (0, vitest_1.expect)(runs.some(function (a) { return a[0] === 'rm'; })).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a folder another current quest has taken as its own', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, seed([quest('one'), quest('two', { state: 'current', worktreePath: one })])];
                case 1:
                    _d.sent();
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, (0, space_api_1.freeFolderSpace)(d, KEY, [one])];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_d.sent()])]).toBe(constants_1.BRANCH_TEXT.spaceHeld);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, isThere((0, node_path_1.join)(one, 'node_modules/pkg/index.js'))];
                case 3:
                    _c.apply(void 0, [_d.sent()]).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a folder a live session is working in', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, session({ workingPath: one })];
                case 1:
                    _d.sent();
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, (0, space_api_1.freeFolderSpace)(d, KEY, [one])];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_d.sent()])]).toBe(constants_1.BRANCH_TEXT.spaceHeld);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, isThere((0, node_path_1.join)(one, 'node_modules/pkg/index.js'))];
                case 3:
                    _c.apply(void 0, [_d.sent()]).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a folder a live session reaches through a symlink, and changes nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var before, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, (0, promises_1.symlink)((0, node_path_1.join)(home, 'quests'), (0, node_path_1.join)(home, 'linked'))];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, session({ workingPath: (0, node_path_1.join)(home, 'linked/one') })];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, snapshot()];
                case 3:
                    before = _d.sent();
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, (0, space_api_1.freeFolderSpace)(d, KEY, [one])];
                case 4:
                    _a.apply(void 0, [_b.apply(void 0, [_d.sent()])]).toBe(constants_1.BRANCH_TEXT.spaceHeld);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, snapshot()];
                case 5:
                    _c.apply(void 0, [_d.sent()]).toEqual(before);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('clears a folder while a live session works in a folder that no longer exists', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, session({ workingPath: (0, node_path_1.join)(home, 'gone') })];
                case 1:
                    _c.sent();
                    _a = data;
                    return [4 /*yield*/, (0, space_api_1.freeFolderSpace)(d, KEY, [one])];
                case 2:
                    _a.apply(void 0, [_c.sent()]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, isThere((0, node_path_1.join)(one, 'node_modules'))];
                case 3:
                    _b.apply(void 0, [_c.sent()]).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('clears a folder whose session has gone stale', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, session({ workingPath: one, heartbeat: NOW - 91000 })];
                case 1:
                    _c.sent();
                    _a = data;
                    return [4 /*yield*/, (0, space_api_1.freeFolderSpace)(d, KEY, [one])];
                case 2:
                    _a.apply(void 0, [_c.sent()]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, isThere((0, node_path_1.join)(one, 'node_modules'))];
                case 3:
                    _b.apply(void 0, [_c.sent()]).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('clears a quest folder while a session works in the project folder', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, session({ projectPath: repo })];
                case 1:
                    _c.sent();
                    _a = data;
                    return [4 /*yield*/, (0, space_api_1.freeFolderSpace)(d, KEY, [one])];
                case 2:
                    _a.apply(void 0, [_c.sent()]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, isThere((0, node_path_1.join)(one, 'node_modules'))];
                case 3:
                    _b.apply(void 0, [_c.sent()]).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses the project folder, a folder that is no quest\'s, and anything but a list of paths', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, (0, space_api_1.freeFolderSpace)(d, KEY, [repo])];
                case 1:
                    _a.apply(void 0, [_b.apply(void 0, [_o.sent()])]).toBe(constants_1.BRANCH_TEXT.invalid);
                    _c = vitest_1.expect;
                    _d = refused;
                    return [4 /*yield*/, (0, space_api_1.freeFolderSpace)(d, KEY, [one, (0, node_path_1.join)(home, 'elsewhere')])];
                case 2:
                    _c.apply(void 0, [_d.apply(void 0, [_o.sent()])]).toBe(constants_1.BRANCH_TEXT.invalid);
                    _e = vitest_1.expect;
                    _f = refused;
                    return [4 /*yield*/, (0, space_api_1.freeFolderSpace)(d, KEY, one)];
                case 3:
                    _e.apply(void 0, [_f.apply(void 0, [_o.sent()])]).toBe(constants_1.BRANCH_TEXT.invalid);
                    _g = vitest_1.expect;
                    _h = refused;
                    return [4 /*yield*/, (0, space_api_1.freeFolderSpace)(d, KEY, [1])];
                case 4:
                    _g.apply(void 0, [_h.apply(void 0, [_o.sent()])]).toBe(constants_1.BRANCH_TEXT.invalid);
                    _j = vitest_1.expect;
                    _k = refused;
                    return [4 /*yield*/, (0, space_api_1.freeFolderSpace)(d, KEY, [])];
                case 5:
                    _j.apply(void 0, [_k.apply(void 0, [_o.sent()])]).toBe(constants_1.BRANCH_TEXT.spaceChoose);
                    _l = vitest_1.expect;
                    return [4 /*yield*/, isThere((0, node_path_1.join)(repo, 'node_modules/root/index.js'))];
                case 6:
                    _l.apply(void 0, [_o.sent()]).toBe(true);
                    _m = vitest_1.expect;
                    return [4 /*yield*/, isThere((0, node_path_1.join)(one, 'node_modules/pkg/index.js'))];
                case 7:
                    _m.apply(void 0, [_o.sent()]).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('Remove folder', function () {
    var removals = function () { return runs.filter(function (a) { return a.includes('worktree') && a.includes('remove'); }); };
    (0, vitest_1.it)('removes a merged, clean folder with a plain git worktree remove, keeps the branch and forgets the folder', function () { return __awaiter(void 0, void 0, void 0, function () {
        var space, _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, mergeIntoMain('one')];
                case 1:
                    _f.sent();
                    _a = data;
                    return [4 /*yield*/, (0, space_api_1.removeTaskFolder)(d, KEY, 'one')];
                case 2:
                    space = _a.apply(void 0, [_f.sent()]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, isThere(one)];
                case 3:
                    _b.apply(void 0, [_f.sent()]).toBe(false);
                    (0, vitest_1.expect)(removals()).toEqual([['git', '--no-optional-locks', 'worktree', 'remove', '--', one]]);
                    (0, vitest_1.expect)(runs.every(function (a) { return !a.includes('--force') && !a.includes('-f'); })).toBe(true);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, git(repo, 'branch', '--list', 'task/one')];
                case 4:
                    _c.apply(void 0, [_f.sent()]).toContain('task/one');
                    _d = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 5:
                    _d.apply(void 0, [(_f.sent()).tasks.find(function (t) { return t.id === 'one'; }).worktreePath]).toBeNull();
                    _e = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 6:
                    _e.apply(void 0, [(_f.sent()).tasks.find(function (t) { return t.id === 'two'; }).worktreePath]).toBe(two);
                    (0, vitest_1.expect)(space.folders.map(function (f) { return f.taskId; })).toEqual(['two']);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a folder with an uncommitted change, and leaves it with the change', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, mergeIntoMain('one')];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(one, 'a.txt'), 'unsaved\n')];
                case 2:
                    _e.sent();
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, (0, space_api_1.removeTaskFolder)(d, KEY, 'one')];
                case 3:
                    _a.apply(void 0, [_b.apply(void 0, [_e.sent()])]).toBe(constants_1.BRANCH_TEXT.folderChanged);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(one, 'a.txt'), 'utf8')];
                case 4:
                    _c.apply(void 0, [_e.sent()]).toBe('unsaved\n');
                    (0, vitest_1.expect)(removals()).toEqual([]);
                    _d = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 5:
                    _d.apply(void 0, [(_e.sent()).tasks[0].worktreePath]).toBe(one);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a folder with an untracked file, and leaves the file there', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, mergeIntoMain('one')];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(one, 'notes'))];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(one, 'notes/idea.md'), 'idea\n')];
                case 3:
                    _d.sent();
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, (0, space_api_1.removeTaskFolder)(d, KEY, 'one')];
                case 4:
                    _a.apply(void 0, [_b.apply(void 0, [_d.sent()])]).toBe(constants_1.BRANCH_TEXT.folderChanged);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(one, 'notes/idea.md'), 'utf8')];
                case 5:
                    _c.apply(void 0, [_d.sent()]).toBe('idea\n');
                    (0, vitest_1.expect)(removals()).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a folder whose branch is not merged', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(one, 'one.txt'), 'one\n')];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, git(one, 'add', 'one.txt')];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, git(one, 'commit', '-m', 'Unmerged work')];
                case 3:
                    _d.sent();
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, (0, space_api_1.removeTaskFolder)(d, KEY, 'one')];
                case 4:
                    _a.apply(void 0, [_b.apply(void 0, [_d.sent()])]).toBe(constants_1.BRANCH_TEXT.notMerged);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, isThere((0, node_path_1.join)(one, 'one.txt'))];
                case 5:
                    _c.apply(void 0, [_d.sent()]).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a branch with no commits since it started, though main contains it', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, (0, space_api_1.removeTaskFolder)(d, KEY, 'one')];
                case 1:
                    _a.apply(void 0, [_b.apply(void 0, [_d.sent()])]).toBe(constants_1.BRANCH_TEXT.notMerged);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, isThere(one)];
                case 2:
                    _c.apply(void 0, [_d.sent()]).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a merged, clean folder the current quest or a live session works in', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, mergeIntoMain('one')];
                case 1:
                    _f.sent();
                    return [4 /*yield*/, seed([quest('one', { state: 'current' }), quest('two')])];
                case 2:
                    _f.sent();
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, (0, space_api_1.removeTaskFolder)(d, KEY, 'one')];
                case 3:
                    _a.apply(void 0, [_b.apply(void 0, [_f.sent()])]).toBe(constants_1.BRANCH_TEXT.spaceHeld);
                    return [4 /*yield*/, seed([quest('one'), quest('two')])];
                case 4:
                    _f.sent();
                    return [4 /*yield*/, session({ workingPath: one })];
                case 5:
                    _f.sent();
                    _c = vitest_1.expect;
                    _d = refused;
                    return [4 /*yield*/, (0, space_api_1.removeTaskFolder)(d, KEY, 'one')];
                case 6:
                    _c.apply(void 0, [_d.apply(void 0, [_f.sent()])]).toBe(constants_1.BRANCH_TEXT.spaceHeld);
                    _e = vitest_1.expect;
                    return [4 /*yield*/, isThere(one)];
                case 7:
                    _e.apply(void 0, [_f.sent()]).toBe(true);
                    (0, vitest_1.expect)(removals()).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses a quest with no folder of its own', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, (0, space_api_1.removeTaskFolder)(d, KEY, 'nobody')];
                case 1:
                    _a.apply(void 0, [_b.apply(void 0, [_c.sent()])]).toBe(constants_1.BRANCH_TEXT.missing);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps the folder and the record when git refuses the removal', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, mergeIntoMain('one')];
                case 1:
                    _e.sent();
                    failing = function (argv) { return argv.includes('worktree') && argv.includes('remove'); };
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, (0, space_api_1.removeTaskFolder)(d, KEY, 'one')];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_e.sent()])]).toBe(constants_1.BRANCH_TEXT.spaceRemove);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, isThere(one)];
                case 3:
                    _c.apply(void 0, [_e.sent()]).toBe(true);
                    _d = vitest_1.expect;
                    return [4 /*yield*/, onDisk()];
                case 4:
                    _d.apply(void 0, [(_e.sent()).tasks[0].worktreePath]).toBe(one);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('lets the quest start again in a fresh worktree on the branch it kept', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, task, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, mergeIntoMain('one')];
                case 1:
                    _e.sent();
                    _a = data;
                    return [4 /*yield*/, (0, space_api_1.removeTaskFolder)(d, KEY, 'one')];
                case 2:
                    _a.apply(void 0, [_e.sent()]);
                    return [4 /*yield*/, seed([quest('one', { state: 'queued', worktreePath: null }), quest('two')])];
                case 3:
                    _e.sent();
                    _b = data;
                    return [4 /*yield*/, (0, start_api_1.startQuest)(d, KEY, 'one', 'claude')];
                case 4:
                    _b.apply(void 0, [_e.sent()]);
                    return [4 /*yield*/, onDisk()];
                case 5:
                    task = (_e.sent()).tasks.find(function (t) { return t.id === 'one'; });
                    (0, vitest_1.expect)(task).toMatchObject({ state: 'current', branch: 'task/one' });
                    (0, vitest_1.expect)(task.worktreePath).toBeTruthy();
                    _c = vitest_1.expect;
                    return [4 /*yield*/, git(task.worktreePath, 'branch', '--show-current')];
                case 6:
                    _c.apply(void 0, [_e.sent()]).toBe('task/one');
                    _d = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(task.worktreePath, 'one.txt'), 'utf8')];
                case 7:
                    _d.apply(void 0, [_e.sent()]).toBe('one\n');
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)('clearing after a merge', function () {
    var BUILD = ['dist', 'node_modules', 'packages/app/node_modules'];
    (0, vitest_1.it)('clears the merged quest\'s build folders and says which, keeping everything else', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, mergeIntoMain('one')];
                case 1:
                    _e.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, space_api_1.clearAfterMerge)(d, KEY, 'one')];
                case 2:
                    _a.apply(void 0, [_e.sent()]).toEqual([constants_1.BRANCH_TEXT.clearedAfterMerge(BUILD)]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, isThere((0, node_path_1.join)(one, 'node_modules'))];
                case 3:
                    _b.apply(void 0, [_e.sent()]).toBe(false);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(one, '.env'), 'utf8')];
                case 4:
                    _c.apply(void 0, [_e.sent()]).toBe('SECRET=1');
                    _d = vitest_1.expect;
                    return [4 /*yield*/, isThere((0, node_path_1.join)(two, 'node_modules/pkg/index.js'))];
                case 5:
                    _d.apply(void 0, [_e.sent()]).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps the build folders of a current quest and says why', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, seed([quest('one', { state: 'current' }), quest('two')])];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, space_api_1.clearAfterMerge)(d, KEY, 'one')];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toEqual([constants_1.BRANCH_TEXT.keptAfterMerge]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, isThere((0, node_path_1.join)(one, 'node_modules/pkg/index.js'))];
                case 3:
                    _b.apply(void 0, [_c.sent()]).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps the build folders a live session works in', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, session({ workingPath: one })];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, space_api_1.clearAfterMerge)(d, KEY, 'one')];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toEqual([constants_1.BRANCH_TEXT.keptAfterMerge]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, isThere((0, node_path_1.join)(one, 'node_modules/pkg/index.js'))];
                case 3:
                    _b.apply(void 0, [_c.sent()]).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps the build folders a live session reaches through a symlink', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, promises_1.symlink)((0, node_path_1.join)(home, 'quests'), (0, node_path_1.join)(home, 'linked'))];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, session({ workingPath: (0, node_path_1.join)(home, 'linked/one') })];
                case 2:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, space_api_1.clearAfterMerge)(d, KEY, 'one')];
                case 3:
                    _a.apply(void 0, [_c.sent()]).toEqual([constants_1.BRANCH_TEXT.keptAfterMerge]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, isThere((0, node_path_1.join)(one, 'node_modules/pkg/index.js'))];
                case 4:
                    _b.apply(void 0, [_c.sent()]).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('clears them when the session there has gone stale', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, session({ workingPath: one, heartbeat: NOW - 91000 })];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, space_api_1.clearAfterMerge)(d, KEY, 'one')];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toEqual([constants_1.BRANCH_TEXT.clearedAfterMerge(BUILD)]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, isThere((0, node_path_1.join)(one, 'node_modules'))];
                case 3:
                    _b.apply(void 0, [_c.sent()]).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says nothing for a quest with no folder or nothing to clear', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _i, BUILD_1, folder, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, space_api_1.clearAfterMerge)(d, KEY, 'nobody')];
                case 1:
                    _a.apply(void 0, [_c.sent()]).toEqual([]);
                    _i = 0, BUILD_1 = BUILD;
                    _c.label = 2;
                case 2:
                    if (!(_i < BUILD_1.length)) return [3 /*break*/, 5];
                    folder = BUILD_1[_i];
                    return [4 /*yield*/, (0, promises_1.rm)((0, node_path_1.join)(one, folder), { recursive: true })];
                case 3:
                    _c.sent();
                    _c.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    _b = vitest_1.expect;
                    return [4 /*yield*/, (0, space_api_1.clearAfterMerge)(d, KEY, 'one')];
                case 6:
                    _b.apply(void 0, [_c.sent()]).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('never throws when git fails, and leaves the folder as it was', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    failing = function (argv) { return argv.includes('ls-files'); };
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, space_api_1.clearAfterMerge)(d, KEY, 'one')];
                case 1:
                    _a.apply(void 0, [_c.sent()]).toEqual([]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, isThere((0, node_path_1.join)(one, 'node_modules/pkg/index.js'))];
                case 2:
                    _b.apply(void 0, [_c.sent()]).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('also clears another merged quest\'s folder nobody works in, counted in one line after the quest\'s own', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, mergeIntoMain('two')];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, mergeIntoMain('one')];
                case 2:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, space_api_1.clearAfterMerge)(d, KEY, 'one')];
                case 3:
                    _a.apply(void 0, [_c.sent()]).toEqual([constants_1.BRANCH_TEXT.clearedAfterMerge(BUILD), constants_1.BRANCH_TEXT.clearedMergedAfterMerge(1)]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, isThere((0, node_path_1.join)(two, 'node_modules'))];
                case 4:
                    _b.apply(void 0, [_c.sent()]).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps a still-current quest\'s own folder and sweeps the earlier merged one', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: 
                // How merges really go: the quest is finished only after its merge.
                return [4 /*yield*/, mergeIntoMain('two')];
                case 1:
                    // How merges really go: the quest is finished only after its merge.
                    _d.sent();
                    return [4 /*yield*/, mergeIntoMain('one')];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, seed([quest('one', { state: 'current' }), quest('two')])];
                case 3:
                    _d.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, space_api_1.clearAfterMerge)(d, KEY, 'one')];
                case 4:
                    _a.apply(void 0, [_d.sent()]).toEqual([constants_1.BRANCH_TEXT.keptAfterMerge, constants_1.BRANCH_TEXT.clearedMergedAfterMerge(1)]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, isThere((0, node_path_1.join)(one, 'node_modules/pkg/index.js'))];
                case 5:
                    _b.apply(void 0, [_d.sent()]).toBe(true);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, isThere((0, node_path_1.join)(two, 'node_modules'))];
                case 6:
                    _c.apply(void 0, [_d.sent()]).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('counts two other swept folders in one plural line', function () { return __awaiter(void 0, void 0, void 0, function () {
        var lines, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, addThree()];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, mergeIntoMain('two')];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, mergeIntoMain('three')];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, mergeIntoMain('one')];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, seed([quest('one'), quest('two'), quest('three')])];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, (0, space_api_1.clearAfterMerge)(d, KEY, 'one')];
                case 6:
                    lines = _c.sent();
                    (0, vitest_1.expect)(lines).toEqual([constants_1.BRANCH_TEXT.clearedAfterMerge(BUILD), constants_1.BRANCH_TEXT.clearedMergedAfterMerge(2)]);
                    (0, vitest_1.expect)(lines[1]).toBe("Cleared build folders in 2 other merged quests' folders.");
                    _a = vitest_1.expect;
                    return [4 /*yield*/, isThere((0, node_path_1.join)(two, 'node_modules'))];
                case 7:
                    _a.apply(void 0, [_c.sent()]).toBe(false);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, isThere((0, node_path_1.join)(folderOf('three'), 'node_modules'))];
                case 8:
                    _b.apply(void 0, [_c.sent()]).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps a put-back merged quest\'s build folders for when it resumes, and sweeps a finished one', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, addThree()];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, mergeIntoMain('two')];
                case 2:
                    _e.sent();
                    return [4 /*yield*/, mergeIntoMain('three')];
                case 3:
                    _e.sent();
                    return [4 /*yield*/, mergeIntoMain('one')];
                case 4:
                    _e.sent();
                    return [4 /*yield*/, seed([quest('one'), quest('two', { state: 'queued' }), quest('three')])];
                case 5:
                    _e.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, space_api_1.clearAfterMerge)(d, KEY, 'one')];
                case 6:
                    _a.apply(void 0, [_e.sent()]).toEqual([constants_1.BRANCH_TEXT.clearedAfterMerge(BUILD), constants_1.BRANCH_TEXT.clearedMergedAfterMerge(1)]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, isThere((0, node_path_1.join)(two, 'node_modules/pkg/index.js'))];
                case 7:
                    _b.apply(void 0, [_e.sent()]).toBe(true);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, isThere((0, node_path_1.join)(two, 'dist/app.js'))];
                case 8:
                    _c.apply(void 0, [_e.sent()]).toBe(true);
                    _d = vitest_1.expect;
                    return [4 /*yield*/, isThere((0, node_path_1.join)(folderOf('three'), 'node_modules'))];
                case 9:
                    _d.apply(void 0, [_e.sent()]).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('clears the merged quest\'s own folder even when it was put back', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, mergeIntoMain('one')];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, seed([quest('one', { state: 'queued' }), quest('two')])];
                case 2:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, space_api_1.clearAfterMerge)(d, KEY, 'one')];
                case 3:
                    _a.apply(void 0, [_c.sent()]).toEqual([constants_1.BRANCH_TEXT.clearedAfterMerge(BUILD)]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, isThere((0, node_path_1.join)(one, 'node_modules'))];
                case 4:
                    _b.apply(void 0, [_c.sent()]).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    vitest_1.it.each([
        ['has work main does not contain', function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(two, 'two.txt'), 'two\n')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, git(two, 'add', 'two.txt')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, git(two, 'commit', '-m', 'Unmerged')];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            }); }); }],
        ['has no commits since it started', function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/];
            }); }); }],
    ])('leaves another quest\'s folder alone when its branch %s', function (_, arrange) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, arrange()];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, mergeIntoMain('one')];
                case 2:
                    _d.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, space_api_1.clearAfterMerge)(d, KEY, 'one')];
                case 3:
                    _a.apply(void 0, [_d.sent()]).toEqual([constants_1.BRANCH_TEXT.clearedAfterMerge(BUILD)]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, isThere((0, node_path_1.join)(two, 'node_modules/pkg/index.js'))];
                case 4:
                    _b.apply(void 0, [_d.sent()]).toBe(true);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, isThere((0, node_path_1.join)(two, 'dist/app.js'))];
                case 5:
                    _c.apply(void 0, [_d.sent()]).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    vitest_1.it.each([
        ['its quest is current', function () { return seed([quest('one'), quest('two', { state: 'current' })]); }],
        ['a live session works there', function () { return session({ workingPath: two }); }],
    ])('leaves another merged quest\'s folder alone while %s', function (_, hold) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, mergeIntoMain('two')];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, mergeIntoMain('one')];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, hold()];
                case 3:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, space_api_1.clearAfterMerge)(d, KEY, 'one')];
                case 4:
                    _a.apply(void 0, [_c.sent()]).toEqual([constants_1.BRANCH_TEXT.clearedAfterMerge(BUILD)]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, isThere((0, node_path_1.join)(two, 'node_modules/pkg/index.js'))];
                case 5:
                    _b.apply(void 0, [_c.sent()]).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    vitest_1.it.each([
        ['the quest\'s own folder', function () { return one; }, function () { return two; }, [constants_1.BRANCH_TEXT.clearedMergedAfterMerge(1)]],
        ['the other merged folder', function () { return two; }, function () { return one; }, [constants_1.BRANCH_TEXT.clearedAfterMerge(BUILD)]],
    ])('a git failure in %s leaves it as it was, still clears the other and does not throw', function (_, broken, fine, lines) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, mergeIntoMain('two')];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, mergeIntoMain('one')];
                case 2:
                    _d.sent();
                    failing = function (argv, cwd) { return cwd === broken() && argv.includes('ls-files'); };
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, space_api_1.clearAfterMerge)(d, KEY, 'one')];
                case 3:
                    _a.apply(void 0, [_d.sent()]).toEqual(lines);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, isThere((0, node_path_1.join)(broken(), 'node_modules/pkg/index.js'))];
                case 4:
                    _b.apply(void 0, [_d.sent()]).toBe(true);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, isThere((0, node_path_1.join)(fine(), 'node_modules'))];
                case 5:
                    _c.apply(void 0, [_d.sent()]).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('clears nothing and says nothing when the branches cannot be read', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, mergeIntoMain('two')];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, mergeIntoMain('one')];
                case 2:
                    _d.sent();
                    failing = function (argv) { return argv.includes('for-each-ref'); };
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, space_api_1.clearAfterMerge)(d, KEY, 'one')];
                case 3:
                    _a.apply(void 0, [_d.sent()]).toEqual([]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, isThere((0, node_path_1.join)(one, 'node_modules/pkg/index.js'))];
                case 4:
                    _b.apply(void 0, [_d.sent()]).toBe(true);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, isThere((0, node_path_1.join)(two, 'node_modules/pkg/index.js'))];
                case 5:
                    _c.apply(void 0, [_d.sent()]).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps .env, tracked folders, other ignored folders and a symlinked node_modules in a swept folder', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _i, BUILD_2, gone, _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0: return [4 /*yield*/, mergeIntoMain('two')];
                case 1:
                    _k.sent();
                    return [4 /*yield*/, mergeIntoMain('one')];
                case 2:
                    _k.sent();
                    return [4 /*yield*/, (0, space_api_1.clearAfterMerge)(d, KEY, 'one')];
                case 3:
                    _k.sent();
                    _i = 0, BUILD_2 = BUILD;
                    _k.label = 4;
                case 4:
                    if (!(_i < BUILD_2.length)) return [3 /*break*/, 7];
                    gone = BUILD_2[_i];
                    _a = vitest_1.expect;
                    return [4 /*yield*/, isThere((0, node_path_1.join)(two, gone))];
                case 5:
                    _a.apply(void 0, [_k.sent()]).toBe(false);
                    _k.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7:
                    _b = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(two, 'build/index.html'), 'utf8')];
                case 8:
                    _b.apply(void 0, [_k.sent()]).toBe('<p>tracked</p>\n');
                    _c = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(two, 'target/keep.txt'), 'utf8')];
                case 9:
                    _c.apply(void 0, [_k.sent()]).toBe('tracked\n');
                    _d = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(two, 'target/junk.o'), 'utf8')];
                case 10:
                    _d.apply(void 0, [_k.sent()]).toBe('object');
                    _e = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(two, '.env'), 'utf8')];
                case 11:
                    _e.apply(void 0, [_k.sent()]).toBe('SECRET=1');
                    _f = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(two, 'logs/out.log'), 'utf8')];
                case 12:
                    _f.apply(void 0, [_k.sent()]).toBe('log');
                    _g = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.lstat)((0, node_path_1.join)(two, 'apps/web/node_modules'))];
                case 13:
                    _g.apply(void 0, [(_k.sent()).isSymbolicLink()]).toBe(true);
                    _h = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(home, 'shared-modules/keep.js'), 'utf8')];
                case 14:
                    _h.apply(void 0, [_k.sent()]).toBe('shared');
                    _j = vitest_1.expect;
                    return [4 /*yield*/, git(two, 'status', '--porcelain')];
                case 15:
                    _j.apply(void 0, [_k.sent()]).toBe('');
                    return [2 /*return*/];
            }
        });
    }); });
});
// An app update builds with the first node_modules it finds, which can be a
// quest folder's: nothing goes while one runs.
(0, vitest_1.describe)('while an app update runs', function () {
    var BUILD = ['dist', 'node_modules', 'packages/app/node_modules'];
    var touched = function () { return runs.filter(function (a) { return a[0] === 'rm' || (a.includes('worktree') && a.includes('remove')); }); };
    (0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, mergeIntoMain('two')];
            case 1:
                _a.sent();
                return [4 /*yield*/, mergeIntoMain('one')];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    }); }); });
    vitest_1.it.each(['queued', 'checking', 'building', 'verifying', 'installing'])('an update that is %s keeps every folder: the merge clears nothing, Free space and Remove folder refuse', function (phase) { return __awaiter(void 0, void 0, void 0, function () {
        var before, _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, update({ phase: phase, worker: process.pid })];
                case 1:
                    _g.sent();
                    return [4 /*yield*/, snapshot()];
                case 2:
                    before = _g.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, space_api_1.clearAfterMerge)(d, KEY, 'one')];
                case 3:
                    _a.apply(void 0, [_g.sent()]).toEqual([constants_1.BRANCH_TEXT.keptForUpdate]);
                    _b = vitest_1.expect;
                    _c = refused;
                    return [4 /*yield*/, (0, space_api_1.freeFolderSpace)(d, KEY, [one, two])];
                case 4:
                    _b.apply(void 0, [_c.apply(void 0, [_g.sent()])]).toBe(constants_1.BRANCH_TEXT.spaceUpdating);
                    _d = vitest_1.expect;
                    _e = refused;
                    return [4 /*yield*/, (0, space_api_1.removeTaskFolder)(d, KEY, 'one')];
                case 5:
                    _d.apply(void 0, [_e.apply(void 0, [_g.sent()])]).toBe(constants_1.BRANCH_TEXT.spaceUpdating);
                    _f = vitest_1.expect;
                    return [4 /*yield*/, snapshot()];
                case 6:
                    _f.apply(void 0, [_g.sent()]).toEqual(before);
                    (0, vitest_1.expect)(touched()).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('an update that has not saved progress for a while still counts while its worker is alive', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, update({ phase: 'building', updatedAt: Date.now() - 60000, worker: process.pid })];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, space_api_1.clearAfterMerge)(d, KEY, 'one')];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toEqual([constants_1.BRANCH_TEXT.keptForUpdate]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, isThere((0, node_path_1.join)(one, 'node_modules/pkg/index.js'))];
                case 3:
                    _b.apply(void 0, [_c.sent()]).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('Remove folder names a folder\'s own reason before the update', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, update({ phase: 'building', worker: process.pid })];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(one, 'a.txt'), 'unsaved\n')];
                case 2:
                    _e.sent();
                    _a = vitest_1.expect;
                    _b = refused;
                    return [4 /*yield*/, (0, space_api_1.removeTaskFolder)(d, KEY, 'one')];
                case 3:
                    _a.apply(void 0, [_b.apply(void 0, [_e.sent()])]).toBe(constants_1.BRANCH_TEXT.folderChanged);
                    return [4 /*yield*/, seed([quest('one'), quest('two', { state: 'current' })])];
                case 4:
                    _e.sent();
                    _c = vitest_1.expect;
                    _d = refused;
                    return [4 /*yield*/, (0, space_api_1.removeTaskFolder)(d, KEY, 'two')];
                case 5:
                    _c.apply(void 0, [_d.apply(void 0, [_e.sent()])]).toBe(constants_1.BRANCH_TEXT.spaceHeld);
                    return [2 /*return*/];
            }
        });
    }); });
    vitest_1.it.each([
        ['is idle', function () { return update({ phase: 'idle' }); }],
        ['has installed', function () { return update({ phase: 'installed' }); }],
        ['has failed', function () { return update({ phase: 'failed' }); }],
        ['stalled and its worker has exited', function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = update;
                            _b = { phase: 'building', updatedAt: Date.now() - 60000 };
                            return [4 /*yield*/, deadPid()];
                        case 1: return [2 /*return*/, _a.apply(void 0, [(_b.worker = _c.sent(), _b)])];
                    }
                });
            }); }],
        ['stalled with no worker', function () { return update({ phase: 'installing', updatedAt: Date.now() - 60000 }); }],
    ])('an update that %s leaves the merge, Free space and Remove folder free to clear', function (_, arrange) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, arrange()];
                case 1:
                    _g.sent();
                    _a = data;
                    return [4 /*yield*/, (0, space_api_1.freeFolderSpace)(d, KEY, [two])];
                case 2:
                    _a.apply(void 0, [_g.sent()]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, isThere((0, node_path_1.join)(two, 'node_modules'))];
                case 3:
                    _b.apply(void 0, [_g.sent()]).toBe(false);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, (0, space_api_1.clearAfterMerge)(d, KEY, 'one')];
                case 4:
                    _c.apply(void 0, [_g.sent()]).toEqual([constants_1.BRANCH_TEXT.clearedAfterMerge(BUILD)]);
                    _d = vitest_1.expect;
                    return [4 /*yield*/, isThere((0, node_path_1.join)(one, 'node_modules'))];
                case 5:
                    _d.apply(void 0, [_g.sent()]).toBe(false);
                    _e = data;
                    return [4 /*yield*/, (0, space_api_1.removeTaskFolder)(d, KEY, 'one')];
                case 6:
                    _e.apply(void 0, [_g.sent()]);
                    _f = vitest_1.expect;
                    return [4 /*yield*/, isThere(one)];
                case 7:
                    _f.apply(void 0, [_g.sent()]).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    vitest_1.it.each([
        ['is not JSON', '{"phase": "buil'],
        ['names a phase there is no such thing as', JSON.stringify({ phase: 'brewing', commit: 'a'.repeat(40), repository: 'x', detail: null })],
    ])('a damaged update state that %s is logged and leaves clearing possible', function (_, text) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, update(text)];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, space_api_1.clearAfterMerge)(d, KEY, 'one')];
                case 2:
                    _a.apply(void 0, [_c.sent()]).toEqual([constants_1.BRANCH_TEXT.clearedAfterMerge(BUILD), constants_1.BRANCH_TEXT.clearedMergedAfterMerge(1)]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, isThere((0, node_path_1.join)(one, 'node_modules'))];
                case 3:
                    _b.apply(void 0, [_c.sent()]).toBe(false);
                    (0, vitest_1.expect)(logged.some(function (l) { return l.includes(' error Reading the update state before clearing build folders failed\n'); })).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
});
