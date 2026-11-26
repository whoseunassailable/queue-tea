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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_child_process_1 = require("node:child_process");
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var node_util_1 = require("node:util");
var test_1 = require("@playwright/test");
// The Designs tab on a realm that is a git folder with sample designs: the
// editor's gestures need real pointer events and layout, so they're covered here.
var APP = (0, node_path_1.join)(__dirname, '..');
var run = (0, node_util_1.promisify)(node_child_process_1.execFile);
var home;
var realm;
var app;
var page;
var errors = [];
var json = function (value) { return "".concat(JSON.stringify(value, null, 2), "\n"); };
var designFile = function (folder, file) { return (0, node_path_1.join)(realm, 'docs/designs', folder, file); };
var onDisk = function (folder, file) { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
    switch (_c.label) {
        case 0:
            _b = (_a = JSON).parse;
            return [4 /*yield*/, (0, promises_1.readFile)(designFile(folder, file), 'utf8')];
        case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
    }
}); }); };
var layerOn = function (id) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, onDisk('5.4.3', 'welcome.design.json')];
        case 1: return [2 /*return*/, (_a.sent()).nodes.flatMap(function (l) { var _a; return __spreadArray([l], ((_a = l.children) !== null && _a !== void 0 ? _a : []), true); }).find(function (l) { return l.id === id; })];
    }
}); }); };
var text = function (id, name, x, y, width, words, size, weight, color, font) {
    if (size === void 0) { size = 15; }
    if (weight === void 0) { weight = 400; }
    if (color === void 0) { color = '#2A2218'; }
    if (font === void 0) { font = 'Nunito Sans'; }
    return ({ id: id, type: 'text', name: name, x: x, y: y, width: width, text: words, font: font, size: size, weight: weight, color: color });
};
var frame = function (id, name, x, y, width, height, fill, radius, children) {
    if (radius === void 0) { radius = 0; }
    if (children === void 0) { children = []; }
    return ({ id: id, type: 'frame', name: name, x: x, y: y, width: width, height: height, fill: fill, radius: radius, children: children });
};
// A layer type the editor doesn't know: it shows as a grey box and is kept.
var CHART = { id: 'chart', type: 'chart', name: 'Stride chart', x: 24, y: 600, width: 342, height: 60, series: [1, 2, 3] };
var HEADLINE = 'Walk better every step';
var WELCOME = {
    format: 1,
    name: 'Welcome',
    width: 390,
    height: 844,
    fill: '#F6F1E7',
    edited: { by: 'claude', at: '2026-11-04T22:20:00.000Z' },
    nodes: [
        frame('hero', 'Hero', 0, 0, 390, 420, '#BFE3D5', 0, [frame('sun', 'Sun', 250, 60, 90, 90, '#FFE9A8', 45)]),
        text('headline', 'Headline', 24, 293, 342, HEADLINE, 28, 400, '#2A2218', 'Marcellus'),
        text('body', 'Body', 24, 340, 342, 'Your insoles listen to each step and play a soft note when your stride starts to drift.', 15, 400, '#54473A'),
        frame('tip', 'Tip card', 24, 467, 342, 104, '#DDF2E8', 12, [text('tip-title', 'Tip title', 16, 16, 310, 'Pair both insoles first', 15, 700, '#1B6650'), text('tip-body', 'Tip body', 16, 44, 310, 'Hold the button on each insole until it glows.', 13, 400, '#1B6650')]),
        frame('cta', 'Get started', 24, 700, 342, 52, '#2E9C7E', 26, [__assign(__assign({}, text('cta-label', 'Label', 0, 15, 342, 'Get started', 16, 800, '#FFFFFF')), { align: 'center' })]),
        CHART,
    ],
};
var PAIR = {
    format: 1,
    name: 'Pair your insoles',
    width: 390,
    height: 844,
    fill: '#FFFAEE',
    edited: { by: 'claude', at: '2026-11-04T22:20:00.000Z' },
    nodes: [text('h', 'Headline', 24, 120, 342, 'Pair your insoles', 30, 400, '#2A2218', 'Marcellus'), frame('l', 'Left insole', 40, 260, 140, 300, '#E2BC66', 70), frame('r', 'Right insole', 210, 260, 140, 300, '#E2BC66', 70)],
};
// A comma missing after "width": 390.
var LIVE_WALK = '{\n  "format": 1,\n  "name": "Live walk",\n  "width": 390\n  "height": 844\n}\n';
var comment = function (id, on, words, over) {
    if (over === void 0) { over = {}; }
    return (__assign({ id: id, design: 'welcome', on: on, text: words, by: 'Rohan', at: '2026-11-05T10:00:00.000Z', resolved: null, sentTo: null }, over));
};
var writeVersion = function (folder, files) { return __awaiter(void 0, void 0, void 0, function () {
    var _i, _a, _b, file, value;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(realm, 'docs/designs', folder), { recursive: true })];
            case 1:
                _c.sent();
                _i = 0, _a = Object.entries(files);
                _c.label = 2;
            case 2:
                if (!(_i < _a.length)) return [3 /*break*/, 5];
                _b = _a[_i], file = _b[0], value = _b[1];
                return [4 /*yield*/, (0, promises_1.writeFile)(designFile(folder, file), typeof value === 'string' ? value : json(value))];
            case 3:
                _c.sent();
                _c.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/];
        }
    });
}); };
test_1.test.beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _i, _a, args;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-designs-'))];
            case 1:
                home = _b.sent();
                realm = (0, node_path_1.join)(home, 'gait');
                return [4 /*yield*/, (0, promises_1.mkdir)(realm)];
            case 2:
                _b.sent();
                _i = 0, _a = [['init', '-q', '-b', 'main'], ['config', 'user.name', 'Rohan Bhande'], ['config', 'user.email', 'rohan@example.com']];
                _b.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 6];
                args = _a[_i];
                return [4 /*yield*/, run('git', args, { cwd: realm })];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: return [4 /*yield*/, writeVersion('5.4.3', {
                    'version.json': { format: 1, label: '5.4.3', made: '2026-11-04T16:20:00-06:00', by: 'claude', from: '5.4.2', designs: ['welcome', 'pair-your-insoles', 'live-walk'] },
                    'welcome.design.json': WELCOME,
                    'pair-your-insoles.design.json': PAIR,
                    'live-walk.design.json': LIVE_WALK,
                    'comments.json': {
                        format: 1,
                        comments: [
                            comment('c1', 'headline', 'Make the headline shorter, it wraps to three lines on a small phone.'),
                            comment('c2', null, 'The hero is too tall: the button drops below the fold on an SE.'),
                            comment('c3', 'tip', 'Use the jade tip card, not grey.', { resolved: '2026-11-04T15:00:00.000Z' }),
                        ],
                    },
                })];
            case 7:
                _b.sent();
                return [4 /*yield*/, writeVersion('onboarding-pass-2', { 'version.json': { format: 1, label: 'Onboarding pass 2', made: '2026-11-01T10:00:00-06:00', by: 'you', from: 'v5', designs: ['welcome'] }, 'welcome.design.json': __assign(__assign({}, WELCOME), { nodes: WELCOME.nodes.slice(0, 3) }) })];
            case 8:
                _b.sent();
                return [4 /*yield*/, writeVersion('5.4.2', { 'version.json': '{ "format": 1, "label": "5.4.2",\n  "made": "2026-10-28T16:02:00-06:00"\n  "designs": [] }\n', 'welcome.design.json': WELCOME })];
            case 9:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, '.queue-tea/projects'), { recursive: true })];
            case 10:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, '.queue-tea/sessions'), { recursive: true })];
            case 11:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(home, '.queue-tea/projects/gait-abc123.json'), JSON.stringify({ version: 2, project: { name: 'Gait-feedback', path: realm }, docsLogPath: null, playNext: null, feature: null, tasks: [], unassignedMinutesByDay: {}, requests: [] }))];
            case 12:
                _b.sent();
                return [4 /*yield*/, test_1._electron.launch({
                        args: [(0, node_path_1.join)(APP, 'out/main/main.js')],
                        cwd: APP,
                        env: __assign(__assign({}, process.env), { HOME: home, QUEUE_TEA_USER_DATA: (0, node_path_1.join)(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' }),
                    })];
            case 13:
                app = _b.sent();
                return [4 /*yield*/, app.firstWindow()];
            case 14:
                page = _b.sent();
                page.on('pageerror', function (err) { return errors.push(String(err)); });
                return [4 /*yield*/, page.setViewportSize({ width: 1440, height: 900 })];
            case 15:
                _b.sent();
                return [4 /*yield*/, page.getByRole('button', { name: /^Gait-feedback/ }).click()];
            case 16:
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
(0, test_1.test)('⌘3 opens Designs at the newest version that reads', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.keyboard.press('Meta+3')];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('heading', { name: '5.4.3', level: 1 })).toBeVisible()];
            case 2:
                _a.sent();
                (0, test_1.expect)(page.url()).toContain('#/designs');
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('button', { name: /^Welcome/ })).toBeVisible()];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText('docs/designs/5.4.3/live-walk.design.json: It has a mistake near line 5.', { exact: false })).toBeVisible()];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('a version in the history rail shows its designs, and one that does not read says why', function () { return __awaiter(void 0, void 0, void 0, function () {
    var rail;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                rail = page.getByRole('complementary', { name: 'History' });
                return [4 /*yield*/, rail.getByRole('button', { name: /^Onboarding pass 2/ }).click()];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('heading', { name: 'Onboarding pass 2', level: 1 })).toBeVisible()];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.dz-cards').getByRole('button')).toHaveCount(1)];
            case 3:
                _a.sent();
                return [4 /*yield*/, rail.getByRole('button', { name: /^5\.4\.2/ }).click()];
            case 4:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('heading', { name: "5.4.2 doesn't read" })).toBeVisible()];
            case 5:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText('It has a mistake near line 3.', { exact: false })).toBeVisible()];
            case 6:
                _a.sent();
                return [4 /*yield*/, rail.getByRole('button', { name: /^5\.4\.3/ }).click()];
            case 7:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('heading', { name: '5.4.3', level: 1 })).toBeVisible()];
            case 8:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('Approve version names Rohan and the time, badges the rail, and keeps the rest of version.json', function () { return __awaiter(void 0, void 0, void 0, function () {
    var before, rail, clicked, saved;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, onDisk('5.4.3', 'version.json')];
            case 1:
                before = _a.sent();
                rail = page.getByRole('complementary', { name: 'History' });
                return [4 /*yield*/, (0, test_1.expect)(page.getByText('Not approved yet. Approve it once the designs are right.')).toBeVisible()];
            case 2:
                _a.sent();
                clicked = Date.now();
                return [4 /*yield*/, page.getByRole('button', { name: 'Approve version' }).click()];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText(/^Approved by Rohan on \d{1,2} \w{3,4} \d{4}, \d\d:\d\d$/)).toBeVisible()];
            case 4:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(rail.getByRole('button', { name: /^5\.4\.3/ })).toContainText('✓ Approved')];
            case 5:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('button', { name: 'Withdraw approval' })).toBeVisible()];
            case 6:
                _a.sent();
                return [4 /*yield*/, onDisk('5.4.3', 'version.json')];
            case 7:
                saved = _a.sent();
                (0, test_1.expect)(saved.approved.by).toBe('Rohan');
                (0, test_1.expect)(new Date(saved.approved.at).toISOString()).toBe(saved.approved.at);
                (0, test_1.expect)(Date.parse(saved.approved.at)).toBeGreaterThanOrEqual(clicked - 1000);
                (0, test_1.expect)(saved).toMatchObject(before);
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('Withdraw approval takes the badge away and writes approved: null, keeping the rest', function () { return __awaiter(void 0, void 0, void 0, function () {
    var rail, saved;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                rail = page.getByRole('complementary', { name: 'History' });
                return [4 /*yield*/, page.getByRole('button', { name: 'Withdraw approval' }).click()];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText('Not approved yet. Approve it once the designs are right.')).toBeVisible()];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('button', { name: 'Approve version' })).toBeVisible()];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(rail.getByRole('button', { name: /^5\.4\.3/ })).not.toContainText('✓ Approved')];
            case 4:
                _a.sent();
                return [4 /*yield*/, onDisk('5.4.3', 'version.json')];
            case 5:
                saved = _a.sent();
                (0, test_1.expect)(saved.approved).toBeNull();
                (0, test_1.expect)(saved).toMatchObject({ format: 1, label: '5.4.3', made: '2026-11-04T16:20:00-06:00', by: 'claude', from: '5.4.2', designs: ['welcome', 'pair-your-insoles', 'live-walk'] });
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('a card opens in the editor, which shows a layer it does not know as a grey box', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.getByRole('button', { name: /^Welcome/ }).click()];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('application', { name: /^Welcome, the design/ })).toBeVisible()];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-layer="chart"]')).toHaveText("Can't show this layer yet")];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('dragging the tip card\'s corner handle changes its W and H in the inspector', function () { return __awaiter(void 0, void 0, void 0, function () {
    var inspector, tip, handle;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                inspector = page.getByRole('region', { name: 'Inspector' });
                return [4 /*yield*/, page.locator('[data-layer="tip"]').boundingBox()];
            case 1:
                tip = (_a.sent());
                // Its bottom-right corner, clear of the texts it holds.
                return [4 /*yield*/, page.mouse.click(tip.x + tip.width - 6, tip.y + tip.height - 6)];
            case 2:
                // Its bottom-right corner, clear of the texts it holds.
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(inspector.getByRole('heading', { name: /Tip card/ })).toBeVisible()];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(inspector.getByLabel('W', { exact: true })).toHaveValue('342')];
            case 4:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(inspector.getByLabel('H', { exact: true })).toHaveValue('104')];
            case 5:
                _a.sent();
                return [4 /*yield*/, page.locator('.dz-handle.h-se').boundingBox()];
            case 6:
                handle = (_a.sent());
                return [4 /*yield*/, page.mouse.move(handle.x + handle.width / 2, handle.y + handle.height / 2)];
            case 7:
                _a.sent();
                return [4 /*yield*/, page.mouse.down()];
            case 8:
                _a.sent();
                return [4 /*yield*/, page.mouse.move(handle.x + 40, handle.y + 30, { steps: 5 })];
            case 9:
                _a.sent();
                return [4 /*yield*/, page.mouse.up()];
            case 10:
                _a.sent();
                return [4 /*yield*/, test_1.expect.poll(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = Number;
                                return [4 /*yield*/, inspector.getByLabel('W', { exact: true }).inputValue()];
                            case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                        }
                    }); }); }).toBeGreaterThan(342)];
            case 11:
                _a.sent();
                return [4 /*yield*/, test_1.expect.poll(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = Number;
                                return [4 /*yield*/, inspector.getByLabel('H', { exact: true }).inputValue()];
                            case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                        }
                    }); }); }).toBeGreaterThan(104)];
            case 12:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('double-clicking a text edits it in place, and Esc finishes', function () { return __awaiter(void 0, void 0, void 0, function () {
    var box;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.locator('[data-layer="headline"]').dblclick()];
            case 1:
                _a.sent();
                box = page.getByRole('textbox', { name: 'Headline', exact: true });
                return [4 /*yield*/, (0, test_1.expect)(box).toBeFocused()
                    // The editor selects the whole text, so typing replaces it.
                ];
            case 2:
                _a.sent();
                // The editor selects the whole text, so typing replaces it.
                return [4 /*yield*/, page.keyboard.type('Walk better today')];
            case 3:
                // The editor selects the whole text, so typing replaces it.
                _a.sent();
                return [4 /*yield*/, page.keyboard.press('Escape')];
            case 4:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(box).toHaveCount(0)];
            case 5:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-layer="headline"]')).toHaveText('Walk better today')];
            case 6:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('the design is saved to disk, keeping the layer the editor does not know', function () { return __awaiter(void 0, void 0, void 0, function () {
    var saved, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, test_1.expect.poll(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, layerOn('headline')];
                        case 1: return [2 /*return*/, (_a.sent()).text];
                    }
                }); }); }, { timeout: 10000 }).toBe('Walk better today')];
            case 1:
                _b.sent();
                return [4 /*yield*/, onDisk('5.4.3', 'welcome.design.json')];
            case 2:
                saved = _b.sent();
                _a = test_1.expect;
                return [4 /*yield*/, layerOn('tip')];
            case 3:
                _a.apply(void 0, [(_b.sent()).width]).toBeGreaterThan(342);
                (0, test_1.expect)(saved.nodes.find(function (l) { return l.id === 'chart'; })).toEqual(CHART);
                (0, test_1.expect)(saved.edited.by).toBe('you');
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('button', { name: /^Saved \d\d:\d\d$/ })).toBeVisible()];
            case 4:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('⌘Z undoes the text, and the undo is saved too', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, page.keyboard.press('Meta+z')];
            case 1:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('[data-layer="headline"]')).toHaveText(HEADLINE)];
            case 2:
                _b.sent();
                return [4 /*yield*/, test_1.expect.poll(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, layerOn('headline')];
                            case 1: return [2 /*return*/, (_a.sent()).text];
                        }
                    }); }); }, { timeout: 10000 }).toBe(HEADLINE)];
            case 3:
                _b.sent();
                _a = test_1.expect;
                return [4 /*yield*/, layerOn('tip')];
            case 4:
                _a.apply(void 0, [(_b.sent()).width]).toBeGreaterThan(342);
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('a comment is added about the selected layer', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.locator('[data-layer="headline"]').click()];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText('About Headline')).toBeVisible()];
            case 2:
                _a.sent();
                return [4 /*yield*/, page.getByLabel('Your comment *').fill('Warmer colours on the headline')];
            case 3:
                _a.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Add comment' }).click()];
            case 4:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.locator('.dz-c-text').filter({ hasText: 'Warmer colours on the headline' })).toBeVisible()];
            case 5:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByLabel('Your comment *')).toHaveValue('')];
            case 6:
                _a.sent();
                return [4 /*yield*/, test_1.expect
                        .poll(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, onDisk('5.4.3', 'comments.json')];
                            case 1: return [2 /*return*/, (_a.sent()).comments.at(-1)];
                        }
                    }); }); })
                        .toMatchObject({ design: 'welcome', on: 'headline', text: 'Warmer colours on the headline', by: 'Rohan', resolved: null, sentTo: null })];
            case 7:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('on the first design Previous is off and Next is on', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, test_1.expect)(page.getByRole('application', { name: /^Welcome, the design/ })).toBeVisible()];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('button', { name: '‹ Previous design' })).toBeDisabled()];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('button', { name: 'Next design ›' })).toBeEnabled()];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('Next design saves the edit waiting on Welcome to Welcome and leaves Pair your insoles as it was', function () { return __awaiter(void 0, void 0, void 0, function () {
    var pairBefore, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, promises_1.readFile)(designFile('5.4.3', 'pair-your-insoles.design.json'), 'utf8')];
            case 1:
                pairBefore = _b.sent();
                return [4 /*yield*/, page.locator('[data-layer="headline"]').dblclick()];
            case 2:
                _b.sent();
                return [4 /*yield*/, page.keyboard.type('Walk better tomorrow')];
            case 3:
                _b.sent();
                return [4 /*yield*/, page.keyboard.press('Escape')
                    // At once, inside the autosave's wait: moving on has to save it.
                ];
            case 4:
                _b.sent();
                // At once, inside the autosave's wait: moving on has to save it.
                return [4 /*yield*/, page.getByRole('button', { name: 'Next design ›' }).click()];
            case 5:
                // At once, inside the autosave's wait: moving on has to save it.
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('application', { name: /^Pair your insoles, the design/ })).toBeVisible()];
            case 6:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('heading', { name: 'Pair your insoles', level: 1 })).toBeVisible()];
            case 7:
                _b.sent();
                return [4 /*yield*/, test_1.expect.poll(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, layerOn('headline')];
                            case 1: return [2 /*return*/, (_a.sent()).text];
                        }
                    }); }); }, { timeout: 10000 }).toBe('Walk better tomorrow')];
            case 8:
                _b.sent();
                _a = test_1.expect;
                return [4 /*yield*/, (0, promises_1.readFile)(designFile('5.4.3', 'pair-your-insoles.design.json'), 'utf8')];
            case 9:
                _a.apply(void 0, [_b.sent()]).toBe(pairBefore);
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('button', { name: '‹ Previous design' })).toBeEnabled()];
            case 10:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('the last design, which does not read, has Next off, and Previous goes back one', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.getByRole('button', { name: 'Next design ›' }).click()];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('heading', { name: "live-walk doesn't read" })).toBeVisible()];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('button', { name: 'Next design ›' })).toBeDisabled()];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('button', { name: '‹ Previous design' })).toBeEnabled()];
            case 4:
                _a.sent();
                return [4 /*yield*/, page.getByRole('button', { name: '‹ Previous design' }).click()];
            case 5:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('application', { name: /^Pair your insoles, the design/ })).toBeVisible()];
            case 6:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('Next version files a quest from the open comments and shows the version coming', function () { return __awaiter(void 0, void 0, void 0, function () {
    var sheet, comments, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, page.getByRole('button', { name: '‹ 5.4.3' }).click()];
            case 1:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('heading', { name: '5.4.3', level: 1 })).toBeVisible()];
            case 2:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText('3 open comments on 1 design.', { exact: false })).toBeVisible()];
            case 3:
                _b.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Next version…' }).click()];
            case 4:
                _b.sent();
                sheet = page.getByRole('dialog', { name: 'Next version from 5.4.3' });
                return [4 /*yield*/, (0, test_1.expect)(sheet.getByLabel('Version label *')).toHaveValue('5.4.4')];
            case 5:
                _b.sent();
                return [4 /*yield*/, sheet.getByRole('button', { name: 'File quest' }).click()];
            case 6:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByText('Next version filed')).toBeVisible()];
            case 7:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('complementary', { name: 'History' }).getByText('Quest queued · not drafted yet')).toBeVisible()];
            case 8:
                _b.sent();
                return [4 /*yield*/, test_1.expect
                        .poll(function () { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _b = (_a = JSON).parse;
                                return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(home, '.queue-tea/projects/gait-abc123.json'), 'utf8')];
                            case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()]).tasks.map(function (task) { return task.title; })];
                        }
                    }); }); })
                        .toEqual(["Designs 5.4.4 from 5.4.3's feedback"])];
            case 9:
                _b.sent();
                return [4 /*yield*/, onDisk('5.4.3', 'comments.json')];
            case 10:
                comments = (_b.sent()).comments;
                (0, test_1.expect)(comments.map(function (c) { return c.sentTo; })).toEqual(['5.4.4', '5.4.4', null, '5.4.4']);
                _a = test_1.expect;
                return [4 /*yield*/, onDisk('5.4.3', 'version.json')];
            case 11:
                _a.apply(void 0, [(_b.sent()).next]).toEqual({ label: '5.4.4', quest: "Designs 5.4.4 from 5.4.3's feedback" });
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('nothing in the window threw', function () {
    (0, test_1.expect)(errors).toEqual([]);
});
