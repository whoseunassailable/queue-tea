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
// The Notes graph end to end, on a realm of 5,000 notes that link to each other.
var APP = (0, node_path_1.join)(__dirname, '..');
var KEY = 'gait-abc123';
var COUNT = 5000;
var home;
var app;
var page;
var errors = [];
test_1.test.beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    var dir;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-graph-'))];
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
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(home, '.queue-tea/projects', "".concat(KEY, ".json")), JSON.stringify({ version: 2, project: { name: 'Gait-feedback', path: (0, node_path_1.join)(home, 'gait') }, docsLogPath: null, playNext: null, feature: null, tasks: [], unassignedMinutesByDay: {}, requests: [] }))];
            case 5:
                _a.sent();
                dir = (0, node_path_1.join)(home, '.queue-tea/notes', KEY);
                return [4 /*yield*/, (0, promises_1.mkdir)(dir, { recursive: true })];
            case 6:
                _a.sent();
                return [4 /*yield*/, Promise.all(Array.from({ length: COUNT }, function (_, i) { return (0, promises_1.writeFile)((0, node_path_1.join)(dir, "Note ".concat(i, ".md")), "---\ntitle: Note ".concat(i, "\n---\n[[Note ").concat((i + 1) % COUNT, "]]\n[[Note ").concat((i * 7) % COUNT, "]]")); }))];
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
(0, test_1.test)('Graph shows the notes around the open note', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.keyboard.press('Meta+7')];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByLabel('Title *')).toHaveValue(/^Note \d+$/, { timeout: 30000 })];
            case 2:
                _a.sent();
                return [4 /*yield*/, page.keyboard.press('Meta+g')];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('group', { name: /^Graph around / })).toBeVisible()];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('the whole realm of 5,000 notes settles within 3 seconds', function () { return __awaiter(void 0, void 0, void 0, function () {
    var started, map, took;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                started = Date.now();
                return [4 /*yield*/, page.getByRole('button', { name: 'Whole realm' }).click()];
            case 1:
                _a.sent();
                map = page.getByRole('group', { name: 'Graph of the whole realm: 5,000 notes and 0 quests' });
                return [4 /*yield*/, (0, test_1.expect)(map).toHaveAttribute('aria-busy', 'false', { timeout: 30000 })];
            case 2:
                _a.sent();
                took = Date.now() - started;
                test_1.test.info().annotations.push({ type: 'settled', description: "".concat(took, " ms") });
                (0, test_1.expect)(took).toBeLessThan(3000);
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('a node opened from the keyboard opens its note', function () { return __awaiter(void 0, void 0, void 0, function () {
    var before, map;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.getByLabel('Title *').inputValue()];
            case 1:
                before = _a.sent();
                map = page.getByRole('group', { name: /^Graph of the whole realm/ });
                return [4 /*yield*/, (0, test_1.expect)(map).toHaveAttribute('aria-busy', 'false')];
            case 2:
                _a.sent();
                return [4 /*yield*/, map.focus()];
            case 3:
                _a.sent();
                return [4 /*yield*/, page.keyboard.press('ArrowRight')];
            case 4:
                _a.sent();
                return [4 /*yield*/, page.keyboard.press('Enter')];
            case 5:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByLabel('Title *')).toHaveValue(/^Note \d+$/)];
            case 6:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByLabel('Title *')).not.toHaveValue(before)];
            case 7:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('the page logged no errors', function () {
    (0, test_1.expect)(errors).toEqual([]);
});
