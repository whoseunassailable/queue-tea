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
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var node_util_1 = require("node:util");
var vitest_1 = require("vitest");
var record_source_1 = require("../../../../../hooks/shared/records/data/datasources/record_source");
var logger_1 = require("../../../core/logger");
var node_host_1 = require("../../../core/node_host");
var fixtures_1 = require("../../tasks/api/fixtures");
var user_git_1 = require("../data/user_git");
var merge_workspace_1 = require("../data/merge_workspace");
var constants_1 = require("../domain/constants");
var branch_api_1 = require("./branch_api");
var commit_api_1 = require("./commit_api");
var checks_api_1 = require("./checks_api");
var push_api_1 = require("./push_api");
// Opt-in because these tests execute real commits/merges and a local-only
// push. Every repository, worktree, record and remote is under our temp root.
// No production repository, app, user Git hooks, or network is touched.
var integration = process.env.QUEUE_TEA_GIT_TESTS === '1' ? vitest_1.describe : vitest_1.describe.skip;
var run = (0, node_util_1.promisify)(node_child_process_1.execFile);
var KEY = 'demo-abc123';
var data = function (reply) { if (!reply.ok)
    throw new Error(reply.error.message); return reply.data; };
integration('user-approved branch workflow in disposable repositories', function () {
    var folder;
    var repo;
    var taskPath;
    var d;
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
    var review = function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = data;
                return [4 /*yield*/, (0, branch_api_1.readBranch)(d, KEY, 'one', 'main')];
            case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
        }
    }); }); };
    var prepare = function () { return __awaiter(void 0, void 0, void 0, function () { var r, _a; return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, review()];
            case 1:
                r = _b.sent();
                _a = data;
                return [4 /*yield*/, (0, branch_api_1.prepareMerge)(d, KEY, { taskId: 'one', target: 'main', fingerprint: r.fingerprint, idleConfirmed: true })];
            case 2: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
        }
    }); }); };
    var finish = function (id, approval) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, (0, branch_api_1.completeMerge)(d, KEY, { operationId: id, approval: approval, message: 'Merge task/one into main', idleConfirmed: true })];
    }); }); };
    var taskCommit = function (name, text) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(taskPath, name), text)];
            case 1:
                _a.sent();
                return [4 /*yield*/, git(taskPath, 'add', '--', name)];
            case 2:
                _a.sent();
                return [4 /*yield*/, git(taskPath, 'commit', '-m', 'Task change')];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    }); }); };
    (0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, startCommit, log, record;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = promises_1.realpath;
                    return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-merge-test-'))];
                case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
                case 2:
                    folder = _b.sent();
                    repo = (0, node_path_1.join)(folder, 'repo');
                    taskPath = (0, node_path_1.join)(folder, 'task');
                    return [4 /*yield*/, (0, promises_1.mkdir)(repo)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, git(repo, 'init', '-b', 'main')];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, git(repo, 'config', 'user.name', 'Queue-tea test')];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, git(repo, 'config', 'user.email', 'test@example.invalid')];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, git(repo, 'config', 'core.hooksPath', '/dev/null')];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, git(repo, 'config', 'commit.gpgsign', 'false')];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(repo, 'a.txt'), 'base\n')];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, git(repo, 'add', 'a.txt')];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, git(repo, 'commit', '-m', 'Base')];
                case 11:
                    _b.sent();
                    return [4 /*yield*/, git(repo, 'rev-parse', 'HEAD')];
                case 12:
                    startCommit = _b.sent();
                    return [4 /*yield*/, git(repo, 'worktree', 'add', '-b', 'task/one', taskPath, 'main')];
                case 13:
                    _b.sent();
                    return [4 /*yield*/, taskCommit('feature.txt', 'feature\n')];
                case 14:
                    _b.sent();
                    log = (0, logger_1.createLogger)('dev', function () { });
                    d = { host: (0, node_host_1.nodeHost)(log, function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ exitCode: 0, stdout: '', stderr: '' })];
                        }); }); }), home: folder, now: function () { return Date.now(); }, log: log, offsetMinutes: function () { return 0; }, newId: function () { return 'test'; }, terminal: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, 'terminal'];
                        }); }); }, copy: function () { }, userGit: (0, user_git_1.nodeUserGit)(log) };
                    record = __assign(__assign({}, (0, record_source_1.emptyRecord)('demo', repo)), { version: 2, tasks: [(0, fixtures_1.makeTask)({ id: 'one', state: 'current', branch: 'task/one', baseBranch: 'main', startCommit: startCommit, worktreePath: taskPath })] });
                    return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(folder, '.queue-tea/projects'), { recursive: true })];
                case 15:
                    _b.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(folder, ".queue-tea/projects/".concat(KEY, ".json")), JSON.stringify(record))];
                case 16:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!folder) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, promises_1.rm)(folder, { recursive: true, force: true })];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    }); }); });
    (0, vitest_1.it)('prepares separately, merges with two parents, retains task work, and recovers duplicate delivery', function () { return __awaiter(void 0, void 0, void 0, function () {
        var before, source, prepared, _a, _b, completed, _c, _d, _e, _f, repeated, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0: return [4 /*yield*/, git(repo, 'rev-parse', 'HEAD')];
                case 1:
                    before = _k.sent();
                    return [4 /*yield*/, git(taskPath, 'rev-parse', 'HEAD')];
                case 2:
                    source = _k.sent();
                    return [4 /*yield*/, prepare()];
                case 3:
                    prepared = _k.sent();
                    (0, vitest_1.expect)(prepared.operation.stage).toBe('ready');
                    (0, vitest_1.expect)(prepared.approval).toBeTruthy();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, git(repo, 'rev-parse', 'HEAD')];
                case 4:
                    _a.apply(void 0, [_k.sent()]).toBe(before);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, git(taskPath, 'rev-parse', 'HEAD')];
                case 5:
                    _b.apply(void 0, [_k.sent()]).toBe(source);
                    _c = data;
                    return [4 /*yield*/, finish(prepared.operation.id, prepared.approval)];
                case 6:
                    completed = _c.apply(void 0, [_k.sent()]);
                    (0, vitest_1.expect)(completed.operation.stage).toBe('merged');
                    _d = vitest_1.expect;
                    return [4 /*yield*/, git(repo, 'show', '-s', '--format=%P', 'HEAD')];
                case 7:
                    _d.apply(void 0, [_k.sent()]).toBe("".concat(before, " ").concat(source));
                    _e = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(repo, 'feature.txt'), 'utf8')];
                case 8:
                    _e.apply(void 0, [_k.sent()]).toBe('feature\n');
                    _f = vitest_1.expect;
                    return [4 /*yield*/, git(taskPath, 'branch', '--show-current')];
                case 9:
                    _f.apply(void 0, [_k.sent()]).toBe('task/one');
                    _g = data;
                    return [4 /*yield*/, finish(prepared.operation.id, prepared.approval)];
                case 10:
                    repeated = _g.apply(void 0, [_k.sent()]);
                    (0, vitest_1.expect)(repeated.operation.commit).toBe(completed.operation.commit);
                    _h = vitest_1.expect;
                    _j = data;
                    return [4 /*yield*/, (0, branch_api_1.readBranches)(d, KEY)];
                case 11:
                    _h.apply(void 0, [_j.apply(void 0, [_k.sent()]).tasks[0].merged]).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('invalidates approval when the source changes, and blocks a dirty destination', function () { return __awaiter(void 0, void 0, void 0, function () {
        var prepared, _a, before, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, prepare()];
                case 1:
                    prepared = _d.sent();
                    return [4 /*yield*/, taskCommit('later.txt', 'later\n')];
                case 2:
                    _d.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, finish(prepared.operation.id, prepared.approval)];
                case 3:
                    _a.apply(void 0, [_d.sent()]).toMatchObject({ ok: false, error: { message: vitest_1.expect.stringContaining('changed') } });
                    return [4 /*yield*/, git(repo, 'rev-parse', 'HEAD')];
                case 4:
                    before = _d.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(repo, 'unrelated.txt'), 'keep\n')];
                case 5:
                    _d.sent();
                    _b = vitest_1.expect;
                    return [4 /*yield*/, review()];
                case 6:
                    _b.apply(void 0, [(_d.sent()).blocked]).toContain('clean working folder');
                    _c = vitest_1.expect;
                    return [4 /*yield*/, git(repo, 'rev-parse', 'HEAD')];
                case 7:
                    _c.apply(void 0, [_d.sent()]).toBe(before);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('isolates conflicts, rejects markers, and applies only the reviewed resolution', function () { return __awaiter(void 0, void 0, void 0, function () {
        var prepared, _a, _b, resolved, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, taskCommit('a.txt', 'task side\n')];
                case 1:
                    _g.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(repo, 'a.txt'), 'main side\n')];
                case 2:
                    _g.sent();
                    return [4 /*yield*/, git(repo, 'commit', '-am', 'Main change')];
                case 3:
                    _g.sent();
                    return [4 /*yield*/, prepare()];
                case 4:
                    prepared = _g.sent();
                    (0, vitest_1.expect)(prepared.operation.stage).toBe('conflicts');
                    (0, vitest_1.expect)(prepared.conflicts[0]).toMatchObject({ path: 'a.txt', base: 'base\n', target: 'main side\n', source: 'task side\n' });
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(taskPath, 'a.txt'), 'utf8')];
                case 5:
                    _a.apply(void 0, [_g.sent()]).toBe('task side\n');
                    _b = vitest_1.expect;
                    return [4 /*yield*/, (0, branch_api_1.resolveMergeFile)(d, KEY, { operationId: prepared.operation.id, path: 'a.txt', choice: 'edited', text: '<<<<<<< HEAD\nunresolved' })];
                case 6:
                    _b.apply(void 0, [_g.sent()]).toMatchObject({ ok: false });
                    _c = data;
                    return [4 /*yield*/, (0, branch_api_1.resolveMergeFile)(d, KEY, { operationId: prepared.operation.id, path: 'a.txt', choice: 'edited', text: 'combined\n' })];
                case 7:
                    resolved = _c.apply(void 0, [_g.sent()]);
                    (0, vitest_1.expect)(resolved.operation.stage).toBe('ready');
                    _d = data;
                    return [4 /*yield*/, finish(prepared.operation.id, resolved.approval)];
                case 8:
                    _d.apply(void 0, [_g.sent()]);
                    _e = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(repo, 'a.txt'), 'utf8')];
                case 9:
                    _e.apply(void 0, [_g.sent()]).toBe('combined\n');
                    _f = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(taskPath, 'a.txt'), 'utf8')];
                case 10:
                    _f.apply(void 0, [_g.sent()]).toBe('task side\n');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('abandons only the isolated preparation and permits a new one', function () { return __awaiter(void 0, void 0, void 0, function () {
        var prepared, _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, prepare()];
                case 1:
                    prepared = _e.sent();
                    _a = vitest_1.expect;
                    _b = data;
                    return [4 /*yield*/, (0, branch_api_1.abandonMerge)(d, KEY, prepared.operation.id)];
                case 2:
                    _a.apply(void 0, [_b.apply(void 0, [_e.sent()]).operation.stage]).toBe('abandoned');
                    _c = vitest_1.expect;
                    return [4 /*yield*/, git(taskPath, 'branch', '--show-current')];
                case 3:
                    _c.apply(void 0, [_e.sent()]).toBe('task/one');
                    _d = vitest_1.expect;
                    return [4 /*yield*/, prepare()];
                case 4:
                    _d.apply(void 0, [(_e.sent()).operation.id]).not.toBe(prepared.operation.id);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('recovers a committed merge after a lost response without making another commit', function () { return __awaiter(void 0, void 0, void 0, function () {
        var prepared, original, commits, _a, recovered, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, prepare()];
                case 1:
                    prepared = _d.sent();
                    original = d.userGit;
                    commits = 0;
                    d.userGit = function (cwd, action) { return __awaiter(void 0, void 0, void 0, function () {
                        var result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, original(cwd, action)];
                                case 1:
                                    result = _a.sent();
                                    if (action.kind === 'commit') {
                                        commits++;
                                        throw new Error('simulated lost response');
                                    }
                                    return [2 /*return*/, result];
                            }
                        });
                    }); };
                    _a = vitest_1.expect;
                    return [4 /*yield*/, finish(prepared.operation.id, prepared.approval)];
                case 2:
                    _a.apply(void 0, [_d.sent()]).toMatchObject({ ok: false });
                    _b = data;
                    return [4 /*yield*/, (0, branch_api_1.readMergeWorkspace)(d, KEY, prepared.operation.id)];
                case 3:
                    recovered = _b.apply(void 0, [_d.sent()]);
                    (0, vitest_1.expect)(recovered.operation.stage).toBe('applying');
                    _c = data;
                    return [4 /*yield*/, finish(prepared.operation.id, recovered.approval)];
                case 4:
                    _c.apply(void 0, [_d.sent()]);
                    (0, vitest_1.expect)(commits).toBe(1);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('serializes concurrent preparation attempts and retains a single operation', function () { return __awaiter(void 0, void 0, void 0, function () {
        var r, request, answers, again, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, review()];
                case 1:
                    r = _b.sent();
                    request = { taskId: 'one', target: 'main', fingerprint: r.fingerprint, idleConfirmed: true };
                    return [4 /*yield*/, Promise.all([(0, branch_api_1.prepareMerge)(d, KEY, request), (0, branch_api_1.prepareMerge)(d, KEY, request)])];
                case 2:
                    answers = _b.sent();
                    (0, vitest_1.expect)(answers.filter(function (a) { return a.ok; })).toHaveLength(1);
                    _a = data;
                    return [4 /*yield*/, (0, branch_api_1.prepareMerge)(d, KEY, request)];
                case 3:
                    again = _a.apply(void 0, [_b.sent()]);
                    (0, vitest_1.expect)(again.operation.id).toBe(data(answers.find(function (a) { return a.ok; })).operation.id);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('commits selected files only and a duplicate request cannot commit again', function () { return __awaiter(void 0, void 0, void 0, function () {
        var r, request, _a, committed, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(taskPath, 'one.txt'), 'include\n')];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(taskPath, 'two.txt'), 'leave\n')];
                case 2:
                    _e.sent();
                    return [4 /*yield*/, review()];
                case 3:
                    r = _e.sent();
                    request = { taskId: 'one', target: 'main', fingerprint: r.fingerprint, idleConfirmed: true, files: ['one.txt'], message: 'Selected work' };
                    _a = data;
                    return [4 /*yield*/, (0, commit_api_1.commitBranchFiles)(d, KEY, request)];
                case 4:
                    _a.apply(void 0, [_e.sent()]);
                    return [4 /*yield*/, git(taskPath, 'rev-parse', 'HEAD')];
                case 5:
                    committed = _e.sent();
                    _b = vitest_1.expect;
                    return [4 /*yield*/, git(taskPath, 'status', '--porcelain')];
                case 6:
                    _b.apply(void 0, [_e.sent()]).toBe('?? two.txt');
                    _c = data;
                    return [4 /*yield*/, (0, commit_api_1.commitBranchFiles)(d, KEY, request)];
                case 7:
                    _c.apply(void 0, [_e.sent()]);
                    _d = vitest_1.expect;
                    return [4 /*yield*/, git(taskPath, 'rev-parse', 'HEAD')];
                case 8:
                    _d.apply(void 0, [_e.sent()]).toBe(committed);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps a local merge after push failure and publishes only after a fresh remote review', function () { return __awaiter(void 0, void 0, void 0, function () {
        var remote, prepared, completed, _a, checked, _b, original, _c, _d, published, _e, _f, _g;
        var _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    d.published = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); }); });
                    remote = (0, node_path_1.join)(folder, 'remote.git');
                    return [4 /*yield*/, (0, promises_1.mkdir)(remote)];
                case 1:
                    _j.sent();
                    return [4 /*yield*/, git(remote, 'init', '--bare')];
                case 2:
                    _j.sent();
                    return [4 /*yield*/, git(repo, 'remote', 'add', 'origin', remote)];
                case 3:
                    _j.sent();
                    return [4 /*yield*/, prepare()];
                case 4:
                    prepared = _j.sent();
                    _a = data;
                    return [4 /*yield*/, finish(prepared.operation.id, prepared.approval)];
                case 5:
                    completed = _a.apply(void 0, [_j.sent()]);
                    _b = data;
                    return [4 /*yield*/, (0, push_api_1.readPush)(d, KEY, completed.operation.id, 'origin')];
                case 6:
                    checked = _b.apply(void 0, [_j.sent()]);
                    original = d.userGit;
                    d.userGit = function (cwd, action) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, action.kind === 'push' ? { exitCode: 1, stdout: '', stderr: 'Rejected' } : original(cwd, action)];
                    }); }); };
                    _c = vitest_1.expect;
                    return [4 /*yield*/, (0, push_api_1.pushMerge)(d, KEY, checked)];
                case 7:
                    _c.apply(void 0, [_j.sent()]).toMatchObject({ ok: false });
                    (0, vitest_1.expect)(d.published).not.toHaveBeenCalled();
                    _d = vitest_1.expect;
                    return [4 /*yield*/, git(repo, 'rev-parse', 'HEAD')];
                case 8:
                    _d.apply(void 0, [_j.sent()]).toBe(completed.operation.commit);
                    d.userGit = original;
                    _e = data;
                    return [4 /*yield*/, (0, push_api_1.pushMerge)(d, KEY, checked)];
                case 9:
                    published = _e.apply(void 0, [_j.sent()]);
                    (0, vitest_1.expect)((_h = published.operation.published) === null || _h === void 0 ? void 0 : _h.commit).toBe(completed.operation.commit);
                    (0, vitest_1.expect)(d.published).toHaveBeenCalledWith(repo, 'origin', 'main', checked.head);
                    _f = vitest_1.expect;
                    return [4 /*yield*/, git(remote, 'rev-parse', 'refs/heads/main')];
                case 10:
                    _f.apply(void 0, [_j.sent()]).toBe(completed.operation.commit);
                    _g = vitest_1.expect;
                    return [4 /*yield*/, git((0, merge_workspace_1.workspacePath)(d, published.operation), 'status', '--porcelain')];
                case 11:
                    _g.apply(void 0, [_j.sent()]).toBe('');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('requires a new approval when a commit hook changes the prepared result', function () { return __awaiter(void 0, void 0, void 0, function () {
        var prepared, before, original, changed, _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, prepare()];
                case 1:
                    prepared = _e.sent();
                    return [4 /*yield*/, git(repo, 'rev-parse', 'HEAD')];
                case 2:
                    before = _e.sent();
                    original = d.userGit;
                    d.userGit = function (cwd, action) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(action.kind === 'commit')) return [3 /*break*/, 3];
                                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(cwd, 'generated.txt'), 'hook output\n')];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, git(cwd, 'add', 'generated.txt')];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3: return [2 /*return*/, original(cwd, action)];
                            }
                        });
                    }); };
                    _a = data;
                    return [4 /*yield*/, finish(prepared.operation.id, prepared.approval)];
                case 3:
                    changed = _a.apply(void 0, [_e.sent()]);
                    (0, vitest_1.expect)(changed.operation.stage).toBe('applying');
                    (0, vitest_1.expect)(changed.diff).toContain('hook output');
                    _b = vitest_1.expect;
                    return [4 /*yield*/, git(repo, 'rev-parse', 'HEAD')];
                case 4:
                    _b.apply(void 0, [_e.sent()]).toBe(before);
                    (0, vitest_1.expect)(changed.approval).not.toBe(prepared.approval);
                    _c = data;
                    return [4 /*yield*/, finish(prepared.operation.id, changed.approval)];
                case 5:
                    _c.apply(void 0, [_e.sent()]);
                    _d = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(repo, 'generated.txt'), 'utf8')];
                case 6:
                    _d.apply(void 0, [_e.sent()]).toBe('hook output\n');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('blocks observed writers even when no current task owns that session', function () { return __awaiter(void 0, void 0, void 0, function () {
        var r, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(folder, '.queue-tea/sessions'), { recursive: true })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(folder, '.queue-tea/sessions/working.json'), JSON.stringify({ id: 'writer', projectPath: repo, workingPath: taskPath, heartbeat: Date.now(), isTurnRunning: true, cup: { mood: 'working', line: '' } }))];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, review()];
                case 3:
                    r = _b.sent();
                    (0, vitest_1.expect)(r.blocked).toContain('still working');
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, branch_api_1.prepareMerge)(d, KEY, { taskId: 'one', target: 'main', fingerprint: r.fingerprint, idleConfirmed: true })];
                case 4:
                    _a.apply(void 0, [_b.sent()]).toMatchObject({ ok: false });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('invalidates a selected-file commit when already-dirty file contents change', function () { return __awaiter(void 0, void 0, void 0, function () {
        var r, before, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(taskPath, 'a.txt'), 'first edit\n')];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, review()];
                case 2:
                    r = _c.sent();
                    return [4 /*yield*/, git(taskPath, 'rev-parse', 'HEAD')];
                case 3:
                    before = _c.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(taskPath, 'a.txt'), 'second edit\n')];
                case 4:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, commit_api_1.commitBranchFiles)(d, KEY, { taskId: 'one', target: 'main', fingerprint: r.fingerprint, idleConfirmed: true, files: ['a.txt'], message: 'Reviewed first edit' })];
                case 5:
                    _a.apply(void 0, [_c.sent()]).toMatchObject({ ok: false, error: { message: vitest_1.expect.stringContaining('changed') } });
                    _b = vitest_1.expect;
                    return [4 /*yield*/, git(taskPath, 'rev-parse', 'HEAD')];
                case 6:
                    _b.apply(void 0, [_c.sent()]).toBe(before);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('updates a destination without a checkout without switching the project folder', function () { return __awaiter(void 0, void 0, void 0, function () {
        var before, prepared, finished, _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, git(repo, 'switch', '-c', 'holding')];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, git(repo, 'rev-parse', 'HEAD')];
                case 2:
                    before = _e.sent();
                    return [4 /*yield*/, prepare()];
                case 3:
                    prepared = _e.sent();
                    _a = data;
                    return [4 /*yield*/, finish(prepared.operation.id, prepared.approval)];
                case 4:
                    finished = _a.apply(void 0, [_e.sent()]);
                    _b = vitest_1.expect;
                    return [4 /*yield*/, git(repo, 'branch', '--show-current')];
                case 5:
                    _b.apply(void 0, [_e.sent()]).toBe('holding');
                    _c = vitest_1.expect;
                    return [4 /*yield*/, git(repo, 'rev-parse', 'HEAD')];
                case 6:
                    _c.apply(void 0, [_e.sent()]).toBe(before);
                    _d = vitest_1.expect;
                    return [4 /*yield*/, git(repo, 'rev-parse', 'main')];
                case 7:
                    _d.apply(void 0, [_e.sent()]).toBe(finished.operation.commit);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('allows a definite failed commit to be retried without changing or unstaging the selected files', function () { return __awaiter(void 0, void 0, void 0, function () {
        var r, request, original, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(taskPath, 'a.txt'), 'staged work\n')];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, git(taskPath, 'add', 'a.txt')];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, review()];
                case 3:
                    r = _d.sent();
                    request = { taskId: 'one', target: 'main', fingerprint: r.fingerprint, idleConfirmed: true, files: ['a.txt'], message: 'Selected staged work' };
                    original = d.userGit;
                    d.userGit = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ exitCode: 1, stdout: '', stderr: 'Commit hook rejected the message' })];
                    }); }); };
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, commit_api_1.commitBranchFiles)(d, KEY, request)];
                case 4:
                    _a.apply(void 0, [_d.sent()]).toMatchObject({ ok: false });
                    d.userGit = original;
                    _b = data;
                    return [4 /*yield*/, (0, commit_api_1.commitBranchFiles)(d, KEY, request)];
                case 5:
                    _b.apply(void 0, [_d.sent()]);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, git(taskPath, 'log', '-1', '--format=%s')];
                case 6:
                    _c.apply(void 0, [_d.sent()]).toBe(request.message);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('streams checks, blocks a failed result, and permits merge only after a passing retry on the same tree', function () { return __awaiter(void 0, void 0, void 0, function () {
        var prepared, id, _a, path, request, running, failed, _b, _c, passed, _d, _e, _f;
        var _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, taskCommit('.gitignore', '.check-fail\n')];
                case 1:
                    _j.sent();
                    return [4 /*yield*/, taskCommit('package.json', JSON.stringify({ scripts: { test: 'node check.cjs' } }))];
                case 2:
                    _j.sent();
                    return [4 /*yield*/, taskCommit('check.cjs', "const fs=require('node:fs');console.log('CHECK START');setTimeout(()=>{if(fs.existsSync('.check-fail')){console.error('CHECK FAILED');process.exit(1)}console.log('CHECK PASSED')},700)")];
                case 3:
                    _j.sent();
                    return [4 /*yield*/, prepare()];
                case 4:
                    prepared = _j.sent();
                    id = prepared.operation.id;
                    (0, vitest_1.expect)(prepared.availableChecks).toHaveLength(1);
                    _a = vitest_1.expect;
                    return [4 /*yield*/, finish(id, prepared.approval)];
                case 5:
                    _a.apply(void 0, [_j.sent()]).toMatchObject({ ok: false, error: { message: vitest_1.expect.stringContaining('Run checks') } });
                    path = (0, merge_workspace_1.workspacePath)(d, prepared.operation);
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(path, '.check-fail'), 'fail')];
                case 6:
                    _j.sent();
                    request = { operationId: id, approval: prepared.approval, checkIds: [prepared.availableChecks[0].id] };
                    running = (0, checks_api_1.runMergeChecks)(d, KEY, request);
                    return [4 /*yield*/, vitest_1.expect.poll(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; var _b, _c, _d; return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    _a = data;
                                    return [4 /*yield*/, (0, branch_api_1.readMergeWorkspace)(d, KEY, id)];
                                case 1: return [2 /*return*/, (_d = (_c = (_b = _a.apply(void 0, [_e.sent()]).checks) === null || _b === void 0 ? void 0 : _b.at(-1)) === null || _c === void 0 ? void 0 : _c.output) !== null && _d !== void 0 ? _d : ''];
                            }
                        }); }); }, { timeout: 8000 }).toContain('CHECK START')];
                case 7:
                    _j.sent();
                    _b = data;
                    return [4 /*yield*/, running];
                case 8:
                    failed = _b.apply(void 0, [_j.sent()]);
                    (0, vitest_1.expect)((_g = failed.checks) === null || _g === void 0 ? void 0 : _g.at(-1)).toMatchObject({ status: 'failed', exitCode: 1 });
                    _c = vitest_1.expect;
                    return [4 /*yield*/, finish(id, failed.approval)];
                case 9:
                    _c.apply(void 0, [_j.sent()]).toMatchObject({ ok: false });
                    return [4 /*yield*/, (0, promises_1.rm)((0, node_path_1.join)(path, '.check-fail'))];
                case 10:
                    _j.sent();
                    _d = data;
                    return [4 /*yield*/, (0, checks_api_1.runMergeChecks)(d, KEY, request)];
                case 11:
                    passed = _d.apply(void 0, [_j.sent()]);
                    (0, vitest_1.expect)(passed.checksCurrent).toBe(true);
                    (0, vitest_1.expect)((_h = passed.checks) === null || _h === void 0 ? void 0 : _h.at(-1)).toMatchObject({ status: 'succeeded', exitCode: 0 });
                    _e = vitest_1.expect;
                    _f = data;
                    return [4 /*yield*/, finish(id, passed.approval)];
                case 12:
                    _e.apply(void 0, [_f.apply(void 0, [_j.sent()]).operation.stage]).toBe('merged');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('cancels a check process and blocks merging the cancelled result', function () { return __awaiter(void 0, void 0, void 0, function () {
        var prepared, id, running, _a, _b, _c, _d;
        var _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, taskCommit('package.json', JSON.stringify({ scripts: { test: 'node check.cjs' } }))];
                case 1:
                    _g.sent();
                    return [4 /*yield*/, taskCommit('check.cjs', "console.log('CHECK START');setInterval(()=>{},1000)")];
                case 2:
                    _g.sent();
                    return [4 /*yield*/, prepare()];
                case 3:
                    prepared = _g.sent();
                    id = prepared.operation.id;
                    running = (0, checks_api_1.runMergeChecks)(d, KEY, { operationId: id, approval: prepared.approval, checkIds: [prepared.availableChecks[0].id] });
                    return [4 /*yield*/, vitest_1.expect.poll(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; var _b, _c, _d; return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    _a = data;
                                    return [4 /*yield*/, (0, branch_api_1.readMergeWorkspace)(d, KEY, id)];
                                case 1: return [2 /*return*/, (_d = (_c = (_b = _a.apply(void 0, [_e.sent()]).checks) === null || _b === void 0 ? void 0 : _b.at(-1)) === null || _c === void 0 ? void 0 : _c.output) !== null && _d !== void 0 ? _d : ''];
                            }
                        }); }); }, { timeout: 8000 }).toContain('CHECK START')];
                case 4:
                    _g.sent();
                    _a = data;
                    return [4 /*yield*/, (0, checks_api_1.cancelMergeChecks)(d, KEY, id)];
                case 5:
                    _a.apply(void 0, [_g.sent()]);
                    _b = vitest_1.expect;
                    _c = data;
                    return [4 /*yield*/, running];
                case 6:
                    _b.apply(void 0, [(_f = (_e = _c.apply(void 0, [_g.sent()]).checks) === null || _e === void 0 ? void 0 : _e.at(-1)) === null || _f === void 0 ? void 0 : _f.status]).toBe('cancelled');
                    _d = vitest_1.expect;
                    return [4 /*yield*/, finish(id, prepared.approval)];
                case 7:
                    _d.apply(void 0, [_g.sent()]).toMatchObject({ ok: false });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('invalidates checks that change tracked files and refuses an obsolete check definition', function () { return __awaiter(void 0, void 0, void 0, function () {
        var prepared, id, _a, result, _b, _c;
        var _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, taskCommit('package.json', JSON.stringify({ scripts: { test: 'node check.cjs' } }))];
                case 1:
                    _f.sent();
                    return [4 /*yield*/, taskCommit('check.cjs', "require('node:fs').writeFileSync('a.txt','modified by check')")];
                case 2:
                    _f.sent();
                    return [4 /*yield*/, prepare()];
                case 3:
                    prepared = _f.sent();
                    id = prepared.operation.id;
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, checks_api_1.runMergeChecks)(d, KEY, { operationId: id, approval: prepared.approval, checkIds: ['not-in-this-result'] })];
                case 4:
                    _a.apply(void 0, [_f.sent()]).toMatchObject({ ok: false });
                    _b = data;
                    return [4 /*yield*/, (0, checks_api_1.runMergeChecks)(d, KEY, { operationId: id, approval: prepared.approval, checkIds: [prepared.availableChecks[0].id] })];
                case 5:
                    result = _b.apply(void 0, [_f.sent()]);
                    (0, vitest_1.expect)(result.approval).toBeNull();
                    (0, vitest_1.expect)((_e = (_d = result.checks) === null || _d === void 0 ? void 0 : _d.at(-1)) === null || _e === void 0 ? void 0 : _e.status).toBe('failed');
                    _c = vitest_1.expect;
                    return [4 /*yield*/, finish(id, prepared.approval)];
                case 6:
                    _c.apply(void 0, [_f.sent()]).toMatchObject({ ok: false });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('requires local setup instead of sharing dependencies with the source worktree', function () { return __awaiter(void 0, void 0, void 0, function () {
        var prepared, result, _a, _b, _c, _d;
        var _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, taskCommit('.gitignore', 'node_modules/\n')];
                case 1:
                    _j.sent();
                    return [4 /*yield*/, taskCommit('package.json', JSON.stringify({ dependencies: { 'fixture-dependency': '1.0.0' }, scripts: { test: "node -e \"require('fixture-dependency')\"" } }))];
                case 2:
                    _j.sent();
                    return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(taskPath, 'node_modules/fixture-dependency'), { recursive: true })];
                case 3:
                    _j.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(taskPath, 'node_modules/fixture-dependency/index.js'), "console.log('LOCAL DEPENDENCY')")];
                case 4:
                    _j.sent();
                    return [4 /*yield*/, prepare()];
                case 5:
                    prepared = _j.sent();
                    _a = data;
                    return [4 /*yield*/, (0, checks_api_1.runMergeChecks)(d, KEY, { operationId: prepared.operation.id, approval: prepared.approval, checkIds: [prepared.availableChecks[0].id] })];
                case 6:
                    result = _a.apply(void 0, [_j.sent()]);
                    (0, vitest_1.expect)(result.checksCurrent).toBe(false);
                    (0, vitest_1.expect)((_f = (_e = result.checks) === null || _e === void 0 ? void 0 : _e.at(-1)) === null || _f === void 0 ? void 0 : _f.status).toBe('setupRequired');
                    (0, vitest_1.expect)((_h = (_g = result.checks) === null || _g === void 0 ? void 0 : _g.at(-1)) === null || _h === void 0 ? void 0 : _h.output).toContain('Commit an npm lockfile');
                    _b = vitest_1.expect;
                    return [4 /*yield*/, d.host.exists((0, node_path_1.join)((0, merge_workspace_1.workspacePath)(d, prepared.operation), 'node_modules'))];
                case 7:
                    _b.apply(void 0, [_j.sent()]).toBe(false);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(taskPath, 'node_modules/fixture-dependency/index.js'), 'utf8')];
                case 8:
                    _c.apply(void 0, [_j.sent()]).toBe("console.log('LOCAL DEPENDENCY')");
                    (0, vitest_1.expect)(result.approval).toBe(prepared.approval);
                    _d = vitest_1.expect;
                    return [4 /*yield*/, git(taskPath, 'status', '--porcelain')];
                case 9:
                    _d.apply(void 0, [_j.sent()]).toBe('');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.describe)('build folders after an approved merge', function () {
        var withBuildOutput = function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, taskCommit('.gitignore', 'node_modules/\n.env\n')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(taskPath, 'node_modules/pkg'), { recursive: true })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(taskPath, 'node_modules/pkg/index.js'), 'module')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(taskPath, '.env'), 'SECRET=1')];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        var setState = function (state) { return __awaiter(void 0, void 0, void 0, function () {
            var path, record, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        path = (0, node_path_1.join)(folder, ".queue-tea/projects/".concat(KEY, ".json"));
                        _b = (_a = JSON).parse;
                        return [4 /*yield*/, (0, promises_1.readFile)(path, 'utf8')];
                    case 1:
                        record = _b.apply(_a, [_c.sent()]);
                        record.tasks[0].state = state;
                        return [4 /*yield*/, (0, promises_1.writeFile)(path, JSON.stringify(record))];
                    case 2:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        (0, vitest_1.it)('clears a finished task\'s build folders, keeps .env, and logs it among the merge\'s events', function () { return __awaiter(void 0, void 0, void 0, function () {
            var prepared, completed, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, withBuildOutput()];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, setState('done')];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, prepare()];
                    case 3:
                        prepared = _d.sent();
                        _a = data;
                        return [4 /*yield*/, finish(prepared.operation.id, prepared.approval)];
                    case 4:
                        completed = _a.apply(void 0, [_d.sent()]);
                        (0, vitest_1.expect)(completed.operation.stage).toBe('merged');
                        _b = vitest_1.expect;
                        return [4 /*yield*/, d.host.exists((0, node_path_1.join)(taskPath, 'node_modules'))];
                    case 5:
                        _b.apply(void 0, [_d.sent()]).toBe(false);
                        _c = vitest_1.expect;
                        return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(taskPath, '.env'), 'utf8')];
                    case 6:
                        _c.apply(void 0, [_d.sent()]).toBe('SECRET=1');
                        (0, vitest_1.expect)(completed.operation.events.at(-1)).toMatchObject({ command: constants_1.BRANCH_TEXT.clearedAfterMerge(['node_modules']), status: 'succeeded' });
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('keeps a finished task\'s build folders while an app update is building, and says so among the merge\'s events', function () { return __awaiter(void 0, void 0, void 0, function () {
            var updates, prepared, completed, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, withBuildOutput()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, setState('done')];
                    case 2:
                        _c.sent();
                        updates = (0, node_path_1.join)(folder, 'Library/Logs/Queue-tea');
                        return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(updates, 'refresh.lock'), { recursive: true })];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(updates, 'state.json'), JSON.stringify({ phase: 'building', commit: 'a'.repeat(40), repository: (0, node_path_1.join)(repo, '.git'), detail: null, updatedAt: Date.now() }))];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(updates, 'refresh.lock/pid'), String(process.pid))];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, prepare()];
                    case 6:
                        prepared = _c.sent();
                        _a = data;
                        return [4 /*yield*/, finish(prepared.operation.id, prepared.approval)];
                    case 7:
                        completed = _a.apply(void 0, [_c.sent()]);
                        (0, vitest_1.expect)(completed.operation.stage).toBe('merged');
                        _b = vitest_1.expect;
                        return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(taskPath, 'node_modules/pkg/index.js'), 'utf8')];
                    case 8:
                        _b.apply(void 0, [_c.sent()]).toBe('module');
                        (0, vitest_1.expect)(completed.operation.events.at(-1)).toMatchObject({ command: constants_1.BRANCH_TEXT.keptForUpdate });
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('keeps the build folders of a task still current, and says so among the merge\'s events', function () { return __awaiter(void 0, void 0, void 0, function () {
            var prepared, completed, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, withBuildOutput()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, prepare()];
                    case 2:
                        prepared = _c.sent();
                        _a = data;
                        return [4 /*yield*/, finish(prepared.operation.id, prepared.approval)];
                    case 3:
                        completed = _a.apply(void 0, [_c.sent()]);
                        (0, vitest_1.expect)(completed.operation.stage).toBe('merged');
                        _b = vitest_1.expect;
                        return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(taskPath, 'node_modules/pkg/index.js'), 'utf8')];
                    case 4:
                        _b.apply(void 0, [_c.sent()]).toBe('module');
                        (0, vitest_1.expect)(completed.operation.events.at(-1)).toMatchObject({ command: constants_1.BRANCH_TEXT.keptAfterMerge });
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)('keeps a still-current task\'s build folders and sweeps an earlier merged quest\'s, logging both in that order', function () { return __awaiter(void 0, void 0, void 0, function () {
            var old, path, record, _a, _b, prepared, completed, _c, _d, _e, _f, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0: return [4 /*yield*/, withBuildOutput()];
                    case 1:
                        _h.sent();
                        old = (0, node_path_1.join)(folder, 'old');
                        path = (0, node_path_1.join)(folder, ".queue-tea/projects/".concat(KEY, ".json"));
                        return [4 /*yield*/, git(repo, 'worktree', 'add', '-b', 'task/old', old, 'main')];
                    case 2:
                        _h.sent();
                        return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(old, '.gitignore'), 'node_modules/\n.env\n')];
                    case 3:
                        _h.sent();
                        return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(old, 'old.txt'), 'old\n')];
                    case 4:
                        _h.sent();
                        return [4 /*yield*/, git(old, 'add', '.')];
                    case 5:
                        _h.sent();
                        return [4 /*yield*/, git(old, 'commit', '-m', 'Old work')];
                    case 6:
                        _h.sent();
                        return [4 /*yield*/, git(repo, 'merge', '--no-ff', '--no-edit', 'task/old')];
                    case 7:
                        _h.sent();
                        return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(old, 'node_modules/pkg'), { recursive: true })];
                    case 8:
                        _h.sent();
                        return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(old, 'node_modules/pkg/index.js'), 'module')];
                    case 9:
                        _h.sent();
                        return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(old, '.env'), 'OLD=1')];
                    case 10:
                        _h.sent();
                        _b = (_a = JSON).parse;
                        return [4 /*yield*/, (0, promises_1.readFile)(path, 'utf8')];
                    case 11:
                        record = _b.apply(_a, [_h.sent()]);
                        record.tasks.push((0, fixtures_1.makeTask)({ id: 'old', state: 'done', branch: 'task/old', baseBranch: 'main', startCommit: record.tasks[0].startCommit, worktreePath: old }));
                        return [4 /*yield*/, (0, promises_1.writeFile)(path, JSON.stringify(record))];
                    case 12:
                        _h.sent();
                        return [4 /*yield*/, prepare()];
                    case 13:
                        prepared = _h.sent();
                        _c = data;
                        return [4 /*yield*/, finish(prepared.operation.id, prepared.approval)];
                    case 14:
                        completed = _c.apply(void 0, [_h.sent()]);
                        (0, vitest_1.expect)(completed.operation.stage).toBe('merged');
                        (0, vitest_1.expect)(completed.operation.events.slice(-2).map(function (e) { return e.command; })).toEqual([constants_1.BRANCH_TEXT.keptAfterMerge, constants_1.BRANCH_TEXT.clearedMergedAfterMerge(1)]);
                        _d = vitest_1.expect;
                        return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(taskPath, 'node_modules/pkg/index.js'), 'utf8')];
                    case 15:
                        _d.apply(void 0, [_h.sent()]).toBe('module');
                        _e = vitest_1.expect;
                        return [4 /*yield*/, d.host.exists((0, node_path_1.join)(old, 'node_modules'))];
                    case 16:
                        _e.apply(void 0, [_h.sent()]).toBe(false);
                        _f = vitest_1.expect;
                        return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(old, '.env'), 'utf8')];
                    case 17:
                        _f.apply(void 0, [_h.sent()]).toBe('OLD=1');
                        _g = vitest_1.expect;
                        return [4 /*yield*/, git(old, 'status', '--porcelain')];
                    case 18:
                        _g.apply(void 0, [_h.sent()]).toBe('');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.it)('releases a stale committed preparation without changing the destination or discarding its commit', function () { return __awaiter(void 0, void 0, void 0, function () {
        var prepared, before, original, _a, retained, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, prepare()];
                case 1:
                    prepared = _g.sent();
                    return [4 /*yield*/, git(repo, 'rev-parse', 'HEAD')];
                case 2:
                    before = _g.sent();
                    original = d.userGit;
                    d.userGit = function (cwd, action, output) { return __awaiter(void 0, void 0, void 0, function () {
                        var result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, original(cwd, action, output)];
                                case 1:
                                    result = _a.sent();
                                    if (!(action.kind === 'commit')) return [3 /*break*/, 3];
                                    return [4 /*yield*/, taskCommit('newer.txt', 'source moved\n')];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3: return [2 /*return*/, result];
                            }
                        });
                    }); };
                    _a = vitest_1.expect;
                    return [4 /*yield*/, finish(prepared.operation.id, prepared.approval)];
                case 3:
                    _a.apply(void 0, [_g.sent()]).toMatchObject({ ok: false });
                    _b = data;
                    return [4 /*yield*/, (0, branch_api_1.readMergeWorkspace)(d, KEY, prepared.operation.id)];
                case 4:
                    retained = _b.apply(void 0, [_g.sent()]);
                    (0, vitest_1.expect)(retained.operation.commit).toBeTruthy();
                    _c = vitest_1.expect;
                    _d = data;
                    return [4 /*yield*/, (0, branch_api_1.abandonMerge)(d, KEY, prepared.operation.id)];
                case 5:
                    _c.apply(void 0, [_d.apply(void 0, [_g.sent()]).operation.stage]).toBe('abandoned');
                    _e = vitest_1.expect;
                    return [4 /*yield*/, git(repo, 'rev-parse', 'HEAD')];
                case 6:
                    _e.apply(void 0, [_g.sent()]).toBe(before);
                    _f = vitest_1.expect;
                    return [4 /*yield*/, git((0, merge_workspace_1.workspacePath)(d, retained.operation), 'rev-parse', 'HEAD')];
                case 7:
                    _f.apply(void 0, [_g.sent()]).toBe(retained.operation.commit);
                    return [2 /*return*/];
            }
        });
    }); });
});
