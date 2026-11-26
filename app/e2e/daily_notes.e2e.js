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
// Daily notes end to end: Today and Open day make real Markdown files in
// Journal, from the realm's own "Daily template" note.
var APP = (0, node_path_1.join)(__dirname, '..');
var KEY = 'diary-abc123';
var home;
var app;
var page;
var errors = [];
var notesDir = function () { return (0, node_path_1.join)(home, '.queue-tea/notes', KEY); };
var at = new Date();
var today = "".concat(at.getFullYear(), "-").concat(String(at.getMonth() + 1).padStart(2, '0'), "-").concat(String(at.getDate()).padStart(2, '0'));
// A day in another month, so the journal shows two month groups.
var OTHER = today.slice(5, 7) === '01' ? "".concat(Number(today.slice(0, 4)) - 1, "-12-01") : "".concat(today.slice(0, 4), "-01-15");
var fileTitled = function (title) { return __awaiter(void 0, void 0, void 0, function () {
    var _i, _a, name_1, text, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _i = 0;
                return [4 /*yield*/, (0, promises_1.readdir)(notesDir())];
            case 1:
                _a = _c.sent();
                _c.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 7];
                name_1 = _a[_i];
                if (!name_1.endsWith('.md')) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(notesDir(), name_1), 'utf8')];
            case 3:
                _b = _c.sent();
                return [3 /*break*/, 5];
            case 4:
                _b = '';
                _c.label = 5;
            case 5:
                text = _b;
                if (text.includes("title: \"".concat(title, "\"")))
                    return [2 /*return*/, text];
                _c.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 2];
            case 7: throw new Error("No note file titled ".concat(title));
        }
    });
}); };
test_1.test.beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-daily-'))];
            case 1:
                home = _a.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, 'diary'))];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, '.queue-tea/projects'), { recursive: true })];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, '.queue-tea/sessions'), { recursive: true })];
            case 4:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(home, '.queue-tea/projects', "".concat(KEY, ".json")), JSON.stringify({ version: 2, project: { name: 'Diary', path: (0, node_path_1.join)(home, 'diary') }, docsLogPath: null, playNext: null, feature: null, tasks: [], unassignedMinutesByDay: {}, requests: [] }))];
            case 5:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)(notesDir(), { recursive: true })];
            case 6:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(notesDir(), 'Daily template.md'), '---\ntitle: Daily template\n---\n## Plan for {{date}}\n\n- [ ] ')];
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
                return [4 /*yield*/, page.getByRole('button', { name: /^Diary/ }).click()];
            case 11:
                _a.sent();
                return [4 /*yield*/, page.keyboard.press('Meta+7')];
            case 12:
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
(0, test_1.test)("Today makes today's note in Journal from the realm's daily template", function () { return __awaiter(void 0, void 0, void 0, function () {
    var text;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.getByRole('button', { name: "Open today's note, ".concat(today) }).click()];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByLabel('Title *')).toHaveValue(today)];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('combobox', { name: 'Note' })).toBeFocused()];
            case 3:
                _a.sent();
                return [4 /*yield*/, test_1.expect.poll(function () { return fileTitled(today).catch(function () { return ''; }); }).toContain("## Plan for ".concat(today))];
            case 4:
                _a.sent();
                return [4 /*yield*/, fileTitled(today)];
            case 5:
                text = _a.sent();
                (0, test_1.expect)(text).toContain('folder: "Journal"');
                (0, test_1.expect)(text).toContain('type: "daily"');
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('Today again opens the same note, and the journal lists it', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, page.getByRole('button', { name: "Open today's note, ".concat(today) }).click()];
            case 1:
                _b.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Journal (1)' }).click()];
            case 2:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('heading', { name: 'Journal 1' })).toBeVisible()];
            case 3:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('button', { name: new RegExp("^".concat(today)) })).toBeVisible()];
            case 4:
                _b.sent();
                _a = test_1.expect;
                return [4 /*yield*/, (0, promises_1.readdir)(notesDir())];
            case 5:
                _a.apply(void 0, [(_b.sent()).filter(function (name) { return name.endsWith('.md'); })]).toHaveLength(2);
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('the day field says what is wrong, and Open day makes another day', function () { return __awaiter(void 0, void 0, void 0, function () {
    var day;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                day = page.getByLabel('Day *');
                return [4 /*yield*/, day.fill('')
                    // Tab in a date field steps between its parts, so leave the field outright.
                ];
            case 1:
                _a.sent();
                // Tab in a date field steps between its parts, so leave the field outright.
                return [4 /*yield*/, day.blur()];
            case 2:
                // Tab in a date field steps between its parts, so leave the field outright.
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText('Day is required.')).toBeVisible()];
            case 3:
                _a.sent();
                return [4 /*yield*/, day.fill(OTHER)];
            case 4:
                _a.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Open day' }).click()];
            case 5:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByLabel('Title *')).toHaveValue(OTHER)];
            case 6:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('heading', { name: 'Journal 2' })).toBeVisible()];
            case 7:
                _a.sent();
                return [4 /*yield*/, test_1.expect.poll(function () { return fileTitled(OTHER).catch(function () { return ''; }); }).toContain("## Plan for ".concat(OTHER))];
            case 8:
                _a.sent();
                (0, test_1.expect)(errors).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
