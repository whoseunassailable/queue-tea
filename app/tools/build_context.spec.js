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
var exec = (0, node_util_1.promisify)(node_child_process_1.execFile);
var integration = process.env.QUEUE_TEA_GIT_TESTS === '1' ? vitest_1.it : vitest_1.it.skip;
// Exercise the actual Vite config in the same Git-free archive used by the
// updater. Everything, including the source commit, belongs to this temp test.
integration('builds the real application from an acknowledged archive with matching embedded and packaged provenance', function () { return __awaiter(void 0, void 0, void 0, function () {
    var root, folder, _a, repo, snapshot, env, git, paths, _i, paths_1, path, commit, _b, source, context, _c, _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                root = (0, node_path_1.resolve)(__dirname, '../..');
                _a = promises_1.realpath;
                return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-build-context-'))];
            case 1: return [4 /*yield*/, _a.apply(void 0, [_g.sent()])];
            case 2:
                folder = _g.sent();
                repo = (0, node_path_1.join)(folder, 'repo');
                snapshot = (0, node_path_1.join)(folder, 'snapshot');
                env = __assign(__assign({}, process.env), { GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null' });
                git = function (cwd) {
                    var args = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        args[_i - 1] = arguments[_i];
                    }
                    return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, exec('git', args, { cwd: cwd, env: env, maxBuffer: 8 * 1024 * 1024 })];
                            case 1: return [2 /*return*/, (_a.sent()).stdout.trim()];
                        }
                    }); });
                };
                _g.label = 3;
            case 3:
                _g.trys.push([3, , 28, 30]);
                return [4 /*yield*/, (0, promises_1.mkdir)(repo)];
            case 4:
                _g.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)(snapshot)];
            case 5:
                _g.sent();
                return [4 /*yield*/, git(root, 'ls-files', '--cached', '--others', '--exclude-standard', '-z')];
            case 6:
                paths = (_g.sent()).split('\0').filter(Boolean);
                _i = 0, paths_1 = paths;
                _g.label = 7;
            case 7:
                if (!(_i < paths_1.length)) return [3 /*break*/, 11];
                path = paths_1[_i];
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.dirname)((0, node_path_1.join)(repo, path)), { recursive: true })];
            case 8:
                _g.sent();
                return [4 /*yield*/, (0, promises_1.copyFile)((0, node_path_1.join)(root, path), (0, node_path_1.join)(repo, path))];
            case 9:
                _g.sent();
                _g.label = 10;
            case 10:
                _i++;
                return [3 /*break*/, 7];
            case 11: return [4 /*yield*/, git(repo, 'init', '-b', 'main')];
            case 12:
                _g.sent();
                return [4 /*yield*/, git(repo, 'config', 'user.name', 'Test')];
            case 13:
                _g.sent();
                return [4 /*yield*/, git(repo, 'config', 'user.email', 'test@example.invalid')];
            case 14:
                _g.sent();
                return [4 /*yield*/, git(repo, 'config', 'core.hooksPath', '/dev/null')];
            case 15:
                _g.sent();
                return [4 /*yield*/, git(repo, 'config', 'commit.gpgsign', 'false')];
            case 16:
                _g.sent();
                return [4 /*yield*/, git(repo, 'add', '.')];
            case 17:
                _g.sent();
                return [4 /*yield*/, git(repo, 'commit', '-m', 'Snapshot build test')];
            case 18:
                _g.sent();
                return [4 /*yield*/, git(repo, 'rev-parse', 'HEAD')];
            case 19:
                commit = _g.sent();
                return [4 /*yield*/, git(repo, 'archive', '--format=tar', '-o', (0, node_path_1.join)(folder, 'source.tar'), commit)];
            case 20:
                _g.sent();
                return [4 /*yield*/, exec('/usr/bin/tar', ['-xf', (0, node_path_1.join)(folder, 'source.tar'), '-C', snapshot])];
            case 21:
                _g.sent();
                _b = promises_1.symlink;
                return [4 /*yield*/, (0, promises_1.realpath)((0, node_path_1.join)(root, 'app/node_modules'))];
            case 22: return [4 /*yield*/, _b.apply(void 0, [_g.sent(), (0, node_path_1.join)(snapshot, 'app/node_modules')])];
            case 23:
                _g.sent();
                source = { version: 1, commit: commit, branch: 'main', integration: 'main', dirty: false, builtAt: new Date().toISOString(), repository: (0, node_path_1.join)(repo, '.git'), published: { remote: 'local-test', commit: commit } };
                context = (0, node_path_1.join)(folder, 'context.json');
                return [4 /*yield*/, (0, promises_1.writeFile)(context, JSON.stringify(source))];
            case 24:
                _g.sent();
                return [4 /*yield*/, exec('npm', ['run', 'build'], { cwd: (0, node_path_1.join)(snapshot, 'app'), env: __assign(__assign({}, env), { QUEUE_TEA_RELEASE_CONTEXT: context, QUEUE_TEA_RELEASE_REPOSITORY: repo, QUEUE_TEA_RELEASE_COMMIT: commit }), maxBuffer: 8 * 1024 * 1024 })];
            case 25:
                _g.sent();
                _c = vitest_1.expect;
                _e = (_d = JSON).parse;
                return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(snapshot, 'app/out/provenance.json'), 'utf8')];
            case 26:
                _c.apply(void 0, [_e.apply(_d, [_g.sent()])]).toEqual(source);
                _f = vitest_1.expect;
                return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(snapshot, 'app/out/main/main.js'), 'utf8')];
            case 27:
                _f.apply(void 0, [_g.sent()]).toContain(commit);
                return [3 /*break*/, 30];
            case 28: return [4 /*yield*/, (0, promises_1.rm)(folder, { recursive: true, force: true })];
            case 29:
                _g.sent();
                return [7 /*endfinally*/];
            case 30: return [2 /*return*/];
        }
    });
}); }, 30000);
