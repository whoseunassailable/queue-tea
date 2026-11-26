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
var record_source_1 = require("../../hooks/shared/records/data/datasources/record_source");
var fixtures_1 = require("../main/features/tasks/api/fixtures");
var fake_gh_1 = require("./fake_gh");
var APP = (0, node_path_1.join)(__dirname, '..');
var SHOTS = process.env.QUEUE_TEA_SHOTS;
var FIRST = 'first-account';
var SECOND = 'second-account';
var home;
var folder;
var mine;
var secret;
var app;
var page;
var gh;
var shot = function (name) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (SHOTS === undefined)
                    return [2 /*return*/];
                // Bars ease into place, so a picture waits for them.
                return [4 /*yield*/, page.waitForTimeout(1300)];
            case 1:
                // Bars ease into place, so a picture waits for them.
                _a.sent();
                return [4 /*yield*/, page.screenshot({ path: (0, node_path_1.join)(SHOTS, "".concat(name, ".png")) })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var fileOf = function (path) { return (0, node_path_1.join)(folder, "".concat((0, record_source_1.projectKey)(path), ".json")); };
var saved = function () { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
    switch (_c.label) {
        case 0:
            _b = (_a = JSON).parse;
            return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(home, 'user-data/settings.json'), 'utf8')];
        case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
    }
}); }); };
var realm = function (name) { return page.getByRole('navigation', { name: 'Realms' }).getByRole('button', { name: new RegExp("^".concat(name)) }); };
// Yesterday on this computer's clock; toISOString alone is UTC, which is "today" here in the evening.
var dayBefore = function () { return new Date(Date.now() - 86400000 - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10); };
var won = function (id, actual) {
    var _a;
    return (0, fixtures_1.makeTask)({ id: id, title: id, state: 'done', finished: "".concat(dayBefore(), "T12:00:00+00:00"), difficulty: { expected: 'medium', actual: actual }, minutesByDay: (_a = {}, _a[dayBefore()] = 45, _a) });
};
// Everything that holds a project's data, to show what didn't land there.
var records = function () { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
    switch (_c.label) {
        case 0:
            _b = (_a = Promise).all;
            return [4 /*yield*/, (0, promises_1.readdir)(folder)];
        case 1: return [4 /*yield*/, _b.apply(_a, [(_c.sent()).map(function (name) { return (0, promises_1.readFile)((0, node_path_1.join)(folder, name), 'utf8'); })])];
        case 2: return [2 /*return*/, (_c.sent()).join('\n')];
    }
}); }); };
test_1.test.beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, wins, quest;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = promises_1.realpath;
                return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-feedback-'))];
            case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
            case 2:
                home = _b.sent();
                folder = (0, node_path_1.join)(home, '.queue-tea/projects');
                mine = (0, node_path_1.join)(home, 'mine');
                secret = (0, node_path_1.join)(home, 'private diary');
                return [4 /*yield*/, (0, promises_1.mkdir)(folder, { recursive: true })];
            case 3:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)(mine)];
            case 4:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)(secret)];
            case 5:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, 'nothing yet'))];
            case 6:
                _b.sent();
                return [4 /*yield*/, (0, fake_gh_1.plantGh)(home, [{ login: FIRST, active: true }])
                    // 285 XP: level 2, 15 short of level 3, with the last win yesterday.
                ];
            case 7:
                gh = _b.sent();
                wins = [won('w1', 'hard'), won('w2', 'hard'), won('w3', 'hard'), won('w4', 'hard'), won('w5', 'hard'), won('w6', 'medium'), won('w7', 'light')];
                quest = (0, fixtures_1.makeTask)({ id: 'next', title: 'Tidy the docs', priority: 'urgent' });
                return [4 /*yield*/, (0, promises_1.writeFile)(fileOf(mine), JSON.stringify(__assign(__assign({}, (0, record_source_1.emptyRecord)('mine', mine)), { tasks: __spreadArray(__spreadArray([], wins, true), [quest], false) })))];
            case 8:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)(fileOf(secret), JSON.stringify(__assign(__assign({}, (0, record_source_1.emptyRecord)('private diary', secret)), { docsLogPath: 'docs/task_log.md', tasks: [(0, fixtures_1.makeTask)({ id: 's', title: 'Something private' })] })))];
            case 9:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)(fileOf((0, node_path_1.join)(home, 'nothing yet')), JSON.stringify((0, record_source_1.emptyRecord)('nothing yet', (0, node_path_1.join)(home, 'nothing yet'))))];
            case 10:
                _b.sent();
                return [4 /*yield*/, test_1._electron.launch({
                        args: [(0, node_path_1.join)(APP, 'out/main/main.js')],
                        cwd: APP,
                        env: __assign(__assign({}, process.env), { HOME: home, QUEUE_TEA_USER_DATA: (0, node_path_1.join)(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' }),
                    })];
            case 11:
                app = _b.sent();
                return [4 /*yield*/, app.firstWindow()];
            case 12:
                page = _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(realm('mine')).toBeVisible()];
            case 13:
                _b.sent();
                return [4 /*yield*/, realm('mine').click()];
            case 14:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.hud-chip.lvl')).toBeVisible()
                    // The browser and the clipboard are the Mac's own, so these stand in for them.
                ];
            case 15:
                _b.sent();
                // The browser and the clipboard are the Mac's own, so these stand in for them.
                return [4 /*yield*/, app.evaluate(function (_a) {
                        var clipboard = _a.clipboard, shell = _a.shell;
                        var seen = { opened: [], copied: [] };
                        globalThis.queueTeaSeen = seen;
                        shell.openExternal = (function (url) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, void seen.opened.push(url)];
                        }); }); });
                        clipboard.writeText = (function (text) { return void seen.copied.push(text); });
                    })];
            case 16:
                // The browser and the clipboard are the Mac's own, so these stand in for them.
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
(0, test_1.test)('the level bar says what the next quest does for you', function () { return __awaiter(void 0, void 0, void 0, function () {
    var level;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                level = page.locator('.hud-chip.lvl');
                return [4 /*yield*/, (0, test_1.expect)(level).toContainText('15 XP to Lv 3')];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(level).toContainText('Tidy the docs takes you to level 3')];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(level).toHaveClass(/close/)];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(level.locator('.gain')).toBeVisible()];
            case 4:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.hud-chip.risk')).toContainText('1 day')];
            case 5:
                _a.sent();
                return [4 /*yield*/, shot('hud-close')];
            case 6:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('mana stays out of the way until it is known', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, test_1.expect)(page.locator('.hud')).not.toContainText(/mana/i)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('the HUD chips go where they say', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.locator('.hud').getByRole('link', { name: /Open the chronicle/ }).click()];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('heading', { name: 'Chronicle' })).toBeVisible()];
            case 2:
                _a.sent();
                return [4 /*yield*/, page.locator('.hud').getByRole('link', { name: /gold\. Open the hoard/ }).click()];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('heading', { name: 'Your hoard' })).toBeVisible()];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('Settings shows the realm you are in and no other', function () { return __awaiter(void 0, void 0, void 0, function () {
    var text;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.getByRole('link', { name: 'Settings' }).click()];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('heading', { name: 'This realm · mine' })).toBeVisible()];
            case 2:
                _a.sent();
                return [4 /*yield*/, page.getByRole('main').innerText()];
            case 3:
                text = _a.sent();
                (0, test_1.expect)(text).not.toContain('private diary');
                (0, test_1.expect)(text).not.toContain((0, record_source_1.projectKey)(secret));
                return [4 /*yield*/, shot('settings-realm')];
            case 4:
                _a.sent();
                return [4 /*yield*/, realm('private diary').click()];
            case 5:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('heading', { name: 'This realm · private diary' })).toBeVisible()];
            case 6:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('main')).not.toContainText((0, record_source_1.projectKey)(mine))];
            case 7:
                _a.sent();
                return [4 /*yield*/, realm('mine').click()];
            case 8:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('a task log that would leave the realm is refused, and writes nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
    var dialog, field, _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, (0, test_1.expect)(page.getByRole('heading', { name: 'This realm · mine' })).toBeVisible()];
            case 1:
                _e.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Set now…' }).click()];
            case 2:
                _e.sent();
                dialog = page.getByRole('dialog');
                field = dialog.getByLabel('Task log path *');
                return [4 /*yield*/, field.fill('../private diary/docs/task_log.md')];
            case 3:
                _e.sent();
                return [4 /*yield*/, dialog.getByRole('button', { name: 'Save' }).click()];
            case 4:
                _e.sent();
                return [4 /*yield*/, (0, test_1.expect)(dialog.getByText("The task log has to stay inside this realm's folder.")).toBeVisible()];
            case 5:
                _e.sent();
                _a = test_1.expect;
                _c = (_b = JSON).parse;
                return [4 /*yield*/, (0, promises_1.readFile)(fileOf(mine), 'utf8')];
            case 6:
                _a.apply(void 0, [_c.apply(_b, [_e.sent()]).docsLogPath]).toBeNull();
                return [4 /*yield*/, field.fill((0, node_path_1.join)(secret, 'log.md'))];
            case 7:
                _e.sent();
                return [4 /*yield*/, field.blur()];
            case 8:
                _e.sent();
                return [4 /*yield*/, (0, test_1.expect)(dialog.getByText("The task log has to stay inside this realm's folder.")).toBeVisible()];
            case 9:
                _e.sent();
                return [4 /*yield*/, dialog.getByRole('button', { name: 'Cancel' }).click()];
            case 10:
                _e.sent();
                _d = test_1.expect;
                return [4 /*yield*/, (0, promises_1.readdir)(secret)];
            case 11:
                _d.apply(void 0, [_e.sent()]).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('an empty board says how to fill it', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.getByRole('link', { name: 'Home' }).click()];
            case 1:
                _a.sent();
                return [4 /*yield*/, realm('nothing yet').click()];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText('Add one here, or file it in Claude Code with /steep.')).toBeVisible()];
            case 3:
                _a.sent();
                return [4 /*yield*/, shot('empty-board')];
            case 4:
                _a.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'File a quest…' }).click()];
            case 5:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('dialog', { name: /New quest/ })).toBeVisible()];
            case 6:
                _a.sent();
                return [4 /*yield*/, page.keyboard.press('Escape')];
            case 7:
                _a.sent();
                return [4 /*yield*/, realm('mine').click()];
            case 8:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('adding an account runs gh, and the terminal keeps its own', function () { return __awaiter(void 0, void 0, void 0, function () {
    var dialog, seen, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, page.getByRole('button', { name: 'Connect GitHub' }).click()];
            case 1:
                _b.sent();
                dialog = page.getByRole('dialog');
                return [4 /*yield*/, (0, test_1.expect)(dialog.getByRole('radio', { name: new RegExp(FIRST) })).toBeChecked()];
            case 2:
                _b.sent();
                return [4 /*yield*/, dialog.getByRole('button', { name: 'Add account…' }).click()];
            case 3:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(dialog.getByText('100F-29B8')).toBeVisible()];
            case 4:
                _b.sent();
                return [4 /*yield*/, shot('github-code')];
            case 5:
                _b.sent();
                return [4 /*yield*/, dialog.getByRole('button', { name: 'Copy the code and open GitHub' }).click()];
            case 6:
                _b.sent();
                seen = function () { return app.evaluate(function () { return globalThis.queueTeaSeen; }); };
                return [4 /*yield*/, test_1.expect.poll(seen).toEqual({ opened: ['https://github.com/login/device'], copied: ['100F-29B8'] })];
            case 7:
                _b.sent();
                return [4 /*yield*/, gh.finishSignIn([{ login: FIRST, active: false }, { login: SECOND, active: true }])];
            case 8:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(dialog.getByRole('radio', { name: new RegExp(SECOND) })).toBeChecked()];
            case 9:
                _b.sent();
                _a = test_1.expect;
                return [4 /*yield*/, (0, promises_1.readFile)(gh.place('calls'), 'utf8')];
            case 10:
                _a.apply(void 0, [_b.sent()]).toContain("auth switch --hostname github.com --user ".concat(FIRST));
                return [4 /*yield*/, shot('github-picked')];
            case 11:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('a realm remembers its account in the settings, and in no record', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, page.getByRole('dialog').getByRole('button', { name: 'Save' }).click()];
            case 1:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.hud').getByRole('button', { name: /GitHub account: second-account/ })).toContainText("@".concat(SECOND))];
            case 2:
                _c.sent();
                return [4 /*yield*/, test_1.expect.poll(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, saved()];
                            case 1: return [2 /*return*/, (_a.sent()).realmAccounts];
                        }
                    }); }); }).toEqual((_b = {}, _b[(0, record_source_1.projectKey)(mine)] = SECOND, _b))];
            case 3:
                _c.sent();
                _a = test_1.expect;
                return [4 /*yield*/, records()];
            case 4:
                _a.apply(void 0, [_c.sent()]).not.toContain(SECOND);
                return [4 /*yield*/, realm('private diary').click()];
            case 5:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.hud').getByRole('button', { name: 'Connect GitHub' })).toBeVisible()];
            case 6:
                _c.sent();
                return [4 /*yield*/, realm('mine').click()];
            case 7:
                _c.sent();
                return [4 /*yield*/, shot('hud-connected')];
            case 8:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('cancelling a sign-in stops gh', function () { return __awaiter(void 0, void 0, void 0, function () {
    var dialog, pid, _a, isRunning;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, page.locator('.hud').getByRole('button', { name: /GitHub account/ }).click()];
            case 1:
                _b.sent();
                dialog = page.getByRole('dialog');
                return [4 /*yield*/, dialog.getByRole('button', { name: 'Add account…' }).click()];
            case 2:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(dialog.getByText('100F-29B8')).toBeVisible()];
            case 3:
                _b.sent();
                _a = Number;
                return [4 /*yield*/, (0, promises_1.readFile)(gh.place('pid'), 'utf8')];
            case 4:
                pid = _a.apply(void 0, [(_b.sent()).trim()]);
                isRunning = function () {
                    try {
                        process.kill(pid, 0);
                        return true;
                    }
                    catch (_a) {
                        return false;
                    }
                };
                (0, test_1.expect)(isRunning()).toBe(true);
                return [4 /*yield*/, dialog.getByRole('button', { name: 'Cancel' }).click()];
            case 5:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(dialog).toBeHidden()];
            case 6:
                _b.sent();
                return [4 /*yield*/, test_1.expect.poll(isRunning).toBe(false)];
            case 7:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('a new realm asks which account it belongs to', function () { return __awaiter(void 0, void 0, void 0, function () {
    var fresh, before, asked, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                fresh = (0, node_path_1.join)(home, 'fresh realm');
                return [4 /*yield*/, (0, promises_1.mkdir)(fresh)];
            case 1:
                _b.sent();
                return [4 /*yield*/, app.evaluate(function (_a, path) {
                        var dialog = _a.dialog;
                        dialog.showOpenDialog = (function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ canceled: false, filePaths: [path] })];
                        }); }); });
                    }, fresh)];
            case 2:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.readdir)(folder)];
            case 3:
                before = _b.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Open a folder as a realm' }).click()];
            case 4:
                _b.sent();
                asked = page.getByRole('dialog');
                return [4 /*yield*/, (0, test_1.expect)(asked.getByRole('radio', { name: new RegExp(SECOND) })).toBeVisible()];
            case 5:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(asked.getByRole('radio', { name: 'No GitHub account' })).toBeVisible()];
            case 6:
                _b.sent();
                return [4 /*yield*/, shot('new-realm')];
            case 7:
                _b.sent();
                return [4 /*yield*/, asked.getByRole('button', { name: 'Add realm' }).click()];
            case 8:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(asked.getByText('Pick a GitHub account, or No GitHub account.')).toBeVisible()];
            case 9:
                _b.sent();
                _a = test_1.expect;
                return [4 /*yield*/, (0, promises_1.readdir)(folder)];
            case 10:
                _a.apply(void 0, [_b.sent()]).toEqual(before);
                return [4 /*yield*/, asked.getByRole('radio', { name: new RegExp(FIRST) }).check()];
            case 11:
                _b.sent();
                return [4 /*yield*/, asked.getByRole('button', { name: 'Add realm' }).click()];
            case 12:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(asked).toBeHidden()];
            case 13:
                _b.sent();
                return [4 /*yield*/, test_1.expect.poll(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, saved()];
                            case 1: return [2 /*return*/, (_a.sent()).realmAccounts[(0, record_source_1.projectKey)(fresh)]];
                        }
                    }); }); }).toBe(FIRST)];
            case 14:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.hud')).toContainText("@".concat(FIRST))];
            case 15:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('Settings lists the accounts and this realm\'s own', function () { return __awaiter(void 0, void 0, void 0, function () {
    var accounts;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.getByRole('link', { name: 'Settings' }).click()];
            case 1:
                _a.sent();
                accounts = page.getByRole('region', { name: 'GitHub accounts' });
                return [4 /*yield*/, (0, test_1.expect)(accounts.getByText(FIRST, { exact: true })).toBeVisible()];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(accounts.getByText(SECOND, { exact: true })).toBeVisible()];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('button', { name: "Change fresh realm's GitHub account" })).toBeVisible()];
            case 4:
                _a.sent();
                return [4 /*yield*/, shot('settings-github')];
            case 5:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('the Library keeps your place, apart from every realm', function () { return __awaiter(void 0, void 0, void 0, function () {
    var sheet, field, shelf, _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, page.getByRole('link', { name: 'Library' }).click()];
            case 1:
                _d.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText("No books yet. Add what you're reading, and it keeps your place.")).toBeVisible()];
            case 2:
                _d.sent();
                return [4 /*yield*/, shot('library-empty')];
            case 3:
                _d.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Add a book…' }).click()];
            case 4:
                _d.sent();
                sheet = page.getByRole('dialog');
                return [4 /*yield*/, sheet.getByRole('button', { name: 'Add book' }).click()];
            case 5:
                _d.sent();
                return [4 /*yield*/, (0, test_1.expect)(sheet.getByText('Title is required.')).toBeVisible()];
            case 6:
                _d.sent();
                return [4 /*yield*/, (0, test_1.expect)(sheet.getByText('Total pages is required.')).toBeVisible()];
            case 7:
                _d.sent();
                return [4 /*yield*/, sheet.getByLabel('Title *').fill('Dune')];
            case 8:
                _d.sent();
                return [4 /*yield*/, sheet.getByLabel('Author').fill('Frank Herbert')];
            case 9:
                _d.sent();
                return [4 /*yield*/, sheet.getByLabel('Total pages *').fill('412')];
            case 10:
                _d.sent();
                return [4 /*yield*/, sheet.getByRole('button', { name: 'Add book' }).click()];
            case 11:
                _d.sent();
                return [4 /*yield*/, (0, test_1.expect)(sheet).toBeHidden()];
            case 12:
                _d.sent();
                field = page.getByLabel("Page you've reached in Dune");
                return [4 /*yield*/, field.fill('500')];
            case 13:
                _d.sent();
                return [4 /*yield*/, field.blur()];
            case 14:
                _d.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText('Enter a page from 0 to 412.')).toBeVisible()];
            case 15:
                _d.sent();
                return [4 /*yield*/, field.fill('103')];
            case 16:
                _d.sent();
                return [4 /*yield*/, field.blur()];
            case 17:
                _d.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText('25% · 309 pages left')).toBeVisible()];
            case 18:
                _d.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText('103 pages today · 103 this week')).toBeVisible()];
            case 19:
                _d.sent();
                return [4 /*yield*/, shot('library-reading')];
            case 20:
                _d.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Mark Dune finished' }).click()];
            case 21:
                _d.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText(/Finished .* · 412 pages/)).toBeVisible()];
            case 22:
                _d.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText('1 book finished · 412 pages read')).toBeVisible()];
            case 23:
                _d.sent();
                return [4 /*yield*/, shot('library-finished')];
            case 24:
                _d.sent();
                _b = (_a = JSON).parse;
                return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(home, '.queue-tea/library.json'), 'utf8')];
            case 25:
                shelf = _b.apply(_a, [_d.sent()]);
                (0, test_1.expect)(shelf.books[0]).toMatchObject({ title: 'Dune', page: 412 });
                _c = test_1.expect;
                return [4 /*yield*/, records()];
            case 26:
                _c.apply(void 0, [_d.sent()]).not.toContain('Dune');
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('the Library comes back as it was left', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, page.getByRole('button', { name: 'Remove Dune' }).click()];
            case 1:
                _d.sent();
                return [4 /*yield*/, page.getByRole('dialog').getByRole('button', { name: 'Remove book' }).click()];
            case 2:
                _d.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText("No books yet. Add what you're reading, and it keeps your place.")).toBeVisible()];
            case 3:
                _d.sent();
                _a = test_1.expect;
                _c = (_b = JSON).parse;
                return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(home, '.queue-tea/library.json'), 'utf8')];
            case 4:
                _a.apply(void 0, [_c.apply(_b, [_d.sent()]).books]).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
