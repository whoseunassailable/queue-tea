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
var APP = (0, node_path_1.join)(__dirname, '..');
var KEY = 'demo-abc123';
var SHOTS = process.env.QUEUE_TEA_SHOTS;
var run = (0, node_util_1.promisify)(node_child_process_1.execFile);
var home;
var repo;
var file;
var app;
var page;
var task = function (over) {
    return (__assign({ state: 'queued', priority: 'mid', difficulty: { expected: 'medium', actual: null }, messages: [], handoff: null, branch: null, baseBranch: null, startCommit: null, blockedBy: [], blockedReason: null, checkpoint: null, created: '2026-10-20T09:00:00+02:00', started: null, finished: null, minutesByDay: {}, effort: { understandingMessages: 0, improvingMessages: 0, filesRead: 0, filesChanged: 0, linesAdded: 0, linesRemoved: 0, filesTouched: 0 }, files: { read: [], changed: [] }, parentId: null, description: null, criteria: [], review: null }, over));
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
        case 1: return [2 /*return*/, (_a.sent()).tasks.find(function (t) { return t.id === id; })];
    }
}); }); };
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
var titles = function () { return page.locator('.board-list .qc-title'); };
var row = function (title) { return page.locator('.board-list .qrow').filter({ has: page.getByText(title, { exact: true }) }); };
var search = function () { return page.getByRole('searchbox', { name: 'Search quests' }); };
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
    var _a, seed;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = promises_1.realpath;
                return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-board-'))];
            case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
            case 2:
                home = _b.sent();
                repo = (0, node_path_1.join)(home, 'demo');
                file = (0, node_path_1.join)(home, '.queue-tea/projects', "".concat(KEY, ".json"));
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, '.queue-tea/projects'), { recursive: true })];
            case 3:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, '.queue-tea/sessions'), { recursive: true })];
            case 4:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)(repo)];
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
                return [4 /*yield*/, git('branch', 'task/mine')];
            case 12:
                _b.sent();
                seed = {
                    version: 1,
                    project: { name: 'Demo realm', path: repo },
                    docsLogPath: null,
                    playNext: null,
                    feature: null,
                    tasks: [
                        task({ id: 'long', title: 'A long hard quest', priority: 'urgent', difficulty: { expected: 'hard', actual: null } }),
                        task({ id: 'short', title: 'A short light quest', priority: 'low', difficulty: { expected: 'light', actual: null }, branch: 'task/needle' }),
                        task({ id: 'saga', title: 'The saga', priority: 'low' }),
                        task({ id: 'hay', title: 'Hay', priority: 'low', parentId: 'saga' }),
                        task({ id: 'pin', title: 'Pin', priority: 'low', parentId: 'saga' }),
                    ],
                    unassignedMinutesByDay: {},
                    requests: [],
                };
                return [4 /*yield*/, (0, promises_1.writeFile)(file, JSON.stringify(seed, null, 2))];
            case 13:
                _b.sent();
                return [4 /*yield*/, test_1._electron.launch({
                        args: [(0, node_path_1.join)(APP, 'out/main/main.js')],
                        cwd: APP,
                        env: __assign(__assign({}, process.env), { HOME: home, QUEUE_TEA_USER_DATA: (0, node_path_1.join)(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' }),
                    })];
            case 14:
                app = _b.sent();
                return [4 /*yield*/, app.firstWindow()];
            case 15:
                page = _b.sent();
                return [4 /*yield*/, page.getByRole('link', { name: 'Quests', exact: true }).click()];
            case 16:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(titles().first()).toHaveText('A long hard quest')];
            case 17:
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
(0, test_1.test)('search narrows the board, marks the match and keeps a saga for its chapter', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.keyboard.press('Meta+f')];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(search()).toBeFocused()];
            case 2:
                _a.sent();
                return [4 /*yield*/, page.keyboard.type('pin')];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(titles()).toHaveText(['The saga', 'Pin'])];
            case 4:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.board-list mark')).toHaveText('Pin')];
            case 5:
                _a.sent();
                return [4 /*yield*/, shot('search')];
            case 6:
                _a.sent();
                return [4 /*yield*/, page.keyboard.press('Escape')];
            case 7:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(search()).toHaveValue('')];
            case 8:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(titles().first()).toHaveText('A long hard quest')];
            case 9:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('a search with no match says so, and clears', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, search().fill('zebra')];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText('No quests match "zebra".')).toBeVisible()];
            case 2:
                _a.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Clear search' }).click()];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(titles().first()).toHaveText('A long hard quest')];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('filters combine, and clear', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.getByRole('button', { name: 'Filters' }).click()];
            case 1:
                _a.sent();
                return [4 /*yield*/, page.getByRole('checkbox', { name: 'Light' }).check()];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(titles()).toHaveText(['A short light quest'])];
            case 3:
                _a.sent();
                return [4 /*yield*/, shot('filters')];
            case 4:
                _a.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Clear all' }).click()];
            case 5:
                _a.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Filters' }).click()];
            case 6:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(titles().first()).toHaveText('A long hard quest')];
            case 7:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('Time I have changes the ★, keeps it through an edit, and writes nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
    var before, _a, i;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, (0, promises_1.readFile)(file, 'utf8')];
            case 1:
                before = _c.sent();
                return [4 /*yield*/, page.evaluateHandle(function () { return document.activeElement; })];
            case 2:
                (_b = (_c.sent()).asElement()) === null || _b === void 0 ? void 0 : _b.evaluate(function (el) { return el.blur(); });
                return [4 /*yield*/, page.keyboard.press('t')];
            case 3:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('button', { name: 'Time I have: 30m. Change it' })).toBeVisible()];
            case 4:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(row('A short light quest').locator('.qr-mark')).toHaveText('★')];
            case 5:
                _c.sent();
                _a = test_1.expect;
                return [4 /*yield*/, (0, promises_1.readFile)(file, 'utf8')];
            case 6:
                _a.apply(void 0, [_c.sent()]).toBe(before);
                return [4 /*yield*/, row('A long hard quest').locator('.qrow-open').click()];
            case 7:
                _c.sent();
                return [4 /*yield*/, page.keyboard.press('2')];
            case 8:
                _c.sent();
                return [4 /*yield*/, test_1.expect.poll(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, stored('long')];
                            case 1: return [2 /*return*/, (_a.sent()).priority];
                        }
                    }); }); }).toBe('high')];
            case 9:
                _c.sent();
                return [4 /*yield*/, page.waitForTimeout(400)];
            case 10:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(row('A short light quest').locator('.qr-mark')).toHaveText('★')];
            case 11:
                _c.sent();
                i = 0;
                _c.label = 12;
            case 12:
                if (!(i < 3)) return [3 /*break*/, 15];
                return [4 /*yield*/, page.keyboard.press('t')];
            case 13:
                _c.sent();
                _c.label = 14;
            case 14:
                i += 1;
                return [3 /*break*/, 12];
            case 15: return [4 /*yield*/, (0, test_1.expect)(page.getByRole('button', { name: 'Time I have: any. Change it' })).toBeVisible()];
            case 16:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('dragging a quest onto a saga asks first, then moves it', function () { return __awaiter(void 0, void 0, void 0, function () {
    var dialog, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, row('A short light quest').dragTo(row('The saga'))];
            case 1:
                _b.sent();
                dialog = page.getByRole('dialog');
                return [4 /*yield*/, (0, test_1.expect)(dialog.getByText('A short light quest moves to The saga.', { exact: false })).toBeVisible()];
            case 2:
                _b.sent();
                _a = test_1.expect;
                return [4 /*yield*/, stored('short')];
            case 3:
                _a.apply(void 0, [(_b.sent()).parentId]).toBeNull();
                return [4 /*yield*/, shot('drag-move')];
            case 4:
                _b.sent();
                return [4 /*yield*/, dialog.getByRole('button', { name: 'Move' }).click()];
            case 5:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(dialog).toBeHidden()];
            case 6:
                _b.sent();
                return [4 /*yield*/, test_1.expect.poll(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, stored('short')];
                            case 1: return [2 /*return*/, (_a.sent()).parentId];
                        }
                    }); }); }).toBe('saga')];
            case 7:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('a drop the engine refuses shows its sentence, and moves nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
    var dialog, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, row('A long hard quest').dragTo(row('Hay'))];
            case 1:
                _b.sent();
                dialog = page.getByRole('dialog');
                return [4 /*yield*/, dialog.getByRole('button', { name: 'Move' }).click()];
            case 2:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(dialog.locator('.field-error')).toBeVisible()];
            case 3:
                _b.sent();
                _a = test_1.expect;
                return [4 /*yield*/, stored('long')];
            case 4:
                _a.apply(void 0, [(_b.sent()).parentId]).toBeNull();
                return [4 /*yield*/, page.keyboard.press('Escape')];
            case 5:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('Home says when the quest\'s branch isn\'t checked out, and Switch fixes it', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, change(function (r) { return (__assign(__assign({}, r), { tasks: r.tasks.map(function (t) { return (t.id === 'long' ? __assign(__assign({}, t), { state: 'current', branch: 'task/mine', baseBranch: 'main' }) : t); }) })); })];
            case 1:
                _b.sent();
                return [4 /*yield*/, page.getByRole('link', { name: 'Home', exact: true }).click()];
            case 2:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText("You're on main, not task/mine")).toBeVisible()];
            case 3:
                _b.sent();
                return [4 /*yield*/, page.waitForTimeout(100)];
            case 4:
                _b.sent();
                return [4 /*yield*/, shot('branch-mismatch')];
            case 5:
                _b.sent();
                return [4 /*yield*/, page.keyboard.press('w')];
            case 6:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText('Switched to task/mine')).toBeVisible()];
            case 7:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText("You're on main, not task/mine")).toBeHidden()];
            case 8:
                _b.sent();
                _a = test_1.expect;
                return [4 /*yield*/, git('branch', '--show-current')];
            case 9:
                _a.apply(void 0, [_b.sent()]).toBe('task/mine');
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('the quest in hand opens in full, with what git says', function () { return __awaiter(void 0, void 0, void 0, function () {
    var pane;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(repo, 'a.txt'), 'changed\n')];
            case 1:
                _a.sent();
                return [4 /*yield*/, page.getByRole('link', { name: 'Quests', exact: true }).click()];
            case 2:
                _a.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Show the details of A long hard quest' }).click()];
            case 3:
                _a.sent();
                pane = page.getByRole('complementary', { name: 'Quest details' });
                return [4 /*yield*/, (0, test_1.expect)(pane.getByRole('heading', { name: 'A long hard quest' })).toBeVisible()];
            case 4:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(pane).toContainText('first')];
            case 5:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(pane.getByText('1 file not committed')).toBeVisible()];
            case 6:
                _a.sent();
                return [4 /*yield*/, page.waitForTimeout(100)];
            case 7:
                _a.sent();
                return [4 /*yield*/, shot('active-detail')];
            case 8:
                _a.sent();
                return [4 /*yield*/, git('checkout', '--', 'a.txt')];
            case 9:
                _a.sent();
                return [4 /*yield*/, page.getByRole('link', { name: 'Home', exact: true }).click()];
            case 10:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('the commit warning from a session shows, and OK puts it away', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(home, '.queue-tea/sessions/s-1.json'), JSON.stringify({ id: 's-1', projectPath: repo, recordFile: file, currentTaskId: 'long', isTurnRunning: false, cup: { mood: 'idle', line: '' }, allowance: null, options: {}, heartbeat: Date.now(), startedAt: Date.now(), warning: 'During the last turn a commit appeared: 1a2b3c4 tweak.' }))];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText('During the last turn a commit appeared: 1a2b3c4 tweak.')).toBeVisible()];
            case 2:
                _a.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'OK' }).click()];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText('During the last turn a commit appeared: 1a2b3c4 tweak.')).toBeHidden()];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
