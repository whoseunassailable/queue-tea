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
var record_source_1 = require("../../hooks/shared/records/data/datasources/record_source");
var fake_gh_1 = require("./fake_gh");
var APP = (0, node_path_1.join)(__dirname, '..');
var SHOTS = process.env.QUEUE_TEA_SHOTS;
var home;
var folder;
var realm;
var file;
var app;
var page;
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
var toast = function (text) { return page.locator('.toast-item').filter({ hasText: text }); };
var saved = function () { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
    switch (_c.label) {
        case 0:
            _b = (_a = JSON).parse;
            return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(home, 'user-data/settings.json'), 'utf8')];
        case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
    }
}); }); };
test_1.test.beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = promises_1.realpath;
                return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-settings-'))];
            case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
            case 2:
                home = _b.sent();
                folder = (0, node_path_1.join)(home, '.queue-tea/projects');
                realm = (0, node_path_1.join)(home, 'my realm');
                file = (0, node_path_1.join)(folder, "".concat((0, record_source_1.projectKey)(realm), ".json"));
                return [4 /*yield*/, (0, promises_1.mkdir)(folder, { recursive: true })];
            case 3:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)(realm)];
            case 4:
                _b.sent();
                return [4 /*yield*/, (0, fake_gh_1.plantGh)(home)];
            case 5:
                _b.sent();
                return [4 /*yield*/, test_1._electron.launch({
                        args: [(0, node_path_1.join)(APP, 'out/main/main.js')],
                        cwd: APP,
                        env: __assign(__assign({}, process.env), { HOME: home, QUEUE_TEA_USER_DATA: (0, node_path_1.join)(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' }),
                    })];
            case 6:
                app = _b.sent();
                return [4 /*yield*/, app.firstWindow()];
            case 7:
                page = _b.sent();
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
(0, test_1.test)('with no realms it welcomes you', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, test_1.expect)(page.getByRole('heading', { name: 'Welcome to Queue-tea' })).toBeVisible()];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText('No realms yet')).toBeVisible()];
            case 2:
                _a.sent();
                return [4 /*yield*/, shot('first-run')];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('Open folder asks first, then adds the realm and writes nothing in the folder', function () { return __awaiter(void 0, void 0, void 0, function () {
    var asked, _a, _b, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0: 
            // The dialog is the operating system's, so only it stands in for itself.
            return [4 /*yield*/, app.evaluate(function (_a, path) {
                    var dialog = _a.dialog;
                    dialog.showOpenDialog = (function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ canceled: false, filePaths: [path] })];
                    }); }); });
                }, realm)];
            case 1:
                // The dialog is the operating system's, so only it stands in for itself.
                _f.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Open folder…' }).click()];
            case 2:
                _f.sent();
                asked = page.getByRole('dialog');
                return [4 /*yield*/, (0, test_1.expect)(asked.getByText("my realm isn't in Queue-tea yet.")).toBeVisible()];
            case 3:
                _f.sent();
                return [4 /*yield*/, (0, test_1.expect)(asked.getByText('Not a git repository, so no branches are made')).toBeVisible()];
            case 4:
                _f.sent();
                _a = test_1.expect;
                return [4 /*yield*/, (0, promises_1.readdir)(folder)];
            case 5:
                _a.apply(void 0, [_f.sent()]).toEqual([]);
                return [4 /*yield*/, (0, test_1.expect)(asked.getByText('No GitHub accounts yet.')).toBeVisible()];
            case 6:
                _f.sent();
                return [4 /*yield*/, asked.getByRole('button', { name: 'Add realm' }).click()];
            case 7:
                _f.sent();
                return [4 /*yield*/, (0, test_1.expect)(asked).toBeHidden()];
            case 8:
                _f.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('button', { name: /^my realm/ })).toBeVisible()];
            case 9:
                _f.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('heading', { name: 'No active quest' })).toBeVisible()];
            case 10:
                _f.sent();
                _b = test_1.expect;
                _d = (_c = JSON).parse;
                return [4 /*yield*/, (0, promises_1.readFile)(file, 'utf8')];
            case 11:
                _b.apply(void 0, [_d.apply(_c, [_f.sent()]).project]).toEqual({ name: 'my realm', path: realm });
                _e = test_1.expect;
                return [4 /*yield*/, (0, promises_1.readdir)(realm)];
            case 12:
                _e.apply(void 0, [_f.sent()]).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('Open folder on a realm it knows goes there, and adds nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
    var before, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, promises_1.readdir)(folder)];
            case 1:
                before = _b.sent();
                return [4 /*yield*/, page.keyboard.press('Meta+o')];
            case 2:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('dialog')).toBeHidden()];
            case 3:
                _b.sent();
                _a = test_1.expect;
                return [4 /*yield*/, (0, promises_1.readdir)(folder)];
            case 4:
                _a.apply(void 0, [_b.sent()]).toEqual(before);
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('Settings shows at once and is remembered', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.keyboard.press('Meta+,')];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('heading', { name: 'Sky and motion' })).toBeVisible()];
            case 2:
                _a.sent();
                return [4 /*yield*/, page.getByRole('switch', { name: 'Calm mode' }).click()];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-testid="root"]')).toHaveClass(/calm/)];
            case 4:
                _a.sent();
                return [4 /*yield*/, test_1.expect.poll(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, saved()];
                            case 1: return [2 /*return*/, (_a.sent()).isCalm];
                        }
                    }); }); }).toBe(true)];
            case 5:
                _a.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'iTerm2' }).click()];
            case 6:
                _a.sent();
                return [4 /*yield*/, test_1.expect.poll(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, saved()];
                            case 1: return [2 /*return*/, (_a.sent()).terminal];
                        }
                    }); }); }).toBe('iterm')];
            case 7:
                _a.sent();
                return [4 /*yield*/, page.waitForTimeout(100)];
            case 8:
                _a.sent();
                return [4 /*yield*/, shot('settings')];
            case 9:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('Settings shows the running version and the disabled update follows every sky', function () { return __awaiter(void 0, void 0, void 0, function () {
    var version, update, backgrounds, _i, _a, sky, _b, _c, bounds;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, app.evaluate(function (_a) {
                    var app = _a.app;
                    return app.getVersion();
                })];
            case 1:
                version = _d.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('link', { name: 'Settings', exact: true })).toContainText("v".concat(version))];
            case 2:
                _d.sent();
                update = page.getByRole('button', { name: 'Update', exact: true });
                return [4 /*yield*/, (0, test_1.expect)(update).toBeDisabled()];
            case 3:
                _d.sent();
                backgrounds = [];
                _i = 0, _a = ['Morning', 'Day', 'Evening', 'Night'];
                _d.label = 4;
            case 4:
                if (!(_i < _a.length)) return [3 /*break*/, 10];
                sky = _a[_i];
                return [4 /*yield*/, page.getByRole('button', { name: "".concat(sky, " sky") }).click()];
            case 5:
                _d.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.rm')).toHaveClass(new RegExp("t-".concat(sky.toLowerCase())))];
            case 6:
                _d.sent();
                _c = (_b = backgrounds).push;
                return [4 /*yield*/, update.evaluate(function (button) { return getComputedStyle(button).backgroundImage; })];
            case 7:
                _c.apply(_b, [_d.sent()]);
                return [4 /*yield*/, page.locator('.app-update').boundingBox()];
            case 8:
                bounds = _d.sent();
                (0, test_1.expect)(bounds.width).toBeLessThan(260);
                _d.label = 9;
            case 9:
                _i++;
                return [3 /*break*/, 4];
            case 10:
                (0, test_1.expect)(new Set(backgrounds).size).toBe(4);
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('the task log path is checked, then saved', function () { return __awaiter(void 0, void 0, void 0, function () {
    var dialog, field, _a, _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0: return [4 /*yield*/, page.getByRole('button', { name: 'Set now…' }).click()];
            case 1:
                _g.sent();
                dialog = page.getByRole('dialog');
                field = dialog.getByLabel('Task log path *');
                return [4 /*yield*/, (0, test_1.expect)(field).toHaveValue('docs/task_log.md')];
            case 2:
                _g.sent();
                return [4 /*yield*/, field.fill('docs/')];
            case 3:
                _g.sent();
                return [4 /*yield*/, field.blur()];
            case 4:
                _g.sent();
                return [4 /*yield*/, (0, test_1.expect)(dialog.getByText('Enter a file path, such as docs/task_log.md.')).toBeVisible()];
            case 5:
                _g.sent();
                return [4 /*yield*/, dialog.getByRole('button', { name: 'Save' }).click()];
            case 6:
                _g.sent();
                _a = test_1.expect;
                _c = (_b = JSON).parse;
                return [4 /*yield*/, (0, promises_1.readFile)(file, 'utf8')];
            case 7:
                _a.apply(void 0, [_c.apply(_b, [_g.sent()]).docsLogPath]).toBeNull();
                return [4 /*yield*/, field.fill('notes/log.md')];
            case 8:
                _g.sent();
                return [4 /*yield*/, dialog.getByRole('button', { name: 'Save' }).click()];
            case 9:
                _g.sent();
                return [4 /*yield*/, (0, test_1.expect)(dialog).toBeHidden()];
            case 10:
                _g.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText('notes/log.md')).toBeVisible()];
            case 11:
                _g.sent();
                _d = test_1.expect;
                _f = (_e = JSON).parse;
                return [4 /*yield*/, (0, promises_1.readFile)(file, 'utf8')];
            case 12:
                _d.apply(void 0, [_f.apply(_e, [_g.sent()]).docsLogPath]).toBe('notes/log.md');
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('switched off, the single-letter keys do nothing', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, _d, _e, _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0: return [4 /*yield*/, page.getByRole('switch', { name: 'Single-key shortcuts in lists' }).click()];
            case 1:
                _h.sent();
                return [4 /*yield*/, test_1.expect.poll(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, saved()];
                            case 1: return [2 /*return*/, (_a.sent()).letterKeys];
                        }
                    }); }); }).toBe(false)];
            case 2:
                _h.sent();
                _a = promises_1.writeFile;
                _b = [file];
                _d = (_c = JSON).stringify;
                _e = [{}];
                _g = (_f = JSON).parse;
                return [4 /*yield*/, (0, promises_1.readFile)(file, 'utf8')];
            case 3: return [4 /*yield*/, _a.apply(void 0, _b.concat([_d.apply(_c, [__assign.apply(void 0, [__assign.apply(void 0, _e.concat([_g.apply(_f, [_h.sent()])])), { tasks: [] }]), null, 2])]))];
            case 4:
                _h.sent();
                return [4 /*yield*/, page.getByRole('link', { name: 'Quests', exact: true }).click()];
            case 5:
                _h.sent();
                return [4 /*yield*/, page.keyboard.press('Meta+n')];
            case 6:
                _h.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('dialog')).toBeVisible()];
            case 7:
                _h.sent();
                return [4 /*yield*/, page.keyboard.press('Escape')];
            case 8:
                _h.sent();
                return [4 /*yield*/, page.getByRole('link', { name: 'Settings' }).click()];
            case 9:
                _h.sent();
                return [4 /*yield*/, page.getByRole('switch', { name: 'Single-key shortcuts in lists' }).click()];
            case 10:
                _h.sent();
                return [4 /*yield*/, test_1.expect.poll(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, saved()];
                            case 1: return [2 /*return*/, (_a.sent()).letterKeys];
                        }
                    }); }); }).toBe(true)];
            case 11:
                _h.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('a broken record says why, and the last good copy puts it right', function () { return __awaiter(void 0, void 0, void 0, function () {
    var good, _a, _b, _c, broken, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, (0, promises_1.readFile)(file, 'utf8')];
            case 1:
                good = _e.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)("".concat(file, ".bak"), good)];
            case 2:
                _e.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)(file, '{ not json')];
            case 3:
                _e.sent();
                return [4 /*yield*/, page.getByRole('link', { name: 'Home', exact: true }).click()];
            case 4:
                _e.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('heading', { name: "Couldn't read your task record" })).toBeVisible()];
            case 5:
                _e.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText(/^It isn't valid JSON/)).toBeVisible()];
            case 6:
                _e.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText('Nothing can start or change in my realm until its record reads.', { exact: false })).toBeVisible()];
            case 7:
                _e.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('navigation', { name: 'Sections' }).getByRole('link')).toHaveCount(0)];
            case 8:
                _e.sent();
                return [4 /*yield*/, page.waitForTimeout(100)];
            case 9:
                _e.sent();
                return [4 /*yield*/, shot('failed-record')];
            case 10:
                _e.sent();
                return [4 /*yield*/, page.keyboard.press('l')];
            case 11:
                _e.sent();
                return [4 /*yield*/, (0, test_1.expect)(toast(/Back to the last good copy/)).toBeVisible()];
            case 12:
                _e.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('heading', { name: 'No active quest' })).toBeVisible()];
            case 13:
                _e.sent();
                _a = test_1.expect;
                _c = (_b = JSON).parse;
                return [4 /*yield*/, (0, promises_1.readFile)(file, 'utf8')];
            case 14:
                _a.apply(void 0, [_c.apply(_b, [_e.sent()]).project.name]).toBe('my realm');
                return [4 /*yield*/, (0, promises_1.readdir)(folder)];
            case 15:
                broken = (_e.sent()).find(function (name) { return name.includes('.broken-'); });
                _d = test_1.expect;
                return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(folder, broken), 'utf8')];
            case 16:
                _d.apply(void 0, [_e.sent()]).toBe('{ not json');
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('a record from a newer Queue-tea is left alone, with no copy offered', function () { return __awaiter(void 0, void 0, void 0, function () {
    var newer, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                newer = JSON.stringify({ version: 3, future: 'work' });
                return [4 /*yield*/, (0, promises_1.writeFile)(file, newer)];
            case 1:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText(/written by a newer Queue-tea/)).toBeVisible()];
            case 2:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('button', { name: 'Use the last good copy' })).toBeHidden()];
            case 3:
                _b.sent();
                return [4 /*yield*/, page.keyboard.press('l')];
            case 4:
                _b.sent();
                return [4 /*yield*/, page.waitForTimeout(100)];
            case 5:
                _b.sent();
                _a = test_1.expect;
                return [4 /*yield*/, (0, promises_1.readFile)(file, 'utf8')];
            case 6:
                _a.apply(void 0, [_b.sent()]).toBe(newer);
                return [4 /*yield*/, (0, promises_1.writeFile)(file, JSON.stringify((0, record_source_1.emptyRecord)('my realm', realm)))];
            case 7:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
