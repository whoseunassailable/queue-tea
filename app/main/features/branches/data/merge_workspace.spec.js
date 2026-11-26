"use strict";
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
var logger_1 = require("../../../core/logger");
var node_host_1 = require("../../../core/node_host");
var merge_workspace_1 = require("./merge_workspace");
var state = vitest_1.vi.hoisted(function () { return ({ folder: '', index: '', untracked: '', unstaged: '' }); });
vitest_1.vi.mock('./operation_store', function () { return ({ operationPath: function () { return state.folder; } }); });
vitest_1.vi.mock('./checks_source', function () { return ({ discoverChecks: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, []];
    }); }); }, readChecks: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, []];
    }); }); }, checksPassed: function () { return true; } }); });
vitest_1.vi.mock('./branch_source', function () { return ({
    digest: function (text) { return text; },
    gitIn: function () { return function (args) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (args[0] === 'rev-parse')
                return [2 /*return*/, args.at(-1) === 'index' ? state.index : 'target'];
            if (args[0] === 'ls-files')
                return [2 /*return*/, args.includes('--others') ? state.untracked : ''];
            if (args[0] === 'diff')
                return [2 /*return*/, args.length === 4 ? state.unstaged : ''];
            return [2 /*return*/, ''];
        });
    }); }; },
}); });
var root;
var d;
var operation = { id: 'operation', key: 'demo', stage: 'ready', sourceHead: 'source', targetHead: 'target', commit: null };
(0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, log, host;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = promises_1.realpath;
                return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-dependency-review-'))];
            case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
            case 2:
                root = _b.sent();
                state.folder = (0, node_path_1.join)(root, 'operation');
                state.index = (0, node_path_1.join)(root, 'index');
                state.untracked = '';
                state.unstaged = '';
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(state.folder, 'worktree/docs'), { recursive: true })];
            case 3:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)(state.index, 'private index fixture')];
            case 4:
                _b.sent();
                log = (0, logger_1.createLogger)('dev', function () { });
                host = (0, node_host_1.nodeHost)(log, function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, ({ exitCode: 0, stdout: '', stderr: '' })];
                }); }); });
                host.run = function (argv) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, ({ exitCode: 0, stdout: argv[0] === 'env' ? 'tree' : 'source', stderr: '' })];
                }); }); };
                d = { host: host, home: root, log: log, now: function () { return Date.now(); } };
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
(0, vitest_1.it)('keeps the same approval after local nested dependency setup without requiring an ignore edit', function () { return __awaiter(void 0, void 0, void 0, function () {
    var before, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, merge_workspace_1.workspaceOf)(d, root, operation)];
            case 1:
                before = _b.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(state.folder, 'worktree/docs/node_modules'))];
            case 2:
                _b.sent();
                state.untracked = 'docs/node_modules/\0';
                _a = vitest_1.expect;
                return [4 /*yield*/, (0, merge_workspace_1.workspaceOf)(d, root, operation)];
            case 3:
                _a.apply(void 0, [(_b.sent()).approval]).toBe(before.approval);
                (0, vitest_1.expect)(before.approval).toBeTruthy();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('still refuses unrelated untracked files alongside an installation', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(state.folder, 'worktree/docs/node_modules'))];
            case 1:
                _b.sent();
                state.untracked = 'docs/node_modules/\0unreviewed.txt\0';
                _a = vitest_1.expect;
                return [4 /*yield*/, (0, merge_workspace_1.workspaceOf)(d, root, operation)];
            case 2:
                _a.apply(void 0, [(_b.sent()).approval]).toBeNull();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('still refuses tracked changes alongside an installation', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(state.folder, 'worktree/docs/node_modules'))];
            case 1:
                _b.sent();
                state.untracked = 'docs/node_modules/\0';
                state.unstaged = 'changed package-lock.json';
                _a = vitest_1.expect;
                return [4 /*yield*/, (0, merge_workspace_1.workspaceOf)(d, root, operation)];
            case 2:
                _a.apply(void 0, [(_b.sent()).approval]).toBeNull();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('does not exempt a shared node_modules link from review', function () { return __awaiter(void 0, void 0, void 0, function () {
    var other, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                other = (0, node_path_1.join)(root, 'other');
                return [4 /*yield*/, (0, promises_1.mkdir)(other)];
            case 1:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.symlink)(other, (0, node_path_1.join)(state.folder, 'worktree/docs/node_modules'), 'dir')];
            case 2:
                _b.sent();
                state.untracked = 'docs/node_modules\0';
                _a = vitest_1.expect;
                return [4 /*yield*/, (0, merge_workspace_1.workspaceOf)(d, root, operation)];
            case 3:
                _a.apply(void 0, [(_b.sent()).approval]).toBeNull();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('does not exempt dependency folders reached through an external ancestor link', function () { return __awaiter(void 0, void 0, void 0, function () {
    var other, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                other = (0, node_path_1.join)(root, 'other');
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(other, 'node_modules'), { recursive: true })];
            case 1:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.symlink)(other, (0, node_path_1.join)(state.folder, 'worktree/external'), 'dir')];
            case 2:
                _b.sent();
                state.untracked = 'external/node_modules/\0';
                _a = vitest_1.expect;
                return [4 /*yield*/, (0, merge_workspace_1.workspaceOf)(d, root, operation)];
            case 3:
                _a.apply(void 0, [(_b.sent()).approval]).toBeNull();
                return [2 /*return*/];
        }
    });
}); });
