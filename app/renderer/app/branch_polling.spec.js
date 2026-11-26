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
// @vitest-environment jsdom
var preact_1 = require("@testing-library/preact");
var vitest_1 = require("vitest");
var test_support_1 = require("../test_support");
var test_fixtures_1 = require("../features/branches/test_fixtures");
var branches_page_1 = require("../features/branches/presentation/pages/branches_page");
(0, vitest_1.afterEach)(function () { (0, preact_1.cleanup)(); vitest_1.vi.useRealTimers(); });
(0, vitest_1.it)('bounds reads with graph, review and checks open, refreshes final output and closes while checking', function () { return __awaiter(void 0, void 0, void 0, function () {
    var slow, graph, review, workspace, merge, _a, engine, fire, view, open, _b, _c, mergeCalls, reviewCalls;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                vitest_1.vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] });
                slow = function (initial) {
                    var answers = [];
                    var read = vitest_1.vi.fn(function () { return read.mock.calls.length === 1 ? Promise.resolve({ ok: true, data: initial }) : new Promise(function (resolve) { return answers.push(resolve); }); });
                    return { read: read, answers: answers };
                };
                graph = slow((0, test_fixtures_1.branchGraph)());
                review = slow((0, test_fixtures_1.branchReview)({ operation: (0, test_fixtures_1.mergeOperation)() }));
                workspace = (0, test_fixtures_1.mergeWorkspace)({ checksCurrent: false, availableChecks: [{ id: 'test', name: 'test', folder: '.', command: 'npm test' }], checks: [{ id: 'run', checkId: 'test', name: 'test', command: 'npm test', tree: (0, test_fixtures_1.mergeOperation)().tree, at: Date.now(), finished: null, owner: 1, status: 'running', exitCode: null, output: 'checking now', truncated: false }] });
                merge = slow(workspace);
                _a = (0, test_support_1.fakeEngine)({ readBranches: graph.read, readBranch: review.read, readMergeWorkspace: merge.read }), engine = _a.engine, fire = _a.fire;
                view = (0, test_support_1.projectView)('a-000001');
                if (view.kind !== 'readable')
                    throw new Error('Expected readable fixture');
                return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        (0, preact_1.render)(<branches_page_1.BranchesPage engine={engine} view={view} actions={{}} flow={undefined} onOpen={function () { }}/>);
                        return [2 /*return*/];
                    }); }); })];
            case 1:
                _d.sent();
                return [4 /*yield*/, preact_1.screen.findByRole('button', { name: 'Review work' })];
            case 2:
                open = _d.sent();
                return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        preact_1.fireEvent.click(open);
                        return [2 /*return*/];
                    }); }); })];
            case 3:
                _d.sent();
                _b = vitest_1.expect;
                return [4 /*yield*/, preact_1.screen.findByRole('log')];
            case 4:
                _b.apply(void 0, [_d.sent()]).toHaveProperty('textContent', 'checking now');
                return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var n; return __generator(this, function (_a) {
                        vitest_1.vi.advanceTimersByTime(5000);
                        for (n = 0; n < 30; n++)
                            fire();
                        return [2 /*return*/];
                    }); }); })];
            case 5:
                _d.sent();
                (0, vitest_1.expect)(graph.read).toHaveBeenCalledTimes(2); // The open review suspends the graph timer; events still refresh it.
                (0, vitest_1.expect)(review.read).toHaveBeenCalledTimes(2);
                (0, vitest_1.expect)(merge.read).toHaveBeenCalledTimes(2);
                // The read that started while running can finish before the final read.
                return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, merge.answers[0]({ ok: true, data: workspace })];
                    }); }); })];
            case 6:
                // The read that started while running can finish before the final read.
                _d.sent();
                return [4 /*yield*/, vitest_1.vi.waitFor(function () { return (0, vitest_1.expect)(merge.read).toHaveBeenCalledTimes(3); })];
            case 7:
                _d.sent();
                return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, merge.answers[1]({ ok: true, data: __assign(__assign({}, workspace), { checksCurrent: true, checks: [__assign(__assign({}, workspace.checks[0]), { status: 'succeeded', exitCode: 0, finished: Date.now(), output: 'final passed output' })] }) })];
                    }); }); })];
            case 8:
                _d.sent();
                _c = vitest_1.expect;
                return [4 /*yield*/, preact_1.screen.findByText('Passed')];
            case 9:
                _c.apply(void 0, [_d.sent()]).toBeTruthy();
                (0, vitest_1.expect)(preact_1.screen.getByRole('log')).toHaveProperty('textContent', 'final passed output');
                // Another in-progress read may land after closing; it must not reopen the sheet or start trailing work.
                return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        fire();
                        preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: 'Close' }));
                        return [2 /*return*/];
                    }); }); })];
            case 10:
                // Another in-progress read may land after closing; it must not reopen the sheet or start trailing work.
                _d.sent();
                (0, vitest_1.expect)(preact_1.screen.queryByRole('dialog')).toBeNull();
                mergeCalls = merge.read.mock.calls.length;
                reviewCalls = review.read.mock.calls.length;
                return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _i, _a, answer, _b, _c, answer; return __generator(this, function (_d) {
                        for (_i = 0, _a = review.answers; _i < _a.length; _i++) {
                            answer = _a[_i];
                            answer({ ok: true, data: (0, test_fixtures_1.branchReview)() });
                        }
                        for (_b = 0, _c = merge.answers.slice(2); _b < _c.length; _b++) {
                            answer = _c[_b];
                            answer({ ok: true, data: workspace });
                        }
                        vitest_1.vi.advanceTimersByTime(5000);
                        return [2 /*return*/];
                    }); }); })];
            case 11:
                _d.sent();
                (0, vitest_1.expect)(review.read).toHaveBeenCalledTimes(reviewCalls);
                (0, vitest_1.expect)(merge.read).toHaveBeenCalledTimes(mergeCalls);
                (0, vitest_1.expect)(engine.cancelMergeChecks).not.toHaveBeenCalled();
                return [2 /*return*/];
        }
    });
}); });
(0, vitest_1.it)('opens Free space from the page, holds the graph timer while it is open, and rereads the graph when it closes', function () { return __awaiter(void 0, void 0, void 0, function () {
    var engine, view, sheet;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                vitest_1.vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] });
                engine = (0, test_support_1.fakeEngine)({ readBranches: vitest_1.vi.fn(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, ({ ok: true, data: (0, test_fixtures_1.branchGraph)() })];
                    }); }); }) }).engine;
                view = (0, test_support_1.projectView)('a-000001');
                if (view.kind !== 'readable')
                    throw new Error('Expected readable fixture');
                return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        (0, preact_1.render)(<branches_page_1.BranchesPage engine={engine} view={view} actions={{}} flow={undefined} onOpen={function () { }}/>);
                        return [2 /*return*/];
                    }); }); })];
            case 1:
                _a.sent();
                return [4 /*yield*/, preact_1.screen.findByRole('button', { name: 'Review work' })];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        preact_1.fireEvent.click(preact_1.screen.getByRole('button', { name: 'Free space' }));
                        return [2 /*return*/];
                    }); }); })];
            case 3:
                _a.sent();
                return [4 /*yield*/, preact_1.screen.findByRole('dialog', { name: 'Free space' })];
            case 4:
                sheet = _a.sent();
                (0, vitest_1.expect)(engine.readFolderSpace).toHaveBeenCalledWith('a-000001');
                return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        vitest_1.vi.advanceTimersByTime(5000);
                        return [2 /*return*/];
                    }); }); })];
            case 5:
                _a.sent();
                (0, vitest_1.expect)(engine.readBranches).toHaveBeenCalledTimes(1);
                (0, vitest_1.expect)(engine.readFolderSpace).toHaveBeenCalledTimes(1);
                return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        preact_1.fireEvent.click((0, preact_1.within)(sheet).getByRole('button', { name: 'Close' }));
                        return [2 /*return*/];
                    }); }); })];
            case 6:
                _a.sent();
                (0, vitest_1.expect)(preact_1.screen.queryByRole('dialog')).toBeNull();
                return [4 /*yield*/, vitest_1.vi.waitFor(function () { return (0, vitest_1.expect)(engine.readBranches).toHaveBeenCalledTimes(2); })];
            case 7:
                _a.sent();
                return [4 /*yield*/, (0, preact_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        vitest_1.vi.advanceTimersByTime(1000);
                        return [2 /*return*/];
                    }); }); })];
            case 8:
                _a.sent();
                return [4 /*yield*/, vitest_1.vi.waitFor(function () { return (0, vitest_1.expect)(engine.readBranches).toHaveBeenCalledTimes(3); })];
            case 9:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
