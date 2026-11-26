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
var node_util_1 = require("node:util");
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var test_1 = require("@playwright/test");
var record_source_1 = require("../../hooks/shared/records/data/datasources/record_source");
var fixtures_1 = require("../main/features/tasks/api/fixtures");
// Uses existing local history read-only. All records/session fixtures and app
// settings live in a temporary HOME. No commit, merge, checkout, or push runs.
(0, test_1.test)('branch graph and review show actual local history through IPC', function (_a, testInfo_1) { return __awaiter(void 0, [_a, testInfo_1], void 0, function (_b, testInfo) {
    var home, _c, repo, app, folder, task, record, page, card, merged, err_1, review, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _c = promises_1.realpath;
                return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-branches-ui-'))];
            case 1: return [4 /*yield*/, _c.apply(void 0, [_e.sent()])];
            case 2:
                home = _e.sent();
                repo = (0, node_path_1.resolve)(__dirname, '../..');
                _e.label = 3;
            case 3:
                _e.trys.push([3, , 26, 29]);
                folder = (0, node_path_1.join)(home, '.queue-tea/projects');
                return [4 /*yield*/, (0, promises_1.mkdir)(folder, { recursive: true })];
            case 4:
                _e.sent();
                task = (0, fixtures_1.makeTask)({ id: 'branch-ui', title: 'Branch and merge GUI', state: 'current', branch: 'task/task-description', baseBranch: 'main', worktreePath: repo,
                    step: { id: 'test', at: new Date().toISOString(), finished: new Date().toISOString(), kind: 'test', status: 'succeeded', subject: 'Example observed check' } });
                record = __assign(__assign({}, (0, record_source_1.emptyRecord)('Branch review demo', repo)), { version: 2, tasks: [task] });
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(folder, 'branches-abc123.json'), JSON.stringify(record))];
            case 5:
                _e.sent();
                return [4 /*yield*/, test_1._electron.launch({ args: [(0, node_path_1.join)(__dirname, '../out/main/main.js')], cwd: (0, node_path_1.join)(__dirname, '..'), env: __assign(__assign({}, process.env), { HOME: home, QUEUE_TEA_USER_DATA: (0, node_path_1.join)(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' }) })];
            case 6:
                app = _e.sent();
                return [4 /*yield*/, app.firstWindow()];
            case 7:
                page = _e.sent();
                return [4 /*yield*/, page.getByRole('navigation', { name: 'Realms' }).getByRole('button', { name: /Branch review demo/ }).click()];
            case 8:
                _e.sent();
                return [4 /*yield*/, page.getByRole('link', { name: 'Branches', exact: true }).click()];
            case 9:
                _e.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('img', { name: /actual commit parents/ })).toBeVisible()];
            case 10:
                _e.sent();
                card = page.getByRole('article', { name: task.title });
                merged = false;
                _e.label = 11;
            case 11:
                _e.trys.push([11, 13, , 14]);
                return [4 /*yield*/, (0, node_util_1.promisify)(node_child_process_1.execFile)('git', ['merge-base', '--is-ancestor', 'refs/heads/task/task-description', 'refs/heads/main'], { cwd: repo })];
            case 12:
                _e.sent();
                merged = true;
                return [3 /*break*/, 14];
            case 13:
                err_1 = _e.sent();
                if (err_1.code !== 1)
                    throw err_1;
                return [3 /*break*/, 14];
            case 14: return [4 /*yield*/, (0, test_1.expect)(card.getByText(merged ? 'Merged locally' : 'Paused', { exact: true })).toBeVisible()];
            case 15:
                _e.sent();
                return [4 /*yield*/, page.screenshot({ path: testInfo.outputPath('branch-graph.png'), fullPage: true })];
            case 16:
                _e.sent();
                return [4 /*yield*/, card.getByRole('button', { name: 'Review work' }).click()];
            case 17:
                _e.sent();
                review = page.getByRole('dialog', { name: 'Review work' });
                return [4 /*yield*/, (0, test_1.expect)(review.getByText('task/task-description → main', { exact: true })).toBeVisible()];
            case 18:
                _e.sent();
                return [4 /*yield*/, (0, test_1.expect)(review.getByRole('button', { name: 'Prepare merge for review' })).toBeDisabled()];
            case 19:
                _e.sent();
                return [4 /*yield*/, (0, test_1.expect)(review.getByLabel('Current step')).toContainText('Example observed check')];
            case 20:
                _e.sent();
                return [4 /*yield*/, review.getByRole('tab', { name: 'Checks' }).click()];
            case 21:
                _e.sent();
                return [4 /*yield*/, (0, test_1.expect)(review.getByText('No checks were observed. Prepare the merge below and run its checks there.', { exact: true })).toBeVisible()];
            case 22:
                _e.sent();
                return [4 /*yield*/, page.screenshot({ path: testInfo.outputPath('branch-review.png'), fullPage: true })];
            case 23:
                _e.sent();
                return [4 /*yield*/, page.emulateMedia({ reducedMotion: 'reduce' })];
            case 24:
                _e.sent();
                _d = test_1.expect;
                return [4 /*yield*/, page.locator('.observed-working').count()];
            case 25:
                _d.apply(void 0, [_e.sent()]).toBe(0);
                return [3 /*break*/, 29];
            case 26: return [4 /*yield*/, (app === null || app === void 0 ? void 0 : app.close())];
            case 27:
                _e.sent();
                return [4 /*yield*/, (0, promises_1.rm)(home, { recursive: true, force: true })];
            case 28:
                _e.sent();
                return [7 /*endfinally*/];
            case 29: return [2 /*return*/];
        }
    });
}); });
