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
var update_runner_mjs_1 = require("./update_runner.mjs");
var exec = (0, node_util_1.promisify)(node_child_process_1.execFile);
var integration = process.env.QUEUE_TEA_GIT_TESTS === '1' ? vitest_1.describe : vitest_1.describe.skip;
// Real objects/worktrees, with every build command replaced and installation
// directed into this test's temporary Applications folder. No network/packages.
integration('updates from acknowledged source in any worktree', function () {
    var folder;
    var repo;
    var task;
    var state;
    var target;
    var request;
    var commands;
    var corrupt;
    var fail;
    var builtSource;
    var git = function (cwd) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exec('git', args, { cwd: cwd, env: __assign(__assign({}, process.env), { GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null' }) })];
                case 1: return [2 /*return*/, (_a.sent()).stdout.trim()];
            }
        }); });
    };
    var command = function (argv, cwd, env) { return __awaiter(void 0, void 0, void 0, function () {
        var resources, provenance, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    commands.push(argv.join(' '));
                    if (fail && argv[1] === 'test')
                        throw new Error('Test failure');
                    if (!(argv[2] === 'package')) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(cwd, 'source.txt'), 'utf8')];
                case 1:
                    builtSource = _c.sent();
                    resources = (0, node_path_1.join)(cwd, 'dist/mac-arm64/Queue-tea.app/Contents/Resources');
                    return [4 /*yield*/, (0, promises_1.mkdir)(resources, { recursive: true })];
                case 2:
                    _c.sent();
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, (0, promises_1.readFile)(env.QUEUE_TEA_RELEASE_CONTEXT, 'utf8')];
                case 3:
                    provenance = _b.apply(_a, [_c.sent()]);
                    if (corrupt)
                        provenance.commit = '0'.repeat(40);
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(resources, 'provenance.json'), JSON.stringify(provenance))];
                case 4:
                    _c.sent();
                    _c.label = 5;
                case 5:
                    if (!(argv[0] === '/bin/sh')) return [3 /*break*/, 7];
                    return [4 /*yield*/, exec(argv[0], argv.slice(1), { cwd: cwd, env: __assign(__assign({}, env), { PATH: "".concat((0, node_path_1.join)(folder, 'bin'), ":").concat(env.PATH) }) })];
                case 6:
                    _c.sent();
                    _c.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var run = function () { return (0, update_runner_mjs_1.runUpdates)(state, { target: target, tools: __dirname, command: command }); };
    (0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, commit;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = promises_1.realpath;
                    return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-published-'))];
                case 1: return [4 /*yield*/, _a.apply(void 0, [_c.sent()])];
                case 2:
                    folder = _c.sent();
                    repo = (0, node_path_1.join)(folder, 'repo');
                    task = (0, node_path_1.join)(folder, 'task');
                    state = (0, node_path_1.join)(folder, 'state');
                    target = (0, node_path_1.join)(folder, 'Applications/Queue-tea.app');
                    return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(repo, 'app/tools'), { recursive: true })];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, (0, promises_1.mkdir)(state)];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(folder, 'Applications'))];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(folder, 'bin'))];
                case 6:
                    _c.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(folder, 'bin/lsregister'), '#!/bin/sh\nexit 0\n', { mode: 493 })];
                case 7:
                    _c.sent();
                    return [4 /*yield*/, git(repo, 'init', '-b', 'main')];
                case 8:
                    _c.sent();
                    return [4 /*yield*/, git(repo, 'config', 'user.name', 'Test')];
                case 9:
                    _c.sent();
                    return [4 /*yield*/, git(repo, 'config', 'user.email', 'test@example.invalid')];
                case 10:
                    _c.sent();
                    return [4 /*yield*/, git(repo, 'config', 'core.hooksPath', '/dev/null')];
                case 11:
                    _c.sent();
                    return [4 /*yield*/, git(repo, 'config', 'commit.gpgsign', 'false')];
                case 12:
                    _c.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(repo, '.gitignore'), 'node_modules/\n')];
                case 13:
                    _c.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(repo, 'app/package.json'), JSON.stringify({ name: 'queue-tea-app', productName: 'Queue-tea', version: '1.5.2' }))];
                case 14:
                    _c.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(repo, 'app/package-lock.json'), JSON.stringify({ packages: { '': {}, 'node_modules/electron': { version: '1.0.0' }, 'node_modules/fsevents': { version: '2.0.0', optional: true } } }))];
                case 15:
                    _c.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(repo, 'app/source.txt'), 'published source')];
                case 16:
                    _c.sent();
                    return [4 /*yield*/, (0, promises_1.copyFile)((0, node_path_1.join)(__dirname, 'release_guard.mjs'), (0, node_path_1.join)(repo, 'app/tools/release_guard.mjs'))];
                case 17:
                    _c.sent();
                    return [4 /*yield*/, git(repo, 'add', '.')];
                case 18:
                    _c.sent();
                    return [4 /*yield*/, git(repo, 'commit', '-m', 'Published source')];
                case 19:
                    _c.sent();
                    return [4 /*yield*/, git(repo, 'rev-parse', 'HEAD')];
                case 20:
                    commit = _c.sent();
                    return [4 /*yield*/, git(repo, 'worktree', 'add', '-b', 'task/feature', task)];
                case 21:
                    _c.sent();
                    return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(task, 'app/node_modules/electron'), { recursive: true })];
                case 22:
                    _c.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(task, 'app/node_modules/electron/package.json'), '{"version":"1.0.0"}')];
                case 23:
                    _c.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(task, 'app/node_modules/electron/path.txt'), 'Electron.app/Contents/MacOS/Electron')];
                case 24:
                    _c.sent();
                    _b = { repo: task, remote: 'origin', branch: 'main', commit: commit };
                    return [4 /*yield*/, git(repo, 'rev-parse', '--path-format=absolute', '--git-common-dir')];
                case 25:
                    request = (_b.repository = _c.sent(), _b);
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(state, 'request.json'), JSON.stringify(request))];
                case 26:
                    _c.sent();
                    commands = [];
                    corrupt = false;
                    fail = false;
                    builtSource = '';
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, promises_1.rm)(folder, { recursive: true, force: true })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    }); }); });
    (0, vitest_1.it)('builds the acknowledged commit from a feature worktree despite dirty files and newer local main, then retains the previous bundle', function () { return __awaiter(void 0, void 0, void 0, function () {
        var resources, _a, _b, _c, _d, _e, _f, _g;
        var _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    resources = (0, node_path_1.join)(target, 'Contents/Resources');
                    return [4 /*yield*/, (0, promises_1.mkdir)(resources, { recursive: true })];
                case 1:
                    _j.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(resources, 'provenance.json'), JSON.stringify({ commit: request.commit }))];
                case 2:
                    _j.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(repo, 'app/source.txt'), 'unpublished next main')];
                case 3:
                    _j.sent();
                    return [4 /*yield*/, git(repo, 'commit', '-am', 'Unpublished main')];
                case 4:
                    _j.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(task, 'app/source.txt'), 'dirty feature work')];
                case 5:
                    _j.sent();
                    return [4 /*yield*/, run()];
                case 6:
                    _j.sent();
                    (0, vitest_1.expect)(builtSource).toBe('published source');
                    (0, vitest_1.expect)(commands.slice(0, 3)).toEqual(['npm run typecheck', 'npm test', 'npm run package']);
                    (0, vitest_1.expect)(commands.some(function (c) { return c.includes('codesign --verify'); })).toBe(true);
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, update_runner_mjs_1.readUpdate)(state)];
                case 7:
                    _a.apply(void 0, [(_h = (_j.sent())) === null || _h === void 0 ? void 0 : _h.phase]).toBe('installed');
                    _b = vitest_1.expect;
                    _d = (_c = JSON).parse;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(resources, 'provenance.json'), 'utf8')];
                case 8:
                    _b.apply(void 0, [_d.apply(_c, [_j.sent()]).commit]).toBe(request.commit);
                    _e = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readdir)((0, node_path_1.join)(folder, 'Applications'))];
                case 9:
                    _e.apply(void 0, [(_j.sent()).some(function (n) { return n.startsWith('.Queue-tea.app.previous-'); })]).toBe(true);
                    _f = vitest_1.expect;
                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(task, 'app/source.txt'), 'utf8')];
                case 10:
                    _f.apply(void 0, [_j.sent()]).toBe('dirty feature work');
                    _g = vitest_1.expect;
                    return [4 /*yield*/, git(task, 'branch', '--show-current')];
                case 11:
                    _g.apply(void 0, [_j.sent()]).toBe('task/feature');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('rejects feature publication before launching a worker or writing state', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, other, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, update_runner_mjs_1.publishedSource)(__assign(__assign({}, request), { branch: 'task/feature' }))];
                case 1:
                    _a.apply(void 0, [_f.sent()]).toBeNull();
                    _b = vitest_1.expect;
                    return [4 /*yield*/, (0, update_runner_mjs_1.queuePublished)(__assign(__assign({}, request), { branch: 'task/feature' }), { folder: state })];
                case 2:
                    _b.apply(void 0, [_f.sent()]).toBe(false);
                    (0, vitest_1.expect)(commands).toEqual([]);
                    _c = vitest_1.expect;
                    return [4 /*yield*/, (0, update_runner_mjs_1.readUpdate)(state)];
                case 3:
                    _c.apply(void 0, [_f.sent()]).toBeNull();
                    other = (0, node_path_1.join)(folder, 'other-repository');
                    return [4 /*yield*/, (0, promises_1.mkdir)(other)];
                case 4:
                    _f.sent();
                    _d = vitest_1.expect;
                    return [4 /*yield*/, (0, update_runner_mjs_1.queuePublished)(request, { folder: state, repository: other })];
                case 5:
                    _d.apply(void 0, [_f.sent()]).toBe(false);
                    _e = vitest_1.expect;
                    return [4 /*yield*/, (0, update_runner_mjs_1.readUpdate)(state)];
                case 6:
                    _e.apply(void 0, [_f.sent()]).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('rejects mismatched packaged provenance before installation', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    corrupt = true;
                    return [4 /*yield*/, run()];
                case 1:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, update_runner_mjs_1.readUpdate)(state)];
                case 2:
                    _a.apply(void 0, [(_b = (_c.sent())) === null || _b === void 0 ? void 0 : _b.phase]).toBe('failed');
                    (0, vitest_1.expect)(commands.some(function (c) { return c.startsWith('/bin/sh'); })).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses changed source files and signature failures before installation', function () { return __awaiter(void 0, void 0, void 0, function () {
        var modify, _a, _b;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    modify = function (argv, cwd, env) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, command(argv, cwd, env)];
                                case 1:
                                    _a.sent();
                                    if (!(argv[1] === 'test')) return [3 /*break*/, 3];
                                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(cwd, 'source.txt'), 'modified by check')];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); };
                    return [4 /*yield*/, (0, update_runner_mjs_1.runUpdates)(state, { target: target, tools: __dirname, command: modify })];
                case 1:
                    _e.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, update_runner_mjs_1.readUpdate)(state)];
                case 2:
                    _a.apply(void 0, [(_c = (_e.sent())) === null || _c === void 0 ? void 0 : _c.phase]).toBe('failed');
                    (0, vitest_1.expect)(commands.some(function (c) { return c.startsWith('/bin/sh'); })).toBe(false);
                    commands = [];
                    return [4 /*yield*/, (0, update_runner_mjs_1.runUpdates)(state, { target: target, tools: __dirname, command: function (argv, cwd, env) { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (argv[0] === '/usr/bin/codesign')
                                                throw new Error('Invalid signature');
                                            return [4 /*yield*/, command(argv, cwd, env)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); } })];
                case 3:
                    _e.sent();
                    _b = vitest_1.expect;
                    return [4 /*yield*/, (0, update_runner_mjs_1.readUpdate)(state)];
                case 4:
                    _b.apply(void 0, [(_d = (_e.sent())) === null || _d === void 0 ? void 0 : _d.phase]).toBe('failed');
                    (0, vitest_1.expect)(commands.some(function (c) { return c.startsWith('/bin/sh'); })).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('fails visibly without installing dependencies and recovers an interrupted worker', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, (0, promises_1.rm)((0, node_path_1.join)(task, 'app/node_modules'), { recursive: true })];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, run()];
                case 2:
                    _d.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, update_runner_mjs_1.readUpdate)(state)];
                case 3:
                    _a.apply(void 0, [(_c = (_d.sent())) === null || _c === void 0 ? void 0 : _c.phase]).toBe('failed');
                    (0, vitest_1.expect)(commands).toEqual([]);
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(state, 'state.json'), JSON.stringify({ phase: 'building', commit: request.commit, repository: request.repository, updatedAt: 1, detail: null }))];
                case 4:
                    _d.sent();
                    _b = vitest_1.expect;
                    return [4 /*yield*/, (0, update_runner_mjs_1.readUpdate)(state)];
                case 5:
                    _b.apply(void 0, [_d.sent()]).toMatchObject({ phase: 'failed', detail: vitest_1.expect.stringContaining('retry') });
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('skips an install older than its lockfile, or missing Electron\'s binary, then builds once it is complete', function () { return __awaiter(void 0, void 0, void 0, function () {
        var electron, _a, _b, _c;
        var _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    electron = (0, node_path_1.join)(task, 'app/node_modules/electron');
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(electron, 'package.json'), '{"version":"0.9.0"}')];
                case 1:
                    _g.sent();
                    return [4 /*yield*/, run()];
                case 2:
                    _g.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, update_runner_mjs_1.readUpdate)(state)];
                case 3:
                    _a.apply(void 0, [(_d = (_g.sent())) === null || _d === void 0 ? void 0 : _d.phase]).toBe('failed');
                    (0, vitest_1.expect)(commands).toEqual([]);
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(electron, 'package.json'), '{"version":"1.0.0"}')];
                case 4:
                    _g.sent();
                    return [4 /*yield*/, (0, promises_1.rm)((0, node_path_1.join)(electron, 'path.txt'))];
                case 5:
                    _g.sent();
                    return [4 /*yield*/, run()];
                case 6:
                    _g.sent();
                    _b = vitest_1.expect;
                    return [4 /*yield*/, (0, update_runner_mjs_1.readUpdate)(state)];
                case 7:
                    _b.apply(void 0, [(_e = (_g.sent())) === null || _e === void 0 ? void 0 : _e.phase]).toBe('failed');
                    (0, vitest_1.expect)(commands).toEqual([]);
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(electron, 'path.txt'), 'Electron.app/Contents/MacOS/Electron')];
                case 8:
                    _g.sent();
                    return [4 /*yield*/, run()];
                case 9:
                    _g.sent();
                    _c = vitest_1.expect;
                    return [4 /*yield*/, (0, update_runner_mjs_1.readUpdate)(state)];
                case 10:
                    _c.apply(void 0, [(_f = (_g.sent())) === null || _f === void 0 ? void 0 : _f.phase]).toBe('installed');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('preserves production after a failed check and supports retry of the acknowledged commit', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    fail = true;
                    return [4 /*yield*/, run()];
                case 1:
                    _e.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, update_runner_mjs_1.readUpdate)(state)];
                case 2:
                    _a.apply(void 0, [(_c = (_e.sent())) === null || _c === void 0 ? void 0 : _c.phase]).toBe('failed');
                    (0, vitest_1.expect)(commands).toEqual(['npm run typecheck', 'npm test']);
                    fail = false;
                    return [4 /*yield*/, run()];
                case 3:
                    _e.sent();
                    _b = vitest_1.expect;
                    return [4 /*yield*/, (0, update_runner_mjs_1.readUpdate)(state)];
                case 4:
                    _b.apply(void 0, [(_d = (_e.sent())) === null || _d === void 0 ? void 0 : _d.phase]).toBe('installed');
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('refuses installed ancestry outside the acknowledged history before building', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(target, 'Contents/Resources'), { recursive: true })];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(target, 'Contents/Resources/provenance.json'), JSON.stringify({ commit: 'a'.repeat(40) }))];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, run()];
                case 3:
                    _c.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, update_runner_mjs_1.readUpdate)(state)];
                case 4:
                    _a.apply(void 0, [(_b = (_c.sent())) === null || _b === void 0 ? void 0 : _b.phase]).toBe('failed');
                    (0, vitest_1.expect)(commands).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('keeps the worker alive and skips stale installation when another push arrives during the build', function () { return __awaiter(void 0, void 0, void 0, function () {
        var changed, nextCommand, _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    changed = false;
                    nextCommand = function (argv, cwd, env) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a;
                        var _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, command(argv, cwd, env)];
                                case 1:
                                    _c.sent();
                                    if (!(!changed && argv[2] === 'package')) return [3 /*break*/, 6];
                                    changed = true;
                                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(repo, 'app/source.txt'), 'newly published')];
                                case 2:
                                    _c.sent();
                                    return [4 /*yield*/, git(repo, 'commit', '-am', 'Next release')];
                                case 3:
                                    _c.sent();
                                    _a = [__assign({}, request)];
                                    _b = {};
                                    return [4 /*yield*/, git(repo, 'rev-parse', 'HEAD')];
                                case 4:
                                    request = __assign.apply(void 0, _a.concat([(_b.commit = _c.sent(), _b)]));
                                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(state, 'request.json'), JSON.stringify(request))];
                                case 5:
                                    _c.sent();
                                    _c.label = 6;
                                case 6: return [2 /*return*/];
                            }
                        });
                    }); };
                    return [4 /*yield*/, (0, update_runner_mjs_1.runUpdates)(state, { target: target, tools: __dirname, command: nextCommand })];
                case 1:
                    _c.sent();
                    (0, vitest_1.expect)(commands.filter(function (c) { return c.startsWith('/bin/sh'); })).toHaveLength(1);
                    (0, vitest_1.expect)(builtSource).toBe('newly published');
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, update_runner_mjs_1.readUpdate)(state)];
                case 2:
                    _a.apply(void 0, [(_b = (_c.sent())) === null || _b === void 0 ? void 0 : _b.commit]).toBe(request.commit);
                    return [2 /*return*/];
            }
        });
    }); });
});
