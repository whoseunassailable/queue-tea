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
var node_crypto_1 = require("node:crypto");
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var test_1 = require("@playwright/test");
// Export notes and Restore from backup end to end: the backup is a real
// folder beside the vault, and restore puts back what went missing.
var APP = (0, node_path_1.join)(__dirname, '..');
var KEY = 'backup-abc123';
var PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aWQAAAABJRU5ErkJggg==', 'base64');
var PICTURE = "attachments/".concat((0, node_crypto_1.createHash)('sha256').update(PNG).digest('hex'), ".png");
var PLAN = '---\ntitle: Plan\nupdated: 2026-11-10T09:00:00\n---\nThe plan.\n\n![Diagram](<' + PICTURE + '>)\n';
var WINDOWS = '---\r\ntitle: Windows\r\nupdated: 2026-11-01T09:00:00\r\n---\r\nLine one\r\nLine two\r\n';
var EXPORTED = ['Plan.md', 'Windows.md', PICTURE, 'table.csv'];
var home;
var app;
var page;
var errors = [];
var vault = function () { return (0, node_path_1.join)(home, '.queue-tea/notes', KEY); };
var backups = function () { return (0, node_path_1.join)(home, 'Backups'); };
// The folder picker is the operating system's, so only it stands in for itself.
var pickerAnswers = function (path) {
    return app.evaluate(function (_a, folder) {
        var dialog = _a.dialog;
        var asked = [];
        globalThis.asked = asked;
        dialog.showOpenDialog = (function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return __awaiter(void 0, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    asked.push((_a = args.at(-1).buttonLabel) !== null && _a !== void 0 ? _a : '');
                    return [2 /*return*/, { canceled: false, filePaths: [folder] }];
                });
            });
        });
    }, path);
};
var pickerButtons = function () { return app.evaluate(function () { var _a; return (_a = globalThis.asked) !== null && _a !== void 0 ? _a : []; }); };
test_1.test.beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-backup-'))];
            case 1:
                home = _a.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, 'project'))];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)(backups())];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, '.queue-tea/projects'), { recursive: true })];
            case 4:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(vault(), 'attachments'), { recursive: true })];
            case 5:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(home, '.queue-tea/projects', "".concat(KEY, ".json")), JSON.stringify({ version: 2, project: { name: 'Backup notes', path: (0, node_path_1.join)(home, 'project') }, tasks: [], requests: [] }))];
            case 6:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(vault(), 'Plan.md'), PLAN)];
            case 7:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(vault(), 'Windows.md'), WINDOWS)];
            case 8:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(vault(), PICTURE), PNG)];
            case 9:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(vault(), 'table.csv'), 'a,b\n1,2\n')];
            case 10:
                _a.sent();
                return [4 /*yield*/, test_1._electron.launch({ args: [(0, node_path_1.join)(APP, 'out/main/main.js')], cwd: APP, env: __assign(__assign({}, process.env), { HOME: home, QUEUE_TEA_USER_DATA: (0, node_path_1.join)(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' }) })];
            case 11:
                app = _a.sent();
                return [4 /*yield*/, app.firstWindow()];
            case 12:
                page = _a.sent();
                page.on('pageerror', function (error) { return errors.push(String(error)); });
                return [4 /*yield*/, page.setViewportSize({ width: 1440, height: 900 })];
            case 13:
                _a.sent();
                return [4 /*yield*/, page.getByRole('button', { name: /^Backup notes/ }).click()];
            case 14:
                _a.sent();
                return [4 /*yield*/, page.keyboard.press('Meta+7')];
            case 15:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByLabel('Title *')).toHaveValue('Plan')];
            case 16:
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
(0, test_1.test)('Export notes copies the vault into a new backup folder byte for byte, and Restore puts back what went missing', function (_a, testInfo_1) { return __awaiter(void 0, [_a, testInfo_1], void 0, function (_b, testInfo) {
    var exported, _c, folder, backup, _d, _i, EXPORTED_1, path, _e, _f, _g, _h, _j, _k, restored, _l, _m, EXPORTED_2, path, _o, _p, _q, _r, again, _s;
    return __generator(this, function (_t) {
        switch (_t.label) {
            case 0: return [4 /*yield*/, pickerAnswers(backups())];
            case 1:
                _t.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Export notes…' }).click()];
            case 2:
                _t.sent();
                exported = page.getByRole('dialog', { name: 'Notes exported' });
                return [4 /*yield*/, (0, test_1.expect)(exported.getByText(/^Saved 2 notes and 2 files in “Notes backup backup-abc123 \d{4}-\d\d-\d\d”\.$/)).toBeVisible()];
            case 3:
                _t.sent();
                return [4 /*yield*/, (0, test_1.expect)(exported.getByText("Note history stays in Queue-tea; it isn't in the backup.")).toBeVisible()];
            case 4:
                _t.sent();
                _c = test_1.expect;
                return [4 /*yield*/, pickerButtons()];
            case 5:
                _c.apply(void 0, [_t.sent()]).toEqual(['Export here']);
                return [4 /*yield*/, (0, promises_1.readdir)(backups())];
            case 6:
                folder = (_t.sent())[0];
                backup = (0, node_path_1.join)(backups(), folder);
                _d = test_1.expect;
                return [4 /*yield*/, (0, promises_1.readdir)(backup)];
            case 7:
                _d.apply(void 0, [(_t.sent()).sort()]).toEqual(['Plan.md', 'Windows.md', 'attachments', 'queue-tea-notes.json', 'table.csv']);
                _i = 0, EXPORTED_1 = EXPORTED;
                _t.label = 8;
            case 8:
                if (!(_i < EXPORTED_1.length)) return [3 /*break*/, 12];
                path = EXPORTED_1[_i];
                _f = test_1.expect;
                return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(backup, path))];
            case 9:
                _g = (_e = _f.apply(void 0, [_t.sent(), path])).toEqual;
                return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(vault(), path))];
            case 10:
                _g.apply(_e, [_t.sent()]);
                _t.label = 11;
            case 11:
                _i++;
                return [3 /*break*/, 8];
            case 12:
                _h = test_1.expect;
                _k = (_j = JSON).parse;
                return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(backup, 'queue-tea-notes.json'), 'utf8')];
            case 13:
                _h.apply(void 0, [_k.apply(_j, [_t.sent()])]).toMatchObject({ format: 1, realm: KEY, notes: 2, files: 2 });
                return [4 /*yield*/, exported.getByRole('button', { name: 'Close' }).click()];
            case 14:
                _t.sent();
                return [4 /*yield*/, (0, test_1.expect)(exported).toBeHidden()
                    // Lost outside the app: a note and the picture it shows.
                ];
            case 15:
                _t.sent();
                // Lost outside the app: a note and the picture it shows.
                return [4 /*yield*/, (0, promises_1.rm)((0, node_path_1.join)(vault(), 'Windows.md'))];
            case 16:
                // Lost outside the app: a note and the picture it shows.
                _t.sent();
                return [4 /*yield*/, (0, promises_1.rm)((0, node_path_1.join)(vault(), PICTURE))];
            case 17:
                _t.sent();
                return [4 /*yield*/, pickerAnswers(backup)];
            case 18:
                _t.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Restore from backup…' }).click()];
            case 19:
                _t.sent();
                restored = page.getByRole('dialog', { name: 'Notes restored' });
                return [4 /*yield*/, (0, test_1.expect)(restored.getByText('Added 1 note and 1 file.')).toBeVisible()];
            case 20:
                _t.sent();
                return [4 /*yield*/, (0, test_1.expect)(restored.getByText('1 note was already here.')).toBeVisible()];
            case 21:
                _t.sent();
                _l = test_1.expect;
                return [4 /*yield*/, pickerButtons()];
            case 22:
                _l.apply(void 0, [_t.sent()]).toEqual(['Restore']);
                _m = 0, EXPORTED_2 = EXPORTED;
                _t.label = 23;
            case 23:
                if (!(_m < EXPORTED_2.length)) return [3 /*break*/, 27];
                path = EXPORTED_2[_m];
                _p = test_1.expect;
                return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(vault(), path))];
            case 24:
                _q = (_o = _p.apply(void 0, [_t.sent(), path])).toEqual;
                return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(backup, path))];
            case 25:
                _q.apply(_o, [_t.sent()]);
                _t.label = 26;
            case 26:
                _m++;
                return [3 /*break*/, 23];
            case 27:
                _r = test_1.expect;
                return [4 /*yield*/, (0, promises_1.readdir)(vault())];
            case 28:
                _r.apply(void 0, [_t.sent()]).not.toContain('queue-tea-notes.json');
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('navigation', { name: 'Notes' }).getByRole('button', { name: /^Windows/ })).toBeVisible()];
            case 29:
                _t.sent();
                return [4 /*yield*/, page.screenshot({ path: testInfo.outputPath('restored.png'), fullPage: true })];
            case 30:
                _t.sent();
                return [4 /*yield*/, restored.getByRole('button', { name: 'Close' }).click()];
            case 31:
                _t.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Restore from backup…' }).click()];
            case 32:
                _t.sent();
                again = page.getByRole('dialog', { name: 'Notes restored' });
                return [4 /*yield*/, (0, test_1.expect)(again.getByText('Everything in this backup is already in your notes.')).toBeVisible()];
            case 33:
                _t.sent();
                _s = test_1.expect;
                return [4 /*yield*/, (0, promises_1.readdir)(vault())];
            case 34:
                _s.apply(void 0, [(_t.sent()).sort()]).toEqual(['Plan.md', 'Windows.md', 'attachments', 'table.csv']);
                return [4 /*yield*/, again.getByRole('button', { name: 'Close' }).click()];
            case 35:
                _t.sent();
                return [4 /*yield*/, (0, test_1.expect)(again).toBeHidden()];
            case 36:
                _t.sent();
                (0, test_1.expect)(errors).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('the result dialog dims the whole window, as every other dialog does, not just the notes list', function () { return __awaiter(void 0, void 0, void 0, function () {
    var exported, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, pickerAnswers(backups())];
            case 1:
                _b.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Export notes…' }).click()];
            case 2:
                _b.sent();
                exported = page.getByRole('dialog', { name: 'Notes exported' });
                return [4 /*yield*/, (0, test_1.expect)(exported).toBeVisible()];
            case 3:
                _b.sent();
                _a = test_1.expect;
                return [4 /*yield*/, exported.locator('xpath=..').boundingBox()];
            case 4:
                _a.apply(void 0, [_b.sent()]).toEqual({ x: 0, y: 0, width: 1440, height: 900 });
                return [4 /*yield*/, exported.getByRole('button', { name: 'Close' }).click()];
            case 5:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(exported).toBeHidden()];
            case 6:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
