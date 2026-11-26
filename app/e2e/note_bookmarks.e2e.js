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
var KEY = 'marks-abc123';
// The guard refuses this Mac before any request, so the test needs no network.
var LINK = 'http://127.0.0.1:9/post';
var home;
var app;
var page;
var note = function () { return (0, promises_1.readFile)((0, node_path_1.join)(home, '.queue-tea/notes', KEY, 'Marks.md'), 'utf8'); };
// What Edit ▸ Paste and ⌘V do: paste the clipboard into whatever has focus.
var paste = function (text) { return app.evaluate(function (_a, text) {
    var BrowserWindow = _a.BrowserWindow, clipboard = _a.clipboard;
    clipboard.writeText(text);
    BrowserWindow.getAllWindows()[0].webContents.paste();
}, text); };
test_1.test.beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-bookmarks-'))];
            case 1:
                home = _a.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, 'project'))];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, '.queue-tea/projects'), { recursive: true })];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, '.queue-tea/notes', KEY), { recursive: true })];
            case 4:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(home, '.queue-tea/projects', "".concat(KEY, ".json")), JSON.stringify({ version: 2, project: { name: 'Mark notes', path: (0, node_path_1.join)(home, 'project') }, tasks: [], requests: [] }))];
            case 5:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(home, '.queue-tea/notes', KEY, 'Marks.md'), '---\ntitle: Marks\n---\nReading list')];
            case 6:
                _a.sent();
                return [4 /*yield*/, test_1._electron.launch({ args: [(0, node_path_1.join)(APP, 'out/main/main.js')], cwd: APP, env: __assign(__assign({}, process.env), { HOME: home, QUEUE_TEA_USER_DATA: (0, node_path_1.join)(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' }) })];
            case 7:
                app = _a.sent();
                return [4 /*yield*/, app.firstWindow()];
            case 8:
                page = _a.sent();
                return [4 /*yield*/, page.setViewportSize({ width: 1440, height: 900 })];
            case 9:
                _a.sent();
                return [4 /*yield*/, page.getByRole('button', { name: /^Mark notes/ }).click()];
            case 10:
                _a.sent();
                return [4 /*yield*/, page.keyboard.press('Meta+7')];
            case 11:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByLabel('Title *')).toHaveValue('Marks')];
            case 12:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
test_1.test.afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (page === null || page === void 0 ? void 0 : page.close())];
            case 1:
                _a.sent();
                return [4 /*yield*/, (app === null || app === void 0 ? void 0 : app.close())];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.rm)(home, { recursive: true, force: true })];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('a link pasted in Read goes in on a line of its own, saves, and its card says the guard refused it', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.getByRole('button', { name: 'Read', exact: true }).click()];
            case 1:
                _a.sent();
                return [4 /*yield*/, page.getByText('Reading list').click()];
            case 2:
                _a.sent();
                return [4 /*yield*/, paste(LINK)];
            case 3:
                _a.sent();
                return [4 /*yield*/, test_1.expect.poll(note).toContain("Reading list\n\n".concat(LINK))];
            case 4:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('alert')).toContainText('Queue-tea previews only public web pages')];
            case 5:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('link', { name: 'Open 127.0.0.1:9 (127.0.0.1:9) in the browser' })).toBeVisible()];
            case 6:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('turning to Read with ⌘E from Write and pasting a link at once puts it in the note', function () { return __awaiter(void 0, void 0, void 0, function () {
    var body;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.getByRole('button', { name: 'Write', exact: true }).click()];
            case 1:
                _a.sent();
                body = page.getByRole('combobox', { name: 'Note' });
                return [4 /*yield*/, body.click()];
            case 2:
                _a.sent();
                return [4 /*yield*/, body.press('Meta+e')];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.nt-read')).toBeVisible()];
            case 4:
                _a.sent();
                return [4 /*yield*/, paste('http://127.0.0.1:9/second')];
            case 5:
                _a.sent();
                return [4 /*yield*/, test_1.expect.poll(note).toContain('http://127.0.0.1:9/second')];
            case 6:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
