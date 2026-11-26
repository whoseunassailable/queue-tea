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
// The Notes tab end to end: notes are real Markdown files in the home folder,
// and BrewQuest files quests into the realm's real record.
var APP = (0, node_path_1.join)(__dirname, '..');
var KEY = 'gait-abc123';
var home;
var app;
var page;
var errors = [];
var notesDir = function () { return (0, node_path_1.join)(home, '.queue-tea/notes', KEY); };
var noteFiles = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, (0, promises_1.readdir)(notesDir())];
        case 1: return [2 /*return*/, (_a.sent()).filter(function (name) { return name.endsWith('.md'); })];
    }
}); }); };
var record = function () { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
    switch (_c.label) {
        case 0:
            _b = (_a = JSON).parse;
            return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(home, '.queue-tea/projects', "".concat(KEY, ".json")), 'utf8')];
        case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
    }
}); }); };
test_1.test.beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-notes-'))];
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
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(home, '.queue-tea/projects', "".concat(KEY, ".json")), JSON.stringify({ version: 2, project: { name: 'Gait-feedback', path: (0, node_path_1.join)(home, 'gait') }, docsLogPath: null, playNext: null, feature: null, tasks: [], unassignedMinutesByDay: {}, requests: [] }))
                    // A note Obsidian made, to link to.
                ];
            case 5:
                _a.sent();
                // A note Obsidian made, to link to.
                return [4 /*yield*/, (0, promises_1.mkdir)(notesDir(), { recursive: true })];
            case 6:
                // A note Obsidian made, to link to.
                _a.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(notesDir(), 'Threat model.md'), '---\ntitle: Threat model\ntags:\n  - security\n---\nWhat could go wrong.')];
            case 7:
                _a.sent();
                return [4 /*yield*/, test_1._electron.launch({
                        args: [(0, node_path_1.join)(APP, 'out/main/main.js')],
                        cwd: APP,
                        env: __assign(__assign({}, process.env), { HOME: home, QUEUE_TEA_USER_DATA: (0, node_path_1.join)(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' }),
                    })];
            case 8:
                app = _a.sent();
                return [4 /*yield*/, app.firstWindow()];
            case 9:
                page = _a.sent();
                page.on('pageerror', function (err) { return errors.push(String(err)); });
                return [4 /*yield*/, page.setViewportSize({ width: 1440, height: 900 })];
            case 10:
                _a.sent();
                return [4 /*yield*/, page.getByRole('button', { name: /^Gait-feedback/ }).click()];
            case 11:
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
(0, test_1.test)('⌘7 opens Notes on the newest note, read from its Markdown file', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.keyboard.press('Meta+7')];
            case 1:
                _a.sent();
                (0, test_1.expect)(page.url()).toContain('#/notes');
                return [4 /*yield*/, (0, test_1.expect)(page.getByLabel('Title *')).toHaveValue('Threat model')];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByLabel('Tags')).toHaveValue('security')];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('a jotted idea becomes a note file, and typing saves into it', function () { return __awaiter(void 0, void 0, void 0, function () {
    var capture, body, files, made, text;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                capture = page.getByLabel('Jot an idea');
                return [4 /*yield*/, capture.fill('Bug Bounty Helper')];
            case 1:
                _a.sent();
                return [4 /*yield*/, capture.press('Meta+Enter')];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByLabel('Title *')).toHaveValue('Bug Bounty Helper')];
            case 3:
                _a.sent();
                body = page.getByRole('combobox', { name: 'Note' });
                return [4 /*yield*/, body.click()];
            case 4:
                _a.sent();
                return [4 /*yield*/, body.pressSequentially('A security helper. See [[thr')];
            case 5:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('option', { name: /Threat model/ })).toBeVisible()];
            case 6:
                _a.sent();
                return [4 /*yield*/, body.press('Enter')];
            case 7:
                _a.sent();
                return [4 /*yield*/, body.pressSequentially('\n\n- [ ] Scan dependencies\n- [ ] Write the report')];
            case 8:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText(/^Saved \d\d:\d\d$/)).toBeVisible()];
            case 9:
                _a.sent();
                return [4 /*yield*/, noteFiles()];
            case 10:
                files = _a.sent();
                (0, test_1.expect)(files).toHaveLength(2);
                made = files.find(function (name) { return name.startsWith('n-'); });
                return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(notesDir(), made), 'utf8')];
            case 11:
                text = _a.sent();
                (0, test_1.expect)(text).toContain('title: "Bug Bounty Helper"');
                (0, test_1.expect)(text).toContain('aliases: ["Bug Bounty Helper"]');
                (0, test_1.expect)(text).toContain('A security helper. See [[Threat model]]\n\n- [ ] Scan dependencies\n- [ ] Write the report');
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('the linked note shows the backlink', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.getByRole('navigation', { name: 'Notes' }).getByRole('button', { name: /^Threat model/ }).click()];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('complementary', { name: 'About this note' }).getByRole('button', { name: 'Bug Bounty Helper' })).toBeVisible()];
            case 2:
                _a.sent();
                return [4 /*yield*/, page.getByRole('complementary', { name: 'About this note' }).getByRole('button', { name: 'Bug Bounty Helper' }).click()];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByLabel('Title *')).toHaveValue('Bug Bounty Helper')];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('dragging BrewQuest highlights notes and opens their review without filing; the button still works with Enter', function () { return __awaiter(void 0, void 0, void 0, function () {
    var robot, list, other, inspector, before, files, _a, _b, _c, _d, _e, _f, source, target, otherSheet, _g, sheet, _h, button;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                robot = function () { return page.getByLabel('Drag BrewQuest onto a note'); };
                list = page.getByRole('navigation', { name: 'Notes' });
                other = list.getByRole('button', { name: /^Threat model/ });
                inspector = page.getByRole('complementary', { name: 'About this note' });
                return [4 /*yield*/, record()];
            case 1:
                before = _j.sent();
                _b = (_a = Promise).all;
                return [4 /*yield*/, noteFiles()];
            case 2: return [4 /*yield*/, _b.apply(_a, [(_j.sent()).map(function (name) { return (0, promises_1.readFile)((0, node_path_1.join)(notesDir(), name), 'utf8'); })])];
            case 3:
                files = _j.sent();
                return [4 /*yield*/, robot().dragTo(inspector)];
            case 4:
                _j.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('dialog')).toHaveCount(0)];
            case 5:
                _j.sent();
                _c = test_1.expect;
                return [4 /*yield*/, record()];
            case 6:
                _c.apply(void 0, [_j.sent()]).toEqual(before);
                _d = test_1.expect;
                _f = (_e = Promise).all;
                return [4 /*yield*/, noteFiles()];
            case 7: return [4 /*yield*/, _f.apply(_e, [(_j.sent()).map(function (name) { return (0, promises_1.readFile)((0, node_path_1.join)(notesDir(), name), 'utf8'); })])];
            case 8:
                _d.apply(void 0, [_j.sent()]).toEqual(files);
                return [4 /*yield*/, robot().boundingBox()];
            case 9:
                source = (_j.sent());
                return [4 /*yield*/, page.mouse.move(source.x + source.width / 2, source.y + source.height / 2)];
            case 10:
                _j.sent();
                return [4 /*yield*/, page.mouse.down()];
            case 11:
                _j.sent();
                _j.label = 12;
            case 12:
                _j.trys.push([12, , 20, 22]);
                return [4 /*yield*/, page.mouse.move(source.x + source.width / 2 - 15, source.y + source.height / 2 - 15, { steps: 5 })];
            case 13:
                _j.sent();
                return [4 /*yield*/, (0, test_1.expect)(other).toHaveAttribute('data-brew-target', 'true')];
            case 14:
                _j.sent();
                return [4 /*yield*/, other.boundingBox()];
            case 15:
                target = (_j.sent());
                return [4 /*yield*/, page.mouse.move(target.x + target.width / 2, target.y + target.height / 2, { steps: 10 })
                    // The first move enters the row; a second move delivers its dragover.
                ];
            case 16:
                _j.sent();
                // The first move enters the row; a second move delivers its dragover.
                return [4 /*yield*/, page.mouse.move(target.x + target.width / 2, target.y + target.height / 2)];
            case 17:
                // The first move enters the row; a second move delivers its dragover.
                _j.sent();
                return [4 /*yield*/, (0, test_1.expect)(other).toHaveAttribute('data-brew-over', 'true')];
            case 18:
                _j.sent();
                return [4 /*yield*/, page.screenshot({ path: '/private/tmp/queue-tea-brewquest-targets.png' })];
            case 19:
                _j.sent();
                return [3 /*break*/, 22];
            case 20: return [4 /*yield*/, page.mouse.up()];
            case 21:
                _j.sent();
                return [7 /*endfinally*/];
            case 22:
                otherSheet = page.getByRole('dialog', { name: 'Turn Threat model into quests' });
                return [4 /*yield*/, (0, test_1.expect)(otherSheet).toBeVisible()];
            case 23:
                _j.sent();
                return [4 /*yield*/, otherSheet.getByRole('button', { name: 'Cancel', exact: true }).click()];
            case 24:
                _j.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('button', { name: 'Turn into quests…' })).toBeFocused()];
            case 25:
                _j.sent();
                _g = test_1.expect;
                return [4 /*yield*/, record()];
            case 26:
                _g.apply(void 0, [_j.sent()]).toEqual(before);
                return [4 /*yield*/, robot().dragTo(list.getByRole('button', { name: /^Bug Bounty Helper/ }))];
            case 27:
                _j.sent();
                sheet = page.getByRole('dialog', { name: 'Turn Bug Bounty Helper into quests' });
                return [4 /*yield*/, (0, test_1.expect)(sheet).toBeVisible()];
            case 28:
                _j.sent();
                return [4 /*yield*/, sheet.getByRole('button', { name: 'Cancel', exact: true }).click()];
            case 29:
                _j.sent();
                return [4 /*yield*/, page.setViewportSize({ width: 760, height: 900 })];
            case 30:
                _j.sent();
                return [4 /*yield*/, robot().dragTo(page.getByRole('combobox', { name: 'Note' }))];
            case 31:
                _j.sent();
                return [4 /*yield*/, (0, test_1.expect)(sheet).toBeVisible()];
            case 32:
                _j.sent();
                return [4 /*yield*/, page.keyboard.press('Escape')];
            case 33:
                _j.sent();
                _h = test_1.expect;
                return [4 /*yield*/, page.locator('.nt-editor').evaluate(function (element) { return element.scrollWidth <= element.clientWidth; })];
            case 34:
                _h.apply(void 0, [_j.sent()]).toBe(true);
                button = page.getByRole('button', { name: 'Turn into quests…' });
                return [4 /*yield*/, button.focus()];
            case 35:
                _j.sent();
                return [4 /*yield*/, button.press('Enter')];
            case 36:
                _j.sent();
                return [4 /*yield*/, (0, test_1.expect)(sheet).toBeVisible()];
            case 37:
                _j.sent();
                return [4 /*yield*/, page.keyboard.press('Escape')];
            case 38:
                _j.sent();
                return [4 /*yield*/, (0, test_1.expect)(button).toBeFocused()];
            case 39:
                _j.sent();
                return [4 /*yield*/, page.setViewportSize({ width: 1440, height: 900 })];
            case 40:
                _j.sent();
                (0, test_1.expect)(errors).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('BrewQuest files the checklist as a saga in the realm’s queue, linked back to the note', function () { return __awaiter(void 0, void 0, void 0, function () {
    var sheet, tasks, about;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.getByRole('button', { name: 'Turn into quests…' }).click()];
            case 1:
                _a.sent();
                sheet = page.getByRole('dialog', { name: 'Turn Bug Bounty Helper into quests' });
                return [4 /*yield*/, (0, test_1.expect)(sheet.getByLabel('Parent quest *')).toHaveValue('Bug Bounty Helper')];
            case 2:
                _a.sent();
                return [4 /*yield*/, sheet.getByRole('button', { name: 'File 3 quests' }).click()];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(sheet).toBeHidden()];
            case 4:
                _a.sent();
                return [4 /*yield*/, record()];
            case 5:
                tasks = (_a.sent()).tasks;
                (0, test_1.expect)(tasks.map(function (task) { return task.title; })).toEqual(['Bug Bounty Helper', 'Scan dependencies', 'Write the report']);
                (0, test_1.expect)(tasks[1].parentId).toBe(tasks[0].id);
                (0, test_1.expect)(tasks[1].description).toBe('From the note "Bug Bounty Helper" in Notes.');
                about = page.getByRole('complementary', { name: 'About this note' });
                return [4 /*yield*/, (0, test_1.expect)(about.getByRole('button', { name: 'Open Scan dependencies in Quests' })).toBeVisible()];
            case 6:
                _a.sent();
                return [4 /*yield*/, about.getByRole('button', { name: 'Open Scan dependencies in Quests' }).click()];
            case 7:
                _a.sent();
                (0, test_1.expect)(page.url()).toContain('#/quests');
                (0, test_1.expect)(errors).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('⇧⌘N from another screen opens Notes on a new Untitled note', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, page.keyboard.press('Meta+2')];
            case 1:
                _b.sent();
                (0, test_1.expect)(page.url()).toContain('#/quests');
                return [4 /*yield*/, page.keyboard.press('Meta+Shift+N')];
            case 2:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByLabel('Title *')).toHaveValue('Untitled')];
            case 3:
                _b.sent();
                (0, test_1.expect)(page.url()).toContain('#/notes');
                _a = test_1.expect;
                return [4 /*yield*/, noteFiles()];
            case 4:
                _a.apply(void 0, [_b.sent()]).toHaveLength(3);
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('narrower windows float the inspector behind Details, then put the list in a drawer', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.setViewportSize({ width: 1000, height: 900 })];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('complementary', { name: 'About this note' })).toBeHidden()];
            case 2:
                _a.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Details' }).click()];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('complementary', { name: 'About this note' })).toBeVisible()];
            case 4:
                _a.sent();
                return [4 /*yield*/, page.keyboard.press('Escape')];
            case 5:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('complementary', { name: 'About this note' })).toBeHidden()];
            case 6:
                _a.sent();
                return [4 /*yield*/, page.setViewportSize({ width: 760, height: 900 })];
            case 7:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByLabel('Search notes')).toBeHidden()];
            case 8:
                _a.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Notes', exact: true }).click()];
            case 9:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByLabel('Jot an idea')).toBeFocused()];
            case 10:
                _a.sent();
                return [4 /*yield*/, page.getByRole('navigation', { name: 'Notes' }).getByRole('button', { name: /^Threat model/ }).click()];
            case 11:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByLabel('Title *')).toHaveValue('Threat model')];
            case 12:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByLabel('Search notes')).toBeHidden()];
            case 13:
                _a.sent();
                return [4 /*yield*/, page.setViewportSize({ width: 1440, height: 900 })];
            case 14:
                _a.sent();
                (0, test_1.expect)(errors).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('⌘E reads the note, and ticking a box there writes [x] into the file', function () { return __awaiter(void 0, void 0, void 0, function () {
    var made, files, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, page.getByRole('navigation', { name: 'Notes' }).getByRole('button', { name: /^Bug Bounty Helper/ }).click()];
            case 1:
                _c.sent();
                return [4 /*yield*/, page.keyboard.press('Meta+e')];
            case 2:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('button', { name: 'Read', pressed: true })).toBeVisible()];
            case 3:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('button', { name: 'Threat model' }).first()).toBeVisible()];
            case 4:
                _c.sent();
                return [4 /*yield*/, page.getByLabel('Done: Scan dependencies').check()];
            case 5:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText(/^Saved \d\d:\d\d$/)).toBeVisible()];
            case 6:
                _c.sent();
                return [4 /*yield*/, noteFiles()];
            case 7:
                made = (_c.sent()).find(function (name) { return name.startsWith('n-') && name !== 'Threat model.md'; });
                _b = (_a = Promise).all;
                return [4 /*yield*/, noteFiles()];
            case 8: return [4 /*yield*/, _b.apply(_a, [(_c.sent()).map(function (name) { return (0, promises_1.readFile)((0, node_path_1.join)(notesDir(), name), 'utf8'); })])];
            case 9:
                files = _c.sent();
                (0, test_1.expect)(files.some(function (text) { return text.includes('- [x] Scan dependencies'); })).toBe(true);
                (0, test_1.expect)(made).toBeTruthy();
                return [4 /*yield*/, page.keyboard.press('Meta+e')];
            case 10:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('combobox', { name: 'Note' })).toBeVisible()];
            case 11:
                _c.sent();
                (0, test_1.expect)(errors).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('History previews an earlier save, restores it on disk, and keeps the replaced text recoverable', function () { return __awaiter(void 0, void 0, void 0, function () {
    var body, original, changed, file, _i, _a, name_1, quests, sheet, versions, _b, text;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                body = page.getByRole('combobox', { name: 'Note' });
                return [4 /*yield*/, body.inputValue()];
            case 1:
                original = _c.sent();
                changed = original + '\n\nA history recovery checkpoint.';
                file = '';
                _i = 0;
                return [4 /*yield*/, noteFiles()];
            case 2:
                _a = _c.sent();
                _c.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 6];
                name_1 = _a[_i];
                return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(notesDir(), name_1), 'utf8')];
            case 4:
                if ((_c.sent()).includes('title: "Bug Bounty Helper"'))
                    file = name_1;
                _c.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6:
                (0, test_1.expect)(file).not.toBe('');
                return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(notesDir(), file), 'utf8')];
            case 7:
                quests = (_c.sent()).split('\n').find(function (line) { return line.startsWith('quests:'); });
                return [4 /*yield*/, body.fill(changed)
                    // Opening History immediately flushes the pending autosave through IPC.
                ];
            case 8:
                _c.sent();
                // Opening History immediately flushes the pending autosave through IPC.
                return [4 /*yield*/, page.getByRole('button', { name: 'History', exact: true }).click()];
            case 9:
                // Opening History immediately flushes the pending autosave through IPC.
                _c.sent();
                sheet = page.getByRole('dialog', { name: 'History of Bug Bounty Helper' });
                versions = sheet.getByRole('list', { name: 'Saved versions' }).getByRole('button');
                return [4 /*yield*/, (0, test_1.expect)(sheet.getByText('This is the current version.')).toBeVisible()];
            case 10:
                _c.sent();
                return [4 /*yield*/, versions.nth(1).click()];
            case 11:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(sheet.getByLabel('Saved note text')).toHaveText(original)];
            case 12:
                _c.sent();
                return [4 /*yield*/, page.setViewportSize({ width: 760, height: 900 })];
            case 13:
                _c.sent();
                _b = test_1.expect;
                return [4 /*yield*/, sheet.evaluate(function (element) { return element.scrollWidth <= element.clientWidth; })];
            case 14:
                _b.apply(void 0, [_c.sent()]).toBe(true);
                return [4 /*yield*/, page.screenshot({ path: '/private/tmp/queue-tea-notes-history-760.png' })];
            case 15:
                _c.sent();
                return [4 /*yield*/, sheet.getByRole('button', { name: 'Restore this version' }).click()];
            case 16:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(sheet).toBeHidden()];
            case 17:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(body).toHaveValue(original)];
            case 18:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText('Version restored. The replaced note is in History.')).toBeVisible()];
            case 19:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('button', { name: 'History', exact: true })).toBeFocused()];
            case 20:
                _c.sent();
                return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(notesDir(), file), 'utf8')];
            case 21:
                text = _c.sent();
                (0, test_1.expect)(text).toContain('\n---\n' + original);
                (0, test_1.expect)(text.split('\n').find(function (line) { return line.startsWith('quests:'); })).toBe(quests);
                return [4 /*yield*/, page.getByRole('button', { name: 'History', exact: true }).click()];
            case 22:
                _c.sent();
                return [4 /*yield*/, versions.nth(1).click()];
            case 23:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(sheet.getByLabel('Saved note text')).toHaveText(changed)];
            case 24:
                _c.sent();
                return [4 /*yield*/, page.setViewportSize({ width: 1440, height: 900 })];
            case 25:
                _c.sent();
                return [4 /*yield*/, page.screenshot({ path: '/private/tmp/queue-tea-notes-history-1440.png' })];
            case 26:
                _c.sent();
                return [4 /*yield*/, page.keyboard.press('Escape')];
            case 27:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(sheet).toBeHidden()];
            case 28:
                _c.sent();
                (0, test_1.expect)(errors).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('a template, folder move, rename and pin survive reopening, with links still opening', function () { return __awaiter(void 0, void 0, void 0, function () {
    var templates, body, dialog, saved, _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, page.getByRole('button', { name: 'New note', exact: true }).click()];
            case 1:
                _e.sent();
                templates = page.getByRole('group', { name: 'Start from a template' });
                return [4 /*yield*/, templates.getByRole('button', { name: 'Bug', exact: true }).click()];
            case 2:
                _e.sent();
                body = page.getByRole('combobox', { name: 'Note' });
                return [4 /*yield*/, (0, test_1.expect)(body).toHaveValue(/## Steps to reproduce/)];
            case 3:
                _e.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByLabel('Type', { exact: true })).toHaveValue('bug')];
            case 4:
                _e.sent();
                return [4 /*yield*/, page.getByLabel('Title *').fill('Incident review')];
            case 5:
                _e.sent();
                return [4 /*yield*/, page.getByLabel('Title *').press('Tab')];
            case 6:
                _e.sent();
                return [4 /*yield*/, body.fill('## Steps to reproduce\n\nSee [[Threat model]].\n\n- [ ] Reproduce')];
            case 7:
                _e.sent();
                return [4 /*yield*/, page.getByLabel('Folder', { exact: true }).fill('Incidents')];
            case 8:
                _e.sent();
                return [4 /*yield*/, page.getByLabel('Folder', { exact: true }).press('Tab')];
            case 9:
                _e.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('region', { name: 'Incidents' })).toBeVisible()];
            case 10:
                _e.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Rename the folder Incidents' }).click()];
            case 11:
                _e.sent();
                dialog = page.getByRole('dialog', { name: 'Rename Incidents' });
                return [4 /*yield*/, dialog.getByLabel('Folder name *').fill('Casebook')];
            case 12:
                _e.sent();
                return [4 /*yield*/, dialog.getByRole('button', { name: 'Rename folder', exact: true }).click()];
            case 13:
                _e.sent();
                return [4 /*yield*/, (0, test_1.expect)(dialog).toBeHidden()];
            case 14:
                _e.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByLabel('Folder', { exact: true })).toHaveValue('Casebook')];
            case 15:
                _e.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Pin note', exact: true }).click()];
            case 16:
                _e.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('region', { name: 'Pinned', exact: true }).getByRole('button', { name: /^Incident review/ })).toBeVisible()];
            case 17:
                _e.sent();
                saved = function () { return __awaiter(void 0, void 0, void 0, function () {
                    var files, _a, _b;
                    var _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                _b = (_a = Promise).all;
                                return [4 /*yield*/, noteFiles()];
                            case 1: return [4 /*yield*/, _b.apply(_a, [(_d.sent()).map(function (name) { return (0, promises_1.readFile)((0, node_path_1.join)(notesDir(), name), 'utf8'); })])];
                            case 2:
                                files = _d.sent();
                                return [2 /*return*/, (_c = files.find(function (text) { return text.includes('title: "Incident review"'); })) !== null && _c !== void 0 ? _c : ''];
                        }
                    });
                }); };
                _a = test_1.expect;
                return [4 /*yield*/, saved()];
            case 18:
                _a.apply(void 0, [_e.sent()]).toContain('type: "bug"');
                _b = test_1.expect;
                return [4 /*yield*/, saved()];
            case 19:
                _b.apply(void 0, [_e.sent()]).toContain('folder: "Casebook"');
                _c = test_1.expect;
                return [4 /*yield*/, saved()];
            case 20:
                _c.apply(void 0, [_e.sent()]).toContain('pinned: true');
                _d = test_1.expect;
                return [4 /*yield*/, saved()];
            case 21:
                _d.apply(void 0, [_e.sent()]).toContain('[[Threat model]]');
                return [4 /*yield*/, page.reload()];
            case 22:
                _e.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByLabel('Title *')).toHaveValue('Incident review')];
            case 23:
                _e.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByLabel('Type', { exact: true })).toHaveValue('bug')];
            case 24:
                _e.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByLabel('Folder', { exact: true })).toHaveValue('Casebook')];
            case 25:
                _e.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Unpin note', exact: true }).click()];
            case 26:
                _e.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('region', { name: 'Casebook' }).getByRole('button', { name: /^Incident review/ })).toBeVisible()];
            case 27:
                _e.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Read', exact: true }).click()];
            case 28:
                _e.sent();
                return [4 /*yield*/, page.locator('.nt-read').getByRole('button', { name: 'Threat model', exact: true }).click()];
            case 29:
                _e.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByLabel('Title *')).toHaveValue('Threat model')];
            case 30:
                _e.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('complementary', { name: 'About this note' }).getByRole('button', { name: 'Incident review', exact: true })).toBeVisible()];
            case 31:
                _e.sent();
                (0, test_1.expect)(errors).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('the palette jots into Inbox from Home and finds and opens a note by its text', function () { return __awaiter(void 0, void 0, void 0, function () {
    var palette, files, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, page.keyboard.press('Meta+1')];
            case 1:
                _c.sent();
                return [4 /*yield*/, page.keyboard.press('Meta+k')];
            case 2:
                _c.sent();
                palette = page.getByRole('dialog', { name: 'Command palette' });
                return [4 /*yield*/, palette.getByRole('combobox').fill('Palette capture')];
            case 3:
                _c.sent();
                return [4 /*yield*/, palette.getByRole('option', { name: '+ Jot "Palette capture" into Inbox' }).click()];
            case 4:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText('Jotted “Palette capture” into Inbox.')).toBeVisible()];
            case 5:
                _c.sent();
                (0, test_1.expect)(page.url()).toContain('#/home');
                _b = (_a = Promise).all;
                return [4 /*yield*/, noteFiles()];
            case 6: return [4 /*yield*/, _b.apply(_a, [(_c.sent()).map(function (name) { return (0, promises_1.readFile)((0, node_path_1.join)(notesDir(), name), 'utf8'); })])];
            case 7:
                files = _c.sent();
                (0, test_1.expect)(files.some(function (text) { return text.includes('title: "Palette capture"') && text.includes('folder: "Inbox"'); })).toBe(true);
                return [4 /*yield*/, page.keyboard.press('Meta+k')];
            case 8:
                _c.sent();
                palette = page.getByRole('dialog', { name: 'Command palette' });
                return [4 /*yield*/, palette.getByRole('combobox').fill('could go wrong')];
            case 9:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(palette.getByRole('option', { name: /Threat model/ })).toBeVisible()];
            case 10:
                _c.sent();
                return [4 /*yield*/, palette.getByRole('combobox').press('Enter')];
            case 11:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByLabel('Title *')).toHaveValue('Threat model')];
            case 12:
                _c.sent();
                (0, test_1.expect)(page.url()).toContain('#/notes');
                (0, test_1.expect)(errors).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('the palette offers New note from Quests and opens a title match with ⌘Return', function () { return __awaiter(void 0, void 0, void 0, function () {
    var palette, newNote, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, page.keyboard.press('Meta+2')];
            case 1:
                _b.sent();
                return [4 /*yield*/, page.keyboard.press('Meta+k')];
            case 2:
                _b.sent();
                palette = page.getByRole('dialog', { name: 'Command palette' });
                return [4 /*yield*/, palette.getByRole('combobox').fill('new note')];
            case 3:
                _b.sent();
                newNote = palette.getByRole('option', { name: /^New note/ });
                return [4 /*yield*/, (0, test_1.expect)(newNote).toContainText('⇧⌘N')];
            case 4:
                _b.sent();
                return [4 /*yield*/, newNote.click()];
            case 5:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByLabel('Title *')).toHaveValue('Untitled 2')];
            case 6:
                _b.sent();
                return [4 /*yield*/, page.keyboard.press('Meta+1')];
            case 7:
                _b.sent();
                return [4 /*yield*/, page.keyboard.press('Meta+k')];
            case 8:
                _b.sent();
                palette = page.getByRole('dialog', { name: 'Command palette' });
                return [4 /*yield*/, palette.getByRole('combobox').fill('Palette capture')];
            case 9:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(palette.getByRole('option', { name: 'Palette capture', exact: true })).toBeVisible()];
            case 10:
                _b.sent();
                return [4 /*yield*/, page.screenshot({ path: '/private/tmp/notes-command-palette-wide.png' })];
            case 11:
                _b.sent();
                return [4 /*yield*/, palette.getByRole('combobox').press('Meta+Enter')];
            case 12:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByLabel('Title *')).toHaveValue('Palette capture')];
            case 13:
                _b.sent();
                return [4 /*yield*/, page.setViewportSize({ width: 760, height: 900 })];
            case 14:
                _b.sent();
                return [4 /*yield*/, page.keyboard.press('Meta+k')];
            case 15:
                _b.sent();
                palette = page.getByRole('dialog', { name: 'Command palette' });
                return [4 /*yield*/, palette.getByRole('combobox').fill('could go wrong')];
            case 16:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(palette.getByRole('option', { name: /Threat model/ })).toBeVisible()];
            case 17:
                _b.sent();
                return [4 /*yield*/, page.screenshot({ path: '/private/tmp/notes-command-palette-narrow.png' })];
            case 18:
                _b.sent();
                _a = test_1.expect;
                return [4 /*yield*/, page.evaluate(function () { return document.documentElement.scrollWidth <= window.innerWidth; })];
            case 19:
                _a.apply(void 0, [_b.sent()]).toBe(true);
                return [4 /*yield*/, palette.getByRole('combobox').press('Escape')];
            case 20:
                _b.sent();
                return [4 /*yield*/, page.setViewportSize({ width: 1440, height: 900 })];
            case 21:
                _b.sent();
                (0, test_1.expect)(errors).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('the picker links a quest by id, saves it in Markdown and opens that quest from Read', function () { return __awaiter(void 0, void 0, void 0, function () {
    var linked, body, original, files, _a, _b, read, link;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, record()];
            case 1:
                linked = (_c.sent()).tasks.find(function (task) { return task.title === 'Write the report'; });
                body = page.getByRole('combobox', { name: 'Note' });
                return [4 /*yield*/, body.inputValue()];
            case 2:
                original = _c.sent();
                return [4 /*yield*/, body.fill("".concat(original, "\n\nSee [[Write"))];
            case 3:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('option', { name: 'Write the report, quest, waiting' })).toBeVisible()];
            case 4:
                _c.sent();
                return [4 /*yield*/, body.press('Enter')];
            case 5:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(body).toHaveValue("".concat(original, "\n\nSee [[quest:").concat(linked.id, "|Write the report]]"))];
            case 6:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText(/^Saved \d\d:\d\d$/)).toBeVisible()];
            case 7:
                _c.sent();
                _b = (_a = Promise).all;
                return [4 /*yield*/, noteFiles()];
            case 8: return [4 /*yield*/, _b.apply(_a, [(_c.sent()).map(function (name) { return (0, promises_1.readFile)((0, node_path_1.join)(notesDir(), name), 'utf8'); })])];
            case 9:
                files = _c.sent();
                (0, test_1.expect)(files.some(function (text) { return text.includes("[[quest:".concat(linked.id, "|Write the report]]")); })).toBe(true);
                return [4 /*yield*/, page.getByRole('button', { name: 'Read', exact: true }).click()];
            case 10:
                _c.sent();
                read = page.getByRole('article');
                link = read.getByRole('button', { name: 'Open Write the report in Quests, waiting' });
                return [4 /*yield*/, (0, test_1.expect)(link).toBeVisible()];
            case 11:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(read.getByText('○ Waiting')).toBeVisible()];
            case 12:
                _c.sent();
                return [4 /*yield*/, page.screenshot({ path: test_1.test.info().outputPath('quest-links.png') })];
            case 13:
                _c.sent();
                return [4 /*yield*/, link.click()];
            case 14:
                _c.sent();
                (0, test_1.expect)(page.url()).toContain('#/quests');
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('complementary', { name: 'Quest details' }).getByRole('heading', { name: 'Write the report' })).toBeVisible()];
            case 15:
                _c.sent();
                (0, test_1.expect)(errors).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
