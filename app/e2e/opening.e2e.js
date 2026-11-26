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
var fixtures_1 = require("../main/features/tasks/api/fixtures");
var APP = (0, node_path_1.join)(__dirname, '..');
var home;
var folder;
var app;
var page;
var alpha;
var beta;
var realmFile = function (path) { return (0, node_path_1.join)(folder, "".concat((0, record_source_1.projectKey)(path), ".json")); };
var link = function (path) { return "queue-tea://open?path=".concat(encodeURIComponent(path)); };
// macOS hands the app a link through this event, so the test does the same.
var follow = function (url) { return app.evaluate(function (_a, target) {
    var electronApp = _a.app;
    return void electronApp.emit('open-url', { preventDefault: function () { } }, target);
}, url); };
var sidebarRow = function (name) { return page.getByRole('navigation', { name: 'Realms' }).getByRole('button', { name: new RegExp("^".concat(name)) }); };
var toast = function (text) { return page.locator('.toast-item').filter({ hasText: text }); };
var shown = function () { return app.evaluate(function () { return globalThis.queueTeaShown; }); };
test_1.test.beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, record;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = promises_1.realpath;
                return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-opening-'))];
            case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
            case 2:
                home = _b.sent();
                folder = (0, node_path_1.join)(home, '.queue-tea/projects');
                alpha = (0, node_path_1.join)(home, 'alpha');
                beta = (0, node_path_1.join)(home, 'beta realm café');
                return [4 /*yield*/, (0, promises_1.mkdir)(folder, { recursive: true })];
            case 3:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)(alpha)];
            case 4:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)(beta)];
            case 5:
                _b.sent();
                return [4 /*yield*/, (0, fake_gh_1.plantGh)(home)];
            case 6:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)(realmFile(alpha), JSON.stringify((0, record_source_1.emptyRecord)('alpha', alpha)))];
            case 7:
                _b.sent();
                record = __assign(__assign({}, (0, record_source_1.emptyRecord)('beta realm café', beta)), { tasks: [(0, fixtures_1.makeTask)({ id: 'one', title: 'The quest', state: 'current' })] });
                return [4 /*yield*/, (0, promises_1.writeFile)(realmFile(beta), JSON.stringify(record))];
            case 8:
                _b.sent();
                return [4 /*yield*/, test_1._electron.launch({
                        args: [(0, node_path_1.join)(APP, 'out/main/main.js')],
                        cwd: APP,
                        env: __assign(__assign({}, process.env), { HOME: home, QUEUE_TEA_USER_DATA: (0, node_path_1.join)(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' }),
                    })];
            case 9:
                app = _b.sent();
                return [4 /*yield*/, app.firstWindow()];
            case 10:
                page = _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(sidebarRow('alpha')).toBeVisible()
                    // The system's banner can't be watched from here, so only showing it stands
                    // in. What decides to show it, and what a click does, are the real ones.
                ];
            case 11:
                _b.sent();
                // The system's banner can't be watched from here, so only showing it stands
                // in. What decides to show it, and what a click does, are the real ones.
                return [4 /*yield*/, app.evaluate(function (_a) {
                        var Notification = _a.Notification;
                        var seen = [];
                        globalThis.queueTeaShown = seen;
                        Notification.prototype.show = function show() {
                            seen.push(this.body);
                            globalThis.queueTeaLast = this;
                        };
                    })];
            case 12:
                // The system's banner can't be watched from here, so only showing it stands
                // in. What decides to show it, and what a click does, are the real ones.
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
(0, test_1.test)('a link to a realm it knows selects it and tags it Detected', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, follow(link(alpha))];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(sidebarRow('alpha')).toHaveClass(/sel/)];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(sidebarRow('alpha')).toContainText('Detected')];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('a path with a space and an accent comes through whole', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, follow(link(beta))];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(sidebarRow('beta realm café')).toHaveClass(/sel/)];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(sidebarRow('beta realm café')).toContainText('Detected')];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(sidebarRow('alpha')).not.toContainText('Detected')];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('a link to a folder it doesn\'t know asks first, and writes nothing until told', function () { return __awaiter(void 0, void 0, void 0, function () {
    var fresh, before, dialog, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                fresh = (0, node_path_1.join)(home, 'fresh');
                return [4 /*yield*/, (0, promises_1.mkdir)(fresh)];
            case 1:
                _c.sent();
                return [4 /*yield*/, (0, promises_1.readdir)(folder)];
            case 2:
                before = _c.sent();
                return [4 /*yield*/, follow(link(fresh))];
            case 3:
                _c.sent();
                dialog = page.getByRole('dialog');
                return [4 /*yield*/, (0, test_1.expect)(dialog.getByText("fresh isn't in Queue-tea yet.")).toBeVisible()];
            case 4:
                _c.sent();
                _a = test_1.expect;
                return [4 /*yield*/, (0, promises_1.readdir)(folder)];
            case 5:
                _a.apply(void 0, [_c.sent()]).toEqual(before);
                return [4 /*yield*/, (0, test_1.expect)(dialog.getByText('No GitHub accounts yet.')).toBeVisible()];
            case 6:
                _c.sent();
                return [4 /*yield*/, dialog.getByRole('button', { name: 'Add realm' }).click()];
            case 7:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(dialog).toBeHidden()];
            case 8:
                _c.sent();
                return [4 /*yield*/, (0, test_1.expect)(sidebarRow('fresh')).toContainText('Detected')];
            case 9:
                _c.sent();
                _b = test_1.expect;
                return [4 /*yield*/, (0, promises_1.readdir)(fresh)];
            case 10:
                _b.apply(void 0, [_c.sent()]).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('a bad link says so', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, follow('queue-tea://open')];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(toast("That link doesn't name a folder Queue-tea can open.")).toBeVisible()];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('a link to a folder that has gone says so', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, follow(link((0, node_path_1.join)(home, 'gone')))];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(toast("There's no folder at ".concat((0, node_path_1.join)(home, 'gone'), "."))).toBeVisible()];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('Claude asking in the background taps you on the shoulder, once', function () { return __awaiter(void 0, void 0, void 0, function () {
    var record, _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, app.evaluate(function (_a) {
                    var electronApp = _a.app, BrowserWindow = _a.BrowserWindow;
                    BrowserWindow.getAllWindows()[0].blur();
                    electronApp.hide();
                })];
            case 1:
                _d.sent();
                return [4 /*yield*/, test_1.expect.poll(function () { return app.evaluate(function (_a) {
                        var BrowserWindow = _a.BrowserWindow;
                        return BrowserWindow.getFocusedWindow() === null;
                    }); }).toBe(true)];
            case 2:
                _d.sent();
                _b = (_a = JSON).parse;
                return [4 /*yield*/, (0, promises_1.readFile)(realmFile(beta), 'utf8')];
            case 3:
                record = _b.apply(_a, [_d.sent()]);
                return [4 /*yield*/, (0, promises_1.writeFile)(realmFile(beta), JSON.stringify(__assign(__assign({}, record), { tasks: record.tasks.map(function (t) { return (__assign(__assign({}, t), { review: { at: '2026-11-02T12:00:00-06:00', checked: 'tests pass' } })); }) })))];
            case 4:
                _d.sent();
                return [4 /*yield*/, test_1.expect.poll(shown).toEqual(['Claude says The quest looks done'])];
            case 5:
                _d.sent();
                return [4 /*yield*/, new Promise(function (done) { return setTimeout(done, 600); })];
            case 6:
                _d.sent();
                _c = test_1.expect;
                return [4 /*yield*/, shown()];
            case 7:
                _c.apply(void 0, [_d.sent()]).toHaveLength(1);
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('clicking it opens that realm at the question', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.getByRole('link', { name: 'Quests', exact: true }).evaluate(function (a) { return a.click(); })];
            case 1:
                _a.sent();
                return [4 /*yield*/, sidebarRow('alpha').evaluate(function (b) { return b.click(); })];
            case 2:
                _a.sent();
                return [4 /*yield*/, app.evaluate(function () { return globalThis.queueTeaLast.emit('click'); })];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('heading', { name: 'Is The quest done for now?' })).toBeVisible()];
            case 4:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(sidebarRow('beta realm café')).toHaveClass(/sel/)];
            case 5:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('a link with no window open opens one, on that realm', function () { return __awaiter(void 0, void 0, void 0, function () {
    var closed;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                closed = app.waitForEvent('window');
                return [4 /*yield*/, app.evaluate(function (_a) {
                        var BrowserWindow = _a.BrowserWindow;
                        return BrowserWindow.getAllWindows()[0].close();
                    })];
            case 1:
                _a.sent();
                return [4 /*yield*/, follow(link(alpha))];
            case 2:
                _a.sent();
                return [4 /*yield*/, closed];
            case 3:
                page = _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(sidebarRow('alpha')).toHaveClass(/sel/)];
            case 4:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(sidebarRow('alpha')).toContainText('Detected')];
            case 5:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
