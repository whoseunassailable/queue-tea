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
var KEY = 'notes-abc123';
var TITLE = 'Maybe we should understand the missed steps';
var BODY = 'Find out why short walks lose steps.\n\n- [ ] Reproduce a missed step\n- [ ] Compare sensor recordings';
var home;
var app;
var page;
var errors = [];
var recordPath = function () { return (0, node_path_1.join)(home, '.queue-tea/projects', "".concat(KEY, ".json")); };
var vault = function () { return (0, node_path_1.join)(home, '.queue-tea/notes', KEY); };
var record = function () { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
    switch (_c.label) {
        case 0:
            _b = (_a = JSON).parse;
            return [4 /*yield*/, (0, promises_1.readFile)(recordPath(), 'utf8')];
        case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
    }
}); }); };
test_1.test.beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _loop_1, start;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-notes-performance-'))];
            case 1:
                home = _a.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, 'gait'))];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, '.queue-tea/projects'), { recursive: true })];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, '.queue-tea/sessions'), { recursive: true })];
            case 4:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)(vault(), { recursive: true })];
            case 5:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)(recordPath(), JSON.stringify({ version: 2, project: { name: 'Gait-feedback', path: (0, node_path_1.join)(home, 'gait') }, docsLogPath: null, playNext: null, feature: null, tasks: [], unassignedMinutesByDay: {}, requests: [] }))
                    // Capture brings this vault to its existing limit of 5,000 notes. Include
                    // bodies, tags, many folders and pins rather than just short empty titles.
                ];
            case 6:
                _a.sent();
                _loop_1 = function (start) {
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, Promise.all(Array.from({ length: Math.min(100, 4999 - start) }, function (_, offset) {
                                    var i = start + offset;
                                    var n = String(i).padStart(5, '0');
                                    return (0, promises_1.writeFile)((0, node_path_1.join)(vault(), "Note ".concat(n, ".md")), "---\ntitle: Note ".concat(n, "\nfolder: Research ").concat(i % 100, "\ntags: [\"research\"]\npinned: ").concat(i % 10 === 0, "\nupdated: \"2026-11-01T12:00:00Z\"\n---\n").concat('Observation from a walk. '.repeat(100), " marker-").concat(n));
                                }))];
                            case 1:
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                start = 0;
                _a.label = 7;
            case 7:
                if (!(start < 4999)) return [3 /*break*/, 10];
                return [5 /*yield**/, _loop_1(start)];
            case 8:
                _a.sent();
                _a.label = 9;
            case 9:
                start += 100;
                return [3 /*break*/, 7];
            case 10: return [4 /*yield*/, test_1._electron.launch({ args: [(0, node_path_1.join)(APP, 'out/main/main.js')], cwd: APP, env: __assign(__assign({}, process.env), { HOME: home, QUEUE_TEA_USER_DATA: (0, node_path_1.join)(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' }) })];
            case 11:
                app = _a.sent();
                return [4 /*yield*/, app.firstWindow()];
            case 12:
                page = _a.sent();
                page.on('pageerror', function (error) { return errors.push(String(error)); });
                return [4 /*yield*/, page.route(/^https?:/, function (route) { return route.abort(); })];
            case 13:
                _a.sent();
                return [4 /*yield*/, page.setViewportSize({ width: 1440, height: 900 })];
            case 14:
                _a.sent();
                return [4 /*yield*/, page.getByRole('button', { name: /^Gait-feedback/ }).click()];
            case 15:
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
                if (!(home !== undefined)) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, promises_1.rm)(home, { recursive: true, force: true })];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('a vague captured idea becomes a reviewed saga, saved and reopened in a large vault', function () { return __awaiter(void 0, void 0, void 0, function () {
    var started, opened, capture, sheet, _a, tasks, names, text, _i, tasks_1, task, about, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                started = Date.now();
                return [4 /*yield*/, page.keyboard.press('Meta+7')];
            case 1:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByLabel('Title *')).toHaveValue(/^Note /)];
            case 2:
                _c.sent();
                opened = Date.now() - started;
                process.stdout.write("Open 4,999-note vault: ".concat(opened, " ms\n"));
                (0, test_1.expect)(opened).toBeLessThan(5000);
                capture = page.getByLabel('Jot an idea');
                return [4 /*yield*/, capture.fill(TITLE)];
            case 3:
                _c.sent();
                return [4 /*yield*/, capture.press('Meta+Enter')];
            case 4:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByLabel('Title *')).toHaveValue(TITLE)];
            case 5:
                _c.sent();
                return [4 /*yield*/, page.getByRole('combobox', { name: 'Note' }).fill(BODY)];
            case 6:
                _c.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Turn into quests…' }).click()];
            case 7:
                _c.sent();
                sheet = page.getByRole('dialog', { name: "Turn ".concat(TITLE, " into quests") });
                return [4 /*yield*/, (0, test_1.expect)(sheet.getByLabel('Parent quest *')).toHaveValue(TITLE)];
            case 8:
                _c.sent();
                _a = test_1.expect;
                return [4 /*yield*/, record()];
            case 9:
                _a.apply(void 0, [(_c.sent()).tasks]).toEqual([]);
                return [4 /*yield*/, sheet.getByLabel('Parent quest *').fill('Understand missed steps')];
            case 10:
                _c.sent();
                return [4 /*yield*/, sheet.getByLabel('Quest 1 title *').fill('Reproduce a missed step on a short walk')];
            case 11:
                _c.sent();
                return [4 /*yield*/, sheet.getByLabel('Quest 1 priority').selectOption('high')];
            case 12:
                _c.sent();
                return [4 /*yield*/, sheet.getByLabel('Quest 2 difficulty').selectOption('hard')];
            case 13:
                _c.sent();
                return [4 /*yield*/, sheet.getByRole('button', { name: 'File 3 quests' }).click()];
            case 14:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(sheet).toBeHidden({ timeout: 15000 })];
            case 15:
                _c.sent();
                return [4 /*yield*/, record()];
            case 16:
                tasks = (_c.sent()).tasks;
                (0, test_1.expect)(tasks.map(function (task) { return task.title; })).toEqual(['Understand missed steps', 'Reproduce a missed step on a short walk', 'Compare sensor recordings']);
                (0, test_1.expect)(tasks.slice(1).map(function (task) { return task.parentId; })).toEqual([tasks[0].id, tasks[0].id]);
                (0, test_1.expect)(tasks[1].priority).toBe('high');
                (0, test_1.expect)(tasks[2].difficulty.expected).toBe('hard');
                (0, test_1.expect)(tasks[1].description).toBe("From the note \"".concat(TITLE, "\" in Notes."));
                return [4 /*yield*/, (0, promises_1.readdir)(vault())];
            case 17:
                names = (_c.sent()).filter(function (name) { return name.endsWith('.md'); });
                (0, test_1.expect)(names).toHaveLength(5000);
                return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(vault(), names.find(function (name) { return name.startsWith('n-'); })), 'utf8')];
            case 18:
                text = _c.sent();
                (0, test_1.expect)(text).toContain(BODY);
                for (_i = 0, tasks_1 = tasks; _i < tasks_1.length; _i++) {
                    task = tasks_1[_i];
                    (0, test_1.expect)(text).toContain(task.id);
                }
                about = page.getByRole('complementary', { name: 'About this note' });
                return [4 /*yield*/, about.getByRole('button', { name: 'Open Compare sensor recordings in Quests' }).click()];
            case 19:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('complementary', { name: 'Quest details' }).getByRole('heading', { name: 'Compare sensor recordings' })).toBeVisible()];
            case 20:
                _c.sent();
                return [4 /*yield*/, page.reload()];
            case 21:
                _c.sent();
                return [4 /*yield*/, page.getByRole('navigation', { name: 'Sections' }).getByRole('link', { name: 'Notes', exact: true }).click()];
            case 22:
                _c.sent();
                return [4 /*yield*/, page.getByLabel('Search notes').fill('Maybe missed')];
            case 23:
                _c.sent();
                return [4 /*yield*/, page.getByRole('navigation', { name: 'Notes' }).getByRole('button', { name: new RegExp("^".concat(TITLE)) }).click()];
            case 24:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('combobox', { name: 'Note' })).toHaveValue(BODY)];
            case 25:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(about.getByRole('button', { name: 'Open Compare sensor recordings in Quests' })).toBeVisible()];
            case 26:
                _c.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Turn into quests…' }).click()];
            case 27:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(sheet.getByRole('button', { name: /^File / })).toBeHidden()];
            case 28:
                _c.sent();
                return [4 /*yield*/, sheet.getByRole('button', { name: 'Close', exact: true }).click()];
            case 29:
                _c.sent();
                _b = test_1.expect;
                return [4 /*yield*/, record()];
            case 30:
                _b.apply(void 0, [(_c.sent()).tasks]).toHaveLength(3);
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('pages and searches all 5,000 notes within the browser budgets, including the narrow drawer', function () { return __awaiter(void 0, void 0, void 0, function () {
    var search, list, started, paged, times, _i, _a, query, at, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                search = page.getByLabel('Search notes');
                list = page.getByRole('navigation', { name: 'Notes' });
                return [4 /*yield*/, search.fill('')];
            case 1:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(list.locator('.nt-item')).toHaveCount(100)];
            case 2:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(list.getByRole('button', { name: 'Next notes' })).toBeInViewport()];
            case 3:
                _c.sent();
                started = Date.now();
                return [4 /*yield*/, list.getByRole('button', { name: 'Next notes' }).click()];
            case 4:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(list.getByText('Page 2 of 50')).toBeVisible()];
            case 5:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(list.getByRole('button', { name: 'Previous notes' })).toBeInViewport()];
            case 6:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(list.locator('.nt-item').first()).toBeFocused()];
            case 7:
                _c.sent();
                paged = Date.now() - started;
                (0, test_1.expect)(paged).toBeLessThan(1000);
                times = [];
                _i = 0, _a = ['marker-04998', '#res marker-04997', 'NOTE 04996 observation'];
                _c.label = 8;
            case 8:
                if (!(_i < _a.length)) return [3 /*break*/, 13];
                query = _a[_i];
                at = Date.now();
                return [4 /*yield*/, search.fill(query)];
            case 9:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(list.locator('.nt-item')).toHaveCount(1)];
            case 10:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(list.locator('.nt-item')).toContainText(query.includes('04998') ? 'Note 04998' : query.includes('04997') ? 'Note 04997' : 'Note 04996')];
            case 11:
                _c.sent();
                times.push(Date.now() - at);
                _c.label = 12;
            case 12:
                _i++;
                return [3 /*break*/, 8];
            case 13:
                (0, test_1.expect)(Math.max.apply(Math, times)).toBeLessThan(1000);
                process.stdout.write("5,000 notes: page ".concat(paged, " ms; searches ").concat(times.join(', '), " ms\n"));
                return [4 /*yield*/, search.fill('')];
            case 14:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(list.getByText('Page 1 of 50')).toBeVisible()];
            case 15:
                _c.sent();
                return [4 /*yield*/, page.screenshot({ path: test_1.test.info().outputPath('notes-paging-wide.png') })];
            case 16:
                _c.sent();
                return [4 /*yield*/, page.setViewportSize({ width: 760, height: 900 })];
            case 17:
                _c.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Notes', exact: true }).click()];
            case 18:
                _c.sent();
                return [4 /*yield*/, list.getByRole('button', { name: 'Next notes' }).click()];
            case 19:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(list.getByText('Page 2 of 50')).toBeVisible()];
            case 20:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(list.getByRole('button', { name: 'Next notes' })).toBeInViewport()];
            case 21:
                _c.sent();
                _b = test_1.expect;
                return [4 /*yield*/, list.evaluate(function (element) { return element.scrollWidth <= element.clientWidth; })];
            case 22:
                _b.apply(void 0, [_c.sent()]).toBe(true);
                return [4 /*yield*/, page.screenshot({ path: test_1.test.info().outputPath('notes-paging-narrow.png') })];
            case 23:
                _c.sent();
                return [4 /*yield*/, list.locator('.nt-item').first().press('Enter')];
            case 24:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(search).toBeHidden()];
            case 25:
                _c.sent();
                (0, test_1.expect)(errors).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
