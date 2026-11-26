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
var record_source_1 = require("../../hooks/shared/records/data/datasources/record_source");
var fixtures_1 = require("../main/features/tasks/api/fixtures");
// The built app, not the development one: run with `npm run e2e:packaged`.
test_1.test.skip(process.env.QUEUE_TEA_PACKAGED === undefined, 'needs a build');
var BUNDLE = (0, node_path_1.join)(__dirname, '../dist/mac-arm64/Queue-tea.app');
var STAGE = (0, node_path_1.join)(__dirname, '../dist/stage/mac-arm64/Queue-tea stage.app');
var run = (0, node_util_1.promisify)(node_child_process_1.execFile);
var home;
var repo;
var file;
var app;
var page;
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
var plist = function (key) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, run('plutil', ['-extract', key, 'raw', (0, node_path_1.join)(BUNDLE, 'Contents/Info.plist')])];
        case 1: return [2 /*return*/, (_a.sent()).stdout.trim()];
    }
}); }); };
test_1.test.beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, record;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = promises_1.realpath;
                return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-packaged-'))];
            case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
            case 2:
                home = _b.sent();
                repo = (0, node_path_1.join)(home, 'demo');
                file = (0, node_path_1.join)(home, '.queue-tea/projects', "".concat((0, record_source_1.projectKey)(repo), ".json"));
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, '.queue-tea/projects'), { recursive: true })];
            case 3:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, '.queue-tea/sessions'), { recursive: true })];
            case 4:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)(repo)];
            case 5:
                _b.sent();
                return [4 /*yield*/, run('git', ['init', '--bare', '-b', 'main', (0, node_path_1.join)(home, 'remote.git')])];
            case 6:
                _b.sent();
                return [4 /*yield*/, git('init', '-b', 'main')];
            case 7:
                _b.sent();
                return [4 /*yield*/, git('config', 'user.email', 'test@example.com')];
            case 8:
                _b.sent();
                return [4 /*yield*/, git('config', 'user.name', 'Test')];
            case 9:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(repo, 'a.txt'), 'a\n')];
            case 10:
                _b.sent();
                return [4 /*yield*/, git('add', '.')];
            case 11:
                _b.sent();
                return [4 /*yield*/, git('commit', '-m', 'first')];
            case 12:
                _b.sent();
                return [4 /*yield*/, git('remote', 'add', 'origin', (0, node_path_1.join)(home, 'remote.git'))];
            case 13:
                _b.sent();
                return [4 /*yield*/, git('push', '-u', 'origin', 'main')];
            case 14:
                _b.sent();
                record = __assign(__assign({}, (0, record_source_1.emptyRecord)('demo', repo)), { tasks: [(0, fixtures_1.makeTask)({ id: 'one', title: 'Packaged quest' })] });
                return [4 /*yield*/, (0, promises_1.writeFile)(file, JSON.stringify(record))
                    // A session is open, so Start asks it and no real terminal opens.
                ];
            case 15:
                _b.sent();
                // A session is open, so Start asks it and no real terminal opens.
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(home, '.queue-tea/sessions/s-1.json'), JSON.stringify({ id: 's-1', projectPath: repo, recordFile: file, currentTaskId: null, isTurnRunning: false, cup: { mood: 'idle', line: '' }, allowance: null, options: {}, heartbeat: Date.now() + 600000, startedAt: Date.now() }))];
            case 16:
                // A session is open, so Start asks it and no real terminal opens.
                _b.sent();
                return [4 /*yield*/, test_1._electron.launch({
                        executablePath: (0, node_path_1.join)(BUNDLE, 'Contents/MacOS/Queue-tea'),
                        args: [],
                        // The PATH an app opened from the Finder gets, with no shell behind it.
                        env: { HOME: home, PATH: '/usr/bin:/bin:/usr/sbin:/sbin', QUEUE_TEA_USER_DATA: (0, node_path_1.join)(home, 'user-data') },
                    })];
            case 17:
                app = _b.sent();
                return [4 /*yield*/, app.firstWindow()];
            case 18:
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
(0, test_1.test)('the bundle is signed, and claims its link', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, run('codesign', ['--verify', '--deep', '--strict', BUNDLE])];
            case 1:
                _d.sent();
                _a = test_1.expect;
                return [4 /*yield*/, plist('CFBundleIdentifier')];
            case 2:
                _a.apply(void 0, [_d.sent()]).toBe('dev.queue-tea.app');
                _b = test_1.expect;
                return [4 /*yield*/, plist('CFBundleURLTypes.0.CFBundleURLSchemes.0')];
            case 3:
                _b.apply(void 0, [_d.sent()]).toBe('queue-tea');
                _c = test_1.expect;
                return [4 /*yield*/, plist('CFBundleIconFile')];
            case 4:
                _c.apply(void 0, [_d.sent()]).toMatch(/\.icns$/);
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('it runs as the packaged prod app', function () { return __awaiter(void 0, void 0, void 0, function () {
    var info;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, app.evaluate(function (_a) {
                    var electronApp = _a.app;
                    return ({ isPackaged: electronApp.isPackaged, name: electronApp.getName() });
                })];
            case 1:
                info = _a.sent();
                (0, test_1.expect)(info).toEqual({ isPackaged: true, name: 'Queue-tea' });
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('it reads the realm, with its fonts', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, test_1.expect)(page.getByRole('button', { name: /^Start ★/ })).toBeVisible()];
            case 1:
                _b.sent();
                _a = test_1.expect;
                return [4 /*yield*/, page.evaluate(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, document.fonts.ready];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/, document.fonts.check('16px Marcellus')];
                            }
                        });
                    }); })];
            case 2:
                _a.apply(void 0, [_b.sent()]).toBe(true);
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('the art bundled from outside the app folder is there', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _loop_1, _i, _a, img;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, page.getByRole('link', { name: 'Guild Hall' }).click()];
            case 1:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.member')).toHaveCount(4)];
            case 2:
                _b.sent();
                _loop_1 = function (img) {
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, test_1.expect.poll(function () { return img.evaluate(function (el) { return el.naturalWidth; }); }).toBeGreaterThan(0)];
                            case 1:
                                _c.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0;
                return [4 /*yield*/, page.locator('.portrait img, .guild-h img').all()];
            case 3:
                _a = _b.sent();
                _b.label = 4;
            case 4:
                if (!(_i < _a.length)) return [3 /*break*/, 7];
                img = _a[_i];
                return [5 /*yield**/, _loop_1(img)];
            case 5:
                _b.sent();
                _b.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 4];
            case 7: return [4 /*yield*/, page.getByRole('link', { name: 'Home', exact: true }).click()];
            case 8:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('git works from the PATH the Finder gives it: Start makes the branch', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, page.getByRole('button', { name: 'Start ★ Packaged quest' }).click()];
            case 1:
                _e.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('heading', { name: 'Packaged quest' })).toBeVisible()];
            case 2:
                _e.sent();
                _a = test_1.expect;
                return [4 /*yield*/, git('branch', '--show-current')];
            case 3:
                _a.apply(void 0, [_e.sent()]).toBe('task/packaged-quest');
                _b = test_1.expect;
                _d = (_c = JSON).parse;
                return [4 /*yield*/, (0, promises_1.readFile)(file, 'utf8')];
            case 4:
                _b.apply(void 0, [_d.apply(_c, [_e.sent()]).requests.map(function (q) { return q.kind; })]).toEqual(['begin']);
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('the stage build stands beside it, with its own id, and leaves the link alone', function () { return __awaiter(void 0, void 0, void 0, function () {
    var info, _a, stage, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                info = (0, node_path_1.join)(STAGE, 'Contents/Info.plist');
                return [4 /*yield*/, run('codesign', ['--verify', '--deep', '--strict', STAGE])];
            case 1:
                _c.sent();
                _a = test_1.expect;
                return [4 /*yield*/, run('plutil', ['-extract', 'CFBundleIdentifier', 'raw', info])];
            case 2:
                _a.apply(void 0, [(_c.sent()).stdout.trim()]).toBe('dev.queue-tea.app.stage');
                return [4 /*yield*/, (0, test_1.expect)(run('plutil', ['-extract', 'CFBundleURLTypes', 'raw', info])).rejects.toThrow()];
            case 3:
                _c.sent();
                return [4 /*yield*/, test_1._electron.launch({ executablePath: (0, node_path_1.join)(STAGE, 'Contents/MacOS/Queue-tea stage'), args: [], env: { HOME: home, PATH: '/usr/bin:/bin', QUEUE_TEA_USER_DATA: (0, node_path_1.join)(home, 'stage-data') } })];
            case 4:
                stage = _c.sent();
                _c.label = 5;
            case 5:
                _c.trys.push([5, , 7, 9]);
                _b = test_1.expect;
                return [4 /*yield*/, stage.evaluate(function (_a) {
                        var electronApp = _a.app;
                        return electronApp.getName();
                    })];
            case 6:
                _b.apply(void 0, [_c.sent()]).toBe('Queue-tea stage');
                return [3 /*break*/, 9];
            case 7: return [4 /*yield*/, stage.close()];
            case 8:
                _c.sent();
                return [7 /*endfinally*/];
            case 9: return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('the menu bar is the app\'s own', function () { return __awaiter(void 0, void 0, void 0, function () {
    var labels;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, app.evaluate(function (_a) {
                    var Menu = _a.Menu;
                    return Menu.getApplicationMenu().items.map(function (item) { return item.label; });
                })];
            case 1:
                labels = _a.sent();
                (0, test_1.expect)(labels.slice(0, 5)).toEqual(['Queue-tea', 'File', 'Edit', 'Quest', 'View']);
                return [2 /*return*/];
        }
    });
}); });
