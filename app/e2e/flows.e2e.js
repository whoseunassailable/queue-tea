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
var test_1 = require("@playwright/test");
var APP = (0, node_path_1.join)(__dirname, '..');
var KEY = 'demo-abc123';
var SHOTS = process.env.QUEUE_TEA_SHOTS;
var run = (0, node_util_1.promisify)(node_child_process_1.execFile);
var home;
var repo;
var file;
var terminalLog;
var app;
var page;
var task = function (over) {
    return (__assign({ state: 'queued', priority: 'mid', difficulty: { expected: 'medium', actual: null }, messages: [], handoff: null, branch: null, baseBranch: null, startCommit: null, blockedBy: [], blockedReason: null, checkpoint: null, created: '2026-10-20T09:00:00+02:00', started: null, finished: null, minutesByDay: {}, effort: { understandingMessages: 0, improvingMessages: 0, filesRead: 0, filesChanged: 0, linesAdded: 0, linesRemoved: 0, filesTouched: 0 }, files: { read: [], changed: [] }, parentId: null, description: null, criteria: [], review: null, helpers: { on: ['tea-dd'], ran: [], reminded: false } }, over));
};
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
var onDisk = function () { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
    switch (_c.label) {
        case 0:
            _b = (_a = JSON).parse;
            return [4 /*yield*/, (0, promises_1.readFile)(file, 'utf8')];
        case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
    }
}); }); };
var stored = function (id) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, onDisk()];
        case 1: return [2 /*return*/, (_a.sent()).tasks.find(function (t) { return t.id === id; })
            // What a session does to the record, written the same way: a whole new file.
        ];
    }
}); }); };
// What a session does to the record, written the same way: a whole new file.
var change = function (edit) { return __awaiter(void 0, void 0, void 0, function () { var _a, _b, _c, _d, _e; return __generator(this, function (_f) {
    switch (_f.label) {
        case 0:
            _a = promises_1.writeFile;
            _b = [file];
            _d = (_c = JSON).stringify;
            _e = edit;
            return [4 /*yield*/, onDisk()];
        case 1: return [2 /*return*/, _a.apply(void 0, _b.concat([_d.apply(_c, [_e.apply(void 0, [_f.sent()]), null, 2])]))];
    }
}); }); };
var editTask = function (id, over) { return change(function (r) { return (__assign(__assign({}, r), { tasks: r.tasks.map(function (t) { return (t.id === id ? __assign(__assign({}, t), over) : t); }) })); }); };
// A session taking what it was asked. It waits for the app's own write, because
// unlike a real session this edit doesn't go through the record's lock.
var noRequests = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, test_1.expect.poll(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, onDisk()];
                        case 1: return [2 /*return*/, (_a.sent()).requests.length];
                    }
                }); }); }).toBeGreaterThan(0)];
            case 1:
                _a.sent();
                return [4 /*yield*/, change(function (r) { return (__assign(__assign({}, r), { requests: [] })); })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var terminals = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, promises_1.readFile)(terminalLog, 'utf8')];
            case 1: return [2 /*return*/, _b.sent()];
            case 2:
                _a = _b.sent();
                // No log yet means no terminal has been opened.
                return [2 /*return*/, ''];
            case 3: return [2 /*return*/];
        }
    });
}); };
var session = function () {
    var args_1 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args_1[_i] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (over) {
        var _a, _b, _c, _d;
        var _e;
        if (over === void 0) { over = {}; }
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _a = promises_1.writeFile;
                    _b = [(0, node_path_1.join)(home, '.queue-tea/sessions/s-1.json')];
                    _d = (_c = JSON).stringify;
                    _e = { id: 's-1', projectPath: repo };
                    return [4 /*yield*/, stored('two')];
                case 1: return [2 /*return*/, _a.apply(void 0, _b.concat([_d.apply(_c, [__assign.apply(void 0, [(_e.workingPath = (_f.sent()).worktreePath, _e.recordFile = file, _e.currentTaskId = null, _e.isTurnRunning = false, _e.cup = { mood: 'idle', line: '' }, _e.allowance = null, _e.options = {}, _e.heartbeat = Date.now(), _e.startedAt = Date.now(), _e), over])])]))];
            }
        });
    });
};
var noSession = function () { return (0, promises_1.rm)((0, node_path_1.join)(home, '.queue-tea/sessions/s-1.json'), { force: true }); };
var button = function (name) { return page.getByRole('button', { name: name }); };
var heading = function (name) { return page.getByRole('heading', { name: name }); };
var toast = function (text) { return page.locator('.toast-item').filter({ hasText: text }).last(); };
var shot = function (name) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(SHOTS !== undefined)) return [3 /*break*/, 2];
                return [4 /*yield*/, page.screenshot({ path: (0, node_path_1.join)(SHOTS, "".concat(name, ".png")) })];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); };
