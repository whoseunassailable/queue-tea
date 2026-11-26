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
var KEY = 'demo-abc123';
var SHOTS = process.env.QUEUE_TEA_SHOTS;
var home;
var file;
var app;
var page;
var task = function (over) {
    return (__assign({ state: 'queued', priority: 'mid', difficulty: { expected: 'medium', actual: null }, messages: [], handoff: null, branch: null, baseBranch: null, startCommit: null, blockedBy: [], blockedReason: null, checkpoint: null, created: '2026-10-20T09:00:00+02:00', started: null, finished: null, minutesByDay: {}, effort: { understandingMessages: 0, improvingMessages: 0, filesRead: 0, filesChanged: 0, linesAdded: 0, linesRemoved: 0, filesTouched: 0 }, files: { read: [], changed: [] }, parentId: null, description: null, criteria: [], review: null }, over));
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
var stored = function (id) { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
    switch (_c.label) {
        case 0:
            _b = (_a = JSON).parse;
            return [4 /*yield*/, (0, promises_1.readFile)(file, 'utf8')];
        case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()]).tasks.find(function (t) { return t.id === id; })];
    }
}); }); };
var palette = function () { return page.getByRole('dialog', { name: 'Command palette' }); };
var resize = function (width, height) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, app.evaluate(function (_a, size) {
                    var BrowserWindow = _a.BrowserWindow;
                    return BrowserWindow.getAllWindows()[0].setContentSize(size.width, size.height);
                }, { width: width, height: height })];
            case 1:
                _a.sent();
                return [4 /*yield*/, page.waitForFunction(function (w) { return window.innerWidth === w; }, width)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// A menu item, clicked as the mouse would.
var clickMenu = function (top, label) {
    return app.evaluate(function (_a, path) {
        var BrowserWindow = _a.BrowserWindow, Menu = _a.Menu;
        var menu = Menu.getApplicationMenu().items.find(function (item) { return item.label === path.top; }).submenu;
        menu.items.find(function (item) { return item.label === path.label; }).click(undefined, BrowserWindow.getAllWindows()[0], undefined);
    }, { top: top, label: label });
};
test_1.test.beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, seed;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = promises_1.realpath;
                return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-shell-'))];
            case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
            case 2:
                home = _b.sent();
                file = (0, node_path_1.join)(home, '.queue-tea/projects', "".concat(KEY, ".json"));
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, '.queue-tea/projects'), { recursive: true })];
            case 3:
                _b.sent();
                seed = {
                    version: 1,
                    project: { name: 'Demo realm', path: '/p/demo' },
                    docsLogPath: null,
                    playNext: null,
                    feature: null,
                    tasks: [task({ id: 'one', title: 'Mend the gate', priority: 'high' }), task({ id: 'two', title: 'Feed the dragon', priority: 'low' })],
                    unassignedMinutesByDay: {},
                    requests: [],
                };
                return [4 /*yield*/, (0, promises_1.writeFile)(file, JSON.stringify(seed, null, 2))];
            case 4:
                _b.sent();
                return [4 /*yield*/, test_1._electron.launch({
                        args: [(0, node_path_1.join)(APP, 'out/main/main.js')],
                        cwd: APP,
                        env: __assign(__assign({}, process.env), { HOME: home, QUEUE_TEA_USER_DATA: (0, node_path_1.join)(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' }),
                    })];
            case 5:
                app = _b.sent();
                return [4 /*yield*/, app.firstWindow()];
            case 6:
                page = _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('button', { name: /^Start ★/ })).toBeVisible()];
            case 7:
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
(0, test_1.test)('⌘K opens the palette within 100 ms', function () { return __awaiter(void 0, void 0, void 0, function () {
    var opened;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.evaluate(function () {
                    return new Promise(function (done) {
                        var started = performance.now();
                        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, cancelable: true }));
                        var look = function () { return (document.querySelector('[role="combobox"]') === null ? requestAnimationFrame(look) : done(performance.now() - started)); };
                        look();
                    });
                })];
            case 1:
                opened = _a.sent();
                (0, test_1.expect)(opened).toBeLessThan(100);
                return [4 /*yield*/, (0, test_1.expect)(palette()).toBeVisible()];
            case 2:
                _a.sent();
                return [4 /*yield*/, shot('palette')];
            case 3:
                _a.sent();
                return [4 /*yield*/, page.keyboard.press('Escape')];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('typing finds a quest, and Return opens it on the board with no wait', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.keyboard.press('Meta+k')];
            case 1:
                _a.sent();
                return [4 /*yield*/, page.keyboard.type('feed')];
            case 2:
                _a.sent();
                return [4 /*yield*/, page.keyboard.press('Enter')];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(palette()).toBeHidden()];
            case 4:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.qrow.sel .qc-title')).toHaveText('Feed the dragon')];
            case 5:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('a key pressed straight after the palette closes reaches the board', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.keyboard.press('Meta+k')];
            case 1:
                _a.sent();
                return [4 /*yield*/, page.keyboard.type('feed')];
            case 2:
                _a.sent();
                return [4 /*yield*/, page.keyboard.press('Enter')];
            case 3:
                _a.sent();
                return [4 /*yield*/, page.keyboard.press('2')];
            case 4:
                _a.sent();
                return [4 /*yield*/, test_1.expect.poll(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, stored('two')];
                            case 1: return [2 /*return*/, (_a.sent()).priority];
                        }
                    }); }); }).toBe('high')];
            case 5:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('what can\'t run stays dim, and Return leaves it open', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.keyboard.press('Meta+k')];
            case 1:
                _a.sent();
                return [4 /*yield*/, page.keyboard.type('back to the board')];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('option', { name: /No quest is active/ })).toHaveAttribute('aria-disabled', 'true')];
            case 3:
                _a.sent();
                return [4 /*yield*/, page.keyboard.press('Enter')];
            case 4:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(palette()).toBeVisible()];
            case 5:
                _a.sent();
                return [4 /*yield*/, page.keyboard.press('Escape')];
            case 6:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('the menu bar is the real one, and its items reach the window', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, clickMenu('File', 'New quest')];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('dialog')).toBeVisible()];
            case 2:
                _a.sent();
                return [4 /*yield*/, page.keyboard.press('Escape')];
            case 3:
                _a.sent();
                return [4 /*yield*/, clickMenu('View', 'Command palette')];
            case 4:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(palette()).toBeVisible()];
            case 5:
                _a.sent();
                return [4 /*yield*/, page.keyboard.press('Escape')];
            case 6:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('a letter typed in a field stays a letter, though the menu shows it', function () { return __awaiter(void 0, void 0, void 0, function () {
    var title;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.keyboard.press('Meta+n')];
            case 1:
                _a.sent();
                title = page.getByRole('dialog').getByLabel('Title *');
                return [4 /*yield*/, title.pressSequentially('sdbkxy')];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(title).toHaveValue('sdbkxy')];
            case 3:
                _a.sent();
                return [4 /*yield*/, page.keyboard.press('Escape')];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('below 1180 px the detail floats over the list, and closes', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, resize(1000, 700)];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.detail')).toBeHidden()];
            case 2:
                _a.sent();
                return [4 /*yield*/, page.locator('.qrow-open').first().click()];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.quests.floating .detail')).toBeVisible()];
            case 4:
                _a.sent();
                return [4 /*yield*/, page.waitForTimeout(100)];
            case 5:
                _a.sent();
                return [4 /*yield*/, shot('narrow-floating')];
            case 6:
                _a.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Close the quest details' }).click()];
            case 7:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.detail')).toBeHidden()];
            case 8:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('below 900 px the sidebar goes, the tabs are a menu and the detail is a page', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, resize(760, 600)];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('navigation', { name: 'Realms' })).toBeHidden()];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('combobox', { name: 'Go to a section' })).toBeVisible()];
            case 3:
                _a.sent();
                return [4 /*yield*/, page.waitForTimeout(100)];
            case 4:
                _a.sent();
                return [4 /*yield*/, shot('narrow-list')];
            case 5:
                _a.sent();
                return [4 /*yield*/, page.locator('.qrow-open').first().click()];
            case 6:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.detail')).toBeVisible()];
            case 7:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.qlist')).toBeHidden()];
            case 8:
                _a.sent();
                return [4 /*yield*/, shot('narrow-detail')];
            case 9:
                _a.sent();
                return [4 /*yield*/, page.getByRole('button', { name: '‹ Quests' }).click()];
            case 10:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.qlist')).toBeVisible()];
            case 11:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('below 900 px Home stacks, and every section stays reachable', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.getByRole('combobox', { name: 'Go to a section' }).selectOption('/home')];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('heading', { name: 'Quest board' })).toBeVisible()];
            case 2:
                _a.sent();
                return [4 /*yield*/, page.waitForTimeout(100)];
            case 3:
                _a.sent();
                return [4 /*yield*/, shot('narrow-home')];
            case 4:
                _a.sent();
                return [4 /*yield*/, page.getByRole('combobox', { name: 'Go to a section' }).selectOption('/quests')];
            case 5:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.qlist')).toBeVisible()];
            case 6:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('below 900 px the realms come back as an overlay', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.getByRole('button', { name: 'Show the realms' }).click()];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('navigation', { name: 'Realms' })).toBeVisible()];
            case 2:
                _a.sent();
                return [4 /*yield*/, page.waitForTimeout(100)];
            case 3:
                _a.sent();
                return [4 /*yield*/, shot('narrow-realms')];
            case 4:
                _a.sent();
                return [4 /*yield*/, page.getByRole('button', { name: /^Demo realm/ }).click()];
            case 5:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('navigation', { name: 'Realms' })).toBeHidden()];
            case 6:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('the window can\'t go below 720 × 560', function () { return __awaiter(void 0, void 0, void 0, function () {
    var size;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, app.evaluate(function (_a) {
                    var BrowserWindow = _a.BrowserWindow;
                    var window = BrowserWindow.getAllWindows()[0];
                    window.setContentSize(300, 200);
                    return window.getContentSize();
                })];
            case 1:
                size = _a.sent();
                (0, test_1.expect)(size[0]).toBeGreaterThanOrEqual(720);
                (0, test_1.expect)(size[1]).toBeGreaterThanOrEqual(530);
                return [2 /*return*/];
        }
    });
}); });
