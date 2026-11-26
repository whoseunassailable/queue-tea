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
var test_1 = require("@playwright/test");
var record_source_1 = require("../../hooks/shared/records/data/datasources/record_source");
var fixtures_1 = require("../main/features/tasks/api/fixtures");
// Free space through the window, IPC, real Git and the disk. The project, its
// two quest worktrees, the record and HOME are temporary. No commit, merge or
// push runs from the app; the test's own setup merges inside the temp repo.
var run = (0, node_util_1.promisify)(node_child_process_1.execFile);
var KEY = 'space-abc123';
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
(0, test_1.test)('frees a quest folder\'s build output and removes a merged folder, keeping its branch', function () { return __awaiter(void 0, void 0, void 0, function () {
    var home, _a, repo, one, two, file, app, startCommit_1, _i, _b, path, quest, page, sheet, _c, _d, _e, _f, _g, record, _h, _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                _a = promises_1.realpath;
                return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-free-space-'))];
            case 1: return [4 /*yield*/, _a.apply(void 0, [_k.sent()])];
            case 2:
                home = _k.sent();
                repo = (0, node_path_1.join)(home, 'repo');
                one = (0, node_path_1.join)(home, 'quests/one');
                two = (0, node_path_1.join)(home, 'quests/two');
                file = (0, node_path_1.join)(home, '.queue-tea/projects', "".concat(KEY, ".json"));
                _k.label = 3;
            case 3:
                _k.trys.push([3, , 47, 50]);
                return [4 /*yield*/, (0, promises_1.mkdir)(repo, { recursive: true })];
            case 4:
                _k.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, '.queue-tea/projects'), { recursive: true })];
            case 5:
                _k.sent();
                return [4 /*yield*/, git(repo, 'init', '-b', 'main')];
            case 6:
                _k.sent();
                return [4 /*yield*/, git(repo, 'config', 'user.name', 'Queue-tea test')];
            case 7:
                _k.sent();
                return [4 /*yield*/, git(repo, 'config', 'user.email', 'test@example.invalid')];
            case 8:
                _k.sent();
                return [4 /*yield*/, git(repo, 'config', 'core.hooksPath', '/dev/null')];
            case 9:
                _k.sent();
                return [4 /*yield*/, git(repo, 'config', 'commit.gpgsign', 'false')];
            case 10:
                _k.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(repo, '.gitignore'), 'node_modules/\n.env\n')];
            case 11:
                _k.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(repo, 'a.txt'), 'base\n')];
            case 12:
                _k.sent();
                return [4 /*yield*/, git(repo, 'add', '.')];
            case 13:
                _k.sent();
                return [4 /*yield*/, git(repo, 'commit', '-m', 'Base')];
            case 14:
                _k.sent();
                return [4 /*yield*/, git(repo, 'rev-parse', 'HEAD')];
            case 15:
                startCommit_1 = _k.sent();
                return [4 /*yield*/, git(repo, 'worktree', 'add', '-b', 'task/one', one, 'main')];
            case 16:
                _k.sent();
                return [4 /*yield*/, git(repo, 'worktree', 'add', '-b', 'task/two', two, 'main')];
            case 17:
                _k.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(one, 'one.txt'), 'one\n')];
            case 18:
                _k.sent();
                return [4 /*yield*/, git(one, 'add', 'one.txt')];
            case 19:
                _k.sent();
                return [4 /*yield*/, git(one, 'commit', '-m', 'Work on one')];
            case 20:
                _k.sent();
                return [4 /*yield*/, git(repo, 'merge', '--no-ff', '--no-edit', 'task/one')];
            case 21:
                _k.sent();
                _i = 0, _b = [one, two];
                _k.label = 22;
            case 22:
                if (!(_i < _b.length)) return [3 /*break*/, 27];
                path = _b[_i];
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(path, 'node_modules/pkg'), { recursive: true })];
            case 23:
                _k.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(path, 'node_modules/pkg/index.js'), 'x'.repeat(200000))];
            case 24:
                _k.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(path, '.env'), 'SECRET=1')];
            case 25:
                _k.sent();
                _k.label = 26;
            case 26:
                _i++;
                return [3 /*break*/, 22];
            case 27:
                quest = function (id, worktreePath) { return (0, fixtures_1.makeTask)({ id: id, title: "Quest ".concat(id), state: 'done', branch: "task/".concat(id), baseBranch: 'main', startCommit: startCommit_1, worktreePath: worktreePath }); };
                return [4 /*yield*/, (0, promises_1.writeFile)(file, JSON.stringify(__assign(__assign({}, (0, record_source_1.emptyRecord)('Space demo', repo)), { version: 2, tasks: [quest('one', one), quest('two', two)] })))];
            case 28:
                _k.sent();
                return [4 /*yield*/, test_1._electron.launch({ args: [(0, node_path_1.join)(__dirname, '../out/main/main.js')], cwd: (0, node_path_1.join)(__dirname, '..'), env: __assign(__assign({}, process.env), { HOME: home, QUEUE_TEA_USER_DATA: (0, node_path_1.join)(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' }) })];
            case 29:
                app = _k.sent();
                return [4 /*yield*/, app.firstWindow()];
            case 30:
                page = _k.sent();
                return [4 /*yield*/, page.getByRole('navigation', { name: 'Realms' }).getByRole('button', { name: /Space demo/ }).click()];
            case 31:
                _k.sent();
                return [4 /*yield*/, page.getByRole('link', { name: 'Branches', exact: true }).click()];
            case 32:
                _k.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Free space', exact: true }).click()];
            case 33:
                _k.sent();
                sheet = page.getByRole('dialog', { name: 'Free space' });
                return [4 /*yield*/, (0, test_1.expect)(sheet.getByRole('checkbox', { name: 'Quest two' })).toBeEnabled()];
            case 34:
                _k.sent();
                return [4 /*yield*/, sheet.getByRole('checkbox', { name: 'Quest two' }).check()];
            case 35:
                _k.sent();
                return [4 /*yield*/, sheet.getByRole('button', { name: /^Free .+ from 1 folder$/ }).click()];
            case 36:
                _k.sent();
                return [4 /*yield*/, (0, test_1.expect)(sheet.getByText(/^Freed /)).toBeVisible()];
            case 37:
                _k.sent();
                _c = test_1.expect;
                return [4 /*yield*/, isThere((0, node_path_1.join)(two, 'node_modules'))];
            case 38:
                _c.apply(void 0, [_k.sent()]).toBe(false);
                _d = test_1.expect;
                return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(two, '.env'), 'utf8')];
            case 39:
                _d.apply(void 0, [_k.sent()]).toBe('SECRET=1');
                _e = test_1.expect;
                return [4 /*yield*/, isThere((0, node_path_1.join)(one, 'node_modules/pkg/index.js'))];
            case 40:
                _e.apply(void 0, [_k.sent()]).toBe(true);
                return [4 /*yield*/, sheet.getByRole('button', { name: 'Remove folder', exact: true }).click()];
            case 41:
                _k.sent();
                return [4 /*yield*/, sheet.getByRole('button', { name: 'Remove this folder', exact: true }).click()];
            case 42:
                _k.sent();
                return [4 /*yield*/, (0, test_1.expect)(sheet.getByText('Removed the folder of Quest one. Its branch is kept.')).toBeVisible()];
            case 43:
                _k.sent();
                _f = test_1.expect;
                return [4 /*yield*/, isThere(one)];
            case 44:
                _f.apply(void 0, [_k.sent()]).toBe(false);
                _g = test_1.expect;
                return [4 /*yield*/, git(repo, 'branch', '--list', 'task/one')];
            case 45:
                _g.apply(void 0, [_k.sent()]).toContain('task/one');
                _j = (_h = JSON).parse;
                return [4 /*yield*/, (0, promises_1.readFile)(file, 'utf8')];
            case 46:
                record = _j.apply(_h, [_k.sent()]);
                (0, test_1.expect)(record.tasks.map(function (t) { return [t.id, t.worktreePath]; })).toEqual([['one', null], ['two', two]]);
                return [3 /*break*/, 50];
            case 47: return [4 /*yield*/, (app === null || app === void 0 ? void 0 : app.close())];
            case 48:
                _k.sent();
                return [4 /*yield*/, (0, promises_1.rm)(home, { recursive: true, force: true })];
            case 49:
                _k.sent();
                return [7 /*endfinally*/];
            case 50: return [2 /*return*/];
        }
    });
}); });