test_1.test.beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, bin, seed;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = promises_1.realpath;
                return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-flows-'))];
            case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
            case 2:
                home = _b.sent();
                repo = (0, node_path_1.join)(home, 'demo');
                file = (0, node_path_1.join)(home, '.queue-tea/projects', "".concat(KEY, ".json"));
                terminalLog = (0, node_path_1.join)(home, 'terminals.log');
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, '.queue-tea/projects'), { recursive: true })];
            case 3:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, '.queue-tea/sessions'), { recursive: true })];
            case 4:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)(repo)];
            case 5:
                _b.sent();
                return [4 /*yield*/, run('git', ['init', '--bare', '-b', 'main', (0, node_path_1.join)(home, 'remote.git')])];
            case 6:
                _b.sent();
                return [4 /*yield*/, git('init', '-b', 'main')];
            case 7:
                _b.sent();
                return [4 /*yield*/, git('config', 'user.email', 'test@example.com')];
            case 8:
                _b.sent();
                return [4 /*yield*/, git('config', 'user.name', 'Test')];
            case 9:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(repo, 'a.txt'), 'a\n')];
            case 10:
                _b.sent();
                return [4 /*yield*/, git('add', '.')];
            case 11:
                _b.sent();
                return [4 /*yield*/, git('commit', '-m', 'first')];
            case 12:
                _b.sent();
                return [4 /*yield*/, git('remote', 'add', 'origin', (0, node_path_1.join)(home, 'remote.git'))];
            case 13:
                _b.sent();
                return [4 /*yield*/, git('push', '-u', 'origin', 'main')
                    // Stands in for osascript, so no real terminal opens during the tests.
                ];
            case 14:
                _b.sent();
                bin = (0, node_path_1.join)(home, 'bin');
                return [4 /*yield*/, (0, promises_1.mkdir)(bin)];
            case 15:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(bin, 'osascript'), "#!/bin/sh\nprintf '%s\\n' \"$*\" >> '".concat(terminalLog, "'\n"))];
            case 16:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.chmod)((0, node_path_1.join)(bin, 'osascript'), 493)];
            case 17:
                _b.sent();
                seed = {
                    version: 1,
                    project: { name: 'Demo realm', path: repo },
                    docsLogPath: null,
                    playNext: null,
                    feature: null,
                    tasks: [
                        task({ id: 'one', title: 'First quest', priority: 'urgent', difficulty: { expected: 'hard', actual: null }, criteria: ['Docs build'] }),
                        task({ id: 'two', title: 'Second quest', priority: 'high' }),
                        task({ id: 'three', title: 'Third quest', priority: 'low' }),
                    ],
                    unassignedMinutesByDay: {},
                    requests: [],
                };
                return [4 /*yield*/, (0, promises_1.writeFile)(file, JSON.stringify(seed, null, 2))];
            case 18:
                _b.sent();
                return [4 /*yield*/, test_1._electron.launch({
                        args: [(0, node_path_1.join)(APP, 'out/main/main.js')],
                        cwd: APP,
                        env: __assign(__assign({}, process.env), { HOME: home, PATH: "".concat(bin, ":").concat(process.env.PATH), QUEUE_TEA_USER_DATA: (0, node_path_1.join)(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' }),
                    })];
            case 19:
                app = _b.sent();
                return [4 /*yield*/, app.firstWindow()];
            case 20:
                page = _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(button('Start ★ First quest')).toBeVisible()];
            case 21:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
test_1.test.afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (app === null || app === void 0 ? void 0 : app.close())];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.rm)(home, { recursive: true, force: true })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('Start creates its own branch and terminal while the original checkout is dirty', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, first, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(repo, 'uncommitted.txt'), 'x\n')];
            case 1:
                _e.sent();
                return [4 /*yield*/, button('Start ★ First quest').click()];
            case 2:
                _e.sent();
                return [4 /*yield*/, (0, test_1.expect)(heading('First quest')).toBeVisible()];
            case 3:
                _e.sent();
                return [4 /*yield*/, (0, test_1.expect)(toast('Set out: First quest · task/first-quest')).toBeVisible()];
            case 4:
                _e.sent();
                _a = test_1.expect;
                return [4 /*yield*/, git('branch', '--show-current')];
            case 5:
                _a.apply(void 0, [_e.sent()]).toBe('main');
                return [4 /*yield*/, stored('one')];
            case 6:
                first = _e.sent();
                (0, test_1.expect)(first).toMatchObject({ state: 'current', branch: 'task/first-quest', baseBranch: 'main' });
                (0, test_1.expect)(first.worktreePath).not.toBe(repo);
                _b = test_1.expect;
                return [4 /*yield*/, onDisk()];
            case 7:
                _b.apply(void 0, [(_e.sent()).requests.map(function (q) { return ({ kind: q.kind, taskId: q.taskId }); })]).toEqual([{ kind: 'begin', taskId: 'one' }]);
                _c = test_1.expect;
                return [4 /*yield*/, terminals()];
            case 8:
                _c.apply(void 0, [_e.sent()]).toContain("cd '".concat(first.worktreePath, "' && claude"));
                _d = test_1.expect;
                return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(repo, 'uncommitted.txt'), 'utf8')];
            case 9:
                _d.apply(void 0, [_e.sent()]).toBe('x\n');
                return [4 /*yield*/, (0, test_1.expect)(page.getByText('Claude Code takes it as soon as it opens here.')).toBeVisible()];
            case 10:
                _e.sent();
                return [4 /*yield*/, shot('waiting-for-session')];
            case 11:
                _e.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('Judgement comes up within 2 s of the mod setting it, and Not yet clears it', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, noRequests()];
            case 1:
                _a.sent();
                return [4 /*yield*/, editTask('one', { review: { at: '2026-10-27T18:00:00+01:00', checked: 'docs build and typecheck pass' } })];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(heading('Is First quest done for now?')).toBeVisible({ timeout: 2000 })];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText('docs build and typecheck pass')).toBeVisible()];
            case 4:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText('Docs build', { exact: true })).toBeVisible()];
            case 5:
                _a.sent();
                return [4 /*yield*/, shot('judgement')];
            case 6:
                _a.sent();
                return [4 /*yield*/, page.keyboard.press('n')];
            case 7:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(heading('First quest')).toBeVisible()];
            case 8:
                _a.sent();
                return [4 /*yield*/, test_1.expect.poll(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, stored('one')];
                            case 1: return [2 /*return*/, (_a.sent()).review];
                        }
                    }); }); }).toBeNull()];
            case 9:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('the first finish asks where the log goes, and the victory follows the win', function () { return __awaiter(void 0, void 0, void 0, function () {
    var dialog, path, _a, _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0: return [4 /*yield*/, editTask('one', { minutesByDay: { '2026-10-27': 14 } })];
            case 1:
                _g.sent();
                return [4 /*yield*/, editTask('one', { review: { at: '2026-10-27T18:00:00+01:00', checked: null } })];
            case 2:
                _g.sent();
                return [4 /*yield*/, (0, test_1.expect)(heading('Is First quest done for now?')).toBeVisible()];
            case 3:
                _g.sent();
                return [4 /*yield*/, page.keyboard.press('y')];
            case 4:
                _g.sent();
                dialog = page.getByRole('dialog');
                return [4 /*yield*/, (0, test_1.expect)(dialog.getByRole('button', { name: 'Hard · 50 XP · expected' })).toHaveAttribute('aria-pressed', 'true')];
            case 5:
                _g.sent();
                path = dialog.getByLabel('Task log path *');
                return [4 /*yield*/, (0, test_1.expect)(path).toHaveValue('docs/task_log.md')];
            case 6:
                _g.sent();
                return [4 /*yield*/, path.fill('')];
            case 7:
                _g.sent();
                return [4 /*yield*/, path.blur()];
            case 8:
                _g.sent();
                return [4 /*yield*/, (0, test_1.expect)(dialog.getByText('Task log path is required.')).toBeVisible()];
            case 9:
                _g.sent();
                return [4 /*yield*/, dialog.getByRole('button', { name: /^Finish/ }).click()];
            case 10:
                _g.sent();
                _a = test_1.expect;
                return [4 /*yield*/, stored('one')];
            case 11:
                _a.apply(void 0, [(_g.sent()).state]).toBe('current');
                return [4 /*yield*/, path.fill('docs/task_log.md')];
            case 12:
                _g.sent();
                return [4 /*yield*/, dialog.getByRole('button', { name: 'Medium · 25 XP' }).click()];
            case 13:
                _g.sent();
                return [4 /*yield*/, shot('finish')];
            case 14:
                _g.sent();
                return [4 /*yield*/, page.keyboard.press('Meta+Enter')];
            case 15:
                _g.sent();
                return [4 /*yield*/, (0, test_1.expect)(heading('Victory!')).toBeVisible()];
            case 16:
                _g.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText('Boss quest won')).toBeVisible()];
            case 17:
                _g.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.win-rows')).toContainText('+25 XP')];
            case 18:
                _g.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.win-rows')).toContainText('+25 gold')];
            case 19:
                _g.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.win-rows')).toContainText('First Flame')];
            case 20:
                _g.sent();
                return [4 /*yield*/, (0, test_1.expect)(toast('Badge earned: First Flame')).toBeVisible()];
            case 21:
                _g.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="root"]')).toHaveClass(/m-cheer/)];
            case 22:
                _g.sent();
                return [4 /*yield*/, page.waitForTimeout(1500)];
            case 23:
                _g.sent();
                return [4 /*yield*/, shot('victory')];
            case 24:
                _g.sent();
                _b = test_1.expect;
                return [4 /*yield*/, stored('one')];
            case 25:
                _b.apply(void 0, [_g.sent()]).toMatchObject({ state: 'done', review: null, difficulty: { expected: 'hard', actual: 'medium' } });
                _c = test_1.expect;
                return [4 /*yield*/, onDisk()];
            case 26:
                _c.apply(void 0, [(_g.sent()).docsLogPath]).toBe('docs/task_log.md');
                _d = test_1.expect;
                _e = promises_1.readFile;
                _f = node_path_1.join;
                return [4 /*yield*/, stored('one')];
            case 27: return [4 /*yield*/, _e.apply(void 0, [_f.apply(void 0, [(_g.sent()).worktreePath, 'docs/task_log.md']), 'utf8'])];
            case 28:
                _d.apply(void 0, [_g.sent()]).toContain('| First quest | Urgent | Hard → Medium | 14m | `task/first-quest` |');
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('Esc closes the victory, and the next quest is ready', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.keyboard.press('Escape')];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(heading('Victory!')).toBeHidden()];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(toast('Badge earned')).toBeHidden()];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="root"]')).not.toHaveClass(/m-cheer/)];
            case 4:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(button('Start ★ Second quest')).toBeVisible()];
            case 5:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('with no session, Back to the board goes at once and keeps the branch', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, branch, startCommit, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: 
            // Starting another quest leaves the first quest's uncommitted log intact.
            return [4 /*yield*/, page.keyboard.press('s')];
            case 1:
                // Starting another quest leaves the first quest's uncommitted log intact.
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(heading('Second quest')).toBeVisible()];
            case 2:
                _c.sent();
                return [4 /*yield*/, noRequests()];
            case 3:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText('No Claude Code session')).toBeVisible()];
            case 4:
                _c.sent();
                return [4 /*yield*/, stored('two')];
            case 5:
                _a = _c.sent(), branch = _a.branch, startCommit = _a.startCommit;
                return [4 /*yield*/, page.keyboard.press('b')];
            case 6:
                _c.sent();
                return [4 /*yield*/, test_1.expect.poll(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, stored('two')];
                            case 1: return [2 /*return*/, (_a.sent()).state];
                        }
                    }); }); }).toBe('queued')];
            case 7:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(toast('Back on the board: Second quest')).toBeVisible()];
            case 8:
                _c.sent();
                _b = test_1.expect;
                return [4 /*yield*/, stored('two')];
            case 9:
                _b.apply(void 0, [_c.sent()]).toMatchObject({ state: 'queued', branch: branch, startCommit: startCommit });
                return [4 /*yield*/, page.getByRole('link', { name: 'Quests', exact: true }).click()];
            case 10:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.detail')).toContainText("Claude's checkpoint wasn't written")];
            case 11:
                _c.sent();
                return [4 /*yield*/, shot('back-no-session')];
            case 12:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('Back right after Start, before Claude has begun, needs no checkpoint', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, git('push', '-u', 'origin', 'task/second-quest').catch(function () { })];
            case 1:
                _c.sent();
                return [4 /*yield*/, page.getByRole('button', { name: /^Second quest/ }).click()];
            case 2:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.detail')).toContainText('Second quest')];
            case 3:
                _c.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Start ★', exact: true }).click()];
            case 4:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.qlist .aq-title')).toHaveText('Second quest')];
            case 5:
                _c.sent();
                _a = test_1.expect;
                return [4 /*yield*/, onDisk()];
            case 6:
                _a.apply(void 0, [(_c.sent()).requests]).toHaveLength(1);
                return [4 /*yield*/, page.keyboard.press('b')];
            case 7:
                _c.sent();
                return [4 /*yield*/, test_1.expect.poll(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, stored('two')];
                            case 1: return [2 /*return*/, (_a.sent()).state];
                        }
                    }); }); }).toBe('queued')];
            case 8:
                _c.sent();
                _b = test_1.expect;
                return [4 /*yield*/, onDisk()];
            case 9:
                _b.apply(void 0, [(_c.sent()).requests]).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('with a session open, Start asks it and opens nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
    var before, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, session()];
            case 1:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.detail')).toBeVisible()];
            case 2:
                _c.sent();
                return [4 /*yield*/, terminals()];
            case 3:
                before = _c.sent();
                return [4 /*yield*/, page.getByRole('button', { name: /^Second quest/ }).click()];
            case 4:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.detail')).toContainText('Second quest')];
            case 5:
                _c.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Start ★', exact: true }).click()];
            case 6:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.qlist .aq-title')).toHaveText('Second quest')];
            case 7:
                _c.sent();
                _a = test_1.expect;
                return [4 /*yield*/, onDisk()];
            case 8:
                _a.apply(void 0, [(_c.sent()).requests.map(function (q) { return q.kind; })]).toEqual(['begin']);
                _b = test_1.expect;
                return [4 /*yield*/, terminals()];
            case 9:
                _b.apply(void 0, [_c.sent()]).toBe(before);
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('with a session open, Back waits for its checkpoint, and says when it has gone', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, noRequests()];
            case 1:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(button('Back to the board')).toBeVisible()];
            case 2:
                _c.sent();
                return [4 /*yield*/, page.keyboard.press('b')];
            case 3:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText('Saving a checkpoint… Claude writes it, then the quest goes back.')).toBeVisible()];
            case 4:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(button('Put it back now, without one')).toBeVisible()];
            case 5:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(button('Finish quest…')).toBeHidden()];
            case 6:
                _c.sent();
                _a = test_1.expect;
                return [4 /*yield*/, onDisk()];
            case 7:
                _a.apply(void 0, [(_c.sent()).requests.map(function (q) { return q.kind; })]).toEqual(['putBack']);
                _b = test_1.expect;
                return [4 /*yield*/, stored('two')];
            case 8:
                _b.apply(void 0, [(_c.sent()).state]).toBe('current');
                return [4 /*yield*/, shot('saving-checkpoint')
                    // The session writes its checkpoint and puts the quest back.
                ];
            case 9:
                _c.sent();
                // The session writes its checkpoint and puts the quest back.
                return [4 /*yield*/, change(function (r) { return (__assign(__assign({}, r), { requests: [], tasks: r.tasks.map(function (t) { return (t.id === 'two' ? __assign(__assign({}, t), { state: 'queued' }) : t); }) })); })];
            case 10:
                // The session writes its checkpoint and puts the quest back.
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.qlist .aq-title')).toHaveCount(0)];
            case 11:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(toast('Back on the board: Second quest')).toBeVisible()];
            case 12:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('when the session ends while a checkpoint is awaited, Put it back now still works', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, page.getByRole('button', { name: /^Second quest/ }).click()];
            case 1:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.detail')).toContainText('Second quest')];
            case 2:
                _b.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Start ★', exact: true }).click()];
            case 3:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.qlist .aq-title')).toHaveText('Second quest')];
            case 4:
                _b.sent();
                return [4 /*yield*/, noRequests()];
            case 5:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(button('Back to the board')).toBeVisible()];
            case 6:
                _b.sent();
                return [4 /*yield*/, page.keyboard.press('b')];
            case 7:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText('Saving a checkpoint')).toBeVisible()];
            case 8:
                _b.sent();
                return [4 /*yield*/, noSession()];
            case 9:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText('No Claude Code session is open to save a checkpoint.')).toBeVisible({ timeout: 10000 })];
            case 10:
                _b.sent();
                return [4 /*yield*/, button('Put it back now, without one').click()
                    // Read from the record: the last test's toast may still be showing.
                ];
            case 11:
                _b.sent();
                // Read from the record: the last test's toast may still be showing.
                return [4 /*yield*/, test_1.expect.poll(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, stored('two')];
                            case 1: return [2 /*return*/, (_a.sent()).state];
                        }
                    }); }); }).toBe('queued')];
            case 12:
                // Read from the record: the last test's toast may still be showing.
                _b.sent();
                _a = test_1.expect;
                return [4 /*yield*/, onDisk()];
            case 13:
                _a.apply(void 0, [(_b.sent()).requests]).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('sealing the active quest puts it back sealed', function () { return __awaiter(void 0, void 0, void 0, function () {
    var dialog, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, page.getByRole('button', { name: /^Second quest/ }).click()];
            case 1:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.detail')).toContainText('Second quest')];
            case 2:
                _b.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Start ★', exact: true }).click()];
            case 3:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.qlist .aq-title')).toHaveText('Second quest')];
            case 4:
                _b.sent();
                return [4 /*yield*/, noRequests()];
            case 5:
                _b.sent();
                return [4 /*yield*/, button('Seal…').first().click()];
            case 6:
                _b.sent();
                dialog = page.getByRole('dialog');
                return [4 /*yield*/, (0, test_1.expect)(dialog.getByText('It goes back on the board with a checkpoint.')).toBeVisible()];
            case 7:
                _b.sent();
                return [4 /*yield*/, dialog.getByLabel('Or a reason').fill('waiting for the clinic')];
            case 8:
                _b.sent();
                return [4 /*yield*/, dialog.getByRole('button', { name: 'Seal' }).click()];
            case 9:
                _b.sent();
                return [4 /*yield*/, test_1.expect.poll(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, stored('two')];
                            case 1: return [2 /*return*/, (_a.sent()).state];
                        }
                    }); }); }).toBe('queued')];
            case 10:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(toast('Sealed: Second quest')).toBeVisible()];
            case 11:
                _b.sent();
                _a = test_1.expect;
                return [4 /*yield*/, stored('two')];
            case 12:
                _a.apply(void 0, [_b.sent()]).toMatchObject({ state: 'queued', blockedReason: 'waiting for the clinic' });
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('c opens Claude Code from Home', function () { return __awaiter(void 0, void 0, void 0, function () {
    var before;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.getByRole('link', { name: 'Home' }).click()];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(button('Start ★ Third quest')).toBeVisible()];
            case 2:
                _a.sent();
                return [4 /*yield*/, page.keyboard.press('s')];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(heading('Third quest')).toBeVisible()];
            case 4:
                _a.sent();
                return [4 /*yield*/, terminals()];
            case 5:
                before = _a.sent();
                return [4 /*yield*/, page.keyboard.press('c')];
            case 6:
                _a.sent();
                return [4 /*yield*/, test_1.expect.poll(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, terminals()];
                            case 1: return [2 /*return*/, (_a.sent()).length];
                        }
                    }); }); }).toBeGreaterThan(before.length)];
            case 7:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('starts another quest in Codex and shows both branches beside Quests', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, _d, _e, second, before, focused, _f, _g, review;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0: return [4 /*yield*/, editTask('two', { blockedReason: null })];
            case 1:
                _h.sent();
                return [4 /*yield*/, page.getByRole('link', { name: 'Quests', exact: true }).click()];
            case 2:
                _h.sent();
                return [4 /*yield*/, page.getByRole('button', { name: /^Second quest/ }).click()];
            case 3:
                _h.sent();
                return [4 /*yield*/, (0, test_1.expect)(button('Start in Codex')).toBeEnabled()];
            case 4:
                _h.sent();
                return [4 /*yield*/, button('Start in Codex').click()];
            case 5:
                _h.sent();
                return [4 /*yield*/, test_1.expect.poll(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, stored('two')];
                            case 1: return [2 /*return*/, (_a.sent()).codexSince];
                        }
                    }); }); }).not.toBeNull()];
            case 6:
                _h.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.qlist .aq-title')).toHaveCount(2)];
            case 7:
                _h.sent();
                _a = test_1.expect;
                return [4 /*yield*/, stored('three')];
            case 8:
                _a.apply(void 0, [(_h.sent()).state]).toBe('current');
                _c = test_1.expect;
                return [4 /*yield*/, stored('two')];
            case 9:
                _d = (_b = _c.apply(void 0, [(_h.sent()).worktreePath]).not).toBe;
                return [4 /*yield*/, stored('three')];
            case 10:
                _d.apply(_b, [(_h.sent()).worktreePath]);
                _e = test_1.expect;
                return [4 /*yield*/, git('branch', '--show-current')];
            case 11:
                _e.apply(void 0, [_h.sent()]).toBe('main');
                return [4 /*yield*/, page.getByRole('link', { name: 'Branches', exact: true }).click()];
            case 12:
                _h.sent();
                return [4 /*yield*/, (0, test_1.expect)(heading('Branch tree')).toBeVisible()];
            case 13:
                _h.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText('2 in progress', { exact: true })).toBeVisible()];
            case 14:
                _h.sent();
                second = page.getByRole('article', { name: 'Second quest' });
                return [4 /*yield*/, (0, test_1.expect)(second.getByText('task/second-quest → main', { exact: true })).toBeVisible()];
            case 15:
                _h.sent();
                return [4 /*yield*/, terminals()];
            case 16:
                before = _h.sent();
                return [4 /*yield*/, second.getByRole('button', { name: 'Show Codex' }).click()];
            case 17:
                _h.sent();
                return [4 /*yield*/, test_1.expect.poll(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, terminals()];
                            case 1: return [2 /*return*/, (_a.sent()).length];
                        }
                    }); }); }).toBeGreaterThan(before.length)];
            case 18:
                _h.sent();
                return [4 /*yield*/, terminals()];
            case 19:
                focused = (_h.sent()).slice(before.length);
                _g = (_f = (0, test_1.expect)(focused)).toContain;
                return [4 /*yield*/, stored('two')];
            case 20:
                _g.apply(_f, [(_h.sent()).worktreePath]);
                (0, test_1.expect)(focused).not.toContain('do script');
                return [4 /*yield*/, second.getByRole('button', { name: 'Review work', exact: true }).click()];
            case 21:
                _h.sent();
                review = page.getByRole('dialog', { name: 'Review work' });
                return [4 /*yield*/, (0, test_1.expect)(review.getByText('task/second-quest → main', { exact: true })).toBeVisible()];
            case 22:
                _h.sent();
                return [4 /*yield*/, (0, test_1.expect)(review.getByRole('tab', { name: 'Checks', exact: true })).toBeVisible()];
            case 23:
                _h.sent();
                return [4 /*yield*/, (0, test_1.expect)(review.getByRole('button', { name: 'Prepare merge for review' })).toBeDisabled()];
            case 24:
                _h.sent();
                return [4 /*yield*/, review.getByRole('button', { name: 'Close', exact: true }).click()];
            case 25:
                _h.sent();
                return [4 /*yield*/, shot('parallel-branches')];
            case 26:
                _h.sent();
                return [2 /*return*/];
        }
    });
}); });
