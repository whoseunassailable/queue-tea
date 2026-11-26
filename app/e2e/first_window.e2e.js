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
var test_1 = require("@playwright/test");
var APP = (0, node_path_1.join)(__dirname, '..');
var KEY = 'demo-abc123';
// QUEUE_TEA_SHOTS names a folder for the four skies; QUEUE_TEA_REAL_COPY a
// folder of record copies to look at instead of the fixture.
var SHOTS = process.env.QUEUE_TEA_SHOTS;
var REAL_COPY = process.env.QUEUE_TEA_REAL_COPY;
var home;
var app;
var page;
var task = function (over) {
    return (__assign({ state: 'queued', priority: 'mid', difficulty: { expected: 'medium', actual: null }, messages: [], handoff: null, branch: null, baseBranch: null, startCommit: null, blockedBy: [], blockedReason: null, checkpoint: null, created: '2026-10-20T09:00:00+02:00', started: null, finished: null, minutesByDay: {}, effort: { understandingMessages: 0, improvingMessages: 0, filesRead: 0, filesChanged: 0, linesAdded: 0, linesRemoved: 0, filesTouched: 0 }, files: { read: [], changed: [] }, parentId: null }, over));
};
var record = function (tasks) { return ({
    version: 1,
    project: { name: 'Demo realm', path: '/p/demo' },
    docsLogPath: null,
    playNext: null,
    feature: null,
    tasks: tasks,
    unassignedMinutesByDay: {},
}); };
var FIRST = [
    task({ id: 'now', title: 'Finish the insole bridge', state: 'current', priority: 'urgent', branch: 'task/bridge', started: '2026-10-20T22:17:00+02:00', minutesByDay: { '2026-10-20': 43 }, difficulty: { expected: 'hard', actual: null } }),
    task({ id: 'docs', title: 'Fix the documentation', priority: 'urgent' }),
    task({ id: 'cut', title: 'Fix cut-off text in diagrams', priority: 'high' }),
    task({ id: 'stuck', title: 'Analyse new recordings', blockedReason: 'waiting for the clinic' }),
    task({ id: 'won', title: 'Correct the privacy claims', state: 'done', finished: '2026-10-20T11:00:00+02:00', difficulty: { expected: 'medium', actual: 'medium' } }),
];
var recordFile = function () { return (0, node_path_1.join)(home, '.queue-tea/projects', "".concat(KEY, ".json")); };
// The way the engine writes: a temp file swapped over the record.
var replaceRecord = function (tasks) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, promises_1.writeFile)("".concat(recordFile(), ".tmp"), JSON.stringify(record(tasks)))];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.rename)("".concat(recordFile(), ".tmp"), recordFile())];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
test_1.test.beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    var projects;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-e2e-'))];
            case 1:
                home = _a.sent();
                projects = (0, node_path_1.join)(home, '.queue-tea/projects');
                return [4 /*yield*/, (0, promises_1.mkdir)(projects, { recursive: true })];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, '.queue-tea/sessions'), { recursive: true })];
            case 3:
                _a.sent();
                if (!(REAL_COPY !== undefined)) return [3 /*break*/, 5];
                return [4 /*yield*/, (0, promises_1.cp)(REAL_COPY, projects, { recursive: true })];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5: return [4 /*yield*/, (0, promises_1.writeFile)(recordFile(), JSON.stringify(record(FIRST)))];
            case 6:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(projects, "".concat(KEY, ".json.bak")), '{}')];
            case 7:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(projects, '.brew-repro-tmp-2d9b32.json'), JSON.stringify(record([])))];
            case 8:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(home, '.queue-tea/sessions/s-1.json'), JSON.stringify({ id: 's-1', projectPath: '/p/demo', recordFile: recordFile(), currentTaskId: 'now', isTurnRunning: true, cup: { mood: 'working', line: '' }, allowance: { percent: 62, resetsAt: null }, options: {}, heartbeat: Date.now(), startedAt: Date.now() }))];
            case 9:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(home, 'settings.json'), '{}')];
            case 10:
                _a.sent();
                return [4 /*yield*/, test_1._electron.launch({
                        args: [(0, node_path_1.join)(APP, 'out/main/main.js')],
                        cwd: APP,
                        env: __assign(__assign({}, process.env), { HOME: home, QUEUE_TEA_USER_DATA: (0, node_path_1.join)(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' }),
                    })];
            case 11:
                app = _a.sent();
                return [4 /*yield*/, app.firstWindow()];
            case 12:
                page = _a.sent();
                page.on('pageerror', function (err) {
                    throw err;
                });
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
(0, test_1.test)('the window opens at its size, on its own, with the engine out of reach', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, size, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = test_1.expect;
                return [4 /*yield*/, page.title()];
            case 1:
                _a.apply(void 0, [_e.sent()]).toBe('Queue-tea');
                return [4 /*yield*/, app.evaluate(function (_a) {
                        var BrowserWindow = _a.BrowserWindow;
                        return BrowserWindow.getAllWindows()[0].getSize();
                    })];
            case 2:
                size = _e.sent();
                (0, test_1.expect)(size).toEqual([1280, 800]);
                _b = test_1.expect;
                return [4 /*yield*/, app.evaluate(function (_a) {
                        var BrowserWindow = _a.BrowserWindow;
                        return BrowserWindow.getAllWindows()[0].getMinimumSize();
                    })];
            case 3:
                _b.apply(void 0, [_e.sent()]).toEqual([720, 560]);
                _c = test_1.expect;
                return [4 /*yield*/, page.evaluate(function () { return typeof window.require; })];
            case 4:
                _c.apply(void 0, [_e.sent()]).toBe('undefined');
                _d = test_1.expect;
                return [4 /*yield*/, page.evaluate(function () { return typeof window.process; })];
            case 5:
                _d.apply(void 0, [_e.sent()]).toBe('undefined');
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('the sidebar lists the realm and hides the dot-file', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, test_1.expect)(page.locator('.realm').filter({ hasText: 'Demo realm' })).toBeVisible()];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.realm').filter({ hasText: 'brew-repro' })).toHaveCount(0)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('Home shows the record, the session and the game', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.locator('.realm').filter({ hasText: 'Demo realm' }).click()];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('heading', { name: 'Finish the insole bridge' })).toBeVisible()];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.rm')).toHaveClass(/m-working/)];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText('Claude Code is working on it')).toBeVisible()];
            case 4:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText('Fix the documentation')).toBeVisible()];
            case 5:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText('38% mana')).toBeVisible()];
            case 6:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('Quests shows the board, with the sealed quest apart', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.getByRole('link', { name: 'Quests', exact: true }).click()];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.board-list .qc-title').first()).toHaveText('Fix the documentation')];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.fold .qrow.sealed')).toContainText('waiting for the clinic')];
            case 3:
                _a.sent();
                return [4 /*yield*/, page.getByRole('link', { name: 'Home' }).click()];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('a change on disk reaches the window', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, replaceRecord(__spreadArray(__spreadArray([], FIRST, true), [task({ id: 'new', title: 'Filed from a session', priority: 'urgent', created: '2026-10-19T09:00:00+02:00' })], false))];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.board').getByText('Filed from a session')).toBeVisible({ timeout: 8000 })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('the sky can be fixed, and the panels stay where they are', function () { return __awaiter(void 0, void 0, void 0, function () {
    var panel, before, _i, _a, sky, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                panel = page.locator('.board');
                return [4 /*yield*/, page.getByRole('button', { name: 'Day sky' }).click()];
            case 1:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.rm')).toHaveClass(/t-day/)];
            case 2:
                _c.sent();
                return [4 /*yield*/, panel.boundingBox()];
            case 3:
                before = _c.sent();
                _i = 0, _a = ['Morning', 'Evening', 'Night', 'Day'];
                _c.label = 4;
            case 4:
                if (!(_i < _a.length)) return [3 /*break*/, 9];
                sky = _a[_i];
                return [4 /*yield*/, page.getByRole('button', { name: "".concat(sky, " sky") }).click()];
            case 5:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.rm')).toHaveClass(new RegExp("t-".concat(sky.toLowerCase())))];
            case 6:
                _c.sent();
                _b = test_1.expect;
                return [4 /*yield*/, panel.boundingBox()];
            case 7:
                _b.apply(void 0, [_c.sent()]).toEqual(before);
                _c.label = 8;
            case 8:
                _i++;
                return [3 /*break*/, 4];
            case 9: return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('a sky choice is kept in the settings', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.getByRole('button', { name: 'Night sky' }).click()];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(function () { return __awaiter(void 0, void 0, void 0, function () {
                        var _a, _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    _a = test_1.expect;
                                    _c = (_b = JSON).parse;
                                    return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(home, 'user-data/settings.json'), 'utf8')];
                                case 1:
                                    _a.apply(void 0, [_c.apply(_b, [_d.sent()]).sky]).toBe('night');
                                    return [2 /*return*/];
                            }
                        });
                    }); }).toPass()];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('the four skies, for looking at', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _i, _a, sky;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                test_1.test.skip(SHOTS === undefined, 'only when QUEUE_TEA_SHOTS names a folder');
                _i = 0, _a = ['Morning', 'Day', 'Evening', 'Night'];
                _b.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 6];
                sky = _a[_i];
                return [4 /*yield*/, page.getByRole('button', { name: "".concat(sky, " sky") }).click()];
            case 2:
                _b.sent();
                return [4 /*yield*/, page.waitForTimeout(400)];
            case 3:
                _b.sent();
                return [4 /*yield*/, page.screenshot({ path: (0, node_path_1.join)(SHOTS, "home-".concat(sky.toLowerCase(), ".png")) })];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 1];
            case 6: return [4 /*yield*/, page.getByRole('link', { name: 'Quests', exact: true }).click()];
            case 7:
                _b.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Day sky' }).click()];
            case 8:
                _b.sent();
                return [4 /*yield*/, page.waitForTimeout(400)];
            case 9:
                _b.sent();
                return [4 /*yield*/, page.screenshot({ path: (0, node_path_1.join)(SHOTS, 'quests-day.png') })];
            case 10:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
