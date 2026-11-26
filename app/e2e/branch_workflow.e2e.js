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
// Full GUI → IPC → real Git/process/files → GUI flow. All data and the bare
// remote are temporary. No network, production app, or task repository writes.
var run = (0, node_util_1.promisify)(node_child_process_1.execFile);
var KEY = 'workflow-abc123';
var home;
var repo;
var file;
var app;
var page;
var git = function (cwd) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, run('git', args, { cwd: cwd, env: __assign(__assign({}, process.env), { GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null' }) })];
            case 1: return [2 /*return*/, (_a.sent()).stdout.trim()];
        }
    }); });
};
var record = function () { return __awaiter(void 0, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
    switch (_c.label) {
        case 0:
            _b = (_a = JSON).parse;
            return [4 /*yield*/, (0, promises_1.readFile)(file, 'utf8')];
        case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
    }
}); }); };
var event = function (type, payload) { return JSON.stringify({ timestamp: new Date().toISOString(), type: type, payload: payload }) + '\n'; };
var dialog = function () { return page.getByRole('dialog', { name: 'Review work' }); };
var mergeButton = function () { return dialog().getByRole('button', { name: 'Merge task/visible-workflow into main', exact: true }); };
test_1.test.beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, hooks, remote, bin;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = promises_1.realpath;
                return [4 /*yield*/, (0, promises_1.mkdtemp)((0, node_path_1.join)((0, node_os_1.tmpdir)(), 'queue-tea-gui-workflow-'))];
            case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
            case 2:
                home = _b.sent();
                repo = (0, node_path_1.join)(home, 'repo');
                file = (0, node_path_1.join)(home, '.queue-tea/projects', "".concat(KEY, ".json"));
                return [4 /*yield*/, (0, promises_1.mkdir)(repo)];
            case 3:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.mkdir)((0, node_path_1.join)(home, '.queue-tea/projects'), { recursive: true })];
            case 4:
                _b.sent();
                return [4 /*yield*/, git(repo, 'init', '-b', 'main')];
            case 5:
                _b.sent();
                return [4 /*yield*/, git(repo, 'config', 'user.name', 'Queue-tea test')];
            case 6:
                _b.sent();
                return [4 /*yield*/, git(repo, 'config', 'user.email', 'test@example.invalid')];
            case 7:
                _b.sent();
                return [4 /*yield*/, git(repo, 'config', 'commit.gpgsign', 'false')];
            case 8:
                _b.sent();
                hooks = (0, node_path_1.join)(home, 'test-hooks');
                return [4 /*yield*/, (0, promises_1.mkdir)(hooks)];
            case 9:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(hooks, 'pre-commit'), '#!/bin/sh\necho "COMMIT START"\nsleep 2\necho "COMMIT END"\n')];
            case 10:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.chmod)((0, node_path_1.join)(hooks, 'pre-commit'), 493)
                    // Seed with hooks disabled, then enable only the temporary streaming hook.
                ];
            case 11:
                _b.sent();
                // Seed with hooks disabled, then enable only the temporary streaming hook.
                return [4 /*yield*/, git(repo, 'config', 'core.hooksPath', '/dev/null')];
            case 12:
                // Seed with hooks disabled, then enable only the temporary streaming hook.
                _b.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(repo, '.gitignore'), '.check-fail\n')];
            case 13:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(repo, 'a.txt'), 'base\n')];
            case 14:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(repo, 'package.json'), JSON.stringify({ name: 'workflow-fixture', private: true, scripts: { test: 'node check.cjs' } }))];
            case 15:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(repo, 'check.cjs'), "const fs=require('node:fs');console.log('CHECK START');setTimeout(()=>{if(fs.existsSync('.check-fail')){console.error('CHECK FAILED');process.exit(1)}console.log('CHECK PASSED')},1200)")];
            case 16:
                _b.sent();
                return [4 /*yield*/, git(repo, 'add', '.')];
            case 17:
                _b.sent();
                return [4 /*yield*/, git(repo, 'commit', '-m', 'Base fixture')];
            case 18:
                _b.sent();
                return [4 /*yield*/, git(repo, 'config', 'core.hooksPath', hooks)];
            case 19:
                _b.sent();
                remote = (0, node_path_1.join)(home, 'remote.git');
                return [4 /*yield*/, (0, promises_1.mkdir)(remote)];
            case 20:
                _b.sent();
                return [4 /*yield*/, git(remote, 'init', '--bare')];
            case 21:
                _b.sent();
                return [4 /*yield*/, git(repo, 'remote', 'add', 'origin', remote)];
            case 22:
                _b.sent();
                bin = (0, node_path_1.join)(home, 'bin');
                return [4 /*yield*/, (0, promises_1.mkdir)(bin)];
            case 23:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(bin, 'osascript'), '#!/bin/sh\nexit 0\n')];
            case 24:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.chmod)((0, node_path_1.join)(bin, 'osascript'), 493)];
            case 25:
                _b.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)(file, JSON.stringify(__assign(__assign({}, (0, record_source_1.emptyRecord)('Workflow demo', repo)), { tasks: [(0, fixtures_1.makeTask)({ id: 'one', title: 'Visible workflow', priority: 'urgent' })] })))];
            case 26:
                _b.sent();
                return [4 /*yield*/, test_1._electron.launch({ args: [(0, node_path_1.join)(__dirname, '../out/main/main.js')], cwd: (0, node_path_1.join)(__dirname, '..'), env: __assign(__assign({}, process.env), { HOME: home, PATH: "".concat(bin, ":/usr/bin:/bin"), QUEUE_TEA_USER_DATA: (0, node_path_1.join)(home, 'user-data'), QUEUE_TEA_FLAVOR: 'stage' }) })];
            case 27:
                app = _b.sent();
                return [4 /*yield*/, app.firstWindow()];
            case 28:
                page = _b.sent();
                return [4 /*yield*/, page.getByRole('navigation', { name: 'Realms' }).getByRole('button', { name: /Workflow demo/ }).click()];
            case 29:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); });
