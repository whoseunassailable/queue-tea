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
var SHOTS = process.env.QUEUE_TEA_SHOTS;
var home;
var app;
var page;
var event = function (value) { return "printf '%s\\n' '".concat(JSON.stringify(value), "'"); };
// A stand-in for claude, found before the real one, so no test spends tokens.
// It reads a file, then waits until the test lets it answer.
var plantClaude = function () { return __awaiter(void 0, void 0, void 0, function () {
    var bin;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                bin = (0, node_path_1.join)(home, 'bin');
                return [4 /*yield*/, (0, promises_1.mkdir)(bin, { recursive: true })];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(bin, 'claude'), "#!/bin/sh\necho \"$*\" >> '".concat(home, "/claude-calls'\n").concat(event({ type: 'system', subtype: 'init', agents: ['claude', 'queue-tea:commit-chai-n', 'queue-tea:mocha-mockup', 'queue-tea:chai-pter', 'queue-tea:tea-dd'] }), "\n").concat(event({ type: 'assistant', message: { content: [{ type: 'tool_use', name: 'Read', input: { file_path: '/x/timer.ts' } }] } }), "\nwhile [ ! -f '").concat(home, "/claude-go' ]; do sleep 0.05; done\nrm '").concat(home, "/claude-go'\n").concat(event({ type: 'result', subtype: 'success', is_error: false, result: 'Added three tests.' }), "\n"))];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, promises_1.chmod)((0, node_path_1.join)(bin, 'claude'), 493)];
            case 3:
                _a.sent();
                return [2 /*return*/, bin];
        }
    });
}); };
var card = function (name) { return page.locator('.member', { has: page.getByRole('heading', { name: name }) }); };
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
test_1.test.beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    var folder, realm, bin;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-guild-'))];
            case 1:
                home = _b.sent();
                folder = (0, node_path_1.join)(home, '.queue-tea/projects');
                realm = (0, node_path_1.join)(home, 'alpha');
                return [4 /*yield*/, (0, promises_1.mkdir)(folder, { recursive: true })];
            case 2:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, '.queue-tea/sessions'), { recursive: true })];
            case 3:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)(realm)];
            case 4:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(folder, 'alpha-abc123.json'), JSON.stringify({ version: 1, project: { name: 'alpha', path: realm }, docsLogPath: null, playNext: null, feature: null, tasks: [], unassignedMinutesByDay: {}, requests: [] }))];
            case 5:
                _b.sent();
                return [4 /*yield*/, plantClaude()];
            case 6:
                bin = _b.sent();
                return [4 /*yield*/, test_1._electron.launch({
                        args: [(0, node_path_1.join)(APP, 'out/main/main.js')],
                        cwd: APP,
                        env: __assign(__assign({}, process.env), { PATH: "".concat(bin, ":").concat((_a = process.env.PATH) !== null && _a !== void 0 ? _a : ''), HOME: home, QUEUE_TEA_USER_DATA: (0, node_path_1.join)(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' }),
                    })];
            case 7:
                app = _b.sent();
                return [4 /*yield*/, app.firstWindow()];
            case 8:
                page = _b.sent();
                return [4 /*yield*/, page.getByRole('button', { name: /^alpha/ }).click()];
            case 9:
                _b.sent();
                return [4 /*yield*/, page.getByRole('link', { name: 'Guild Hall' }).click()];
            case 10:
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
(0, test_1.test)('an empty order is caught before anything is sent', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, card('Tea-DD').getByRole('button', { name: 'Send' }).click()];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(card('Tea-DD').getByText('Order is required.')).toBeVisible()];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('a helper takes an order, shows what it is doing, then answers', function () { return __awaiter(void 0, void 0, void 0, function () {
    var tea, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                tea = card('Tea-DD');
                return [4 /*yield*/, (0, test_1.expect)(tea.getByText('Anything that needs a test?')).toBeVisible()];
            case 1:
                _b.sent();
                return [4 /*yield*/, tea.getByLabel(/Order for Tea-DD/).fill('Write tests for the timer')];
            case 2:
                _b.sent();
                return [4 /*yield*/, tea.getByRole('button', { name: 'Send' }).click()];
            case 3:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(tea.getByText('Reading timer.ts…')).toBeVisible()];
            case 4:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(tea.locator('.portrait.working')).toHaveCount(1)];
            case 5:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(tea.getByText('At work')).toBeVisible()];
            case 6:
                _b.sent();
                return [4 /*yield*/, shot('guild-working')];
            case 7:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(home, 'claude-go'), '')];
            case 8:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(tea.getByText('Added three tests.')).toBeVisible()];
            case 9:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(tea.locator('.portrait.done')).toHaveCount(1)];
            case 10:
                _b.sent();
                return [4 /*yield*/, shot('guild-done')];
            case 11:
                _b.sent();
                _a = test_1.expect;
                return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(home, 'claude-calls'), 'utf8')];
            case 12:
                _a.apply(void 0, [_b.sent()]).toBe('-p --agent queue-tea:tea-dd --output-format stream-json --verbose -- Write tests for the timer\n');
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('a helper at work can be stopped', function () { return __awaiter(void 0, void 0, void 0, function () {
    var chai;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                chai = card('Chai-pter');
                return [4 /*yield*/, chai.getByLabel(/Order for Chai-pter/).fill('Write up the Guild Hall')];
            case 1:
                _a.sent();
                return [4 /*yield*/, chai.getByRole('button', { name: 'Send' }).click()];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(chai.getByText('Reading timer.ts…')).toBeVisible()];
            case 3:
                _a.sent();
                return [4 /*yield*/, chai.getByRole('button', { name: 'Stop' }).click()];
            case 4:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(chai.getByText('Stopped. Nothing after that step was done.')).toBeVisible()];
            case 5:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(chai.getByRole('button', { name: 'Try again' })).toBeVisible()];
            case 6:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
