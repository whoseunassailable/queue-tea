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
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var test_1 = require("@playwright/test");
var APP = (0, node_path_1.join)(__dirname, '..');
var SHOTS = process.env.QUEUE_TEA_SHOTS;
var DAY_MS = 86400000;
var home;
var app;
var page;
var iso = function (ms) { return new Date(ms).toISOString().slice(0, 10); };
var TODAY = iso(Date.now() - new Date().getTimezoneOffset() * 60000);
var task = function (over) {
    return (__assign({ state: 'queued', priority: 'mid', difficulty: { expected: 'medium', actual: null }, messages: [], handoff: null, branch: null, baseBranch: null, startCommit: null, blockedBy: [], blockedReason: null, checkpoint: null, created: '2026-10-20T09:00:00+02:00', started: null, finished: null, minutesByDay: {}, effort: { understandingMessages: 0, improvingMessages: 0, filesRead: 0, filesChanged: 0, linesAdded: 0, linesRemoved: 0, filesTouched: 0 }, files: { read: [], changed: [] }, parentId: null, description: null, criteria: [], review: null }, over));
};
var record = function (name, tasks, unassigned) {
    if (unassigned === void 0) { unassigned = {}; }
    return ({
        version: 1,
        project: { name: name, path: "/p/".concat(name) },
        docsLogPath: null,
        playNext: null,
        feature: null,
        tasks: tasks,
        unassignedMinutesByDay: unassigned,
        requests: [],
    });
};
var won = function (id, title, day, over) {
    var _a;
    if (over === void 0) { over = {}; }
    return task(__assign({ id: id, title: title, state: 'done', finished: "".concat(day, "T12:00:00+01:00"), difficulty: { expected: 'medium', actual: 'hard' }, minutesByDay: (_a = {}, _a[day] = 45, _a) }, over));
};
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
    var folder;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-pages-'))];
            case 1:
                home = _c.sent();
                folder = (0, node_path_1.join)(home, '.queue-tea/projects');
                return [4 /*yield*/, (0, promises_1.mkdir)(folder, { recursive: true })];
            case 2:
                _c.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, '.queue-tea/sessions'), { recursive: true })];
            case 3:
                _c.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(folder, 'alpha-abc123.json'), JSON.stringify(record('alpha', [
                        won('a1', 'Won this week', TODAY),
                        won('a2', 'Won last week', iso(Date.parse(TODAY) - 7 * DAY_MS), { priority: 'urgent', difficulty: { expected: 'hard', actual: 'hard' } }),
                        task({ id: 'a3', title: 'The boss', state: 'current', priority: 'urgent', minutesByDay: (_a = {}, _a[TODAY] = 20, _a) }),
                    ], (_b = {}, _b[TODAY] = 30, _b))))];
            case 4:
                _c.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(folder, 'beta-def456.json'), JSON.stringify(record('beta', [task({ id: 'b1', title: 'Nothing won here' })])))];
            case 5:
                _c.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(folder, 'broken-fed321.json'), '{ not json')];
            case 6:
                _c.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(home, '.queue-tea/sessions/s-1.json'), JSON.stringify({ id: 's-1', projectPath: '/p/alpha', recordFile: 'x', currentTaskId: 'a3', isTurnRunning: false, cup: { mood: 'idle', line: '' }, allowance: { percent: 62, resetsAt: null }, options: { idleGapMinutes: 15, freshAtTokens: 100000, handoffAtPercent: 90, checkTimeoutSeconds: 10 }, heartbeat: Date.now(), startedAt: Date.now() }))];
            case 7:
                _c.sent();
                return [4 /*yield*/, test_1._electron.launch({
                        args: [(0, node_path_1.join)(APP, 'out/main/main.js')],
                        cwd: APP,
                        env: __assign(__assign({}, process.env), { HOME: home, QUEUE_TEA_USER_DATA: (0, node_path_1.join)(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' }),
                    })];
            case 8:
                app = _c.sent();
                return [4 /*yield*/, app.firstWindow()];
            case 9:
                page = _c.sent();
                return [4 /*yield*/, page.getByRole('button', { name: /^alpha/ }).click()];
            case 10:
                _c.sent();
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
(0, test_1.test)('Chronicle shows the week, and goes back to the last', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.keyboard.press('Meta+5')];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('heading', { name: 'Chronicle' })).toBeVisible()];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.summary')).toContainText('1 victory')];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.summary')).toContainText('+50 XP')];
            case 4:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.tbl')).toContainText('Won this week')];
            case 5:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.tbl')).not.toContainText('Won last week')];
            case 6:
                _a.sent();
                return [4 /*yield*/, page.waitForTimeout(200)];
            case 7:
                _a.sent();
                return [4 /*yield*/, shot('chronicle')];
            case 8:
                _a.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Earlier week' }).click()];
            case 9:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.tbl')).toContainText('Won last week')];
            case 10:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.tbl')).not.toContainText('Won this week')];
            case 11:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('All realms is remembered, and says what it left out', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.getByRole('button', { name: 'All realms' }).click()];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText("1 realm can't be read, so it's left out.")).toBeVisible()];
            case 2:
                _a.sent();
                return [4 /*yield*/, test_1.expect.poll(function () { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _b = (_a = JSON).parse;
                                return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(home, 'user-data/settings.json'), 'utf8')];
                            case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()]).chronicleScope];
                        }
                    }); }); }).toBe('all')];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('a row opens with what it took', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.getByRole('button', { name: 'Open Won last week' }).click()];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('region', { name: 'Won last week' }).getByRole('button', { name: 'File a follow-up…' })).toBeVisible()];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('Mana & time shows the orb, the week and the boss', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.keyboard.press('Meta+6')];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('img', { name: '38% of the 5-hour allowance left' })).toBeVisible()];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('heading', { name: 'The boss quest so far' })).toBeVisible()];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText('Elsewhere, not on a quest')).toBeVisible()];
            case 4:
                _a.sent();
                return [4 /*yield*/, page.waitForTimeout(200)];
            case 5:
                _a.sent();
                return [4 /*yield*/, shot('mana')];
            case 6:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('the Hoard counts every realm that reads', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.getByRole('link', { name: 'Hoard', exact: true }).click()];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText('alpha · 2 victories')).toBeVisible()];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText('beta · 0 victories')).toBeVisible()];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText('0 gold', { exact: true })).toBeVisible()];
            case 4:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText("1 realm can't be read, so it's left out.")).toBeVisible()];
            case 5:
                _a.sent();
                return [4 /*yield*/, page.waitForTimeout(200)];
            case 6:
                _a.sent();
                return [4 /*yield*/, shot('hoard')];
            case 7:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('the Guild Hall shows the four helpers with their logos', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _i, _a, img, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, page.getByRole('link', { name: 'Guild Hall' }).click()];
            case 1:
                _d.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.member')).toHaveCount(4)];
            case 2:
                _d.sent();
                _i = 0;
                return [4 /*yield*/, page.locator('.portrait img').all()];
            case 3:
                _a = _d.sent();
                _d.label = 4;
            case 4:
                if (!(_i < _a.length)) return [3 /*break*/, 7];
                img = _a[_i];
                _b = test_1.expect;
                return [4 /*yield*/, img.evaluate(function (el) { return el.complete && el.naturalWidth > 0; })];
            case 5:
                _b.apply(void 0, [_d.sent()]).toBe(true);
                _d.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 4];
            case 7:
                _c = test_1.expect;
                return [4 /*yield*/, page.locator('.guild-h img').evaluate(function (el) { return el.naturalWidth > 0; })];
            case 8:
                _c.apply(void 0, [_d.sent()]).toBe(true);
                return [4 /*yield*/, shot('guild')];
            case 9:
                _d.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Copy the @-mention for Tea-DD' }).click()];
            case 10:
                _d.sent();
                return [4 /*yield*/, test_1.expect.poll(function () { return app.evaluate(function (_a) {
                        var clipboard = _a.clipboard;
                        return clipboard.readText();
                    }); }).toBe('@queue-tea:tea-dd')];
            case 11:
                _d.sent();
                return [2 /*return*/];
        }
    });
}); });