test_1.test.afterEach(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, (app === null || app === void 0 ? void 0 : app.close())];
        case 1:
            _a.sent();
            if (!home) return [3 /*break*/, 3];
            return [4 /*yield*/, (0, promises_1.rm)(home, { recursive: true, force: true })];
        case 2:
            _a.sent();
            _a.label = 3;
        case 3: return [2 /*return*/];
    }
}); }); });
var start = function () { return __awaiter(void 0, void 0, void 0, function () {
    var task, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, page.getByRole('link', { name: 'Quests', exact: true }).click()];
            case 1:
                _b.sent();
                return [4 /*yield*/, page.getByRole('button', { name: /^Visible workflow/ }).click()];
            case 2:
                _b.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Start in Codex', exact: true }).click()];
            case 3:
                _b.sent();
                return [4 /*yield*/, test_1.expect.poll(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, record()];
                            case 1: return [2 /*return*/, (_a.sent()).tasks[0].state];
                        }
                    }); }); }).toBe('current')];
            case 4:
                _b.sent();
                return [4 /*yield*/, record()];
            case 5:
                task = (_b.sent()).tasks[0];
                (0, test_1.expect)(task.branch).toBe('task/visible-workflow');
                _a = test_1.expect;
                return [4 /*yield*/, git(repo, 'branch', '--show-current')];
            case 6:
                _a.apply(void 0, [_b.sent()]).toBe('main');
                return [2 /*return*/, task.worktreePath];
        }
    });
}); };
var openReview = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, page.getByRole('link', { name: 'Branches', exact: true }).click()];
            case 1:
                _a.sent();
                return [4 /*yield*/, page.getByRole('article', { name: 'Visible workflow' }).getByRole('button', { name: 'Review work', exact: true }).click()];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(dialog()).toBeVisible()];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var commitSelected = function (name) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, dialog().getByRole('tab', { name: 'Changes', exact: true }).click()];
            case 1:
                _a.sent();
                return [4 /*yield*/, dialog().getByRole('checkbox', { name: new RegExp(name.replace('.', '\\.')) }).check()];
            case 2:
                _a.sent();
                return [4 /*yield*/, dialog().getByLabel('Commit message *', { exact: true }).fill('Implement visible workflow')];
            case 3:
                _a.sent();
                return [4 /*yield*/, dialog().getByRole('checkbox', { name: /I have stopped/ }).first().check()];
            case 4:
                _a.sent();
                return [4 /*yield*/, dialog().getByRole('button', { name: 'Commit selected files', exact: true }).click()];
            case 5:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(dialog().getByRole('log', { name: 'Live commit output' })).toContainText('COMMIT START')];
            case 6:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(dialog().getByRole('log', { name: 'Live commit output' })).toContainText('COMMIT END')];
            case 7:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var prepare = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, dialog().getByRole('checkbox', { name: /I have stopped/ }).last().check()];
            case 1:
                _a.sent();
                return [4 /*yield*/, dialog().getByRole('button', { name: 'Prepare merge for review' }).click()];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(dialog().getByRole('region', { name: 'Checks on the prepared result' })).toBeVisible()];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var check = function () { return __awaiter(void 0, void 0, void 0, function () {
    var checks;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                checks = dialog().getByRole('region', { name: 'Checks on the prepared result' });
                return [4 /*yield*/, checks.getByRole('checkbox', { name: /^test/ }).check()];
            case 1:
                _a.sent();
                return [4 /*yield*/, checks.getByRole('button', { name: 'Run selected checks' }).click()];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(checks.getByRole('log', { name: 'Live output: test' }).last()).toContainText('CHECK START')];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(checks.getByRole('log', { name: 'Live output: test' }).last()).toContainText('CHECK PASSED')];
            case 4:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(checks.getByText('Passed', { exact: true }).last()).toBeVisible()];
            case 5:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var merge = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, dialog().getByRole('checkbox', { name: /I have stopped/ }).last().check()];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(mergeButton()).toBeEnabled()];
            case 2:
                _a.sent();
                return [4 /*yield*/, mergeButton().click()];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, test_1.expect)(dialog().getByText(/Merged locally into main at/)).toBeVisible()];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
