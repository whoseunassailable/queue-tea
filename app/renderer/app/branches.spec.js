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
// @vitest-environment jsdom
var preact_1 = require("@testing-library/preact");
var vitest_1 = require("vitest");
var workspace_store_1 = require("../features/workspace/state_management/workspace_store");
var test_support_1 = require("../test_support");
var test_fixtures_1 = require("../features/branches/test_fixtures");
var branch_review_1 = require("../features/branches/presentation/widgets/branch_review");
var merge_review_1 = require("../features/branches/presentation/widgets/merge_review");
var en_1 = require("../l10n/en");
var app_1 = require("./app");
var KEY = 'a-000001';
var one = (0, test_support_1.activeQuest)({ id: 'one', title: 'Auto update', worktreePath: '/quests/one', baseBranch: 'main' });
var two = (0, test_support_1.activeQuest)({ id: 'two', title: 'Settings option', branch: 'task/settings', worktreePath: '/quests/two', baseBranch: 'main', codexSince: '2026-11-03T12:00:00Z' });
var view = (0, test_support_1.projectView)(KEY, { active: one, activeQuests: [one, two] });
var open = function () {
    var args_1 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args_1[_i] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (over) {
        var graph, _a, engine, fire, workspace;
        if (over === void 0) { over = {}; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    graph = (0, test_fixtures_1.branchGraph)();
                    graph.tasks[0].state = 'working';
                    graph.tasks.push(__assign(__assign({}, graph.tasks[0]), { id: two.id, title: two.title, branch: two.branch, state: 'unobserved' }));
                    _a = (0, test_support_1.fakeEngine)(__assign({ readProject: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: view })];
                        }); }); }, readBranches: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: graph })];
                        }); }); } }, over)), engine = _a.engine, fire = _a.fire;
                    workspace = (0, workspace_store_1.createWorkspace)(engine);
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    (0, preact_1.render)(<app_1.App workspace={workspace} engine={engine}/>);
                                    return [4 /*yield*/, workspace.start()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        }); }); })];
                case 1:
                    _b.sent();
                    return [2 /*return*/, { engine: engine, workspace: workspace, fire: fire }];
            }
        });
    });
};
var openReview = function () {
    var args_1 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args_1[_i] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (over) {
        var _a, engine, fire;
        if (over === void 0) { over = {}; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = (0, test_support_1.fakeEngine)(over), engine = _a.engine, fire = _a.fire;
                    return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            (0, preact_1.render)(<branch_review_1.BranchReview engine={engine} realm={KEY} id="one" onClose={function () { }}/>);
                            return [2 /*return*/];
                        }); }); })];
                case 1:
                    _b.sent();
                    return [2 /*return*/, { engine: engine, fire: fire }];
            }
        });
    });
};
var click = function (button) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.click(button); })];
}); }); };
(0, vitest_1.beforeEach)(function () { window.location.hash = '#/branches'; });
(0, vitest_1.afterEach)(preact_1.cleanup);
(0, vitest_1.it)('places an enabled close control in the dialog header', function () { return __awaiter(void 0, void 0, void 0, function () {
    var close, engine, dialog, header;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                close = vitest_1.vi.fn();
                engine = (0, test_support_1.fakeEngine)({ readBranch: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: true, data: (0, test_fixtures_1.branchReview)({ operation: (0, test_fixtures_1.mergeOperation)() }) })];
                    }); }); }, runMergeChecks: function () { return new Promise(function () { }); } }).engine;
                return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        (0, preact_1.render)(<branch_review_1.BranchReview engine={engine} realm={KEY} id="one" onClose={close}/>);
                        return [2 /*return*/];
                    }); }); })];
            case 1:
                _a.sent();
                return [4 /*yield*/, preact_1.screen.findByRole('dialog', { name: 'Review work' })];
            case 2:
                dialog = _a.sent();
                header = dialog.querySelector('.sheet-heading');
                (0, vitest_1.expect)(header).toBeTruthy();
                return [4 /*yield*/, click((0, preact_1.within)(header).getByRole('button', { name: 'Close' }))];
            case 3:
                _a.sent();
                (0, vitest_1.expect)(close).toHaveBeenCalledTimes(1);
                (0, vitest_1.expect)(engine.cancelMergeChecks).not.toHaveBeenCalled();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('draws real history and pulses only observed working tasks, while both terminals remain usable', function () { return __awaiter(void 0, void 0, void 0, function () {
    var engine, _a, working, unobserved, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, open()];
            case 1:
                engine = (_c.sent()).engine;
                _a = vitest_1.expect;
                return [4 /*yield*/, preact_1.screen.findByRole('img', { name: /actual commit parents/ })];
            case 2:
                _a.apply(void 0, [_c.sent()]).toBeTruthy();
                (0, vitest_1.expect)(preact_1.screen.getByText('2 in progress')).toBeTruthy();
                working = preact_1.screen.getByRole('article', { name: one.title });
                unobserved = preact_1.screen.getByRole('article', { name: two.title });
                (0, vitest_1.expect)(working.querySelector('.observed-working')).toBeTruthy();
                (0, vitest_1.expect)(unobserved.querySelector('.observed-working')).toBeNull();
                return [4 /*yield*/, click((0, preact_1.within)(unobserved).getByRole('button', { name: 'Show Codex' }))];
            case 3:
                _c.sent();
                (0, vitest_1.expect)(engine.openClaude).toHaveBeenCalledWith(KEY, 'two');
                return [4 /*yield*/, click((0, preact_1.within)(working).getByRole('button', { name: 'Review work' }))];
            case 4:
                _c.sent();
                _b = vitest_1.expect;
                return [4 /*yield*/, preact_1.screen.findByRole('dialog', { name: 'Review work' })];
            case 5:
                _b.apply(void 0, [_c.sent()]).toBeTruthy();
                (0, vitest_1.expect)(engine.completeMerge).not.toHaveBeenCalled();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('shows loading, failure and retry without issuing a Git mutation', function () { return __awaiter(void 0, void 0, void 0, function () {
    var answer, engine, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, openReview({ readBranch: function () { return new Promise(function (resolve) { answer = resolve; }); } })];
            case 1:
                engine = (_b.sent()).engine;
                (0, vitest_1.expect)(preact_1.screen.getByText('Reading changes and checking both branches…')).toBeTruthy();
                return [4 /*yield*/, (0, preact_1.act)(function () { return answer({ ok: false, error: { message: 'The branch could not be read. Try again.' } }); })];
            case 2:
                _b.sent();
                _a = vitest_1.expect;
                return [4 /*yield*/, preact_1.screen.findByText('The branch could not be read. Try again.')];
            case 3:
                _a.apply(void 0, [_b.sent()]).toBeTruthy();
                (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: 'Try again' })).toBeTruthy();
                (0, vitest_1.expect)(engine.prepareMerge).not.toHaveBeenCalled();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('requires explicit idle confirmation to prepare, then a separate approval to merge', function () { return __awaiter(void 0, void 0, void 0, function () {
    var engine, prepare, _a, merge, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, openReview()];
            case 1:
                engine = (_d.sent()).engine;
                return [4 /*yield*/, preact_1.screen.findByRole('button', { name: 'Prepare merge for review' })];
            case 2:
                prepare = _d.sent();
                (0, vitest_1.expect)(prepare.disabled).toBe(true);
                _a = click;
                return [4 /*yield*/, preact_1.screen.findByRole('checkbox', { name: /I have stopped/ })];
            case 3: return [4 /*yield*/, _a.apply(void 0, [_d.sent()])];
            case 4:
                _d.sent();
                return [4 /*yield*/, click(prepare)];
            case 5:
                _d.sent();
                (0, vitest_1.expect)(engine.prepareMerge).toHaveBeenCalledWith(KEY, vitest_1.expect.objectContaining({ taskId: 'one', target: 'main', idleConfirmed: true }));
                return [4 /*yield*/, preact_1.screen.findByRole('button', { name: 'Merge task/first into main' })];
            case 6:
                merge = _d.sent();
                (0, vitest_1.expect)(merge.disabled).toBe(true);
                (0, vitest_1.expect)(engine.completeMerge).not.toHaveBeenCalled();
                _b = click;
                return [4 /*yield*/, preact_1.screen.findByRole('button', { name: 'Open integration folder' })];
            case 7: return [4 /*yield*/, _b.apply(void 0, [_d.sent()])];
            case 8:
                _d.sent();
                (0, vitest_1.expect)(engine.openMergeFolder).toHaveBeenCalledWith(KEY, vitest_1.expect.any(String));
                _c = click;
                return [4 /*yield*/, preact_1.screen.findByRole('checkbox', { name: /I have stopped/ })];
            case 9: return [4 /*yield*/, _c.apply(void 0, [_d.sent()])];
            case 10:
                _d.sent();
                return [4 /*yield*/, click(merge)];
            case 11:
                _d.sent();
                (0, vitest_1.expect)(engine.completeMerge).toHaveBeenCalledWith(KEY, vitest_1.expect.objectContaining({ approval: 'approval', message: 'Merge task/first into main' }));
                (0, vitest_1.expect)(engine.pushMerge).not.toHaveBeenCalled();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('shows stale approval failures and retains the prepared merge for review', function () { return __awaiter(void 0, void 0, void 0, function () {
    var engine, _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                engine = (0, test_support_1.fakeEngine)({ completeMerge: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: false, error: { message: 'The branches changed. Review again.' } })];
                    }); }); }) }).engine;
                return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        (0, preact_1.render)(<merge_review_1.MergeReview engine={engine} realm={KEY} id="operation" remotes={[]} onChanged={function () { }}/>);
                        return [2 /*return*/];
                    }); }); })];
            case 1:
                _d.sent();
                _a = click;
                return [4 /*yield*/, preact_1.screen.findByRole('checkbox', { name: /I have stopped/ })];
            case 2: return [4 /*yield*/, _a.apply(void 0, [_d.sent()])];
            case 3:
                _d.sent();
                _b = click;
                return [4 /*yield*/, preact_1.screen.findByRole('button', { name: 'Merge task/first into main' })];
            case 4: return [4 /*yield*/, _b.apply(void 0, [_d.sent()])];
            case 5:
                _d.sent();
                _c = vitest_1.expect;
                return [4 /*yield*/, preact_1.screen.findByRole('alert')];
            case 6:
                _c.apply(void 0, [_d.sent()]).toHaveProperty('textContent', 'The branches changed. Review again.');
                (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: 'Refresh branches' })).toBeTruthy();
                (0, vitest_1.expect)(engine.pushMerge).not.toHaveBeenCalled();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)("lists the in-app check runner's latest result for each check, without its output", function () { return __awaiter(void 0, void 0, void 0, function () {
    var run, _a, panel;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                run = { id: 'run', checkId: 'test', name: 'test', command: 'npm run test — vitest run', tree: (0, test_fixtures_1.mergeOperation)().tree, at: 1, finished: 2, owner: 1, status: 'failed', output: '1 test failed', exitCode: 1, truncated: false };
                return [4 /*yield*/, openReview({ readBranch: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: (0, test_fixtures_1.branchReview)({ checks: [run] }) })];
                        }); }); } })];
            case 1:
                _b.sent();
                _a = click;
                return [4 /*yield*/, preact_1.screen.findByRole('tab', { name: 'Checks' })];
            case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
            case 3:
                _b.sent();
                panel = preact_1.screen.getByRole('tabpanel', { name: 'Checks' });
                (0, vitest_1.expect)((0, preact_1.within)(panel).getByText('npm run test — vitest run')).toBeTruthy();
                (0, vitest_1.expect)((0, preact_1.within)(panel).getByText('Failed')).toBeTruthy();
                (0, vitest_1.expect)((0, preact_1.within)(panel).getByText(en_1.t.branches.exitCode(1))).toBeTruthy();
                (0, vitest_1.expect)((0, preact_1.within)(panel).queryByText('1 test failed')).toBeNull();
                (0, vitest_1.expect)((0, preact_1.within)(panel).getByText(en_1.t.branches.checkHint)).toBeTruthy();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('says no checks were observed when the check runner has none, and has no step log', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, openReview({ readBranch: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: true, data: (0, test_fixtures_1.branchReview)({ checks: [] }) })];
                    }); }); } })];
            case 1:
                _b.sent();
                _a = click;
                return [4 /*yield*/, preact_1.screen.findByRole('tab', { name: 'Checks' })];
            case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
            case 3:
                _b.sent();
                (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.branches.noChecks)).toBeTruthy();
                (0, vitest_1.expect)(preact_1.screen.queryByRole('tab', { name: 'Activity' })).toBeNull();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)("shows the step the task is on in the review's overview", function () { return __awaiter(void 0, void 0, void 0, function () {
    var step, line;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                step = { id: 'run', at: '2026-11-04T12:00:00Z', finished: null, kind: 'test', status: 'running', subject: 'npm test' };
                return [4 /*yield*/, openReview({ readBranch: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: true, data: (0, test_fixtures_1.branchReview)({ state: 'working', step: step }) })];
                        }); }); } })];
            case 1:
                _a.sent();
                return [4 /*yield*/, preact_1.screen.findByLabelText(en_1.t.activity.stepLabel)];
            case 2:
                line = _a.sent();
                (0, vitest_1.expect)(line.textContent).toContain(en_1.t.activity.now);
                (0, vitest_1.expect)(line.textContent).toContain(en_1.t.activity.doing.test);
                (0, vitest_1.expect)(line.textContent).toContain('npm test');
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('shows dependency setup instructions, keeps merging blocked, and lets the user retry checks', function () { return __awaiter(void 0, void 0, void 0, function () {
    var workspace, engine, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                workspace = (0, test_fixtures_1.mergeWorkspace)({ availableChecks: [{ id: 'build', name: 'docs: build', folder: 'docs', command: 'npm run build' }], checksCurrent: false,
                    checks: [{ id: 'setup', checkId: 'build', name: 'docs: build', command: 'npm run build', tree: (0, test_fixtures_1.mergeOperation)().tree, at: 1, finished: 2, owner: 1, status: 'setupRequired', output: 'Package folder: /integration/docs\nnpm ci --offline', exitCode: null, truncated: false }] });
                engine = (0, test_support_1.fakeEngine)({ readMergeWorkspace: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: true, data: workspace })];
                    }); }); } }).engine;
                return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        (0, preact_1.render)(<merge_review_1.MergeReview engine={engine} realm={KEY} id="operation" remotes={[]} onChanged={function () { }}/>);
                        return [2 /*return*/];
                    }); }); })];
            case 1:
                _b.sent();
                _a = vitest_1.expect;
                return [4 /*yield*/, preact_1.screen.findByText('Dependency setup required')];
            case 2:
                _a.apply(void 0, [_b.sent()]).toBeTruthy();
                (0, vitest_1.expect)(preact_1.screen.getByRole('log', { name: 'Live output: docs: build' }).textContent).toContain('npm ci --offline');
                return [4 /*yield*/, click(preact_1.screen.getByRole('checkbox', { name: /I have stopped/ }))];
            case 3:
                _b.sent();
                (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: 'Merge task/first into main' }).disabled).toBe(true);
                return [4 /*yield*/, click(preact_1.screen.getByRole('checkbox', { name: /docs: build/ }))];
            case 4:
                _b.sent();
                return [4 /*yield*/, click(preact_1.screen.getByRole('button', { name: 'Run selected checks' }))];
            case 5:
                _b.sent();
                (0, vitest_1.expect)(engine.runMergeChecks).toHaveBeenCalledWith(KEY, { operationId: workspace.operation.id, approval: workspace.approval, checkIds: ['build'] });
                (0, vitest_1.expect)(engine.completeMerge).not.toHaveBeenCalled();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('selects only user-chosen files and validates the commit message', function () { return __awaiter(void 0, void 0, void 0, function () {
    var engine, _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, openReview({ readBranch: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: true, data: (0, test_fixtures_1.branchReview)({ files: [{ path: 'a.ts', previous: null, status: ' M' }, { path: 'b.ts', previous: null, status: '??' }] }) })];
                    }); }); } })];
            case 1:
                engine = (_e.sent()).engine;
                _a = click;
                return [4 /*yield*/, preact_1.screen.findByRole('tab', { name: 'Changes' })];
            case 2: return [4 /*yield*/, _a.apply(void 0, [_e.sent()])];
            case 3:
                _e.sent();
                _b = click;
                return [4 /*yield*/, preact_1.screen.findByRole('checkbox', { name: /a.ts/ })];
            case 4: return [4 /*yield*/, _b.apply(void 0, [_e.sent()])];
            case 5:
                _e.sent();
                return [4 /*yield*/, click(preact_1.screen.getAllByRole('checkbox', { name: /I have stopped/ })[0])];
            case 6:
                _e.sent();
                _c = click;
                return [4 /*yield*/, preact_1.screen.findByRole('button', { name: 'Commit selected files' })];
            case 7: return [4 /*yield*/, _c.apply(void 0, [_e.sent()])];
            case 8:
                _e.sent();
                (0, vitest_1.expect)(preact_1.screen.getByText('Commit message is required.')).toBeTruthy();
                (0, vitest_1.expect)(engine.commitBranchFiles).not.toHaveBeenCalled();
                return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.input(preact_1.screen.getByLabelText('Commit message *'), { target: { value: 'Review selected work' } }); })];
            case 9:
                _e.sent();
                _d = click;
                return [4 /*yield*/, preact_1.screen.findByRole('button', { name: 'Commit selected files' })];
            case 10: return [4 /*yield*/, _d.apply(void 0, [_e.sent()])];
            case 11:
                _e.sent();
                (0, vitest_1.expect)(engine.commitBranchFiles).toHaveBeenCalledWith(KEY, vitest_1.expect.objectContaining({ files: ['a.ts'], message: 'Review selected work' }));
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('keeps the review usable and the ticked files while it rereads in the background', function () { return __awaiter(void 0, void 0, void 0, function () {
    var files, answer, reads, fire, _a, _b, box;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                files = [{ path: 'a.ts', previous: null, status: ' M' }, { path: 'b.ts', previous: null, status: '??' }];
                answer = null;
                reads = 0;
                return [4 /*yield*/, openReview({ readBranch: function () { return (++reads === 1 ? Promise.resolve({ ok: true, data: (0, test_fixtures_1.branchReview)({ files: files }) }) : new Promise(function (resolve) { answer = resolve; })); } })];
            case 1:
                fire = (_c.sent()).fire;
                _a = click;
                return [4 /*yield*/, preact_1.screen.findByRole('tab', { name: 'Changes' })];
            case 2: return [4 /*yield*/, _a.apply(void 0, [_c.sent()])];
            case 3:
                _c.sent();
                _b = click;
                return [4 /*yield*/, preact_1.screen.findByRole('checkbox', { name: /a.ts/ })];
            case 4: return [4 /*yield*/, _b.apply(void 0, [_c.sent()])];
            case 5:
                _c.sent();
                return [4 /*yield*/, (0, preact_1.act)(function () { return fire(); })];
            case 6:
                _c.sent();
                (0, vitest_1.expect)(answer).not.toBeNull();
                box = preact_1.screen.getByRole('checkbox', { name: /b.ts/ });
                (0, vitest_1.expect)(box.disabled).toBe(false);
                (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: 'Commit selected files' }).disabled).toBe(true); // only for the idle tick
                // A session writing in the worktree changes the fingerprint; what's ticked stays.
                return [4 /*yield*/, (0, preact_1.act)(function () { return answer({ ok: true, data: (0, test_fixtures_1.branchReview)({ files: files, fingerprint: 'f'.repeat(64) }) }); })];
            case 7:
                // A session writing in the worktree changes the fingerprint; what's ticked stays.
                _c.sent();
                (0, vitest_1.expect)(preact_1.screen.getByRole('checkbox', { name: /a.ts/ }).checked).toBe(true);
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('ticks every changed file at once and clears them again', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, openReview({ readBranch: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: true, data: (0, test_fixtures_1.branchReview)({ files: [{ path: 'a.ts', previous: null, status: ' M' }, { path: 'b.ts', previous: null, status: '??' }] }) })];
                    }); }); } })];
            case 1:
                _c.sent();
                _a = click;
                return [4 /*yield*/, preact_1.screen.findByRole('tab', { name: 'Changes' })];
            case 2: return [4 /*yield*/, _a.apply(void 0, [_c.sent()])];
            case 3:
                _c.sent();
                _b = click;
                return [4 /*yield*/, preact_1.screen.findByRole('checkbox', { name: 'Select all files' })];
            case 4: return [4 /*yield*/, _b.apply(void 0, [_c.sent()])];
            case 5:
                _c.sent();
                (0, vitest_1.expect)(preact_1.screen.getAllByRole('checkbox', { name: /\.ts/ }).every(function (box) { return box.checked; })).toBe(true);
                return [4 /*yield*/, click(preact_1.screen.getByRole('checkbox', { name: 'Select all files' }))];
            case 6:
                _c.sent();
                (0, vitest_1.expect)(preact_1.screen.getAllByRole('checkbox', { name: /\.ts/ }).some(function (box) { return box.checked; })).toBe(false);
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('resolves conflicts with branch-labelled sides and rejects remaining markers', function () { return __awaiter(void 0, void 0, void 0, function () {
    var engine, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                engine = (0, test_support_1.fakeEngine)({ readMergeWorkspace: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: true, data: (0, test_fixtures_1.mergeWorkspace)({ operation: (0, test_fixtures_1.mergeOperation)({ stage: 'conflicts' }), approval: null, conflicts: [{ path: 'a.ts', base: 'base', target: 'main', source: 'feature', result: '<<<<<<< HEAD\nmain\n=======\nfeature\n>>>>>>> task', editable: true }] }) })];
                    }); }); } }).engine;
                return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        (0, preact_1.render)(<merge_review_1.MergeReview engine={engine} realm={KEY} id="operation" remotes={[]} onChanged={function () { }}/>);
                        return [2 /*return*/];
                    }); }); })];
            case 1:
                _c.sent();
                _a = click;
                return [4 /*yield*/, preact_1.screen.findByRole('button', { name: 'Save resolved file' })];
            case 2: return [4 /*yield*/, _a.apply(void 0, [_c.sent()])];
            case 3:
                _c.sent();
                (0, vitest_1.expect)(preact_1.screen.getByText('Remove all conflict markers before saving.')).toBeTruthy();
                (0, vitest_1.expect)(engine.resolveMergeFile).not.toHaveBeenCalled();
                return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.input(preact_1.screen.getByLabelText('Resolved result'), { target: { value: 'combined result' } }); })];
            case 4:
                _c.sent();
                _b = click;
                return [4 /*yield*/, preact_1.screen.findByRole('button', { name: 'Save resolved file' })];
            case 5: return [4 /*yield*/, _b.apply(void 0, [_c.sent()])];
            case 6:
                _c.sent();
                (0, vitest_1.expect)(engine.resolveMergeFile).toHaveBeenCalledWith(KEY, vitest_1.expect.objectContaining({ path: 'a.ts', choice: 'edited', text: 'combined result' }));
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)('a helper on a merge with conflicts', function () {
    var OP = (0, test_fixtures_1.mergeOperation)().id;
    var conflicted = function () {
        var args_1 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args_1[_i] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (over) {
            var conflicts, _a, engine, tellHelpers;
            if (over === void 0) { over = {}; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        conflicts = [{ path: 'a.ts', base: 'base', target: 'main', source: 'feature', result: null, editable: true }];
                        _a = (0, test_support_1.fakeEngine)(__assign({ readMergeWorkspace: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, ({ ok: true, data: (0, test_fixtures_1.mergeWorkspace)({ operation: (0, test_fixtures_1.mergeOperation)({ stage: 'conflicts' }), approval: null, conflicts: conflicts }) })];
                            }); }); } }, over)), engine = _a.engine, tellHelpers = _a.tellHelpers;
                        return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                (0, preact_1.render)(<merge_review_1.MergeReview engine={engine} realm={KEY} id={OP} remotes={[]} onChanged={function () { }}/>);
                                return [2 /*return*/];
                            }); }); })];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, preact_1.screen.findByRole('region', { name: 'Helpers for this merge' })];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, { engine: engine, tellHelpers: tellHelpers }];
                }
            });
        });
    };
    var zone = function () { return document.querySelector('.merge-review'); };
    var carrying = function (id) { return ({ types: ['application/x-queue-tea-helper'], getData: function (type) { return (type === 'application/x-queue-tea-helper' ? id : ''); } }); };
    (0, vitest_1.it)('resolves the conflicts with the helper dropped on it', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, conflicted()];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.dragOver(zone(), { dataTransfer: carrying('commit-chai-n') }); })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(zone().classList.contains('dropping')).toBe(true);
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.drop(zone(), { dataTransfer: carrying('commit-chai-n') }); })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(engine.concileMerge).toHaveBeenCalledWith(KEY, 'commit-chai-n', OP);
                    (0, vitest_1.expect)(zone().classList.contains('dropping')).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('takes a helper pressed from the keyboard, and ignores a drop that carries no helper', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, conflicted()];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.drop(zone(), { dataTransfer: carrying('someone') }); })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(engine.concileMerge).not.toHaveBeenCalled();
                    return [4 /*yield*/, click(preact_1.screen.getByRole('button', { name: 'Send Tea-DD to resolve these conflicts' }))];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(engine.concileMerge).toHaveBeenCalledWith(KEY, 'tea-dd', OP);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('holds the merge while the helper works, then shows what it said', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, engine, tellHelpers;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, conflicted()];
                case 1:
                    _a = _b.sent(), engine = _a.engine, tellHelpers = _a.tellHelpers;
                    return [4 /*yield*/, (0, preact_1.act)(function () { return tellHelpers([(0, test_support_1.helperJob)({ helper: 'chai-pter', merge: OP, doing: { kind: 'editing', target: 'a.ts' } }), (0, test_support_1.helperJob)({ helper: 'tea-dd', status: 'working' })]); })];
                case 2:
                    _b.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText(/Chai-pter: Editing a.ts/)).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: 'Use destination version' }).disabled).toBe(true);
                    (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: 'Send Commit Chai-n to resolve these conflicts' }).disabled).toBe(true);
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.drop(zone(), { dataTransfer: carrying('commit-chai-n') }); })];
                case 3:
                    _b.sent();
                    (0, vitest_1.expect)(engine.concileMerge).not.toHaveBeenCalled();
                    return [4 /*yield*/, click(preact_1.screen.getByRole('button', { name: 'Stop' }))];
                case 4:
                    _b.sent();
                    (0, vitest_1.expect)(engine.stopHelper).toHaveBeenCalledWith('chai-pter');
                    return [4 /*yield*/, (0, preact_1.act)(function () { return tellHelpers([(0, test_support_1.helperJob)({ helper: 'chai-pter', merge: OP, status: 'done', reply: 'Kept both constants.' })]); })];
                case 5:
                    _b.sent();
                    (0, vitest_1.expect)(preact_1.screen.getByText('Kept both constants.')).toBeTruthy();
                    (0, vitest_1.expect)(preact_1.screen.getByRole('button', { name: 'Use destination version' }).disabled).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('says why a helper could not be sent', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, conflicted({ concileMerge: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, ({ ok: false, error: { message: 'This merge has no conflicts left to resolve.' } })];
                        }); }); } })];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, click(preact_1.screen.getByRole('button', { name: 'Send Tea-DD to resolve these conflicts' }))];
                case 2:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, preact_1.screen.findByRole('alert')];
                case 3:
                    _a.apply(void 0, [(_b.sent()).textContent]).toBe('This merge has no conflicts left to resolve.');
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.it)('does not contact a remote until requested and keeps the local merge after push failure', function () { return __awaiter(void 0, void 0, void 0, function () {
    var engine, _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                engine = (0, test_support_1.fakeEngine)({ readMergeWorkspace: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: true, data: (0, test_fixtures_1.mergeWorkspace)({ operation: (0, test_fixtures_1.mergeOperation)({ stage: 'merged', commit: test_fixtures_1.MERGE }), approval: null }) })];
                    }); }); } }).engine;
                return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        (0, preact_1.render)(<merge_review_1.MergeReview engine={engine} realm={KEY} id="operation" remotes={['origin']} onChanged={function () { }}/>);
                        return [2 /*return*/];
                    }); }); })];
            case 1:
                _d.sent();
                _a = vitest_1.expect;
                return [4 /*yield*/, preact_1.screen.findByText(/Merged locally into main/)];
            case 2:
                _a.apply(void 0, [_d.sent()]).toBeTruthy();
                (0, vitest_1.expect)(engine.readPush).not.toHaveBeenCalled();
                _b = click;
                return [4 /*yield*/, preact_1.screen.findByRole('button', { name: 'Check remote for push' })];
            case 3: return [4 /*yield*/, _b.apply(void 0, [_d.sent()])];
            case 4:
                _d.sent();
                (0, vitest_1.expect)(engine.readPush).toHaveBeenCalledWith(KEY, vitest_1.expect.any(String), 'origin');
                (0, vitest_1.expect)(preact_1.screen.getByText('Remote unavailable.')).toBeTruthy();
                _c = vitest_1.expect;
                return [4 /*yield*/, preact_1.screen.findByText(/Merged locally into main/)];
            case 5:
                _c.apply(void 0, [_d.sent()]).toBeTruthy();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('keeps both active cards usable on Home', function () { return __awaiter(void 0, void 0, void 0, function () {
    var engine, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                window.location.hash = '#/home';
                return [4 /*yield*/, open()];
            case 1:
                engine = (_b.sent()).engine;
                (0, vitest_1.expect)(preact_1.screen.getByRole('heading', { name: one.title })).toBeTruthy();
                (0, vitest_1.expect)(preact_1.screen.getByRole('heading', { name: two.title })).toBeTruthy();
                _a = click;
                return [4 /*yield*/, preact_1.screen.findByRole('button', { name: 'Show Codex' })];
            case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
            case 3:
                _b.sent();
                (0, vitest_1.expect)(engine.openClaude).toHaveBeenCalledWith(KEY, 'two');
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.describe)('Claude\'s proposed commit in the review', function () {
    var FILES = [{ path: 'a.ts', previous: null, status: ' M' }, { path: 'b.ts', previous: null, status: '??' }, { path: 'c.ts', previous: null, status: ' M' }];
    var FIRST = { message: 'fixed the retry button', files: ['a.ts', 'c.ts'], head: test_fixtures_1.SOURCE, at: '2026-11-20T09:00:00+01:00' };
    var NEWER = { message: 'fixed the retry button and its test', files: ['b.ts'], head: test_fixtures_1.SOURCE, at: '2026-11-20T09:05:00+01:00' };
    // Preact runs the form's effects after the next frame (35 ms at most in jsdom).
    var painted = function () { return (0, preact_1.act)(function () { return new Promise(function (resolve) { return setTimeout(resolve, 50); }); }); };
    var messageBox = function () { return preact_1.screen.getByLabelText(en_1.t.branches.commitMessage); };
    var ticked = function () { return FILES.map(function (f) { return f.path; }).filter(function (path) { return preact_1.screen.getByRole('checkbox', { name: new RegExp(path.replace('.', '\\.')) }).checked; }); };
    var reviewing = function (first) { return __awaiter(void 0, void 0, void 0, function () {
        var review, readBranch, opened, _a, reread;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    review = (0, test_fixtures_1.branchReview)(__assign({ files: FILES }, first));
                    readBranch = vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: true, data: review })];
                    }); }); });
                    return [4 /*yield*/, openReview({ readBranch: readBranch })];
                case 1:
                    opened = _b.sent();
                    _a = click;
                    return [4 /*yield*/, preact_1.screen.findByRole('tab', { name: en_1.t.branches.tabs.changes })];
                case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])
                    // A record change makes the review read again, now with `next`.
                ];
                case 3:
                    _b.sent();
                    reread = function (next) { return __awaiter(void 0, void 0, void 0, function () {
                        var reads;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    review = (0, test_fixtures_1.branchReview)(__assign({ files: FILES }, next));
                                    reads = readBranch.mock.calls.length;
                                    return [4 /*yield*/, (0, preact_1.act)(function () { return opened.fire(); })];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(readBranch.mock.calls.length).toBeGreaterThan(reads); })];
                                case 2:
                                    _a.sent();
                                    return [4 /*yield*/, painted()];
                                case 3:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    return [2 /*return*/, __assign(__assign({}, opened), { reread: reread })];
            }
        });
    }); };
    (0, vitest_1.it)('fills the commit message, ticks only the proposed files and says Claude proposed them; nothing is committed until Commit is pressed', function () { return __awaiter(void 0, void 0, void 0, function () {
        var engine;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, reviewing({ proposal: FIRST })];
                case 1:
                    engine = (_a.sent()).engine;
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(messageBox().value).toBe(FIRST.message); })];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(ticked()).toEqual(['a.ts', 'c.ts']);
                    (0, vitest_1.expect)(preact_1.screen.getByText(en_1.t.branches.proposed)).toBeTruthy();
                    (0, vitest_1.expect)(engine.commitBranchFiles).not.toHaveBeenCalled();
                    return [4 /*yield*/, click(preact_1.screen.getAllByRole('checkbox', { name: en_1.t.branches.idle })[0])];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, click(preact_1.screen.getByRole('button', { name: en_1.t.branches.commitSelected }))];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(engine.commitBranchFiles).toHaveBeenCalledWith(KEY, vitest_1.expect.objectContaining({ files: ['a.ts', 'c.ts'], message: FIRST.message }));
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a newer proposal replaces a message Rohan has not edited, and its files', function () { return __awaiter(void 0, void 0, void 0, function () {
        var reread;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, reviewing({ proposal: FIRST })];
                case 1:
                    reread = (_a.sent()).reread;
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(messageBox().value).toBe(FIRST.message); })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, reread({ proposal: NEWER })];
                case 3:
                    _a.sent();
                    (0, vitest_1.expect)(messageBox().value).toBe(NEWER.message);
                    (0, vitest_1.expect)(ticked()).toEqual(['b.ts']);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a newer proposal leaves a message Rohan has edited, and the files ticked', function () { return __awaiter(void 0, void 0, void 0, function () {
        var reread;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, reviewing({ proposal: FIRST })];
                case 1:
                    reread = (_a.sent()).reread;
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(messageBox().value).toBe(FIRST.message); })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.input(messageBox(), { target: { value: 'fixed the retry button, in my words' } }); })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, reread({ proposal: NEWER })];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(messageBox().value).toBe('fixed the retry button, in my words');
                    (0, vitest_1.expect)(ticked()).toEqual(['a.ts', 'c.ts']);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('a newer proposal fills a message Rohan has emptied', function () { return __awaiter(void 0, void 0, void 0, function () {
        var reread;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, reviewing({ proposal: FIRST })];
                case 1:
                    reread = (_a.sent()).reread;
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(messageBox().value).toBe(FIRST.message); })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, preact_1.act)(function () { return void preact_1.fireEvent.input(messageBox(), { target: { value: '' } }); })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, reread({ proposal: NEWER })];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(messageBox().value).toBe(NEWER.message);
                    (0, vitest_1.expect)(ticked()).toEqual(['b.ts']);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)('the same proposal read again leaves the files Rohan unticked', function () { return __awaiter(void 0, void 0, void 0, function () {
        var reread;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, reviewing({ proposal: FIRST })];
                case 1:
                    reread = (_a.sent()).reread;
                    return [4 /*yield*/, (0, preact_1.waitFor)(function () { return (0, vitest_1.expect)(messageBox().value).toBe(FIRST.message); })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, click(preact_1.screen.getByRole('checkbox', { name: /c\.ts/ }))];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, reread({ proposal: __assign({}, FIRST) })];
                case 4:
                    _a.sent();
                    (0, vitest_1.expect)(ticked()).toEqual(['a.ts']);
                    (0, vitest_1.expect)(messageBox().value).toBe(FIRST.message);
                    return [2 /*return*/];
            }
        });
    }); });
    vitest_1.it.each([
        ['no proposal', {}],
        ['a proposal of null', { proposal: null }],
    ])('with %s, nothing is filled in, ticked or said', function (_, over) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, reviewing(over)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, painted()];
                case 2:
                    _a.sent();
                    (0, vitest_1.expect)(messageBox().value).toBe('');
                    (0, vitest_1.expect)(ticked()).toEqual([]);
                    (0, vitest_1.expect)(preact_1.screen.queryByText(en_1.t.branches.proposed)).toBeNull();
                    return [2 /*return*/];
            }
        });
    }); });
});
