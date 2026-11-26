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
var fixtures_1 = require("../main/features/tasks/api/fixtures");
// The record lives in a temporary home. No real git operations or terminal
// sessions are needed to verify the watcher → IPC → activity pane flow.
(0, test_1.test)('a task shows the check it is running, then how it ended, as the record changes', function () { return __awaiter(void 0, void 0, void 0, function () {
    var home, _a, app, folder, repo, record, file, page, feed, line, step;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = promises_1.realpath;
                return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-activity-'))];
            case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
            case 2:
                home = _b.sent();
                _b.label = 3;
            case 3:
                _b.trys.push([3, , 19, 22]);
                folder = (0, node_path_1.join)(home, '.queue-tea/projects');
                repo = (0, node_path_1.join)(home, 'demo');
                return [4 /*yield*/, (0, promises_1.mkdir)(folder, { recursive: true })];
            case 4:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)(repo)];
            case 5:
                _b.sent();
                record = __assign(__assign({}, (0, record_source_1.emptyRecord)('Activity demo', repo)), { tasks: [(0, fixtures_1.makeTask)({ id: 'active', title: 'Show task activity', state: 'current',
                            step: { id: 'check', at: '2026-11-04T12:00:00Z', finished: null, kind: 'test', status: 'running', subject: 'npm test' } })] });
                file = (0, node_path_1.join)(folder, 'activity-abc123.json');
                return [4 /*yield*/, (0, promises_1.writeFile)(file, JSON.stringify(record))];
            case 6:
                _b.sent();
                return [4 /*yield*/, test_1._electron.launch({ args: [(0, node_path_1.join)(__dirname, '../out/main/main.js')], cwd: (0, node_path_1.join)(__dirname, '..'),
                        env: __assign(__assign({}, process.env), { HOME: home, QUEUE_TEA_USER_DATA: (0, node_path_1.join)(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' }) })];
            case 7:
                app = _b.sent();
                return [4 /*yield*/, app.firstWindow()];
            case 8:
                page = _b.sent();
                return [4 /*yield*/, page.getByRole('navigation', { name: 'Realms' }).getByRole('button', { name: /Activity demo/ }).click()];
            case 9:
                _b.sent();
                return [4 /*yield*/, page.getByRole('link', { name: 'Quests', exact: true }).click()];
            case 10:
                _b.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Show the details of Show task activity' }).click()];
            case 11:
                _b.sent();
                feed = page.getByRole('region', { name: 'Task activity' });
                line = feed.getByLabel('Current step');
                return [4 /*yield*/, (0, test_1.expect)(line).toContainText('Now')];
            case 12:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(line).toContainText('Running checks')];
            case 13:
                _b.sent();
                step = record.tasks[0].step;
                step.status = 'failed';
                step.finished = '2026-11-04T12:01:00Z';
                return [4 /*yield*/, (0, promises_1.writeFile)("".concat(file, ".tmp"), JSON.stringify(record))];
            case 14:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.rename)("".concat(file, ".tmp"), file)];
            case 15:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(line).toContainText('Last step')];
            case 16:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(line.getByText('Failed', { exact: true })).toBeVisible()];
            case 17:
                _b.sent();
                return [4 /*yield*/, (0, test_1.expect)(feed.locator('pre')).toHaveCount(0)];
            case 18:
                _b.sent();
                return [3 /*break*/, 22];
            case 19: return [4 /*yield*/, (app === null || app === void 0 ? void 0 : app.close())];
            case 20:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.rm)(home, { recursive: true, force: true })];
            case 21:
                _b.sent();
                return [7 /*endfinally*/];
            case 22: return [2 /*return*/];
        }
    });
}); });