(0, test_1.test)('start, live Codex work, commit output, checks, approved merge, and separate local push', function (_a, testInfo_1) { return __awaiter(void 0, [_a, testInfo_1], void 0, function (_b, testInfo) {
    var source, logs, log, command, card, head, _c, _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0: return [4 /*yield*/, start()
                // Old session date with events appended now verifies resumed-session discovery.
            ];
            case 1:
                source = _f.sent();
                logs = (0, node_path_1.join)(home, '.codex/sessions/2024/01/01');
                return [4 /*yield*/, (0, promises_1.mkdir)(logs, { recursive: true })];
            case 2:
                _f.sent();
                log = (0, node_path_1.join)(logs, 'resumed.jsonl');
                command = { type: 'CommandExecution', id: 'agent-command', command: ['/bin/zsh', '-lc', 'node check.cjs'], process_id: 'fixture-process', status: 'in_progress', exit_code: null, aggregated_output: 'AGENT CHECK START' };
                return [4 /*yield*/, (0, promises_1.writeFile)(log, event('session_meta', { cwd: source }) + event('event_msg', { type: 'task_started' }) + event('event_msg', { type: 'item_completed', item: command }))];
            case 3:
                _f.sent();
                return [4 /*yield*/, page.getByRole('button', { name: 'Show the details of Visible workflow', exact: true }).click()];
            case 4:
                _f.sent();
                return [4 /*yield*/, (0, test_1.expect)(page.getByRole('region', { name: 'Task activity' }).getByText('node check.cjs', { exact: true })).toBeVisible({ timeout: 15000 })];
            case 5:
                _f.sent();
                return [4 /*yield*/, page.getByRole('link', { name: 'Branches', exact: true }).click()];
            case 6:
                _f.sent();
                card = page.getByRole('article', { name: 'Visible workflow' });
                return [4 /*yield*/, (0, test_1.expect)(card.getByText('Working now', { exact: true })).toBeVisible({ timeout: 15000 })];
            case 7:
                _f.sent();
                return [4 /*yield*/, (0, test_1.expect)(card.locator('.observed-working')).toHaveCount(1)];
            case 8:
                _f.sent();
                return [4 /*yield*/, card.getByRole('button', { name: 'Review work', exact: true }).click()];
            case 9:
                _f.sent();
                return [4 /*yield*/, (0, test_1.expect)(dialog().getByLabel('Current step')).toContainText('node check.cjs')];
            case 10:
                _f.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(source, 'feature.txt'), 'feature complete\n')];
            case 11:
                _f.sent();
                return [4 /*yield*/, (0, promises_1.appendFile)(log, event('event_msg', { type: 'item_completed', item: __assign(__assign({}, command), { id: 'agent-result', status: 'completed', exit_code: 0, aggregated_output: 'AGENT CHECK PASSED' }) }) + event('event_msg', { type: 'item_completed', item: { type: 'FileChange', id: 'file-edit', status: 'completed', changes: { 'feature.txt': { type: 'add' } } } }) + event('event_msg', { type: 'task_complete' }))];
            case 12:
                _f.sent();
                return [4 /*yield*/, (0, test_1.expect)(dialog().getByText('feature.txt', { exact: true })).toBeVisible({ timeout: 15000 })];
            case 13:
                _f.sent();
                return [4 /*yield*/, commitSelected('feature.txt')];
            case 14:
                _f.sent();
                return [4 /*yield*/, test_1.expect.poll(function () { return git(source, 'status', '--porcelain'); }).toBe('')];
            case 15:
                _f.sent();
                return [4 /*yield*/, prepare()];
            case 16:
                _f.sent();
                return [4 /*yield*/, (0, test_1.expect)(mergeButton()).toBeDisabled()];
            case 17:
                _f.sent();
                return [4 /*yield*/, check()];
            case 18:
                _f.sent();
                return [4 /*yield*/, page.screenshot({ path: testInfo.outputPath('checks-ready.png'), fullPage: true })];
            case 19:
                _f.sent();
                return [4 /*yield*/, merge()];
            case 20:
                _f.sent();
                return [4 /*yield*/, git(repo, 'rev-parse', 'HEAD')];
            case 21:
                head = _f.sent();
                _c = test_1.expect;
                return [4 /*yield*/, git(repo, 'show', '-s', '--format=%P', head)];
            case 22:
                _c.apply(void 0, [(_f.sent()).split(' ')]).toHaveLength(2);
                _d = test_1.expect;
                return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(repo, 'feature.txt'), 'utf8')];
            case 23:
                _d.apply(void 0, [_f.sent()]).toBe('feature complete\n');
                return [4 /*yield*/, dialog().getByRole('button', { name: 'Check remote for push' }).click()];
            case 24:
                _f.sent();
                return [4 /*yield*/, dialog().getByRole('button', { name: 'Push to origin/main', exact: true }).click()];
            case 25:
                _f.sent();
                return [4 /*yield*/, (0, test_1.expect)(dialog().getByText(/Published .* to origin\/main/)).toBeVisible()];
            case 26:
                _f.sent();
                _e = test_1.expect;
                return [4 /*yield*/, git((0, node_path_1.join)(home, 'remote.git'), 'rev-parse', 'refs/heads/main')];
            case 27:
                _e.apply(void 0, [_f.sent()]).toBe(head);
                return [2 /*return*/];
        }
    });
}); });
(0, test_1.test)('resolves a real conflict, shows a failed check, reruns it, and merges only after success', function (_a, testInfo_1) { return __awaiter(void 0, [_a, testInfo_1], void 0, function (_b, testInfo) {
    var source, checks, review, integration, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, start()];
            case 1:
                source = _e.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(source, 'a.txt'), 'task version\n')];
            case 2:
                _e.sent();
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(repo, 'a.txt'), 'main version\n')];
            case 3:
                _e.sent();
                return [4 /*yield*/, git(repo, 'add', 'a.txt')];
            case 4:
                _e.sent();
                return [4 /*yield*/, git(repo, '-c', 'core.hooksPath=/dev/null', 'commit', '-m', 'Other task changed main')];
            case 5:
                _e.sent();
                return [4 /*yield*/, openReview()];
            case 6:
                _e.sent();
                return [4 /*yield*/, commitSelected('a.txt')];
            case 7:
                _e.sent();
                return [4 /*yield*/, dialog().getByRole('checkbox', { name: /I have stopped/ }).last().check()];
            case 8:
                _e.sent();
                return [4 /*yield*/, dialog().getByRole('button', { name: 'Prepare merge for review' }).click()];
            case 9:
                _e.sent();
                return [4 /*yield*/, (0, test_1.expect)(dialog().getByRole('heading', { name: 'Resolve conflicts', exact: true })).toBeVisible()];
            case 10:
                _e.sent();
                return [4 /*yield*/, (0, test_1.expect)(dialog().getByRole('button', { name: 'Send Commit Chai-n to resolve these conflicts' })).toBeEnabled()];
            case 11:
                _e.sent();
                return [4 /*yield*/, page.screenshot({ path: testInfo.outputPath('helper-bench.png'), fullPage: true })];
            case 12:
                _e.sent();
                return [4 /*yield*/, dialog().getByLabel('Resolved result', { exact: true }).fill('combined result\n')];
            case 13:
                _e.sent();
                return [4 /*yield*/, dialog().getByRole('button', { name: 'Save resolved file' }).click()];
            case 14:
                _e.sent();
                checks = dialog().getByRole('region', { name: 'Checks on the prepared result' });
                return [4 /*yield*/, (0, test_1.expect)(checks).toBeVisible()];
            case 15:
                _e.sent();
                return [4 /*yield*/, page.evaluate(function (key) { return __awaiter(void 0, void 0, void 0, function () {
                        var w;
                        return __generator(this, function (_a) {
                            w = window;
                            return [2 /*return*/, w.engine.readBranch(key, 'one', 'main')];
                        });
                    }); }, KEY)];
            case 16:
                review = _e.sent();
                integration = (0, node_path_1.join)(home, '.queue-tea/integrations', KEY, review.data.operation.id, 'worktree');
                return [4 /*yield*/, (0, promises_1.writeFile)((0, node_path_1.join)(integration, '.check-fail'), 'fail')];
            case 17:
                _e.sent();
                return [4 /*yield*/, checks.getByRole('checkbox', { name: /^test/ }).check()];
            case 18:
                _e.sent();
                return [4 /*yield*/, checks.getByRole('button', { name: 'Run selected checks' }).click()];
            case 19:
                _e.sent();
                return [4 /*yield*/, (0, test_1.expect)(checks.getByRole('log', { name: 'Live output: test' }).last()).toContainText('CHECK FAILED')];
            case 20:
                _e.sent();
                return [4 /*yield*/, (0, test_1.expect)(mergeButton()).toBeDisabled()];
            case 21:
                _e.sent();
                return [4 /*yield*/, page.screenshot({ path: testInfo.outputPath('failed-check.png'), fullPage: true })];
            case 22:
                _e.sent();
                return [4 /*yield*/, (0, promises_1.rm)((0, node_path_1.join)(integration, '.check-fail'))];
            case 23:
                _e.sent();
                return [4 /*yield*/, check()];
            case 24:
                _e.sent();
                return [4 /*yield*/, merge()];
            case 25:
                _e.sent();
                _c = test_1.expect;
                return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(repo, 'a.txt'), 'utf8')];
            case 26:
                _c.apply(void 0, [_e.sent()]).toBe('combined result\n');
                _d = test_1.expect;
                return [4 /*yield*/, (0, promises_1.readFile)((0, node_path_1.join)(source, 'a.txt'), 'utf8')];
            case 27:
                _d.apply(void 0, [_e.sent()]).toBe('task version\n');
                return [2 /*return*/];
        }
    });
}); });
