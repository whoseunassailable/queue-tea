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
var logger_1 = require("../../../core/logger");
var node_host_1 = require("../../../core/node_host");
var stream_process_1 = require("../../../core/stream_process");
var checks_api_1 = require("./checks_api");
var state = vitest_1.vi.hoisted(function () { return ({ folder: '', source: '', approval: 'approved', runs: [], subfolder: 'docs' }); });
vitest_1.vi.mock('../../tasks/api/scope', function () { return ({ scopeOf: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({ key: 'demo', ctx: { projectPath: state.source } })];
    }); }); } }); });
vitest_1.vi.mock('../../../../../hooks/shared/git/data/repositories/worktrees_repository_impl', function () { return ({ worktreesRepositoryImpl: function () { return ({ list: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, [{ path: state.source, branch: 'task/one' }]];
        }); }); } }); } }); });
vitest_1.vi.mock('../data/operation_store', function () { return ({
    withBranchLock: function (_d, _key, work) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, work()];
    }); }); },
    loadOperation: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ({ id: 'operation', key: 'demo', source: 'task/one' })];
    }); }); },
    operationPath: function () { return (0, node_path_1.join)(state.folder, 'metadata'); },
}); });
vitest_1.vi.mock('../data/checks_source', function () { return ({
    discoverChecks: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, [{ id: 'build', name: 'docs: build', command: 'npm run build', script: 'build', folder: state.subfolder, manifest: 'docs/package.json' }]];
    }); }); },
    readChecks: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, state.runs];
    }); }); },
    saveChecks: function (_d, _op, runs) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        state.runs = runs;
        return [2 /*return*/];
    }); }); },
}); });
vitest_1.vi.mock('../data/merge_workspace', function () { return ({
    workspacePath: function () { return state.folder; },
    workspaceOf: function (_d, _root, operation) { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
        return [2 /*return*/, ({ operation: __assign(__assign({}, operation), { tree: 'tree' }), approval: state.approval, checks: state.runs, checksCurrent: ((_a = state.runs.at(-1)) === null || _a === void 0 ? void 0 : _a.status) === 'succeeded' })];
    }); }); },
}); });
vitest_1.vi.mock('../../../core/stream_process', function () { return ({ streamProcess: vitest_1.vi.fn() }); });
var root;
var d;
var manifest = { dependencies: { fixture: '1.0.0' }, scripts: { build: 'docusaurus build' } };
var packages = { '': { dependencies: manifest.dependencies }, 'node_modules/fixture': { version: '1.0.0', resolved: 'https://example.invalid/fixture.tgz', integrity: 'sha512-fixture' } };
var fixture = function (base_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([base_1], args_1, true), void 0, function (base, installed) {
        var path;
        if (installed === void 0) { installed = false; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    path = (0, node_path_1.join)(base, state.subfolder);
                    return [4 /*yield*/, (0, promises_1.mkdir)(path, { recursive: true })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(path, 'package.json'), JSON.stringify(manifest))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(path, 'package-lock.json'), JSON.stringify({ lockfileVersion: 3, packages: packages }))];
                case 3:
                    _a.sent();
                    if (!installed) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(path, 'node_modules/fixture'), { recursive: true })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(path, 'node_modules/fixture/package.json'), JSON.stringify({ name: 'fixture', version: '1.0.0' }))];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(path, 'node_modules/.package-lock.json'), JSON.stringify({ lockfileVersion: 3, packages: { 'node_modules/fixture': packages['node_modules/fixture'] } }))];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7: return [2 /*return*/, path];
            }
        });
    });
};
var run = function () { return __awaiter(void 0, void 0, void 0, function () {
    var reply;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, checks_api_1.runMergeChecks)(d, 'demo', { operationId: 'operation', approval: 'approved', checkIds: ['build'] })];
            case 1:
                reply = _a.sent();
                if (!reply.ok)
                    throw new Error(reply.error.message);
                return [2 /*return*/, reply.data];
        }
    });
}); };
(0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, log;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                vitest_1.vi.clearAllMocks();
                _a = promises_1.realpath;
                return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-check-deps-'))];
            case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
            case 2:
                root = _b.sent();
                state.folder = (0, node_path_1.join)(root, 'merge');
                state.source = (0, node_path_1.join)(root, 'source');
                state.runs = [];
                state.approval = 'approved';
                state.subfolder = 'docs';
                return [4 /*yield*/, (0, promises_1.mkdir)(state.folder)];
            case 3:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)(state.source)];
            case 4:
                _b.sent();
                log = (0, logger_1.createLogger)('dev', function () { });
                d = { host: (0, node_host_1.nodeHost)(log, function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ exitCode: 0, stdout: '', stderr: '' })];
                    }); }); }), home: root, now: function () { return Date.now(); }, log: log };
                vitest_1.vi.mocked(stream_process_1.streamProcess).mockResolvedValue({ exitCode: 0, stdout: '', stderr: '' });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, (0, promises_1.rm)(root, { recursive: true, force: true })];
        case 1:
            _a.sent();
            return [2 /*return*/];
    }
}); }); });
vitest_1.it.each(['.', 'docs'])('stops a fresh %s package before its build and explains locked offline setup', function (subfolder) { return __awaiter(void 0, void 0, void 0, function () {
    var path, result;
    var _a, _b, _c, _e, _f, _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                state.subfolder = subfolder;
                return [4 /*yield*/, fixture(state.folder)];
            case 1:
                path = _j.sent();
                return [4 /*yield*/, run()];
            case 2:
                result = _j.sent();
                (0, vitest_1.expect)((_a = result.checks) === null || _a === void 0 ? void 0 : _a.at(-1)).toMatchObject({ status: 'setupRequired', exitCode: null, finished: vitest_1.expect.any(Number) });
                (0, vitest_1.expect)((_c = (_b = result.checks) === null || _b === void 0 ? void 0 : _b.at(-1)) === null || _c === void 0 ? void 0 : _c.output).toContain(path);
                (0, vitest_1.expect)((_f = (_e = result.checks) === null || _e === void 0 ? void 0 : _e.at(-1)) === null || _f === void 0 ? void 0 : _f.output).toContain('npm ci --offline');
                (0, vitest_1.expect)((_h = (_g = result.checks) === null || _g === void 0 ? void 0 : _g.at(-1)) === null || _h === void 0 ? void 0 : _h.output).toContain('cache');
                (0, vitest_1.expect)(result.checksCurrent).toBe(false);
                (0, vitest_1.expect)(stream_process_1.streamProcess).not.toHaveBeenCalled();
                return [2 /*return*/];
        }
    });
}); });
vitest_1.it.each([false, true])('does not borrow or change another worktree even when its manifest matches: %s', function (mismatch) { return __awaiter(void 0, void 0, void 0, function () {
    var source, before, _a, _b, _c;
    var _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0: return [4 /*yield*/, fixture(state.folder)];
            case 1:
                _g.sent();
                return [4 /*yield*/, fixture(state.source, true)];
            case 2:
                source = _g.sent();
                if (!mismatch) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(source, 'package-lock.json'), '{"lockfileVersion":3,"packages":{}}')];
            case 3:
                _g.sent();
                _g.label = 4;
            case 4: return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(source, 'node_modules/.package-lock.json'), 'utf8')];
            case 5:
                before = _g.sent();
                _a = vitest_1.expect;
                return [4 /*yield*/, run()];
            case 6:
                _a.apply(void 0, [(_f = (_e = (_g.sent()).checks) === null || _e === void 0 ? void 0 : _e.at(-1)) === null || _f === void 0 ? void 0 : _f.status]).toBe('setupRequired');
                _b = vitest_1.expect;
                return [4 /*yield*/, d.host.exists((0, node_path_1.join)(state.folder, state.subfolder, 'node_modules'))];
            case 7:
                _b.apply(void 0, [_g.sent()]).toBe(false);
                _c = vitest_1.expect;
                return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(source, 'node_modules/.package-lock.json'), 'utf8')];
            case 8:
                _c.apply(void 0, [_g.sent()]).toBe(before);
                (0, vitest_1.expect)(stream_process_1.streamProcess).not.toHaveBeenCalled();
                return [2 /*return*/];
        }
    });
}); });
vitest_1.it.each(['installed lock', 'installed version', 'manifest', 'lockfile'])('rejects stale dependencies after a change to the %s', function (change) { return __awaiter(void 0, void 0, void 0, function () {
    var path, _a;
    var _b, _c;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, fixture(state.folder, true)];
            case 1:
                path = _e.sent();
                if (!(change === 'installed lock')) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(path, 'node_modules/.package-lock.json'), JSON.stringify({ lockfileVersion: 3, packages: { 'node_modules/fixture': __assign(__assign({}, packages['node_modules/fixture']), { version: '0.9.0' }) } }))];
            case 2:
                _e.sent();
                _e.label = 3;
            case 3:
                if (!(change === 'installed version')) return [3 /*break*/, 5];
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(path, 'node_modules/fixture/package.json'), '{"version":"0.9.0"}')];
            case 4:
                _e.sent();
                _e.label = 5;
            case 5:
                if (!(change === 'manifest')) return [3 /*break*/, 7];
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(path, 'package.json'), JSON.stringify(__assign(__assign({}, manifest), { dependencies: { fixture: '2.0.0' } })))];
            case 6:
                _e.sent();
                _e.label = 7;
            case 7:
                if (!(change === 'lockfile')) return [3 /*break*/, 9];
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(path, 'package-lock.json'), JSON.stringify({ lockfileVersion: 3, packages: __assign(__assign({}, packages), { 'node_modules/fixture': { version: '2.0.0' } }) }))];
            case 8:
                _e.sent();
                _e.label = 9;
            case 9:
                _a = vitest_1.expect;
                return [4 /*yield*/, run()];
            case 10:
                _a.apply(void 0, [(_c = (_b = (_e.sent()).checks) === null || _b === void 0 ? void 0 : _b.at(-1)) === null || _c === void 0 ? void 0 : _c.status]).toBe('setupRequired');
                (0, vitest_1.expect)(stream_process_1.streamProcess).not.toHaveBeenCalled();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('reuses verified dependencies inside the merge folder and keeps an actual build failure failed', function () { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, fixture(state.folder, true)];
            case 1:
                _b.sent();
                vitest_1.vi.mocked(stream_process_1.streamProcess).mockImplementation(function (_log, _request, output) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    output === null || output === void 0 ? void 0 : output('BUILD FAILED');
                    return [2 /*return*/, { exitCode: 1, stdout: 'BUILD FAILED', stderr: '' }];
                }); }); });
                return [4 /*yield*/, run()];
            case 2:
                result = _b.sent();
                (0, vitest_1.expect)((_a = result.checks) === null || _a === void 0 ? void 0 : _a.at(-1)).toMatchObject({ status: 'failed', exitCode: 1, output: 'BUILD FAILED' });
                (0, vitest_1.expect)(result.checksCurrent).toBe(false);
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('runs a dependency-free check without requiring node_modules', function () { return __awaiter(void 0, void 0, void 0, function () {
    var path, _a;
    var _b, _c;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, fixture(state.folder)];
            case 1:
                path = _e.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(path, 'package.json'), '{"scripts":{"build":"node check.cjs"}}')];
            case 2:
                _e.sent();
                _a = vitest_1.expect;
                return [4 /*yield*/, run()];
            case 3:
                _a.apply(void 0, [(_c = (_b = (_e.sent()).checks) === null || _b === void 0 ? void 0 : _b.at(-1)) === null || _c === void 0 ? void 0 : _c.status]).toBe('succeeded');
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('runs a check with matching local locked dependencies without installing anything', function () { return __awaiter(void 0, void 0, void 0, function () {
    var path, _a;
    var _b, _c;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, fixture(state.folder, true)];
            case 1:
                path = _e.sent();
                _a = vitest_1.expect;
                return [4 /*yield*/, run()];
            case 2:
                _a.apply(void 0, [(_c = (_b = (_e.sent()).checks) === null || _b === void 0 ? void 0 : _b.at(-1)) === null || _c === void 0 ? void 0 : _c.status]).toBe('succeeded');
                (0, vitest_1.expect)(stream_process_1.streamProcess).toHaveBeenCalledWith(d.log, vitest_1.expect.objectContaining({ argv: ['npm', 'run', 'build'], cwd: path, env: vitest_1.expect.objectContaining({ npm_config_offline: 'true' }), timeoutMs: vitest_1.expect.any(Number) }), vitest_1.expect.any(Function));
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('keeps an incomplete offline-cache installation blocked and accepts a successful local setup retry', function () { return __awaiter(void 0, void 0, void 0, function () {
    var path, incomplete, retry;
    var _a, _b, _c, _e, _f, _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0: return [4 /*yield*/, fixture(state.folder)];
            case 1:
                path = _j.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(path, 'node_modules'))];
            case 2:
                _j.sent();
                return [4 /*yield*/, run()];
            case 3:
                incomplete = _j.sent();
                (0, vitest_1.expect)((_a = incomplete.checks) === null || _a === void 0 ? void 0 : _a.at(-1)).toMatchObject({ status: 'setupRequired', exitCode: null });
                (0, vitest_1.expect)((_c = (_b = incomplete.checks) === null || _b === void 0 ? void 0 : _b.at(-1)) === null || _c === void 0 ? void 0 : _c.output).toContain('offline cache is incomplete, setup has failed');
                (0, vitest_1.expect)((_f = (_e = incomplete.checks) === null || _e === void 0 ? void 0 : _e.at(-1)) === null || _f === void 0 ? void 0 : _f.output).toContain('approve network access separately');
                (0, vitest_1.expect)(stream_process_1.streamProcess).not.toHaveBeenCalled();
                return [4 /*yield*/, fixture(state.folder, true)];
            case 4:
                _j.sent();
                return [4 /*yield*/, run()];
            case 5:
                retry = _j.sent();
                (0, vitest_1.expect)((_h = (_g = retry.checks) === null || _g === void 0 ? void 0 : _g.at(-1)) === null || _h === void 0 ? void 0 : _h.status).toBe('succeeded');
                (0, vitest_1.expect)(retry.checksCurrent).toBe(true);
                (0, vitest_1.expect)(retry.approval).toBe(incomplete.approval);
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('refuses installation metadata linked into another worktree', function () { return __awaiter(void 0, void 0, void 0, function () {
    var path, source, _a;
    var _b, _c;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, fixture(state.folder, true)];
            case 1:
                path = _e.sent();
                return [4 /*yield*/, fixture(state.source, true)];
            case 2:
                source = _e.sent();
                return [4 /*yield*/, (0, promises_1.rm)((0, node_path_1.join)(path, 'node_modules/.package-lock.json'))];
            case 3:
                _e.sent();
                return [4 /*yield*/, (0, promises_1.symlink)((0, node_path_1.join)(source, 'node_modules/.package-lock.json'), (0, node_path_1.join)(path, 'node_modules/.package-lock.json'))];
            case 4:
                _e.sent();
                _a = vitest_1.expect;
                return [4 /*yield*/, run()];
            case 5:
                _a.apply(void 0, [(_c = (_b = (_e.sent()).checks) === null || _b === void 0 ? void 0 : _b.at(-1)) === null || _c === void 0 ? void 0 : _c.status]).toBe('setupRequired');
                (0, vitest_1.expect)(stream_process_1.streamProcess).not.toHaveBeenCalled();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('requires root dependencies when a workspace script relies on root tools without declaring its own dependencies', function () { return __awaiter(void 0, void 0, void 0, function () {
    var path, docs, _a;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                state.subfolder = '.';
                return [4 /*yield*/, fixture(state.folder)];
            case 1:
                path = _c.sent();
                docs = { name: 'docs', scripts: { build: 'fixture build' } };
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(path, 'docs'))];
            case 2:
                _c.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(path, 'docs/package.json'), JSON.stringify(docs))];
            case 3:
                _c.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(path, 'package-lock.json'), JSON.stringify({ lockfileVersion: 3, packages: __assign(__assign({}, packages), { docs: docs }) }))];
            case 4:
                _c.sent();
                state.subfolder = 'docs';
                _a = vitest_1.expect;
                return [4 /*yield*/, run()];
            case 5:
                _a.apply(void 0, [(_b = (_c.sent()).checks) === null || _b === void 0 ? void 0 : _b.at(-1)]).toMatchObject({ status: 'setupRequired', output: vitest_1.expect.stringContaining("cd '".concat(path, "' && npm ci --offline")) });
                (0, vitest_1.expect)(stream_process_1.streamProcess).not.toHaveBeenCalled();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('uses the locked root installation for an npm workspace package', function () { return __awaiter(void 0, void 0, void 0, function () {
    var path, workspaceManifest, workspacePackages, _a;
    var _b, _c;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                state.subfolder = '.';
                return [4 /*yield*/, fixture(state.folder, true)];
            case 1:
                path = _e.sent();
                workspaceManifest = __assign(__assign({}, manifest), { name: 'docs', version: '1.0.0' });
                workspacePackages = __assign(__assign({}, packages), { docs: workspaceManifest, 'node_modules/docs': { resolved: 'docs', link: true } });
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(path, 'package.json'), JSON.stringify(__assign(__assign({}, manifest), { workspaces: ['docs'] })))];
            case 2:
                _e.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(path, 'package-lock.json'), JSON.stringify({ lockfileVersion: 3, packages: workspacePackages }))];
            case 3:
                _e.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(path, 'node_modules/.package-lock.json'), JSON.stringify({ lockfileVersion: 3, packages: { docs: workspaceManifest, 'node_modules/docs': workspacePackages['node_modules/docs'], 'node_modules/fixture': packages['node_modules/fixture'] } }))];
            case 4:
                _e.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(path, 'docs'))];
            case 5:
                _e.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(path, 'docs/package.json'), JSON.stringify(workspaceManifest))];
            case 6:
                _e.sent();
                return [4 /*yield*/, (0, promises_1.symlink)((0, node_path_1.join)(path, 'docs'), (0, node_path_1.join)(path, 'node_modules/docs'), 'dir')];
            case 7:
                _e.sent();
                state.subfolder = 'docs';
                _a = vitest_1.expect;
                return [4 /*yield*/, run()];
            case 8:
                _a.apply(void 0, [(_c = (_b = (_e.sent()).checks) === null || _b === void 0 ? void 0 : _b.at(-1)) === null || _c === void 0 ? void 0 : _c.status]).toBe('succeeded');
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('accepts omitted optional platform packages but rejects missing required packages', function () { return __awaiter(void 0, void 0, void 0, function () {
    var path, _a, _b;
    var _c, _e, _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0: return [4 /*yield*/, fixture(state.folder, true)];
            case 1:
                path = _h.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(path, 'package-lock.json'), JSON.stringify({ lockfileVersion: 3, packages: __assign(__assign({}, packages), { 'node_modules/platform-only': { version: '1.0.0', optional: true } }) }))];
            case 2:
                _h.sent();
                _a = vitest_1.expect;
                return [4 /*yield*/, run()];
            case 3:
                _a.apply(void 0, [(_e = (_c = (_h.sent()).checks) === null || _c === void 0 ? void 0 : _c.at(-1)) === null || _e === void 0 ? void 0 : _e.status]).toBe('succeeded');
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(path, 'package-lock.json'), JSON.stringify({ lockfileVersion: 3, packages: __assign(__assign({}, packages), { 'node_modules/required': { version: '1.0.0' } }) }))];
            case 4:
                _h.sent();
                _b = vitest_1.expect;
                return [4 /*yield*/, run()];
            case 5:
                _b.apply(void 0, [(_g = (_f = (_h.sent()).checks) === null || _f === void 0 ? void 0 : _f.at(-1)) === null || _g === void 0 ? void 0 : _g.status]).toBe('setupRequired');
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('uses shrinkwrap before package-lock and reports old lock formats explicitly', function () { return __awaiter(void 0, void 0, void 0, function () {
    var path, _a, _b;
    var _c, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0: return [4 /*yield*/, fixture(state.folder, true)];
            case 1:
                path = _g.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(path, 'npm-shrinkwrap.json'), JSON.stringify({ lockfileVersion: 3, packages: packages }))];
            case 2:
                _g.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(path, 'package-lock.json'), '{}')];
            case 3:
                _g.sent();
                _a = vitest_1.expect;
                return [4 /*yield*/, run()];
            case 4:
                _a.apply(void 0, [(_e = (_c = (_g.sent()).checks) === null || _c === void 0 ? void 0 : _c.at(-1)) === null || _e === void 0 ? void 0 : _e.status]).toBe('succeeded');
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(path, 'npm-shrinkwrap.json'), '{"lockfileVersion":1}')];
            case 5:
                _g.sent();
                _b = vitest_1.expect;
                return [4 /*yield*/, run()];
            case 6:
                _b.apply(void 0, [(_f = (_g.sent()).checks) === null || _f === void 0 ? void 0 : _f.at(-1)]).toMatchObject({ status: 'setupRequired', output: vitest_1.expect.stringContaining('lockfileVersion 2 or 3') });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('requires setup when an installed command link is missing even if package versions match', function () { return __awaiter(void 0, void 0, void 0, function () {
    var path, entry, _a;
    var _b, _c;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, fixture(state.folder, true)];
            case 1:
                path = _e.sent();
                entry = __assign(__assign({}, packages['node_modules/fixture']), { bin: { docusaurus: 'cli.js' } });
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(path, 'package-lock.json'), JSON.stringify({ lockfileVersion: 3, packages: __assign(__assign({}, packages), { 'node_modules/fixture': entry }) }))];
            case 2:
                _e.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(path, 'node_modules/.package-lock.json'), JSON.stringify({ lockfileVersion: 3, packages: { 'node_modules/fixture': entry } }))];
            case 3:
                _e.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(path, 'node_modules/fixture/cli.js'), 'console.log("build")')];
            case 4:
                _e.sent();
                _a = vitest_1.expect;
                return [4 /*yield*/, run()];
            case 5:
                _a.apply(void 0, [(_c = (_b = (_e.sent()).checks) === null || _b === void 0 ? void 0 : _b.at(-1)) === null || _c === void 0 ? void 0 : _c.status]).toBe('setupRequired');
                (0, vitest_1.expect)(stream_process_1.streamProcess).not.toHaveBeenCalled();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('does not allow a shared dependency link after dependencies are removed from a manifest', function () { return __awaiter(void 0, void 0, void 0, function () {
    var path, source, _a;
    var _b, _c;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, fixture(state.folder)];
            case 1:
                path = _e.sent();
                return [4 /*yield*/, fixture(state.source, true)];
            case 2:
                source = _e.sent();
                return [4 /*yield*/, (0, promises_1.symlink)((0, node_path_1.join)(source, 'node_modules'), (0, node_path_1.join)(path, 'node_modules'), 'dir')];
            case 3:
                _e.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(path, 'package.json'), '{"scripts":{"build":"node check.cjs"}}')];
            case 4:
                _e.sent();
                _a = vitest_1.expect;
                return [4 /*yield*/, run()];
            case 5:
                _a.apply(void 0, [(_c = (_b = (_e.sent()).checks) === null || _b === void 0 ? void 0 : _b.at(-1)) === null || _c === void 0 ? void 0 : _c.status]).toBe('setupRequired');
                (0, vitest_1.expect)(stream_process_1.streamProcess).not.toHaveBeenCalled();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('rejects a legacy shared node_modules link before the check can write through it', function () { return __awaiter(void 0, void 0, void 0, function () {
    var path, source, _a;
    var _b, _c;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, fixture(state.folder)];
            case 1:
                path = _e.sent();
                return [4 /*yield*/, fixture(state.source, true)];
            case 2:
                source = _e.sent();
                return [4 /*yield*/, (0, promises_1.symlink)((0, node_path_1.join)(source, 'node_modules'), (0, node_path_1.join)(path, 'node_modules'), 'dir')];
            case 3:
                _e.sent();
                _a = vitest_1.expect;
                return [4 /*yield*/, run()];
            case 4:
                _a.apply(void 0, [(_c = (_b = (_e.sent()).checks) === null || _b === void 0 ? void 0 : _b.at(-1)) === null || _c === void 0 ? void 0 : _c.status]).toBe('setupRequired');
                (0, vitest_1.expect)(stream_process_1.streamProcess).not.toHaveBeenCalled();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('refuses obsolete approval before reading dependencies or running a check', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                state.approval = 'new approval';
                _a = vitest_1.expect;
                return [4 /*yield*/, (0, checks_api_1.runMergeChecks)(d, 'demo', { operationId: 'operation', approval: 'approved', checkIds: ['build'] })];
            case 1:
                _a.apply(void 0, [_b.sent()]).toMatchObject({ ok: false });
                (0, vitest_1.expect)(stream_process_1.streamProcess).not.toHaveBeenCalled();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('requires setup when a lock is missing and never attempts an install or online fallback', function () { return __awaiter(void 0, void 0, void 0, function () {
    var path, result;
    var _a, _b, _c, _e, _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0: return [4 /*yield*/, fixture(state.folder)];
            case 1:
                path = _h.sent();
                return [4 /*yield*/, (0, promises_1.rm)((0, node_path_1.join)(path, 'package-lock.json'))];
            case 2:
                _h.sent();
                return [4 /*yield*/, run()];
            case 3:
                result = _h.sent();
                (0, vitest_1.expect)((_b = (_a = result.checks) === null || _a === void 0 ? void 0 : _a.at(-1)) === null || _b === void 0 ? void 0 : _b.status).toBe('setupRequired');
                (0, vitest_1.expect)((_e = (_c = result.checks) === null || _c === void 0 ? void 0 : _c.at(-1)) === null || _e === void 0 ? void 0 : _e.output).toContain('Commit an npm lockfile');
                (0, vitest_1.expect)((_g = (_f = result.checks) === null || _f === void 0 ? void 0 : _f.at(-1)) === null || _g === void 0 ? void 0 : _g.output).toContain('approve network access separately');
                (0, vitest_1.expect)(stream_process_1.streamProcess).not.toHaveBeenCalled();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('reports an unreadable installation as setup required and logs the underlying error', function () { return __awaiter(void 0, void 0, void 0, function () {
    var path, original, result;
    var _a, _b, _c, _e, _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0: return [4 /*yield*/, fixture(state.folder, true)];
            case 1:
                path = _h.sent();
                original = d.host.read;
                d.log.error = vitest_1.vi.fn();
                d.host.read = function (file) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        if (file === (0, node_path_1.join)(path, 'node_modules/.package-lock.json'))
                            throw Object.assign(new Error('private permission detail'), { code: 'EACCES' });
                        return [2 /*return*/, original(file)];
                    });
                }); };
                return [4 /*yield*/, run()];
            case 2:
                result = _h.sent();
                (0, vitest_1.expect)((_b = (_a = result.checks) === null || _a === void 0 ? void 0 : _a.at(-1)) === null || _b === void 0 ? void 0 : _b.status).toBe('setupRequired');
                (0, vitest_1.expect)((_e = (_c = result.checks) === null || _c === void 0 ? void 0 : _c.at(-1)) === null || _e === void 0 ? void 0 : _e.output).toContain('permissions');
                (0, vitest_1.expect)((_g = (_f = result.checks) === null || _f === void 0 ? void 0 : _f.at(-1)) === null || _g === void 0 ? void 0 : _g.output).not.toContain('private permission detail');
                (0, vitest_1.expect)(d.log.error).toHaveBeenCalled();
                (0, vitest_1.expect)(stream_process_1.streamProcess).not.toHaveBeenCalled();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('refuses a nested package symlink outside the operation', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    var _b, _c;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, fixture(state.source, true)];
            case 1:
                _e.sent();
                return [4 /*yield*/, (0, promises_1.symlink)((0, node_path_1.join)(state.source, 'docs'), (0, node_path_1.join)(state.folder, 'docs'), 'dir')];
            case 2:
                _e.sent();
                _a = vitest_1.expect;
                return [4 /*yield*/, run()];
            case 3:
                _a.apply(void 0, [(_c = (_b = (_e.sent()).checks) === null || _b === void 0 ? void 0 : _b.at(-1)) === null || _c === void 0 ? void 0 : _c.status]).toBe('setupRequired');
                (0, vitest_1.expect)(stream_process_1.streamProcess).not.toHaveBeenCalled();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('does not run a build when dependency inspection changes the approved tree', function () { return __awaiter(void 0, void 0, void 0, function () {
    var original, result;
    var _a, _b, _c, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0: return [4 /*yield*/, fixture(state.folder, true)];
            case 1:
                _f.sent();
                original = d.host.read;
                d.host.read = function (file) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    state.approval = 'changed';
                    return [2 /*return*/, original(file)];
                }); }); };
                return [4 /*yield*/, run()];
            case 2:
                result = _f.sent();
                (0, vitest_1.expect)((_b = (_a = result.checks) === null || _a === void 0 ? void 0 : _a.at(-1)) === null || _b === void 0 ? void 0 : _b.status).toBe('failed');
                (0, vitest_1.expect)((_e = (_c = result.checks) === null || _c === void 0 ? void 0 : _c.at(-1)) === null || _e === void 0 ? void 0 : _e.output).toContain('changed prepared files');
                (0, vitest_1.expect)(stream_process_1.streamProcess).not.toHaveBeenCalled();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('includes dependency inspection in the check timeout and releases the runner for retry', function () { return __awaiter(void 0, void 0, void 0, function () {
    var path, now, original, _a, _b;
    var _c, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0: return [4 /*yield*/, fixture(state.folder, true)];
            case 1:
                path = _g.sent();
                now = 1;
                d.now = function () { return now; };
                original = d.host.read;
                d.host.read = function (file) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        if (file === (0, node_path_1.join)(path, 'package.json'))
                            now += 900001;
                        return [2 /*return*/, original(file)];
                    });
                }); };
                _a = vitest_1.expect;
                return [4 /*yield*/, run()];
            case 2:
                _a.apply(void 0, [(_c = (_g.sent()).checks) === null || _c === void 0 ? void 0 : _c.at(-1)]).toMatchObject({ status: 'failed', output: vitest_1.expect.stringContaining('15-minute limit') });
                (0, vitest_1.expect)(stream_process_1.streamProcess).not.toHaveBeenCalled();
                d.host.read = original;
                _b = vitest_1.expect;
                return [4 /*yield*/, run()];
            case 3:
                _b.apply(void 0, [(_f = (_e = (_g.sent()).checks) === null || _e === void 0 ? void 0 : _e.at(-1)) === null || _f === void 0 ? void 0 : _f.status]).toBe('succeeded');
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('keeps a process timeout failed rather than reporting it as a passing or user-cancelled check', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, fixture(state.folder, true)];
            case 1:
                _c.sent();
                vitest_1.vi.mocked(stream_process_1.streamProcess).mockResolvedValue({ exitCode: 130, stdout: '', stderr: '', timedOut: true });
                _a = vitest_1.expect;
                return [4 /*yield*/, run()];
            case 2:
                _a.apply(void 0, [(_b = (_c.sent()).checks) === null || _b === void 0 ? void 0 : _b.at(-1)]).toMatchObject({ status: 'failed', exitCode: 130, output: vitest_1.expect.stringContaining('15-minute limit') });
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('does not describe an actual script exit code of 130 as a timeout', function () { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    var _a, _b, _c;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, fixture(state.folder, true)];
            case 1:
                _e.sent();
                vitest_1.vi.mocked(stream_process_1.streamProcess).mockResolvedValue({ exitCode: 130, stdout: '', stderr: '' });
                return [4 /*yield*/, run()];
            case 2:
                result = _e.sent();
                (0, vitest_1.expect)((_a = result.checks) === null || _a === void 0 ? void 0 : _a.at(-1)).toMatchObject({ status: 'failed', exitCode: 130 });
                (0, vitest_1.expect)((_c = (_b = result.checks) === null || _b === void 0 ? void 0 : _b.at(-1)) === null || _c === void 0 ? void 0 : _c.output).not.toContain('15-minute limit');
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('cancels during dependency inspection without starting the build or leaving a running record', function () { return __awaiter(void 0, void 0, void 0, function () {
    var path, original, _a;
    var _b, _c;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, fixture(state.folder, true)];
            case 1:
                path = _e.sent();
                original = d.host.read;
                d.host.read = function (file) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(file === (0, node_path_1.join)(path, 'package.json'))) return [3 /*break*/, 2];
                                return [4 /*yield*/, (0, checks_api_1.cancelMergeChecks)(d, 'demo', 'operation')];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2: return [2 /*return*/, original(file)];
                        }
                    });
                }); };
                _a = vitest_1.expect;
                return [4 /*yield*/, run()];
            case 2:
                _a.apply(void 0, [(_c = (_b = (_e.sent()).checks) === null || _b === void 0 ? void 0 : _b.at(-1)) === null || _c === void 0 ? void 0 : _c.status]).toBe('cancelled');
                (0, vitest_1.expect)(stream_process_1.streamProcess).not.toHaveBeenCalled();
                return [2 /*return*/];
        }
    });
}); });
