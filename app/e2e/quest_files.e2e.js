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
var APP = (0, node_path_1.join)(__dirname, '..');
var KEY = 'quest-files-abc123';
var PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aWQAAAABJRU5ErkJggg==', 'base64');
var SAVED = "attachments/".concat((0, node_crypto_1.createHash)('sha256').update(PNG).digest('hex'), ".png");
var home;
var file;
var app;
var page;
var errors = [];
var task = function (over) {
    return (__assign({ state: 'queued', priority: 'mid', difficulty: { expected: 'medium', actual: null }, messages: [], handoff: null, branch: null, baseBranch: null, startCommit: null, blockedBy: [], blockedReason: null, checkpoint: null, created: '2026-10-20T09:00:00+02:00', started: null, finished: null, minutesByDay: {}, effort: { understandingMessages: 0, improvingMessages: 0, filesRead: 0, filesChanged: 0, linesAdded: 0, linesRemoved: 0, filesTouched: 0 }, files: { read: [], changed: [] }, parentId: null, description: null, criteria: [], review: null }, over));
};
var SEED = {
    version: 1,
    project: { name: 'Quest files', path: '/p/quest-files' },
    docsLogPath: null,
    playNext: null,
    feature: null,
    tasks: [task({ id: 'one', title: 'Retry button', priority: 'high', description: 'Why it matters' })],
    unassignedMinutesByDay: {},
    requests: [],
};
var stored = function () { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
    switch (_c.label) {
        case 0:
            _b = (_a = JSON).parse;
            return [4 /*yield*/, (0, promises_1.readFile)(file, 'utf8')];
        case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()]).tasks[0]];
    }
}); }); };
test_1.test.beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-quest-files-'))];
            case 1:
                home = _a.sent();
                file = (0, node_path_1.join)(home, '.queue-tea/projects', "".concat(KEY, ".json"));
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, '.queue-tea/projects'), { recursive: true })];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)(file, JSON.stringify(SEED, null, 2))];
            case 3:
                _a.sent();
                return [4 /*yield*/, test_1._electron.launch({ args: [(0, node_path_1.join)(APP, 'out/main/main.js')], cwd: APP, env: __assign(__assign({}, process.env), { HOME: home, QUEUE_TEA_USER_DATA: (0, node_path_1.join)(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' }) })];
            case 4:
                app = _a.sent();
                return [4 /*yield*/, app.firstWindow()];
            case 5:
                page = _a.sent();
                page.on('pageerror', function (error) { return errors.push(String(error)); });
                return [4 /*yield*/, page.setViewportSize({ width: 1440, height: 900 })];
            case 6:
                _a.sent();
                return [4 /*yield*/, page.getByRole('link', { name: 'Quests', exact: true }).click()];
            case 7:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.detail').getByRole('textbox', { name: 'Description' })).toHaveValue('Why it matters')];
            case 8:
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
(0, test_1.test)("an image picked for a quest's description is kept in the realm's notes folder, linked in the record, and previewed under the box until its link goes", function () { return __awaiter(void 0, void 0, void 0, function () {
    var detail, box, _a, vault, _b, _c, preview;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                detail = page.locator('.detail');
                box = detail.getByRole('textbox', { name: 'Description' });
                return [4 /*yield*/, detail.getByLabel('Attach file…', { exact: true }).setInputFiles({ name: 'mock.png', mimeType: 'image/png', buffer: PNG })
                    // Main keeps a description trimmed, and the box shows what main kept.
                ];
            case 1:
                _d.sent();
                // Main keeps a description trimmed, and the box shows what main kept.
                return [4 /*yield*/, (0, test_1.expect)(box).toHaveValue("Why it matters\n![mock.png](<".concat(SAVED, ">)"))];
            case 2:
                // Main keeps a description trimmed, and the box shows what main kept.
                _d.sent();
                _a = test_1.expect;
                return [4 /*yield*/, stored()];
            case 3:
                _a.apply(void 0, [(_d.sent()).description]).toBe("Why it matters\n![mock.png](<".concat(SAVED, ">)"));
                vault = (0, node_path_1.join)(home, '.queue-tea/notes', KEY);
                _b = test_1.expect;
                return [4 /*yield*/, (0, promises_1.readdir)((0, node_path_1.join)(vault, 'attachments'))];
            case 4:
                _b.apply(void 0, [_d.sent()]).toEqual([SAVED.split('/')[1]]);
                _c = test_1.expect;
                return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(vault, SAVED))];
            case 5:
                _c.apply(void 0, [_d.sent()]).toEqual(PNG);
                preview = detail.getByAltText('mock.png');
                return [4 /*yield*/, (0, test_1.expect)(preview).toBeVisible()
                    // The image came through the notes protocol, not a broken link.
                ];
            case 6:
                _d.sent();
                // The image came through the notes protocol, not a broken link.
                return [4 /*yield*/, test_1.expect.poll(function () { return preview.evaluate(function (image) { return image.naturalWidth; }); }).toBe(1)];
            case 7:
                // The image came through the notes protocol, not a broken link.
                _d.sent();
                return [4 /*yield*/, box.fill('Why it matters')];
            case 8:
                _d.sent();
                return [4 /*yield*/, box.blur()];
            case 9:
                _d.sent();
                return [4 /*yield*/, (0, test_1.expect)(preview).toHaveCount(0)];
            case 10:
                _d.sent();
                return [4 /*yield*/, test_1.expect.poll(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, stored()];
                            case 1: return [2 /*return*/, (_a.sent()).description];
                        }
                    }); }); }).toBe('Why it matters')];
            case 11:
                _d.sent();
                (0, test_1.expect)(errors).toEqual([]);
                return [2 /*return*/];
        }
    });
}); });
