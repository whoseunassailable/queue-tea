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
var SEED = {
    version: 1,
    project: { name: 'Demo realm', path: '/p/demo' },
    docsLogPath: null,
    playNext: null,
    feature: null,
    tasks: [
        task({ id: 'one', title: 'First quest', priority: 'high' }),
        task({ id: 'two', title: 'Second quest', priority: 'low' }),
        task({ id: 'saga', title: 'The saga', priority: 'low', created: '2026-10-21T09:00:00+02:00' }),
        task({ id: 'chapter', title: 'A chapter', priority: 'low', parentId: 'saga', created: '2026-10-22T09:00:00+02:00' }),
    ],
    unassignedMinutesByDay: {},
    requests: [],
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
var titled = function (title) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, onDisk()];
        case 1: return [2 /*return*/, (_a.sent()).tasks.find(function (t) { return t.title === title; })
            // The exact title, and no wait after it: a key pressed straight away has to
            // act on this row and not the one before it.
        ];
    }
}); }); };
// The exact title, and no wait after it: a key pressed straight away has to
// act on this row and not the one before it.
var pickRow = function (title) { return page.locator('.qrow-open').filter({ has: page.getByText(title, { exact: true }) }).click(); };
var dialog = function () { return page.getByRole('dialog'); };
var toast = function (text) { return page.locator('.toast-item').filter({ hasText: text }); };
test_1.test.beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-edits-'))];
            case 1:
                home = _a.sent();
                file = (0, node_path_1.join)(home, '.queue-tea/projects', "".concat(KEY, ".json"));
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, '.queue-tea/projects'), { recursive: true })];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)(file, JSON.stringify(SEED, null, 2))];
            case 3:
                _a.sent();
                return [4 /*yield*/, test_1._electron.launch({
                        args: [(0, node_path_1.join)(APP, 'out/main/main.js')],
                        cwd: APP,
                        env: __assign(__assign({}, process.env), { HOME: home, QUEUE_TEA_USER_DATA: (0, node_path_1.join)(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' }),
                    })];
            case 4:
                app = _a.sent();
                return [4 /*yield*/, app.firstWindow()];
            case 5:
                page = _a.sent();
                return [4 /*yield*/, page.getByRole('link', { name: 'Quests', exact: true }).click()];
            case 6:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.board-list .qc-title').first()).toHaveText('First quest')];
            case 7:
                _a.sent();
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
(0, test_1.test)('a priority shows at once, and reaches the record within 300 ms', function () { return __awaiter(void 0, void 0, void 0, function () {
    var row, started;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                row = page.locator('.qrow').filter({ hasText: 'Second quest' });
                return [4 /*yield*/, row.getByRole('button', { name: /Priority of Second quest/ }).click()];
            case 1:
                _a.sent();
                started = Date.now();
                return [4 /*yield*/, page.getByRole('menuitemradio', { name: /Urgent/ }).click()];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(row.getByRole('button', { name: /Priority of Second quest/ })).toContainText('Urgent')];
            case 3:
                _a.sent();
                return [4 /*yield*/, test_1.expect.poll(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, stored('two')];
                            case 1: return [2 /*return*/, (_a.sent()).priority];
                        }
                    }); }); }, { intervals: [5], timeout: 2000 }).toBe('urgent')];
            case 4:
                _a.sent();
                (0, test_1.expect)(Date.now() - started).toBeLessThan(300);
                // Main's answer brings the board's real order.
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.board-list .qc-title').first()).toHaveText('Second quest')];
            case 5:
                // Main's answer brings the board's real order.
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(toast('Priority: Low → Urgent')).toBeVisible()];
            case 6:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('⌘Z puts it back', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.keyboard.press('Meta+z')];
            case 1:
                _a.sent();
                return [4 /*yield*/, test_1.expect.poll(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, stored('two')];
                            case 1: return [2 /*return*/, (_a.sent()).priority];
                        }
                    }); }); }).toBe('low')];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.board-list .qc-title').first()).toHaveText('First quest')];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('the number keys set the priority of the quest in the detail pane', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, pickRow('Second quest')];
            case 1:
                _a.sent();
                return [4 /*yield*/, page.keyboard.press('2')];
            case 2:
                _a.sent();
                return [4 /*yield*/, test_1.expect.poll(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, stored('two')];
                            case 1: return [2 /*return*/, (_a.sent()).priority];
                        }
                    }); }); }).toBe('high')];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('New quest checks its fields, files the quest, and never starts it', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, page.getByRole('button', { name: 'New quest', exact: true }).first().click()];
            case 1:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(dialog()).toBeVisible()];
            case 2:
                _c.sent();
                return [4 /*yield*/, dialog().getByRole('button', { name: 'Add to the board' }).click()];
            case 3:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(dialog().getByText('Title is required.')).toBeVisible()];
            case 4:
                _c.sent();
                _a = test_1.expect;
                return [4 /*yield*/, titled('Filed from the app')];
            case 5:
                _a.apply(void 0, [_c.sent()]).toBeUndefined();
                return [4 /*yield*/, dialog().getByLabel('Title *').fill('Filed from the app')];
            case 6:
                _c.sent();
                return [4 /*yield*/, dialog().getByRole('radio', { name: 'Urgent' }).check()];
            case 7:
                _c.sent();
                return [4 /*yield*/, dialog().getByRole('button', { name: 'Add to the board' }).click()];
            case 8:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(dialog()).toBeHidden()];
            case 9:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.qrow').filter({ hasText: 'Filed from the app' })).toBeVisible()];
            case 10:
                _c.sent();
                _b = test_1.expect;
                return [4 /*yield*/, titled('Filed from the app')];
            case 11:
                _b.apply(void 0, [_c.sent()]).toMatchObject({ state: 'queued', priority: 'urgent', started: null, branch: null, parentId: null });
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('a chapter goes in under its saga, inline', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, page.getByRole('button', { name: '+ Add a chapter' }).click()];
            case 1:
                _c.sent();
                return [4 /*yield*/, page.getByLabel('Part of The saga').fill('Filed under the saga')];
            case 2:
                _c.sent();
                return [4 /*yield*/, page.keyboard.press('Enter')];
            case 3:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.qrow.child').filter({ hasText: 'Filed under the saga' })).toBeVisible()];
            case 4:
                _c.sent();
                _a = test_1.expect;
                return [4 /*yield*/, titled('Filed under the saga')];
            case 5:
                _a.apply(void 0, [(_b = (_c.sent())) === null || _b === void 0 ? void 0 : _b.parentId]).toBe('saga');
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('sagas fold, and the fold stays', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.getByRole('button', { name: 'Fold The saga' }).click()];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.qrow').filter({ hasText: 'A chapter' })).toHaveCount(0)];
            case 2:
                _a.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Unfold The saga' }).click()];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.qrow').filter({ hasText: 'A chapter' })).toBeVisible()];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('seal with a reason, then unseal', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, pickRow('First quest')];
            case 1:
                _b.sent();
                return [4 /*yield*/, page.keyboard.press('k')];
            case 2:
                _b.sent();
                return [4 /*yield*/, dialog().getByLabel('Or a reason').fill('waiting for the clinic')];
            case 3:
                _b.sent();
                return [4 /*yield*/, dialog().getByRole('button', { name: 'Seal', exact: true }).click()];
            case 4:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(dialog()).toBeHidden()];
            case 5:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.fold .qrow.sealed')).toContainText('waiting for the clinic')];
            case 6:
                _b.sent();
                _a = test_1.expect;
                return [4 /*yield*/, stored('one')];
            case 7:
                _a.apply(void 0, [(_b.sent()).blockedReason]).toBe('waiting for the clinic');
                return [4 /*yield*/, page.locator('.fold .qrow.sealed .qrow-open').click()];
            case 8:
                _b.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Unseal' }).click()];
            case 9:
                _b.sent();
                return [4 /*yield*/, test_1.expect.poll(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, stored('one')];
                            case 1: return [2 /*return*/, (_a.sent()).blockedReason];
                        }
                    }); }); }).toBe(null)];
            case 10:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('Part of asks first, then moves the quest', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, pickRow('Second quest')];
            case 1:
                _a.sent();
                return [4 /*yield*/, page.keyboard.press('p')];
            case 2:
                _a.sent();
                return [4 /*yield*/, dialog().getByRole('radio', { name: /The saga/ }).check()];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(dialog().getByText('Its priority, branch and time stay as they are.')).toBeVisible()];
            case 4:
                _a.sent();
                return [4 /*yield*/, dialog().getByRole('button', { name: 'Move' }).click()];
            case 5:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(dialog()).toBeHidden()];
            case 6:
                _a.sent();
                return [4 /*yield*/, test_1.expect.poll(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, stored('two')];
                            case 1: return [2 /*return*/, (_a.sent()).parentId];
                        }
                    }); }); }).toBe('saga')];
            case 7:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.qrow.child').filter({ hasText: 'Second quest' })).toBeVisible()];
            case 8:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('a plain quest is removed at once, and Undo brings it back', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    var _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, pickRow('Filed under the saga')];
            case 1:
                _e.sent();
                return [4 /*yield*/, page.keyboard.press('x')];
            case 2:
                _e.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.qrow').filter({ hasText: 'Filed under the saga' })).toHaveCount(0)];
            case 3:
                _e.sent();
                _a = test_1.expect;
                return [4 /*yield*/, titled('Filed under the saga')];
            case 4:
                _a.apply(void 0, [(_c = (_e.sent())) === null || _c === void 0 ? void 0 : _c.state]).toBe('removed');
                return [4 /*yield*/, toast(/Removed/).getByRole('button', { name: 'Undo' }).click()];
            case 5:
                _e.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.qrow').filter({ hasText: 'Filed under the saga' })).toBeVisible()];
            case 6:
                _e.sent();
                _b = test_1.expect;
                return [4 /*yield*/, titled('Filed under the saga')];
            case 7:
                _b.apply(void 0, [(_d = (_e.sent())) === null || _d === void 0 ? void 0 : _d.state]).toBe('queued');
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('a saga asks before it goes', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, pickRow('The saga')];
            case 1:
                _b.sent();
                return [4 /*yield*/, page.keyboard.press('x')];
            case 2:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(dialog().getByText(/stay on the board/)).toBeVisible()];
            case 3:
                _b.sent();
                _a = test_1.expect;
                return [4 /*yield*/, stored('saga')];
            case 4:
                _a.apply(void 0, [(_b.sent()).state]).toBe('queued');
                return [4 /*yield*/, page.keyboard.press('Escape')];
            case 5:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(dialog()).toBeHidden()];
            case 6:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('letters type into the title and do nothing else', function () { return __awaiter(void 0, void 0, void 0, function () {
    var box, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, pickRow('First quest')];
            case 1:
                _b.sent();
                return [4 /*yield*/, page.locator('.detail .title-btn').click()];
            case 2:
                _b.sent();
                box = page.locator('.detail').getByLabel('Title *');
                return [4 /*yield*/, box.fill('')];
            case 3:
                _b.sent();
                return [4 /*yield*/, box.pressSequentially('kfux12')];
            case 4:
                _b.sent();
                return [4 /*yield*/, box.press('Enter')];
            case 5:
                _b.sent();
                return [4 /*yield*/, test_1.expect.poll(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, stored('one')];
                            case 1: return [2 /*return*/, (_a.sent()).title];
                        }
                    }); }); }).toBe('kfux12')];
            case 6:
                _b.sent();
                _a = test_1.expect;
                return [4 /*yield*/, stored('one')];
            case 7:
                _a.apply(void 0, [_b.sent()]).toMatchObject({ priority: 'high', blockedReason: null });
                return [4 /*yield*/, (0, test_1.expect)(dialog()).toHaveCount(0)];
            case 8:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('the detail pane keeps a description and criteria', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, page.getByRole('textbox', { name: 'Description' }).fill('Why it matters')];
            case 1:
                _b.sent();
                return [4 /*yield*/, page.getByRole('textbox', { name: 'Add a criterion' }).fill('It passes')];
            case 2:
                _b.sent();
                return [4 /*yield*/, page.keyboard.press('Enter')];
            case 3:
                _b.sent();
                return [4 /*yield*/, test_1.expect.poll(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, stored('one')];
                            case 1: return [2 /*return*/, (_a.sent()).criteria];
                        }
                    }); }); }).toEqual(['It passes'])];
            case 4:
                _b.sent();
                _a = test_1.expect;
                return [4 /*yield*/, stored('one')];
            case 5:
                _a.apply(void 0, [(_b.sent()).description]).toBe('Why it matters');
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('the plus inside a newly filed quest saves its first child under that quest', function () { return __awaiter(void 0, void 0, void 0, function () {
    var parent, row, add, child, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, titled('Filed from the app')];
            case 1:
                parent = (_b.sent());
                row = page.locator('.qrow').filter({ has: page.getByText(parent.title, { exact: true }) });
                add = row.getByRole('button', { name: "Add a child task to ".concat(parent.title), exact: true });
                return [4 /*yield*/, (0, test_1.expect)(add).toHaveText('+')];
            case 2:
                _b.sent();
                return [4 /*yield*/, add.click()];
            case 3:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(dialog().getByRole('radio', { name: parent.title, exact: true })).toBeChecked()];
            case 4:
                _b.sent();
                return [4 /*yield*/, dialog().getByLabel('Title *').fill('First child from the card')];
            case 5:
                _b.sent();
                return [4 /*yield*/, dialog().getByRole('button', { name: 'Add to the board' }).click()];
            case 6:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(dialog()).toBeHidden()];
            case 7:
                _b.sent();
                child = page.locator('.qrow.child').filter({ hasText: 'First child from the card' });
                return [4 /*yield*/, (0, test_1.expect)(child).toBeVisible()];
            case 8:
                _b.sent();
                _a = test_1.expect;
                return [4 /*yield*/, titled('First child from the card')];
            case 9:
                _a.apply(void 0, [_b.sent()]).toMatchObject({ parentId: parent.id, state: 'queued', started: null, branch: null });
                return [4 /*yield*/, (0, test_1.expect)(child.getByRole('button', { name: /Add a child task/ })).toHaveCount(0)];
            case 10:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(add).toBeVisible()];
            case 11:
                _b.sent();
                return [4 /*yield*/, row.getByRole('button', { name: "Fold ".concat(parent.title), exact: true }).click()];
            case 12:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(child).toHaveCount(0)];
            case 13:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(add).toBeVisible()];
            case 14:
                _b.sent();
                return [4 /*yield*/, row.getByRole('button', { name: "Unfold ".concat(parent.title), exact: true }).click()];
            case 15:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(child).toBeVisible()];
            case 16:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('every edit left a record the mod can read, with a good copy beside it', function () { return __awaiter(void 0, void 0, void 0, function () {
    var record, _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, onDisk()];
            case 1:
                record = _d.sent();
                (0, test_1.expect)(record.version).toBe(2);
                (0, test_1.expect)(Array.isArray(record.requests)).toBe(true);
                _a = test_1.expect;
                _c = (_b = JSON).parse;
                return [4 /*yield*/, (0, promises_1.readFile)("".concat(file, ".bak"), 'utf8')];
            case 2:
                _a.apply(void 0, [_c.apply(_b, [_d.sent()]).version]).toBe(2);
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('the sheet, for looking at', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                test_1.test.skip(SHOTS === undefined, 'only when QUEUE_TEA_SHOTS names a folder');
                return [4 /*yield*/, page.getByRole('button', { name: 'Day sky' }).click()];
            case 1:
                _a.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'New quest', exact: true }).first().click()];
            case 2:
                _a.sent();
                return [4 /*yield*/, dialog().getByRole('button', { name: 'Add to the board' }).click()];
            case 3:
                _a.sent();
                return [4 /*yield*/, page.waitForTimeout(300)];
            case 4:
                _a.sent();
                return [4 /*yield*/, page.screenshot({ path: (0, node_path_1.join)(SHOTS, 'new-quest.png') })];
            case 5:
                _a.sent();
                return [4 /*yield*/, page.keyboard.press('Escape')];
            case 6:
                _a.sent();
                return [4 /*yield*/, page.waitForTimeout(300)];
            case 7:
                _a.sent();
                return [4 /*yield*/, page.screenshot({ path: (0, node_path_1.join)(SHOTS, 'board-edits.png') })];
            case 8:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('a record that breaks mid-session reverts the chip, says why, and stays as it is', function () { return __awaiter(void 0, void 0, void 0, function () {
    var good, before, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, promises_1.readFile)(file, 'utf8')];
            case 1:
                good = _b.sent();
                return [4 /*yield*/, pickRow('The saga')];
            case 2:
                _b.sent();
                return [4 /*yield*/, page.locator('.detail').getByRole('button', { name: /Priority of The saga/ }).textContent()];
            case 3:
                before = _b.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)(file, '{half a record')];
            case 4:
                _b.sent();
                return [4 /*yield*/, page.keyboard.press('1')];
            case 5:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(toast("This realm's record can't be read, so nothing was changed.")).toBeVisible()];
            case 6:
                _b.sent();
                _a = test_1.expect;
                return [4 /*yield*/, (0, promises_1.readFile)(file, 'utf8')];
            case 7:
                _a.apply(void 0, [_b.sent()]).toBe('{half a record');
                return [4 /*yield*/, (0, test_1.expect)(page.getByText("This realm's record can't be read").first()).toBeVisible()];
            case 8:
                _b.sent();
                (0, test_1.expect)(before).toContain('Low');
                return [4 /*yield*/, (0, promises_1.writeFile)(file, good)];
            case 9:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.board-list')).toBeVisible({ timeout: 10000 })];
            case 10:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
